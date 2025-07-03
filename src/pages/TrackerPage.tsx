import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { workoutCategories, weeklySchedule } from "../data/workouts";
import { Exercise } from "../types/workout";
import { calculateCaloriesForExercise } from "../utils/calories";
import { saveWorkoutSession } from "../utils/firebaseStorage";

export const TrackerPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  let exercises: Exercise[] = [];
  let workoutTitle = "";

  if (type === "category" && id) {
    const category = workoutCategories.find((cat) => cat.id === id);
    if (category) {
      exercises = category.exercises;
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

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

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

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showCongrats && completedSets.length > 0) {
        e.preventDefault();
        e.returnValue = "";
        setShowQuitConfirm(true);
        return "";
      }
    };
    const handlePopState = (e: PopStateEvent) => {
      if (!showCongrats && completedSets.length > 0) {
        setShowQuitConfirm(true);
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showCongrats, completedSets.length]);

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 text-white">
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
    const repsSum = sets.reduce((a, b) => a + b, 0);
    const calories = round1(calculateCaloriesForExercise(exercise, repsSum));
    setCompletedSets([
      ...completedSets,
      { exercise, reps: repsSum, duration, calories },
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
    if (activeIndex < exercises.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    setRestTime(10);
  };

  const handleAdd20s = () => setRestTime((t) => t + 20);

  const handleSkip = () => {
    setSets([0]);
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
    }
  };

  const handleSaveAndQuit = async () => {
    await saveSessionAndShowCongrats();
    setShowQuitConfirm(false);
    navigate("/");
  };

  if (showQuitConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
          <div className="text-lg font-bold mb-4 text-gray-800">
            Quit Workout?
          </div>
          <div className="text-gray-600 mb-6 text-center">
            Are you sure you want to quit? Your progress will be saved.
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setShowQuitConfirm(false)}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 rounded-xl"
            >
              No
            </button>
            <button
              onClick={handleSaveAndQuit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl"
            >
              Save & Quit
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 px-2 sm:px-0 pt-16">
        <div className="flex flex-col items-center justify-center w-full max-w-md bg-white/10 rounded-3xl shadow-2xl p-8 mt-12">
          <div className="text-4xl font-extrabold text-yellow-300 mb-4 drop-shadow-lg">
            🎉 Congratulations! 🎉
          </div>
          <div className="text-white text-lg font-bold mb-6 drop-shadow-lg">
            You completed your workout!
          </div>
          <div className="w-full flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-white text-lg font-semibold drop-shadow">
              <span>Total Reps:</span>
              <span>{totalReps}</span>
            </div>
            <div className="flex justify-between text-white text-lg font-semibold drop-shadow">
              <span>Total Sets:</span>
              <span>{totalSets}</span>
            </div>
            <div className="flex justify-between text-white text-lg font-semibold drop-shadow">
              <span>Total Calories:</span>
              <span>{round1(totalCalories)}</span>
            </div>
            <div className="flex justify-between text-white text-lg font-semibold drop-shadow">
              <span>Total Time:</span>
              <span>{formatTime(congratsTime)}</span>
            </div>
          </div>
          <div className="text-white text-base font-semibold italic mb-4 drop-shadow-lg">
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 px-2 sm:px-0 pt-16">
        {/* Timer and Calories */}
        <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-widest">
            {formatTime(elapsed)}
          </span>
          <span className="text-lg sm:text-xl font-bold text-yellow-200 bg-yellow-500/30 rounded-lg px-4 py-2 drop-shadow-lg">
            {round1(totalCalories)} cal
          </span>
        </div>
        {/* Rest Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="text-white font-bold text-sm mb-2 drop-shadow">
              NEXT {activeIndex + 2}/{exercises.length}
            </div>
            <div className="text-white text-2xl font-extrabold mb-6 text-center drop-shadow-lg">
              {nextExercise ? nextExercise.name : "Workout Complete!"}
            </div>
            <div className="text-white text-lg font-semibold mb-2 drop-shadow">
              REST
            </div>
            <div className="text-white text-5xl font-extrabold mb-4 drop-shadow-lg">
              00:{restTime.toString().padStart(2, "0")}
            </div>
            {/* Motivational line */}
            <div className="text-white text-base font-semibold mb-4 italic drop-shadow-lg">
              {motivationalLines[motivationIdx]}
            </div>
            {/* Previous set info */}
            {prevSet && (
              <div className="w-full flex flex-col items-center mb-6">
                <div className="text-white text-sm font-medium mb-1 drop-shadow">
                  Last Set Time:{" "}
                  <span className="font-bold">{prevSet.duration}s</span>
                </div>
                <div className="text-white text-sm font-medium drop-shadow">
                  Calories Burned:{" "}
                  <span className="font-bold">{round1(prevSet.calories)}</span>
                </div>
              </div>
            )}
            <button
              onClick={handleAdd20s}
              className="w-full max-w-xs bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl text-lg mb-4 shadow-lg transition-all duration-150 backdrop-blur"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 px-2 sm:px-0 pt-16">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="bg-white/80 hover:bg-white text-blue-700 font-bold py-2 px-4 rounded-full shadow-lg border border-blue-200 transition-all duration-150"
          >
            ← Back
          </button>
        </div>
        {/* Timer and Calories */}
        <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-widest">
            {formatTime(elapsed)}
          </span>
          <span className="text-lg sm:text-xl font-bold text-yellow-200 bg-yellow-500/30 rounded-lg px-4 py-2 drop-shadow-lg">
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
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">
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
                  <div className="text-white text-sm font-semibold mt-2 mb-2 text-center">
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
            className="flex-1 text-left text-white font-semibold text-lg sm:text-xl px-2 drop-shadow"
          >
            ⏮ Previous
          </button>
          <button
            onClick={handleDone}
            className="flex-1 mx-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl text-lg sm:text-xl shadow-lg drop-shadow transition-all duration-150"
          >
            ✓ Done
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 text-right text-white font-semibold text-lg sm:text-xl px-2 drop-shadow"
          >
            Skip ⏭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 px-2 sm:px-0 pt-16">
      {/* Timer and Calories */}
      <div className="w-full flex justify-center items-center mt-6 mb-2 gap-6">
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-widest">
          {formatTime(elapsed)}
        </span>
        <span className="text-lg sm:text-xl font-bold text-yellow-200 bg-yellow-500/30 rounded-lg px-4 py-2 drop-shadow-lg">
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
      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">
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
                <div className="text-white text-sm font-semibold mt-2 mb-2 text-center">
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
          className="flex-1 text-left text-white font-semibold text-lg sm:text-xl px-2 drop-shadow"
        >
          ⏮ Previous
        </button>
        <button
          onClick={handleDone}
          className="flex-1 mx-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl text-lg sm:text-xl shadow-lg drop-shadow transition-all duration-150"
        >
          ✓ Done
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 text-right text-white font-semibold text-lg sm:text-xl px-2 drop-shadow"
        >
          Skip ⏭
        </button>
      </div>
    </div>
  );
};
