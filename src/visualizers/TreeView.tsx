import React from 'react';
import { motion } from 'framer-motion';
import { TreeState } from '../types/algorithm';

interface TreeViewProps {
  data: TreeState;
}

const nodeStyles: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
  default: { bg: 'bg-slate-800 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-600', text: 'text-slate-900 dark:text-slate-200', shadow: '' },
  active: {
    bg: 'bg-blue-600',
    border: 'border-blue-400',
    text: 'text-white font-extrabold',
    shadow: 'shadow-xl shadow-blue-500/50 ring-4 ring-blue-400/40 scale-110',
  },
  visited: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-400',
    text: 'text-white font-bold',
    shadow: 'shadow-md shadow-emerald-500/30',
  },
  comparing: {
    bg: 'bg-amber-500',
    border: 'border-amber-300',
    text: 'text-slate-950 font-bold',
    shadow: 'shadow-md shadow-amber-500/30',
  },
};

export const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No tree data</div>;
  }

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full h-[320px] bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {data.nodes.map((node) => {
            const children = [node.left, node.right].filter(Boolean);
            return children.map((childId) => {
              const child = nodeMap.get(childId!);
              if (!child) return null;

              const parentVisited = data.visitOrder.includes(node.id);
              const childVisited = data.visitOrder.includes(child.id);
              const bothVisited = parentVisited && childVisited;

              return (
                <line
                  key={`${node.id}-${child.id}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke={bothVisited ? '#10b981' : node.status === 'active' || child.status === 'active' ? '#2563eb' : '#94a3b8'}
                  strokeWidth={bothVisited ? 2.5 : 1.5}
                  className="transition-all duration-300"
                />
              );
            });
          })}
        </svg>

        {/* Tree Nodes */}
        {data.nodes.map((node) => {
          const style = nodeStyles[node.status] || nodeStyles.default;
          return (
            <motion.div
              key={node.id}
              layout
              style={{ position: 'absolute', left: `${node.x - 22}px`, top: `${node.y - 22}px` }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono text-sm transition-all duration-300
                ${style.bg} ${style.border} ${style.text} ${style.shadow}`}
            >
              {node.value}
            </motion.div>
          );
        })}
      </div>

      {/* Visit Order */}
      {data.visitOrder.length > 0 && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto">
          <span className="text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider shrink-0">Visit Order:</span>
          <div className="flex items-center gap-1.5">
            {data.visitOrder.map((id, idx) => {
              const node = nodeMap.get(id);
              return (
                <React.Fragment key={`${id}-${idx}`}>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                    {node?.value}
                  </span>
                  {idx < data.visitOrder.length - 1 && (
                    <span className="text-slate-400 font-bold">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
