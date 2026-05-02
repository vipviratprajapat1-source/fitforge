import { useEffect, useState } from "react";

export const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Unable to persist state", error);
    }
  }, [key, state]);

  return [state, setState];
};

