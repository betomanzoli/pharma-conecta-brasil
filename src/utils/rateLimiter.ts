
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(req: Request): boolean {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    const userRequests = this.requests.get(key) || [];
    
    // Filter out requests outside the window
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if within limit
    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.1) {
      this.cleanup();
    }

    return true;
  }

  private getDefaultKey(req: Request): string {
    const ip = req.headers.get('cf-connecting-ip') || 
                req.headers.get('x-forwarded-for') || 
                'unknown';
    return ip;
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.config.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > cutoff);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

export { RateLimiter };
