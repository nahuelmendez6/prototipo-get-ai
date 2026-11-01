import React, { useState, useEffect } from 'react';
import { Assignment, WritingType, CEFRLevel, RubricConfig } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockAssignmentService } from '../../services/mockAssignmentService';
import { useToast } from '../../contexts/ToastContext';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentToEdit?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentToEdit,
}) => {
  const { courses, reloadAll } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [writingType, setWritingType] = useState<WritingType>('Essay');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B2');
  const [minWords, setMinWords] = useState(140);
  const [maxWords, setMaxWords] = useState(190);
  const [dueDate, setDueDate] = useState('');

  // Rubric weights
  const [grammarWeight, setGrammarWeight] = useState(20);
  const [vocabWeight, setVocabWeight] = useState(20);
  const [spellingWeight, setSpellingWeight] = useState(20);
  const [coherenceWeight, setCoherenceWeight] = useState(20);
  const [taskWeight, setTaskWeight] = useState(20);
  const [guidelines, setGuidelines] = useState('');

  useEffect(() => {
    if (assignmentToEdit) {
      setCourseId(assignmentToEdit.courseId);
      setTitle(assignmentToEdit.title);
      setDescription(assignmentToEdit.description);
      setInstructions(assignmentToEdit.instructions);
      setWritingType(assignmentToEdit.writingType);
      setCefrLevel(assignmentToEdit.cefrLevel);
      setMinWords(assignmentToEdit.minWords);
      setMaxWords(assignmentToEdit.maxWords);
      setDueDate(assignmentToEdit.dueDate);
      setGrammarWeight(assignmentToEdit.rubric.grammarWeight);
      setVocabWeight(assignmentToEdit.rubric.vocabularyWeight);
      setSpellingWeight(assignmentToEdit.rubric.spellingPunctuationWeight);
      setCoherenceWeight(assignmentToEdit.rubric.coherenceCohesionWeight);
      setTaskWeight(assignmentToEdit.rubric.taskAchievementWeight);
      setGuidelines(assignmentToEdit.rubric.customGuidelines || '');
    } else {
      setCourseId(courses[0]?.id || '');
      setTitle('');
      setDescription('');
      setInstructions('');
      setWritingType('Essay');
      setCefrLevel('B2');
      setMinWords(140);
      setMaxWords(190);
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 14);
      setDueDate(defaultDue.toISOString().split('T')[0]);
      setGrammarWeight(20);
      setVocabWeight(20);
      setSpellingWeight(20);
      setCoherenceWeight(20);
      setTaskWeight(20);
      setGuidelines('Enfocar la corrección en conectores lógicos, variedad de vocabulario y precisión gramatical.');
    }
  }, [assignmentToEdit, isOpen, courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCourse = courses.find(c => c.id === courseId);

    const rubric: RubricConfig = {
      grammarWeight,
      vocabularyWeight: vocabWeight,
      spellingPunctuationWeight: spellingWeight,
      coherenceCohesionWeight: coherenceWeight,
      taskAchievementWeight: taskWeight,
      customGuidelines: guidelines,
    };

    if (assignmentToEdit) {
      mockAssignmentService.updateAssignment(assignmentToEdit.id, {
        courseId,
        courseName: selectedCourse?.name || assignmentToEdit.courseName,
        title,
        description,
        instructions,
        writingType,
        cefrLevel,
        minWords: Number(minWords),
        maxWords: Number(maxWords),
        dueDate,
        rubric,
      });
      showToast('success', 'Consigna Actualizada', `La actividad "${title}" ha sido actualizada.`);
    } else {
      mockAssignmentService.createAssignment({
        courseId,
        courseName: selectedCourse?.name || 'Curso',
        teacherId: currentUser?.id || 'teacher-1',
        teacherName: currentUser?.name || 'Docente Titular',
        title,
        description,
        instructions,
        writingType,
        cefrLevel,
        minWords: Number(minWords),
        maxWords: Number(maxWords),
        dueDate,
        rubric,
        status: 'active',
      });
      showToast('success', 'Consigna Publicada', `La actividad "${title}" está disponible para los alumnos.`);
    }

    reloadAll();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignmentToEdit ? 'Editar Consigna de Writing' : 'Crear Nueva Consigna de Writing'}
      subtitle="Define el tipo de texto, nivel CEFR, consigna detallada y rúbrica de corrección para la IA."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Curso Destino</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Vencimiento</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Actividad</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ej. FCE Essay: Advantages and Disadvantages of Social Media"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Redacción</label>
            <select
              value={writingType}
              onChange={e => setWritingType(e.target.value as WritingType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="Essay">Essay (Ensayo de Opinión/Discursivo)</option>
              <option value="Email">Email (Formal / Informal)</option>
              <option value="Article">Article (Artículo de Revista/Blog)</option>
              <option value="Story">Story (Narración / Cuento Corto)</option>
              <option value="Review">Review (Crítica de Cine/Libro/Lugar)</option>
              <option value="Report">Report (Informe Técnico/Académico)</option>
              <option value="Other">Otro formato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel CEFR</label>
            <select
              value={cefrLevel}
              onChange={e => setCefrLevel(e.target.value as CEFRLevel)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="A1">A1 - Inicial</option>
              <option value="A2">A2 - Básico</option>
              <option value="B1">B1 - Intermedio (PET)</option>
              <option value="B2">B2 - Intermedio Alto (FCE)</option>
              <option value="C1">C1 - Avanzado (CAE)</option>
              <option value="C2">C2 - Dominio (CPE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rango de Palabras</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minWords}
                onChange={e => setMinWords(+e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-center"
                placeholder="Mín"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={maxWords}
                onChange={e => setMaxWords(+e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-center"
                placeholder="Máx"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Breve</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Resumen del objetivo comunicativo en 1 frase."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Instrucciones y Prompt para el Alumno</label>
          <textarea
            rows={4}
            required
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Escribe aquí la consigna en inglés tal como la leerá el estudiante (ej. Cambridge exam prompt, notes to include, style guidelines)."
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Rubric Weights Box */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
              Rúbrica de Evaluación y Ponderaciones
            </span>
            <span className="text-[11px] font-semibold text-teal-800">
              Total: {grammarWeight + vocabWeight + spellingWeight + coherenceWeight + taskWeight}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Gramática</span>
              <input
                type="number"
                value={grammarWeight}
                onChange={e => setGrammarWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Vocabulario</span>
              <input
                type="number"
                value={vocabWeight}
                onChange={e => setVocabWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Ortografía</span>
              <input
                type="number"
                value={spellingWeight}
                onChange={e => setSpellingWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Coherencia</span>
              <input
                type="number"
                value={coherenceWeight}
                onChange={e => setCoherenceWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Consigna</span>
              <input
                type="number"
                value={taskWeight}
                onChange={e => setTaskWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {assignmentToEdit ? 'Guardar Cambios' : 'Publicar Consigna'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
