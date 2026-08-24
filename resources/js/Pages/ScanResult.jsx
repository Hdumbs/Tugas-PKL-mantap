import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, CheckCircle2, Flame, RefreshCw, Layers, ArrowRight, ShieldCheck, HeartPulse, Activity, Zap } from 'lucide-react';

export default function ScanResult({ scan }) {
    const [rating, setRating] = useState(scan?.review?.rating || 5);
    const [recommended, setRecommended] = useState(scan?.review?.recommended ?? true);
    const [comment, setComment] = useState(scan?.review?.comment || '');
    const [submitted, setSubmitted] = useState(!!scan?.review);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const macros = scan?.macronutrients || { protein: '32g', fats: '14g', carbs: '42g', sugar: '4g', fiber: '7g', sodium: '380mg' };
    const ingredients = scan?.ingredients || ['Quinoa Base', 'Grilled Salmon', 'Avocado', 'Cherry Tomatoes'];
    const benefits = scan?.benefits || ['Kaya akan Asam Lemak Omega-3.', 'Sumber protein lengkap dan karbohidrat kompleks.'];
    const healthScore = scan?.health_score || 94;
    const glycemicIndex = scan?.glycemic_index || 'Rendah (Low GI)';

    const handleRatingSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(`/scan/${scan.scan_code}/review`, {
            rating,
            recommended,
            comment,
        }, {
            onSuccess: () => setSubmitted(true),
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-6 text-gray-800 font-sans">
            <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-white flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
                {/* Desktop Split / Tablet Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
                    {/* Left Column: Image Banner */}
                    <div className="relative h-72 md:h-full md:col-span-5 bg-slate-950 flex flex-col justify-between overflow-hidden">
                        <img
                            src={scan?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85'}
                            alt={scan?.food_name}
                            className="w-full h-full object-cover opacity-90 absolute inset-0 transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />

                        <div className="relative p-6 flex justify-between items-center text-white z-10">
                            <Link
                                href="/scanner"
                                className="p-2.5 rounded-2xl bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition active:scale-95"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <span className="font-black text-sm tracking-widest text-white uppercase">Vitality Grid</span>
                            <div className="px-3.5 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-xs font-black text-white shadow-lg flex items-center gap-1.5">
                                <Zap size={14} /> {scan?.ai_confidence || 98.4}% AI Match
                            </div>
                        </div>

                        <div className="relative p-6 md:p-8 text-white z-10 mt-auto">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
                                <ShieldCheck size={14} /> Hasil Deteksi AI Amidyas
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black leading-tight text-white">{scan?.food_name}</h1>
                        </div>
                    </div>

                    {/* Right Column: Deep Nutrition Details & Rating Form */}
                    <div className="p-6 md:p-8 space-y-6 md:col-span-7 bg-slate-50 overflow-y-auto max-h-[85vh]">
                        
                        {/* Health Score & Energy Badge */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-600">
                                        <Flame size={26} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Total Kalori</p>
                                        <h2 className="text-3xl font-black text-emerald-600">{scan?.calories} <span className="text-sm font-bold text-gray-400">kcal</span></h2>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-700 font-black text-xs">
                                        <HeartPulse size={14} /> Score: {healthScore}/100
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1">GI: {glycemicIndex}</p>
                                </div>
                            </div>

                            {/* Circular Macro Nutrient Progress Cards */}
                            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-center">
                                <div className="flex flex-col items-center bg-blue-50/50 p-2 rounded-2xl border border-blue-100">
                                    <div className="w-11 h-11 rounded-full border-4 border-blue-500 flex items-center justify-center text-xs font-black text-blue-600 mb-1 bg-white shadow-xs">
                                        {macros.protein}
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-600">Protein</span>
                                </div>
                                <div className="flex flex-col items-center bg-amber-50/50 p-2 rounded-2xl border border-amber-100">
                                    <div className="w-11 h-11 rounded-full border-4 border-amber-400 flex items-center justify-center text-xs font-black text-amber-600 mb-1 bg-white shadow-xs">
                                        {macros.fats}
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-600">Fats</span>
                                </div>
                                <div className="flex flex-col items-center bg-emerald-50/50 p-2 rounded-2xl border border-emerald-100">
                                    <div className="w-11 h-11 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-black text-emerald-600 mb-1 bg-white shadow-xs">
                                        {macros.carbs}
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-600">Carbs</span>
                                </div>
                                <div className="flex flex-col items-center bg-rose-50/50 p-2 rounded-2xl border border-rose-100">
                                    <div className="w-11 h-11 rounded-full border-4 border-rose-500 flex items-center justify-center text-xs font-black text-rose-600 mb-1 bg-white shadow-xs">
                                        {macros.sugar}
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-600">Sugar</span>
                                </div>
                            </div>

                            {/* Additional Micro stats */}
                            <div className="flex justify-between items-center text-xs pt-2 font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl">
                                <span>🌾 Serat (Fiber): <strong className="text-gray-900">{macros.fiber || '7g'}</strong></span>
                                <span>🧂 Sodium: <strong className="text-gray-900">{macros.sodium || '380mg'}</strong></span>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
                                <Layers size={18} className="text-emerald-600" /> Komposisi Bahan Utama
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map((ing, idx) => (
                                    <span key={idx} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-black text-sm text-emerald-600 mb-3 flex items-center gap-2">
                                <Activity size={18} /> Manfaat Kesehatan Bagi Tubuh
                            </h3>
                            <ul className="space-y-2.5">
                                {benefits.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Meal Rating Section */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-black text-sm text-gray-900">Beri Rating Hidangan Ini</h3>

                            <form onSubmit={handleRatingSubmit} className="space-y-4">
                                <div className="flex justify-center gap-3 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform active:scale-125"
                                        >
                                            <Star
                                                size={32}
                                                className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRecommended(true)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition border ${
                                            recommended
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        <ThumbsUp size={16} /> Rekomendasi (Ya)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecommended(false)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition border ${
                                            !recommended
                                                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        <ThumbsDown size={16} /> Tidak
                                    </button>
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tuliskan ulasan atau saran rasa..."
                                    className="w-full text-xs p-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                                    rows={2}
                                />

                                {!submitted ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition"
                                    >
                                        Simpan Rating
                                    </button>
                                ) : (
                                    <div className="p-3 bg-emerald-50 text-emerald-700 text-center font-black text-xs rounded-xl">
                                        Rating Berhasil Disimpan!
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* DONE Button */}
                        <div className="pt-2">
                            <Link
                                href="/survey"
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 group"
                            >
                                <span>Done (Lanjut ke Survei Kepuasan)</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
