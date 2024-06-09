import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdqGEEjiejk3aYK3qiMDcqo4Ntot1GGbo",
    authDomain: "nomsfoodmobile.firebaseapp.com",
    projectId: "nomsfoodmobile",
    storageBucket: "nomsfoodmobile.appspot.com",
    messagingSenderId: "309828446819",
    appId: "1:309828446819:web:468d5079f992c722e8a656",
    measurementId: "G-KKQXJTSZZK"
  };

const app = initializeApp(firebaseConfig);
const initalAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, initalAuth, auth, db, storage };