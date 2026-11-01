import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../features/auth/LoginPage';

// Dashboards
import { AdminDashboard } from '../features/dashboard/AdminDashboard';
import { TeacherDashboard } from '../features/dashboard/TeacherDashboard';
import { StudentDashboard } from '../features/dashboard/StudentDashboard';

// Courses
import { CourseListPage } from '../features/courses/CourseListPage';
import { CourseDetailPage } from '../features/courses/CourseDetailPage';

// Assignments
import { AssignmentListPage } from '../features/assignments/AssignmentListPage';
import { AssignmentDetailPage } from '../features/assignments/AssignmentDetailPage';

// Submissions
import { SubmissionListPage } from '../features/submissions/SubmissionListPage';
import { HandwrittenSubmissionPage } from '../features/submissions/HandwrittenSubmissionPage';
import { VirtualWritingEditor } from '../features/submissions/VirtualWritingEditor';

// AI Corrections
import { CorrectionInterfacePage } from '../features/corrections/CorrectionInterfacePage';

// Students
import { StudentProgressOverview } from '../features/students/StudentProgressOverview';
import { StudentProfilePage } from '../features/students/StudentProfilePage';

// Users
import { UserManagementPage } from '../features/users/UserManagementPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* Authenticated Layout */}
      <Route
        path="/"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={renderDashboard()} />

        {/* Courses */}
        <Route path="courses" element={<CourseListPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />

        {/* Assignments */}
        <Route path="assignments" element={<AssignmentListPage />} />
        <Route path="assignments/:id" element={<AssignmentDetailPage />} />

        {/* Submissions */}
        <Route path="submissions" element={<SubmissionListPage />} />
        <Route path="submit-handwritten" element={<HandwrittenSubmissionPage />} />
        <Route path="submit-virtual" element={<VirtualWritingEditor />} />

        {/* Corrections Interface */}
        <Route path="corrections/:id" element={<CorrectionInterfacePage />} />

        {/* Student Progress */}
        <Route path="student-progress" element={<StudentProgressOverview />} />
        <Route path="student-progress/:studentId" element={<StudentProfilePage />} />
        <Route path="my-progress" element={<StudentProfilePage isSelf={true} />} />

        {/* Users (Admin Only) */}
        <Route path="users" element={<UserManagementPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
