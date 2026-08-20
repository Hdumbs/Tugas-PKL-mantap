<?php

namespace App\Http\Controllers;

use App\Models\Scan;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ScanController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function index(): Response
    {
        return Inertia::render('Scanner');
    }

    public function result(string $code): Response
    {
        $scan = Scan::with(['review', 'user'])->where('scan_code', $code)->firstOrFail();

        return Inertia::render('ScanResult', [
            'scan' => $scan,
        ]);
    }

    public function history(): Response
    {
        $scans = Scan::with('review')->latest()->take(20)->get();

        return Inertia::render('History', [
            'scans' => $scans,
        ]);
    }

    public function processScan(Request $request)
    {
        $request->validate([
            'image' => 'nullable|string',
        ]);

        $imageBase64 = null;
        $mimeType = 'image/jpeg';
        $storedUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

        if ($request->filled('image')) {
            $raw = $request->input('image');
            if (str_contains($raw, ';base64,')) {
                [$header, $data] = explode(';base64,', $raw);
                $imageBase64 = $data;
                if (str_contains($header, 'image/png')) {
                    $mimeType = 'image/png';
                } elseif (str_contains($header, 'image/webp')) {
                    $mimeType = 'image/webp';
                }
                $storedUrl = $raw;
            } else {
                $imageBase64 = $raw;
            }
        }

        $analysis = $this->geminiService->analyzeFoodImage($imageBase64, $mimeType);

        if (isset($analysis['is_food']) && $analysis['is_food'] === false) {
            return back()->withErrors([
                'scan_error' => $analysis['error'] ?? 'Scan gagal, makanan tidak terdeteksi'
            ]);
        }

        $scan = Scan::create([
            'scan_code' => 'VG-' . Str::upper(Str::random(6)),
            'user_id' => auth()->id(),
            'food_name' => $analysis['food_name'] ?? 'Pemindaian Makanan',
            'image_url' => $storedUrl,
            'calories' => $analysis['calories'] ?? 400,
            'macronutrients' => $analysis['macronutrients'] ?? [
                'protein' => '25g',
                'fats' => '12g',
                'carbs' => '40g',
                'sugar' => '5g',
            ],
            'ingredients' => $analysis['ingredients'] ?? ['Bahan Makanan Segar'],
            'benefits' => $analysis['benefits'] ?? ['Memberikan asupan energi seimbang.'],
            'ai_confidence' => $analysis['confidence'] ?? 98.0,
            'latency_ms' => $analysis['latency_ms'] ?? 220,
        ]);

        return redirect()->route('scan.result', ['code' => $scan->scan_code]);
    }
}
