import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvm-JCWzFnR4mmBbphQKGcIdV9ml5A2Xg",
  authDomain: "bandupbdd.firebaseapp.com",
  projectId: "bandupbdd",
  storageBucket: "bandupbdd.appspot.com",
  messagingSenderId: "594238980409",
  appId: "1:594238980409:web:5ae02205682c72658f68e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db };