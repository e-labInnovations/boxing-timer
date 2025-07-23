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

  const createBoxingBell = useCallback(
    (audioContext: AudioContext, frequency: number, duration: number) => {
      // Boxing-optimized bell with maximum clarity and volume
      const fundamental = audioContext.createOscillator();
      const harmonic1 = audioContext.createOscillator();
      const harmonic2 = audioContext.createOscillator();

      // Compressor for maximum loudness
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-10, audioContext.currentTime);
      compressor.knee.setValueAtTime(40, audioContext.currentTime);
      compressor.ratio.setValueAtTime(20, audioContext.currentTime);
      compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
      compressor.release.setValueAtTime(0.25, audioContext.currentTime);

      // EQ for cutting through gym noise
      const highPass = audioContext.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.setValueAtTime(200, audioContext.currentTime);

      const midBoost = audioContext.createBiquadFilter();
      midBoost.type = "peaking";
      midBoost.frequency.setValueAtTime(2000, audioContext.currentTime);
      midBoost.Q.setValueAtTime(2, audioContext.currentTime);
      midBoost.gain.setValueAtTime(6, audioContext.currentTime);

      const masterGain = audioContext.createGain();

      // Chain: oscillators → highpass → midboost → compressor → master
      fundamental.connect(highPass);
      harmonic1.connect(highPass);
      harmonic2.connect(highPass);
      highPass.connect(midBoost);
      midBoost.connect(compressor);
      compressor.connect(masterGain);
      masterGain.connect(audioContext.destination);

      // Boxing-optimized frequencies for maximum cut-through
      fundamental.frequency.setValueAtTime(frequency, audioContext.currentTime);
      harmonic1.frequency.setValueAtTime(
        frequency * 2.5,
        audioContext.currentTime
      );
      harmonic2.frequency.setValueAtTime(
        frequency * 4,
        audioContext.currentTime
      );

      fundamental.type = "triangle";
      harmonic1.type = "sine";
      harmonic2.type = "sine";

      // MAXIMUM VOLUME - Aggressive boxing bell envelope
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
      masterGain.gain.linearRampToValueAtTime(
        0.9,
        audioContext.currentTime + 0.005
      );
      masterGain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      const startTime = audioContext.currentTime;
      const stopTime = startTime + duration;

      [fundamental, harmonic1, harmonic2].forEach((osc) => {
        osc.start(startTime);
        osc.stop(stopTime);
      });
    },
    []
  );

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

          const currentTime = audioContext.currentTime;

          switch (soundId) {
            case "bell": {
              createBoxingBell(audioContext, 1200, 0.8);
              break;
            }

            case "triple-bell": {
              // AUTHENTIC boxing triple bell - rapid "ding-ding-ding"
              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  const bellContext = new ((window as unknown as AnyWindow)
                    .AudioContext ||
                    (window as unknown as AnyWindow).webkitAudioContext)();
                  createBoxingBell(bellContext, 1200, 0.25);
                }, i * 180);
              }
              break;
            }

            case "long-bell": {
              createBoxingBell(audioContext, 1100, 4.0);
              break;
            }

            case "ding": {
              // SHARP boxing ding - cuts through all noise
              const dingOsc = audioContext.createOscillator();
              const compressor = audioContext.createDynamicsCompressor();
              const filter = audioContext.createBiquadFilter();
              const dingGain = audioContext.createGain();

              // Signal chain for maximum clarity
              dingOsc.connect(filter);
              filter.connect(compressor);
              compressor.connect(dingGain);
              dingGain.connect(audioContext.destination);

              // Piercing frequency optimized for gym environments
              dingOsc.frequency.setValueAtTime(2500, currentTime);
              dingOsc.type = "square";

              // High-pass filter to cut through low-end gym noise
              filter.type = "highpass";
              filter.frequency.setValueAtTime(1000, currentTime);
              filter.Q.setValueAtTime(3, currentTime);

              // Compressor for maximum loudness
              compressor.threshold.setValueAtTime(-6, currentTime);
              compressor.ratio.setValueAtTime(20, currentTime);

              // MAXIMUM VOLUME with sharp attack
              dingGain.gain.setValueAtTime(0, currentTime);
              dingGain.gain.linearRampToValueAtTime(0.95, currentTime + 0.001);
              dingGain.gain.exponentialRampToValueAtTime(
                0.001,
                currentTime + 0.4
              );

              dingOsc.start(currentTime);
              dingOsc.stop(currentTime + 0.4);
              break;
            }

            case "buzzer": {
              // INTENSE boxing warning buzzer - MAXIMUM ATTENTION
              const buzzerOsc = audioContext.createOscillator();
              const compressor = audioContext.createDynamicsCompressor();
              const distortion = audioContext.createWaveShaper();
              const buzzerGain = audioContext.createGain();

              // Create distortion curve for aggressive sound
              const samples = 44100;
              const curve = new Float32Array(samples);
              const deg = Math.PI / 180;
              for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] =
                  ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x));
              }
              distortion.curve = curve;
              distortion.oversample = "4x";

              // Signal chain for maximum aggression
              buzzerOsc.connect(distortion);
              distortion.connect(compressor);
              compressor.connect(buzzerGain);
              buzzerGain.connect(audioContext.destination);

              // Frequency that DEMANDS attention in boxing gym
              buzzerOsc.frequency.setValueAtTime(440, currentTime);
              buzzerOsc.type = "sawtooth";

              // Compressor for MAXIMUM output
              compressor.threshold.setValueAtTime(-3, currentTime);
              compressor.ratio.setValueAtTime(20, currentTime);

              // AGGRESSIVE envelope - INSTANT maximum volume
              buzzerGain.gain.setValueAtTime(0.95, currentTime);
              buzzerGain.gain.setValueAtTime(0.95, currentTime + 0.6);
              buzzerGain.gain.linearRampToValueAtTime(0, currentTime + 0.8);

              buzzerOsc.start(currentTime);
              buzzerOsc.stop(currentTime + 0.8);
              break;
            }

            case "chime": {
              // BOXING REST SIGNAL - Clear and cutting
              const chimeFreqs = [1500, 2000, 2500];
              chimeFreqs.forEach((freq, index) => {
                const chimeOsc = audioContext.createOscillator();
                const compressor = audioContext.createDynamicsCompressor();
                const filter = audioContext.createBiquadFilter();
                const chimeGain = audioContext.createGain();

                // Signal chain for clarity
                chimeOsc.connect(filter);
                filter.connect(compressor);
                compressor.connect(chimeGain);
                chimeGain.connect(audioContext.destination);

                chimeOsc.frequency.setValueAtTime(
                  freq,
                  currentTime + index * 0.05
                );
                chimeOsc.type = "triangle";

                // Boost mid frequencies for gym clarity
                filter.type = "peaking";
                filter.frequency.setValueAtTime(freq, currentTime);
                filter.Q.setValueAtTime(4, currentTime);
                filter.gain.setValueAtTime(8, currentTime);

                // Compressor for consistency
                compressor.threshold.setValueAtTime(-8, currentTime);
                compressor.ratio.setValueAtTime(10, currentTime);

                // LOUD and clear for boxing gym
                const gain = 0.7 / (index + 1);
                chimeGain.gain.setValueAtTime(0, currentTime + index * 0.05);
                chimeGain.gain.linearRampToValueAtTime(
                  gain,
                  currentTime + index * 0.05 + 0.005
                );
                chimeGain.gain.exponentialRampToValueAtTime(
                  0.001,
                  currentTime + index * 0.05 + 1.0
                );

                chimeOsc.start(currentTime + index * 0.05);
                chimeOsc.stop(currentTime + index * 0.05 + 1.0);
              });
              break;
            }

            case "beep": {
              // BOXING COUNTDOWN - Precise and LOUD
              const beepOsc = audioContext.createOscillator();
              const compressor = audioContext.createDynamicsCompressor();
              const filter = audioContext.createBiquadFilter();
              const beepGain = audioContext.createGain();

              // Signal chain for precision
              beepOsc.connect(filter);
              filter.connect(compressor);
              compressor.connect(beepGain);
              beepGain.connect(audioContext.destination);

              // Frequency that cuts through everything
              beepOsc.frequency.setValueAtTime(2000, currentTime);
              beepOsc.type = "square";

              // High-pass to cut through gym noise
              filter.type = "highpass";
              filter.frequency.setValueAtTime(800, currentTime);
              filter.Q.setValueAtTime(2, currentTime);

              // Compressor for consistent MAXIMUM volume
              compressor.threshold.setValueAtTime(-3, currentTime);
              compressor.ratio.setValueAtTime(20, currentTime);

              // INSTANT maximum volume for countdown precision
              beepGain.gain.setValueAtTime(0, currentTime);
              beepGain.gain.linearRampToValueAtTime(0.9, currentTime + 0.001);
              beepGain.gain.setValueAtTime(0.9, currentTime + 0.1);
              beepGain.gain.linearRampToValueAtTime(0, currentTime + 0.15);

              beepOsc.start(currentTime);
              beepOsc.stop(currentTime + 0.15);
              break;
            }

            case "gong": {
              // DRAMATIC BOXING GONG - Fight finale sound
              const gongFreqs = [120, 240, 360, 480, 600];
              gongFreqs.forEach((freq, index) => {
                const gongOsc = audioContext.createOscillator();
                const compressor = audioContext.createDynamicsCompressor();
                const filter = audioContext.createBiquadFilter();
                const gongGain = audioContext.createGain();

                // Signal chain for dramatic impact
                gongOsc.connect(filter);
                filter.connect(compressor);
                compressor.connect(gongGain);
                gongGain.connect(audioContext.destination);

                gongOsc.frequency.setValueAtTime(freq, currentTime);
                gongOsc.type = index === 0 ? "triangle" : "sine";

                // EQ for boxing gym clarity
                filter.type = "peaking";
                filter.frequency.setValueAtTime(300, currentTime);
                filter.Q.setValueAtTime(1.5, currentTime);
                filter.gain.setValueAtTime(6, currentTime);

                // Compressor for sustained power
                compressor.threshold.setValueAtTime(-8, currentTime);
                compressor.ratio.setValueAtTime(8, currentTime);

                // MAXIMUM dramatic impact
                const gain = index === 0 ? 0.8 : 0.4 / index;
                gongGain.gain.setValueAtTime(0, currentTime);
                gongGain.gain.linearRampToValueAtTime(gain, currentTime + 0.05);
                gongGain.gain.exponentialRampToValueAtTime(
                  0.001,
                  currentTime + 2.5
                );

                gongOsc.start(currentTime);
                gongOsc.stop(currentTime + 2.5);
              });
              break;
            }

            case "airhorn": {
              // ULTIMATE BOXING AIRHORN - FIGHT START SIGNAL
              const hornOsc1 = audioContext.createOscillator();
              const hornOsc2 = audioContext.createOscillator();
              const compressor = audioContext.createDynamicsCompressor();
              const distortion = audioContext.createWaveShaper();
              const filter = audioContext.createBiquadFilter();
              const hornGain = audioContext.createGain();

              // Create aggressive distortion for maximum impact
              const samples = 44100;
              const curve = new Float32Array(samples);
              for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = Math.sign(x) * Math.pow(Math.abs(x), 0.5);
              }
              distortion.curve = curve;
              distortion.oversample = "4x";

              // Dual oscillator signal chain for MAXIMUM power
              hornOsc1.connect(distortion);
              hornOsc2.connect(distortion);
              distortion.connect(filter);
              filter.connect(compressor);
              compressor.connect(hornGain);
              hornGain.connect(audioContext.destination);

              hornOsc1.type = "sawtooth";
              hornOsc2.type = "square";

              // Dual frequency for boxing gym penetration
              hornOsc1.frequency.setValueAtTime(300, currentTime);
              hornOsc1.frequency.linearRampToValueAtTime(
                450,
                currentTime + 0.05
              );
              hornOsc2.frequency.setValueAtTime(600, currentTime);
              hornOsc2.frequency.linearRampToValueAtTime(
                750,
                currentTime + 0.05
              );

              // Bandpass filter for focused aggression
              filter.type = "bandpass";
              filter.frequency.setValueAtTime(500, currentTime);
              filter.Q.setValueAtTime(3, currentTime);

              // Compressor for ABSOLUTE MAXIMUM volume
              compressor.threshold.setValueAtTime(0, currentTime);
              compressor.ratio.setValueAtTime(20, currentTime);

              // INSTANT MAXIMUM IMPACT
              hornGain.gain.setValueAtTime(0.95, currentTime);
              hornGain.gain.setValueAtTime(0.95, currentTime + 0.8);
              hornGain.gain.linearRampToValueAtTime(0, currentTime + 1.0);

              hornOsc1.start(currentTime);
              hornOsc2.start(currentTime);
              hornOsc1.stop(currentTime + 1.0);
              hornOsc2.stop(currentTime + 1.0);
              break;
            }

            default: {
              // Fallback to boxing bell
              createBoxingBell(audioContext, 1200, 0.8);
              break;
            }
          }
        } catch (error) {
          console.error("Error playing built-in sound:", error);
        }
      }
    },
    [availableSounds, createBoxingBell]
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
