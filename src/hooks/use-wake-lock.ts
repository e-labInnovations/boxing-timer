import { useCallback, useEffect, useState } from "react";

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const lock = await navigator.wakeLock.request("screen");
      setWakeLock(lock);

      lock.addEventListener("release", () => {
        setWakeLock(null);
      });

      return true;
    } catch (error) {
      console.error("Failed to request wake lock:", error);
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
      } catch (error) {
        console.error("Failed to release wake lock:", error);
      }
    }
  }, [wakeLock]);

  return {
    isSupported,
    isActive: !!wakeLock,
    requestWakeLock,
    releaseWakeLock,
  };
}
