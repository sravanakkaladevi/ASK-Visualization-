import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Search,
  Network,
  GitFork,
  Layers,
  Cpu,
  ChevronRight,
  Link2,
  Globe,
  Workflow,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  Hash,
  Code2,
  TrendingUp,
  Zap,
  Box,
  Server,
  Database,
  Layout,
  Terminal,
} from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { getAllAlgorithms } from '../algorithms/registry';
import { Category, AlgorithmMeta } from '../types/algorithm';

interface SidebarProps {
  onSelectAlgorithm: (id: string) => void;
}

const categoryIcons: Record<Category, React.FC<{ className?: string }>> = {
  'computer-fundamentals': Cpu,
  'programming-fundamentals': Code2,
  sorting: BarChart3,
  searching: Search,
  graph: Network,
  'linked-list': Link2,
  'stack-queue': Layers,
  tree: GitFork,
  hashing: Hash,
  'recursion-backtracking': Code2,
  'dynamic-programming': TrendingUp,
  greedy: Zap,
  heap: Box,
  'computer-networks': Globe,
  os: Server,
  dbms: Database,
  'software-engineering': Workflow,
  'system-design': Cpu,
  'web-dev': Layout,
  'full-stack': Layers,
  devops: Terminal,
  'cloud-deployment': Server,
};

const categoryNames: Record<Category, string> = {
  'computer-fundamentals': 'Computer Fundamentals',
  'programming-fundamentals': 'Programming Fundamentals',
  sorting: 'Sorting',
  searching: 'Searching',
  graph: 'Graph Algorithms',
  'linked-list': 'Linked List',
  'stack-queue': 'Stack & Queue',
  tree: 'Trees',
  hashing: 'Hashing',
  'recursion-backtracking': 'Recursion & Backtracking',
  'dynamic-programming': 'Dynamic Programming',
  greedy: 'Greedy',
  heap: 'Heap / Priority Queue',
  'computer-networks': 'Computer Networks',
  os: 'Operating Systems',
  dbms: 'DBMS',
  'software-engineering': 'Software Engineering',
  'system-design': 'System Design',
  'web-dev': 'Web Development',
  'full-stack': 'Full Stack Development',
  devops: 'DevOps',
  'cloud-deployment': 'Cloud & Deployment',
};

export const Sidebar: React.FC<SidebarProps> = ({ onSelectAlgorithm }) => {
  const navigate = useNavigate();
  const { currentAlgorithmId, sidebarOpen, toggleSidebar, focusMode } = useAlgorithmStore();

  const allAlgorithms = getAllAlgorithms();
  const categoriesList = Object.keys(categoryNames) as Category[];

  // If focus mode is enabled, sidebar automatically collapses
  const isExpanded = sidebarOpen && !focusMode;

  const handleTopicClick = (algo: AlgorithmMeta) => {
    onSelectAlgorithm(algo.id);
    navigate(`/visualizer/${algo.id}`);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 280 : 68,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="relative bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full overflow-hidden shrink-0 z-20 shadow-lg transition-colors duration-300 select-none"
    >
      {/* Header Controls inside Sidebar */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs transition-colors overflow-hidden"
          title="Dashboard"
        >
          <Home className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap font-extrabold uppercase tracking-wider"
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          title={isExpanded ? 'Collapse Sidebar (Cmd/Ctrl + B)' : 'Expand Sidebar'}
        >
          {isExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
      </div>

      {/* Categories & Topics List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5">
        {categoriesList.map((catKey) => {
          const items = allAlgorithms.filter((a) => a.meta.category === catKey);
          if (items.length === 0) return null;

          const Icon = categoryIcons[catKey] || BarChart3;
          const activeCount = items.filter((a) => a.meta.implemented).length;

          return (
            <div key={catKey} className="flex flex-col gap-1.5">
              {/* Category Header */}
              <div
                className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 overflow-hidden"
                title={!isExpanded ? `${categoryNames[catKey]} (${activeCount}/${items.length})` : undefined}
              >
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between w-full min-w-0"
                    >
                      <span className="truncate text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-extrabold">
                        {categoryNames[catKey]}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1">
                        {activeCount}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Topics under Category */}
              <div className="flex flex-col gap-0.5">
                {items.map((algo) => {
                  const meta = algo.meta;
                  const isActive = currentAlgorithmId === meta.id;

                  return (
                    <button
                      key={meta.id}
                      onClick={() => handleTopicClick(meta)}
                      title={!isExpanded ? `${meta.name} ${!meta.implemented ? '(Coming Soon)' : ''}` : undefined}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive && meta.implemented
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                          : meta.implemented
                          ? 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                          : 'text-slate-400 dark:text-slate-600 cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isActive ? 'bg-white animate-pulse' : meta.implemented ? 'bg-blue-500' : 'bg-slate-400 dark:bg-slate-700'
                          }`}
                        ></span>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -5 }}
                              className="truncate text-left"
                            >
                              {meta.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {isExpanded && (
                        <div className="shrink-0 ml-1">
                          {meta.implemented ? (
                            isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span className="text-[9px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-800/80 text-slate-500 px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.aside>
  );
};
