import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackQueueState } from '../types/algorithm';
import { ArrowUp, ArrowLeft, ArrowDownLeft, ArrowDownRight, Layers } from 'lucide-react';

interface StackQueueViewProps {
  data: StackQueueState;
}

const itemColors: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: 'bg-indigo-600 dark:bg-indigo-600/90', border: 'border-indigo-400/40', text: 'text-white' },
  active: { bg: 'bg-blue-600 dark:bg-blue-500', border: 'border-blue-300', text: 'text-white font-bold' },
  inserted: { bg: 'bg-emerald-600 dark:bg-emerald-500', border: 'border-emerald-300', text: 'text-white font-bold' },
  deleted: { bg: 'bg-rose-500/80', border: 'border-rose-400 border-dashed', text: 'text-white font-bold' },
  comparing: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-slate-950 font-bold' },
};

export const StackQueueView: React.FC<StackQueueViewProps> = ({ data }) => {
  if (!data || !data.items) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
        No stack/queue data available.
      </div>
    );
  }

  const isStack = data.type === 'stack';
  const isDeque = data.type === 'deque';
  const isQueue = data.type === 'queue';

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col items-center p-6 bg-slate-100/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 min-h-[280px] transition-colors duration-300 shadow-inner">
        {/* Container label */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {isStack
                ? 'Stack (LIFO - Last In First Out)'
                : isDeque
                ? 'Double-Ended Queue (Deque - O(1) Push/Pop Both Ends)'
                : 'Queue (FIFO - First In First Out)'}
            </span>
          </div>

          {data.operationLabel && (
            <span className="text-xs font-mono bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg font-bold shadow-sm">
              {data.operationLabel}
            </span>
          )}
        </div>

        {/* Stack View */}
        {isStack && (
          <div className="flex flex-col-reverse items-center gap-2 w-full max-w-[220px]">
            <div className="flex items-center gap-2 mt-2">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Top of Stack (Push / Pop)
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {data.items.map((item, index) => {
                const colors = itemColors[item.status] || itemColors.default;
                const isTop = index === data.items.length - 1;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-center text-base shadow-md
                      ${colors.bg} ${colors.border} ${colors.text}
                      ${isTop ? 'ring-2 ring-emerald-400 shadow-lg' : ''}`}
                  >
                    <div className="font-extrabold text-lg">{item.value}</div>
                    {isTop && <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">TOP</div>}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {data.items.length === 0 && (
              <div className="text-xs text-slate-500 font-mono italic py-8 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl w-full text-center">
                Stack is empty
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Bottom
              </span>
            </div>
          </div>
        )}

        {/* Regular Queue View */}
        {isQueue && (
          <div className="flex items-center gap-3 w-full overflow-x-auto py-6 justify-center">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">FRONT (Dequeue)</span>
            </div>

            <div className="flex items-center gap-2 min-w-[200px] border-y-2 border-dashed border-slate-300 dark:border-slate-700 px-4 py-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/40">
              <AnimatePresence mode="popLayout">
                {data.items.map((item, index) => {
                  const colors = itemColors[item.status] || itemColors.default;
                  const isFront = index === 0;
                  const isRear = index === data.items.length - 1;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 40, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -40, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`px-5 py-3.5 rounded-xl border-2 font-mono text-center shadow-md shrink-0
                        ${colors.bg} ${colors.border} ${colors.text}
                        ${isFront ? 'ring-2 ring-emerald-400' : ''}`}
                    >
                      <div className="font-extrabold text-lg">{item.value}</div>
                      <div className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                        {isFront && isRear ? 'FRONT/REAR' : isFront ? 'FRONT' : isRear ? 'REAR' : `idx: ${index}`}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {data.items.length === 0 && (
                <div className="text-xs text-slate-500 font-mono italic px-8 py-4">Queue is empty</div>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <ArrowLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">REAR (Enqueue)</span>
            </div>
          </div>
        )}

        {/* Deque (Double Ended Queue) View */}
        {isDeque && (
          <div className="flex flex-col items-center w-full gap-4 py-4">
            {/* End Controls / Action Hints */}
            <div className="flex items-center justify-between w-full px-2 text-xs font-mono font-bold">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                <ArrowDownLeft className="w-4 h-4" />
                <span>FRONT (push_front / pop_front)</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-800">
                <span>REAR (push_back / pop_back)</span>
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>

            {/* Deque Box Container */}
            <div className="flex items-center gap-2.5 w-full min-h-[100px] overflow-x-auto border-2 border-slate-300 dark:border-slate-700 px-6 py-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 shadow-inner justify-center">
              <AnimatePresence mode="popLayout">
                {data.items.map((item, index) => {
                  const colors = itemColors[item.status] || itemColors.default;
                  const isFront = index === 0;
                  const isBack = index === data.items.length - 1;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.5, y: item.status === 'inserted' ? -20 : 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`px-5 py-3.5 rounded-xl border-2 font-mono text-center shadow-lg shrink-0
                        ${colors.bg} ${colors.border} ${colors.text}
                        ${isFront ? 'ring-2 ring-emerald-400' : ''} ${isBack && !isFront ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div className="font-extrabold text-xl">{item.value}</div>
                      <div className="text-[9px] uppercase font-bold tracking-wider opacity-85 mt-0.5">
                        {isFront && isBack ? 'FRONT & REAR' : isFront ? 'FRONT' : isBack ? 'REAR' : `[${index}]`}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {data.items.length === 0 && (
                <div className="text-xs text-slate-500 font-mono italic px-8 py-4">Deque is currently empty</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats footer bar */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Element Count:</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
            {data.items.length}
          </span>
        </div>

        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
          {isDeque
            ? 'Supports O(1) Push/Pop at both ends'
            : isStack
            ? 'LIFO: Push/Pop at Top only'
            : 'FIFO: Enqueue at Rear, Dequeue from Front'}
        </div>
      </div>
    </div>
  );
};
