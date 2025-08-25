import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  isLoading: true, // Initial loading state while checking auth
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));