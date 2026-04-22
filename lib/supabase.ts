import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to get user from request (for API routes)
export async function getUserFromRequest(req: Request): Promise<{
  userId: string | null;
  token: string | null;
  error: string | null;
}> {
  if (!supabase) {
    return { userId: null, token: null, error: "Database not configured" };
  }

  // Try Authorization header first
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || "";

  // Try cookies
  let cookieToken = "";
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.includes("auth-token")) {
      const val = cookie.split("=").slice(1).join("=");
      try {
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed?.access_token) {
          cookieToken = parsed.access_token;
        } else if (Array.isArray(parsed) && parsed[0]) {
          cookieToken = parsed[0];
        }
      } catch {
        cookieToken = val;
      }
    }
  }

  const finalToken = token || cookieToken;

  if (!finalToken) {
    return { userId: null, token: null, error: "Unauthorized" };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(finalToken);

  if (error || !user) {
    return { userId: null, token: null, error: "Unauthorized" };
  }

  return { userId: user.id, token: finalToken, error: null };
}

// Helper to get user API keys from DB
export async function getUserApiKeys(
  userId: string,
  supabaseClient: any = supabase,
): Promise<{ gemini_api_key: string | null; deapi_api_key: string | null }> {
  if (!supabaseClient) return { gemini_api_key: null, deapi_api_key: null };

  const { data } = await supabaseClient
    .from("user_settings")
    .select("gemini_api_key, deapi_api_key")
    .eq("user_id", userId)
    .single();

  return {
    gemini_api_key: data?.gemini_api_key || null,
    deapi_api_key: data?.deapi_api_key || null,
  };
}

export function getAuthSupabase(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    },
  );
}

export interface HistoryRecord {
  id: string;
  created_at: string;
  product_image: string;
  product_info: string;
  result: any;
  generated_images?: Record<number, string>;
  user_id: string;
}
