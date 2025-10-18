// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config for SMAS-Website
const firebaseConfig = {
  apiKey: "AIzaSyBICnJmNNRDHRe12kab44SGVyGRGmPMJS8",
  authDomain: "smas-website-ec8a9.firebaseapp.com",
  projectId: "smas-website-ec8a9",
  storageBucket: "smas-website-ec8a9.firebasestorage.app",
  messagingSenderId: "15458764016",
  appId: "1:15458764016:web:4c4f6312905cc6de4a6e35",
  measurementId: "G-THN2RTVTW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export so the rest of your project can use it
export { db, auth };
