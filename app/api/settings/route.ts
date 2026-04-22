import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Get user API keys
export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    // Get user from cookie/session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token || (await getTokenFromCookie(req)));

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token || (await getTokenFromCookie(req))}` },
        },
      }
    );

    const { data, error } = await authSupabase
      .from("user_settings")
      .select("gemini_api_key, deapi_api_key")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      throw error;
    }

    return NextResponse.json({ data: data || {} });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// Save user API keys
export async function POST(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token || (await getTokenFromCookie(req)));

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const finalToken = token || (await getTokenFromCookie(req));
    const authSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${finalToken}` },
        },
      }
    );

    const body = await req.json();
    const { gemini_api_key, deapi_api_key } = body;

    const updateData: any = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (gemini_api_key !== undefined)
      updateData.gemini_api_key = gemini_api_key;
    if (deapi_api_key !== undefined) updateData.deapi_api_key = deapi_api_key;

    const { data, error } = await authSupabase
      .from("user_settings")
      .upsert(updateData, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { 
        error: "Failed to save settings",
        details: error.message || "Unknown error"
      },
      { status: 500 },
    );
  }
}

async function getTokenFromCookie(req: NextRequest): Promise<string> {
  // Try to get the token from cookies (Supabase stores it in sb-*-auth-token)
  const cookies = req.cookies;
  for (const [name, cookie] of cookies) {
    if (name.includes("auth-token")) {
      try {
        const parsed = JSON.parse(cookie.value);
        if (parsed?.access_token) return parsed.access_token;
        if (Array.isArray(parsed) && parsed[0]) return parsed[0];
      } catch {
        return cookie.value;
      }
    }
  }
  return "";
}
