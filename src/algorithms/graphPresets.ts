import { GraphData } from '../types/algorithm';

export interface GraphPreset {
  id: string;
  name: string;
  description: string;
  data: GraphData;
}

export const GRAPH_PRESETS: GraphPreset[] = [
  {
    id: 'preset-dijkstra-7',
    name: 'W3Schools 7-Node Network (A-G)',
    description: 'Weighted 7-node network ideal for shortest path analysis and edge relaxation.',
    data: {
      startNodeId: 'D',
      nodes: [
        { id: 'A', label: 'A', x: 230, y: 40, status: 'unvisited' },
        { id: 'B', label: 'B', x: 90, y: 150, status: 'unvisited' },
        { id: 'C', label: 'C', x: 370, y: 150, status: 'unvisited' },
        { id: 'D', label: 'D', x: 70, y: 280, status: 'unvisited' },
        { id: 'E', label: 'E', x: 230, y: 220, status: 'unvisited' },
        { id: 'F', label: 'F', x: 390, y: 280, status: 'unvisited' },
        { id: 'G', label: 'G', x: 230, y: 340, status: 'unvisited' },
      ],
      edges: [
        { from: 'A', to: 'B', weight: 4, label: '4' },
        { from: 'A', to: 'C', weight: 3, label: '3' },
        { from: 'A', to: 'E', weight: 7, label: '7' },
        { from: 'B', to: 'D', weight: 5, label: '5' },
        { from: 'C', to: 'D', weight: 11, label: '11' },
        { from: 'C', to: 'E', weight: 8, label: '8' },
        { from: 'D', to: 'E', weight: 2, label: '2' },
        { from: 'D', to: 'F', weight: 2, label: '2' },
        { from: 'D', to: 'G', weight: 10, label: '10' },
        { from: 'E', to: 'G', weight: 5, label: '5' },
        { from: 'F', to: 'G', weight: 3, label: '3' },
      ],
    },
  },
  {
    id: 'preset-tree-7',
    name: 'Binary Tree Hierarchy (7 Nodes)',
    description: 'Hierarchical tree starting from root A branching into left and right subtrees.',
    data: {
      startNodeId: 'A',
      nodes: [
        { id: 'A', label: 'A', x: 230, y: 50, status: 'unvisited' },
        { id: 'B', label: 'B', x: 120, y: 150, status: 'unvisited' },
        { id: 'C', label: 'C', x: 340, y: 150, status: 'unvisited' },
        { id: 'D', label: 'D', x: 60, y: 270, status: 'unvisited' },
        { id: 'E', label: 'E', x: 170, y: 270, status: 'unvisited' },
        { id: 'F', label: 'F', x: 290, y: 270, status: 'unvisited' },
        { id: 'G', label: 'G', x: 400, y: 270, status: 'unvisited' },
      ],
      edges: [
        { from: 'A', to: 'B', weight: 2, label: '2' },
        { from: 'A', to: 'C', weight: 4, label: '4' },
        { from: 'B', to: 'D', weight: 1, label: '1' },
        { from: 'B', to: 'E', weight: 7, label: '7' },
        { from: 'C', to: 'F', weight: 3, label: '3' },
        { from: 'C', to: 'G', weight: 6, label: '6' },
      ],
    },
  },
  {
    id: 'preset-cycle-6',
    name: 'Cyclic Graph with Cross Edges (6 Nodes)',
    description: 'Ring topology with cross connections demonstrating loop detection and backtracking.',
    data: {
      startNodeId: 'A',
      nodes: [
        { id: 'A', label: 'A', x: 130, y: 70, status: 'unvisited' },
        { id: 'B', label: 'B', x: 330, y: 70, status: 'unvisited' },
        { id: 'C', label: 'C', x: 410, y: 200, status: 'unvisited' },
        { id: 'D', label: 'D', x: 330, y: 320, status: 'unvisited' },
        { id: 'E', label: 'E', x: 130, y: 320, status: 'unvisited' },
        { id: 'F', label: 'F', x: 50, y: 200, status: 'unvisited' },
      ],
      edges: [
        { from: 'A', to: 'B', weight: 3, label: '3' },
        { from: 'B', to: 'C', weight: 4, label: '4' },
        { from: 'C', to: 'D', weight: 2, label: '2' },
        { from: 'D', to: 'E', weight: 5, label: '5' },
        { from: 'E', to: 'F', weight: 1, label: '1' },
        { from: 'F', to: 'A', weight: 6, label: '6' },
        { from: 'A', to: 'D', weight: 8, label: '8' },
        { from: 'B', to: 'E', weight: 7, label: '7' },
      ],
    },
  },
  {
    id: 'preset-star-5',
    name: 'Star / Hub-and-Spoke Topology (5 Nodes)',
    description: 'Central hub node connected to multiple peripheral nodes.',
    data: {
      startNodeId: 'A',
      nodes: [
        { id: 'A', label: 'A (Hub)', x: 230, y: 190, status: 'unvisited' },
        { id: 'B', label: 'B', x: 230, y: 60, status: 'unvisited' },
        { id: 'C', label: 'C', x: 390, y: 190, status: 'unvisited' },
        { id: 'D', label: 'D', x: 230, y: 320, status: 'unvisited' },
        { id: 'E', label: 'E', x: 70, y: 190, status: 'unvisited' },
      ],
      edges: [
        { from: 'A', to: 'B', weight: 5, label: '5' },
        { from: 'A', to: 'C', weight: 8, label: '8' },
        { from: 'A', to: 'D', weight: 2, label: '2' },
        { from: 'A', to: 'E', weight: 4, label: '4' },
        { from: 'B', to: 'C', weight: 6, label: '6' },
        { from: 'D', to: 'E', weight: 3, label: '3' },
      ],
    },
  },
];
