import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { authService } from '../../../services/authService'
import api from '../../../services/authService'
import Navbar from '../../../components/Navbar/Navbar'

const mockBookings = [
    {
        id: 1,
        clientName: 'Michael Scott',
        date: 'Today',
        time: '5:00 PM',
        type: 'Weight Loss Session',
        status: 'confirmed'
    },
    {
        id: 2,
        clientName: 'Jim Halpert',
        date: 'Today',
        time: '7:30 PM',
        type: 'Strength Training',
        status: 'pending'
    }
]

const TrainerProfileLayout = ({ user, handleLogout, setShowPasswordModal, setShowLogoutConfirm }) => {
    const [loading, setLoading] = useState(true)
    const [trainer, setTrainer] = useState(null)
    const [isPublicView, setIsPublicView] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
    const [editForm, setEditForm] = useState(null)
    const [availability, setAvailability] = useState(null)
    const [tempAvailability, setTempAvailability] = useState(null)
    const [bookings, setBookings] = useState([])

    const SPECIALIZATIONS = [
        'Weight Loss', 'Muscle Gain', 'Yoga & Pilates', 'CrossFit',
        'Strength Training', 'HIIT', 'Cardio & Endurance', 'Nutrition Coaching',
        'Rehabilitation', 'Bodybuilding',
    ]

    const toggleSpec = (spec) => {
        setEditForm(prev => {
            const specs = prev.specializations || []
            if (specs.includes(spec)) {
                return { ...prev, specializations: specs.filter(s => s !== spec) }
            } else {
                return { ...prev, specializations: [...specs, spec] }
            }
        })
    }

    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const token = localStorage.getItem('token')
                const [trainerRes, bookingsRes] = await Promise.all([
                    api.get('/trainers/me'),
                    api.get(`/bookings/trainer/${user.id || user._id}`)
                ])

                const profileData = trainerRes.data.data
                if (!profileData || !profileData.user) {
                    throw new Error('Incomplete trainer profile data')
                }

                setTrainer({
                    ...profileData,
                    name: profileData.user.name,
                    email: profileData.user.email
                })
                setEditForm({
                    ...profileData,
                    name: profileData.user.name,
                    email: profileData.user.email
                })
                setAvailability(profileData.availability || {})
                setTempAvailability(profileData.availability || {})

                if (bookingsRes.data.success) {
                    setBookings(bookingsRes.data.data)
                }
            } catch (error) {
                console.error('Error fetching trainer data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchTrainerData()
        }
    }, [user])

    const handleSave = () => {
        setTrainer(editForm)
        setIsEditing(false)
    }

    const toggleView = () => setIsPublicView(!isPublicView)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!trainer) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <h2 className="text-2xl font-black">Trainer Profile Not Found</h2>
                <p className="text-emerald-100/50">You haven't completed your trainer application yet.</p>
            </div>
        )
    }

    if (isPublicView) {
        return (
            <div className="selection:bg-emerald-400 selection:text-[#03110b] font-sans pb-24">
                {/* Back to admin view button */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={toggleView}
                        className="bg-emerald-500 hover:bg-emerald-400 text-[#03110b] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

                <main className="relative z-10 container mx-auto px-6 lg:px-12 pt-8 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#051c13]/70 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                            {/* Profile Image */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden ring-4 ring-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative group">
                                    <img src={trainer.profileImage} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                {trainer.isApproved && (
                                    <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-[#03110b] px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{trainer.name}</h1>

                                {/* Labels */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                        Trainer
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {trainer.experience} Years Experience
                                    </span>
                                    {trainer.location && (
                                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {trainer.location}
                                        </span>
                                    )}
                                </div>

                                {/* Bio */}
                                <div>
                                    <h3 className="text-sm font-black text-white/90 uppercase tracking-widest mb-3">About Me</h3>
                                    <p className="text-emerald-100/60 leading-relaxed font-medium whitespace-pre-line">{trainer.bio}</p>
                                </div>

                                {/* Availability in Public View */}
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <h3 className="text-sm font-black text-white/90 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Weekly Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <div key={day} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-100/40">{day}</span>
                                                {availability?.[day]?.isOpen ? (
                                                    <span className="text-[11px] font-black text-emerald-400">
                                                        {availability[day].workingHours.start} - {availability[day].workingHours.end}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-black text-white/20 uppercase">Closed</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        )
    }

    return (
        <main className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 max-w-5xl pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Dashboard</span>
                    <h1 className="text-3xl font-black tracking-tight text-white">Trainer Profile</h1>
                </div>

                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/70 hover:text-red-400 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* ── Top Profile Section ──────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#051c13]/70 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)] mb-8 overflow-hidden relative"
            >
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={trainer.profileImage}
                            alt={trainer.name}
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        />
                        {/* Status logic */}
                        {trainer.isApproved ? (
                            <div className="absolute -bottom-2 right-0 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                Verified
                            </div>
                        ) : (
                            <div className="absolute -bottom-2 right-0 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                Under Review
                            </div>
                        )}
                    </div>

                    {/* Name & Basic Badges */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                            <h2 className="text-3xl font-black text-white">{trainer.name}</h2>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                Trainer
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5"
                            >
                                Edit Trainer Profile
                            </button>
                            <button
                                onClick={() => setIsAvailabilityModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03110b] text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20"
                            >
                                Manage Availability
                            </button>
                            <button
                                onClick={toggleView}
                                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-white/70 hover:text-emerald-400 text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                View Public Profile
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ── My Bookings Section ───────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Schedule</span>
                        <h2 className="text-2xl font-black tracking-tight">Upcoming Bookings</h2>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black">
                        {bookings.length} Sessions
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookings.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-white/2 border border-dashed border-white/10 rounded-[2rem]">
                            <p className="text-emerald-100/30 font-bold uppercase tracking-widest text-[10px]">No upcoming bookings</p>
                        </div>
                    ) : (
                        bookings.map((booking, index) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                className="group bg-[#051c13]/70 backdrop-blur-xl border border-white/5 rounded-[1.75rem] p-5 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-sm text-white">{booking.client?.name || 'Client'}</h3>
                                        <p className="text-[11px] text-emerald-100/50 font-bold mt-0.5">{booking.sessionType}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="border-t border-white/5 mb-4" />

                                <div className="flex items-center gap-4 text-xs text-emerald-100/60 font-bold">
                                    <span className="flex items-center gap-1.5"><span className="text-emerald-500">🗓️</span> {new Date(booking.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><span className="text-emerald-500">🕐</span> {booking.time}</span>
                                </div>

                                <button className="mt-4 w-full bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white/70 hover:text-emerald-400 text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all">
                                    View Details
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.section>

            {/* ── Schedule Summary Section ───────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
            >
                <div className="bg-[#051c13]/70 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Current Setup</span>
                            <h2 className="text-2xl font-black tracking-tight text-white">Weekly Schedule</h2>
                        </div>
                        <button
                            onClick={() => setIsAvailabilityModalOpen(true)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Edit Schedule
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <div key={day} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${availability?.[day]?.isOpen ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/2 border-white/5 opacity-40'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${availability?.[day]?.isOpen ? 'text-emerald-400' : 'text-white/30'}`}>{day.substring(0, 3)}</span>
                                {availability?.[day]?.isOpen ? (
                                    <>
                                        <span className="text-xs font-black text-white">{availability[day].workingHours.start}</span>
                                        <div className="w-1 h-1 bg-emerald-500/30 rounded-full" />
                                        <span className="text-xs font-black text-white">{availability[day].workingHours.end}</span>
                                    </>
                                ) : (
                                    <span className="text-[10px] font-black text-white/20 uppercase mt-auto">OFF</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── Account Settings ──────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-[#051c13]/70 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.3)] relative overflow-hidden mb-8"
            >
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Manage</span>
                    <h2 className="text-2xl font-black tracking-tight mb-8">Account Settings</h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Change Password */}
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex-1 flex items-center gap-4 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-emerald-500/30 rounded-2xl p-5 text-left transition-all duration-300 group hover:-translate-y-0.5"
                        >
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-black text-sm text-white">Change Password</p>
                                <p className="text-xs text-emerald-100/50 font-medium mt-0.5">Update your security credentials</p>
                            </div>
                            <svg className="w-4 h-4 text-emerald-100/30 ml-auto group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Logout */}
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex-1 flex items-center gap-4 bg-white/5 hover:bg-red-500/10 border border-white/8 hover:border-red-500/30 rounded-2xl p-5 text-left transition-all duration-300 group hover:-translate-y-0.5"
                        >
                            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-black text-sm text-red-400">Logout</p>
                                <p className="text-xs text-emerald-100/50 font-medium mt-0.5">Sign out of your account</p>
                            </div>
                            <svg className="w-4 h-4 text-red-400/30 ml-auto group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.section>
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03110b]/80 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setIsEditing(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#051c13] border border-white/10 rounded-[2rem] p-8 w-full max-w-2xl my-auto relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black text-white mb-6">Edit Profile</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Experience (Years)</label>
                                        <input
                                            type="number"
                                            value={editForm.experience}
                                            onChange={e => setEditForm({ ...editForm, experience: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Location</label>
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                            className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Bio</label>
                                    <textarea
                                        rows={4}
                                        value={editForm.bio}
                                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                        className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Specializations</label>
                                    <div className="flex flex-wrap gap-2">
                                        {SPECIALIZATIONS.map(spec => (
                                            <button
                                                key={spec}
                                                type="button"
                                                onClick={() => toggleSpec(spec)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors ${editForm.specializations?.includes(spec)
                                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-white/50 hover:border-emerald-500/30'
                                                    }`}
                                            >
                                                {spec}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-3 rounded-xl bg-emerald-500 text-[#03110b] font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Availability Modal ────────────────────────────────── */}
            <AnimatePresence>
                {isAvailabilityModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03110b]/80 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setIsAvailabilityModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#051c13] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-3xl my-auto relative shadow-[0_0_100px_rgba(16,185,129,0.1)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-white">Manage Availability</h2>
                                    <p className="text-emerald-100/50 text-xs font-bold mt-1 uppercase tracking-widest">Set your weekly working hours</p>
                                </div>
                                <button
                                    onClick={() => setIsAvailabilityModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 transition-all hover:border-emerald-500/20">
                                        <div className="flex items-center gap-4 min-w-[140px]">
                                            <button
                                                onClick={() => setTempAvailability({
                                                    ...tempAvailability,
                                                    [day]: { ...tempAvailability[day], isOpen: !tempAvailability[day]?.isOpen }
                                                })}
                                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${tempAvailability[day]?.isOpen ? 'bg-emerald-500' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${tempAvailability[day]?.isOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                            <span className={`font-black uppercase tracking-widest text-xs ${tempAvailability[day]?.isOpen ? 'text-white' : 'text-white/30'}`}>{day}</span>
                                        </div>

                                        {tempAvailability[day]?.isOpen ? (
                                            <div className="flex flex-1 items-center gap-3">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={tempAvailability[day]?.workingHours?.start || '09:00'}
                                                        onChange={e => setTempAvailability({
                                                            ...tempAvailability,
                                                            [day]: {
                                                                ...tempAvailability[day],
                                                                workingHours: { ...tempAvailability[day].workingHours, start: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                                                    />
                                                </div>
                                                <div className="text-white/20 pt-4">to</div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-1">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={tempAvailability[day]?.workingHours?.end || '17:00'}
                                                        onChange={e => setTempAvailability({
                                                            ...tempAvailability,
                                                            [day]: {
                                                                ...tempAvailability[day],
                                                                workingHours: { ...tempAvailability[day].workingHours, end: e.target.value }
                                                            }
                                                        })}
                                                        className="w-full bg-[#03110b]/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-xl py-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Closed / Off Day</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setTempAvailability(availability)
                                        setIsAvailabilityModalOpen(false)
                                    }}
                                    className="flex-1 py-4 rounded-xl bg-white/5 text-white/70 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.put('/trainers/availability',
                                                { availability: tempAvailability }
                                            )
                                            setAvailability(tempAvailability)
                                            setIsAvailabilityModalOpen(false)
                                            // Optional: add a toast notification here
                                        } catch (error) {
                                            console.error('Error updating availability:', error)
                                        }
                                    }}
                                    className="flex-1 py-4 rounded-xl bg-emerald-500 text-[#03110b] font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    Save Availability
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

export default TrainerProfileLayout
