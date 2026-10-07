import React, { useState } from 'react';
import { CpuArchitectureState } from '../types/algorithm';
import {
  Cpu,
  Database,
  HardDrive,
  Zap,
  Info,
  ArrowRight,
  ArrowLeft,
  Activity,
} from 'lucide-react';

interface CpuArchitectureViewProps {
  data: CpuArchitectureState;
}

export const CpuArchitectureView: React.FC<CpuArchitectureViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ram' | 'rom' | 'registers'>('all');

  if (!data || !data.registers) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No CPU Architecture Data</div>;
  }

  const { activeUnit, cyclePhase, registers, buses, ram, rom, aluOperation, logMessage } = data;

  const phaseColors: Record<string, { bg: string; text: string; ring: string }> = {
    BOOT: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500/50' },
    FETCH: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/50' },
    DECODE: { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/50' },
    EXECUTE: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/50' },
    STORE: { bg: 'bg-rose-500/20', text: 'text-rose-400', ring: 'ring-rose-500/50' },
    COMPLETE: { bg: 'bg-teal-500/20', text: 'text-teal-400', ring: 'ring-teal-500/50' },
  };

  const currentPhaseStyle = phaseColors[cyclePhase] || phaseColors.FETCH;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Top Banner: Cycle Phase & System Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${currentPhaseStyle.bg} ${currentPhaseStyle.text} border border-current`}>
                Phase: {cyclePhase}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Active Unit: <strong className="text-slate-800 dark:text-slate-200">{activeUnit}</strong>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 font-mono mt-0.5">
              {logMessage}
            </p>
          </div>
        </div>

        {/* Live Bus Signals Preview */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${buses.controlBus.active ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-400 border-slate-300 dark:border-slate-700'}`}>
            Ctrl: {buses.controlBus.signal}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${buses.addressBus.active ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40' : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-400 border-slate-300 dark:border-slate-700'}`}>
            Addr: {buses.addressBus.address}
          </span>
        </div>
      </div>

      {/* Main Hardware Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* COLUMN 1: CPU (Control Unit, ALU, Registers, Cache) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 flex flex-col gap-3 shadow-lg relative">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                CPU (Central Processing Unit)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Clock: Sync
            </span>
          </div>

          {/* Control Unit & ALU Blocks */}
          <div className="grid grid-cols-2 gap-2">
            {/* Control Unit (CU) */}
            <div
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                activeUnit === 'CU'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/40 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase">Control Unit (CU)</span>
                <Activity className={`w-3.5 h-3.5 ${activeUnit === 'CU' ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                Decodes opcodes & generates control bus signals.
              </p>
            </div>

            {/* Arithmetic Logic Unit (ALU) */}
            <div
              className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                activeUnit === 'ALU'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase">ALU</span>
                <Zap className={`w-3.5 h-3.5 ${activeUnit === 'ALU' ? 'text-emerald-500 animate-bounce' : 'text-slate-400'}`} />
              </div>
              {aluOperation ? (
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-300 mt-1">
                  {aluOperation.operandA} + {aluOperation.operandB} = {aluOperation.result}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
                  Executes arithmetic (ADD/SUB) & logic (AND/OR).
                </p>
              )}
            </div>
          </div>

          {/* CPU Internal Registers */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Internal CPU Registers
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono">
              {/* PC */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'PC' ? 'bg-blue-500/20 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">PC (Program Counter)</span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-300 truncate">{registers.PC}</span>
              </div>

              {/* IR */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'IR' ? 'bg-purple-500/20 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">IR (Instr Register)</span>
                <span className="text-xs font-black text-purple-600 dark:text-purple-300 truncate">{registers.IR}</span>
              </div>

              {/* MAR */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'MAR' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-900 dark:text-cyan-200 ring-2 ring-cyan-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">MAR (Addr Register)</span>
                <span className="text-xs font-black text-cyan-600 dark:text-cyan-300 truncate">{registers.MAR}</span>
              </div>

              {/* MDR */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'MDR' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">MDR (Data Buffer)</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-300 truncate">{registers.MDR}</span>
              </div>

              {/* ACC */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'ALU' || activeUnit === 'RAM' ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">ACC (Accumulator)</span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-300 truncate">{registers.ACC}</span>
              </div>

              {/* R1 */}
              <div className={`p-2 rounded-lg border flex flex-col ${activeUnit === 'CU' ? 'bg-lime-500/20 border-lime-500 text-lime-900 dark:text-lime-200 ring-2 ring-lime-500/40' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <span className="text-[9px] text-slate-400">R1 (General Reg)</span>
                <span className="text-xs font-black text-lime-600 dark:text-lime-300 truncate">{registers.R1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: SYSTEM TRI-BUS HIGHWAY (Control, Address, Data Bus) */}
        <div className="lg:col-span-2 flex flex-col justify-around py-2 px-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <div className="text-center font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
            System Buses
          </div>

          {/* Control Bus */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-amber-500 font-bold px-1">
              <span>Control Bus</span>
              <span>{buses.controlBus.signal}</span>
            </div>
            <div className={`h-2 rounded-full transition-all ${buses.controlBus.active ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}`} />
          </div>

          {/* Address Bus */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-blue-500 font-bold px-1">
              <span>Address Bus →</span>
              <span>{buses.addressBus.address}</span>
            </div>
            <div className={`h-2 rounded-full transition-all ${buses.addressBus.active ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}`} />
          </div>

          {/* Data Bus */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-emerald-500 font-bold px-1">
              <span className="flex items-center gap-1">
                {buses.dataBus.direction === 'to-cpu' ? <ArrowLeft className="w-3 h-3" /> : buses.dataBus.direction === 'to-memory' ? <ArrowRight className="w-3 h-3" /> : null}
                Data Bus
              </span>
              <span className="truncate max-w-[70px]">{buses.dataBus.data}</span>
            </div>
            <div className={`h-2.5 rounded-full transition-all ${buses.dataBus.active ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}`} />
          </div>
        </div>

        {/* COLUMN 3: PRIMARY MEMORY (RAM, ROM & SECONDARY STORAGE) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Primary Memory & ROM Firmware
              </h3>
            </div>

            {/* RAM / ROM Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2 py-0.5 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('ram')}
                className={`px-2 py-0.5 rounded ${activeTab === 'ram' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}
              >
                RAM
              </button>
              <button
                onClick={() => setActiveTab('rom')}
                className={`px-2 py-0.5 rounded ${activeTab === 'rom' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}
              >
                ROM
              </button>
            </div>
          </div>

          {/* RAM Table (Volatile Memory) */}
          {(activeTab === 'all' || activeTab === 'ram') && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span>RAM (Random Access Memory - Volatile)</span>
                <span className="text-[9px] font-mono text-slate-400">Read / Write</span>
              </div>
              <div className="grid grid-cols-2 gap-1 font-mono text-[11px] max-h-40 overflow-y-auto pr-1">
                {ram.map((cell) => (
                  <div
                    key={cell.address}
                    className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
                      cell.highlight
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-slate-400">{cell.address}</span>
                      <span className="text-[10px] font-bold truncate max-w-[70px]">{cell.label || cell.type}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-300 truncate max-w-[80px]">
                      {cell.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROM Firmware (Non-Volatile BIOS/UEFI) */}
          {(activeTab === 'all' || activeTab === 'rom') && (
            <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <span>ROM (Read-Only Memory - Non-Volatile)</span>
                <span className="text-[9px] font-mono text-slate-400">BIOS / POST</span>
              </div>
              <div className="flex flex-col gap-1 font-mono text-[10px]">
                {rom.slice(0, 2).map((cell) => (
                  <div
                    key={cell.address}
                    className={`p-1.5 rounded-lg border flex items-center justify-between ${
                      cell.highlight
                        ? 'bg-purple-500/20 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/40 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-bold">{cell.address}: {cell.label}</span>
                    <span className="text-purple-600 dark:text-purple-300 font-bold truncate max-w-[130px]">{cell.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Storage (SSD / Hard Disk) */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-bold">Secondary Storage (SSD / NVMe):</span>
            </div>
            <span className="font-mono font-semibold text-slate-500">Persistent OS & File System</span>
          </div>
        </div>
      </div>

      {/* Concept Architecture Breakdown Card */}
      <div className="bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-3.5 flex flex-col gap-2 shadow-sm shrink-0">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Computer Architecture Fundamentals
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            Von Neumann Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              CPU (CU + ALU + Registers)
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
              The brain of the computer. CU decodes instructions, ALU performs calculations, and ultra-fast registers (PC, IR, MAR, MDR, ACC) hold active cycle state.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              RAM vs ROM Memory
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
              <strong>RAM</strong> is fast, volatile read/write memory for active apps. <strong>ROM</strong> is non-volatile permanent memory holding firmware (BIOS/UEFI) and boot code.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Tri-Bus System (Control, Addr, Data)
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
              Address bus selects physical memory cell, Data bus transfers binary words, and Control bus synchronizes Read/Write pulses with clock cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
