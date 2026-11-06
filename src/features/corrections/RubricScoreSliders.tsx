import React, { useState } from 'react';
import { EvaluationScores, CambridgeExam, CAMBRIDGE_CRITERIA, getBandDescription, getExamTypeFromLevel } from '../../types';
import { Award, Info, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface RubricScoreSlidersProps {
  scores: EvaluationScores;
  suggestedOverallGrade: number;
  isEditable?: boolean;
  onChangeScores?: (scores: EvaluationScores) => void;
  cefrLevel?: string;
  examType?: CambridgeExam;
}

export const RubricScoreSliders: React.FC<RubricScoreSlidersProps> = ({
  scores,
  suggestedOverallGrade,
  isEditable = false,
  onChangeScores,
  cefrLevel = 'B2',
  examType: initialExamType,
}) => {
  const [selectedExam, setSelectedExam] = useState<CambridgeExam>(
    initialExamType || getExamTypeFromLevel(cefrLevel)
  );
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  const criteriaKeys = ['content', 'communicativeAchievement', 'organisation', 'language'] as const;

  const currentCriteriaConfig = CAMBRIDGE_CRITERIA[selectedExam];

  const handleScoreChange = (key: (typeof criteriaKeys)[number], value: number) => {
    if (!onChangeScores) return;
    const clampedValue = Math.max(0, Math.min(5, Number(value)));
    const newScores = {
      ...scores,
      [key]: clampedValue,
    };

    // Calculate Cambridge total out of 20
    const sum = (newScores.content ?? 0) + 
                (newScores.communicativeAchievement ?? 0) + 
                (newScores.organisation ?? 0) + 
                (newScores.language ?? 0);
    newScores.totalMarks = +sum.toFixed(1);
    // Scaled to 10
    newScores.overallGrade = +(sum / 2).toFixed(1);
    onChangeScores(newScores);
  };

  const handleManualOverallChange = (value: number) => {
    if (!onChangeScores) return;
    const grade = Math.max(0, Math.min(10, Number(value)));
    onChangeScores({ ...scores, overallGrade: grade });
  };

  const totalCambridgeMarks = (scores.content ?? 0) + 
                             (scores.communicativeAchievement ?? 0) + 
                             (scores.organisation ?? 0) + 
                             (scores.language ?? 0);

  return (
    <div className="space-y-5">
      {/* Exam Criteria Selector & Header */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0d3471]" />
          <span className="text-xs font-bold text-slate-800">
            Official Criteria: {selectedExam === 'CAE' ? 'Cambridge C1 (CAE)' : 'Cambridge B2 (FCE)'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedExam('FCE')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              selectedExam === 'FCE'
                ? 'bg-[#0d3471] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FCE (B2)
          </button>
          <button
            type="button"
            onClick={() => setSelectedExam('CAE')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              selectedExam === 'CAE'
                ? 'bg-[#0d3471] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CAE (C1)
          </button>
        </div>
      </div>

      {/* Rubric Criteria Sliders */}
      <div className="space-y-4">
        {criteriaKeys.map(key => {
          const config = currentCriteriaConfig[key];
          const val = scores[key] ?? 0;
          const bandDescription = getBandDescription(selectedExam, key, val);
          const isExpanded = expandedCriteria === key;

          return (
            <div
              key={key}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{config.name}</span>
                  <button
                    type="button"
                    onClick={() => setExpandedCriteria(isExpanded ? null : key)}
                    className="text-[11px] text-[#0d3471] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>Bands</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-extrabold text-[#0d3471] bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    {val.toFixed(1)} / 5
                  </span>
                </div>
              </div>

              {/* Slider & quick band buttons */}
              {isEditable ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={val}
                      onChange={e => handleScoreChange(key, +e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0d3471]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      value={val}
                      onChange={e => handleScoreChange(key, +e.target.value)}
                      className="w-14 py-1 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>

                  {/* Discrete Band Buttons for quick selection */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Band:</span>
                    {[1, 2, 3, 4, 5].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleScoreChange(key, b)}
                        className={`px-2.5 py-0.5 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${
                          Math.round(val) === b
                            ? 'bg-[#0d3471] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-[#0d3471] transition-all duration-300`}
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
              )}

              {/* Active Band Description Preview */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Assessed descriptor: </span>
                {bandDescription}
              </div>

              {/* Collapsible Official Descriptors Reference */}
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Official Cambridge {selectedExam} Scale:
                  </p>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                    <strong>Band 5:</strong> {config.bands[5]}
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                    <strong>Band 3:</strong> {config.bands[3]}
                  </div>
                  <div className="p-2 rounded-xl bg-red-50 text-[#c81414] border border-red-100">
                    <strong>Band 1:</strong> {config.bands[1]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Grade Summary Card */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#0d3471]" />
            <span>Cambridge Score & Final Grade</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-600">
            <span>
              Cambridge Total: <strong className="font-mono text-sm text-[#0d3471] font-extrabold">{totalCambridgeMarks.toFixed(1)}</strong> / 20
            </span>
            <span className="text-slate-300">•</span>
            <span>
              AI Suggested: <strong className="font-mono">{suggestedOverallGrade}</strong> / 10
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Final Grade:</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={scores.overallGrade}
                onChange={e => handleManualOverallChange(+e.target.value)}
                className="w-16 text-center text-lg font-black text-[#0d3471] py-1 rounded-xl border border-slate-300 bg-white shadow-2xs font-mono"
              />
              <span className="text-xs font-bold text-slate-700">/ 10</span>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-2xl font-black text-[#0d3471] font-mono">
                {scores.overallGrade.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 10</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                ({totalCambridgeMarks.toFixed(1)} / 20 marks)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
