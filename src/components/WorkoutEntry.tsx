import React from 'react';
import { WorkoutEntry as WorkoutEntryType } from '@/types';

interface WorkoutEntryProps {
  entry: WorkoutEntryType;
}

const WorkoutEntry: React.FC<WorkoutEntryProps> = ({ entry }) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.movement}</span>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {entry.reps} reps
        </span>
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {entry.weight} kg
        </span>
      </div>
    </div>
  );
};

export default WorkoutEntry;
