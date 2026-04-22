"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Scroll to top"
      onClick={scrollToTop}
      style={{ backgroundColor: "#1E2D5A" }}
      className={`fixed bottom-6 right-6 z-999 p-3 rounded-full text-white shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E2D5A]/50 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
