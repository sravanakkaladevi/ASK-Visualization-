import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, Edit3, Clock, HardDrive, Info, Maximize2, Minimize2, Tv, GitFork, Play, PanelRightClose, PanelRightOpen, ZoomIn, ZoomOut } from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { getAlgorithmById } from '../algorithms/registry';
import { GRAPH_PRESETS } from '../algorithms/graphPresets';
import { ArrayBars } from '../visualizers/ArrayBars';
import { GraphView } from '../visualizers/GraphView';
import { LinkedListView } from '../visualizers/LinkedListView';
import { StackQueueView } from '../visualizers/StackQueueView';
import { TreeView } from '../visualizers/TreeView';
import { SystemDesignView } from '../visualizers/SystemDesignView';
import { NetworkView } from '../visualizers/NetworkView';
import { OsiModelView } from '../visualizers/OsiModelView';
import { WaterfallView } from '../visualizers/WaterfallView';
import { MernView } from '../visualizers/MernView';
import { LinuxGitDevOpsView } from '../visualizers/LinuxGitDevOpsView';
import { CompFundView } from '../visualizers/CompFundView';
import { CpuArchitectureView } from '../visualizers/CpuArchitectureView';
import { ChessboardView, ChessboardState } from '../visualizers/ChessboardView';
import { LldView, LldState } from '../visualizers/LldView';
import { LinuxTerminalView, LinuxTerminalState } from '../visualizers/LinuxTerminalView';
import { HanoiView, HanoiState } from '../visualizers/HanoiView';
import { DpTableView, DpTableState } from '../visualizers/DpTableView';
import { Player } from '../components/Player';
import { ConceptDetailsPanel } from '../components/ConceptDetailsPanel';
import {
  ArrayState,
  GraphData,
  LinkedListState,
  StackQueueState,
  TreeState,
  SystemDesignState,
  NetworkState,
  SdlcState,
  OsiState,
  MernState,
  LinuxGitDevOpsState,
  CompFundState,
  CpuArchitectureState,
} from '../types/algorithm';
import { BinarySearchInput } from '../algorithms/binarySearch';

export const VisualizerPage: React.FC = () => {
  const { algorithmId: routeAlgoId } = useParams<{ algorithmId?: string }>();
  const {
    currentAlgorithmId,
    steps,
    currentStepIndex,
    setAlgorithmId,
    setInput,
    focusMode,
    toggleFocusMode,
    rightPanelOpen,
    toggleRightPanel,
  } = useAlgorithmStore();

  const targetId = routeAlgoId || currentAlgorithmId || 'bubble-sort';
  const algoDef = getAlgorithmById(targetId);
  const meta = algoDef?.meta;

  const [arrayInputStr, setArrayInputStr] = useState<string>('');
  const [targetInputVal, setTargetInputVal] = useState<number>(23);
  const [isEditingInput, setIsEditingInput] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  // Zoom controls for Canvas & Fullscreen
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(1))));
  const handleResetZoom = () => setZoomLevel(1);

  // Graph specific states
  const [selectedGraphPresetId, setSelectedGraphPresetId] = useState<string>('preset-dijkstra-7');
  const [selectedStartNode, setSelectedStartNode] = useState<string>('D');
  const [nQueensSize, setNQueensSize] = useState<number>(8);

  useEffect(() => {
    if (algoDef) {
      const defaultInput = algoDef.meta.defaultInput;
      const generatedSteps = algoDef.generateSteps(defaultInput);
      setAlgorithmId(algoDef.meta.id, defaultInput, generatedSteps);

      if (Array.isArray(defaultInput)) {
        setArrayInputStr(defaultInput.join(', '));
      } else if (typeof defaultInput === 'object' && defaultInput !== null && 'array' in defaultInput) {
        const bsInput = defaultInput as BinarySearchInput;
        setArrayInputStr(bsInput.array.join(', '));
        setTargetInputVal(bsInput.target);
      } else if (meta?.category === 'graph' && typeof defaultInput === 'object' && defaultInput !== null && 'nodes' in defaultInput) {
        const gData = defaultInput as GraphData;
        setSelectedStartNode(gData.startNodeId || gData.nodes[0]?.id || 'A');
      } else if (meta?.id === 'n-queens' && typeof defaultInput === 'number') {
        setNQueensSize(defaultInput);
      }
      setIsEditingInput(false);
      setInputError(null);
    }
  }, [targetId, setAlgorithmId]);

  if (!algoDef || !meta) {
    return (
      <div className="flex-1 p-12 text-center flex flex-col items-center justify-center gap-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Topic Not Found</h3>
        <p className="text-sm text-slate-500 font-mono">The requested algorithm or concept was not found in the registry.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  // Determine which categories support custom array or graph input
  const isSearchAlgo = meta.id === 'binary-search' || meta.id === 'linear-search';
  const supportsArrayInput = meta.category === 'sorting' || isSearchAlgo || meta.category === 'linked-list' || meta.category === 'tree';
  const isGraphAlgo = meta.category === 'graph';
  const isStackOrQueue = meta.id === 'stack-operations' || meta.id === 'queue-operations' || meta.id === 'deque';

  const handleApplyCustomInput = () => {
    try {
      const parsedArray = arrayInputStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => {
          const num = Number(s);
          if (isNaN(num)) throw new Error(`Invalid number: "${s}"`);
          return num;
        });

      if (parsedArray.length === 0) throw new Error('Input cannot be empty.');
      if (parsedArray.length > 20) throw new Error('Please use at most 20 elements.');

      if (meta.id === 'binary-search') {
        const sortedArray = [...parsedArray].sort((a, b) => a - b);
        const newInput: BinarySearchInput = { array: sortedArray, target: targetInputVal };
        const newSteps = algoDef.generateSteps(newInput);
        setInput(newInput, newSteps);
        setArrayInputStr(sortedArray.join(', '));
      } else if (meta.id === 'linear-search') {
        const newInput: BinarySearchInput = { array: parsedArray, target: targetInputVal };
        const newSteps = algoDef.generateSteps(newInput);
        setInput(newInput, newSteps);
      } else {
        const newSteps = algoDef.generateSteps(parsedArray);
        setInput(parsedArray, newSteps);
      }
      setIsEditingInput(false);
      setInputError(null);
    } catch (err: unknown) {
      setInputError((err as Error).message || 'Invalid input array format.');
    }
  };

  const handleRandomizeInput = () => {
    if (isSearchAlgo) {
      const count = 7 + Math.floor(Math.random() * 4);
      let arr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
      if (meta.id === 'binary-search') {
        arr = arr.sort((a, b) => a - b);
      }
      const target = arr[Math.floor(Math.random() * arr.length)];
      const newInput: BinarySearchInput = { array: arr, target };
      const newSteps = algoDef.generateSteps(newInput);
      setInput(newInput, newSteps);
      setArrayInputStr(arr.join(', '));
      setTargetInputVal(target);
    } else if (supportsArrayInput) {
      const count = 6 + Math.floor(Math.random() * 5);
      const arr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
      const newSteps = algoDef.generateSteps(arr);
      setInput(arr, newSteps);
      setArrayInputStr(arr.join(', '));
    } else if (isStackOrQueue) {
      const defaultInput = algoDef.meta.defaultInput;
      const newSteps = algoDef.generateSteps(defaultInput);
      setInput(defaultInput, newSteps);
    } else {
      const defaultInput = algoDef.meta.defaultInput;
      const newSteps = algoDef.generateSteps(defaultInput);
      setInput(defaultInput, newSteps);
    }
    setIsEditingInput(false);
    setInputError(null);
  };

  // Graph Preset Selection
  const handleGraphPresetChange = (presetId: string) => {
    setSelectedGraphPresetId(presetId);
    const preset = GRAPH_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const updatedGraphData: GraphData = {
        ...preset.data,
        startNodeId: selectedStartNode,
      };
      // Verify start node exists in preset
      const nodeExists = updatedGraphData.nodes.some((n) => n.id === selectedStartNode);
      if (!nodeExists) {
        const fallbackStart = updatedGraphData.nodes[0]?.id || 'A';
        setSelectedStartNode(fallbackStart);
        updatedGraphData.startNodeId = fallbackStart;
      }
      const newSteps = algoDef.generateSteps(updatedGraphData);
      setInput(updatedGraphData, newSteps);
    }
  };

  // Graph Start Node Selection
  const handleGraphStartNodeChange = (newStartNode: string) => {
    setSelectedStartNode(newStartNode);
    const preset = GRAPH_PRESETS.find((p) => p.id === selectedGraphPresetId) || GRAPH_PRESETS[0];
    const updatedGraphData: GraphData = {
      ...preset.data,
      startNodeId: newStartNode,
    };
    const newSteps = algoDef.generateSteps(updatedGraphData);
    setInput(updatedGraphData, newSteps);
  };

  // N-Queens Size Selection (4, 8, 16)
  const handleNQueensSizeChange = (newSize: number) => {
    setNQueensSize(newSize);
    const newSteps = algoDef.generateSteps(newSize);
    setInput(newSize, newSteps);
  };

  // Determine which visualizer to render based on topic metadata & ID
  const renderVisualizer = () => {
    if (!currentStep || !currentStep.state) return null;

    if (meta.id === 'osi-model') {
      return <OsiModelView data={(currentStep.state as OsiState) || { direction: 'down-client', activeLayerNumber: 7, layers: [], packetData: '', logMessage: '' }} />;
    }
    if (meta.id === 'waterfall-model' || meta.id === 'agile-sprint' || meta.id === 'cicd-pipeline' || ('stages' in (currentStep.state as Record<string, unknown>)) || ('phases' in (currentStep.state as Record<string, unknown>))) {
      return <WaterfallView data={currentStep.state as SdlcState} />;
    }
    if (meta.id === 'mern-stack') {
      return <MernView data={(currentStep.state as MernState) || { components: [], activeStepIndex: 0, logMessage: '' }} />;
    }
    if (meta.id === 'product-deployment' || meta.id === 'git-workflow') {
      return <LinuxGitDevOpsView data={(currentStep.state as LinuxGitDevOpsState) || { mode: 'product-deployment', logMessage: '' }} />;
    }
    if (meta.id === 'cpu-ram-architecture' || ('registers' in (currentStep.state as Record<string, unknown>) && 'buses' in (currentStep.state as Record<string, unknown>))) {
      return <CpuArchitectureView data={currentStep.state as CpuArchitectureState} />;
    }
    if (meta.id === 'compilation-flow') {
      return <CompFundView data={(currentStep.state as CompFundState) || { stages: [], currentStageId: '', logMessage: '' }} />;
    }
    if (meta.id === 'n-queens' || ('queens' in (currentStep.state as Record<string, unknown>))) {
      return <ChessboardView data={currentStep.state as ChessboardState} />;
    }
    if (meta.id === 'lld-ride-booking' || meta.id === 'class-object-oop' || ('classBlueprint' in (currentStep.state as Record<string, unknown>))) {
      return <LldView data={currentStep.state as LldState} />;
    }
    if (meta.id === 'linux-terminal' || ('command' in (currentStep.state as Record<string, unknown>) && 'stageName' in (currentStep.state as Record<string, unknown>))) {
      return <LinuxTerminalView data={currentStep.state as LinuxTerminalState} />;
    }
    if (meta.id === 'tower-of-hanoi' || ('pegs' in (currentStep.state as Record<string, unknown>))) {
      return <HanoiView data={currentStep.state as HanoiState} />;
    }
    if (meta.id === 'knapsack' || ('matrix' in (currentStep.state as Record<string, unknown>))) {
      return <DpTableView data={currentStep.state as DpTableState} />;
    }

    // Direct data format check for array state
    if (Array.isArray(currentStep.state)) {
      return <ArrayBars elements={currentStep.state as ArrayState} />;
    }

    if (isGraphAlgo || ('nodes' in (currentStep.state as Record<string, unknown>) && 'edges' in (currentStep.state as Record<string, unknown>) && 'startNodeId' in (currentStep.state as Record<string, unknown>))) {
      return (
        <GraphView
          data={(currentStep.state as GraphData) || { nodes: [], edges: [], startNodeId: 'A' }}
          metadata={currentStep.metadata}
        />
      );
    }

    if (meta.category === 'stack-queue' || ('items' in (currentStep.state as Record<string, unknown>))) {
      return <StackQueueView data={currentStep.state as StackQueueState} />;
    }

    if (meta.category === 'linked-list' || ('headIndex' in (currentStep.state as Record<string, unknown>))) {
      return <LinkedListView data={(currentStep.state as LinkedListState) || { nodes: [], headIndex: 0 }} headPointerName={String(currentStep.metadata?.headPointer || 'prev')} />;
    }

    if (meta.category === 'tree' || ('rootId' in (currentStep.state as Record<string, unknown>))) {
      return <TreeView data={(currentStep.state as TreeState) || { nodes: [], rootId: '', visitOrder: [] }} />;
    }

    if (meta.category === 'computer-networks' && ('devices' in (currentStep.state as Record<string, unknown>))) {
      return <NetworkView data={(currentStep.state as NetworkState)} />;
    }

    if (meta.category === 'software-engineering' && ('phases' in (currentStep.state as Record<string, unknown>))) {
      return <WaterfallView data={(currentStep.state as SdlcState)} />;
    }

    return <SystemDesignView data={(currentStep.state as SystemDesignState) || { nodes: [], edges: [] }} />;
  };

  // Available graph nodes for current preset
  const currentPreset = GRAPH_PRESETS.find((p) => p.id === selectedGraphPresetId) || GRAPH_PRESETS[0];

  // FULL SCREEN / FOCUS MODE VIEW
  if (focusMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col p-2.5 sm:p-3.5 gap-2 sm:gap-2.5 overflow-hidden select-none">
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">{meta.name}</h2>
            <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
              {meta.category}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleRightPanel}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                rightPanelOpen
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/40'
              }`}
              title={rightPanelOpen ? 'Close right code panel' : 'Open right code panel'}
            >
              {rightPanelOpen ? <PanelRightClose className="w-3.5 h-3.5 text-slate-300" /> : <PanelRightOpen className="w-3.5 h-3.5 text-blue-400" />}
              <span>{rightPanelOpen ? 'Hide Code' : 'Show Code'}</span>
            </button>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Press ESC or F</span>
            <button
              onClick={toggleFocusMode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Full Screen</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-0 overflow-hidden">
          <div className={`${rightPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-2.5 h-full overflow-hidden transition-all duration-300`}>
            <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-3.5 sm:p-4 overflow-y-auto flex flex-col justify-start shadow-2xl">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-blue-400" />
                  <span>Execution Canvas (Full Screen)</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.5 rounded-lg border border-slate-700/60">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 0.6}
                      className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      title="Zoom Out (-)"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded transition-colors"
                      title="Reset Zoom to 100% (Fit)"
                    >
                      {Math.round(zoomLevel * 100)}% Fit
                    </button>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 1.5}
                      className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      title="Zoom In (+)"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>

                  {!rightPanelOpen && (
                    <button
                      onClick={toggleRightPanel}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <PanelRightOpen className="w-3.5 h-3.5" />
                      <span>Open Code</span>
                    </button>
                  )}
                </div>
              </div>
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="my-auto w-full"
              >
                {renderVisualizer()}
              </div>
            </div>
            <div className="shrink-0 bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-slate-800">
              <Player />
            </div>
          </div>

          {rightPanelOpen && (
            <div className="lg:col-span-5 h-full overflow-y-auto transition-all duration-300">
              <ConceptDetailsPanel
                meta={meta}
                highlightedLines={currentStep?.highlightedLines || []}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // STANDARD VIEW MODE
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col gap-6 transition-colors duration-300">
      {/* Header & Meta Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg backdrop-blur-md transition-colors duration-300">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{meta.name}</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
              {meta.category}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{meta.description}</p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</div>
              <div className="text-xs font-mono text-amber-700 dark:text-amber-300 font-bold">
                {meta.timeComplexity.average}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Space</div>
              <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">{meta.spaceComplexity}</div>
            </div>
          </div>

          <button
            onClick={toggleFocusMode}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="Toggle Full Screen Mode (F)"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Full Screen</span>
          </button>
        </div>
      </div>

      {/* GRAPH SPECIFIC CONTROLS: Preset Topology & Start Node Selection */}
      {isGraphAlgo && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Graph Preset:</span>
              <select
                value={selectedGraphPresetId}
                onChange={(e) => handleGraphPresetChange(e.target.value)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
              >
                {GRAPH_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Vertex:</span>
              <div className="flex items-center gap-1">
                {currentPreset.data.nodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleGraphStartNodeChange(n.id)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedStartNode === n.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleGraphStartNodeChange(selectedStartNode)}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Reset Graph</span>
          </button>
        </div>
      )}

      {/* N-QUEENS CONTROLS: Select 4, 8, 16 Queens */}
      {meta.id === 'n-queens' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 flex-wrap">
            <Info className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Board Size (N Queens):
            </span>
            <div className="flex items-center gap-2">
              {[4, 8, 16].map((size) => (
                <button
                  key={size}
                  onClick={() => handleNQueensSizeChange(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    nQueensSize === size
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {size} Queens ({size}x{size})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNQueensSizeChange(nQueensSize)}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Board</span>
          </button>
        </div>
      )}

      {/* ARRAY CONTROLS: For Sorting and Searching */}
      {supportsArrayInput && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isSearchAlgo ? 'Array & Target Element:' : 'Custom Array Input:'}
            </span>

            {isEditingInput ? (
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <input
                  type="text"
                  value={arrayInputStr}
                  onChange={(e) => setArrayInputStr(e.target.value)}
                  placeholder="e.g. 10, 25, 30, 45, 60"
                  className="px-3 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isSearchAlgo && (
                  <input
                    type="number"
                    value={targetInputVal}
                    onChange={(e) => setTargetInputVal(Number(e.target.value))}
                    placeholder="Target"
                    className="w-20 px-2.5 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <button
                  onClick={handleApplyCustomInput}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-blue-700 dark:text-blue-300">
                  [{arrayInputStr}]
                </code>
                {isSearchAlgo && (
                  <span className="text-xs font-mono bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg">
                    Target: {targetInputVal}
                  </span>
                )}
                <button
                  onClick={() => setIsEditingInput(true)}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-700/50"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleRandomizeInput}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Randomize</span>
          </button>
        </div>
      )}

      {/* RESET BUTTON for other topics */}
      {!supportsArrayInput && !isGraphAlgo && (
        <div className="flex justify-end">
          <button
            onClick={handleRandomizeInput}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      )}

      {inputError && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-3 rounded-xl">
          {inputError}
        </div>
      )}

      {/* Main Workspace: Canvas + Details/Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${rightPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-4 transition-all duration-300`}>
          <div className="relative bg-white/90 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-colors duration-300">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Visual Execution Canvas
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Zoom Controls */}
                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.6}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    title="Reset Zoom to 100% (Fit)"
                  >
                    {Math.round(zoomLevel * 100)}% Fit
                  </button>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 1.5}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={toggleRightPanel}
                  className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/60 transition-colors"
                  title={rightPanelOpen ? 'Hide right side code panel' : 'Open right side code panel'}
                >
                  {rightPanelOpen ? (
                    <>
                      <PanelRightClose className="w-3.5 h-3.5" />
                      <span>Hide Code</span>
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="w-3.5 h-3.5" />
                      <span>Show Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleFocusMode}
                  className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  title="Full Screen (F)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </button>
              </div>
            </div>
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="w-full"
            >
              {renderVisualizer()}
            </div>
          </div>
          <Player />
        </div>

        {rightPanelOpen && (
          <div className="lg:col-span-5 h-[540px] transition-all duration-300">
            <ConceptDetailsPanel
              meta={meta}
              highlightedLines={currentStep?.highlightedLines || []}
            />
          </div>
        )}
      </div>
    </div>
  );
};
