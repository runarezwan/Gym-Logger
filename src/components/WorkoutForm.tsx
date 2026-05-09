"use client";

import React, { useState } from 'react';
import { WorkoutEntry } from '@/types';

interface WorkoutFormProps {
  onAdd: (entry: WorkoutEntry) => void;
  lastEntry?: WorkoutEntry;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onAdd, lastEntry }) => {
  const [movement, setMovement] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movement || !reps || !weight) return;

    onAdd({
      movement,
      reps: parseInt(reps),
      weight: parseFloat(weight),
    });

    // Reset reps but keep movement and weight
    setReps('');
  };

  const handleQuickAdd = () => {
    if (lastEntry) {
      onAdd(lastEntry);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
        <div>
          <label htmlFor="movement" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Movement</label>
          <input
            type="text"
            id="movement"
            value={movement}
            onChange={(e) => setMovement(e.target.value)}
            placeholder="e.g. Bench Press"
            className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Reps</label>
            <input
              type="number"
              id="reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="8"
              className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              required
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="80"
              className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-transparent shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Set
        </button>
      </form>

      {lastEntry && (
        <button
          onClick={handleQuickAdd}
          className="w-full py-2 px-4 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          Repeat Last: {lastEntry.movement} ({lastEntry.reps} x {lastEntry.weight}kg)
        </button>
      )}
    </div>
  );
};

export default WorkoutForm;
