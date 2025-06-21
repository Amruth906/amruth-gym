import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { WorkoutHeader } from "../components/WorkoutHeader";
import { ExerciseCard } from "../components/ExerciseCard";
import { workoutCategories } from "../data/workouts";

export const WorkoutPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const workoutCategory = workoutCategories.find((cat) => cat.id === category);

  if (!workoutCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Workout Not Found</h1>
          <p className="text-xl">
            The requested workout category could not be found.
          </p>
        </div>
      </div>
    );
  }

  const handleStartTracking = () => {
    navigate(`/tracker/category/${workoutCategory.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <WorkoutHeader
        title={workoutCategory.name}
        subtitle={workoutCategory.description}
        exerciseCount={workoutCategory.exercises.length}
        gradient={workoutCategory.color}
        icon={workoutCategory.icon}
      />

      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Exercises
                </h2>
                <p className="text-lg text-gray-600">
                  Complete these exercises to build strength in your{" "}
                  {workoutCategory.name.toLowerCase()} muscles.
                </p>
              </div>

              <button
                onClick={handleStartTracking}
                className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Play size={20} />
                Start Tracking Workout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutCategory.exercises.map((exercise, index) => (
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
