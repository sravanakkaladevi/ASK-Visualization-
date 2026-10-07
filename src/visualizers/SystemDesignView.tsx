import React from 'react';
import { motion } from 'framer-motion';
import { SystemDesignState, SystemNode as SystemNodeType } from '../types/algorithm';
import { Globe, Server, Database, HardDrive, Layers, Wifi, MonitorSmartphone, Cpu } from 'lucide-react';

interface SystemDesignViewProps {
  data: SystemDesignState;
}

const nodeTypeConfig: Record<SystemNodeType['type'], { icon: React.FC<{ className?: string }>; color: string; bgGlow: string }> = {
  client: { icon: MonitorSmartphone, color: 'text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-500/40', bgGlow: 'bg-sky-50 dark:bg-sky-950/80' },
  'load-balancer': { icon: Layers, color: 'text-violet-700 dark:text-violet-400 border-violet-300 dark:border-violet-500/40', bgGlow: 'bg-violet-50 dark:bg-violet-950/80' },
  server: { icon: Server, color: 'text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40', bgGlow: 'bg-emerald-50 dark:bg-emerald-950/80' },
  database: { icon: Database, color: 'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/40', bgGlow: 'bg-amber-50 dark:bg-amber-950/80' },
  cache: { icon: HardDrive, color: 'text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/40', bgGlow: 'bg-rose-50 dark:bg-rose-950/80' },
  queue: { icon: Wifi, color: 'text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/40', bgGlow: 'bg-cyan-50 dark:bg-cyan-950/80' },
  cdn: { icon: Globe, color: 'text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/40', bgGlow: 'bg-orange-50 dark:bg-orange-950/80' },
  microservice: { icon: Cpu, color: 'text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40', bgGlow: 'bg-indigo-50 dark:bg-indigo-950/80' },
};

// Layout positions by node type
const nodePositions: Record<string, { x: number; y: number }> = {
  'client-1': { x: 60, y: 40 },
  'client-2': { x: 60, y: 140 },
  'client-3': { x: 60, y: 240 },
  lb: { x: 260, y: 140 },
  'server-a': { x: 460, y: 40 },
  'server-b': { x: 460, y: 140 },
  'server-c': { x: 460, y: 240 },
  db: { x: 620, y: 140 },
};

export const SystemDesignView: React.FC<SystemDesignViewProps> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No system design data</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full h-[320px] bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-4 transition-colors duration-300">
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
            </marker>
          </defs>

          {data.edges.map((edge, idx) => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            if (!fromPos || !toPos) return null;

            const isActive = edge.status === 'active';

            return (
              <line
                key={`edge-${edge.from}-${edge.to}-${idx}`}
                x1={fromPos.x + 40}
                y1={fromPos.y + 20}
                x2={toPos.x}
                y2={toPos.y + 20}
                stroke={isActive ? '#2563eb' : '#94a3b8'}
                strokeWidth={isActive ? 3 : 1.5}
                strokeDasharray={isActive ? '8,4' : undefined}
                markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* System Nodes */}
        {data.nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;

          const config = nodeTypeConfig[node.type] || nodeTypeConfig.server;
          const Icon = config.icon;
          const isActive = node.status === 'active';

          return (
            <motion.div
              key={node.id}
              layout
              style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px` }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-mono text-xs shadow-md transition-all duration-300
                ${config.bgGlow} ${config.color}
                ${isActive ? 'ring-4 ring-blue-400/50 shadow-xl shadow-blue-500/30 scale-110 !border-blue-500' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap font-bold">{node.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
