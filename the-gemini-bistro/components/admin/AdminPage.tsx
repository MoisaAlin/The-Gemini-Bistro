import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import MenuManager from './MenuManager';
import ReservationManager from './ReservationManager';
// import TestimonialManager from './TestimonialManager'; // Can be added later

type AdminTab = 'menu' | 'reservations' | 'testimonials';

const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('menu');

    if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'menu':
                return <MenuManager />;
            case 'reservations':
                return <ReservationManager />;
            // case 'testimonials':
                // return <TestimonialManager />;
            default:
                return <MenuManager />;
        }
    }
    
    const NavTab: React.FC<{tab: AdminTab, children: React.ReactNode}> = ({ tab, children }) => {
        const isActive = activeTab === tab;
        return (
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {children}
            </button>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-amber-400">Admin Dashboard</h1>
                <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition"
                >
                    Logout
                </button>
            </header>

            <nav className="flex space-x-4 border-b border-gray-700 mb-8">
                <NavTab tab="menu">Menu Manager</NavTab>
                <NavTab tab="reservations">Reservations</NavTab>
                {/* <NavTab tab="testimonials">Testimonials</NavTab> */}
            </nav>
            
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPage;
