import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1737210235283-7675f83efc59?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A beautifully plated gourmet dish',
    title: 'Art on a Plate',
  },
  {
    src: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'The elegant and warm interior of The Gemini Bistro',
    title: 'Our Ambiance',
  },
  {
    src: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A chef meticulously crafting a dish in the kitchen',
    title: "The Chef's Touch",
  },
  {
    src: 'https://images.unsplash.com/photo-1695606393078-b11374bbe0ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A vibrant, handcrafted cocktail',
    title: 'Craft Cocktails',
  },
  {
    src: 'https://images.unsplash.com/photo-1567231353937-e952e49e53c9?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Happy guests dining and socializing',
    title: 'Unforgettable Moments',
  },
  {
    src: 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Another signature dish, bursting with color and flavor',
    title: 'Signature Flavors',
  },
];

const PhotoGallery: React.FC = () => {
  const { t } = useTranslations();

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-gray-900 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t('gallery.title')}</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">{t('gallery.subtitle')}</p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] bg-gray-800"
              variants={itemVariants}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:from-black/70 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                <h3
                  className="text-white text-lg sm:text-xl font-bold tracking-wide transform sm:translate-y-2 group-hover:translate-y-0 transition-all duration-300 drop-shadow-md"
                >
                  {image.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PhotoGallery;
