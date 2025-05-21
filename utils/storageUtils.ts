import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

// Save data
const saveItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isWeb) {
        await AsyncStorage.setItem(key, value);
    } else {
        SecureStore.setItemAsync(key, value, {
            keychainAccessible: SecureStore.ALWAYS,
        });
    }
  } catch (error) {
        console.error('Save Error:', error);
  }
};

// Get data
const getItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key, {
            keychainAccessible: SecureStore.ALWAYS,
        });
    }
  } catch (error) {
    console.error('Get Error:', error);
    return null;
  }
};

// Delete data
const deleteItem = async (key: string): Promise<void> => {
  try {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key, {
            keychainAccessible: SecureStore.ALWAYS,
        });;
    }
  } catch (error) {
    console.error('Delete Error:', error);
  }
};

export { saveItem, getItem, deleteItem };
