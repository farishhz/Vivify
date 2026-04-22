"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  ImageIcon,
  Sparkles,
  Loader2,
  Download,
  DownloadCloud,
  CalendarDays,
  Wand2,
} from "lucide-react";
import type { ContentDay } from "@/lib/types";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

interface ContentPlanTabProps {
  contentPlan: ContentDay[];
  generatedImages: Record<number, string>;
  setGeneratedImages: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
}

export function ContentPlanTab({
  contentPlan,
  generatedImages,
  setGeneratedImages,
}: ContentPlanTabProps) {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editedCaptions, setEditedCaptions] = useState<Record<number, string>>(
    {},
  );
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleCopy = async (
    text: string,
    hashtags: string[],
    index: number,
  ) => {
    const fullText = `${text}\n\n${hashtags.join(" ")}`;
    await navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = async (imageUrl: string, day: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `poster-hari-${day}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Gagal mendownload gambar");
    }
  };

  const handleCaptionChange = (index: number, value: string) => {
    setEditedCaptions((prev) => ({ ...prev, [index]: value }));
  };

  const getCaption = (index: number, originalCaption: string) => {
    return editedCaptions[index] ?? originalCaption;
  };

  const buildPosterPrompt = (caption: string, hashtags: string[] = []) => {
    const hashtagContext = hashtags.join(" ");

    return `Buat poster promosi makanan untuk UMKM berdasarkan caption ini: "${caption}". Fokuskan visual pada makanan utama yang sesuai caption, dengan detail tekstur dan plating yang realistis. Gunakan gaya komersial modern, bersih, dan menarik untuk sosial media. Konteks hashtag: ${hashtagContext || "-"}.`;
  };

  const handleGeneratePoster = async (
    index: number,
    caption: string,
    hashtags: string[] = [],
  ) => {
    setGeneratingIndex(index);
    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const prompt = buildPosterPrompt(caption, hashtags);

      const response = await fetch("/api/generate-poster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt,
          caption,
          hashtags,
          width: 768,
          height: 768,
          steps: 8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate poster");
      }

      const data = await response.json();

      if (data.image || data.result_url || data.preview) {
        const imageUrl = data.image || data.result_url || data.preview;
        setGeneratedImages((prev) => ({ ...prev, [index]: imageUrl }));
      } else {
        throw new Error("No image URL received from API");
      }
    } catch (error: unknown) {
      console.error("Error generating poster:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (
        errorMessage.includes("Pengaturan") ||
        errorMessage.includes("konfigurasi")
      ) {
        toast.error("DeAPI Key Belum Dikonfigurasi", {
          description:
            "Silakan atur DeAPI Key terlebih dahulu untuk generate poster.",
          action: {
            label: "Pengaturan",
            onClick: () => router.push("/settings"),
          },
        });
      } else {
        toast.error(`Gagal membuat poster: ${errorMessage}`);
      }
    } finally {
      setGeneratingIndex(null);
    }
  };

  const handleGenerateAllPosters = async () => {
    setIsGeneratingAll(true);
    const totalPosters = contentPlan.length;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < totalPosters; i++) {
      if (generatedImages[i]) continue;

      setGeneratingIndex(i);
      try {
        const { data: sessionData } = (await supabase?.auth.getSession()) || {};
        const token = sessionData?.session?.access_token;

        const caption = getCaption(i, contentPlan[i].caption);
        const hashtags = contentPlan[i].hashtag;
        const prompt = buildPosterPrompt(caption, hashtags);

        const response = await fetch("/api/generate-poster", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            prompt,
            caption,
            hashtags,
            width: 768,
            height: 768,
            steps: 8,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate poster");
        }

        const data = await response.json();

        if (data.image || data.result_url || data.preview) {
          const imageUrl = data.image || data.result_url || data.preview;
          setGeneratedImages((prev) => ({ ...prev, [i]: imageUrl }));
          successCount++;
        } else {
          throw new Error("No image URL received from API");
        }
      } catch (error: unknown) {
        console.error(`Error generating poster ${i + 1}:`, error);
        failCount++;

        const errorMessage = error instanceof Error ? error.message : "";
        if (
          errorMessage.includes("Pengaturan") ||
          errorMessage.includes("konfigurasi")
        ) {
          toast.error("DeAPI Key Belum Dikonfigurasi", {
            description:
              "Silakan atur DeAPI Key terlebih dahulu untuk generate poster.",
            action: {
              label: "Pengaturan",
              onClick: () => router.push("/settings"),
            },
          });
          break;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setGeneratingIndex(null);
    setIsGeneratingAll(false);

    if (successCount > 0 || failCount > 0) {
      toast(
        successCount > 0 && failCount === 0
          ? "Generate selesai!"
          : "Generate selesai dengan catatan",
        {
          description: `Berhasil: ${successCount} | Gagal: ${failCount}`,
        },
      );
    }
  };

  const handleDownloadAll = async () => {
    const generatedCount = Object.keys(generatedImages).length;
    if (generatedCount === 0) {
      toast.info(
        "Belum ada poster yang di-generate. Generate poster terlebih dahulu.",
      );
      return;
    }

    setIsDownloadingAll(true);
    try {
      const zip = new JSZip();

      for (const [indexStr, imageUrl] of Object.entries(generatedImages)) {
        const index = parseInt(indexStr);
        const day = contentPlan[index];

        try {
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          zip.file(`poster-hari-${day.hari}.png`, imageBlob);

          const caption = getCaption(index, day.caption);
          const captionContent = `HARI ${day.hari}\n\n${caption}\n\n${day.hashtag.join(" ")}`;
          zip.file(`caption-hari-${day.hari}.txt`, captionContent);
        } catch (error) {
          console.error(`Error processing day ${day.hari}:`, error);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `content-plan-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Berhasil download ${generatedCount} poster dan caption!`);
    } catch (error) {
      console.error("Error downloading all assets:", error);
      toast.error("Gagal mendownload aset. Silakan coba lagi.");
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-[4rem] pointer-events-none" />
        <div className="flex flex-col items-start text-start z-10">
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/30 px-3 py-1 mb-3 rounded-full font-medium"
          >
            <CalendarDays className="w-4 h-4 mr-2" /> Weekly Content Schedule
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            Paket{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
              Konten 7 Hari
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mt-2 font-medium max-w-xl">
            Dari caption, hashtags, hingga visual poster, semuanya disiapkan AI
            khusus untuk produk Anda.
          </p>
        </div>

        <div className="cta flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <Button
            size="lg"
            className="flex-1 md:flex-none gap-2 rounded-xl transition-all font-bold group"
            onClick={handleDownloadAll}
            disabled={
              isDownloadingAll || Object.keys(generatedImages).length === 0
            }
            variant={
              Object.keys(generatedImages).length === 0 ? "outline" : "default"
            }
          >
            {isDownloadingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <DownloadCloud
                  size={20}
                  className="group-hover:-translate-y-1 transition-transform"
                />
                Unduh Semua
              </>
            )}
          </Button>
          <Button
            onClick={handleGenerateAllPosters}
            disabled={isGeneratingAll || generatingIndex !== null}
            size="lg"
            className="flex-1 md:flex-none gap-2 rounded-xl font-bold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group border-0"
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...{" "}
                {generatingIndex !== null
                  ? `${(generatingIndex || 0) + 1}/${contentPlan.length}`
                  : ""}
              </>
            ) : (
              <>
                <Wand2
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                Auto Generate 7 Poster
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contentPlan.map((day, index) => (
          <Card
            key={index}
            className="flex flex-col border-0 shadow-xl bg-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300 relative border-t-2 border-t-transparent hover:border-t-primary/50"
          >
            <div className="absolute inset-x-0 -top-full h-full bg-gradient-to-b from-primary/5 to-transparent transition-all duration-500 ease-out group-hover:top-0 pointer-events-none" />
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/30 relative z-10">
              <CardTitle className="text-base flex items-center justify-between font-extrabold tracking-tight">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary shadow-md shadow-primary/20 text-primary-foreground text-sm font-black flex items-center justify-center">
                    {day.hari}
                  </span>
                  Hari Ke-{day.hari}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full transition-colors",
                    copiedIndex === index
                      ? "bg-green-500/10 hover:bg-green-500/20"
                      : "bg-muted hover:bg-muted/80",
                  )}
                  onClick={() =>
                    handleCopy(
                      getCaption(index, day.caption),
                      day.hashtag,
                      index,
                    )
                  }
                >
                  {copiedIndex === index ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-5 p-6 relative z-10 bg-gradient-to-b from-transparent to-muted/20">
              {/* Visual Placeholder / Generated Image */}
              <div className="aspect-square rounded-[1.5rem] bg-muted/50 flex items-center justify-center relative overflow-hidden group/image border border-border/50 shadow-inner">
                {generatedImages[index] ? (
                  <>
                    <img
                      src={generatedImages[index]}
                      alt={`Poster Hari ${day.hari}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleDownload(generatedImages[index], day.hari)
                        }
                        className="rounded-full gap-2 font-bold hover:scale-105 transition-transform w-[140px]"
                      >
                        <Download className="w-4 h-4" />
                        Unduh
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleGeneratePoster(
                            index,
                            getCaption(index, day.caption),
                            day.hashtag,
                          )
                        }
                        disabled={generatingIndex === index}
                        className="rounded-full gap-2 font-bold hover:scale-105 transition-transform w-[140px] bg-primary"
                      >
                        <Sparkles className="w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center w-full h-full flex flex-col items-center justify-center p-6 text-muted-foreground relative">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
                    {generatingIndex === index ? (
                      <>
                        <div className="relative w-16 h-16 mb-4">
                          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <Wand2 className="w-6 h-6 absolute inset-0 m-auto text-primary animate-pulse" />
                        </div>
                        <p className="text-sm font-bold text-foreground animate-pulse">
                          Membuat Poster AI...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          Tunggu sekitar 15-20 detik
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 transition-transform duration-300 group-hover/image:scale-110 group-hover/image:bg-primary group-hover/image:text-primary-foreground border-2 border-dashed border-primary/20 group-hover/image:border-transparent">
                          <ImageIcon className="w-7 h-7" />
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full shadow-md gap-2 font-bold w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all"
                          onClick={() =>
                            handleGeneratePoster(
                              index,
                              getCaption(index, day.caption),
                              day.hashtag,
                            )
                          }
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Poster
                        </Button>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-4 opacity-50">
                          1 Kredit DeAPI
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="flex-1 flex flex-col gap-2 relative">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  Ide Caption
                </label>
                <div className="relative group/textarea h-full min-h-[140px]">
                  <Textarea
                    value={getCaption(index, day.caption)}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="absolute inset-0 h-full text-sm resize-none bg-background/50 border-border/50 rounded-xl focus-visible:ring-primary/20 transition-all focus-visible:border-primary/50 shadow-inner group-hover/textarea:border-border/80 leading-relaxed font-medium"
                  />
                </div>
              </div>

              {/* Hashtags */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {day.hashtag.slice(0, 5).map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="text-[10px] font-semibold bg-primary/10 text-primary border-0 hover:bg-primary/20 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {day.hashtag.length > 5 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold border-muted-foreground/30 text-muted-foreground  px-2 py-0.5 rounded-md"
                    >
                      +{day.hashtag.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
