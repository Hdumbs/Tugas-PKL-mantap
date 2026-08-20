import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Camera, History, User } from 'lucide-react';

export default function BottomNav({ active = 'scanner' }) {
    const navItems = [
        { name: 'survey', label: 'Home', href: '/survey', icon: Home },
        { name: 'scanner', label: 'Scanner', href: '/scanner', icon: Camera, isCenter: true },
        { name: 'history', label: 'History', href: '/history', icon: History },
        { name: 'profile', label: 'Profile', href: '/admin/login', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 shadow-lg px-6 py-2 flex justify-between items-center z-50 rounded-t-2xl">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.name;

                if (item.isCenter) {
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative -top-5 flex flex-col items-center justify-center bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:bg-emerald-600 transition-all border-4 border-white"
                        >
                            <Icon size={24} />
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
                            isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
