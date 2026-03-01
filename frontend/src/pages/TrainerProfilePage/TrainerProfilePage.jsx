import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar/Navbar'

const TrainerProfilePage = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [trainer, setTrainer] = useState(null)
    const [isPublicView, setIsPublicView] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState(null)

    useEffect(() => {
        const fetchTrainerProfile = async () => {
            try {
                const token = localStorage.getItem('token')
                const { data } = await axios.get('/api/trainers/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setTrainer({
                    ...data.data,
                    name: data.data.user.name,
                    email: data.data.user.email
                })
                setEditForm({
                    ...data.data,
                    name: data.data.user.name,
                    email: data.data.user.email
                })
            } catch (error) {
                console.error('Error fetching trainer profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchTrainerProfile()
        }
    }, [user])

    const handleSave = () => {
        // Implement save logic to backend here if needed
        setTrainer(editForm)
        setIsEditing(false)
    }

    // Toggle public view
    const toggleView = () => setIsPublicView(!isPublicView)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#03110b] text-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!trainer) {
        return (
            <div className="min-h-screen bg-[#03110b] text-white flex flex-col items-center justify-center gap-4">
                <Navbar />
                <h2 className="text-2xl font-black mt-20">Trainer Profile Not Found</h2>
                <p className="text-emerald-100/50">You haven't completed your trainer application yet.</p>
                <button onClick={() => window.location.href = '/profile'} className="mt-4 px-6 py-2 bg-emerald-500 text-[#03110b] font-black rounded-lg">Go Back</button>
            </div>
        )
    }

    const initials = trainer.name ? trainer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TR'

    // ── Public Profile View (Client View) ─────────────────────────
    if (isPublicView) {
        return (
            <div className="min-h-screen bg-[#03110b] text-white selection:bg-emerald-400 selection:text-[#03110b] font-sans pb-24">
                <Navbar />

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

                {/* Ambient background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
                </div>

                <main className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 max-w-4xl">
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
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        )
    }

    // ── Private Dashboard View (Trainer View) ──────────────────────
    return (
        <div className="min-h-screen bg-[#03110b] text-white selection:bg-emerald-400 selection:text-[#03110b] font-sans pb-24 overflow-x-hidden">
            <Navbar />

            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 max-w-5xl">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1 block">Dashboard</span>
                        <h1 className="text-3xl font-black tracking-tight text-white">Trainer Profile</h1>
                    </div>
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
                                <button className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03110b] text-xs font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20">
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

                {/* ── Info Section ────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Experience & Location */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-[#051c13]/70 backdrop-blur-xl border border-white/5 rounded-[2rem] p-7 shadow-lg"
                        >
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6">At a Glance</h3>

                            <div className="space-y-6">
                                {/* Experience Highlight */}
                                <div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <span className="text-xl font-black">{trainer.experience}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">Years Experience</p>
                                            <p className="text-xs text-emerald-100/50 font-medium">Professional Training</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                {trainer.location && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">Location</p>
                                            <p className="text-xs text-emerald-100/50 font-medium">{trainer.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-[#051c13]/70 backdrop-blur-xl border border-white/5 rounded-[2rem] p-7 shadow-lg"
                        >
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6">Private Info</h3>

                            <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verification Document</span>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-xs text-white/80 font-medium truncate">{trainer.verificationProof}</span>
                                </div>
                                <p className="text-[10px] text-emerald-400/70 font-medium mt-1">Not visible to clients</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Col: Bio & Specializations */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="bg-[#051c13]/70 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 lg:p-10 shadow-lg h-full"
                        >
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-6">Biography</h3>
                            <p className="text-white/80 text-sm leading-relaxed font-medium mb-10 whitespace-pre-line">
                                {trainer.bio}
                            </p>

                            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-4 mt-8">Specializations</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {trainer.specializations.map((spec, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Editing Modal */}
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
        </div>
    )
}

export default TrainerProfilePage
