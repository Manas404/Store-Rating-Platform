import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

export default function OwnerDashboard() {
    const { user, logout } = useAuth();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosInstance.get('/owner/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("No store assigned to your account.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    /* ⭐ Animated Stars */
    const renderStars = (rating) => (
        <div className="flex text-yellow-400 text-lg">
            {[1,2,3,4,5].map((star)=>(
                <span
                    key={star}
                    className={`transition-all duration-300 ${
                        star <= rating
                            ? 'scale-110 opacity-100'
                            : 'opacity-30'
                    }`}
                >
                    ★
                </span>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">

            {/* ================= HEADER ================= */}
            <header className="backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center px-6 md:px-12 py-4">

                    <div>
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Owner Portal
                        </h1>
                        <p className="text-xs text-gray-500">
                            Store performance overview
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {user?.name}
                            </span>
                        </div>

                        <Button
                            variant="danger"
                            className="hover:scale-105 transition"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full animate-fadeIn">

                {/* ERROR STATE */}
                {error ? (
                    <div className="flex flex-col items-center text-center p-14 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-dashed border-red-300 animate-pop">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold mb-2">
                            Store Not Found
                        </h3>
                        <p className="text-gray-500 max-w-md">
                            {error}
                        </p>
                    </div>
                ) : loading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-36 bg-white rounded-3xl"></div>
                            <div className="h-36 bg-white rounded-3xl"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* STORE TITLE */}
                        <div className="mb-10">
                            <h2 className="text-4xl font-extrabold text-gray-900">
                                {dashboardData.storeName}
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Real-time customer satisfaction analytics.
                            </p>
                        </div>

                        {/* ================= KPI CARDS ================= */}
                        <div className="grid sm:grid-cols-2 gap-8 mb-12">

                            {/* Rating Card */}
                            <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:scale-[1.03] transition-all duration-300">

                                <div className="flex items-center gap-6">
                                    <div className="text-5xl animate-bounce">
                                        ⭐
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-semibold">
                                            Average Rating
                                        </p>

                                        <div className="flex items-end gap-2">
                                            <h3 className="text-5xl font-extrabold text-gray-900">
                                                {Number(dashboardData.averageRating).toFixed(1)}
                                            </h3>
                                            <span className="text-gray-400 mb-1">/5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Card */}
                            <div className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:scale-[1.03] transition-all duration-300">

                                <div className="flex items-center gap-6">
                                    <div className="text-indigo-500 animate-pulse">
                                        👥
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-semibold">
                                            Total Reviews
                                        </p>
                                        <h3 className="text-5xl font-extrabold text-gray-900">
                                            {dashboardData.totalRatings}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ================= REVIEWS ================= */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-gray-900">
                                Recent Customer Reviews
                            </h3>

                            <div className="space-y-5">

                                {dashboardData.raters.length === 0 ? (
                                    <div className="text-center py-14 bg-white rounded-3xl border border-dashed">
                                        <p className="text-gray-500">
                                            No ratings submitted yet.
                                        </p>
                                    </div>
                                ) : (
                                    dashboardData.raters.map((rater, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-6 flex flex-col sm:flex-row justify-between gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >

                                            {/* User */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                                                    {rater.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {rater.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {rater.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex flex-col items-end">
                                                {renderStars(rater.rating)}

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(
                                                        rater.updated_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* ================= ANIMATIONS ================= */}
            <style>{`
                .animate-fadeIn{
                    animation:fadeIn .6s ease forwards;
                }
                .animate-pop{
                    animation:pop .4s ease forwards;
                }
                @keyframes fadeIn{
                    from{opacity:0; transform:translateY(15px);}
                    to{opacity:1; transform:translateY(0);}
                }
                @keyframes pop{
                    from{opacity:0; transform:scale(.9);}
                    to{opacity:1; transform:scale(1);}
                }
            `}</style>
        </div>
    );
}