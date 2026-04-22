"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Camera,
  Video,
  Palette,
  ShoppingBag,
  Megaphone,
  Sparkles,
  Smartphone,
  Store
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F1F5F9] pt-20 pb-12 lg:pt-28 lg:pb-16">
      {/* Decorative Background Icons */}
      <div className="hidden md:block absolute inset-0 opacity-[0.15] text-gray-400 pointer-events-none select-none">
        {/* Top Left */}
        <div className="absolute top-[10%] left-[5%] rotate-[-15deg]">
          <Camera size={72} strokeWidth={1} />
        </div>
        <div className="absolute top-[25%] left-[15%] rotate-[10deg]">
          <Video size={56} strokeWidth={1} />
        </div>

        {/* Top Right */}
        <div className="absolute top-[12%] right-[8%] rotate-[20deg]">
          <Palette size={64} strokeWidth={1} />
        </div>
        <div className="absolute top-[30%] right-[18%] rotate-[-12deg]">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-[20%] left-[10%] rotate-[15deg]">
          <Megaphone size={52} strokeWidth={1} />
        </div>
        <div className="absolute bottom-[35%] left-[20%] rotate-[-25deg]">
          <Sparkles size={40} strokeWidth={1} />
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-[15%] right-[12%] rotate-[-10deg]">
          <Smartphone size={60} strokeWidth={1} />
        </div>
        <div className="absolute bottom-[32%] right-[5%] rotate-[18deg]">
          <Store size={48} strokeWidth={1} />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center pt-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#DDE7FF] mb-6">
          <span className="text-sm font-semibold text-[#3B66D1]">Solusi cerdas untuk UMKM</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4 max-w-3xl mx-auto leading-tight font-dm-sans italic">
          Bingung mulai bisnis? <br />
          <span className="not-italic">Mulai dari sini</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-gray-600 font-medium mb-8 max-w-xl mx-auto leading-relaxed font-inter">
          Dapet ide, strategi, foto produk, sampe <br className="hidden md:block" />
          video promosi. Semua otomatis.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center -mb-28">
          <Link href="/workspace">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-[#B87CFF] hover:bg-[#A666FF] text-white font-bold text-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
              Mulai sekarang <ArrowUpRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>

        {/* Large Hero Image */}
        <div className="relative w-[100vw] left-1/2 -translate-x-1/2 lg:w-full lg:static lg:translate-x-0 max-w-6xl mx-auto mb-12 lg:px-4 flex justify-center overflow-hidden lg:overflow-visible">
          <div className="relative w-full max-w-[1400px]">
            <Image
              src="/hero/hero-main.png"
              alt="BrandForceAI Dashboard"
              width={1400}
              height={600}
              priority
              className="w-full h-auto object-contain transition-transform duration-700"
            />
          </div>

          {/* Floating decorative elements (Optional, can be removed) */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#B87CFF]/10 blur-3xl rounded-full hidden lg:block -z-10" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full hidden lg:block -z-10" />
        </div>

        {/* Partner Logos */}
        <div className="pt-20 pb-10">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10 font-inter">Partnership by</p>
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-items-center justify-center items-center gap-y-12 gap-x-6 md:gap-28 opacity-95 drop-shadow-md px-4">
            <Image src="/hero/logo/Jakpreneur.png" alt="Forum UMKM" width={400} height={400} className="object-contain h-14 md:h-36 w-auto" />
            <Image src="/hero/logo/umkm-center.svg" alt="UMKM Center" width={400} height={400} className="object-contain h-14 md:h-36 w-auto" />
            <Image src="/hero/logo/jakarta-logo.png" alt="Pemkot" width={400} height={400} className="object-contain h-16 md:h-40 w-auto" />
            <Image src="/hero/logo/umkmjabodetabek.png" alt="Soloraya" width={400} height={400} className="object-contain h-14 md:h-36 w-auto" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}