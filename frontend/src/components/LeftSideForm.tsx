import googlelogo from '../assets/googlelogo.png';
import twitterlogo from '../assets/twitterlogo.png';
import { Link } from 'react-router-dom';

export default function LeftSideForm({ type }: { type: string }) {
    return(
        <>
        {/* Left side - Form */}
        <div className="w-full md:w-5/12 p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center">
              <span className="font-bold text-4xl">svrTrips</span>
            </div>
          </div>
          
          {/* Heading based on type */}
          <h1 className="text-3xl font-bold mb-2">
            {type === 'signup' ? 'Create an account' : 'Sign in to your account'}
          </h1>

          {/* Subtext based on type */}
          <p className="text-sm text-gray-600 mb-6">
            {type === 'signup' 
              ? "Let's get started with your first trip."
              : 'Welcome back! Please enter your details to continue.'}
          </p>
          
          {/* FORM START */}
          <form>
            {/* Name Field - Only for Signup */}
            {type === 'signup' && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Enter your password"
              />
            </div>
            
            {/* Main Button (Sign up / Sign in) */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 px-4 rounded mb-4 hover:bg-slate-700 transition duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              {type === 'signup' ? 'Create account' : 'Sign In'}
            </button>
            
            {/* Google Signup/Signin Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 py-2 px-4 rounded mb-4 hover:bg-gray-50 transition duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              <img src={googlelogo} alt="Google" className="w-5 h-5 mr-2" />
              {type === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
            
            {/* Twitter Signup/Signin Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 py-2 px-4 rounded mb-6 hover:bg-gray-50 transition duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              <img src={twitterlogo} alt="Twitter" className="w-5 h-5 mr-2" />
              {type === 'signup' ? 'Sign up with Twitter' : 'Sign in with Twitter'}
            </button>
            
            {/* Page Navigation (Sign Up ↔ Sign In) */}
            <p className="text-center text-gray-600 text-sm">
              {type === 'signup' 
                ? "Already have an account?" 
                : "Don't have an account?"} 
              <Link 
                to={type === 'signup' ? "/signin" : "/signup"} 
                className="text-gray-900 font-medium ml-1"
              >
                {type === 'signup' ? 'Sign In' : 'Create an account'}
              </Link>
            </p>
          </form>
        </div>
        </>
    )
}
