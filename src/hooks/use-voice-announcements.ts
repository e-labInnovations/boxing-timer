import { useCallback } from "react";

export function useVoiceAnnouncements() {
  const announce = useCallback((text: string) => {
    if ("speechSynthesis" in window && text) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.volume = 0.8;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis failed:", error);
      }
    }
  }, []);

  const isSupported = "speechSynthesis" in window;

  return { announce, isSupported };
}
