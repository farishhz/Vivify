"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Key,
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ImageIcon,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [geminiKey, setGeminiKey] = useState("");
  const [deapiKey, setDeapiKey] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [showDeapi, setShowDeapi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [hasDeapiKey, setHasDeapiKey] = useState(false);

  useEffect(() => {
    if (user) {
      fetchKeys();
    }
  }, [user]);

  const fetchKeys = async () => {
    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const response = await fetch("/api/settings", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setHasGeminiKey(!!data.data.gemini_api_key);
          setHasDeapiKey(!!data.data.deapi_api_key);
          // Show masked keys
          if (data.data.gemini_api_key) {
            setGeminiKey(data.data.gemini_api_key);
          }
          if (data.data.deapi_api_key) {
            setDeapiKey(data.data.deapi_api_key);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          gemini_api_key: geminiKey || undefined,
          deapi_api_key: deapiKey || undefined,
        }),
      });

      if (response.ok) {
        toast.success("API Key berhasil disimpan!");
        setHasGeminiKey(!!geminiKey);
        setHasDeapiKey(!!deapiKey);
      } else {
        const errData = await response.json();
        toast.error(errData.details ? `${errData.error}: ${errData.details}` : (errData.error || "Gagal menyimpan API Key"));
      }
    } catch (error: any) {
      toast.error("Gagal menyimpan API Key. Pastikan koneksi internet stabil.");
    } finally {
      setSaving(false);
    }
  };

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return key;
    return (
      key.substring(0, 6) +
      "•".repeat(key.length - 10) +
      key.substring(key.length - 4)
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">
            Kelola API Key untuk menggunakan fitur AI
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                Cara mendapatkan API Key
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>
                  • <strong>Gemini API Key</strong>: Daftar di{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>
                  • <strong>DeAPI Key</strong>: Daftar di{" "}
                  <a
                    href="https://deapi.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    deapi.ai
                  </a>{" "}
                  (untuk generate poster)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Gemini API Key */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center p-1.5">
                      <Image
                        src="/logo/gemini.svg"
                        alt="Gemini"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    Gemini API Key
                  </CardTitle>
                  {hasGeminiKey ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terkonfigurasi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Belum diatur
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="geminiKey"
                    className="text-sm text-muted-foreground"
                  >
                    Digunakan untuk analisis produk AI
                  </Label>
                  <div className="relative">
                    <Input
                      id="geminiKey"
                      type={showGemini ? "text" : "password"}
                      placeholder="AIzaSy..."
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="bg-background pr-10 h-11 font-sans text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGemini(!showGemini)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showGemini ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DeAPI Key */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center p-1.5">
                      <Image
                        src="/logo/deapi.png"
                        alt="DeAPI"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    DeAPI Key
                  </CardTitle>
                  {hasDeapiKey ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terkonfigurasi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Belum diatur
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="deapiKey"
                    className="text-sm text-muted-foreground"
                  >
                    Digunakan untuk generate poster konten
                  </Label>
                  <div className="relative">
                    <Input
                      id="deapiKey"
                      type={showDeapi ? "text" : "password"}
                      placeholder="Masukkan DeAPI Key..."
                      value={deapiKey}
                      onChange={(e) => setDeapiKey(e.target.value)}
                      className="bg-background pr-10 h-11 font-sans text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeapi(!showDeapi)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showDeapi ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="w-full h-12 text-base font-semibold gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
