import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & {
  localStorage: Storage;
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Initialize state from localStorage on first render
    if (typeof window === "undefined" || !(window as AnyWindow).localStorage) {
      return initialValue;
    }

    try {
      const item = (window as AnyWindow).localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (
          typeof window !== "undefined" &&
          (window as AnyWindow).localStorage
        ) {
          (window as AnyWindow).localStorage.setItem(
            key,
            JSON.stringify(valueToStore)
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}
