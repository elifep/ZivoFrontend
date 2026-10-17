// src/config/config.ts
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiUrl;
console.log('🔗 API_URL:', API_URL);