import { Exercise } from '../types/workout';

// Base calorie estimates per rep for different exercise types
const CALORIE_ESTIMATES: Record<string, number> = {
  // Chest exercises (push-ups variations)
  'chest': 0.5,
  // Back exercises (pull-ups, rows)
  'back': 0.6,
  // Arms exercises (dips, curls)
  'arms': 0.4,
  // Legs exercises (squats, lunges)
  'legs': 0.8,
  // Core exercises (planks, crunches)
  'core': 0.3
};

export const calculateCaloriesForExercise = (exercise: Exercise, reps: number): number => {
  const baseCalories = CALORIE_ESTIMATES[exercise.category] || 0.5;
  
  // Adjust based on difficulty
  let difficultyMultiplier = 1;
  switch (exercise.difficulty) {
    case 'Beginner':
      difficultyMultiplier = 0.8;
      break;
    case 'Intermediate':
      difficultyMultiplier = 1.0;
      break;
    case 'Advanced':
      difficultyMultiplier = 1.3;
      break;
    default:
      difficultyMultiplier = 1.0;
  }
  
  return Math.round(baseCalories * reps * difficultyMultiplier * 10) / 10;
};

export const calculateTotalCalories = (exercises: Array<{ exercise: Exercise; totalReps: number }>): number => {
  return exercises.reduce((total, { exercise, totalReps }) => {
    return total + calculateCaloriesForExercise(exercise, totalReps);
  }, 0);
};