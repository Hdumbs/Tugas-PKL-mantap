import React, { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Camera,
    Star,
    Users,
    TrendingUp,
    Flame,
    Smile,
    Bot,
    Send,
    Sparkles,
    RefreshCw
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({
    metrics = {},
    recent_scans = [],
    rating_distribution = {},
    top_rated_meals = [],
    survey_stats = {},
    scan_trend = {},
    ai_initial_insight = ''
}) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Admin';
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: ai_initial_insight || 'Halo Admin! Saya AI Executive Advisor Amidyas Superfood. Ingin mengecek menu mana yang paling favorit hari ini?'
        }
    ]);
    const [inputQuestion, setInputQuestion] = useState('');
    const [isAsking, setIsAsking] = useState(false);

    const handleSendQuestion = async (e) => {
        e.preventDefault();
        if (!inputQuestion.trim() || isAsking) return;

        const q = inputQuestion;
        setInputQuestion('');
        setMessages((prev) => [...prev, { sender: 'user', text: q }]);
        setIsAsking(true);

        try {
            const res = await axios.post('/admin/ask-advisor', { question: q });
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: res.data.answer || 'Analisis AI selesai.' }
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: 'Maaf, gagal menghubungkan AI Advisor. Silakan coba lagi.' }
            ]);
        } finally {
            setIsAsking(false);
        }
    };

    const lineData = {
        labels: scan_trend?.labels || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [
            {
                label: 'Total Pemindaian Makanan',
                data: scan_trend?.scans || [45, 62, 58, 80, 95, 120, 110],
                borderColor: '#64ac1d',
                backgroundColor: 'rgba(100, 172, 29, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const surveyChartData = {
        labels: ['Delicious', 'Average', 'Needs Improvement'],
        datasets: [
            {
                data: [
                    survey_stats?.food_delicious || 12,
                    survey_stats?.food_average || 3,
                    survey_stats?.food_needs_imp || 1
                ],
                backgroundColor: ['#64ac1d', '#f59e0b', '#f43f5e'],
            },
        ],
    };

    return (
        <AdminLayout title="Executive Overview">
            <div className="space-y-8 font-sans text-[#223311]">
                
                {/* Amidyas Superfood Hero Welcome Banner */}
                <div className="bg-[#64ac1d] text-white p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="relative z-10 max-w-xl">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 bg-white/20 px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-md">
                            ADMIN PORTAL AMIDYAS SUPERFOOD
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                            Halo, {userName}
                        </h1>
                        <p className="text-xs md:text-sm text-emerald-50 mt-2 font-medium">
                            Pantau hasil pemindaian kalori makanan, riwayat scan pelanggan, kepuasan rasa, dan analitik resto secara real-time.
                        </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 text-white shrink-0 w-full md:w-auto relative z-10">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">Estimasi Revenue Order</p>
                        <h2 className="text-2xl md:text-3xl font-black mt-1">{metrics.est_revenue || 'Rp 14.500.000'}</h2>
                    </div>

                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
                </div>

                {/* 3 Main Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Scan Makanan</p>
                        <h3 className="text-3xl font-extrabold text-[#223311] mt-2">{metrics.total_scans || 1240}</h3>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Pemindaian terhitung di database</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Rata-Rata Rating</p>
                        <h3 className="text-3xl font-extrabold text-[#223311] mt-2">{metrics.avg_rating || 4.8} <span className="text-sm font-bold text-gray-400">/ 5</span></h3>
                        <p className="text-xs text-emerald-600 font-bold mt-1">Status: Pelanggan Sangat Puas</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Status Sistem</p>
                        <h3 className="text-3xl font-extrabold text-[#64ac1d] mt-2">Aktif</h3>
                        <p className="text-xs text-gray-400 font-semibold mt-1">AI Gemini 3.5 Lite Berjalan</p>
                    </div>
                </div>

                {/* AI Executive Assistant Widget */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#64ac1d] text-white flex items-center justify-center font-bold">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base text-[#223311]">Asisten AI Amidyas</h3>
                            <p className="text-xs text-gray-400 font-medium">Asisten analisis bisnis & rekomendasi rasa resto</p>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto p-4 bg-[#f7faf4] rounded-2xl border border-gray-100 text-xs">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-7 h-7 rounded-xl bg-[#64ac1d] text-white flex items-center justify-center shrink-0 font-bold">
                                        AI
                                    </div>
                                )}
                                <div className={`p-3.5 rounded-2xl max-w-xl font-semibold leading-relaxed ${
                                    msg.sender === 'user' ? 'bg-[#64ac1d] text-white rounded-tr-none' : 'bg-white text-[#223311] border border-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendQuestion} className="flex gap-2">
                        <input
                            type="text"
                            value={inputQuestion}
                            onChange={(e) => setInputQuestion(e.target.value)}
                            placeholder="Tanyakan analisis penjualan makanan..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isAsking}
                            className="px-5 py-3 bg-[#64ac1d] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition flex items-center gap-2"
                        >
                            {isAsking ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                            <span>Kirim</span>
                        </button>
                    </form>
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-base text-[#223311]">Tren Pemindaian Makanan (7 Hari Terakhir)</h3>
                        <div className="h-64 pt-2">
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-base text-[#223311]">Kepuasan Rasa</h3>
                        <div className="h-48 flex justify-center py-2">
                            <Doughnut data={surveyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Top Meals & Recent Log Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-base text-[#223311]">Menu Terlaris</h3>
                        <div className="space-y-3">
                            {top_rated_meals.map((meal, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-7 h-7 rounded-xl bg-[#64ac1d] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-xs text-[#223311] truncate">{meal.food_name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{meal.calories} kcal</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-[#eef6e6] text-[#64ac1d] font-extrabold text-xs rounded-xl">
                                        {meal.scan_count || 12} Order
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-base text-[#223311]">Log Pemindaian Terbaru</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider font-extrabold">
                                        <th className="py-3 px-2">Menu</th>
                                        <th className="py-3 px-2">User</th>
                                        <th className="py-3 px-2">Kalori</th>
                                        <th className="py-3 px-2">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recent_scans.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-gray-50 transition">
                                            <td className="py-3 px-2 font-extrabold text-[#223311]">{scan.food_name}</td>
                                            <td className="py-3 px-2 text-gray-500 font-medium">{scan.user?.name || 'Guest User'}</td>
                                            <td className="py-3 px-2 font-extrabold text-[#64ac1d]">{scan.calories} kcal</td>
                                            <td className="py-3 px-2 font-bold text-amber-500">{scan.review ? `${scan.review.rating}/5 ★` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
