import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSecure, storeSecure, storeData, getData } from '../utils/storageService';

interface WalletContextData {
  isAppReady: boolean;
  hasWallet: boolean;
  isUnlocked: boolean;
  walletAddress: string | null;
  pin: string | null;
  setUnlock: (status: boolean) => void;
  saveWallet: (address: string, privateKey: string, mnemonic?: string | null) => Promise<void>;
  setupPin: (newPin: string) => Promise<void>;
  verifyPin: (inputPin: string) => boolean;
  logout: () => Promise<void>;
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [pin, setPin] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedAddress = await getSecure('wallet_address');
        const savedPin = await getSecure('app_pin');
        if (savedAddress) {
          setWalletAddress(savedAddress);
          setHasWallet(true);
        }
        if (savedPin) {
          setPin(savedPin);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsAppReady(true);
      }
    };
    loadState();
  }, []);

  const setUnlock = (status: boolean) => {
    setIsUnlocked(status);
  };

  const setupPin = async (newPin: string) => {
    await storeSecure('app_pin', newPin);
    setPin(newPin);
    setIsUnlocked(true);
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === pin) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const saveWallet = async (address: string, privateKey: string, mnemonic?: string | null) => {
    await storeSecure('wallet_address', address);
    await storeSecure('wallet_private_key', privateKey);
    if (mnemonic) {
      await storeSecure('wallet_mnemonic', mnemonic);
    }
    setWalletAddress(address);
    setHasWallet(true);
  };

  const logout = async () => {
    await storeSecure('wallet_address', '');
    await storeSecure('wallet_private_key', '');
    await storeSecure('wallet_mnemonic', '');
    await storeSecure('app_pin', '');
    setHasWallet(false);
    setIsUnlocked(false);
    setWalletAddress(null);
    setPin(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isAppReady,
        hasWallet,
        isUnlocked,
        walletAddress,
        pin,
        setUnlock,
        setupPin,
        verifyPin,
        saveWallet,
        logout,
      }}>
      {children}
    </WalletContext.Provider>
  );
};
