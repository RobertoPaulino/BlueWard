import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image, TextInput } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { inviteService, userService } from '../../utils/dataService';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import mockID from '../../assets/images/mockID.png';

const InvitesDashboard = () => {
  const { translation } = useLanguage();
  const { userType, currentUser } = useUser();
  const [invites, setInvites] = useState([]);
  const [idModalVisible, setIdModalVisible] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  
  // State for create invite modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [contactType, setContactType] = useState('email'); // 'email' or 'phone'
  const [validity, setValidity] = useState(3);
  const [multiUse, setMultiUse] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;
    
    let invitesToShow = [];
    
    if (userType === 'resident') {
      // Residents see invites they created
      invitesToShow = inviteService.getInvitesByCreator(currentUser.id);
    } else if (userType === 'guest') {
      // Guests see invites made for them
      invitesToShow = inviteService.getInvitesForGuest(currentUser.id);
    } else if (userType === 'security' || userType === 'admin') {
      // Security and admin see all invites
      invitesToShow = inviteService.getAllInvites();
    }
    
    // Enhance invite data with guest names
    const enhancedInvites = invitesToShow.map(invite => {
      const guest = userService.findUserById(invite.guestId);
      return {
        ...invite,
        id: invite.id.toString(),
        guestName: guest ? guest.fullName : `${translation.guest.guest} #${invite.guestId}`,
        date: new Date(invite.createdAt).toLocaleDateString(),
        usage: invite.usageCount,
        checkedIn: invite.checkedIn || false,
      };
    });
    
    setInvites(enhancedInvites);
  }, [currentUser, userType, translation]);
  
  const handleViewID = (invite) => {
    setSelectedInvite(invite);
    setIdModalVisible(true);
  };
  
  const handleCheckIn = (id) => {
    setInvites(currentInvites => 
      currentInvites.map(invite => 
        invite.id === id 
          ? { ...invite, checkedIn: true } 
          : invite
      )
    );
  };
  
  const handleCheckOut = (id) => {
    // For security/admin, remove the invite from the list after checkout
    if (userType === 'security' || userType === 'admin') {
      setInvites(currentInvites => 
        currentInvites.filter(invite => invite.id !== id)
      );
    } else {
      // For other users, just update the status to checked out
      setInvites(currentInvites => 
        currentInvites.map(invite => 
          invite.id === id 
            ? { ...invite, checkedIn: false, status: 'used' } 
            : invite
        )
      );
    }
  };
  
  // Open create invite modal
  const handleCreateInvite = () => {
    setCreateModalVisible(true);
  };
  
  // Close create invite modal
  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
    // Reset form
    setGuestName('');
    setGuestContact('');
    setContactType('email');
    setValidity(3);
    setMultiUse(true);
  };
  
  // Handle submit create invite
  const handleSubmitInvite = () => {
    // Here you would create the invite and send it
    console.log('Creating invite for:', guestName);
    console.log('Contact:', guestContact, 'via', contactType);
    console.log('Validity:', validity, 'days');
    console.log('Multi-use:', multiUse);
    
    handleCloseCreateModal();
  };
  
  const renderInviteItem = ({ item }) => (
    <View style={styles.inviteItem}>
      <View style={styles.inviteHeader}>
        <Text style={styles.inviteCode}>{item.code}</Text>
        <View style={[
          styles.statusIndicator,
          item.status === 'active' ? styles.statusActive :
          item.status === 'expired' ? styles.statusExpired :
          styles.statusCanceled
        ]} />
      </View>
      
      <Text style={styles.guestName}>{item.guestName}</Text>
      
      <View style={styles.inviteDetails}>
        <Text style={styles.detailText}>
          {translation.status[item.status]}
        </Text>
        <Text style={styles.detailText}>
          {translation.time.checkInAt}: {item.date}
        </Text>
        <Text style={styles.detailText}>
          {translation.guest.usageCount}: {item.usage}
        </Text>
        {item.multiUse && (
          <Text style={styles.detailText}>
            {translation.resident.multiUse}: {translation.common.yes}
          </Text>
        )}
        {item.expiresAt && (
          <Text style={styles.detailText}>
            {translation.guest.validUntil}: {new Date(item.expiresAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        {userType === 'security' && (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              item.checkedIn ? styles.checkOutButton : styles.checkInButton
            ]}
            onPress={() => item.checkedIn ? handleCheckOut(item.id) : handleCheckIn(item.id)}
          >
            <Text style={styles.actionButtonText}>
              {item.checkedIn ? 
                translation.security.checkOutGuest : 
                translation.security.checkInGuest}
            </Text>
          </TouchableOpacity>
        )}
        
        {userType !== 'security' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {translation.common.confirm}
            </Text>
          </TouchableOpacity>
        )}
        
        {userType === 'security' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.idButton]}
            onPress={() => handleViewID(item)}
          >
            <Text style={styles.actionButtonText}>
              {translation.security.viewID}
            </Text>
          </TouchableOpacity>
        )}
        
        {userType !== 'security' && item.status === 'active' && (
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Text style={styles.actionButtonText}>
              {translation.common.cancel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  return (
    <BaseDashboard title={
      userType === 'security' ? 
        translation.security.invites : 
        (userType === 'resident' ? translation.resident.invites : translation.guest.invites)
    }>
      <View style={styles.container}>
        <Text style={styles.description}>
          {userType === 'security' ? 
            translation.security.searchViewInvites : 
            (userType === 'resident' ? translation.resident.manageInvites : translation.guest.viewInvites)}
        </Text>
        
        {invites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {translation.common.no} {userType === 'resident' ? translation.resident.invites : translation.guest.invites}
            </Text>
          </View>
        ) : (
          <FlatList
            data={invites}
            renderItem={renderInviteItem}
            keyExtractor={item => item.id}
            style={styles.invitesList}
            contentContainerStyle={styles.invitesContent}
            scrollEventThrottle={16}
            onTouchStart={(e) => {
              e.persist();
              e.preventDefault();
            }}
            onTouchMove={(e) => {
              e.persist();
              e.preventDefault();
            }}
            onScroll={(e) => {
              e.persist();
              e.preventDefault();
            }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={true}
          />
        )}
        
        {userType !== 'security' && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateInvite}
          >
            <Text style={styles.createButtonText}>
              {translation.resident.createInvite}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* ID Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={idModalVisible}
        onRequestClose={() => setIdModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {translation.security.guestID}
              {selectedInvite && ` - ${selectedInvite.guestName}`}
            </Text>
            
            <View style={styles.idImageContainer}>
              <Image source={mockID} style={styles.idImage} resizeMode="contain" />
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIdModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{translation.security.closeID}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Create Invite Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={handleCloseCreateModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.createModalContent}>
            <Text style={styles.modalTitle}>
              {translation.resident.createInvite}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translation.guest.name}
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder={translation.guest.guestName}
                placeholderTextColor={theme.colors.placeholder}
                value={guestName}
                onChangeText={setGuestName}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translation.common.contactType}
              </Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setContactType('email')}
                >
                  <View style={[styles.radioCircle, contactType === 'email' && styles.radioSelected]} />
                  <Text style={styles.radioLabel}>{translation.common.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setContactType('phone')}
                >
                  <View style={[styles.radioCircle, contactType === 'phone' && styles.radioSelected]} />
                  <Text style={styles.radioLabel}>{translation.common.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {contactType === 'email' ? translation.common.email : translation.common.phone}
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder={contactType === 'email' ? 'email@example.com' : '+1 234 567 8900'}
                placeholderTextColor={theme.colors.placeholder}
                value={guestContact}
                onChangeText={setGuestContact}
                keyboardType={contactType === 'email' ? 'email-address' : 'phone-pad'}
              />
            </View>
            
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
                style={styles.modalCancelButton}
                onPress={handleCloseCreateModal}
              >
                <Text style={styles.cancelButtonText}>
                  {translation.common.cancel}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitInvite}
              >
                <Text style={styles.submitButtonText}>
                  {translation.common.submit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </BaseDashboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginBottom: theme.spacing.m,
  },
  invitesList: {
    flex: 1,
    width: '100%',
    height: '100%',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: '-ms-autohiding-scrollbar',
  },
  invitesContent: {
    paddingBottom: theme.spacing.m,
    minHeight: '100%',
  },
  inviteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  inviteCode: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusExpired: {
    backgroundColor: '#9E9E9E',
  },
  statusCanceled: {
    backgroundColor: '#F44336',
  },
  guestName: {
    color: 'white',
    fontSize: 16,
    marginBottom: theme.spacing.s,
  },
  inviteDetails: {
    marginBottom: theme.spacing.m,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.s,
  },
  cancelButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  idButton: {
    backgroundColor: '#FF9800',
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
  },
  checkOutButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  createButtonText: {
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
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  idImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  idImage: {
    width: '100%',
    height: 250, 
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Form styles
  formGroup: {
    marginBottom: theme.spacing.m,
    width: '100%',
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
  createModalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    width: '90%',
    maxWidth: 400,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
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
    justifyContent: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  submitButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default InvitesDashboard; 
