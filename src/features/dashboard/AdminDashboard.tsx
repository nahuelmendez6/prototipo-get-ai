import React from 'react';
import { useData } from '../../contexts/DataContext';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Plus, 
  ArrowRight,
  Activity,
  Award,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, courses, submissions, activityLogs } = useData();
  const navigate = useNavigate();

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const pendingCorrections = submissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED');

  // Calculate average published grade
  const publishedSubmissions = submissions.filter(s => s.status === 'PUBLISHED' && s.evaluation?.scores?.overallGrade);
  const avgGrade = publishedSubmissions.length > 0
    ? (publishedSubmissions.reduce((acc, curr) => acc + (curr.evaluation?.scores?.overallGrade || 0), 0) / publishedSubmissions.length).toFixed(1)
    : '8.5';

  return (
    <div className="space-y-8">
      {/* Top Banner with Cambridge Navy and Crimson details */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-[#0d3471] via-[#0a2754] to-[#061734] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#0d3471]/15">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#c81414] text-white">
              Institutional Administration
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              Authorized Cambridge Centre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Academic Supervision & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 mt-1.5 max-w-xl leading-relaxed">
            Monitor writing workflows in real time, verify compliance with teacher approval protocols, and audit course groups.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/users')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-xs text-xs"
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Users
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/courses')}
            className="bg-[#c81414] hover:bg-[#a31111] border-[#c81414] text-white font-bold text-xs shadow-sm"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Course
          </Button>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#c81414]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Students"
          value={students.length}
          subtitle="In active courses"
          icon={GraduationCap}
          color="navy"
          trend={{ value: '+12% this month', positive: true }}
        />
        <StatCard
          title="Teaching Staff"
          value={teachers.length}
          subtitle="Lead instructors"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Cambridge Courses"
          value={courses.length}
          subtitle="FCE, CAE & Advanced"
          icon={BookOpen}
          color="navy"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingCorrections.length}
          subtitle="Awaiting teacher approval"
          icon={Clock}
          color="crimson"
        />
      </div>

      {/* Main Sections: Recent Submissions & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Submissions overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Writing Workflow
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time traceability of handwritten and digital submissions
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/submissions')}
                className="text-xs font-semibold text-[#0d3471] hover:text-[#0d3471] hover:bg-slate-50"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {submissions.slice(0, 5).map(sub => (
                <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {sub.studentName} • {sub.courseName} • <span className="capitalize">{sub.submissionType === 'handwritten' ? 'Handwritten' : 'Digital'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={sub.status} size="sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/corrections/${sub.id}`)}
                      className="text-xs py-1 px-2.5"
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#0d3471]" />
              <span>Institutional Average: <strong>{avgGrade} / 10</strong></span>
            </span>
            <span className="text-slate-400">Total in progress: {submissions.length} essays</span>
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0d3471]" />
              <h3 className="text-base font-bold text-slate-900">
                Live Audit Log
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#c81414] tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              Live
            </span>
          </div>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-1">
            {activityLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#0d3471] mt-1.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 leading-snug">
                    {log.userName} <span className="font-normal text-slate-400">({log.role})</span>
                  </p>
                  <p className="text-[11px] text-[#0d3471] font-medium">
                    {log.action}: <span className="text-slate-700">{log.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Traceability log synced</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
