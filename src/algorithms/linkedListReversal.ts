import { AlgorithmDefinition, LinkedListState, LinkedListNode, CodeSnippets, Step } from '../types/algorithm';

export const LINKED_LIST_CODE_SNIPPETS: CodeSnippets = {
  typescript: `class ListNode {
  value: number;
  next: ListNode | null = null;
  constructor(value: number) { this.value = value; }
}

function reverseLinkedList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next;  // Store next
    current.next = prev;        // Reverse pointer
    prev = current;             // Move prev forward
    current = next;             // Move current forward
  }
  return prev; // New head
}`,
  python: `class ListNode:
    def __init__(self, value: int):
        self.value = value
        self.next = None

def reverse_linked_list(head: ListNode | None) -> ListNode | None:
    prev = None
    current = head

    while current is not None:
        next_node = current.next  # Store next
        current.next = prev       # Reverse pointer
        prev = current             # Move prev forward
        current = next_node        # Move current forward

    return prev  # New head`,
  java: `class ListNode {
    int value;
    ListNode next;
    ListNode(int value) { this.value = value; }
}

public ListNode reverseLinkedList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;

    while (current != null) {
        ListNode next = current.next;  // Store next
        current.next = prev;           // Reverse pointer
        prev = current;                // Move prev forward
        current = next;                // Move current forward
    }
    return prev; // New head
}`,
  cpp: `struct ListNode {
    int value;
    ListNode* next;
    ListNode(int val) : value(val), next(nullptr) {}
};

ListNode* reverseLinkedList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;

    while (current != nullptr) {
        ListNode* next = current->next;  // Store next
        current->next = prev;            // Reverse pointer
        prev = current;                  // Move prev forward
        current = next;                  // Move current forward
    }
    return prev; // New head
}`,
};

export const DEFAULT_LINKED_LIST_INPUT: number[] = [1, 2, 3, 4, 5];

export function generateLinkedListReversalSteps(input: number[]): Step<LinkedListState>[] {
  const steps: Step<LinkedListState>[] = [];

  const nodes: LinkedListNode[] = input.map((val, idx) => ({
    id: `ll-node-${idx}`,
    value: val,
    status: 'default',
  }));

  const pushStep = (
    highlightedLines: number[],
    description: string,
    currentNodes: LinkedListNode[],
    pointerLabel?: string,
    pointerIndex?: number,
  ) => {
    steps.push({
      state: {
        nodes: currentNodes.map((n) => ({ ...n })),
        headIndex: 0,
        pointerLabel,
        pointerIndex,
      },
      highlightedLines,
      description,
    });
  };

  // Initial state
  pushStep([1, 2, 3], 'Initial linked list before reversal.', nodes);

  if (nodes.length <= 1) {
    if (nodes.length === 1) nodes[0].status = 'sorted';
    pushStep([17], 'Only one node; already reversed.', nodes);
    return steps;
  }

  // Simulate reversal
  const reversed: LinkedListNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    // Highlight current being processed
    const snapshot = nodes.map((n, idx) => ({
      ...n,
      status: idx === i ? 'active' : idx < i ? 'visited' : 'default',
    })) as LinkedListNode[];

    pushStep(
      [10, 11],
      `Current pointer at node ${nodes[i].value}. Storing reference to next node.`,
      snapshot,
      'current',
      i,
    );

    pushStep(
      [12],
      `Reversing pointer: node ${nodes[i].value}.next now points to ${reversed.length > 0 ? reversed[reversed.length - 1].value : 'null'} (prev).`,
      snapshot.map((n, idx) => ({
        ...n,
        status: idx === i ? 'swapping' : n.status,
      })),
      'current',
      i,
    );

    reversed.unshift({ ...nodes[i], status: 'sorted' as const });

    pushStep(
      [13, 14],
      `Moved prev and current pointers forward. Reversed so far: [${reversed.map((n) => n.value).join(' → ')}]`,
      [...reversed, ...nodes.slice(i + 1).map((n) => ({ ...n, status: 'default' as const }))],
      'prev',
      0,
    );
  }

  // Final state
  pushStep(
    [16, 17],
    `Reversal complete! New list: [${reversed.map((n) => n.value).join(' → ')}]`,
    reversed.map((n) => ({ ...n, status: 'sorted' as const })),
  );

  return steps;
}

export const linkedListReversalDefinition: AlgorithmDefinition<number[], LinkedListState> = {
  meta: {
    id: 'linked-list-reversal',
    name: 'Linked List Reversal',
    category: 'linked-list',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    description:
      'Reverses a singly linked list in-place by iterating through each node and reversing the pointer direction. Uses three pointers: prev, current, and next.',
    code: LINKED_LIST_CODE_SNIPPETS,
    defaultInput: DEFAULT_LINKED_LIST_INPUT,
    implemented: true,
  },
  generateSteps: generateLinkedListReversalSteps,
};
