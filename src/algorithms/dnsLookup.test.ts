import { describe, expect, it } from 'vitest';
import { generateDnsLookupSteps } from './dnsLookup';

describe('DNS Resolution Query Flow Animation', () => {
  it('should traverse Resolver, Root, TLD, and Auth servers to resolve IP', () => {
    const steps = generateDnsLookupSteps();
    expect(steps.length).toBeGreaterThanOrEqual(6);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.packets[0].payload).toContain('93.184.216.34');
    expect(finalStep.state.devices.every((d) => d.status !== 'unvisited')).toBe(true);
  });
});
