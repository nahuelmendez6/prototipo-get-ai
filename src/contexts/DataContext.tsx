import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Course, Assignment, Submission, ActivityLog } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

interface DataContextType {
  users: User[];
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  activityLogs: ActivityLog[];
  reloadAll: () => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [courses, setCourses] = useState<Course[]>(() => storageService.getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(() => storageService.getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => storageService.getSubmissions());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => storageService.getActivityLogs());
  const { showToast } = useToast();

  const reloadAll = useCallback(() => {
    setUsers(storageService.getUsers());
    setCourses(storageService.getCourses());
    setAssignments(storageService.getAssignments());
    setSubmissions(storageService.getSubmissions());
    setActivityLogs(storageService.getActivityLogs());
  }, []);

  const resetDemoData = useCallback(() => {
    storageService.resetAllData();
    reloadAll();
    showToast('info', 'Data Reset', 'The mock database has been restored to the initial demo datasets.');
  }, [reloadAll, showToast]);

  return (
    <DataContext.Provider
      value={{
        users,
        courses,
        assignments,
        submissions,
        activityLogs,
        reloadAll,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
