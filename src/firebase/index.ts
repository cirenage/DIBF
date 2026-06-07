'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigValid } from './config';

/**
 * Initializes Firebase services safely.
 */
export function initializeFirebase() {
  if (!isFirebaseConfigValid) {
    console.error("Firebase config is invalid. Check .env.local");
    return { app: null, db: null, auth: null, storage: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    // Debugging connection
    if (typeof window !== 'undefined') {
      console.log("Firebase Initialized for project:", firebaseConfig.projectId);
    }

    return { app, db, auth, storage };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return { app: null, db: null, auth: null, storage: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './errors';
export * from './error-emitter';