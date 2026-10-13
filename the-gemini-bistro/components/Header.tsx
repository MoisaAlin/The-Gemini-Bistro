import React, { useState } from 'react';
import type { Page } from '../App';
import { useTranslations } from '../hooks/useTranslations';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
  onClickExtra?: () => void;
}> = ({ page, currentPage, setCurrentPage, children, onClickExtra }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => {
        setCurrentPage(page);
        if (onClickExtra) onClickExtra();
      }}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 text-left min-h-[44px] flex items-center ${
        isActive
          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { changeLanguage, language } = useTranslations();
  return (
    <div className="flex items-center space-x-1.5 bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-gray-700/60">
      <button
        onClick={() => changeLanguage('en')}
        className={`text-xs sm:text-sm font-bold px-1.5 py-0.5 rounded transition ${
          language === 'en' ? 'text-amber-400 bg-gray-700/80' : 'text-gray-400 hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-gray-600 text-xs">|</span>
      <button
        onClick={() => changeLanguage('ro')}
        className={`text-xs sm:text-sm font-bold px-1.5 py-0.5 rounded transition ${
          language === 'ro' ? 'text-amber-400 bg-gray-700/80' : 'text-gray-400 hover:text-white'
        }`}
        aria-label="Comută pe Română"
      >
        RO
      </button>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-lg shadow-black/30">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <button
              className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight text-left flex items-center gap-2 hover:text-amber-300 transition"
              onClick={() => handleNavClick('home')}
              aria-label={t('header.title')}
            >
              <span className="text-amber-500">✨</span>
              <span>{t('header.title')}</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <NavLink page="home" currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {t('nav.home')}
            </NavLink>
            <NavLink page="menu" currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {t('nav.menu')}
            </NavLink>
            <NavLink page="reservations" currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {t('nav.reservations')}
            </NavLink>
            <div className="border-l border-gray-700 pl-3 ml-2">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Actions: Language Switcher + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-gray-800 bg-gray-900/95 space-y-1.5 animate-fadeIn">
            <NavLink page="home" currentPage={currentPage} setCurrentPage={setCurrentPage} onClickExtra={() => setIsMobileMenuOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink page="menu" currentPage={currentPage} setCurrentPage={setCurrentPage} onClickExtra={() => setIsMobileMenuOpen(false)}>
              {t('nav.menu')}
            </NavLink>
            <NavLink page="reservations" currentPage={currentPage} setCurrentPage={setCurrentPage} onClickExtra={() => setIsMobileMenuOpen(false)}>
              {t('nav.reservations')}
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
