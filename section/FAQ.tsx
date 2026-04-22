"use client";

import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "Apa itu Vivivy?",
    answer:
      "Vivivy adalah platform berbasis kecerdasan buatan (AI) yang membantu UMKM dan bisnis dalam membangun, menganalisis, dan mengembangkan brand secara efisien. Dengan fitur analisis produk, strategi brand, pembuatan konten otomatis, dan foto produk AI, Vivivy memudahkan seluruh proses dari ide hingga eksekusi.",
  },
  {
    question: "Bagaimana cara kerja Vivivy?",
    answer:
      "Vivivy menganalisis data produk, pasar, dan kompetitor menggunakan teknologi AI mutakhir. Platform ini kemudian memberikan insight, rekomendasi strategi, serta membantu membuat konten pemasaran yang relevan dan efektif — semuanya disesuaikan dengan kebutuhan brand kamu.",
  },
  {
    question: "Apakah data saya aman di Vivivy?",
    answer:
      "Keamanan data kamu adalah prioritas utama kami. Vivivy menggunakan enkripsi end-to-end dan standar keamanan industri untuk melindungi seluruh data pengguna, serta tidak pernah membagikan data ke pihak ketiga tanpa izin eksplisit.",
  },
  {
    question: "Apakah Vivivy berbayar?",
    answer:
      "Vivivy menyediakan paket gratis dengan fitur dasar yang sudah cukup powerful untuk memulai bisnis. Untuk kebutuhan yang lebih kompleks, tersedia paket premium dengan fitur penuh. Kamu bisa meng-upgrade kapan saja tanpa kehilangan data sebelumnya.",
  },
  {
    question: "Apakah saya perlu keahlian teknis untuk menggunakan Vivivy?",
    answer:
      "Tidak sama sekali! Vivivy dirancang khusus untuk pelaku UMKM yang tidak memiliki latar belakang teknis. Antarmuka yang intuitif dan panduan langkah demi langkah memastikan kamu bisa memaksimalkan semua fitur tanpa perlu training khusus.",
  },
  {
    question: "Berapa lama hasilnya bisa terlihat?",
    answer:
      "Banyak pengguna Vivivy sudah merasakan peningkatan signifikan dalam efisiensi operasional dan kualitas konten sejak minggu pertama penggunaan. Untuk peningkatan penjualan, rata-rata pengguna kami melaporkan hasil nyata dalam 30–60 hari pertama.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white relative overflow-hidden">

      <div className="relative z-10 container mx-auto py-16 lg:py-28 px-6 lg:px-24 xl:px-40">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* ── LEFT PANEL ── */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:w-[340px] flex-shrink-0">
            {/* Badge */}
            <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#DDE7FF] w-fit">
              <span className="text-xs font-semibold text-[#3B66D1] uppercase tracking-widest">
                FAQ
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight font-dm-sans">
              Pertanyaan yang{" "}
              <span className="text-[#3B66D1]">sering ditanyakan</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs">
              Belum nemu jawaban yang kamu cari? Hubungi tim kami langsung.
            </p>

            {/* Contact card */}
            <div className="mt-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-[#3B66D1]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Hubungi kami</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  support@Vivivy.id
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="hidden lg:flex items-center gap-2 mt-4">
              {faqData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="transition-all duration-300"
                  style={{
                    height: 4,
                    borderRadius: 9999,
                    backgroundColor: openIndex === i ? "#3B66D1" : "#CBD5E1",
                    width: openIndex === i ? 28 : 12,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL — Accordion ── */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-[#3B66D1]/30 bg-white shadow-md"
                    : "border-gray-200 bg-white hover:border-[#3B66D1]/20 hover:shadow-sm"
                    }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    {/* Number + question */}
                    <div className="flex items-center gap-4 pr-4">
                      <span
                        className={`text-xs font-bold tabular-nums transition-colors duration-200 ${isOpen ? "text-[#3B66D1]" : "text-gray-300"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#3B66D1] transition-colors duration-200">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen
                        ? "bg-[#3B66D1] text-white rotate-180"
                        : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Answer panel */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {/* Left accent bar */}
                    <div className="mx-6 mb-5 flex gap-4">
                      <div className="w-0.5 rounded-full bg-[#3B66D1]/30 flex-shrink-0" />
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
