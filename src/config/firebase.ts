import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Initialize Firebase only if config is provided
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  // Check if Firebase config is provided
  const hasConfig = firebaseConfig.apiKey && 
                    firebaseConfig.projectId && 
                    firebaseConfig.authDomain;

  if (hasConfig) {
    // Initialize Firebase only if not already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } else {
      app = getApps()[0];
      console.log("Using existing Firebase app");
    }

    // Initialize Firestore
    db = getFirestore(app);
    console.log("Firestore initialized");

    // Initialize Storage
    storage = getStorage(app);
    console.log("Firebase Storage initialized");
  } else {
    console.warn("Firebase config not provided. Using localStorage only.");
  }
} catch (error) {
  console.warn("Firebase initialization failed. Using localStorage only.", error);
  // Set to null to indicate Firebase is not available
  app = null;
  db = null;
  storage = null;
}

export { db, storage };
export default app;

