import React from 'react';
import type { Page } from '../App';
import PhotoGallery from './PhotoGallery';
import Testimonials from './Testimonials';
import { motion } from 'framer-motion';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <>
      <div 
        className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center overflow-hidden"
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
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <motion.div
          className="relative z-20 p-8 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-wider"
            style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}
          >
            Experience Culinary Excellence
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-8"
            style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}
          >
            Discover a symphony of flavors crafted with passion and the finest ingredients. Welcome to The Gemini Bistro.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <button
              onClick={() => setCurrentPage('menu')}
              className="px-8 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-transform transform hover:scale-105 duration-300 shadow-lg"
            >
              View Our Menu
            </button>
            <button
              onClick={() => setCurrentPage('reservations')}
              className="px-8 py-3 bg-transparent border-2 border-amber-500 text-amber-500 font-bold rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg"
            >
              Make a Reservation
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
