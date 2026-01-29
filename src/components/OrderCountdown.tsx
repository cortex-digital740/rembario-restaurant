import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface OrderCountdownProps {
  startTime: string;
  prepTime: number; // in minutes
}

export default function OrderCountdown({ startTime, prepTime }: OrderCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startTime).getTime();
      const end = start + prepTime * 60 * 1000;
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, prepTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isAlmostReady = timeLeft <= 60;
  const isReady = timeLeft === 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isReady
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : isAlmostReady
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          : 'bg-primary/10 text-primary'
      }`}
    >
      <Clock className="w-4 h-4" />
      {isReady ? (
        <span className="font-medium">Ready!</span>
      ) : (
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="font-mono font-bold"
        >
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </motion.span>
      )}
    </motion.div>
  );
}
