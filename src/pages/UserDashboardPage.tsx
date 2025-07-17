import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const UserDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-2 text-center">
          Welcome{currentUser ? `, ${currentUser.email}` : "!"}
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          This is your fitness dashboard. Track your progress, calculate your
          BMI, and stay motivated!
        </p>
        {/* Quick Stats Placeholder */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-200 to-blue-400 text-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold mb-2">0</div>
            <div className="text-sm font-medium">Workouts Completed</div>
          </div>
          <div className="bg-gradient-to-br from-pink-200 to-pink-400 text-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold mb-2">0</div>
            <div className="text-sm font-medium">Yoga Sessions</div>
          </div>
          <div className="bg-gradient-to-br from-purple-200 to-purple-400 text-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold mb-2">0</div>
            <div className="text-sm font-medium">Calories Burned</div>
          </div>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button
            onClick={() => navigate("/progress-tracker")}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            Progress Tracker
          </button>
          <button
            onClick={() => navigate("/bmi-calculator")}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            BMI Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
