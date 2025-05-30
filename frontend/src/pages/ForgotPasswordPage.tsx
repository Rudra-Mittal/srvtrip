import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword } from "@/api/formroute";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendForgotPasswordOtp(email);
      toast.success("OTP sent to your email!");
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyForgotPasswordOtp(email, otp);
      toast.success("OTP verified successfully!");
      setStep('password');
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-700/25 to-purple-600/25 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-blue-700/20 rounded-full blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-700/15 to-indigo-600/15 rounded-full blur-3xl"
          animate={{
            x: [0, 80, -80, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'linear-gradient(45deg, #3b82f6, #1e40af)' 
                : i % 3 === 1 
                ? 'linear-gradient(45deg, #6366f1, #4338ca)'
                : 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
              boxShadow: i % 2 === 0 
                ? '0 0 20px rgba(59, 130, 246, 0.4)' 
                : '0 0 20px rgba(139, 92, 246, 0.4)',
            }}
            animate={{
              y: [0, -200 - Math.random() * 100, 0],
              x: [0, Math.random() * 200 - 100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.8, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Larger floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${Math.random() * 20 + 15}px`,
              height: `${Math.random() * 20 + 15}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6), transparent)',
              filter: 'blur(2px)',
            }}
            animate={{
              y: [0, -300, 0],
              x: [0, Math.random() * 150 - 75, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-lg w-full"
        >{/* Main Card */}
          <motion.div
            className="relative backdrop-blur-xl bg-slate-950/60 border border-indigo-700/30 p-8 rounded-2xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-700/30 via-purple-600/30 to-indigo-700/30 p-[1px]">
              <div className="h-full w-full rounded-2xl bg-slate-950/70" />
            </div>

            <div className="relative z-10">
              {/* Header Section */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
                  >
                    {step === 'email' && 'Forgot Password'}
                    {step === 'otp' && 'Verify OTP'}
                    {step === 'password' && 'Reset Password'}
                  </motion.h2>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-slate-300 text-sm leading-relaxed"
                  >
                    {step === 'email' && 'Enter your email to receive a verification code'}
                    {step === 'otp' && 'Enter the verification code sent to your email'}
                    {step === 'password' && 'Enter your new password'}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>              {/* Form Sections */}
              <AnimatePresence mode="wait">
                {step === 'email' && (
                  <motion.form
                    key="email-form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSendOtp}
                  >
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-indigo-300 mb-2">
                        Email Address
                      </label>                      <motion.input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-slate-900/60 border border-indigo-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your email address"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                      <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full mb-4 py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #312e81, #6b46c1, #7c3aed)',
                        backgroundSize: '200% 200%',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundPosition: '100% 0%',
                      }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%',
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 2,
                          repeat: loading ? Infinity : 0,
                          ease: "linear",
                        }
                      }}
                    >
                      <span className="relative z-10 text-white">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Sending...
                          </div>
                        ) : (
                          "Send OTP"
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => navigate("/signin")}
                      className="w-full py-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm relative overflow-hidden group border border-indigo-600/50 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(49, 46, 129, 0.1), rgba(107, 70, 193, 0.1))',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 8px 32px rgba(107, 70, 193, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                        Back to Sign In
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </motion.form>
                )}                {step === 'otp' && (
                  <motion.form
                    key="otp-form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleVerifyOtp}
                  >
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >                      <label htmlFor="otp" className="block text-sm font-medium text-indigo-300 mb-2">
                        Verification Code
                      </label>
                      <motion.input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-4 bg-slate-900/60 border border-indigo-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm tracking-widest text-center text-lg font-mono"
                        placeholder="000000"
                        maxLength={6}
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.p
                        className="mt-2 text-xs text-slate-400 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Check your email for the 6-digit code
                      </motion.p>
                    </motion.div>
                      <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full mb-4 py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #312e81, #6b46c1, #7c3aed)',
                        backgroundSize: '200% 200%',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundPosition: '100% 0%',
                      }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%',
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 2,
                          repeat: loading ? Infinity : 0,
                          ease: "linear",
                        }
                      }}
                    >
                      <span className="relative z-10 text-white">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Verifying...
                          </div>
                        ) : (
                          "Verify OTP"
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>
                      <motion.button
                      type="button"
                      onClick={() => setStep('email')}
                      className="w-full py-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm relative overflow-hidden group border border-indigo-600/50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(49, 46, 129, 0.1), rgba(107, 70, 193, 0.1))',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 8px 32px rgba(107, 70, 193, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                        Back
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </motion.form>
                )}                {step === 'password' && (
                  <motion.form
                    key="password-form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleResetPassword}
                  >
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >                      <label htmlFor="newPassword" className="block text-sm font-medium text-indigo-300 mb-2">
                        New Password
                      </label>
                      <motion.input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 bg-slate-900/60 border border-indigo-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter new password"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                    
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-300 mb-2">
                        Confirm Password
                      </label>
                      <motion.input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 bg-slate-900/60 border border-indigo-600/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Confirm new password"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                      <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #312e81, #6b46c1, #7c3aed)',
                        backgroundSize: '200% 200%',
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundPosition: '100% 0%',
                      }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%',
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 2,
                          repeat: loading ? Infinity : 0,
                          ease: "linear",
                        }
                      }}
                    >
                      <span className="relative z-10 text-white">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Resetting...
                          </div>
                        ) : (
                          "Reset Password"
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <motion.div
                className="w-8 h-[1px] bg-gradient-to-r from-transparent to-slate-500"
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
              <span>Secure & Encrypted</span>
              <motion.div
                className="w-8 h-[1px] bg-gradient-to-l from-transparent to-slate-500"
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
