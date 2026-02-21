import { createContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const initialized = useRef(false);

    // Check existing login
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);

            // Role Redirect
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'STORE_OWNER') navigate('/owner');
            else navigate('/user');

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    /* ==========================
       BEAUTIFUL LOADING SCREEN
    ========================== */

    if (loading) {
        return (
            <div className="
                min-h-screen flex items-center justify-center
                bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600
                relative overflow-hidden
            ">

                {/* Glow Background */}
                <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse -top-20 -left-20"></div>
                <div className="absolute w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

                {/* Loader Card */}
                <div className="
                    relative z-10
                    bg-white/15 backdrop-blur-xl
                    border border-white/20
                    rounded-3xl
                    px-10 py-12
                    shadow-2xl
                    text-center
                    animate-fadeIn
                ">

                    {/* Spinner */}
                    <div className="flex justify-center mb-6">
                        <div className="
                            w-14 h-14
                            border-4 border-white/30
                            border-t-white
                            rounded-full
                            animate-spin
                        "></div>
                    </div>

                    {/* Text */}
                    <h2 className="text-white text-xl font-semibold tracking-wide">
                        Preparing your experience...
                    </h2>

                    <p className="text-white/80 text-sm mt-2">
                        Checking authentication status
                    </p>
                </div>

                {/* Animations */}
                <style jsx>{`
                    .animate-fadeIn {
                        animation: fadeIn 0.8s ease forwards;
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>

            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}