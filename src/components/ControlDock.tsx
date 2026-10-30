import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Columns3,
  RotateCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Info
} from 'lucide-react';
import { ExtinguisherType } from '../types';
import { EXTINGUISHERS } from '../utils/extinguisherData';
import { playClickSound, playDischargeSound } from '../utils/audio';

interface ControlDockProps {
  activeType: ExtinguisherType;
  onSelectType: (type: ExtinguisherType) => void;
  isExploded: boolean;
  onToggleExploded: () => void;
  explodedAmount: number;
  onChangeExplodedAmount: (amount: number) => void;
  isComparison: boolean;
  onToggleComparison: () => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
  isSpraying: boolean;
  onTriggerSpray: () => void;
  onOpenInfo: () => void;
  isMuted: boolean;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  activeType,
  onSelectType,
  isExploded,
  onToggleExploded,
  explodedAmount,
  onChangeExplodedAmount,
  isComparison,
  onToggleComparison,
  isAutoRotate,
  onToggleAutoRotate,
  onResetView,
  isSpraying,
  onTriggerSpray,
  onOpenInfo,
  isMuted
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'model' | 'tools'>('model');

  const handleSpray = () => {
    if (!isMuted) {
      playDischargeSound(activeType);
    }
    onTriggerSpray();
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-[940px] transition-all duration-300 ease-out ${
        isCollapsed ? 'bottom-2' : 'bottom-4'
      }`}
    >
      {/* Collapse / Expand Toggle Tab */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => {
            playClickSound();
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[rgba(6,20,38,0.95)] border-t border-x border-[rgba(0,229,255,0.4)] text-[11px] font-orbitron font-bold text-cyan-300 hover:text-white shadow-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Buka Panel Kawalan 3D' : 'Sembunyikan Panel untuk Pandangan Penuh'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>BUKA KAWALAN (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>SEMBUNYI KAWALAN</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container (Solid / rgba surface - no backdrop-filter) */}
      {!isCollapsed && (
        <div className="bg-[rgba(6,20,38,0.96)] border border-[rgba(0,229,255,0.4)] rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-col gap-2.5">
          {/* Top Bar inside dock: Tabs & Quick Actions */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('model');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-orbitron font-bold transition-all ${
                  activeTab === 'model'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                1. PILIH TABUNG
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('tools');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-orbitron font-bold transition-all ${
                  activeTab === 'tools'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                2. KAWALAN 3D
              </button>
            </div>

            {/* Quick interactive buttons on right */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpray}
                disabled={isSpraying || isComparison}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-orbitron font-bold transition-all ${
                  isSpraying
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : isComparison
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:brightness-110 shadow-md'
                }`}
                title="Pancutkan simulasi semburan zarah dan bunyi mengikut jenis alat"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSpraying ? 'MEMANCUT...' : 'UJI SEMBURAN'}</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onOpenInfo();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors"
                title="Lihat Maklumat Pendidikan Sains & Prosedur PASS"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Nota & PASS</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onResetView();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Kembalikan kamera ke sudut asal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Model Selection Cards */}
          {activeTab === 'model' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['water', 'foam', 'drypowder', 'co2'] as ExtinguisherType[]).map((type) => {
                const data = EXTINGUISHERS[type];
                const isActive = activeType === type && !isComparison;

                // Color swatch
                let dotBg = 'bg-red-600';
                if (type === 'foam') dotBg = 'bg-[#e2c582]';
                if (type === 'drypowder') dotBg = 'bg-[#0284c7]';
                if (type === 'co2') dotBg = 'bg-[#18181b] border border-slate-600';

                return (
                  <button
                    key={type}
                    onClick={() => {
                      playClickSound();
                      onSelectType(type);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${dotBg} shadow-sm shrink-0`} />
                      <div>
                        <div className="font-orbitron font-bold text-xs text-white leading-tight">
                          {data.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-rajdhani">
                          Label: {data.labelColorMalay}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      {data.classes.map((c) => (
                        <span
                          key={c}
                          className="w-4 h-4 rounded text-[9px] font-bold font-orbitron bg-slate-800 text-cyan-300 border border-slate-700 flex items-center justify-center"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: 3D Visualization Controls */}
          {activeTab === 'tools' && (
            <div className="flex items-center justify-between flex-wrap gap-3 py-1">
              {/* Exploded View Controls */}
              <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    onToggleExploded();
                  }}
                  disabled={isComparison}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-orbitron font-semibold transition-all ${
                    isExploded
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : isComparison
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                  title="Pecahkan komponen tabung untuk melihat bahagian dalam dan luar"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Pecahan Komponen</span>
                </button>

                {isExploded && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-rajdhani">Jarak:</span>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={explodedAmount}
                      onChange={(e) => onChangeExplodedAmount(parseFloat(e.target.value))}
                      className="w-24 accent-cyan-400 cursor-pointer"
                      title="Laraskan jarak pecahan komponen"
                    />
                  </div>
                )}
              </div>

              {/* Comparison Mode Toggle */}
              <button
                onClick={() => {
                  playClickSound();
                  onToggleComparison();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-orbitron font-semibold transition-all border ${
                  isComparison
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
                title="Papar kesemua 4 model sebelah-menyebelah untuk perbandingan serentak"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Mod Bandingan (4 Tabung)</span>
              </button>

              {/* Auto Rotate Toggle */}
              <button
                onClick={() => {
                  playClickSound();
                  onToggleAutoRotate();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-orbitron font-semibold transition-all border ${
                  isAutoRotate
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                    : 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
                title="Putaran perlahan 360° automatik"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Putaran 360°</span>
              </button>

              {/* Hint */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-rajdhani">
                <Info className="w-3 h-3 text-cyan-400" />
                <span>Seret tetikus / sentuh skrin untuk putar 360° & zum masuk</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
