import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useShop();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Login successful!");
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex pt-20">
            {/* Left Side - Image (Desktop only) */}
            <div className="hidden lg:block w-1/2 relative bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white p-12">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold mb-6 font-serif italic">"Style is a way to say who you are without having to speak."</h2>
                        <p className="text-xl opacity-90">— Rachel Zoe</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                                <a href="#" className="text-xs text-gray-400 hover:text-black">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button className="w-full py-4 text-sm tracking-widest" disabled={loading}>
                            {loading ? 'SIGNING IN...' : 'SIGN IN'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-black font-bold hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
