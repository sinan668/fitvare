import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../../services/authService'

const bookings = [
    {
        id: 1,
        trainer: 'Alex Johnson',
        specialization: 'Weight Loss',
        date: 'Mon, Mar 3, 2026',
        time: '8:00 AM',
        status: 'confirmed',
        image: 'https://images.unsplash.com/photo-1540206276207-3af25c08abbb?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: 2,
        trainer: 'Sarah Miller',
        specialization: 'Yoga & Pilates',
        date: 'Wed, Mar 5, 2026',
        time: '6:30 PM',
        status: 'pending',
        image: 'https://images.unsplash.com/photo-1518611012118-296030bb0afc?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: 3,
        trainer: 'Marcus Chen',
        specialization: 'Muscle Gain',
        date: 'Fri, Mar 7, 2026',
        time: '10:00 AM',
        status: 'confirmed',
        image: 'https://images.unsplash.com/photo-1567013127542-490d1b5e51f7?auto=format&fit=crop&q=80&w=200&h=200',
    },
]

const statusConfig = {
    confirmed: { label: 'Confirmed', classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    pending: { label: 'Pending', classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    cancelled: { label: 'Cancelled', classes: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

const ClientProfileLayout = ({ user, handleLogout, setShowPasswordModal, setShowLogoutConfirm, updateUser }) => {
    const [showTrainerForm, setShowTrainerForm] = useState(false)
    const [trainerPhoto, setTrainerPhoto] = useState(null)
    const [trainerPhotoPreview, setTrainerPhotoPreview] = useState(null)
    const [trainerExperience, setTrainerExperience] = useState('')
    const [trainerBio, setTrainerBio] = useState('')
    const [trainerLocation, setTrainerLocation] = useState('')
    const [trainerSpecializations, setTrainerSpecializations] = useState([])

    const SPECIALIZATIONS = [
        'Weight Loss', 'Muscle Gain', 'Yoga & Pilates', 'CrossFit',
        'Strength Training', 'HIIT', 'Cardio & Endurance', 'Nutrition Coaching',
        'Rehabilitation', 'Bodybuilding',
    ]

    const toggleSpec = (spec) => {
        setTrainerSpecializations(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        )
    }
    const [isDragging, setIsDragging] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const fileInputRef = useRef(null)

    const handlePhotoDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setTrainerPhoto(file)
            setTrainerPhotoPreview(URL.createObjectURL(file))
        }
    }

    const handleTrainerSubmit = async (e) => {
        e.preventDefault()
        if (!trainerPhoto) {
            alert('Please provide a Proof of Expertise Photo.');
            return;
        }
        if (trainerSpecializations.length === 0) return

        try {
            const { data } = await api.post('/trainers/apply', {
                experience: trainerExperience,
                bio: trainerBio,
                location: trainerLocation,
                specializations: trainerSpecializations,
                profileImage: 'https://images.unsplash.com/photo-1567013127542-490d1b5e51f7?auto=format&fit=crop&q=80&w=500&h=500'
            })

            // Update user in context with the new token & role
            if (data.user && data.token) {
                updateUser(data.user, data.token)
            }

            setSubmitted(true)
            setTimeout(() => {
                setShowTrainerForm(false)
                setSubmitted(false)
                setTrainerPhoto(null)
                setTrainerPhotoPreview(null)
                setTrainerExperience('')
                setTrainerBio('')
                setTrainerLocation('')
                setTrainerSpecializations([])
                // Removing window.location.href to let the parent handle layout switch
                // window.location.href = '/trainer-profile' 
            }, 2200)
        } catch (error) {
            console.error('Error applying for trainer:', error)
            alert(error.response?.data?.message || 'There was an error applying. Please try again.')
        }
    }

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?'

    return (
        <main className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 pb-24 max-w-5xl">

            {/* ── Profile Hero Card ─────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-[#051c13]/70 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 lg:p-10 mb-8 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)]"
            >
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-[#03110b] font-black text-4xl shadow-[0_0_40px_rgba(16,185,129,0.3)] ring-4 ring-emerald-500/20 select-none">
                            {initials}
                        </div>
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#051c13]" />
                    </div>

                    {/* User info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            {user.role || 'Client'}
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-1">
                            {user.name || 'Fitness Enthusiast'}
                        </h1>
                        <p className="text-emerald-100/60 font-medium text-sm mb-2">{user.email}</p>
                        {user.gender && (
                            <p className="text-emerald-100/50 text-xs font-bold mb-2 flex items-center gap-1.5 sm:justify-start justify-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    {user.gender === 'male' ? '♂' : user.gender === 'female' ? '♀' : '⊕'}
                                    {user.gender}
                                </span>
                            </p>
                        )}
                        <p className="text-emerald-100/40 text-xs font-bold">
                            🎯 Fitness Goal: <span className="text-emerald-400">Lose 5 kg &amp; Build Strength</span>
                        </p>
                    </div>

                    {/* Edit profile button */}
                    <div className="flex-shrink-0">
                        <button className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#03110b] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 active:scale-95">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* ── My Bookings ───────────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Upcoming</span>
                        <h2 className="text-2xl font-black tracking-tight">My Bookings</h2>
                    </div>
                    <Link
                        to="/"
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group transition-colors"
                    >
                        Book a Session
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + index * 0.1 }}
                            className="group bg-[#051c13]/70 backdrop-blur-xl border border-white/5 rounded-[1.75rem] overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-400 relative"
                        >
                            {/* Top accent */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-5">
                                {/* Trainer row */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="relative">
                                        <img
                                            src={booking.image}
                                            alt={booking.trainer}
                                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-emerald-500/20 transition-all duration-300"
                                        />
                                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#051c13]" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-white leading-tight">{booking.trainer}</p>
                                        <p className="text-[11px] text-emerald-100/50 font-bold mt-0.5">{booking.specialization}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusConfig[booking.status].classes}`}>
                                            {statusConfig[booking.status].label}
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/5 mb-4" />

                                {/* Date / time */}
                                <div className="flex items-center gap-4 text-xs text-emerald-100/60 font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {booking.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {booking.time}
                                    </span>
                                </div>

                                {/* Reschedule */}
                                <button className="mt-4 w-full bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white/70 hover:text-emerald-400 text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all duration-300">
                                    Reschedule
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── Account Settings ──────────────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-[#051c13]/70 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.3)] relative overflow-hidden"
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

            {/* ── Become a Trainer Banner (clients only) ──────── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-8 relative bg-gradient-to-br from-[#051c13]/90 via-[#072a18]/80 to-[#051c13]/90 backdrop-blur-2xl border border-emerald-500/20 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.07)]"
            >
                {/* Decorative glows */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/5 rounded-full blur-[70px] pointer-events-none" />
                {/* Animated top line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-center sm:text-left">
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-2 block">For Fitness Professionals</span>
                        <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-2">Are you a Trainer?</h2>
                        <p className="text-emerald-100/60 font-medium text-sm max-w-md">Share your expertise and start earning by training clients. Join hundreds of certified trainers already on Fitvera.</p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setShowTrainerForm(true)}
                            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-[#03110b] px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-emerald-500/30 active:scale-95 group whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Become a Trainer
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* ── Become a Trainer Modal ────────────────────────── */}
            <AnimatePresence>
                {showTrainerForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-[#03110b]/85 backdrop-blur-md overflow-y-auto"
                        onClick={() => setShowTrainerForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                            className="bg-[#051c13] border border-emerald-500/20 rounded-[2.5rem] p-8 lg:p-10 w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.7)] relative overflow-hidden my-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Glows */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={() => setShowTrainerForm(false)}
                                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="mb-8">
                                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-2 block">Trainer Application</span>
                                    <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-2">Become a Fitvera Trainer</h3>
                                    <p className="text-emerald-100/55 font-medium text-sm">Share your expertise and start earning by training clients.</p>
                                </div>

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-14 gap-4 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-2">
                                            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-black text-white">Application Submitted!</h4>
                                        <p className="text-emerald-100/55 text-sm font-medium max-w-xs">We'll review your application and get back to you within 2–3 business days.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleTrainerSubmit} className="flex flex-col gap-7">

                                        {/* Profile Photo Upload */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">Proof of Expertise Photo <span className="text-emerald-500">*</span></label>
                                            <div
                                                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={handlePhotoDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 p-8 ${isDragging
                                                    ? 'border-emerald-400 bg-emerald-500/10'
                                                    : trainerPhotoPreview
                                                        ? 'border-emerald-500/50 bg-emerald-500/5'
                                                        : 'border-white/10 bg-white/3 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                                                    }`}
                                            >
                                                {trainerPhotoPreview ? (
                                                    <>
                                                        <img src={trainerPhotoPreview} alt="Preview" className="w-24 h-24 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
                                                        <p className="text-xs text-emerald-400 font-bold">{trainerPhoto?.name}</p>
                                                        <p className="text-[10px] text-emerald-100/40 font-medium">Click to change photo</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-black text-white/80">Drag &amp; drop your photo here</p>
                                                            <p className="text-[11px] text-emerald-100/40 font-medium mt-1">or <span className="text-emerald-400">click to browse</span> — JPG, PNG up to 5MB</p>
                                                        </div>
                                                    </>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handlePhotoDrop}
                                                />
                                            </div>
                                        </div>

                                        {/* Specialization */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">
                                                Specialization <span className="text-emerald-500">*</span>
                                                {trainerSpecializations.length === 0 && (
                                                    <span className="ml-2 text-[9px] text-red-400/70 normal-case tracking-normal font-bold">Select at least one</span>
                                                )}
                                            </label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {SPECIALIZATIONS.map(spec => (
                                                    <button
                                                        key={spec}
                                                        type="button"
                                                        onClick={() => toggleSpec(spec)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${trainerSpecializations.includes(spec)
                                                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                                                            : 'bg-white/4 border-white/8 text-white/50 hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/8'
                                                            }`}
                                                    >
                                                        {trainerSpecializations.includes(spec) && (
                                                            <span className="mr-1.5">✓</span>
                                                        )}
                                                        {spec}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Work Experience */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">Work Experience (Years) <span className="text-emerald-500">*</span></label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="60"
                                                value={trainerExperience}
                                                onChange={e => setTrainerExperience(e.target.value)}
                                                placeholder="e.g. 5"
                                                required
                                                className="bg-[#03110b]/60 border border-white/8 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-white/20 transition-all text-white"
                                            />
                                        </div>

                                        {/* Bio */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">Bio <span className="text-emerald-500">*</span></label>
                                            <textarea
                                                rows={5}
                                                value={trainerBio}
                                                onChange={e => setTrainerBio(e.target.value)}
                                                placeholder="Tell clients about your training style, expertise and achievements..."
                                                required
                                                className="bg-[#03110b]/60 border border-white/8 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-white/20 transition-all resize-none text-white leading-relaxed"
                                            />
                                        </div>

                                        {/* Location */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">Location <span className="text-emerald-500">*</span></label>
                                            <select
                                                value={trainerLocation}
                                                onChange={e => setTrainerLocation(e.target.value)}
                                                required
                                                className="bg-[#03110b]/60 border border-white/8 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-[#051c13]">Select Location</option>
                                                <option value="malappuram" className="bg-[#051c13]">Malappuram</option>
                                                <option value="calicut" className="bg-[#051c13]">Calicut</option>
                                                <option value="kannur" className="bg-[#051c13]">Kannur</option>
                                                <option value="kochi" className="bg-[#051c13]">Kochi</option>
                                                <option value="trivandrum" className="bg-[#051c13]">Trivandrum</option>
                                                <option value="kozhikode" className="bg-[#051c13]">Kozhikode</option>
                                                <option value="thrissur" className="bg-[#051c13]">Thrissur</option>
                                                <option value="palakkad" className="bg-[#051c13]">Palakkad</option>
                                                <option value="kollam" className="bg-[#051c13]">Kollam</option>
                                                <option value="pathanamthitta" className="bg-[#051c13]">Pathanamthitta</option>
                                                <option value="idukki" className="bg-[#051c13]">Idukki</option>
                                                <option value="wayanad" className="bg-[#051c13]">Wayanad</option>
                                                <option value="kasaragod" className="bg-[#051c13]">Kasaragod</option>
                                            </select>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#03110b] font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Submit Application
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

export default ClientProfileLayout
