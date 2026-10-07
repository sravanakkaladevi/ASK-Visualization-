import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';
import { DpTableState } from '../visualizers/DpTableView';

export const KNAPSACK_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}`,
  python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]`,
  java: `public class Knapsack {
    public static int solve(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        values[i - 1] + dp[i - 1][w - weights[i - 1]],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }
}`,
  cpp: `int knapsack(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {
    int n = weights.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = std::max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`,
};

export function generateKnapsackSteps(): Step<DpTableState>[] {
  const items = [
    { name: 'Item 1 (w:2, v:3)', weight: 2, val: 3 },
    { name: 'Item 2 (w:3, v:4)', weight: 3, val: 4 },
    { name: 'Item 3 (w:4, v:5)', weight: 4, val: 5 },
  ];
  const capacity = 5;
  const n = items.length;

  const matrix: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  const rowHeaders = ['0 (None)', ...items.map((it) => it.name)];
  const colHeaders = Array.from({ length: capacity + 1 }, (_, c) => `w=${c}`);

  const steps: Step<DpTableState>[] = [];

  steps.push({
    state: {
      headers: { rows: rowHeaders, cols: colHeaders },
      matrix: JSON.parse(JSON.stringify(matrix)),
      logMessage: 'Initialize 2D DP table with 0 values for base row (0 items) and column (0 capacity).',
    },
    highlightedLines: [1, 2, 3],
    description: 'Set up 0/1 Knapsack matrix with items and capacity columns 0..5.',
  });

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 1; w <= capacity; w++) {
      if (item.weight <= w) {
        const includeVal = item.val + matrix[i - 1][w - item.weight];
        const excludeVal = matrix[i - 1][w];
        matrix[i][w] = Math.max(includeVal, excludeVal);

        steps.push({
          state: {
            headers: { rows: rowHeaders, cols: colHeaders },
            matrix: JSON.parse(JSON.stringify(matrix)),
            activeCell: { row: i, col: w },
            comparingCells: [
              { row: i - 1, col: w },
              { row: i - 1, col: w - item.weight },
            ],
            logMessage: `Item fits! Max(Include: ${item.val}+dp[${i - 1}][${w - item.weight}] = ${includeVal}, Exclude: dp[${i - 1}][${w}] = ${excludeVal}) = ${matrix[i][w]}`,
          },
          highlightedLines: [6, 7, 8, 9, 10],
          description: `Compare including item vs excluding item for cell (${i}, ${w}).`,
        });
      } else {
        matrix[i][w] = matrix[i - 1][w];
        steps.push({
          state: {
            headers: { rows: rowHeaders, cols: colHeaders },
            matrix: JSON.parse(JSON.stringify(matrix)),
            activeCell: { row: i, col: w },
            comparingCells: [{ row: i - 1, col: w }],
            logMessage: `Item weight (${item.weight}) > capacity (${w}). Carry over value dp[${i - 1}][${w}] = ${matrix[i][w]}.`,
          },
          highlightedLines: [11, 12],
          description: `Item too heavy for current capacity. Carry over upper cell.`,
        });
      }
    }
  }

  steps.push({
    state: {
      headers: { rows: rowHeaders, cols: colHeaders },
      matrix: JSON.parse(JSON.stringify(matrix)),
      activeCell: { row: n, col: capacity },
      logMessage: `Knapsack DP completed! Maximum value achievable for capacity 5 is ${matrix[n][capacity]}.`,
    },
    highlightedLines: [16],
    description: `Target cell (${n}, ${capacity}) holds optimal value ${matrix[n][capacity]}.`,
  });

  return steps;
}

export const knapsackDefinition: AlgorithmDefinition<null, DpTableState> = {
  meta: {
    id: 'knapsack',
    name: '0/1 Knapsack Problem',
    category: 'dynamic-programming',
    timeComplexity: { best: 'O(N*W)', average: 'O(N*W)', worst: 'O(N*W)' },
    spaceComplexity: 'O(N*W)',
    description: 'Maximizes item value within weight capacity limit using 2D DP matrix memoization.',
    code: KNAPSACK_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: () => generateKnapsackSteps(),
};
