import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

export interface HanoiState {
  pegs: {
    A: number[];
    B: number[];
    C: number[];
  };
  diskCount: number;
  moveDescription: string;
  activeDisk?: number;
  fromPeg?: 'A' | 'B' | 'C';
  toPeg?: 'A' | 'B' | 'C';
}

interface HanoiViewProps {
  data: HanoiState;
}

const DISK_COLORS = [
  'bg-indigo-500 border-indigo-400 text-indigo-100',
  'bg-emerald-500 border-emerald-400 text-emerald-100',
  'bg-amber-500 border-amber-400 text-amber-100',
  'bg-rose-500 border-rose-400 text-rose-100',
  'bg-purple-500 border-purple-400 text-purple-100',
];

export const HanoiView: React.FC<HanoiViewProps> = ({ data }) => {
  if (!data || !data.pegs) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No Tower of Hanoi Data</div>;
  }

  const maxDisk = data.diskCount || 3;
  const pegNames: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4">
      {/* Description Header */}
      <div className="w-full bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">{data.moveDescription}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-bold">
            Disks: {maxDisk}
          </span>
        </div>
      </div>

      {/* Pegs Display Area */}
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl flex justify-around items-end min-h-[300px] relative overflow-hidden">
        {/* Base Stand */}
        <div className="absolute bottom-6 left-8 right-8 h-3 bg-slate-700 rounded-full shadow-inner" />

        {pegNames.map((pegKey) => {
          const diskList = data.pegs[pegKey] || [];
          const isFrom = data.fromPeg === pegKey;
          const isTo = data.toPeg === pegKey;

          return (
            <div key={pegKey} className="flex flex-col items-center relative z-10 w-1/3">
              {/* Vertical Pole */}
              <div className="w-3.5 h-48 bg-slate-700/80 rounded-t-lg shadow-inner absolute bottom-0 -z-10" />

              {/* Stacked Disks */}
              <div className="w-full flex flex-col-reverse items-center gap-1.5 pb-3 min-h-[190px]">
                {diskList.map((diskSize) => {
                  const widthPercent = 30 + (diskSize / maxDisk) * 60;
                  const colorClass = DISK_COLORS[(diskSize - 1) % DISK_COLORS.length];
                  const isMovingDisk = data.activeDisk === diskSize;

                  return (
                    <motion.div
                      key={`disk-${diskSize}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shadow-md transition-shadow ${colorClass} ${
                        isMovingDisk ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105' : ''
                      }`}
                    >
                      Disk {diskSize}
                    </motion.div>
                  );
                })}
              </div>

              {/* Peg Label */}
              <div
                className={`mt-4 px-4 py-1 rounded-full text-xs font-bold font-mono border ${
                  isFrom
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-400/50'
                    : isTo
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-400/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Peg {pegKey} {isFrom ? '(Source)' : isTo ? '(Target)' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
