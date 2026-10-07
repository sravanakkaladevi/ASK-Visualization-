import { describe, expect, it } from 'vitest';
import { generateDFSSteps } from './dfs';
import { DEFAULT_GRAPH_DATA } from './bfs';

describe('DFS Algorithm', () => {
  it('should traverse connected graph and mark all reachable nodes visited', () => {
    const steps = generateDFSSteps(DEFAULT_GRAPH_DATA);

    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1];
    expect(finalStep.description).toContain('DFS Traversal Complete');

    finalStep.state.nodes.forEach((node) => {
      expect(node.status).toBe('visited');
    });
  });
});
