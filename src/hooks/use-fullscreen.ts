import { useCallback, useEffect, useState } from "react";

type AnyDocument = Document & {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
};

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as AnyDocument).webkitFullscreenElement ||
        (document as AnyDocument).mozFullScreenElement ||
        (document as AnyDocument).msFullscreenElement;
      setIsFullscreen(!!fullscreenElement);
    };

    // Listen to all fullscreen change events
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Handle mobile back button and navigation
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, might be due to back navigation
        setTimeout(() => {
          if (!document.fullscreenElement) {
            setIsFullscreen(false);
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
      // Fallback: manually set state if API fails
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen };
}
