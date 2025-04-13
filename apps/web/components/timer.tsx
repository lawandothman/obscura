'use client';

import { useEffect, useState } from 'react';

export const Timer = ({ startTime, endTime }: { startTime: number, endTime: number | null }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (endTime) {
      setTime(endTime - startTime);
      return;
    }

    const interval = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 16);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-4xl font-mono font-bold text-center" id="clock">
      {formatTime(time)}
    </div>
  );
};
