import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateForm = () => {
        if (formData.name.length < 5 || formData.name.length > 60) {
            return "Name must be between 5 and 60 characters.";
        }

        if (formData.address.length > 400) {
            return "Address cannot exceed 400 characters.";
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            return "Password must be 8-16 chars, 1 uppercase & 1 special character.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center
            bg-gradient-to-br from-indigo-50 via-white to-purple-100
            px-4 py-12 relative overflow-hidden">

            {/* Background Glow Effects */}
            <div className="absolute w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse -top-20 -left-20"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

            {/* Register Card */}
            <div className="relative z-10 max-w-md w-full
                bg-white/80 backdrop-blur-xl
                p-8 rounded-3xl
                shadow-2xl border border-white/40
                animate-fadeInUp">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        bg-clip-text text-transparent">
                        Create Account ✨
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Join the store rating community today.
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {error && (
                        <div className="animate-shake
                            bg-red-50 border border-red-200
                            text-red-600 p-3 rounded-lg
                            text-sm font-medium text-center shadow-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Full Name"
                        name="name"
                        type="text"
                        required
                        onChange={handleChange}
                    />

                    <Input
                        label="Email address"
                        name="email"
                        type="email"
                        required
                        onChange={handleChange}
                    />

                    {/* Role Select */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-800">
                            Account Type
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
                                focus:ring-2 focus:ring-purple-500
                                focus:border-purple-500 transition-all shadow-sm"
                        >
                            <option value="USER">Normal User</option>
                            <option value="STORE_OWNER">Store Owner</option>
                            <option value="ADMIN">System Administrator</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-800">
                            Address
                        </label>

                        <textarea
                            name="address"
                            rows="2"
                            required
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300
                                focus:ring-2 focus:ring-purple-500
                                focus:border-purple-500 transition-all shadow-sm"
                        />
                    </div>

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        required
                        onChange={handleChange}
                    />

                    {/* Animated Button */}
                    <div className="transition-all duration-300 hover:scale-[1.02]">
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full py-3 text-base
                                bg-gradient-to-r from-indigo-600 to-purple-600
                                hover:from-purple-600 hover:to-pink-600
                                shadow-lg hover:shadow-xl transition-all duration-300">
                            Register Account
                        </Button>
                    </div>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors">
                        Login here
                    </Link>
                </p>
            </div>

            {/* Animations */}
            <style jsx>{`
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease forwards;
                }

                .animate-shake {
                    animation: shake 0.4s ease;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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