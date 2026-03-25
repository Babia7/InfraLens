import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

export type FirebaseEnv = {
  VITE_ENABLE_AUTH?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
};

export const hasRequiredFirebaseConfig = (env: FirebaseEnv): boolean => {
  const required = [
    env.VITE_FIREBASE_API_KEY,
    env.VITE_FIREBASE_AUTH_DOMAIN,
    env.VITE_FIREBASE_PROJECT_ID,
    env.VITE_FIREBASE_APP_ID,
  ];

  return required.every((value) => typeof value === 'string' && value.trim().length > 0);
};

export const isAuthFeatureEnabled = (env: FirebaseEnv): boolean => {
  return env.VITE_ENABLE_AUTH === 'true' && hasRequiredFirebaseConfig(env);
};

const env = import.meta.env as unknown as FirebaseEnv;

export const authEnabled = isAuthFeatureEnabled(env);

let auth: Auth | null = null;

if (authEnabled) {
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };
