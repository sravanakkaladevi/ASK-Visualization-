import React from 'react';
import { motion } from 'framer-motion';
import { SdlcState } from '../types/algorithm';
import { FileText, CheckCircle2, ArrowRight, Play, Sparkles, Workflow } from 'lucide-react';

interface WaterfallViewProps {
  data: SdlcState | any;
}

export const WaterfallView: React.FC<WaterfallViewProps> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No SDLC data</div>;
  }

  // Support both `stages` (new standard) and `phases` (legacy)
  const rawStages = data.stages || data.phases || [];
  const activeId = data.currentStageId || data.activePhaseId || (rawStages[0]?.id ?? '');
  const modelName = data.modelName || 'Software Development Process';

  if (rawStages.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No SDLC stages defined.</div>;
  }

  const activeStage = rawStages.find((s: any) => s.id === activeId) || rawStages[0];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{modelName}</span>
              {data.sprintNumber && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                  Sprint #{data.sprintNumber}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {data.logMessage || `Current Stage: ${activeStage?.name}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Active:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30 shadow-sm">
            {activeStage?.name}
          </span>
        </div>
      </div>

      {/* Cascading Pipeline / Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 relative">
        {rawStages.map((stage: any, index: number) => {
          const isActive = stage.id === activeId;
          const isCompleted = stage.status === 'completed' || stage.status === 'sorted';

          return (
            <div key={stage.id || index} className="relative flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`w-full p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[150px] shadow-sm ${
                  isActive
                    ? 'bg-blue-500/15 border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/40'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
                      Stage 0{index + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <Play className="w-4 h-4 text-blue-500 animate-pulse fill-blue-500" />
                    ) : null}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {stage.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono uppercase">
                    Deliverable / Output
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5 truncate">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">{stage.deliverable || stage.artifacts?.[0] || 'Artifact'}</span>
                  </span>
                </div>
              </motion.div>

              {/* Desktop Arrow Connector */}
              {index < rawStages.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep Details Inspector */}
      {activeStage && (
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Stage Details: {activeStage.name}</span>
            </h4>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Output: {activeStage.deliverable || activeStage.artifacts?.[0] || 'Deliverable Item'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Process Activities:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {activeStage.details || (activeStage.activities ? activeStage.activities.join(' • ') : 'Executing stage objectives according to methodology standards.')}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Artifacts & Deliverables:</span>
              <div className="flex items-center gap-2 flex-wrap bg-white/70 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 min-h-[50px]">
                {(activeStage.artifacts && activeStage.artifacts.length > 0) ? (
                  activeStage.artifacts.map((art: string, idx: number) => (
                    <span key={idx} className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      {art}
                    </span>
                  ))
                ) : activeStage.deliverable ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-500" />
                    {activeStage.deliverable}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">None generated yet</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
