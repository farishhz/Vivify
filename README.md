# 🚀 Vivivy
Visual Intelligence System for Enterprise Network Transformation and Revenue Acceleration

**KRENOVA Kota Surakarta 2026 SMK Negeri 6 Surakarta Tim A**
**Bidang Fokus:** Teknologi Informasi dan Komunikasi

---

**📌 Tentang Vivivy**

Vivivy adalah platform berbasis Generative AI yang dirancang untuk membantu UMKM dalam mempercepat pembuatan konten visual, mengoptimalkan interaksi di media sosial, dan meningkatkan potensi pendapatan melalui wawasan berbasis data.

Fitur utama:
- Menghasilkan konten visual promosi otomatis
- Membuat caption kontekstual berbasis AI
- Menganalisis performa engagement
- Memberikan prediksi interaksi mingguan–bulanan

Platform ini dibangun menggunakan `Next.js` sebagai fullstack framework (Frontend + API Routes).

---

**🏗 Tech Stack**

- `Next.js`
- `React`
- `Tailwind CSS`
- `Node.js`
- Integrasi `Generative AI` (OpenAI / model lain)
- Cloud deployment ready (Vercel / VPS)

---

**📂 Struktur Project (ringkas)**

- `/app` atau `/pages` → Routing
- `/components` → Komponen reusable
- `/public` → Static assets
- `/styles` → Styling
- `/pages/api` atau `/app/api` → Backend API Routes

---

**🛠 Cara Menjalankan Project (Development)**

1. Clone repository

```bash
git clone https://github.com/elnoahcc/Vivivy.git
cd Vivivy
```

2. Install dependencies

```bash
npm install
```

Jika koneksi lambat, tingkatkan percobaan unduhan:

```bash
npm config set fetch-retries 5
```

3. Jalankan development server

```bash
npm run dev
```

Buka browser: `http://localhost:3000`

---

**🚀 Cara Deployment**

Karena menggunakan `Next.js`, cara paling mudah adalah menggunakan Vercel.

**🔵 Deployment via Vercel (Recommended)**

1. Install Vercel CLI

```bash
npm install -g vercel
```

2. Login dan deploy

```bash
vercel login
vercel
```

Untuk deploy production:

```bash
vercel --prod
```

Setiap push ke branch yang terhubung akan memicu auto-deploy jika diatur.

**🟢 Deployment via VPS (Advanced)**

1. Install `Node.js` pada server
2. Clone repository
3. `npm install`
4. Build production: `npm run build`
5. Start production: `npm start`

Disarankan menggunakan `pm2` untuk manajemen proses:

```bash
npm install -g pm2
pm2 start npm --name "Vivivy" -- start
```

---

**📊 Status Kesiapan**

- Technology Readiness Level: TRL 7–8
- Prototype berjalan di lingkungan operasional
- Siap menuju tahap komersialisasi dan skala nasional

---

**👨‍💻 Pengembang**

-   Alfarisi Azmir

---

**📈 Dampak Inovasi**

- Efisiensi produksi konten >50%
- Potensi peningkatan omzet hingga 26%
- Akselerasi digitalisasi UMKM Indonesia

---

**📄 Lisensi**

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - Lihat file LICENSE untuk detail lebih lanjut.

© 2026 Alfarisi Azmir

