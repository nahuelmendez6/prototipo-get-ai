import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge, CEFRBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  UploadCloud, 
  Plus, 
  Sparkles, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, assignments, submissions } = useData();
  const navigate = useNavigate();

  // Filter courses assigned to this teacher
  const myCourses = courses.filter(c => c.teacherId === currentUser?.id);
  const myCourseIds = myCourses.map(c => c.id);

  // Total enrolled students across teacher's courses
  const studentIdSet = new Set<string>();
  myCourses.forEach(c => c.studentIds.forEach(id => studentIdSet.add(id)));
  const totalStudents = studentIdSet.size;

  // Submissions for this teacher's courses
  const mySubmissions = submissions.filter(s => myCourseIds.includes(s.courseId));
  const pendingReviewSubmissions = mySubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED');
  const publishedSubmissions = mySubmissions.filter(s => s.status === 'PUBLISHED');

  // Teacher's assignments
  const myAssignments = assignments.filter(a => a.teacherId === currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Top Banner with Cambridge Navy and Crimson details */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-[#0d3471] via-[#0a2754] to-[#061734] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#0d3471]/15">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#c81414] text-white">
              Teacher Dashboard
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              Cambridge Assessment Centre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {currentUser?.name || 'Teacher'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 mt-1.5 max-w-xl leading-relaxed">
            Manage your writing classes, review AI pre-evaluations against Cambridge criteria, and publish approved marks.
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
            Upload Handwritten Essay
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/assignments')}
            className="bg-[#c81414] hover:bg-[#a31111] border-[#c81414] text-white font-bold text-xs shadow-sm"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Assignment
          </Button>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#c81414]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value={myCourses.length}
          subtitle="Active cohorts"
          icon={BookOpen}
          color="navy"
        />
        <StatCard
          title="Active Students"
          value={totalStudents}
          subtitle="Enrolled students"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviewSubmissions.length}
          subtitle="Awaiting teacher validation"
          icon={Sparkles}
          color="crimson"
          trend={{ value: `${pendingReviewSubmissions.length} to review`, positive: pendingReviewSubmissions.length === 0 }}
        />
        <StatCard
          title="Published Grades"
          value={publishedSubmissions.length}
          subtitle="Visible to students"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Main Grid: Pending reviews & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Submissions Awaiting Teacher Review (Priority) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c81414] animate-pulse" />
                <h3 className="text-base font-bold text-slate-900">
                  Submissions Requiring Teacher Review
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI has evaluated these texts. Validate Cambridge rubrics, add feedback, and publish.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/submissions')}
              className="text-xs font-semibold text-[#0d3471] hover:text-[#0d3471] hover:bg-slate-50"
            >
              View all ({mySubmissions.length})
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingReviewSubmissions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending submissions to review. All assessments are up to date!
              </div>
            ) : (
              pendingReviewSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400">
                          ({sub.submissionType === 'handwritten' ? 'Handwritten' : 'Digital'})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {sub.courseName} • {sub.wordCount} words
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                    <StatusBadge status={sub.status} size="sm" />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/corrections/${sub.id}`)}
                      className="text-xs font-semibold py-1.5 px-3"
                      icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                    >
                      Review Assessment
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Active Assignments & Deadlines */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0d3471]" />
                <h3 className="text-base font-bold text-slate-900">
                  Upcoming Due Dates
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/assignments')}
                className="text-xs font-semibold text-[#0d3471] hover:text-[#0d3471]"
              >
                Manage
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {myAssignments.slice(0, 4).map(asg => (
                <div key={asg.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <CEFRBadge level={asg.cefrLevel} />
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(asg.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{asg.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{asg.courseName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student-progress')}
              className="w-full text-xs font-semibold text-slate-700 justify-center"
              icon={<Users className="w-3.5 h-3.5 text-[#0d3471]" />}
            >
              View Performance Analytics
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
