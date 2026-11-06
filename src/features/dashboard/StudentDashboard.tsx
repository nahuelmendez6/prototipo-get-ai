import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  CheckCheck, 
  Award, 
  PenTool, 
  UploadCloud, 
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, assignments, submissions } = useData();
  const navigate = useNavigate();

  // Enrolled courses
  const myCourses = courses.filter(c => c.studentIds.includes(currentUser?.id || ''));
  const myCourseIds = myCourses.map(c => c.id);

  // Available assignments for enrolled courses
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId));

  // Student's submissions
  const mySubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  const submittedAssignmentIds = mySubmissions.map(s => s.assignmentId);

  // Pending assignments (not yet submitted)
  const pendingAssignments = myAssignments.filter(a => !submittedAssignmentIds.includes(a.id));

  // Only published evaluations with grades are visible to students
  const publishedSubmissions = mySubmissions.filter(s => s.status === 'PUBLISHED' && s.evaluation);
  const grades = publishedSubmissions.map(s => s.evaluation?.scores?.overallGrade || 0);
  const avgGrade = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '9.4';

  return (
    <div className="space-y-8">
      {/* Top Banner with Cambridge Navy and Crimson details */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-[#0d3471] via-[#0a2754] to-[#061734] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#0d3471]/15">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#c81414] text-white">
              Student Portal
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              Cambridge Assessment English
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {currentUser?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 mt-1.5 max-w-xl leading-relaxed">
            Perfect your writing skills with analytical assessment in Content, Communicative Achievement, Organisation, and Language.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/submit-handwritten')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-xs text-xs"
            icon={<UploadCloud className="w-3.5 h-3.5" />}
          >
            Upload Handwritten Photo
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/submit-virtual')}
            className="bg-[#c81414] hover:bg-[#a31111] border-[#c81414] text-white font-bold text-xs shadow-sm"
            icon={<PenTool className="w-3.5 h-3.5" />}
          >
            Online Writing Editor
          </Button>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#c81414]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Courses"
          value={myCourses.length}
          subtitle="Active study cohorts"
          icon={BookOpen}
          color="navy"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingAssignments.length}
          subtitle="Ready to write"
          icon={FileText}
          color="crimson"
          trend={{ value: `${pendingAssignments.length} pending`, positive: pendingAssignments.length === 0 }}
        />
        <StatCard
          title="Submitted Works"
          value={mySubmissions.length}
          subtitle="In draft or graded"
          icon={CheckCheck}
          color="navy"
        />
        <StatCard
          title="Overall Average"
          value={`${avgGrade} / 10`}
          subtitle="Published evaluations"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Main Grid: Pending Assignments & Recent Teacher Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Assignments ready to be written */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Available Writing Tasks
              </h3>
              <p className="text-xs text-slate-500">
                Select a task to draft online or upload a photo of your notebook
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/assignments')}
              className="text-xs font-semibold text-[#0d3471] hover:text-[#0d3471] hover:bg-slate-50"
            >
              View all ({myAssignments.length})
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {myAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">There are currently no tasks scheduled for your courses.</p>
            ) : (
              myAssignments.map(asg => {
                const isSubmitted = submittedAssignmentIds.includes(asg.id);
                const submission = mySubmissions.find(s => s.assignmentId === asg.id);

                return (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <CEFRBadge level={asg.cefrLevel} />
                        <span className="text-xs font-semibold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100">
                          {asg.writingType}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {asg.minWords} - {asg.maxWords} words
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {asg.courseName} • Due: {new Date(asg.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={submission?.status || 'SUBMITTED'} size="sm" />
                          {submission?.status === 'PUBLISHED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/corrections/${submission.id}`)}
                              className="text-xs py-1"
                            >
                              View Feedback
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/submit-handwritten?asgId=${asg.id}`)}
                            className="text-xs"
                            icon={<UploadCloud className="w-3.5 h-3.5 text-slate-500" />}
                          >
                            Photo
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/submit-virtual?asgId=${asg.id}`)}
                            className="text-xs"
                            icon={<PenTool className="w-3.5 h-3.5" />}
                          >
                            Write
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Latest Published Feedback & Grade */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0d3471]" />
                <h3 className="text-base font-bold text-slate-900">
                  Latest Teacher Feedback
                </h3>
              </div>
            </div>

            {publishedSubmissions.length > 0 ? (
              <div className="mt-4 space-y-4">
                {publishedSubmissions.slice(0, 1).map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                        {sub.assignmentTitle}
                      </span>
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-[#0d3471] text-white">
                        {sub.evaluation?.scores?.overallGrade} / 10
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                      "{sub.evaluation?.generalFeedback || 'Excellent syntactic structure and thematic cohesion.'}"
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Validated by teacher</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/corrections/${sub.id}`)}
                        className="text-[#0d3471] font-bold p-0 hover:bg-transparent inline-flex items-center gap-1"
                      >
                        <span>View Rubric</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs leading-relaxed">
                Your submitted essays are being reviewed by your teacher. Grades and rubrics will appear here once approved.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-progress')}
              className="w-full text-xs font-semibold text-slate-700 justify-center"
              icon={<Award className="w-3.5 h-3.5 text-[#0d3471]" />}
            >
              View History & Cambridge Rubrics
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
