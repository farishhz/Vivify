export interface TargetMarket {
  usia: string;
  gender: string;
  segment: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ContentDay {
  hari: number;
  caption: string;
  hashtag: string[];
}

export interface BrandPersona {
  tone: string;
  style: string;
  karakter: string;
}

export interface GeminiResponse {
  nama_produk: string;
  deskripsi_produk: string;
  kategori_produk: string;
  target_market: TargetMarket;
  selling_point: string[];
  rekomendasi_harga: PriceRange;
  paket_konten_7_hari: ContentDay[];
  brand_persona: BrandPersona;
  waktu_posting_terbaik: string[];
  key_message_brand: string;
}

export interface HistoryRecord {
  id: string;
  created_at: string;
  product_image: string;
  product_info: string;
  result: GeminiResponse;
  generated_images?: Record<number, string>;
}
