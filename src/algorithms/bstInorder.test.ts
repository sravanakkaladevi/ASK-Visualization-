import { describe, expect, it } from 'vitest';
import { generateBSTInorderSteps } from './bstInorder';

describe('BST In-Order Traversal', () => {
  it('should visit nodes in sorted order', () => {
    const input = [50, 30, 70, 20, 40, 60, 80];
    const steps = generateBSTInorderSteps(input);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    const visitedValues = finalStep.state.visitOrder.map((id) => {
      const node = finalStep.state.nodes.find((n) => n.id === id);
      return node?.value;
    });

    // In-order traversal of BST [50,30,70,20,40,60,80] should be sorted
    expect(visitedValues).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
