import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import theme from '../styles/theme';

const LanguageSelector = ({ compact = false }) => {
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={[
      styles.container,
      compact && styles.compactContainer
    ]}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'en' && styles.selectedLanguage,
          compact && styles.compactButton
        ]}
        onPress={() => changeLanguage('en')}
      >
        <Text
          style={[
            styles.languageText,
            language === 'en' && styles.selectedLanguageText,
            compact && styles.compactText
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'es' && styles.selectedLanguage,
          compact && styles.compactButton
        ]}
        onPress={() => changeLanguage('es')}
      >
        <Text
          style={[
            styles.languageText,
            language === 'es' && styles.selectedLanguageText,
            compact && styles.compactText
          ]}
        >
          ES
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  compactContainer: {
    marginRight: 0,
    justifyContent: 'center',
  },
  languageButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.roundness / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactButton: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    marginHorizontal: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.fontWeights.medium,
  },
  compactText: {
    fontSize: 12,
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default LanguageSelector; 