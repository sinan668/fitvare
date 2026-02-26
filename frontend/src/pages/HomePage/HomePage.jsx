import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';

const HomePage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [priceRange, setPriceRange] = useState(50);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const trainers = [
        {
            id: 1,
            name: "Alex Johnson",
            location: "New York, NY",
            specialization: "Weight Loss",
            rating: 4.9,
            price: 50,
            image: "https://images.unsplash.com/photo-1540206276207-3af25c08abbb?auto=format&fit=crop&q=80&w=400&h=400"
        },
        {
            id: 2,
            name: "Sarah Miller",
            location: "Los Angeles, CA",
            specialization: "Yoga & Pilates",
            rating: 4.8,
            price: 45,
            image: "https://images.unsplash.com/photo-1518611012118-296030bb0afc?auto=format&fit=crop&q=80&w=400&h=400"
        },
        {
            id: 3,
            name: "Marcus Chen",
            location: "Chicago, IL",
            specialization: "Muscle Gain",
            rating: 5.0,
            price: 60,
            image: "https://images.unsplash.com/photo-1567013127542-490d1b5e51f7?auto=format&fit=crop&q=80&w=400&h=400"
        },
        {
            id: 4,
            name: "Elena Rodriguez",
            location: "Miami, FL",
            specialization: "CrossFit",
            rating: 4.7,
            price: 55,
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#03110b] text-white selection:bg-emerald-400 selection:text-[#03110b] font-sans overflow-x-hidden">
            {/* 1. Navbar */}
            <Navbar />

            {/* 2. Hero Section */}
            <section className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-center pt-32 pb-40 overflow-hidden">
                {/* Background Image with Modern Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#03110b] via-[#03110b]/95 to-emerald-900/40 z-10 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#03110b_100%)] z-10 opacity-80"></div>
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000"
                        alt="Fitness Background"
                        className="w-full h-full object-cover opacity-60 grayscale-[0.6] scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                    />
                </div>

                <div className="container mx-auto px-6 lg:px-12 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Elite Training Network
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-8">
                            Find the Best <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-white drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Personal Trainers</span> <br />
                            Near You
                        </h1>
                        <p className="text-lg lg:text-xl text-emerald-100/60 mb-12 max-w-xl font-medium leading-relaxed">
                            Achieve your fitness goals with ease. Book certified professionals for personalized workouts, nutrition plans, and 1-on-1 coaching.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-[#03110b] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:-translate-y-1 shadow-xl shadow-emerald-500/20">
                                View All Trainers
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:-translate-y-1 backdrop-blur-md">
                                Book a Trainer
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Filter Section */}
            <section className="relative z-30 -mt-32 lg:-mt-24 container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#051c13]/80 backdrop-blur-2xl border border-emerald-500/10 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"></div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 items-end">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50 ml-1">Location</label>
                            <select className="bg-[#03110b]/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer text-sm font-bold text-white">
                                <option className="bg-[#051c13] text-white">Malappuram</option>
                                <option className="bg-[#051c13] text-white">Kozhikode</option>
                                <option className="bg-[#051c13] text-white">Kochi</option>
                                <option className="bg-[#051c13] text-white">Thiruvananthapuram</option>
                                <option className="bg-[#051c13] text-white">Kollam</option>
                                <option className="bg-[#051c13] text-white">Thrissur</option>
                                <option className="bg-[#051c13] text-white">Palakkad</option>
                                <option className="bg-[#051c13] text-white">Kannur</option>
                                <option className="bg-[#051c13] text-white">Kasaragod</option>
                                <option className="bg-[#051c13] text-white">Wayanad</option>
                                <option className="bg-[#051c13] text-white">Pathanamthitta</option>
                                <option className="bg-[#051c13] text-white">Idukki</option>
                                <option className="bg-[#051c13] text-white">Alappuzha</option>
                                <option className="bg-[#051c13] text-white">Kottayam</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50 ml-1">Specialization</label>
                            <select className="bg-[#03110b]/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer text-sm font-bold text-white">
                                <option className="bg-[#051c13] text-white">Weight Loss</option>
                                <option className="bg-[#051c13] text-white">Muscle Gain</option>
                                <option className="bg-[#051c13] text-white">Yoga & Pilates</option>
                                <option className="bg-[#051c13] text-white">CrossFit</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50">Price Range</label>
                                <span className="text-[10px] font-bold text-emerald-400">${priceRange}/session</span>
                            </div>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="20"
                                    max="150"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase font-black tracking-widest text-emerald-100/50 ml-1">Rating</label>
                            <div className="flex bg-[#03110b]/50 border border-white/5 rounded-2xl px-6 py-4">
                                <div className="flex gap-1 text-emerald-400">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-current' : 'text-emerald-900'}`} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.362-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-emerald-100/70 ml-2">4.0+</span>
                            </div>
                        </div>

                        <button className="bg-emerald-500 hover:bg-emerald-400 text-[#03110b] font-black text-sm uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* 4. Featured Trainers Section */}
            <section className="py-32 container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-4 block">Meet Our Pros</span>
                        <h2 className="text-4xl lg:text-6xl font-black">Featured Trainers</h2>
                    </div>
                    <Link to="/trainers" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group">
                        View All Trainers
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trainers.map((trainer, index) => (
                        <motion.div
                            key={trainer.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#051c13] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                            <div className="relative h-72 overflow-hidden z-10">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#051c13] via-[#051c13]/40 to-transparent opacity-90"></div>
                                <div className="absolute top-4 right-4 bg-[#03110b]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-emerald-400 font-bold text-xs">${trainer.price}<span className="text-[10px] text-emerald-100/50">/hr</span></span>
                                </div>
                            </div>
                            <div className="p-8 relative z-20">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black mb-1 text-white">{trainer.name}</h3>
                                        <p className="text-xs text-emerald-100/60 font-bold flex items-center gap-1">
                                            <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {trainer.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                        <svg className="w-3 h-3 text-emerald-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.362-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-[10px] font-black text-emerald-400">{trainer.rating}</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                        {trainer.specialization}
                                    </span>
                                </div>
                                <button className="w-full bg-[#03110b] hover:bg-emerald-500 text-white hover:text-[#03110b] border border-white/5 hover:border-emerald-500 font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 transform active:scale-95">
                                    Book Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. Call to Action Section */}
            <section className="py-24 lg:py-32 container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.2)]"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full">
                        <div className="absolute inset-0 bg-gradient-to-l from-emerald-500 via-emerald-400/80 to-transparent z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1540206276207-3af25c08abbb?auto=format&fit=crop&q=80&w=800"
                            alt="Fitness"
                            className="w-full h-full object-cover grayscale opacity-20 mix-blend-overlay"
                        />
                    </div>

                    <div className="relative z-20 max-w-2xl">
                        <h2 className="text-5xl lg:text-7xl font-black text-[#03110b] mb-8 leading-tight">
                            Start Your Fitness Journey Today
                        </h2>
                        <p className="text-xl text-[#03110b]/80 font-bold mb-12 max-w-lg">
                            Join thousands of others who fixed their physique and performance with Fitvera's elite training protocol.
                        </p>
                        <button className="bg-[#03110b] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                            Get Started
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-[#020a07] pt-24 pb-12 border-t border-white/5">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                        <div>
                            <Link to="/" className="flex items-center gap-2 mb-8 group">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <span className="text-[#03110b] font-black text-sm">V</span>
                                </div>
                                <span className="text-xl font-black tracking-tighter text-white">Fitvera</span>
                            </Link>
                            <p className="text-emerald-100/50 text-sm font-medium leading-relaxed max-w-xs">
                                Premium platform for connecting athletes with world-class certified personal trainers. Engineered for performance.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-white">Quick Links</h4>
                            <ul className="flex flex-col gap-4">
                                {['Home', 'Trainers', 'About', 'Contact'].map(link => (
                                    <li key={link}>
                                        <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-emerald-100/50 hover:text-emerald-400 transition-colors text-sm font-bold">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-white">Legal</h4>
                            <ul className="flex flex-col gap-4">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Trainer Code'].map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-emerald-100/50 hover:text-emerald-400 transition-colors text-sm font-bold">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-white">Connect</h4>
                            <div className="flex gap-4 mb-8">
                                {['FB', 'IG', 'TW', 'YT'].map(social => (
                                    <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all text-emerald-100/50">
                                        {social}
                                    </a>
                                ))}
                            </div>
                            <p className="text-emerald-100/50 text-xs font-bold">Email: support@fitvera.com</p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-emerald-100/40 text-xs font-bold uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} Fitvera. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-100/40">Peak Performance Protocol</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
