@echo off
title Amidyas Food Scanner Local Launcher
echo ===================================================
echo     AMIDYAS FOOD SCANNER LOCAL STARTER
echo ===================================================
echo.
echo [1/3] Checking SQLite database...
if not exist "database\database.sqlite" (
    echo Database missing, creating database.sqlite...
    type NUL > database\database.sqlite
)

echo [2/3] Running migrations and seeding initial data...
php artisan migrate --force
php artisan db:seed --force

echo [3/3] Building production assets...
call npm run build

echo.
echo ===================================================
echo   SERVER SUCCESSFUL!
echo   App Scanner: http://127.0.0.1:8000
echo   Admin Portal: http://127.0.0.1:8000/admin/login
echo.
echo   Admin Email: admin@amidyas.com
echo   Admin Pass : password123
echo ===================================================
echo.

php artisan serve --host=0.0.0.0 --port=8000
pause
