import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSiev_9t3tFcXuLZ9S3Ng-qlgguGUsIBk",
  authDomain: "bandup-37f42.firebaseapp.com",
  projectId: "bandup-37f42",
  storageBucket: "bandup-37f42.appspot.com",
  messagingSenderId: "985041340225",
  appId: "1:985041340225:web:6ad334af9d5771a0c983c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db };