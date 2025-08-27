// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth"; // For Authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6F2UuN2pw0U2yEgNLUoY7ZNbFusNOJ2w",
  authDomain: "spacey-mission.firebaseapp.com",
  projectId: "spacey-mission",
  storageBucket: "spacey-mission.firebasestorage.app",
  messagingSenderId: "535421227159",
  appId: "1:535421227159:web:4a651cd4e68a6b71b619d2",
  measurementId: "G-L7S3F0PXSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);