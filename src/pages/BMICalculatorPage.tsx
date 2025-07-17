import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BMICalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState(170); // in cm
  const [weight, setWeight] = useState(70); // in kg
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;
    const bmiValue = weight / Math.pow(height / 100, 2);
    setBmi(bmiValue);
    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 24.9) setCategory("Normal weight");
    else if (bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform duration-200"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-yellow-700 mb-2 text-center">
          BMI Calculator
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Calculate your Body Mass Index and understand your health status.
        </p>
        <form
          onSubmit={calculateBMI}
          className="w-full flex flex-col gap-6 mb-8"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={50}
              max={250}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min={20}
              max={300}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 bg-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Calculate BMI
          </button>
        </form>
        {bmi && (
          <div className="w-full text-center mt-4">
            <div className="text-2xl font-bold text-orange-500 mb-2">
              Your BMI: {bmi.toFixed(1)}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              Category: {category}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
