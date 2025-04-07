import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Animated } from 'react-native';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import theme from '../styles/theme';
import UserTypeSwitcher from './UserTypeSwitcher';

const Sidebar = ({ onItemPress, logo, navigateTo }) => {
  const { userType } = useUser();
  const { translation } = useLanguage();
  
  // Handle item press with optional callback
  const handleItemPress = (screen) => {
    // Navigate to the selected screen
    if (navigateTo) {
      navigateTo(screen);
    }
    
    // Call the onItemPress callback (for mobile menu toggling)
    if (onItemPress) {
      onItemPress();
    }
  };
  
  // Menu items based on user type
  const renderMenuItems = () => {
    switch (userType) {
      case 'resident':
        return (
          <>
            <MenuItem 
              title={translation.resident.invites} 
              onPress={() => handleItemPress('Invites')} 
            />
            <Divider />
            <MenuItem 
              title={translation.resident.friendList} 
              onPress={() => handleItemPress('FriendList')} 
            />
            <Divider />
            <MenuItem 
              title={translation.resident.checkInOut} 
              onPress={() => handleItemPress('CheckInOut')} 
            />
          </>
        );
        
      case 'guest':
        return (
          <>
            <MenuItem 
              title={translation.guest.invites} 
              onPress={() => handleItemPress('Invites')} 
            />
            <Divider />
            <MenuItem 
              title={translation.guest.friendList} 
              onPress={() => handleItemPress('FriendList')} 
            />
            <Divider />
            <MenuItem 
              title={translation.guest.checkInOut} 
              onPress={() => handleItemPress('CheckInOut')} 
            />
            <Divider />
            <MenuItem 
              title={translation.guest.upgradeToResident} 
              onPress={() => handleItemPress('UpgradeToResident')} 
            />
          </>
        );
        
      case 'security':
        return (
          <>
            <MenuItem 
              title={translation.security.searchInvites} 
              onPress={() => handleItemPress('SearchInvites')} 
            />
            <Divider />
            <MenuItem 
              title={translation.security.invites} 
              onPress={() => handleItemPress('Invites')} 
            />
            <Divider />
            <MenuItem 
              title={translation.security.notifications} 
              onPress={() => handleItemPress('Notifications')} 
            />
          </>
        );
        
      case 'admin':
        return (
          <>
            <MenuItem 
              title={translation.admin.vipInvite} 
              onPress={() => handleItemPress('VIPInvite')} 
            />
            <Divider />
            <MenuItem 
              title={translation.admin.vipInviteManager} 
              onPress={() => handleItemPress('VIPInviteManager')} 
            />
            <Divider />
            <MenuItem 
              title={translation.admin.residentLinker} 
              onPress={() => handleItemPress('ResidentLinker')} 
            />
            <Divider />
            <MenuItem 
              title={translation.admin.residentDisabler} 
              onPress={() => handleItemPress('ResidentDisabler')} 
            />
            <Divider />
            <MenuItem 
              title={translation.admin.guardAccountManagement} 
              onPress={() => handleItemPress('GuardAccountOverview')} 
            />
          </>
        );
        
      default:
        return null;
    }
  };

  // Divider component
  const Divider = () => (
    <View style={styles.divider} />
  );

  // Custom button for the UserTypeSwitcher
  const SwitchUserButton = (
    <View style={styles.switchUserButton}>
      <View style={styles.switchUserContent}>
        <i className="fas fa-exchange-alt" style={{
          fontSize: 14, 
          color: 'white',
          marginRight: 8,
        }}></i>
        <Text style={styles.switchUserText}>
          {translation.dashboard?.switchUserDemo || 'Switch user demo'}
        </Text>
      </View>
    </View>
  );
  
  // Close button for mobile view
  const CloseButton = () => (
    <TouchableOpacity 
      style={styles.closeButton} 
      onPress={() => onItemPress && onItemPress()}
    >
      <i className="fas fa-times" style={{
        fontSize: 20,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}></i>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* Logo section */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => handleItemPress('Home')}>
          <View style={styles.logoRow}>
            <View style={styles.logoWrapper}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.logoText}>BlueWard</Text>
          </View>
        </TouchableOpacity>
        {onItemPress && <CloseButton />}
      </View>
      
      {/* Menu items */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.menuItems}>
          {renderMenuItems()}
        </View>
      </ScrollView>
      
      {/* Switch User Demo button */}
      <View style={styles.switchUserContainer}>
        <UserTypeSwitcher customButton={SwitchUserButton} />
      </View>
    </View>
  );
};

// MenuItem component for each menu option
const MenuItem = ({ title, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // These functions only work on web
  const onMouseEnter = () => {
    if (Platform.OS === 'web') {
      setIsHovered(true);
    }
  };
  
  const onMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsHovered(false);
    }
  };

  // Get appropriate icon based on menu title
  const getIconForMenuItem = (title) => {
    // Convert to lowercase for easier comparison
    const lowerTitle = title.toLowerCase();
    
    // Resident/Guest menu items
    if (lowerTitle.includes('invite') && lowerTitle.includes('vip')) return "fa-crown";
    if (lowerTitle.includes('invite') && lowerTitle.includes('manager')) return "fa-tasks";
    if (lowerTitle.includes('invite')) return "fa-envelope";
    if (lowerTitle.includes('friend')) return "fa-user-friends";
    if (lowerTitle.includes('check')) return "fa-clipboard-check";
    
    // Guest specific
    if (lowerTitle.includes('upgrade')) return "fa-level-up-alt";
    
    // Security specific
    if (lowerTitle.includes('search')) return "fa-search";
    if (lowerTitle.includes('notification')) return "fa-bell";
    
    // Admin specific
    if (lowerTitle.includes('vip')) return "fa-star";
    if (lowerTitle.includes('linker')) return "fa-link";
    if (lowerTitle.includes('resident') && lowerTitle.includes('disable')) return "fa-user-slash";
    if (lowerTitle.includes('guard')) return "fa-shield-alt";
    if (lowerTitle.includes('account')) return "fa-user-cog";
    
    // Default icons based on general functionality
    if (lowerTitle.includes('settings')) return "fa-cog";
    if (lowerTitle.includes('profile')) return "fa-id-card";
    if (lowerTitle.includes('dashboard')) return "fa-tachometer-alt";
    if (lowerTitle.includes('home')) return "fa-home";
    if (lowerTitle.includes('report')) return "fa-chart-bar";
    if (lowerTitle.includes('log')) return "fa-list";
    if (lowerTitle.includes('message')) return "fa-comment";
    if (lowerTitle.includes('calendar')) return "fa-calendar-alt";
    
    // Default icon as a fallback
    return "fa-chevron-right";
  };
  
  // Get icon element
  const getIcon = () => {
    const iconClass = getIconForMenuItem(title);
    return (
      <View style={styles.menuItemIcon}>
        <i className={`fas ${iconClass}`} style={{
          fontSize: 16, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}></i>
      </View>
    );
  };

  const handlePress = () => {
    // Scale down animation
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Scale back up
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      
      // Call the onPress handler
      if (onPress) {
        onPress();
      }
    });
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      activeOpacity={0.7}
      style={[
        styles.menuItem,
        isHovered && styles.menuItemHover
      ]}
    >
      <Animated.View
        style={[
          styles.menuItemContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {getIcon()}
        <Text style={styles.menuItemText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark, // Match updated sidebar color
    flexDirection: 'column',
    height: '100%'
  },
  logoContainer: {
    height: 60, // Match header height
    paddingHorizontal: theme.spacing.s, // Reduce horizontal padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to start for better control
    backgroundColor: theme.colors.primaryDark, // Match sidebar background
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
    position: 'relative', // For absolute positioned close button
    paddingLeft: 20, // Add specific left padding
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  logo: {
    width: 56, // Increase logo size even more
    height: 56, // Increase logo size even more
    marginRight: theme.spacing.s, // Reduce right margin
    padding: 3, // Slightly reduce padding to accommodate larger logo
  },
  logoText: {
    color: 'white',
    fontSize: 24, // Slightly smaller for better fit
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Text shadow for better visibility
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  menuItems: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
  },
  menuItem: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    marginVertical: 4, // Add vertical margin between items
    marginHorizontal: 8, // Add horizontal margin so highlight doesn't touch edges
    transition: 'background-color 0.3s ease', // Smooth transition for background color
    borderRadius: 4, // Add slight rounding to highlighted area
  },
  menuItemHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light white overlay on hover
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'white',
    fontSize: theme.typography.sizes.body,
    transition: 'color 0.3s ease', // Smooth transition for text color
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: theme.spacing.m,
    marginVertical: 6, // Add vertical margin around dividers
  },
  switchUserContainer: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)', // Add a subtle border
  },
  switchUserButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    borderRadius: 20,
  },
  switchUserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchUserText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Sidebar; 