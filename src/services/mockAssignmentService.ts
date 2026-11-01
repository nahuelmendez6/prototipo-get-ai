import { Assignment, User } from '../types';
import { storageService } from './storageService';

export const mockAssignmentService = {
  getAssignments(user?: User | null, courseId?: string): Assignment[] {
    let assignments = storageService.getAssignments();

    if (courseId) {
      assignments = assignments.filter(a => a.courseId === courseId);
    }

    if (!user || user.role === 'admin') {
      return assignments;
    }

    if (user.role === 'teacher') {
      return assignments.filter(a => a.teacherId === user.id);
    }

    if (user.role === 'student') {
      // Return assignments belonging to student's courses
      const courses = storageService.getCourses().filter(c => c.studentIds.includes(user.id));
      const enrolledCourseIds = courses.map(c => c.id);
      return assignments.filter(a => enrolledCourseIds.includes(a.courseId));
    }

    return assignments;
  },

  getAssignmentById(id: string): Assignment | undefined {
    return storageService.getAssignments().find(a => a.id === id);
  },

  createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
    const assignments = storageService.getAssignments();
    const newAssignment: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    assignments.unshift(newAssignment);
    storageService.saveAssignments(assignments);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Publicó nueva consigna',
      target: newAssignment.title,
      type: 'assignment'
    });

    return newAssignment;
  },

  updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
    const assignments = storageService.getAssignments();
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) return null;

    assignments[index] = { ...assignments[index], ...updates };
    storageService.saveAssignments(assignments);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Modificó consigna',
      target: assignments[index].title,
      type: 'assignment'
    });

    return assignments[index];
  },

  deleteAssignment(id: string): boolean {
    const assignments = storageService.getAssignments();
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return false;

    const filtered = assignments.filter(a => a.id !== id);
    storageService.saveAssignments(filtered);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'teacher',
      userName: currentUser?.name || 'Docente',
      role: currentUser?.role || 'teacher',
      action: 'Eliminó consigna',
      target: assignment.title,
      type: 'assignment'
    });

    return true;
  }
};
