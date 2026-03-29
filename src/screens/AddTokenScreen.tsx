import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Input from '../components/Input';
import { getData, storeData } from '../utils/storageService';
import { useNavigation } from '@react-navigation/native';

export default function AddTokenScreen() {
  const [address, setAddress] = useState('');
  const [symbol, setSymbol] = useState('');
  const navigation = useNavigation();

  const handleAddToken = async () => {
    if (!address || !symbol) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const existing = (await getData('custom_tokens')) || [];
      existing.push({ address, symbol: symbol.toUpperCase() });
      await storeData('custom_tokens', existing);
      Alert.alert('Success', 'Token Added!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to add token');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Custom Token</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <Input
          label="Token Contract Address"
          placeholder="0x..."
          value={address}
          onChangeText={setAddress}
        />
        <Input
          label="Token Symbol"
          placeholder="e.g. USDT"
          value={symbol}
          onChangeText={setSymbol}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.footer}>
         <Button title="Add Token" onPress={handleAddToken} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backText: { color: '#3b82f6', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, marginTop: 30 },
  footer: { paddingBottom: 20 }
});
