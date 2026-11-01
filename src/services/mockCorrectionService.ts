import { Evaluation, Mistake, EvaluationScores, Submission } from '../types';
import { storageService } from './storageService';

export const mockCorrectionService = {
  getEvaluation(submissionId: string): Evaluation | undefined {
    const submission = storageService.getSubmissions().find(s => s.id === submissionId);
    return submission?.evaluation;
  },

  updateEvaluation(submissionId: string, newEvaluation: Partial<Evaluation>): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    submissions[index].evaluation = {
      ...submissions[index].evaluation!,
      ...newEvaluation,
      reviewedByTeacher: true,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveSubmissions(submissions);
    return submissions[index];
  },

  updateScores(submissionId: string, scores: EvaluationScores): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    submissions[index].evaluation!.scores = { ...scores };
    submissions[index].evaluation!.suggestedOverallGrade = scores.overallGrade;
    submissions[index].evaluation!.reviewedByTeacher = true;
    submissions[index].evaluation!.updatedAt = new Date().toISOString();

    storageService.saveSubmissions(submissions);
    return submissions[index];
  },

  updateMistake(submissionId: string, mistakeId: string, updatedMistake: Partial<Mistake>): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    const mIdx = submissions[index].evaluation!.mistakes.findIndex(m => m.id === mistakeId);
    if (mIdx !== -1) {
      submissions[index].evaluation!.mistakes[mIdx] = {
        ...submissions[index].evaluation!.mistakes[mIdx],
        ...updatedMistake,
      };
      submissions[index].evaluation!.reviewedByTeacher = true;
      submissions[index].evaluation!.updatedAt = new Date().toISOString();
      storageService.saveSubmissions(submissions);
    }

    return submissions[index];
  },

  deleteMistake(submissionId: string, mistakeId: string): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    submissions[index].evaluation!.mistakes = submissions[index].evaluation!.mistakes.filter(m => m.id !== mistakeId);
    submissions[index].evaluation!.reviewedByTeacher = true;
    submissions[index].evaluation!.updatedAt = new Date().toISOString();
    storageService.saveSubmissions(submissions);
    return submissions[index];
  },

  addMistake(submissionId: string, mistake: Omit<Mistake, 'id'>): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    const newMistake: Mistake = {
      ...mistake,
      id: `mst-${Date.now()}`
    };

    submissions[index].evaluation!.mistakes.push(newMistake);
    submissions[index].evaluation!.reviewedByTeacher = true;
    submissions[index].evaluation!.updatedAt = new Date().toISOString();
    storageService.saveSubmissions(submissions);
    return submissions[index];
  },

  approveCorrection(submissionId: string, teacherNotes?: string): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    submissions[index].status = 'APPROVED';
    submissions[index].evaluation!.reviewedByTeacher = true;
    submissions[index].evaluation!.approvedAt = new Date().toISOString();
    if (teacherNotes !== undefined) {
      submissions[index].evaluation!.teacherNotes = teacherNotes;
    }

    storageService.saveSubmissions(submissions);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Aprobó corrección docente',
      target: `${submissions[index].studentName} - ${submissions[index].assignmentTitle}`,
      type: 'approval'
    });

    return submissions[index];
  },

  publishCorrection(submissionId: string): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1 || !submissions[index].evaluation) return null;

    submissions[index].status = 'PUBLISHED';
    submissions[index].evaluation!.publishedAt = new Date().toISOString();
    submissions[index].evaluation!.reviewedByTeacher = true;

    storageService.saveSubmissions(submissions);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Publicó evaluación a alumno',
      target: `${submissions[index].studentName} - ${submissions[index].assignmentTitle}`,
      type: 'approval'
    });

    return submissions[index];
  },

  rejectCorrection(submissionId: string, reason: string): Submission | null {
    const submissions = storageService.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) return null;

    submissions[index].status = 'NEEDS_REVISION';
    if (submissions[index].evaluation) {
      submissions[index].evaluation!.teacherNotes = reason;
      submissions[index].evaluation!.reviewedByTeacher = true;
    }

    storageService.saveSubmissions(submissions);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Solicitó revisión de entrega',
      target: `${submissions[index].studentName} - ${submissions[index].assignmentTitle}`,
      type: 'review'
    });

    return submissions[index];
  }
};
