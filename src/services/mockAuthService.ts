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
      return { success: false, error: 'Usuario no encontrado. Utilice una cuenta de demostración o verifique el correo.' };
    }

    // Check password: User's initial password is their DNI
    const cleanPassword = password.trim();
    const isValid = cleanPassword === user.dni || cleanPassword === 'demo' || cleanPassword === '123456' || cleanPassword === 'admin';

    if (!isValid) {
      return { 
        success: false, 
        error: `Contraseña incorrecta. Recuerde que la contraseña inicial de cada usuario es su DNI (DNI registrado: ${user.dni}).` 
      };
    }

    storageService.setCurrentUser(user);
    storageService.addActivityLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'Inició sesión',
      target: 'Sistema AI Writing Assistant',
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
      action: 'Cambio rápido a rol demo',
      target: `Rol ${role.toUpperCase()}`,
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
        action: 'Cerró sesión',
        target: 'Plataforma',
        type: 'user',
      });
    }
    storageService.setCurrentUser(null);
  },

  getDemoAccounts(): { role: UserRole; label: string; email: string; dni: string; description: string }[] {
    return [
      {
        role: 'admin',
        label: 'Administrador General',
        email: 'admin@demo.com',
        dni: '10000001',
        description: 'Gestión institucional, cursos, docentes, alumnos y métricas globales.'
      },
      {
        role: 'teacher',
        label: 'Profesora Laura Morales',
        email: 'teacher@demo.com',
        dni: '20000002',
        description: 'Revisión y edición de correcciones IA, asignaciones y retroalimentación.'
      },
      {
        role: 'student',
        label: 'Estudiante Carlos Gómez',
        email: 'student@demo.com',
        dni: '30000003',
        description: 'Entrega manuscrita y virtual, visualización de correcciones publicadas.'
      }
    ];
  }
};
