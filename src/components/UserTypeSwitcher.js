import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { userService } from '../utils/dataService';
import theme from '../styles/theme';

const UserTypeSwitcher = ({ customButton }) => {
  const { switchUserType, currentUser } = useUser();
  const { translation } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  // Load users when component mounts
  useEffect(() => {
    // Get all users from different types and merge them
    const allUsers = userService.getAllUsers();
    const mergedUsers = [
      ...allUsers.residents,
      ...allUsers.guests,
      ...allUsers.security,
      ...allUsers.admin
    ];
    setDemoUsers(mergedUsers);
  }, []);

  const handleSelectUser = (user) => {
    switchUserType(user);
    setModalVisible(false);
  };

  const renderUserItem = ({ item }) => {
    const isCurrentUser = currentUser && currentUser.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.userItem, 
          isCurrentUser && styles.selectedUserItem
        ]}
        onPress={() => handleSelectUser(item)}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <Text style={styles.userType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            {item.type === 'resident' && ` (${item.residence})`}
          </Text>
        </View>
        
        {isCurrentUser && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      {customButton ? (
        <TouchableOpacity onPress={openModal}>
          {customButton}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={openModal}
        >
          <Text style={styles.floatingButtonText}>Switch User</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Demo User</Text>
            
            <FlatList
              data={demoUsers}
              renderItem={renderUserItem}
              keyExtractor={item => item.id.toString()}
              style={styles.userList}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{translation.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.3)',
  },
  floatingButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.roundness,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  userList: {
    marginBottom: theme.spacing.m,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedUserItem: {
    backgroundColor: theme.colors.primary + '20',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  userType: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
  closeButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.button,
  },
});

export default UserTypeSwitcher; 