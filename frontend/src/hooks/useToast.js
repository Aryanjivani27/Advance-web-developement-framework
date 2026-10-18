import { useState, useCallback, useEffect, useRef } from 'react';

let _toastId = 0;

/**
 * useToast – manages a list of toast notifications.
 *
 * Returns:
 *   toasts    – array of active toast objects
 *   addToast  – (message, type?, duration?) => void
 *   dismiss   – (id) => void
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    // Trigger exit animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);

    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      const id = ++_toastId;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  // Clean up all pending timers on unmount
  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  return { toasts, addToast, dismiss };
}
