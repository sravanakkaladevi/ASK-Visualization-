import React from 'react';
import { motion } from 'framer-motion';
import { Crown, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface ChessboardState {
  boardSize: number;
  queens: { row: number; col: number; status: 'placed' | 'conflict' | 'testing' }[];
  currentAttempt?: { row: number; col: number };
  logMessage: string;
}

interface ChessboardViewProps {
  data: ChessboardState;
}

export const ChessboardView: React.FC<ChessboardViewProps> = ({ data }) => {
  if (!data || !data.boardSize) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No Chessboard Data</div>;
  }

  const N = data.boardSize;

  // Build N x N grid matrix
  const grid = Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => {
      const q = data.queens.find((queen) => queen.row === r && queen.col === c);
      const isTesting = data.currentAttempt?.row === r && data.currentAttempt?.col === c;
      return { row: r, col: c, queen: q, isTesting };
    })
  );

  const isLarge = N >= 16;
  const isMedium = N === 8;
  const isSmall = N <= 4;

  const boardWidth = isSmall ? '280px' : isMedium ? '360px' : '440px';

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Header Log Bar */}
      <div className="w-full bg-slate-100/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{data.logMessage}</span>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-full">
          {N} x {N} Grid ({data.queens.filter((q) => q.status === 'placed').length}/{N} Queens)
        </span>
      </div>

      {/* Interactive Chessboard Grid */}
      <div
        className="grid p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl transition-all"
        style={{
          gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
          gap: isLarge ? '2px' : isMedium ? '4px' : '6px',
          width: boardWidth,
          maxWidth: '100%',
          aspectRatio: '1/1',
        }}
      >
        {grid.flat().map(({ row, col, queen, isTesting }) => {
          const isDarkSquare = (row + col) % 2 === 1;

          let squareStyle = isDarkSquare ? 'bg-slate-800' : 'bg-slate-700/70';
          let borderStyle = 'border-transparent';

          if (queen) {
            if (queen.status === 'placed') {
              squareStyle = 'bg-emerald-600/40';
              borderStyle = 'border-emerald-500/80 shadow-md shadow-emerald-500/30';
            } else if (queen.status === 'conflict') {
              squareStyle = 'bg-rose-600/50';
              borderStyle = 'border-rose-500 animate-pulse';
            } else if (queen.status === 'testing') {
              squareStyle = 'bg-amber-500/40';
              borderStyle = 'border-amber-400';
            }
          } else if (isTesting) {
            squareStyle = 'bg-blue-500/40';
            borderStyle = 'border-blue-400 animate-pulse';
          }

          return (
            <motion.div
              key={`cell-${row}-${col}`}
              layout
              className={`relative rounded-md border flex items-center justify-center transition-all duration-150 ${squareStyle} ${borderStyle}`}
            >
              {!isLarge && (
                <span className="absolute top-0.5 left-1 text-[8px] font-mono text-slate-400/50 select-none">
                  {row},{col}
                </span>
              )}

              {queen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Crown
                    className={`filter drop-shadow-md ${
                      isLarge ? 'w-3 h-3' : isMedium ? 'w-5 h-5' : 'w-7 h-7'
                    } ${
                      queen.status === 'placed'
                        ? 'text-amber-400'
                        : queen.status === 'conflict'
                        ? 'text-rose-400'
                        : 'text-blue-300'
                    }`}
                  />
                </motion.div>
              )}

              {!queen && isTesting && (
                <div className={`${isLarge ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'} rounded-full bg-blue-400 animate-ping opacity-80`}></div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Placed Queen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Conflict / Attack</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe / Placed</span>
        </div>
      </div>
    </div>
  );
};
