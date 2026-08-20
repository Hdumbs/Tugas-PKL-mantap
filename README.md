# 🥗 Vitality Grid — Web Food Calories Scanner & Executive Analytics

> **Web Application untuk Pelanggan Amidyas Superfood**  
> *Memindai kandungan nutrisi & kalori makanan secara instan dengan teknologi Gemini AI & Dashboard Analitik Eksekutif.*

---

## 🚀 Fitur Unggulan

### 📸 Client Scanner App (React.js + Inertia)
- **Live Cyberpunk Scanner:** Viewfinder kamera real-time dengan bingkai laser presisi, *Rule of Thirds alignment grid*, dan dukungan senter (*flashlight*).
- **Gemini AI Vision Recognition (v3.5 Flash Lite):** Mengenali jenis hidangan secara akurat (Kebab, Mac & Cheese, Nasi Goreng, Pizza, dll) & mendeteksi gambar non-makanan secara otomatis.
- **Rincian Gizi Instan (Vitality Grid):** Menampilkan estimasi kalori (kcal), 4 grafik makronutrisi (Protein, Lemak, Karbohidrat, Gula), daftar bahan, dan manfaat kesehatan.
- **Sistem Rating & Ulasan:** Pelanggan dapat memberikan bintang (1–5), status rekomendasi (Ya/Tidak), serta saran rasa.
- **Survei Kepuasan:** Mengisi survei kepuasan makanan & layanan restoran setelah proses scan selesai.

### 📊 Admin Executive Portal (Laravel 12)
- **Analisis Omzet Real-time:** Menghitung estimasi revenue dari transaksi scan pelanggan.
- **AI Executive Sales Advisor:** Asisten AI interaktif untuk owner yang menganalisis makanan terlaris hari ini, menu kurang laku, dan strategi penjualan.
- **Visual Chart Interactive:** Line chart tren pemindaian 7 hari & doughnut chart kepuasan rasa pelanggan berbasis *Chart.js*.
- **Team Management:** Kelola hak akses staf (*Super Admin, Editor, Viewer*) dan undangan admin baru.
- **AI Telemetry Database:** Log lengkap waktu latensi, persentase *AI confidence*, dan riwayat scan.

---

## 🛠️ Technology Stack

- **Front-End:** React.js, Tailwind CSS v4, Lucide Icons, Chart.js, Inertia.js
- **Back-End:** Laravel 12 (PHP 8.5)
- **AI Engine:** Google Gemini AI API (`gemini-3.5-flash-lite`)
- **Database:** SQLite / MySQL

---

## ⚙️ Cara Memulai (Local Setup)

### 1. Clone Repository
```bash
git clone https://github.com/Hdumbs/Tugas-PKL-mantap.git
cd Tugas-PKL-mantap
```

### 2. Install Dependensi PHP & NPM
```bash
composer install
npm install
```

### 3. Konfigurasi `.env`
Salin `.env.example` ke `.env` lalu masukkan API Key Gemini AI:
```env
APP_NAME="Vitality Grid"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
GEMINI_API_KEY=masukkan_gemini_api_key_disini
```

### 4. Jalankan Migrasi & Database Seeder
```bash
php artisan migrate --seed
```

### 5. Compile Asset & Jalankan Server
```bash
# Build Frontend
npm run build

# Start Server
php artisan serve
```

Akses di browser:
- **Aplikasi Web / Scanner:** `http://127.0.0.1:8000`
- **Portal Admin:** `http://127.0.0.1:8000/admin/login`
- **Kredensial Admin:** `admin@amidyas.com` / `password123`

---

## 👨‍💻 Developer & Institusi

- **Developer:** Dafha Febyhansyah (Full Stack Developer)
- **Client:** Amidyas Superfood
- **Institusi:** SMK SKYE DIGIPRENEUR SCHOOL
- **Versi Project:** 1.0.2

---
*Created with ❤️ for Amidyas Superfood.*
