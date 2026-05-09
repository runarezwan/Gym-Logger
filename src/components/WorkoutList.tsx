import React from 'react';
import { Workout } from '@/types';
import WorkoutEntry from './WorkoutEntry';

interface WorkoutListProps {
  workout: Workout;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workout }) => {
  const dateStr = workout.date.toDate().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {dateStr}
        </h3>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {workout.entries.map((entry, index) => (
          <WorkoutEntry key={index} entry={entry} />
        ))}
        {workout.entries.length === 0 && (
          <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No entries for this session.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
