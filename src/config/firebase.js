import {initializeApp} from 'firebase/app';
import {getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBAPWbtNVLcpQwhb8nQJrZzAcAlJQ4Hg_o",
    authDomain: "swparcial2f.firebaseapp.com",
    databaseURL: "https://swparcial2f.firebaseio.com",
    projectId: "swparcial2f",
    storageBucket: "swparcial2f.firebasestorage.app",
    messagingSenderId: "752131139218",
    appId: "1:752131139218:web:e013aab141a06aed45684b",
    measurementId: "G-Z5KF6C43Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
