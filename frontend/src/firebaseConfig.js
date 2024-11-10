// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_Ua0phZ73ehLB-mCVevEe6TfAmeQSDqo",
  authDomain: "green-travel-planner.firebaseapp.com",
  projectId: "green-travel-planner",
  storageBucket: "green-travel-planner.firebasestorage.app",
  messagingSenderId: "976485957421",
  appId: "1:976485957421:web:d03f80c5ee9838e9af5da4",
  measurementId: "G-SY0KP1JP4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };  // Exporting Auth and signIn function for use in other files