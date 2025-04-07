import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';

const CheckInOutDashboard = () => {
  const { translation } = useLanguage();
  const { userType, currentUser } = useUser();
  
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  
  // State for check-in/out history
  const [history, setHistory] = useState([]);
  
  // Generate initial mock data
  useEffect(() => {
    const mockData = [];
    const now = new Date();
    
    // Generate different history based on user type
    if (userType === 'resident') {
      // Past week of entries for residents
      for (let i = 1; i <= 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Add check in
        mockData.push({
          id: `in-${i}`,
          type: 'in',
          timestamp: new Date(date.setHours(8 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))),
          location: 'Main Gate'
        });
        
        // Add check out
        mockData.push({
          id: `out-${i}`,
          type: 'out',
          timestamp: new Date(date.setHours(17 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))),
          location: 'Main Gate'
        });
      }
    } else {
      // Guests have fewer entries
      for (let i = 1; i <= 3; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 2);
        
        // Add check in
        mockData.push({
          id: `in-${i}`,
          type: 'in',
          timestamp: new Date(date.setHours(10 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 60))),
          location: 'Main Gate'
        });
        
        // Add check out
        mockData.push({
          id: `out-${i}`,
          type: 'out',
          timestamp: new Date(date.setHours(16 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))),
          location: 'Main Gate'
        });
      }
    }
    
    // Sort by timestamp in descending order (newest first)
    mockData.sort((a, b) => b.timestamp - a.timestamp);
    
    setHistory(mockData);
  }, [userType]);
  
  // Handle check in
  const handleCheckIn = () => {
    // Add new entry to history
    const newEntry = {
      id: `in-${Date.now()}`,
      type: 'in',
      timestamp: new Date(),
      location: 'Main Gate'
    };
    
    setHistory([newEntry, ...history]);
    
    // Show notification
    setModalVisible(true);
  };
  
  // Handle check out
  const handleCheckOut = () => {
    // Add new entry to history
    const newEntry = {
      id: `out-${Date.now()}`,
      type: 'out',
      timestamp: new Date(),
      location: 'Main Gate'
    };
    
    setHistory([newEntry, ...history]);
    
    // Show notification
    setModalVisible(true);
  };

  // Render each history item
  const renderHistoryItem = ({ item }) => (
    <View style={[
      styles.historyItem, 
      item.type === 'in' ? styles.checkInItem : styles.checkOutItem
    ]}>
      <View style={styles.historyTypeContainer}>
        <Text style={styles.historyType}>
          {item.type === 'in' ? translation.guest.checkIn : translation.guest.checkOut}
        </Text>
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.historyTimestamp}>
          {item.timestamp.toLocaleString()}
        </Text>
        <Text style={styles.historyLocation}>{item.location}</Text>
      </View>
    </View>
  );
  
  return (
    <BaseDashboard title={
      userType === 'resident' ? 
        translation.resident.checkInOut : 
        translation.guest.checkInOut
    }>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCheckIn}
          >
            <Text style={styles.buttonText}>
              {translation.guest.checkIn}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCheckOut}
          >
            <Text style={styles.buttonText}>
              {translation.guest.checkOut}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>{translation.resident.checkInHistory}</Text>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            style={styles.historyList}
            contentContainerStyle={styles.historyContent}
          />
        </View>
        
        {/* Notification Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {translation.security.notifications}
              </Text>
              <Text style={styles.modalMessage}>
                {translation.resident.guardNotification}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>
                  {translation.common.confirm}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </BaseDashboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  historyTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: theme.spacing.m,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  checkInItem: {
    backgroundColor: theme.colors.primary + '30',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  checkOutItem: {
    backgroundColor: theme.colors.success + '30',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  historyTypeContainer: {
    width: 80,
    padding: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyType: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.sizes.caption,
  },
  historyDetails: {
    flex: 1,
    padding: theme.spacing.s,
    paddingLeft: theme.spacing.m,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyTimestamp: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.caption,
    marginBottom: 2,
  },
  historyLocation: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default CheckInOutDashboard; 