import React, { useState, useMemo, useEffect } from 'react';
import { fetchMenu } from '../services/apiService';
import type { MenuItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../services/monitoringService';
import { useTranslations } from '../hooks/useTranslations';

const getTagBadgeStyle = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'vegan':
      return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50';
    case 'gluten-free':
      return 'bg-blue-900/60 text-blue-300 border-blue-700/50';
    case 'spicy':
      return 'bg-red-900/60 text-red-300 border-red-700/50';
    case "chef's recommendation":
      return 'bg-amber-900/60 text-amber-300 border-amber-700/50';
    default:
      return 'bg-gray-700/60 text-gray-300 border-gray-600/50';
  }
};

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <motion.div 
    className="bg-gray-800/90 rounded-xl border border-gray-700/60 shadow-lg overflow-hidden flex flex-col justify-between"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    }}
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="p-5 sm:p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-amber-400 tracking-tight">{item.name}</h3>
          <span className="text-base sm:text-lg font-extrabold text-white bg-gray-900/70 px-2.5 py-0.5 rounded-md whitespace-nowrap">
            {item.price}
          </span>
        </div>
        <p className="text-gray-300 mt-2.5 text-sm leading-relaxed">{item.description}</p>
        {item.ingredients && item.ingredients.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 italic">
            <span className="font-semibold text-gray-400 not-italic">Ingredients:</span> {item.ingredients.join(', ')}
          </p>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-700/40">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getTagBadgeStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const MenuCardSkeleton: React.FC = () => (
  <div className="bg-gray-800/80 rounded-xl border border-gray-700/50 shadow-lg p-5 sm:p-6 animate-pulse">
    <div className="flex justify-between items-baseline">
      <div className="h-5 bg-gray-700 rounded w-2/4"></div>
      <div className="h-5 bg-gray-700 rounded w-1/6"></div>
    </div>
    <div className="h-3 bg-gray-700 rounded w-full mt-4"></div>
    <div className="h-3 bg-gray-700 rounded w-5/6 mt-2"></div>
    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700/40">
      <div className="h-4 bg-gray-700 rounded-full w-14"></div>
      <div className="h-4 bg-gray-700 rounded-full w-16"></div>
    </div>
  </div>
);

type FilterOption = 'vegan' | 'gluten-free' | 'spicy' | "chef's recommendation";
const filterOptions: FilterOption[] = ['vegan', 'gluten-free', 'spicy', "chef's recommendation"];
const tagToKeyMap: Record<FilterOption, string> = {
  'vegan': 'vegan',
  'gluten-free': 'gluten-free',
  'spicy': 'spicy',
  "chef's recommendation": 'chefs-recommendation'
};

const MenuPage: React.FC = () => {
  const { t } = useTranslations();
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  const [activeFilters, setActiveFilters] = useState<Set<FilterOption>>(new Set());

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMenu();
        setMenuData(data);
        setError(null);
      } catch (err) {
        setError(t('menuPage.loadingError'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, [t]);

  const handleFilterToggle = (filter: FilterOption) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
        trackEvent('menu_filter_applied', { filter_name: filter });
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters(new Set());
  };

  const filteredMenu = useMemo(() => {
    if (activeFilters.size === 0) {
      return menuData;
    }
    return menuData.filter(item => {
      return Array.from(activeFilters).every(filter => item.tags?.includes(filter));
    });
  }, [activeFilters, menuData]);
  
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
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t('menuPage.title')}</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">{t('menuPage.subtitle')}</p>
      </div>

      {/* Filter toolbar: Fully visible and wrapped on phones and tablets with prominent touch buttons */}
      <div className="mb-8 sm:mb-12">
        <div 
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-3xl mx-auto"
          role="toolbar" 
          aria-label="Menu Filters"
        >
          {activeFilters.size > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-full border border-gray-600 bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 min-h-[44px] sm:min-h-[48px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <span className="text-amber-400 text-xs">✕</span>
              <span>All</span>
            </button>
          )}
          {filterOptions.map(filter => (
            <button
              key={filter}
              onClick={() => handleFilterToggle(filter)}
              aria-pressed={activeFilters.has(filter)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-full border-2 transition-all duration-200 capitalize min-h-[44px] sm:min-h-[48px] flex items-center justify-center active:scale-95 ${
                activeFilters.has(filter)
                  ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/30'
                  : 'bg-gray-800/95 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:text-white shadow-sm'
              }`}
            >
              {t(`menuPage.filters.${tagToKeyMap[filter]}`)}
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loader">
            {categories.map(category => (
              <div key={category} className="mb-10 sm:mb-14">
                <div className="h-7 bg-gray-700 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {[...Array(3)].map((_, i) => <MenuCardSkeleton key={i} />)}
                </div>
              </div>
            ))}
          </motion.div>
        ) : error ? (
           <motion.div key="error" className="text-center py-12 text-red-400">
             <p className="text-xl">{error}</p>
           </motion.div>
        ) : displayedCategories.length > 0 ? (
          <motion.div key="menu-content">
            {displayedCategories.map(category => (
              <div key={category.name} className="mb-10 sm:mb-14">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-700/80 pb-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">{category.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                    {category.items.length}
                  </span>
                </div>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {category.items.map(item => (
                    <MenuCard key={item.name} item={item} />
                  ))}
                </motion.div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="no-results" className="text-center py-12 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 max-w-md mx-auto">
            <p className="text-lg sm:text-xl font-medium text-gray-300">{t('menuPage.noResults')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('menuPage.noResultsSuggestion')}</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
