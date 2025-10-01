// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4ox63BadX_Izqxy2mzxIJvmv53DSoy38",
  authDomain: "sistema-logistica-d0eed.firebaseapp.com",
  projectId: "sistema-logistica-d0eed",
  storageBucket: "sistema-logistica-d0eed.firebasestorage.app",
  messagingSenderId: "552699082997",
  appId: "1:552699082997:web:96d177b076fc121a04adbc",
  measurementId: "G-WPPX46M9S7", // pode deixar aqui, mas não é obrigatório
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);
