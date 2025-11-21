// firebaseConfig.js
import { initializeApp } from 'firebase/app';
// Optional: Import other services you need (Auth, Firestore, etc.)
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// YOUR CONFIG FROM FIREBASE CONSOLE (Web App Section)
const firebaseConfig = {
  apiKey: "AIzaSyCLZ1N8VyZ-gcHKejrVt2PpmRlP9phnmnQ",
  authDomain: "insightify-51c84.firebaseapp.com",
  projectId: "insightify-51c84",
  storageBucket: "insightify-51c84.firebasestorage.app",
  messagingSenderId: "910888602498",
  appId: "1:910888602498:web:972ce2e0ff12eb7f095d9b",
  measurementId: "G-TN5YNVF8QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (optional, based on what you use)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;