import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth context type
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<User>;
  signin: (email: string, password: string) => Promise<User>;
  signinWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Signup with Firebase + backend database
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      // Get Firebase token
      const idToken = await userCredential.user.getIdToken();
      
      // Create user in your backend database
      await axios.post('/api/signup', {
        email,
        password,
        name,
        firebaseUserId: userCredential.user.uid,
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      return userCredential.user;
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // If user was created in Firebase but not in backend, delete Firebase account
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      
      setError(err.response?.data?.error || err.message || 'Failed to create account');
      throw new Error(err.response?.data?.error || err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Firebase + backend
  const signin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get Firebase token
      const idToken = await userCredential.user.getIdToken();
      
      // Verify with backend and get your JWT token
      await axios.post('/api/signin', {
        email,
        password,
        firebaseUserId: userCredential.user.uid,
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      return userCredential.user;
    } catch (err: any) {
      console.error('Signin error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to sign in');
      throw new Error(err.response?.data?.error || err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signinWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Google through Firebase
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get Firebase token
      const idToken = await result.user.getIdToken();
      const name = result.user.displayName || '';
      const email = result.user.email || '';
      
      // Create or verify user in backend
      await axios.post('/api/signin', {
        email,
        name,
        googleAuth: true,
        firebaseUserId: result.user.uid,
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      return result.user;
    } catch (err: any) {
      console.error('Google signin error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to sign in with Google');
      throw new Error(err.response?.data?.error || err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  // Logout from Firebase
  const logout = async () => {
    setError(null);
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    signin,
    signinWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}