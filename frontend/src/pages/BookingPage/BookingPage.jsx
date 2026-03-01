import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';

const BookingPage = () => {
    const { trainerId } = useParams();
    const navigate = useNavigate();

    // Mock trainer data based on ID (In a real app, fetch from API)
    const [trainer, setTrainer] = useState({
        id: trainerId || "1",
        name: "Alex Johnson",
        specialization: "Weight Loss & Conditioning",
        experience: 5,
        rating: 4.9,
        rate: 50,
        image: "https://images.unsplash.com/photo-1540206276207-3af25c08abbb?auto=format&fit=crop&q=80&w=400&h=400",
        reviews: 124
    });

    // Form State
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [sessionType, setSessionType] = useState("In-Person Session");
    const [duration, setDuration] = useState("1 Hour");
    const [notes, setNotes] = useState("");

    // Booking State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Dynamic Pricing Calculation
    const getDurationMultiplier = (durationStr) => {
        if (durationStr === "30 Minutes") return 0.5;
        if (durationStr === "90 Minutes") return 1.5;
        return 1; // 1 Hour
    };

    const totalPrice = trainer.rate * getDurationMultiplier(duration);

    // Available Time Slots Mock
    const timeSlots = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "5:30 PM"];

    const handleConfirmBooking = () => {
        if (!date || !time) {
            alert("Please select a date and time to continue.");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-400 selection:text-white">
            {/* Header Area (Dark to match Navbar) */}
            <div className="bg-[#03110b] pb-40 pt-24 rounded-b-[4rem] relative z-0">
                <Navbar />
                <div className="container mx-auto px-6 lg:px-12 mt-12 text-center text-white relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Book a Session</h1>
                    <p className="text-emerald-100/60 font-medium">Select a time that works for you</p>
                </div>
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <main className="container mx-auto px-6 lg:px-12 -mt-32 relative z-10 pb-24">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="booking-form"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12">
                                {/* Left Column: Trainer Profile Summary & Pricing */}
                                <div className="lg:col-span-4 bg-slate-50/50 p-8 md:p-10 border-r border-slate-100 lg:border-b-0 border-b">
                                    <div className="flex flex-col items-center text-center mb-8">
                                        <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl shadow-emerald-500/20 mb-6 ring-4 ring-white">
                                            <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 mb-1">{trainer.name}</h2>
                                        <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-4">
                                            {trainer.specialization}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.362-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-slate-700">{trainer.rating}</span>
                                                <span className="text-slate-400 font-medium">({trainer.reviews})</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 text-slate-700">
                                                {trainer.experience} Yrs Exp.
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-200 mb-8" />

                                    {/* Order Summary */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Order Summary</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                                <span>Hourly Rate</span>
                                                <span className="font-bold text-slate-800">${trainer.rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                                <span>Duration</span>
                                                <span className="font-bold text-slate-800">{duration}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                                <span>Session Type</span>
                                                <span className="font-bold text-slate-800">{sessionType}</span>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-end">
                                                <span className="text-sm font-medium text-slate-500">Total Price</span>
                                                <span className="text-3xl font-black text-emerald-600">${totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Booking Controls */}
                                <div className="lg:col-span-8 p-8 md:p-10 lg:p-12 bg-white">
                                    <h3 className="text-2xl font-black text-slate-800 mb-8">Schedule Details</h3>

                                    <div className="space-y-8">
                                        {/* Row 1: Date & Time */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Select Date
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Available Time
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {timeSlots.map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setTime(t)}
                                                            className={`py-3 rounded-xl text-xs font-black tracking-wide transition-all ${time === t
                                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50'
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Type & Duration */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session Type</label>
                                                <div className="relative">
                                                    <select
                                                        value={sessionType}
                                                        onChange={(e) => setSessionType(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option>In-Person Session</option>
                                                        <option>Online Session</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duration</label>
                                                <div className="relative">
                                                    <select
                                                        value={duration}
                                                        onChange={(e) => setDuration(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option>30 Minutes</option>
                                                        <option>1 Hour</option>
                                                        <option>90 Minutes</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Additional Notes (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Any specific goals or injuries the trainer should know about?"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all min-h-[120px] resize-none"
                                            ></textarea>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-6">
                                            <button
                                                onClick={handleConfirmBooking}
                                                disabled={isSubmitting}
                                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform shadow-xl flex justify-center items-center gap-2 ${isSubmitting
                                                        ? 'bg-emerald-400 cursor-not-allowed text-white shadow-emerald-500/20'
                                                        : 'bg-emerald-500 hover:bg-emerald-400 hover:-translate-y-1 text-white shadow-emerald-500/30'
                                                    }`}
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        Confirm Booking
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                            className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 p-12 md:p-16 max-w-2xl mx-auto text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20"
                            >
                                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>

                            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Booking Confirmed!</h2>
                            <p className="text-slate-500 font-medium mb-10 text-lg">Your session with {trainer.name} is all set.</p>

                            <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100 text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6 border-b border-slate-200 pb-4">Session Details</h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Date</p>
                                        <p className="font-black text-slate-700">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Time</p>
                                        <p className="font-black text-slate-700">{time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Type</p>
                                        <p className="font-black text-slate-700">{sessionType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Duration</p>
                                        <p className="font-black text-slate-700">{duration}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-slate-800 hover:bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl"
                            >
                                Go to Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default BookingPage;
