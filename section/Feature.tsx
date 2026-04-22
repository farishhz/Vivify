"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  featureTitle: string;
  tagline: string;
  subTagline: string;
  points: string[];
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  className?: string;
  aspectRatio?: string;
}

function FeatureCard({
  image,
  title,
  description,
  featureTitle,
  tagline,
  subTagline,
  points,
  stat1,
  stat2,
  className = "",
  aspectRatio = "aspect-square",
}: FeatureCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`relative group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${aspectRatio} ${className}`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20 px-8 text-center">
            <Button className="bg-[#B87CFF] text-white hover:bg-[#A666FF] rounded-full px-10 py-7 font-bold text-xl shadow-xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500">
              Lihat selengkapnya
            </Button>
          </div>

          {/* Glassmorphism Info Bar */}
          <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-lg z-10 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-dm-sans">{title}</h3>
            <p className="text-sm text-gray-800 font-medium leading-relaxed font-inter">{description}</p>
          </div>
        </div>
      </DialogTrigger>

      {/* ── DIALOG MODAL ── */}
      <DialogContent
        className="max-w-3xl p-0 rounded-[2rem] border-none bg-white md:overflow-hidden max-h-[90vh] md:max-h-none overflow-y-auto w-[95vw] md:w-full"
        data-lenis-prevent
      >
        <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[440px]">

          {/* LEFT — Image + dark gradient + caption */}
          <div className="relative w-full md:w-[44%] min-h-[220px] md:min-h-full flex-shrink-0 overflow-hidden">
            <Image src={image} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-bold text-base leading-snug mb-1">{title}</p>
              <p className="text-white/65 text-xs leading-relaxed">{description}</p>
            </div>
          </div>

          {/* RIGHT — Feature details */}
          <div className="flex-1 flex flex-col justify-center gap-5 p-6 md:p-8 shrink-0">

            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#DDE7FF] w-fit">
              <span className="text-[10px] font-bold text-[#3B66D1] uppercase tracking-widest">
                Fitur Unggulan
              </span>
            </div>

            {/* Feature title */}
            <div>
              <h2 className="text-[1.6rem] md:text-[1.75rem] font-bold text-gray-900 font-dm-sans leading-tight mb-2">
                {featureTitle}
              </h2>
              <p className="text-sm font-semibold text-gray-700">{tagline}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{subTagline}</p>
            </div>

            {/* Checklist */}
            <ul className="flex flex-col gap-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-[18px] h-[18px] rounded-full bg-[#3B66D1] flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path
                        d="M1 3.5L3.2 5.5L8 1"
                        stroke="white"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-700 leading-snug">{point}</span>
                </li>
              ))}
            </ul>

            {/* Stats strip */}
            <div className="flex items-center gap-5 pt-4 border-t border-gray-100">
              <div>
                <span className="text-2xl font-bold text-gray-900">{stat1.value}</span>
                <span className="text-xs text-gray-500 ml-1">{stat1.label}</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <span className="text-2xl font-bold text-gray-900">{stat2.value}</span>
                <span className="text-xs text-gray-500 ml-1">{stat2.label}</span>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Feature() {
  return (
    <section className="w-full bg-[#F8FAFC] py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-24">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center px-6 py-2 rounded-full border border-[#DDE7FF] bg-white shadow-sm mb-8">
            <span className="text-sm font-bold text-[#3B66D1] font-inter">Fitur Vivivy</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-dm-sans tracking-tight max-w-3xl">
            Semua yang kamu butuhkan untuk bisnis
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed font-inter font-medium">
            Vivivy hadir dengan fitur-fitur cerdas berbasis AI yang dirancang khusus{" "}
            <br className="hidden md:block" />
            untuk membantu UMKM tumbuh lebih cepat, efisien, dan profesional.
          </p>
        </div>

        {/* Feature Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <FeatureCard
              image="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070&auto=format&fit=crop"
              title="Artificial Intelligence"
              description="AI membantu bisnismu jadi lebih terarah dan kamu bisa auto pilot bisnis kamu"
              featureTitle="AI Strategi bisnis"
              tagline="Bingung mulai dari mana?"
              subTagline="Sistem bantu susun langkah bisnis kamu dari nol"
              points={[
                "Analisis ide berdasarkan modal & target market",
                "Rekomendasi harga dan positioning",
                "Roadmap 30 hari mulai penjualan",
              ]}
              stat1={{ value: "+ 32%", label: "Efisiensi" }}
              stat2={{ value: "500+", label: "UMKM terbantu" }}
              aspectRatio="aspect-[4/3] md:aspect-[3/2]"
            />
            <FeatureCard
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
              title="Konten Otomatis"
              description="Buat konten promosi profesional hanya dengan beberapa klik"
              featureTitle="Konten Otomatis"
              tagline="Hemat waktu, hasil maksimal"
              subTagline="Vivivy generate konten siap pakai untuk semua platform"
              points={[
                "Caption media sosial yang engaging & SEO-friendly",
                "Jadwal posting otomatis setiap hari",
                "Template desain sesuai identitas brand",
              ]}
              stat1={{ value: "80%", label: "Hemat waktu" }}
              stat2={{ value: "3x", label: "Lebih banyak konten" }}
              aspectRatio="aspect-[4/3] md:aspect-square"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <FeatureCard
              image="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
              title="Foto Produk AI"
              description="Hasilkan foto produk berkualitas studio tanpa perlu fotografer"
              featureTitle="Foto Produk AI"
              tagline="Studio foto di genggaman kamu"
              subTagline="Upload foto biasa, Vivivy ubah jadi foto produk profesional"
              points={[
                "Background replacement otomatis",
                "Pencahayaan & komposisi diperbaiki AI",
                "Siap upload ke marketplace & sosmed",
              ]}
              stat1={{ value: "10x", label: "Lebih murah" }}
              stat2={{ value: "2 menit", label: "Per foto produk" }}
              aspectRatio="aspect-[3/4] md:aspect-[4/5]"
            />
            <FeatureCard
              image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
              title="Analisis Pasar"
              description="Pahami kompetitor dan tren pasar sebelum mengambil keputusan bisnis"
              featureTitle="Analisis Pasar"
              tagline="Data, bukan tebak-tebakan"
              subTagline="Vivivy bantu kamu baca kondisi pasar secara real-time"
              points={[
                "Pantau harga & strategi kompetitor",
                "Temukan celah pasar yang belum diisi",
                "Laporan mingguan otomatis ke WhatsApp",
              ]}
              stat1={{ value: "+ 45%", label: "Akurasi keputusan" }}
              stat2={{ value: "1000+", label: "Data poin dianalisis" }}
              aspectRatio="aspect-[3/2] md:aspect-[2/1]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
