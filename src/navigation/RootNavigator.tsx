import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useWallet } from '../context/WalletContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import CreateWalletScreen from '../screens/CreateWalletScreen';
import ImportWalletScreen from '../screens/ImportWalletScreen';
import SetupPinScreen from '../screens/SetupPinScreen';
import UnlockPinScreen from '../screens/UnlockPinScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SendScreen from '../screens/SendScreen';
import ReceiveScreen from '../screens/ReceiveScreen';
import AddTokenScreen from '../screens/AddTokenScreen';

export type RootStackParamList = {
  Welcome: undefined;
  CreateWallet: undefined;
  ImportWallet: undefined;
  SetupPin: { address: string; privateKey: string; mnemonic?: string | null };
  UnlockPin: undefined;
  Dashboard: undefined;
  Send: undefined;
  Receive: undefined;
  AddToken: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAppReady, hasWallet, isUnlocked, pin } = useWallet();

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
        {!hasWallet ? (
          <>
             <Stack.Screen name="Welcome" component={WelcomeScreen} />
             <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
             <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
             <Stack.Screen name="SetupPin" component={SetupPinScreen} />
          </>
        ) : !isUnlocked ? (
          <Stack.Screen name="UnlockPin" component={UnlockPinScreen} />
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Send" component={SendScreen} />
            <Stack.Screen name="Receive" component={ReceiveScreen} />
            <Stack.Screen name="AddToken" component={AddTokenScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
