import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import AuthPage from './pages/Authentication/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import OAuthSuccess from './pages/Authentication/OAuthSuccess.jsx'

function App() {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <AuthPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
    )
}

export default App
