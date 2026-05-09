"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutList from '@/components/WorkoutList';
import { Workout, WorkoutEntry } from '@/types';
import { getTodaysWorkout, addWorkoutEntry } from '@/lib/firebase';

export default function Home() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkout = async () => {
    try {
      const data = await getTodaysWorkout();
      setWorkout(data);
    } catch (error) {
      console.error("Error fetching today's workout:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, []);

  const handleAddEntry = async (entry: WorkoutEntry) => {
    try {
      // Optimistic update
      if (workout) {
        setWorkout({
          ...workout,
          entries: [...workout.entries, entry],
        });
      } else {
        // Just show a temporary state if it's the first entry
        // In a real app, we'd wait or show a loading state
      }

      await addWorkoutEntry(entry);
      // Re-fetch to sync with server
      await fetchWorkout();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 pb-20 font-sans">
      <header className="max-w-3xl mx-auto flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Gym Logger
        </h1>
        <Link 
          href="/history"
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          History
        </Link>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Add New Set
          </h2>
          <WorkoutForm 
            onAdd={handleAddEntry} 
            lastEntry={workout?.entries && workout.entries.length > 0 ? workout.entries[workout.entries.length - 1] : undefined}
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Today&apos;s Session
          </h2>
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading...</div>
          ) : workout ? (
            <WorkoutList workout={workout} />
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 text-center text-zinc-500 border border-zinc-100 dark:border-zinc-800">
              No sets logged today. Let&apos;s get to work!
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
