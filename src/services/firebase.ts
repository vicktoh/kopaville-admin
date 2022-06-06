import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAmkDZKnJg1IzuxjIy52j5wR6-zmRJKvRE",
  authDomain: "kopaville-dev.firebaseapp.com",
  projectId: "kopaville-dev",
  storageBucket: "kopaville-dev.appspot.com",
  messagingSenderId: "731069250399",
  appId: "1:731069250399:web:fe01d43daed77fd09454ea",
  measurementId: "G-S8BKGYH49X",
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const functions = getFunctions(firebaseApp);
