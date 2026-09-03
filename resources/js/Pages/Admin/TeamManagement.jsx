import React, { useState } from 'react';
import AdminLayout from '../../Components/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { UserPlus, Search, Trash2, Shield, X, Eye, EyeOff, Lock, Key } from 'lucide-react';

export default function TeamManagement({ members = [] }) {
    const { auth, errors } = usePage().props;
    const currentUser = auth?.user || {};
    const isSuperAdmin = currentUser.role === 'Super Admin';

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Editor');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInvite = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/admin/team/invite', {
            name,
            email,
            password,
            role,
        }, {
            onSuccess: () => {
                setShowInviteModal(false);
                setName('');
                setEmail('');
                setPassword('');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);
        router.put(`/admin/team/${selectedUser.id}/password`, {
            password: editPassword,
        }, {
            onSuccess: () => {
                setShowEditPasswordModal(false);
                setSelectedUser(null);
                setEditPassword('');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = (id) => {
        if (!isSuperAdmin) {
            alert('Akses ditolak! Hanya Super Admin yang berhak menghapus akun admin.');
            return;
        }
        if (confirm('Apakah kamu yakin ingin menghapus anggota admin ini?')) {
            router.delete(`/admin/team/${id}`);
        }
    };

    const openEditPasswordModal = (member) => {
        setSelectedUser(member);
        setEditPassword('');
        setShowEditPasswordModal(true);
    };

    return (
        <AdminLayout title="Team Management">
            <div className="space-y-6 font-sans text-[#223311]">
                {errors?.error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold text-center">
                        {errors.error}
                    </div>
                )}

                {/* Header Action Bar */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari anggota tim..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none"
                        />
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-[#64ac1d] hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
                        >
                            <UserPlus size={16} /> + Tambah Admin Baru
                        </button>
                    )}
                </div>

                {/* Team Members Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                                <th className="py-3.5 px-6">Nama & Email</th>
                                <th className="py-3.5 px-6">Role</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6">Terakhir Login</th>
                                <th className="py-3.5 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/80 transition">
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#eef6e6] text-[#64ac1d] font-bold flex items-center justify-center text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{member.name}</p>
                                            <p className="text-[11px] text-gray-400">{member.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-gray-700">
                                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold text-[11px]">
                                            <Shield size={12} className="text-[#64ac1d]" /> {member.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                            member.status === 'Active'
                                                ? 'bg-[#eef6e6] text-[#64ac1d]'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 font-medium">
                                        {member.last_login_at
                                            ? new Date(member.last_login_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'Belum Pernah'}
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-1">
                                        {isSuperAdmin && (
                                            <button
                                                onClick={() => openEditPasswordModal(member)}
                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                title="Edit / Reset Password"
                                            >
                                                <Key size={16} />
                                            </button>
                                        )}

                                        {isSuperAdmin && member.id !== currentUser.id ? (
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                title="Hapus Admin"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        ) : !isSuperAdmin && (
                                            <span className="text-gray-300 p-2 inline-block" title="Akses Terkunci (Super Admin Only)">
                                                <Lock size={16} />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invite Modal */}
                {showInviteModal && isSuperAdmin && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <h3 className="font-extrabold text-base text-gray-900">Tambah Admin Baru</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Contoh: Alex Rivera"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Admin</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@amidyas.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Password Custom</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Masukkan password akun..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Pilih Role Access</label>
                                    <div className="space-y-2">
                                        {[
                                            { r: 'Super Admin', desc: 'Hak akses penuh ke seluruh sistem dan kelola tim' },
                                            { r: 'Editor', desc: 'Dapat memantau scan dan memperbarui database nutrisi' },
                                            { r: 'Viewer', desc: 'Akses lihat analitik dan ulasan makanan saja' }
                                        ].map((item) => (
                                            <label
                                                key={item.r}
                                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                                    role === item.r ? 'border-[#64ac1d] bg-[#eef6e6]' : 'border-gray-200'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={item.r}
                                                    checked={role === item.r}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="mt-0.5 text-[#64ac1d] focus:ring-[#64ac1d]"
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
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-xs font-extrabold bg-[#64ac1d] hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                                    >
                                        Simpan Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Password Modal */}
                {showEditPasswordModal && selectedUser && isSuperAdmin && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="font-extrabold text-base text-gray-900">Ubah Password Admin</h3>
                                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Akun: {selectedUser.name} ({selectedUser.email})</p>
                                </div>
                                <button onClick={() => setShowEditPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                            placeholder="Ketikkan password baru..."
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#64ac1d] focus:outline-none pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPasswordModal(false)}
                                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-xs font-extrabold bg-[#64ac1d] hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                                    >
                                        Update Password
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
