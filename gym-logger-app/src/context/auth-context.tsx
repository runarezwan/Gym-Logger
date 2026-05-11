'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  User, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { seedDefaultMovements, getTemplates, createTemplate } from '@/lib/firestore';
import { TemplateEntry } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  loginRedirect: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Auto-seed on first login in background
      if (currentUser) {
         try {
           await seedDefaultMovements(currentUser.uid);
           const templates = await getTemplates(currentUser.uid);
           if (templates.length === 0) {
              const majesticA: TemplateEntry[] = [
                { movementName: 'Squat', reps: 5, weight: 100, unit: 'kg' },
                { movementName: 'Bench Press', reps: 5, weight: 80, unit: 'kg' },
                { movementName: 'Barbell Row', reps: 5, weight: 70, unit: 'kg' }
              ];
              await createTemplate(currentUser.uid, "Majestic Full Body A", majesticA);
              // Add two more Majestic routines
              await createTemplate(currentUser.uid, "Majestic Hypertrophy", [
                { movementName: 'Incline Bench Press', reps: 10, weight: 60, unit: 'kg' },
                { movementName: 'Lat Pulldown', reps: 10, weight: 60, unit: 'kg' },
                { movementName: 'Dumbbell Curl', reps: 12, weight: 15, unit: 'kg' }
              ]);
              await createTemplate(currentUser.uid, "Elite Strength", [
                 { movementName: 'Deadlift', reps: 3, weight: 140, unit: 'kg' },
                 { movementName: 'Overhead Press', reps: 5, weight: 50, unit: 'kg' }
              ]);
           }
         } catch (e) {
            console.error("Auto-seed failed", e);
         }
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginRedirect = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginRedirect, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
