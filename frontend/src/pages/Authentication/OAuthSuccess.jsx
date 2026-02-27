import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Since our login function expects credentials, we might need a separate way to set the token
            // or modify the login function. Let's assume we can pass the token directly if it's there.
            // If the login function doesn't support token directly, we manually set it.
            localStorage.setItem('token', token);
            // We might need to refresh the auth state here. 
            // Let's check how AuthContext is implemented.
            window.location.href = '/';
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#03110b] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default OAuthSuccess;
