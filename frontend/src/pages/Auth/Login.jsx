import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(credentials.email, credentials.password);

        if (!result.success) setError(result.error);

        setLoading(false);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-indigo-50">

            {/* LEFT SIDE — LOGIN FORM */}
            <div className="flex flex-col justify-center items-center px-6 lg:px-8">

                <div className="w-full max-w-md space-y-8 animate-fadeInUp">

                    {/* Heading */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome back 👋
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue your journey.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                        {error && (
                            <div className="animate-shake bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start shadow-sm">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <Input
                                label="Email address"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                onChange={handleChange}
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        {/* Animated Button */}
                        <div className="transition-all duration-300 hover:scale-[1.02]">
                            <Button
                                type="submit"
                                className="w-full py-3 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300"
                                isLoading={loading}
                            >
                                Sign in to account
                            </Button>
                        </div>
                    </form>

                    {/* Register */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
                        >
                            Create one now
                        </Link>
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE — BRAND PANEL */}
            <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden text-white
                bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">

                {/* Animated Glow Background */}
                <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
                <div className="absolute w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>

                {/* Floating Content */}
                <div className="relative z-10 max-w-lg text-center px-12 animate-fadeIn">

                    <div className="inline-flex items-center justify-center
                        w-20 h-20 rounded-full
                        bg-white/20 backdrop-blur-lg
                        mb-8 ring-2 ring-white/30
                        animate-bounce">

                        <span className="text-4xl">⭐</span>
                    </div>

                    <h3 className="text-5xl font-bold mb-6 leading-tight">
                        The gold standard for store ratings.
                    </h3>

                    <p className="text-lg text-indigo-100 font-medium leading-relaxed">
                        Join thousands of users and business owners building a
                        trusted community through verified reviews and real
                        experiences.
                    </p>
                </div>

                {/* Glass Bottom Shape */}
                <div className="absolute -bottom-24 w-[120%] h-72
                    bg-white/10 backdrop-blur-xl
                    rounded-t-[4rem]
                    border-t border-white/20
                    transform rotate-3">
                </div>
            </div>

            {/* Tailwind Custom Animations */}
            <style jsx>{`
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease forwards;
                }

                .animate-fadeIn {
                    animation: fadeIn 1s ease forwards;
                }

                .animate-shake {
                    animation: shake 0.4s ease;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}