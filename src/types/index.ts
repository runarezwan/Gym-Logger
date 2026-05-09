import { Timestamp } from 'firebase/firestore';

export interface WorkoutEntry {
  movement: string;
  reps: number;
  weight: number;
}

export interface Workout {
  id?: string;
  date: Timestamp;
  entries: WorkoutEntry[];
  createdAt: Timestamp;
}

export interface WorkoutFormData {
  movement: string;
  reps: string; // use string for form input, convert later
  weight: string;
}
