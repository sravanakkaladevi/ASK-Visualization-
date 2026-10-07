import { describe, expect, it } from 'vitest';
import { generateCicdPipelineSteps } from './cicdPipeline';

describe('CI/CD Pipeline Deployment SDLC Animation', () => {
  it('should execute build, test, staging, and production release stages', () => {
    const steps = generateCicdPipelineSteps();
    expect(steps.length).toBe(5);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.state.stages[4].name).toContain('Production Release');
    expect(finalStep.state.stages.every((s: any) => s.status === 'completed')).toBe(true);
  });
});
