import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';
import mockID from '../../assets/images/mockID.png';

// Mock data for invites
const mockInvites = [
  { id: '1', code: 'INV7824', guestName: 'John Smith', residence: 'A-101', status: 'active', date: '2023-12-15', usageLimit: 1, usageCount: 0, isVIP: false, checkedIn: false },
  { id: '2', code: 'INV5431', guestName: 'Maria Lopez', residence: 'B-205', status: 'active', date: '2023-12-14', usageLimit: 3, usageCount: 1, isVIP: false, checkedIn: true },
  { id: '3', code: 'INV9012', guestName: 'David Chen', residence: 'C-310', status: 'expired', date: '2023-12-10', usageLimit: 2, usageCount: 2, isVIP: false, checkedIn: false },
  { id: '4', code: 'INV6543', guestName: 'Sarah Johnson', residence: 'A-102', status: 'active', date: '2023-12-16', usageLimit: 1, usageCount: 0, isVIP: false, checkedIn: false },
  { id: '5', code: 'INV2341', guestName: 'James Wilson', residence: 'B-208', status: 'expired', date: '2023-12-09', usageLimit: 5, usageCount: 2, isVIP: false, checkedIn: false },
  { id: '6', code: 'VIP7895', guestName: 'Emma Brown', residence: 'C-315', status: 'active', date: '2023-12-15', usageLimit: -1, usageCount: 4, isVIP: true, checkedIn: true },
  { id: '7', code: 'INV3456', guestName: 'Michael Davis', residence: 'A-105', status: 'canceled', date: '2023-12-11', usageLimit: 1, usageCount: 0, isVIP: false, checkedIn: false },
  { id: '8', code: 'INV9876', guestName: 'Sophia Miller', residence: 'B-201', status: 'active', date: '2023-12-17', usageLimit: 3, usageCount: 1, isVIP: false, checkedIn: false },
  { id: '9', code: 'INV4567', guestName: 'Daniel Taylor', residence: 'C-320', status: 'active', date: '2023-12-14', usageLimit: 2, usageCount: 0, isVIP: false, checkedIn: false },
  { id: '10', code: 'INV1234', guestName: 'Olivia Anderson', residence: 'A-110', status: 'expired', date: '2023-12-08', usageLimit: 1, usageCount: 1, isVIP: false, checkedIn: false },
  { id: '11', code: 'VIP8765', guestName: 'William Thomas', residence: 'B-215', status: 'active', date: '2023-12-16', usageLimit: -1, usageCount: 7, isVIP: true, checkedIn: false },
  { id: '12', code: 'INV2468', guestName: 'Isabella Jackson', residence: 'C-305', status: 'active', date: '2023-12-15', usageLimit: 1, usageCount: 0, isVIP: false, checkedIn: false },
  { id: '13', code: 'INV1357', guestName: 'Ethan White', residence: 'A-115', status: 'canceled', date: '2023-12-12', usageLimit: 2, usageCount: 1, isVIP: false, checkedIn: false },
  { id: '14', code: 'VIP9753', guestName: 'Ava Harris', residence: 'B-220', status: 'active', date: '2023-12-17', usageLimit: -1, usageCount: 2, isVIP: true, checkedIn: true },
  { id: '15', code: 'INV8642', guestName: 'Noah Martin', residence: 'C-325', status: 'active', date: '2023-12-15', usageLimit: 5, usageCount: 3, isVIP: false, checkedIn: false },
];

const SearchInvitesDashboard = () => {
  const { translation } = useLanguage();
  
  // State for search inputs
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [residenceSearch, setResidenceSearch] = useState('');
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // State for filtered data
  const [filteredInvites, setFilteredInvites] = useState(mockInvites);
  
  // State for modals
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [idModalVisible, setIdModalVisible] = useState(false);
  
  // Handle sort when a column header is clicked
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set it as the sort column with ascending direction
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort function
  useEffect(() => {
    let filtered = mockInvites.filter(invite => {
      const codeMatch = invite.code.toLowerCase().includes(codeSearch.toLowerCase());
      const nameMatch = invite.guestName.toLowerCase().includes(nameSearch.toLowerCase());
      const residenceMatch = invite.residence.toLowerCase().includes(residenceSearch.toLowerCase());
      
      // If any search field is empty, don't filter by that field
      return (codeSearch === '' || codeMatch) && 
             (nameSearch === '' || nameMatch) && 
             (residenceSearch === '' || residenceMatch);
    });
    
    // Sort the filtered data
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      // Sort based on the selected column
      switch (sortColumn) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'name':
          comparison = a.guestName.localeCompare(b.guestName);
          break;
        case 'residence':
          comparison = a.residence.localeCompare(b.residence);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'usage':
          // For usage, sort by usageCount
          if (a.usageLimit === -1 && b.usageLimit === -1) {
            // Both are multi-use, sort by usageCount
            comparison = a.usageCount - b.usageCount;
          } else if (a.usageLimit === -1) {
            // a is multi-use, it should come first
            comparison = -1;
          } else if (b.usageLimit === -1) {
            // b is multi-use, it should come first
            comparison = 1;
          } else {
            // Both have usage limits, sort by usage ratio
            const aRatio = a.usageCount / a.usageLimit;
            const bRatio = b.usageCount / b.usageLimit;
            comparison = aRatio - bRatio;
          }
          break;
        default:
          comparison = 0;
      }
      
      // Reverse the comparison if sorting in descending order
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredInvites(sorted);
  }, [codeSearch, nameSearch, residenceSearch, sortColumn, sortDirection]);
  
  // Function to render usage text
  const getUsageText = (invite) => {
    if (invite.usageLimit === -1) {
      return `Multi-use (${invite.usageCount})`;
    } else {
      return `${invite.usageCount}/${invite.usageLimit}`;
    }
  };
  
  // Get sort icon for a column
  const getSortIcon = (columnName) => {
    if (sortColumn !== columnName) {
      return <i className="fas fa-sort" style={{ marginLeft: 4, fontSize: 10, opacity: 0.5 }}></i>;
    }
    
    return sortDirection === 'asc' 
      ? <i className="fas fa-sort-up" style={{ marginLeft: 4, fontSize: 10 }}></i>
      : <i className="fas fa-sort-down" style={{ marginLeft: 4, fontSize: 10 }}></i>;
  };
  
  // Handle invite row click
  const handleInviteClick = (invite) => {
    setSelectedInvite(invite);
    setModalVisible(true);
  };
  
  // Handle check-in/check-out
  const handleCheckInOut = () => {
    if (selectedInvite) {
      // Find the invite in the array and toggle its checked-in status
      const updatedInvites = filteredInvites.map(invite => 
        invite.id === selectedInvite.id 
          ? { ...invite, checkedIn: !invite.checkedIn }
          : invite
      );
      
      // If checking out, increment usage count
      if (selectedInvite.checkedIn) {
        const updatedWithUsage = updatedInvites.map(invite => 
          invite.id === selectedInvite.id 
            ? { ...invite, usageCount: invite.usageCount + 1 }
            : invite
        );
        setFilteredInvites(updatedWithUsage);
      } else {
        setFilteredInvites(updatedInvites);
      }
      
      // Update the selected invite
      setSelectedInvite({
        ...selectedInvite, 
        checkedIn: !selectedInvite.checkedIn,
        usageCount: selectedInvite.checkedIn ? selectedInvite.usageCount + 1 : selectedInvite.usageCount
      });
    }
  };
  
  // Handle view ID button click
  const handleViewID = () => {
    setIdModalVisible(true);
  };
  
  const renderInviteItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleInviteClick(item)}
      style={[
        styles.tableRow, 
        item.isVIP && styles.vipRow,
        item.checkedIn && styles.checkedInRow
      ]}
    >
      <Text style={[styles.tableCell, styles.codeCell]}>{item.code}</Text>
      <View style={styles.cellSeparator} />
      <Text style={[styles.tableCell, styles.nameCell]}>{item.guestName}</Text>
      <View style={styles.cellSeparator} />
      <Text style={[styles.tableCell, styles.residenceCell]}>{item.residence}</Text>
      <View style={styles.cellSeparator} />
      <Text style={[
        styles.tableCell, 
        styles.statusCell, 
        item.status === 'active' ? styles.statusActive : 
        item.status === 'expired' ? styles.statusExpired : 
        styles.statusCanceled
      ]}>
        {translation.status[item.status]}
      </Text>
      <View style={styles.cellSeparator} />
      <Text style={[styles.tableCell, styles.usageCell]}>
        {getUsageText(item)}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <BaseDashboard title={translation.security.recentInvites || "Recent Invites"}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          {/* Search by Invite Code */}
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchLabel}>{translation.security.searchByInvite}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={translation.security.searchByInvite}
              placeholderTextColor={theme.colors.placeholder}
              value={codeSearch}
              onChangeText={setCodeSearch}
            />
          </View>
          
          {/* Search by Name */}
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchLabel}>{translation.security.searchByName}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={translation.security.searchByName}
              placeholderTextColor={theme.colors.placeholder}
              value={nameSearch}
              onChangeText={setNameSearch}
            />
          </View>
          
          {/* Search by Residence Number */}
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchLabel}>{translation.security.searchByResidence}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={translation.security.searchByResidence}
              placeholderTextColor={theme.colors.placeholder}
              value={residenceSearch}
              onChangeText={setResidenceSearch}
            />
          </View>
        </View>
        
        <View style={styles.qrScanSection}>
          <Text style={styles.infoTitle}>{translation.security.scanQR || translation.guest.scanQR}</Text>
          <TouchableOpacity style={styles.scanButton}>
            <View style={styles.scanButtonContent}>
              <i className="fas fa-camera" style={{
                fontSize: 18, 
                color: 'white',
                marginRight: 8
              }}></i>
              <Text style={styles.scanButtonText}>
                {translation.security.openCamera || 'Open Camera'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <TouchableOpacity 
            style={[styles.headerCell, styles.codeCell, styles.headerButton]}
            onPress={() => handleSort('code')}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{translation.security.searchByInvite}</Text>
              {getSortIcon('code')}
            </View>
          </TouchableOpacity>
          <View style={styles.headerSeparator} />
          
          <TouchableOpacity 
            style={[styles.headerCell, styles.nameCell, styles.headerButton]}
            onPress={() => handleSort('name')}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{translation.security.searchByName}</Text>
              {getSortIcon('name')}
            </View>
          </TouchableOpacity>
          <View style={styles.headerSeparator} />
          
          <TouchableOpacity 
            style={[styles.headerCell, styles.residenceCell, styles.headerButton]}
            onPress={() => handleSort('residence')}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{translation.security.searchByResidence}</Text>
              {getSortIcon('residence')}
            </View>
          </TouchableOpacity>
          <View style={styles.headerSeparator} />
          
          <TouchableOpacity 
            style={[styles.headerCell, styles.statusCell, styles.headerButton]}
            onPress={() => handleSort('status')}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{translation.resident.inviteStatus}</Text>
              {getSortIcon('status')}
            </View>
          </TouchableOpacity>
          <View style={styles.headerSeparator} />
          
          <TouchableOpacity 
            style={[styles.headerCell, styles.usageCell, styles.headerButton]}
            onPress={() => handleSort('usage')}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>{translation.resident.inviteUsage}</Text>
              {getSortIcon('usage')}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Table Body */}
        <FlatList
          data={filteredInvites}
          renderItem={renderInviteItem}
          keyExtractor={item => item.id}
          style={styles.tableBody}
          contentContainerStyle={styles.tableContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {translation.common.no} {translation.security.invites}
              </Text>
            </View>
          }
        />
        
        {/* Details Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedInvite?.isVIP ? 
                    <i className="fas fa-crown" style={{ marginRight: 8, color: '#FFD700' }}></i> : 
                    null}
                  {selectedInvite?.guestName}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <i className="fas fa-times" style={{ color: 'white', fontSize: 16 }}></i>
                </TouchableOpacity>
              </View>
              
              {selectedInvite && (
                <View style={styles.modalContent}>
                  <View style={styles.inviteDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{translation.security.searchByInvite}:</Text>
                      <Text style={styles.detailValue}>{selectedInvite.code}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{translation.security.searchByResidence}:</Text>
                      <Text style={styles.detailValue}>{selectedInvite.residence}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{translation.resident.inviteStatus}:</Text>
                      <Text style={[
                        styles.detailValue,
                        selectedInvite.status === 'active' ? styles.statusActive : 
                        selectedInvite.status === 'expired' ? styles.statusExpired : 
                        styles.statusCanceled
                      ]}>{translation.status[selectedInvite.status]}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{translation.time.checkInAt}:</Text>
                      <Text style={styles.detailValue}>{selectedInvite.date}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{translation.resident.inviteUsage}:</Text>
                      <Text style={styles.detailValue}>{getUsageText(selectedInvite)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.checkButton,
                        selectedInvite.checkedIn ? styles.checkOutButton : styles.checkInButton
                      ]}
                      onPress={handleCheckInOut}
                      disabled={selectedInvite.status !== 'active'}
                    >
                      {selectedInvite.status === 'active' ? (
                        <View style={styles.buttonContent}>
                          <i className={selectedInvite.checkedIn ? "fas fa-sign-out-alt" : "fas fa-sign-in-alt"} 
                             style={{ color: 'white', fontSize: 16, marginRight: 8 }}></i>
                          <Text style={styles.buttonText}>
                            {selectedInvite.checkedIn ? 
                              translation.security.checkOutGuest : 
                              translation.security.checkInGuest}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.buttonText}>
                          {translation.security.noAction || "No Action Available"}
                        </Text>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.viewIdButton}
                      onPress={handleViewID}
                    >
                      <View style={styles.buttonContent}>
                        <i className="fas fa-id-card" style={{ color: 'white', fontSize: 16, marginRight: 8 }}></i>
                        <Text style={styles.buttonText}>{translation.security.viewID}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
        
        {/* ID Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={idModalVisible}
          onRequestClose={() => setIdModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.idModalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {translation.security.guestID}
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIdModalVisible(false)}
                >
                  <i className="fas fa-times" style={{ color: 'white', fontSize: 16 }}></i>
                </TouchableOpacity>
              </View>
              
              <View style={styles.idModalContent}>
                <Image 
                  source={mockID} 
                  style={styles.idImage}
                  resizeMode="contain"
                />
                
                <TouchableOpacity 
                  style={styles.closeIdButton}
                  onPress={() => setIdModalVisible(false)}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>{translation.security.closeID}</Text>
                  </View>
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
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  searchInputWrapper: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  searchLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    color: 'white',
    height: 40,
    fontSize: 12,
  },
  qrScanSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  infoTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
    height: 40,
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
    alignItems: 'center',
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  headerButton: {
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
  },
  tableBody: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: theme.roundness,
    borderBottomRightRadius: theme.roundness,
  },
  tableContent: {
    paddingBottom: theme.spacing.s,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
    alignItems: 'center',
  },
  vipRow: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light green background for VIP rows
  },
  checkedInRow: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)', // Light blue for checked-in guests
  },
  tableCell: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  cellSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 2,
  },
  codeCell: {
    width: '18%',
  },
  nameCell: {
    width: '25%',
  },
  residenceCell: {
    width: '15%',
  },
  statusCell: {
    width: '17%',
  },
  usageCell: {
    width: '20%',
  },
  statusActive: {
    color: '#4CAF50',
  },
  statusExpired: {
    color: '#9E9E9E',
  },
  statusCanceled: {
    color: '#F44336',
  },
  emptyState: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: theme.spacing.m,
  },
  inviteDetails: {
    marginBottom: theme.spacing.m,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkButton: {
    flex: 1,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
  },
  checkOutButton: {
    backgroundColor: '#FF5722',
  },
  viewIdButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ID Modal Styles
  idModalContainer: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  idModalContent: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  idImage: {
    width: '100%',
    height: 300,
    marginBottom: theme.spacing.m,
  },
  closeIdButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    width: '100%',
    alignItems: 'center',
  },
});

export default SearchInvitesDashboard; 