import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, CheckCircle2, Flame, Layers, ArrowRight, Activity } from 'lucide-react';

export default function ScanResult({ scan }) {
    const [rating, setRating] = useState(scan?.review?.rating || 5);
    const [recommended, setRecommended] = useState(scan?.review?.recommended ?? true);
    const [comment, setComment] = useState(scan?.review?.comment || '');
    const [submitted, setSubmitted] = useState(!!scan?.review);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const macros = scan?.macronutrients || { protein: '32g', fats: '14g', carbs: '42g', sugar: '4g' };
    const ingredients = scan?.ingredients || ['Quinoa Base', 'Grilled Salmon', 'Avocado', 'Cherry Tomatoes'];
    const benefits = scan?.benefits || ['Kaya akan Asam Lemak Omega-3.', 'Sumber protein lengkap dan karbohidrat kompleks.'];

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
        <div className="min-h-screen bg-[#f7faf4] text-[#223311] font-sans flex flex-col">
            {/* Top Navigation Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
                <div className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="CHIA Logo" className="w-10 h-10 object-contain" />
                    <div>
                        <h1 className="text-base font-extrabold text-[#223311]">Amidyas Food Scanner</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hasil Analisis Nutrisi AI</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/scanner"
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#223311] font-extrabold text-xs rounded-xl transition flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Scan Ulang
                    </Link>
                </div>
            </header>

            {/* Desktop Layout Container */}
            <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Left Banner Image (5 Cols) */}
                    <div className="md:col-span-5 relative h-72 md:h-auto bg-gray-900 overflow-hidden flex flex-col justify-between p-8 text-white">
                        <img
                            src={scan?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85'}
                            alt={scan?.food_name}
                            className="w-full h-full object-cover absolute inset-0 opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-[#64ac1d]/40 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/40">
                                {scan?.ai_confidence || 98.4}% AI Match
                            </span>
                        </div>

                        <div className="relative z-10 mt-auto space-y-1">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Hidangan Terdeteksi</span>
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{scan?.food_name}</h2>
                            <p className="text-xs text-gray-300 font-semibold">Kode Scan: #{scan?.scan_code}</p>
                        </div>
                    </div>

                    {/* Right Details (7 Cols) */}
                    <div className="md:col-span-7 p-6 md:p-8 space-y-6 bg-white overflow-y-auto max-h-[80vh]">
                        
                        {/* Calories & Macro Cards */}
                        <div className="bg-[#f7faf4] p-6 rounded-3xl border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3.5 rounded-2xl bg-[#64ac1d] text-white">
                                        <Flame size={26} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Total Kalori</p>
                                        <h3 className="text-3xl font-black text-[#64ac1d]">{scan?.calories} <span className="text-sm font-bold text-gray-400">kcal</span></h3>
                                    </div>
                                </div>
                            </div>

                            {/* Macro Pills */}
                            <div className="grid grid-cols-4 gap-3 pt-2 text-center">
                                <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <p className="text-base font-black text-blue-600">{macros.protein}</p>
                                    <span className="text-[10px] font-extrabold text-gray-400">Protein</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <p className="text-base font-black text-amber-500">{macros.fats}</p>
                                    <span className="text-[10px] font-extrabold text-gray-400">Fats</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <p className="text-base font-black text-[#64ac1d]">{macros.carbs}</p>
                                    <span className="text-[10px] font-extrabold text-gray-400">Carbs</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                                    <p className="text-base font-black text-rose-500">{macros.sugar}</p>
                                    <span className="text-[10px] font-extrabold text-gray-400">Sugar</span>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3">
                            <h4 className="font-extrabold text-sm text-[#223311] flex items-center gap-2">
                                <Layers size={18} className="text-[#64ac1d]" /> Komposisi Bahan
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map((ing, idx) => (
                                    <span key={idx} className="px-3.5 py-1.5 bg-[#eef6e6] text-[#64ac1d] text-xs font-extrabold rounded-xl">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3">
                            <h4 className="font-extrabold text-sm text-[#64ac1d] flex items-center gap-2">
                                <Activity size={18} /> Manfaat Kesehatan
                            </h4>
                            <ul className="space-y-2">
                                {benefits.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                                        <CheckCircle2 size={16} className="text-[#64ac1d] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rating Form */}
                        <div className="bg-[#f7faf4] p-6 rounded-3xl border border-gray-100 space-y-4">
                            <h4 className="font-extrabold text-sm text-[#223311]">Beri Rating Hidangan</h4>

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
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition border ${
                                            recommended
                                                ? 'bg-[#64ac1d] text-white border-[#64ac1d] shadow-xs'
                                                : 'bg-white text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        <ThumbsUp size={16} /> Rekomendasi (Ya)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecommended(false)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition border ${
                                            !recommended
                                                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                                : 'bg-white text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        <ThumbsDown size={16} /> Tidak
                                    </button>
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tuliskan ulasan atau saran rasa..."
                                    className="w-full text-xs p-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#64ac1d] focus:outline-none font-medium bg-white"
                                    rows={2}
                                />

                                {!submitted ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-[#64ac1d] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition"
                                    >
                                        Simpan Rating
                                    </button>
                                ) : (
                                    <div className="p-3 bg-[#eef6e6] text-[#64ac1d] text-center font-extrabold text-xs rounded-xl">
                                        Rating Berhasil Disimpan!
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* DONE Button */}
                        <div className="pt-2">
                            <Link
                                href="/survey"
                                className="w-full py-4 bg-[#64ac1d] hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 group"
                            >
                                <span>Lanjut ke Survei Kepuasan</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
