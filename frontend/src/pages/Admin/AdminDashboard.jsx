import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/admin/dashboard');
                setStats(response.data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-800">
                    Admin Portal
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block py-2.5 px-4 rounded transition duration-200 bg-gray-800 hover:bg-gray-700">
                        Dashboard
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                        Manage Users
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                        Manage Stores
                    </a>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="mb-2 text-sm text-gray-400">Logged in as: {user?.name}</div>
                    <button 
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">System Overview</h1>
                    <p className="text-gray-600 mt-1">Real-time statistics for the store rating platform.</p>
                </header>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-gray-500 text-lg animate-pulse">Loading statistics...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat Card 1 */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Registered Stores</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalStores}</p>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Ratings Submitted</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalRatings}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}