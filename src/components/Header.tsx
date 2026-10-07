import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Maximize2,
  Minimize2,
  Lock,
  Github,
} from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { getAllAlgorithms } from '../algorithms/registry';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    sidebarOpen,
    toggleSidebar,
    focusMode,
    toggleFocusMode,
    searchQuery,
    setSearchQuery,
  } = useAlgorithmStore();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const allAlgorithms = getAllAlgorithms();
  const searchResults = searchQuery.trim()
    ? allAlgorithms.filter(
        (a) =>
          a.meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.meta.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Global Keyboard shortcuts for Focus Mode ("F") and Exit Focus ("ESC")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFocusMode();
      } else if (e.key === 'Escape') {
        if (focusMode) {
          e.preventDefault();
          useAlgorithmStore.getState().setFocusMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, toggleFocusMode]);

  return (
    <header className={`h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 transition-all duration-300 ${focusMode ? 'py-1 shadow-sm' : ''}`}>
      {/* LEFT: Branding & Home Route */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <PanelLeftOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        </button>

        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent leading-none">
              AlgoCraft
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Interactive DSA Engine</p>
          </div>
        </div>
      </div>

      {/* CENTER: Global Search Bar */}
      <div className="relative flex-1 max-w-xs md:max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            placeholder="Search algorithms... (e.g. 'bfs', 'binary', 'tcp')"
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>

        {/* Live Search Popup Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute top-10 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95">
            {searchResults.map((algo) => (
              <div
                key={algo.meta.id}
                onMouseDown={() => {
                  if (algo.meta.implemented) {
                    navigate(`/visualizer/${algo.meta.id}`);
                    setShowSearchDropdown(false);
                  }
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  algo.meta.implemented
                    ? 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                    : 'opacity-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bold">{algo.meta.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{algo.meta.category}</span>
                </div>
                {algo.meta.implemented ? (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3" /> Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Action Controls */}
      <div className="flex items-center gap-2">
        {/* Developer Attribution */}
        <a
          href="https://github.com/sravanakkaladevi/ASK-Visualization-"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-500/30 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:scale-105 shadow-sm"
          title="Developed by Sravan Akkaladevi on GitHub"
        >
          <Github className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>Developed by <strong className="font-extrabold text-blue-600 dark:text-blue-400">Sravan Akkaladevi</strong></span>
        </a>

        {/* Recording / Focus Mode Button */}
        <button
          onClick={toggleFocusMode}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none ${
            focusMode
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
              : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/50'
          }`}
          title="Toggle Recording Focus Mode (Key: F)"
        >
          {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />}
          <span className="hidden md:inline">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1 py-0.5 rounded">F</span>
        </button>

        {/* Audio Sound FX Controls */}
        <div className="relative flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
              isMuted
                ? 'text-rose-500 hover:bg-rose-500/10'
                : 'text-blue-600 dark:text-blue-400 hover:bg-blue-500/10'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors focus:outline-none"
            title="Adjust Volume"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {showVolumeSlider && (
            <div className="absolute right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-3 flex items-center gap-2 z-50 w-44">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] font-mono text-slate-500 w-6">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Light / Dark Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
