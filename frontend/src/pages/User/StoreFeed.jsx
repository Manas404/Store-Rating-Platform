import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';

export default function StoreFeed() {
    const { user, logout } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const timer = setTimeout(fetchStores, 300);
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

    const submitRating = async (storeId, newRating) => {
        setStores(stores.map(store =>
            store.id === storeId ? { ...store, myRating: newRating } : store
        ));

        try {
            await axiosInstance.post('/user/ratings', {
                store_id: storeId,
                rating: newRating
            });
            fetchStores();
        } catch (error) {
            alert('Failed to submit rating');
            fetchStores();
        }
    };

    /* ⭐ Animated Star Rating */
    const StarRating = ({ storeId, currentRating }) => {
        const [hover, setHover] = useState(0);

        return (
            <div className="flex space-x-1">
                {[1,2,3,4,5].map((star)=>(
                    <button
                        key={star}
                        className={`text-2xl transition-all duration-300 transform
                        ${star <= (hover || currentRating)
                            ? 'text-amber-400 scale-125 drop-shadow-md'
                            : 'text-gray-300 hover:scale-110'
                        }`}
                        onClick={()=>submitRating(storeId,star)}
                        onMouseEnter={()=>setHover(star)}
                        onMouseLeave={()=>setHover(0)}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col
            bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">

            {/* NAVBAR */}
            <header className="sticky top-0 z-50
                backdrop-blur-xl bg-white/70
                border-b border-white/40 shadow-sm
                py-4 px-8 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Store Ratings
                    </h1>
                    <p className="text-sm text-gray-600">
                        Welcome back,
                        <span className="ml-1 font-semibold text-indigo-600">
                            {user?.name || 'User'}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-10 w-10 rounded-full
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        text-white items-center justify-center
                        font-bold shadow-lg animate-pulse">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg text-sm font-medium
                        bg-rose-50 text-rose-600
                        hover:bg-rose-500 hover:text-white
                        transition-all duration-300 shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">

                <div className="rounded-2xl overflow-hidden
                    bg-white/80 backdrop-blur-lg
                    shadow-xl border border-white/40">

                    {/* SEARCH */}
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <input
                            type="text"
                            placeholder="🔎 Search stores by name or address..."
                            className="w-full md:w-1/2 px-5 py-3 rounded-xl
                            border border-indigo-200
                            focus:ring-2 focus:ring-indigo-500
                            outline-none transition-all"
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm uppercase text-gray-600 bg-white">
                                    <th
                                        className="p-5 cursor-pointer hover:text-indigo-600 transition"
                                        onClick={()=>handleSort('name')}
                                    >
                                        Store Name {sortBy==='name' && (order==='ASC'?'↑':'↓')}
                                    </th>

                                    <th className="p-5">Address</th>

                                    <th
                                        className="p-5 cursor-pointer hover:text-indigo-600 transition"
                                        onClick={()=>handleSort('overallRating')}
                                    >
                                        Overall Rating {sortBy==='overallRating' && (order==='ASC'?'↑':'↓')}
                                    </th>

                                    <th className="p-5 text-center">
                                        Your Rating
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {loading ? (
                                    <tr>
                                        <td colSpan="4"
                                            className="p-10 text-center text-gray-500 animate-pulse">
                                            Loading stores...
                                        </td>
                                    </tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-gray-500">
                                            No stores found.
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store,index)=>(
                                        <tr
                                            key={store.id}
                                            className="group transition-all duration-300
                                            hover:bg-gradient-to-r
                                            hover:from-indigo-50
                                            hover:to-purple-50
                                            hover:shadow-md
                                            animate-fadeIn"
                                            style={{
                                                animationDelay:`${index*80}ms`
                                            }}
                                        >
                                            <td className="p-5 font-semibold text-gray-900">
                                                {store.name}
                                            </td>

                                            <td className="p-5 text-sm text-gray-500">
                                                {store.address}
                                            </td>

                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-400 text-xl animate-pulse">
                                                        ★
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        {Number(store.overallRating).toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">/5</span>
                                                </div>
                                            </td>

                                            <td className="p-5">
                                                <div className="flex flex-col items-center space-y-1">
                                                    <StarRating
                                                        storeId={store.id}
                                                        currentRating={store.myRating || 0}
                                                    />
                                                    <span className="text-xs text-gray-400">
                                                        {store.myRating ? 'Update rating' : 'Click to rate'}
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

            {/* Animation style */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity:0;
                        transform:translateY(12px);
                    }
                    to {
                        opacity:1;
                        transform:translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation:fadeIn .5s ease forwards;
                }
            `}</style>

        </div>
    );
}