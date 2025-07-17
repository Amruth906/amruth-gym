import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkoutSessions } from "../utils/firebaseStorage";

export const ProgressTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchSessions() {
      const sessions = await getWorkoutSessions();
      // Sort by date descending
      const sorted = sessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentSessions(sorted.slice(0, 10));
      // Calculate streak
      let streakCount = 0;
      let prevDate = new Date();
      for (let i = 0; i < sorted.length; i++) {
        const sessionDate = new Date(sorted[i].date);
        // For the first session, check if it's today or yesterday
        if (i === 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          sessionDate.setHours(0, 0, 0, 0);
          const diff =
            (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 0 || diff === 1) {
            streakCount = 1;
            prevDate = sessionDate;
          } else {
            break;
          }
        } else {
          // Check if the session is exactly one day before the previous
          prevDate.setDate(prevDate.getDate() - 1);
          if (sessionDate.getTime() === prevDate.getTime()) {
            streakCount++;
            prevDate = sessionDate;
          } else {
            break;
          }
        }
      }
      setStreak(streakCount);
    }
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform duration-200"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-green-700 mb-2 text-center">
          Progress Tracker
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Track your fitness journey, view your recent sessions, and keep your
          streak alive!
        </p>
        {/* Streak Counter */}
        <div className="mb-8 flex flex-col items-center">
          <div className="text-2xl font-bold text-orange-500 mb-1">
            🔥 {streak} Day Streak
          </div>
          <div className="text-sm text-gray-600">Keep up the consistency!</div>
        </div>
        {/* Progress Chart Placeholder */}
        <div className="w-full h-48 bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl flex items-center justify-center mb-10 shadow-inner">
          <span className="text-gray-500 text-lg">
            [Progress Chart Coming Soon]
          </span>
        </div>
        {/* Recent Sessions */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            Recent Sessions
          </h2>
          <ul className="divide-y divide-purple-100">
            {recentSessions.map((session, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  {session.workoutType || session.type}
                </span>
                <span className="text-gray-600">
                  {session.exercises
                    ? session.exercises[0]?.exerciseName
                    : session.details}
                </span>
                <span className="text-gray-400 text-sm">{session.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
