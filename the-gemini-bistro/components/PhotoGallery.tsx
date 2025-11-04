
import React from 'react';

const galleryImages = [
  {
    src: 'https://picsum.photos/seed/dish1/800/600',
    alt: 'A beautifully plated gourmet dish',
    title: 'Art on a Plate',
  },
  {
    src: 'https://picsum.photos/seed/interior/800/600',
    alt: 'The elegant and warm interior of The Gemini Bistro',
    title: 'Our Ambiance',
  },
  {
    src: 'https://picsum.photos/seed/chef/800/600',
    alt: 'A chef meticulously crafting a dish in the kitchen',
    title: 'The Chef\'s Touch',
  },
  {
    src: 'https://picsum.photos/seed/cocktail/800/600',
    alt: 'A vibrant, handcrafted cocktail',
    title: 'Craft Cocktails',
  },
  {
    src: 'https://picsum.photos/seed/guests/800/600',
    alt: 'Happy guests dining and socializing',
    title: 'Unforgettable Moments',
  },
  {
    src: 'https://picsum.photos/seed/dish2/800/600',
    alt: 'Another signature dish, bursting with color and flavor',
    title: 'Signature Flavors',
  },
];

const PhotoGallery: React.FC = () => {
  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">A Glimpse Into Our World</h2>
          <p className="text-gray-400 mt-2">Where every detail is a stroke of culinary art.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-4 aspect-h-3">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500 group-hover:bg-opacity-60"></div>
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-white text-xl font-bold tracking-wide transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
