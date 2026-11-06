import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UploadCloud, 
  Sparkles, 
  Eye, 
  ImageIcon, 
  PenTool,
  Clock
} from 'lucide-react';

export const SubmissionListPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { submissions, courses } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter submissions by role
  let visibleSubmissions = submissions;
  if (role === 'teacher') {
    const teacherCourseIds = courses.filter(c => c.teacherId === currentUser?.id).map(c => c.id);
    visibleSubmissions = submissions.filter(s => teacherCourseIds.includes(s.courseId));
  } else if (role === 'student') {
    visibleSubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleSubmissions = visibleSubmissions.filter(s =>
      s.studentName.toLowerCase().includes(q) ||
      s.assignmentTitle.toLowerCase().includes(q) ||
      s.courseName.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== 'all') {
    visibleSubmissions = visibleSubmissions.filter(s => s.status === statusFilter);
  }

  if (typeFilter !== 'all') {
    visibleSubmissions = visibleSubmissions.filter(s => s.submissionType === typeFilter);
  }

  const pendingCount = visibleSubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'SUBMITTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">
              {role === 'student' ? 'My Writings & Feedback' : 'Submissions & Assessments Inbox'}
            </h1>
            {pendingCount > 0 && role !== 'student' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#c81414] text-white shadow-2xs">
                {pendingCount} to review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'student'
              ? 'Check the status of your submissions and view grades and feedback approved by your teacher.'
              : 'Assessment workflow: inspect AI proposals, adjust Cambridge criteria, and publish final marks.'}
          </p>
        </div>

        {role !== 'student' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/submit-handwritten')}
            icon={<UploadCloud className="w-4 h-4" />}
          >
            Upload Handwritten Essay
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student, task, or course..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="SUBMITTED">Submitted (Unprocessed)</option>
            <option value="NEEDS_REVISION">Needs Revision</option>
            <option value="APPROVED">Approved by Teacher</option>
            <option value="PUBLISHED">Published to Student</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Formats</option>
            <option value="handwritten">Handwritten (Photo)</option>
            <option value="virtual">Online Writing</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Task / Course</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Words</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {visibleSubmissions.map(sub => {
                const isStudent = role === 'student';
                const isPublished = sub.status === 'PUBLISHED';
                const isPending = sub.status === 'PENDING_REVIEW' || sub.status === 'SUBMITTED';

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{sub.studentName}</p>
                          <p className="text-[11px] text-slate-400">{sub.studentEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{sub.assignmentTitle}</p>
                      <p className="text-[11px] text-slate-500 truncate">{sub.courseName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {sub.submissionType === 'handwritten' ? (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                            <span>Handwritten</span>
                          </>
                        ) : (
                          <>
                            <PenTool className="w-3.5 h-3.5 text-[#0d3471]" />
                            <span>Online</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {sub.wordCount} words
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isStudent && !isPublished ? (
                        <span className="text-[11px] text-slate-400 italic flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Under review</span>
                        </span>
                      ) : (
                        <Button
                          variant={isPending && role !== 'student' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => navigate(`/corrections/${sub.id}`)}
                          className="text-xs py-1"
                          icon={isPending && role !== 'student' ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5" />}
                        >
                          {role === 'student' ? 'View Feedback' : isPending ? 'Review AI' : 'Details'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleSubmissions.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No submissions found matching the applied filters.
          </div>
        )}
      </div>
    </div>
  );
};
