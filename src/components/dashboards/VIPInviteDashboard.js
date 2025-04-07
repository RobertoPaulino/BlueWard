import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';

const VIPInviteDashboard = () => {
  const { translation } = useLanguage();
  
  // State for form data
  const [inviteData, setInviteData] = useState({
    fullName: '',
    email: '',
    phone: '',
    validDays: 30,  // Default for VIP is 30 days
    isIndefinite: false
  });
  
  // State for generated invite
  const [generatedInvite, setGeneratedInvite] = useState(null);
  
  // Handle text input changes
  const handleChange = (field, value) => {
    setInviteData({
      ...inviteData,
      [field]: value
    });
  };
  
  // Handle toggle for indefinite invite
  const toggleIndefinite = () => {
    setInviteData({
      ...inviteData,
      isIndefinite: !inviteData.isIndefinite
    });
  };
  
  // Generate a VIP invite
  const handleGenerateInvite = () => {
    // In a real app, this would call an API
    // For demo purposes, we'll just generate a mock invite
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const qrValue = `VIPINVITE-${inviteCode}-${Date.now()}`;
    
    setGeneratedInvite({
      code: inviteCode,
      qrValue: qrValue,
      createdAt: new Date().toISOString(),
      expiresAt: inviteData.isIndefinite ? null : new Date(Date.now() + (inviteData.validDays * 86400000)).toISOString()
    });
  };
  
  // Reset the form
  const handleReset = () => {
    setInviteData({
      fullName: '',
      email: '',
      phone: '',
      validDays: 30,
      isIndefinite: false
    });
    
    setGeneratedInvite(null);
  };
  
  // Mock for sharing via email
  const handleShareEmail = () => {
    console.log('Sharing invite via email to:', inviteData.email);
    // In a real app, this would send an email
    alert(`Email would be sent to ${inviteData.email}`);
  };
  
  // Mock for sharing via SMS
  const handleShareSMS = () => {
    console.log('Sharing invite via SMS to:', inviteData.phone);
    // In a real app, this would send an SMS
    alert(`SMS would be sent to ${inviteData.phone}`);
  };
  
  return (
    <BaseDashboard title={translation.admin.vipInvite}>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {translation.admin.createVIPInvites}
        </Text>
        
        {/* Invite Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{translation.admin.indefiniteInvite}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translation.resident.selectGuest}</Text>
            <TextInput 
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.placeholder}
              value={inviteData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translation.resident.enterEmail}</Text>
            <TextInput 
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.placeholder}
              value={inviteData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{translation.resident.enterPhone}</Text>
            <TextInput 
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={theme.colors.placeholder}
              value={inviteData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={toggleIndefinite}
            >
              <View style={[styles.checkbox, inviteData.isIndefinite && styles.checkboxSelected]} />
              <Text style={styles.checkboxLabel}>{translation.admin.indefiniteInvite}</Text>
            </TouchableOpacity>
          </View>
          
          {!inviteData.isIndefinite && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.admin.customValidity}</Text>
              <TextInput 
                style={styles.input}
                placeholder="Days"
                placeholderTextColor={theme.colors.placeholder}
                value={inviteData.validDays.toString()}
                onChangeText={(text) => handleChange('validDays', parseInt(text) || 0)}
                keyboardType="numeric"
              />
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateInvite}
          >
            <Text style={styles.buttonText}>{translation.admin.generateCode}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Generated Invite Section */}
        {generatedInvite && (
          <View style={styles.inviteResultSection}>
            <Text style={styles.sectionTitle}>{translation.security.invites} {translation.status.active}</Text>
            
            <View style={styles.qrContainer}>
              {/* This would be a real QR code in production */}
              <View style={styles.qrCode}>
                <Text style={styles.qrPlaceholder}>QR Code</Text>
                <Text style={styles.qrPlaceholderSub}>{generatedInvite.code}</Text>
              </View>
            </View>
            
            <View style={styles.inviteDetails}>
              <Text style={styles.inviteCode}>
                {translation.security.searchByInvite}: {generatedInvite.code}
              </Text>
              
              <Text style={styles.inviteDate}>
                {translation.time.checkInAt}: {new Date(generatedInvite.createdAt).toLocaleString()}
              </Text>
              
              {generatedInvite.expiresAt ? (
                <Text style={styles.inviteDate}>
                  {translation.guest.validUntil}: {new Date(generatedInvite.expiresAt).toLocaleString()}
                </Text>
              ) : (
                <Text style={styles.inviteIndefinite}>
                  {translation.admin.indefiniteInvite}
                </Text>
              )}
            </View>
            
            <View style={styles.shareButtons}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShareEmail}
                disabled={!inviteData.email}
              >
                <Text style={styles.shareButtonText}>{translation.resident.enterEmail}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShareSMS}
                disabled={!inviteData.phone}
              >
                <Text style={styles.shareButtonText}>{translation.resident.enterPhone}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>{translation.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  formSection: {
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
  formGroup: {
    marginBottom: theme.spacing.m,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.s,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
  },
  checkboxLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  inviteResultSection: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  qrCode: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qrPlaceholder: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrPlaceholderSub: {
    fontSize: 14,
    marginTop: 8,
  },
  inviteDetails: {
    marginBottom: theme.spacing.m,
  },
  inviteCode: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  inviteDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    marginBottom: 4,
  },
  inviteIndefinite: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  shareButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
  resetButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default VIPInviteDashboard; 