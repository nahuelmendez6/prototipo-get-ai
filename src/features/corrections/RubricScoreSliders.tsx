import React from 'react';
import { EvaluationScores } from '../../types';
import { Award, Calculator, Sparkles } from 'lucide-react';

interface RubricScoreSlidersProps {
  scores: EvaluationScores;
  suggestedOverallGrade: number;
  isEditable?: boolean;
  onChangeScores?: (scores: EvaluationScores) => void;
}

export const RubricScoreSliders: React.FC<RubricScoreSlidersProps> = ({
  scores,
  suggestedOverallGrade,
  isEditable = false,
  onChangeScores,
}) => {
  const criteria = [
    { key: 'grammar', label: 'Gramática (Grammar)', color: 'bg-indigo-600' },
    { key: 'vocabulary', label: 'Vocabulario (Lexis)', color: 'bg-emerald-600' },
    { key: 'spellingPunctuation', label: 'Ortografía y Puntuación', color: 'bg-amber-600' },
    { key: 'coherenceCohesion', label: 'Coherencia y Cohesión', color: 'bg-sky-600' },
    { key: 'taskAchievement', label: 'Cumplimiento de Consigna (Task)', color: 'bg-purple-600' },
  ] as const;

  const handleScoreChange = (key: keyof EvaluationScores, value: number) => {
    if (!onChangeScores) return;
    const newScores = { ...scores, [key]: Number(value) };
    // Auto-calculate suggested overall average
    const sum = newScores.grammar + newScores.vocabulary + newScores.spellingPunctuation + newScores.coherenceCohesion + newScores.taskAchievement;
    newScores.overallGrade = +(sum / 5).toFixed(1);
    onChangeScores(newScores);
  };

  const handleManualOverallChange = (value: number) => {
    if (!onChangeScores) return;
    onChangeScores({ ...scores, overallGrade: Number(value) });
  };

  return (
    <div className="space-y-4">
      {/* Rubric Criteria Sliders */}
      <div className="space-y-3">
        {criteria.map(c => {
          const val = scores[c.key as keyof EvaluationScores];

          return (
            <div key={c.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{c.label}</span>
                <span className="font-bold text-slate-900 font-mono">{val.toFixed(1)} / 10</span>
              </div>

              {isEditable ? (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={val}
                    onChange={e => handleScoreChange(c.key as keyof EvaluationScores, +e.target.value)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={val}
                    onChange={e => handleScoreChange(c.key as keyof EvaluationScores, +e.target.value)}
                    className="w-14 py-0.5 px-1 text-center text-xs font-mono font-bold rounded border border-slate-200 bg-slate-50"
                  />
                </div>
              ) : (
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.color}`}
                    style={{ width: `${(val / 10) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Final Grade Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Calificación Final Docente</span>
          </div>
          <p className="text-[11px] text-teal-700 mt-0.5">
            Sugerida por IA: <strong>{suggestedOverallGrade}</strong> / 10
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditable ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={scores.overallGrade}
                onChange={e => handleManualOverallChange(+e.target.value)}
                className="w-20 text-center text-xl font-black text-teal-950 py-1 rounded-xl border border-teal-300 bg-white shadow-2xs font-mono"
              />
              <span className="text-xs font-bold text-teal-800">/ 10</span>
            </div>
          ) : (
            <span className="text-2xl font-black text-teal-900 font-mono">
              {scores.overallGrade.toFixed(1)} <span className="text-sm font-normal text-teal-700">/ 10</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
