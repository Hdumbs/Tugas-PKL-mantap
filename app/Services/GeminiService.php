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

            $prompt = "Kamu adalah Executive AI Sales & Business Advisor cerdas untuk owner resto Amidyas Superfood (Amidyas Food Scanner).
Berikut data bisnis terkini resto kami:
- Total Pemindaian & Pesanan: {$totalSales}
- Rata-rata Rating Pelanggan: {$avgRating} / 5
- Menu Terlaris Hari Ini: {$topDishes}
- Log Pemindaian Terakhir: {$recentScans}

Pertanyaan Owner: \"{$userQuestion}\"

Tugasmu: Berikan analisis penjualan terbaik, menu kurang laku, saran strategi promosi konkrit, dan optimasi margin keuntungan resto (maksimal 3 paragraf), ramah, profesional, dan solutif dalam Bahasa Indonesia.";

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

LANGKAH ANALISIS:
1. Periksa apakah gambar berisi makanan/minuman konsumsi. Jika BUKAN makanan/minuman, set \"is_food\": false, \"error\": \"Scan gagal, makanan tidak terdeteksi\".
2. Jika MAKANAN/MINUMAN: Identifikasi nama hidangan spesifik dalam Bahasa Indonesia (contoh: Kebab Daging Sapi Turki, Mac & Cheese Creamy, Salmon Quinoa Bowl, Chicken Salad, Smoothie Bowl, dll).
3. Berikan rincian gizi super mendalam & akurat: Health Score (1-100), Glycemic Index (Rendah/Sedang/Tinggi), Serat (Fiber), Sodium, Mikronutrisi (Vitamin & Mineral), %AKG Harian, Bahan Utama, dan Manfaat Kesehatan Lengkap.

Keluaran HARUS format JSON mentah tanpa pembalut markdown:
{
  \"is_food\": true,
  \"food_name\": \"Nama Spesifik Hidangan\",
  \"health_score\": 94,
  \"glycemic_index\": \"Rendah (Low GI)\",
  \"calories\": 480,
  \"macronutrients\": {
    \"protein\": \"28g\",
    \"fats\": \"16g\",
    \"carbs\": \"48g\",
    \"sugar\": \"4g\",
    \"fiber\": \"7g\",
    \"sodium\": \"420mg\"
  },
  \"micronutrients\": [\"Vitamin A & C\", \"Omega-3 Fatty Acids\", \"Kalsium & Zat Besi\", \"Magnesium\"],
  \"akg_percentage\": {
    \"protein\": 56,
    \"carbs\": 16,
    \"fats font\": 22,
    \"fats\": 22,
    \"fiber\": 28
  },
  \"ingredients\": [\"Bahan Utama 1\", \"Bahan 2\", \"Bahan 3\", \"Bahan 4\"],
  \"benefits\": [\"Manfaat kesehatan 1 lengkap\", \"Manfaat kesehatan 2\", \"Manfaat kesehatan 3\"],
  \"confidence\": 98.5
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
