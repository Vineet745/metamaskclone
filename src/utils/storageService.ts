import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSecure = async (key: string, value: string) => {
  try {
    await EncryptedStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error('storeSecure Error:', e);
    return false;
  }
};

export const getSecure = async (key: string) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('getSecure Error:', e);
    return null;
  }
};

export const removeSecure = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (e) {
    console.error('removeSecure Error:', e);
  }
};

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('storeData Error:', e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('getData Error:', e);
    return null;
  }
};
