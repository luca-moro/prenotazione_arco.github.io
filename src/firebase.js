// firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore'; // or any other services you want to use

const firebaseConfig = {
  apiKey: "AIzaSyARiqtsVR7cmX6iU3cD0P7LvvWfp4zv4To",
  authDomain: "prenotazione-arco.firebaseapp.com",
  projectId: "prenotazione-arco",
  storageBucket: "prenotazione-arco.firebasestorage.app",
  messagingSenderId: "308635909661",
  appId: "1:308635909661:web:ea5396b2903d880f30d0f4"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Export Firestore or other services you use
const db = firebaseApp.firestore();
export default { db };