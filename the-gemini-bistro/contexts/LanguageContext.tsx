
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language } from '../types';
import * as translationsData from '../services/translations';

type TranslationsObject = Record<string, any>;

interface LanguageContextType {
  language: Language;
  translations: TranslationsObject;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getTranslation = (translations: TranslationsObject, key: string): string => {
  try {
    const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);
    return typeof translation === 'string' ? translation : key;
  } catch (error) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'en' || savedLang === 'ro') ? savedLang : 'en';
  });

  // Use imported translations directly instead of fetching
  const allTranslations: Record<Language, TranslationsObject> = {
    en: translationsData.en,
    ro: translationsData.ro
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = useCallback((lang: Language) => {
    if (allTranslations[lang]) {
      setLanguage(lang);
    }
  }, [allTranslations]);
  
  const t = useCallback((key: string): string => {
    return getTranslation(allTranslations[language], key);
  }, [language, allTranslations]);

  const contextValue = { 
    language, 
    translations: allTranslations[language], 
    changeLanguage, 
    t 
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
