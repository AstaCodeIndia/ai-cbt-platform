import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/formatTime';

interface TimerProps {
  onTimeUpdate?: (seconds: number) => void;
  isPaused?: boolean;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ 
  onTimeUpdate, 
  isPaused = false,
  className 
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newTime = prev + 1;
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUpdate]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md',
        className
      )}
    >
      <Clock className="w-5 h-5" />
      <div className="font-mono text-xl font-bold tracking-wider">
        <span className="inline-block w-8 text-center">{String(hours).padStart(2, '0')}</span>
        <span className="animate-pulse">:</span>
        <span className="inline-block w-8 text-center">{String(minutes).padStart(2, '0')}</span>
        <span className="animate-pulse">:</span>
        <span className="inline-block w-8 text-center">{String(secs).padStart(2, '0')}</span>
      </div>
    </motion.div>
  );
};

export default Timer;
