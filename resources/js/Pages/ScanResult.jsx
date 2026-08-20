import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, CheckCircle2, Flame, RefreshCw, Layers, ArrowRight } from 'lucide-react';

export default function ScanResult({ scan }) {
    const [rating, setRating] = useState(scan?.review?.rating || 5);
    const [recommended, setRecommended] = useState(scan?.review?.recommended ?? true);
    const [comment, setComment] = useState(scan?.review?.comment || '');
    const [submitted, setSubmitted] = useState(!!scan?.review);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const macros = scan?.macronutrients || { protein: '32g', fats: '14g', carbs: '42g', sugar: '4g' };
    const ingredients = scan?.ingredients || ['Quinoa Base', 'Grilled Salmon', 'Avocado', 'Cherry Tomatoes'];
    const benefits = scan?.benefits || ['Rich in Omega-3 fatty acids.', 'Provides high quality protein.'];

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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 md:p-6 text-gray-800 font-sans">
            <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-gray-50 flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Desktop Split / Tablet Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
                    {/* Left Column: Image Banner */}
                    <div className="relative h-64 md:h-full md:col-span-5 bg-gray-900 flex flex-col justify-between">
                        <img
                            src={scan?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                            alt={scan?.food_name}
                            className="w-full h-full object-cover opacity-90 absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-black/50" />

                        <div className="relative p-6 flex justify-between items-center text-white z-10">
                            <Link
                                href="/scanner"
                                className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <span className="font-extrabold text-sm tracking-wide text-white uppercase">Vitality Grid</span>
                            <div className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-xs font-extrabold text-white shadow-sm">
                                {scan?.ai_confidence || 97.5}% AI Match
                            </div>
                        </div>

                        <div className="relative p-6 text-white z-10 mt-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Hasil Pemindaian AI</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{scan?.food_name}</h1>
                        </div>
                    </div>

                    {/* Right Column: Nutrients & Form */}
                    <div className="p-6 md:p-8 space-y-6 md:col-span-7 bg-gray-50 overflow-y-auto">
                        {/* Calories Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                                        <Flame size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Total Kalori</p>
                                        <h2 className="text-3xl font-extrabold text-emerald-600">{scan?.calories} <span className="text-sm font-bold text-gray-500">kcal</span></h2>
                                    </div>
                                </div>
                                <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-bold rounded-lg">
                                    #{scan?.scan_code}
                                </span>
                            </div>

                            {/* Circular Progress Macros */}
                            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center text-xs font-extrabold text-blue-600 mb-1 bg-blue-50">
                                        {macros.protein}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">Protein</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-amber-400 flex items-center justify-center text-xs font-extrabold text-amber-600 mb-1 bg-amber-50">
                                        {macros.fats}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">Fats</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xs font-extrabold text-emerald-600 mb-1 bg-emerald-50">
                                        {macros.carbs}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">Carbs</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-rose-500 flex items-center justify-center text-xs font-extrabold text-rose-600 mb-1 bg-rose-50">
                                        {macros.sugar}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">Sugar</span>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                                <Layers size={18} className="text-emerald-600" /> Bahan Makanan
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map((ing, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-sm text-emerald-600 mb-3">
                                Manfaat Kesehatan Makanan Ini
                            </h3>
                            <ul className="space-y-2">
                                {benefits.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Meal Rating Section */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-sm text-gray-900">Beri Rating Makanan Ini</h3>

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
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
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
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
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
                                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    rows={2}
                                />

                                {!submitted ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                                    >
                                        Simpan Rating
                                    </button>
                                ) : (
                                    <div className="p-3 bg-emerald-50 text-emerald-700 text-center font-bold text-xs rounded-xl">
                                        Rating Berhasil Disimpan!
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* DONE Button */}
                        <div className="pt-2">
                            <Link
                                href="/survey"
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-300 transition flex items-center justify-center gap-2 group"
                            >
                                <span>Done (Isi Survei Kepuasan)</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
