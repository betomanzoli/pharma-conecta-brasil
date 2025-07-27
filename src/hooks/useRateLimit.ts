
import { useState, useCallback, useRef } from 'react';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  onLimitExceeded?: () => void;
}

export const useRateLimit = (options: RateLimitOptions) => {
  const [isLimited, setIsLimited] = useState(false);
  const requestTimestamps = useRef<number[]>([]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    // Remove old timestamps
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    // Check if we've exceeded the limit
    if (requestTimestamps.current.length >= options.maxRequests) {
      setIsLimited(true);
      if (options.onLimitExceeded) {
        options.onLimitExceeded();
      }
      return false;
    }

    // Add current timestamp
    requestTimestamps.current.push(now);
    setIsLimited(false);
    return true;
  }, [options]);

  const resetLimit = useCallback(() => {
    requestTimestamps.current = [];
    setIsLimited(false);
  }, []);

  const getRemainingRequests = useCallback(() => {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    const validRequests = requestTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );
    
    return Math.max(0, options.maxRequests - validRequests.length);
  }, [options]);

  const getTimeUntilReset = useCallback(() => {
    if (requestTimestamps.current.length === 0) return 0;
    
    const oldestRequest = Math.min(...requestTimestamps.current);
    const resetTime = oldestRequest + options.windowMs;
    
    return Math.max(0, resetTime - Date.now());
  }, [options]);

  return {
    isLimited,
    checkRateLimit,
    resetLimit,
    getRemainingRequests,
    getTimeUntilReset
  };
};
