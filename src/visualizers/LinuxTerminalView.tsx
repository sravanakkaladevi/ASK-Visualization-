import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Folder, FileText, Cpu, ShieldCheck } from 'lucide-react';

export interface LinuxTerminalState {
  command: string;
  stageName: 'terminal' | 'shell' | 'kernel' | 'filesystem' | 'output';
  outputLines: string[];
  logMessage: string;
}

interface LinuxTerminalViewProps {
  data: LinuxTerminalState;
}

export const LinuxTerminalView: React.FC<LinuxTerminalViewProps> = ({ data }) => {
  if (!data || !data.command) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No Linux Terminal Data</div>;
  }

  const stages = [
    { id: 'terminal', label: '1. Terminal UI', icon: Terminal, color: 'text-sky-400' },
    { id: 'shell', label: '2. Shell (Bash)', icon: Cpu, color: 'text-purple-400' },
    { id: 'kernel', label: '3. Linux Kernel', icon: ShieldCheck, color: 'text-amber-400' },
    { id: 'filesystem', label: '4. File System / Process', icon: Folder, color: 'text-emerald-400' },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header Pipeline Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stages.map((st) => {
          const isActive = data.stageName === st.id;
          const Icon = st.icon;
          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border flex items-center gap-2 transition-all duration-300 ${
                isActive
                  ? 'bg-blue-500/20 border-blue-500 text-white ring-2 ring-blue-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-70'
              }`}
            >
              <Icon className={`w-4 h-4 ${st.color}`} />
              <span className="text-xs font-semibold font-mono truncate">{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Window Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">user@algocraft-linux:~</span>
          <span className="text-[10px] text-slate-500 uppercase">POSIX Shell</span>
        </div>

        {/* Console Content */}
        <div className="p-5 space-y-3 min-h-[200px]">
          {/* Prompt line */}
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-emerald-400 font-bold">user@algocraft:~$</span>
            <span className="text-white font-bold">{data.command}</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-blue-400 inline-block"
            ></motion.span>
          </div>

          {/* Command Pipeline Description */}
          <div className="text-[11px] text-blue-400/90 bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
            {data.logMessage}
          </div>

          {/* Execution Output Lines */}
          <div className="space-y-1 text-slate-300 pt-2 border-t border-slate-900">
            {data.outputLines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2"
              >
                {line.startsWith('drwx') || line.startsWith('-rw') ? (
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                ) : null}
                <span>{line}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
