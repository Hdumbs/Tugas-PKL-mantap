@echo off
title Amidyas Food Scanner Local Launcher
echo ===================================================
echo     AMIDYAS FOOD SCANNER LOCAL STARTER
echo ===================================================
echo.
echo [1/4] Detecting Local IP Address...

for /f "tokens=*" %%a in ('powershell -Command "Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi','Ethernet' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty IPAddress | Select-Object -First 1"') do (
    set MY_IP=%%a
)

if "%MY_IP%"=="" (
    set MY_IP=127.0.0.1
)

echo [2/4] Checking SQLite database...
if not exist "database\database.sqlite" (
    echo Database missing, creating database.sqlite...
    type NUL > database\database.sqlite
)

echo [3/4] Running migrations and seeding initial data...
php artisan migrate --force
php artisan db:seed --force

echo [4/4] Building production assets...
call npm run build

echo.
echo ===================================================
echo   SERVER BERJALAN PADA:
echo   Web Local Laptop : http://127.0.0.1:8000
echo   Web HP (Wi-Fi)   : http://%MY_IP%:8000
echo.
echo   Admin Portal     : http://127.0.0.1:8000/admin/login
echo   Admin Email      : admin@amidyas.com
echo   Admin Pass       : password123
echo ===================================================
echo.

php artisan serve --host=0.0.0.0 --port=8000
pause
