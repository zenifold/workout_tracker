// constants/programs.js
export const WORKOUT_PROGRAMS = {
    STRENGTH: {
      name: 'Strength & Cardio',
      exercises: [
        { 
          name: "Barbell Squats", 
          type: "resistance", 
          defaultSets: Array(3).fill().map((_, i) => ({ 
            setNumber: i + 1, 
            defaultReps: 15, 
            weight: '' 
          }))
        },
        { 
          name: "Bench Press", 
          type: "resistance", 
          defaultSets: Array(3).fill().map((_, i) => ({ 
            setNumber: i + 1, 
            defaultReps: 15, 
            weight: '' 
          }))
        },
        { name: "HIIT Treadmill", type: "cardio", duration: 20 }
      ]
    },
    HYPERTROPHY: {
      name: 'Hypertrophy Focus',
      exercises: [
        { 
          name: "Leg Press",
          type: "resistance",
          defaultSets: Array(3).fill().map((_, i) => ({ 
            setNumber: i + 1, 
            defaultReps: 15, 
            weight: '' 
          }))
        },
        { 
          name: "Cable Flyes",
          type: "resistance",
          defaultSets: Array(3).fill().map((_, i) => ({ 
            setNumber: i + 1, 
            defaultReps: 15, 
            weight: '' 
          }))
        },
        { name: "Stair Climber", type: "cardio", duration: 15 }
      ]
    }
  };
  
  export const ADDITIONAL_EXERCISES = [
    { 
      name: "Dumbbell Press",
      type: "resistance",
      defaultSets: Array(3).fill().map((_, i) => ({ 
        setNumber: i + 1, 
        defaultReps: 15, 
        weight: '' 
      }))
    },
    { name: "Cycling", type: "cardio", duration: 20 }
  ];