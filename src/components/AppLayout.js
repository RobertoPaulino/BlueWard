import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, Platform, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import theme from '../styles/theme';
import LanguageSelector from './LanguageSelector';
import UserTypeSwitcher from './UserTypeSwitcher';
import Sidebar from './Sidebar';
import { useUser } from '../context/UserContext';
import logoImage from '../assets/images/logoW.png';
import Icon from './Icon';

// Icon components using local SVG icons
const InfoIcon = () => (
  <View style={styles.menuIcon}>
    <Icon 
      name="info-circle"
      size={20}
      style={{
        color: theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </View>
);

const AccountIcon = () => (
  <View style={styles.menuIcon}>
    <Icon 
      name="user-circle"
      size={20}
      style={{
        color: theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </View>
);

const SettingsIcon = () => (
  <View style={styles.menuIcon}>
    <Icon 
      name="cog"
      size={20}
      style={{
        color: theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </View>
);

const AppSettingsIcon = () => (
  <View style={styles.menuIcon}>
    <Icon 
      name="sliders-h"
      size={20}
      style={{
        color: theme.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </View>
);

const AppLayout = ({ children, navigateTo }) => {
  const { translation } = useLanguage();
  const { currentUser, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [appSettingsVisible, setAppSettingsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // Start off-screen
  
  // Get user initial for avatar
  const getUserInitial = () => {
    if (!currentUser || !currentUser.fullName) return '?';
    return currentUser.fullName.charAt(0).toUpperCase();
  };
  
  // Set up document click handler to close the dropdown when clicking outside
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    // Define the handler
    const handleDocumentClick = (e) => {
      // Skip if menu is not open
      if (!userMenuVisible) return;
      
      // Check if the clicked element is not in our dropdown or button
      if (!e.target.closest('.userAvatarButton') && !e.target.closest('.userMenuDropdown')) {
        setUserMenuVisible(false);
        setAppSettingsVisible(false);
      }
    };
    
    // Add hover effect for menu items
    const addHoverStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .menuItemHover:hover {
          background-color: rgba(61, 90, 254, 0.4);
        }
        .userAvatarButton:hover {
          background-color: rgba(255, 255, 255, 0.12);
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    };
    
    // Add the handlers
    document.addEventListener('click', handleDocumentClick);
    const removeHoverStyles = addHoverStyles();
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      removeHoverStyles();
    };
  }, [userMenuVisible]);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const windowWidth = Dimensions.get('window').width;
      setIsSmallScreen(windowWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add listener for screen resize (web only)
    if (Platform.OS === 'web') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);
  
  // Toggle menu visibility with animation
  const toggleMenu = () => {
    if (menuVisible) {
      // Animate out
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setMenuVisible(false);
      });
    } else {
      // Show menu and animate in
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // Toggle user dropdown menu
  const toggleUserMenu = (e) => {
    // Prevent event bubbling
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    setUserMenuVisible(!userMenuVisible);
    
    if (userMenuVisible) {
      setAppSettingsVisible(false);
    }
  };
  
  // Toggle app settings section
  const toggleAppSettings = (e) => {
    // Prevent event bubbling
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    setAppSettingsVisible(!appSettingsVisible);
  };
  
  // Prevent propagation
  const preventPropagation = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  };
  
  // Hamburger icon component
  const HamburgerIcon = () => (
    <TouchableOpacity style={styles.hamburger} onPress={toggleMenu}>
      <View style={styles.hamburgerIconContainer}>
        <Icon 
          name="bars"
          size={20}
          style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
    </TouchableOpacity>
  );
  
  // Handle logout
  const handleLogout = () => {
    setUserMenuVisible(false);
    logout();
    // For web, redirect to homepage/login
    if (Platform.OS === 'web' && window) {
      window.location.href = '/';
    }
  };
  
  // User dropdown menu
  const UserMenu = () => (
    <View 
      style={styles.userMenuContainer} 
      className="userMenuDropdown"
      onTouchEnd={preventPropagation}
    >
      <TouchableOpacity 
        style={[styles.menuItem]} 
        onPress={preventPropagation}
        className="menuItemHover"
      >
        <InfoIcon />
        <Text style={styles.menuItemText}>{translation.userMenu?.residentInformation || 'Information'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.menuItem]}
        onPress={preventPropagation}
        className="menuItemHover"
      >
        <AccountIcon />
        <Text style={styles.menuItemText}>{translation.userMenu?.accountSettings || 'Account'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.menuItem, 
          appSettingsVisible && styles.activeMenuItem
        ]} 
        onPress={toggleAppSettings}
        className={appSettingsVisible ? "" : "menuItemHover"}
      >
        <SettingsIcon />
        <Text style={styles.menuItemText}>{translation.userMenu?.settings || 'Settings'}</Text>
      </TouchableOpacity>
      
      {appSettingsVisible && (
        <TouchableOpacity 
          style={styles.appSettingsContainer}
          onPress={preventPropagation}
          activeOpacity={1}
        >
          <Text style={styles.settingsHeader}>{translation.userMenu?.language || 'Language'}</Text>
          <LanguageSelector compact={true} />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.menuItem, styles.logoutMenuItem]}
        onPress={handleLogout}
        className="menuItemHover"
      >
        <View style={styles.menuIcon}>
          <Icon 
            name="sign-out-alt"
            size={20}
            style={{
              color: theme.colors.danger,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
        <Text style={styles.menuItemText}>{translation.auth?.logout || 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Sidebar - conditionally rendered based on screen size */}
        {isSmallScreen ? (
          menuVisible && (
            <Animated.View 
              style={[
                styles.mobileSidebar,
                { left: slideAnim }
              ]}
            >
              <Sidebar 
                logo={logoImage}
                onItemPress={() => toggleMenu()} 
                navigateTo={navigateTo}
              />
            </Animated.View>
          )
        ) : (
          <View style={styles.sidebar}>
            <Sidebar 
              logo={logoImage} 
              navigateTo={navigateTo}
            />
          </View>
        )}
        
        {/* Main content area */}
        <View style={styles.rightSection}>
          {/* Top bar */}
          <View style={styles.topBar}>
            {isSmallScreen && <HamburgerIcon />}
            <View style={styles.topBarMiddle}>
              {/* Language selector moved to dropdown */}
            </View>
            <View style={styles.topBarRight}>
              <TouchableOpacity 
                style={[styles.userAvatarButton, userMenuVisible && styles.userAvatarActive]}
                className="userAvatarButton"
                onPress={toggleUserMenu}
                activeOpacity={0.8}
              >
                {!isSmallScreen && (
                  <Text style={styles.userName}>
                    {currentUser ? currentUser.fullName : 'User'}
                  </Text>
                )}
                <View 
                  style={styles.userAvatar} 
                  className="userAvatar" 
                  data-username={currentUser ? currentUser.fullName : ''}
                >
                  <Icon 
                    name="user"
                    size={16}
                    style={{
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Main screen content */}
          <View style={styles.mainContent}>
            {children}
          </View>
        </View>
        
        {/* User dropdown menu - moved outside of nested components for better visibility */}
        {userMenuVisible && <UserMenu />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 275,
    backgroundColor: theme.colors.primaryDark, // Updated sidebar background
  },
  mobileSidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 275,
    zIndex: 100,
    backgroundColor: theme.colors.primaryDark, // Updated sidebar background
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.surface, // Updated header background
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topBarMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 9999,
  },
  userAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.s,
    borderRadius: 25,
    transition: 'background-color 0.2s ease',
  },
  userAvatarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userInitial: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.typography.fontWeights.bold,
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.typography.fontWeights.medium,
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.background, // Updated content background
    padding: theme.spacing.m,
  },
  hamburger: {
    marginRight: theme.spacing.m,
    padding: theme.spacing.xs,
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: 'white',
    marginVertical: 3,
    borderRadius: 1,
  },
  userMenuContainer: {
    position: 'fixed',
    top: 60,
    right: 16,
    width: 250,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 9999,
    pointerEvents: 'auto',
  },
  menuItem: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(61, 90, 254, 0.7)',
  },
  menuItemHover: {
    '&:hover': {
      backgroundColor: 'rgba(61, 90, 254, 0.4)',
    }
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    color: 'white',
    fontSize: 15,
    fontWeight: theme.typography.fontWeights.medium,
  },
  appSettingsContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.primaryDark,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  settingsHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.s,
  },
  logoutMenuItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 4,
  },
  logoutIcon: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hamburgerIconContainer: {
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppLayout; 