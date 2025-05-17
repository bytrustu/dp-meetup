import { useState } from 'react';
import { DOUBLE_TAP_DELAY } from '../utils/constants';

/**
 * Returns a handler that triggers the callback when the user taps twice within the specified delay.
 */
export const useDoubleTap = (
  callback: () => void,
  delay: number = DOUBLE_TAP_DELAY
) => {
  const [lastTap, setLastTap] = useState(0);

  return () => {
    const now = Date.now();
    if (now - lastTap < delay) {
      callback();
    }
    setLastTap(now);
  };
};
