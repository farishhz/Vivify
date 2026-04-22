import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  usefulInfo: [
    { name: "Produk", href: "/#events" },
    { name: "Bantuan", href: "/#how-it-works" },
    { name: "FAQ", href: "/#faq" },
  ],
  exploreMore: [
    { name: "Tentang Kami", href: "/#about" },
    { name: "Testimoni", href: "/#testimonials" },
    { name: "Kontak", href: "/#contact" },
  ],
};

const socialMedia = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#1E2D5A" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-10 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-6">
            <Image
              src="/hero/logo/logo-white.svg"
              alt="Brand Logo"
              className="w-32 sm:w-40 lg:w-42"
              width={180}
              height={60}
            />
            <p className="text-xs sm:text-sm leading-relaxed text-white/70">
              Kami hadir untuk mempermudah UMKM di Indonesia untuk mempermudah
              bisnisnya. Memberikan solusi nyaman, dan modern
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {socialMedia.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="group flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 hover:bg-accent"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Useful Info */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-background">
              Layanan
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.usefulInfo.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 transition-colors duration-300 hover:text-white text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore More */}
          <div>
            <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-background">
              Jelajahi Lebih
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.exploreMore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 transition-colors duration-300 hover:text-white text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 lg:mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 lg:pt-8 md:flex-row">
          <p className="text-xs sm:text-sm text-white/60 text-center md:text-left">
            © {new Date().getFullYear()} All Right Reserved by Vivivy -{" "}
            <a
              href="https://instagram.com/farhsvvn_"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-white"
            >
              SMKN 8 JAKARTA - Faris
            </a>
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/privacy"
              className="text-xs sm:text-sm text-white/60 transition-colors hover:text-white"
            >
              Kebijakan Privasi
            </a>
            <a
              href="/terms"
              className="text-xs sm:text-sm text-white/60 transition-colors hover:text-white"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
