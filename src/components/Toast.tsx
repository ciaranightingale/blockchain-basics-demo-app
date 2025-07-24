import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

// Type definitions
interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string | null;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', title?: string | null) => void;
  showSuccess: (message: string, title?: string | null) => void;
  showError: (message: string, title?: string | null) => void;
  showWarning: (message: string, title?: string | null) => void;
  showInfo: (message: string, title?: string | null) => void;
}

interface ToastProps {
  toast: ToastType;
  onClose: (id: number) => void;
}

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: number) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

// Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Individual Toast Component
const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200';
    }
  };

  return (
    <div className="mb-2 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center p-4 border rounded-lg shadow-lg max-w-md ${getStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {toast.title && (
            <h4 className="text-sm font-semibold mb-1">{toast.title}</h4>
          )}
          <p className="text-sm whitespace-pre-line">{toast.message}</p>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Toast Provider Component
const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title: string | null = null) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, title };
    setToasts(prev => {
      const newToasts = [...prev, toast];
      // Keep only the most recent 3 toasts
      return newToasts.slice(-3);
    });
  };
  
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', title: string | null = null) => addToast(message, type, title);
  const showSuccess = (message: string, title: string | null = null) => addToast(message, 'success', title);
  const showError = (message: string, title: string | null = null) => addToast(message, 'error', title);
  const showWarning = (message: string, title: string | null = null) => addToast(message, 'warning', title);
  const showInfo = (message: string, title: string | null = null) => addToast(message, 'info', title);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook for using toasts
const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export { ToastProvider, useToast };