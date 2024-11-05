// components/Exercise.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import ExerciseSet from './ExerciseSet';

const Exercise = ({ exercise, onUpdateSet, onCompleteSet }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{exercise.name}</CardTitle>
    </CardHeader>
    <CardContent>
      {exercise.type === 'resistance' ? (
        <div className="space-y-4">
          {exercise.sets.map((set) => (
            <ExerciseSet
              key={set.setNumber}
              set={set}
              onUpdate={onUpdateSet}
              onComplete={onCompleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span>Duration: {exercise.duration} minutes</span>
          <button
            className={`p-2 rounded ${exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            onClick={() => onCompleteSet()}
          >
            <CheckCircle className={`w-5 h-5 ${exercise.completed ? 'text-white' : 'text-gray-400'}`} />
          </button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default Exercise;