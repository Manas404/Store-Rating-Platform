import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ManageStores() {
    const { user, logout } = useAuth();
    
    // Data State
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/stores');
            setStores(response.data);
        } catch {
            setError('Failed to load stores. Please check your connection.');
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
            setFormSuccess('Store created successfully! The user is now a Store Owner.');
            setFormData({ name: '', email: '', address: '', owner_id: '' }); // Reset form
            setIsFormOpen(false); // Close form
            fetchStores(); // Refresh the table
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to create store. Ensure the Owner ID is valid.');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar Navigation */}
            <aside className="hidden md:flex flex-col w-72 bg-gray-900 border-r border-gray-800 text-gray-300">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-800/60">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-xl font-bold text-white tracking-tight">Admin System</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
                    <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</p>
                    {/* Active State for Stores */}
                    <Link to="/admin/stores" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-800 text-white transition-colors">
                        Manage Stores
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800/60 bg-gray-900/50">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white mr-3">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="truncate">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="danger" className="w-full justify-center" onClick={logout}>Sign Out</Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Store Directory</h1>
                            <p className="text-gray-500 mt-1 font-medium">Manage existing stores or register a new one.</p>
                        </div>
                        <Button 
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="whitespace-nowrap shadow-sm"
                        >
                            {isFormOpen ? 'Close Form' : '+ Add New Store'}
                        </Button>
                    </header>

                    {/* Global Error/Success Messages */}
                    {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
                    {formSuccess && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">{formSuccess}</div>}

                    {/* Expandable Add Store Form */}
                    {isFormOpen && (
                        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Register New Store</h2>
                            
                            {formError && <div className="mb-4 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{formError}</div>}
                            
                            <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label="Store Name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Tech Superstore" />
                                <Input label="Store Email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="store@example.com" />
                                <div className="md:col-span-2">
                                    <Input label="Physical Address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Market St..." />
                                </div>
                                <div className="md:col-span-2">
                                    <Input label="Owner User ID (Numeric)" name="owner_id" type="number" required value={formData.owner_id} onChange={handleInputChange} placeholder="Enter the User ID of the owner" />
                                    <p className="text-xs text-gray-500 mt-1">This user will automatically be upgraded to a Store Owner.</p>
                                </div>
                                <div className="md:col-span-2 flex justify-end mt-2">
                                    <Button type="button" variant="secondary" className="mr-3" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={formLoading}>Create Store</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                        <th className="p-5 font-semibold">Store Details</th>
                                        <th className="p-5 font-semibold">Address</th>
                                        <th className="p-5 font-semibold text-center">Avg Rating</th>
                                        <th className="p-5 font-semibold text-right">Store ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                    {loading ? (
                                        // Skeleton rows
                                        [1, 2, 3, 4].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="p-5"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
                                                <td className="p-5"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                                <td className="p-5 text-center"><div className="h-6 bg-gray-200 rounded-full w-12 mx-auto"></div></td>
                                                <td className="p-5 text-right"><div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : stores.length === 0 ? (
                                        <tr><td colSpan="4" className="p-10 text-center text-gray-500">No stores registered in the system yet.</td></tr>
                                    ) : (
                                        stores.map((store) => (
                                            <tr key={store.id} className="hover:bg-blue-50/30 transition duration-150">
                                                <td className="p-5">
                                                    <p className="font-bold text-gray-900">{store.name}</p>
                                                    <p className="text-gray-500">{store.email}</p>
                                                </td>
                                                <td className="p-5 text-gray-500 max-w-xs truncate" title={store.address}>
                                                    {store.address}
                                                </td>
                                                <td className="p-5 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                                        ★ {Number(store.averageRating).toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-right font-mono text-gray-400">
                                                    #{store.id}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}