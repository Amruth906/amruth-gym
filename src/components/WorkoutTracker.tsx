import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Play,
  Pause,
  Save,
  Timer,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
  Flame,
  Clock,
} from "lucide-react";
import {
  Exercise,
  WorkoutSet,
  ExerciseLog,
  WorkoutSession,
} from "../types/workout";
import { calculateCaloriesForExercise } from "../utils/calories";
import {
  saveWorkoutSession,
  migrateFromLocalStorage,
} from "../utils/firebaseStorage";

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
  const [notes, setNotes] = useState("");
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize exercise logs
  useEffect(() => {
    const initialLogs = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [{ reps: 0, completed: false }],
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
    updatedLogs[exerciseIndex].sets[setIndex] = {
      ...updatedLogs[exerciseIndex].sets[setIndex],
      reps: reps,
      completed: true,
    };

    // Recalculate totals
    const exercise = exercises[exerciseIndex];
    const totalReps = updatedLogs[exerciseIndex].sets.reduce(
      (sum, set) => sum + (set.completed ? set.reps : 0),
      0
    );
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
    const currentReps = updatedLogs[exerciseIndex].sets[setIndex].reps;
    const newReps = Math.max(0, currentReps + adjustment);

    updatedLogs[exerciseIndex].sets[setIndex] = {
      ...updatedLogs[exerciseIndex].sets[setIndex],
      reps: newReps,
    };

    // Recalculate totals
    const exercise = exercises[exerciseIndex];
    const totalReps = updatedLogs[exerciseIndex].sets.reduce(
      (sum, set) => sum + (set.completed ? set.reps : 0),
      0
    );
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

    updatedLogs[exerciseIndex].sets[setIndex] = {
      ...currentSet,
      completed: !currentSet.completed,
    };

    // Recalculate totals
    const exercise = exercises[exerciseIndex];
    const totalReps = updatedLogs[exerciseIndex].sets.reduce(
      (sum, set) => sum + (set.completed ? set.reps : 0),
      0
    );
    updatedLogs[exerciseIndex].totalReps = totalReps;
    updatedLogs[exerciseIndex].totalCalories = calculateCaloriesForExercise(
      exercise,
      totalReps
    );

    setExerciseLogs(updatedLogs);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedLogs = [...exerciseLogs];
    const lastSet =
      updatedLogs[exerciseIndex].sets[
        updatedLogs[exerciseIndex].sets.length - 1
      ];
    updatedLogs[exerciseIndex].sets.push({
      reps: lastSet?.reps || 0,
      completed: false,
    });
    setExerciseLogs(updatedLogs);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedLogs = [...exerciseLogs];
    if (updatedLogs[exerciseIndex].sets.length > 1) {
      updatedLogs[exerciseIndex].sets.splice(setIndex, 1);

      // Recalculate totals
      const exercise = exercises[exerciseIndex];
      const totalReps = updatedLogs[exerciseIndex].sets.reduce(
        (sum, set) => sum + (set.completed ? set.reps : 0),
        0
      );
      updatedLogs[exerciseIndex].totalReps = totalReps;
      updatedLogs[exerciseIndex].totalCalories = calculateCaloriesForExercise(
        exercise,
        totalReps
      );

      setExerciseLogs(updatedLogs);
    }
  };

  const saveWorkout = async () => {
    if (!startTime) return;

    setIsSaving(true);

    try {
      // First, try to migrate any existing localStorage data
      await migrateFromLocalStorage();

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

      const session: WorkoutSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        workoutType,
        exercises: exerciseLogs.filter((log) => log.totalReps > 0),
        totalDuration: Math.floor(elapsedTime / 60),
        totalCalories: Math.round(totalCalories * 10) / 10,
        totalSets,
        totalReps,
        notes,
      };

      await saveWorkoutSession(session);
      if (onSave) {
        onSave(session);
      }
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
                        {log.totalReps} reps
                      </span>
                      <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round(log.totalCalories * 10) / 10} cal
                      </span>
                      <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {log.sets.filter((set) => set.completed).length}/
                        {log.sets.length} sets
                      </span>
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
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800 text-base">
                        Sets & Reps
                      </h4>
                      <button
                        onClick={() => addSet(exerciseIndex)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors font-medium"
                      >
                        <Plus size={14} />
                        <span className="text-xs font-semibold">Add Set</span>
                      </button>
                    </div>

                    {log.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          set.completed
                            ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50"
                            : "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
                        }`}
                      >
                        {/* Set Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-gray-800 bg-white px-3 py-1 rounded-lg shadow-sm">
                              Set {setIndex + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm min-w-[70px] text-center">
                                {set.reps}
                              </div>
                              <span className="text-gray-600 font-medium text-sm">
                                reps
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                toggleSetComplete(exerciseIndex, setIndex)
                              }
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm ${
                                set.completed
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                                  : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400"
                              }`}
                            >
                              {set.completed ? (
                                <Check size={14} />
                              ) : (
                                <X size={14} />
                              )}
                              <span className="text-xs font-semibold">
                                {set.completed ? "Done" : "Mark"}
                              </span>
                            </button>

                            {log.sets.length > 1 && (
                              <button
                                onClick={() =>
                                  removeSet(exerciseIndex, setIndex)
                                }
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quick Rep Buttons - Compact */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-semibold text-gray-700 mb-2 block">
                              Quick Set:
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              {[5, 10, 15, 20, 25, 30].map((reps) => (
                                <button
                                  key={reps}
                                  onClick={() =>
                                    quickSetReps(exerciseIndex, setIndex, reps)
                                  }
                                  className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 py-2 px-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                >
                                  {reps}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Fine Adjustment - Compact */}
                          <div>
                            <span className="text-xs font-semibold text-gray-700 mb-2 block">
                              Adjust:
                            </span>
                            <div className="grid grid-cols-4 gap-2">
                              <button
                                onClick={() =>
                                  adjustReps(exerciseIndex, setIndex, -5)
                                }
                                className="bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 py-2 px-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              >
                                -5
                              </button>
                              <button
                                onClick={() =>
                                  adjustReps(exerciseIndex, setIndex, -1)
                                }
                                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-2 px-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
                              >
                                <Minus size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  adjustReps(exerciseIndex, setIndex, 1)
                                }
                                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-2 px-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  adjustReps(exerciseIndex, setIndex, 5)
                                }
                                className="bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 py-2 px-2 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Section - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          💭 Workout Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did the workout feel? Any observations or goals for next time..."
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-slate-50"
          rows={2}
        />
      </div>
    </div>
  );
};
