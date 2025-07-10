import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play } from "lucide-react";

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

export const DaySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { day } = useParams();
  const dayData = weeklyPlan.find((d) => d.workoutRoute === day);
  const dayIndex = weeklyPlan.findIndex((d) => d.workoutRoute === day);
  const gradientColors = dayGradients[dayIndex % dayGradients.length];

  if (!dayData) {
    return <div className="text-center text-2xl mt-32">Day not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a7ffeb] via-[#40c9ff] to-[#30a2ff] pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            if (window.history.length <= 2) {
              navigate("/", { replace: true });
            } else {
              navigate(-1);
            }
          }}
          className="mb-8 flex items-center text-white hover:text-yellow-200 font-semibold transition-colors duration-300"
        >
          ← Back to Weekly Plan
        </button>
        <div className="text-center mb-12">
          <div
            className={`bg-gradient-to-r ${gradientColors} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
          >
            <h1 className="text-2xl font-black text-white">
              {dayData.shortDay}
            </h1>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{dayData.day}</h1>
          <p className="text-lg text-white/80">
            Choose your activity for today
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Workout Option */}
          <div
            onClick={() => navigate(`/schedule/${dayData.workoutRoute}`)}
            className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
            ></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">💪</div>
                <h2 className="text-2xl font-black text-white mb-2">Workout</h2>
                <p className="text-white/80">{dayData.workout}</p>
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
          {dayData.yoga && (
            <div
              onClick={() => navigate(`/yoga-session/${dayData.workoutRoute}`)}
              className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
              ></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🧘‍♀️</div>
                  <h2 className="text-2xl font-black text-white mb-2">Yoga</h2>
                  <p className="text-white/80">{dayData.yoga}</p>
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
};
