import React, { useState } from 'react';
import { X, Flame, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExtinguisherType } from '../types';
import { SCENARIOS } from '../utils/extinguisherData';
import { evaluateScenarioAnswer, ScenarioEvaluation } from '../utils/quizRules';
import { playClickSound, playSuccessChime, playWarningSound } from '../utils/audio';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ isOpen, onClose, isMuted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<ScenarioEvaluation | null>(null);
  const [chosenType, setChosenType] = useState<ExtinguisherType | null>(null);
  const [scoreTally, setScoreTally] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentScenario = SCENARIOS[currentIndex];

  const handleSelectExtinguisher = (type: ExtinguisherType) => {
    if (evaluation) return; // already answered
    setChosenType(type);
    const evalResult = evaluateScenarioAnswer(currentScenario, type);
    setEvaluation(evalResult);

    if (evalResult.isCorrect) {
      if (!isMuted) playSuccessChime();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } else {
      if (!isMuted) playWarningSound();
    }

    setScoreTally((prev) => [...prev, evalResult.score]);
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex + 1 < SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setEvaluation(null);
      setChosenType(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentIndex(0);
    setEvaluation(null);
    setChosenType(null);
    setScoreTally([]);
    setIsCompleted(false);
  };

  const totalPoints = scoreTally.reduce((a, b) => a + b, 0);
  const maxPossible = SCENARIOS.length * 2;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-[rgba(2,6,15,0.88)] backdrop-none"
      data-testid="scenario-modal"
    >
      <div className="relative w-full max-w-2xl bg-[rgba(6,20,38,0.98)] border border-[rgba(0,229,255,0.45)] rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Modal Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup Simulasi Situasi"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-base sm:text-lg text-white">
                  Mod 2: Situasi Kebakaran Maya
                </h2>
                <p className="text-xs text-slate-400 font-rajdhani">
                  Kenal pasti bahan api dan buat keputusan pantas memilih alat pemadam api paling selamat
                </p>
              </div>
            </div>

            {/* Scenario Progress and Class Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-orbitron font-bold text-xs text-amber-400">
                  SITUASI {currentIndex + 1} / {SCENARIOS.length}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-orbitron font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  KELAS {currentScenario.fireClass}
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-sm sm:text-base text-white mb-1.5">
                {currentScenario.title}
              </h3>
              <div className="text-xs text-cyan-400 font-rajdhani mb-2">
                Lokasi: {currentScenario.location} • Bahan Api: {currentScenario.fuelType}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-rajdhani leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

            {/* Extinguisher Choice Grid */}
            <div className="mb-4">
              <label className="block text-xs font-orbitron font-bold text-cyan-300 mb-2 uppercase">
                Pilih Alat Pemadam Api Paling Tepat:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { type: 'water', label: 'Air (Water)', color: 'border-red-600/60 bg-red-950/30' },
                    { type: 'foam', label: 'Buih (Foam)', color: 'border-amber-600/60 bg-amber-950/30' },
                    { type: 'drypowder', label: 'Debu Kering (Powder)', color: 'border-blue-600/60 bg-blue-950/30' },
                    { type: 'co2', label: 'Karbon Dioksida (CO₂)', color: 'border-slate-600/60 bg-slate-950/50' }
                  ] as const
                ).map((opt) => {
                  const isSelected = chosenType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      data-testid={`scenario-opt-${opt.type}`}
                      onClick={() => handleSelectExtinguisher(opt.type)}
                      disabled={evaluation !== null}
                      className={`p-3 rounded-xl border font-orbitron font-bold text-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/70 text-white shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                          : `${opt.color} text-slate-200 hover:border-cyan-400 hover:text-white`
                      } ${evaluation !== null && !isSelected ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Pedagogical Evaluation Result */}
            {evaluation && (
              <div
                className={`p-4 rounded-xl border mb-4 ${
                  evaluation.isCorrect
                    ? evaluation.isAcceptableAlternative
                      ? 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                      : 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                    : 'bg-red-950/60 border-red-500/70 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-orbitron font-bold text-sm">
                  {evaluation.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span>{evaluation.title}</span>
                </div>
                <p className="text-xs sm:text-sm font-rajdhani leading-relaxed">{evaluation.feedbackText}</p>
              </div>
            )}

            {/* Next / Submit Button */}
            {evaluation && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
                >
                  <span>{currentIndex + 1 < SCENARIOS.length ? 'Situasi Seterusnya' : 'Lihat Rumusan Markah'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Simulation Complete Summary Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-9 h-9" />
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white">
              Simulasi Situasi Maya Selesai!
            </h3>
            <p className="text-sm text-slate-300 font-rajdhani max-w-md mx-auto">
              Anda telah menguji kesemua {SCENARIOS.length} senario kebakaran makmal dan bengkel.
            </p>

            <div className="inline-block bg-slate-900/90 border border-cyan-500/40 rounded-2xl px-6 py-4">
              <div className="text-xs font-orbitron text-slate-400 mb-1">SKOR KESELURUHAN</div>
              <div className="font-orbitron font-bold text-3xl text-cyan-400">
                {totalPoints} / {maxPossible}
              </div>
              <div className="text-xs text-emerald-400 font-rajdhani mt-1 font-semibold">
                {totalPoints >= 8
                  ? 'Penguasaan Taktikal Cemerlang!'
                  : totalPoints >= 5
                  ? 'Tahap Keselamatan Baik'
                  : 'Sila Ulang Kaji Prosedur Keselamatan'}
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-orbitron font-semibold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Uji Semula Situasi</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Tutup & Kembali ke 3D</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
