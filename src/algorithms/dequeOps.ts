import { AlgorithmDefinition, StackQueueState, StackQueueItem, CodeSnippets, Step } from '../types/algorithm';

export const DEQUE_CODE_SNIPPETS: CodeSnippets = {
  python: `from collections import deque

class Deque:
    def __init__(self):
        self.dq = deque()

    def append_right(self, item: int) -> None:
        self.dq.append(item)        # O(1) Push Back

    def append_left(self, item: int) -> None:
        self.dq.appendleft(item)    # O(1) Push Front

    def pop_right(self) -> int:
        return self.dq.pop()        # O(1) Pop Back

    def pop_left(self) -> int:
        return self.dq.popleft()    # O(1) Pop Front

    def is_empty(self) -> bool:
        return len(self.dq) == 0

    def size(self) -> int:
        return len(self.dq)`,
  java: `import java.util.ArrayDeque;
import java.util.Deque;

public class DequeExample {
    private Deque<Integer> dq = new ArrayDeque<>();

    public void pushFront(int val) {
        dq.addFirst(val);      // O(1) Front
    }

    public void pushBack(int val) {
        dq.addLast(val);       // O(1) Back
    }

    public int popFront() {
        return dq.removeFirst(); // O(1) Front
    }

    public int popBack() {
        return dq.removeLast();  // O(1) Back
    }
}`,
  cpp: `#include <deque>

std::deque<int> dq;

void pushFront(int val) {
    dq.push_front(val);   // O(1) Front
}

void pushBack(int val) {
    dq.push_back(val);    // O(1) Back
}

int popFront() {
    int val = dq.front();
    dq.pop_front();
    return val;
}

int popBack() {
    int val = dq.back();
    dq.pop_back();
    return val;
}`,
  javascript: `class Deque {
  constructor() {
    this.items = [];
  }
  pushFront(val) { this.items.unshift(val); }
  pushBack(val) { this.items.push(val); }
  popFront() { return this.items.shift(); }
  popBack() { return this.items.pop(); }
}`,
};

export interface DequeOp {
  type: 'push_front' | 'push_back' | 'pop_front' | 'pop_back';
  value?: number;
}

export interface DequeInput {
  operations: DequeOp[];
}

export const DEFAULT_DEQUE_INPUT: DequeInput = {
  operations: [
    { type: 'push_back', value: 10 },
    { type: 'push_front', value: 20 },
    { type: 'push_back', value: 30 },
    { type: 'push_front', value: 40 },
    { type: 'pop_front' },
    { type: 'pop_back' },
    { type: 'push_back', value: 50 },
    { type: 'push_front', value: 60 },
  ],
};

export function generateDequeSteps(input: DequeInput): Step<StackQueueState>[] {
  const steps: Step<StackQueueState>[] = [];
  const items: StackQueueItem[] = [];
  let idCounter = 0;

  const pushStep = (
    highlightedLines: number[],
    description: string,
    opLabel?: string,
    frontAction?: string,
    backAction?: string
  ) => {
    steps.push({
      state: {
        items: items.map((it) => ({ ...it })),
        type: 'deque',
        operationLabel: opLabel,
        frontAction,
        backAction,
      },
      highlightedLines,
      description,
    });
  };

  pushStep(
    [1, 2, 3, 4, 5],
    'Double-Ended Queue (Deque) initialized. Allows O(1) Push and Pop operations at BOTH Front and Rear ends.',
    'Deque Initialized'
  );

  for (const op of input.operations) {
    if (op.type === 'push_back') {
      const newItem: StackQueueItem = {
        id: `dq-${idCounter++}`,
        value: op.value || 0,
        status: 'inserted',
      };
      items.push(newItem);

      pushStep(
        [7, 8],
        `PUSH BACK (${op.value}) → Inserted ${op.value} at the REAR of the Deque. Deque size is now ${items.length}.`,
        `push_back(${op.value})`,
        undefined,
        `+${op.value}`
      );

      items[items.length - 1].status = 'default';
      pushStep(
        [8],
        `Element ${op.value} settled at the Rear of Deque.`,
        `push_back(${op.value})`
      );
    } else if (op.type === 'push_front') {
      const newItem: StackQueueItem = {
        id: `dq-${idCounter++}`,
        value: op.value || 0,
        status: 'inserted',
      };
      items.unshift(newItem);

      pushStep(
        [10, 11],
        `PUSH FRONT (${op.value}) → Inserted ${op.value} at the FRONT of the Deque. Deque size is now ${items.length}.`,
        `push_front(${op.value})`,
        `+${op.value}`,
        undefined
      );

      items[0].status = 'default';
      pushStep(
        [11],
        `Element ${op.value} settled at the Front of Deque.`,
        `push_front(${op.value})`
      );
    } else if (op.type === 'pop_front') {
      if (items.length === 0) {
        pushStep([16, 17], 'POP FRONT failed — Deque is empty (underflow)!', 'pop_front() -> empty');
        continue;
      }
      items[0].status = 'deleted';
      const val = items[0].value;

      pushStep(
        [16, 17],
        `POP FRONT → Removing ${val} from the FRONT of the Deque.`,
        `pop_front() -> ${val}`,
        `-${val}`,
        undefined
      );

      items.shift();
      pushStep(
        [17],
        `Removed ${val} from Front. Remaining Deque: [${items.map((i) => i.value).join(', ')}]`,
        `pop_front() -> ${val}`
      );
    } else if (op.type === 'pop_back') {
      if (items.length === 0) {
        pushStep([13, 14], 'POP BACK failed — Deque is empty (underflow)!', 'pop_back() -> empty');
        continue;
      }
      items[items.length - 1].status = 'deleted';
      const val = items[items.length - 1].value;

      pushStep(
        [13, 14],
        `POP BACK → Removing ${val} from the REAR of the Deque.`,
        `pop_back() -> ${val}`,
        undefined,
        `-${val}`
      );

      items.pop();
      pushStep(
        [14],
        `Removed ${val} from Rear. Remaining Deque: [${items.map((i) => i.value).join(', ')}]`,
        `pop_back() -> ${val}`
      );
    }
  }

  pushStep(
    [19, 20],
    `Deque operations complete! Final Deque contents: [${items.map((i) => i.value).join(', ')}]`,
    'Complete'
  );

  return steps;
}

export const dequeDefinition: AlgorithmDefinition<DequeInput, StackQueueState> = {
  meta: {
    id: 'deque',
    name: 'Double-Ended Queue (Deque)',
    category: 'stack-queue',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)',
    },
    spaceComplexity: 'O(N)',
    description:
      'A Double-Ended Queue (Deque) is an indexed sequence container supporting high-performance O(1) insertions and deletions at BOTH the front and back ends.',
    code: DEQUE_CODE_SNIPPETS,
    defaultInput: DEFAULT_DEQUE_INPUT,
    implemented: true,
  },
  generateSteps: generateDequeSteps,
};
