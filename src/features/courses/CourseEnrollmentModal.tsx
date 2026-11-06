import React from 'react';
import { Course } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { mockCourseService } from '../../services/mockCourseService';
import { useToast } from '../../contexts/ToastContext';
import { UserMinus, UserPlus } from 'lucide-react';

interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const { users, reloadAll } = useData();
  const { showToast } = useToast();

  if (!course) return null;

  const allStudents = users.filter(u => u.role === 'student');

  const handleToggleStudent = (studentId: string, studentName: string) => {
    const isEnrolled = course.studentIds.includes(studentId);
    if (isEnrolled) {
      mockCourseService.unenrollStudent(course.id, studentId);
      showToast('info', 'Student Unenrolled', `${studentName} was removed from ${course.name}.`);
    } else {
      mockCourseService.enrollStudent(course.id, studentId);
      showToast('success', 'Student Enrolled', `${studentName} was added to ${course.name}.`);
    }
    reloadAll();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Course Enrollment - ${course.name}`}
      subtitle={`Code: ${course.code} • Total enrolled: ${course.studentIds.length}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Click Enroll or Remove to update the student roster for this course:
        </p>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
          {allStudents.map(student => {
            const isEnrolled = course.studentIds.includes(student.id);

            return (
              <div key={student.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{student.name}</p>
                    <p className="text-[11px] text-slate-500">{student.email} • ID: {student.dni}</p>
                  </div>
                </div>

                {isEnrolled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStudent(student.id, student.name)}
                    className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 py-1"
                    icon={<UserMinus className="w-3.5 h-3.5" />}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleToggleStudent(student.id, student.name)}
                    className="text-xs py-1"
                    icon={<UserPlus className="w-3.5 h-3.5" />}
                  >
                    Enroll
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
