import "./App.css";
import { TimerProvider } from "./contexts/timer-context";
import { TimerView } from "./components/timer-view";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <TimerProvider>
      <div className="min-h-screen bg-background">
        <TimerView />
        <Toaster />
      </div>
    </TimerProvider>
  );
}

export default App;
