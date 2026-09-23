import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbfujBH8FIrY-G9LY1XSYxC_PQJhO2AZA",
  authDomain: "meetra-app-5b43e.firebaseapp.com",
  projectId: "meetra-app-5b43e",
  storageBucket: "meetra-app-5b43e.firebasestorage.app",
  messagingSenderId: "497337179014",
  appId: "1:497337179014:web:efeb1f1bcaf2ee459baa07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };