import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import { userService } from '../../utils/dataService';

const ResidentDisablerDashboard = () => {
  const { translation } = useLanguage();
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // State for selected residents
  const [selectedResidents, setSelectedResidents] = useState([]);
  
  // Handle search by residence
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    // In a real app, this would call an API
    // For demo, we'll search mock data for residents with matching residence
    const residents = userService.getUsersByType('resident');
    const filteredResidents = residents.filter(resident => 
      resident.residence.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredResidents);
  };
  
  // Toggle resident selection
  const toggleSelectResident = (resident) => {
    const isSelected = selectedResidents.some(r => r.id === resident.id);
    
    if (isSelected) {
      setSelectedResidents(selectedResidents.filter(r => r.id !== resident.id));
    } else {
      setSelectedResidents([...selectedResidents, resident]);
    }
  };
  
  // Handle downgrade residents to guests
  const handleDowngradeResidents = () => {
    if (selectedResidents.length === 0) {
      alert('Please select at least one resident to downgrade');
      return;
    }
    
    // In a real app, this would call an API to downgrade the residents
    // For demo, just show an alert with the selected residents
    const residentNames = selectedResidents.map(r => r.fullName).join(', ');
    alert(`The following residents would be downgraded to guests: ${residentNames}`);
    
    // Reset
    setSelectedResidents([]);
  };
  
  // Render resident item
  const renderResidentItem = ({ item }) => {
    const isSelected = selectedResidents.some(r => r.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.residentItem,
          isSelected && styles.selectedResidentItem
        ]}
        onPress={() => toggleSelectResident(item)}
      >
        <View style={styles.residentInfo}>
          <Text style={styles.residentName}>{item.fullName}</Text>
          <Text style={styles.residentDetails}>
            ID: {item.id} | {translation.security.searchByResidence}: {item.residence}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.unlinkButton}
            onPress={() => toggleSelectResident(item)}
          >
            <Text style={styles.unlinkButtonText}>{translation.admin.unlinkResidence}</Text>
          </TouchableOpacity>
          
          <View style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected
          ]} />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <BaseDashboard title={translation.admin.residentDisabler}>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          {translation.admin.disableAccounts}
        </Text>
        
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput}
              placeholder={translation.security.searchByResidence}
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
          
          <Text style={styles.searchTip}>
            {translation.admin.residentDisabler}: {translation.security.searchByResidence}
          </Text>
        </View>
        
        {searchResults.length > 0 ? (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {translation.status.active} {translation.security.searchByResidence}: {searchQuery}
              </Text>
              <Text style={styles.resultsCount}>
                {searchResults.length} {translation.resident.friendList}
              </Text>
            </View>
            
            <FlatList
              data={searchResults}
              renderItem={renderResidentItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false} // Parent ScrollView handles scrolling
              style={styles.resultsList}
            />
            
            {selectedResidents.length > 0 && (
              <View style={styles.actionsContainer}>
                <Text style={styles.selectedCount}>
                  {selectedResidents.length} {translation.resident.friendList} {translation.admin.downgradeToGuest}
                </Text>
                
                <TouchableOpacity 
                  style={styles.downgradeButton}
                  onPress={handleDowngradeResidents}
                >
                  <Text style={styles.buttonText}>
                    {translation.admin.downgradeToGuest}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : searchQuery.trim() !== '' && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {translation.common.residenceNotFound}
            </Text>
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
  searchSection: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
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
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.medium,
  },
  searchTip: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    fontStyle: 'italic',
  },
  resultsSection: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  resultsTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.bold,
  },
  resultsCount: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  resultsList: {
    marginBottom: theme.spacing.m,
  },
  residentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  selectedResidentItem: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: 4,
  },
  residentDetails: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlinkButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
    marginRight: theme.spacing.s,
  },
  unlinkButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.m,
  },
  selectedCount: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.m,
  },
  downgradeButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  noResultsContainer: {
    backgroundColor: theme.colors.surface + '80',
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  noResultsText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
  },
});

export default ResidentDisablerDashboard; 