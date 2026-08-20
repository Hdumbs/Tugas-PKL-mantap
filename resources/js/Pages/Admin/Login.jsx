import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login({ errors }) {
    const [email, setEmail] = useState('admin@amidyas.com');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        router.post('/admin/login', {
            email,
            password,
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
                {/* Branding */}
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Vitality Grid</h1>
                    <p className="text-xs text-gray-500 font-semibold">Vitality Grid Admin Portal</p>
                </div>

                {errors?.email && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-semibold text-center">
                        {errors.email}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Admin Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@amidyas.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-2 text-gray-600 font-semibold cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-emerald-600 font-bold hover:underline">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 group"
                    >
                        <span>Sign In</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}
