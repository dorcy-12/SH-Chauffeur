import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const Footer = ({navigation}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [activeIcon, setActiveIcon] = useState('home');  // Setting 'home' as default active icon

  const navigateToScreen = (screenName) => {
    setActiveIcon(screenName);
    navigation.navigate(screenName); // Use the navigation object to navigate
  };

  const renderIcon = (name, iconName) => (
    <TouchableOpacity onPress={() => navigateToScreen(name)} style={styles.iconContainer}>
      {activeIcon === name && <View style={styles.activeBar}></View>}
      <Ionicons name={iconName} size={25} color={activeIcon === name ? theme.secondary : '#A0AAB8'} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.footerContainer}>
      {renderIcon('home', 'home')}
      {renderIcon('profile', 'person')}
      {renderIcon('documents', 'document-text')}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 50,
    paddingVertical: 15,
  },
  iconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  activeBar: {
    height: 4,
    width: 30,
    backgroundColor: theme.secondary,
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: [{ translateX: -15 }], // Half of the width to center the bar
  },
});

export default Footer;
