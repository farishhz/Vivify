"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  Upload,
  ImageIcon,
  Link2,
  Rocket,
  X,
  Tag,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UploadWorkspaceProps {
  onStartAutopilot: (image: string, productInfo: string) => void;
}

export function UploadWorkspace({ onStartAutopilot }: UploadWorkspaceProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const handleSubmit = () => {
    if (uploadedImage && productInfo.trim()) {
      onStartAutopilot(uploadedImage, productInfo);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="text-center space-y-4 flex flex-col items-center">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-sm rounded-full shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-2 inline-block" />
          AI-Powered Marketing Strategist
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
          AI UMKM{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
            Autopilot
          </span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-medium">
          Upload foto produk Anda dan saksikan AI menyusun strategi brand &
          konten sosmed lengkap dalam hitungan detik.
        </p>
      </div>

      {/* Main Content - Left/Right Layout */}
      <div className="grid lg:grid-cols-5 gap-8 mt-12">
        {/* Left - Upload Card (Takes 3 columns) */}
        <Card className="lg:col-span-3 border-0 shadow-2xl bg-card overflow-hidden relative group rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <CardContent className="p-8 h-full flex flex-col relative">
            {!uploadedImage ? (
              <div
                className={cn(
                  "relative rounded-[1.5rem] transition-all duration-300 cursor-pointer border-2 border-dashed flex-1 flex flex-col items-center justify-center min-h-[400px]",
                  dragActive
                    ? "bg-primary/5 border-primary scale-[0.98] shadow-inner"
                    : "hover:bg-muted/80 border-muted-foreground/30 hover:border-primary/50 bg-muted/30",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-6 p-6 text-center">
                  <div
                    className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl",
                      dragActive
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-background text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:shadow-primary/20",
                    )}
                  >
                    <Upload className="w-12 h-12" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-bold text-2xl text-foreground">
                      Letakkan Foto Disini
                    </p>
                    <p className="text-base text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                      Drag & drop gambar Anda, atau{" "}
                      <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4">
                        pilih file
                      </span>{" "}
                      dari perangkat.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-background/50 hover:bg-background"
                      >
                        JPG
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-background/50 hover:bg-background"
                      >
                        PNG
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-background/50 hover:bg-background"
                      >
                        WEBP
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex-1 min-h-[400px] rounded-[1.5rem] overflow-hidden bg-muted/20 flex flex-col items-center justify-center group/image border border-border/50">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Preview produk"
                  className="w-full h-full absolute inset-0 object-contain drop-shadow-2xl transition-transform duration-700 group-hover/image:scale-105 p-4"
                />

                {/* Backdrop blur overlay on hover */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-md opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Button
                    onClick={removeImage}
                    variant="destructive"
                    size="lg"
                    className="gap-2 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
                  >
                    <X className="w-5 h-5" /> Ganti Foto Produk
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right - Product Info & Button */}
        <Card className="lg:col-span-2 border-0 shadow-2xl bg-card rounded-[2rem] overflow-hidden relative">
          {/* Aesthetic background flares */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <CardContent className="p-8 h-full flex flex-col justify-center gap-10 relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="productInfo"
                  className="flex items-center gap-2 text-lg font-bold text-foreground"
                >
                  <Tag className="w-5 h-5 text-primary" />
                  Nama / Jenis Produk
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Berikan konteks singkat agar AI dapat memahami dan menyusun
                  strategi yang relevan untuk produk Anda.
                </p>
              </div>
              <div className="relative group/input">
                <Input
                  id="productInfo"
                  placeholder="Contoh: Keripik Singkong Pedas"
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  className="bg-background/80 h-16 pl-6 pr-14 text-lg font-medium border-2 border-border/50 focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 rounded-2xl shadow-inner-sm group-hover/input:border-primary/40 focus-visible:shadow-primary/5 focus-visible:bg-background"
                  autoComplete="off"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none transition-colors duration-300 group-focus-within/input:text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {/* CTA Button */}
              <Button
                onClick={handleSubmit}
                disabled={!uploadedImage || !productInfo.trim()}
                size="lg"
                className={cn(
                  "w-full h-16 text-lg font-bold gap-3 rounded-2xl transition-all duration-500",
                  uploadedImage && productInfo.trim()
                    ? "shadow-[0_0_40px_-10px] shadow-primary hover:shadow-[0_0_60px_-15px] hover:shadow-primary hover:-translate-y-1 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white border-0"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                <Rocket
                  className={cn(
                    "w-6 h-6",
                    uploadedImage && productInfo.trim() ? "animate-bounce" : "",
                  )}
                />
                Mulai Autopilot Sekarang
              </Button>

              <div className="text-center bg-muted/30 rounded-xl py-3 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Proses AI memakan waktu ~15-30 detik
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
