import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

export default function Input({ placeholder, value, onChangeText, secureTextEntry, multiline, numberOfLines, style, label, keyboardType }: any) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize="none"
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    color: '#aaa',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  multiline: {
    textAlignVertical: 'top',
    height: 120,
  }
});
