import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../services/apiService';
import { Page } from '../App';
import { MenuItem as MenuItemType } from '../types';

interface StructuredDataProps {
  currentPage: Page;
}

const StructuredData: React.FC<StructuredDataProps> = ({ currentPage }) => {
  const [menuData, setMenuData] = useState<MenuItemType[]>([]);

  useEffect(() => {
    // Fetch menu data for schema generation if we are on the menu page
    if (currentPage === 'menu') {
      fetchMenu().then(data => setMenuData(data));
    }
  }, [currentPage]);
  
  useEffect(() => {
    const scriptId = 'restaurant-schema';
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

    if (currentPage === 'menu' && menuData.length > 0) {
      const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
      
      restaurantSchema.hasMenu = {
        '@type': 'Menu',
        hasMenuSection: categories.map(categoryName => ({
          '@type': 'MenuSection',
          name: categoryName,
          hasMenuItem: menuData
            .filter(item => item.category === categoryName)
            .map((item: MenuItemType) => ({
              '@type': 'MenuItem',
              name: item.name,
              description: item.description,
              offers: {
                '@type': 'Offer',
                price: item.price.replace('$', ''),
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

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [currentPage, menuData]);

  return null;
};

export default StructuredData;
