import { useState, useEffect } from "react";
import { Download, Smartphone, Wifi, WifiOff } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const checkPWAStatus = () => {
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          ("standalone" in window.navigator &&
            (window.navigator as { standalone?: boolean }).standalone === true)
      );
    };

    // Check if already installed
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          (window.navigator as { standalone?: boolean }).standalone === true)
    );

    checkPWAStatus();

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // PWA installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("Boxing Timer PWA installed");
      }

      setInstallPrompt(null);
    } catch (error) {
      console.error("PWA installation failed:", error);
    }
  };

  // Don't show if already installed/standalone
  if (isInstalled || isStandalone) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <Smartphone className="h-4 w-4" />
          <span>PWA Active</span>
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Install prompt */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-xl max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Download className="h-5 w-5" />
              <h3 className="font-semibold">Install Boxing Timer</h3>
            </div>
            <p className="text-sm mb-3 opacity-90">
              Install as an app for offline access and better performance during
              training.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
              >
                Install
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="text-white opacity-75 hover:opacity-100 px-3 py-1 text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online/Offline status */}
      {!isOnline && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-orange-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>Offline Mode</span>
          </div>
        </div>
      )}
    </>
  );
}
