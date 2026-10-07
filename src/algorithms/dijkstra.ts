import { AlgorithmDefinition, CodeSnippets, GraphData, GraphNode, GraphEdge, Step, ElementStatus } from '../types/algorithm';

export const DIJKSTRA_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function dijkstra(graph: Record<string, { to: string; weight: number }[]>, start: string): Record<string, number> {
  const dist: Record<string, number> = {};
  const pq: { node: string; d: number }[] = [];

  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[start] = 0;
  pq.push({ node: start, d: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { node: u, d } = pq.shift()!;
    if (d > dist[u]) continue;  // skip stale entries

    for (const { to: v, weight } of graph[u]) {
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        pq.push({ node: v, d: alt });
      }
    }
  }
  return dist;
}`,
  python: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue  # skip stale entries

        for v, weight in graph[u]:
            alt = dist[u] + weight
            if alt < dist[v]:
                dist[v] = alt
                heapq.heappush(pq, (alt, v))

    return dist`,
  java: `public static Map<String, Integer> dijkstra(
        Map<String, List<int[]>> graph, String start) {
    Map<String, Integer> dist = new HashMap<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0]));

    for (String node : graph.keySet())
        dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0);
    pq.add(new int[]{0, start.charAt(0)});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0];
        String u = String.valueOf((char) curr[1]);
        if (d > dist.get(u)) continue;

        for (int[] edge : graph.get(u)) {
            String v = String.valueOf((char) edge[0]);
            int alt = dist.get(u) + edge[1];
            if (alt < dist.get(v)) {
                dist.put(v, alt);
                pq.add(new int[]{alt, edge[0]});
            }
        }
    }
    return dist;
}`,
  cpp: `std::map<std::string, int> dijkstra(
    const std::map<std::string,
    std::vector<std::pair<std::string, int>>>& graph,
    std::string start) {
  std::map<std::string, int> dist;
  for (auto& [node, _] : graph)
    dist[node] = 1e9;
  dist[start] = 0;

  using P = std::pair<int, std::string>;
  std::priority_queue<P, std::vector<P>,
    std::greater<P>> pq;
  pq.push({0, start});

  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;

    for (auto& [v, w] : graph.at(u)) {
      int alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        pq.push({alt, v});
      }
    }
  }
  return dist;
}`,
};

// 7-node weighted graph matching the classic W3Schools Dijkstra reference
// Graph: A-G vertices, source = D, with weighted undirected edges
export const DEFAULT_DIJKSTRA_GRAPH: GraphData = {
  startNodeId: 'D',
  nodes: [
    { id: 'A', label: 'A', x: 100, y: 185, status: 'unvisited' },
    { id: 'B', label: 'B', x: 130, y: 45, status: 'unvisited' },
    { id: 'C', label: 'C', x: 250, y: 115, status: 'unvisited' },
    { id: 'D', label: 'D', x: 170, y: 265, status: 'unvisited' },
    { id: 'E', label: 'E', x: 390, y: 195, status: 'unvisited' },
    { id: 'F', label: 'F', x: 370, y: 45, status: 'unvisited' },
    { id: 'G', label: 'G', x: 460, y: 130, status: 'unvisited' },
  ],
  edges: [
    { from: 'D', to: 'A', weight: 4 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'A', to: 'E', weight: 4 },
    { from: 'E', to: 'C', weight: 4 },
    { from: 'E', to: 'G', weight: 5 },
    { from: 'C', to: 'F', weight: 5 },
    { from: 'C', to: 'B', weight: 2 },
    { from: 'B', to: 'F', weight: 2 },
    { from: 'G', to: 'F', weight: 5 },
  ],
};

export function generateDijkstraSteps(input: GraphData): Step<GraphData>[] {
  const steps: Step<GraphData>[] = [];

  const nodeIds = input.nodes.map((n) => n.id);
  const startNodeId = input.startNodeId || nodeIds[0];

  // Build undirected adjacency list with weights
  const adj: Record<string, { to: string; weight: number }[]> = {};
  nodeIds.forEach((id) => (adj[id] = []));
  input.edges.forEach((e) => {
    const w = e.weight ?? 1;
    adj[e.from]?.push({ to: e.to, weight: w });
    adj[e.to]?.push({ to: e.from, weight: w });
  });

  // Algorithm state
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  nodeIds.forEach((id) => (dist[id] = Infinity));
  dist[startNodeId] = 0;

  // Track frontier nodes (discovered but not visited) for PQ display
  const getFrontierPQ = (): string[] => {
    return nodeIds
      .filter((id) => !visited.has(id) && dist[id] < Infinity)
      .sort((a, b) => dist[a] - dist[b])
      .map((id) => `${id}:${dist[id]}`);
  };

  const formatDist = (d: number): string => (d >= Infinity ? '∞' : String(d));

  // Snapshot generator
  const pushStep = (
    highlightedLines: number[],
    description: string,
    activeNodeId?: string,
    activeEdge?: { from: string; to: string },
    relaxedNodeId?: string
  ) => {
    const nodeSnapshots: GraphNode[] = input.nodes.map((n) => {
      let status: ElementStatus;
      if (n.id === activeNodeId) {
        status = 'active';
      } else if (n.id === relaxedNodeId) {
        status = 'comparing';
      } else if (visited.has(n.id)) {
        status = 'visited';
      } else if (dist[n.id] < Infinity) {
        status = 'comparing'; // discovered / in PQ
      } else {
        status = 'unvisited';
      }
      return { ...n, label: n.id, status };
    });

    const edgeSnapshots: GraphEdge[] = input.edges.map((e) => {
      const isActive =
        activeEdge &&
        ((e.from === activeEdge.from && e.to === activeEdge.to) ||
          (e.from === activeEdge.to && e.to === activeEdge.from));

      // Edge is "visited" (faded green) if both endpoints are fully visited
      const bothVisited = visited.has(e.from) && visited.has(e.to);

      return {
        ...e,
        status: isActive ? ('active' as const) : bothVisited ? ('visited' as const) : ('default' as const),
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
      metadata: {
        pq: getFrontierPQ(),
        distances: { ...dist },
        visited: Array.from(visited),
        activeNodeId,
      },
    });
  };

  // ═══════════════════════════════════════════
  // Step 1: Initialization
  // ═══════════════════════════════════════════
  pushStep(
    [1, 2, 3, 4, 5, 6],
    `Initialize Dijkstra from source ${startNodeId}. Set dist[${startNodeId}] = 0, all others = ∞. Push (${startNodeId}, 0) into Priority Queue.`,
    startNodeId
  );

  // ═══════════════════════════════════════════
  // Main loop — extract min, relax neighbors
  // ═══════════════════════════════════════════
  while (visited.size < nodeIds.length) {
    // Find minimum-distance unvisited vertex
    let minDist = Infinity;
    let current: string | null = null;
    for (const id of nodeIds) {
      if (!visited.has(id) && dist[id] < minDist) {
        minDist = dist[id];
        current = id;
      }
    }

    if (current === null) break;

    // Step: Extract min vertex from PQ
    pushStep(
      [8, 9, 10],
      `Extract min from PQ → vertex ${current} with dist = ${dist[current]}. Now examine its neighbors.`,
      current
    );

    // Mark current as visited
    visited.add(current);

    // Step: Mark visited
    pushStep(
      [11],
      `Mark vertex ${current} as visited. It will not be considered again.`,
      current
    );

    // Relax each neighbor
    const neighbors = adj[current] || [];
    for (const { to: neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) {
        // Already visited — skip
        pushStep(
          [13],
          `Edge ${current}→${neighbor} (weight ${weight}): ${neighbor} already visited. Skip.`,
          current,
          { from: current, to: neighbor }
        );
        continue;
      }

      const newDist = dist[current] + weight;

      if (newDist < dist[neighbor]) {
        const oldDist = formatDist(dist[neighbor]);
        dist[neighbor] = newDist;

        // Relaxed! Distance updated
        pushStep(
          [14, 15, 16, 17],
          `Edge ${current}→${neighbor} (weight ${weight}): dist[${current}] + ${weight} = ${newDist} < ${oldDist}. ✓ Relaxed! Update dist[${neighbor}] = ${newDist}.`,
          current,
          { from: current, to: neighbor },
          neighbor
        );
      } else {
        // No improvement
        pushStep(
          [14, 15],
          `Edge ${current}→${neighbor} (weight ${weight}): dist[${current}] + ${weight} = ${newDist} ≥ ${dist[neighbor]}. No update needed.`,
          current,
          { from: current, to: neighbor }
        );
      }
    }

    // Step: Done with this vertex
    pushStep(
      [8],
      `Done processing vertex ${current}. All its neighbors have been examined.`,
      current
    );
  }

  // ═══════════════════════════════════════════
  // Final step — show all shortest distances
  // ═══════════════════════════════════════════
  const distSummary = nodeIds.map((id) => `${id}=${formatDist(dist[id])}`).join(', ');
  // Mark all nodes as completed for the final step
  const finalNodes = input.nodes.map((n) => ({
    ...n,
    label: n.id,
    status: 'completed' as ElementStatus,
  }));
  const finalEdges = input.edges.map((e) => ({
    ...e,
    status: 'visited' as ElementStatus,
  }));
  steps.push({
    state: { startNodeId, nodes: finalNodes, edges: finalEdges },
    highlightedLines: [21],
    description: `Dijkstra's algorithm complete! Shortest distances from ${startNodeId}: ${distSummary}.`,
    metadata: {
      pq: [],
      distances: { ...dist },
      visited: Array.from(visited),
    },
  });

  return steps;
}

export const dijkstraDefinition: AlgorithmDefinition<GraphData, GraphData> = {
  meta: {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'graph',
    timeComplexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    spaceComplexity: 'O(V)',
    description:
      'Dijkstra\'s algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights, using a Priority Queue and edge relaxation.',
    code: DIJKSTRA_CODE_SNIPPETS,
    defaultInput: DEFAULT_DIJKSTRA_GRAPH,
    implemented: true,
  },
  generateSteps: generateDijkstraSteps,
};
