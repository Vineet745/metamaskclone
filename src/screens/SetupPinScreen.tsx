import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Input from '../components/Input';
import { useWallet } from '../context/WalletContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type SetupPinRouteProp = RouteProp<RootStackParamList, 'SetupPin'>;

export default function SetupPinScreen() {
  const route = useRoute<SetupPinRouteProp>();
  const { saveWallet, setupPin } = useWallet();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const { address, privateKey, mnemonic } = route.params;

  const handleSetup = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    try {
      await saveWallet(address, privateKey, mnemonic);
      await setupPin(pin);
    } catch (e) {
      Alert.alert('Error', 'Failed to save wallet securely.');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>Secure your wallet</Text>
        <Text style={styles.subtitle}>
          Create a PIN to unlock your wallet on this device.
        </Text>
      </View>

      <Input
        label="Create PIN"
        placeholder="Enter PIN"
        keyboardType="number-pad"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />

      <Input
        label="Confirm PIN"
        placeholder="Re-enter PIN"
        keyboardType="number-pad"
        secureTextEntry
        value={confirmPin}
        onChangeText={setConfirmPin}
      />

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleSetup} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: {
    marginVertical: 40,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
