import { describe, expect, it } from 'vitest';
import { generateLoadBalancerSteps, DEFAULT_LB_INPUT } from './loadBalancer';

describe('Load Balancer System Design', () => {
  it('should distribute requests across servers', () => {
    const steps = generateLoadBalancerSteps(DEFAULT_LB_INPUT);
    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.description).toContain('All 6 requests processed');
  });
});
