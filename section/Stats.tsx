import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Stats() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F1F5F9] pb-16 md:pb-24 pt-8 md:pt-12">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="flex flex-col gap-12">

          {/* Main Visual Placeholder */}
          <div className="relative w-full max-w-6xl mx-auto overflow-visible z-10">

            {/* Background Image that bleeds out */}
            <div className="absolute inset-y-0 w-[220%] sm:w-[150%] md:w-full left-1/2 -translate-x-1/2 rounded-2xl md:rounded-[2rem] overflow-hidden -z-10">
              <Image
                src="/hero/about.svg"
                alt="Vivivy Brand Visual"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Overlay Content - Stays within normal container bounds */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[1728/800] flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 md:mb-6">
                <Image
                  src="/hero/logo/logo-white.svg"
                  alt="Vivivy White Logo"
                  width={280}
                  height={80}
                  className="w-32 sm:w-48 md:w-64 h-auto drop-shadow-md"
                />
              </div>
              <p className="text-white text-lg md:text-2xl font-bold max-w-2xl leading-relaxed font-inter drop-shadow-md px-4 sm:px-0">
                Solusi bisnis untuk umkm remaja yang ingin <br className="hidden md:block" />
                memulai bisnis
              </p>
            </div>
          </div>

          {/* Bottom Content - Info */}
          <div className="max-w-4xl pt-4">
            <div className="inline-block relative mb-6">
              <h2 className="text-4xl md:text-5xl font-bold font-dm-sans text-gray-900 leading-tight">
                Apa itu Vivivy
              </h2>
              {/* Thick custom underline */}
              <div className="absolute -bottom-2 left-0 w-3/4 h-1 bg-gray-400/50 rounded-full" />
            </div>

            <p className="text-lg md:text-xl text-gray-700 font-medium leading-[1.6] font-inter max-w-3xl">
              Vivivy adalah sebuah platform yang membantu <br className="hidden md:block" />
              umkm untuk menjalankan bisnis mereka terutama <br className="hidden md:block" />
              remaja yang takut memulai sebuah bisnis
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
