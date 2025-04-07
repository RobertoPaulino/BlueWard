import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import { userService } from '../../utils/dataService';

const FriendListDashboard = () => {
  const { translation } = useLanguage();
  const { userType, currentUser } = useUser();
  
  // State for friends data
  const [friends, setFriends] = useState([]);
  
  // State for quick invite modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [validity, setValidity] = useState(3);
  const [multiUse, setMultiUse] = useState(true);
  
  // Load friends data
  useEffect(() => {
    if (currentUser && currentUser.friends) {
      const friendsData = currentUser.friends.map(friendId => {
        return userService.findUserById(friendId);
      }).filter(friend => friend !== undefined);
      
      setFriends(friendsData);
    }
  }, [currentUser]);
  
  // Handle Quick Invite button press
  const handleQuickInvite = (friend) => {
    setSelectedFriend(friend);
    setModalVisible(true);
  };
  
  // Close modal and reset selected friend
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFriend(null);
  };
  
  // Render each friend item
  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.fullName}</Text>
        
        {item.type === 'resident' && (
          <Text style={styles.friendApartment}>
            {item.residence}
          </Text>
        )}
      </View>
      
      {userType === 'resident' && (
        <TouchableOpacity 
          style={styles.quickInviteButton}
          onPress={() => handleQuickInvite(item)}
        >
          <Text style={styles.quickInviteText}>
            {translation.resident.quickInvite}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Create some mock friends data if none exists
  useEffect(() => {
    if (!currentUser || !currentUser.friends || friends.length > 0) return;
    
    // Mock data in case we don't have friends from the user service
    const mockFriends = [
      {
        id: 101,
        fullName: 'Alex Johnson',
        type: 'resident',
        residence: 'A203',
      },
      {
        id: 102,
        fullName: 'Emma Williams',
        type: 'guest',
      },
      {
        id: 103,
        fullName: 'Michael Brown',
        type: 'resident',
        residence: 'B112',
      },
      {
        id: 104,
        fullName: 'Sophia Davis',
        type: 'guest',
      },
    ];
    
    setFriends(mockFriends);
  }, [currentUser, friends]);
  
  return (
    <BaseDashboard title={
      userType === 'resident' ? 
        translation.resident.friendList : 
        translation.guest.friendList
    }>
      <View style={styles.container}>
        <Text style={styles.description}>
          {userType === 'resident' ? 
            translation.resident.viewFriendList : 
            translation.guest.manageFriendList
          }
        </Text>
        
        {friends.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {translation.common.no} {translation.resident.friendList}
            </Text>
          </View>
        ) : (
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={item => item.id.toString()}
            style={styles.friendsList}
            contentContainerStyle={styles.friendsContent}
          />
        )}
        
        {/* Add Friend Button */}
        <TouchableOpacity style={styles.addFriendButton}>
          <Text style={styles.addFriendButtonText}>
            {translation.resident.addFriend}
          </Text>
        </TouchableOpacity>
        
        {/* Quick Invite Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {translation.resident.quickInvite}
              </Text>
              
              {selectedFriend && (
                <View style={styles.selectedFriendContainer}>
                  <Text style={styles.selectedFriendName}>
                    {selectedFriend.fullName}
                  </Text>
                  {selectedFriend.type === 'resident' && (
                    <Text style={styles.selectedFriendApartment}>
                      {selectedFriend.residence}
                    </Text>
                  )}
                </View>
              )}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {translation.resident.inviteValidity}
                </Text>
                <View style={styles.sliderContainer}>
                  <input
                    type="range"
                    style={styles.slider}
                    min={1}
                    max={7}
                    step={1}
                    value={validity}
                    onChange={(e) => setValidity(parseInt(e.target.value))}
                  />
                  <Text style={styles.sliderValue}>{validity} {translation.time.days}</Text>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {translation.resident.multiUse}
                </Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => setMultiUse(true)}
                  >
                    <View style={[styles.radioCircle, multiUse && styles.radioSelected]} />
                    <Text style={styles.radioLabel}>{translation.common.yes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => setMultiUse(false)}
                  >
                    <View style={[styles.radioCircle, !multiUse && styles.radioSelected]} />
                    <Text style={styles.radioLabel}>{translation.common.no}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelButtonText}>
                    {translation.common.cancel}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>
                    {translation.common.submit}
                  </Text>
                </TouchableOpacity>
              </View>
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
  description: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.l,
  },
  friendsList: {
    flex: 1,
  },
  friendsContent: {
    paddingBottom: theme.spacing.m,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  friendApartment: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  quickInviteButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
    marginLeft: theme.spacing.m,
  },
  quickInviteText: {
    color: 'white',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
  },
  // Add Friend Button styles
  addFriendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  addFriendButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  // Modal styles
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
  selectedFriendContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  selectedFriendName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  selectedFriendApartment: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  formGroup: {
    marginBottom: theme.spacing.m,
  },
  formLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
  },
  formInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
  },
  radioLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    marginLeft: theme.spacing.s,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  sliderContainer: {
    paddingHorizontal: theme.spacing.s,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default FriendListDashboard; 