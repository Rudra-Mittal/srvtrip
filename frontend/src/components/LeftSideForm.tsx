import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function LeftSideForm({ type }: { type: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  // Initialize step based on the form type
  const [step, setStep] = useState<'signup' | 'verify' | 'signin'>(type === 'signup' ? 'signup' : 'signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      toast.success('OTP sent to your email!');
      setStep('verify'); // Move to the OTP verification step
    } catch (err: any) {
      console.error('OTP generation error:', err);
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password, name }),
      });

      if (!response.ok) {
        throw new Error('Invalid or expired OTP');
      }

      toast.success('Signup successful!');
      navigate('/'); // Redirect to the landing page
    } catch (err: any) {
      console.error('OTP verification error:', err);
      toast.error(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      toast.success('Sign in successful!');
      navigate('/'); // Redirect to the landing page
    } catch (err: any) {
      console.error('Sign in error:', err);
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-full p-8 md:p-12 bg-black/95 text-white">
      <div className="mb-8">
        <div className="flex items-center">
          <span className="font-bold text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            srvTrip
          </span>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        {type === 'signup' ? 'Create an account' : 'Sign in to your account'}
      </h1>

      <p className="text-sm text-blue-200 mb-6">
        {type === 'signup'
          ? "Let's get started with your first trip."
          : 'Welcome back! Please enter your details to continue.'}
      </p>

      {step === 'signup' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateOtp();
          }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Sign Up'}
          </button>
          
          <p className="text-sm text-center text-blue-200 mt-4">
            Already have an account?{' '}
            <a href="/signin" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </a>
          </p>
        </form>
      )}

      {step === 'verify' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyOtp();
          }}
        >
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-blue-300 mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter OTP"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('signup')}
            className="w-full border border-blue-500/30 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 hover:bg-gray-900/40"
          >
            Back to Signup
          </button>
        </form>
      )}

      {step === 'signin' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
              placeholder="Enter your password"
              required
            />
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p className="text-sm text-center text-blue-200 mt-4">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
              Create one
            </a>
          </p>
        </form>
      )}
    </div>
  );
}