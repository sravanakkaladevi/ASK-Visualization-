import { describe, expect, it } from 'vitest';
import { generateBubbleSortSteps } from './bubbleSort';

describe('Bubble Sort Algorithm', () => {
  it('should generate steps and correctly sort an unsorted array', () => {
    const input = [5, 3, 8, 1, 2];
    const steps = generateBubbleSortSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    // Initial state check
    const initialStep = steps[0];
    expect(initialStep.state.map((e) => e.value)).toEqual([5, 3, 8, 1, 2]);

    // Final step state check
    const finalStep = steps[steps.length - 1];
    const sortedValues = finalStep.state.map((e) => e.value);
    expect(sortedValues).toEqual([1, 2, 3, 5, 8]);

    // All elements in final step should have 'sorted' status
    finalStep.state.forEach((el) => {
      expect(el.status).toBe('sorted');
    });
  });

  it('should handle an already sorted array', () => {
    const input = [1, 2, 3, 4];
    const steps = generateBubbleSortSteps(input);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.map((e) => e.value)).toEqual([1, 2, 3, 4]);
  });

  it('should handle empty or single element array', () => {
    const stepsSingle = generateBubbleSortSteps([42]);
    expect(stepsSingle[stepsSingle.length - 1].state.map((e) => e.value)).toEqual([42]);
    expect(stepsSingle[stepsSingle.length - 1].state[0].status).toBe('sorted');
  });
});
