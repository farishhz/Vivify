"use client";

import { useState } from "react";
import { UploadWorkspace } from "@/components/dashboard/upload-workspace";
import { ProcessingState } from "@/components/dashboard/processing-state";
import { ResultDashboard } from "@/components/dashboard/result-dashboard";
import type { GeminiResponse } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type WorkspaceState = "upload" | "processing" | "result";

export function MainWorkspace() {
  const [state, setState] = useState<WorkspaceState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<string>("");
  const router = useRouter();

  const handleStartAutopilot = async (image: string, productInfo: string) => {
    setUploadedImage(image);
    setProductInfo(productInfo);
    setState("processing");

    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ image, productInfo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze product");
      }

      const data = await response.json();
      setResult(data);

      // Save to history
      const historyResponse = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_image: image,
          product_info: productInfo,
          result: data,
          generated_images: {},
        }),
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistoryId(historyData.data.id);
      }

      setState("result");
    } catch (error: any) {
      console.error("[v0] Error analyzing product:", error);
      setState("upload");

      const errorMessage = error.message || "Gagal menganalisis produk";

      if (
        errorMessage.includes("Pengaturan") ||
        errorMessage.includes("konfigurasi")
      ) {
        toast.error("API Key Belum Dikonfigurasi", {
          description: "Anda perlu mengatur Gemini API Key terlebih dahulu.",
          action: {
            label: "Buka Pengaturan",
            onClick: () => router.push("/settings"),
          },
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleReset = () => {
    setState("upload");
    setUploadedImage(null);
    setResult(null);
    setHistoryId(null);
    setProductInfo("");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {state === "upload" && (
        <UploadWorkspace onStartAutopilot={handleStartAutopilot} />
      )}
      {state === "processing" && <ProcessingState />}
      {state === "result" && result && uploadedImage && (
        <ResultDashboard
          result={result}
          productImage={uploadedImage}
          onReset={handleReset}
          historyId={historyId}
        />
      )}
    </div>
  );
}
