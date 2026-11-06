import { Course, User } from '../types';
import { storageService } from './storageService';

export const mockCourseService = {
  getCourses(user?: User | null): Course[] {
    const courses = storageService.getCourses();
    if (!user || user.role === 'admin') {
      return courses;
    }
    if (user.role === 'teacher') {
      return courses.filter(c => c.teacherId === user.id);
    }
    if (user.role === 'student') {
      return courses.filter(c => c.studentIds.includes(user.id));
    }
    return courses;
  },

  getCourseById(id: string): Course | undefined {
    return storageService.getCourses().find(c => c.id === id);
  },

  createCourse(courseData: Omit<Course, 'id'>): Course {
    const courses = storageService.getCourses();
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
    };
    courses.push(newCourse);
    storageService.saveCourses(courses);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      role: currentUser?.role || 'admin',
      action: 'Created course',
      target: newCourse.name,
      type: 'course'
    });

    return newCourse;
  },

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const courses = storageService.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;

    courses[index] = { ...courses[index], ...updates };
    storageService.saveCourses(courses);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      role: currentUser?.role || 'admin',
      action: 'Updated course',
      target: courses[index].name,
      type: 'course'
    });

    return courses[index];
  },

  deleteCourse(id: string): boolean {
    const courses = storageService.getCourses();
    const course = courses.find(c => c.id === id);
    if (!course) return false;

    const filtered = courses.filter(c => c.id !== id);
    storageService.saveCourses(filtered);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrator',
      role: currentUser?.role || 'admin',
      action: 'Deleted course',
      target: course.name,
      type: 'course'
    });

    return true;
  },

  assignTeacher(courseId: string, teacherId: string, teacherName: string): boolean {
    return !!this.updateCourse(courseId, { teacherId, teacherName });
  },

  enrollStudent(courseId: string, studentId: string): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;
    if (!course.studentIds.includes(studentId)) {
      const updatedStudents = [...course.studentIds, studentId];
      this.updateCourse(courseId, { studentIds: updatedStudents });
      return true;
    }
    return false;
  },

  unenrollStudent(courseId: string, studentId: string): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;
    const updatedStudents = course.studentIds.filter(id => id !== studentId);
    this.updateCourse(courseId, { studentIds: updatedStudents });
    return true;
  }
};
