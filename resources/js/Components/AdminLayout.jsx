import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Users, Cpu, Database, LogOut, Menu, X, Bell } from 'lucide-react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Dafha Super Admin', role: 'Super Admin', email: 'admin@amidyas.com' };
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            
            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
                />
            )}

            {/* Responsive Sidebar (Mobile Drawer + Desktop Fixed) */}
            <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 fixed top-0 bottom-0 left-0 z-50 h-screen overflow-y-auto transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div>
                    {/* Header Logo */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="Amidyas Superfood Logo" className="w-10 h-10 object-contain" />
                            <div>
                                <h1 className="font-extrabold text-base text-[#223311] tracking-tight">Amidyas Scanner</h1>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin Portal</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Admin Profile Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                        <div className="w-9 h-9 rounded-full bg-[#64ac1d] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
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
                                    onClick={() => setSidebarOpen(false)}
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 ml-0 min-h-screen">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 md:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden md:flex items-center gap-3">
                            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                            <div>
                                <h2 className="text-base font-extrabold text-[#223311]">{title}</h2>
                                <p className="text-[10px] text-gray-400 font-bold">Amidyas Admin Portal</p>
                            </div>
                        </div>

                        <h2 className="text-sm font-extrabold text-[#223311] md:hidden">{title}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 text-xs w-28 sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#64ac1d]"
                        />
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                            <Bell size={18} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-extrabold transition border border-rose-200"
                            title="Keluar dari Admin Portal"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Keluar</span>
                        </button>
                    </div>
                </header>

                {/* Main Body */}
                <main className="p-4 md:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
