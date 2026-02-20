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
                    setError("No store is currently assigned to your account.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const renderStars = (rating) => (
        <div className="flex text-amber-400 text-lg drop-shadow-sm">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-20 text-gray-400'}>
                    ★
                </span>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Owner Portal</h1>
                    {/* <p className="text-xs md:text-sm text-gray-500">Manage your store analytics</p> */}
                </div>
                <div className="flex items-center space-x-4">
                    <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.name}</span>
                    <Button variant="secondary" className='text-white' onClick={logout}>Logout</Button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
                {error ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Store Not Found</h3>
                        <p className="text-gray-500 max-w-sm">{error} Please contact the System Administrator to configure your storefront.</p>
                    </div>
                ) : loading ? (
                    <div className="space-y-8 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-32 bg-white border border-gray-100 rounded-2xl"></div>
                            <div className="h-32 bg-white border border-gray-100 rounded-2xl"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{dashboardData.storeName}</h2>
                            <p className="text-gray-500 mt-1 font-medium">Real-time rating analytics for your business.</p>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-amber-50 text-amber-500 rounded-full text-3xl ring-4 ring-amber-50/50">★</div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Average Rating</p>
                                    <div className="flex items-baseline space-x-2">
                                        <p className="text-4xl font-extrabold text-gray-900">{Number(dashboardData.averageRating).toFixed(1)}</p>
                                        <p className="text-sm font-medium text-gray-400">/ 5.0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-6">
                                <div className="p-4 bg-blue-50 text-blue-500 rounded-full ring-4 ring-blue-50/50">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Reviews</p>
                                    <p className="text-4xl font-extrabold text-gray-900">{dashboardData.totalRatings}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Ratings List (Replaces Table) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Customer Reviews</h3>
                            <div className="space-y-4">
                                {dashboardData.raters.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 font-medium">No ratings have been submitted for your store yet.</p>
                                    </div>
                                ) : (
                                    dashboardData.raters.map((rater, index) => (
                                        <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold">
                                                    {rater.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{rater.name}</p>
                                                    <p className="text-xs text-gray-500">{rater.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                                                {renderStars(rater.rating)}
                                                <p className="text-xs text-gray-400 font-medium mt-1">
                                                    {new Date(rater.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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
        </div>
    );
}