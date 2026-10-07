import React from 'react';
import { motion } from 'framer-motion';
import { CompFundState } from '../types/algorithm';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface CompFundViewProps {
  data: CompFundState;
}

export const CompFundView: React.FC<CompFundViewProps> = ({ data }) => {
  if (!data || !data.stages) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No Compilation data provided</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in-progress';

          const cardClass = isCompleted
            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200'
            : isInProgress
            ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/40 scale-105 shadow-xl'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400';

          return (
            <motion.div
              key={stage.id}
              layout
              className={`p-3.5 rounded-2xl border-2 flex flex-col gap-1.5 shadow-sm transition-all ${cardClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold">{stage.name}</span>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Code / Assembly Snippet Box */}
      {data.stages.map((s) => {
        if (s.id !== data.currentStageId) return null;
        return (
          <div key={s.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-[11px]">
              <span className="font-bold text-blue-400 uppercase">Stage Representation: {s.name}</span>
              <span>{s.registerState ? 'Hardware CPU State' : 'Code Transformation'}</span>
            </div>
            {s.codeSnippet && <pre className="text-emerald-400 whitespace-pre-wrap">{s.codeSnippet}</pre>}
            {s.registerState && <pre className="text-amber-400 whitespace-pre-wrap font-bold">{s.registerState}</pre>}
          </div>
        );
      })}

      {/* Log Message */}
      {data.logMessage && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.logMessage}</span>
        </div>
      )}
    </div>
  );
};
