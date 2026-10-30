import React from 'react';
import { X, ShieldCheck, AlertTriangle, Layers, BookOpen, Flame, Compass, CheckCircle2 } from 'lucide-react';
import { ExtinguisherType } from '../types';
import { EXTINGUISHERS } from '../utils/extinguisherData';
import { ComponentMetadata } from '../utils/extinguisher3D';
import { playClickSound } from '../utils/audio';

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeType: ExtinguisherType;
  selectedComponent: ComponentMetadata | null;
  onClearSelectedComponent: () => void;
}

export const InfoDrawer: React.FC<InfoDrawerProps> = ({
  isOpen,
  onClose,
  activeType,
  selectedComponent,
  onClearSelectedComponent
}) => {
  if (!isOpen) return null;

  const data = EXTINGUISHERS[activeType];

  return (
    <div
      className="fixed inset-y-0 right-0 z-30 w-full sm:w-[460px] bg-[rgba(4,14,28,0.98)] border-l border-[rgba(0,229,255,0.4)] shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col transition-transform duration-300 overflow-hidden"
      data-testid="info-drawer"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
              Nota Sains KSSM
            </h2>
            <p className="text-[11px] text-slate-400 font-rajdhani">
              Spesifikasi Teknikal & Keselamatan Kebakaran
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup Panel Nota"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Selected Component Smart Highlight Banner */}
        {selectedComponent ? (
          <div className="bg-cyan-950/70 border border-cyan-400/80 rounded-xl p-3.5 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-cyan-400 text-slate-950">
                KOMPONEN 3D DIPILIH
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  onClearSelectedComponent();
                }}
                className="text-[10px] text-cyan-300 hover:text-white underline cursor-pointer"
              >
                Papar Semua
              </button>
            </div>
            <h3 className="font-orbitron font-bold text-sm text-white">{selectedComponent.name}</h3>
            <p className="text-xs text-slate-200 font-rajdhani mt-1 leading-relaxed">
              {selectedComponent.description}
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-rajdhani flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Petua: Klik mana-mana bahagian model 3D (picu, hos, corong, tolok) untuk membaca fungsinya.</span>
          </div>
        )}

        {/* Model Title & Label Badge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-orbitron font-bold text-lg text-white">{data.name}</h3>
            <span
              className="text-xs font-orbitron font-bold px-2.5 py-1 rounded"
              style={{
                backgroundColor: data.tagColor,
                color: activeType === 'foam' ? '#0f172a' : '#ffffff'
              }}
            >
              Label: {data.labelColorMalay}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-rajdhani leading-relaxed">
            {data.principle}
          </p>
        </div>

        {/* Suitable Fire Classes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wide">
              Kelas Kebakaran Yang Sesuai
            </h4>
          </div>
          <div className="flex items-center gap-1.5 mb-2.5">
            {data.classes.map((cls) => (
              <span
                key={cls}
                className="px-2.5 py-1 rounded-md text-xs font-orbitron font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40"
              >
                KELAS {cls}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-300 font-rajdhani leading-relaxed">
            {data.suitableDesc}
          </p>
        </div>

        {/* Unsuitable / Hazard Warning */}
        <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wide">
              Amaran Bahaya / Jangan Guna
            </h4>
          </div>
          <p className="text-xs text-red-200 font-rajdhani leading-relaxed">
            {data.dangerDesc}
          </p>
        </div>

        {/* Key Components List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-cyan-400">
            <Layers className="w-4 h-4" />
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wide">
              Komponen Utama & Spesifikasi
            </h4>
          </div>
          <div className="space-y-2">
            {data.components.map((comp, idx) => (
              <div key={idx} className="border-l-2 border-cyan-500/50 pl-2.5 py-0.5">
                <div className="font-orbitron font-bold text-xs text-slate-200">{comp.name}</div>
                <div className="text-[11px] text-slate-400 font-rajdhani leading-snug">{comp.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PASS Operating Procedure */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <Flame className="w-4 h-4" />
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-wide">
              Tatacara Penggunaan (Kaedah P.A.S.S)
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {data.passSteps.map((step, idx) => (
              <div key={idx} className="flex gap-2.5 items-start bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-orbitron font-bold text-xs shrink-0">
                  {step.letter}
                </div>
                <div>
                  <div className="font-orbitron font-bold text-xs text-white">{step.title}</div>
                  <div className="text-[11px] text-slate-300 font-rajdhani mt-0.5 leading-snug">
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit & Maintenance Checklist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h4 className="font-orbitron font-bold text-xs text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pemeriksaan Berkala Alat Pemadam Api</span>
          </h4>
          <ul className="text-xs text-slate-300 font-rajdhani space-y-1.5 list-disc pl-4">
            <li>Pastikan jarum tolok tekanan berada di zon <strong>HIJAU</strong> (12-14 bar).</li>
            <li>Periksa pin keselamatan dan meterai plastik masih utuh dan tidak dirosakkan.</li>
            <li>Pastikan hos tidak retak, tersumbat atau rapuh akibat cuaca.</li>
            <li>Semak tarikh luput sijil perakuan bomba (biasanya diperbaharui setiap tahun).</li>
            <li>Tempatkan di laluan kecemasan yang jelas, mudah dicapai dan tidak terhalang.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
