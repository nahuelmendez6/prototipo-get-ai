import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Mistake, EvaluationScores } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MistakeCard } from './MistakeCard';
import { MistakeModal } from './MistakeModal';
import { RubricScoreSliders } from './RubricScoreSliders';
import { mockCorrectionService } from '../../services/mockCorrectionService';
import { mockSubmissionService } from '../../services/mockSubmissionService';
import { useToast } from '../../contexts/ToastContext';
import { AIProcessingOverlay } from '../../components/ui/LoadingSpinner';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Send, 
  Save, 
  Plus, 
  FileText, 
  Clock, 
  Lightbulb, 
  MessageSquare,
  Image as ImageIcon,
  X,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

export const CorrectionInterfacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { submissions, assignments, reloadAll } = useData();
  const { showToast } = useToast();

  const submission = submissions.find(s => s.id === id);
  const assignment = assignments.find(a => a.id === submission?.assignmentId);

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
    content: 4.0,
    communicativeAchievement: 4.0,
    organisation: 4.0,
    language: 4.0,
    totalMarks: 16.0,
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
        <p className="text-sm text-slate-500">Submission not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-3">
          Back
        </Button>
      </div>
    );
  }

  const isStudent = role === 'student';
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin';
  const isPublished = submission.status === 'PUBLISHED';
  const isApproved = submission.status === 'APPROVED';
  const isSubmittedOnly = submission.status === 'SUBMITTED';

  // Rule: Students must NEVER see unapproved AI corrections
  if (isStudent && !isPublished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Writing Under Teacher Review
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your submission for <strong>"{submission.assignmentTitle}"</strong> has been received. Your teacher is reviewing the AI evaluation and assigning final Cambridge marks.
        </p>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
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
    showToast('success', 'AI Assessment Generated', 'The preliminary Cambridge analytical assessment has been computed.');
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
    showToast('success', 'Changes Saved', 'Draft marks and comments saved.');
  };

  // Teacher Approves correction
  const handleApproveCorrection = () => {
    handleSaveTeacherDraft();
    mockCorrectionService.approveCorrection(submission.id, teacherNotes);
    reloadAll();
    showToast('success', 'Assessment Approved', 'Teacher assessment validated. You can now publish it to the student.');
  };

  // Teacher Publishes correction
  const handlePublishCorrection = () => {
    handleSaveTeacherDraft();
    mockCorrectionService.publishCorrection(submission.id);
    reloadAll();
    showToast('success', 'Assessment Published', 'The student can now view their official Cambridge marks and rubrics.');
  };

  // Teacher Rejects / Requests Revision
  const handleRejectCorrection = () => {
    const reason = prompt('Indicate the revisions the student should make:') || 'Please review word count and paragraph organisation according to the prompt.';
    mockCorrectionService.rejectCorrection(submission.id, reason);
    reloadAll();
    showToast('warning', 'Revision Requested', 'Submission marked as "Needs Revision".');
  };

  // Mistake management
  const handleSaveMistake = (data: Omit<Mistake, 'id'>, editId?: string) => {
    if (editId) {
      mockCorrectionService.updateMistake(submission.id, editId, data);
      showToast('info', 'Note Updated', 'Correction note updated.');
    } else {
      mockCorrectionService.addMistake(submission.id, data);
      showToast('success', 'Note Added', 'New observation added.');
    }
    reloadAll();
  };

  const handleDeleteMistake = (mistakeId: string) => {
    mockCorrectionService.deleteMistake(submission.id, mistakeId);
    showToast('info', 'Note Deleted', 'Observation removed.');
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
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/submissions')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0d3471] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to submissions inbox</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} size="md" />
          {submission.submissionType === 'handwritten' && (
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Digitized Manuscript</span>
            </span>
          )}
        </div>
      </div>

      {/* Mandatory Notification Box: AI suggestions await teacher review */}
      {isTeacherOrAdmin && !isPublished && (
        <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c81414] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-200">
                  Pedagogical Protocol
                </span>
                <span className="text-xs font-bold text-white">
                  AI Assessment Draft (Teacher Validation Required)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Scores for Content, Communicative Achievement, Organisation, and Language are AI suggestions. <strong>Modify bands, feedback, or error observations</strong>, and click approve to publish.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {isSubmittedOnly && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunAIProcessing}
                icon={<Sparkles className="w-3.5 h-3.5 text-[#c81414]" />}
                className="bg-[#0d3471] hover:bg-[#08234d]"
              >
                Process with AI Now
              </Button>
            )}

            {!isSubmittedOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveTeacherDraft}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  icon={<Save className="w-3.5 h-3.5 text-slate-300" />}
                >
                  Save Draft
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRejectCorrection}
                  className="text-[#c81414] hover:bg-red-50 border border-red-200 text-xs bg-white"
                >
                  Request Revision
                </Button>
                {!isApproved ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApproveCorrection}
                    className="bg-[#0d3471] hover:bg-[#08234d] text-white font-bold"
                    icon={<Check className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Approve Rubric
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handlePublishCorrection}
                    className="font-bold shadow-xs"
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Publish to Student
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
              <p className="text-xs font-bold text-[#0d3471] mt-0.5">
                {submission.assignmentTitle} • <span className="text-slate-500 font-normal">{submission.courseName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Length</span>
              <span className="font-bold text-slate-800">{submission.wordCount} words</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
              <span className="font-bold text-slate-800">{new Date(submission.submittedAt).toLocaleDateString()}</span>
            </div>
            {evaluation?.scores?.overallGrade !== undefined && (
              <div className="bg-[#0d3471]/10 border border-[#0d3471]/20 px-4 py-1.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-[#0d3471] block">Final Grade</span>
                <span className="text-base font-extrabold text-[#0d3471] font-mono">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'correction'
                  ? 'bg-[#0d3471] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cambridge Assessment & Text Analysis
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-[#0d3471] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>View Original Notebook Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab: Full Image View for Handwritten */}
      {activeTab === 'image' && submission.imageUrl && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0d3471]" />
              <span>Original Sheet / Exam Photo</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('correction')}
              className="text-xs"
            >
              Back to Analysis
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center">
            <img
              src={submission.imageUrl}
              alt="Original manuscript"
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
                  <FileText className="w-4 h-4 text-[#0d3471]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {submission.submissionType === 'handwritten' ? 'Text Transcribed via Optical Recognition' : 'Student\'s Original Writing'}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {submission.wordCount} words
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
                  <Sparkles className="w-4 h-4 text-[#0d3471]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Exemplar Corrected Version (Band 5)
                  </h3>
                </div>
                {isTeacherOrAdmin && (
                  <span className="text-[10px] text-[#0d3471] font-bold bg-[#0d3471]/10 px-2 py-0.5 rounded border border-[#0d3471]/20">
                    Editable by Teacher
                  </span>
                )}
              </div>

              {isTeacherOrAdmin ? (
                <textarea
                  rows={8}
                  value={correctedText}
                  onChange={e => setCorrectedText(e.target.value)}
                  className="w-full p-4 text-xs font-sans rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50/50 text-slate-900 leading-relaxed font-medium"
                  placeholder="Refined version with formal vocabulary and advanced syntax..."
                />
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 whitespace-pre-line leading-relaxed font-sans">
                  {correctedText}
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                Note: This exemplar version illustrates to the student how to demonstrate Cambridge Band 5 descriptors.
              </p>
            </div>

            {/* General Feedback & Improvement Recommendations */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0d3471]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    General Pedagogical Feedback
                  </h3>
                </div>
              </div>

              {isTeacherOrAdmin ? (
                <textarea
                  rows={4}
                  value={generalFeedback}
                  onChange={e => setGeneralFeedback(e.target.value)}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 text-slate-800 leading-relaxed"
                  placeholder="Provide qualitative feedback on task achievement and impact on the reader..."
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
                  <span>Recommendations for future tasks:</span>
                </h4>

                <ul className="space-y-1.5">
                  {recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-[#c81414] mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                      {isTeacherOrAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRecommendation(idx)}
                          className="text-slate-400 hover:text-[#c81414] p-0.5 cursor-pointer"
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
                      placeholder="Add practical recommendation..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-800"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddRecommendation}
                      className="text-xs py-1.5"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Teacher private notes (only visible to teacher/admin) */}
              {isTeacherOrAdmin && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Teacher Internal Notes (Private - Hidden from student):
                  </span>
                  <input
                    type="text"
                    value={teacherNotes}
                    onChange={e => setTeacherNotes(e.target.value)}
                    placeholder="e.g. Mark justification or department moderation notes..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-700 italic"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column (5 cols): Cambridge Rubric Scores & Identified Mistakes */}
          <div className="lg:col-span-5 space-y-6">

            {/* Rubric Scores Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#0d3471]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Cambridge Rubric
                  </h3>
                </div>
                {isTeacherOrAdmin && (
                  <span className="text-[10px] text-[#0d3471] font-bold bg-[#0d3471]/10 px-2 py-0.5 rounded">
                    Adjustable (0 - 5 bands)
                  </span>
                )}
              </div>

              <RubricScoreSliders
                scores={scores}
                suggestedOverallGrade={evaluation?.suggestedOverallGrade || 8.0}
                isEditable={isTeacherOrAdmin}
                onChangeScores={newScores => setScores(newScores)}
                cefrLevel={assignment?.cefrLevel}
                examType={assignment?.rubric?.examType === 'CAE' ? 'CAE' : 'FCE'}
              />
            </div>

            {/* Identified Mistakes Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Identified Observations & Slips
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Total: {evaluation?.mistakes?.length || 0} observations logged
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
                    New
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {evaluation?.mistakes?.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No significant linguistic slips detected.
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
