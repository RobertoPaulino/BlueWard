import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import { userService } from '../../utils/dataService';

const GuardAccountOverviewDashboard = () => {
  const { translation } = useLanguage();
  
  // States for different tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'create', or 'manage'
  
  // State for guard accounts
  const [guardAccounts, setGuardAccounts] = useState([]);
  
  // State for new guard form
  const [newGuardData, setNewGuardData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    areaAssignment: '',
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({});
  
  // State for selected guard to manage
  const [selectedGuard, setSelectedGuard] = useState(null);
  
  // Load guard accounts
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo, we'll use mock data
    const guards = userService.getUsersByType('security');
    
    // Add a few more mock guards for demo purposes
    const mockGuards = [...guards];
    
    if (mockGuards.length < 3) {
      mockGuards.push(
        {
          id: 9,
          username: 'guard_entry',
          fullName: 'James Guard',
          type: 'security',
          email: 'james@example.com',
          phone: '555-1234',
          areaAssignment: 'Main Entry',
          active: true
        },
        {
          id: 10,
          username: 'guard_parking',
          fullName: 'Sarah Security',
          type: 'security',
          email: 'sarah@example.com',
          phone: '555-5678',
          areaAssignment: 'Parking Area',
          active: true
        }
      );
    }
    
    setGuardAccounts(mockGuards);
  }, []);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewGuardData({
      ...newGuardData,
      [field]: value
    });
    
    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newGuardData.username.trim()) errors.username = 'Username is required';
    if (!newGuardData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!newGuardData.password) errors.password = 'Password is required';
    if (newGuardData.password !== newGuardData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Create new guard account
  const handleCreateGuard = () => {
    if (!validateForm()) return;
    
    // In a real app, this would call an API to create the account
    // For demo, we'll add to our local state
    const newGuard = {
      id: Date.now(),
      username: newGuardData.username,
      fullName: newGuardData.fullName,
      type: 'security',
      email: newGuardData.email,
      phone: newGuardData.phone,
      areaAssignment: newGuardData.areaAssignment,
      active: true
    };
    
    setGuardAccounts([...guardAccounts, newGuard]);
    
    // Reset form
    setNewGuardData({
      username: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      areaAssignment: '',
    });
    
    // Show confirmation and switch to overview tab
    alert(`Guard account created for ${newGuard.fullName}`);
    setActiveTab('overview');
  };
  
  // Select a guard to manage
  const handleSelectGuard = (guard) => {
    setSelectedGuard(guard);
    setActiveTab('manage');
  };
  
  // Toggle guard active status
  const handleToggleActive = () => {
    if (!selectedGuard) return;
    
    // Update the guard's active status
    const updatedGuards = guardAccounts.map(guard => {
      if (guard.id === selectedGuard.id) {
        return {
          ...guard,
          active: !guard.active
        };
      }
      return guard;
    });
    
    // Update selected guard
    const updatedGuard = updatedGuards.find(guard => guard.id === selectedGuard.id);
    setSelectedGuard(updatedGuard);
    setGuardAccounts(updatedGuards);
    
    // Show confirmation
    alert(`Guard account for ${selectedGuard.fullName} has been ${updatedGuard.active ? 'enabled' : 'disabled'}`);
  };
  
  // Render guard item
  const renderGuardItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.guardItem}
      onPress={() => handleSelectGuard(item)}
    >
      <View style={styles.guardInfo}>
        <Text style={styles.guardName}>{item.fullName}</Text>
        <Text style={styles.guardDetails}>
          {item.username} | {item.areaAssignment || 'No assignment'}
        </Text>
      </View>
      <View style={[
        styles.statusIndicator,
        item.active ? styles.statusActive : styles.statusInactive
      ]} />
    </TouchableOpacity>
  );
  
  return (
    <BaseDashboard title={translation.admin.guardAccountManagement}>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {translation.admin.manageGuards}
        </Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'overview' && styles.activeTab
            ]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'overview' && styles.activeTabText
            ]}>
              {translation.security.guards || 'Guards'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'create' && styles.activeTab
            ]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'create' && styles.activeTabText
            ]}>
              {translation.admin.createGuardAccount}
            </Text>
          </TouchableOpacity>
          
          {selectedGuard && (
            <TouchableOpacity 
              style={[
                styles.tabButton,
                activeTab === 'manage' && styles.activeTab
              ]}
              onPress={() => setActiveTab('manage')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'manage' && styles.activeTabText
              ]}>
                {translation.admin.manageAccount || 'Manage Account'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              {translation.security.guards || 'Security Guards'}
            </Text>
            
            {guardAccounts.length > 0 ? (
              <FlatList
                data={guardAccounts}
                renderItem={renderGuardItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false} // Parent ScrollView handles scrolling
                style={styles.guardsList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {translation.common.no} {translation.security.guards || 'guards'} {translation.status.active}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setActiveTab('create')}
            >
              <Text style={styles.buttonText}>
                {translation.admin.createGuardAccount}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Create Tab */}
        {activeTab === 'create' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              {translation.admin.createGuardAccount}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.auth.username}</Text>
              <TextInput 
                style={[
                  styles.input,
                  formErrors.username && styles.inputError
                ]}
                placeholder="guard_username"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.username}
                onChangeText={(text) => handleInputChange('username', text)}
              />
              {formErrors.username && (
                <Text style={styles.errorText}>{formErrors.username}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.auth.fullName || 'Full Name'}</Text>
              <TextInput 
                style={[
                  styles.input,
                  formErrors.fullName && styles.inputError
                ]}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
              />
              {formErrors.fullName && (
                <Text style={styles.errorText}>{formErrors.fullName}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.resident.enterEmail}</Text>
              <TextInput 
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.resident.enterPhone}</Text>
              <TextInput 
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.auth.areaAssignment || 'Area Assignment'}</Text>
              <TextInput 
                style={styles.input}
                placeholder="Main Gate, Parking, etc."
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.areaAssignment}
                onChangeText={(text) => handleInputChange('areaAssignment', text)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.auth.password}</Text>
              <TextInput 
                style={[
                  styles.input,
                  formErrors.password && styles.inputError
                ]}
                placeholder="Password"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
              />
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.auth.confirmPassword || 'Confirm Password'}</Text>
              <TextInput 
                style={[
                  styles.input,
                  formErrors.confirmPassword && styles.inputError
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.placeholder}
                value={newGuardData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry
              />
              {formErrors.confirmPassword && (
                <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setActiveTab('overview')}
              >
                <Text style={styles.cancelButtonText}>{translation.common.cancel}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateGuard}
              >
                <Text style={styles.buttonText}>{translation.common.submit}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Manage Tab */}
        {activeTab === 'manage' && selectedGuard && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              {translation.admin.manageAccount || 'Manage Account'}
            </Text>
            
            <View style={styles.guardDetailsCard}>
              <View style={styles.guardHeader}>
                <Text style={styles.guardDetailName}>{selectedGuard.fullName}</Text>
                <View style={[
                  styles.statusBadge,
                  selectedGuard.active ? styles.statusActiveBadge : styles.statusInactiveBadge
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {selectedGuard.active ? 
                      (translation.status.active) : 
                      (translation.status.inactive || 'Inactive')
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{translation.auth.username}:</Text>
                  <Text style={styles.detailValue}>{selectedGuard.username}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{translation.resident.enterEmail}:</Text>
                  <Text style={styles.detailValue}>{selectedGuard.email || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{translation.resident.enterPhone}:</Text>
                  <Text style={styles.detailValue}>{selectedGuard.phone || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{translation.auth.areaAssignment || 'Area Assignment'}:</Text>
                  <Text style={styles.detailValue}>{selectedGuard.areaAssignment || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{selectedGuard.id}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.toggleButton,
                  selectedGuard.active ? styles.disableButton : styles.enableButton
                ]}
                onPress={handleToggleActive}
              >
                <Text style={styles.buttonText}>
                  {selectedGuard.active ? 
                    (translation.admin.disableAccount || 'Disable Account') : 
                    (translation.admin.enableAccount || 'Enable Account')
                  }
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetPasswordButton}
              >
                <Text style={styles.buttonText}>
                  {translation.auth.resetPassword || 'Reset Password'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setActiveTab('overview')}
              >
                <Text style={styles.backButtonText}>
                  {translation.common.back}
                </Text>
              </TouchableOpacity>
            </View>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  guardsList: {
    marginBottom: theme.spacing.m,
  },
  guardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  guardInfo: {
    flex: 1,
  },
  guardName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  guardDetails: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: theme.spacing.s,
  },
  statusActive: {
    backgroundColor: theme.colors.success,
  },
  statusInactive: {
    backgroundColor: theme.colors.error,
  },
  emptyState: {
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
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
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.s,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  guardDetailsCard: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  guardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.m,
  },
  guardDetailName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActiveBadge: {
    backgroundColor: theme.colors.success + '30',
  },
  statusInactiveBadge: {
    backgroundColor: theme.colors.error + '30',
  },
  statusBadgeText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  detailsContainer: {
    marginBottom: theme.spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    width: '40%',
    fontSize: theme.typography.sizes.body,
  },
  detailValue: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.sizes.body,
  },
  toggleButton: {
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  disableButton: {
    backgroundColor: theme.colors.error,
  },
  enableButton: {
    backgroundColor: theme.colors.success,
  },
  resetPasswordButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default GuardAccountOverviewDashboard; 