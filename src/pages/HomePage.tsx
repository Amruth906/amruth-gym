import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Play,
  Sparkles,
  Zap,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Handle navigation state when coming back from workout pages
  useEffect(() => {
    if (location.state?.selectedDay) {
      setSelectedDay(location.state.selectedDay);
      // Clear the state to prevent it from persisting
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const weeklyPlan = [
    {
      day: "Monday",
      shortDay: "MON",
      workout: "Push 1",
      yoga: "Standing Poses",
      workoutRoute: "mon",
      yogaRoute: "standing",
    },
    {
      day: "Tuesday",
      shortDay: "TUE",
      workout: "Pull 1",
      yoga: "Seated & Forward Bends",
      workoutRoute: "tue",
      yogaRoute: "seated",
    },
    {
      day: "Wednesday",
      shortDay: "WED",
      workout: "Leg Day 1",
      yoga: "Twists",
      workoutRoute: "wed",
      yogaRoute: "twists",
    },
    {
      day: "Thursday",
      shortDay: "THU",
      workout: "Push 2",
      yoga: "Balancing Poses",
      workoutRoute: "thu",
      yogaRoute: "balancing",
    },
    {
      day: "Friday",
      shortDay: "FRI",
      workout: "Pull 2",
      yoga: "Core & Arm Strength",
      workoutRoute: "fri",
      yogaRoute: "core-arm",
    },
    {
      day: "Saturday",
      shortDay: "SAT",
      workout: "Leg Day 2",
      yoga: "Backbends",
      workoutRoute: "sat",
      yogaRoute: "backbends",
    },
    {
      day: "Sunday",
      shortDay: "SUN",
      workout: "Abs/Core",
      yoga: "",
      workoutRoute: "sun",
      yogaRoute: "",
    },
  ];

  const dayGradients = [
    "from-red-400 via-pink-500 to-rose-500",
    "from-blue-400 via-indigo-500 to-purple-500",
    "from-green-400 via-emerald-500 to-teal-500",
    "from-purple-400 via-violet-500 to-indigo-500",
    "from-orange-400 via-red-500 to-pink-500",
    "from-teal-400 via-cyan-500 to-blue-500",
    "from-yellow-400 via-orange-500 to-red-500",
  ];

  const selectedDayData = selectedDay
    ? weeklyPlan.find((day) => day.day === selectedDay)
    : null;

  if (selectedDay && selectedDayData) {
    const dayIndex = weeklyPlan.findIndex((day) => day.day === selectedDay);
    const gradientColors = dayGradients[dayIndex % dayGradients.length];

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#a7ffeb] via-[#40c9ff] to-[#30a2ff] pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedDay(null)}
            className="mb-8 flex items-center text-white hover:text-yellow-200 font-semibold transition-colors duration-300"
          >
            ← Back to Weekly Plan
          </button>

          <div className="text-center mb-12">
            <div
              className={`bg-gradient-to-r ${gradientColors} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            >
              <h1 className="text-2xl font-black text-white">
                {selectedDayData.shortDay}
              </h1>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {selectedDayData.day}
            </h1>
            <p className="text-lg text-white/80">
              Choose your activity for today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workout Option */}
            <div
              onClick={() =>
                navigate(`/schedule/${selectedDayData.workoutRoute}`)
              }
              className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
              ></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">💪</div>
                  <h2 className="text-2xl font-black text-white mb-2">
                    Workout
                  </h2>
                  <p className="text-white/80">{selectedDayData.workout}</p>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className={`bg-gradient-to-r ${gradientColors} hover:shadow-lg rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
                  >
                    <Play size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Yoga Option */}
            {selectedDayData.yoga && (
              <div
                onClick={() =>
                  navigate(`/yoga-session/${selectedDayData.workoutRoute}`)
                }
                className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                ></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">🧘‍♀️</div>
                    <h2 className="text-2xl font-black text-white mb-2">
                      Yoga
                    </h2>
                    <p className="text-white/80">{selectedDayData.yoga}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className={`bg-gradient-to-r ${gradientColors} hover:shadow-lg rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
                    >
                      <Play size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a7ffeb] via-[#40c9ff] to-[#30a2ff] pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Cards Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
              FITNESS
            </span>{" "}
            <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
              HUB
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg text-center">
            Experience the future of fitness with our
            <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent font-bold">
              {" "}
              revolutionary{" "}
            </span>
            workout programs. From
            <span className="text-white font-bold drop-shadow-lg">
              {" "}
              beginner to elite{" "}
            </span>
            , achieve your dreams today.
          </p>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium mb-12">
            Choose your path to wellness and strength
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 justify-center mb-20">
          {/* Workouts Card */}
          <button
            onClick={() => navigate("/workouts")}
            className="w-80 h-64 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-transparent hover:border-blue-400 hover:shadow-blue-300/40 transition-all duration-300 group relative overflow-hidden"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
          >
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200/30 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
            <span className="relative z-10 flex flex-col items-center">
              <span className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100/70 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-6xl">
                💪
              </span>
              <span className="text-3xl font-extrabold text-blue-700 mb-2 tracking-wide drop-shadow-lg">
                Workouts
              </span>
              <span className="text-lg text-gray-700 font-medium">
                Strength, Cardio, Fitness
              </span>
            </span>
          </button>
          {/* Yoga Card */}
          <button
            onClick={() => navigate("/yoga")}
            className="w-80 h-64 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-transparent hover:border-green-400 hover:shadow-green-300/40 transition-all duration-300 group relative overflow-hidden"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
          >
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-200/30 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
            <span className="relative z-10 flex flex-col items-center">
              <span className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100/70 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-6xl">
                🧘‍♂️
              </span>
              <span className="text-3xl font-extrabold text-green-700 mb-2 tracking-wide drop-shadow-lg">
                Yoga
              </span>
              <span className="text-lg text-gray-700 font-medium">
                Flexibility, Balance, Mindfulness
              </span>
            </span>
          </button>
        </div>

        {/* Weekly Plan Section */}
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
            Follow our structured weekly plan for optimal results and consistent
            progress
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-12">
          {weeklyPlan.map((dayPlan, index) => {
            const gradientColors = dayGradients[index % dayGradients.length];

            return (
              <div
                key={dayPlan.day}
                onClick={() => navigate(`/day/${dayPlan.workoutRoute}`)}
                className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                ></div>

                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                  {/* Day Header */}
                  <div className="text-center mb-4">
                    <div
                      className={`bg-gradient-to-r ${gradientColors} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <h3 className="text-lg font-black text-white">
                        {dayPlan.shortDay}
                      </h3>
                    </div>
                    <h2 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
                      {dayPlan.day}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-sm text-center mb-4 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    Choose your activity for {dayPlan.day}
                  </p>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white border border-white/30">
                      2 activities
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div
                        className={`bg-gradient-to-r ${gradientColors} hover:shadow-lg rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
                      >
                        <Play size={16} className="text-white" />
                      </div>
                      <Zap className="w-4 h-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WHY CHOOSE US Section */}
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
                  Focus on specific muscle groups with expertly designed
                  exercises
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

        {/* READY TO TRANSFORM Section */}
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
    </div>
  );
};
