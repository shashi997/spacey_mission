import { useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useStore } from '../../../state/store'; 


export const useAuth = () => {
  const setUser = useStore(state => state.setUser);
  const user = useStore(state => state.user);
  const isLoading = useStore(state => state.isLoading);
  const setIsLoading = useStore(state => state.setIsLoading);

  useEffect(() => {
    // Set up a listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  // Provide functions for components to use
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return { user, isLoading, login, signup, logout, resetPassword };
};
