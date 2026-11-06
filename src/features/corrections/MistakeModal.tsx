import React, { useState, useEffect } from 'react';
import { Mistake } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface MistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mistake: Omit<Mistake, 'id'>, editId?: string) => void;
  mistakeToEdit?: Mistake | null;
}

export const MistakeModal: React.FC<MistakeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mistakeToEdit,
}) => {
  const [original, setOriginal] = useState('');
  const [correction, setCorrection] = useState('');
  const [type, setType] = useState<Mistake['type']>('grammar');
  const [explanation, setExplanation] = useState('');
  const [impactLevel, setImpactLevel] = useState<'minor' | 'moderate' | 'major'>('moderate');

  useEffect(() => {
    if (mistakeToEdit) {
      setOriginal(mistakeToEdit.original);
      setCorrection(mistakeToEdit.correction);
      setType(mistakeToEdit.type);
      setExplanation(mistakeToEdit.explanation);
      setImpactLevel(mistakeToEdit.impactLevel);
    } else {
      setOriginal('');
      setCorrection('');
      setType('grammar');
      setExplanation('');
      setImpactLevel('moderate');
    }
  }, [mistakeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        original,
        correction,
        type,
        explanation,
        impactLevel,
      },
      mistakeToEdit?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mistakeToEdit ? 'Edit Feedback Note' : 'Add Manual Correction Note'}
      subtitle="Define original text, target correction, error category, and pedagogical explanation."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Student's Original Text</label>
          <input
            type="text"
            required
            value={original}
            onChange={e => setOriginal(e.target.value)}
            placeholder="e.g. don't must"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-rose-50/40 text-rose-950 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Correction</label>
          <input
            type="text"
            required
            value={correction}
            onChange={e => setCorrection(e.target.value)}
            placeholder="e.g. do not have to"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-emerald-50/40 text-emerald-950 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as Mistake['type'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            >
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary / Lexis</option>
              <option value="spelling">Spelling</option>
              <option value="punctuation">Punctuation</option>
              <option value="syntax">Syntax / Sentence Structure</option>
              <option value="style">Style / Register</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Impact</label>
            <select
              value={impactLevel}
              onChange={e => setImpactLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            >
              <option value="minor">Minor Slip</option>
              <option value="moderate">Moderate Error</option>
              <option value="major">Major Error</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Pedagogical Explanation</label>
          <textarea
            rows={3}
            required
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            placeholder="Clarify the grammar rule or why the corrected form communicates better."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Note
          </Button>
        </div>
      </form>
    </Modal>
  );
};
