import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import './ProfilePage.css'


const ProfilePage = () => {
    const { user, logout } = useAuth()

    if (!user) return null

    const isTrainer = user.role === 'trainer'

    return (
        <div className="dashboard-bg">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <span className="brand-icon-sm">⚡</span>
                    <h1 className="brand-name-sm">FitVare</h1>
                </div>
                <div className="header-nav">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="welcome-card profile-hero">
                    <div className="avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="welcome-text">
                        <div className="role-badge">{user.role}</div>
                        <h2 className="welcome-title">{user.name}</h2>
                        <p className="welcome-email">{user.email}</p>
                    </div>
                    <button className="btn-edit-profile">Edit Profile</button>
                </section>

                <div className="profile-content-grid">
                    {isTrainer ? (
                        <>
                            <section className="info-card">
                                <h3>Expertise & Specialization</h3>
                                <div className="tag-container">
                                    <span className="tag">Weight Lifting</span>
                                    <span className="tag">Yoga</span>
                                    <span className="tag">Nutrition</span>
                                    <span className="tag">HIIT</span>
                                </div>
                                <p>Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals.</p>
                            </section>

                            <section className="info-card">
                                <h3>Upcoming Trainings</h3>
                                <ul className="info-list">
                                    <li>
                                        <div className="list-item-content">
                                            <strong>Morning HIIT Session</strong>
                                            <span>With John Doe • 8:00 AM</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-item-content">
                                            <strong>Strength Training</strong>
                                            <span>With Sarah Smith • 10:30 AM</span>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            <section className="info-card">
                                <h3>Availability</h3>
                                <div className="availability-grid">
                                    <div className="day-slot">Mon: 08:00 - 18:00</div>
                                    <div className="day-slot">Wed: 08:00 - 18:00</div>
                                    <div className="day-slot">Fri: 08:00 - 14:00</div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            <section className="info-card">
                                <h3>My Fitness Journey</h3>
                                <div className="progress-stats">
                                    <div className="progress-item">
                                        <span className="label">Workouts this week</span>
                                        <span className="value">4 / 5</span>
                                    </div>
                                    <div className="progress-item">
                                        <span className="label">Weight Goal</span>
                                        <span className="value">-2kg to go</span>
                                    </div>
                                </div>
                            </section>

                            <section className="info-card">
                                <h3>My Booked Trainers</h3>
                                <ul className="info-list">
                                    <li>
                                        <div className="list-item-content">
                                            <strong>Coach Mike</strong>
                                            <span>Full Body Workout • Tomorrow, 9:00 AM</span>
                                        </div>
                                        <button className="btn-small">Reschedule</button>
                                    </li>
                                    <li>
                                        <div className="list-item-content">
                                            <strong>Elena Yoga</strong>
                                            <span>Evening Flow • Thursday, 6:00 PM</span>
                                        </div>
                                        <button className="btn-small">Reschedule</button>
                                    </li>
                                </ul>
                            </section>

                            <section className="info-card">
                                <h3>Quick Actions</h3>
                                <div className="actions-grid">
                                    <Link to="/book" className="action-btn">Book a Session</Link>
                                    <Link to="/plans" className="action-btn">My Workout Plan</Link>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
