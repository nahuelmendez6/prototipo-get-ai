import { Submission, User, SubmissionStatus } from '../types';
import { storageService } from './storageService';
import { generateMockAIEvaluation } from '../mocks/evaluations';

export const mockSubmissionService = {
  getSubmissions(user?: User | null, options?: { assignmentId?: string; courseId?: string }): Submission[] {
    let submissions = storageService.getSubmissions();

    if (options?.assignmentId) {
      submissions = submissions.filter(s => s.assignmentId === options.assignmentId);
    }

    if (options?.courseId) {
      submissions = submissions.filter(s => s.courseId === options.courseId);
    }

    if (!user || user.role === 'admin') {
      return submissions;
    }

    if (user.role === 'teacher') {
      const teacherCourses = storageService.getCourses().filter(c => c.teacherId === user.id).map(c => c.id);
      return submissions.filter(s => teacherCourses.includes(s.courseId));
    }

    if (user.role === 'student') {
      return submissions.filter(s => s.studentId === user.id);
    }

    return submissions;
  },

  getSubmissionById(id: string): Submission | undefined {
    return storageService.getSubmissions().find(s => s.id === id);
  },

  submitWriting(data: {
    assignmentId: string;
    studentId: string;
    submissionType: 'handwritten' | 'virtual';
    text: string;
    imageUrl?: string;
  }): Submission {
    const submissions = storageService.getSubmissions();
    const assignment = storageService.getAssignments().find(a => a.id === data.assignmentId);
    const student = storageService.getUsers().find(u => u.id === data.studentId);

    const words = data.text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: data.assignmentId,
      assignmentTitle: assignment?.title || 'Actividad de Escritura',
      courseId: assignment?.courseId || '',
      courseName: assignment?.courseName || '',
      studentId: data.studentId,
      studentName: student?.name || 'Estudiante',
      studentEmail: student?.email || '',
      studentAvatar: student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      submissionType: data.submissionType,
      imageUrl: data.imageUrl,
      extractedText: data.text,
      originalText: data.text,
      wordCount,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    submissions.unshift(newSubmission);
    storageService.saveSubmissions(submissions);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || data.studentId,
      userName: currentUser?.name || student?.name || 'Estudiante',
      role: currentUser?.role || 'student',
      action: data.submissionType === 'handwritten' ? 'Subió entrega manuscrita' : 'Envió redacción virtual',
      target: newSubmission.assignmentTitle,
      type: 'submission'
    });

    return newSubmission;
  },

  async processWithAI(submissionId: string): Promise<Submission | null> {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) return null;

    // Set to PROCESSING
    submissions[index].status = 'PROCESSING';
    storageService.saveSubmissions(submissions);

    // Simulate realistic AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate evaluation
    const evalData = generateMockAIEvaluation(submissionId, submissions[index].extractedText || submissions[index].originalText);
    submissions[index].evaluation = evalData;
    submissions[index].status = 'PENDING_REVIEW';

    storageService.saveSubmissions(submissions);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'system',
      userName: 'Motor de Inteligencia Artificial',
      role: 'teacher',
      action: 'Generó corrección sugerida',
      target: submissions[index].assignmentTitle,
      type: 'review'
    });

    return submissions[index];
  },

  updateSubmissionStatus(id: string, status: SubmissionStatus): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) return null;

    submissions[index].status = status;
    storageService.saveSubmissions(submissions);
    return submissions[index];
  }
};
