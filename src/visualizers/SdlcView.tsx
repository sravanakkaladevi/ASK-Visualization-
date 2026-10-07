import React from 'react';
import { motion } from 'framer-motion';
import { SdlcState } from '../types/algorithm';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Layers } from 'lucide-react';

interface SdlcViewProps {
  data: SdlcState;
}

export const SdlcView: React.FC<SdlcViewProps> = ({ data }) => {
  if (!data || !data.stages) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No SDLC data provided</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Model Header */}
      <div className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-mono font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
            {data.modelName} Lifecycle
          </span>
        </div>

        {data.sprintNumber && (
          <span className="text-xs font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 px-2.5 py-0.5 rounded font-bold">
            Sprint #{data.sprintNumber}
          </span>
        )}
      </div>

      {/* Pipeline / Stages Flow */}
      <div className="flex flex-col gap-3">
        {data.stages.map((stage, idx) => {
          const isInProgress = stage.status === 'in-progress';
          const isCompleted = stage.status === 'completed';
          const isFailed = stage.status === 'failed';

          const statusIcon = isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : isInProgress ? (
            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
          ) : isFailed ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-slate-400 shrink-0" />
          );

          const cardClass = isCompleted
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
            : isInProgress
            ? 'bg-blue-500/15 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/30 scale-[1.01]'
            : isFailed
            ? 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200'
            : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400';

          return (
            <motion.div
              key={stage.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-4 rounded-xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm transition-all ${cardClass}`}
            >
              <div className="flex items-center gap-3">
                {statusIcon}
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-sm font-bold tracking-tight">{stage.name}</h4>
                  {stage.details && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{stage.details}</p>
                  )}
                </div>
              </div>

              {/* Artifacts Badges */}
              {stage.artifacts && stage.artifacts.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto">
                  {stage.artifacts.map((art, aIdx) => (
                    <span
                      key={`${art}-${aIdx}`}
                      className="text-[10px] font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {art}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
