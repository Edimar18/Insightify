import { initializeApp } from 'firebase/app';
// We import specific authentication persistence for React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. YOUR CONFIGURATION
// Replace these values with your actual Firebase Console keys
const firebaseConfig = {
  apiKey: "AIzaSyCLZ1N8VyZ-gcHKejrVt2PpmRlP9phnmnQ",
  authDomain: "insightify-51c84.firebaseapp.com",
  projectId: "insightify-51c84",
  storageBucket: "insightify-51c84.firebasestorage.app",
  messagingSenderId: "910888602498",
  appId: "1:910888602498:web:972ce2e0ff12eb7f095d9b",
  measurementId: "G-TN5YNVF8QY"
};

// 2. INITIALIZE APP
const app = initializeApp(firebaseConfig);

// 3. INITIALIZE AUTH WITH PERSISTENCE
// This is the step most tutorials miss. We tell Firebase to use AsyncStorage
// to keep the user logged in, otherwise the app crashes or logs out on reload.
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 4. INITIALIZE FIRESTORE
const db = getFirestore(app);

export { auth, db };
