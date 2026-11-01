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
      title={mistakeToEdit ? 'Editar Observación de Error' : 'Agregar Corrección Manual'}
      subtitle="Define el fragmento original, la corrección sugerida y la justificación pedagógica."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Texto Original del Alumno</label>
          <input
            type="text"
            required
            value={original}
            onChange={e => setOriginal(e.target.value)}
            placeholder="ej. don't must"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-rose-50/40 text-rose-950 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Corrección Sugerida</label>
          <input
            type="text"
            required
            value={correction}
            onChange={e => setCorrection(e.target.value)}
            placeholder="ej. do not have to"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-emerald-50/40 text-emerald-950 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría del Error</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as Mistake['type'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            >
              <option value="grammar">Grammar (Gramática)</option>
              <option value="vocabulary">Vocabulary (Léxico / Colocación)</option>
              <option value="spelling">Spelling (Ortografía)</option>
              <option value="punctuation">Punctuation (Puntuación)</option>
              <option value="syntax">Syntax (Estructura de Oración)</option>
              <option value="style">Style / Register (Estilo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Impacto en Calificación</label>
            <select
              value={impactLevel}
              onChange={e => setImpactLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            >
              <option value="minor">Menor (Minor)</option>
              <option value="moderate">Moderado (Moderate)</option>
              <option value="major">Grave (Major)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Explicación Pedagógica</label>
          <textarea
            rows={3}
            required
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            placeholder="Explica la regla o por qué es preferible la forma corregida para que el alumno aprenda."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Guardar Observación
          </Button>
        </div>
      </form>
    </Modal>
  );
};
