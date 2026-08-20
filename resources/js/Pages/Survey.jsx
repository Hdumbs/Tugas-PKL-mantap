import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Sparkles, Utensils, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function Survey() {
    const [foodSatisfaction, setFoodSatisfaction] = useState('Delicious');
    const [serviceQuality, setServiceQuality] = useState('Fast & Friendly');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/survey', {
            food_satisfaction: foodSatisfaction,
            service_quality: serviceQuality,
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 md:p-6 text-gray-800 font-sans">
            <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl bg-gray-50 flex flex-col md:rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
                {/* Header Image Background */}
                <div className="relative h-60 md:h-72 bg-emerald-800 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                        alt="Amidyas Superfood"
                        className="w-full h-full object-cover opacity-40 blur-xs"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-black/40" />

                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs md:text-sm font-bold tracking-wide uppercase">Amidyas Superfood</span>
                        </div>
                        <Link
                            href="/scanner"
                            className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition"
                        >
                            Skip
                        </Link>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
                            <Sparkles size={14} /> Survei Kepuasan
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Food & Service Survey</h1>
                        <p className="text-xs md:text-sm text-gray-200 mt-1">Bantu kami meningkatkan kualitas makanan & pelayanan.</p>
                    </div>
                </div>

                {/* Survey Form Card */}
                <form onSubmit={handleSubmit} className="p-6 md:p-10 flex-1 flex flex-col justify-between space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Question 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 text-emerald-600 mb-3">
                                <Utensils size={20} />
                                <h3 className="font-bold text-base text-gray-900">Kepuasan Makanan</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Bagaimana rasa dan penyajian hidangan kamu?</p>
                            <div className="flex flex-wrap gap-2">
                                {['Delicious', 'Average', 'Needs Improvement'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setFoodSatisfaction(option)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                                            foodSatisfaction === option
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 text-emerald-600 mb-3">
                                <HeartHandshake size={20} />
                                <h3 className="font-bold text-base text-gray-900">Kualitas Pelayanan</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Bagaimana keramahan dan kecepatan staf kami?</p>
                            <div className="flex flex-wrap gap-2">
                                {['Fast & Friendly', 'Good', 'Slow'].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setServiceQuality(option)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                                            serviceQuality === option
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full max-w-md mx-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={18} />
                            <span>Kirim Survei & Selesai</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
