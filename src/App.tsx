import { useState, useCallback, useEffect } from 'react';
import { ExtinguisherType } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { HeaderHUD } from './components/HeaderHUD';
import { ControlDock } from './components/ControlDock';
import { InfoDrawer } from './components/InfoDrawer';
import { ScenarioModal } from './components/ScenarioModal';
import { QuizModal } from './components/QuizModal';
import { ComponentMetadata } from './utils/extinguisher3D';
import { playClickSound, playDischargeSound } from './utils/audio';

export default function App() {
  const [activeType, setActiveType] = useState<ExtinguisherType>('water');
  const [isExploded, setIsExploded] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0.8);
  const [isComparison, setIsComparison] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null);

  const [currentMode, setCurrentMode] = useState<1 | 2 | 3>(1);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Component Selection via Raycasting from ThreeCanvas
  const handleSelectComponent = useCallback((meta: ComponentMetadata | null) => {
    setSelectedComponent(meta);
    if (meta) {
      setIsInfoDrawerOpen(true);
    }
  }, []);

  const handleSprayingFinished = useCallback(() => {
    setIsSpraying(false);
  }, []);

  const handleSelectType = useCallback((type: ExtinguisherType) => {
    setActiveType(type);
    if (isComparison) {
      setIsComparison(false);
    }
  }, [isComparison]);

  const handleToggleExploded = useCallback(() => {
    if (isComparison) return;
    setIsExploded((prev) => !prev);
  }, [isComparison]);

  const handleToggleComparison = useCallback(() => {
    setIsComparison((prev) => {
      const next = !prev;
      if (next) {
        setIsExploded(false);
      }
      return next;
    });
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotate((prev) => !prev);
  }, []);

  const handleResetView = useCallback(() => {
    setIsExploded(false);
    setIsComparison(false);
    setIsAutoRotate(false);
    setSelectedComponent(null);
  }, []);

  const handleTriggerSpray = useCallback(() => {
    if (isSpraying || isComparison) return;
    setIsSpraying(true);
  }, [isSpraying, isComparison]);

  // Global Keyboard shortcuts for accessible exploration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1') handleSelectType('water');
      if (e.key === '2') handleSelectType('foam');
      if (e.key === '3') handleSelectType('drypowder');
      if (e.key === '4') handleSelectType('co2');
      if (e.key.toLowerCase() === 'e') handleToggleExploded();
      if (e.key.toLowerCase() === 'c') handleToggleComparison();
      if (e.key.toLowerCase() === 'r') handleResetView();
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isMuted) playDischargeSound(activeType);
        handleTriggerSpray();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectType, handleToggleExploded, handleToggleComparison, handleResetView, handleTriggerSpray, isMuted, activeType]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030813] font-rajdhani select-none">
      {/* 3D WebGL Scene Viewport */}
      <ThreeCanvas
        activeType={activeType}
        isExploded={isExploded}
        explodedAmount={explodedAmount}
        isComparison={isComparison}
        isAutoRotate={isAutoRotate}
        isSpraying={isSpraying}
        onSelectComponent={handleSelectComponent}
        onSprayingFinished={handleSprayingFinished}
      />

      {/* Top Header HUD */}
      <HeaderHUD
        currentMode={currentMode}
        onChangeMode={(mode) => setCurrentMode(mode)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onOpenInfoDrawer={() => setIsInfoDrawerOpen(true)}
      />

      {/* Floating Interactive 3D Component Inspection Tag (Top Center / Under HUD) */}
      {selectedComponent && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 max-w-sm w-[90%] bg-[rgba(6,20,38,0.96)] border border-cyan-400 rounded-xl p-3 shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-start justify-between gap-3 animate-fade-in pointer-events-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="font-orbitron font-bold text-xs text-white uppercase tracking-wide">
                {selectedComponent.name}
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-rajdhani leading-snug">
              {selectedComponent.description}
            </p>
          </div>
          <button
            onClick={() => {
              playClickSound();
              setSelectedComponent(null);
            }}
            className="text-slate-400 hover:text-white p-1"
            title="Tutup Sorotan"
          >
            ×
          </button>
        </div>
      )}

      {/* Comparison View Floating Indicators */}
      {isComparison && (
        <div className="absolute top-28 sm:top-24 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 bg-[rgba(6,20,38,0.92)] border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs text-cyan-300 font-orbitron font-bold shadow-lg">
          <span>PERBANDINGAN 4 MODEL: AIR • BUIH • DEBU KERING • CO₂</span>
        </div>
      )}

      {/* Collapsible Ergonomic Bottom Control Dock */}
      <ControlDock
        activeType={activeType}
        onSelectType={handleSelectType}
        isExploded={isExploded}
        onToggleExploded={handleToggleExploded}
        explodedAmount={explodedAmount}
        onChangeExplodedAmount={setExplodedAmount}
        isComparison={isComparison}
        onToggleComparison={handleToggleComparison}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        onResetView={handleResetView}
        isSpraying={isSpraying}
        onTriggerSpray={handleTriggerSpray}
        onOpenInfo={() => setIsInfoDrawerOpen(true)}
        isMuted={isMuted}
      />

      {/* Educational Information Drawer */}
      <InfoDrawer
        isOpen={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
        activeType={activeType}
        selectedComponent={selectedComponent}
        onClearSelectedComponent={() => setSelectedComponent(null)}
      />

      {/* Mode 2: Virtual Scenarios Modal */}
      <ScenarioModal
        isOpen={currentMode === 2}
        onClose={() => setCurrentMode(1)}
        isMuted={isMuted}
      />

      {/* Mode 3: Interactive SPM Quiz & Certificate Modal */}
      <QuizModal
        isOpen={currentMode === 3}
        onClose={() => setCurrentMode(1)}
        isMuted={isMuted}
      />
    </main>
  );
}
