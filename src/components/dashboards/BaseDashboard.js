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
    flex: 1,
    backgroundColor: theme.colors.background,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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