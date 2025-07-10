import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { workoutCategories, weeklySchedule } from "../data/workouts";
import { Exercise } from "../types/workout";
import { calculateCaloriesForExercise } from "../utils/calories";
import { saveWorkoutSession } from "../utils/firebaseStorage";
import { usePrompt } from "../utils/usePrompt";

export const TrackerPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  let exercises: Exercise[] = [];
  let workoutTitle = "";

  if (type === "category" && id) {
    const category = workoutCategories.find((cat) => cat.id === id);
    if (category) {
      // Sort exercises by difficulty: Beginner -> Intermediate -> Advanced (same as workout page)
      const difficultyOrder = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3,
      };

      exercises = [...category.exercises].sort((a, b) => {
        const aDifficulty = a.difficulty || "Intermediate";
        const bDifficulty = b.difficulty || "Intermediate";
        return difficultyOrder[aDifficulty] - difficultyOrder[bDifficulty];
      });
      workoutTitle = category.name;
    }
  } else if (type === "schedule" && id) {
    const day = weeklySchedule.find(
      (d) => d.shortDay.toLowerCase() === id.toLowerCase()
    );
    if (day) {
      exercises = day.exercises;
      workoutTitle = `${day.day} - ${day.workout}`;
    }
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [sets, setSets] = useState<number[]>([0]);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(10);
  const [timerDurations, setTimerDurations] = useState<{
    [key: string]: number;
  }>({});
  const [bilateralSets, setBilateralSets] = useState<{
    [key: string]: { left: number; right: number };
  }>({});
  const [completedSets, setCompletedSets] = useState<
    { exercise: Exercise; reps: number; duration: number; calories: number }[]
  >([]);
  const [setStartTime, setSetStartTime] = useState(Date.now());
  const motivationalLines = [
    "You're crushing it! Keep going!",
    "Great job! Stay strong!",
    "Push your limits!",
    "Every rep counts!",
    "You're unstoppable!",
    "Feel the burn, earn the results!",
    "Keep up the amazing work!",
    "Sweat now, shine later!",
    "You're almost there!",
    "Strong body, strong mind!",
  ];
  const [motivationIdx, setMotivationIdx] = useState(
    Math.floor(Math.random() * motivationalLines.length)
  );
  const [showCongrats, setShowCongrats] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [workoutEndTime, setWorkoutEndTime] = useState<number | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  const quitModalShownRef = useRef(false);

  const hasProgress =
    completedSets.length > 0 && !showCongrats && !sessionSaved;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Timer effect for hold exercises
  useEffect(() => {
    const interval = setInterval(() => {
      // This effect is no longer needed as activeTimers state is removed
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!isResting) return;
    if (restTime <= 0) {
      setIsResting(false);
      setSets([0]);
      if (activeIndex < exercises.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
      setRestTime(10);
      setMotivationIdx(Math.floor(Math.random() * motivationalLines.length));
      return;
    }
    const interval = setInterval(() => {
      setRestTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  React.useEffect(() => {
    setSetStartTime(Date.now());
  }, [activeIndex]);

  // Remove popstate and beforeunload logic, and instead use usePrompt
  usePrompt(
    hasProgress,
    React.useCallback(() => {
      setShowQuitConfirm(true);
    }, [hasProgress])
  );

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <div>
          <h1 className="text-4xl font-bold mb-4">Workout Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 px-6 py-3 rounded-xl font-semibold mt-4"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const exercise = exercises[activeIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const round1 = (n: number) => Math.round(n * 10) / 10;

  // Timer functions for hold exercises
  const startTimer = (setIndex: number) => {
    const timerKey = `set-${setIndex}`;
    const duration = timerDurations[timerKey] || exercise.defaultDuration || 30;
    // This function is no longer needed as activeTimers state is removed
  };

  const stopTimer = (setIndex: number) => {
    const timerKey = `set-${setIndex}`;
    // This function is no longer needed as activeTimers state is removed
  };

  const adjustTimerDuration = (setIndex: number, adjustment: number) => {
    const timerKey = `set-${setIndex}`;
    const currentDuration =
      timerDurations[timerKey] || exercise.defaultDuration || 30;
    const newDuration = Math.max(5, currentDuration + adjustment);
    setTimerDurations((prev) => ({ ...prev, [timerKey]: newDuration }));
  };

  const isTimerExercise = exercise.timerType === "hold";
  const isBilateralExercise = exercise.bilateral === true;

  // Bilateral exercise functions
  const getBilateralSet = (setIndex: number) => {
    const key = `set-${setIndex}`;
    return bilateralSets[key] || { left: 0, right: 0 };
  };

  const updateBilateralSet = (
    setIndex: number,
    side: "left" | "right",
    value: number
  ) => {
    const key = `set-${setIndex}`;
    const currentSet = getBilateralSet(setIndex);
    setBilateralSets((prev) => ({
      ...prev,
      [key]: {
        ...currentSet,
        [side]: Math.max(0, value),
      },
    }));
  };

  const getTotalBilateralReps = (setIndex: number) => {
    const set = getBilateralSet(setIndex);
    return set.left + set.right;
  };

  // Circle Timer Component
  const CircleTimer: React.FC<{
    duration: number;
    currentTime: number;
    size?: number;
    strokeWidth?: number;
  }> = ({ duration, currentTime, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = currentTime / duration;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div className="relative inline-block">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentTime > 0 ? "#3b82f6" : "#9ca3af"}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.ceil(currentTime)}
            </div>
            <div className="text-xs text-gray-600">seconds</div>
          </div>
        </div>
      </div>
    );
  };

  const totalCalories = round1(
    completedSets.reduce((sum, s) => sum + s.calories, 0)
  );
  const totalReps = completedSets.reduce((sum, s) => sum + s.reps, 0);
  const totalSets = completedSets.length;
  const totalTime = Math.round((Date.now() - startTime) / 1000);

  async function saveSessionAndShowCongrats() {
    const endTime = Date.now();
    setWorkoutEndTime(endTime);
    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      workoutType: workoutTitle,
      exercises: completedSets.map((s) => ({
        exerciseId: s.exercise.id,
        exerciseName: s.exercise.name,
        sets: [{ reps: s.reps, duration: s.duration, completed: true }],
        totalReps: s.reps,
        totalCalories: round1(s.calories),
      })),
      totalDuration: Math.round((endTime - startTime) / 60000),
      totalCalories: totalCalories,
      totalSets: completedSets.length,
      totalReps: completedSets.reduce((sum, s) => sum + s.reps, 0),
      notes: "",
    };
    await saveWorkoutSession(session);
    setShowCongrats(true);
  }

  const handleDone = async () => {
    const setEndTime = Date.now();
    const duration = Math.round((setEndTime - setStartTime) / 1000);

    let exerciseValue = 0;
    if (isBilateralExercise) {
      // For bilateral exercises, sum up the total reps from both sides
      exerciseValue = sets.reduce((sum, _, idx) => {
        return sum + getTotalBilateralReps(idx);
      }, 0);
    } else if (isTimerExercise) {
      // For timer exercises, sum up the completed timer durations
      exerciseValue = sets.reduce((sum, _, idx) => {
        const timerKey = `set-${idx}`;
        const timerDuration =
          timerDurations[timerKey] || exercise.defaultDuration || 30;
        return sum + timerDuration;
      }, 0);
    } else {
      // For rep exercises, sum up the reps
      exerciseValue = sets.reduce((a, b) => a + b, 0);
    }

    const calories = round1(
      calculateCaloriesForExercise(exercise, exerciseValue)
    );
    setCompletedSets([
      ...completedSets,
      { exercise, reps: exerciseValue, duration, calories },
    ]);
    if (activeIndex === exercises.length - 1) {
      await saveSessionAndShowCongrats();
      return;
    }
    setIsResting(true);
    setRestTime(10);
    setMotivationIdx(Math.floor(Math.random() * motivationalLines.length));
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setSets([0]);
    // Clear any active timers when skipping rest
    // This function is no longer needed as activeTimers state is removed
    // Clear bilateral sets when skipping rest
    setBilateralSets({});
    if (activeIndex < exercises.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    setRestTime(10);
  };

  const handleAdd20s = () => setRestTime((t) => t + 20);

  const handleSkip = () => {
    setSets([0]);
    // Clear any active timers when skipping
    // This function is no longer needed as activeTimers state is removed
    // Clear bilateral sets when skipping
    setBilateralSets({});
    if (activeIndex < exercises.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      navigate("/history");
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setSets([0]);
      // Clear any active timers when going back
      // This function is no longer needed as activeTimers state is removed
      // Clear bilateral sets when going back
      setBilateralSets({});
    }
  };

  const handleBack = () => {
    if (hasProgress) {
      setShowQuitConfirm(true);
      quitModalShownRef.current = true;
    } else {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const handleSaveAndExit = async () => {
    await saveSessionAndShowCongrats();
    setSessionSaved(true);
    setShowQuitConfirm(false);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleDontSaveAndExit = () => {
    setSessionSaved(true); // Prevent further prompts
    setShowQuitConfirm(false);
    setTimeout(() => {
      navigate("/");
    }, 200);
  };

  if (showQuitConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Leave Session?
          </h2>
          <p className="mb-6 text-gray-700 text-center">
            You have unsaved progress. What would you like to do?
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
              onClick={handleSaveAndExit}
            >
              Save & Exit
            </button>
            <button
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
              onClick={handleDontSaveAndExit}
            >
              Don't Save
            </button>
            <button
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
              onClick={() => {
                setShowQuitConfirm(false);
                quitModalShownRef.current = false;
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCongrats) {
    const congratsTime = workoutEndTime
      ? Math.round((workoutEndTime - startTime) / 1000)
      : totalTime;
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-2 sm:px-0 pt-16">
        <div className="flex flex-col items-center justify-center w-full max-w-md bg-gray-100 rounded-3xl shadow-2xl p-8 mt-12">
          <div className="text-4xl font-extrabold text-yellow-600 mb-4">
            🎉 Congratulations! 🎉
          </div>
          <div className="text-gray-800 text-lg font-bold mb-6">
            You completed your workout!
          </div>
          <div className="w-full flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-gray-800 text-lg font-semibold">
              <span>Total Reps:</span>
              <span>{totalReps}</span>
            </div>
            <div className="flex justify-between text-gray-800 text-lg font-semibold">
              <span>Total Sets:</span>
              <span>{totalSets}</span>
            </div>
            <div className="flex justify-between text-gray-800 text-lg font-semibold">
              <span>Total Calories:</span>
              <span>{round1(totalCalories)}</span>
            </div>
            <div className="flex justify-between text-gray-800 text-lg font-semibold">
              <span>Total Time:</span>
              <span>{formatTime(congratsTime)}</span>
            </div>
          </div>
          <div className="text-gray-700 text-base font-semibold italic mb-4">
            Amazing effort! Keep it up!
          </div>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg shadow-lg transition-all duration-150"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isResting) {
    const nextExercise = exercises[activeIndex + 1];
    const prevSet = completedSets[completedSets.length - 1];
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-2 sm:px-0 pt-16">
        {/* Timer and Calories */}
        <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-widest">
            {formatTime(elapsed)}
          </span>
          <span className="text-lg sm:text-xl font-bold text-yellow-600 bg-yellow-100 rounded-lg px-4 py-2">
            {round1(totalCalories)} cal
          </span>
        </div>
        {/* Rest Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="text-gray-700 font-bold text-sm mb-2">
              NEXT {activeIndex + 2}/{exercises.length}
            </div>
            <div className="text-gray-800 text-2xl font-extrabold mb-6 text-center">
              {nextExercise ? nextExercise.name : "Workout Complete!"}
            </div>
            <div className="text-gray-700 text-lg font-semibold mb-2">REST</div>
            <div className="text-gray-800 text-5xl font-extrabold mb-4">
              00:{restTime.toString().padStart(2, "0")}
            </div>
            {/* Motivational line */}
            <div className="text-gray-700 text-base font-semibold mb-4 italic">
              {motivationalLines[motivationIdx]}
            </div>
            {/* Previous set info */}
            {prevSet && (
              <div className="w-full flex flex-col items-center mb-6">
                <div className="text-gray-600 text-sm font-medium mb-1">
                  Last Set Time:{" "}
                  <span className="font-bold">{prevSet.duration}s</span>
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  Calories Burned:{" "}
                  <span className="font-bold">{round1(prevSet.calories)}</span>
                </div>
              </div>
            )}
            <button
              onClick={handleAdd20s}
              className="w-full max-w-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-xl text-lg mb-4 shadow-lg transition-all duration-150"
            >
              +20s
            </button>
            <button
              onClick={handleSkipRest}
              className="w-full max-w-xs bg-white text-blue-700 font-bold py-3 rounded-xl text-lg border border-blue-200 shadow-lg transition-all duration-150"
            >
              SKIP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showCongrats && !isResting && !showQuitConfirm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 sm:px-0 pt-16">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={handleBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-full shadow-lg border border-gray-300 transition-all duration-150"
          >
            ← Back
          </button>
        </div>
        {/* Timer and Calories */}
        <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-widest">
            {formatTime(elapsed)}
          </span>
          <span className="text-lg sm:text-xl font-bold text-yellow-600 bg-yellow-100 rounded-lg px-4 py-2">
            {round1(totalCalories)} cal
          </span>
        </div>
        {/* Workout Title */}
        <div className="w-full text-center mb-4">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            {workoutTitle}
          </span>
        </div>
        {/* Exercise Image */}
        <div className="flex justify-center items-center mb-4">
          <div
            className="rounded-xl bg-gray-200 flex items-center justify-center"
            style={{ width: "min(60vw, 260px)", height: "min(60vw, 260px)" }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl text-gray-400">
              🏋️
            </span>
          </div>
        </div>
        {/* Exercise Name */}
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          {exercise.name}
        </div>
        {/* Sets Logging */}
        <div className="flex flex-col items-center w-full mb-8 gap-6">
          {sets.map((reps, idx) => {
            const currentSetCalories = round1(
              calculateCaloriesForExercise(exercise, reps)
            );
            const timerKey = `set-${idx}`;
            const currentTimer = 0; // No active timers
            const timerDuration =
              timerDurations[timerKey] || exercise.defaultDuration || 30;
            const bilateralSet = getBilateralSet(idx);
            const totalBilateralReps = getTotalBilateralReps(idx);

            return (
              <div key={idx} className="w-full max-w-2xl mb-2">
                {isBilateralExercise ? (
                  // Bilateral exercise UI (left and right sides)
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        Set {idx + 1} - Both Sides
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Complete both left and right sides
                      </div>
                    </div>

                    {/* Left Side */}
                    <div className="w-full max-w-md bg-blue-50 rounded-xl p-4 mb-4">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-blue-700 mb-1">
                          Left Side
                        </div>
                        <div className="text-2xl font-bold text-blue-800">
                          {bilateralSet.left} reps
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button
                          onClick={() =>
                            updateBilateralSet(
                              idx,
                              "left",
                              bilateralSet.left - 1
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow h-8 w-8 flex items-center justify-center text-lg font-extrabold transition-all duration-150"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateBilateralSet(
                              idx,
                              "left",
                              bilateralSet.left + 1
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow h-8 w-8 flex items-center justify-center text-lg font-extrabold transition-all duration-150"
                        >
                          +
                        </button>
                      </div>
                      {/* Quick Left Side */}
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 15, 20].map((val) => (
                          <button
                            key={val}
                            onClick={() => updateBilateralSet(idx, "left", val)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-sm py-2 rounded-lg transition-all duration-150"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-full max-w-md bg-green-50 rounded-xl p-4 mb-4">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-green-700 mb-1">
                          Right Side
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                          {bilateralSet.right} reps
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button
                          onClick={() =>
                            updateBilateralSet(
                              idx,
                              "right",
                              bilateralSet.right - 1
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow h-8 w-8 flex items-center justify-center text-lg font-extrabold transition-all duration-150"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateBilateralSet(
                              idx,
                              "right",
                              bilateralSet.right + 1
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow h-8 w-8 flex items-center justify-center text-lg font-extrabold transition-all duration-150"
                        >
                          +
                        </button>
                      </div>
                      {/* Quick Right Side */}
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 15, 20].map((val) => (
                          <button
                            key={val}
                            onClick={() =>
                              updateBilateralSet(idx, "right", val)
                            }
                            className="bg-green-100 hover:bg-green-200 text-green-700 font-bold text-sm py-2 rounded-lg transition-all duration-150"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="w-full max-w-md bg-gray-50 rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700 mb-1">
                          Total Reps
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                          {totalBilateralReps}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          Left: {bilateralSet.left} | Right:{" "}
                          {bilateralSet.right}
                        </div>
                      </div>
                    </div>

                    {/* Show current set calories */}
                    <div className="text-gray-700 text-sm font-semibold mt-2 text-center">
                      Current Set Calories:{" "}
                      <span className="font-bold">
                        {round1(
                          calculateCaloriesForExercise(
                            exercise,
                            totalBilateralReps
                          )
                        )}
                      </span>
                    </div>
                  </div>
                ) : isTimerExercise ? (
                  // Timer-based exercise UI
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        Set {idx + 1} - Hold Duration
                      </div>
                      <CircleTimer
                        duration={timerDuration}
                        currentTime={currentTimer}
                        size={140}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                      <button
                        onClick={() => adjustTimerDuration(idx, -5)}
                        className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                      >
                        -
                      </button>
                      <div className="w-20 sm:w-24 text-center text-2xl sm:text-3xl font-bold text-gray-800">
                        {timerDuration}s
                      </div>
                      <button
                        onClick={() => adjustTimerDuration(idx, 5)}
                        className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-3">
                      {currentTimer === 0 ? (
                        <button
                          onClick={() => startTimer(idx)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all duration-150"
                        >
                          Start Timer
                        </button>
                      ) : (
                        <button
                          onClick={() => stopTimer(idx)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all duration-150"
                        >
                          Stop Timer
                        </button>
                      )}
                    </div>

                    {/* Quick Duration Buttons */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="font-semibold text-gray-700 mb-2 text-center">
                        Quick Duration:
                      </div>
                      <div className="grid grid-cols-3 gap-2 justify-center">
                        {[15, 30, 45].map((val) => (
                          <button
                            key={val}
                            onClick={() => {
                              setTimerDurations((prev) => ({
                                ...prev,
                                [timerKey]: val,
                              }));
                            }}
                            className="bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-bold text-base py-2 rounded-xl transition-all duration-150 shadow-sm"
                          >
                            {val}s
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Show current set calories */}
                    <div className="text-gray-700 text-sm font-semibold mt-2 text-center">
                      Current Set Calories:{" "}
                      <span className="font-bold">{currentSetCalories}</span>
                    </div>
                  </div>
                ) : (
                  // Rep-based exercise UI (original)
                  <>
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <button
                        onClick={() =>
                          setSets((sets) =>
                            sets.map((r, i) =>
                              i === idx ? Math.max(0, r - 1) : r
                            )
                          )
                        }
                        className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={reps === 0 ? "" : reps}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setSets((sets) =>
                            sets.map((r, i) =>
                              i === idx ? (val ? parseInt(val) : 0) : r
                            )
                          );
                        }}
                        className="w-20 sm:w-24 text-center text-2xl sm:text-3xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent appearance-none"
                        style={{ MozAppearance: "textfield" }}
                      />
                      <button
                        onClick={() =>
                          setSets((sets) =>
                            sets.map((r, i) => (i === idx ? r + 1 : r))
                          )
                        }
                        className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                      >
                        +
                      </button>
                    </div>
                    {/* Quick Set */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="font-semibold text-gray-700 mb-2 text-center">
                        Quick Set:
                      </div>
                      <div className="grid grid-cols-4 gap-1 justify-center">
                        {[10, 15, 20, 25].map((val) => (
                          <button
                            key={val}
                            onClick={() =>
                              setSets((sets) =>
                                sets.map((r, i) => (i === idx ? val : r))
                              )
                            }
                            className="bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-bold text-base py-2 w-16 rounded-xl transition-all duration-150 shadow-sm"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      {/* Show current set calories below quick set */}
                      <div className="text-gray-700 text-sm font-semibold mt-2 mb-2 text-center">
                        Current Set Calories:{" "}
                        <span className="font-bold">{currentSetCalories}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {/* Add Set Button */}
          <button
            onClick={() => setSets((sets) => [...sets, 0])}
            className="mt-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-6 rounded-xl text-lg shadow transition-all duration-150"
          >
            + Add Set
          </button>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center w-full max-w-md mx-auto gap-2 mb-8">
          <button
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            className="flex-1 text-left text-gray-700 font-semibold text-lg sm:text-xl px-2"
          >
            ⏮ Previous
          </button>
          <button
            onClick={handleDone}
            className="flex-1 mx-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-xl text-lg sm:text-xl shadow-lg transition-all duration-150"
          >
            ✓ Done
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 text-right text-gray-700 font-semibold text-lg sm:text-xl px-2"
          >
            Skip ⏭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 sm:px-0 pt-16">
      {/* Timer and Calories */}
      <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-widest">
          {formatTime(elapsed)}
        </span>
        <span className="text-lg sm:text-xl font-bold text-yellow-600 bg-yellow-100 rounded-lg px-4 py-2">
          {round1(totalCalories)} cal
        </span>
      </div>
      {/* Workout Title */}
      <div className="w-full text-center mb-4">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {workoutTitle}
        </span>
      </div>
      {/* Exercise Image */}
      <div className="flex justify-center items-center mb-4">
        <div
          className="rounded-xl bg-gray-200 flex items-center justify-center"
          style={{ width: "min(60vw, 260px)", height: "min(60vw, 260px)" }}
        >
          <span className="text-5xl sm:text-6xl md:text-7xl text-gray-400">
            🏋️
          </span>
        </div>
      </div>
      {/* Exercise Name */}
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        {exercise.name}
      </div>
      {/* Sets Logging */}
      <div className="flex flex-col items-center w-full mb-8 gap-6">
        {sets.map((reps, idx) => {
          const currentSetCalories = round1(
            calculateCaloriesForExercise(exercise, reps)
          );
          return (
            <div key={idx} className="w-full max-w-2xl mb-2">
              <div className="flex items-center justify-center gap-4 mb-2">
                <button
                  onClick={() =>
                    setSets((sets) =>
                      sets.map((r, i) => (i === idx ? Math.max(0, r - 1) : r))
                    )
                  }
                  className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={reps === 0 ? "" : reps}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setSets((sets) =>
                      sets.map((r, i) =>
                        i === idx ? (val ? parseInt(val) : 0) : r
                      )
                    );
                  }}
                  className="w-20 sm:w-24 text-center text-2xl sm:text-3xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent appearance-none"
                  style={{ MozAppearance: "textfield" }}
                />
                <button
                  onClick={() =>
                    setSets((sets) =>
                      sets.map((r, i) => (i === idx ? r + 1 : r))
                    )
                  }
                  className="bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-full shadow h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-lg sm:text-xl font-extrabold hover:from-purple-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                >
                  +
                </button>
              </div>
              {/* Quick Set */}
              <div className="w-full max-w-xs mx-auto">
                <div className="font-semibold text-gray-700 mb-2 text-center">
                  Quick Set:
                </div>
                <div className="grid grid-cols-4 gap-1 justify-center">
                  {[10, 15, 20, 25].map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSets((sets) =>
                          sets.map((r, i) => (i === idx ? val : r))
                        )
                      }
                      className="bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-bold text-base py-2 w-16 rounded-xl transition-all duration-150 shadow-sm"
                    >
                      {val}
                    </button>
                  ))}
                </div>
                {/* Show current set calories below quick set */}
                <div className="text-gray-700 text-sm font-semibold mt-2 mb-2 text-center">
                  Current Set Calories:{" "}
                  <span className="font-bold">{currentSetCalories}</span>
                </div>
              </div>
            </div>
          );
        })}
        {/* Add Set Button */}
        <button
          onClick={() => setSets((sets) => [...sets, 0])}
          className="mt-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-6 rounded-xl text-lg shadow transition-all duration-150"
        >
          + Add Set
        </button>
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center w-full max-w-md mx-auto gap-2 mb-8">
        <button
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className="flex-1 text-left text-gray-700 font-semibold text-lg sm:text-xl px-2"
        >
          ⏮ Previous
        </button>
        <button
          onClick={handleDone}
          className="flex-1 mx-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-xl text-lg sm:text-xl shadow-lg transition-all duration-150"
        >
          ✓ Done
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 text-right text-gray-700 font-semibold text-lg sm:text-xl px-2"
        >
          Skip ⏭
        </button>
      </div>
    </div>
  );
};
