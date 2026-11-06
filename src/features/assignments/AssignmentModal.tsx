import React, { useState, useEffect } from 'react';
import { Assignment, WritingType, CEFRLevel, RubricConfig, CambridgeExam, getExamTypeFromLevel } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockAssignmentService } from '../../services/mockAssignmentService';
import { useToast } from '../../contexts/ToastContext';
import { BookOpen } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentToEdit?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentToEdit,
}) => {
  const { courses, reloadAll } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [writingType, setWritingType] = useState<WritingType>('Essay');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B2');
  const [examType, setExamType] = useState<CambridgeExam>('FCE');
  const [minWords, setMinWords] = useState(140);
  const [maxWords, setMaxWords] = useState(190);
  const [dueDate, setDueDate] = useState('');

  // Cambridge Rubric weights
  const [contentWeight, setContentWeight] = useState(25);
  const [commWeight, setCommWeight] = useState(25);
  const [orgWeight, setOrgWeight] = useState(25);
  const [langWeight, setLangWeight] = useState(25);
  const [guidelines, setGuidelines] = useState('');

  useEffect(() => {
    if (assignmentToEdit) {
      setCourseId(assignmentToEdit.courseId);
      setTitle(assignmentToEdit.title);
      setDescription(assignmentToEdit.description);
      setInstructions(assignmentToEdit.instructions);
      setWritingType(assignmentToEdit.writingType);
      setCefrLevel(assignmentToEdit.cefrLevel);
      setExamType((assignmentToEdit.rubric.examType === 'CAE' || assignmentToEdit.rubric.examType === 'FCE')
        ? assignmentToEdit.rubric.examType
        : getExamTypeFromLevel(assignmentToEdit.cefrLevel));
      setMinWords(assignmentToEdit.minWords);
      setMaxWords(assignmentToEdit.maxWords);
      setDueDate(assignmentToEdit.dueDate);
      setContentWeight(assignmentToEdit.rubric.contentWeight ?? 25);
      setCommWeight(assignmentToEdit.rubric.communicativeAchievementWeight ?? 25);
      setOrgWeight(assignmentToEdit.rubric.organisationWeight ?? 25);
      setLangWeight(assignmentToEdit.rubric.languageWeight ?? 25);
      setGuidelines(assignmentToEdit.rubric.customGuidelines || '');
    } else {
      setCourseId(courses[0]?.id || '');
      setTitle('');
      setDescription('');
      setInstructions('');
      setWritingType('Essay');
      setCefrLevel('B2');
      setExamType('FCE');
      setMinWords(140);
      setMaxWords(190);
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 14);
      setDueDate(defaultDue.toISOString().split('T')[0]);
      setContentWeight(25);
      setCommWeight(25);
      setOrgWeight(25);
      setLangWeight(25);
      setGuidelines('Focus evaluation on Cambridge Band 5 descriptors: logical cohesion, task completion, and lexical precision.');
    }
  }, [assignmentToEdit, isOpen, courses]);

  const handleCefrChange = (newLevel: CEFRLevel) => {
    setCefrLevel(newLevel);
    const inferred = getExamTypeFromLevel(newLevel);
    setExamType(inferred);
    if (inferred === 'CAE') {
      setMinWords(220);
      setMaxWords(260);
    } else if (newLevel === 'B2') {
      setMinWords(140);
      setMaxWords(190);
    } else {
      setMinWords(100);
      setMaxWords(140);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCourse = courses.find(c => c.id === courseId);

    const rubric: RubricConfig = {
      contentWeight,
      communicativeAchievementWeight: commWeight,
      organisationWeight: orgWeight,
      languageWeight: langWeight,
      examType,
      customGuidelines: guidelines,
      grammarWeight: langWeight,
      vocabularyWeight: langWeight,
      spellingPunctuationWeight: langWeight,
      coherenceCohesionWeight: orgWeight,
      taskAchievementWeight: contentWeight,
    };

    if (assignmentToEdit) {
      mockAssignmentService.updateAssignment(assignmentToEdit.id, {
        courseId,
        courseName: selectedCourse?.name || assignmentToEdit.courseName,
        title,
        description,
        instructions,
        writingType,
        cefrLevel,
        minWords: Number(minWords),
        maxWords: Number(maxWords),
        dueDate,
        rubric,
      });
      showToast('success', 'Assignment Updated', `Assignment "${title}" has been updated.`);
    } else {
      mockAssignmentService.createAssignment({
        courseId,
        courseName: selectedCourse?.name || 'Course',
        teacherId: currentUser?.id || 'teacher-1',
        teacherName: currentUser?.name || 'Lead Teacher',
        title,
        description,
        instructions,
        writingType,
        cefrLevel,
        minWords: Number(minWords),
        maxWords: Number(maxWords),
        dueDate,
        rubric,
        status: 'active',
      });
      showToast('success', 'Assignment Published', `Assignment "${title}" is now available to enrolled students.`);
    }

    reloadAll();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignmentToEdit ? 'Edit Writing Assignment' : 'Create Writing Assignment'}
      subtitle="Define format, CEFR standard, Cambridge evaluation rubric (CAE/FCE), and instructions."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Course</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. FCE Essay: Advantages and Disadvantages of Remote Working"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Format</label>
            <select
              value={writingType}
              onChange={e => setWritingType(e.target.value as WritingType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="Essay">Essay (Opinion / Discursive)</option>
              <option value="Email">Email (Formal / Informal)</option>
              <option value="Article">Article (Magazine / Blog)</option>
              <option value="Story">Story / Short Narrative</option>
              <option value="Review">Review (Film / Book / Place)</option>
              <option value="Report">Report (Technical / Academic)</option>
              <option value="Other">Other format</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CEFR Level & Exam</label>
            <select
              value={cefrLevel}
              onChange={e => handleCefrChange(e.target.value as CEFRLevel)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            >
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate (PET)</option>
              <option value="B2">B2 - Upper Intermediate (FCE)</option>
              <option value="C1">C1 - Advanced (CAE)</option>
              <option value="C2">C2 - Proficiency (CPE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Word Count Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minWords}
                onChange={e => setMinWords(+e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-center"
                placeholder="Min"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={maxWords}
                onChange={e => setMaxWords(+e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-center"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="One-sentence communicative purpose summary."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Task Instructions & Exam Prompt</label>
          <textarea
            rows={4}
            required
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Enter the complete prompt in English as read by the student (e.g. Cambridge exam question, notes to include, target audience)."
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Cambridge Rubric Configuration Box */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Cambridge Assessment Criteria ({examType})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-teal-800">
                Total: {contentWeight + commWeight + orgWeight + langWeight}%
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-teal-200">
                <button
                  type="button"
                  onClick={() => setExamType('FCE')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    examType === 'FCE' ? 'bg-teal-600 text-white' : 'text-slate-600'
                  }`}
                >
                  FCE (B2)
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('CAE')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    examType === 'CAE' ? 'bg-teal-600 text-white' : 'text-slate-600'
                  }`}
                >
                  CAE (C1)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-600 block mb-1 font-semibold">1. Content</span>
              <input
                type="number"
                value={contentWeight}
                onChange={e => setContentWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block mb-1 font-semibold">2. Comm. Achievement</span>
              <input
                type="number"
                value={commWeight}
                onChange={e => setCommWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block mb-1 font-semibold">3. Organisation</span>
              <input
                type="number"
                value={orgWeight}
                onChange={e => setOrgWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block mb-1 font-semibold">4. Language</span>
              <input
                type="number"
                value={langWeight}
                onChange={e => setLangWeight(+e.target.value)}
                className="w-full py-1 text-center font-bold text-teal-900 rounded-lg border border-teal-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-teal-900 mb-1">
              Teacher Rubric Guidelines & Specific Notes:
            </label>
            <input
              type="text"
              value={guidelines}
              onChange={e => setGuidelines(e.target.value)}
              placeholder="e.g. Expect C1 inversions, sophisticated lexical variety, and formal register."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-teal-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {assignmentToEdit ? 'Save Changes' : 'Publish Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
