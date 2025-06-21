export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles?: string[];
  caloriesPerRep?: number;
  section?: string; // Add section for grouping exercises
}

export interface WorkoutSet {
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  totalReps: number;
  totalCalories: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutType: string;
  exercises: ExerciseLog[];
  totalDuration: number; // in minutes
  totalCalories: number;
  totalSets: number;
  totalReps: number;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  shortDay: string;
  workout: string;
  description: string;
  exercises: Exercise[];
}