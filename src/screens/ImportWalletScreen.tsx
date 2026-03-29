import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import Input from '../components/Input';
import { restoreWalletFromMnemonic, restoreWalletFromPrivateKey } from '../utils/walletService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ImportWallet'>;

export default function ImportWalletScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [tab, setTab] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [inputValue, setInputValue] = useState('');

  const handleImport = () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', 'Please enter your phrase or key.');
      return;
    }

    let wallet = null;
    if (tab === 'mnemonic') {
      wallet = restoreWalletFromMnemonic(inputValue.trim());
    } else {
      wallet = restoreWalletFromPrivateKey(inputValue.trim());
    }

    if (wallet) {
      navigation.navigate('SetupPin', wallet);
    } else {
      Alert.alert('Invalid Input', 'Could not restore wallet. Please check your input.');
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Import Wallet</Text>
      
      <View style={styles.tabContainer}>
        <Button 
          title="Mnemonic" 
          type={tab === 'mnemonic' ? 'primary' : 'secondary'} 
          style={[styles.tabButton, tab === 'mnemonic' && styles.activeTab]}
          onPress={() => { setTab('mnemonic'); setInputValue(''); }}
        />
        <Button 
          title="Private Key" 
          type={tab === 'privateKey' ? 'primary' : 'secondary'} 
          style={[styles.tabButton, tab === 'privateKey' && styles.activeTab]}
          onPress={() => { setTab('privateKey'); setInputValue(''); }}
        />
      </View>

      <Text style={styles.label}>
        {tab === 'mnemonic' ? 'Enter Secret Recovery Phrase' : 'Enter Private Key'}
      </Text>
      
      <Input
        placeholder={tab === 'mnemonic' ? 'apple juice book...' : '0x123abc...'}
        value={inputValue}
        onChangeText={setInputValue}
        multiline={true}
      />

      <View style={styles.footer}>
        <Button title="Import" onPress={handleImport} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: '#3b82f6'
  },
  label: {
    color: '#aaa',
    marginBottom: 10,
    fontSize: 14,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
