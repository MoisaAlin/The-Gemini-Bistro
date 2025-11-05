import React, { useState, useMemo } from 'react';
import { MENU_DATA } from '../constants';
import type { MenuItem } from '../types';
import { motion } from 'framer-motion';

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <motion.div 
    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="p-6">
      <div className="flex justify-between items-baseline">
        <h3 className="text-xl font-semibold text-amber-400">{item.name}</h3>
        <p className="text-lg font-bold text-gray-200">{item.price}</p>
      </div>
      <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
    </div>
  </motion.div>
);

type FilterOption = 'vegan' | 'gluten-free' | 'spicy' | "chef's recommendation";
const filterOptions: FilterOption[] = ['vegan', 'gluten-free', 'spicy', "chef's recommendation"];

const MenuPage: React.FC = () => {
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  const [activeFilters, setActiveFilters] = useState<Set<FilterOption>>(new Set());

  const handleFilterToggle = (filter: FilterOption) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  const filteredMenu = useMemo(() => {
    if (activeFilters.size === 0) {
      return MENU_DATA;
    }
    return MENU_DATA.filter(item => {
      return Array.from(activeFilters).every(filter => item.tags?.includes(filter));
    });
  }, [activeFilters]);
  
  const displayedCategories = useMemo(() => {
    return categories
      .map(category => ({
        name: category,
        items: filteredMenu.filter(item => item.category === category)
      }))
      .filter(category => category.items.length > 0);
  }, [filteredMenu]);

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white">Our Menu</h2>
        <p className="text-gray-400 mt-2">Crafted with care, inspired by tradition.</p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4" role="toolbar" aria-label="Menu Filters">
        {filterOptions.map(filter => (
          <button
            key={filter}
            onClick={() => handleFilterToggle(filter)}
            aria-pressed={activeFilters.has(filter)}
            className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-300 capitalize ${
              activeFilters.has(filter)
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {displayedCategories.length > 0 ? (
        displayedCategories.map(category => (
          <div key={category.name} className="mb-12">
            <h3 className="text-3xl font-bold text-amber-500 mb-6 border-b-2 border-gray-700 pb-2">{category.name}</h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {category.items.map(item => (
                <MenuCard key={item.name} item={item} />
              ))}
            </motion.div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No menu items match the selected filters.</p>
          <p className="text-gray-500 mt-2">Try removing a filter to see more options.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
