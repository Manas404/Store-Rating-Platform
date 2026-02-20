import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

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
            } catch {
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, color: 'blue', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
        { label: 'Registered Stores', value: stats.totalStores, color: 'emerald', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
        { label: 'Ratings Submitted', value: stats.totalRatings, color: 'purple', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> }
    ];

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
                    <Link to="/" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-800 text-white group transition-colors">
                        <span className="truncate">Dashboard</span>
                    </Link>
                    
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</p>
                    <Link to="/admin/users" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
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
                    <header className="mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
                        <p className="text-gray-500 mt-2 font-medium">Real-time platform metrics and activity.</p>
                    </header>

                    {error && (
                        <div className="mb-8 bg-red-50/50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {statCards.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
                                    <div className={`p-4 rounded-full ring-4 ring-${stat.color}-50 bg-${stat.color}-50 text-${stat.color}-600`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {stat.icon}
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}