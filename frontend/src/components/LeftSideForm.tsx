import googlelogo from '../assets/googlelogo.png';
import { Link } from 'react-router-dom';

export default function LeftSideForm({ type }: { type: string }) {
    return(
        <>
        {/* Left side - Form with dark theme */}
        <div className="w-full md:w-5/12 p-8 md:p-12 bg-black/95 text-white">
          <div className="mb-8">
            <div className="flex items-center">
              <span className="font-bold text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                srvTrip
              </span>
            </div>
          </div>
          
          {/* Heading based on type with gradient */}
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {type === 'signup' ? 'Create an account' : 'Sign in to your account'}
          </h1>

          {/* Subtext based on type */}
          <p className="text-sm text-blue-200 mb-6">
            {type === 'signup' 
              ? "Let's get started with your first trip."
              : 'Welcome back! Please enter your details to continue.'}
          </p>
          
          {/* FORM START */}
          <form>
            {/* Name Field - Only for Signup */}
            {type === 'signup' && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
                  placeholder="Enter your name"
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
                className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
                placeholder="Enter your email"
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
                className="w-full p-2 bg-gray-900/60 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white"
                placeholder="Enter your password"
              />
            </div>
            
            {/* Main Button (Sign up / Sign in) */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition duration-200 cursor-pointer hover:-translate-y-0.5 shadow-md"
            >
              {type === 'signup' ? 'Create account' : 'Sign In'}
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
              className="w-full flex items-center justify-center bg-gray-900/60 border border-blue-500/20 py-2 px-4 rounded-lg mb-4 hover:bg-gray-800/70 transition duration-200 cursor-pointer hover:-translate-y-0.5 text-white"
            >
              <img src={googlelogo} alt="Google" className="w-5 h-5 mr-2" />
              {type === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
            
            {/* Twitter Signup/Signin Button */}
            {/* <button
              type="button"
              className="w-full flex items-center justify-center bg-gray-900/60 border border-blue-500/20 py-2 px-4 rounded-lg mb-6 hover:bg-gray-800/70 transition duration-200 cursor-pointer hover:-translate-y-0.5 text-white"
            >
              <img src={twitterlogo} alt="Twitter" className="w-5 h-5 mr-2" />
              {type === 'signup' ? 'Sign up with Twitter' : 'Sign in with Twitter'}
            </button> */}
            
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
        </div>
        </>
    )
}