import { Exercise } from "../types/workout";

const DEFAULT_WEIGHT_KG = 64;
// MET values for common exercise categories
const MET_VALUES: Record<string, number> = {
  chest: 8.0, // push-ups
  back: 5.0, // rows, pull-ups
  arms: 3.8, // curls, dips
  legs: 5.0, // squats, lunges
  core: 3.8, // crunches, sit-ups
  jumping: 8.0, // jumping jacks
  plank: 3.3,
};

export function calculateCaloriesForExercise(
  exercise: Exercise,
  repsOrSeconds: number,
  weightKg: number = DEFAULT_WEIGHT_KG
): number {
  // Estimate time for rep-based exercises (e.g., 2 seconds per rep)
  let seconds = repsOrSeconds;
  if (exercise.timerType !== "hold") {
    seconds = repsOrSeconds * 2; // 2 seconds per rep
  }
  const met = MET_VALUES[exercise.category] || 4.0;
  const calories = ((met * 3.5 * weightKg) / 200) * (seconds / 60);
  // Optionally apply difficulty multiplier as before
  let difficultyMultiplier = 1;
  switch (exercise.difficulty) {
    case "Beginner":
      difficultyMultiplier = 0.8;
      break;
    case "Intermediate":
      difficultyMultiplier = 1.0;
      break;
    case "Advanced":
      difficultyMultiplier = 1.2;
      break;
    default:
      difficultyMultiplier = 1.0;
  }
  return Math.round(calories * difficultyMultiplier * 10) / 10;
}

export const calculateTotalCalories = (
  exercises: Array<{ exercise: Exercise; totalReps: number }>,
  weightKg: number = DEFAULT_WEIGHT_KG
): number => {
  return exercises.reduce((total, { exercise, totalReps }) => {
    return total + calculateCaloriesForExercise(exercise, totalReps, weightKg);
  }, 0);
};
