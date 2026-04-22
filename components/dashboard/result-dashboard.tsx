"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Package,
  CalendarDays,
  Lightbulb,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { ProductAnalysisTab } from "@/components/tabs/product-analysis-tab";
import { ContentPlanTab } from "@/components/tabs/content-plan-tab";
import { BrandStrategyTab } from "@/components/tabs/brand-strategy-tab";
import type { GeminiResponse } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

interface ResultDashboardProps {
  result: GeminiResponse;
  productImage: string;
  onReset: () => void;
  historyId: string | null;
  initialGeneratedImages?: Record<number, string>;
}

export function ResultDashboard({
  result,
  productImage,
  onReset,
  historyId,
  initialGeneratedImages,
}: ResultDashboardProps) {
  const [activeTab, setActiveTab] = useState("analysis");
  const [generatedImages, setGeneratedImages] = useState<
    Record<number, string>
  >(initialGeneratedImages || {});

  // Update history when generated images change
  useEffect(() => {
    if (historyId && Object.keys(generatedImages).length > 0) {
      supabase?.auth.getSession().then(({ data: sessionData }) => {
        const token = sessionData?.session?.access_token;
        fetch(`/api/history/${historyId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ generated_images: generatedImages }),
        }).catch((error) => console.error("Error updating history:", error));
      });
    }
  }, [generatedImages, historyId]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card border-border/50 border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[4rem] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/10 rounded-full blur-[4rem] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/30 px-3 py-1 font-medium rounded-full mb-2"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Analysis Completed
          </Badge>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight drop-shadow-sm flex items-center gap-3">
              Hasil{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                Strategi AI
              </span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Blueprint marketing untuk produk Anda siap dieksekusi. Pilih tab
              di bawah untuk melihat detail.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          size="lg"
          className="relative z-10 gap-2 font-bold shadow-sm hover:shadow-md rounded-2xl hover:bg-primary/5 hover:text-primary transition-all duration-300 border-2"
        >
          <RotateCcw className="w-5 h-5 transition-transform hover:-rotate-180 duration-500" />
          Mulai Dari Awal
        </Button>
      </div>

      {/* Modern Floating Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-8"
      >
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-full inline-flex h-16 items-center justify-center rounded-[1.5rem] bg-muted/50 p-1.5 text-muted-foreground shadow-inner">
            <TabsTrigger
              value="analysis"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[1.25rem] px-5 sm:px-8 py-3.5 text-sm sm:text-base font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 gap-2.5 flex-1 h-full"
            >
              <Package className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Analisa Produk</span>
            </TabsTrigger>
            <TabsTrigger
              value="strategy"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[1.25rem] px-5 sm:px-8 py-3.5 text-sm sm:text-base font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/5 gap-2.5 flex-1 h-full"
            >
              <Lightbulb className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Strategi Brand</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[1.25rem] px-5 sm:px-8 py-3.5 text-sm sm:text-base font-bold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20 gap-2.5 flex-1 h-full relative overflow-hidden group/trigger"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-data-[state=active]/trigger:animate-[pulse_2s_ease-in-out_infinite]" />
              <CalendarDays className="w-5 h-5 flex-shrink-0 relative z-10" />
              <span className="truncate relative z-10 w-full sm:w-auto text-left sm:text-center">
                <span className="hidden sm:inline">Paket Konten</span> 7 Hari
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents with animations */}
        <div className="relative min-h-[500px]">
          <TabsContent
            value="analysis"
            className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-4 duration-500"
          >
            <ProductAnalysisTab result={result} productImage={productImage} />
          </TabsContent>

          <TabsContent
            value="strategy"
            className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-4 duration-500"
          >
            <BrandStrategyTab result={result} />
          </TabsContent>

          <TabsContent
            value="content"
            className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-bottom-4 duration-500"
          >
            <ContentPlanTab
              contentPlan={result.paket_konten_7_hari}
              generatedImages={generatedImages}
              setGeneratedImages={setGeneratedImages}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
