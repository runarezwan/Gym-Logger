import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjlmRZO_Vgxa72PYxb1tuqQZ83L3JSHf0",
  authDomain: "gym-logger-runa-1337.firebaseapp.com",
  projectId: "gym-logger-runa-1337",
  storageBucket: "gym-logger-runa-1337.firebasestorage.app",
  messagingSenderId: "526062178286",
  appId: "1:526062178286:web:c8260d1ff88bd90f8a88ff",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
