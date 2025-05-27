import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendEmailVerification
} from "firebase/auth";
import { useState, useEffect } from "react";

// Firebase configuration - replace with your actual Firebase config values
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

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user, {
          url: `${window.location.origin}/verify-otp`, // Redirect to OTP verification page
          handleCodeInApp: true,
        });
      }
      
      
      // Get Firebase token for backend integration
      const idToken = await userCredential.user.getIdToken();
      
      // Call your backend to store user in your database
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            email,
            password,
            name,
            firebaseUserId: userCredential.user.uid
          })
        });

        const data = await response.text();
        let jsonData;
        try {
          jsonData = JSON.parse(data);
        } catch (e) {
          console.error('Response is not JSON:', data);
          if (!response.ok) {
            throw new Error(`Backend returned status ${response.status}: ${data}`);
          }
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to register user in backend');
        }
      } catch (backendError: any) {
        console.error('Backend registration error:', backendError);
        // Continue since Firebase registration succeeded
      }
      
      return userCredential.user;
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
// Sign in with email and password
const signin = async (email: string, password: string) => {
  try {
    setLoading(true);
    setError(null);
    
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get Firebase token for backend integration
    // const idToken = await userCredential.user.getIdToken();
    
    // Verify with backend
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${idToken}`
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          email,
          password, // Include the password
          googleAuth: false,
          // firebaseUserId: userCredential.user.uid
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Backend login warning:', errorData);
        // Continue anyway since Firebase login succeeded
      }
    } catch (backendError) {
      console.error('Backend login error:', backendError);
      // Continue since Firebase login succeeded
    }
    
    // return userCredential.user;
    return 
  } catch (err: any) {
    console.error('Signin error:', err);
    setError(err.message);
    throw new Error(err.message);
  } finally {
    setLoading(false);
  }
};

  // Sign in with Google
  const signinWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get Firebase token for backend integration
      const idToken = await result.user.getIdToken();
      const name = result.user.displayName || '';
      const email = result.user.email || '';
      
      // Create or verify user in backend
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
            'google-auth': 'true'
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            name,
            googleAuth: true,
            firebaseUserId: result.user.uid
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn('Backend Google login warning:', errorData);
          // Continue anyway since Firebase login succeeded
        }
      } catch (backendError) {
        console.error('Backend Google login error:', backendError);
        // Continue since Firebase login succeeded
      }
      
      return result.user;
    } catch (err: any) {
      console.error('Google signin error:', err);
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  return {
    currentUser,
    loading,
    error,
    signup,
    signin,
    signinWithGoogle,
    logout
  };
}

export { auth };