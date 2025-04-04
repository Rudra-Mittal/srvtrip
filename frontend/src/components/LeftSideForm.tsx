import { useState } from 'react';
import googlelogo from '../assets/googlelogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export default function LeftSideForm({ type }: { type: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>(
    type === 'signup' ? 'form' : 'form'
  );
  const [error, setError] = useState('');
  const { signin, signup, signinWithGoogle, loading } = useAuth();
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (type === 'signup') {
        if (!name) {
          setError('Name is required');
          return;
        }
        
        // Send OTP instead of directly creating account
        setOtpLoading(true);
        try {
          const response = await fetch('http://localhost:4000/generate-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            throw new Error('Failed to send OTP');
          }

          toast.success('OTP sent to your email!');
          setStep('otp');
        } catch (err: any) {
          console.error('OTP generation error:', err);
          setError(err.message || 'Failed to send OTP');
        } finally {
          setOtpLoading(false);
        }
      } else {
        await signin(email, password);
        // navigate('/'); // Navigate to home after successful authentication
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          password,
          name,
        }),
        credentials:'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid or expired OTP');
      }
      console.log('OTP verified successfully',response);
      toast.success('Account created successfully!');
      navigate('/'); // Navigate to home after successful verification
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signinWithGoogle();
      navigate('/');
      // const response = await fetch('http://localhost:4000/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      //   credentials:'include'
      // });

      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }

      // toast.success('Sign in successful!');
      // navigate('/'); // Redirect to the landing page
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatErrorMessage = (errorMsg: string) => {
    // Convert Firebase error messages to user-friendly format
    if (errorMsg.includes('auth/email-already-in-use')) {
      return 'Email is already in use. Please use a different email or sign in.';
    } else if (errorMsg.includes('auth/invalid-email')) {
      return 'Invalid email address. Please check your email format.';
    } else if (errorMsg.includes('auth/weak-password')) {
      return 'Password is too weak. It should be at least 6 characters.';
    } else if (errorMsg.includes('auth/wrong-password') || errorMsg.includes('auth/user-not-found')) {
      return 'Invalid email or password. Please try again.';
    }
    return errorMsg;
  };

  return (
    <>
      {/* Left side - Form with dark theme */}
      <div className="w-full md:w-full p-8 md:p-12 bg-black/95 text-white">
        <div className="mb-8">
          <div className="flex items-center">
            <span className="font-bold text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              srvTrip
            </span>
          </div>
        </div>
        
        {/* Heading based on type with gradient */}
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {type === 'signup' 
            ? (step === 'form' ? 'Create an account' : 'Verify your email') 
            : 'Sign in to your account'}
        </h1>

        {/* Subtext based on type */}
        <p className="text-sm text-blue-200 mb-6">
          {type === 'signup' 
            ? (step === 'form' 
              ? "Let's get started with your first trip." 
              : "We've sent a verification code to your email.")
            : 'Welcome back! Please enter your details to continue.'}
        </p>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {formatErrorMessage(error)}
          </div>
        )}
        
        {/* FORM START - Show different forms based on step */}
        {(type === 'signin' || (type === 'signup' && step === 'form')) && (
          <form onSubmit={handleSubmit}>
            {/* Name Field - Only for Signup */}
            {type === 'signup' && (
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
            )}
            
            {/* Email Field */}
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
            
            {/* Password Field */}
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
            
            {/* Main Button (Sign up / Sign in) */}
            <button
              type="submit"
              disabled={loading || otpLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading || otpLoading
                ? (type === 'signup' ? 'Sending OTP...' : 'Signing in...') 
                : (type === 'signup' ? 'Continue' : 'Sign In')
              }
            </button>
            
            {/* Or divider with gradient */}
            <div className="flex items-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent flex-grow"></div>
              <span className="px-2 text-blue-200 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent flex-grow"></div>
            </div>
            
            {/* Google Signup/Signin Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center bg-gray-900/60 border border-blue-500/20 py-2 px-4 rounded-lg mb-4 hover:bg-gray-800/70 transition duration-200 cursor-pointer hover:-translate-y-0.5 text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <img src={googlelogo} alt="Google" className="w-5 h-5 mr-2" />
              {type === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
            
            {/* Page Navigation (Sign Up ↔ Sign In) */}
            <p className="text-center text-blue-200 text-sm">
              {type === 'signup' 
                ? "Already have an account?" 
                : "Don't have an account?"} 
              <Link 
                to={type === 'signup' ? "/signin" : "/signup"} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-medium ml-1"
              >
                {type === 'signup' ? 'Sign In' : 'Create an account'}
              </Link>
            </p>
          </form>
        )}
        
        {/* OTP Verification Form - Only for signup */}
        {type === 'signup' && step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-blue-300 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white tracking-widest text-center text-lg"
                placeholder="Enter OTP"
                maxLength={6}
                required
              />
              <p className="mt-2 text-xs text-blue-200">
                Please check your email for the verification code.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {otpLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full bg-transparent border border-blue-500/30 text-white py-2 px-4 rounded-lg transition duration-200 cursor-pointer hover:bg-blue-900/20 hover:border-blue-400/50"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}