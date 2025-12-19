import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../hooks/useTranslations';

const galleryImages = [
  {
    //'https://picsum.photos/seed/dish1/800/600'Original paceholder
    src: 'https://images.unsplash.com/photo-1737210235283-7675f83efc59?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A beautifully plated gourmet dish',
    title: 'Art on a Plate',
  },
  {
    //'https://picsum.photos/seed/interior/800/600'Original paceholder
    src: 'https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'The elegant and warm interior of The Gemini Bistro',
    title: 'Our Ambiance',
  },
  {
    //'https://picsum.photos/seed/chef/800/600' Original paceholder
    src: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A chef meticulously crafting a dish in the kitchen',
    title: 'The Chef\'s Touch',
  },
  {
    //'https://picsum.photos/seed/cocktail/800/600' Original paceholder
    src: 'https://images.unsplash.com/photo-1695606393078-b11374bbe0ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'A vibrant, handcrafted cocktail',
    title: 'Craft Cocktails',
  },
  {
    //''https://picsum.photos/seed/guests/800/600''
    src: 'https://images.unsplash.com/photo-1567231353937-e952e49e53c9?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Happy guests dining and socializing',
    title: 'Unforgettable Moments',
  },
  {
    // 'https://picsum.photos/seed/dish2/800/600'
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
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">{t('gallery.title')}</h2>
          <p className="text-gray-400 mt-2">{t('gallery.subtitle')}</p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-4 aspect-h-3"
              variants={itemVariants}
            >
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500 group-hover:bg-opacity-60"></div>
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-white text-xl font-bold tracking-wide transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>
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
