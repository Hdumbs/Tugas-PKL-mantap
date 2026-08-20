import React, { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';
import { router } from '@inertiajs/react';
import { UserPlus, Search, Trash2, Mail, Shield, X, CheckCircle } from 'lucide-react';

export default function TeamManagement({ members = [] }) {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Editor');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInvite = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/admin/team/invite', {
            name,
            email,
            role,
        }, {
            onSuccess: () => {
                setShowInviteModal(false);
                setName('');
                setEmail('');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            router.delete(`/admin/team/${id}`);
        }
    };

    return (
        <AdminLayout title="Team Management">
            <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition flex items-center gap-2"
                    >
                        <UserPlus size={16} /> + Invite New Admin
                    </button>
                </div>

                {/* Team Members Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="py-3.5 px-6">Name & Email</th>
                                <th className="py-3.5 px-6">Role</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6">Last Login</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/80 transition">
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{member.name}</p>
                                            <p className="text-[11px] text-gray-400">{member.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-gray-700">
                                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold text-[11px]">
                                            <Shield size={12} className="text-emerald-600" /> {member.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                            member.status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 font-medium">
                                        {member.last_login_at
                                            ? new Date(member.last_login_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'Never'}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                            title="Remove Admin"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <h3 className="font-extrabold text-base text-gray-900">Invite New Admin</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Alex Rivera"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@amidyas.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Assign Role</label>
                                    <div className="space-y-2">
                                        {[
                                            { r: 'Super Admin', desc: 'Full access to all settings and team management' },
                                            { r: 'Editor', desc: 'Can monitor scans and update nutritional database' },
                                            { r: 'Viewer', desc: 'Read-only access to analytics and reviews' }
                                        ].map((item) => (
                                            <label
                                                key={item.r}
                                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                                    role === item.r ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={item.r}
                                                    checked={role === item.r}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{item.r}</p>
                                                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition"
                                    >
                                        Send Invite
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
