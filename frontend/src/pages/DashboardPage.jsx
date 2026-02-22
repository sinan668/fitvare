import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className="dashboard-bg">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <span className="brand-icon-sm">⚡</span>
                    <span className="brand-name-sm">AuthApp</span>
                </div>
                <button
                    id="logout-btn"
                    className="btn-logout"
                    onClick={handleLogout}
                >
                    Sign out
                </button>
            </header>

            <main className="dashboard-main">
                <div className="welcome-card">
                    <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
                    <div className="welcome-text">
                        <h2 className="welcome-title">Welcome back, {user?.name}! 👋</h2>
                        <p className="welcome-email">{user?.email}</p>
                    </div>
                    <span className="role-badge">{user?.role}</span>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🔐</div>
                        <div>
                            <div className="stat-label">Account Status</div>
                            <div className="stat-value">Active</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🌐</div>
                        <div>
                            <div className="stat-label">Auth Method</div>
                            <div className="stat-value">JWT</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🛡️</div>
                        <div>
                            <div className="stat-label">Role</div>
                            <div className="stat-value">{user?.role}</div>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h3>About this project</h3>
                    <p>
                        This is a secure full-stack authentication system built with{' '}
                        <strong>React</strong> (frontend) and <strong>Express + MongoDB</strong>{' '}
                        (backend). It uses <strong>JWT tokens</strong> stored in HTTP-only cookies
                        and localStorage for session management.
                    </p>
                    <ul>
                        <li>✅ JWT-based authentication</li>
                        <li>✅ Bcrypt password hashing</li>
                        <li>✅ Protected routes</li>
                        <li>✅ Role-based authorization</li>
                        <li>✅ Persistent sessions</li>
                    </ul>
                </div>
            </main>
        </div>
    )
}

export default DashboardPage
