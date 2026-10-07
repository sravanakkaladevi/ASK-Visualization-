import React from 'react';
import { motion } from 'framer-motion';
import { Table } from 'lucide-react';

export interface DpTableState {
  headers: { rows: string[]; cols: string[] };
  matrix: (number | string)[][];
  activeCell?: { row: number; col: number };
  comparingCells?: { row: number; col: number }[];
  logMessage: string;
}

interface DpTableViewProps {
  data: DpTableState;
}

export const DpTableView: React.FC<DpTableViewProps> = ({ data }) => {
  if (!data || !data.matrix) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No DP Table Data</div>;
  }

  const { headers, matrix, activeCell, comparingCells = [], logMessage } = data;

  return (
    <div className="w-full flex flex-col items-center gap-5 p-4">
      {/* Header Log */}
      <div className="w-full bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200">{logMessage}</span>
        </div>
        <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-mono text-[11px] font-bold">
          DP Matrix ({matrix.length}x{matrix[0]?.length || 0})
        </span>
      </div>

      {/* 2D Grid Table Container */}
      <div className="w-full overflow-x-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
        <table className="border-collapse font-mono text-xs text-slate-200">
          <thead>
            <tr>
              <th className="p-3 bg-slate-950 border border-slate-800 text-slate-400 font-bold">i \ w</th>
              {headers.cols.map((colHeader, cIdx) => (
                <th
                  key={`col-${cIdx}`}
                  className={`p-3 border border-slate-800 font-bold transition-colors ${
                    activeCell?.col === cIdx ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-950 text-slate-300'
                  }`}
                >
                  {colHeader}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((rowArr, rIdx) => (
              <tr key={`row-${rIdx}`}>
                <th
                  className={`p-3 border border-slate-800 font-bold transition-colors ${
                    activeCell?.row === rIdx ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-950 text-slate-300'
                  }`}
                >
                  {headers.rows[rIdx] || `Row ${rIdx}`}
                </th>
                {rowArr.map((val, cIdx) => {
                  const isActive = activeCell?.row === rIdx && activeCell?.col === cIdx;
                  const isComparing = comparingCells.some((cell) => cell.row === rIdx && cell.col === cIdx);

                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className="p-1 border border-slate-800 text-center"
                    >
                      <motion.div
                        layout
                        initial={{ scale: 0.9 }}
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                        className={`w-12 h-10 flex items-center justify-center rounded-lg font-bold transition-all shadow-inner ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-extrabold text-sm shadow-amber-500/50'
                            : isComparing
                            ? 'bg-sky-600/40 text-sky-200 border border-sky-400/50'
                            : val !== '-' && val !== 0
                            ? 'bg-slate-800/80 text-emerald-300 border border-emerald-500/20'
                            : 'bg-slate-900/60 text-slate-500'
                        }`}
                      >
                        {val}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
