
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoIcon } from './icons/InfoIcon';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // Auto dismiss after 3 seconds
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col space-y-2 w-full max-w-xs px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-md animate-fade-in-down transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-eco-green/10 border-eco-green/50 text-white'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/50 text-white'
                : 'bg-slate-800/80 border-white/10 text-slate-200'
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'success' && <CheckCircleIcon className="w-6 h-6 text-eco-green" />}
              {toast.type === 'error' && <XCircleIcon className="w-6 h-6 text-red-400" />}
              {toast.type === 'info' && <InfoIcon className="w-6 h-6 text-pi-gold" />}
            </div>
            <div className="flex-grow text-sm font-medium">{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-white/50 hover:text-white">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
