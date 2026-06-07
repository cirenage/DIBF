
'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

/**
 * Ensures Firebase is initialized only once on the client and handles SSR safely.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp | null;
    db: Firestore | null;
    auth: Auth | null;
    storage: FirebaseStorage | null;
  }>({ app: null, db: null, auth: null, storage: null });

  useEffect(() => {
    // Only initialize on the client
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  return (
    <FirebaseProvider 
      app={firebase.app} 
      db={firebase.db} 
      auth={firebase.auth} 
      storage={firebase.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
