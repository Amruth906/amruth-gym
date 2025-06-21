import React from 'react';
import { Exercise } from '../types/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800'
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  index
}) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
            {exercise.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {exercise.difficulty && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
            )}
            {exercise.section && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {exercise.section}
              </span>
            )}
          </div>
        </div>
        <div className="text-2xl ml-4">
          {exercise.category === 'chest' && '💪'}
          {exercise.category === 'back' && '🏋️'}
          {exercise.category === 'arms' && '💥'}
          {exercise.category === 'legs' && '🦵'}
          {exercise.category === 'core' && '⭐'}
        </div>
      </div>
      
      {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Target Muscles:</p>
          <div className="flex flex-wrap gap-1">
            {exercise.targetMuscles.map((muscle, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};