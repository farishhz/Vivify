"use client";

import { useState } from "react";
import { HistoryList } from "@/components/dashboard/history-list";
import { ResultDashboard } from "@/components/dashboard/result-dashboard";
import type { HistoryRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Search,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HistoryWorkspace() {
  const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    setSelectedHistory(null);
  };

  if (selectedHistory) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500 pb-12">
        <div className="flex items-center gap-4 bg-background/80 backdrop-blur-xl z-50 py-4 top-0 sticky">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2 rounded-2xl font-bold shadow-sm hover:shadow-md hover:-translate-x-1 transition-all h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
            Kembali
          </Button>
          <div className="h-8 w-px bg-border/50 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Melihat Detail
            </span>
            <span className="text-sm font-extrabold text-foreground truncate max-w-[200px] md:max-w-md">
              {selectedHistory.product_info}
            </span>
          </div>
        </div>

        <ResultDashboard
          result={selectedHistory.result}
          productImage={selectedHistory.product_image}
          onReset={handleBack}
          historyId={selectedHistory.id}
          initialGeneratedImages={selectedHistory.generated_images}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[5rem] pointer-events-none -z-10" />

        <div className="space-y-4 max-w-2xl">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm rounded-full shadow-sm font-bold"
          >
            <Clock className="w-4 h-4 mr-2 inline-block -mt-0.5" />
            Machine Learning Archive
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            Riwayat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
              Generate
            </span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Jejak langkah kesuksesan marketing Anda. Lihat kembali seluruh
            strategi dan konten AI yang telah dibuat untuk portofolio produk
            Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 h-14 bg-muted/40 p-1.5 rounded-[1.25rem] border border-border/50 backdrop-blur-sm self-start md:self-auto">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-0 ring-0 hover:ring-0 focus:ring-0 pl-10 pr-4 text-sm font-medium focus-visible:outline-hidden text-foreground placeholder-muted-foreground transition-all focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md opacity-50">
              Ctrl+K
            </div>
          </div>
        </div>
      </header>

      <div className="pt-4 border-t border-border/50">
        <HistoryList
          onSelectHistory={setSelectedHistory}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
