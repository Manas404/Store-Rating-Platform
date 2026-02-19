import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

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
                    setError("No store is currently assigned to your account. Please contact the System Administrator.");
                } else {
                    setError("Failed to load dashboard data.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper to render static stars for the table
    const renderStars = (rating) => {
        return (
            <div className="flex text-yellow-400 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-30 text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-gray-500 animate-pulse">Loading your dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Owner Portal</h1>
                    <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
                </div>
                <button 
                    onClick={logout}
                    className="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition"
                >
                    Logout
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                {error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm text-center">
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">{dashboardData.storeName}</h2>
                            <p className="text-gray-500 mt-1">Real-time rating analytics for your store.</p>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-yellow-100 text-yellow-500 rounded-full text-3xl">
                                    ★
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Rating</p>
                                    <div className="flex items-baseline space-x-2">
                                        <p className="text-4xl font-extrabold text-gray-900">
                                            {Number(dashboardData.averageRating).toFixed(1)}
                                        </p>
                                        <p className="text-lg text-gray-400">/ 5.0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-blue-100 text-blue-500 rounded-full">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Ratings</p>
                                    <p className="text-4xl font-extrabold text-gray-900">
                                        {dashboardData.totalRatings}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Ratings Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">User Reviews</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                            <th className="p-5 font-semibold">User Details</th>
                                            <th className="p-5 font-semibold">Rating Given</th>
                                            <th className="p-5 font-semibold">Date Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {dashboardData.raters.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="p-10 text-center text-gray-500">
                                                    No ratings have been submitted for your store yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            dashboardData.raters.map((rater, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                    <td className="p-5">
                                                        <p className="font-medium text-gray-900">{rater.name}</p>
                                                        <p className="text-sm text-gray-500">{rater.email}</p>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="flex flex-col">
                                                            {renderStars(rater.rating)}
                                                            <span className="text-xs text-gray-400 mt-1 font-medium">
                                                                {rater.rating} out of 5
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-sm text-gray-500">
                                                        {new Date(rater.updated_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}