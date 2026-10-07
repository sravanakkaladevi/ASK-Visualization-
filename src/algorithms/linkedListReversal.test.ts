import { describe, expect, it } from 'vitest';
import { generateLinkedListReversalSteps } from './linkedListReversal';

describe('Linked List Reversal Algorithm', () => {
  it('should reverse the linked list and produce correct final state', () => {
    const input = [1, 2, 3, 4, 5];
    const steps = generateLinkedListReversalSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    const finalValues = finalStep.state.nodes.map((n) => n.value);
    expect(finalValues).toEqual([5, 4, 3, 2, 1]);

    finalStep.state.nodes.forEach((n) => {
      expect(n.status).toBe('sorted');
    });
  });

  it('should handle single element list', () => {
    const steps = generateLinkedListReversalSteps([42]);
    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.nodes.map((n) => n.value)).toEqual([42]);
  });
});
