
import React from 'react';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
        isActive
          ? 'bg-amber-500 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-amber-400 cursor-pointer"
              onClick={() => setCurrentPage('home')}>
              The Gemini Bistro
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink page="home" currentPage={currentPage} setCurrentPage={setCurrentPage}>Home</NavLink>
              <NavLink page="menu" currentPage={currentPage} setCurrentPage={setCurrentPage}>Menu</NavLink>
              <NavLink page="reservations" currentPage={currentPage} setCurrentPage={setCurrentPage}>Reservations</NavLink>
            </div>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button can be added here if needed */}
             <select 
                value={currentPage} 
                onChange={(e) => setCurrentPage(e.target.value as Page)}
                className="bg-gray-800 text-white border-gray-700 rounded p-2"
              >
              <option value="home">Home</option>
              <option value="menu">Menu</option>
              <option value="reservations">Reservations</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
