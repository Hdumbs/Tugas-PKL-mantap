import React from 'react';
import { Link } from '@inertiajs/react';
import { Flame, Star, ChevronRight, History as HistoryIcon } from 'lucide-react';

export default function History({ scans = [] }) {
    return (
        <div className="min-h-screen bg-gray-900 flex justify-center text-gray-800">
            <div className="w-full max-w-md bg-gray-50 flex flex-col min-h-screen relative shadow-2xl overflow-hidden">
                {/* Top Header */}
                <div className="bg-emerald-600 px-6 pt-8 pb-6 text-white rounded-b-3xl shadow-md">
                    <div className="flex items-center gap-2 mb-1 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                        <HistoryIcon size={16} /> Vitality Logs
                    </div>
                    <h1 className="text-2xl font-extrabold">Scan History</h1>
                    <p className="text-xs text-emerald-100 mt-1">Riwayat pemindaian makanan Amidyas Superfood.</p>
                </div>

                {/* Scans List */}
                <div className="p-6 space-y-4 flex-1">
                    {scans.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <HistoryIcon size={40} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-xs text-gray-500 font-semibold">Belum ada riwayat pemindaian.</p>
                            <Link href="/scanner" className="inline-block mt-4 text-xs font-bold text-emerald-600 underline">
                                Mulai pemindaian makanan sekarang
                            </Link>
                        </div>
                    ) : (
                        scans.map((scan) => (
                            <Link
                                key={scan.id}
                                href={`/scan/${scan.scan_code}`}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition group"
                            >
                                <img
                                    src={scan.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                    alt={scan.food_name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-emerald-600 transition">
                                        {scan.food_name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                            <Flame size={14} /> {scan.calories} kcal
                                        </span>
                                        {scan.review && (
                                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                                <Star size={14} className="fill-amber-400" /> {scan.review.rating}/5
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(scan.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
