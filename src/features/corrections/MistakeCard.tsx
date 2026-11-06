import React from 'react';
import { Mistake } from '../../types';
import { Edit, Trash2, ArrowRight } from 'lucide-react';

interface MistakeCardProps {
  mistake: Mistake;
  isEditable?: boolean;
  onEdit?: (mistake: Mistake) => void;
  onDelete?: (id: string) => void;
}

export const MistakeCard: React.FC<MistakeCardProps> = ({
  mistake,
  isEditable = false,
  onEdit,
  onDelete,
}) => {
  const typeLabels = {
    grammar: { label: 'Grammar', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    vocabulary: { label: 'Vocabulary', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    spelling: { label: 'Spelling', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    punctuation: { label: 'Punctuation', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    syntax: { label: 'Syntax', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    style: { label: 'Style / Register', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  }[mistake.type] || { label: mistake.type, bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeLabels.bg}`}>
            {typeLabels.label}
          </span>
          <span className="text-[10px] text-slate-400 capitalize">
            {mistake.impactLevel} impact
          </span>
        </div>

        {isEditable && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(mistake)}
                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Edit feedback note"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(mistake.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Remove feedback note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comparison block */}
      <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2">
        <span className="line-through text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
          {mistake.original}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
          {mistake.correction}
        </span>
      </div>

      {/* Pedagogical explanation */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {mistake.explanation}
      </p>
    </div>
  );
};
