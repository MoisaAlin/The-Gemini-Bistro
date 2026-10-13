import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../../services/monitoringService';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = 'password123';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setError('');
            trackEvent('admin_login');
            onLoginSuccess();
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <motion.div
                className="w-full max-w-md bg-gray-800/95 border border-gray-700/70 p-6 sm:p-8 rounded-2xl shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="text-center mb-6">
                    <span className="text-3xl">🔐</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mt-2">Admin Access</h1>
                    <p className="text-xs text-gray-400 mt-1">Sign in to manage menu items and reservations</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px]"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center bg-red-900/30 p-2.5 rounded-lg border border-red-800/40">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 min-h-[48px] bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
