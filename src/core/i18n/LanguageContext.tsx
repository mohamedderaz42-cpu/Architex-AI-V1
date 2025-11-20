
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, languages, LanguageCode } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to English or detect browser preference if matches
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Update direction based on language
    const selectedLang = languages.find(l => l.code === language);
    if (selectedLang) {
      setDir(selectedLang.dir);
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = selectedLang.code;
    }
  }, [language]);

  const t = (key: string): string => {
    const langData = translations[language];
    return langData[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
