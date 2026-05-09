"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WorkoutList from '@/components/WorkoutList';
import { Workout } from '@/types';
import { getWorkoutHistory } from '@/lib/firebase';

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getWorkoutHistory();
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 pb-20 font-sans">
      <header className="max-w-3xl mx-auto flex justify-between items-center py-6">
        <Link 
          href="/"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:underline flex items-center gap-2"
        >
          <span>&larr;</span> Back to Today
        </Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          History
        </h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <section>
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading history...</div>
          ) : workouts.length > 0 ? (
            workouts.map((workout) => (
              <WorkoutList key={workout.id} workout={workout} />
            ))
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 text-center text-zinc-500 border border-zinc-100 dark:border-zinc-800">
              No workout history found. Start logging!
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
