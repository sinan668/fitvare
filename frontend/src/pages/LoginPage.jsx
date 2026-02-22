import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    const from = location.state?.from?.pathname || '/dashboard'

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(form)
            navigate(from, { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-bg">
            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="brand">
                    <div className="brand-icon">⚡</div>
                    <h1 className="brand-name">Fitvare</h1>
                </div>

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to your account to continue</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form" id="login-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉</span>
                            <input
                                id="login-email"
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
                        <label htmlFor="login-password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="login-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
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
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? <span className="btn-spinner" /> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/register" id="go-to-register">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
