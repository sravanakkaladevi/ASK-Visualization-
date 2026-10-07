import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from 'lucide-react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

export const Player: React.FC = () => {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    setCurrentStepIndex,
    nextStep,
    prevStep,
    togglePlay,
    restart,
    setSpeed,
  } = useAlgorithmStore();

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        restart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextStep, prevStep, restart]);

  // requestAnimationFrame playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const stepIntervalMs = Math.max(50, 1000 / speed);

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= stepIntervalMs) {
        lastTimeRef.current = timestamp;
        if (currentStepIndex < totalSteps - 1) {
          nextStep();
        } else {
          useAlgorithmStore.getState().pause();
          return;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isPlaying, speed, currentStepIndex, totalSteps, nextStep]);

  if (totalSteps === 0) return null;

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Step description bar */}
      <div className="flex items-center justify-between text-sm px-2 gap-4">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse shrink-0"></span>
          <span className="line-clamp-1">{currentStep?.description || 'Ready'}</span>
        </div>
        <div className="font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
          Step {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="relative w-full group flex items-center">
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Step scrubber"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        {/* Playback action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={restart}
            title="Restart (R)"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            title="Previous Step (Left Arrow)"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <button
            onClick={nextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Next Step (Right Arrow)"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
          <Gauge className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Speed:</span>
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeed(spd)}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                speed === spd
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
