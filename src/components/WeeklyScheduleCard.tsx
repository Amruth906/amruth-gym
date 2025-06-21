import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Zap } from "lucide-react";
import { WorkoutDay } from "../types/workout";

interface WeeklyScheduleCardProps {
  day: WorkoutDay;
  index: number;
}

const dayGradients = [
  "from-red-400 via-pink-500 to-rose-500",
  "from-blue-400 via-indigo-500 to-purple-500",
  "from-green-400 via-emerald-500 to-teal-500",
  "from-purple-400 via-violet-500 to-indigo-500",
  "from-orange-400 via-red-500 to-pink-500",
  "from-teal-400 via-cyan-500 to-blue-500",
  "from-yellow-400 via-orange-500 to-red-500",
];

export const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({
  day,
  index,
}) => {
  const navigate = useNavigate();

  const handleViewSchedule = () => {
    navigate(`/schedule/${day.shortDay.toLowerCase()}`);
  };

  const handleStartTracking = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tracker/schedule/${day.shortDay.toLowerCase()}`);
  };

  const gradientColors = dayGradients[index % dayGradients.length];

  return (
    <div
      onClick={handleViewSchedule}
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
            <h3 className="text-lg font-black text-white">{day.shortDay}</h3>
          </div>
          <h2 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
            {day.workout}
          </h2>
        </div>

        {/* Description */}
        <p className="text-white/80 text-sm text-center mb-4 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {day.description}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white border border-white/30">
            {day.exercises.length} exercises
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={handleStartTracking}
              className={`bg-gradient-to-r ${gradientColors} hover:shadow-lg rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
              title="Start tracking workout"
            >
              <Play size={16} className="text-white" />
            </button>
            <Zap className="w-4 h-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};
