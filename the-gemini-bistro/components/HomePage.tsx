
import React from 'react';
import type { Page } from '../App';
import PhotoGallery from './PhotoGallery';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <>
      <div 
        className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2&random=1')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-8 max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-wider" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            Experience Culinary Excellence
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
            Discover a symphony of flavors crafted with passion and the finest ingredients. Welcome to The Gemini Bistro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
          </div>
        </div>
      </div>
      <PhotoGallery />
    </>
  );
};

export default HomePage;
