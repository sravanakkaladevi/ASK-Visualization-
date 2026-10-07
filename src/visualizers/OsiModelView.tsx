import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { OsiState } from '../types/algorithm';
import { OSI_LAYERS_INFO } from '../algorithms/osiModel';
import { ArrowDown, ArrowUp, Zap, Info } from 'lucide-react';

interface OsiModelViewProps {
  data: OsiState;
}

const LAYER_CONFIG: Record<number, { bgClass: string; textClass: string; glowClass: string; borderColor: string; hex: string }> = {
  7: { bgClass: 'bg-purple-950/40 dark:bg-purple-950/50', textClass: 'text-purple-600 dark:text-purple-300', glowClass: 'shadow-[0_0_18px_rgba(168,85,247,0.45)] ring-2 ring-purple-500', borderColor: 'border-purple-500/30', hex: '#a855f7' },
  6: { bgClass: 'bg-blue-950/40 dark:bg-blue-950/50', textClass: 'text-blue-600 dark:text-blue-300', glowClass: 'shadow-[0_0_18px_rgba(59,130,246,0.45)] ring-2 ring-blue-500', borderColor: 'border-blue-500/30', hex: '#3b82f6' },
  5: { bgClass: 'bg-cyan-950/40 dark:bg-cyan-950/50', textClass: 'text-cyan-600 dark:text-cyan-300', glowClass: 'shadow-[0_0_18px_rgba(6,182,212,0.45)] ring-2 ring-cyan-500', borderColor: 'border-cyan-500/30', hex: '#06b6d4' },
  4: { bgClass: 'bg-emerald-950/40 dark:bg-emerald-950/50', textClass: 'text-emerald-600 dark:text-emerald-300', glowClass: 'shadow-[0_0_18px_rgba(16,185,129,0.45)] ring-2 ring-emerald-500', borderColor: 'border-emerald-500/30', hex: '#10b981' },
  3: { bgClass: 'bg-lime-950/40 dark:bg-lime-950/50', textClass: 'text-lime-600 dark:text-lime-300', glowClass: 'shadow-[0_0_18px_rgba(132,204,22,0.45)] ring-2 ring-lime-500', borderColor: 'border-lime-500/30', hex: '#84cc16' },
  2: { bgClass: 'bg-amber-950/40 dark:bg-amber-950/50', textClass: 'text-amber-600 dark:text-amber-300', glowClass: 'shadow-[0_0_18px_rgba(245,158,11,0.45)] ring-2 ring-amber-500', borderColor: 'border-amber-500/30', hex: '#f59e0b' },
  1: { bgClass: 'bg-rose-950/40 dark:bg-rose-950/50', textClass: 'text-rose-600 dark:text-rose-300', glowClass: 'shadow-[0_0_18px_rgba(244,63,94,0.45)] ring-2 ring-rose-500', borderColor: 'border-rose-500/30', hex: '#f43f5e' },
};

export const OsiModelView: React.FC<OsiModelViewProps> = ({ data }) => {
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(7);
  const stageRef = useRef<HTMLDivElement>(null);
  const [wireMetrics, setWireMetrics] = useState<{ left: number; width: number; top: number }>({ left: 0, width: 0, top: 0 });

  const activeNum = data.activeLayerNumber ?? 7;
  const isSender = data.direction === 'down-client';
  const isWire = data.direction === 'across-wire';
  const isReceiver = data.direction === 'up-server';

  // Measure wire geometry between Sender L1 and Receiver L1
  const updateWire = () => {
    if (!stageRef.current) return;
    const stage = stageRef.current.getBoundingClientRect();
    const s1 = document.getElementById('osi-s-1')?.getBoundingClientRect();
    const r1 = document.getElementById('osi-r-1')?.getBoundingClientRect();
    if (s1 && r1) {
      setWireMetrics({
        left: s1.right - stage.left,
        width: Math.max(0, r1.left - s1.right),
        top: s1.top - stage.top + s1.height / 2 - 2,
      });
    }
  };

  useEffect(() => {
    updateWire();
    const timer = setTimeout(updateWire, 80);
    window.addEventListener('resize', updateWire);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWire);
    };
  }, [data.direction, data.activeLayerNumber]);

  // Selected layer info
  const selectedInfo = OSI_LAYERS_INFO.find((l) => l.n === selectedLayerNum) || OSI_LAYERS_INFO[0];

  // Render chip bundle based on layer level
  const renderChips = (layerNum: number, onWire: boolean) => {
    if (onWire || layerNum === 1) {
      return (
        <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] sm:text-[11px] bg-rose-500 text-white tracking-wider shadow-md animate-pulse">
          0101 1100 1010…
        </span>
      );
    }
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {layerNum <= 2 && (
          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 shadow-sm">
            ETH
          </span>
        )}
        {layerNum <= 3 && (
          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-lime-400 text-slate-950 shadow-sm">
            IP
          </span>
        )}
        {layerNum <= 4 && (
          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-emerald-400 text-slate-950 shadow-sm">
            TCP
          </span>
        )}
        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-white text-slate-950 shadow-sm">
          DATA
        </span>
        {layerNum <= 2 && (
          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 shadow-sm">
            FCS
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4 select-none">
      {/* Header Banner & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-100/90 dark:bg-slate-900/90 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            {isSender ? <ArrowDown className="w-3.5 h-3.5 animate-bounce" /> : isWire ? <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <ArrowUp className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />}
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isSender ? 'Encapsulation (Sender PC A)' : isWire ? 'Physical Transmission Medium' : 'Decapsulation (Receiver PC B)'}
            </h4>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 font-mono">
              {data.logMessage || 'OSI 7-Layer Protocol Stack Flow'}
            </p>
          </div>
        </div>

        {/* Current Active Packet Chip Preview */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Frame:</span>
          {renderChips(activeNum, isWire)}
        </div>
      </div>

      {/* Main OSI Dual-Column Interactive Stage */}
      <div
        ref={stageRef}
        className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_150px_1fr] lg:grid-cols-[1fr_170px_1fr] gap-2 sm:gap-2.5 items-center py-1"
      >
        {/* Column 1: Sender (PC A) */}
        <div className="flex flex-col gap-1.5">
          <div className="text-center font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-0.5 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            Sender (PC A)
          </div>

          {OSI_LAYERS_INFO.map((layer) => {
            const isActive = isSender && activeNum === layer.n;
            const config = LAYER_CONFIG[layer.n];
            const isInspecting = selectedLayerNum === layer.n;

            return (
              <motion.div
                key={`s-${layer.n}`}
                id={`osi-s-${layer.n}`}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedLayerNum(layer.n)}
                className={`relative min-h-[40px] sm:min-h-[44px] px-3 py-1.5 sm:py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isActive
                    ? `${config.bgClass} ${config.glowClass} ${config.textClass} scale-[1.02] z-10 font-bold`
                    : isInspecting
                    ? 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100 opacity-90'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-md text-[11px] font-black font-mono flex items-center justify-center text-white shadow-sm shrink-0"
                    style={{ backgroundColor: config.hex }}
                  >
                    {layer.n}
                  </span>
                  <span className="text-xs font-bold leading-none">{layer.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {layer.pdu}
                  </span>
                  {isActive && (
                    <motion.div layoutId="sender-chip" className="shrink-0">
                      {renderChips(layer.n, false)}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column 2: Protocol Middle Bridge */}
        <div className="hidden md:flex flex-col gap-1.5">
          <div className="text-center font-bold text-[10px] uppercase tracking-wider text-slate-400 pb-0.5">
            Protocols / PDU
          </div>

          {OSI_LAYERS_INFO.map((layer) => {
            const isActive = (isSender || isReceiver) && activeNum === layer.n;
            return (
              <div
                key={`m-${layer.n}`}
                id={`osi-m-${layer.n}`}
                onClick={() => setSelectedLayerNum(layer.n)}
                className={`min-h-[40px] sm:min-h-[44px] px-1.5 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-300 font-bold scale-105'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono leading-tight font-medium">{layer.ex}</span>
                <span className="text-[8px] opacity-75 font-bold uppercase mt-0.5">PDU: {layer.pdu}</span>
              </div>
            );
          })}
        </div>

        {/* Column 3: Receiver (PC B) */}
        <div className="flex flex-col gap-1.5">
          <div className="text-center font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pb-0.5 flex items-center justify-center gap-1.5">
            Receiver (PC B)
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          {OSI_LAYERS_INFO.map((layer) => {
            const isActive = isReceiver && activeNum === layer.n;
            const config = LAYER_CONFIG[layer.n];
            const isInspecting = selectedLayerNum === layer.n;

            return (
              <motion.div
                key={`r-${layer.n}`}
                id={`osi-r-${layer.n}`}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedLayerNum(layer.n)}
                className={`relative min-h-[40px] sm:min-h-[44px] px-3 py-1.5 sm:py-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isActive
                    ? `${config.bgClass} ${config.glowClass} ${config.textClass} scale-[1.02] z-10 font-bold`
                    : isInspecting
                    ? 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-100 opacity-90'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <motion.div layoutId="receiver-chip" className="shrink-0">
                      {renderChips(layer.n, false)}
                    </motion.div>
                  )}
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {layer.pdu}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold leading-none">{layer.name}</span>
                  <span
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-md text-[11px] font-black font-mono flex items-center justify-center text-white shadow-sm shrink-0"
                    style={{ backgroundColor: config.hex }}
                  >
                    {layer.n}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Physical Medium Wire at Layer 1 */}
        {wireMetrics.width > 0 && (
          <div
            className="absolute z-20 pointer-events-none transition-all hidden md:flex items-center justify-center"
            style={{
              left: `${wireMetrics.left}px`,
              width: `${wireMetrics.width}px`,
              top: `${wireMetrics.top}px`,
              height: '6px',
            }}
          >
            {/* Animated Wire Line */}
            <div
              className={`w-full h-1 rounded-full transition-all ${
                isWire
                  ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
            {isWire && (
              <motion.div
                initial={{ x: -wireMetrics.width / 2 }}
                animate={{ x: wireMetrics.width / 2 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                className="absolute"
              >
                <span className="px-2 py-0.5 rounded font-mono font-black text-[9px] bg-rose-600 text-white shadow-lg whitespace-nowrap">
                  ⚡ 0101 1100 1010…
                </span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Compact Layer Inspector & Summary Card */}
      <div className="bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 flex flex-col gap-2 shadow-sm shrink-0">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Layer {selectedInfo.n}: {selectedInfo.name}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            PDU: {selectedInfo.pdu}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Purpose & Role
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
              {selectedInfo.purpose}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Key Protocols
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {selectedInfo.ex.split(', ').map((p) => (
                <span
                  key={p}
                  className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-600 text-white shadow-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Encapsulation Action
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
              {selectedInfo.n >= 5
                ? 'App payload creation & session formatting.'
                : selectedInfo.n === 4
                ? 'Adds TCP segment header (ports 54321 → 443).'
                : selectedInfo.n === 3
                ? 'Adds IP packet header (Source IP → Dest IP).'
                : selectedInfo.n === 2
                ? 'Adds Ethernet MAC header + FCS CRC trailer.'
                : 'Converts all frames into raw bitstream pulses.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
