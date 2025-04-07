// Data service for BlueWard application
// This service centralizes all data access operations and provides a more structured
// approach for handling data, making future backend integration easier.

import { mockUsers, mockInvites, mockCheckIns, mockNotifications, mockVIPInvites } from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  LANGUAGE: 'language',
  NOTIFICATIONS: 'notifications',
  INVITES: 'invites',
  CHECK_INS: 'checkIns',
};

// Helper to safely parse JSON from localStorage
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper to safely set JSON to localStorage
const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

// Helper to safely remove item from localStorage
const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// User-related operations
export const userService = {
  // Get current user from localStorage
  getCurrentUser: () => getFromStorage(STORAGE_KEYS.CURRENT_USER),
  
  // Set current user to localStorage
  setCurrentUser: (user) => setToStorage(STORAGE_KEYS.CURRENT_USER, user),
  
  // Remove current user from localStorage
  removeCurrentUser: () => removeFromStorage(STORAGE_KEYS.CURRENT_USER),
  
  // Find a user by username across all user types
  findUserByUsername: (username) => {
    // Cache users for faster lookup
    const allUsers = [
      ...mockUsers.residents,
      ...mockUsers.guests,
      ...mockUsers.security,
      ...mockUsers.admin
    ];
    
    return allUsers.find(user => user.username === username);
  },
  
  // Find a user by ID across all user types
  findUserById: (id) => {
    // Cache users for faster lookup
    const allUsers = [
      ...mockUsers.residents,
      ...mockUsers.guests,
      ...mockUsers.security,
      ...mockUsers.admin
    ];
    
    return allUsers.find(user => user.id === id);
  },
  
  // Get users by type
  getUsersByType: (type) => {
    if (type === 'resident') return mockUsers.residents;
    if (type === 'guest') return mockUsers.guests;
    if (type === 'security') return mockUsers.security;
    if (type === 'admin') return mockUsers.admin;
    return [];
  },
  
  // Get all users
  getAllUsers: () => {
    return {
      residents: mockUsers.residents,
      guests: mockUsers.guests,
      security: mockUsers.security,
      admin: mockUsers.admin
    };
  }
};

// Invite-related operations
export const inviteService = {
  // Get all invites
  getAllInvites: () => mockInvites,
  
  // Get invites by creator ID
  getInvitesByCreator: (creatorId) => {
    return mockInvites.filter(invite => invite.createdBy === creatorId);
  },
  
  // Get invites for guest ID
  getInvitesForGuest: (guestId) => {
    return mockInvites.filter(invite => invite.guestId === guestId);
  },
  
  // Get invite by ID
  getInviteById: (id) => {
    return mockInvites.find(invite => invite.id === id);
  },
  
  // Get invite by code
  getInviteByCode: (code) => {
    return mockInvites.find(invite => invite.code === code);
  }
};

// Check-in related operations
export const checkInService = {
  // Get all check-ins
  getAllCheckIns: () => mockCheckIns,
  
  // Get check-ins by user ID
  getCheckInsByUser: (userId) => {
    return mockCheckIns.filter(checkIn => checkIn.userId === userId);
  },
  
  // Get check-ins by invite ID
  getCheckInsByInvite: (inviteId) => {
    return mockCheckIns.filter(checkIn => checkIn.inviteId === inviteId);
  },
  
  // Get most recent check-in status for a user
  getLatestCheckInStatusForUser: (userId) => {
    const userCheckIns = mockCheckIns
      .filter(checkIn => checkIn.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return userCheckIns.length > 0 ? userCheckIns[0] : null;
  }
};

// Notification-related operations
export const notificationService = {
  // Get all notifications
  getAllNotifications: () => mockNotifications,
  
  // Get notifications for user
  getNotificationsForUser: (userId) => {
    return mockNotifications.filter(notification => notification.userId === userId);
  },
  
  // Get unread notifications for user
  getUnreadNotificationsForUser: (userId) => {
    return mockNotifications.filter(
      notification => notification.userId === userId && !notification.read
    );
  },
  
  // Mark notification as read
  markNotificationAsRead: (notificationId) => {
    const notification = mockNotifications.find(notification => notification.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
};

// Language-related operations
export const languageService = {
  // Get saved language preference
  getLanguagePreference: () => getFromStorage(STORAGE_KEYS.LANGUAGE),
  
  // Save language preference
  saveLanguagePreference: (language) => setToStorage(STORAGE_KEYS.LANGUAGE, language)
};

// VIP Invite-related operations
export const vipInviteService = {
  // Get all VIP invites
  getAllVIPInvites: () => mockVIPInvites,
  
  // Get VIP invite by ID
  getVIPInviteById: (id) => {
    return mockVIPInvites.find(invite => invite.id === id);
  },
  
  // Get VIP invite by code
  getVIPInviteByCode: (code) => {
    return mockVIPInvites.find(invite => invite.code === code);
  },
  
  // Mock function to disable a VIP invite
  disableVIPInvite: (id) => {
    const invite = mockVIPInvites.find(invite => invite.id === id);
    if (invite) {
      invite.status = 'disabled';
      return true;
    }
    return false;
  },
  
  // Mock function to enable a VIP invite
  enableVIPInvite: (id) => {
    const invite = mockVIPInvites.find(invite => invite.id === id);
    if (invite) {
      invite.status = 'active';
      return true;
    }
    return false;
  },
  
  // Mock function to delete a VIP invite
  deleteVIPInvite: (id) => {
    const index = mockVIPInvites.findIndex(invite => invite.id === id);
    if (index !== -1) {
      mockVIPInvites.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Default export with all services
export default {
  user: userService,
  invite: inviteService,
  checkIn: checkInService,
  notification: notificationService,
  language: languageService,
  vipInvite: vipInviteService
}; 