import React from 'react';
import { motion } from 'framer-motion';
import { MernState } from '../types/algorithm';
import { Globe, Server, Database, Key, Monitor, Cpu, ArrowRight } from 'lucide-react';

interface MernViewProps {
  data: MernState;
}

const componentIcons: Record<string, React.FC<{ className?: string }>> = {
  react: Monitor,
  express: Server,
  node: Cpu,
  mongodb: Database,
  jwt: Key,
  browser: Globe,
};

export const MernView: React.FC<MernViewProps> = ({ data }) => {
  if (!data || !data.components) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No MERN stack data</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Component Nodes Flow */}
      <div className="flex items-center justify-between gap-3 p-6 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto min-h-[180px] transition-colors">
        {data.components.map((comp, index) => {
          const Icon = componentIcons[comp.type] || Server;
          const isActive = comp.status === 'active';
          const isComparing = comp.status === 'comparing';
          const isSorted = comp.status === 'sorted';
          const isVisited = comp.status === 'visited';

          const cardClass = isSorted
            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200'
            : isActive
            ? 'bg-blue-600 text-white shadow-xl ring-4 ring-blue-400/50 scale-105 border-blue-400'
            : isComparing
            ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200'
            : isVisited
            ? 'bg-indigo-500/10 border-indigo-400 text-indigo-900 dark:text-indigo-200'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';

          return (
            <React.Fragment key={comp.id}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 shrink-0 w-36 shadow-md transition-all ${cardClass}`}
              >
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                </div>
                <span className="text-xs font-mono font-extrabold text-center leading-tight">{comp.name}</span>
                {comp.subText && <span className="text-[10px] font-mono opacity-80">{comp.subText}</span>}
              </motion.div>

              {index < data.components.length - 1 && (
                <div className="flex items-center shrink-0">
                  <div className="w-6 h-0.5 bg-blue-500/60" />
                  <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 -ml-1" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Payload Inspector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.requestPayload && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Outgoing Request Payload</span>
            <div className="font-mono text-xs bg-slate-950 text-blue-300 p-2.5 rounded-lg border border-slate-800">
              {data.requestPayload}
            </div>
          </div>
        )}

        {data.responsePayload && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Incoming Response Payload</span>
            <div className="font-mono text-xs bg-slate-950 text-emerald-400 p-2.5 rounded-lg border border-slate-800">
              {data.responsePayload}
            </div>
          </div>
        )}
      </div>

      {/* Log Message */}
      {data.logMessage && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
            MERN Flow
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.logMessage}</span>
        </div>
      )}
    </div>
  );
};
