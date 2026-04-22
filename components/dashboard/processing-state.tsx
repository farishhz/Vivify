"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Search, Sparkles, CheckCircle2, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Eye,
    label: "Menganalisa Visual Produk",
    description: "AI mengidentifikasi kategori dan metrik produk",
    completed: "Visual produk berhasil dianalisis",
  },
  {
    icon: Search,
    label: "Riset Pasar & Target Audience",
    description: "Menemukan pain points & mendefinisikan market",
    completed: "Data pasar dan audiens dipetakan",
  },
  {
    icon: Brain,
    label: "Menyusun Brand Strategy",
    description: "Membentuk persona, tone of voice & key message",
    completed: "Fondasi brand strategy selesai dibangun",
  },
  {
    icon: Sparkles,
    label: "Generate Content & Copywriting",
    description: "Mempersiapkan ide konten, hashtag, dan caption",
    completed: "Paket konten 7 hari siap disajikan",
  },
];

export function ProcessingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000); // Slower interval for dramatic effect

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const targetProgress = ((currentStep + 1) / steps.length) * 100;
        if (prev < targetProgress) {
          return Math.min(prev + 1, targetProgress);
        }
        return prev;
      });
    }, 40);

    return () => clearInterval(progressInterval);
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center m-auto max-w-4xl py-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-8 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[3rem] animate-pulse" />

        <div className="space-y-4 relative z-10">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary py-1.5 px-4 mb-2 animate-pulse rounded-full font-medium shadow-sm"
          >
            <Zap className="w-4 h-4 mr-2" fill="currentColor" />
            AI Initialization
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight drop-shadow-sm">
            AI Sedang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
              Menganalisis...
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
            Biarkan visual produk Anda bercerita. Kami sedang menjahit strategi
            marketing yang sempurna untuk bisnis Anda.
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="max-w-2xl mx-auto space-y-4 pt-8">
          <div className="h-4 bg-muted/50 rounded-full overflow-hidden shadow-inner relative border border-muted">
            <div
              className="h-full bg-gradient-to-r from-primary via-amber-400 to-amber-500 transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripe_1s_linear_infinite]" />
              <div className="absolute inset-0 bg-white/20 blur-[2px] animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between font-mono text-sm tracking-widest font-bold">
            <span className="text-muted-foreground">
              {Math.round(progress)}% EXECUTED
            </span>
            <span className="flex items-center gap-2 text-primary">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Processing Node
            </span>
          </div>
        </div>
      </div>

      {/* Steps Grid Grid */}
      <div className="grid md:grid-cols-2 gap-6 w-full">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const Icon = step.icon;

          return (
            <Card
              key={index}
              className={cn(
                "transition-all duration-700 overflow-hidden border-2 relative group rounded-[1.5rem]",
                isActive &&
                  "border-primary/50 shadow-[0_0_30px_-5px] shadow-primary/30 scale-[1.03] bg-card/80 backdrop-blur-md",
                isCompleted && "border-green-500/30 bg-muted/20",
                !isActive &&
                  !isCompleted &&
                  "border-transparent bg-muted/30 opacity-60",
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              )}

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-5">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                      isActive &&
                        "bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110 rotate-3",
                      isCompleted &&
                        "bg-green-500 text-white shadow-lg shadow-green-500/20",
                      !isActive &&
                        !isCompleted &&
                        "bg-muted-foreground/10 text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <Icon
                        className={cn("w-7 h-7", isActive && "animate-pulse")}
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "font-bold text-lg",
                          isActive && "text-foreground",
                          isCompleted &&
                            "text-muted-foreground line-through decoration-muted-foreground/50",
                          !isActive &&
                            !isCompleted &&
                            "text-muted-foreground/70",
                        )}
                      >
                        {step.label}
                      </h3>
                      {isActive && (
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <div className="absolute inset-1 border-2 border-amber-500 border-b-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                        </div>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium leading-relaxed",
                        isActive && "text-muted-foreground delay-100",
                        isCompleted &&
                          "text-green-600/70 dark:text-green-500/70 line-clamp-2",
                        !isActive && !isCompleted && "text-muted-foreground/40",
                      )}
                    >
                      {isCompleted ? step.completed : step.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
