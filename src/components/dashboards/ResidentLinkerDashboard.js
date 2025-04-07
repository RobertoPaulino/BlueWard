import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import { userService } from '../../utils/dataService';

const ResidentLinkerDashboard = () => {
  const { translation } = useLanguage();
  
  // States for the different tabs
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'search'
  
  // State for create code form
  const [createData, setCreateData] = useState({
    residence: '',
  });
  
  // State for generated code
  const [generatedCode, setGeneratedCode] = useState(null);
  
  // State for search form
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // State for selected user to link
  const [selectedUser, setSelectedUser] = useState(null);
  const [residenceToLink, setResidenceToLink] = useState('');
  
  // Handle form input changes for create
  const handleCreateChange = (field, value) => {
    setCreateData({
      ...createData,
      [field]: value
    });
  };
  
  // Format code with hyphens (XXXX-XXXX-XXXX-XXXX)
  const formatCode = (text) => {
    // Remove all non-alphanumeric characters
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '');
    
    // Limit to 16 characters
    const trimmed = cleaned.substring(0, 16);
    
    // Add hyphens after every 4 characters
    let formatted = '';
    for (let i = 0; i < trimmed.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += trimmed[i];
    }
    
    return formatted;
  };
  
  // Generate a 16-digit linking code
  const handleGenerateCode = () => {
    if (!createData.residence) {
      alert('Please enter residence number');
      return;
    }
    
    // In a real app, this would call an API
    // For demo purposes, we'll generate a random code
    let code = '';
    for (let i = 0; i < 16; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    
    const formattedCode = formatCode(code);
    
    setGeneratedCode({
      code: formattedCode,
      residence: createData.residence,
      createdAt: new Date().toISOString(),
    });
  };
  
  // Search for users by ID or name
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    // In a real app, this would call an API
    // For demo, we'll search the mock users
    const allUsers = [
      ...userService.getUsersByType('resident'),
      ...userService.getUsersByType('guest')
    ];
    
    const results = allUsers.filter(user => 
      user.id.toString().includes(searchQuery) || 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  // Select a user to link
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setResidenceToLink('');
  };
  
  // Link selected user to residence
  const handleLinkUser = () => {
    if (!selectedUser || !residenceToLink) {
      alert('Please select a user and enter a residence number');
      return;
    }
    
    // In a real app, this would call an API to update the user's residence
    // For demo, we'll just show an alert
    alert(`User ${selectedUser.fullName} (ID: ${selectedUser.id}) would be linked to residence ${residenceToLink}`);
    
    // Reset
    setSelectedUser(null);
    setResidenceToLink('');
    setSearchResults([]);
    setSearchQuery('');
  };
  
  // Reset the form
  const handleReset = () => {
    setCreateData({
      residence: '',
    });
    setGeneratedCode(null);
  };
  
  // Render user item
  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.userItem,
        selectedUser?.id === item.id && styles.selectedUserItem
      ]}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userType}>
          ID: {item.id} | Type: {item.type}
          {item.type === 'resident' && ` | Residence: ${item.residence}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <BaseDashboard title={translation.admin.residentLinker}>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {translation.admin.linkGuests}
        </Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
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
              {translation.admin.createLinkCode}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'search' && styles.activeTab
            ]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'search' && styles.activeTabText
            ]}>
              {translation.admin.linkResidence}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Create Code Tab */}
        {activeTab === 'create' && (
          <View style={styles.tabContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{translation.security.searchByResidence}</Text>
              <TextInput 
                style={styles.input}
                placeholder="Residence Number (e.g. A101)"
                placeholderTextColor={theme.colors.placeholder}
                value={createData.residence}
                onChangeText={(text) => handleCreateChange('residence', text)}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateCode}
            >
              <Text style={styles.buttonText}>{translation.admin.generateCode}</Text>
            </TouchableOpacity>
            
            {generatedCode && (
              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>{translation.admin.createLinkCode}</Text>
                
                <View style={styles.qrContainer}>
                  {/* This would be a real QR code in production */}
                  <View style={styles.qrCode}>
                    <Text style={styles.qrPlaceholder}>QR Code</Text>
                    <Text style={styles.qrPlaceholderSub}>{generatedCode.residence}</Text>
                  </View>
                </View>
                
                <View style={styles.codeDetails}>
                  <Text style={styles.codeLabel}>{translation.guest.enterCode}:</Text>
                  <Text style={styles.code}>{generatedCode.code}</Text>
                  
                  <View style={styles.sendOptionsContainer}>
                    <TouchableOpacity style={styles.sendButton}>
                      <Text style={styles.sendButtonText}>{translation.resident.sendViaEmail}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.sendButton}>
                      <Text style={styles.sendButtonText}>{translation.resident.sendViaPhone}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles.buttonText}>{translation.common.back}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* Search and Link Tab */}
        {activeTab === 'search' && (
          <View style={styles.tabContent}>
            <View style={styles.searchContainer}>
              <TextInput 
                style={styles.searchInput}
                placeholder={`${translation.security.searchByName} ${translation.common.or} ID`}
                placeholderTextColor={theme.colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>{translation.common.search}</Text>
              </TouchableOpacity>
            </View>
            
            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>{translation.common.search} {translation.status.active}</Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderUserItem}
                  keyExtractor={item => item.id.toString()}
                  style={styles.resultsList}
                  scrollEnabled={false} // Parent ScrollView handles scrolling
                />
              </View>
            )}
            
            {selectedUser && (
              <View style={styles.linkContainer}>
                <Text style={styles.linkTitle}>{translation.admin.linkResidence}</Text>
                <Text style={styles.selectedUserName}>
                  {selectedUser.fullName} (ID: {selectedUser.id})
                </Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{translation.security.searchByResidence}</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Residence Number (e.g. A101)"
                    placeholderTextColor={theme.colors.placeholder}
                    value={residenceToLink}
                    onChangeText={setResidenceToLink}
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={handleLinkUser}
                >
                  <Text style={styles.buttonText}>{translation.admin.linkResidence}</Text>
                </TouchableOpacity>
              </View>
            )}
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
  generateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  resultSection: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
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
  codeDetails: {
    marginBottom: theme.spacing.m,
  },
  codeLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
  },
  code: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sendOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.roundness,
    alignItems: 'center',
    margin: theme.spacing.s,
    flex: 1,
  },
  sendButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
    marginRight: theme.spacing.s,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    marginBottom: theme.spacing.m,
  },
  resultsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.s,
  },
  resultsList: {
    maxHeight: 200,
  },
  userItem: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  selectedUserItem: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  userType: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  linkContainer: {
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  linkTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: theme.spacing.s,
  },
  selectedUserName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.m,
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
});

export default ResidentLinkerDashboard; 