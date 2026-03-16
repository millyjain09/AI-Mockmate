import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-mockmate-50a9b.firebaseapp.com",
  projectId: "ai-mockmate-50a9b",
  storageBucket: "ai-mockmate-50a9b.firebasestorage.app",
  messagingSenderId: "688054416977",
  appId: "1:688054416977:web:2448b954b9d17794a2ea70"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


