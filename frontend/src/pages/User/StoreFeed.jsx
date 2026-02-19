import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function StoreFeed() {
    const { user, logout } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search and Sort State
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('ASC');

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/user/stores', {
                params: { 
                    search: search || undefined, 
                    sortBy, 
                    order 
                }
            });
            setStores(response.data);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search and dependency-driven fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStores();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sortBy, order]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setOrder(order === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(column);
            setOrder('ASC');
        }
    };

    // Handle interactive star rating submission
    const submitRating = async (storeId, newRating) => {
        // Optimistic UI update for immediate feedback
        setStores(stores.map(store => 
            store.id === storeId ? { ...store, myRating: newRating } : store
        ));

        try {
            await axiosInstance.post('/user/ratings', {
                store_id: storeId,
                rating: newRating
            });
            // Fetch again in background to get the updated 'overallRating'
            fetchStores(); 
        } catch (error) {
            console.error('Failed to submit rating:', error);
            alert('Failed to submit your rating. Please try again.');
            fetchStores(); // Revert on failure
        }
    };

    // Helper component for the 5-star interactive UI
    const StarRating = ({ storeId, currentRating }) => {
        const [hover, setHover] = useState(0);

        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`text-2xl focus:outline-none transition-colors duration-200 ${
                            star <= (hover || currentRating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => submitRating(storeId, star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        title={`Rate ${star} stars`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Store Ratings Feed</h1>
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
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Search Bar */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <input 
                            type="text" 
                            placeholder="Search stores by Name or Address..." 
                            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                    <th 
                                        className="p-5 cursor-pointer hover:bg-gray-50 transition font-semibold"
                                        onClick={() => handleSort('name')}
                                    >
                                        Store Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-5 font-semibold">Address</th>
                                    <th 
                                        className="p-5 cursor-pointer hover:bg-gray-50 transition font-semibold"
                                        onClick={() => handleSort('overallRating')}
                                    >
                                        Overall Rating {sortBy === 'overallRating' && (order === 'ASC' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-5 font-semibold text-center">Your Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-gray-500 animate-pulse">Loading stores...</td></tr>
                                ) : stores.length === 0 ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-gray-500">No stores found matching your search.</td></tr>
                                ) : (
                                    stores.map((store) => (
                                        <tr key={store.id} className="hover:bg-blue-50/50 transition duration-150">
                                            <td className="p-5 font-medium text-gray-900">{store.name}</td>
                                            <td className="p-5 truncate max-w-md text-sm text-gray-500">{store.address}</td>
                                            <td className="p-5">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-yellow-400 text-xl">★</span>
                                                    <span className="font-bold text-lg">
                                                        {Number(store.overallRating).toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">/ 5</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex justify-center flex-col items-center space-y-1">
                                                    <StarRating 
                                                        storeId={store.id} 
                                                        currentRating={store.myRating || 0} 
                                                    />
                                                    <span className="text-xs text-gray-400">
                                                        {store.myRating ? 'Click to modify' : 'Click to rate'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}