// components/HistoryView.jsx
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WORKOUT_PROGRAMS } from '../constants/programs';
import { 
  formatDate, 
  formatShortDate, 
  getStartOfWeek, 
  getEndOfWeek, 
  addWeeks, 
  subWeeks 
} from '../utils/dates';

const HistoryView = ({ workouts }) => {
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date();
    return {
      start: getStartOfWeek(now),
      end: getEndOfWeek(now)
    };
  });

  const changeWeek = (direction) => {
    setSelectedWeek(prev => ({
      start: direction === 'next' 
        ? addWeeks(prev.start, 1) 
        : subWeeks(prev.start, 1),
      end: direction === 'next' 
        ? addWeeks(prev.end, 1) 
        : subWeeks(prev.end, 1)
    }));
  };

  const weeklyWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= selectedWeek.start && workoutDate <= selectedWeek.end;
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => changeWeek('prev')} className="p-2">
            <ChevronLeft />
          </button>
          <span className="font-medium">
            {formatShortDate(selectedWeek.start)} - {formatShortDate(selectedWeek.end)}
          </span>
          <button onClick={() => changeWeek('next')} className="p-2">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {weeklyWorkouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {formatDate(new Date(workout.date))}
                </CardTitle>
                <span className="text-sm text-gray-500">
                  {WORKOUT_PROGRAMS[workout.program].name}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.name} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-2">{exercise.name}</h3>
                    {exercise.type === 'resistance' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Sets</div>
                          <div className="mt-1">
                            {exercise.sets.map((set, idx) => (
                              <div key={idx} className="text-sm">
                                Set {set.setNumber}: {set.weight}lbs × {set.reps} reps
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Volume</div>
                          <div className="mt-1">
                            {exercise.sets.reduce((sum, set) => 
                              sum + (Number(set.weight) * Number(set.reps)), 0
                            )} total lbs
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        Duration: {exercise.duration} minutes
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {weeklyWorkouts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No workouts recorded this week
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;