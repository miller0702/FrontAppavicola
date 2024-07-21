import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: `${import.meta.env.FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.FIREBASE_APP_ID}`,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };