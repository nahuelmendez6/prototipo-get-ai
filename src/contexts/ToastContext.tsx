import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

interface ToastContextType {
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: 'success' | 'info' | 'warning' | 'error', title: string, message: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          let bg = 'bg-white border-slate-200 text-slate-800';
          let IconComponent = Info;
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            bg = 'bg-emerald-50 border-emerald-200 text-emerald-950';
            IconComponent = CheckCircle2;
            iconColor = 'text-emerald-600';
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-50 border-amber-200 text-amber-950';
            IconComponent = AlertTriangle;
            iconColor = 'text-amber-600';
          } else if (toast.type === 'error') {
            bg = 'bg-rose-50 border-rose-200 text-rose-950';
            IconComponent = AlertCircle;
            iconColor = 'text-rose-600';
          } else {
            bg = 'bg-sky-50 border-sky-200 text-sky-950';
            IconComponent = Info;
            iconColor = 'text-sky-600';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${bg}`}
              role="alert"
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="text-xs mt-0.5 text-slate-600 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
