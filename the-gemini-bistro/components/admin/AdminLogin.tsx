import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../../services/monitoringService';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

// In a real application, this would not be hardcoded.
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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <motion.div
                className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-amber-400 text-center mb-6">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-3"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition duration-300"
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
