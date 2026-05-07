import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const isConfigured = (val) => val && !val.startsWith('YOUR_') && !val.startsWith('your_')

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const hasValidConfig = Object.values(firebaseConfig).every(isConfigured)

let app, auth, analytics, googleProvider, facebookProvider, emailProvider

if (hasValidConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
  googleProvider = new GoogleAuthProvider()
  facebookProvider = new FacebookAuthProvider()
  emailProvider = new EmailAuthProvider()
} else {
  app = null
  auth = null
  analytics = null
  googleProvider = null
  facebookProvider = null
  emailProvider = null
}

export { auth, googleProvider, facebookProvider, emailProvider }
export default app
