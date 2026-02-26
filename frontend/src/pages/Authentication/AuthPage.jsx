import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    const [isLogin, setIsLogin] = useState(location.pathname === '/login');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
        setError('');
    }, [location.pathname]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email: form.email, password: form.password });
            } else {
                await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: 'client'
                });
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#03110b] text-white selection:bg-emerald-400 selection:text-[#03110b] font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements to match HomePage */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#03110b] via-[#03110b]/95 to-emerald-900/20 z-10"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo Section */}


                {/* Form Card */}
                <div className="bg-[#051c13]/80 backdrop-blur-2xl border border-emerald-500/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-400/20 transform group-hover:rotate-6 transition-transform">
                                <span className="text-[#03110b] font-black text-2xl">F</span>
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">Fitvera</span>
                        </Link>
                    </div>
                    {/* Tabs */}
                    <div className="flex bg-[#03110b]/50 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => navigate('/login')}
                            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${isLogin ? 'bg-emerald-500 text-[#03110b] shadow-lg shadow-emerald-500/20' : 'text-emerald-100/50 hover:text-white'}`}
                        >
                            LOGIN
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${!isLogin ? 'bg-emerald-500 text-[#03110b] shadow-lg shadow-emerald-500/20' : 'text-emerald-100/50 hover:text-white'}`}
                        >
                            SIGN UP
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full bg-[#03110b]/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm font-bold text-white placeholder:text-emerald-100/10"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="email@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#03110b]/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm font-bold text-white placeholder:text-emerald-100/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50">Password</label>
                                {isLogin && (
                                    <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full bg-[#03110b]/50 border border-white/5 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm font-bold text-white placeholder:text-emerald-100/10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-emerald-100/30 hover:text-emerald-400 transition-colors"
                                >
                                    {showPwd ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center ml-1">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={form.rememberMe}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center transition-all ${form.rememberMe ? 'bg-emerald-500 border-emerald-500' : 'bg-[#03110b]/50'}`}>
                                        {form.rememberMe && (
                                            <svg className="w-3 h-3 text-[#03110b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="ml-3 text-xs font-bold text-emerald-100/50 group-hover:text-emerald-100/80 transition-colors">Remember me</span>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#03110b] font-black text-sm uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center relative overflow-hidden disabled:opacity-70 disabled:transform-none"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-[#03110b]/30 border-t-[#03110b] rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Login Now' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs font-bold text-emerald-100/40 uppercase tracking-widest">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <Link
                            to={isLogin ? '/register' : '/login'}
                            className="ml-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </Link>
                    </p>
                </div>

                <div className="mt-12 flex justify-center items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-100/20">Peak Performance Protocol</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
