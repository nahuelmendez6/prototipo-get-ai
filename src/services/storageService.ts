import { User, Course, Assignment, Submission, ActivityLog } from '../types';
import { INITIAL_USERS } from '../mocks/users';
import { INITIAL_COURSES } from '../mocks/courses';
import { INITIAL_ASSIGNMENTS } from '../mocks/assignments';
import { INITIAL_SUBMISSIONS } from '../mocks/submissions';

const STORAGE_KEYS = {
  USERS: 'ai_writing_users_v2',
  COURSES: 'ai_writing_courses_v2',
  ASSIGNMENTS: 'ai_writing_assignments_v2',
  SUBMISSIONS: 'ai_writing_submissions_v2',
  CURRENT_USER: 'ai_writing_current_user_v2',
  ACTIVITY_LOGS: 'ai_writing_activity_logs_v2',
};

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-teacher-1',
    userName: 'Prof. Laura Morales',
    role: 'teacher',
    action: 'Published assessment',
    target: 'Formal Email: Hotel Service Complaint (Carlos Gómez)',
    timestamp: '2026-10-23T14:05:00Z',
    type: 'approval',
  },
  {
    id: 'log-2',
    userId: 'user-student-1',
    userName: 'Carlos Gómez',
    role: 'student',
    action: 'Submitted handwritten writing',
    target: 'FCE Essay: Advantages and Disadvantages of Remote Working',
    timestamp: '2026-10-28T16:20:00Z',
    type: 'submission',
  },
  {
    id: 'log-3',
    userId: 'user-admin-1',
    userName: 'Lic. Roberto Santillán',
    role: 'admin',
    action: 'Created new course',
    target: 'Business English & Professional Communication',
    timestamp: '2026-10-29T11:00:00Z',
    type: 'course',
  },
  {
    id: 'log-4',
    userId: 'user-student-4',
    userName: 'Elena Álvarez',
    role: 'student',
    action: 'Submitted online writing',
    target: 'Academic Article: Artificial Intelligence in Higher Education',
    timestamp: '2026-10-31T09:30:00Z',
    type: 'submission',
  }
];

export const storageService = {
  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Teacher for rich demonstration or Admin
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1])); // Prof. Laura Morales
    }
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
  },

  getUsers(): User[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCourses(): Course[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      return data ? JSON.parse(data) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  },

  saveCourses(courses: Course[]) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getAssignments(): Assignment[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  },

  saveAssignments(assignments: Assignment[]) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  getSubmissions(): Submission[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(submissions: Submission[]) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  getCurrentUser(): User | null {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : INITIAL_USERS[1];
    } catch {
      return INITIAL_USERS[1];
    }
  },

  setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getActivityLogs(): ActivityLog[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return data ? JSON.parse(data) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  },

  addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep max 50 logs
    const trimmed = logs.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(trimmed));
  }
};
