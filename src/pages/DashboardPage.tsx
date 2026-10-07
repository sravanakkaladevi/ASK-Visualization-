import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Search,
  Network,
  GitFork,
  Layers,
  Cpu,
  Link2,
  Globe,
  Workflow,
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  Code2,
  TrendingUp,
  Hash,
  Box,
  Server,
  Database,
  Layout,
  Terminal,
  Github,
  Heart,
} from 'lucide-react';
import { getAllAlgorithms, getImplementedAlgorithms } from '../algorithms/registry';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { Category, AlgorithmMeta } from '../types/algorithm';

const categoryInfo: Record<
  Category,
  { name: string; description: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  'computer-fundamentals': {
    name: 'Computer Fundamentals',
    description: 'Source code compilation, Compiler Lexer/AST, CPU & Memory execution flow.',
    icon: Cpu,
    color: 'from-blue-600 to-cyan-600',
  },
  'programming-fundamentals': {
    name: 'Programming Fundamentals',
    description: 'Variables, Functions, OOP Class to Object instantiation & Memory allocation.',
    icon: Code2,
    color: 'from-cyan-600 to-teal-600',
  },
  sorting: {
    name: 'Sorting Algorithms',
    description: 'Bubble, Selection, Insertion, Merge, Quick & Heap Sort animations.',
    icon: BarChart3,
    color: 'from-blue-600 to-indigo-600',
  },
  searching: {
    name: 'Searching Algorithms',
    description: 'Linear & Binary Search with boundary pointer tracking.',
    icon: Search,
    color: 'from-amber-500 to-orange-600',
  },
  graph: {
    name: 'Graph Algorithms',
    description: 'BFS, DFS, Shortest Path, Topological Sort & Spanning Trees.',
    icon: Network,
    color: 'from-emerald-500 to-teal-600',
  },
  'linked-list': {
    name: 'Linked List',
    description: 'Singly/Doubly Linked List reversal, insertions & cycle detection.',
    icon: Link2,
    color: 'from-cyan-500 to-blue-600',
  },
  'stack-queue': {
    name: 'Stack & Queue',
    description: 'LIFO Stack & FIFO Queue push, pop, enqueue & dequeue operations.',
    icon: Layers,
    color: 'from-purple-500 to-violet-600',
  },
  tree: {
    name: 'Tree Traversal & BST',
    description: 'In-order, Pre-order, Post-order BST traversals & balance operations.',
    icon: GitFork,
    color: 'from-green-500 to-emerald-600',
  },
  hashing: {
    name: 'Hashing & Hash Tables',
    description: 'Hash functions, separate chaining & open addressing collision resolution.',
    icon: Hash,
    color: 'from-rose-500 to-pink-600',
  },
  'recursion-backtracking': {
    name: 'Recursion & Backtracking',
    description: 'Call stack visualization, N-Queens, Subsets & Maze solving.',
    icon: Code2,
    color: 'from-fuchsia-500 to-purple-600',
  },
  'dynamic-programming': {
    name: 'Dynamic Programming',
    description: 'Memoization tables, 0/1 Knapsack, Coin Change & LCS grid DP.',
    icon: TrendingUp,
    color: 'from-sky-500 to-indigo-600',
  },
  greedy: {
    name: 'Greedy Algorithms',
    description: 'Activity Selection, Fractional Knapsack & Huffman Coding trees.',
    icon: Zap,
    color: 'from-yellow-500 to-amber-600',
  },
  heap: {
    name: 'Heap / Priority Queue',
    description: 'Min-Heap and Max-Heap insertion, bubble-up & heapify down.',
    icon: Box,
    color: 'from-violet-500 to-purple-700',
  },
  'computer-networks': {
    name: 'Computer Networks',
    description: 'OSI 7-Layer model, TCP Handshake & DNS Query flow.',
    icon: Globe,
    color: 'from-teal-500 to-cyan-600',
  },
  os: {
    name: 'Operating Systems',
    description: 'Processes, Threads, Context Switching, Memory Allocation & Scheduling.',
    icon: Server,
    color: 'from-slate-600 to-zinc-700',
  },
  dbms: {
    name: 'DBMS & Databases',
    description: 'Relational SQL queries, Indexing, Transactions & Normalization.',
    icon: Database,
    color: 'from-amber-600 to-yellow-600',
  },
  'software-engineering': {
    name: 'Software Engineering & SDLC',
    description: 'Waterfall Model, Agile/Scrum Sprint Lifecycle & SRS Analysis.',
    icon: Workflow,
    color: 'from-blue-500 to-indigo-500',
  },
  'system-design': {
    name: 'System Design Architecture',
    description: 'HLD System Architecture, Round-Robin Load Balancer, Redis Cache & Queues.',
    icon: Cpu,
    color: 'from-indigo-600 to-blue-700',
  },
  'web-dev': {
    name: 'Web Development',
    description: 'HTML DOM structure, CSS Box Model/Flexbox & JavaScript Promises.',
    icon: Layout,
    color: 'from-orange-500 to-amber-600',
  },
  'full-stack': {
    name: 'Full Stack Development',
    description: 'MERN Stack end-to-end request/response workflow & JWT auth.',
    icon: Layers,
    color: 'from-emerald-600 to-teal-700',
  },
  devops: {
    name: 'DevOps & CI/CD',
    description: 'Linux terminal commands, Git visual workflow & Product Deployment pipeline.',
    icon: Terminal,
    color: 'from-purple-600 to-violet-700',
  },
  'cloud-deployment': {
    name: 'Cloud & Deployment',
    description: 'Containers, Docker, Kubernetes & Nginx reverse proxy production setup.',
    icon: Server,
    color: 'from-sky-600 to-blue-700',
  },
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, recentlyViewed, completedAlgorithms } = useAlgorithmStore();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const allTopics = getAllAlgorithms();
  const implementedTopics = getImplementedAlgorithms();

  // Search filter
  const filteredTopics = allTopics.filter((t) => {
    const matchesSearch =
      t.meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meta.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meta.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || t.meta.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTopic = (algo: AlgorithmMeta) => {
    navigate(`/visualizer/${algo.id}`);
  };

  const categoriesList = (Object.keys(categoryInfo) as Category[]).filter(
    (catKey) => allTopics.some((t) => t.meta.category === catKey)
  );

  // Progress calculations
  const totalImplementedCount = implementedTopics.length;
  const completedCount = completedAlgorithms.length;
  const progressPercent = Math.round((completedCount / totalImplementedCount) * 100) || 0;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 flex flex-col gap-10 transition-colors duration-300">

      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-8 md:p-12 text-white shadow-2xl border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 w-fit">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Interactive Code Execution & Visualizers</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Learn Algorithms by Watching Them Execute.
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Visualize data structures, algorithms, computer networks, and system design concepts step by step with synchronized code and pitched audio feedback.
          </p>

          {/* Search bar inside Hero */}
          <div className="relative max-w-xl mt-2">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g., 'binary', 'bfs', 'load balancer', 'tcp')..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl backdrop-blur-md"
            />
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="#categories"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Algorithms</span>
            </a>
            <button
              onClick={() => setSelectedCategoryFilter('system-design')}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>System Design</span>
            </button>
          </div>
        </div>
      </section>

      {/* Progress & Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DSA Progress</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{progressPercent}%</span>
            <div className="w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Modules</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{completedCount} / {totalImplementedCount}</span>
            <span className="text-[11px] text-slate-500 font-mono">Interactive step runs</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interactive Modules</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalImplementedCount} Active</span>
            <span className="text-[11px] text-slate-500 font-mono">Ready to play</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900">
            <Play className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Curriculum Scope</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{allTopics.length} Topics</span>
            <span className="text-[11px] text-slate-500 font-mono">14 Categories</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Continue Learning / Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Continue Learning & Recently Viewed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewed.map((id) => {
              const topic = allTopics.find((t) => t.meta.id === id);
              if (!topic) return null;
              const meta = topic.meta;
              const isCompleted = completedAlgorithms.includes(id);

              return (
                <div
                  key={id}
                  onClick={() => handleSelectTopic(meta)}
                  className="group bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {meta.category}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {meta.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Launch Visualizer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Categories Section */}
      <section id="categories" className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curriculum Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse topics across Data Structures, Algorithms, Computer Networks, and System Architecture.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Topics ({allTopics.length})
            </button>

            {categoriesList.map((catKey) => {
              const info = categoryInfo[catKey];
              const count = allTopics.filter((t) => t.meta.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategoryFilter(catKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategoryFilter === catKey
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {info.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((catKey) => {
            const info = categoryInfo[catKey];
            const Icon = info.icon;
            const categoryTopics = allTopics.filter((t) => t.meta.category === catKey);
            const activeCount = categoryTopics.filter((t) => t.meta.implemented).length;

            if (selectedCategoryFilter !== 'all' && selectedCategoryFilter !== catKey) return null;

            return (
              <div
                key={catKey}
                className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl flex flex-col justify-between gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${info.color} text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                          {info.name}
                        </h3>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {activeCount} Implemented / {categoryTopics.length} Total
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {info.description}
                  </p>

                  {/* Topics List inside Category Card */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {categoryTopics.map((topic) => {
                      const meta = topic.meta;
                      return (
                        <button
                          key={meta.id}
                          onClick={() => handleSelectTopic(meta)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                            meta.implemented
                              ? 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                              : 'opacity-70 text-slate-500 dark:text-slate-500 cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full ${meta.implemented ? 'bg-blue-500' : 'bg-slate-400 dark:bg-slate-600'}`}></span>
                            <span className="truncate">{meta.name}</span>
                          </div>

                          {meta.implemented ? (
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          ) : (
                            <span className="text-[10px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded shrink-0">
                              Coming Soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filtered Search Results Grid if searching */}
      {searchQuery && (
        <section className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Search Results for "{searchQuery}" ({filteredTopics.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const meta = topic.meta;
              return (
                <div
                  key={meta.id}
                  onClick={() => handleSelectTopic(meta)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    meta.implemented
                      ? 'bg-white/90 dark:bg-slate-900 border-blue-500/40 hover:border-blue-500 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {meta.category}
                      </span>
                      {meta.implemented ? (
                        <span className="text-xs font-bold text-emerald-500">Active</span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Coming Soon</span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{meta.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{meta.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer / Attribution */}
      <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" />
          <span>by <strong className="text-slate-800 dark:text-slate-200 font-bold">Sravan Akkaladevi</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/sravanakkaladevi/ASK-Visualization-"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-500 transition-colors font-medium"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>MIT License © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};
