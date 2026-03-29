import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useWallet } from '../context/WalletContext';
import { getEthBalance, getTokenBalance } from '../utils/walletService';
import { getData } from '../utils/storageService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Token {
  address: string;
  symbol: string;
}

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { walletAddress, logout } = useWallet();
  const [balance, setBalance] = useState<string>('0.0');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!walletAddress) return;
    try {
      const bal = await getEthBalance(walletAddress);
      setBalance(bal);

      const savedTokens = await getData('custom_tokens') || [];
      setTokens(savedTokens);

      const tBals: any = {};
      for (const t of savedTokens) {
         tBals[t.symbol] = await getTokenBalance(walletAddress, t.address);
      }
      setTokenBalances(tBals);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // 15s polling
    return () => clearInterval(interval);
  }, [walletAddress]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <View style={styles.networkBadge}>
          <View style={styles.dot} />
          <Text style={styles.networkText}>Sepolia Testnet</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Lock</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        <View style={styles.card}>
          <Text style={styles.balanceText}>{parseFloat(balance).toFixed(4)} ETH</Text>
          <Text style={styles.addressText}>{shortenAddress(walletAddress || '')}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Send')}>
              <Text style={styles.actionText}>🚀 Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Receive')}>
              <Text style={styles.actionText}>📥 Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tokensHeader}>
          <Text style={styles.sectionTitle}>Assets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddToken')}>
            <Text style={styles.addTokenText}>+ Default Token</Text>
          </TouchableOpacity>
        </View>

        {tokens.length === 0 ? (
          <View style={styles.emptyTokensBox}>
            <Text style={styles.emptyTokensText}>No custom tokens.</Text>
          </View>
        ) : (
          tokens.map((token, i) => (
            <View key={i} style={styles.tokenRow}>
              <View style={styles.tokenIcon}>
                <Text style={styles.tokenIconText}>{token.symbol.substring(0, 1)}</Text>
              </View>
              <View style={styles.tokenInfo}>
                 <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                 <Text style={styles.tokenBal}>{tokenBalances[token.symbol] || '0.0'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)'
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6', marginRight: 5 },
  networkText: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold' },
  logoutBtn: {},
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
  scroll: { padding: 20 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333'
  },
  balanceText: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  addressText: { fontSize: 14, color: '#aaa', marginBottom: 25 },
  actionRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  actionBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 30, marginBottom: 15 },
  tokensHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  addTokenText: { color: '#3b82f6', fontSize: 14, fontWeight: 'bold' },
  emptyTokensBox: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#333'
  },
  emptyTokensText: { color: '#666' },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 10,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  tokenIconText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  tokenInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  tokenSymbol: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tokenBal: { color: '#aaa', fontSize: 16 }
});
