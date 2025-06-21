// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { Home, History, Menu, X, Sparkles, Zap } from "lucide-react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-yellow-300 to-orange-400 p-2 rounded-full shadow-lg group-hover:shadow-yellow-300/50 transition-shadow duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                AMRUTHFit
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-white shadow-lg shadow-yellow-300/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive("/history")
                  ? "bg-gradient-to-r from-cyan-300 to-blue-400 text-white shadow-lg shadow-cyan-300/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <History className="w-4 h-4" />
              History
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            {/* Desktop Profile */}
            <div className="hidden md:block">
              <ProfileDropdown />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>

              <Link
                to="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive("/history")
                    ? "bg-gradient-to-r from-cyan-300 to-blue-400 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <History className="w-5 h-5" />
                History
              </Link>

              {/* Mobile Profile */}
              <div className="px-4 py-3">
                <ProfileDropdown />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
