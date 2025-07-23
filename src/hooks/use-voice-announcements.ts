import { useCallback, useEffect, useState } from "react";

export function useVoiceAnnouncements() {
  const [bestVoice, setBestVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Find the best voice for boxing announcements
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();

      // Priority order for boxing-suitable voices
      const preferredVoices = [
        // English voices with strong, clear delivery
        (v: SpeechSynthesisVoice) =>
          v.name.includes("Microsoft David") && v.lang.startsWith("en"),
        (v: SpeechSynthesisVoice) =>
          v.name.includes("Google UK English Male") && v.lang.startsWith("en"),
        (v: SpeechSynthesisVoice) =>
          v.name.includes("Alex") && v.lang.startsWith("en"),
        (v: SpeechSynthesisVoice) =>
          v.name.includes("Daniel") && v.lang.startsWith("en"),
        (v: SpeechSynthesisVoice) =>
          v.name.includes("Arthur") && v.lang.startsWith("en"),
        // Fallback: any clear English male voice
        (v: SpeechSynthesisVoice) =>
          v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
        // Any English voice
        (v: SpeechSynthesisVoice) =>
          v.lang.startsWith("en") && !v.name.toLowerCase().includes("whisper"),
        // Default voice as last resort
        (v: SpeechSynthesisVoice) => v.default,
      ];

      for (const matcher of preferredVoices) {
        const voice = voices.find(matcher);
        if (voice) {
          setBestVoice(voice);
          return;
        }
      }

      // If no preferred voice found, use first available
      if (voices.length > 0) {
        setBestVoice(voices[0]);
      }
    };

    if ("speechSynthesis" in window) {
      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesis.addEventListener("voiceschanged", loadVoices);
      }
    }

    return () => {
      if ("speechSynthesis" in window) {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      }
    };
  }, []);

  const announce = useCallback(
    (text: string, delayMs: number = 0) => {
      if (!("speechSynthesis" in window) || !text.trim()) return;

      // Clear any previous announcements
      speechSynthesis.cancel();

      const makeAnnouncement = () => {
        try {
          // Format text for boxing context
          const boxingText = text
            .toUpperCase()
            .replace(/PREPARE/gi, "GET READY")
            .replace(/FIGHT/gi, "FIGHT TIME")
            .replace(/REST/gi, "REST PERIOD");

          const utterance = new SpeechSynthesisUtterance(boxingText);

          // MAXIMUM CLARITY AND VOLUME for boxing gym
          utterance.volume = 1.0; // Maximum volume
          utterance.rate = 0.9; // Slightly slower for clarity
          utterance.pitch = 1.1; // Slightly higher pitch for attention

          // Use best available voice
          if (bestVoice) {
            utterance.voice = bestVoice;
          }

          // Boxing-specific speech settings
          utterance.lang = "en-US";

          // Error handling for boxing environment
          utterance.onerror = (event) => {
            console.error("Boxing voice announcement failed:", event.error);
          };

          utterance.onend = () => {
            // Clear synthesis queue after announcement
            setTimeout(() => speechSynthesis.cancel(), 100);
          };

          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("Boxing voice announcement error:", error);
        }
      };

      if (delayMs > 0) {
        setTimeout(makeAnnouncement, delayMs);
      } else {
        makeAnnouncement();
      }
    },
    [bestVoice]
  );

  // Enhanced announce function that starts after sound
  const announceAfterSound = useCallback(
    (text: string, soundDuration: number = 800) => {
      // Delay announcement to start after boxing bell/sound finishes
      announce(text, soundDuration);
    },
    [announce]
  );

  const isSupported = "speechSynthesis" in window;

  return {
    announce,
    announceAfterSound,
    isSupported,
    hasGoodVoice: !!bestVoice,
  };
}
