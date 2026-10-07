import React, { useState } from 'react';
import { Copy, Check, Code2, PanelRightClose } from 'lucide-react';
import { CodeSnippets, Language } from '../types/algorithm';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

interface CodePanelProps {
  code: CodeSnippets;
  highlightedLines: number[];
}

const languages: { id: Language; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'javascript', label: 'JavaScript' },
];

export const CodePanel: React.FC<CodePanelProps> = ({ code, highlightedLines }) => {
  const { toggleRightPanel } = useAlgorithmStore();
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);

  const activeCode = code[activeLang] || code.python || code.javascript || code.typescript || '';
  const lines = activeCode.trim().split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl transition-colors duration-300">
      {/* Language Selector Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value as Language)}
            className="text-xs font-mono font-semibold px-2 py-1 rounded-lg bg-blue-600 text-white border-none outline-none cursor-pointer shadow-md shadow-blue-500/20 appearance-none pr-6 hover:bg-blue-700 transition-colors"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/50"
            title="Copy code snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={toggleRightPanel}
            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/50"
            title="Close right side panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
        {lines.map((lineContent, index) => {
          const lineNumber = index + 1;
          const isHighlighted = highlightedLines.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={`flex items-start rounded px-2 py-0.5 transition-colors duration-150 ${
                isHighlighted
                  ? 'bg-blue-500/15 dark:bg-blue-500/20 border-l-4 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-100 font-semibold shadow-inner'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-400'
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-8 select-none text-right pr-4 text-xs font-mono ${
                  isHighlighted ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {lineNumber}
              </span>

              {/* Line Code */}
              <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-xs md:text-sm">
                <code className={isHighlighted ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-800 dark:text-slate-300'}>{lineContent}</code>
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
