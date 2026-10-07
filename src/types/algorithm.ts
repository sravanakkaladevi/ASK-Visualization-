export type Category = 
  | 'computer-fundamentals'
  | 'programming-fundamentals'
  | 'sorting' 
  | 'searching' 
  | 'graph' 
  | 'tree' 
  | 'linked-list' 
  | 'stack-queue' 
  | 'hashing'
  | 'recursion-backtracking'
  | 'dynamic-programming'
  | 'greedy'
  | 'heap'
  | 'computer-networks' 
  | 'os'
  | 'dbms'
  | 'software-engineering' 
  | 'system-design' 
  | 'web-dev'
  | 'full-stack'
  | 'devops'
  | 'cloud-deployment';

export type ElementStatus = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'active' | 'visited' | 'unvisited' | 'path' | 'inserted' | 'deleted' | 'highlighted' | 'completed' | 'in-progress' | 'pending' | 'idle';

export type Language = 'python' | 'java' | 'cpp' | 'javascript';

export interface CodeSnippets {
  python: string;
  java?: string;
  cpp?: string;
  javascript?: string;
  typescript?: string;
}

export interface Step<T> {
  state: T;
  highlightedLines: number[];
  description: string;
  metadata?: Record<string, unknown>;
}

export interface ArrayElement {
  id: string;
  value: number;
  status: ElementStatus;
}

export type ArrayState = ArrayElement[];

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: ElementStatus;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  label?: string;
  status?: ElementStatus;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNodeId: string;
}

// Linked List types
export interface LinkedListNode {
  id: string;
  value: number;
  status: ElementStatus;
}

export interface LinkedListState {
  nodes: LinkedListNode[];
  headIndex: number;
  pointerLabel?: string;
  pointerIndex?: number;
}

// Stack & Queue types
export interface StackQueueItem {
  id: string;
  value: number;
  status: ElementStatus;
}

export interface StackQueueState {
  items: StackQueueItem[];
  type: 'stack' | 'queue' | 'deque';
  operationLabel?: string;
  frontAction?: string;
  backAction?: string;
}

// Tree types
export interface TreeNode {
  id: string;
  value: number;
  left?: string;
  right?: string;
  status: ElementStatus;
  x: number;
  y: number;
}

export interface TreeState {
  nodes: TreeNode[];
  rootId: string;
  visitOrder: string[];
}

// System Design types
export interface SystemNode {
  id: string;
  label: string;
  type: 'client' | 'load-balancer' | 'server' | 'database' | 'cache' | 'queue' | 'cdn' | 'microservice';
  status: ElementStatus;
}

export interface SystemEdge {
  from: string;
  to: string;
  label?: string;
  status: ElementStatus;
  animated?: boolean;
}

export interface SystemDesignState {
  nodes: SystemNode[];
  edges: SystemEdge[];
  activeFlow?: string[];
  activeNodeId?: string;
  logMessage?: string;
  metrics?: {
    rps: number;
    avgLatencyMs: number;
    cpuUtilizationPct: number;
  };
}

// Computer Networks types
export interface NetworkDevice {
  id: string;
  label: string;
  type: 'client' | 'server' | 'dns-resolver' | 'root-dns' | 'tld-dns' | 'auth-dns' | 'router';
  ip?: string;
  status: ElementStatus;
}

export interface NetworkPacket {
  id: string;
  from: string;
  to: string;
  type: string;
  payload?: string;
  progress: number;
  status: ElementStatus;
}

export interface NetworkState {
  devices: NetworkDevice[];
  packets: NetworkPacket[];
  logMessage?: string;
  protocol: 'TCP' | 'DNS' | 'HTTP' | 'IP';
}

// SDLC / Software Engineering types
export interface SdlcStage {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  iconName?: string;
  details?: string;
  artifacts?: string[];
  deliverable?: string;
}

export interface SdlcState {
  modelName: 'Agile/Scrum' | 'Waterfall' | 'CI/CD Pipeline';
  stages: SdlcStage[];
  currentStageId: string;
  activeArtifact?: string;
  sprintNumber?: number;
}

// OSI Model Types
export interface OsiLayer {
  number: number;
  name: string;
  pdu: string; // Packet Data Unit e.g. Data, Segment, Packet, Frame, Bits
  protocols: string[];
  purpose: string;
  status: ElementStatus;
  payloadHeader?: string;
}

export interface OsiState {
  direction: 'down-client' | 'across-wire' | 'up-server';
  activeLayerNumber: number;
  layers: OsiLayer[];
  packetData: string;
  logMessage: string;
}

// Full Stack / MERN Types
export interface MernComponent {
  id: string;
  name: string;
  type: 'react' | 'express' | 'node' | 'mongodb' | 'jwt' | 'browser';
  status: ElementStatus;
  subText?: string;
}

export interface MernState {
  components: MernComponent[];
  activeStepIndex: number;
  requestPayload?: string;
  responsePayload?: string;
  logMessage: string;
}

// Linux, Git & DevOps Deployment Types
export interface DevopsStageNode {
  id: string;
  label: string;
  type: 'vscode' | 'git' | 'github' | 'ci' | 'build' | 'test' | 'docker' | 'registry' | 'server' | 'nginx' | 'production' | 'user';
  status: ElementStatus;
  subText?: string;
}

export interface LinuxGitDevOpsState {
  mode: 'linux-terminal' | 'git-workflow' | 'product-deployment';
  command?: string;
  output?: string;
  stages?: DevopsStageNode[];
  activeStageId?: string;
  gitBranch?: string;
  stagingFiles?: string[];
  committedFiles?: string[];
  logMessage: string;
}

// Computer Fundamentals Types
export interface CompFundStage {
  id: string;
  name: string;
  type: 'source' | 'lexer' | 'compiler' | 'bytecode' | 'cpu' | 'ram';
  status: ElementStatus;
  codeSnippet?: string;
  registerState?: string;
}

export interface CompFundState {
  stages: CompFundStage[];
  currentStageId: string;
  logMessage: string;
}

// SDLC Types
export interface SdlcPhase {
  id: string;
  name: string;
  deliverable: string;
  activities: string[];
  status: ElementStatus;
  example: string;
}

export interface SdlcState {
  model: 'waterfall' | 'agile' | 'spiral';
  phases: SdlcPhase[];
  activePhaseId: string;
  logMessage: string;
}

export interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: Category;
  timeComplexity: TimeComplexity;
  spaceComplexity: string;
  description: string;
  code: CodeSnippets;
  defaultInput: unknown;
  implemented: boolean;
  tags?: string[];
  conceptType?: 'code' | 'architecture' | 'terminal' | 'process' | 'osi' | 'sdlc';
}

export interface AlgorithmDefinition<Input = unknown, State = unknown> {
  meta: AlgorithmMeta;
  generateSteps: (input: Input) => Step<State>[];
}
