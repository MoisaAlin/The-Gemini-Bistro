
import React from 'react';
import { MENU_DATA } from '../constants';
import type { MenuItem } from '../types';

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <div className="p-6">
      <div className="flex justify-between items-baseline">
        <h3 className="text-xl font-semibold text-amber-400">{item.name}</h3>
        <p className="text-lg font-bold text-gray-200">{item.price}</p>
      </div>
      <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
    </div>
  </div>
);

const MenuPage: React.FC = () => {
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white">Our Menu</h2>
        <p className="text-gray-400 mt-2">Crafted with care, inspired by tradition.</p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-12">
          <h3 className="text-3xl font-bold text-amber-500 mb-6 border-b-2 border-gray-700 pb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_DATA.filter(item => item.category === category).map(item => (
              <MenuCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;
