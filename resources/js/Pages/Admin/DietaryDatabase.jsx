import React from 'react';
import AdminLayout from '../../Components/AdminLayout';
import { Database, Flame, Clock, Cpu, Download } from 'lucide-react';

export default function DietaryDatabase({ scans, stats }) {
    const scanItems = scans?.data || [];

    return (
        <AdminLayout title="Dietary Database (Scan Telemetry)">
            <div className="space-y-6">
                {/* Summary Telemetry Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Database size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Total Scans Today</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{stats?.total_scans_today || 42}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Avg AI Confidence</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{stats?.avg_confidence || 95.2}%</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Processing Latency</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{stats?.processing_latency || 220} ms</h3>
                        </div>
                    </div>
                </div>

                {/* Filter and Export Action */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <h3 className="font-extrabold text-sm text-gray-800">Scan Telemetry Logs</h3>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2">
                        <Download size={14} /> Export Logs
                    </button>
                </div>

                {/* Scans Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="py-3.5 px-6">Scan ID</th>
                                <th className="py-3.5 px-6">Food Recognized</th>
                                <th className="py-3.5 px-6">User</th>
                                <th className="py-3.5 px-6">Calories</th>
                                <th className="py-3.5 px-6">AI Confidence</th>
                                <th className="py-3.5 px-6">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {scanItems.map((scan) => (
                                <tr key={scan.id} className="hover:bg-gray-50/80 transition">
                                    <td className="py-4 px-6 font-mono font-bold text-emerald-600">
                                        {scan.scan_code}
                                    </td>
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <img
                                            src={scan.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                            alt={scan.food_name}
                                            className="w-8 h-8 rounded-lg object-cover"
                                        />
                                        <span className="font-bold text-gray-900">{scan.food_name}</span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 font-semibold">
                                        {scan.user?.name || 'Guest User'}
                                    </td>
                                    <td className="py-4 px-6 font-extrabold text-gray-900">
                                        {scan.calories} kcal
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${scan.ai_confidence}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-[11px] text-gray-600">{scan.ai_confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 font-medium">
                                        {new Date(scan.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
