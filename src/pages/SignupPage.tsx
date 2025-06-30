// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Zap, UserPlus, Shield, Award } from "lucide-react";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code?: string; message?: string };
        console.error("Signup Error:", err);
        // Provide user-friendly error messages
        if (err.code === "auth/email-already-in-use") {
          setError(
            "An account with this email already exists. Please sign in instead."
          );
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (err.code === "auth/weak-password") {
          setError("Password should be at least 6 characters long.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many failed attempts. Please try again later.");
        } else if (err.code === "auth/network-request-failed") {
          setError("Network error. Please check your internet connection.");
        } else {
          setError("Failed to create account. Please try again.");
        }
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
              Join the Journey
            </h1>
            <p className="text-purple-200/80 text-lg">
              Start your fitness transformation today
            </p>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-500">
            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-xs font-medium text-center">
                  Real-time Sync
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-xs font-medium text-center">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-xs font-medium text-center">
                  Achievements
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-white/90 text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-white/90 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white/90 text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-300 hover:text-white transition-colors font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                By creating an account, you agree to our{" "}
                <a
                  href="#"
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-white/40 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Join thousands of fitness enthusiasts</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
