import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Switch,
  Slider,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import theme from '../../styles/theme';
import { mockInvites } from '../../utils/mockData';

const InvitesScreen = () => {
  const { translation } = useLanguage();
  const { currentUser } = useUser();
  
  const [invites, setInvites] = useState(mockInvites.filter(invite => invite.createdBy === currentUser?.id));
  const [modalVisible, setModalVisible] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [inviteData, setInviteData] = useState({
    validDays: 1,
    multiUse: true,
    guestId: null,
    guestEmail: '',
    guestPhone: '',
  });

  // Function to cancel an invite
  const cancelInvite = (inviteId) => {
    setInvites(invites.map(invite => 
      invite.id === inviteId 
        ? { ...invite, status: 'canceled' } 
        : invite
    ));
  };

  // Function to create a new invite
  const createInvite = () => {
    const newInvite = {
      id: Math.max(...invites.map(i => i.id)) + 1,
      createdBy: currentUser.id,
      guestId: inviteData.guestId,
      validDays: inviteData.validDays,
      multiUse: inviteData.multiUse,
      code: `${currentUser.username.substring(0, 2).toUpperCase()}${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + inviteData.validDays * 86400000).toISOString(),
      usageCount: 0,
    };
    
    setInvites([...invites, newInvite]);
    setModalVisible(false);
    setCreateStep(1);
    setInviteData({
      validDays: 1,
      multiUse: true,
      guestId: null,
      guestEmail: '',
      guestPhone: '',
    });
  };

  // Render invite item
  const renderInviteItem = ({ item }) => (
    <View style={styles.inviteItem}>
      <View style={styles.inviteItemHeader}>
        <Text style={styles.inviteCode}>{item.code}</Text>
        <Text style={[
          styles.inviteStatus, 
          item.status === 'active' ? styles.statusActive : 
          item.status === 'canceled' ? styles.statusCanceled : 
          styles.statusExpired
        ]}>
          {translation.status[item.status]}
        </Text>
      </View>
      
      <View style={styles.inviteDetails}>
        <Text style={styles.inviteDetail}>
          {translation.resident.inviteValidity}: {item.validDays} {item.validDays === 1 ? translation.common.day : translation.common.days}
        </Text>
        <Text style={styles.inviteDetail}>
          {translation.resident.multiUse}: {item.multiUse ? translation.common.yes : translation.common.no}
        </Text>
        <Text style={styles.inviteDetail}>
          {translation.resident.inviteUsage}: {item.usageCount}
        </Text>
      </View>
      
      {item.status === 'active' && (
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => cancelInvite(item.id)}
        >
          <Text style={styles.cancelButtonText}>
            {translation.resident.cancelInvite}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Create invite modal content
  const renderModalContent = () => {
    // Step 1: Select validity and usage
    if (createStep === 1) {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translation.resident.inviteValidity}</Text>
          
          <Text style={styles.sliderValue}>
            {inviteData.validDays} {inviteData.validDays === 1 ? translation.common.day : translation.common.days}
          </Text>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={14}
            step={1}
            value={inviteData.validDays}
            onValueChange={(value) => setInviteData({...inviteData, validDays: value})}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {inviteData.multiUse ? translation.resident.multiUse : translation.resident.singleUse}
            </Text>
            <Switch
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={inviteData.multiUse ? theme.colors.primary : theme.colors.disabled}
              onValueChange={() => setInviteData({...inviteData, multiUse: !inviteData.multiUse})}
              value={inviteData.multiUse}
            />
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalSecondaryButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalSecondaryButtonText}>{translation.common.cancel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalPrimaryButton}
              onPress={() => setCreateStep(2)}
            >
              <Text style={styles.modalPrimaryButtonText}>{translation.common.next}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    // Step 2: Select guest or enter contact
    if (createStep === 2) {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translation.resident.selectGuest}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translation.resident.enterEmail}</Text>
            <TextInput
              style={styles.textInput}
              value={inviteData.guestEmail}
              onChangeText={(text) => setInviteData({...inviteData, guestEmail: text})}
              placeholder="email@example.com"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{translation.resident.enterPhone}</Text>
            <TextInput
              style={styles.textInput}
              value={inviteData.guestPhone}
              onChangeText={(text) => setInviteData({...inviteData, guestPhone: text})}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.colors.placeholder}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalSecondaryButton}
              onPress={() => setCreateStep(1)}
            >
              <Text style={styles.modalSecondaryButtonText}>{translation.common.back}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalPrimaryButton}
              onPress={createInvite}
            >
              <Text style={styles.modalPrimaryButtonText}>{translation.common.submit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{translation.resident.invites}</Text>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>
          {translation.resident.createInvite}
        </Text>
      </TouchableOpacity>
      
      <FlatList
        data={invites}
        renderItem={renderInviteItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No invites found</Text>
        }
      />
      
      {/* Create Invite Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>{translation.resident.newInvite}</Text>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  screenTitle: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  createButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
  listContent: {
    paddingBottom: theme.spacing.l,
  },
  inviteItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  inviteItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  inviteCode: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  inviteStatus: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.roundness / 2,
  },
  statusActive: {
    backgroundColor: theme.colors.success + '30',
    color: theme.colors.success,
  },
  statusCanceled: {
    backgroundColor: theme.colors.error + '30',
    color: theme.colors.error,
  },
  statusExpired: {
    backgroundColor: theme.colors.warning + '30',
    color: theme.colors.warning,
  },
  inviteDetails: {
    marginVertical: theme.spacing.s,
  },
  inviteDetail: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.error + '20',
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    marginTop: theme.spacing.xl,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backdrop,
  },
  modalView: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    padding: theme.spacing.m,
    textAlign: 'center',
  },
  modalContent: {
    padding: theme.spacing.l,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  sliderValue: {
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing.l,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  switchLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  modalPrimaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    flex: 1,
    marginLeft: theme.spacing.s,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  modalSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.button,
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
  },
});

export default InvitesScreen; 