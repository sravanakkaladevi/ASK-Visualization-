import { describe, expect, it } from 'vitest';
import { generateAgileSprintSteps } from './agileSprint';

describe('Agile / Scrum Sprint Lifecycle SDLC Animation', () => {
  it('should progress through all 5 Sprint stages cleanly', () => {
    const steps = generateAgileSprintSteps();
    expect(steps.length).toBe(5);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.stages.every((s: any) => s.status === 'completed')).toBe(true);
    expect(finalStep.state.modelName).toBe('Agile/Scrum');
  });
});
