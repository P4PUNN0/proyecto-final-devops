import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider, facebookProvider } from '../firebase/config'
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthContext = createContext()

const demoUser = { uid: 'demo-user', displayName: 'Usuario Demo', email: 'demo@techloop.com', photoURL: null }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setUser(demoUser)
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = auth ? () => signInWithPopup(auth, googleProvider) : () => { setUser(demoUser) }
  const loginWithFacebook = auth ? () => signInWithPopup(auth, facebookProvider) : () => { setUser(demoUser) }
  const loginWithEmail = auth ? (email, password) => signInWithEmailAndPassword(auth, email, password) : () => { setUser(demoUser) }
  const registerWithEmail = auth ? (email, password) => createUserWithEmailAndPassword(auth, email, password) : () => { setUser(demoUser) }
  const logout = auth ? () => signOut(auth) : () => { setUser(null) }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithFacebook,
      loginWithEmail,
      registerWithEmail,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
