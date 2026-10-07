import React from 'react';
import { motion } from 'framer-motion';
import { Box, Code2, Cpu, ArrowRight } from 'lucide-react';

export interface LldClassProperty {
  name: string;
  type: string;
  value?: string;
}

export interface LldClassMethod {
  name: string;
  returnType: string;
  params?: string;
}

export interface LldClass {
  id: string;
  className: string;
  type: 'class' | 'interface' | 'abstract';
  properties: LldClassProperty[];
  methods: LldClassMethod[];
}

export interface LldObjectInstance {
  id: string;
  classRefId: string;
  objectName: string;
  fieldValues: Record<string, string>;
  status: 'instantiating' | 'active' | 'completed';
}

export interface LldState {
  systemName: string;
  classes: LldClass[];
  activeClassId: string;
  objectInstance?: LldObjectInstance;
  logMessage: string;
}

interface LldViewProps {
  data: LldState;
}

export const LldView: React.FC<LldViewProps> = ({ data }) => {
  if (!data || !data.classes || data.classes.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-mono text-sm">No LLD Diagram Data</div>;
  }

  const activeClass = data.classes.find((c) => c.id === data.activeClassId) || data.classes[0];
  const obj = data.objectInstance;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
            LLD
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{data.systemName} Architecture Blueprint</h3>
            <p className="text-xs text-slate-400 font-mono">{data.logMessage}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
          UML Class & Object Diagram
        </span>
      </div>

      {/* Main Workspace: Class Blueprint vs Instantiated Object */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: UML Class Blueprint */}
        <div className="md:col-span-6 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            Class Blueprint (Design Phase)
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 rounded-xl border border-indigo-500/40 shadow-xl overflow-hidden flex flex-col"
          >
            {/* UML Class Header */}
            <div className="bg-indigo-600/20 px-4 py-3 border-b border-indigo-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 font-mono uppercase">&lt;&lt;{activeClass.type}&gt;&gt;</span>
              <h4 className="text-base font-extrabold text-white font-mono">{activeClass.className}</h4>
              <span className="text-[10px] text-slate-400 font-mono">UML Spec</span>
            </div>

            {/* Properties Section */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 font-mono uppercase tracking-wider">
                Attributes / Properties
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {activeClass.properties.map((prop, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                    <span className="text-indigo-400 font-semibold">- {prop.name}:</span>
                    <span className="text-slate-400 text-[11px]">{prop.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Methods Section */}
            <div className="p-4 bg-slate-950/20">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 font-mono uppercase tracking-wider">
                Methods & Operations
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {activeClass.methods.map((method, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                    <span className="text-emerald-400 font-semibold">+ {method.name}({method.params || ''}):</span>
                    <span className="text-slate-400 text-[11px]">{method.returnType}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Indicator */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Right Column: Instantiated Object in Heap Memory */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            Heap Memory Object (Runtime Phase)
          </div>

          {obj ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-slate-900/90 rounded-xl border border-emerald-500/50 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-emerald-600/20 px-4 py-3 border-b border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-extrabold text-emerald-300 font-mono">new {obj.objectName}()</h4>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  {obj.status.toUpperCase()}
                </span>
              </div>

              <div className="p-4 bg-slate-950/60 font-mono text-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Runtime Heap Memory Address: 0x7FFF94B2
                </span>

                {Object.entries(obj.fieldValues).map(([key, val], idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded border border-slate-800">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-emerald-400 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full bg-slate-900/40 rounded-xl border border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 text-xs font-mono text-center gap-2">
              <Box className="w-8 h-8 opacity-40" />
              <span>Click Play to instantiate class object in memory</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
