import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function Button({ title, onPress, loading, type = 'primary', style }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.btn, 
        type === 'secondary' && styles.secondary, 
        type === 'outline' && styles.outline,
        style
      ]}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color={type === 'outline' ? '#3b82f6' : '#fff'} />
      ) : (
        <Text style={[
          styles.text, 
          type === 'outline' && styles.textOutline
        ]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { 
    backgroundColor: '#3b82f6', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginVertical: 10,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  secondary: { 
    backgroundColor: '#333',
    shadowOpacity: 0,
    elevation: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  textOutline: {
    color: '#3b82f6'
  }
});
