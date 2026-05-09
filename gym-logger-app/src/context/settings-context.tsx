'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserSettings = {
  unit: 'kg' | 'lbs';
  theme: 'system' | 'light' | 'dark';
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    unit: 'kg',
    theme: 'system',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
       setLoading(false);
       return;
    }
    const fetchSettings = async () => {
      const docRef = doc(db, 'users', user.uid, 'settings', 'current');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSettings(snap.data() as UserSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    const next = { ...settings, ...newSettings };
    setSettings(next);
    const docRef = doc(db, 'users', user.uid, 'settings', 'current');
    await setDoc(docRef, next, { merge: true });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
