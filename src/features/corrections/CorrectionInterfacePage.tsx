import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Submission, Evaluation, Mistake, EvaluationScores } from '../../types';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MistakeCard } from './MistakeCard';
import { MistakeModal } from './MistakeModal';
import { RubricScoreSliders } from './RubricScoreSliders';
import { AIProcessingOverlay } from '../../components/ui/LoadingSpinner';
import { mockCorrectionService } from '../../services/mockCorrectionService';
import { mockSubmissionService } from '../../services/mockSubmissionService';
import { useToast } from '../../contexts/ToastContext';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Save, 
  Edit3, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Check, 
  X, 
  RefreshCw,
  Lightbulb,
  MessageSquare,
  ShieldAlert,
  Clock,
  Eye,
  CheckCheck
} from 'lucide-react';

export const CorrectionInterfacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();
  const { submissions, reloadAll } = useData();
  const { showToast } = useToast();

  const submission = submissions.find(s => s.id === id);

  const [activeTab, setActiveTab] = useState<'correction' | 'image' | 'transcription'>('correction');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [mistakeToEdit, setMistakeToEdit] = useState<Mistake | null>(null);

  // Editable states for teacher
  const [correctedText, setCorrectedText] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newRecommendationInput, setNewRecommendationInput] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [scores, setScores] = useState<EvaluationScores>({
    grammar: 8.0,
    vocabulary: 8.0,
    spellingPunctuation: 8.0,
    coherenceCohesion: 8.0,
    taskAchievement: 8.0,
    overallGrade: 8.0,
  });

  useEffect(() => {
    if (submission?.evaluation) {
      setCorrectedText(submission.evaluation.correctedText);
      setGeneralFeedback(submission.evaluation.generalFeedback);
      setRecommendations(submission.evaluation.recommendations || []);
      setTeacherNotes(submission.evaluation.teacherNotes || '');
      setScores(submission.evaluation.scores);
    }
  }, [submission]);

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Entrega no encontrada.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-3">
          Regresar
        </Button>
      </div>
    );
  }

  const isStudent = role === 'student';
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';
  const isPublished = submission.status === 'PUBLISHED';
  const isApproved = submission.status === 'APPROVED';
  const isPendingReview = submission.status === 'PENDING_REVIEW';
  const isNeedsRevision = submission.status === 'NEEDS_REVISION';
  const isSubmittedOnly = submission.status === 'SUBMITTED';

  // Rule: Students must NEVER see unapproved AI corrections
  if (isStudent && !isPublished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Entrega en Proceso de Corrección Docente
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Tu escrito para la consigna <strong>"{submission.assignmentTitle}"</strong> ha sido recibido con éxito. Tu docente está revisando las sugerencias pedagógicas antes de publicar tu calificación y devolución definitiva.
        </p>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Volver a Mi Panel
          </Button>
        </div>
      </div>
    );
  }

  // Trigger simulated AI processing on demand
  const handleRunAIProcessing = async () => {
    setIsProcessingAI(true);
    await mockSubmissionService.processWithAI(submission.id);
    reloadAll();
    setIsProcessingAI(false);
    showToast('success', 'Evaluación IA Generada', 'La propuesta pedagógica preliminar ha sido creada.');
  };

  // Teacher saves in-progress edits
  const handleSaveTeacherDraft = () => {
    if (!submission.evaluation) return;
    mockCorrectionService.updateEvaluation(submission.id, {
      correctedText,
      generalFeedback,
      recommendations,
      teacherNotes,
      scores,
    });
    reloadAll();
    showToast('success', 'Cambios Guardados', 'Los ajustes en la corrección, notas y feedback han sido guardados.');
  };

  // Teacher Approves correction
  const handleApproveCorrection = () => {
    handleSaveTeacherDraft();
    mockCorrectionService.approveCorrection(submission.id, teacherNotes);
    reloadAll();
    showToast('success', 'Corrección Aprobada', 'La evaluación docente fue aprobada. Ahora puedes publicarla para el alumno.');
  };

  // Teacher Publishes correction
  const handlePublishCorrection = () => {
    handleSaveTeacherDraft();
    mockCorrectionService.publishCorrection(submission.id);
    reloadAll();
    showToast('success', 'Evaluación Publicada', 'El alumno ahora puede visualizar su calificación oficial y feedback pedagógico.');
  };

  // Teacher Rejects / Requests Revision
  const handleRejectCorrection = () => {
    const reason = prompt('Indica el motivo por el cual solicitas que el alumno revise y reenvíe su escrito:') || 'Requiere revisión y ampliación según la consigna.';
    mockCorrectionService.rejectCorrection(submission.id, reason);
    reloadAll();
    showToast('warning', 'Revisión Solicitada', 'El estado cambió a "Requiere Corrección".');
  };

  // Mistake management
  const handleSaveMistake = (data: Omit<Mistake, 'id'>, editId?: string) => {
    if (editId) {
      mockCorrectionService.updateMistake(submission.id, editId, data);
      showToast('info', 'Observación Actualizada', 'La corrección fue modificada.');
    } else {
      mockCorrectionService.addMistake(submission.id, data);
      showToast('success', 'Observación Agregada', 'Se añadió una nueva corrección al análisis.');
    }
    reloadAll();
  };

  const handleDeleteMistake = (mistakeId: string) => {
    mockCorrectionService.deleteMistake(submission.id, mistakeId);
    showToast('info', 'Observación Eliminada', 'Se removió la observación.');
    reloadAll();
  };

  // Recommendation management
  const handleAddRecommendation = () => {
    if (newRecommendationInput.trim()) {
      const updated = [...recommendations, newRecommendationInput.trim()];
      setRecommendations(updated);
      setNewRecommendationInput('');
    }
  };

  const handleRemoveRecommendation = (index: number) => {
    const updated = recommendations.filter((_, idx) => idx !== index);
    setRecommendations(updated);
  };

  const evaluation = submission.evaluation;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Status Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Entregas</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} size="md" />
          {submission.submissionType === 'handwritten' && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Manuscrito Digitalizado</span>
            </span>
          )}
        </div>
      </div>

      {/* Mandatory Notification Box: AI suggestions await teacher review */}
      {isTeacherOrAdmin && !isPublished && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Propuesta de Evaluación Asistida por IA (Sugerencia Pedagógica)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Las correcciones, puntajes y comentarios mostrados fueron generados por la IA como borrador. <strong>Edita lo que consideres conveniente</strong>, aprueba la corrección y publícala para que el alumno pueda verla.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {isSubmittedOnly && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunAIProcessing}
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              >
                Procesar con IA Ahora
              </Button>
            )}

            {!isSubmittedOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveTeacherDraft}
                  icon={<Save className="w-3.5 h-3.5 text-slate-500" />}
                >
                  Guardar Borrador
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRejectCorrection}
                  className="text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                >
                  Rechazar / Pedir Corrección
                </Button>
                {!isApproved ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApproveCorrection}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Aprobar Corrección
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handlePublishCorrection}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Publicar al Alumno
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={submission.studentAvatar}
              alt={submission.studentName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{submission.studentName}</h1>
                <span className="text-xs text-slate-400">({submission.studentEmail})</span>
              </div>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">
                {submission.assignmentTitle} • <span className="text-slate-500 font-normal">{submission.courseName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Extensión</span>
              <span className="font-bold text-slate-800">{submission.wordCount} palabras</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fecha de Envío</span>
              <span className="font-bold text-slate-800">{new Date(submission.submittedAt).toLocaleDateString()}</span>
            </div>
            {evaluation?.scores?.overallGrade !== undefined && (
              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Nota Final</span>
                <span className="text-base font-extrabold text-emerald-900 font-mono">
                  {scores.overallGrade} / 10
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switcher if handwritten image exists */}
        {submission.submissionType === 'handwritten' && submission.imageUrl && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('correction')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'correction'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vista de Corrección y Rúbricas
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ver Fotografía Original del Manuscrito</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab: Full Image View for Handwritten */}
      {activeTab === 'image' && submission.imageUrl && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-600" />
              <span>Fotografía Original del Cuaderno / Hoja del Alumno</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('correction')}
              className="text-xs"
            >
              Volver al Panel de Corrección
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center">
            <img
              src={submission.imageUrl}
              alt="Fotografía original del manuscrito"
              className="max-h-[750px] w-auto object-contain rounded-xl shadow-lg border border-slate-300"
            />
          </div>
        </div>
      )}

      {/* Main Grid: Correction Canvas & Evaluation Metrics */}
      {activeTab === 'correction' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (7 cols): Texts (Original / Transcribed & Corrected Version) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Original / Transcribed Text Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {submission.submissionType === 'handwritten' ? 'Texto Extraído (OCR)' : 'Texto Original del Estudiante'}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {submission.wordCount} palabras
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans select-text">
                {submission.extractedText || submission.originalText}
              </div>
            </div>

            {/* Corrected Version Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Versión Corregida
                  </h3>
                </div>
                {isTeacherOrAdmin && (
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    Editable por el Docente
                  </span>
                )}
              </div>

              {isTeacherOrAdmin ? (
                <textarea
                  rows={8}
                  value={correctedText}
                  onChange={e => setCorrectedText(e.target.value)}
                  className="w-full p-4 text-xs font-sans rounded-2xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50/20 text-slate-900 leading-relaxed font-medium"
                  placeholder="Versión corregida con ajustes gramaticales y de estilo..."
                />
              ) : (
                <div className="p-4 rounded-2xl bg-teal-50/30 border border-teal-100 text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans">
                  {correctedText}
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                Tip: Las oraciones corregidas sirven de referencia pedagógica para comparar contra el borrador original.
              </p>
            </div>

            {/* General Feedback & Improvement Recommendations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Devolución Pedagógica General (Feedback)
                  </h3>
                </div>
              </div>

              {isTeacherOrAdmin ? (
                <textarea
                  rows={4}
                  value={generalFeedback}
                  onChange={e => setGeneralFeedback(e.target.value)}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-800 leading-relaxed"
                  placeholder="Escribe la retroalimentación cualitativa para el estudiante..."
                />
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {generalFeedback}
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recomendaciones de Mejora para Próximas Entregas:</span>
                </h4>

                <ul className="space-y-1.5">
                  {recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-50/40 border border-amber-100 text-xs text-amber-950 flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-amber-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                      {isTeacherOrAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRecommendation(idx)}
                          className="text-amber-400 hover:text-rose-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isTeacherOrAdmin && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newRecommendationInput}
                      onChange={e => setNewRecommendationInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRecommendation();
                        }
                      }}
                      placeholder="Agregar nueva recomendación práctica..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddRecommendation}
                      className="text-xs py-1.5"
                    >
                      Añadir
                    </Button>
                  </div>
                )}
              </div>

              {/* Teacher private notes (only visible to teacher/admin) */}
              {isTeacherOrAdmin && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Notas Internas del Profesor (Privadas - No visibles para el alumno):
                  </span>
                  <input
                    type="text"
                    value={teacherNotes}
                    onChange={e => setTeacherNotes(e.target.value)}
                    placeholder="ej. Observación para la reunión de departamento o bonificación aplicada."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-700 italic"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column (5 cols): Identified Mistakes & Rubric Scores */}
          <div className="lg:col-span-5 space-y-6">

            {/* Rubric Scores Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Desglose de Rúbricas y Calificación
                </h3>
                {isTeacherOrAdmin && (
                  <span className="text-[10px] text-teal-700 font-semibold">
                    Ajustable (0-10)
                  </span>
                )}
              </div>

              <RubricScoreSliders
                scores={scores}
                suggestedOverallGrade={evaluation?.suggestedOverallGrade || 8.0}
                isEditable={isTeacherOrAdmin}
                onChangeScores={newScores => setScores(newScores)}
              />
            </div>

            {/* Identified Mistakes Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Observaciones y Errores Detectados
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Total: {evaluation?.mistakes?.length || 0} puntos a revisar
                  </p>
                </div>

                {isTeacherOrAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMistakeToEdit(null);
                      setIsMistakeModalOpen(true);
                    }}
                    className="text-xs py-1"
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Agregar
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {evaluation?.mistakes?.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No se detectaron errores significativos.
                  </div>
                ) : (
                  evaluation?.mistakes?.map(mistake => (
                    <MistakeCard
                      key={mistake.id}
                      mistake={mistake}
                      isEditable={isTeacherOrAdmin}
                      onEdit={m => {
                        setMistakeToEdit(m);
                        setIsMistakeModalOpen(true);
                      }}
                      onDelete={id => handleDeleteMistake(id)}
                    />
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Mistake Edit/Add Modal */}
      <MistakeModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
        onSave={handleSaveMistake}
        mistakeToEdit={mistakeToEdit}
      />

      {/* AI Processing Overlay */}
      <AIProcessingOverlay
        isOpen={isProcessingAI}
      />
    </div>
  );
};
