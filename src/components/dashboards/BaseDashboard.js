import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';

const BaseDashboard = ({ title, children }) => {
  const { translation } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    marginBottom: theme.spacing.m,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: theme.spacing.m,
  },
  content: {
    flex: 1,
  }
});

export default BaseDashboard; 