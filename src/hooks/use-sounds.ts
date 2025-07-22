import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = Window & {
  AudioContext: typeof window.AudioContext;
  webkitAudioContext?: typeof window.AudioContext;
};

interface Sound {
  id: string;
  name: string;
  url?: string;
  audio?: HTMLAudioElement;
}

const builtInSounds: Sound[] = [
  { id: "bell", name: "Bell" },
  { id: "ding", name: "Ding" },
  { id: "buzzer", name: "Buzzer" },
  { id: "chime", name: "Chime" },
  { id: "beep", name: "Beep" },
  { id: "gong", name: "Gong" },
  { id: "airhorn", name: "Air Horn" },
  { id: "triple-bell", name: "Triple Bell" },
  { id: "long-bell", name: "Long Bell" },
];

export function useSounds() {
  const [availableSounds, setAvailableSounds] =
    useState<Sound[]>(builtInSounds);
  const [customSounds, setCustomSounds] = useState<Sound[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("boxing-timer-custom-sounds");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomSounds(parsed);
        setAvailableSounds([...builtInSounds, ...parsed]);
      }
    } catch (error) {
      console.error("Error loading custom sounds:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "boxing-timer-custom-sounds",
        JSON.stringify(customSounds)
      );
    } catch (error) {
      console.error("Error saving custom sounds:", error);
    }
  }, [customSounds]);

  const playSound = useCallback(
    (soundId: string) => {
      const now = Date.now();
      if (now - (playSound as unknown as { lastCall: number }).lastCall < 100)
        return;
      (playSound as unknown as { lastCall: number }).lastCall = now;

      const sound = availableSounds.find((s) => s.id === soundId);

      if (sound?.audio) {
        try {
          sound.audio.currentTime = 0;
          sound.audio.play().catch(console.error);
        } catch (error) {
          console.error("Error playing custom sound:", error);
        }
      } else {
        try {
          const audioContext = new ((window as unknown as AnyWindow)
            .AudioContext ||
            (window as unknown as AnyWindow).webkitAudioContext)();

          if (soundId === "triple-bell") {
            // Play three quick bells
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(
                  800,
                  audioContext.currentTime
                );
                oscillator.type = "sine";
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioContext.currentTime + 0.2
                );
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
              }, i * 300);
            }
            return;
          }

          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          const frequencies: Record<string, number> = {
            bell: 800,
            ding: 1000,
            buzzer: 200,
            chime: 1200,
            beep: 600,
            gong: 150,
            airhorn: 300,
            "long-bell": 800,
          };

          oscillator.frequency.setValueAtTime(
            frequencies[soundId] || 800,
            audioContext.currentTime
          );
          oscillator.type =
            soundId === "buzzer" || soundId === "airhorn"
              ? "sawtooth"
              : soundId === "gong"
              ? "triangle"
              : "sine";

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          const duration =
            soundId === "gong" ||
            soundId === "airhorn" ||
            soundId === "long-bell"
              ? 1.5
              : 0.5;
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + duration
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
          console.error("Error playing built-in sound:", error);
        }
      }
    },
    [availableSounds]
  );

  const addCustomSound = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const audioData = e.target?.result as string;
          const audio = new Audio(audioData);

          const newSound: Sound = {
            id: `custom-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: audioData,
            audio,
          };

          setCustomSounds((prev) => [...prev, newSound]);
          setAvailableSounds((prev) => [...prev, newSound]);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }, []);

  const removeCustomSound = useCallback((soundId: string) => {
    setCustomSounds((prev) => prev.filter((s) => s.id !== soundId));
    setAvailableSounds((prev) => prev.filter((s) => s.id !== soundId));
  }, []);

  return {
    availableSounds,
    playSound,
    addCustomSound,
    removeCustomSound,
  };
}
