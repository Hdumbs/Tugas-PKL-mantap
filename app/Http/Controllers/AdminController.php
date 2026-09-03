<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Scan;
use App\Models\User;
use App\Models\Survey;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();
            $user->update(['last_login_at' => now()]);

            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password admin salah.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    public function dashboard(): Response
    {
        $totalScans = Scan::count();
        $avgRatingRaw = Review::avg('rating');
        $avgRating = $avgRatingRaw ? round($avgRatingRaw, 1) : 4.8;
        $activeUsers = User::where('role', 'User')->count() ?: 18;

        $totalSurveys = Survey::count();
        $deliciousSurveys = Survey::where('food_satisfaction', 'Delicious')->count();
        $satisfactionRate = $totalSurveys > 0 ? round(($deliciousSurveys / $totalSurveys) * 100) : 92;

        $estRevenue = $totalScans * 65000;

        $recentScans = Scan::with(['user', 'review'])->latest()->take(6)->get();

        $ratingDist = [
            5 => Review::where('rating', 5)->count() ?: 8,
            4 => Review::where('rating', 4)->count() ?: 4,
            3 => Review::where('rating', 3)->count() ?: 1,
            2 => Review::where('rating', 2)->count() ?: 0,
            1 => Review::where('rating', 1)->count() ?: 0,
        ];

        $topRatedMeals = Scan::select('food_name', 'calories', 'image_url', DB::raw('count(scans.id) as scan_count'))
            ->groupBy('food_name', 'calories', 'image_url')
            ->orderByDesc('scan_count')
            ->take(5)
            ->get();

        $surveyStats = [
            'food_delicious' => Survey::where('food_satisfaction', 'Delicious')->count() ?: 12,
            'food_average' => Survey::where('food_satisfaction', 'Average')->count() ?: 3,
            'food_needs_imp' => Survey::where('food_satisfaction', 'Needs Improvement')->count() ?: 1,
            'service_friendly' => Survey::where('service_quality', 'Fast & Friendly')->count() ?: 14,
            'service_good' => Survey::where('service_quality', 'Good')->count() ?: 2,
            'service_slow' => Survey::where('service_quality', 'Slow')->count() ?: 0,
        ];

        $scanTrend = [
            'labels' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
            'scans' => [45, 62, 58, 80, 95, 120, 110],
            'revenue' => [2925000, 4030000, 3770000, 5200000, 6175000, 7800000, 7150000],
        ];

        $aiInitialInsight = "Berdasarkan analisis penjualan terkini: Menu terlaris hari ini adalah **Grilled Salmon Quinoa Bowl** dengan perolehan kepuasan 94%. Menu yang perlu dipromosikan lebih lanjut adalah **Acai Berry Smoothie** karena frekuensi pemindaiannya masih di bawah rata-rata. Estimasi omzet resto meningkat 14.2% minggu ini.";

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_scans' => $totalScans,
                'avg_rating' => $avgRating,
                'active_users' => $activeUsers,
                'total_surveys' => $totalSurveys,
                'satisfaction_rate' => $satisfactionRate,
                'est_revenue' => 'Rp ' . number_format($estRevenue, 0, ',', '.'),
            ],
            'recent_scans' => $recentScans,
            'rating_distribution' => $ratingDist,
            'top_rated_meals' => $topRatedMeals,
            'survey_stats' => $surveyStats,
            'scan_trend' => $scanTrend,
            'ai_initial_insight' => $aiInitialInsight,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function askAiAdvisor(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $topRatedMeals = Scan::select('food_name', DB::raw('count(scans.id) as scan_count'))
            ->groupBy('food_name')
            ->orderByDesc('scan_count')
            ->take(5)
            ->get()->toArray();

        $salesContext = [
            'total_scans' => Scan::count(),
            'avg_rating' => Review::avg('rating') ?: 4.8,
            'top_dishes' => $topRatedMeals,
            'recent_scans' => Scan::latest()->take(5)->pluck('food_name')->toArray(),
        ];

        $answer = $this->geminiService->askAiAdvisor($request->input('question'), $salesContext);

        return response()->json([
            'answer' => $answer,
        ]);
    }

    public function team(): Response
    {
        $members = User::whereIn('role', ['Super Admin', 'Admin', 'Maintainer', 'Editor', 'Viewer'])->latest()->get();

        return Inertia::render('Admin/TeamManagement', [
            'members' => $members,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function inviteTeam(Request $request)
    {
        $currentUser = Auth::user();
        if ($currentUser->role !== 'Super Admin') {
            return back()->withErrors(['error' => 'Hanya Super Admin yang berhak menambah akun admin!']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:Super Admin,Admin,Maintainer,Editor,Viewer',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => 'Active',
        ]);

        return back()->with('success', 'Admin berhasil ditambahkan dengan password custom!');
    }

    public function updateTeamPassword(Request $request, int $id)
    {
        $currentUser = Auth::user();

        if ($currentUser->role !== 'Super Admin') {
            return back()->withErrors(['error' => 'Akses ditolak. Hanya Super Admin yang berhak mengubah password admin!']);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $userToUpdate = User::findOrFail($id);
        $userToUpdate->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password akun admin berhasil diperbarui!');
    }

    public function deleteTeam(int $id)
    {
        $currentUser = Auth::user();

        if ($currentUser->role !== 'Super Admin') {
            return back()->withErrors(['error' => 'Akses ditolak. Hanya Super Admin yang berhak menghapus akun admin!']);
        }

        $userToDelete = User::findOrFail($id);

        if ($userToDelete->id === $currentUser->id) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus akun Anda sendiri!']);
        }

        $userToDelete->delete();

        return back()->with('success', 'Anggota tim admin berhasil dihapus.');
    }

    public function aiAnalytics(): Response
    {
        $total24hRequests = Scan::where('created_at', '>=', now()->subDay())->count() ?: Scan::count();
        $avgLatency = Scan::avg('latency_ms') ? round(Scan::avg('latency_ms')) : 210;
        $avgConfidence = Scan::avg('ai_confidence') ? round(Scan::avg('ai_confidence'), 1) : 98.2;

        return Inertia::render('Admin/AiAnalytics', [
            'analytics' => [
                'total_requests_24h' => $total24hRequests,
                'avg_latency' => $avgLatency,
                'avg_confidence' => $avgConfidence,
            ],
            'auth' => ['user' => Auth::user()],
        ]);
    }

    public function dietaryDatabase(): Response
    {
        $scans = Scan::with(['user', 'review'])->latest()->paginate(15);
        $avgConfidence = Scan::avg('ai_confidence') ? round(Scan::avg('ai_confidence'), 1) : 97.5;
        $avgLatency = Scan::avg('latency_ms') ? round(Scan::avg('latency_ms')) : 220;

        return Inertia::render('Admin/DietaryDatabase', [
            'scans' => $scans,
            'stats' => [
                'total_scans_today' => Scan::whereDate('created_at', today())->count() ?: Scan::count(),
                'avg_confidence' => $avgConfidence,
                'processing_latency' => $avgLatency,
            ],
            'auth' => ['user' => Auth::user()],
        ]);
    }
}
