import React from 'react';
import { motion } from 'framer-motion';
import { LinkedListState } from '../types/algorithm';
import { ArrowRight } from 'lucide-react';

interface LinkedListViewProps {
  data: LinkedListState;
  headPointerName?: string;
}

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: 'bg-slate-800 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-600', text: 'text-slate-900 dark:text-slate-200' },
  active: { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-white font-bold' },
  swapping: { bg: 'bg-rose-600', border: 'border-rose-400', text: 'text-white font-bold' },
  visited: { bg: 'bg-slate-500 dark:bg-slate-600', border: 'border-slate-400 dark:border-slate-500', text: 'text-white' },
  sorted: { bg: 'bg-emerald-600', border: 'border-emerald-400', text: 'text-white font-bold' },
  inserted: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-slate-950 font-bold' },
  deleted: { bg: 'bg-rose-500/50', border: 'border-rose-400 border-dashed', text: 'text-rose-200 line-through' },
};

export const LinkedListView: React.FC<LinkedListViewProps> = ({ data, headPointerName }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">Empty linked list</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-1 p-6 bg-slate-100/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto min-h-[160px] transition-colors duration-300">
        {/* HEAD label */}
        <div className="flex flex-col items-center gap-1 mr-2 shrink-0">
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider">
            {headPointerName || 'HEAD'}
          </span>
          <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>

        {data.nodes.map((node, index) => {
          const colors = nodeColors[node.status] || nodeColors.default;
          return (
            <React.Fragment key={node.id}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex items-center border-2 rounded-xl overflow-hidden shadow-md ${colors.border} shrink-0`}
              >
                {/* Value cell */}
                <div className={`px-5 py-4 ${colors.bg} ${colors.text} font-mono text-lg`}>
                  {node.value}
                </div>
                {/* Pointer cell */}
                <div className="px-3 py-4 bg-slate-200/90 dark:bg-slate-900/80 border-l border-slate-300 dark:border-slate-700 flex items-center justify-center">
                  {index < data.nodes.length - 1 ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">null</span>
                  )}
                </div>
              </motion.div>

              {/* Arrow between nodes */}
              {index < data.nodes.length - 1 && (
                <motion.div
                  layout
                  className="flex items-center shrink-0"
                >
                  <div className="w-6 h-0.5 bg-blue-500/60" />
                  <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-500 -ml-1" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Pointer labels */}
      {data.pointerLabel && data.pointerIndex !== undefined && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Pointer:</span>
          <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 px-2.5 py-0.5 rounded font-bold">
            {data.pointerLabel} → index {data.pointerIndex}
          </span>
        </div>
      )}
    </div>
  );
};
