import { AlgorithmDefinition, SystemDesignState, SystemNode, SystemEdge, CodeSnippets, Step } from '../types/algorithm';

export const LB_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// Round-Robin Load Balancer
class LoadBalancer {
  private servers: string[];
  private currentIndex = 0;

  constructor(servers: string[]) {
    this.servers = servers;
  }

  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }
}

// Usage
const lb = new LoadBalancer(['Server-A', 'Server-B', 'Server-C']);
lb.getNextServer(); // Server-A
lb.getNextServer(); // Server-B
lb.getNextServer(); // Server-C
lb.getNextServer(); // Server-A (wraps around)`,
  python: `# Round-Robin Load Balancer
class LoadBalancer:
    def __init__(self, servers: list[str]):
        self.servers = servers
        self.current_index = 0

    def get_next_server(self) -> str:
        server = self.servers[self.current_index]
        self.current_index = (self.current_index + 1) % len(self.servers)
        return server

# Usage
lb = LoadBalancer(["Server-A", "Server-B", "Server-C"])
lb.get_next_server()  # Server-A
lb.get_next_server()  # Server-B
lb.get_next_server()  # Server-C
lb.get_next_server()  # Server-A (wraps around)`,
  java: `// Round-Robin Load Balancer
public class LoadBalancer {
    private final List<String> servers;
    private int currentIndex = 0;

    public LoadBalancer(List<String> servers) {
        this.servers = servers;
    }

    public synchronized String getNextServer() {
        String server = servers.get(currentIndex);
        currentIndex = (currentIndex + 1) % servers.size();
        return server;
    }
}

// Usage
LoadBalancer lb = new LoadBalancer(List.of("Server-A", "Server-B", "Server-C"));
lb.getNextServer(); // Server-A
lb.getNextServer(); // Server-B`,
  cpp: `// Round-Robin Load Balancer
class LoadBalancer {
    std::vector<std::string> servers;
    int currentIndex = 0;
public:
    LoadBalancer(std::vector<std::string> s) : servers(std::move(s)) {}

    std::string getNextServer() {
        std::string server = servers[currentIndex];
        currentIndex = (currentIndex + 1) % servers.size();
        return server;
    }
};

// Usage
LoadBalancer lb({"Server-A", "Server-B", "Server-C"});
lb.getNextServer(); // Server-A
lb.getNextServer(); // Server-B`,
};

function makeNodes(): SystemNode[] {
  return [
    { id: 'client-1', label: 'Client 1', type: 'client', status: 'default' },
    { id: 'client-2', label: 'Client 2', type: 'client', status: 'default' },
    { id: 'client-3', label: 'Client 3', type: 'client', status: 'default' },
    { id: 'lb', label: 'Load Balancer', type: 'load-balancer', status: 'default' },
    { id: 'server-a', label: 'Server A', type: 'server', status: 'default' },
    { id: 'server-b', label: 'Server B', type: 'server', status: 'default' },
    { id: 'server-c', label: 'Server C', type: 'server', status: 'default' },
    { id: 'db', label: 'Database', type: 'database', status: 'default' },
  ];
}

function makeEdges(): SystemEdge[] {
  return [
    { from: 'client-1', to: 'lb', status: 'default' },
    { from: 'client-2', to: 'lb', status: 'default' },
    { from: 'client-3', to: 'lb', status: 'default' },
    { from: 'lb', to: 'server-a', status: 'default' },
    { from: 'lb', to: 'server-b', status: 'default' },
    { from: 'lb', to: 'server-c', status: 'default' },
    { from: 'server-a', to: 'db', status: 'default' },
    { from: 'server-b', to: 'db', status: 'default' },
    { from: 'server-c', to: 'db', status: 'default' },
  ];
}

export interface LoadBalancerInput {
  requestCount: number;
}

export const DEFAULT_LB_INPUT: LoadBalancerInput = { requestCount: 6 };

export function generateLoadBalancerSteps(input: LoadBalancerInput): Step<SystemDesignState>[] {
  const steps: Step<SystemDesignState>[] = [];
  const servers = ['server-a', 'server-b', 'server-c'];
  const clients = ['client-1', 'client-2', 'client-3'];

  const pushStep = (
    highlightedLines: number[],
    description: string,
    activeClient?: string,
    activeLB?: boolean,
    activeServer?: string,
    activeDB?: boolean,
  ) => {
    const nodes: SystemNode[] = makeNodes().map((n) => {
      let status = n.status;
      if (n.id === activeClient) status = 'active';
      else if (n.id === 'lb' && activeLB) status = 'active';
      else if (n.id === activeServer) status = 'active';
      else if (n.id === 'db' && activeDB) status = 'active';
      return { ...n, status };
    });

    const edges: SystemEdge[] = makeEdges().map((e) => {
      let status: SystemEdge['status'] = 'default';
      const animated = false;
      if (activeClient && e.from === activeClient && e.to === 'lb') {
        status = 'active';
      }
      if (activeLB && activeServer && e.from === 'lb' && e.to === activeServer) {
        status = 'active';
      }
      if (activeServer && activeDB && e.from === activeServer && e.to === 'db') {
        status = 'active';
      }
      return { ...e, status, animated };
    });

    steps.push({
      state: { nodes, edges, activeFlow: [activeClient, activeServer].filter(Boolean) as string[] },
      highlightedLines,
      description,
    });
  };

  pushStep([1, 2, 3], 'System initialized with 3 clients, a round-robin load balancer, 3 servers, and a database.');

  let serverIdx = 0;
  for (let req = 0; req < input.requestCount; req++) {
    const clientId = clients[req % clients.length];
    const serverId = servers[serverIdx];
    const serverLabel = serverId.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // Client sends request
    pushStep(
      [8, 9],
      `Request ${req + 1}: ${clientId.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} sends a request to the Load Balancer.`,
      clientId,
    );

    // LB receives and routes
    pushStep(
      [10, 11, 12],
      `Load Balancer routes request ${req + 1} to ${serverLabel} using Round-Robin (index ${serverIdx}).`,
      clientId,
      true,
      serverId,
    );

    // Server processes and queries DB
    pushStep(
      [13],
      `${serverLabel} processes the request and queries the Database.`,
      undefined,
      false,
      serverId,
      true,
    );

    // Move round-robin index
    serverIdx = (serverIdx + 1) % servers.length;
  }

  pushStep(
    [18, 19],
    `All ${input.requestCount} requests processed. Round-Robin ensured even distribution across all servers.`,
  );

  return steps;
}

export const loadBalancerDefinition: AlgorithmDefinition<LoadBalancerInput, SystemDesignState> = {
  meta: {
    id: 'load-balancer',
    name: 'Round-Robin Load Balancer',
    category: 'system-design',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(n)',
    description:
      'A Round-Robin Load Balancer distributes incoming client requests evenly across a pool of backend servers by cycling through them in order.',
    code: LB_CODE_SNIPPETS,
    defaultInput: DEFAULT_LB_INPUT,
    implemented: true,
  },
  generateSteps: generateLoadBalancerSteps,
};
