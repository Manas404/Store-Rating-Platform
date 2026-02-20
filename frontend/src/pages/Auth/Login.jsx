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

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(credentials.email, credentials.password);
        if (!result.success) setError(result.error);
        setLoading(false);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            
            {/* Left Column: The Login Form */}
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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

                        <Button type="submit" className="w-full py-2.5 text-base" isLoading={loading}>
                            Sign in to account
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column: Visual/Branding Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-900 text-white p-12 relative overflow-hidden">
                {/* Decorative background shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-8 ring-1 ring-white/20">
                        <span className="text-3xl">⭐</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-6 leading-tight">
                        The gold standard for store ratings.
                    </h3>
                    <p className="text-lg text-blue-100 font-medium leading-relaxed">
                        Join thousands of users and business owners building a community of trust through verified, honest reviews.
                    </p>
                </div>

                {/* Optional: Mock UI representation floating at the bottom */}
                <div className="absolute -bottom-24 w-[120%] h-64 bg-white/5 backdrop-blur-md rounded-t-[4rem] border-t border-white/10 transform rotate-3"></div>
            </div>

        </div>
    );
}