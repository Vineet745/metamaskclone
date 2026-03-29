import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from './src/context/WalletContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <RootNavigator />
      </WalletProvider>
    </SafeAreaProvider>
  );
};

export default App;
