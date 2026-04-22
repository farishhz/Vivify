"use client";

import { Quote, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Firmansyah Riza A.",
    role: "Pengusaha Batik",
    initials: "FR",
    accent: "#3B66D1",
    stars: 5,
    text: "Omzet naik 40% dalam 2 bulan.",
  },
  {
    name: "Oktavian Bagas N.",
    role: "Pengusaha Makanan",
    initials: "OB",
    accent: "#B87CFF",
    stars: 5,
    text: "Ketik ide, semua langsung jadi.",
  },
  {
    name: "Sari Permata Dewi",
    role: "Toko Online Fashion",
    initials: "SP",
    accent: "#5B8AF5",
    stars: 5,
    text: "Padahal cuma Vivivy. Serius.",
  },
  {
    name: "Hendri Kurniawan",
    role: "UMKM Kerajinan Kayu",
    initials: "HK",
    accent: "#7B5EA7",
    stars: 5,
    text: "Kayak foto iklan majalah.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < count ? "fill-amber-400 text-amber-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function Testimoni() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      if (window.innerWidth < 640) {
        // Center the scroll position on mobile to show the middle items
        container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      }
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-28">

      <div className="relative z-10 container mx-auto px-6 lg:px-24 xl:px-40">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#DDE7FF] mb-5">
            <span className="text-xs font-semibold text-[#3B66D1] uppercase tracking-widest">
              Testimoni Pengguna
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight font-dm-sans mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            Pengalaman nyata dari pelaku UMKM yang sudah merasakan manfaat{" "}
            <span className="font-semibold text-[#3B66D1]">Vivivy</span>.
          </p>
        </div>

        {/* Testimonials Carousel Wrapper */}
        <div className="-mx-6 sm:mx-auto sm:max-w-3xl">
          <div
            ref={carouselRef}
            className="flex sm:grid sm:grid-cols-2 overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 px-6 sm:px-0 pb-8 sm:pb-0 items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-[85vw] sm:w-auto shrink-0 snap-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Quote icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${t.accent}18` }}
                >
                  <Quote size={16} style={{ color: t.accent }} />
                </div>

                {/* Text */}
                <p className="text-base font-semibold text-gray-800 leading-snug flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: t.accent }}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{t.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.role}</p>
                  </div>
                  <Stars count={t.stars} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: "500+", label: "UMKM Bergabung" },
            { value: "4.9/5", label: "Rating Pengguna" },
            { value: "95%", label: "Tingkat Kepuasan" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
