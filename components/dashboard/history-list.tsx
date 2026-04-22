"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Calendar,
  Package,
  Trash2,
  Eye,
  Loader2,
  ImageIcon,
  Search,
} from "lucide-react";
import type { HistoryRecord } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface HistoryListProps {
  onSelectHistory: (history: HistoryRecord) => void;
  searchQuery?: string;
}

export function HistoryList({
  onSelectHistory,
  searchQuery = "",
}: HistoryListProps) {
  const [histories, setHistories] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historyToDelete, setHistoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const response = await fetch("/api/history", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistories(data.data);
      }
    } catch (error) {
      console.error("Error fetching histories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!historyToDelete) return;

    setDeletingId(historyToDelete);
    try {
      const { data: sessionData } = (await supabase?.auth.getSession()) || {};
      const token = sessionData?.session?.access_token;

      const response = await fetch(`/api/history/${historyToDelete}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setHistories(histories.filter((h) => h.id !== historyToDelete));
        toast.success("Riwayat berhasil dihapus");
      } else {
        toast.error("Gagal menghapus riwayat");
      }
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Gagal menghapus riwayat");
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setHistoryToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-in fade-in duration-700">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">
          Memuat riwayat generasi...
        </p>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="text-center py-24 animate-in zoom-in-95 duration-700 bg-muted/20 border border-border/50 rounded-[2rem]">
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Package className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mb-3">
          Belum Ada Riwayat
        </h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Mulai generate strategi produk pertama Anda dan saksikan riwayatnya
          tersimpan secara otomatis di sini.
        </p>
      </div>
    );
  }

  const filteredHistories = histories.filter((h) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      h.product_info.toLowerCase().includes(query) ||
      h.result.nama_produk?.toLowerCase().includes(query) ||
      h.result.kategori_produk?.toLowerCase().includes(query)
    );
  });

  if (filteredHistories.length === 0 && histories.length > 0) {
    return (
      <div className="text-center py-24 animate-in zoom-in-95 duration-700 bg-muted/20 border border-border/50 rounded-[2rem]">
        <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-border/50">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mb-3">
          Tidak Ditemukan
        </h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Tidak ada riwayat produk yang cocok dengan pencarian "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-700">
      {filteredHistories.map((history) => {
        const posterCount = history.generated_images
          ? Object.keys(history.generated_images).length
          : 0;

        return (
          <Card
            key={history.id}
            className="cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 border-0 shadow-lg bg-card rounded-[2rem] overflow-hidden relative"
            onClick={() => onSelectHistory(history)}
          >
            <div className="absolute inset-x-0 -top-full h-full bg-gradient-to-b from-primary/5 to-transparent transition-all duration-500 ease-out group-hover:top-0 pointer-events-none" />

            <CardContent className="p-0 relative z-10">
              {/* Product Image Banner */}
              <div className="aspect-video w-full bg-muted/50 overflow-hidden relative border-b border-border/50">
                <img
                  src={history.product_image}
                  alt="Product"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold truncate text-lg drop-shadow-md">
                    Buka Hasil Analisis
                  </p>
                </div>

                {/* Floating Date Badge */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/50 flex items-center gap-2 shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {formatDate(history.created_at)}
                  </span>
                </div>
              </div>

              {/* Info section */}
              <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-muted/10">
                <CardTitle className="text-base font-extrabold line-clamp-2 leading-tight min-h-[40px] group-hover:text-primary transition-colors duration-300">
                  {history.product_info}
                </CardTitle>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary truncate max-w-[120px] px-2.5 py-1 border-0 rounded-lg"
                  >
                    {history.result.kategori_produk}
                  </Badge>

                  {posterCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs font-bold gap-1.5 px-2.5 py-1 border-border/80 shadow-inner bg-background rounded-lg"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                      {posterCount} AI
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl font-bold bg-foreground text-background hover:bg-primary gap-2 transition-all shadow-md group-hover:shadow-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHistory(history);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Lihat
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-xl border-border/80 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
                    onClick={(e) => openDeleteDialog(history.id, e)}
                    disabled={deletingId === history.id}
                  >
                    {deletingId === history.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] p-8 border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black">
              Hapus Riwayat Generate?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium text-muted-foreground/80 leading-relaxed">
              Tindakan ini permanen. Seluruh data analisis, strategi, ide
              konten, dan poster yang telah di-generate akan ikut terhapus dari
              sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl font-bold border-0 bg-muted hover:bg-muted/80">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
