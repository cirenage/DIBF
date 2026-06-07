/**
 * Firebase configuration object.
 * Values are pulled from environment variables.
 * NEXT_PUBLIC_ prefix ensures these are available on the client.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Validates that the core Firebase configuration is present.
 */
export const isFirebaseConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
