import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice"; // Make sure this path is correct

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, className, onClick }: NavLinkProps) => (
  <Link 
    to={href}
    onClick={onClick}
    className={cn(
      "relative px-3 py-1.5 text-sm font-medium transition-colors",
      "text-white/90 hover:text-white",
      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400",
      "after:transition-all after:duration-300 hover:after:w-full",
      className
    )}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {isLoggedIn, name, email} = useSelector((state:any)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle logout functionality
  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate('/');
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useMotionValueEvent(scrollY, "change", (current) => {
    // Hide when scrolling down, show when scrolling up
    const direction = current - lastScrollY;
    
    if (mobileMenuOpen) {
      // Don't hide when mobile menu is open
      setVisible(true);
    } else if (current < 50) {
      // Always show at top of page
      setVisible(true);
    } else if (direction < 0) {
      // Scrolling up
      setVisible(true);
    } else if (direction > 0) {
      // Scrolling down
      setVisible(false);
    }
    
    setLastScrollY(current);
  });

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking a link
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: visible ? 0 : -100, 
          opacity: visible ? 1 : 0 
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] sm:w-[85%] md:w-[75%] mx-auto"
      >
        <div className="w-full backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-4 py-2 shadow-lg shadow-blue-900/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center z-10">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold text-xl">
                srvTrip
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/form">Create Itinerary</NavLink>
              {/* Only show History link if user is logged in */}
              {isLoggedIn && (
                <NavLink href="/itinerary">History</NavLink>
              )}
            </div>

            {/* Desktop Auth Buttons - Conditional based on login status */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-white/90 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors"
                  >
                    <span>{name || 'User'}</span>
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      className="ml-1"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </motion.svg>
                  </button>
                  
                  {/* User Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-lg shadow-lg z-20"
                      >
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-white font-medium truncate">{name}</p>
                          <p className="text-gray-400 text-xs truncate">{email}</p>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link 
                    to="/signin" 
                    className="text-white/90 hover:text-white text-sm font-medium px-3 py-1.5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-all shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center z-10 cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="relative w-7 h-6">
                <motion.span 
                  animate={{ 
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 8 : 0
                  }}
                  className="absolute top-0 left-0 w-7 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                ></motion.span>
                <motion.span 
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  className="absolute top-[10px] left-0 w-7 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                ></motion.span>
                <motion.span 
                  animate={{ 
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? -8 : 0
                  }}
                  className="absolute bottom-0 left-0 w-7 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                ></motion.span>
              </div>
            </button>
          </div>
        </div>

        {/* Subtle gradient line underneath */}
        <div className="h-[1px] w-[60%] mx-auto bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mt-0.5"></div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-black border-l border-white/10 pt-20 pb-6 px-6"
            >
              <div className="flex flex-col space-y-6">
                {/* Mobile Navigation */}
                <div className="flex flex-col space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Navigation</h3>
                  <NavLink href="/" onClick={handleMobileNavClick} className="py-2">Home</NavLink>
                  <NavLink href="/form" onClick={handleMobileNavClick} className="py-2">Create Itinerary</NavLink>
                  {/* Only show History link if user is logged in */}
                  {isLoggedIn && (
                    <NavLink href="/itinerary" onClick={handleMobileNavClick} className="py-2">History</NavLink>
                  )}
                </div>

                {/* Mobile Auth - Conditional based on login status */}
                <div className="flex flex-col space-y-3 mt-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</h3>
                  {isLoggedIn ? (
                    <>
                      <div className="py-3 px-4 bg-gray-800/50 rounded-lg border border-white/5">
                        <p className="text-white font-medium">{name}</p>
                        <p className="text-gray-400 text-xs truncate">{email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          handleMobileNavClick();
                        }}
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition-all shadow-md text-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/signin" 
                        onClick={handleMobileNavClick}
                        className="py-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={handleMobileNavClick}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition-all shadow-md text-center"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
                
                {/* Mobile Footer */}
                <div className="mt-auto pt-6 border-t border-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="flex flex-col space-y-4">
                    {/* Logo and badge */}
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold text-lg mr-2">
                        srvTrip
                      </span>
                      <motion.span 
                        whileHover={{ scale: 1.1, y: -1 }}
                        className="text-[10px] bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-0.5 rounded-full text-white shadow-sm"
                      >
                        BETA
                      </motion.span>
                    </div>
                    
                    {/* Social links */}
                    <div className="flex items-center space-x-3">
                      {["Twitter", "Instagram", "Discord"].map((social) => (
                        <motion.a
                          key={social}
                          href="#"
                          whileHover={{ y: -2 }}
                          className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
                        >
                          {social}
                        </motion.a>
                      ))}
                    </div>
                    
                    {/* Copyright */}
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-[1px] bg-gradient-to-r from-blue-400 to-transparent mr-2"></span>
                        <p>© 2025 srvTrip</p>
                      </div>
                      <p className="mt-1 pl-5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Your AI-powered travel companion</p>
                    </div>
                    
                    {/* Subtle gradient bottom accent */}
                    <div className="h-[1px] w-1/2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 mt-2"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};