// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import PhoneLogin from "../components/PhoneLogin";
import EmailLogin from "../components/EmailLogin";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Zap, Target, TrendingUp } from "lucide-react";

export const LoginPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

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
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-purple-200/80 text-lg">
              Continue your fitness journey with us
            </p>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-500">
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">
                  Real-time Sync
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">
                  Track Progress
                </span>
              </div>
            </div>

            {/* Login Methods */}
            <div className="space-y-6">
              {/* Google Login */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <GoogleLogin />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email Login */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <EmailLogin />
              </div>

              {/* Phone Login */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <PhoneLogin />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                By continuing, you agree to our{" "}
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
              <span>Powered by cutting-edge technology</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
