import React from 'react';
import { motion } from 'framer-motion';
import { ArrayState, ElementStatus } from '../types/algorithm';

interface ArrayBarsProps {
  elements: ArrayState;
}

const statusColors: Record<ElementStatus, { bar: string; border: string; badge: string }> = {
  completed: {
    bar: 'bg-gradient-to-t from-emerald-600 to-teal-400',
    border: 'border-emerald-400/40',
    badge: 'bg-emerald-600 text-white',
  },
  'in-progress': {
    bar: 'bg-gradient-to-t from-blue-600 to-cyan-500',
    border: 'border-blue-400/40',
    badge: 'bg-blue-600 text-white',
  },
  pending: {
    bar: 'bg-gradient-to-t from-slate-700 to-slate-800',
    border: 'border-slate-600/40',
    badge: 'bg-slate-700 text-slate-300',
  },
  idle: {
    bar: 'bg-gradient-to-t from-slate-700 to-slate-800',
    border: 'border-slate-600/40',
    badge: 'bg-slate-700 text-slate-300',
  },
  default: {
    bar: 'bg-gradient-to-t from-blue-600 to-indigo-500',
    border: 'border-blue-400/30',
    badge: 'bg-slate-800 text-slate-300',
  },
  comparing: {
    bar: 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/50 scale-105',
    border: 'border-amber-300',
    badge: 'bg-amber-500 text-slate-950 font-bold',
  },
  swapping: {
    bar: 'bg-gradient-to-t from-rose-600 to-pink-500 shadow-lg shadow-rose-500/50 scale-105',
    border: 'border-rose-400',
    badge: 'bg-rose-500 text-white font-bold',
  },
  sorted: {
    bar: 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/30',
    border: 'border-emerald-400/40',
    badge: 'bg-emerald-600 text-white',
  },
  pivot: {
    bar: 'bg-gradient-to-t from-cyan-600 to-sky-400 shadow-md shadow-cyan-500/40',
    border: 'border-cyan-400',
    badge: 'bg-cyan-500 text-slate-950 font-bold',
  },
  active: {
    bar: 'bg-gradient-to-t from-purple-600 to-indigo-400 shadow-md shadow-purple-500/40',
    border: 'border-purple-400',
    badge: 'bg-purple-600 text-white',
  },
  visited: {
    bar: 'bg-gradient-to-t from-slate-600 to-slate-500',
    border: 'border-slate-500',
    badge: 'bg-slate-700 text-slate-300',
  },
  unvisited: {
    bar: 'bg-gradient-to-t from-slate-800 to-slate-700',
    border: 'border-slate-700',
    badge: 'bg-slate-800 text-slate-400',
  },
  path: {
    bar: 'bg-gradient-to-t from-violet-600 to-fuchsia-500',
    border: 'border-violet-400',
    badge: 'bg-violet-600 text-white font-bold',
  },
  inserted: {
    bar: 'bg-gradient-to-t from-emerald-500 to-green-400 shadow-md shadow-emerald-500/40',
    border: 'border-emerald-300',
    badge: 'bg-emerald-500 text-slate-950 font-bold',
  },
  deleted: {
    bar: 'bg-gradient-to-t from-rose-700 to-red-600 opacity-50',
    border: 'border-rose-500/30',
    badge: 'bg-rose-800 text-white',
  },
  highlighted: {
    bar: 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-lg shadow-amber-500/50',
    border: 'border-amber-300',
    badge: 'bg-amber-500 text-slate-950 font-bold',
  },
};

export const ArrayBars: React.FC<ArrayBarsProps> = ({ elements }) => {
  if (!elements || elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        No array data provided
      </div>
    );
  }

  const maxValue = Math.max(...elements.map((e) => e.value), 1);

  return (
    <div className="w-full h-80 flex items-end justify-center gap-2 p-6 bg-slate-100/80 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-inner overflow-x-auto transition-colors duration-300">
      {elements.map((item, index) => {
        const heightPercent = Math.max(12, Math.min(100, (item.value / maxValue) * 100));
        const color = statusColors[item.status] || statusColors.default;

        return (
          <motion.div
            key={item.id}
            layout
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="flex flex-col items-center gap-2 flex-1 max-w-[64px] min-w-[28px] h-full justify-end"
          >
            {/* Value Label above bar */}
            <motion.span
              layout="position"
              className={`text-xs font-mono px-1.5 py-0.5 rounded ${color.badge} transition-colors duration-200 shadow-sm`}
            >
              {item.value}
            </motion.span>

            {/* Main Bar */}
            <motion.div
              layout
              className={`w-full rounded-t-lg border-t border-x ${color.bar} ${color.border} transition-colors duration-200 min-h-[20px]`}
              style={{ height: `${heightPercent}%` }}
            />

            {/* Index label underneath */}
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">[{index}]</span>
          </motion.div>
        );
      })}
    </div>
  );
};
