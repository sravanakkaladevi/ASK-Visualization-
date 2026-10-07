import { AlgorithmDefinition } from '../types/algorithm';
import { bubbleSortDefinition } from './bubbleSort';
import { selectionSortDefinition } from './selectionSort';
import { insertionSortDefinition } from './insertionSort';
import { mergeSortDefinition } from './mergeSort';
import { quickSortDefinition } from './quickSort';
import { binarySearchDefinition } from './binarySearch';
import { linearSearchDefinition } from './linearSearch';
import { bfsDefinition } from './bfs';
import { dfsDefinition } from './dfs';
import { dijkstraDefinition } from './dijkstra';
import { linkedListReversalDefinition } from './linkedListReversal';
import { stackOpsDefinition } from './stackOps';
import { queueOpsDefinition } from './queueOps';
import { dequeDefinition } from './dequeOps';
import { bstInorderDefinition } from './bstInorder';
import { nQueensDefinition } from './nQueens';
import { towerOfHanoiDefinition } from './towerOfHanoi';
import { knapsackDefinition } from './knapsack';
import { lldRideBookingDefinition } from './lldRideBooking';
import { loadBalancerDefinition } from './loadBalancer';
import { cacheAsideDefinition } from './cacheAside';
import { tcpHandshakeDefinition } from './tcpHandshake';
import { dnsLookupDefinition } from './dnsLookup';
import { osiModelDefinition } from './osiModel';
import { socketFtpDefinition } from './socketFtp';
import { agileSprintDefinition } from './agileSprint';
import { cicdPipelineDefinition } from './cicdPipeline';
import { waterfallModelDefinition } from './waterfallModel';
import { gitWorkflowDefinition } from './gitWorkflow';
import { compilationFlowDefinition } from './compilationFlow';
import { mernStackDefinition } from './mernStack';
import { productDeploymentDefinition } from './productDeployment';
import { linuxTerminalDefinition } from './linuxTerminal';

export const CORE_ALGORITHMS_REGISTRY: Record<string, AlgorithmDefinition<any, any>> = {
  // DSA - Sorting
  'bubble-sort': bubbleSortDefinition as AlgorithmDefinition<any, any>,
  'selection-sort': selectionSortDefinition as AlgorithmDefinition<any, any>,
  'insertion-sort': insertionSortDefinition as AlgorithmDefinition<any, any>,
  'merge-sort': mergeSortDefinition as AlgorithmDefinition<any, any>,
  'quick-sort': quickSortDefinition as AlgorithmDefinition<any, any>,

  // DSA - Searching
  'binary-search': binarySearchDefinition as AlgorithmDefinition<any, any>,
  'linear-search': linearSearchDefinition as AlgorithmDefinition<any, any>,

  // DSA - Data Structures
  'stack-operations': stackOpsDefinition as AlgorithmDefinition<any, any>,
  'queue-operations': queueOpsDefinition as AlgorithmDefinition<any, any>,
  deque: dequeDefinition as AlgorithmDefinition<any, any>,
  'linked-list-reversal': linkedListReversalDefinition as AlgorithmDefinition<any, any>,
  'bst-inorder': bstInorderDefinition as AlgorithmDefinition<any, any>,

  // DSA - Graphs
  bfs: bfsDefinition as AlgorithmDefinition<any, any>,
  dfs: dfsDefinition as AlgorithmDefinition<any, any>,
  dijkstra: dijkstraDefinition as AlgorithmDefinition<any, any>,

  // DSA - DP & Backtracking
  'tower-of-hanoi': towerOfHanoiDefinition as AlgorithmDefinition<any, any>,
  'n-queens': nQueensDefinition as AlgorithmDefinition<any, any>,
  knapsack: knapsackDefinition as AlgorithmDefinition<any, any>,

  // Computer Networks
  'tcp-handshake': tcpHandshakeDefinition as AlgorithmDefinition<any, any>,
  'dns-lookup': dnsLookupDefinition as AlgorithmDefinition<any, any>,
  'osi-model': osiModelDefinition as AlgorithmDefinition<any, any>,
  'socket-ftp-transfer': socketFtpDefinition as AlgorithmDefinition<any, any>,

  // Software Engineering
  'agile-sprint': agileSprintDefinition as AlgorithmDefinition<any, any>,
  'cicd-pipeline': cicdPipelineDefinition as AlgorithmDefinition<any, any>,
  'waterfall-model': waterfallModelDefinition as AlgorithmDefinition<any, any>,
  'git-workflow': gitWorkflowDefinition as AlgorithmDefinition<any, any>,
  'compilation-flow': compilationFlowDefinition as AlgorithmDefinition<any, any>,
  'lld-ride-booking': lldRideBookingDefinition as AlgorithmDefinition<any, any>,
  'class-object-oop': lldRideBookingDefinition as AlgorithmDefinition<any, any>,

  // System Design
  'load-balancer': loadBalancerDefinition as AlgorithmDefinition<any, any>,
  'cache-aside': cacheAsideDefinition as AlgorithmDefinition<any, any>,
  'mern-stack': mernStackDefinition as AlgorithmDefinition<any, any>,
  'product-deployment': productDeploymentDefinition as AlgorithmDefinition<any, any>,
  'linux-terminal': linuxTerminalDefinition as AlgorithmDefinition<any, any>,
};

export const ALGORITHM_REGISTRY: Record<string, AlgorithmDefinition<any, any>> = {
  ...CORE_ALGORITHMS_REGISTRY,
};

export function getAlgorithmById(id: string): AlgorithmDefinition<any, any> | undefined {
  return ALGORITHM_REGISTRY[id];
}

export function getAllAlgorithms(): AlgorithmDefinition<any, any>[] {
  return Object.values(ALGORITHM_REGISTRY);
}

export function getImplementedAlgorithms(): AlgorithmDefinition<any, any>[] {
  return Object.values(ALGORITHM_REGISTRY);
}
