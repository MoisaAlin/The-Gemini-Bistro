import React, { useState, useEffect } from 'react';
import { fetchTestimonials } from '../services/apiService';
import type { Testimonial } from '../types';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg 
    className={`w-4 h-4 sm:w-5 sm:h-5 ${filled ? 'text-amber-400' : 'text-gray-600'}`} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < rating} />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ review: Testimonial }> = ({ review }) => (
  <motion.div 
    className="bg-gray-800/90 p-5 sm:p-6 rounded-xl border border-gray-700/60 shadow-lg flex flex-col h-full"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    }}
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex-shrink-0">
      <StarRating rating={review.rating} />
    </div>
    <blockquote className="mt-4 flex-grow">
      <p className="text-gray-300 italic text-sm sm:text-base leading-relaxed">"{review.quote}"</p>
    </blockquote>
    <footer className="mt-4 pt-3 border-t border-gray-700/50">
      <p className="font-semibold text-white text-sm sm:text-base">{review.name}</p>
      <p className="text-xs sm:text-sm text-gray-400">{review.source}</p>
    </footer>
  </motion.div>
);

const TestimonialCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 p-5 sm:p-6 rounded-xl shadow-lg flex flex-col h-full animate-pulse border border-gray-700/60">
    <div className="flex-shrink-0">
      <div className="h-4 w-24 bg-gray-700 rounded"></div>
    </div>
    <div className="mt-4 flex-grow space-y-2">
      <div className="h-3 bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-700 rounded w-4/5"></div>
    </div>
    <footer className="mt-4 pt-3 border-t border-gray-700/50">
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
    </footer>
  </div>
);

const Testimonials: React.FC = () => {
  const { t } = useTranslations();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t('testimonials.title')}</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {isLoading ? (
            [...Array(3)].map((_, i) => <TestimonialCardSkeleton key={i} />)
          ) : (
            testimonials.map((review, index) => (
              <TestimonialCard key={index} review={review} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
