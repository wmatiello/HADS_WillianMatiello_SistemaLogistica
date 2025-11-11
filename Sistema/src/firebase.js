// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4ox63BadX_Izqxy2mzxIJvmv53DSoy38",
  authDomain: "sistema-logistica-d0eed.firebaseapp.com",
  projectId: "sistema-logistica-d0eed",
  storageBucket: "sistema-logistica-d0eed.appspot.com",
  messagingSenderId: "552699082997",
  appId: "1:552699082997:web:96d177b076fc121a04adbc",
  measurementId: "G-WPPX46M9S7",
};

const app = initializeApp(firebaseConfig);

// Auth com sessão de aba
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

export const db = getFirestore(app);
