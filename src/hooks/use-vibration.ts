import { useCallback } from "react";

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.error("Vibration failed:", error);
      }
    }
  }, []);

  const isSupported = "vibrate" in navigator;

  return { vibrate, isSupported };
}
