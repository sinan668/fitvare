import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#03110b]/80 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/20 transform group-hover:rotate-6 transition-transform">
                        <span className="text-[#03110b] font-black text-xl">F</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">Fitvera</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    {['Home', 'Trainers', 'About', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            className="text-sm font-bold text-emerald-100/60 hover:text-emerald-400 transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/profile" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10  rounded-full transition-all group">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[#03110b] font-black text-xs uppercase">
                                {user.name?.[0] || 'U'}
                            </div>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-emerald-100/80 hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-[#03110b] px-8 py-2.5 rounded-full text-sm font-black transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/10">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
