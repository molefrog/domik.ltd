import { useState } from "react";

// Hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (v: T) => T] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as unknown as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }

      return value;
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
      return initialValue;
    }
  };

  return [storedValue, setValue];
}
