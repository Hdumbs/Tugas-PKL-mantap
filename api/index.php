<?php

// Vercel Serverless environment setup for Laravel
$tmpDir = sys_get_temp_dir();
$storageDirs = [
    $tmpDir . '/storage/framework/views',
    $tmpDir . '/storage/framework/sessions',
    $tmpDir . '/storage/framework/cache',
    $tmpDir . '/storage/framework/cache/data',
    $tmpDir . '/storage/logs',
    $tmpDir . '/bootstrap/cache',
];

foreach ($storageDirs as $dir) {
    if (!file_exists($dir)) {
        @mkdir($dir, 0777, true);
    }
}

$_ENV['APP_STORAGE'] = $tmpDir . '/storage';
putenv('APP_STORAGE=' . $tmpDir . '/storage');
$_ENV['VIEW_COMPILED_PATH'] = $tmpDir . '/storage/framework/views';
putenv('VIEW_COMPILED_PATH=' . $tmpDir . '/storage/framework/views');

// Copy pre-seeded SQLite database file
$sqliteTmp = $tmpDir . '/database.sqlite';
$sourceSqlite = __DIR__ . '/../database/database.sqlite';

if (!file_exists($sqliteTmp) || filesize($sqliteTmp) === 0) {
    if (file_exists($sourceSqlite)) {
        @copy($sourceSqlite, $sqliteTmp);
    } else {
        @touch($sqliteTmp);
    }
}

$_ENV['DB_CONNECTION'] = 'sqlite';
putenv('DB_CONNECTION=sqlite');
$_ENV['DB_DATABASE'] = $sqliteTmp;
putenv('DB_DATABASE=' . $sqliteTmp);

require __DIR__ . '/../public/index.php';
