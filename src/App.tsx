import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { SchedulePage } from "./pages/SchedulePage";
import { TrackerPage } from "./pages/TrackerPage";
import { WorkoutHistory } from "./components/WorkoutHistory";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DataPage } from "./pages/DataPage";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#a7ffeb] via-[#40c9ff] to-[#30a2ff]">
        {/* You can use a spinner here if you want */}
      </div>
    );
  }
  return (
    <>
      {currentUser && <Navbar />}
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/:category"
            element={
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule/:day"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker/:type/:id"
            element={
              <ProtectedRoute>
                <TrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <DataPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
          theme="colored"
          style={{
            zIndex: 9999,
            fontSize: "1.1rem",
            borderRadius: "1rem",
            minWidth: 320,
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
