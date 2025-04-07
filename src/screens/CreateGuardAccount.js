import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import theme from '../styles/theme';

const CreateGuardAccount = () => {
  const { translation } = useLanguage();
  const { userType } = useUser();
  
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedArea, setAssignedArea] = useState('');
  
  // Validate admin access
  if (userType !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {translation.common.error}
        </Text>
      </View>
    );
  }
  
  // Handle form submission
  const handleCreateAccount = () => {
    // Basic validation
    if (!username || !password || !confirmPassword || !fullName) {
      Alert.alert(translation.common.error, 'Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(translation.common.error, 'Passwords do not match');
      return;
    }
    
    // In a real app, this would make an API call to create the account
    console.log('Creating guard account with:', {
      username,
      password,
      fullName,
      email,
      phone,
      assignedArea,
      type: 'security'
    });
    
    Alert.alert(
      translation.common.success,
      `${translation.admin.createGuardAccount} ${fullName}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset the form
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setFullName('');
            setEmail('');
            setPhone('');
            setAssignedArea('');
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{translation.admin.createGuardAccount}</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{translation.auth.accountSettings}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.auth.username}*</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder={`${translation.auth.username}...`}
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.auth.password}*</Text>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder={`${translation.auth.password}...`}
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.common.confirm} {translation.auth.password}*</Text>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={`${translation.common.confirm} ${translation.auth.password}...`}
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
            />
          </View>
          
          <Text style={styles.sectionTitle}>{translation.common.personalInfo}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.common.fullName}*</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder={`${translation.common.fullName}...`}
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.common.email}</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder={`${translation.common.email}...`}
              placeholderTextColor={theme.colors.placeholder}
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.common.phone}</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder={`${translation.common.phone}...`}
              placeholderTextColor={theme.colors.placeholder}
              keyboardType="phone-pad"
            />
          </View>
          
          <Text style={styles.sectionTitle}>{translation.common.assignment}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{translation.common.assignedArea}</Text>
            <TextInput
              style={styles.textInput}
              value={assignedArea}
              onChangeText={setAssignedArea}
              placeholder={`${translation.common.assignedArea}...`}
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>{translation.admin.createGuardAccount}</Text>
          </TouchableOpacity>
          
          <Text style={styles.requiredText}>* {translation.common.requiredFields}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
  },
  inputGroup: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.l,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.sizes.button,
    fontWeight: theme.typography.fontWeights.bold,
  },
  requiredText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    marginTop: theme.spacing.m,
    textAlign: 'right',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});

export default CreateGuardAccount; 