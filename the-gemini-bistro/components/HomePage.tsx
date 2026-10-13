import React from 'react';
import type { Page } from '../App';
import PhotoGallery from './PhotoGallery';
import Testimonials from './Testimonials';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { t } = useTranslations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div 
        className="relative min-h-[520px] h-[calc(100svh-4rem)] sm:h-[calc(100vh-4rem)] flex items-center justify-center text-center overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="https://videos.pexels.com/video-files/3223301/3223301-hd_1920_1080_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/65 z-10 backdrop-blur-[1px]"></div>
        <motion.div
          className="relative z-20 px-4 py-8 sm:p-8 max-w-3xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight sm:tracking-wider"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            {t('home.title')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none"
          >
            <button
              onClick={() => setCurrentPage('menu')}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all transform active:scale-95 sm:hover:scale-105 duration-200 shadow-lg shadow-amber-500/25 flex items-center justify-center"
            >
              {t('home.viewMenuButton')}
            </button>
            <button
              onClick={() => setCurrentPage('reservations')}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-gray-900/60 sm:bg-transparent border-2 border-amber-500 text-amber-400 font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-200 shadow-lg flex items-center justify-center active:scale-95"
            >
              {t('home.makeReservationButton')}
            </button>
          </motion.div>
        </motion.div>
      </div>
      <PhotoGallery />
      <Testimonials />
    </>
  );
};

export default HomePage;
