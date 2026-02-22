import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Restore session on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            authService.getMe()
                .then(({ data }) => setUser(data.user))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const register = async (formData) => {
        const { data } = await authService.register(formData)
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return data
    }

    const login = async (formData) => {
        const { data } = await authService.login(formData)
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return data
    }

    const logout = async () => {
        await authService.logout()
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
