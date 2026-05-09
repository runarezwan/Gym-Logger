import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  arrayUnion
} from "firebase/firestore";
import { Workout, WorkoutEntry } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export async function getTodaysWorkout(): Promise<Workout | null> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const workoutsRef = collection(db, "workouts");
  const q = query(
    workoutsRef,
    where("date", ">=", Timestamp.fromDate(startOfDay)),
    where("date", "<=", Timestamp.fromDate(endOfDay)),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const docData = querySnapshot.docs[0].data();
  return { id: querySnapshot.docs[0].id, ...docData } as Workout;
}

export async function addWorkoutEntry(entry: WorkoutEntry): Promise<void> {
  const todayWorkout = await getTodaysWorkout();

  if (todayWorkout && todayWorkout.id) {
    const workoutRef = doc(db, "workouts", todayWorkout.id);
    await updateDoc(workoutRef, {
      entries: arrayUnion(entry)
    });
  } else {
    await addDoc(collection(db, "workouts"), {
      date: Timestamp.now(),
      createdAt: Timestamp.now(),
      entries: [entry]
    });
  }
}

export async function getWorkoutHistory(): Promise<Workout[]> {
  const workoutsRef = collection(db, "workouts");
  const q = query(workoutsRef, orderBy("date", "desc"), limit(20));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
}
