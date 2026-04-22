import { getUserFromRequest, getUserApiKeys, getAuthSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

interface GeneratePosterRequest {
  prompt?: string;
  caption?: string;
  hashtags?: string[];
  width?: number;
  height?: number;
  steps?: number;
}

interface WikipediaSearchResult {
  title: string;
}

interface WikipediaSearchResponse {
  query?: {
    search?: WikipediaSearchResult[];
  };
}

interface WikipediaSummaryResponse {
  extract?: string;
}

interface WebReference {
  title: string;
  extract: string;
  url: string;
}

interface DeapiStatusResult {
  status?: string;
  result_url?: string;
  preview?: string;
}

interface DeapiStatusResponse {
  data?: DeapiStatusResult;
}

type ProductKind = "beverage" | "food" | "unknown";

interface ProductSignal {
  name: string;
  kind: ProductKind;
  confidence: "high" | "medium" | "low";
}

interface DesignDirection {
  name: string;
  palette: string;
  layout: string;
  typography: string;
  accents: string;
}

const BEVERAGE_KEYWORDS = [
  "es teh",
  "teh",
  "minuman",
  "kopi",
  "jus",
  "sirup",
  "boba",
  "smoothie",
  "milkshake",
  "soda",
  "latte",
  "cappuccino",
];

const FOOD_KEYWORDS = [
  "mie",
  "mi",
  "spaghetti",
  "pasta",
  "nasi",
  "bakso",
  "sate",
  "ayam",
  "burger",
  "pizza",
  "roti",
  "kue",
  "rendang",
  "soto",
  "goreng",
];

const PRODUCT_RULES: Array<{ regex: RegExp; canonical: string; kind: ProductKind }> = [
  { regex: /\bes\s*teh\b|\besteh\b/, canonical: "es teh", kind: "beverage" },
  { regex: /\bteh\s*manis\b/, canonical: "teh manis", kind: "beverage" },
  { regex: /\bes\s*kopi\b/, canonical: "es kopi", kind: "beverage" },
  { regex: /\bkopi\s*susu\b/, canonical: "kopi susu", kind: "beverage" },
  { regex: /\bboba\b|\bbubble\s*tea\b/, canonical: "boba", kind: "beverage" },
  { regex: /\bjus\b|\bjuice\b/, canonical: "jus", kind: "beverage" },
  { regex: /\bsmoothie\b/, canonical: "smoothie", kind: "beverage" },
  { regex: /\bmilkshake\b/, canonical: "milkshake", kind: "beverage" },
  { regex: /\bspaghetti\b|\bpasta\b/, canonical: "spaghetti", kind: "food" },
  { regex: /\bmie\s*ayam\b|\bmi\s*ayam\b/, canonical: "mie ayam", kind: "food" },
  { regex: /\bnasi\s*goreng\b/, canonical: "nasi goreng", kind: "food" },
  { regex: /\bbakso\b/, canonical: "bakso", kind: "food" },
  { regex: /\bsate\b/, canonical: "sate", kind: "food" },
];

const DESIGN_DIRECTIONS: DesignDirection[] = [
  {
    name: "Modern Market Bold",
    palette: "warm amber, deep brown, cream white, subtle teal accents",
    layout: "asymmetric composition with strong headline at top and CTA badge near bottom-right",
    typography: "bold rounded sans-serif headline, medium-weight supporting text",
    accents: "soft grain texture, gradient glow, circular promo sticker",
  },
  {
    name: "Fresh Clean Editorial",
    palette: "fresh mint, off-white, charcoal text, citrus highlight",
    layout: "clean grid, generous negative space, centered hero product, minimal clutter",
    typography: "modern geometric sans-serif with high readability and clear hierarchy",
    accents: "thin divider lines, subtle shadow card, elegant shape overlays",
  },
  {
    name: "Street Promo Pop",
    palette: "vibrant red-orange, yellow highlights, dark neutral contrast",
    layout: "dynamic diagonal blocks, hero product foreground, energetic promo tag",
    typography: "high-impact bold display title with concise supporting copy",
    accents: "paper-cut shapes, paint splash elements, punchy discount bubble",
  },
];

const WEB_FETCH_TIMEOUT_MS = 3000;

function pickDesignDirection(seedText: string): DesignDirection {
  const seed = seedText
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return DESIGN_DIRECTIONS[seed % DESIGN_DIRECTIONS.length];
}

function normalizeForMatch(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/#[\w-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashtagToWords(tag: string): string {
  return tag
    .replace(/^#/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
}

function detectKindFromKeywords(text: string): ProductKind {
  const normalized = normalizeForMatch(text);
  const hasBeverageKeyword = BEVERAGE_KEYWORDS.some((keyword) =>
    normalized.includes(keyword),
  );
  const hasFoodKeyword = FOOD_KEYWORDS.some((keyword) =>
    normalized.includes(keyword),
  );

  if (hasBeverageKeyword && !hasFoodKeyword) return "beverage";
  if (hasFoodKeyword && !hasBeverageKeyword) return "food";
  return "unknown";
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function detectPrimaryProduct(params: {
  prompt: string;
  caption?: string;
  hashtags?: string[];
}): ProductSignal {
  const hashtagText = (params.hashtags || []).map(hashtagToWords).join(" ");
  const combinedText = `${hashtagText} ${params.caption || ""} ${params.prompt || ""}`;
  const normalized = normalizeForMatch(combinedText);

  for (const rule of PRODUCT_RULES) {
    if (rule.regex.test(normalized)) {
      return {
        name: rule.canonical,
        kind: rule.kind,
        confidence: "high",
      };
    }
  }

  const firstHashtag = (params.hashtags || [])
    .map(hashtagToWords)
    .find((tag) => tag.trim().length > 0);

  if (firstHashtag) {
    const normalizedHashtag = normalizeForMatch(firstHashtag);
    const candidate = normalizedHashtag
      .split(" ")
      .filter((word) => word.length > 2)
      .slice(0, 3)
      .join(" ")
      .trim();

    if (candidate) {
      return {
        name: candidate,
        kind: detectKindFromKeywords(candidate),
        confidence: "medium",
      };
    }
  }

  const fallback = extractSearchTopic(params.prompt, params.caption) || "produk";

  return {
    name: fallback,
    kind: detectKindFromKeywords(fallback),
    confidence: "low",
  };
}

function buildReferenceSearchTopic(product: ProductSignal): string {
  if (!product.name) return "";
  if (product.kind === "beverage") return `${product.name} minuman`;
  if (product.kind === "food") return `${product.name} makanan`;
  return product.name;
}

async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number = WEB_FETCH_TIMEOUT_MS,
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractSearchTopic(prompt: string, caption?: string): string {
  const rawText = (caption || prompt || "")
    .replace(/professional social media poster design for:/gi, " ")
    .replace(
      /modern, vibrant, eye-catching design with clear text and attractive visuals/gi,
      " ",
    )
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/#[\w-]+/g, " ")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!rawText) return "";

  const words = rawText.split(" ").filter((word) => word.length > 2);
  return words.slice(0, 8).join(" ");
}

async function getInternetVisualReferences(topic: string): Promise<WebReference[]> {
  if (!topic) return [];

  const searchUrl = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=3&format=json&utf8=1&origin=*`;
  const searchData = await fetchJsonWithTimeout<WikipediaSearchResponse>(
    searchUrl,
  );

  const titles = searchData?.query?.search?.map((item) => item.title) || [];
  const references: WebReference[] = [];

  for (const title of titles.slice(0, 2)) {
    const summaryUrl = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summary = await fetchJsonWithTimeout<WikipediaSummaryResponse>(
      summaryUrl,
    );

    const extract = summary?.extract?.replace(/\s+/g, " ").trim();
    if (!extract) continue;

    references.push({
      title,
      extract: extract.slice(0, 240),
      url: `https://id.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`,
    });
  }

  return references;
}

function buildEnhancedPrompt(params: {
  prompt: string;
  styleHint?: string;
  caption?: string;
  hashtags?: string[];
  references: WebReference[];
  product: ProductSignal;
}): string {
  const { prompt, styleHint, caption, hashtags, references, product } = params;
  const mainBrief = (caption || prompt).trim();
  const hashtagContext = (hashtags || []).filter(Boolean).join(" ");
  const productLabel = toTitleCase(product.name || "produk utama");
  const designDirection = pickDesignDirection(
    `${productLabel} ${mainBrief} ${hashtagContext}`,
  );
  const trimmedStyleHint = (styleHint || "").trim();

  const categorySpecificInstructions =
    product.kind === "beverage"
      ? `- Hero object wajib minuman: ${productLabel}.
- Jangan tampilkan hidangan utama seperti mie, pasta, nasi, burger, pizza, atau lauk.
- Jika minuman dingin, tampilkan es batu jelas dan efek embun pada gelas.
- Fokus pada 1 gelas/cup sebagai pusat visual, boleh ada garnish kecil pendukung.`
      : product.kind === "food"
        ? `- Hero object wajib makanan: ${productLabel}.
- Jangan jadikan minuman sebagai objek utama poster.
- Tampilkan plating dan tekstur makanan yang realistis serta menggugah selera.`
        : `- Hero object wajib mengikuti produk utama dari caption.
- Hindari objek makanan/minuman yang tidak disebutkan di caption.`;

  const referenceNotes =
    references.length > 0
      ? references
          .map(
            (ref, index) =>
              `${index + 1}. ${ref.title}: ${ref.extract} (source: ${ref.url})`,
          )
          .join("\n")
      : "No internet reference found. Use best-practice product photography with realistic ingredients and styling.";

  return `Create a premium square social media poster (1:1) for an Indonesian MSME product.

Primary caption and offer:
"${mainBrief}"

Hashtag context:
${hashtagContext || "-"}

Primary product lock:
- Product name: ${productLabel}
- Product category: ${product.kind}
- Detection confidence: ${product.confidence}
- Never switch the hero object to another product.

Design direction (must look premium and ad-ready):
- Theme: ${designDirection.name}
- Color palette: ${designDirection.palette}
- Layout style: ${designDirection.layout}
- Typography style: ${designDirection.typography}
- Visual accents: ${designDirection.accents}
- Create clear visual hierarchy: headline, short subheadline, promo badge, and CTA area.
- Keep text concise and readable in Indonesian (max 3 short text blocks, no long paragraph).
- Do not place text on top of critical product details; keep breathing space around hero product.
- Make the final poster feel like a polished social media ad, not a plain product photo.

Strict visual requirements:
${categorySpecificInstructions}
- Keep key ingredients, shape, garnish, and serving style consistent with the product identity.
- Prioritize appetizing realism: natural texture, realistic portion size, and authentic color.
- One clear focal product in front, clean composition, ad-ready layout.
- Add short and readable promotional headline text related to the caption.
- Commercial visual quality, high contrast but natural lighting.

Creative hint from user prompt:
${trimmedStyleHint || "No extra style hint provided."}

Internet visual reference notes:
${referenceNotes}

Use reference notes only to improve product authenticity and styling. Do not copy logos, watermarks, or copyrighted characters.`;
}

function buildNegativePrompt(product: ProductSignal): string {
  const basePrompt = [
    "wrong food type",
    "different product than caption",
    "inaccurate ingredients",
    "deformed product",
    "plastic texture",
    "blurry",
    "low quality",
    "watermark",
    "logo",
    "gibberish text",
    "extra unrelated objects",
    "bad anatomy",
    "flat boring layout",
    "weak typography",
    "unreadable text overlay",
    "poor composition",
    "cluttered poster",
    "monotonous color",
  ];

  const beverageExclusions = [
    "spaghetti",
    "pasta",
    "noodles",
    "pizza",
    "burger",
    "fried rice",
    "steak",
    "savory meal",
  ];

  const foodExclusions = [
    "tea glass as hero",
    "coffee cup as hero",
    "juice glass as hero",
    "beverage-only composition",
  ];

  if (product.kind === "beverage") {
    return [...basePrompt, ...beverageExclusions].join(", ");
  }

  if (product.kind === "food") {
    return [...basePrompt, ...foodExclusions].join(", ");
  }

  return basePrompt.join(", ");
}

async function checkRequestStatus(
  requestId: string,
  apiKey: string,
  maxAttempts = 60,
): Promise<DeapiStatusResult> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const statusResponse = await fetch(
      `https://api.deapi.ai/api/v1/client/request-status/${requestId}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!statusResponse.ok) {
      throw new Error("Failed to check request status");
    }

    const statusData = (await statusResponse.json()) as DeapiStatusResponse;
    const status = statusData.data?.status;

    if (status === "done" && statusData.data) {
      return statusData.data;
    } else if (status === "failed" || status === "error") {
      throw new Error("Image generation failed");
    }

    // Wait 2 seconds before next check
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Request timeout - image generation took too long");
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId, token, error: authError } = await getUserFromRequest(request);
    if (authError || !userId || !token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as GeneratePosterRequest;
    const {
      prompt = "",
      caption,
      hashtags,
      width = 768,
      height = 768,
      steps = 8,
    } = body;

    const sourcePrompt = caption || prompt;

    if (!sourcePrompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Get user's DeAPI key from DB using authenticated client
    const authSupabase = getAuthSupabase(token);
    const { deapi_api_key } = await getUserApiKeys(userId, authSupabase);

    if (!deapi_api_key) {
      return Response.json(
        {
          error:
            "DeAPI Key belum dikonfigurasi. Silakan atur di halaman Pengaturan.",
        },
        { status: 400 },
      );
    }

    const productSignal = detectPrimaryProduct({
      prompt,
      caption,
      hashtags,
    });
    const searchTopic = buildReferenceSearchTopic(productSignal);
    const internetReferences = await getInternetVisualReferences(searchTopic);
    const enhancedPrompt = buildEnhancedPrompt({
      prompt: sourcePrompt,
      styleHint: prompt,
      caption,
      hashtags,
      references: internetReferences,
      product: productSignal,
    });
    const normalizedSteps = Math.min(Math.max(steps, 10), 20);

    // Step 1: Submit generation request
    const response = await fetch("https://api.deapi.ai/api/v1/client/txt2img", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${deapi_api_key}`,
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        model: "ZImageTurbo_INT8",
        width,
        height,
        seed: Math.floor(Math.random() * 4294967296),
        steps: normalizedSteps,
        negative_prompt: buildNegativePrompt(productSignal),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeAPI Error:", errorData);

      const apiErrorMessage =
        (typeof errorData?.message === "string" && errorData.message) ||
        (typeof errorData?.error === "string" && errorData.error) ||
        "Failed to generate image from DeAPI";

      return Response.json(
        { error: apiErrorMessage },
        { status: response.status },
      );
    }

    const data = await response.json();
    const requestId = data.data?.request_id;

    if (!requestId) {
      return Response.json(
        { error: "No request_id received from DeAPI" },
        { status: 500 },
      );
    }

    // Step 2: Poll for completion
    const result = await checkRequestStatus(requestId, deapi_api_key);
    const deapiUrl = result.result_url || result.preview;
    let finalImageUrl = deapiUrl;

    // Step 3: Download and Upload to Supabase Storage
    const authHeader = request.headers.get("authorization");
    if (authHeader && deapiUrl) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        const authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: { Authorization: authHeader },
          },
        });

        // Fetch image from DeAPI
        const imageRes = await fetch(deapiUrl);
        if (imageRes.ok) {
          const imageBlob = await imageRes.blob();
          const filename = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.png`;

          const { data: uploadData, error: uploadError } =
            await authSupabase.storage
              .from("posters")
              .upload(filename, imageBlob, {
                contentType: "image/png",
                upsert: false,
              });

          if (!uploadError && uploadData) {
            const {
              data: { publicUrl },
            } = authSupabase.storage.from("posters").getPublicUrl(filename);
            finalImageUrl = publicUrl;
          } else {
            console.error("Supabase Storage Upload Error:", uploadError);
          }
        }
      } catch (storageError) {
        console.error("Failed to upload image to Supabase:", storageError);
      }
    }

    return Response.json({
      success: true,
      image: finalImageUrl,
      preview: finalImageUrl,
      result_url: finalImageUrl,
      product_lock: {
        name: productSignal.name,
        kind: productSignal.kind,
        confidence: productSignal.confidence,
      },
      references_used: internetReferences.map((item) => ({
        title: item.title,
        url: item.url,
      })),
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate poster",
      },
      { status: 500 },
    );
  }
}
