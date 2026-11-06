import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Assignment } from '../../types';
import { CEFRBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AssignmentModal } from './AssignmentModal';
import { mockAssignmentService } from '../../services/mockAssignmentService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Plus, 
  Calendar, 
  Edit, 
  Trash2, 
  UploadCloud, 
  PenTool, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AssignmentListPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { assignments, submissions, courses, reloadAll } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignmentForEdit, setSelectedAssignmentForEdit] = useState<Assignment | null>(null);

  // Filter based on role
  let visibleAssignments = assignments;
  if (role === 'teacher') {
    visibleAssignments = assignments.filter(a => a.teacherId === currentUser?.id);
  } else if (role === 'student') {
    const enrolledCourseIds = courses.filter(c => c.studentIds.includes(currentUser?.id || '')).map(c => c.id);
    visibleAssignments = assignments.filter(a => enrolledCourseIds.includes(a.courseId));
  }

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleAssignments = visibleAssignments.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.courseName.toLowerCase().includes(q) ||
      a.writingType.toLowerCase().includes(q)
    );
  }

  if (typeFilter !== 'all') {
    visibleAssignments = visibleAssignments.filter(a => a.writingType === typeFilter);
  }

  const handleDeleteAssignment = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete assignment "${title}"?`)) {
      mockAssignmentService.deleteAssignment(id);
      showToast('info', 'Assignment Deleted', `Assignment "${title}" was successfully deleted.`);
      reloadAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {role === 'student' ? 'My Writing Assignments' : 'Cambridge Tasks & Essays'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'student'
              ? 'Check prompts, word count limits, and submit your writing via the online editor or photo upload.'
              : 'Set up prompts, Cambridge assessment rubrics (CAE and FCE), and manage deadlines.'}
          </p>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedAssignmentForEdit(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            New Assignment
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, format, or course..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white text-slate-800"
          />
        </div>

        {/* Writing Type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1">Type:</span>
          {['all', 'Essay', 'Email', 'Article', 'Review', 'Story'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-[#0d3471] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleAssignments.map(asg => {
          const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);
          const studentSubmission = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser?.id);

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header: Level & Type */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <CEFRBadge level={asg.cefrLevel} />
                    <span className="text-xs font-bold text-[#0d3471] bg-[#0d3471]/10 border border-[#0d3471]/20 px-2.5 py-0.5 rounded-md">
                      {asg.writingType}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(asg.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Title and Course */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {asg.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  {asg.courseName}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {asg.description}
                </p>

                {/* Word Count & Rubric info */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Length: <strong>{asg.minWords} - {asg.maxWords} words</strong></span>
                  {(role === 'teacher' || role === 'admin') && (
                    <span className="text-[#0d3471] font-bold text-[11px]">
                      {asgSubmissions.length} submissions received
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/assignments/${asg.id}`)}
                  className="text-xs py-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>

                {role === 'student' ? (
                  studentSubmission ? (
                    <div className="flex items-center gap-2">
                      <StatusBadge status={studentSubmission.status} size="sm" />
                      {studentSubmission.status === 'PUBLISHED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/corrections/${studentSubmission.id}`)}
                          className="text-xs py-1"
                        >
                          View Grade
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/submit-handwritten?asgId=${asg.id}`)}
                        className="text-xs py-1.5"
                        icon={<UploadCloud className="w-3.5 h-3.5 text-slate-500" />}
                      >
                        Photo
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/submit-virtual?asgId=${asg.id}`)}
                        className="text-xs py-1.5"
                        icon={<PenTool className="w-3.5 h-3.5" />}
                      >
                        Write
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssignmentForEdit(asg);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#0d3471] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit assignment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                      className="p-1.5 text-slate-400 hover:text-[#c81414] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleAssignments.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-xs">
          No assignments match your search.
        </div>
      )}

      {/* Edit/Create Assignment Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignmentToEdit={selectedAssignmentForEdit}
      />
    </div>
  );
};
