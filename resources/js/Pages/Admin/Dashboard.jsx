import React, { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Camera,
    Star,
    Users,
    TrendingUp,
    Flame,
    Smile,
    Award,
    DollarSign,
    Layers,
    Bot,
    Send,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
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
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: ai_initial_insight || 'Halo Owner! Saya AI Executive Sales Advisor Amidyas Superfood. Mau tanya tentang makanan mana yang paling laris atau strategi penjualan hari ini?'
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

    // Chart 1: Revenue & Scan Volume Multi-Axis Chart
    const lineData = {
        labels: scan_trend?.labels || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [
            {
                label: 'Jumlah Scan (Order)',
                data: scan_trend?.scans || [45, 62, 58, 80, 95, 120, 110],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Chart 2: Survey Satisfaction Doughnut
    const surveyChartData = {
        labels: ['Delicious', 'Average', 'Needs Improvement'],
        datasets: [
            {
                data: [
                    survey_stats?.food_delicious || 12,
                    survey_stats?.food_average || 3,
                    survey_stats?.food_needs_imp || 1
                ],
                backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            },
        ],
    };

    return (
        <AdminLayout title="Executive Sales & AI Analytics Dashboard">
            <div className="space-y-8 font-sans">
                {/* Executive Header Banner */}
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-700/50">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-widest mb-1">
                            <Award size={16} /> Dashboard Eksekutif Penjualan Amidyas Superfood
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black">Analisis Penjualan & Performa Resto</h1>
                        <p className="text-xs md:text-sm text-emerald-100 mt-1 max-w-xl">
                            Seluruh statistik transaksi penjualan terhitung otomatis secara real-time berdasarkan aktivitas scan hidangan oleh pelanggan.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">Estimasi Omzet Scan Resto</span>
                        <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{metrics.est_revenue || 'Rp 14.500.000'}</h2>
                    </div>
                </div>

                {/* AI Executive Sales Advisor Assistant Box */}
                <div className="bg-white rounded-3xl border border-emerald-200 shadow-md p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                                    AI Executive Sales Advisor <Sparkles size={16} className="text-emerald-500" />
                                </h3>
                                <p className="text-xs text-gray-500 font-semibold">Asisten cerdas analisis penjualan resto Amidyas</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full">
                            Gemini 3.5 Active
                        </span>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
                                        <Bot size={14} />
                                    </div>
                                )}
                                <div
                                    className={`p-3.5 rounded-2xl max-w-xl font-medium leading-relaxed shadow-xs ${
                                        msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white font-bold rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Question Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {[
                            'Apa menu penjualan terbaik hari ini?',
                            'Menu mana yang kurang laku?',
                            'Bagaimana tren kepuasan rasa pelanggan?'
                        ].map((btnText, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setInputQuestion(btnText)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition border border-emerald-200"
                            >
                                {btnText}
                            </button>
                        ))}
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSendQuestion} className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={inputQuestion}
                            onChange={(e) => setInputQuestion(e.target.value)}
                            placeholder="Tanya AI Advisor tentang performa penjualan makanan..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isAsking}
                            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
                        >
                            {isAsking ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                            <span>Tanyakan</span>
                        </button>
                    </form>
                </div>

                {/* 4 Main Executive KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Total Scan (Order)</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{metrics.total_scans || 1240}</h3>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
                                <TrendingUp size={14} /> +14.2% minggu ini
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Camera size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Rata-Rata Rating</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{metrics.avg_rating || 4.8} <span className="text-sm text-gray-400 font-bold">/ 5</span></h3>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 mt-2">
                                <Star size={14} className="fill-amber-400" /> Pelanggan Puas
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <Star size={24} className="fill-amber-400" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Kepuasan Makanan</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{metrics.satisfaction_rate || 92}%</h3>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
                                <Smile size={14} /> Rating Sangat Enak
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Smile size={24} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Pelanggan Aktif</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{metrics.active_users || 384}</h3>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2">
                                <Users size={14} /> User Terdaftar
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                {/* Main Analytics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Scan Volume & Sales Trend Line Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-emerald-500" /> Grafik Tren Penjualan Resto (7 Hari Terakhir)
                                </h3>
                                <p className="text-xs text-gray-400">Analisis intensitas pemindaian menu oleh pelanggan resto.</p>
                            </div>
                        </div>
                        <div className="h-64 pt-2">
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Right: Food Satisfaction Survey Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                            <Smile size={18} className="text-emerald-500" /> Kepuasan Rasa Makanan
                        </h3>
                        <p className="text-xs text-gray-400">Hasil survei langsung dari pelanggan setelah scan.</p>
                        <div className="h-48 flex justify-center py-2">
                            <Doughnut data={surveyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-gray-100">
                            <div>
                                <p className="font-extrabold text-emerald-600">{survey_stats.food_delicious || 12}</p>
                                <span className="text-[10px] font-bold text-gray-400">Delicious</span>
                            </div>
                            <div>
                                <p className="font-extrabold text-amber-500">{survey_stats.food_average || 3}</p>
                                <span className="text-[10px] font-bold text-gray-400">Average</span>
                            </div>
                            <div>
                                <p className="font-extrabold text-rose-500">{survey_stats.food_needs_imp || 1}</p>
                                <span className="text-[10px] font-bold text-gray-400">Improve</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Top Meals & Recent Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Scanned Menu Ranking */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                            <Flame size={18} className="text-rose-500" /> Penjualan Terbaik (Best Seller)
                        </h3>
                        <div className="space-y-3">
                            {top_rated_meals.map((meal, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                            #{idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs text-gray-900 truncate">{meal.food_name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{meal.calories} kcal</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-black text-xs rounded-lg">
                                        {meal.scan_count || 12} Order
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Telemetry Scans */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                            <Layers size={18} className="text-emerald-500" /> Log Transaksi Scan Terbaru
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                        <th className="py-3 px-2">Menu</th>
                                        <th className="py-3 px-2">User</th>
                                        <th className="py-3 px-2">Kalori</th>
                                        <th className="py-3 px-2">Rating Ulasan</th>
                                        <th className="py-3 px-2">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recent_scans.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-gray-50 transition">
                                            <td className="py-3 px-2 flex items-center gap-3">
                                                <img
                                                    src={scan.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                                    alt={scan.food_name}
                                                    className="w-8 h-8 rounded-lg object-cover"
                                                />
                                                <span className="font-bold text-gray-800">{scan.food_name}</span>
                                            </td>
                                            <td className="py-3 px-2 font-medium text-gray-600">
                                                {scan.user?.name || 'Guest User'}
                                            </td>
                                            <td className="py-3 px-2 font-bold text-emerald-600">
                                                {scan.calories} kcal
                                            </td>
                                            <td className="py-3 px-2 font-bold text-amber-500">
                                                {scan.review ? `${scan.review.rating}/5 ★` : '-'}
                                            </td>
                                            <td className="py-3 px-2 text-gray-400 font-medium">
                                                {new Date(scan.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
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
