"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Star,
  DollarSign,
  ArrowRight,
  Zap,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import type { GeminiResponse } from "@/lib/types";

interface ProductAnalysisTabProps {
  result: GeminiResponse;
  productImage: string;
}

export function ProductAnalysisTab({
  result,
  productImage,
}: ProductAnalysisTabProps) {
  return (
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 animation-in fade-in zoom-in-95 duration-700">
      {/* Kolom 1: Identitas Produk (Hero Card) */}
      <Card className="xl:col-span-1 border-0 shadow-2xl bg-gradient-to-br from-card to-muted/50 rounded-[2rem] overflow-hidden group">
        <div className="h-48 w-full relative bg-muted/60 overflow-hidden flex items-center justify-center p-4">
          {/* Decorative blurred background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <img
            src={productImage || "/placeholder.svg"}
            alt="Produk"
            className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-in-out relative z-20"
          />
        </div>
        <CardContent className="p-8 pt-6 relative space-y-6">
          <Badge className="absolute -top-4 right-8 bg-primary text-primary-foreground shadow-lg px-4 py-1.5 z-30 font-bold uppercase tracking-wider text-xs">
            {result.kategori_produk}
          </Badge>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Identitas Produk
              </p>
              <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight">
                {result.nama_produk}
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/50 pl-4 py-1">
              {result.deskripsi_produk}
            </p>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" /> Estimasi Harga
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="bg-green-500/10 text-green-600 dark:text-green-500 px-4 py-2 flex-col rounded-xl flex-1 text-center border border-green-500/20 shadow-sm font-black">
                <span className="text-[10px] uppercase font-bold text-green-600/60 block mb-0.5">
                  Min
                </span>
                Rp {result.rekomendasi_harga.min.toLocaleString("id-ID")}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="bg-primary/10 text-primary px-4 py-2 flex-col rounded-xl flex-1 text-center border border-primary/20 shadow-sm font-black">
                <span className="text-[10px] uppercase font-bold text-primary/60 block mb-0.5">
                  Max
                </span>
                Rp {result.rekomendasi_harga.max.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kolom 2 & 3: Details */}
      <div className="xl:col-span-2 space-y-8 flex flex-col">
        {/* Target Market Overview */}
        <Card className="border border-border/50 shadow-xl bg-card rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-3 font-extrabold tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              Target Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl transition-all duration-500 group-hover:from-blue-500/10" />
                <div className="p-6 relative border border-border/30 rounded-2xl h-full flex flex-col items-center text-center gap-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Target Usia
                  </p>
                  <p className="font-extrabold text-xl text-foreground mt-auto">
                    {result.target_market.usia}
                  </p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl transition-all duration-500 group-hover:from-pink-500/10" />
                <div className="p-6 relative border border-border/30 rounded-2xl h-full flex flex-col items-center text-center gap-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Gender Utama
                  </p>
                  <p className="font-extrabold text-xl text-foreground mt-auto">
                    {result.target_market.gender}
                  </p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl transition-all duration-500 group-hover:from-amber-500/10" />
                <div className="p-6 relative border border-border/30 rounded-2xl h-full flex flex-col items-center text-center gap-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Segmen Audiens
                  </p>
                  <p className="font-bold text-sm text-foreground mt-auto">
                    {result.target_market.segment}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unique Selling Points */}
        <Card className="border border-border/50 shadow-xl bg-card rounded-[2rem] overflow-hidden flex-1 relative hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[3rem] pointer-events-none" />
          <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent pb-4 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-3 font-extrabold tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shadow-inner">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              Unique Selling Points (USP)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="grid sm:grid-cols-2 gap-6">
              {result.selling_point.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground leading-relaxed pt-1.5">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
