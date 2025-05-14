// src/config/config.ts
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://10.0.2.2:5000';