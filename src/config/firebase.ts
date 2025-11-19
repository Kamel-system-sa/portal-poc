import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase with error handling
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

try {
  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length === 0) {
    // Only initialize if we have real config values (not demo values)
    const hasRealConfig = 
      firebaseConfig.apiKey !== "demo-api-key" &&
      firebaseConfig.projectId !== "demo-project" &&
      firebaseConfig.authDomain !== "demo-project.firebaseapp.com";
    
    if (hasRealConfig) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log("Firebase initialized successfully");
    } else {
      console.warn("Firebase is using demo values. Please configure Firebase with real values.");
    }
  } else {
    app = existingApps[0];
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase already initialized");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  console.warn("Firebase is not properly configured. Please add your Firebase config.");
  // Don't throw error to prevent app crash
  // The app will still work, but Firebase features won't be available
}

export { db, storage };
export default app;

