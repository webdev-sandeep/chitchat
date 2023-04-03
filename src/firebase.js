import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SOME_API_KEY,
  authDomain: import.meta.env.VITE_SOME_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_SOME_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SOME_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SOME_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SOME_APP_ID,
  measurementId: import.meta.env.VITE_SOME_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
