import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserFromRequest, getUserApiKeys, getAuthSupabase } from "@/lib/supabase";

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastRetry = i === maxRetries - 1;
      const isOverloaded =
        error?.message?.includes("overloaded") ||
        error?.message?.includes("503") ||
        error?.message?.includes("429");

      if (isLastRetry || !isOverloaded) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

// Generate content with model fallback
async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  base64Data: string,
  mimeType: string,
  prompt: string,
) {
  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

  for (let i = 0; i < models.length; i++) {
    try {
      console.log(`Trying model: ${models[i]}`);
      const model = genAI.getGenerativeModel({ model: models[i] });

      const result = await retryWithBackoff(async () => {
        return await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          prompt,
        ]);
      });

      return result;
    } catch (error: any) {
      console.error(`Model ${models[i]} failed:`, error.message);

      const isLastModel = i === models.length - 1;
      if (isLastModel) {
        throw error;
      }

      console.log(`Falling back to ${models[i + 1]}...`);
    }
  }

  throw new Error("All models failed");
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId, token, error: authError } = await getUserFromRequest(request);
    if (authError || !userId || !token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image, productInfo } = await request.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    // Get user's API key from DB using authenticated client
    const authSupabase = getAuthSupabase(token);
    const { gemini_api_key } = await getUserApiKeys(userId, authSupabase);

    if (!gemini_api_key) {
      return Response.json(
        {
          error:
            "Gemini API Key belum dikonfigurasi. Silakan atur di halaman Pengaturan.",
        },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(gemini_api_key);

    // Extract base64 data from data URL
    const base64Data = image.split(",")[1];
    const mimeType = image.split(";")[0].split(":")[1];

    const prompt = `Analisa foto produk berikut untuk kebutuhan marketing UMKM Indonesia.

${productInfo ? `Informasi tambahan: ${productInfo}` : ""}

Hasilkan output dalam format JSON terstruktur dengan field:
- nama_produk (string)
- deskripsi_produk (string)
- kategori_produk (string)
- target_market { usia (string, contoh: "18-35 tahun"), gender (string), segment (string) }
- selling_point (array max 3 string)
- rekomendasi_harga { min (number), max (number) }
- paket_konten_7_hari [ { hari (number 1-7), caption (string), hashtag (array string dengan # di depan) } ]
- brand_persona { tone (string), style (string), karakter (string) }
- waktu_posting_terbaik (array string dalam format "HH:00 WIB")
- key_message_brand (string)

Gunakan bahasa Indonesia yang profesional dan mudah dipahami UMKM.
PENTING: Hanya output JSON valid tanpa markdown code blocks atau teks tambahan.`;

    const result = await generateWithFallback(
      genAI,
      base64Data,
      mimeType,
      prompt,
    );

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsedResult = JSON.parse(cleanedText);

    return Response.json(parsedResult);
  } catch (error) {
    console.error("Error analyzing product:", error);
    return Response.json(
      { error: "Failed to analyze product" },
      { status: 500 },
    );
  }
}
