import { AlgorithmDefinition, StackQueueState, StackQueueItem, CodeSnippets, Step } from '../types/algorithm';

export const QUEUE_OPS_CODE_SNIPPETS: CodeSnippets = {
  python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item: int) -> None:
        self.items.append(item)    # Add to Rear (FIFO)

    def dequeue(self) -> int:
        return self.items.popleft() # Remove from Front

    def peek(self) -> int:
        return self.items[0]

    def is_empty(self) -> bool:
        return len(self.items) == 0

    def size(self) -> int:
        return len(self.items)`,
  java: `import java.util.LinkedList;
import java.util.Queue;

public class QueueExample {
    private Queue<Integer> q = new LinkedList<>();

    public void enqueue(int item) {
        q.offer(item);             // Add to Rear
    }

    public int dequeue() {
        return q.poll();           // Remove from Front
    }

    public int peek() {
        return q.peek();
    }
}`,
  cpp: `#include <queue>

std::queue<int> q;

void enqueue(int item) {
    q.push(item);      // Add to Rear
}

int dequeue() {
    int val = q.front();
    q.pop();           // Remove from Front
    return val;
}`,
  javascript: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
  peek() { return this.items[0]; }
}`,
};

export interface QueueOpsInput {
  operations: Array<{ type: 'enqueue'; value: number } | { type: 'dequeue' }>;
}

export const DEFAULT_QUEUE_INPUT: QueueOpsInput = {
  operations: [
    { type: 'enqueue', value: 12 },
    { type: 'enqueue', value: 34 },
    { type: 'enqueue', value: 56 },
    { type: 'dequeue' },
    { type: 'enqueue', value: 78 },
    { type: 'dequeue' },
    { type: 'enqueue', value: 90 },
  ],
};

export function generateQueueSteps(input: QueueOpsInput): Step<StackQueueState>[] {
  const steps: Step<StackQueueState>[] = [];
  const queue: StackQueueItem[] = [];
  let idCounter = 0;

  const pushStep = (highlightedLines: number[], description: string, opLabel?: string) => {
    steps.push({
      state: {
        items: queue.map((item) => ({ ...item })),
        type: 'queue',
        operationLabel: opLabel,
      },
      highlightedLines,
      description,
    });
  };

  pushStep([1, 2, 3, 4], 'Queue initialized. Ready to process FIFO operations.');

  for (const op of input.operations) {
    if (op.type === 'enqueue') {
      const newItem: StackQueueItem = {
        id: `queue-${idCounter++}`,
        value: op.value,
        status: 'inserted',
      };

      queue.push(newItem);

      pushStep(
        [7, 8],
        `ENQUEUE ${op.value} → Added to REAR of queue. Queue size: ${queue.length}`,
        `enqueue(${op.value})`
      );

      queue[queue.length - 1].status = 'default';
      pushStep(
        [8],
        `Element ${op.value} appended to queue.`,
        `enqueue(${op.value})`
      );
    } else {
      if (queue.length === 0) {
        pushStep([10, 11], 'DEQUEUE failed — Queue is empty (underflow)!', 'dequeue() → empty');
        continue;
      }

      queue[0].status = 'deleted';
      const dequeuedVal = queue[0].value;

      pushStep(
        [10, 11],
        `DEQUEUE → Removing FRONT element ${dequeuedVal} from queue.`,
        `dequeue() → ${dequeuedVal}`
      );

      queue.shift();

      pushStep(
        [11],
        `Dequeued ${dequeuedVal}. Queue size is now ${queue.length}. ${queue.length > 0 ? `New front: ${queue[0].value}` : 'Queue is empty.'}`,
        `dequeue() → ${dequeuedVal}`
      );
    }
  }

  pushStep(
    [13, 14],
    `All operations complete! Final queue (front to rear): [${queue.map((s) => s.value).join(', ')}]`,
    'Complete'
  );

  return steps;
}

export const queueOpsDefinition: AlgorithmDefinition<QueueOpsInput, StackQueueState> = {
  meta: {
    id: 'queue-operations',
    name: 'Queue (Enqueue/Dequeue)',
    category: 'stack-queue',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(N)',
    description:
      'A Queue follows the FIFO (First In, First Out) principle. Enqueue appends to the rear, and Dequeue removes from the front.',
    code: QUEUE_OPS_CODE_SNIPPETS,
    defaultInput: DEFAULT_QUEUE_INPUT,
    implemented: true,
  },
  generateSteps: generateQueueSteps,
};
