import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match')
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        setLoading(true)
        try {
            await register({ name: form.name, email: form.email, password: form.password })
            navigate('/dashboard', { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const strength = (() => {
        const p = form.password
        if (!p) return 0
        let s = 0
        if (p.length >= 6) s++
        if (p.length >= 10) s++
        if (/[A-Z]/.test(p)) s++
        if (/[0-9]/.test(p)) s++
        if (/[^A-Za-z0-9]/.test(p)) s++
        return s
    })()

    const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength]
    const strengthClass = ['', 'strength-1', 'strength-2', 'strength-3', 'strength-4', 'strength-5'][strength]

    return (
        <div className="auth-bg">
            <div className="auth-card">
                <div className="brand">
                    <div className="brand-icon">⚡</div>
                    <h1 className="brand-name">AuthApp</h1>
                </div>

                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Start your journey with us today</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form" id="register-form">
                    <div className="form-group">
                        <label htmlFor="reg-name">Full name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="reg-name"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">Email address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉</span>
                            <input
                                id="reg-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="reg-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="toggle-pwd"
                                onClick={() => setShowPwd((v) => !v)}
                                aria-label="Toggle password visibility"
                            >
                                {showPwd ? '🙈' : '👁'}
                            </button>
                        </div>
                        {form.password && (
                            <div className="strength-bar-wrap">
                                <div className={`strength-bar ${strengthClass}`}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`strength-seg ${i <= strength ? 'filled' : ''}`} />
                                    ))}
                                </div>
                                <span className="strength-label">{strengthLabel}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-confirm">Confirm password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="reg-confirm"
                                type={showPwd ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        id="register-submit"
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? <span className="btn-spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" id="go-to-login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
