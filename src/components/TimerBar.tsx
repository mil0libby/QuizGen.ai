
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface TimerBarProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  isActive?: boolean;
}

const TimerBar = ({ duration, onTimeUp, isActive = true }: TimerBarProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">Time Remaining</span>
        </div>
        <span className={`text-lg font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
          {timeLeft}s
        </span>
      </div>
      <Progress 
        value={progress} 
        className={`h-3 ${isUrgent ? '[&>div]:bg-red-500' : ''}`}
      />
    </div>
  );
};

export default TimerBar;
