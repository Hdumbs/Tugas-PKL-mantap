<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', env('GEMINI_API_KEY'));
    }

    public function askAiAdvisor(string $userQuestion, array $salesContext): string
    {
        if (!$this->apiKey) {
            return "Maaf, API Key Gemini belum terpasang.";
        }

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$this->apiKey}";

            $topDishes = json_encode($salesContext['top_dishes'] ?? []);
            $recentScans = json_encode($salesContext['recent_scans'] ?? []);
            $totalSales = $salesContext['total_scans'] ?? 0;
            $avgRating = $salesContext['avg_rating'] ?? 4.8;

            $prompt = "Kamu adalah Executive AI Sales & Business Advisor cerdas untuk owner resto Amidyas Superfood (Vitality Grid).
Berikut data bisnis terkini resto kami:
- Total Pemindaian & Pesanan: {$totalSales}
- Rata-rata Rating Pelanggan: {$avgRating} / 5
- Menu Terlaris Hari Ini: {$topDishes}
- Log Pemindaian Terakhir: {$recentScans}

Pertanyaan Owner: \"{$userQuestion}\"

Tugasmu: Berikan analisis penjualan terbaik, menu kurang laku, serta saran strategi bisnis konkrit singkat (maksimal 3 paragraf), ramah, profesional, dan solutif dalam Bahasa Indonesia.";

            $response = Http::timeout(15)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? "Maaf, AI belum bisa memberikan analisis saat ini.";
            }
        } catch (\Throwable $e) {
            Log::error('Gemini Advisor Error: ' . $e->getMessage());
        }

        return "Maaf, terjadi gangguan koneksi AI Advisor. Silakan coba lagi.";
    }

    public function analyzeFoodImage(?string $imageBase64, ?string $mimeType = 'image/jpeg'): array
    {
        $startTime = microtime(true);

        if (!$this->apiKey || !$imageBase64) {
            return $this->getScanFailedResult($startTime, 'Scan gagal, makanan tidak terdeteksi');
        }

        try {
            // Using fast Gemini 3.5 Flash Lite
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$this->apiKey}";

            $prompt = "Kamu adalah sistem analisis makanan AI presisi tinggi untuk Amidyas Superfood.

TUGAS UTAMA:
1. Analisis apakah gambar ini berisi makanan, minuman, hidangan, kue, cemilan, pasta, atau bahan konsumsi.
- Jika BUKAN makanan/minuman sama sekali (misal: wajah manusia, dokumen, kendaraan, hewan hidup, peralatan elektronik, ruangan kosong), set \"is_food\": false, \"error\": \"Scan gagal, makanan tidak terdeteksi\".
- Jika ADALAH makanan/minuman (termasuk Mac and Cheese, Pasta, Kebab, Nasi, Sup, Burger, Salad, Dessert, dll), set \"is_food\": true.

2. Jika is_food = true, tuliskan nama hidangan secara spesifik dalam Bahasa Indonesia (contoh: Mac and Cheese, Kebab Daging Sapi, Spaghetti Carbonara, Ayam Goreng, Nasi Uduk).

Keluaran HARUS format JSON mentah tanpa pembalut markdown:
{
  \"is_food\": true,
  \"food_name\": \"Nama Spesifik Makanan\",
  \"calories\": 480,
  \"macronutrients\": {
    \"protein\": \"22g\",
    \"fats\": \"18g\",
    \"carbs\": \"48g\",
    \"sugar\": \"4g\"
  },
  \"ingredients\": [\"Bahan Utama 1\", \"Bahan 2\", \"Bahan 3\"],
  \"benefits\": [\"Manfaat kesehatan 1 dalam Bahasa Indonesia\", \"Manfaat 2\"],
  \"confidence\": 98.0
}";

            $response = Http::timeout(15)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                            [
                                'inline_data' => [
                                    'mime_type' => $mimeType,
                                    'data' => $imageBase64,
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            $latency = (int) round((microtime(true) - $startTime) * 1000);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                $cleanJson = preg_replace('/```(?:json)?/i', '', $text);
                $cleanJson = trim($cleanJson);

                $parsed = json_decode($cleanJson, true);

                if (is_array($parsed)) {
                    $parsed['latency_ms'] = $latency;

                    if (array_key_exists('is_food', $parsed) && $parsed['is_food'] === false) {
                        return [
                            'is_food' => false,
                            'error' => $parsed['error'] ?? 'Scan gagal, makanan tidak terdeteksi',
                            'latency_ms' => $latency,
                        ];
                    }

                    if (!empty($parsed['food_name'])) {
                        $parsed['is_food'] = true;
                        return $parsed;
                    }
                } else {
                    Log::warning('Gemini JSON decode failed. Raw text: ' . $text);
                }
            } else {
                Log::warning('Gemini API Error (' . $response->status() . '): ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
        }

        return $this->getScanFailedResult($startTime, 'Scan gagal, makanan tidak terdeteksi');
    }

    protected function getScanFailedResult(float $startTime, string $msg): array
    {
        $latency = (int) round((microtime(true) - $startTime) * 1000);
        return [
            'is_food' => false,
            'error' => $msg,
            'latency_ms' => max(200, $latency),
        ];
    }
}
