import { useTimer } from "@/contexts/timer-context";

export function CountdownOverlay() {
  const { state } = useTimer();

  if (!state.showCountdown) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-8xl md:text-9xl font-bold text-white mb-4 animate-pulse">
          {state.countdownValue}
        </div>
        <div className="text-xl text-white/80">Get Ready...</div>
      </div>
    </div>
  );
}
