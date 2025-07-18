import { useState, useEffect, createContext, useContext } from 'react';

// Toast Context
const ToastContext = createContext();

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className={`mb-2 p-3 rounded-lg border-l-4 shadow-md transform transition-all duration-300 ease-in-out ${
      toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
      toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
      toast.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
      'bg-blue-50 border-blue-500 text-blue-800'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}></div>
          <div>
            {toast.title && (
              <div className="font-semibold mb-1 text-sm">{toast.title}</div>
            )}
            <div className="text-xs whitespace-pre-line">{toast.message}</div>
          </div>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-gray-400 hover:text-gray-600 ml-4 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onClose }) => {
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
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info', title = null) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, title };
    setToasts(prev => {
      const newToasts = [...prev, toast];
      // Keep only the most recent 3 toasts
      return newToasts.slice(-3);
    });
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const showSuccess = (message, title = null) => addToast(message, 'success', title);
  const showError = (message, title = null) => addToast(message, 'error', title);
  const showWarning = (message, title = null) => addToast(message, 'warning', title);
  const showInfo = (message, title = null) => addToast(message, 'info', title);

  const contextValue = {
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
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export { ToastProvider, useToast };