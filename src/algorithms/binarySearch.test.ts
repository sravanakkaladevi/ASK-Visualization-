import { describe, expect, it } from 'vitest';
import { generateBinarySearchSteps } from './binarySearch';

describe('Binary Search Algorithm', () => {
  it('should find existing element and finish with sorted status on found index', () => {
    const input = {
      array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      target: 23,
    };
    const steps = generateBinarySearchSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.description).toContain('found at index 5');

    // Index 5 (val 23) should be 'sorted'
    const foundElem = finalStep.state[5];
    expect(foundElem.value).toBe(23);
    expect(foundElem.status).toBe('sorted');
  });

  it('should handle target not in array', () => {
    const input = {
      array: [1, 3, 5, 7, 9],
      target: 4,
    };
    const steps = generateBinarySearchSteps(input);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.description).toContain('was not found');
  });
});
