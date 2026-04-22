"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/workspace");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || "Login gagal");
        } else {
          toast.success("Login berhasil!");
          router.push("/workspace");
        }
      } else {
        if (!fullName.trim()) {
          toast.error("Nama lengkap wajib diisi");
          setIsLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message || "Registrasi gagal");
        } else {
          toast.success(
            "Registrasi berhasil! Silakan cek email untuk konfirmasi."
          );
          setIsLogin(true);
        }
      }
    } catch (err) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return null;

  const features = [
    {
      icon: Zap,
      title: "AI Autopilot",
      desc: "Generate strategi marketing otomatis dari foto produk",
    },
    {
      icon: BarChart3,
      title: "Analisis Produk",
      desc: "Analisis mendalam kategori, target market & harga",
    },
    {
      icon: Shield,
      title: "Data Aman",
      desc: "Riwayat generate tersimpan aman di akun Anda",
    },
  ];

  return (
    <div className="min-h-screen flex font-sans antialiased">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-accent/20 flex-col justify-between p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/hero/logo/logo.svg"
              alt="logo"
              width={500}
              height={500}
              className="w-56 h-auto "
            />
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Strategi Marketing
              <br />
              <span className="text-primary">Otomatis</span> untuk UMKM
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              Upload foto produk, dapatkan strategi branding, konten plan 7
              hari, dan poster AI dalam hitungan detik.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all hover:bg-card/80 hover:border-primary/20"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Vivivy AI. Powered by Gemini AI.
          </p>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <Image
              src="/hero/logo/logo.svg"
              alt="logo"
              width={500}
              height={500}
              className="w-42 h-auto"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isLogin
                ? "Masukkan email dan password untuk melanjutkan"
                : "Daftar gratis untuk mulai menggunakan AI Autopilot"}
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="bg-background h-11"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background h-11"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-background h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 text-base font-semibold gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isLogin ? "Masuk..." : "Membuat akun..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Masuk" : "Daftar"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                className="text-primary font-semibold hover:underline transition-colors"
              >
                {isLogin ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
