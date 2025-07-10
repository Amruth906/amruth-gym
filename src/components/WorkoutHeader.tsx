import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutHeaderProps {
  title: string;
  subtitle: string;
  exerciseCount: number;
  gradient: string;
  icon?: string;
  onBack?: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  title,
  subtitle,
  exerciseCount,
  gradient,
  icon,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className={`${gradient} text-white py-16 px-6 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4 mb-4">
          {icon && <span className="text-5xl">{icon}</span>}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{title}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">{subtitle}</p>
            <p className="text-lg text-white/80">{exerciseCount} exercises</p>
          </div>
        </div>
      </div>
    </div>
  );
};
