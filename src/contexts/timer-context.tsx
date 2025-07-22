import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSounds } from "@/hooks/use-sounds";
import { useVibration } from "@/hooks/use-vibration";
import { useVoiceAnnouncements } from "@/hooks/use-voice-announcements";

export interface Stage {
  id: string;
  title: string;
  duration: number; // in seconds
  startSoundId: string;
  endSoundId: string;
}

export interface TimerConfig {
  stages: Stage[];
  totalRounds: number;
  isInfinite: boolean;
  endOfRoundSoundId?: string;
  enableColorTransition: boolean;
  enableVibration: boolean;
  enableVoiceAnnouncements: boolean;
  accentColor: string;
  enableCountdown: boolean;
}

export interface Template {
  id: string;
  name: string;
  config: TimerConfig;
  createdAt: number;
}

interface TimerState {
  config: TimerConfig;
  templates: Template[];
  currentStageIndex: number;
  currentRound: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isConfigOpen: boolean;
  isTemplatesOpen: boolean;
  hasPlayedStartSound: boolean;
  showCountdown: boolean;
  countdownValue: number;
}

type TimerAction =
  | { type: "SET_CONFIG"; payload: TimerConfig }
  | { type: "ADD_TEMPLATE"; payload: Template }
  | { type: "DELETE_TEMPLATE"; payload: string }
  | { type: "LOAD_TEMPLATE"; payload: TimerConfig }
  | { type: "START_TIMER" }
  | { type: "PAUSE_TIMER" }
  | { type: "RESET_TIMER" }
  | { type: "TICK" }
  | { type: "NEXT_STAGE" }
  | { type: "TOGGLE_CONFIG" }
  | { type: "TOGGLE_TEMPLATES" }
  | { type: "SET_TEMPLATES"; payload: Template[] }
  | { type: "SET_START_SOUND_PLAYED"; payload: boolean }
  | { type: "START_COUNTDOWN" }
  | { type: "COUNTDOWN_TICK" }
  | { type: "END_COUNTDOWN" };

const defaultConfig: TimerConfig = {
  stages: [
    {
      id: "1",
      title: "Prepare",
      duration: 10,
      startSoundId: "bell",
      endSoundId: "bell",
    },
    {
      id: "2",
      title: "Fight",
      duration: 180,
      startSoundId: "triple-bell",
      endSoundId: "long-bell",
    },
    {
      id: "3",
      title: "Rest",
      duration: 60,
      startSoundId: "ding",
      endSoundId: "buzzer",
    },
  ],
  totalRounds: 5,
  isInfinite: false,
  endOfRoundSoundId: "gong",
  enableColorTransition: true,
  enableVibration: true,
  enableVoiceAnnouncements: false,
  accentColor: "blue",
  enableCountdown: true,
};

const initialState: TimerState = {
  config: defaultConfig,
  templates: [],
  currentStageIndex: 0,
  currentRound: 1,
  timeRemaining: defaultConfig.stages[0]?.duration || 0,
  isRunning: false,
  isPaused: false,
  isConfigOpen: false,
  isTemplatesOpen: false,
  hasPlayedStartSound: false,
  showCountdown: false,
  countdownValue: 3,
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: action.payload,
        currentStageIndex: 0,
        currentRound: 1,
        timeRemaining: action.payload.stages[0]?.duration || 0,
        isRunning: false,
        isPaused: false,
        hasPlayedStartSound: false,
        showCountdown: false,
        countdownValue: 3,
      };

    case "ADD_TEMPLATE":
      return {
        ...state,
        templates: [...state.templates, action.payload],
      };

    case "DELETE_TEMPLATE":
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.payload),
      };

    case "LOAD_TEMPLATE":
      return {
        ...state,
        config: action.payload,
        currentStageIndex: 0,
        currentRound: 1,
        timeRemaining: action.payload.stages[0]?.duration || 0,
        isRunning: false,
        isPaused: false,
        isConfigOpen: false,
        isTemplatesOpen: false,
        hasPlayedStartSound: false,
        showCountdown: false,
        countdownValue: 3,
      };

    case "START_COUNTDOWN":
      return {
        ...state,
        showCountdown: true,
        countdownValue: 3,
      };

    case "COUNTDOWN_TICK":
      if (state.countdownValue > 1) {
        return {
          ...state,
          countdownValue: state.countdownValue - 1,
        };
      } else {
        return {
          ...state,
          showCountdown: false,
          isRunning: true,
          isPaused: false,
          hasPlayedStartSound: false,
        };
      }

    case "END_COUNTDOWN":
      return {
        ...state,
        showCountdown: false,
      };

    case "START_TIMER":
      if (state.config.enableCountdown && !state.isPaused) {
        return {
          ...state,
          showCountdown: true,
          countdownValue: 3,
        };
      } else {
        return {
          ...state,
          isRunning: true,
          isPaused: false,
          hasPlayedStartSound: false,
        };
      }

    case "PAUSE_TIMER":
      return {
        ...state,
        isRunning: false,
        isPaused: true,
        showCountdown: false,
      };

    case "RESET_TIMER":
      return {
        ...state,
        currentStageIndex: 0,
        currentRound: 1,
        timeRemaining: state.config.stages[0]?.duration || 0,
        isRunning: false,
        isPaused: false,
        hasPlayedStartSound: false,
        showCountdown: false,
        countdownValue: 3,
      };

    case "TICK":
      if (state.timeRemaining > 1) {
        return {
          ...state,
          timeRemaining: state.timeRemaining - 1,
        };
      } else {
        return {
          ...state,
          timeRemaining: 0,
        };
      }

    case "NEXT_STAGE": {
      const nextStageIndex =
        (state.currentStageIndex + 1) % state.config.stages.length;
      const isNewRound = nextStageIndex === 0;
      const nextRound = isNewRound
        ? state.currentRound + 1
        : state.currentRound;

      if (
        !state.config.isInfinite &&
        isNewRound &&
        nextRound > state.config.totalRounds
      ) {
        return {
          ...state,
          isRunning: false,
          isPaused: false,
        };
      }

      return {
        ...state,
        currentStageIndex: nextStageIndex,
        currentRound: nextRound,
        timeRemaining: state.config.stages[nextStageIndex]?.duration || 0,
        hasPlayedStartSound: false,
      };
    }

    case "SET_START_SOUND_PLAYED":
      return {
        ...state,
        hasPlayedStartSound: action.payload,
      };

    case "TOGGLE_CONFIG":
      return {
        ...state,
        isConfigOpen: !state.isConfigOpen,
        isTemplatesOpen: false,
      };

    case "TOGGLE_TEMPLATES":
      return {
        ...state,
        isTemplatesOpen: !state.isTemplatesOpen,
        isConfigOpen: false,
      };

    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload,
      };

    default:
      return state;
  }
}

const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
  playSound: (soundId: string) => void;
} | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [storedTemplates, setStoredTemplates] = useLocalStorage<Template[]>(
    "boxing-timer-templates",
    []
  );
  const { playSound } = useSounds();
  const { vibrate } = useVibration();
  const { announce } = useVoiceAnnouncements();

  useEffect(() => {
    if (storedTemplates.length > 0) {
      dispatch({ type: "SET_TEMPLATES", payload: storedTemplates });
    }
  }, []);

  useEffect(() => {
    if (state.templates.length > 0) {
      setStoredTemplates(state.templates);
    }
  }, [state.templates, setStoredTemplates]);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.showCountdown) {
      interval = setInterval(() => {
        playSound("beep");
        if (state.countdownValue > 1) {
          dispatch({ type: "COUNTDOWN_TICK" });
        } else {
          dispatch({ type: "COUNTDOWN_TICK" }); // This will start the timer
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.showCountdown, state.countdownValue, playSound]);

  // Timer tick and sound logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeRemaining > 0) {
      // Play start sound and announce stage at the beginning
      if (!state.hasPlayedStartSound) {
        const currentStage = state.config.stages[state.currentStageIndex];
        if (currentStage?.startSoundId) {
          playSound(currentStage.startSoundId);
        }
        if (state.config.enableVibration) {
          vibrate([200, 100, 200]);
        }
        if (state.config.enableVoiceAnnouncements) {
          announce(currentStage?.title || "");
        }
        dispatch({ type: "SET_START_SOUND_PLAYED", payload: true });
      }

      interval = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else if (state.isRunning && state.timeRemaining === 0) {
      // Play end sound and move to next stage
      const currentStage = state.config.stages[state.currentStageIndex];
      if (currentStage?.endSoundId) {
        playSound(currentStage.endSoundId);
      }
      if (state.config.enableVibration) {
        vibrate([500]);
      }

      // Check if this is end of round
      const nextStageIndex =
        (state.currentStageIndex + 1) % state.config.stages.length;
      const isEndOfRound = nextStageIndex === 0;

      if (isEndOfRound && state.config.endOfRoundSoundId) {
        setTimeout(() => {
          playSound(state.config.endOfRoundSoundId!);
          if (state.config.enableVibration) {
            vibrate([200, 100, 200, 100, 200]);
          }
        }, 800);
      }

      setTimeout(() => {
        dispatch({ type: "NEXT_STAGE" });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    state.isRunning,
    state.timeRemaining,
    state.hasPlayedStartSound,
    state.currentStageIndex,
    state.config,
    playSound,
    vibrate,
    announce,
  ]);

  return (
    <TimerContext.Provider value={{ state, dispatch, playSound }}>
      {children}
    </TimerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
