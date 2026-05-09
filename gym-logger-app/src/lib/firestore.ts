import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { Workout, WorkoutEntry, Movement, Template, Category, TemplateEntry } from '@/types';

// --- Movements ---

export const getMovements = async (userId: string): Promise<Movement[]> => {
  const colRef = collection(db, 'users', userId, 'movements');
  const snap = await getDocs(query(colRef, orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Movement));
};

export const addCustomMovement = async (userId: string, m: Omit<Movement, 'id'>): Promise<string> => {
  const colRef = collection(db, 'users', userId, 'movements');
  const docRef = await addDoc(colRef, m);
  return docRef.id;
};

export const deleteMovement = async (userId: string, id: string) => {
  const docRef = doc(db, 'users', userId, 'movements', id);
  await deleteDoc(docRef);
};

export const seedDefaultMovements = async (userId: string) => {
  const current = await getMovements(userId);
  if (current.length > 0) return;

  const defaults: Omit<Movement, 'id'>[] = [
    // Legs
    { name: 'Squat', category: 'Legs', isCustom: false },
    { name: 'Front Squat', category: 'Legs', isCustom: false },
    { name: 'Hack Squat', category: 'Legs', isCustom: false },
    { name: 'Leg Press', category: 'Legs', isCustom: false },
    { name: 'Romanian Deadlift', category: 'Legs', isCustom: false },
    { name: 'Walking Lunge', category: 'Legs', isCustom: false },
    { name: 'Bulgarian Split Squat', category: 'Legs', isCustom: false },
    { name: 'Leg Extension', category: 'Legs', isCustom: false },
    { name: 'Leg Curl', category: 'Legs', isCustom: false },
    { name: 'Hip Thrust', category: 'Legs', isCustom: false },
    { name: 'Calf Raise', category: 'Legs', isCustom: false },
    { name: 'Goblet Squat', category: 'Legs', isCustom: false },
    // Back
    { name: 'Deadlift', category: 'Back', isCustom: false },
    { name: 'Barbell Row', category: 'Back', isCustom: false },
    { name: 'Dumbbell Row', category: 'Back', isCustom: false },
    { name: 'Seated Cable Row', category: 'Back', isCustom: false },
    { name: 'T-Bar Row', category: 'Back', isCustom: false },
    { name: 'Pull-Up', category: 'Back', isCustom: false },
    { name: 'Chin-Up', category: 'Back', isCustom: false },
    { name: 'Lat Pulldown', category: 'Back', isCustom: false },
    { name: 'Face Pull', category: 'Back', isCustom: false },
    { name: 'Shrug', category: 'Back', isCustom: false },
    // Chest
    { name: 'Bench Press', category: 'Chest', isCustom: false },
    { name: 'Incline Bench Press', category: 'Chest', isCustom: false },
    { name: 'Dumbbell Bench Press', category: 'Chest', isCustom: false },
    { name: 'Incline Dumbbell Press', category: 'Chest', isCustom: false },
    { name: 'Cable Fly', category: 'Chest', isCustom: false },
    { name: 'Dumbbell Fly', category: 'Chest', isCustom: false },
    { name: 'Chest Dip', category: 'Chest', isCustom: false },
    { name: 'Push-Up', category: 'Chest', isCustom: false },
    { name: 'Machine Chest Press', category: 'Chest', isCustom: false },
    // Shoulders
    { name: 'Overhead Press', category: 'Shoulders', isCustom: false },
    { name: 'Dumbbell Shoulder Press', category: 'Shoulders', isCustom: false },
    { name: 'Arnold Press', category: 'Shoulders', isCustom: false },
    { name: 'Lateral Raise', category: 'Shoulders', isCustom: false },
    { name: 'Front Raise', category: 'Shoulders', isCustom: false },
    { name: 'Reverse Fly', category: 'Shoulders', isCustom: false },
    { name: 'Upright Row', category: 'Shoulders', isCustom: false },
    // Arms
    { name: 'Barbell Curl', category: 'Arms', isCustom: false },
    { name: 'Dumbbell Curl', category: 'Arms', isCustom: false },
    { name: 'Hammer Curl', category: 'Arms', isCustom: false },
    { name: 'Preacher Curl', category: 'Arms', isCustom: false },
    { name: 'Cable Curl', category: 'Arms', isCustom: false },
    { name: 'Tricep Pushdown', category: 'Arms', isCustom: false },
    { name: 'Overhead Tricep Extension', category: 'Arms', isCustom: false },
    { name: 'Skull Crusher', category: 'Arms', isCustom: false },
    { name: 'Close-Grip Bench Press', category: 'Arms', isCustom: false },
    { name: 'Tricep Dip', category: 'Arms', isCustom: false },
    // Core
    { name: 'Plank', category: 'Core', isCustom: false },
    { name: 'Hanging Leg Raise', category: 'Core', isCustom: false },
    { name: 'Cable Crunch', category: 'Core', isCustom: false },
    { name: 'Ab Wheel Rollout', category: 'Core', isCustom: false },
    { name: 'Dead Bug', category: 'Core', isCustom: false },
    { name: 'Russian Twist', category: 'Core', isCustom: false },
    { name: 'Decline Sit-Up', category: 'Core', isCustom: false },
    // Cardio
    { name: 'Running', category: 'Cardio', isCustom: false },
    { name: 'Rowing Machine', category: 'Cardio', isCustom: false },
    { name: 'Stationary Bike', category: 'Cardio', isCustom: false },
    { name: 'Jump Rope', category: 'Cardio', isCustom: false },
    { name: 'Stair Climber', category: 'Cardio', isCustom: false },
  ];

  const batch = writeBatch(db);
  defaults.forEach(d => {
    const docRef = doc(collection(db, 'users', userId, 'movements'));
    batch.set(docRef, d);
  });
  await batch.commit();
};

// --- Workouts ---

export const getTodayWorkout = async (userId: string): Promise<Workout | null> => {
  const today = new Date().toISOString().split('T')[0];
  const colRef = collection(db, 'users', userId, 'workouts');
  const q = query(colRef, where('date', '==', today), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Workout;
};

export const createWorkout = async (userId: string): Promise<string> => {
  const colRef = collection(db, 'users', userId, 'workouts');
  const date = new Date().toISOString().split('T')[0];
  const newW = {
    date,
    entries: [],
    createdAt: Date.now(),
    completed: false
  };
  const docRef = await addDoc(colRef, newW);
  return docRef.id;
};

export const addWorkoutEntry = async (userId: string, workoutId: string, entry: Omit<WorkoutEntry, 'id' | 'createdAt'>): Promise<WorkoutEntry> => {
  const docRef = doc(db, 'users', userId, 'workouts', workoutId);
  const snap = await getDoc(docRef);
  const data = snap.data() as Workout;
  
  const newEntry: WorkoutEntry = {
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    ...entry
  };

  await updateDoc(docRef, {
    entries: [...data.entries, newEntry]
  });

  return newEntry;
};

export const addEntriesToWorkout = async (userId: string, workoutId: string, entries: WorkoutEntry[]) => {
  const docRef = doc(db, 'users', userId, 'workouts', workoutId);
  const snap = await getDoc(docRef);
  const data = snap.data() as Workout;
  
  await updateDoc(docRef, {
    entries: [...data.entries, ...entries]
  });
};

export const updateWorkoutEntry = async (userId: string, workoutId: string, entryId: string, updates: Partial<WorkoutEntry>) => {
  const docRef = doc(db, 'users', userId, 'workouts', workoutId);
  const snap = await getDoc(docRef);
  const data = snap.data() as Workout;
  
  const newEntries = data.entries.map(e => e.id === entryId ? { ...e, ...updates } : e);
  await updateDoc(docRef, { entries: newEntries });
};

export const removeWorkoutEntry = async (userId: string, workoutId: string, entryId: string) => {
  const docRef = doc(db, 'users', userId, 'workouts', workoutId);
  const snap = await getDoc(docRef);
  const data = snap.data() as Workout;
  
  const newEntries = data.entries.filter(e => e.id !== entryId);
  if (newEntries.length === 0) {
    await deleteDoc(docRef);
  } else {
    await updateDoc(docRef, { entries: newEntries });
  }
};

export const finishWorkout = async (userId: string, workoutId: string) => {
  const docRef = doc(db, 'users', userId, 'workouts', workoutId);
  await updateDoc(docRef, { completed: true });
};

export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  const colRef = collection(db, 'users', userId, 'workouts');
  const snap = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Workout))
    .filter(w => w.entries.length > 0);
};

export const removeWorkout = async (userId: string, id: string) => {
  const docRef = doc(db, 'users', userId, 'workouts', id);
  await deleteDoc(docRef);
};

// --- Templates ---

export const getTemplates = async (userId: string): Promise<Template[]> => {
  const colRef = collection(db, 'users', userId, 'templates');
  const snap = await getDocs(query(colRef, orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Template));
};

export const createTemplate = async (userId: string, name: string, entries: TemplateEntry[]): Promise<string> => {
  const colRef = collection(db, 'users', userId, 'templates');
  const count = (await getDocs(colRef)).size;
  const docRef = await addDoc(colRef, {
    name,
    entries,
    createdAt: Date.now(),
    order: count
  });
  return docRef.id;
};

export const deleteTemplate = async (userId: string, id: string) => {
  const docRef = doc(db, 'users', userId, 'templates', id);
  await deleteDoc(docRef);
};

export const reorderTemplates = async (userId: string, updates: { id: string, order: number }[]) => {
  const batch = writeBatch(db);
  updates.forEach(u => {
    const docRef = doc(db, 'users', userId, 'templates', u.id);
    batch.update(docRef, { order: u.order });
  });
  await batch.commit();
};

// --- PRs ---

export const getPRs = async (userId: string): Promise<Record<string, { weight: number, reps: number }>> => {
  const workouts = await getWorkouts(userId);
  const prs: Record<string, { weight: number, reps: number }> = {};
  
  workouts.forEach(w => {
    w.entries.forEach(e => {
      const current = prs[e.movementName];
      if (!current || e.weight > current.weight || (e.weight === current.weight && e.reps > current.reps)) {
        prs[e.movementName] = { weight: e.weight, reps: e.reps };
      }
    });
  });
  
  return prs;
};
