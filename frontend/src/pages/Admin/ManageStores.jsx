import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ManageStores() {
    const { user, logout } = useAuth();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        owner_id: ''
    });

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/stores');
            setStores(response.data);
        } catch {
            setError('Failed to load stores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            await axiosInstance.post('/admin/stores', formData);
            setFormSuccess('🎉 Store created successfully!');
            setFormData({ name: '', email: '', address: '', owner_id: '' });
            setIsFormOpen(false);
            fetchStores();
        } catch (err) {
            setFormError(
                err.response?.data?.error ||
                    'Failed to create store.'
            );
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans">

            {/* ================= SIDEBAR ================= */}
            <aside className="hidden md:flex flex-col w-72 sticky top-0 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white shadow-xl">

                <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center font-bold animate-pulse">
                        A
                    </div>
                    <span className="text-xl font-bold tracking-wide">
                        Admin Panel
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin"
                        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/stores"
                        className="block px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md font-semibold"
                    >
                        Manage Stores
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs text-white/70">
                                {user?.email}
                            </p>
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
                    <header className="mb-10 flex flex-col md:flex-row justify-between gap-4">

                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Store Directory
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Manage stores with style 🚀
                            </p>
                        </div>

                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="shadow-lg hover:scale-105 transition-transform duration-300"
                        >
                            {isFormOpen ? 'Close Form' : '+ Add Store'}
                        </Button>
                    </header>

                    {/* ALERTS */}
                    {error && (
                        <div className="mb-6 bg-red-100 text-red-600 p-4 rounded-xl animate-bounce">
                            {error}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-xl animate-fadeIn">
                            {formSuccess}
                        </div>
                    )}

                    {/* ================= ADD STORE FORM ================= */}
                    {isFormOpen && (
                        <div className="mb-10 bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/40 animate-slideDown">
                            <h2 className="text-xl font-bold mb-5 text-indigo-700">
                                Register New Store
                            </h2>

                            {formError && (
                                <div className="mb-4 text-red-600">
                                    {formError}
                                </div>
                            )}

                            <form
                                onSubmit={handleAddStore}
                                className="grid md:grid-cols-2 gap-6"
                            >
                                <Input label="Store Name" name="name" required value={formData.name} onChange={handleInputChange} />

                                <Input label="Email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />

                                <div className="md:col-span-2">
                                    <Input label="Address" name="address" required value={formData.address} onChange={handleInputChange} />
                                </div>

                                <div className="md:col-span-2">
                                    <Input label="Owner ID" name="owner_id" type="number" required value={formData.owner_id} onChange={handleInputChange} />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button type="submit" isLoading={formLoading}>
                                        Create Store
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= TABLE ================= */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/40">
                        <table className="w-full">

                            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 text-sm">
                                <tr>
                                    <th className="p-5 text-left">Store</th>
                                    <th className="p-5 text-left">Address</th>
                                    <th className="p-5 text-center">Rating</th>
                                    <th className="p-5 text-right">ID</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="p-5 h-6 bg-gray-100"></td>
                                            <td className="p-5 h-6 bg-gray-100"></td>
                                            <td className="p-5 h-6 bg-gray-100"></td>
                                            <td className="p-5 h-6 bg-gray-100"></td>
                                        </tr>
                                    ))
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-10 text-gray-500">
                                            No stores available
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store) => (
                                        <tr
                                            key={store.id}
                                            className="hover:bg-indigo-50 transition duration-300 hover:scale-[1.01]"
                                        >
                                            <td className="p-5">
                                                <p className="font-bold text-indigo-700">
                                                    {store.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {store.email}
                                                </p>
                                            </td>

                                            <td className="p-5 text-gray-600">
                                                {store.address}
                                            </td>

                                            <td className="p-5 text-center">
                                                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                                                    ⭐ {Number(store.averageRating).toFixed(1)}
                                                </span>
                                            </td>

                                            <td className="p-5 text-right text-gray-400 font-mono">
                                                #{store.id}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>

            {/* ================= CUSTOM ANIMATIONS ================= */}
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease forwards;
                }

                .animate-slideDown {
                    animation: slideDown 0.4s ease forwards;
                }

                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(10px); }
                    to { opacity:1; transform:translateY(0); }
                }

                @keyframes slideDown {
                    from { opacity:0; transform:translateY(-20px); }
                    to { opacity:1; transform:translateY(0); }
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