import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCueypCLEsg-XP7uxfnNp62CH6vlyHNQls",
  authDomain: "waste-watcher-8b3a5.firebaseapp.com",
  projectId: "waste-watcher-8b3a5",
  storageBucket: "waste-watcher-8b3a5.firebasestorage.app",
  messagingSenderId: "615630493507",
  appId: "1:615630493507:web:c290f2f69a13475cefc1f6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);