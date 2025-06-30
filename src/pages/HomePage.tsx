import React from "react";
import {
  Dumbbell,
  Calendar,
  Target,
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Star,
  Heart,
  Rocket,
  Crown,
} from "lucide-react";
import { CategoryCard } from "../components/CategoryCard";
import { WeeklyScheduleCard } from "../components/WeeklyScheduleCard";
import { workoutCategories, weeklySchedule } from "../data/workouts";

export const HomePage: React.FC = () => {
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

          {/* Enhanced Subtitle */}
          <p className="text-2xl md:text-3xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg text-center">
            Experience the future of fitness with our{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent font-bold">
              revolutionary
            </span>{" "}
            workout programs. From{" "}
            <span className="text-white font-bold drop-shadow-lg">
              beginner to elite
            </span>
            , achieve your dreams today.
          </p>

          {/* Enhanced Feature Pills */}
          {/* Removed the feature pills and CTA buttons below the subtitle for a cleaner look */}

          {/* Enhanced CTA Buttons */}
          {/* Removed the CTA buttons below the subtitle for a cleaner look */}
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

      {/* Enhanced Weekly Schedule */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent">
                WEEKLY
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                PLAN
              </span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              Follow our structured weekly workout plan for optimal results and
              consistent progress
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-12">
            {weeklySchedule.map((day, index) => (
              <WeeklyScheduleCard key={day.shortDay} day={day} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                WHY
              </span>{" "}
              <span className="bg-gradient-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent">
                CHOOSE
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                US?
              </span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium">
              Everything you need for a complete fitness transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-yellow-300/30">
              <div className="bg-gradient-to-r from-yellow-300 to-orange-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-yellow-300/50 transition-shadow duration-300">
                <Target size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Targeted Training
              </h3>
              <p className="text-white/90 leading-relaxed">
                Focus on specific muscle groups with expertly designed exercises
              </p>
            </div>

            <div className="group text-center p-8 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-cyan-300/30">
              <div className="bg-gradient-to-r from-cyan-300 to-blue-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-cyan-300/50 transition-shadow duration-300">
                <Calendar size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Smart Schedule
              </h3>
              <p className="text-white/90 leading-relaxed">
                Follow our proven weekly routine for consistent progress
              </p>
            </div>

            <div className="group text-center p-8 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-pink-300/30">
              <div className="bg-gradient-to-r from-pink-300 to-purple-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-pink-300/50 transition-shadow duration-300">
                <TrendingUp size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Quick Results
              </h3>
              <p className="text-white/90 leading-relaxed">
                See improvements in strength and endurance in just weeks
              </p>
            </div>

            <div className="group text-center p-8 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-green-300/30">
              <div className="bg-gradient-to-r from-green-300 to-emerald-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-green-300/50 transition-shadow duration-300">
                <Award size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Proven Success
              </h3>
              <p className="text-white/90 leading-relaxed">
                Join thousands of users who have achieved their fitness goals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom CTA */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-12">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                READY
              </span>{" "}
              <span className="bg-gradient-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent">
                TO
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                TRANSFORM?
              </span>
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Start your fitness journey today and become the best version of
              yourself
            </p>
            <button className="group relative px-12 py-4 bg-gradient-to-r from-pink-300 to-purple-400 text-white font-bold text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-300/50">
              <span className="relative z-10 flex items-center gap-3">
                <Users className="w-6 h-6" />
                Join the Community
                <Sparkles className="w-6 h-6" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
