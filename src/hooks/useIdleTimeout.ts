
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';

interface UseIdleTimeoutProps {
  onIdle: () => void;
  idleTimeInMinutes?: number;
}

export function useIdleTimeout({ onIdle, idleTimeInMinutes = 5 }: UseIdleTimeoutProps) {
  const router = useRouter();
  const [isIdle, setIsIdle] = React.useState(false);
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const idleTimeMilliseconds = idleTimeInMinutes * 60 * 1000;

  const startTimer = React.useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, idleTimeMilliseconds);
  }, [idleTimeMilliseconds, onIdle]);

  const resetTimer = React.useCallback(() => {
    setIsIdle(false);
    startTimer();
  }, [startTimer]);

  React.useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    const eventHandler = () => {
      resetTimer();
    };

    // Start the timer when the component mounts or when idleTimeMilliseconds changes
    startTimer();

    events.forEach(event => window.addEventListener(event, eventHandler));

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      events.forEach(event => window.removeEventListener(event, eventHandler));
    };
  }, [resetTimer, startTimer, idleTimeMilliseconds]); // Add idleTimeMilliseconds to dependencies

  return { isIdle, resetTimer };
}
