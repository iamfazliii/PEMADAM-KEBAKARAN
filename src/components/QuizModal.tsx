import React, { useState, useRef } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Download, ArrowRight, RotateCcw, FileBadge, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../utils/extinguisherData';
import { calculateQuizScore, QuizResult } from '../utils/quizRules';
import { playClickSound, playSuccessChime, playWarningSound } from '../utils/audio';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, isMuted }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [certGenerated, setCertGenerated] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const isLastQuestion = currentIdx + 1 === QUIZ_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: index }));

    if (index === currentQ.correctIndex) {
      if (!isMuted) playSuccessChime();
    } else {
      if (!isMuted) playWarningSound();
    }
  };

  const handleNext = () => {
    playClickSound();
    if (!isLastQuestion) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const res = calculateQuizScore(answers);
      if (res.hasPassed) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
      }
    }
  };

  const handleRestart = () => {
    playClickSound();
    setCurrentIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsFinished(false);
    setCertGenerated(false);
  };

  const result: QuizResult = calculateQuizScore(answers);

  const handleGenerateCertificate = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const name = studentName.trim() || 'Murid Cemerlang Tingkatan 4';

    // Width: 1200, Height: 840
    ctx.clearRect(0, 0, 1200, 840);

    // Dark sci-fi rich navy background
    ctx.fillStyle = '#030a16';
    ctx.fillRect(0, 0, 1200, 840);

    // Subtle background mesh/grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }

    // Outer Luxury Gold Border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 780);

    // Inner Electric Cyan Border
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 750);

    // Decorative corner notches
    const corners = [
      [45, 45],
      [1155, 45],
      [45, 795],
      [1155, 795]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(cx - 10, cy - 10, 20, 20);
    });

    // Header Emblem
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 22px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KEMENTERIAN PENDIDIKAN MALAYSIA • KURIKULUM STANDARD SAINS TINGKATAN 4', 600, 110);

    // Certificate Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Orbitron", sans-serif';
    ctx.fillText('SIJIL PENGHARGAAN KESELAMATAN KEBAKARAN', 600, 175);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 22px "Rajdhani", sans-serif';
    ctx.fillText('MODUL EKSPLORASI 3D: JENIS-JENIS ALAT PEMADAM API & KAEDAH P.A.S.S', 600, 215);

    // Presentation text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px "Rajdhani", sans-serif';
    ctx.fillText('Dengan ini diperakui dengan bangganya bahawa', 600, 290);

    // Student Name with Gold Highlight
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 48px "Rajdhani", sans-serif';
    ctx.fillText(name.toUpperCase(), 600, 365);

    // Underline
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(320, 390);
    ctx.lineTo(880, 390);
    ctx.stroke();

    // Achievement Description
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '22px "Rajdhani", sans-serif';
    ctx.fillText(
      `Telah berjaya menyelesaikan penilaian sains interaktif dan menguasai prinsip pemadaman kebakaran,`,
      600,
      445
    );
    ctx.fillText(
      `pengenalan kod warna silinder, tatacara P.A.S.S serta mencapai keputusan cemerlang dengan skor:`,
      600,
      480
    );

    // Score Badge Pill
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(460, 510, 280, 50, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Orbitron", sans-serif';
    ctx.fillText(`${result.score} / ${result.total} (${result.percentage}%) - ${result.grade.toUpperCase()}`, 600, 545);

    // Date
    const today = new Date().toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "Rajdhani", sans-serif';
    ctx.fillText(`Tarikh Pengeluaran: ${today}`, 600, 610);

    // Signatures
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 700);
    ctx.lineTo(440, 700);
    ctx.moveTo(760, 700);
    ctx.lineTo(1020, 700);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Orbitron", sans-serif';
    ctx.fillText('KETUA PANITIA SAINS SEKOLAH', 310, 728);
    ctx.fillText('JURUTERA KESELAMATAN KEBAKARAN', 890, 728);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Rajdhani", sans-serif';
    ctx.fillText('Pengesahan Amali Maya', 310, 750);
    ctx.fillText('Piawaian Bomba & Penyelamat', 890, 750);

    setCertGenerated(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleDownloadCertificate = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Sijil_Keselamatan_Kebakaran_${studentName.replace(/\s+/g, '_') || 'Pelajar'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-[rgba(2,6,15,0.88)] backdrop-none"
      data-testid="quiz-modal"
    >
      <div className="relative w-full max-w-2xl bg-[rgba(6,20,38,0.98)] border border-[rgba(0,229,255,0.45)] rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Tutup Kuiz"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-base sm:text-lg text-white">
                    Mod 3: Kuiz Sains KSSM (10 Soalan)
                  </h2>
                  <p className="text-xs text-slate-400 font-rajdhani">
                    Topik: Pemadam Kebakaran, Kaedah PASS & Kod Warna
                  </p>
                </div>
              </div>
              <span className="font-orbitron font-bold text-xs text-cyan-400 shrink-0">
                {currentIdx + 1} / {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-4">
              <span className="text-[10px] font-orbitron font-bold text-cyan-400 uppercase tracking-wide block mb-1">
                {currentQ.topic}
              </span>
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-white leading-relaxed">
                {currentIdx + 1}. {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optClass = 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-cyan-400 hover:text-white';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected) {
                    optClass = 'bg-red-950/70 border-red-500 text-red-200';
                  } else {
                    optClass = 'bg-slate-900/40 border-slate-850 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    data-testid={`quiz-opt-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optClass}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-300 font-orbitron font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-rajdhani pt-0.5 leading-snug">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pedagogical Explanation */}
            {isAnswerSubmitted && (
              <div
                className={`p-3.5 rounded-xl border mb-4 text-xs sm:text-sm font-rajdhani leading-relaxed ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                    : 'bg-red-950/50 border-red-500/60 text-red-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-orbitron font-bold text-xs mb-1">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>JAWAPAN TEPAT!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>JAWAPAN KURANG TEPAT</span>
                    </>
                  )}
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswerSubmitted && (
              <div className="flex justify-end pt-1">
                <button
                  data-testid="quiz-next-btn"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-orbitron font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
                >
                  <span>{isLastQuestion ? 'Tamat & Lihat Keputusan' : 'Soalan Seterusnya'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Finished Screen: Score + Digital Certificate */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl">
              <Sparkles className="w-9 h-9" />
            </div>

            <div>
              <h3 className="font-orbitron font-bold text-xl text-white">
                Tahniah! Anda Telah Selesai
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-rajdhani mt-1">
                Penilaian Amali Sains Tingkatan 4 Bab 1 (Pemadam Kebakaran)
              </p>
            </div>

            {/* Score Display Card */}
            <div className="inline-block bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-orbitron text-slate-400 mb-1">KEPUTUSAN KUIZ</div>
              <div className="font-orbitron font-bold text-3xl sm:text-4xl text-cyan-400">
                {result.score} / {result.total}
              </div>
              <div className="font-orbitron font-bold text-base text-amber-400 mt-1">
                {result.percentage}% • {result.grade.toUpperCase()}
              </div>
            </div>

            {/* Student Name Input for Certificate */}
            <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left">
              <label className="block text-xs font-orbitron font-bold text-cyan-300 mb-1.5 uppercase">
                Nama Murid untuk Sijil Digital:
              </label>
              <input
                data-testid="student-name-input"
                type="text"
                placeholder="Contoh: Muhammad Danial bin Farhan"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-rajdhani font-semibold"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                data-testid="generate-cert-btn"
                onClick={handleGenerateCertificate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-orbitron font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
              >
                <FileBadge className="w-4 h-4" />
                <span>Jana Sijil Penghargaan</span>
              </button>

              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-orbitron font-semibold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulang Kuiz</span>
              </button>
            </div>

            {/* Certificate Preview and Download */}
            <div className="pt-2">
              <canvas
                ref={canvasRef}
                width={1200}
                height={840}
                className={`w-full max-w-xl mx-auto rounded-xl border-2 border-yellow-500 shadow-2xl transition-all ${
                  certGenerated ? 'block' : 'hidden'
                }`}
              />

              {certGenerated && (
                <div className="mt-3">
                  <button
                    onClick={handleDownloadCertificate}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Muat Turun Sijil (.PNG)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
