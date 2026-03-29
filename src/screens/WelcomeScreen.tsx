import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.topSpace} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Logo placeholder - using a circle with letter for now */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🦊</Text>
          </View>
        </View>

        <Text style={styles.title}>Welcome to WalletProxy</Text>
        <Text style={styles.subtitle}>
          Securely manage your assets with ease. Create a new wallet or import an existing one.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Button 
          title="Create a New Wallet" 
          onPress={() => navigation.navigate('CreateWallet')} 
        />
        <Button 
          title="Import using Secret Recovery Phrase" 
          type="outline"
          onPress={() => navigation.navigate('ImportWallet')} 
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  topSpace: {
    flex: 1,
  },
  content: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});
