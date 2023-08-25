import React, { createContext, useContext } from 'react';

// Define the theme colors
const themeColors = {
  primary: '#1290CB',
  primaryText: '#ffffff',
  secondary: '#3495A5',
  tertiary: '#F7F8F9',
  text:'#000'
};


// Create the theme context with a default value
const ThemeContext = createContext(themeColors);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={themeColors}>
      {children}
    </ThemeContext.Provider>
  );
};
