import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Users, Cpu, Database, LogOut, ShieldCheck, Bell } from 'lucide-react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Dafha Super Admin', role: 'Super Admin', email: 'admin@amidyas.com' };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, badge: 'D' },
        { name: 'Team Members', href: '/admin/team', icon: Users, badge: 'T' },
        { name: 'AI Analytics', href: '/admin/ai-analytics', icon: Cpu, badge: 'A' },
        { name: 'Dietary Database', href: '/admin/dietary-database', icon: Database, badge: 'R' },
    ];

    const currentPath = window.location.pathname;

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-[#f7faf4] flex font-sans text-[#223311]">
            {/* Sidebar Left - Amidyas Superfood Admin Style */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 fixed top-0 bottom-0 left-0 z-40 h-screen overflow-y-auto">
                <div>
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <img src="/images/logo.png" alt="Amidyas Superfood Logo" className="w-12 h-12 rounded-2xl object-contain shadow-xs" />
                        <div>
                            <h1 className="font-extrabold text-lg text-[#223311] tracking-tight">Amidyas Scanner</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin Portal</p>
                        </div>
                    </div>

                    {/* Admin User Card */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#64ac1d] text-white flex items-center justify-center font-extrabold text-sm">
                            {user.name ? user.name.charAt(0) : 'D'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-[#223311] truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold truncate">{user.role}</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3 px-2">Menu Utama</p>

                    {/* Navigation Items */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                                        isActive
                                            ? 'bg-[#eef6e6] text-[#64ac1d] shadow-2xs'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                        isActive ? 'bg-[#64ac1d] text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {item.badge}
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Logout */}
                <div className="border-t border-gray-100 pt-4 mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-2xl text-xs font-extrabold transition border border-gray-100"
                    >
                        <LogOut size={16} /> Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content Layout */}
            <div className="flex-1 flex flex-col min-w-0 ml-64 min-h-screen">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
                        <div>
                            <h2 className="text-base font-extrabold text-[#223311]">Amidyas Food Scanner</h2>
                            <p className="text-[10px] text-gray-400 font-bold">Admin Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Cari data, menu, atau scan..."
                            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#64ac1d]"
                        />
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                {/* Main Body */}
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
