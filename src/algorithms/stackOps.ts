import { AlgorithmDefinition, StackQueueState, StackQueueItem, CodeSnippets, Step } from '../types/algorithm';

export const STACK_OPS_CODE_SNIPPETS: CodeSnippets = {
  typescript: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);    // Add to top
  }

  pop(): T | undefined {
    return this.items.pop();  // Remove from top
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}`,
  python: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item: int) -> None:
        self.items.append(item)    # Add to top

    def pop(self) -> int:
        return self.items.pop()    # Remove from top

    def peek(self) -> int:
        return self.items[-1]

    def is_empty(self) -> bool:
        return len(self.items) == 0

    def size(self) -> int:
        return len(self.items)`,
  java: `public class Stack<T> {
    private List<T> items = new ArrayList<>();

    public void push(T item) {
        items.add(item);          // Add to top
    }

    public T pop() {
        return items.remove(items.size() - 1); // Remove from top
    }

    public T peek() {
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int size() {
        return items.size();
    }
}`,
  cpp: `template <typename T>
class Stack {
    std::vector<T> items;
public:
    void push(const T& item) {
        items.push_back(item);    // Add to top
    }

    T pop() {
        T top = items.back();
        items.pop_back();         // Remove from top
        return top;
    }

    T peek() const {
        return items.back();
    }

    bool isEmpty() const {
        return items.empty();
    }

    size_t size() const {
        return items.size();
    }
};`,
};

export interface StackOpsInput {
  operations: Array<{ type: 'push'; value: number } | { type: 'pop' }>;
}

export const DEFAULT_STACK_INPUT: StackOpsInput = {
  operations: [
    { type: 'push', value: 10 },
    { type: 'push', value: 25 },
    { type: 'push', value: 8 },
    { type: 'push', value: 42 },
    { type: 'pop' },
    { type: 'push', value: 15 },
    { type: 'pop' },
    { type: 'pop' },
  ],
};

export function generateStackSteps(input: StackOpsInput): Step<StackQueueState>[] {
  const steps: Step<StackQueueState>[] = [];
  const stack: StackQueueItem[] = [];
  let idCounter = 0;

  const pushStep = (highlightedLines: number[], description: string, opLabel?: string) => {
    steps.push({
      state: {
        items: stack.map((item) => ({ ...item })),
        type: 'stack',
        operationLabel: opLabel,
      },
      highlightedLines,
      description,
    });
  };

  pushStep([1, 2], 'Stack initialized. Ready to process operations.');

  for (const op of input.operations) {
    if (op.type === 'push') {
      const newItem: StackQueueItem = {
        id: `stack-${idCounter++}`,
        value: op.value,
        status: 'inserted',
      };

      stack.push(newItem);

      pushStep(
        [3, 4],
        `PUSH ${op.value} → Stack top is now ${op.value}. Size: ${stack.length}`,
        `push(${op.value})`
      );

      // Settle the inserted item
      stack[stack.length - 1].status = 'default';
      pushStep(
        [4],
        `Element ${op.value} added to the stack.`,
        `push(${op.value})`
      );
    } else {
      if (stack.length === 0) {
        pushStep([6, 7], 'POP failed — stack is empty (underflow)!', 'pop() → empty');
        continue;
      }

      // Highlight element being popped
      stack[stack.length - 1].status = 'deleted';
      const poppedValue = stack[stack.length - 1].value;

      pushStep(
        [6, 7],
        `POP → Removing top element ${poppedValue} from the stack.`,
        `pop() → ${poppedValue}`
      );

      stack.pop();

      pushStep(
        [7],
        `Popped ${poppedValue}. Stack size is now ${stack.length}. ${stack.length > 0 ? `New top: ${stack[stack.length - 1].value}` : 'Stack is empty.'}`,
        `pop() → ${poppedValue}`
      );
    }
  }

  pushStep(
    [18, 19],
    `All operations complete! Final stack (bottom to top): [${stack.map((s) => s.value).join(', ')}]`,
    'Complete'
  );

  return steps;
}

export const stackOpsDefinition: AlgorithmDefinition<StackOpsInput, StackQueueState> = {
  meta: {
    id: 'stack-operations',
    name: 'Stack (Push/Pop)',
    category: 'stack-queue',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    description:
      'A Stack follows the LIFO (Last In, First Out) principle. Push adds an element to the top, and Pop removes the most recently added element.',
    code: STACK_OPS_CODE_SNIPPETS,
    defaultInput: DEFAULT_STACK_INPUT,
    implemented: true,
  },
  generateSteps: generateStackSteps,
};
