@echo off
title Amidyas Food Scanner Launcher
echo ===================================================
echo     AMIDYAS FOOD SCANNER - STARTER SCRIPT
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Memeriksa & Mengkompilasi Aset Frontend (Vite/React)...
call npm run build

echo.
echo [2/3] Menginisialisasi Database SQLite & Migrasi Data...
call php artisan migrate --force
call php artisan db:seed --force

echo.
echo [3/3] Menjalankan Server Laravel (Port 8000)...
echo.
echo ===================================================
echo  Aplikasi Berhasil Berjalan!
echo  - Akses Laptop / PC : http://localhost:8000
echo  - Akses HP (WiFi)   : http://192.168.1.13:8000
echo  - Login Admin       : http://localhost:8000/admin/login
echo  - Email Admin       : admin@amidyas.com
echo  - Password Admin    : password123
echo ===================================================
echo.

php artisan serve --host=0.0.0.0 --port=8000
pause
