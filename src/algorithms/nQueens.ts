import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';
import { ChessboardState } from '../visualizers/ChessboardView';

export const NQUEENS_CODE_SNIPPETS: CodeSnippets = {
  python: `def solve_n_queens(n):
    board = [-1] * n  # board[row] = col
    solutions = []

    def is_safe(row, col):
        for r in range(row):
            c = board[r]
            # Check column & diagonal attack
            if c == col or abs(c - col) == abs(r - row):
                return False
        return True

    def backtrack(row):
        if row == n:
            solutions.append(board[:])
            return True  # Stop after finding first valid solution

        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                if backtrack(row + 1):
                    return True
                board[row] = -1  # Backtrack

        return False

    backtrack(0)
    return solutions`,
  java: `public class NQueens {
    public static boolean solveNQueens(int[] board, int row, int n) {
        if (row == n) return true;

        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                if (solveNQueens(board, row + 1, n)) return true;
                board[row] = -1; // Backtrack
            }
        }
        return false;
    }

    private static boolean isSafe(int[] board, int row, int col) {
        for (int r = 0; r < row; r++) {
            int c = board[r];
            if (c == col || Math.abs(c - col) == Math.abs(r - row)) return false;
        }
        return true;
    }
}`,
  cpp: `bool isSafe(const std::vector<int>& board, int row, int col) {
    for (int r = 0; r < row; ++r) {
        int c = board[r];
        if (c == col || std::abs(c - col) == std::abs(r - row)) return false;
    }
    return true;
}

bool solveNQueens(std::vector<int>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; ++col) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            if (solveNQueens(board, row + 1, n)) return true;
            board[row] = -1; // Backtrack
        }
    }
    return false;
}`,
  javascript: `function solveNQueens(n) {
  const board = Array(n).fill(-1);
  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }
  function backtrack(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        if (backtrack(row + 1)) return true;
        board[row] = -1;
      }
    }
    return false;
  }
  backtrack(0);
  return board;
}`,
};

export function generateNQueensSteps(n: number = 4): Step<ChessboardState>[] {
  const steps: Step<ChessboardState>[] = [];
  const board = new Array<number>(n).fill(-1);

  // Safety check function
  function isSafe(row: number, col: number): { safe: boolean; conflictRow?: number; conflictCol?: number; reason?: string } {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col) {
        return { safe: false, conflictRow: r, conflictCol: c, reason: `Column conflict with Queen at (${r}, ${c})` };
      }
      if (Math.abs(c - col) === Math.abs(r - row)) {
        return { safe: false, conflictRow: r, conflictCol: c, reason: `Diagonal conflict with Queen at (${r}, ${c})` };
      }
    }
    return { safe: true };
  }

  // Helper to record current state
  function snapshot(
    logMessage: string,
    description: string,
    lines: number[],
    currentAttempt?: { row: number; col: number },
    conflictAttempt?: { row: number; col: number }
  ) {
    const placedQueens: { row: number; col: number; status: 'placed' | 'conflict' | 'testing' }[] = [];

    for (let r = 0; r < n; r++) {
      if (board[r] !== -1) {
        placedQueens.push({ row: r, col: board[r], status: 'placed' });
      }
    }

    if (conflictAttempt) {
      placedQueens.push({ row: conflictAttempt.row, col: conflictAttempt.col, status: 'conflict' });
    } else if (currentAttempt && board[currentAttempt.row] !== currentAttempt.col) {
      placedQueens.push({ row: currentAttempt.row, col: currentAttempt.col, status: 'testing' });
    }

    steps.push({
      state: {
        boardSize: n,
        queens: placedQueens,
        currentAttempt,
        logMessage,
      },
      highlightedLines: lines,
      description,
    });
  }

  // Initial step
  snapshot(
    `N-Queens: Initialized ${n}x${n} chessboard. Goal: Place ${n} non-attacking Queens.`,
    `Starting N-Queens recursive backtracking solver for N = ${n} on a ${n}x${n} grid.`,
    [1, 2, 3]
  );

  let stepCount = 0;
  const maxSteps = n <= 4 ? 30 : n <= 8 ? 80 : 120; // Cap steps for fast responsive animation

  function backtrack(row: number): boolean {
    if (row === n) {
      snapshot(
        `N-Queens SOLVED! Successfully placed all ${n} Queens with 0 attacks.`,
        `N-Queens Solution verified! Final non-attacking Queen coordinates: [${board.map((c, r) => `(${r}, ${c})`).join(', ')}].`,
        [15, 16, 17]
      );
      return true;
    }

    for (let col = 0; col < n; col++) {
      if (stepCount > maxSteps) {
        // If search tree is huge for large N, fast-forward to solution
        board[row] = col;
        const check = isSafe(row, col);
        if (check.safe) {
          if (backtrack(row + 1)) return true;
        }
        board[row] = -1;
        continue;
      }

      stepCount++;
      const check = isSafe(row, col);

      if (check.safe) {
        board[row] = col;
        snapshot(
          `Row ${row}: Tested (${row}, ${col}) -> Safe! Placed Queen at (${row}, ${col}).`,
          `Row ${row}: Column ${col} has no column or diagonal conflicts. Placed Queen at (${row}, ${col}). Recursing to Row ${row + 1}.`,
          [19, 20, 21],
          { row, col }
        );

        if (backtrack(row + 1)) return true;

        // Backtrack
        board[row] = -1;
        snapshot(
          `Row ${row}: Backtracking from (${row}, ${col}). Removing Queen from Row ${row}.`,
          `Subtree at Row ${row + 1} yielded no valid placements. Backtracking to Row ${row} and trying next column.`,
          [23],
          { row, col }
        );
      } else {
        // Record conflict (only sample some for speed)
        if (stepCount % (n >= 16 ? 4 : 1) === 0) {
          snapshot(
            `Row ${row}: Testing (${row}, ${col}) -> Conflict! ${check.reason}.`,
            `Row ${row}, Col ${col} is attacked by existing Queen at (${check.conflictRow}, ${check.conflictCol}). Moving to next column.`,
            [8, 9, 10],
            { row, col },
            { row, col }
          );
        }
      }
    }

    return false;
  }

  backtrack(0);

  return steps;
}

export const nQueensDefinition: AlgorithmDefinition<number, ChessboardState> = {
  meta: {
    id: 'n-queens',
    name: 'N-Queens Backtracking Problem',
    category: 'recursion-backtracking',
    timeComplexity: {
      best: 'O(N!)',
      average: 'O(N!)',
      worst: 'O(N!)',
    },
    spaceComplexity: 'O(N)',
    description:
      'Backtracking solver placing N non-attacking queens on an NxN chessboard such that no two queens share the same row, column, or diagonal.',
    code: NQUEENS_CODE_SNIPPETS,
    defaultInput: 8,
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: generateNQueensSteps,
};
