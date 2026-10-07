import { describe, expect, it } from 'vitest';
import { generateSelectionSortSteps } from './selectionSort';

describe('Selection Sort Algorithm', () => {
  it('should generate valid steps and sort an unsorted array', () => {
    const input = [29, 10, 14, 37, 13, 5, 22];
    const steps = generateSelectionSortSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.map((e) => e.value)).toEqual([5, 10, 13, 14, 22, 29, 37]);

    finalStep.state.forEach((el) => {
      expect(el.status).toBe('sorted');
    });
  });

  it('should handle duplicates correctly', () => {
    const input = [4, 2, 4, 1];
    const steps = generateSelectionSortSteps(input);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.map((e) => e.value)).toEqual([1, 2, 4, 4]);
  });
});
