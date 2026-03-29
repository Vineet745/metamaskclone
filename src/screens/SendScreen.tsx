import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Input from '../components/Input';
import { sendEth } from '../utils/walletService';
import { getSecure } from '../utils/storageService';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../context/WalletContext';

export default function SendScreen() {
  const navigation = useNavigation();
  const { walletAddress } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSend = async () => {
    if (!toAddress || !amount) {
      Alert.alert('Error', 'Please enter address and amount');
      return;
    }
    
    setLoading(true);
    try {
      const pk = await getSecure('wallet_private_key');
      if (!pk) throw new Error('Private key not found');
      
      const hash = await sendEth(pk, toAddress, amount);
      setTxHash(hash);
      Alert.alert('Success', `Transaction sent!\nHash: ${hash}`);
    } catch (e: any) {
      Alert.alert('Transaction Failed', e.message || 'Error sending ETH');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Send ETH</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <Input
          label="Recipient Address"
          placeholder="0x123..."
          value={toAddress}
          onChangeText={setToAddress}
        />
        <Input
          label="Amount (ETH)"
          placeholder="0.0"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {txHash && (
           <View style={styles.txBox}>
             <Text style={styles.txTitle}>Transaction Hash:</Text>
             <Text style={styles.txHash}>{txHash}</Text>
           </View>
        )}

      </View>

      <View style={styles.footer}>
         <Button title="Send Transaction" onPress={handleSend} loading={loading} />
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
  footer: { paddingBottom: 20 },
  txBox: {
    marginTop: 20,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981'
  },
  txTitle: { color: '#10b981', fontSize: 12, marginBottom: 5 },
  txHash: { color: '#aaa', fontSize: 12 }
});
