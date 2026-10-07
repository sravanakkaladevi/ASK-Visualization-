import React from 'react';
import { motion } from 'framer-motion';
import { ElementStatus, GraphData } from '../types/algorithm';

interface GraphViewProps {
  data: GraphData;
  metadata?: Record<string, unknown>;
}

const nodeStatusStyles: Record<ElementStatus, { bg: string; border: string; text: string; shadow: string }> = {
  completed: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-300',
    text: 'text-white font-bold',
    shadow: 'shadow-lg shadow-emerald-500/40',
  },
  'in-progress': {
    bg: 'bg-blue-600',
    border: 'border-blue-300',
    text: 'text-white font-bold',
    shadow: 'shadow-lg shadow-blue-500/40',
  },
  pending: {
    bg: 'bg-slate-800 dark:bg-slate-900',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-300',
    shadow: '',
  },
  idle: {
    bg: 'bg-slate-800 dark:bg-slate-900',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-300',
    shadow: '',
  },
  unvisited: {
    bg: 'bg-slate-800 dark:bg-slate-900',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-300',
    shadow: '',
  },
  comparing: {
    bg: 'bg-amber-500 dark:bg-amber-950/80',
    border: 'border-amber-400',
    text: 'text-white dark:text-amber-300 font-bold',
    shadow: 'shadow-lg shadow-amber-500/40',
  },
  active: {
    bg: 'bg-blue-600',
    border: 'border-blue-300',
    text: 'text-white font-extrabold',
    shadow: 'shadow-xl shadow-blue-500/60 ring-4 ring-blue-400/50 scale-110',
  },
  visited: {
    bg: 'bg-emerald-600/90',
    border: 'border-emerald-400',
    text: 'text-white font-bold',
    shadow: 'shadow-md shadow-emerald-500/30',
  },
  default: {
    bg: 'bg-slate-800 dark:bg-slate-900',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-300',
    shadow: '',
  },
  swapping: {
    bg: 'bg-rose-600',
    border: 'border-rose-400',
    text: 'text-white',
    shadow: '',
  },
  sorted: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-400',
    text: 'text-white',
    shadow: '',
  },
  pivot: {
    bg: 'bg-cyan-600',
    border: 'border-cyan-400',
    text: 'text-white',
    shadow: '',
  },
  path: {
    bg: 'bg-purple-600',
    border: 'border-purple-400',
    text: 'text-white',
    shadow: '',
  },
  inserted: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-400',
    text: 'text-white',
    shadow: '',
  },
  deleted: {
    bg: 'bg-rose-900/50',
    border: 'border-rose-500/50',
    text: 'text-rose-300',
    shadow: '',
  },
  highlighted: {
    bg: 'bg-amber-600',
    border: 'border-amber-400',
    text: 'text-white',
    shadow: 'shadow-lg shadow-amber-500/40',
  },
};

export const GraphView: React.FC<GraphViewProps> = ({ data, metadata }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <div className="p-8 text-center text-slate-500">No graph data provided</div>;
  }

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));
  const queue = (metadata?.queue as string[]) || [];
  const stack = (metadata?.stack as string[]) || [];
  const pq = (metadata?.pq as string[]) || [];
  const distances = metadata?.distances as Record<string, number> | undefined;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* SVG Canvas for Graph rendering */}
      <div className="relative w-full h-[320px] bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 backdrop-blur-inner overflow-hidden flex items-center justify-center transition-colors duration-300">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Edge lines */}
          {data.edges.map((edge, idx) => {
            const source = nodeMap.get(edge.from);
            const target = nodeMap.get(edge.to);
            if (!source || !target) return null;

            const isActive = edge.status === 'active';
            const isVisited = edge.status === 'visited';
            const isPath = edge.status === 'path';

            return (
              <line
                key={`edge-${edge.from}-${edge.to}-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={isActive ? '#2563eb' : isPath ? '#a855f7' : isVisited ? '#10b981' : '#94a3b8'}
                strokeWidth={isActive ? 3.5 : isVisited || isPath ? 2.5 : 1.5}
                strokeDasharray={isActive ? '6,6' : undefined}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Edge weight labels (for weighted graphs) */}
          {data.edges.map((edge, idx) => {
            if (edge.weight === undefined) return null;
            const source = nodeMap.get(edge.from);
            const target = nodeMap.get(edge.to);
            if (!source || !target) return null;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            // Perpendicular offset so label doesn't overlap the edge line
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const offsetX = (-dy / len) * 14;
            const offsetY = (dx / len) * 14;

            const isActive = edge.status === 'active';

            return (
              <g key={`weight-${edge.from}-${edge.to}-${idx}`}>
                {/* Background pill for readability */}
                <rect
                  x={midX + offsetX - 10}
                  y={midY + offsetY - 9}
                  width={20}
                  height={18}
                  rx={5}
                  fill={isActive ? '#2563eb' : 'rgba(30,41,59,0.7)'}
                  className="transition-all duration-300"
                />
                <text
                  x={midX + offsetX}
                  y={midY + offsetY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fontFamily="monospace"
                  fill={isActive ? '#ffffff' : '#f1c40f'}
                  className="transition-all duration-300"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Nodes layer */}
        {data.nodes.map((node) => {
          const style = nodeStatusStyles[node.status] || nodeStatusStyles.unvisited;
          return (
            <motion.div
              key={node.id}
              layout
              style={{ position: 'absolute', left: `${node.x - 24}px`, top: `${node.y - 24}px` }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm shadow-md transition-all duration-300 ${style.bg} ${style.border} ${style.text} ${style.shadow}`}
            >
              {node.label}
            </motion.div>
          );
        })}

        {/* Distance badges below nodes (only for Dijkstra / weighted algorithms) */}
        {distances &&
          data.nodes.map((node) => {
            const dist = distances[node.id];
            if (dist === undefined) return null;
            const displayDist = dist >= 1e9 || dist === Infinity ? '∞' : String(dist);
            return (
              <div
                key={`dist-badge-${node.id}`}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y + 28}px`,
                  transform: 'translateX(-50%)',
                }}
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-100/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300/60 dark:border-blue-700/50 whitespace-nowrap shadow-sm transition-all duration-300"
              >
                d={displayDist}
              </div>
            );
          })}
      </div>

      {/* Queue / Stack / Priority Queue state visualization */}
      {(queue.length > 0 || stack.length > 0 || pq.length > 0) && (
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
            {pq.length > 0
              ? 'Priority Queue (Min):'
              : queue.length > 0
                ? 'Queue (FIFO):'
                : 'Stack (LIFO):'}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(pq.length > 0 ? pq : queue.length > 0 ? queue : stack).map((item, idx) => (
              <span
                key={`${item}-${idx}`}
                className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 px-2 py-0.5 rounded font-bold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
