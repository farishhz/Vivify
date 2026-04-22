"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  MessageSquareQuote,
  Palette,
  Heart,
  Zap,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import type { GeminiResponse } from "@/lib/types";

interface BrandStrategyTabProps {
  result: GeminiResponse;
}

export function BrandStrategyTab({ result }: BrandStrategyTabProps) {
  const { brand_persona, waktu_posting_terbaik, key_message_brand } = result;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <header className="flex flex-col items-start border-b border-border/50 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-primary/20 rounded-full blur-[4rem] pointer-events-none" />
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Brand{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
            Platform
          </span>
        </h2>
        <p className="text-muted-foreground text-lg mt-2 font-medium">
          Panduan komprehensif untuk membangun karakter brand yang tak
          terlupakan
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Brand Persona & Key Message */}
        <div className="lg:col-span-7 space-y-8">
          {/* Brand Persona (Glassmorphism) */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-primary/5 rounded-[2rem] overflow-hidden group">
            <CardHeader className="bg-muted/30 pb-5 border-b border-border/30 backdrop-blur-sm relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent to-primary/10 opacity-50 pointer-events-none" />
              <CardTitle className="text-2xl flex items-center gap-4 font-black tracking-tight relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary-foreground" />
                </div>
                Brand Persona
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-3 gap-6">
                {/* Tone */}
                <div className="relative group/card">
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent rounded-[1.25rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  <div className="p-5 border border-border/40 rounded-[1.25rem] bg-card h-full flex flex-col gap-3 relative z-10 shadow-sm transition-transform duration-300 group-hover/card:-translate-y-1">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Tone of Voice
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-foreground leading-tight tracking-tight mt-auto">
                      {brand_persona.tone}
                    </p>
                  </div>
                </div>

                {/* Style */}
                <div className="relative group/card">
                  <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-[1.25rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  <div className="p-5 border border-border/40 rounded-[1.25rem] bg-card h-full flex flex-col gap-3 relative z-10 shadow-sm transition-transform duration-300 group-hover/card:-translate-y-1">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Visual Style
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-foreground leading-tight tracking-tight mt-auto">
                      {brand_persona.style}
                    </p>
                  </div>
                </div>

                {/* Karakter */}
                <div className="relative group/card">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent rounded-[1.25rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  <div className="p-5 border border-border/40 rounded-[1.25rem] bg-card h-full flex flex-col gap-3 relative z-10 shadow-sm transition-transform duration-300 group-hover/card:-translate-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        Main Karakter
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-foreground leading-tight tracking-tight mt-auto">
                      {brand_persona.karakter}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Message */}
          <Card className="border border-border/30 shadow-2xl bg-card rounded-[2rem] overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 text-[10rem] font-serif text-muted/10 leading-none pointer-events-none select-none">
              "
            </div>
            <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent pb-4 border-b border-border/20">
              <CardTitle className="text-xl flex items-center gap-3 font-extrabold tracking-tight">
                <div className="w-10 h-10 rounded-xl bg-amber-500 shadow-md shadow-amber-500/30 flex items-center justify-center">
                  <MessageSquareQuote className="w-5 h-5 text-white" />
                </div>
                Key Brand Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 relative z-10">
              <blockquote className="relative bg-muted/30 p-8 rounded-3xl border border-border/50">
                <div className="absolute top-4 left-4 text-4xl text-amber-500/30 font-serif leading-none">
                  "
                </div>
                <p className="text-2xl font-bold text-foreground leading-relaxed italic relative z-10 md:px-8 text-center drop-shadow-sm">
                  {key_message_brand}
                </p>
                <div className="absolute bottom-[-10px] right-4 text-4xl text-amber-500/30 font-serif rotate-180 leading-none">
                  "
                </div>
              </blockquote>
              <div className="mt-6 flex justify-center items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 rounded-full border-border/50 font-medium text-muted-foreground"
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  Gunakan pesan ini di bio, tagline, atau deskripsi iklan.
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Waktu Posting */}
        <div className="lg:col-span-5 h-full">
          <Card className="border border-border/30 shadow-2xl bg-card rounded-[2rem] overflow-hidden h-full flex flex-col relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
            <CardHeader className="bg-gradient-to-b from-muted/30 to-transparent pb-6 border-b border-border/20">
              <CardTitle className="text-2xl flex flex-col gap-4 font-extrabold tracking-tight">
                <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-xl shadow-blue-500/30 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="block mb-1">Golden Hours</span>
                  <span className="text-sm font-medium text-muted-foreground tracking-normal block">
                    Waktu Posting Terbaik Untuk Algoritma
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col relative z-10 gap-8">
              {/* Timeline Visualization */}
              <div className="space-y-6 flex-1">
                <div className="relative flex flex-col gap-3">
                  {waktu_posting_terbaik.map((time, index) => {
                    const hourStr = time.split(":")[0];
                    const hour = Number.parseInt(hourStr);
                    const period =
                      hour < 12 ? "Pagi" : hour < 18 ? "Siang/Sore" : "Malam";
                    const intensity = index === 0 ? "Tertinggi" : "Tinggi";

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/40 hover:bg-muted/40 transition-colors cursor-default"
                      >
                        <div className="min-w-[5.5rem] px-3 h-16 rounded-[1rem] bg-blue-500/10 flex flex-col items-center justify-center border border-blue-500/20 shadow-inner shrink-0">
                          <span className="text-[10px] font-bold text-blue-500 uppercase leading-none mb-1">
                            {period}
                          </span>
                          <span className="text-base font-black text-foreground leading-none whitespace-nowrap">
                            {time}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold tracking-tight text-foreground flex items-center gap-2">
                            Trafik {intensity}{" "}
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          </p>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden flex">
                            <div
                              className={`h-full bg-blue-500 rounded-full ${index === 0 ? "w-[95%]" : index === 1 ? "w-[80%]" : "w-[65%]"}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informational Tooltip */}
              <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-3xl mt-auto">
                <p className="text-sm font-medium text-foreground/80 leading-relaxed flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">
                      i
                    </span>
                  </span>
                  <span className="flex-1">
                    Jadwalkan postingan 15 menit sebelum waktu golden hours ini
                    agar konten Anda terdistribusi maksimal saat puncak trafik.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Perlu mengimport Star jika belum, di atas:
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
