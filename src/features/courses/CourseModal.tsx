import React, { useState, useEffect } from 'react';
import { Course, CEFRLevel } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { mockCourseService } from '../../services/mockCourseService';
import { useToast } from '../../contexts/ToastContext';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
}) => {
  const { users, reloadAll } = useData();
  const { showToast } = useToast();
  const teachers = users.filter(u => u.role === 'teacher');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('B2');
  const [teacherId, setTeacherId] = useState('');
  const [schedule, setSchedule] = useState('');
  const [academicPeriod, setAcademicPeriod] = useState('Academic Year 2026');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setCode(courseToEdit.code);
      setLevel(courseToEdit.level);
      setTeacherId(courseToEdit.teacherId);
      setSchedule(courseToEdit.schedule);
      setAcademicPeriod(courseToEdit.academicPeriod);
      setDescription(courseToEdit.description);
    } else {
      setName('');
      setCode(`ENG-${Date.now().toString().slice(-4)}`);
      setLevel('B2');
      setTeacherId(teachers[0]?.id || '');
      setSchedule('Mondays & Wednesdays 18:30 - 20:00');
      setAcademicPeriod('Term 1 - 2026');
      setDescription('');
    }
  }, [courseToEdit, isOpen, teachers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    const teacherName = selectedTeacher?.name || 'Assigned Instructor';

    if (courseToEdit) {
      mockCourseService.updateCourse(courseToEdit.id, {
        name,
        code,
        level,
        teacherId,
        teacherName,
        schedule,
        academicPeriod,
        description,
      });
      showToast('success', 'Course Updated', `Course "${name}" was updated.`);
    } else {
      mockCourseService.createCourse({
        name,
        code,
        level,
        teacherId,
        teacherName,
        studentIds: [],
        schedule,
        academicPeriod,
        description,
      });
      showToast('success', 'Course Created', `Course "${name}" was created successfully.`);
    }

    reloadAll();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseToEdit ? 'Edit Course' : 'Create New Course'}
      subtitle="Define CEFR standard, lead teacher, schedule, and course syllabus."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Cambridge B2 First (FCE) - Preparation"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. FCE-B2-01"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CEFR Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value as CEFRLevel)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="A1">A1 - Beginner (Breakthrough)</option>
              <option value="A2">A2 - Elementary (Waystage)</option>
              <option value="B1">B1 - Intermediate (PET / Threshold)</option>
              <option value="B2">B2 - Upper Intermediate (FCE / Vantage)</option>
              <option value="C1">C1 - Advanced (CAE / Effective Operational)</option>
              <option value="C2">C2 - Proficiency (CPE / Mastery)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Instructor</label>
            <select
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Schedule & Days</label>
            <input
              type="text"
              required
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              placeholder="e.g. Mondays & Wednesdays 18:30 - 20:00"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Period</label>
          <input
            type="text"
            required
            value={academicPeriod}
            onChange={e => setAcademicPeriod(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Syllabus</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Course syllabus, target Cambridge exam, or writing genres covered."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {courseToEdit ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
