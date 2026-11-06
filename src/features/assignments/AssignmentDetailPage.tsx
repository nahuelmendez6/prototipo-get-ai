import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CEFRBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getExamTypeFromLevel, CAMBRIDGE_CRITERIA, CambridgeExam } from '../../types';
import { 
  ArrowLeft, 
  UploadCloud, 
  PenTool, 
  FileCheck2, 
  BookOpen
} from 'lucide-react';

export const AssignmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();
  const { assignments, submissions } = useData();

  const assignment = assignments.find(a => a.id === id);

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Assignment not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/assignments')} className="mt-3">
          Back to Assignments
        </Button>
      </div>
    );
  }

  // Student's submission if applicable
  const studentSubmission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser?.id);
  // All submissions for this assignment (for teacher / admin)
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);

  const examType: CambridgeExam = (assignment.rubric.examType === 'CAE' || assignment.rubric.examType === 'FCE')
    ? assignment.rubric.examType
    : getExamTypeFromLevel(assignment.cefrLevel);
  const examCriteria = CAMBRIDGE_CRITERIA[examType];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/assignments')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to assignments list</span>
        </button>
      </div>

      {/* Main Assignment Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CEFRBadge level={assignment.cefrLevel} />
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                {assignment.writingType}
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                Cambridge {examType}
              </span>
              <span className="text-xs text-slate-400">• {assignment.courseName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {assignment.title}
            </h1>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {assignment.description}
            </p>
          </div>

          {/* Quick submission buttons for students */}
          {role === 'student' && !studentSubmission && (
            <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/submit-handwritten?asgId=${assignment.id}`)}
                icon={<UploadCloud className="w-4 h-4 text-slate-600" />}
              >
                Upload Handwritten Photo
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/submit-virtual?asgId=${assignment.id}`)}
                icon={<PenTool className="w-4 h-4" />}
              >
                Write Online
              </Button>
            </div>
          )}
        </div>

        {/* Requirements Box */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Word Count</span>
            <span className="font-bold text-slate-800">{assignment.minWords} - {assignment.maxWords} words</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Due Date</span>
            <span className="font-bold text-slate-800">{new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Lead Teacher</span>
            <span className="font-bold text-slate-800">{assignment.teacherName}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
            <span className="font-bold text-emerald-700 capitalize">{assignment.status}</span>
          </div>
        </div>
      </div>

      {/* Grid: Instructions & Rubrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Prompt & Instructions */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Official Task Prompt & Instructions
            </h3>
            <span className="text-xs text-slate-400 font-semibold uppercase">Cambridge Assessment</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 font-sans text-sm text-slate-800 whitespace-pre-line leading-relaxed shadow-2xs">
            {assignment.instructions}
          </div>

          {/* Student current submission notice */}
          {role === 'student' && studentSubmission && (
            <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-900">You have already submitted this assignment</p>
                <p className="text-[11px] text-teal-700 mt-0.5">
                  Submitted on: {new Date(studentSubmission.submittedAt).toLocaleString()} ({studentSubmission.wordCount} words)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={studentSubmission.status} size="sm" />
                {studentSubmission.status === 'PUBLISHED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/corrections/${studentSubmission.id}`)}
                    className="text-xs py-1"
                  >
                    View Feedback
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Cambridge Rubric Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Cambridge Criteria ({examType})</span>
              </h3>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                0 - 5 Marks / Subscale
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">1. Content</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {assignment.rubric.contentWeight ?? 25}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {examCriteria.content.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">2. Communicative Achievement</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {assignment.rubric.communicativeAchievementWeight ?? 25}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {examCriteria.communicativeAchievement.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">3. Organisation</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {assignment.rubric.organisationWeight ?? 25}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {examCriteria.organisation.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">4. Language</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {assignment.rubric.languageWeight ?? 25}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {examCriteria.language.description}
                </p>
              </div>
            </div>

            {assignment.rubric.customGuidelines && (
              <div className="mt-4 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
                <span className="font-semibold block mb-0.5">Teacher Guidelines:</span>
                <p className="italic">{assignment.rubric.customGuidelines}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* If Teacher or Admin: List of all submissions for this assignment */}
      {(role === 'teacher' || role === 'admin') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-teal-600" />
              <span>Student Submissions ({assignmentSubmissions.length})</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/submit-handwritten?asgId=${assignment.id}`)}
              icon={<UploadCloud className="w-3.5 h-3.5 text-slate-500" />}
            >
              Upload Student Handwritten Work
            </Button>
          </div>

          <div className="space-y-3">
            {assignmentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No submissions received for this assignment yet.</p>
            ) : (
              assignmentSubmissions.map(sub => (
                <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-500">
                        {sub.submissionType === 'handwritten' ? 'Handwritten (Uploaded image)' : 'Online Editor'} • {sub.wordCount} words • Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={sub.status} size="sm" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/corrections/${sub.id}`)}
                      className="text-xs py-1.5"
                    >
                      {sub.status === 'PUBLISHED' ? 'View Published Feedback' : 'Review Cambridge Assessment'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
