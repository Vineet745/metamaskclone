import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import { createWallet } from '../utils/walletService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateWallet'>;

export default function CreateWalletScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [wallet, setWallet] = useState<{ address: string; privateKey: string; mnemonic: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const newWallet = createWallet();
      setWallet(newWallet as any);
      setLoading(false);
    }, 100);
  };

  const handleContinue = () => {
    if (wallet) {
      navigation.navigate('SetupPin', wallet);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {wallet ? (
        <>
          <Text style={styles.title}>Secret Recovery Phrase</Text>
          <Text style={styles.subtitle}>
            Write down these words in order. Never share them with anyone!
          </Text>

          <View style={styles.phraseContainer}>
            {wallet.mnemonic?.split(' ').map((word, index) => (
              <View key={index} style={styles.wordBox}>
                <Text style={styles.wordIndex}>{index + 1}.</Text>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              If you lose these words, you will lose access to your funds forever.
            </Text>
          </View>

          <View style={styles.footer}>
            <Button title="I have saved it safely" onPress={handleContinue} />
          </View>
        </>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Create Your Wallet</Text>
          <Text style={styles.subtitle}>
            A new wallet will compute a secure 12-word mnemonic phrase.
          </Text>
          <Button 
            title="Generate Wallet" 
            onPress={handleGenerate} 
            loading={loading}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { },
  centerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 30,
    lineHeight: 22
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordBox: {
    width: '30%',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    flexDirection: 'row',
  },
  wordIndex: {
    color: '#666',
    marginRight: 5,
    fontSize: 12,
  },
  wordText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  warningBox: {
    marginTop: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  warningText: {
    color: '#f87171',
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
});
