"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Beranda", href: "#" },
  { label: "Tentang", href: "#" },
  { label: "Fitur", href: "#" },
  { label: "Kontak kami", href: "#" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 md:px-8">
        <div className={`container mx-auto max-w-7xl transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-white shadow-md"
          } rounded-full py-2 px-4 md:px-6 lg:px-10 flex items-center justify-between border border-gray-100/50`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/hero/logo/logo.svg"
              alt="Vivivy Logo"
              width={140}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[15px] font-semibold text-gray-800 hover:text-indigo-600 transition-colors font-inter"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/workspace">
              <Button className="h-11 px-8 rounded-2xl bg-[#5E5CED] hover:bg-[#4F4DBE] text-white font-bold text-base shadow-lg shadow-indigo-100 transition-all hover:scale-105">
                Mulai Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-gray-800 p-2"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[70] md:hidden transform transition-transform duration-500 ease-out shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <span className="text-xl font-bold font-dm-sans text-[#93A5ED]">Vivivy</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-6">
            <div className="flex flex-col gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-all ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-50">
            <Link href="/workspace" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full h-12 rounded-xl bg-[#5E5CED] text-white font-bold text-lg">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
