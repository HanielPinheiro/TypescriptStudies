import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
    id: string
    email: string
    name: string
    is2FAEnabled: boolean
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [is2FAVerified, setIs2FAVerified] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Check auth state on initial load
        const storedUser = localStorage.getItem('user')
        const stored2FA = localStorage.getItem('2fa_verified')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIs2FAVerified(stored2FA === 'true')

            if (stored2FA !== 'true' && JSON.parse(storedUser).is2FAEnabled) {
                navigate('/auth?mode=2fa')
            }
        }
    }, [navigate])

    const loginWithCredentials = async (email: string) => {
        // Mock API call
        const mockUser = {
            id: '123',
            email,
            name: 'Test User',
            is2FAEnabled: true // Change based on your user settings
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        setUser(mockUser)

        if (mockUser.is2FAEnabled) {
            navigate('/auth?mode=2fa')
        } else {
            localStorage.setItem('2fa_verified', 'true')
            setIs2FAVerified(true)
            navigate('/')
        }
    }

    const loginWithGoogle = async () => {
        // Implement Google Auth
        // After successful Google auth:
        const mockUser = {
            id: 'google-123',
            email: 'user@gmail.com',
            name: 'Google User',
            is2FAEnabled: false // Google auth might not need 2FA
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('2fa_verified', 'true')
        setUser(mockUser)
        setIs2FAVerified(true)
        navigate('/')
    }

    const verify2FA = (code: string) => {
        // Mock verification
        if (code === '123456') { // In real app, verify with backend
            localStorage.setItem('2fa_verified', 'true')
            setIs2FAVerified(true)
            navigate('/')
            return true
        }
        return false
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('2fa_verified')
        setUser(null)
        setIs2FAVerified(false)
        navigate('/auth')
    }

    return { user, is2FAVerified, loginWithCredentials, loginWithGoogle, verify2FA, logout }
}