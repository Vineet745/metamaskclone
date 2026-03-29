import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Input from '../components/Input';
import { useWallet } from '../context/WalletContext';

export default function UnlockPinScreen() {
  const { verifyPin, logout } = useWallet();
  const [pin, setPin] = useState('');

  const handleUnlock = () => {
    if (!verifyPin(pin)) {
      Alert.alert('Error', 'Incorrect PIN');
      setPin('');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Reset Wallet',
      'Are you sure you want to reset? This will wipe your keys from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>🔒</Text>
        </View>
        <Text style={styles.title}>Unlock Wallet</Text>
      </View>

      <Input
        label="Enter PIN"
        placeholder="PIN"
        keyboardType="number-pad"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />

      <Button title="Unlock" onPress={handleUnlock} />

      <View style={styles.footer}>
        <Button title="Reset Wallet" type="outline" onPress={handleLogout} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: {
    marginVertical: 40,
    alignItems: 'center'
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
