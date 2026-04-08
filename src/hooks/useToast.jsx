import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* 토스트 컨테이너 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium
              animate-toast-in backdrop-blur-sm border
              ${toast.type === 'success'
                ? 'bg-green-500/15 border-green-500/30 text-green-500'
                : toast.type === 'error'
                  ? 'bg-red-500/15 border-red-500/30 text-red-500'
                  : 'theme-bg-card theme-border theme-text-sec'
              }
            `}
          >
            <span className="mr-1.5">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
