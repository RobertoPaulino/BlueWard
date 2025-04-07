import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { notificationService } from '../../utils/dataService';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';

const NotificationsDashboard = () => {
  const { translation } = useLanguage();
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  
  // Load notifications when the component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      const userNotifications = notificationService.getNotificationsForUser(currentUser.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);
  
  // Mark notification as read
  const handleMarkAsRead = (notificationId) => {
    notificationService.markNotificationAsRead(notificationId);
    
    // Update the state to reflect the change
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    // Mark all as read in the service
    notifications.forEach(notification => {
      if (!notification.read) {
        notificationService.markNotificationAsRead(notification.id);
      }
    });
    
    // Update the state to reflect the changes
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title || `${item.type} ${translation.security.notifications}`}</Text>
        <Text style={styles.notificationMessage}>
          {item.message || `${translation.auth.username} ${item.relatedUserId} ${item.type}`}
        </Text>
        <Text style={styles.notificationTime}>
          {item.time || new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
  
  return (
    <BaseDashboard title={translation.security.notifications}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.description}>
            {translation.security.manageNotifications}
          </Text>
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>
              {translation.security.approved}
            </Text>
          </TouchableOpacity>
        </View>
        
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {translation.common.no} {translation.security.notifications}
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id.toString()}
            style={styles.notificationsList}
            contentContainerStyle={styles.notificationsContent}
          />
        )}
        
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>
            {translation.userMenu.settings}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseDashboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  description: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    marginRight: theme.spacing.m,
  },
  markAllButton: {
    padding: theme.spacing.s,
  },
  markAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingBottom: theme.spacing.m,
  },
  notificationItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: 'rgba(65, 105, 225, 0.2)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  notificationMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  notificationTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  }
});

export default NotificationsDashboard; 