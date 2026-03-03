import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/Navbar/Navbar'
import ClientProfileLayout from './components/ClientProfileLayout'
import TrainerProfileLayout from './components/TrainerProfileLayout'

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth()
    const navigate = useNavigate()
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    if (!user) return null

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isTrainer = user.role?.toLowerCase() === 'trainer'

    return (
        <div className="min-h-screen bg-[#03110b] text-white selection:bg-emerald-400 selection:text-[#03110b] font-sans overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Background ambient blobs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[150px]" />
            </div>

            {isTrainer ? (
                <TrainerProfileLayout
                    user={user}
                    handleLogout={handleLogout}
                    setShowPasswordModal={setShowPasswordModal}
                    setShowLogoutConfirm={setShowLogoutConfirm}
                />
            ) : (
                <ClientProfileLayout
                    user={user}
                    handleLogout={handleLogout}
                    setShowPasswordModal={setShowPasswordModal}
                    setShowLogoutConfirm={setShowLogoutConfirm}
                    updateUser={updateUser}
                />
            )}

            {/* ── Change Password Modal (Common) ─────────────────── */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#03110b]/80 backdrop-blur-sm"
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#051c13] border border-emerald-500/20 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-1">Change Password</h3>
                                <p className="text-sm text-emerald-100/50 font-medium mb-7">Keep your account secure with a strong password.</p>

                                <div className="flex flex-col gap-4">
                                    {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                                        <div key={label} className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-100/50">{label}</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-[#03110b]/60 border border-white/8 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500/50 placeholder:text-white/20 transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-7">
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/8 font-black text-xs uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#03110b] font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Logout Confirm Modal (Common) ──────────────────── */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#03110b]/80 backdrop-blur-sm"
                        onClick={() => setShowLogoutConfirm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#051c13] border border-red-500/20 rounded-[2rem] p-8 w-full max-w-sm shadow-[0_0_80px_rgba(0,0,0,0.6)] relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center gap-2 mb-7">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black">Sign Out?</h3>
                                <p className="text-sm text-emerald-100/50 font-medium">Are you sure you want to logout from your account?</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/8 font-black text-xs uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProfilePage
