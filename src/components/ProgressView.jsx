// components/ProgressView.jsx
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatShortDate } from '../utils/dates';

const ProgressView = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  const exerciseList = Array.from(new Set(
    workouts.flatMap(workout => 
      workout.exercises
        .filter(ex => ex.type === 'resistance')
        .map(ex => ex.name)
    )
  ));

  const getProgressData = () => {
    if (!selectedExercise) return [];

    return workouts
      .filter(workout => 
        workout.exercises.some(ex => ex.name === selectedExercise)
      )
      .map(workout => {
        const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
        const maxWeight = Math.max(...exercise.sets.map(set => Number(set.weight) || 0));
        const totalVolume = exercise.sets.reduce((sum, set) => 
          sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0
        );

        return {
          date: formatShortDate(new Date(workout.date)),
          maxWeight,
          totalVolume,
          workout: exercise.sets.map(set => `${set.weight}×${set.reps}`).join(', ')
        };
      });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded ${
                timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {exerciseList.map(exercise => (
          <button
            key={exercise}
            onClick={() => setSelectedExercise(exercise)}
            className={`p-4 rounded-lg border ${
              selectedExercise === exercise 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            {exercise}
          </button>
        ))}
      </div>

      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {selectedExercise} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{payload[0].payload.date}</p>
                          <p>Max Weight: {payload[0].payload.maxWeight} lbs</p>
                          <p>Total Volume: {payload[0].payload.totalVolume}</p>
                          <p>Sets: {payload[0].payload.workout}</p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="maxWeight"
                    stroke="#2563eb"
                    name="Max Weight (lbs)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalVolume"
                    stroke="#7c3aed"
                    name="Total Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressView;