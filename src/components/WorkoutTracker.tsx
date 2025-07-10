import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Save,
  Timer,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
  Flame,
  Clock,
} from "lucide-react";
import { Exercise, ExerciseLog, WorkoutSession } from "../types/workout";
import { calculateCaloriesForExercise } from "../utils/calories";
import { saveWorkoutSession } from "../utils/firebaseStorage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WorkoutTrackerProps {
  exercises: Exercise[];
  workoutType: string;
  onSave?: (session: WorkoutSession) => void;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  exercises,
  workoutType,
  onSave,
}) => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize exercise logs
  useEffect(() => {
    const initialLogs = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [
        {
          reps: 0,
          duration:
            exercise.timerType === "hold"
              ? exercise.defaultDuration || 30
              : undefined,
          completed: false,
        },
      ],
      totalReps: 0,
      totalCalories: 0,
      notes: "",
    }));
    setExerciseLogs(initialLogs);
  }, [exercises]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const startWorkout = () => {
    setIsActive(true);
    setStartTime(new Date());
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const quickSetReps = (
    exerciseIndex: number,
    setIndex: number,
    reps: number
  ) => {
    const updatedLogs = [...exerciseLogs];
    const exercise = exercises[exerciseIndex];

    if (exercise.timerType === "hold") {
      // For timer-based exercises, set duration instead of reps
      updatedLogs[exerciseIndex].sets[setIndex] = {
        ...updatedLogs[exerciseIndex].sets[setIndex],
        duration: reps, // Use reps value as duration for timer-based exercises
        completed: true,
      };
    } else {
      // For rep-based exercises, set reps
      updatedLogs[exerciseIndex].sets[setIndex] = {
        ...updatedLogs[exerciseIndex].sets[setIndex],
        reps: reps,
        completed: true,
      };
    }

    // Recalculate totals
    const totalReps = updatedLogs[exerciseIndex].sets.reduce((sum, set) => {
      if (set.completed) {
        return (
          sum + (exercise.timerType === "hold" ? set.duration || 0 : set.reps)
        );
      }
      return sum;
    }, 0);
    updatedLogs[exerciseIndex].totalReps = totalReps;
    updatedLogs[exerciseIndex].totalCalories = calculateCaloriesForExercise(
      exercise,
      totalReps
    );

    setExerciseLogs(updatedLogs);
  };

  const adjustReps = (
    exerciseIndex: number,
    setIndex: number,
    adjustment: number
  ) => {
    const updatedLogs = [...exerciseLogs];
    const exercise = exercises[exerciseIndex];

    if (exercise.timerType === "hold") {
      // For timer-based exercises, adjust duration
      const currentDuration =
        updatedLogs[exerciseIndex].sets[setIndex].duration || 30;
      const newDuration = Math.max(5, currentDuration + adjustment);
      updatedLogs[exerciseIndex].sets[setIndex] = {
        ...updatedLogs[exerciseIndex].sets[setIndex],
        duration: newDuration,
      };
    } else {
      // For rep-based exercises, adjust reps
      const currentReps = updatedLogs[exerciseIndex].sets[setIndex].reps;
      const newReps = Math.max(0, currentReps + adjustment);
      updatedLogs[exerciseIndex].sets[setIndex] = {
        ...updatedLogs[exerciseIndex].sets[setIndex],
        reps: newReps,
      };
    }

    // Recalculate totals
    const totalReps = updatedLogs[exerciseIndex].sets.reduce((sum, set) => {
      if (set.completed) {
        return (
          sum + (exercise.timerType === "hold" ? set.duration || 0 : set.reps)
        );
      }
      return sum;
    }, 0);
    updatedLogs[exerciseIndex].totalReps = totalReps;
    updatedLogs[exerciseIndex].totalCalories = calculateCaloriesForExercise(
      exercise,
      totalReps
    );

    setExerciseLogs(updatedLogs);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const updatedLogs = [...exerciseLogs];
    const currentSet = updatedLogs[exerciseIndex].sets[setIndex];
    const exercise = exercises[exerciseIndex];

    updatedLogs[exerciseIndex].sets[setIndex] = {
      ...currentSet,
      completed: !currentSet.completed,
    };

    // Recalculate totals
    const totalReps = updatedLogs[exerciseIndex].sets.reduce((sum, set) => {
      if (set.completed) {
        return (
          sum + (exercise.timerType === "hold" ? set.duration || 0 : set.reps)
        );
      }
      return sum;
    }, 0);
    updatedLogs[exerciseIndex].totalReps = totalReps;
    updatedLogs[exerciseIndex].totalCalories = calculateCaloriesForExercise(
      exercise,
      totalReps
    );

    setExerciseLogs(updatedLogs);
  };

  const saveWorkout = async () => {
    if (!startTime) return;

    setIsSaving(true);

    try {
      const totalCalories = exerciseLogs.reduce(
        (sum, log) => sum + log.totalCalories,
        0
      );
      const totalSets = exerciseLogs.reduce(
        (sum, log) => sum + log.sets.filter((set) => set.completed).length,
        0
      );
      const totalReps = exerciseLogs.reduce(
        (sum, log) => sum + log.totalReps,
        0
      );

      // Sanitize sets: remove undefined duration
      const sanitizedExercises = exerciseLogs
        .filter((log) => log.totalReps > 0)
        .map((log) => ({
          ...log,
          sets: log.sets.map((set) => {
            const newSet = { ...set };
            if (typeof newSet.duration === "undefined") {
              delete newSet.duration;
            }
            return newSet;
          }),
        }));

      const session: WorkoutSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        workoutType,
        exercises: sanitizedExercises,
        totalDuration: Math.floor(elapsedTime / 60),
        totalCalories: Math.round(totalCalories * 10) / 10,
        totalSets,
        totalReps,
      };

      await saveWorkoutSession(session);
      if (onSave) {
        onSave(session);
      }
      // Stop and reset timer and logs
      setIsActive(false);
      setStartTime(null);
      setElapsedTime(0);
      // Re-initialize exercise logs
      const initialLogs = exercises.map((exercise) => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [
          {
            reps: 0,
            duration:
              exercise.timerType === "hold"
                ? exercise.defaultDuration || 30
                : undefined,
            completed: false,
          },
        ],
        totalReps: 0,
        totalCalories: 0,
        notes: "",
      }));
      setExerciseLogs(initialLogs);
      toast.success("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalCalories = exerciseLogs.reduce(
    (sum, log) => sum + log.totalCalories,
    0
  );
  const completedSets = exerciseLogs.reduce(
    (sum, log) => sum + log.sets.filter((set) => set.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Fixed Header */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="p-0">
          <div className="flex items-center justify-between p-3">
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {workoutType}
              </h2>
              <p className="text-xs text-gray-600">Workout Tracker</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg">
                <div className="flex items-center gap-1 text-sm font-bold text-blue-700">
                  <Clock size={14} />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-0 p-3 pt-0">
            {!isActive ? (
              <button
                onClick={startWorkout}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Play size={18} />
                Start Workout
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Pause size={18} />
                Pause
              </button>
            )}

            <button
              onClick={saveWorkout}
              disabled={
                !startTime ||
                exerciseLogs.every((log) => log.totalReps === 0) ||
                isSaving
              }
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-0 p-3 pt-0">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-orange-700">
                <Flame size={14} />
                <span>{Math.round(totalCalories * 10) / 10}</span>
              </div>
              <p className="text-xs text-orange-600 font-medium">Calories</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-green-700">
                <Target size={14} />
                <span>{completedSets}</span>
              </div>
              <p className="text-xs text-green-600 font-medium">Sets Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-0 space-y-0">
        {exerciseLogs.map((log, exerciseIndex) => {
          const exercise = exercises[exerciseIndex];
          const isActive = activeExercise === exerciseIndex;
          const isTimerBased = exercise.timerType === "hold";

          return (
            <div
              key={log.exerciseId}
              className={`bg-white border-b border-gray-100 transition-all duration-300 overflow-hidden ${
                isActive ? "ring-2 ring-blue-400 shadow-lg" : "hover:shadow-lg"
              }`}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 mb-1 truncate">
                      {log.exerciseName}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {isTimerBased
                          ? `${log.totalReps}s`
                          : `${log.totalReps} reps`}
                      </span>
                      <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round(log.totalCalories * 10) / 10} cal
                      </span>
                      <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {log.sets.filter((set) => set.completed).length}/
                        {log.sets.length} sets
                      </span>
                      {isTimerBased && (
                        <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          <Timer size={10} className="inline mr-1" />
                          Timer
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setActiveExercise(isActive ? null : exerciseIndex)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                    }`}
                  >
                    {isActive ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    <span className="text-xs font-semibold">
                      {isActive ? "Hide" : "Track"}
                    </span>
                  </button>
                </div>

                {isActive && (
                  <div className="flex flex-col items-center justify-between min-h-[60vh] w-full py-6">
                    {/* Timer at top center */}
                    <div className="w-full flex flex-col items-center mb-4">
                      <div className="flex justify-center w-full mb-4">
                        <div className="bg-white rounded-full shadow px-6 py-2 text-lg font-bold text-gray-800">
                          {formatTime(elapsedTime)}
                        </div>
                      </div>
                      {/* Placeholder image and exercise name */}
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                          <span className="text-5xl text-gray-400">🏋️</span>
                        </div>
                        <div className="text-2xl font-bold text-center mb-2">
                          {exercise.name}
                        </div>
                      </div>
                    </div>
                    {/* Reps logging input */}
                    <div className="flex flex-col items-center w-full mt-4">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <button
                          onClick={() => adjustReps(exerciseIndex, 0, -1)}
                          className="bg-gray-200 rounded-full p-3 text-2xl font-bold text-gray-600 hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={log.sets[0].reps}
                          onChange={(e) =>
                            quickSetReps(
                              exerciseIndex,
                              0,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 text-center text-2xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                        />
                        <button
                          onClick={() => adjustReps(exerciseIndex, 0, 1)}
                          className="bg-gray-200 rounded-full p-3 text-2xl font-bold text-gray-600 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center w-full mt-8">
                      <button
                        onClick={() => setActiveExercise(exerciseIndex - 1)}
                        disabled={exerciseIndex === 0}
                        className="flex-1 text-left text-blue-600 font-semibold text-lg px-2 disabled:text-gray-400"
                      >
                        ⏮ Previous
                      </button>
                      <button
                        onClick={() => {
                          toggleSetComplete(exerciseIndex, 0);
                          setActiveExercise(exerciseIndex + 1);
                        }}
                        className="flex-1 mx-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg shadow"
                      >
                        ✓ Done
                      </button>
                      <button
                        onClick={() => setActiveExercise(exerciseIndex + 1)}
                        disabled={exerciseIndex === exercises.length - 1}
                        className="flex-1 text-right text-blue-600 font-semibold text-lg px-2 disabled:text-gray-400"
                      >
                        Skip ⏭
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
