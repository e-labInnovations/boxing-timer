"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  BookOpen,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/circular-progress";
import { StageIndicator } from "@/components/stage-indicator";
import { ConfigDrawer } from "@/components/config-drawer";
import { TemplatesDrawer } from "@/components/templates-drawer";
import { CountdownOverlay } from "@/components/countdown-overlay";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTimer } from "@/contexts/timer-context";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useOrientationLock } from "@/hooks/use-orientation-lock";
import { formatTime } from "@/lib/utils";
import { useWakeLock } from "@/hooks/use-wake-lock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TimerView() {
  const { state, dispatch } = useTimer();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const {
    requestWakeLock,
    releaseWakeLock,
    isSupported: wakeLockSupported,
  } = useWakeLock();
  const { lockPortrait, unlock } = useOrientationLock();
  const [showControls, setShowControls] = useState(true);

  const currentStage = state.config.stages[state.currentStageIndex];
  const progress = currentStage
    ? ((currentStage.duration - state.timeRemaining) / currentStage.duration) *
      100
    : 0;

  // Handle wake lock and orientation when timer starts/stops
  useEffect(() => {
    if (state.isRunning && wakeLockSupported) {
      requestWakeLock();
      lockPortrait();
    } else {
      releaseWakeLock();
      unlock();
    }
  }, [
    state.isRunning,
    wakeLockSupported,
    requestWakeLock,
    releaseWakeLock,
    lockPortrait,
    unlock,
  ]);

  // Handle fullscreen state changes and show/hide controls
  useEffect(() => {
    setShowControls(!isFullscreen);
  }, [isFullscreen]);

  const handlePlayPause = () => {
    if (state.isRunning) {
      dispatch({ type: "PAUSE_TIMER" });
    } else {
      dispatch({ type: "START_TIMER" });
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET_TIMER" });
  };

  const handleFullscreen = () => {
    toggleFullscreen();
  };

  const handleExitFullscreen = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
  };

  const isTimerComplete =
    !state.config.isInfinite &&
    state.currentRound > state.config.totalRounds &&
    !state.isRunning;

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
        {/* Header - Hidden in fullscreen */}
        {showControls && (
          <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch({ type: "TOGGLE_TEMPLATES" })}
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Templates</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch({ type: "TOGGLE_CONFIG" })}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <h1 className="text-xl font-bold">Boxing Timer Pro</h1>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFullscreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fullscreen</p>
                </TooltipContent>
              </Tooltip>
              <ThemeToggle />
            </div>
          </header>
        )}

        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExitFullscreen}
                >
                  <Minimize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exit Fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Main Timer Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Stage Title */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {currentStage?.title || "Ready"}
            </h2>
            <p className="text-muted-foreground">
              Round {state.currentRound}
              {!state.config.isInfinite && ` of ${state.config.totalRounds}`}
            </p>
          </div>

          {/* Circular Progress Timer */}
          <div className="relative">
            <CircularProgress
              progress={progress}
              size={280}
              strokeWidth={8}
              className="drop-shadow-lg"
              enableColorTransition={state.config.enableColorTransition}
              timeRemaining={state.timeRemaining}
              totalTime={currentStage?.duration || 1}
              accentColor={state.config.accentColor}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-mono font-bold text-foreground">
                  {formatTime(state.timeRemaining)}
                </div>
                {isTimerComplete && (
                  <div className="text-lg text-green-500 font-semibold mt-2">
                    Complete!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stage Indicator */}
          <StageIndicator
            stages={state.config.stages}
            currentStageIndex={state.currentStageIndex}
            className="w-full max-w-md"
          />

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={
                !state.isPaused &&
                !state.isRunning &&
                state.currentStageIndex === 0
              }
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>

            <Button
              size="lg"
              onClick={handlePlayPause}
              disabled={isTimerComplete}
              className="px-8"
            >
              {state.isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  {state.isPaused ? "Resume" : "Start"}
                </>
              )}
            </Button>
          </div>
        </main>

        {/* Drawers */}
        <ConfigDrawer />
        <TemplatesDrawer />

        {/* Countdown Overlay */}
        <CountdownOverlay />
      </div>
    </TooltipProvider>
  );
}
