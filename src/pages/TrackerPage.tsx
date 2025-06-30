import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { WorkoutTracker } from "../components/WorkoutTracker";
import { workoutCategories, weeklySchedule } from "../data/workouts";
import { Exercise } from "../types/workout";

export const TrackerPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  let exercises: Exercise[] = [];
  let workoutTitle = "";
  let workoutDescription = "";

  if (type === "category" && id) {
    const category = workoutCategories.find((cat) => cat.id === id);
    if (category) {
      exercises = category.exercises;
      workoutTitle = category.name;
      workoutDescription = category.description;
    }
  } else if (type === "schedule" && id) {
    const day = weeklySchedule.find(
      (d) => d.shortDay.toLowerCase() === id.toLowerCase()
    );
    if (day) {
      exercises = day.exercises;
      workoutTitle = `${day.day} - ${day.workout}`;
      workoutDescription = day.description;
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-pink-400 to-purple-600 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center text-white">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12">
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Workout Not Found
            </h1>
            <p className="text-xl text-white/80 mb-8">
              The requested workout could not be found.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-pink-400 to-purple-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white/90 hover:text-white px-6 py-3 rounded-full border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="font-semibold">Back</span>
            </button>

            <button
              onClick={() => navigate("/history")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-pink-400/50"
            >
              <BarChart3
                size={18}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-semibold">View History</span>
            </button>
          </div>

          {/* Workout Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full shadow-2xl">
                    <Target size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  {workoutTitle}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
                {workoutDescription}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">
                    {exercises.length} exercises
                  </span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                  <span className="text-white font-semibold">
                    Track Progress
                  </span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                  <Sparkles className="w-5 h-5 text-pink-300" />
                  <span className="text-white font-semibold">
                    Real-time Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracker */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-2">
            <WorkoutTracker
              exercises={exercises}
              workoutType={workoutTitle}
              onSave={() => {
                // Could add success notification here
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
