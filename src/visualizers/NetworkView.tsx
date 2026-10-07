import React from 'react';
import { motion } from 'framer-motion';
import { NetworkState, NetworkDevice } from '../types/algorithm';
import { Monitor, Server, Globe, Cpu, Radio } from 'lucide-react';

interface NetworkViewProps {
  data: NetworkState;
}

const deviceIcons: Record<NetworkDevice['type'], React.FC<{ className?: string }>> = {
  client: Monitor,
  server: Server,
  'dns-resolver': Radio,
  'root-dns': Globe,
  'tld-dns': Globe,
  'auth-dns': Cpu,
  router: Radio,
};

const devicePositions: Record<string, { x: number; y: number }> = {
  // TCP 2-device layout
  client: { x: 80, y: 140 },
  server: { x: 580, y: 140 },
  // DNS 5-device layout
  resolver: { x: 220, y: 140 },
  root: { x: 380, y: 40 },
  tld: { x: 380, y: 240 },
  auth: { x: 580, y: 140 },
};

export const NetworkView: React.FC<NetworkViewProps> = ({ data }) => {
  if (!data || !data.devices) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No network data provided</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full h-[320px] bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-4 transition-colors duration-300">
        {/* Network Connection Channels (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="net-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
            </marker>
          </defs>

          {data.packets.map((pkt) => {
            const fromDev = devicePositions[pkt.from] || { x: 100, y: 140 };
            const toDev = devicePositions[pkt.to] || { x: 500, y: 140 };

            return (
              <g key={`channel-${pkt.id}`}>
                <line
                  x1={fromDev.x + 30}
                  y1={fromDev.y + 25}
                  x2={toDev.x + 30}
                  y2={toDev.y + 25}
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Devices */}
        {data.devices.map((dev) => {
          const pos = devicePositions[dev.id] || { x: 100, y: 140 };
          const Icon = deviceIcons[dev.type] || Server;
          const isActive = dev.status === 'active';
          const isVisited = dev.status === 'visited';
          const isSorted = dev.status === 'sorted';
          const isComparing = dev.status === 'comparing';

          const colorClass = isSorted
            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
            : isActive
            ? 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-200 ring-4 ring-blue-500/40 scale-105'
            : isComparing
            ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300'
            : isVisited
            ? 'bg-indigo-500/10 border-indigo-400 text-indigo-700 dark:text-indigo-300'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';

          return (
            <motion.div
              key={dev.id}
              layout
              style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px` }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 shadow-md w-36 transition-all duration-300 ${colorClass}`}
            >
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[11px] font-mono font-bold text-center leading-tight">{dev.label}</span>
              {dev.ip && <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">{dev.ip}</span>}
            </motion.div>
          );
        })}

        {/* Animated Packets */}
        {data.packets.map((pkt) => {
          const fromDev = devicePositions[pkt.from] || { x: 100, y: 140 };
          const toDev = devicePositions[pkt.to] || { x: 500, y: 140 };

          const currentX = fromDev.x + (toDev.x - fromDev.x) * pkt.progress;
          const currentY = fromDev.y + (toDev.y - fromDev.y) * pkt.progress;

          return (
            <motion.div
              key={pkt.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, left: `${currentX}px`, top: `${currentY}px` }}
              transition={{ duration: 0.4 }}
              className="absolute z-20 flex flex-col items-center bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-lg border border-blue-300 font-mono text-[10px] font-extrabold tracking-wide"
            >
              <span>{pkt.type}</span>
              {pkt.payload && <span className="text-[8px] opacity-90">{pkt.payload}</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Protocol Log Message */}
      {data.logMessage && (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-extrabold uppercase text-[10px]">
            {data.protocol}
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{data.logMessage}</span>
        </div>
      )}
    </div>
  );
};
