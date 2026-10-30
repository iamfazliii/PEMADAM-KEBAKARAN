import React from 'react';
import { Flame, Box, Award, ShieldAlert, Volume2, VolumeX, Eye } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderHUDProps {
  currentMode: 1 | 2 | 3;
  onChangeMode: (mode: 1 | 2 | 3) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenInfoDrawer: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  currentMode,
  onChangeMode,
  isMuted,
  onToggleMute,
  onOpenInfoDrawer
}) => {
  return (
    <header className="absolute top-3 left-0 right-0 z-20 px-4 pointer-events-none flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
      {/* Title & Badge lockup */}
      <div className="pointer-events-auto flex items-center gap-3 bg-[rgba(6,20,38,0.92)] border border-[rgba(0,229,255,0.4)] px-4 py-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md">
          <Flame className="w-5 h-5 text-white animate-none" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-sm sm:text-base tracking-wider text-white uppercase">
              Eksplorasi 3D: Alat Pemadam Api
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold font-orbitron bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              KSSM TINGKATAN 4
            </span>
          </div>
          <p className="text-xs text-slate-300 font-rajdhani hidden sm:block">
            Makmal Maya Sains & Keselamatan Kebakaran
          </p>
        </div>
      </div>

      {/* Mode navigation buttons */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-[rgba(6,20,38,0.92)] border border-[rgba(0,229,255,0.35)] p-1.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
        <button
          onClick={() => {
            playClickSound();
            onChangeMode(1);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentMode === 1
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Mod 1: Teroka model 3D, putar, zum, dan pecahan komponen"
        >
          <Box className="w-4 h-4" />
          <span>Mod 1: Penerokaan 3D</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onChangeMode(2);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentMode === 2
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Mod 2: Simulasi situasi kebakaran maya dan pemilihan alat pemadam"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Mod 2: Situasi Maya</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onChangeMode(3);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            currentMode === 3
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Mod 3: Kuiz SPM 10 Soalan & Sijil Pencapaian Digital"
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Mod 3: Kuiz & Sijil</span>
        </button>
      </div>

      {/* Auxiliary quick buttons: Info & Audio */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-2">
        <button
          onClick={() => {
            playClickSound();
            onOpenInfoDrawer();
          }}
          className="flex items-center gap-1.5 bg-[rgba(6,20,38,0.92)] hover:bg-slate-800 border border-[rgba(0,229,255,0.4)] px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 transition-colors shadow-md"
          title="Buka Nota Lengkap Sains KSSM"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Nota Pembelajaran</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            onToggleMute();
          }}
          className="bg-[rgba(6,20,38,0.92)] hover:bg-slate-800 border border-[rgba(0,229,255,0.4)] p-2 rounded-xl text-slate-300 hover:text-white transition-colors shadow-md"
          title={isMuted ? 'Buka Bunyi' : 'Senyapkan Bunyi'}
          aria-label={isMuted ? 'Buka Bunyi' : 'Senyapkan Bunyi'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
