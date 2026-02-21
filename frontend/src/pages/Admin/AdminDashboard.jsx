import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {

    const { user, logout } = useAuth();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('/admin/dashboard');
                setStats(res.data);
            } catch {
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            gradient: 'from-indigo-500 to-purple-600',
            icon:
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" />
        },
        {
            label: 'Registered Stores',
            value: stats.totalStores,
            gradient: 'from-emerald-500 to-teal-600',
            icon:
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
        },
        {
            label: 'Ratings Submitted',
            value: stats.totalRatings,
            gradient: 'from-pink-500 to-rose-600',
            icon:
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M11.049 2.927l1.519 4.674h4.915l-3.976 2.888 1.518 4.674-3.976-2.888-3.976 2.888 1.518-4.674L2.615 7.601h4.914z" />
        }
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

            {/* ================= SIDEBAR FIXED ================= */}
            <aside className="
                hidden md:flex flex-col w-72
                sticky top-0 h-screen
                bg-gray-900/95 backdrop-blur-xl
                border-r border-gray-800 text-gray-300
                animate-slideInLeft
                flex-shrink-0
            ">

                <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
                    <div className="w-10 h-10 rounded-xl
                        bg-gradient-to-r from-indigo-500 to-purple-600
                        flex items-center justify-center
                        text-white font-bold shadow-lg">
                        A
                    </div>

                    <span className="text-xl font-bold text-white">
                        Admin Panel
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

                    <Link to="/"
                        className="block px-4 py-3 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white font-medium shadow-md">
                        Dashboard
                    </Link>

                    <Link to="/admin/users"
                        className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition">
                        Manage Users
                    </Link>

                    <Link to="/admin/stores"
                        className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition">
                        Manage Stores
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">

                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full
                            bg-gradient-to-r from-indigo-500 to-purple-600
                            flex items-center justify-center text-white mr-3">
                            {user?.name?.charAt(0)}
                        </div>

                        <div>
                            <p className="text-sm text-white font-medium">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <Button variant="danger" className="w-full" onClick={logout}>
                        Sign Out
                    </Button>

                </div>
            </aside>

            {/* ================= MAIN CONTENT FIX ================= */}
            <main className="flex-1 overflow-y-auto">

                <div className="p-10 max-w-7xl mx-auto animate-fadeInUp">

                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold
                            bg-gradient-to-r from-indigo-600 to-purple-600
                            bg-clip-text text-transparent">
                            System Overview
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Real-time analytics & platform metrics
                        </p>
                    </header>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200
                            text-red-600 p-4 rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i}
                                    className="h-36 rounded-2xl
                                    bg-white shadow-lg
                                    animate-pulse" />
                            ))}
                        </div>
                    ) : (

                        <div className="grid md:grid-cols-3 gap-6">

                            {statCards.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="
                                        group relative
                                        rounded-3xl p-6
                                        bg-white
                                        shadow-lg
                                        hover:shadow-2xl
                                        transition-all duration-300
                                        hover:-translate-y-2
                                    ">

                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20
                                        bg-gradient-to-r ${stat.gradient}
                                        blur-2xl transition duration-500`} />

                                    <div className="relative flex items-center gap-5">

                                        <div className={`
                                            p-4 rounded-2xl text-white
                                            bg-gradient-to-r ${stat.gradient}
                                            shadow-lg`}>
                                            <svg className="w-7 h-7"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                {stat.icon}
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase
                                                text-gray-400 font-bold tracking-wider">
                                                {stat.label}
                                            </p>

                                            <p className="text-3xl font-extrabold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </main>

            {/* ================= ANIMATIONS ================= */}
            <style>{`
                .animate-fadeInUp {
                    animation: fadeInUp .8s ease forwards;
                }

                .animate-slideInLeft {
                    animation: slideLeft .7s ease forwards;
                }

                .animate-shake {
                    animation: shake .4s ease;
                }

                @keyframes fadeInUp {
                    from { opacity:0; transform:translateY(40px); }
                    to { opacity:1; transform:translateY(0); }
                }

                @keyframes slideLeft {
                    from { opacity:0; transform:translateX(-60px); }
                    to { opacity:1; transform:translateX(0); }
                }

                @keyframes shake {
                    0%,100%{transform:translateX(0);}
                    25%{transform:translateX(-4px);}
                    75%{transform:translateX(4px);}
                }
            `}</style>

        </div>
    );
}