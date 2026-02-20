import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ManageUsers() {
    const { user, logout } = useAuth();
    
    // Data State
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Filters & Search (Optional for later expansion, currently just fetching all)
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: { search: search || undefined }
            });
            setUsersList(response.data);
        } catch {
            setError('Failed to load users. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 300);
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
            setFormSuccess(`${formData.role} created successfully!`);
            setFormData({ name: '', email: '', password: '', address: '', role: 'USER' }); // Reset form
            setIsFormOpen(false); // Close form
            fetchUsers(); // Refresh the table
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to create user. Email might already exist.');
        } finally {
            setFormLoading(false);
        }
    };

    // Helper function for rendering role badges
    const renderRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">ADMIN</span>;
            case 'STORE_OWNER':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">STORE OWNER</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">USER</span>;
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
                    {/* Active State for Users */}
                    <Link to="/admin/users" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-800 text-white transition-colors">
                        Manage Users
                    </Link>
                    <Link to="/admin/stores" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
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
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Directory</h1>
                            <p className="text-gray-500 mt-1 font-medium">Manage platform accounts and administrative roles.</p>
                        </div>
                        <div className="flex space-x-3">
                            <Input 
                                placeholder="Search users..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button 
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className="whitespace-nowrap shadow-sm h-[42px] mt-1" 
                            >
                                {isFormOpen ? 'Close Form' : '+ Add New User'}
                            </Button>
                        </div>
                    </header>

                    {/* Global Error/Success Messages */}
                    {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
                    {formSuccess && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">{formSuccess}</div>}

                    {/* Expandable Add User Form */}
                    {isFormOpen && (
                        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Register New Account</h2>
                            
                            {formError && <div className="mb-4 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{formError}</div>}
                            
                            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label="Full Name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. John Doe" />
                                <Input label="Email Address" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Account Role</label>
                                    <select 
                                        name="role" 
                                        required
                                        className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={handleInputChange}
                                        value={formData.role}
                                    >
                                        <option value="USER">Normal User</option>
                                        <option value="STORE_OWNER">Store Owner</option>
                                        <option value="ADMIN">System Administrator</option>
                                    </select>
                                </div>
                                <Input label="Temporary Password" name="password" type="password" required value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
                                
                                <div className="md:col-span-2">
                                    <Input label="Physical Address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Market St..." />
                                </div>
                                
                                <div className="md:col-span-2 flex justify-end mt-2">
                                    <Button type="button" variant="secondary" className="mr-3" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={formLoading}>Create User</Button>
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
                                        <th className="p-5 font-semibold">User Details</th>
                                        <th className="p-5 font-semibold">Address</th>
                                        <th className="p-5 font-semibold text-center">System Role</th>
                                        <th className="p-5 font-semibold text-right">User ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                                    {loading ? (
                                        // Skeleton rows
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="p-5">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                        <div>
                                                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                            <div className="h-3 bg-gray-100 rounded w-24"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5"><div className="h-4 bg-gray-100 rounded w-full max-w-[200px]"></div></td>
                                                <td className="p-5 text-center"><div className="h-6 bg-gray-200 rounded-md w-16 mx-auto"></div></td>
                                                <td className="p-5 text-right"><div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
                                            </tr>
                                        ))
                                    ) : usersList.length === 0 ? (
                                        <tr><td colSpan="4" className="p-10 text-center text-gray-500">No users found in the system.</td></tr>
                                    ) : (
                                        usersList.map((usr) => (
                                            <tr key={usr.id} className="hover:bg-blue-50/30 transition duration-150">
                                                <td className="p-5">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                                            {usr.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{usr.name}</p>
                                                            <p className="text-gray-500 text-xs">{usr.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-gray-500 max-w-xs truncate" title={usr.address}>
                                                    {usr.address || 'N/A'}
                                                </td>
                                                <td className="p-5 text-center">
                                                    {renderRoleBadge(usr.role)}
                                                </td>
                                                <td className="p-5 text-right font-mono text-gray-400">
                                                    #{usr.id}
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