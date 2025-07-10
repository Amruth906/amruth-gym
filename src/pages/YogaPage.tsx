import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yogaCategories } from "../data/yoga";

export const YogaPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200";
      case "Beginner / Intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const selectedCategoryData = categoryId
    ? yogaCategories.find((cat) => cat.id === categoryId)
    : null;

  if (categoryId && selectedCategoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-blue-200 pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/yoga")}
            className="mb-8 flex items-center text-green-700 hover:text-green-800 font-semibold"
          >
            ← Back to Categories
          </button>

          <div className="text-center mb-12">
            <span className="text-6xl mb-4 block">
              {selectedCategoryData.icon}
            </span>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {selectedCategoryData.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {selectedCategoryData.description}
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-200"
              onClick={() =>
                navigate(`/yoga-tracker/${selectedCategoryData.id}`)
              }
            >
              Start
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCategoryData.poses.map((pose, idx) => (
              <div
                key={pose.name + idx}
                className="bg-white/80 rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {pose.name}
                  </h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(
                      pose.difficulty
                    )}`}
                  >
                    {pose.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-blue-200 pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-7xl mb-6 block">🧘‍♀️</span>
          <h1 className="text-5xl md:text-6xl font-black text-green-700 mb-6 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              EXPLORE
            </span>{" "}
            <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              YOGA
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Choose a category to discover yoga poses and build your practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yogaCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/yoga/${category.id}`)}
              className={`rounded-3xl shadow-xl p-8 flex flex-col items-center ${category.color} bg-opacity-80 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            >
              <span className="text-6xl mb-6">{category.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {category.name}
              </h2>
              <p className="text-gray-700 text-center mt-2">
                {category.description}
              </p>
              <div className="mt-4 text-sm text-gray-600">
                {category.poses.length} poses
              </div>
              {/* Removed Start button from here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
