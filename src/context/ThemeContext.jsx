import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = '@catatabung_theme_mode';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (e) {
      console.error('Error loading theme', e);
      setIsDark(systemColorScheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async (value) => {
    try {
      setIsDark(value);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (e) {
      console.error('Error saving theme', e);
    }
  };

  const theme = isDark ? Colors.dark : Colors.light;

  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setIsDark: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
