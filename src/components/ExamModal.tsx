import React, { useState } from 'react';
import { ExamQuestion } from '../types';
import { DEFAULT_EXAM_QUESTIONS } from '../data/defaultCourseData';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassExam: (scorePercentage: number) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose, onPassExam }) => {
  const [questions] = useState<ExamQuestion[]>(DEFAULT_EXAM_QUESTIONS);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);

  if (!isOpen) return null;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setScorePercentage(percent);
    setSubmitted(true);

    if (percent >= 70) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
      onPassExam(percent);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScorePercentage(0);
  };

  const isPassed = submitted && scorePercentage >= 70;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-1">
              <Award className="w-3.5 h-3.5" />
              Módulo 7: Avaliação Oficial de Competência
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Exame Teórico-Prático de Auditoria SGSO & ISO 19011
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Responda às questões técnicas. Aproveitamento mínimo de 70% para liberação do Certificado Oficial.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Questions list */}
        <div className="py-5 overflow-y-auto flex-1 space-y-6 pr-2">
          {submitted && (
            <div
              className={`p-5 rounded-2xl border text-center ${
                isPassed
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}
            >
              <div className="text-3xl font-black font-mono-code mb-1">
                {scorePercentage}%
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isPassed
                  ? 'Parabéns, Auditor Líder Aprovado com Louvor!'
                  : 'Aproveitamento Abaixo do Limite Mínimo (70%)'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {isPassed
                  ? 'Você demonstrou domínio profundo dos capítulos do SGSO e diretrizes da ISO 19011. Seu certificado foi habilitado!'
                  : 'Revise os pontos críticos dos capítulos 1 a 4 e tente novamente para liberar a emissão.'}
              </p>
            </div>
          )}

          {questions.map((q, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const isCorrect = submitted && selectedAnswers[qIdx] === q.correctAnswer;
            const isWrong = submitted && selectedAnswers[qIdx] !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800'
                      : 'bg-red-950/20 border-red-900/60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-code bg-slate-900 px-2.5 py-1 rounded-full shrink-0 border border-slate-800">
                    {q.chapter}
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    let optStyle = 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700';

                    if (isSelected) {
                      optStyle = 'border-amber-500 bg-amber-500/10 text-white font-semibold';
                    }

                    if (submitted) {
                      if (optIdx === q.correctAnswer) {
                        optStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                      } else if (isSelected && optIdx !== q.correctAnswer) {
                        optStyle = 'border-red-500 bg-red-500/20 text-red-200';
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${optStyle}`}
                      >
                        <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback explanation after submit */}
                {submitted && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800 pl-8 text-xs text-slate-300 flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="text-white block mb-0.5">Fundamentação Técnica Oficial:</strong>
                      <p className="text-slate-400">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {!submitted && `Respondidas: ${answeredCount} de ${questions.length}`}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Refazer Prova
                </button>
                {isPassed && (
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    Ir para Emissão do Certificado
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={answeredCount < questions.length}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizar e Avaliar Respostas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
