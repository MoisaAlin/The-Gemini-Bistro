
import React, { useEffect } from 'react';
import { MENU_DATA } from '../constants';
import { Page } from '../App';
import { MenuItem as MenuItemType } from '../types';

interface StructuredDataProps {
  currentPage: Page;
}

const StructuredData: React.FC<StructuredDataProps> = ({ currentPage }) => {
  useEffect(() => {
    // Define a unique ID for our script tag to manage it
    const scriptId = 'restaurant-schema';

    // Remove any existing schema script to prevent duplicates
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const restaurantSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'The Gemini Bistro',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Strada Mihai Viteazul 10',
        addressLocality: 'Craiova',
        postalCode: '200345',
        addressCountry: 'RO',
      },
      telephone: '+40 722 123 456',
      servesCuisine: 'Italian',
      priceRange: '$$',
      openingHours: [
        'Mo-Fr 17:00-23:00',
        'Sa-Su 12:00-23:00',
      ],
      url: 'https://www.thegeminibistro.com',
      image: 'https://picsum.photos/seed/interior/800/600',
    };

    if (currentPage === 'menu') {
      const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
      
      restaurantSchema.hasMenu = {
        '@type': 'Menu',
        hasMenuSection: categories.map(categoryName => ({
          '@type': 'MenuSection',
          name: categoryName,
          hasMenuItem: MENU_DATA
            .filter(item => item.category === categoryName)
            .map((item: MenuItemType) => ({
              '@type': 'MenuItem',
              name: item.name,
              description: item.description,
              offers: {
                '@type': 'Offer',
                price: item.price.replace('$', ''), // Remove currency symbol for schema
                priceCurrency: 'USD',
              },
            })),
        })),
      };
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(restaurantSchema);

    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [currentPage]); // Re-run effect when currentPage changes

  return null; // This component does not render anything to the DOM itself
};

export default StructuredData;
