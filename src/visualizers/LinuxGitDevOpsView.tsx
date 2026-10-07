import React from 'react';
import { motion } from 'framer-motion';
import { LinuxGitDevOpsState } from '../types/algorithm';
import { GitBranch, Server, CheckCircle2 } from 'lucide-react';

interface LinuxGitDevOpsViewProps {
  data: LinuxGitDevOpsState;
}

export const LinuxGitDevOpsView: React.FC<LinuxGitDevOpsViewProps> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No DevOps data provided</div>;
  }

  // 1. Git Workflow Mode
  if (data.mode === 'git-workflow') {
    return (
      <div className="w-full flex flex-col gap-5">
        {/* Branch Indicator */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono font-extrabold text-slate-800 dark:text-slate-200">
              Branch: {data.gitBranch || 'main'}
            </span>
          </div>
          {data.command && (
            <span className="text-xs font-mono bg-slate-950 text-emerald-400 px-3 py-1 rounded-lg border border-slate-800">
              $ {data.command}
            </span>
          )}
        </div>

        {/* Git Workflow Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Working Directory</span>
            <div className="font-mono text-xs text-amber-500 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              {data.command === 'git status' ? 'Modified: src/App.tsx' : 'Clean'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Staging Area (Index)</span>
            <div className="font-mono text-xs text-blue-500 bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
              {data.stagingFiles && data.stagingFiles.length > 0 ? data.stagingFiles.join(', ') : 'Empty Index'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Local Repository</span>
            <div className="font-mono text-xs text-emerald-500 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              {data.committedFiles && data.committedFiles.length > 0 ? data.committedFiles.join(', ') : 'HEAD'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Remote GitHub</span>
            <div className="font-mono text-xs text-purple-500 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20">
              origin/main (Synced)
            </div>
          </div>
        </div>

        {/* Terminal Output */}
        {data.output && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase">Git Terminal Output</span>
            <pre className="whitespace-pre-wrap text-emerald-400">{data.output}</pre>
          </div>
        )}
      </div>
    );
  }

  // 2. Product Deployment Mode
  if (data.mode === 'product-deployment' && data.stages) {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
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
                className={`p-4 rounded-2xl border-2 flex flex-col gap-1 shadow-sm transition-all ${cardClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold">{stage.label}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                {stage.subText && <span className="text-[10px] font-mono opacity-80">{stage.subText}</span>}
              </motion.div>
            );
          })}
        </div>

        {data.logMessage && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.logMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // 3. Linux Terminal Mode (Default)
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 flex flex-col gap-3 font-mono text-xs text-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-slate-400 ml-2">bash - devops@algocraft-linux:~</span>
        </div>

        {data.command && (
          <div className="flex items-center gap-2 text-emerald-400">
            <span>devops@algocraft:~$</span>
            <span className="text-white font-bold">{data.command}</span>
          </div>
        )}

        {data.output && (
          <pre className="text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {data.output}
          </pre>
        )}
      </div>
    </div>
  );
};
