import React from "react";
import { CategoryCard } from "../components/CategoryCard";
import { workoutCategories } from "../data/workouts";

export const WorkoutHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a7ffeb] via-[#40c9ff] to-[#30a2ff] relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-300/40 to-orange-400/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-300/40 to-purple-400/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-300/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-r from-red-300/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/70 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 mt-32">
        <div className="max-w-6xl w-full text-center mx-auto">
          {/* Enhanced Main Heading */}
          {/* Removed the main heading text completely */}
        </div>
      </div>

      {/* Enhanced Workout Categories */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                EXPLORE
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                WORKOUTS
              </span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              Choose from our specialized categories to target specific muscle
              groups and achieve your fitness goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workoutCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                exerciseCount={category.exercises.length}
                icon={category.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
