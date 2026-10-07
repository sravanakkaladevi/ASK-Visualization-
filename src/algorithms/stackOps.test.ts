import { describe, expect, it } from 'vitest';
import { generateStackSteps, DEFAULT_STACK_INPUT } from './stackOps';

describe('Stack Operations Algorithm', () => {
  it('should process push and pop operations correctly', () => {
    const steps = generateStackSteps(DEFAULT_STACK_INPUT);
    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    // After: push 10, push 25, push 8, push 42, pop(42), push 15, pop(15), pop(8)
    // Remaining: [10, 25]
    expect(finalStep.state.items.map((i) => i.value)).toEqual([10, 25]);
    expect(finalStep.state.type).toBe('stack');
  });

  it('should handle pop on empty stack', () => {
    const steps = generateStackSteps({ operations: [{ type: 'pop' }] });
    const hasUnderflow = steps.some((s) => s.description.includes('underflow'));
    expect(hasUnderflow).toBe(true);
  });
});
