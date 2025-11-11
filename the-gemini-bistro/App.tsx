import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import ReservationsPage from './components/ReservationsPage';
import Chatbot from './components/Chatbot';
import StructuredData from './components/StructuredData';
import AdminPage from './components/admin/AdminPage';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPageView } from './services/monitoringService';

export type Page = 'home' | 'menu' | 'reservations';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminView(true);
    }
  }, []);

  // Track page views for analytics
  useEffect(() => {
    trackPageView(currentPage);
  }, [currentPage]);


  if (isAdminView) {
    return <AdminPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <MenuPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <StructuredData currentPage={currentPage} />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
