import { useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & {
  screen: {
    orientation: {
      lock: (mode: string) => Promise<void>;
      unlock: () => Promise<void>;
    };
  };
};
export function useOrientationLock() {
  const lockPortrait = useCallback(async () => {
    if (
      "screen" in window &&
      "orientation" in window.screen &&
      "lock" in window.screen.orientation
    ) {
      try {
        await (window as unknown as AnyWindow).screen.orientation.lock(
          "portrait"
        );
      } catch (error) {
        // Only log unexpected errors in development
        if (
          error instanceof Error &&
          error.name !== "NotSupportedError" &&
          error.name !== "AbortError"
        ) {
          console.error("Orientation lock failed:", error);
        }
      }
    }
  }, []);

  const unlock = useCallback(async () => {
    if (
      "screen" in window &&
      "orientation" in window.screen &&
      "unlock" in window.screen.orientation
    ) {
      try {
        (window as unknown as AnyWindow).screen.orientation.unlock();
      } catch (error) {
        // Only log unexpected errors in development
        if (
          error instanceof Error &&
          error.name !== "NotSupportedError" &&
          error.name !== "AbortError"
        ) {
          console.error("Orientation unlock failed:", error);
        }
      }
    }
  }, []);

  const isSupported =
    "screen" in window &&
    "orientation" in window.screen &&
    "lock" in window.screen.orientation;

  return { lockPortrait, unlock, isSupported };
}
