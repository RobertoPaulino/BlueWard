import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { UserProvider, useUser } from './context/UserContext';
import AppLayout from './components/AppLayout';
import LanguageSelector from './components/LanguageSelector';
import theme from './styles/theme';
import logoImage from './assets/images/logoW.png';

// Import dashboard components
import {
  SearchInvitesDashboard,
  NotificationsDashboard,
  InvitesDashboard,
  VIPInviteDashboard,
  ResidentLinkerDashboard,
  ResidentDisablerDashboard,
  GuardAccountOverviewDashboard,
  FriendListDashboard,
  CheckInOutDashboard,
  UpgradeToResidentDashboard,
  VIPInviteManagerDashboard
} from './components/dashboards';

// Simple Login Screen
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useUser();
  const { translation } = useLanguage();
  // Add reference for the password input to allow focus on Enter press
  const passwordInputRef = useRef(null);

  const handleLogin = () => {
    login(username, password);
  };

  // Mock social login handling
  const handleSocialLogin = (provider) => {
    console.log(`Attempting to login with ${provider}`);
    // For demo purposes, we'll just show an alert
    alert(`${provider} login is not implemented in this demo.`);
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.langSelectorContainer}>
        <LanguageSelector compact={true} />
      </View>
      <View style={styles.loginBox}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.loginTitle}>{translation.common.appName}</Text>
        <Text style={styles.loginSubtitle}>{translation.auth.login}</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder={translation.auth.username}
          placeholderTextColor={theme.colors.placeholder}
          value={username}
          onChangeText={setUsername}
          editable={!isLoading}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          returnKeyType="next"
          blurOnSubmit={false}
        />
        
        <TextInput
          ref={passwordInputRef}
          style={styles.textInput}
          placeholder={translation.auth.password}
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          onSubmitEditing={handleLogin}
          returnKeyType="go"
        />
        
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? translation.common.loading : (
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <i className="fas fa-sign-in-alt" style={{fontSize: 16}}></i>
                <Text style={{marginLeft: 8, color: 'white', fontWeight: 'bold'}}>{translation.auth.signIn}</Text>
              </View>
            )}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>{translation.auth.orSignInWith}</Text>
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.gmailButton]} 
              onPress={() => handleSocialLogin('Gmail')}
            >
              <View style={styles.socialButtonContent}>
                <i className="fab fa-google" style={{fontSize: 16, color: 'white'}}></i>
                <Text style={styles.socialButtonText}>Gmail</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]} 
              onPress={() => handleSocialLogin('Apple')}
            >
              <View style={styles.socialButtonContent}>
                <i className="fab fa-apple" style={{fontSize: 16, color: 'white'}}></i>
                <Text style={styles.socialButtonText}>Apple</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.xButton]} 
              onPress={() => handleSocialLogin('X')}
            >
              <View style={styles.socialButtonContent}>
                <i className="fab fa-twitter" style={{fontSize: 16, color: 'white'}}></i>
                <Text style={styles.socialButtonText}>X</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.forgotPassword}>
          <i className="fas fa-key" style={{marginRight: 8, fontSize: 12}}></i>
          {translation.auth.forgotPassword}
        </Text>
        
        {/* Demo credentials */}
        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>
            <i className="fas fa-info-circle" style={{marginRight: 8}}></i>
            {translation.auth.demoCredentials}
          </Text>
          <Text style={styles.demoText}>
            <i className="fas fa-home" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
            {translation.auth.resident}: john_resident
          </Text>
          <Text style={styles.demoText}>
            <i className="fas fa-user" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
            {translation.auth.guest}: bob_guest
          </Text>
          <Text style={styles.demoText}>
            <i className="fas fa-shield-alt" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
            {translation.auth.security}: guard_main
          </Text>
          <Text style={styles.demoText}>
            <i className="fas fa-user-shield" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
            {translation.auth.admin}: admin_super
          </Text>
          <Text style={styles.demoText}>
            <i className="fas fa-unlock" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
            {translation.auth.noPasswordRequired}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Main content for each dashboard
const DashboardContent = () => {
  const { userType, currentUser } = useUser();
  const { translation } = useLanguage();
  
  const renderUserTypeSpecificContent = () => {
    switch (userType) {
      case 'resident':
        return (
          <View style={styles.dashboardFeature}>
            <Text style={styles.featureTitle}>
              <i className="fas fa-tasks" style={{marginRight: 8}}></i>
              {translation.resident.features}:
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-envelope" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.resident.manageInvites}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-user-friends" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.resident.viewFriendList}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-clipboard-check" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.resident.checkInOutFacility}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-bolt" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.resident.enableFastCheckIn}
            </Text>
          </View>
        );
      
      case 'guest':
        return (
          <View style={styles.dashboardFeature}>
            <Text style={styles.featureTitle}>
              <i className="fas fa-tasks" style={{marginRight: 8}}></i>
              {translation.guest.features}:
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-envelope-open" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.guest.viewInvites}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-user-friends" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.guest.manageFriendList}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-clipboard-check" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.guest.checkInOutFacility}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-level-up-alt" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.guest.upgradeStatus}
            </Text>
          </View>
        );
      
      case 'security':
        return (
          <View style={styles.dashboardFeature}>
            <Text style={styles.featureTitle}>
              <i className="fas fa-tasks" style={{marginRight: 8}}></i>
              {translation.security.features}:
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-search" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.security.searchViewInvites}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-check-double" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.security.processCheckInOut}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-bell" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.security.manageNotifications}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-clipboard-list" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.security.viewVisitorLogs}
            </Text>
          </View>
        );
      
      case 'admin':
        return (
          <View style={styles.dashboardFeature}>
            <Text style={styles.featureTitle}>
              <i className="fas fa-tasks" style={{marginRight: 8}}></i>
              {translation.admin.features}:
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-crown" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.admin.createVIPInvites}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-link" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.admin.linkGuests}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-user-slash" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.admin.disableAccounts}
            </Text>
            <Text style={styles.featureItem}>
              <i className="fas fa-shield-alt" style={{width: 20, textAlign: 'center', marginRight: 8}}></i>
              {translation.admin.manageGuards}
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ScrollView style={styles.dashboardScrollContainer}>
      <View style={styles.dashboardContent}>
        <Text style={styles.welcomeText}>
          <i className="fas fa-hand-sparkles" style={{marginRight: 10}}></i>
          {translation.common.welcome}, {currentUser?.fullName}!
        </Text>
        
        <View style={styles.userTypeIndicator}>
          <Text style={styles.userTypeText}>
            <i className="fas fa-id-badge" style={{marginRight: 10}}></i>
            {translation.dashboard.currentUserType}: {userType.charAt(0).toUpperCase() + userType.slice(1)}
            {userType === 'resident' ? ` (${currentUser?.residence})` : ''}
          </Text>
        </View>
        
        <View style={styles.demoMessage}>
          <Text style={styles.demoMessageTitle}>
            <i className="fas fa-info-circle" style={{marginRight: 8}}></i>
            {translation.dashboard.demoMode}
          </Text>
          <Text style={styles.demoMessageText}>
            {translation.dashboard.demoDescription}
          </Text>
        </View>
        
        {renderUserTypeSpecificContent()}
      </View>
    </ScrollView>
  );
};

// App wrapper with authentication logic and navigation
const AppWrapper = () => {
  const { currentUser, isLoading, userType } = useUser();
  const { translation } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [previousScreen, setPreviousScreen] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Wave animation values
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  
  // Start wave animations when loading
  useEffect(() => {
    if (isLoading) {
      // Wave 1 animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(wave1, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(wave1, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
          })
        ])
      ).start();
      
      // Wave 2 animation (offset timing)
      Animated.loop(
        Animated.sequence([
          Animated.timing(wave2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(wave2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          })
        ])
      ).start();
      
      // Logo subtle animation
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(logoRotate, {
              toValue: 1,
              duration: 5000,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 1.1,
              duration: 2500,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(logoRotate, {
              toValue: 0,
              duration: 5000,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            })
          ])
        ])
      ).start();
    }
  }, [isLoading]);
  
  // Check loading state first before checking currentUser
  if (isLoading) {
    const wave1Transform = wave1.interpolate({
      inputRange: [0, 1],
      outputRange: ['-5%', '5%']
    });
    
    const wave2Transform = wave2.interpolate({
      inputRange: [0, 1],
      outputRange: ['5%', '-5%']
    });
    
    const rotateValue = logoRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '10deg']
    });
    
    return (
      <View style={styles.loadingContainer}>
        {/* Ocean waves */}
        <Animated.View style={[
          styles.waveContainer, 
          styles.wave1, 
          {transform: [{translateX: wave1Transform}]}
        ]} />
        
        <Animated.View style={[
          styles.waveContainer, 
          styles.wave2, 
          {transform: [{translateX: wave2Transform}]}
        ]} />
        
        {/* Logo container with animation */}
        <View style={styles.loadingContent}>
          <Animated.View style={[
            styles.loadingLogoContainer,
            {
              transform: [
                {rotate: rotateValue},
                {scale: logoScale}
              ]
            }
          ]}>
            <Image source={logoImage} style={styles.loadingLogo} resizeMode="contain" />
          </Animated.View>
          
          <Text style={styles.loadingText}>{translation.common.loading}</Text>
          
          <View style={styles.loadingDots}>
            <Animated.View style={[
              styles.loadingDot,
              {opacity: wave1}
            ]} />
            <Animated.View style={[
              styles.loadingDot,
              {opacity: wave2}
            ]} />
            <Animated.View style={[
              styles.loadingDot,
              {opacity: wave1}
            ]} />
          </View>
        </View>
      </View>
    );
  }
  
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Handle navigation with transition
  const handleNavigation = (screen) => {
    if (screen === currentScreen) return;
    
    setPreviousScreen(currentScreen);
    
    // Fade out and slight slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Change screen
      setCurrentScreen(screen);
      
      // Reset slide position
      slideAnim.setValue(20);
      
      // Fade in and slide back
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  // Render content based on current screen
  const renderScreenContent = () => {
    // Home screen (default dashboard)
    if (currentScreen === 'Home') {
      return <DashboardContent />;
    }

    // Security screens
    if (userType === 'security') {
      switch (currentScreen) {
        case 'SearchInvites':
          return <SearchInvitesDashboard />;
        case 'Notifications':
          return <NotificationsDashboard />;
        case 'Invites':
          return <InvitesDashboard />;
        default:
          return <DashboardContent />;
      }
    }

    // Admin screens
    if (userType === 'admin') {
      switch (currentScreen) {
        case 'VIPInvite':
          return <VIPInviteDashboard />;
        case 'VIPInviteManager':
          return <VIPInviteManagerDashboard />;
        case 'ResidentLinker':
          return <ResidentLinkerDashboard />;
        case 'ResidentDisabler':
          return <ResidentDisablerDashboard />;
        case 'GuardAccountOverview':
          return <GuardAccountOverviewDashboard />;
        default:
          return <DashboardContent />;
      }
    }

    // Resident screens
    if (userType === 'resident') {
      switch (currentScreen) {
        case 'Invites':
          return <InvitesDashboard />;
        case 'FriendList':
          return <FriendListDashboard />;
        case 'CheckInOut':
          return <CheckInOutDashboard />;
        default:
          return <DashboardContent />;
      }
    }

    // Guest screens
    if (userType === 'guest') {
      switch (currentScreen) {
        case 'Invites':
          return <InvitesDashboard />;
        case 'FriendList':
          return <FriendListDashboard />;
        case 'CheckInOut':
          return <CheckInOutDashboard />;
        case 'UpgradeToResident':
          return <UpgradeToResidentDashboard />;
        default:
          return <DashboardContent />;
      }
    }

    // Default to home dashboard
    return <DashboardContent />;
  };
  
  return (
    <AppLayout navigateTo={handleNavigation}>
      <Animated.View style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }}>
        {renderScreenContent()}
      </Animated.View>
    </AppLayout>
  );
};

// Main App component
const App = () => {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppWrapper />
      </UserProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    height: '30%',
    width: '200%',
    borderRadius: 50,
  },
  wave1: {
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.4)', // primary with opacity
    height: '25%',
  },
  wave2: {
    bottom: 0,
    backgroundColor: 'rgba(30, 64, 175, 0.6)', // primaryDark with opacity
    height: '20%',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  loadingLogoContainer: {
    padding: 20,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingLogo: {
    width: 100,
    height: 100,
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 5,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    position: 'relative',
  },
  langSelectorContainer: {
    position: 'absolute',
    top: theme.spacing.l,
    right: theme.spacing.l,
    zIndex: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: theme.roundness,
    padding: theme.spacing.xs,
  },
  loginBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryDark,
    padding: theme.spacing.s,
  },
  loginTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  loginSubtitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  loginButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
  forgotPassword: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.caption,
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
  demoCredentials: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.backdrop,
    borderRadius: theme.roundness,
  },
  demoTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.s,
  },
  demoText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    marginBottom: theme.spacing.xs,
  },
  dashboardScrollContainer: {
    flex: 1,
  },
  dashboardContent: {
    flex: 1,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  welcomeText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  userTypeIndicator: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.l,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  userTypeText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.medium,
  },
  demoMessage: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.l,
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  demoMessageTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  demoMessageText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  dashboardFeature: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.roundness,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.l,
    width: '100%',
    maxWidth: 600,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  featureTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
  },
  featureItem: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
    lineHeight: 24,
  },
  socialLoginContainer: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
  },
  socialLoginText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  socialButton: {
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.xs,
    minWidth: 100,
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.sizes.button,
    color: 'white',
    marginLeft: 8,
  },
  gmailButton: {
    backgroundColor: theme.colors.gmail,
  },
  appleButton: {
    backgroundColor: theme.colors.apple,
  },
  xButton: {
    backgroundColor: theme.colors.x,
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.disabled || theme.colors.border,
    opacity: 0.7,
  },
});

export default App; 