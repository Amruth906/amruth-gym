import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Zap } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  exerciseCount: number;
  icon: string;
  color: string;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  exerciseCount,
  icon,
  color,
  index,
}) => {
  const navigate = useNavigate();

  const handleViewExercises = () => {
    navigate(`/workout/${id}`);
  };

  const handleStartTracking = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tracker/category/${id}`);
  };

  // Define gradient colors based on category
  const getGradientColors = (index: number) => {
    const gradients = [
      "from-yellow-400 via-orange-500 to-pink-500",
      "from-cyan-400 via-blue-500 to-purple-500",
      "from-pink-400 via-purple-500 to-indigo-500",
      "from-green-400 via-emerald-500 to-teal-500",
      "from-red-400 via-pink-500 to-rose-500",
      "from-indigo-400 via-purple-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  const gradientColors = getGradientColors(index);

  return (
    <div
      className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500 animate-fadeIn"
      style={{ animationDelay: `${index * 150}ms` }}
      onClick={handleViewExercises}
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
      ></div>

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
        {/* Icon Section */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`bg-gradient-to-r ${gradientColors} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            <span className="text-3xl">{icon}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Zap className="w-5 h-5 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
            {name}
          </h3>
          <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold text-white border border-white/30">
            {exerciseCount} exercises
          </div>
          <button
            onClick={handleStartTracking}
            className={`bg-gradient-to-r ${gradientColors} hover:shadow-lg rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-12`}
            title="Start tracking workout"
          >
            <Play size={20} className="text-white" />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};
