import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';
import { HanoiState } from '../visualizers/HanoiView';

export const HANOI_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function hanoi(n: number, from: string, to: string, aux: string) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${from} to \${to}\`);
    return;
  }
  hanoi(n - 1, from, aux, to);
  console.log(\`Move disk \${n} from \${from} to \${to}\`);
  hanoi(n - 1, aux, to, from);
}`,
  python: `def hanoi(n, source, target, auxiliary):
    if n == 1:
        print(f"Move disk 1 from {source} to {target}")
        return
    hanoi(n - 1, source, auxiliary, target)
    print(f"Move disk {n} from {source} to {target}")
    hanoi(n - 1, auxiliary, target, source)`,
  java: `public class TowerOfHanoi {
    public static void solve(int n, char from, char to, char aux) {
        if (n == 1) {
            System.out.println("Move disk 1 from " + from + " to " + to);
            return;
        }
        solve(n - 1, from, aux, to);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        solve(n - 1, aux, to, from);
    }
}`,
  cpp: `void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        std::cout << "Move disk 1 from " << from << " to " << to << "\\n";
        return;
    }
    hanoi(n - 1, from, aux, to);
    std::cout << "Move disk " << n << " from " << from << " to " << to << "\\n";
    hanoi(n - 1, aux, to, from);
}`,
};

export function generateHanoiSteps(diskCount: number = 3): Step<HanoiState>[] {
  const steps: Step<HanoiState>[] = [];
  const pegs: { A: number[]; B: number[]; C: number[] } = {
    A: Array.from({ length: diskCount }, (_, i) => diskCount - i),
    B: [],
    C: [],
  };

  steps.push({
    state: {
      pegs: JSON.parse(JSON.stringify(pegs)),
      diskCount,
      moveDescription: `Initial state: All ${diskCount} disks stacked on Peg A in decreasing size order.`,
    },
    highlightedLines: [1, 2],
    description: `Initialize Tower of Hanoi problem with ${diskCount} disks on Peg A. Goal: Move to Peg C.`,
  });

  function solveHanoi(n: number, from: 'A' | 'B' | 'C', to: 'A' | 'B' | 'C', aux: 'A' | 'B' | 'C') {
    if (n === 1) {
      const disk = pegs[from].pop()!;
      pegs[to].push(disk);
      steps.push({
        state: {
          pegs: JSON.parse(JSON.stringify(pegs)),
          diskCount,
          moveDescription: `Base case: Move disk 1 directly from Peg ${from} to Peg ${to}`,
          activeDisk: 1,
          fromPeg: from,
          toPeg: to,
        },
        highlightedLines: [2, 3],
        description: `Move disk 1 directly from Peg ${from} to Peg ${to}.`,
      });
      return;
    }

    solveHanoi(n - 1, from, aux, to);

    const disk = pegs[from].pop()!;
    pegs[to].push(disk);
    steps.push({
      state: {
        pegs: JSON.parse(JSON.stringify(pegs)),
        diskCount,
        moveDescription: `Recursive step: Move disk ${n} from Peg ${from} to Peg ${to}`,
        activeDisk: n,
        fromPeg: from,
        toPeg: to,
      },
      highlightedLines: [6, 7],
      description: `Move disk ${n} from Peg ${from} to Peg ${to}.`,
    });

    solveHanoi(n - 1, aux, to, from);
  }

  solveHanoi(diskCount, 'A', 'C', 'B');

  steps.push({
    state: {
      pegs: JSON.parse(JSON.stringify(pegs)),
      diskCount,
      moveDescription: `Tower of Hanoi solved! All ${diskCount} disks successfully transferred to Peg C.`,
    },
    highlightedLines: [8],
    description: `All disks transferred in minimum 2^N - 1 moves (${Math.pow(2, diskCount) - 1} moves total).`,
  });

  return steps;
}

export const towerOfHanoiDefinition: AlgorithmDefinition<number, HanoiState> = {
  meta: {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'recursion-backtracking',
    timeComplexity: { best: 'O(2^N)', average: 'O(2^N)', worst: 'O(2^N)' },
    spaceComplexity: 'O(N)',
    description: 'Classic recursive puzzle moving N disks across 3 pegs adhering to size constraints.',
    code: HANOI_CODE_SNIPPETS,
    defaultInput: 3,
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: (n = 3) => generateHanoiSteps(n),
};
