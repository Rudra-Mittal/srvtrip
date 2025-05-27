import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export interface ToastProps {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export interface ToastPosition {
  position?: 'top-center' | 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'bottom-center';
}

// Toast Container Component
export const ToastContainer: React.FC<React.PropsWithChildren<ToastPosition>> = ({ 
  children, 
  position = 'top-center' 
}) => {
  const positionClasses = {
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none',
      positionClasses[position]
    )}>
      {children}
    </div>
  );
};

// Individual Toast Component
export const Toast: React.FC<ToastProps> = ({ 
  title, 
  description, 
  type = 'info', 
  duration = 5000,
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const typeClasses = {
    success: {
      bg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/20',
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      )
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500/10 to-rose-500/10',
      border: 'border-red-500/20',
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      )
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/20',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  };
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Allow time for exit animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'pointer-events-auto w-full rounded-lg backdrop-blur-md shadow-md border p-4',
            'flex items-start gap-3',
            typeClasses[type].bg,
            typeClasses[type].border
          )}
        >
          <div className="flex-shrink-0 pt-0.5">
            {typeClasses[type].icon}
          </div>
          <div className="flex-1">
            {title && <div className="text-sm font-semibold text-white">{title}</div>}
            {description && <div className="mt-1 text-sm text-gray-200">{description}</div>}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Manager
interface ToastOptions extends ToastProps, ToastPosition {}

// Initialize array to store toast instances
const toasts: Array<ToastProps & { id: string }> = [];
let setToastsState: React.Dispatch<React.SetStateAction<Array<ToastProps & { id: string }>>> | null = null;

// Toaster component to render all toasts
export const Toaster: React.FC<ToastPosition> = ({ position = 'top-center' }) => {
  const [toastsState, setToastsStateLocal] = useState<Array<ToastProps & { id: string }>>(toasts);
  
  // Store the setState function for external use
  useEffect(() => {
    setToastsState = setToastsStateLocal;
    return () => { setToastsState = null };
  }, []);
  
  const removeToast = (id: string) => {
    setToastsStateLocal(prev => prev.filter(toast => toast.id !== id));
  };
  
  return createPortal(
    <ToastContainer position={position}>
      {toastsState.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>,
    document.body
  );
};

// Toast function to create new toasts
export function toast({ title, description, type = 'info', duration = 5000}: ToastOptions) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, title, description, type, duration };
  
  if (setToastsState) {
    setToastsState(prev => [...prev, newToast]);
  } else {
    toasts.push(newToast);
  }
  
  // Return a function to dismiss the toast
  return () => {
    if (setToastsState) {
      setToastsState(prev => prev.filter(toast => toast.id !== id));
    }
  };
}

// Helper methods
toast.success = ({ title, description, duration, position }: Omit<ToastOptions, 'type'>) => 
  toast({ title, description, type: 'success', duration, position });

toast.error = ({ title, description, duration, position }: Omit<ToastOptions, 'type'>) => 
  toast({ title, description, type: 'error', duration, position });

toast.info = ({ title, description, duration, position }: Omit<ToastOptions, 'type'>) => 
  toast({ title, description, type: 'info', duration, position });