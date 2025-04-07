import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import { vipInviteService } from '../../utils/dataService';

const VIPInviteManagerDashboard = () => {
  const { translation } = useLanguage();
  
  // State for VIP invites
  const [vipInvites, setVipInvites] = useState([]);
  
  // State for selected VIP invite
  const [selectedInvite, setSelectedInvite] = useState(null);
  
  // Load VIP invites on initial render
  useEffect(() => {
    const invites = vipInviteService.getAllVIPInvites();
    setVipInvites(invites);
  }, []);
  
  // Handle invite selection
  const handleSelectInvite = (invite) => {
    setSelectedInvite(invite);
  };
  
  // Handle disable invite
  const handleDisableInvite = (id) => {
    vipInviteService.disableVIPInvite(id);
    
    // Update local state
    setVipInvites(prevInvites => 
      prevInvites.map(invite => 
        invite.id === id 
          ? { ...invite, status: 'disabled' } 
          : invite
      )
    );
    
    // If this was the selected invite, update it
    if (selectedInvite && selectedInvite.id === id) {
      setSelectedInvite(prev => ({ ...prev, status: 'disabled' }));
    }
  };
  
  // Handle enable invite
  const handleEnableInvite = (id) => {
    vipInviteService.enableVIPInvite(id);
    
    // Update local state
    setVipInvites(prevInvites => 
      prevInvites.map(invite => 
        invite.id === id 
          ? { ...invite, status: 'active' } 
          : invite
      )
    );
    
    // If this was the selected invite, update it
    if (selectedInvite && selectedInvite.id === id) {
      setSelectedInvite(prev => ({ ...prev, status: 'active' }));
    }
  };
  
  // Handle delete invite
  const handleDeleteInvite = (id) => {
    // Confirm deletion
    Alert.alert(
      translation.admin.deleteInvite,
      translation.admin.deleteInvite + '?',
      [
        {
          text: translation.common.cancel,
          style: 'cancel',
        },
        {
          text: translation.common.delete,
          onPress: () => {
            vipInviteService.deleteVIPInvite(id);
            
            // Update local state
            setVipInvites(prevInvites => 
              prevInvites.filter(invite => invite.id !== id)
            );
            
            // If this was the selected invite, clear it
            if (selectedInvite && selectedInvite.id === id) {
              setSelectedInvite(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return translation.admin.indefiniteInvite;
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };
  
  // Render invite item
  const renderInviteItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.inviteItem,
        selectedInvite?.id === item.id && styles.selectedInviteItem,
        item.status === 'disabled' && styles.disabledInviteItem
      ]}
      onPress={() => handleSelectInvite(item)}
    >
      <View style={styles.inviteInfo}>
        <Text style={[
          styles.inviteName,
          item.status === 'disabled' && styles.disabledText
        ]}>
          {item.fullName}
        </Text>
        
        <Text style={styles.inviteDetails}>
          {translation.security.searchByInvite}: {item.code}
        </Text>
        
        <Text style={styles.inviteDetails}>
          {translation.time.checkInAt}: {formatDate(item.createdAt)}
        </Text>
        
        {item.expiresAt ? (
          <Text style={styles.inviteDetails}>
            {translation.guest.validUntil}: {formatDate(item.expiresAt)}
          </Text>
        ) : (
          <Text style={styles.inviteDetails}>
            {translation.admin.indefiniteInvite}
          </Text>
        )}
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === 'active' ? translation.status.active : translation.status.canceled}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <BaseDashboard title={translation.admin.vipInviteManager}>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {translation.admin.manageVIPInvites}
        </Text>
        
        <View style={styles.contentContainer}>
          {/* VIP Invites List */}
          <View style={styles.invitesContainer}>
            <Text style={styles.sectionTitle}>
              {translation.admin.vipInvite} ({vipInvites.length})
            </Text>
            
            {vipInvites.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {translation.common.no} {translation.admin.vipInvite}
                </Text>
              </View>
            ) : (
              <FlatList
                data={vipInvites}
                renderItem={renderInviteItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false} // Parent ScrollView handles scrolling
              />
            )}
          </View>
          
          {/* Selected Invite Details */}
          {selectedInvite && (
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>
                {translation.admin.vipInvite} {translation.admin.manageAccount}
              </Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.resident.selectGuest}:</Text>
                <Text style={styles.detailValue}>{selectedInvite.fullName}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.resident.enterEmail}:</Text>
                <Text style={styles.detailValue}>{selectedInvite.email}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.resident.enterPhone}:</Text>
                <Text style={styles.detailValue}>{selectedInvite.phone}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.security.searchByInvite}:</Text>
                <Text style={styles.detailValue}>{selectedInvite.code}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.time.checkInAt}:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedInvite.createdAt)}</Text>
              </View>
              
              {selectedInvite.expiresAt ? (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{translation.guest.validUntil}:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedInvite.expiresAt)}</Text>
                </View>
              ) : (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{translation.resident.inviteValidity}:</Text>
                  <Text style={styles.detailValue}>{translation.admin.indefiniteInvite}</Text>
                </View>
              )}
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{translation.resident.inviteStatus}:</Text>
                <Text style={[
                  styles.detailValue, 
                  selectedInvite.status === 'active' ? styles.activeStatus : styles.disabledStatus
                ]}>
                  {selectedInvite.status === 'active' ? translation.status.active : translation.status.canceled}
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                {selectedInvite.status === 'active' ? (
                  <TouchableOpacity 
                    style={styles.disableButton}
                    onPress={() => handleDisableInvite(selectedInvite.id)}
                  >
                    <Text style={styles.buttonText}>{translation.admin.disableInvite}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.enableButton}
                    onPress={() => handleEnableInvite(selectedInvite.id)}
                  >
                    <Text style={styles.buttonText}>{translation.admin.enableInvite}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteInvite(selectedInvite.id)}
                >
                  <Text style={styles.buttonText}>{translation.admin.deleteInvite}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  contentContainer: {
    flexDirection: 'column',
  },
  invitesContainer: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
  },
  emptyState: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
  },
  inviteItem: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  selectedInviteItem: {
    borderLeftColor: theme.colors.primary,
  },
  disabledInviteItem: {
    backgroundColor: theme.colors.background + '50',
    borderLeftColor: theme.colors.error,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  disabledText: {
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  inviteDetails: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    marginBottom: 2,
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary + '80',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.roundness,
  },
  statusText: {
    color: 'white',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  detailsContainer: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    width: '40%',
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    flex: 1,
  },
  activeStatus: {
    color: theme.colors.primary,
  },
  disabledStatus: {
    color: theme.colors.error,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.l,
  },
  disableButton: {
    backgroundColor: theme.colors.warning,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
  },
  enableButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
    flex: 1,
    marginRight: theme.spacing.s,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default VIPInviteManagerDashboard; 