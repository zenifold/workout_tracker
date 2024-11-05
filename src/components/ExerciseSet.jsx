// components/ExerciseSet.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ExerciseSet = ({ set, onUpdate, onComplete }) => (
  <div className="grid grid-cols-4 gap-2 items-center">
    <div className="text-sm text-gray-500">Set {set.setNumber}</div>
    <input
      type="number"
      placeholder="Weight"
      className="p-2 border rounded"
      value={set.weight}
      onChange={(e) => onUpdate(set.setNumber, 'weight', e.target.value)}
    />
    <input
      type="number"
      placeholder="Reps"
      className="p-2 border rounded"
      value={set.reps || set.defaultReps}
      onChange={(e) => onUpdate(set.setNumber, 'reps', e.target.value)}
    />
    <button
      className={`p-2 rounded ${set.completed ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
      onClick={() => onComplete(set.setNumber)}
    >
      <CheckCircle className={`w-5 h-5 ${set.completed ? 'text-white' : 'text-gray-400'}`} />
    </button>
  </div>
);

export default ExerciseSet;