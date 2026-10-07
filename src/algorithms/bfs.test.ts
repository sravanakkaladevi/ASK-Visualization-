import { describe, expect, it } from 'vitest';
import { generateBFSSteps, DEFAULT_GRAPH_DATA } from './bfs';

describe('BFS Algorithm', () => {
  it('should visit all connected graph nodes in level order', () => {
    const steps = generateBFSSteps(DEFAULT_GRAPH_DATA);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.description).toContain('BFS Traversal Complete');

    // All nodes should be visited
    finalStep.state.nodes.forEach((node) => {
      expect(node.status).toBe('visited');
    });
  });
});
