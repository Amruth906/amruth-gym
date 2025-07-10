import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { yogaCategories, YogaPose } from "../data/yoga";
import { usePrompt } from "../utils/usePrompt";

// Extend YogaPose for this file to include optional caloriesPerSecond
interface YogaTrackerPose extends YogaPose {
  duration?: number;
  calories?: number;
  caloriesPerSecond?: number;
}

interface YogaSessionLog {
  category: string;
  poses: Array<YogaTrackerPose & { duration?: number; calories?: number }>;
  completedAt: string;
}

const MOTIVATIONAL_QUOTES = [
  "Breathe in calm, breathe out tension.",
  "You are stronger than you think.",
  "Every breath is a new beginning.",
  "Stay present, stay powerful.",
  "Progress, not perfection.",
  "Let your energy flow.",
  "You are exactly where you need to be.",
  "Embrace the stretch, embrace the change.",
  "Balance is not something you find, it's something you create.",
  "Your only limit is your mind.",
];

function saveYogaSessionLog(
  categoryName: string,
  poses: (YogaTrackerPose & { duration?: number; calories?: number })[],
  durations: number[]
) {
  const log: YogaSessionLog = {
    category: categoryName,
    poses: poses.map((p, i) => ({
      ...p,
      duration: durations[i],
      difficulty: p.difficulty || "Beginner",
    })),
    completedAt: new Date().toISOString(),
  };
  const prev = JSON.parse(localStorage.getItem("yogaSessionLogs") || "[]");
  prev.push(log);
  localStorage.setItem("yogaSessionLogs", JSON.stringify(prev));
}

const CircleTimer: React.FC<{
  duration: number;
  current: number;
}> = ({ duration, current }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.max(0, current) / duration;
  const offset = circumference * (1 - progress);
  return (
    <svg height={radius * 2} width={radius * 2} className="mb-2">
      <circle
        stroke="#e0e7ff"
        fill="none"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#7c3aed"
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="2rem"
        fill="#6d28d9"
        fontFamily="monospace"
      >
        {`${Math.floor(current / 60)
          .toString()
          .padStart(2, "0")}:${(current % 60).toString().padStart(2, "0")}`}
      </text>
    </svg>
  );
};

// Add a default calories per second value for yoga poses
const DEFAULT_CALORIES_PER_SECOND = 0.07; // ~4.2 cal/min, adjust as needed

export const YogaTrackerPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};

  // Use poses from navigation state if present (from YogaSessionPage), else use category
  let poses: (YogaTrackerPose & { duration?: number; calories?: number })[] =
    navState.poses;
  let trackerCategory = null;
  if (!poses) {
    trackerCategory =
      yogaCategories.find((cat) => cat.id === categoryId) || yogaCategories[0];
    poses = trackerCategory.poses.map((p) => ({
      ...p,
      duration: 30,
      difficulty: p.difficulty,
    }));
  } else {
    trackerCategory =
      yogaCategories.find((cat) => cat.id === categoryId) || yogaCategories[0];
  }
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const pose = poses[currentPoseIdx];

  // Timer state
  const [timer, setTimer] = useState(Number(pose.duration) || 30);
  const [isRunning, setIsRunning] = useState(false);
  const [customDurations, setCustomDurations] = useState<number[]>(
    poses.map((p) => Number(p.duration) || 30)
  );
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const chimeRef = useRef<HTMLAudioElement | null>(null);
  const [quoteIdx, setQuoteIdx] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(20);
  const [customRest, setCustomRest] = useState(20);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [skippedPoses, setSkippedPoses] = useState<{ [idx: number]: boolean }>(
    {}
  );
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  // Track if any progress has been made
  const hasProgress =
    currentPoseIdx > 0 || timer !== Number(pose.duration) || showSummary;

  // Back/quit logic
  usePrompt(
    !sessionSaved && hasProgress,
    React.useCallback(() => {
      setShowQuitConfirm(true);
    }, [sessionSaved, hasProgress])
  );

  const handleBack = () => {
    if (!sessionSaved && hasProgress) {
      setShowQuitConfirm(true);
    } else {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/yoga");
      }
    }
  };

  const handleSaveAndExit = () => {
    // Save current progress (including skipped poses)
    const completedPoses = poses.map((p: YogaTrackerPose, idx: number) => {
      if (skippedPoses[idx]) {
        return { ...p, duration: 0, calories: 0 };
      }
      const duration = customDurations[idx];
      const calories = getCaloriesForPose(p, duration);
      return { ...p, duration, calories };
    });
    saveYogaSessionLog(
      trackerCategory?.name || "",
      completedPoses,
      completedPoses.map((p) => p.duration)
    );
    setSessionSaved(true);
    setShowQuitConfirm(false);
    setTimeout(() => {
      navigate("/yoga");
    }, 500);
  };

  const handleDontSaveAndExit = () => {
    setSessionSaved(true); // Prevent further prompts
    setShowQuitConfirm(false);
    setTimeout(() => {
      navigate("/yoga");
    }, 200);
  };

  const handleSave = () => {
    saveYogaSessionLog(trackerCategory?.name || "", poses, customDurations);
    setSessionSaved(true);
    setTimeout(() => {
      navigate("/yoga");
    }, 500);
  };

  useEffect(() => {
    setTimer(customDurations[currentPoseIdx] || 30);
    setIsRunning(false);
    setQuoteIdx(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  }, [currentPoseIdx, customDurations]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      if (chimeRef.current) {
        chimeRef.current.currentTime = 0;
        chimeRef.current.play();
      }
      // If not last pose, go to rest
      if (currentPoseIdx < poses.length - 1) {
        setTimeout(() => {
          setIsResting(true);
          setRestTime(customRest);
        }, 800); // short delay for chime
      } else {
        saveYogaSessionLog(trackerCategory?.name || "", poses, customDurations);
        setShowSummary(true);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timer,
    currentPoseIdx,
    poses.length,
    customDurations,
    customRest,
    trackerCategory?.name,
    showSummary,
  ]);

  // Rest timer effect
  useEffect(() => {
    let restInterval: NodeJS.Timeout | undefined;
    if (isResting && restTime > 0) {
      restInterval = setInterval(() => setRestTime((t) => t - 1), 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      setCurrentPoseIdx((idx) => idx + 1);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isResting, restTime]);

  // Calculate calories for a pose
  const getCaloriesForPose = (
    pose: YogaTrackerPose & { caloriesPerSecond?: number },
    seconds: number
  ) => {
    // If pose.caloriesPerSecond is present, use it, else default
    const calPerSec =
      (pose as YogaTrackerPose).caloriesPerSecond ||
      DEFAULT_CALORIES_PER_SECOND;
    return Math.round(calPerSec * seconds * 10) / 10;
  };

  const handleNext = () => {
    // If timer not started or not completed, ask for skip confirmation
    if (timer === customDurations[currentPoseIdx] && !isRunning) {
      setShowSkipConfirm(true);
      return;
    }
    // Mark pose as completed (not skipped)
    setSkippedPoses((prev) => ({ ...prev, [currentPoseIdx]: false }));
    if (currentPoseIdx < poses.length - 1) {
      setCurrentPoseIdx(currentPoseIdx + 1);
    } else {
      // Save only completed poses (not skipped)
      const completedPoses = poses.map((p: YogaTrackerPose, idx: number) => {
        if (skippedPoses[idx]) {
          return { ...p, duration: 0, calories: 0 };
        }
        const duration = customDurations[idx];
        const calories = getCaloriesForPose(p, duration);
        return { ...p, duration, calories };
      });
      saveYogaSessionLog(
        trackerCategory?.name || "",
        completedPoses,
        completedPoses.map((p) => p.duration)
      );
      setShowSummary(true);
    }
  };

  const handleSkipPose = () => {
    setSkippedPoses((prev) => ({ ...prev, [currentPoseIdx]: true }));
    setShowSkipConfirm(false);
    if (currentPoseIdx < poses.length - 1) {
      setCurrentPoseIdx(currentPoseIdx + 1);
    } else {
      // Save only completed poses (not skipped)
      const completedPoses = poses.map((p: YogaTrackerPose, idx: number) => {
        if (skippedPoses[idx] || idx === currentPoseIdx) {
          return { ...p, duration: 0, calories: 0 };
        }
        const duration = customDurations[idx];
        const calories = getCaloriesForPose(p, duration);
        return { ...p, duration, calories };
      });
      saveYogaSessionLog(
        trackerCategory?.name || "",
        completedPoses,
        completedPoses.map((p) => p.duration)
      );
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentPoseIdx > 0) {
      setCurrentPoseIdx(currentPoseIdx - 1);
    }
  };

  const handleDurationChange = (idx: number, value: number) => {
    setCustomDurations((prev) => {
      const arr = [...prev];
      arr[idx] = Math.max(5, value);
      return arr;
    });
  };

  // Session progress bar
  const sessionProgress =
    ((currentPoseIdx + (timer < customDurations[currentPoseIdx] ? 0 : 1)) /
      poses.length) *
    100;

  // Show quit confirm modal if needed
  let quitConfirmModal: React.ReactNode = null;
  if (showQuitConfirm) {
    quitConfirmModal = (
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
              onClick={() => setShowQuitConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <>
        {quitConfirmModal}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-12 pt-32">
          <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
            <button
              onClick={handleBack}
              className="absolute left-4 top-4 text-blue-600 hover:text-blue-800 font-bold text-lg px-4 py-2 rounded-full bg-white/80 shadow-md"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-extrabold text-purple-700 mb-4 text-center drop-shadow-lg">
              Session Complete!
            </h2>
            <div className="mb-6 text-gray-700 text-center">
              You finished the{" "}
              <span className="font-bold">{trackerCategory?.name}</span> yoga
              session.
            </div>
            <ul className="mb-8 w-full">
              {poses.map((p: YogaTrackerPose, idx: number) => (
                <li
                  key={p.name}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span>{p.name}</span>
                  <span>{customDurations[idx]}s</span>
                  <span className="text-orange-500 font-semibold ml-4">
                    {skippedPoses[idx] || p.duration === 0
                      ? "Skipped"
                      : `${getCaloriesForPose(p, customDurations[idx])} cal`}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold shadow"
              onClick={handleSave}
              disabled={sessionSaved}
            >
              {sessionSaved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </>
    );
  }

  if (isResting) {
    return (
      <>
        {quitConfirmModal}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-12 pt-32">
          <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center relative">
            <button
              onClick={handleBack}
              className="absolute left-4 top-4 text-blue-600 hover:text-blue-800 font-bold text-lg px-4 py-2 rounded-full bg-white/80 shadow-md"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-extrabold text-pink-600 mb-4 text-center drop-shadow-lg mt-8">
              Rest & Recover
            </h2>
            <div className="mb-4 text-center italic text-pink-500 font-semibold">
              "Rest is part of the practice."
            </div>
            <div className="flex flex-col items-center mb-6">
              <CircleTimer duration={customRest} current={restTime} />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-500">Set Rest:</span>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={customRest}
                  onChange={(e) =>
                    setCustomRest(Math.max(5, Number(e.target.value)))
                  }
                  className="w-20 px-2 py-1 rounded border border-gray-300 text-center"
                  disabled={restTime !== customRest}
                />
                <span className="text-gray-500">sec</span>
              </div>
            </div>
            <button
              className="px-6 py-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-bold shadow"
              onClick={() => {
                setIsResting(false);
                setCurrentPoseIdx((idx) => idx + 1);
              }}
              disabled={restTime === 0}
            >
              Skip Rest
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {quitConfirmModal}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-12 pt-32">
        <audio
          ref={chimeRef}
          src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae3c8.mp3"
          preload="auto"
        />
        <div className="w-full max-w-md bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center relative">
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 text-blue-600 hover:text-blue-800 font-bold text-lg px-4 py-2 rounded-full bg-white/80 shadow-md"
          >
            ← Back
          </button>
          {/* Session Progress Bar - moved below back button */}
          <div className="w-full mb-6 mt-10">
            <div className="h-3 w-full bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${sessionProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-purple-700 mt-1 text-right">
              {currentPoseIdx + 1} / {poses.length} poses
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-purple-700 mb-2 text-center drop-shadow-lg">
            {pose.name}
          </h2>
          <div className="text-lg text-gray-600 mb-2 text-center">
            {pose.difficulty} Level
          </div>
          {/* Motivational Quote */}
          <div className="mb-4 text-center italic text-purple-500 font-semibold">
            {MOTIVATIONAL_QUOTES[quoteIdx]}
          </div>
          <div className="flex flex-col items-center mb-8">
            {/* Unique Circular Timer */}
            <CircleTimer
              duration={customDurations[currentPoseIdx]}
              current={timer}
            />
            <div className="flex gap-4 mb-2">
              <button
                className={`px-6 py-2 rounded-full font-bold shadow transition-all duration-200 ${
                  isRunning
                    ? "bg-red-400 hover:bg-red-500 text-white"
                    : "bg-green-400 hover:bg-green-500 text-white"
                }`}
                onClick={() => setIsRunning((r) => !r)}
                disabled={timer === 0}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold shadow"
                onClick={() => setTimer(customDurations[currentPoseIdx])}
                disabled={timer === customDurations[currentPoseIdx]}
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500">Set Duration:</span>
              <input
                type="number"
                min={5}
                max={3600}
                value={customDurations[currentPoseIdx]}
                onChange={(e) =>
                  handleDurationChange(currentPoseIdx, Number(e.target.value))
                }
                className="w-20 px-2 py-1 rounded border border-gray-300 text-center"
              />
              <span className="text-gray-500">sec</span>
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            <button
              className="px-4 py-2 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold shadow"
              onClick={handlePrev}
              disabled={currentPoseIdx === 0}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow"
              onClick={handleNext}
              disabled={isRunning}
            >
              {currentPoseIdx < poses.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      </div>
      {/* Skip confirmation modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Skip Pose?</h2>
            <p className="mb-6 text-gray-700">
              You haven't started this pose. Do you want to skip it?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                onClick={handleSkipPose}
              >
                Yes, Skip
              </button>
              <button
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
                onClick={() => setShowSkipConfirm(false)}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
