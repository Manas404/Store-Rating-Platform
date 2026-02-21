import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ManageUsers() {
    const { user, logout } = useAuth();

    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER'
    });

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: { search: search || undefined }
            });
            setUsersList(response.data);
        } catch {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            await axiosInstance.post('/admin/users', formData);
            setFormSuccess(`${formData.role} created successfully 🎉`);
            setIsFormOpen(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                address: '',
                role: 'USER'
            });
            fetchUsers();
        } catch (err) {
            setFormError(
                err.response?.data?.error ||
                'Failed to create user.'
            );
        } finally {
            setFormLoading(false);
        }
    };

    const renderRoleBadge = (role) => {
        const styles = {
            ADMIN: 'bg-purple-100 text-purple-700',
            STORE_OWNER: 'bg-indigo-100 text-indigo-700',
            USER: 'bg-gray-100 text-gray-600'
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[role]}`}
            >
                {role}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* ================= SIDEBAR ================= */}
            <aside className="hidden md:flex flex-col w-72 sticky top-0 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white shadow-xl">

                <div className="p-6 flex items-center gap-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center font-bold animate-pulse">
                        A
                    </div>
                    <span className="text-xl font-bold">
                        Admin Panel
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin"
                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/users"
                        className="block px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md"
                    >
                        Manage Users
                    </Link>

                    <Link
                        to="/admin/stores"
                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                        Manage Stores
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold mr-3">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p>{user?.name}</p>
                            <p className="text-xs text-white/70">{user?.email}</p>
                        </div>
                    </div>

                    <Button
                        variant="danger"
                        className="w-full hover:scale-105 transition"
                        onClick={logout}
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 overflow-y-auto p-10 animate-fade">
                <div className="p-10 max-w-7xl mx-auto animate-fadeIn">

                    {/* HEADER */}
                    <header className="flex flex-col md:flex-row justify-between gap-4 mb-10">

                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                User Directory
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Manage platform accounts effortlessly.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className="hover:scale-105 transition"
                            >
                                {isFormOpen ? 'Close' : '+ Add User'}
                            </Button>
                        </div>
                    </header>

                    {error && (
                        <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-xl animate-bounce">
                            {error}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-xl">
                            {formSuccess}
                        </div>
                    )}

                    {/* ================= ADD USER FORM ================= */}
                    {isFormOpen && (
                        <div className="mb-10 bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl animate-slideDown">

                            <h2 className="text-xl font-bold mb-6 text-indigo-700">
                                Register New Account
                            </h2>

                            {formError && (
                                <div className="text-red-600 mb-4">
                                    {formError}
                                </div>
                            )}

                            <form
                                onSubmit={handleAddUser}
                                className="grid md:grid-cols-2 gap-6"
                            >
                                <Input label="Full Name" name="name" required value={formData.name} onChange={handleInputChange} />
                                <Input label="Email" name="email" required value={formData.email} onChange={handleInputChange} />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    <option value="USER">User</option>
                                    <option value="STORE_OWNER">Store Owner</option>
                                    <option value="ADMIN">Admin</option>
                                </select>

                                <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleInputChange} />

                                <div className="md:col-span-2">
                                    <Input label="Address" name="address" required value={formData.address} onChange={handleInputChange} />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-3">
                                    <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" isLoading={formLoading}>
                                        Create User
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= USERS TABLE ================= */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">

                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                                <tr>
                                    <th className="p-5 text-left text-black">User</th>
                                    <th className="p-5 text-left text-black">Address</th>
                                    <th className="p-5 text-center text-black">Role</th>
                                    <th className="p-5 text-right text-black">ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    [1,2,3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="p-5 bg-gray-100"></td>
                                            <td className="p-5 bg-gray-100"></td>
                                            <td className="p-5 bg-gray-100"></td>
                                            <td className="p-5 bg-gray-100"></td>
                                        </tr>
                                    ))
                                ) : usersList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-10 text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    usersList.map((usr) => (
                                        <tr
                                            key={usr.id}
                                            className="hover:bg-indigo-50 transition hover:scale-[1.01]"
                                        >
                                            <td className="p-5 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold">
                                                    {usr.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-black">{usr.name}</p>
                                                    <p className="text-xs text-gray-500">{usr.email}</p>
                                                </div>
                                            </td>

                                            <td className="p-5 text-gray-600">
                                                {usr.address || 'N/A'}
                                            </td>

                                            <td className="p-5 text-center">
                                                {renderRoleBadge(usr.role)}
                                            </td>

                                            <td className="p-5 text-right text-gray-400 font-mono">
                                                #{usr.id}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* ================= ANIMATIONS ================= */}
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn .6s ease forwards;
                }

                .animate-slideDown {
                    animation: slideDown .4s ease forwards;
                }

                @keyframes fadeIn {
                    from {opacity:0; transform:translateY(10px);}
                    to {opacity:1; transform:translateY(0);}
                }

                @keyframes slideDown {
                    from {opacity:0; transform:translateY(-20px);}
                    to {opacity:1; transform:translateY(0);}
                }
            `}</style>
        </div>
    );
}
<style>{`
.animate-fade{
 animation:fade .5s ease;
}
@keyframes fade{
 from{opacity:0;transform:translateY(20px);}
 to{opacity:1;transform:translateY(0);}
}
`}</style>