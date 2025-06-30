import React, { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Phone, MessageSquare, Shield, CheckCircle } from "lucide-react";

// Extend Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const PhoneLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!phone) {
      setError("Please enter a phone number");
      return;
    }

    // Validate phone number format
    let formattedPhone = phone.trim();

    // Remove any non-digit characters except +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, "");

    // Ensure it starts with + and has country code
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+91" + formattedPhone; // Default to India +91
    }

    // Validate the final format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formattedPhone)) {
      setError(
        "Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      setConfirmation(confirmationResult);
      setOtpSent(true);
      console.log("OTP sent!");
    } catch (error: unknown) {
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code?: string; message?: string };
        console.error("SMS Error:", err);
        if (err.code === "auth/invalid-phone-number") {
          setError(
            "Invalid phone number format. Please use format: +91XXXXXXXXXX"
          );
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(err.message || "Failed to send OTP");
        }
      } else {
        setError("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (!confirmation) {
      setError("No confirmation available");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await confirmation.confirm(otp);
      console.log("Phone User:", result.user);
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error && "message" in error) {
        const err = error as { message?: string };
        setError(err.message || "Invalid OTP");
        console.error("OTP Error:", err);
      } else {
        setError("Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Phone Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-white/50" />
        </div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91XXXXXXXXXX (with country code)"
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
          disabled={loading || otpSent}
        />
      </div>

      {/* Send OTP Button */}
      <button
        onClick={sendOTP}
        disabled={loading || otpSent}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending OTP...
          </>
        ) : otpSent ? (
          <>
            <CheckCircle className="w-4 h-4" />
            OTP Sent Successfully
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            Send OTP
          </>
        )}
      </button>

      {/* OTP Input Section */}
      {otpSent && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-white/50" />
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Verify OTP Button */}
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying OTP...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify OTP
              </>
            )}
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;
