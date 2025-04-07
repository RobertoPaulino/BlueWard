import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../utils/translations';
import { languageService } from '../utils/dataService';

// Default language
const DEFAULT_LANGUAGE = 'en';

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  // State to store the current language
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  
  // State to store the current translation
  const [translation, setTranslation] = useState(translations[DEFAULT_LANGUAGE]);

  // Effect to update the translation when language changes
  useEffect(() => {
    setTranslation(translations[language]);
  }, [language]);

  // Function to change the language
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      
      // Store the language preference using the service
      languageService.saveLanguagePreference(newLanguage);
    } else {
      console.error(`Language ${newLanguage} is not supported.`);
    }
  };

  // Load saved language preference on initial load
  useEffect(() => {
    const savedLanguage = languageService.getLanguagePreference();
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // The value to be provided to consumers
  const contextValue = {
    language,
    translation,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 