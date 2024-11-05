// components/WorkoutTracker.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Dumbbell, Activity, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Exercise } from './Exercise';
import { ProgressView } from './ProgressView';
import { HistoryView } from './HistoryView';
import { WORKOUT_PROGRAMS, ADDITIONAL_EXERCISES } from '../constants/programs';
import { formatDate } from '../utils/dates';

const AddExerciseModal = ({ isOpen, onClose, onAdd, searchTerm, setSearchTerm }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Exercise</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {ADDITIONAL_EXERCISES
            .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(exercise => (
              <button
                key={exercise.name}
                className="w-full p-3 text-left border rounded hover:bg-gray-50"
                onClick={() => {
                  onAdd(exercise);
                  onClose();
                }}
              >
                {exercise.name}
              </button>
            ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ProgramView = ({ currentProgram, todaysWorkout, onUpdateSet, onCompleteSet, onSelectProgram }) => {
  if (!currentProgram) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium mb-4">Select a workout program:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(WORKOUT_PROGRAMS).map(([key, program]) => (
            <Card
              key={key}
              className="cursor-pointer hover:border-blue-500"
              onClick={() => onSelectProgram(key)}
            >
              <CardHeader>
                <CardTitle>{program.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  {program.exercises.map(ex => (
                    <li key={ex.name}>{ex.name}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium">
        {WORKOUT_PROGRAMS[currentProgram].name}
      </h3>
      {todaysWorkout.exercises.map((exercise, index) => (
        <Exercise
          key={`${exercise.name}-${index}`}
          exercise={exercise}
          onUpdateSet={(setNumber, field, value) => onUpdateSet(index, setNumber, field, value)}
          onCompleteSet={(setNumber) => onCompleteSet(index, setNumber)}
        />
      ))}
    </div>
  );
};

export default function WorkoutTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const selectProgram = (programKey) => {
    const program = WORKOUT_PROGRAMS[programKey];
    setCurrentProgram(programKey);
    const newWorkout = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      program: programKey,
      exercises: program.exercises.map(ex => ({
        ...ex,
        completed: false,
        sets: ex.type === 'resistance' 
          ? ex.defaultSets.map(set => ({
              ...set,
              completed: false,
              reps: set.defaultReps
            }))
          : []
      }))
    };
    setTodaysWorkout(newWorkout);
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const handleUpdateSet = (exerciseIndex, setNumber, field, value) => {
    setTodaysWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.exercises[exerciseIndex];
      const setIndex = exercise.sets.findIndex(s => s.setNumber === setNumber);
      exercise.sets[setIndex] = {
        ...exercise.sets[setIndex],
        [field]: value
      };
      return newWorkout;
    });

    setWorkouts(prev => {
      return prev.map(workout => 
        workout.id === todaysWorkout.id ? todaysWorkout : workout
      );
    });
  };

  const handleCompleteSet = (exerciseIndex, setNumber) => {
    setTodaysWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.exercises[exerciseIndex];
      if (exercise.type === 'resistance') {
        const setIndex = exercise.sets.findIndex(s => s.setNumber === setNumber);
        exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed;
      } else {
        exercise.completed = !exercise.completed;
      }
      return newWorkout;
    });

    setWorkouts(prev => {
      return prev.map(workout => 
        workout.id === todaysWorkout.id ? todaysWorkout : workout
      );
    });
  };

  const handleAddExercise = (exercise) => {
    setTodaysWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        ...exercise,
        completed: false,
        sets: exercise.type === 'resistance' 
          ? exercise.defaultSets.map(set => ({
              ...set,
              completed: false,
              reps: set.defaultReps
            }))
          : []
      }]
    }));
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setCurrentProgram(null);
    setTodaysWorkout(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => changeDate(-1)} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
            <button onClick={() => changeDate(1)} className="p-2">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {currentProgram && (
            <button
              onClick={() => setShowExerciseModal(true)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="program" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 bg-white border-b">
          <TabsTrigger value="program" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Program
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="program" className="mt-0">
            <ProgramView
              currentProgram={currentProgram}
              todaysWorkout={todaysWorkout}
              onUpdateSet={handleUpdateSet}
              onCompleteSet={handleCompleteSet}
              onSelectProgram={selectProgram}
            />
          </TabsContent>
          <TabsContent value="progress" className="mt-0">
            <ProgressView workouts={workouts} />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <HistoryView workouts={workouts} />
          </TabsContent>
        </div>
      </Tabs>

      <AddExerciseModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onAdd={handleAddExercise}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}