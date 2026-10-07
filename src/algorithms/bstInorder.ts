import { AlgorithmDefinition, TreeState, TreeNode, CodeSnippets, Step } from '../types/algorithm';

export const BST_INORDER_CODE_SNIPPETS: CodeSnippets = {
  typescript: `class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(value: number) { this.value = value; }
}

function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function traverse(node: TreeNode | null) {
    if (node === null) return;
    traverse(node.left);        // Visit left subtree
    result.push(node.value);    // Visit current node
    traverse(node.right);       // Visit right subtree
  }

  traverse(root);
  return result;
}`,
  python: `class TreeNode:
    def __init__(self, value: int):
        self.value = value
        self.left = None
        self.right = None

def inorder_traversal(root: TreeNode | None) -> list[int]:
    result = []

    def traverse(node: TreeNode | None):
        if node is None:
            return
        traverse(node.left)       # Visit left subtree
        result.append(node.value) # Visit current node
        traverse(node.right)      # Visit right subtree

    traverse(root)
    return result`,
  java: `class TreeNode {
    int value;
    TreeNode left, right;
    TreeNode(int value) { this.value = value; }
}

public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();

    void traverse(TreeNode node) {
        if (node == null) return;
        traverse(node.left);          // Visit left subtree
        result.add(node.value);       // Visit current node
        traverse(node.right);         // Visit right subtree
    }

    traverse(root);
    return result;
}`,
  cpp: `struct TreeNode {
    int value;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int val) : value(val), left(nullptr), right(nullptr) {}
};

std::vector<int> inorderTraversal(TreeNode* root) {
    std::vector<int> result;

    std::function<void(TreeNode*)> traverse = [&](TreeNode* node) {
        if (node == nullptr) return;
        traverse(node->left);         // Visit left subtree
        result.push_back(node->value); // Visit current node
        traverse(node->right);        // Visit right subtree
    };

    traverse(root);
    return result;
}`,
};

// Build tree layout positions for visualization
function buildTreeLayout(values: number[]): TreeNode[] {
  if (values.length === 0) return [];

  const nodes: TreeNode[] = [];
  const nodeMap = new Map<number, { left?: number; right?: number }>();

  // Build BST insertion order
  interface BSTNode { value: number; leftIdx?: number; rightIdx?: number }
  const bstNodes: BSTNode[] = [];

  function insertBST(val: number): number {
    const idx = bstNodes.length;
    bstNodes.push({ value: val });
    return idx;
  }

  function bstInsert(rootIdx: number, val: number): void {
    const root = bstNodes[rootIdx];
    if (val < root.value) {
      if (root.leftIdx === undefined) {
        root.leftIdx = insertBST(val);
      } else {
        bstInsert(root.leftIdx, val);
      }
    } else {
      if (root.rightIdx === undefined) {
        root.rightIdx = insertBST(val);
      } else {
        bstInsert(root.rightIdx, val);
      }
    }
  }

  insertBST(values[0]);
  for (let i = 1; i < values.length; i++) {
    bstInsert(0, values[i]);
  }

  // Calculate positions using recursive layout
  function layout(bstIdx: number, x: number, y: number, xSpread: number): void {
    const bst = bstNodes[bstIdx];
    const nodeId = `tree-${bstIdx}`;

    const treeNode: TreeNode = {
      id: nodeId,
      value: bst.value,
      status: 'default',
      x,
      y,
      left: bst.leftIdx !== undefined ? `tree-${bst.leftIdx}` : undefined,
      right: bst.rightIdx !== undefined ? `tree-${bst.rightIdx}` : undefined,
    };
    nodes.push(treeNode);
    nodeMap.set(bstIdx, { left: bst.leftIdx, right: bst.rightIdx });

    if (bst.leftIdx !== undefined) {
      layout(bst.leftIdx, x - xSpread, y + 70, xSpread * 0.55);
    }
    if (bst.rightIdx !== undefined) {
      layout(bst.rightIdx, x + xSpread, y + 70, xSpread * 0.55);
    }
  }

  layout(0, 250, 40, 110);
  return nodes;
}

export const DEFAULT_BST_INPUT: number[] = [50, 30, 70, 20, 40, 60, 80];

export function generateBSTInorderSteps(input: number[]): Step<TreeState>[] {
  const steps: Step<TreeState>[] = [];
  const treeNodes = buildTreeLayout(input);
  const visitOrder: string[] = [];

  if (treeNodes.length === 0) {
    steps.push({
      state: { nodes: [], rootId: '', visitOrder: [] },
      highlightedLines: [1],
      description: 'Empty tree. Nothing to traverse.',
    });
    return steps;
  }

  const rootId = treeNodes[0].id;
  const nodeById = new Map(treeNodes.map((n) => [n.id, n]));

  const pushStep = (
    highlightedLines: number[],
    description: string,
    activeId?: string,
  ) => {
    const snapshot: TreeNode[] = treeNodes.map((n) => {
      let status = n.status;
      if (n.id === activeId) {
        status = 'active';
      } else if (visitOrder.includes(n.id)) {
        status = 'visited';
      } else {
        status = 'default';
      }
      return { ...n, status };
    });

    steps.push({
      state: {
        nodes: snapshot,
        rootId,
        visitOrder: [...visitOrder],
      },
      highlightedLines,
      description,
    });
  };

  pushStep([7, 8], `Starting in-order traversal of BST. Root: ${treeNodes[0].value}`);

  // Simulate recursive in-order traversal
  function inorder(nodeId: string): void {
    const node = nodeById.get(nodeId);
    if (!node) return;

    pushStep([9, 10], `Entering node ${node.value}.`, nodeId);

    // Visit left subtree
    if (node.left) {
      pushStep([11], `Going left from ${node.value} to left subtree.`, nodeId);
      inorder(node.left);
    } else {
      pushStep([11], `Node ${node.value} has no left child.`, nodeId);
    }

    // Visit current node
    visitOrder.push(nodeId);
    pushStep(
      [12],
      `Visiting node ${node.value}. In-order sequence so far: [${visitOrder.map((id) => nodeById.get(id)?.value).join(', ')}]`,
      nodeId,
    );

    // Visit right subtree
    if (node.right) {
      pushStep([13], `Going right from ${node.value} to right subtree.`, nodeId);
      inorder(node.right);
    } else {
      pushStep([13], `Node ${node.value} has no right child.`, nodeId);
    }
  }

  inorder(rootId);

  pushStep(
    [16, 17],
    `In-order traversal complete! Result: [${visitOrder.map((id) => nodeById.get(id)?.value).join(', ')}]`,
  );

  return steps;
}

export const bstInorderDefinition: AlgorithmDefinition<number[], TreeState> = {
  meta: {
    id: 'bst-inorder',
    name: 'BST In-Order Traversal',
    category: 'tree',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(h)',
    description:
      'In-order traversal of a Binary Search Tree visits nodes in ascending sorted order: left subtree → root → right subtree. The call stack depth equals the tree height (h).',
    code: BST_INORDER_CODE_SNIPPETS,
    defaultInput: DEFAULT_BST_INPUT,
    implemented: true,
  },
  generateSteps: generateBSTInorderSteps,
};
