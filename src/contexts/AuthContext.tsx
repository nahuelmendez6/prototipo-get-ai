import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { mockAuthService } from '../services/mockAuthService';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => mockAuthService.getCurrentUser());
  const { showToast } = useToast();

  const refreshCurrentUser = useCallback(() => {
    const user = mockAuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = mockAuthService.login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      showToast('success', 'Signed In', `Welcome, ${result.user.name} (${result.user.role.toUpperCase()})`);
      return true;
    } else {
      showToast('error', 'Sign In Failed', result.error || 'Invalid credentials');
      return false;
    }
  };

  const loginAsDemo = useCallback((role: UserRole) => {
    const user = mockAuthService.loginAsDemo(role);
    setCurrentUser(user);
    showToast('info', 'Active Role Changed', `Now acting as ${user.name} (${user.role.toUpperCase()})`);
  }, [showToast]);

  const switchUser = useCallback((userId: string) => {
    const user = mockAuthService.switchUser(userId);
    if (user) {
      setCurrentUser(user);
      showToast('info', 'User Switched', `Active session: ${user.name} (${user.role.toUpperCase()})`);
    }
  }, [showToast]);

  const logout = useCallback(() => {
    mockAuthService.logout();
    setCurrentUser(null);
    showToast('info', 'Signed Out', 'You have been signed out successfully.');
  }, [showToast]);

  const role: UserRole = currentUser?.role || 'student';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        loginAsDemo,
        switchUser,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
