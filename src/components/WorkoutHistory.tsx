import React, { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Clock,
  Flame,
  Loader2,
  Trash2,
} from "lucide-react";
import { WorkoutSession } from "../types/workout";
import { onValue, ref } from "firebase/database";
import { db, auth } from "../firebase";
import {
  deleteWorkoutSession,
  clearAllWorkoutData,
} from "../utils/firebaseStorage";

export const WorkoutHistory: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCalories: 0,
    totalWorkoutTime: 0,
    averageCaloriesPerSession: 0,
  });
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      setLoading(true);
      try {
        // Set up real-time listener
        unsubscribe = setupRealtimeListener();
      } catch (error) {
        console.error("Error initializing data:", error);
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const setupRealtimeListener = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("[WorkoutHistory] No user ID, skipping real-time listener");
      setLoading(false);
      return;
    }

    console.log(
      "[WorkoutHistory] Setting up real-time listener for user:",
      userId
    );
    const sessionsRef = ref(db, `users/${userId}/workoutSessions`);

    const unsubscribe = onValue(
      sessionsRef,
      (snapshot) => {
        console.log(
          "[WorkoutHistory] Real-time update received, exists:",
          snapshot.exists()
        );
        if (snapshot.exists()) {
          const sessions: WorkoutSession[] = [];
          snapshot.forEach((childSnapshot) => {
            const sessionData = childSnapshot.val();
            if (sessionData) {
              sessions.push(sessionData);
            }
          });

          console.log(
            "[WorkoutHistory] Loaded sessions count:",
            sessions.length
          );
          const sortedSessions = sessions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setSessions(sortedSessions);

          // Update stats
          const totalSessions = sortedSessions.length;
          const totalCalories = sortedSessions.reduce(
            (sum, session) => sum + session.totalCalories,
            0
          );
          const totalWorkoutTime = sortedSessions.reduce(
            (sum, session) => sum + session.totalDuration,
            0
          );
          const averageCaloriesPerSession =
            totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0;

          setStats({
            totalSessions,
            totalCalories,
            totalWorkoutTime,
            averageCaloriesPerSession,
          });
        } else {
          console.log("[WorkoutHistory] No sessions found in database");
          setSessions([]);
          setStats({
            totalSessions: 0,
            totalCalories: 0,
            totalWorkoutTime: 0,
            averageCaloriesPerSession: 0,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("[WorkoutHistory] Real-time listener error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const filteredSessions = selectedDate
    ? sessions.filter((session) => session.date === selectedDate)
    : sessions;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSession(sessionId);
    try {
      await deleteWorkoutSession(sessionId);
    } finally {
      setDeletingSession(null);
    }
  };

  const handleDeleteAll = async () => {
    setClearingAll(true);
    try {
      await clearAllWorkoutData();
      setShowConfirm(false);
    } finally {
      setClearingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-gray-600">
              Loading your workout history...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pt-24">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout History
          </h1>
          <p className="text-gray-600">
            Track your progress and view past workout sessions
          </p>
        </div>
        {filteredSessions.length > 0 && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition-all"
            onClick={() => setShowConfirm(true)}
            disabled={clearingAll}
          >
            <Trash2 className="w-5 h-5" />
            {clearingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {/* Confirm Delete All Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Confirm Delete All
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete <b>all</b> workout sessions? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                onClick={handleDeleteAll}
                disabled={clearingAll}
              >
                Yes, Delete All
              </button>
              <button
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
                onClick={() => setShowConfirm(false)}
                disabled={clearingAll}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Flame className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(stats.totalCalories)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(stats.totalWorkoutTime / 60)}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Calories</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageCaloriesPerSession}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            Filter by date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No workout sessions found.</p>
            <p className="text-sm text-gray-500 mt-2">
              Start tracking your workouts to see them here!
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-md p-6 relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {session.workoutType}
                  </h3>
                  <p className="text-gray-600">{formatDate(session.date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {session.totalDuration} min
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-semibold text-orange-600">
                    {session.totalCalories}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sets</p>
                  <p className="font-semibold text-blue-600">
                    {session.totalSets}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Reps</p>
                  <p className="font-semibold text-green-600">
                    {session.totalReps}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
              <button
                className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-all"
                onClick={() => handleDeleteSession(session.id)}
                disabled={deletingSession === session.id}
                title="Delete session"
              >
                {deletingSession === session.id ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
