import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

function readFirebaseWebConfig(): FirebaseWebConfig {
  // Prefer env-driven config so migrating Firebase projects is a .env change, not a code change.
  // Fallbacks preserve current behavior if env vars aren't set yet.
  const env = import.meta.env as unknown as Record<string, string | undefined>;

  const apiKey = env.VITE_FIREBASE_API_KEY ?? "AIzaSyCpyhrd5ktuYnWVmJoV4NeQouZeXx1itnw";
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN ?? "sapex-open.firebaseapp.com";
  const projectId = env.VITE_FIREBASE_PROJECT_ID ?? "sapex-open";
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET ?? "sapex-open.firebasestorage.app";
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "788307159341";
  const appId = env.VITE_FIREBASE_APP_ID ?? "1:788307159341:web:ebb45b4f764dbd6f698ba4";
  const measurementId = env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-DTW2PSDJ87";

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error("Missing required Firebase web config. Check your VITE_FIREBASE_* environment variables.");
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId: measurementId || undefined,
  };
}

export const firebaseWebConfig = readFirebaseWebConfig();
// Useful when debugging Auth project misconfiguration (e.g. auth/configuration-not-found).
// eslint-disable-next-line no-console
console.info("[firebase] project", {
  projectId: firebaseWebConfig.projectId,
  authDomain: firebaseWebConfig.authDomain,
});

const app = initializeApp(firebaseWebConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");

export let analytics: Analytics | null = null;
void isSupported().then((ok) => {
  if (ok) analytics = getAnalytics(app);
});

export { app };
export { auth, provider };