import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import BaseDashboard from './BaseDashboard';
import theme from '../../styles/theme';

const UpgradeToResidentDashboard = () => {
  const { translation } = useLanguage();
  const [code, setCode] = useState('');
  
  // Function to format the code with hyphens (XXXX-XXXX-XXXX-XXXX)
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
  
  // Handle code input changes
  const handleCodeChange = (text) => {
    const formattedCode = formatCode(text);
    setCode(formattedCode);
  };
  
  // Handle Scan QR Code button press (just a mockup)
  const handleScanQR = () => {
    // This would launch a QR scanner in a real app
    console.log('QR scanner would launch here');
  };
  
  // Handle submit button press
  const handleSubmit = () => {
    // This would validate and submit the code in a real app
    console.log('Submitted code:', code);
    // Reset input after submission
    setCode('');
  };
  
  return (
    <BaseDashboard title={translation.guest.upgradeToResident}>
      <View style={styles.container}>
        <Text style={styles.description}>
          {translation.guest.upgradeStatus}
        </Text>
        
        <View style={styles.codeInputContainer}>
          <Text style={styles.inputLabel}>{translation.guest.enterCode}</Text>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={handleCodeChange}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="characters"
          />
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={code.length < 19} // 16 digits + 3 hyphens
          >
            <Text style={styles.buttonText}>
              {translation.common.submit}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>{translation.auth.orSignInWith}</Text>
          <View style={styles.line} />
        </View>
        
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={handleScanQR}
        >
          <Text style={styles.buttonText}>
            {translation.guest.scanQR}
          </Text>
        </TouchableOpacity>
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
    textAlign: 'center',
  },
  codeInputContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
  },
  codeInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: theme.spacing.m,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  orText: {
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.m,
    fontSize: theme.typography.sizes.caption,
  },
  qrButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default UpgradeToResidentDashboard; 