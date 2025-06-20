import  { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // Extract the OTP (action code) from the URL if not manually entered
      const queryParams = new URLSearchParams(location.search);
      const actionCode = otp || queryParams.get("oobCode");

      if (!actionCode) {
        throw new Error("No OTP provided.");
      }

      // Verify the OTP using Firebase's applyActionCode
      await applyActionCode(auth, actionCode);

      // Show success message
      toast.success("Email verified successfully!");

      // Redirect to the landing page
      navigate("/", { replace: true });
    } catch (err: any) {
      // console.error("OTP verification error:", err);
      toast.error("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-400 mb-6">
          Enter the OTP sent to your email to verify your account.
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}