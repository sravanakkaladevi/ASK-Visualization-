import { AlgorithmDefinition, GraphData, GraphNode, GraphEdge, CodeSnippets, Step } from '../types/algorithm';

export const BFS_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function bfs(graph: Record<string, string[]>, startNode: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const order: string[] = [];
  visited.add(startNode);

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
  python: `from collections import deque

def bfs(graph: dict[str, list[str]], start_node: str) -> list[str]:
  visited = {start_node}
  queue = deque([start_node])
  order = []

  while queue:
    current = queue.popleft()
    order.append(current)

    for neighbor in graph.get(current, []):
      if neighbor not in visited:
        visited.add(neighbor)
        queue.append(neighbor)

  return order`,
  java: `public static List<String> bfs(Map<String, List<String>> graph, String startNode) {
  Set<String> visited = new HashSet<>();
  Queue<String> queue = new LinkedList<>();
  List<String> order = new ArrayList<>();

  visited.add(startNode);
  queue.add(startNode);

  while (!queue.isEmpty()) {
    String current = queue.poll();
    order.add(current);

    for (String neighbor : graph.getOrDefault(current, Collections.emptyList())) {
      if (!visited.contains(neighbor)) {
        visited.add(neighbor);
        queue.add(neighbor);
      }
    }
  }
  return order;
}`,
  cpp: `std::vector<std::string> bfs(std::unordered_map<std::string, std::vector<std::string>>& graph, std::string startNode) {
  std::unordered_set<std::string> visited;
  std::queue<std::string> q;
  std::vector<std::string> order;

  visited.insert(startNode);
  q.push(startNode);

  while (!q.empty()) {
    std::string current = q.front();
    q.pop();
    order.push_back(current);

    for (const auto& neighbor : graph[current]) {
      if (visited.find(neighbor) == visited.end()) {
        visited.insert(neighbor);
        q.push(neighbor);
      }
    }
  }
  return order;
}`,
};

export const DEFAULT_GRAPH_DATA: GraphData = {
  startNodeId: 'A',
  nodes: [
    { id: 'A', label: 'A', x: 250, y: 50, status: 'unvisited' },
    { id: 'B', label: 'B', x: 120, y: 150, status: 'unvisited' },
    { id: 'C', label: 'C', x: 380, y: 150, status: 'unvisited' },
    { id: 'D', label: 'D', x: 60, y: 260, status: 'unvisited' },
    { id: 'E', label: 'E', x: 180, y: 260, status: 'unvisited' },
    { id: 'F', label: 'F', x: 320, y: 260, status: 'unvisited' },
    { id: 'G', label: 'G', x: 440, y: 260, status: 'unvisited' },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' },
  ],
};

export function generateBFSSteps(input: GraphData): Step<GraphData>[] {
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
    queue: string[],
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
      } else if (queue.includes(n.id)) {
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
      metadata: { queue: [...queue], visited: Array.from(visited), activeNodeId },
    });
  };

  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  visited.add(startNodeId);

  pushStep(
    [1, 2, 3, 4, 5],
    `Starting BFS at Node ${startNodeId}. Added ${startNodeId} to queue and marked visited. Queue: [${queue.join(', ')}]`,
    queue,
    visited,
    startNodeId
  );

  while (queue.length > 0) {
    const current = queue.shift()!;

    pushStep(
      [6, 7, 8],
      `Dequeued Node ${current}. Processing node ${current}. Queue: [${queue.join(', ')}]`,
      queue,
      visited,
      current
    );

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      pushStep(
        [9, 10],
        `Checking neighbor ${neighbor} of Node ${current}.`,
        queue,
        visited,
        current,
        { from: current, to: neighbor }
      );

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        pushStep(
          [11, 12, 13],
          `Node ${neighbor} is unvisited. Enqueued ${neighbor}. Queue: [${queue.join(', ')}]`,
          queue,
          visited,
          neighbor,
          { from: current, to: neighbor }
        );
      } else {
        pushStep(
          [10],
          `Node ${neighbor} already visited. Skipping.`,
          queue,
          visited,
          current
        );
      }
    }
  }

  pushStep(
    [15, 16],
    'BFS Traversal Complete! All reachable nodes visited level by level.',
    [],
    visited
  );

  return steps;
}

export const bfsDefinition: AlgorithmDefinition<GraphData, GraphData> = {
  meta: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'graph',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
    description:
      'BFS traverses a graph level by level starting from a chosen node, using a Queue data structure to explore nearest neighbors first.',
    code: BFS_CODE_SNIPPETS,
    defaultInput: DEFAULT_GRAPH_DATA,
    implemented: true,
  },
  generateSteps: generateBFSSteps,
};
