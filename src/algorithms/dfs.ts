import { AlgorithmDefinition, GraphData, GraphNode, GraphEdge, CodeSnippets, Step } from '../types/algorithm';
import { DEFAULT_GRAPH_DATA } from './bfs';

export const DFS_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function dfs(graph: Record<string, string[]>, startNode: string): string[] {
  const visited = new Set<string>();
  const stack: string[] = [startNode];
  const order: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (!visited.has(current)) {
      visited.add(current);
      order.push(current);

      for (const neighbor of graph[current] || []) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  return order;
}`,
  python: `def dfs(graph: dict[str, list[str]], start_node: str) -> list[str]:
  visited = set()
  stack = [start_node]
  order = []

  while stack:
    current = stack.pop()
    if current not in visited:
      visited.add(current)
      order.append(current)

      for neighbor in graph.get(current, []):
        if neighbor not in visited:
          stack.append(neighbor)

  return order`,
  java: `public static List<String> dfs(Map<String, List<String>> graph, String startNode) {
  Set<String> visited = new HashSet<>();
  Stack<String> stack = new Stack<>();
  List<String> order = new ArrayList<>();

  stack.push(startNode);

  while (!stack.isEmpty()) {
    String current = stack.pop();
    if (!visited.contains(current)) {
      visited.add(current);
      order.add(current);

      for (String neighbor : graph.getOrDefault(current, Collections.emptyList())) {
        if (!visited.contains(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  return order;
}`,
  cpp: `std::vector<std::string> dfs(std::unordered_map<std::string, std::vector<std::string>>& graph, std::string startNode) {
  std::unordered_set<std::string> visited;
  std::stack<std::string> st;
  std::vector<std::string> order;

  st.push(startNode);

  while (!st.empty()) {
    std::string current = st.top();
    st.pop();
    if (visited.find(current) == visited.end()) {
      visited.insert(current);
      order.push_back(current);

      for (const auto& neighbor : graph[current]) {
        if (visited.find(neighbor) == visited.end()) {
          st.push(neighbor);
        }
      }
    }
  }
  return order;
}`,
};

export function generateDFSSteps(input: GraphData): Step<GraphData>[] {
  const steps: Step<GraphData>[] = [];

  const nodes: GraphNode[] = input.nodes.map((n) => ({ ...n, status: 'unvisited' }));
  const edges: GraphEdge[] = input.edges.map((e) => ({ ...e, status: 'default' }));
  const startNodeId = input.startNodeId || nodes[0]?.id || 'A';

  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.from]?.push(e.to);
    adj[e.to]?.push(e.from);
  });

  const pushStep = (
    highlightedLines: number[],
    description: string,
    stack: string[],
    visited: Set<string>,
    activeNodeId?: string,
    activeEdge?: { from: string; to: string }
  ) => {
    const nodeSnapshots = nodes.map((n) => {
      let status = n.status;
      if (n.id === activeNodeId) {
        status = 'active';
      } else if (visited.has(n.id)) {
        status = 'visited';
      } else if (stack.includes(n.id)) {
        status = 'comparing';
      } else {
        status = 'unvisited';
      }
      return { ...n, status };
    });

    const edgeSnapshots = edges.map((e) => {
      const isEdgeActive =
        activeEdge &&
        ((e.from === activeEdge.from && e.to === activeEdge.to) ||
          (e.from === activeEdge.to && e.to === activeEdge.from));

      const isEdgeVisited = visited.has(e.from) && visited.has(e.to);

      return {
        ...e,
        status: isEdgeActive ? ('active' as const) : isEdgeVisited ? ('visited' as const) : ('default' as const),
      };
    });

    steps.push({
      state: {
        startNodeId,
        nodes: nodeSnapshots,
        edges: edgeSnapshots,
      },
      highlightedLines,
      description,
      metadata: { stack: [...stack], visited: Array.from(visited), activeNodeId },
    });
  };

  const visited = new Set<string>();
  const stack: string[] = [startNodeId];

  pushStep(
    [1, 2, 3],
    `Starting DFS at Node ${startNodeId}. Initialized stack: [${stack.join(', ')}]`,
    stack,
    visited,
    startNodeId
  );

  while (stack.length > 0) {
    const current = stack.pop()!;

    pushStep(
      [6, 7],
      `Popped Node ${current} from stack. Stack remaining: [${stack.join(', ')}]`,
      stack,
      visited,
      current
    );

    if (!visited.has(current)) {
      visited.add(current);

      pushStep(
        [8, 9, 10],
        `Marked Node ${current} as visited. Exploring branch deep.`,
        stack,
        visited,
        current
      );

      const neighbors = adj[current] || [];
      for (const neighbor of neighbors) {
        pushStep(
          [11, 12],
          `Checking neighbor ${neighbor} of Node ${current}.`,
          stack,
          visited,
          current,
          { from: current, to: neighbor }
        );

        if (!visited.has(neighbor)) {
          stack.push(neighbor);

          pushStep(
            [13, 14],
            `Pushed unvisited neighbor ${neighbor} onto stack. Stack: [${stack.join(', ')}]`,
            stack,
            visited,
            neighbor,
            { from: current, to: neighbor }
          );
        }
      }
    } else {
      pushStep(
        [8],
        `Node ${current} already visited. Backtracking.`,
        stack,
        visited,
        current
      );
    }
  }

  pushStep(
    [18],
    'DFS Traversal Complete! Explored graph recursively along deepest branches.',
    [],
    visited
  );

  return steps;
}

export const dfsDefinition: AlgorithmDefinition<GraphData, GraphData> = {
  meta: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'graph',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
    description:
      'DFS traverses a graph by exploring as far as possible along each branch before backtracking, utilizing a Stack data structure.',
    code: DFS_CODE_SNIPPETS,
    defaultInput: DEFAULT_GRAPH_DATA,
    implemented: true,
  },
  generateSteps: generateDFSSteps,
};
