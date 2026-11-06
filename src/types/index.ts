import { CambridgeExam } from './cambridgeCriteria';
export * from './cambridgeCriteria';

export type UserRole = 'admin' | 'teacher' | 'student';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type WritingType = 
  | 'Essay' 
  | 'Email' 
  | 'Article' 
  | 'Story' 
  | 'Review' 
  | 'Report' 
  | 'Other';

export type SubmissionStatus = 
  | 'SUBMITTED' 
  | 'PROCESSING' 
  | 'PENDING_REVIEW' 
  | 'NEEDS_REVISION' 
  | 'APPROVED' 
  | 'PUBLISHED';

export interface User {
  id: string;
  name: string;
  email: string;
  dni: string; // Initial password is user's ID/DNI
  role: UserRole;
  avatar: string;
  phone?: string;
  status: 'active' | 'inactive';
  courseIds: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  level: CEFRLevel;
  description: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  schedule: string;
  academicPeriod: string;
  colorTheme?: string;
}

export interface RubricConfig {
  contentWeight: number; // e.g., 25%
  communicativeAchievementWeight: number; // 25%
  organisationWeight: number; // 25%
  languageWeight: number; // 25%
  examType?: CambridgeExam;
  customGuidelines?: string;

  // Legacy compatibility weights
  grammarWeight?: number;
  vocabularyWeight?: number;
  spellingPunctuationWeight?: number;
  coherenceCohesionWeight?: number;
  taskAchievementWeight?: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  instructions: string;
  writingType: WritingType;
  cefrLevel: CEFRLevel;
  minWords: number;
  maxWords: number;
  dueDate: string;
  rubric: RubricConfig;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

export interface Mistake {
  id: string;
  original: string;
  correction: string;
  type: 'grammar' | 'vocabulary' | 'spelling' | 'punctuation' | 'syntax' | 'style';
  explanation: string;
  impactLevel: 'minor' | 'moderate' | 'major';
}

export interface EvaluationScores {
  content: number; // 0 to 5
  communicativeAchievement: number; // 0 to 5
  organisation: number; // 0 to 5
  language: number; // 0 to 5
  overallGrade: number; // Final Grade (0-10 or 0-20)
  totalMarks?: number; // Cambridge total mark out of 20

  // Optional legacy fields for backwards compatibility
  grammar?: number;
  vocabulary?: number;
  spellingPunctuation?: number;
  coherenceCohesion?: number;
  taskAchievement?: number;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  originalText: string;
  correctedText: string;
  mistakes: Mistake[];
  scores: EvaluationScores;
  suggestedOverallGrade: number;
  generalFeedback: string;
  recommendations: string[];
  aiConfidence: number; // e.g. 96
  reviewedByTeacher: boolean;
  teacherNotes?: string;
  approvedAt?: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  submissionType: 'handwritten' | 'virtual';
  imageUrl?: string;
  extractedText: string;
  originalText: string;
  wordCount: number;
  submittedAt: string;
  status: SubmissionStatus;
  evaluation?: Evaluation;
  draftText?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  target: string;
  timestamp: string;
  type: 'submission' | 'approval' | 'course' | 'user' | 'assignment' | 'review';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}
