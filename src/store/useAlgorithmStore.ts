import { create } from 'zustand';
import { Step, ArrayState } from '../types/algorithm';
import { soundEffects } from '../services/soundEffects';

interface AlgorithmStoreState {
  currentAlgorithmId: string;
  input: unknown;
  steps: Step<unknown>[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  theme: 'dark' | 'light';
  isMuted: boolean;
  volume: number;

  // New UI state
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  focusMode: boolean;
  searchQuery: string;
  recentlyViewed: string[];
  completedAlgorithms: string[];

  // Actions
  setAlgorithmId: (id: string, defaultInput: unknown, steps: Step<unknown>[]) => void;
  setInput: (input: unknown, steps: Step<unknown>[]) => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  restart: () => void;
  setSpeed: (speed: number) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;

  // New UI Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleFocusMode: () => void;
  setFocusMode: (focus: boolean) => void;
  setSearchQuery: (query: string) => void;
  addRecentlyViewed: (id: string) => void;
  markCompleted: (id: string) => void;
}

// Helper to trigger audio based on current step
function triggerStepAudio(step: Step<unknown> | undefined, isEnd: boolean) {
  if (isEnd) {
    soundEffects.playCompletionFanfare();
    return;
  }

  if (!step) return;

  if (Array.isArray(step.state)) {
    const arrayState = step.state as ArrayState;
    const swappingEl = arrayState.find((e) => e.status === 'swapping');
    const comparingEl = arrayState.find((e) => e.status === 'comparing');
    const activeEl = arrayState.find((e) => e.status === 'pivot' || e.status === 'active');

    const targetEl = swappingEl || comparingEl || activeEl;
    if (targetEl) {
      soundEffects.playValueTone(targetEl.value, 5, 100, !!swappingEl);
    } else {
      soundEffects.playStepClick();
    }
  } else {
    soundEffects.playStepClick();
  }
}

const getInitialTheme = (): 'dark' | 'light' => {
  try {
    const saved = localStorage.getItem('algocraft-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return 'dark';
};

export const useAlgorithmStore = create<AlgorithmStoreState>((set, get) => ({
  currentAlgorithmId: 'bubble-sort',
  input: null,
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 1,
  theme: getInitialTheme(),
  isMuted: false,
  volume: 0.4,

  sidebarOpen: true,
  rightPanelOpen: true,
  focusMode: false,
  searchQuery: '',
  recentlyViewed: ['bubble-sort', 'bfs', 'binary-search', 'load-balancer'],
  completedAlgorithms: ['bubble-sort', 'binary-search', 'bfs'],

  setAlgorithmId: (id, defaultInput, steps) => {
    set({
      currentAlgorithmId: id,
      input: defaultInput,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
    get().addRecentlyViewed(id);
  },

  setInput: (input, steps) => {
    set({
      input,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setCurrentStepIndex: (index) => {
    const { steps, currentAlgorithmId, markCompleted } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStepIndex: index });
      const isEnd = index === steps.length - 1;
      triggerStepAudio(steps[index], isEnd);
      if (isEnd) {
        markCompleted(currentAlgorithmId);
      }
    }
  },

  nextStep: () => {
    const { currentStepIndex, steps, currentAlgorithmId, markCompleted } = get();
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      const isEnd = nextIdx === steps.length - 1;
      set({ currentStepIndex: nextIdx });
      triggerStepAudio(steps[nextIdx], isEnd);
      if (isEnd) {
        set({ isPlaying: false });
        markCompleted(currentAlgorithmId);
      }
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      set({ currentStepIndex: prevIdx });
      triggerStepAudio(steps[prevIdx], false);
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  restart: () => {
    const { steps } = get();
    set({ currentStepIndex: 0, isPlaying: false });
    if (steps.length > 0) {
      triggerStepAudio(steps[0], false);
    }
  },

  setSpeed: (speed) => set({ speed }),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('algocraft-theme', newTheme);
    } catch {
      // ignore
    }
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  setTheme: (theme) => set(() => {
    try {
      localStorage.setItem('algocraft-theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme };
  }),

  toggleMute: () => set((state) => {
    const nextMuted = !state.isMuted;
    soundEffects.setMuted(nextMuted);
    return { isMuted: nextMuted };
  }),

  setVolume: (volume) => set(() => {
    soundEffects.setVolume(volume);
    return { volume };
  }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),

  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setFocusMode: (focus) => set({ focusMode: focus }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentlyViewed: (id) => set((state) => {
    const filtered = state.recentlyViewed.filter((item) => item !== id);
    return { recentlyViewed: [id, ...filtered].slice(0, 6) };
  }),

  markCompleted: (id) => set((state) => {
    if (state.completedAlgorithms.includes(id)) return state;
    return { completedAlgorithms: [...state.completedAlgorithms, id] };
  }),
}));
