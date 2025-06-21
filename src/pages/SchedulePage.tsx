import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { ExerciseCard } from "../components/ExerciseCard";
import { weeklySchedule } from "../data/workouts";

const dayColors = [
  "bg-gradient-to-br from-red-500 to-pink-600",
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-green-500 to-emerald-600",
  "bg-gradient-to-br from-purple-500 to-violet-600",
  "bg-gradient-to-br from-orange-500 to-red-500",
  "bg-gradient-to-br from-teal-500 to-cyan-600",
  "bg-gradient-to-br from-yellow-500 to-orange-500",
];

export const SchedulePage: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const workoutDay = weeklySchedule.find(
    (d) => d.shortDay.toLowerCase() === day?.toLowerCase()
  );

  if (!workoutDay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Day Not Found</h1>
          <p className="text-xl">
            The requested workout day could not be found.
          </p>
        </div>
      </div>
    );
  }

  const dayIndex = weeklySchedule.findIndex(
    (d) => d.shortDay.toLowerCase() === day?.toLowerCase()
  );
  const gradient = dayColors[dayIndex] || dayColors[0];

  const handleStartTracking = () => {
    navigate(`/tracker/schedule/${workoutDay.shortDay.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <WorkoutHeader
        title={`${workoutDay.day} - ${workoutDay.workout}`}
        subtitle={workoutDay.description}
        exerciseCount={workoutDay.exercises.length}
        gradient={gradient}
      />

      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Today's Workout
                </h2>
                <p className="text-lg text-gray-600">
                  Complete this {workoutDay.workout} routine focusing on{" "}
                  {workoutDay.description.toLowerCase()}.
                </p>
              </div>

              <button
                onClick={handleStartTracking}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Play size={20} />
                Start Tracking Workout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutDay.exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
