import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function ManageUsers() {
    // Data State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter & Sort State
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('ASC');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: '', role: 'USER'
    });
    const [modalError, setModalError] = useState('');

    // Fetch users whenever filters or sorting change
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/users', {
                params: { 
                    search: search || undefined, 
                    role: roleFilter || undefined, 
                    sortBy, 
                    order 
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search input for better UX (optional, but recommended)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300); // Wait 300ms after user stops typing to fetch
        return () => clearTimeout(timer);
    }, [search, roleFilter, sortBy, order]);

    // Handle Column Sorting
    const handleSort = (column) => {
        if (sortBy === column) {
            setOrder(order === 'ASC' ? 'DESC' : 'ASC'); // Toggle order
        } else {
            setSortBy(column);
            setOrder('ASC'); // Default to ASC for new column
        }
    };

    // Handle Form Submission for New User
    const handleAddUser = async (e) => {
        e.preventDefault();
        setModalError('');
        try {
            await axiosInstance.post('/admin/users', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
            fetchUsers(); // Refresh the table
        } catch (error) {
            setModalError(error.response?.data?.error || 'Failed to add user.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar (Search, Filter, Add Button) */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <input 
                        type="text" 
                        placeholder="Search by Name, Email, or Address..." 
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-96"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">Normal User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                    </select>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                >
                    + Add User
                </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('name')}
                            >
                                Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('email')}
                            >
                                Email {sortBy === 'email' && (order === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th className="p-4">Address</th>
                            <th 
                                className="p-4 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => handleSort('role')}
                            >
                                Role {sortBy === 'role' && (order === 'ASC' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4 text-gray-600 truncate max-w-xs">{u.address}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            u.role === 'STORE_OWNER' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        {modalError && <div className="bg-red-50 text-red-500 p-2 text-sm rounded mb-4">{modalError}</div>}
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input 
                                type="text" placeholder="Full Name (Min 20 chars)" required
                                className="w-full px-4 py-2 border rounded-lg"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="Email Address" required
                                className="w-full px-4 py-2 border rounded-lg"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <input 
                                type="password" placeholder="Password (8-16 chars, 1 uppercase, 1 special)" required
                                className="w-full px-4 py-2 border rounded-lg"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <textarea 
                                placeholder="Address" required
                                className="w-full px-4 py-2 border rounded-lg"
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                            <select 
                                className="w-full px-4 py-2 border rounded-lg"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="USER">Normal User</option>
                                <option value="ADMIN">System Administrator</option>
                            </select>
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}