// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// (optional) import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6m9KH6KjGphWpwVPTTNDsDyXG9vkrEvk",
  authDomain: "urlife-59445.firebaseapp.com",
  projectId: "urlife-59445",
  storageBucket: "urlife-59445.firebasestorage.app",
  messagingSenderId: "261729585428",
  appId: "1:261729585428:web:61189f887a78e99551da01",
  measurementId: "G-KD6WZDC4HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// (optional) initialize analytics — only works in browser HTTPS
// const analytics = getAnalytics(app);
