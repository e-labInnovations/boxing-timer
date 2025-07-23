import "./App.css";
import { TimerProvider } from "./contexts/timer-context";
import { TimerView } from "./components/timer-view";
import { Toaster } from "./components/ui/sonner";
import { PWAStatus } from "./components/pwa-status";

function App() {
  return (
    <TimerProvider>
      <div className="min-h-screen bg-background">
        <TimerView />
        <Toaster />
        <PWAStatus />
      </div>
    </TimerProvider>
  );
}

export default App;
