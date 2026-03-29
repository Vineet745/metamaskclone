import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ScreenWrapper from '../components/ScreenWrapper';
import { useWallet } from '../context/WalletContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Clipboard from '@react-native-clipboard/clipboard';

export default function ReceiveScreen() {
  const { walletAddress } = useWallet();
  const navigation = useNavigation();

  const handleCopy = () => {
    if (walletAddress) {
      Clipboard.setString(walletAddress);
      Alert.alert('Copied', 'Address copied to clipboard!');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Receive Assets</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.qrContainer}>
          {walletAddress ? (
            <QRCode 
              value={walletAddress} 
              size={200} 
              color="black"
              backgroundColor="white"
            />
          ) : (
            <Text style={styles.error}>No Wallet</Text>
          )}
        </View>

        <Text style={styles.addressLabel}>Your Wallet Address</Text>
        
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>{walletAddress}</Text>
        </View>

        <Text style={styles.warning}>
          Send only Ether (ETH) and ERC-20 tokens to this address on the matching network.
        </Text>
      </View>
      
      <View style={styles.footer}>
         <Button title="Copy Address" type="outline" onPress={handleCopy} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40
  },
  backText: { color: '#3b82f6', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  center: {
    alignItems: 'center',
    flex: 1
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30
  },
  error: { color: '#000' },
  addressLabel: { color: '#aaa', marginBottom: 10 },
  addressBox: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20
  },
  addressText: { color: '#fff', textAlign: 'center' },
  warning: {
    color: '#8b5cf6',
    textAlign: 'center',
    paddingHorizontal: 30,
    fontSize: 12
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
