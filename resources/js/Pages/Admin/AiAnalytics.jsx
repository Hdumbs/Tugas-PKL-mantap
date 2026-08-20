import React from 'react';
import AdminLayout from '../../Components/AdminLayout';
import { Cpu, Key, Activity, Copy, CheckCircle2, Zap } from 'lucide-react';

export default function AiAnalytics({ analytics }) {
    return (
        <AdminLayout title="AI Analytics & API Management">
            <div className="space-y-8">
                {/* Metrics Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">API Usage (24h)</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{analytics?.total_requests_24h || 148} requests</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Avg Processing Latency</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{analytics?.avg_latency || 210} ms</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">AI Gemini Confidence</p>
                            <h3 className="text-2xl font-extrabold text-gray-900">{analytics?.avg_confidence || 95.5}%</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Endpoints Table */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                            <Cpu size={18} className="text-emerald-500" /> Active API Endpoints
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                        <th className="py-3 px-2">Method</th>
                                        <th className="py-3 px-2">Endpoint Path</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2">Avg Latency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs font-medium">
                                    {[
                                        { method: 'POST', path: '/api/v1/scan/process', status: '200 OK', latency: '210ms' },
                                        { method: 'GET', path: '/api/v1/scan/{code}', status: '200 OK', latency: '45ms' },
                                        { method: 'POST', path: '/api/v1/survey', status: '201 Created', latency: '60ms' },
                                        { method: 'POST', path: '/api/v1/review', status: '200 OK', latency: '55ms' },
                                    ].map((ep, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold ${
                                                    ep.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {ep.method}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 font-mono text-gray-800">{ep.path}</td>
                                            <td className="py-3 px-2 text-emerald-600 font-bold flex items-center gap-1">
                                                <CheckCircle2 size={14} /> {ep.status}
                                            </td>
                                            <td className="py-3 px-2 text-gray-500 font-bold">{ep.latency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* API Key Management */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                            <Key size={18} className="text-amber-500" /> API Keys & Model
                        </h3>
                        <div className="space-y-4 text-xs">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="font-bold text-gray-700 mb-1">Gemini AI Model Version</p>
                                <p className="text-emerald-600 font-extrabold">Gemini 3.5 Flash Lite (v1beta)</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700">Production Key</span>
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 font-mono text-[11px] text-gray-600">
                                    <span className="flex-1 truncate">AQ.Ab8RN6KQi4qJHUW...</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
