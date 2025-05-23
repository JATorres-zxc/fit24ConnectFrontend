import { Platform } from 'react-native';

export const API_BASE_URL = 
  Platform.OS === 'web' 
    ? 'http://127.0.0.1:8000' 
    : 'http://172.16.6.198:8000';