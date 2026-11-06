import { User, UserRole } from '../types';
import { storageService } from './storageService';

export const mockAuthService = {
  getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'User not found. Use a demo account or verify your email.' };
    }

    // Check password: User's initial password is their DNI/ID
    const cleanPassword = password.trim();
    const isValid = cleanPassword === user.dni || cleanPassword === 'demo' || cleanPassword === '123456' || cleanPassword === 'admin';

    if (!isValid) {
      return { 
        success: false, 
        error: `Incorrect password. Remember each user's initial password is their ID (DNI) (Registered ID: ${user.dni}).` 
      };
    }

    storageService.setCurrentUser(user);
    storageService.addActivityLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'Signed in',
      target: 'AI Writing Platform',
      type: 'user',
    });

    return { success: true, user };
  },

  loginAsDemo(role: UserRole): User {
    const users = storageService.getUsers();
    let user = users.find(u => u.role === role);
    if (!user) {
      user = users[0];
    }
    storageService.setCurrentUser(user);
    storageService.addActivityLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'Switched to demo role',
      target: `${role.toUpperCase()} Role`,
      type: 'user',
    });
    return user;
  },

  switchUser(userId: string): User | null {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      storageService.setCurrentUser(user);
      return user;
    }
    return null;
  },

  logout(): void {
    const current = storageService.getCurrentUser();
    if (current) {
      storageService.addActivityLog({
        userId: current.id,
        userName: current.name,
        role: current.role,
        action: 'Signed out',
        target: 'Platform',
        type: 'user',
      });
    }
    storageService.setCurrentUser(null as any);
  },

  getDemoAccounts(): { role: UserRole; label: string; email: string; dni: string; description: string }[] {
    return [
      {
        role: 'admin',
        label: 'Lead Administrator',
        email: 'admin@demo.com',
        dni: '10000001',
        description: 'Institutional management, courses, faculty, students, and global analytics.'
      },
      {
        role: 'teacher',
        label: 'Prof. Laura Morales',
        email: 'teacher@demo.com',
        dni: '20000002',
        description: 'Review and refine AI Cambridge marking, assignment creation, and personalized feedback.'
      },
      {
        role: 'student',
        label: 'Student Carlos Gómez',
        email: 'student@demo.com',
        dni: '30000003',
        description: 'Handwritten and digital submissions, published evaluation reviews, and band progress.'
      }
    ];
  }
};
