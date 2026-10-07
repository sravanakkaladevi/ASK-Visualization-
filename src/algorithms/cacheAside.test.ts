import { describe, expect, it } from 'vitest';
import { generateCacheAsideSteps } from './cacheAside';

describe('Distributed Redis Cache-Aside Pattern System Design Animation', () => {
  it('should simulate cache miss, DB query, cache write-back, and subsequent cache hit', () => {
    const steps = generateCacheAsideSteps();
    expect(steps.length).toBe(5);

    expect(steps[2].description).toContain('CACHE MISS');
    expect(steps[3].description).toContain('SETEX');
    expect(steps[4].description).toContain('CACHE HIT');
  });
});
