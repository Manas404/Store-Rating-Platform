import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
    const navigate = useNavigate();
    // 1. Added 'role' to the initial state, defaulting to 'USER'
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: '', role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.name.length < 5 || formData.name.length > 60) {
            return "Name must be between 5 and 60 characters.";
        }
        if (formData.address.length > 400) {
            return "Address cannot exceed 400 characters.";
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            return "Password must be 8-16 chars, 1 uppercase, 1 special character.";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Join the store rating platform today.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium text-center">
                            {error}
                        </div>
                    )}
                    
                    <Input label="Full Name" name="name" type="text" required onChange={handleChange} />
                    <Input label="Email address" name="email" type="email" required onChange={handleChange} />
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-800">Account Type (Dev Only)</label>
                        <select 
                            name="role" 
                            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            onChange={handleChange}
                            value={formData.role}
                        >
                            <option value="USER">Normal User</option>
                            <option value="STORE_OWNER">Store Owner</option>
                            <option value="ADMIN">System Administrator</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-800">Address</label>
                        <textarea 
                            name="address" rows="2" required 
                            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    
                    <Input label="Password" name="password" type="password" required onChange={handleChange} />

                    <Button type="submit" className="w-full mt-2" isLoading={loading}>
                        Register Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Already have an account? <Link to="/login" className="text-blue-700 hover:text-blue-800 font-semibold transition-colors">Login here</Link>
                </p>
            </div>
        </div>
    );
}