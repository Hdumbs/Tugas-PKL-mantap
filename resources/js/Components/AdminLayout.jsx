import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Users, Cpu, Database, LogOut, ShieldCheck, Bell, HelpCircle } from 'lucide-react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Super Admin', role: 'Super Admin', email: 'admin@amidyas.com' };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Team Members', href: '/admin/team', icon: Users },
        { name: 'AI Analytics', href: '/admin/ai-analytics', icon: Cpu },
        { name: 'Dietary Database', href: '/admin/dietary-database', icon: Database },
    ];

    const currentPath = window.location.pathname;

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sticky Fixed Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0 shadow-xl fixed top-0 bottom-0 left-0 z-40 h-screen overflow-y-auto">
                <div>
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-base tracking-wide text-white">Vitality Grid</h1>
                            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Admin Portal</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer User Info & Logout */}
                <div className="border-t border-slate-800 pt-4 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                            {user.name ? user.name.charAt(0) : 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-emerald-400 font-medium truncate">{user.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 rounded-xl text-xs font-semibold transition"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content View with Sidebar Margin Offset */}
            <div className="flex-1 flex flex-col min-w-0 ml-64 min-h-screen">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-xs sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-extrabold text-gray-800">{title}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search users, meals, or scans..."
                            className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
