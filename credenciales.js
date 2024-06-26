import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4zVkEVmtpTh2JuVFlzQ5xxnJaKXGraJo",
  authDomain: "prueba1-4d605.firebaseapp.com",
  projectId: "prueba1-4d605",
  storageBucket: "prueba1-4d605.appspot.com",
  messagingSenderId: "863229244435",
  appId: "1:863229244435:web:b3247e0641a00f18717be6",
  measurementId: "G-1YR8Y19S6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db };