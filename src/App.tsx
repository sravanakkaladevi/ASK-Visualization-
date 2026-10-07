import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VisualizerPage } from './pages/VisualizerPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAlgorithmStore } from './store/useAlgorithmStore';
import { getAlgorithmById } from './algorithms/registry';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme, focusMode, toggleFocusMode, setAlgorithmId } = useAlgorithmStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global Keyboard shortcuts for Focus / Full Screen Mode ("F" to enter/exit, "ESC" to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFocusMode();
      } else if (e.key === 'Escape' && focusMode) {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, toggleFocusMode]);

  const handleSelectAlgorithm = (id: string) => {
    const algoDef = getAlgorithmById(id);
    if (algoDef) {
      const defaultInput = algoDef.meta.defaultInput;
      const steps = algoDef.generateSteps(defaultInput);
      setAlgorithmId(id, defaultInput, steps);
      navigate(`/visualizer/${id}`);
    }
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {!focusMode && <Header />}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!focusMode && <Sidebar onSelectAlgorithm={handleSelectAlgorithm} />}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/visualizer/:algorithmId" element={<VisualizerPage />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
            <Route path="/system-design" element={<DashboardPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
