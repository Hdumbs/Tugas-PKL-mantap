# 🥗 Amidyas Food Scanner — AI Web Food Calories Scanner & Admin Portal

> **Aplikasi Web Pemindai Kalori & Gizi Makanan Real-Time untuk Amidyas Superfood**  
> *Menganalisis nutrisi hidangan secara instan menggunakan Gemini 3.5 AI, lengkap dengan Dashboard Analitik & AI Business Advisor.*

---

## 🚀 Fitur Utama Project

### 📸 Client Scanner App (React.js + Inertia)
- **Desktop & Mobile Responsive Scanner:** Tampilan antarmuka *Clean CHIA Design System* yang elegan, responsif untuk laptop, tablet, dan smartphone.
- **Deteksi Presisi Gemini AI 3.5 Lite:** Mengenali berbagai jenis hidangan (Kebab, Mac & Cheese, Nasi Goreng, Pizza, Salad, Sup, dll) dalam waktu super cepat (~1.5 detik).
- **Validasi Makanan Otomatis:** Menolak secara otomatis jika gambar yang difoto/diunggah bukan makanan/minuman dengan notifikasi *"Scan gagal, makanan tidak terdeteksi"*.
- **Rincian Gizi Lengkap:** Menampilkan total kalori (kcal), 4 makronutrisi (Protein, Lemak, Karbohidrat, Gula), daftar bahan utama, dan manfaat kesehatan.
- **Sistem Rating & Survei:** Mengumpulkan ulasan bintang pelanggan & survei kepuasan rasa hidangan.

### 📊 Admin Portal & AI Executive Advisor (Laravel 12)
- **AI Executive Sales Advisor (Gemini 3.5):** Asisten AI interaktif untuk owner resto yang dapat menjawab pertanyaan seputar menu paling laris, menu kurang laku, dan analisis omzet harian secara real-time.
- **Dashboard Analitik Penjualan:** Perhitungan otomatis estimasi revenue resto, line chart tren pemindaian 7 hari, dan doughnut chart kepuasan rasa pelanggan.
- **Team & Role Management (RBAC):** Super Admin berhak mengelola akun admin, memilih role (*Super Admin, Editor, Viewer*), membuat password custom, serta mereset/edit password staf.

---

## 🛠️ Technology Stack

- **Front-End:** React.js, Tailwind CSS, Inertia.js, Lucide Icons, Chart.js
- **Back-End:** Laravel 12 (PHP 8.5)
- **AI Engine:** Google Gemini AI Vision API (`gemini-3.5-flash-lite`)
- **Database:** SQLite

---

## ⚡ Cara Menjalankan Project (1-Click Run)

### Cara Cepat (Menggunakan Script `.bat`):
1. Buka folder project **`Scan-Calories-food`**.
2. **Klik dua kali (double-click)** pada file **`run-local.bat`** (atau jalankan `.\run-local.bat` di PowerShell).
3. Script otomatis akan menyiapkan database SQLite, menjalankan seeding data admin, mem-build aset frontend, dan menyalakan server di **Port 8000**.

---

## 🌐 Akses Web & Kredensial Login

- **Aplikasi Web / Scanner (Local):** `http://127.0.0.1:8000`
- **Akses dari HP (Satu Wi-Fi):** `http://192.168.1.22:8000` *(Sesuaikan dengan IPv4 laptop)*
- **Admin Portal Login:** `http://127.0.0.1:8000/admin/login`

### 🔑 Kredensial Login Default Admin:
- **Email:** `admin@amidyas.com`
- **Password:** `password123`

---

## 📷 Solusi Pemecahan Masalah Kamera (Camera Troubleshooting)

Kebijakan keamanan browser (Chrome/Safari) hanya mengizinkan fungsi kamera langsung pada koneksi **HTTPS** atau **`127.0.0.1`**.

1. **Cara Paling Praktis (Semua Perangkat):**  
   Gunakan tombol **`[Pilih Gambar Makanan]`** di samping kanan scanner. Tombol ini otomatis membuka kamera HP/Laptop secara langsung dari sistem.
2. **Cara Mengaktifkan Kamera Langsung di HP/Laptop (Via IP Local):**  
   - Buka Chrome di HP / Laptop.
   - Buka link: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
   - Masukkan alamat IP: `http://192.168.1.22:8000` (pilih **Enabled** $\rightarrow$ Relaunch browser).

---

## 👨‍💻 Pengembang & Institusi

- **Developer:** Dafha Febyhansyah (Full Stack Developer)
- **Client:** Amidyas Superfood
- **Institusi:** SMK SKYE DIGIPRENEUR SCHOOL
- **Versi Project:** 1.0.2
