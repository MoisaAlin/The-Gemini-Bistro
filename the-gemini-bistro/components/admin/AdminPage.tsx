import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import MenuManager from './MenuManager';
import ReservationManager from './ReservationManager';

type AdminTab = 'menu' | 'reservations';

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
            default:
                return <MenuManager />;
        }
    };
    
    const NavTab: React.FC<{tab: AdminTab, children: React.ReactNode}> = ({ tab, children }) => {
        const isActive = activeTab === tab;
        return (
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center flex-1 sm:flex-initial ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white bg-gray-850'
              }`}
            >
              {children}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⚙️</span>
                            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400">Admin Dashboard</h1>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">The Gemini Bistro Backoffice</p>
                    </div>
                    <button 
                        onClick={() => setIsLoggedIn(false)}
                        className="px-4 py-2 bg-gray-800 hover:bg-red-600/80 text-gray-300 hover:text-white rounded-xl transition border border-gray-700 text-sm font-medium min-h-[40px] flex items-center"
                    >
                        Log out
                    </button>
                </header>

                <nav className="flex space-x-2 sm:space-x-4 border-b border-gray-800 pb-4 mb-6 sm:mb-8">
                    <NavTab tab="menu">Menu Catalog</NavTab>
                    <NavTab tab="reservations">Reservations</NavTab>
                </nav>
                
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
