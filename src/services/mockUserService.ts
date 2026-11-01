import { User, UserRole } from '../types';
import { storageService } from './storageService';

export const mockUserService = {
  getUsers(role?: UserRole): User[] {
    const users = storageService.getUsers();
    if (role) {
      return users.filter(u => u.role === role);
    }
    return users;
  },

  getUserById(id: string): User | undefined {
    return storageService.getUsers().find(u => u.id === id);
  },

  createUser(data: {
    name: string;
    email: string;
    dni: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    courseIds?: string[];
  }): User {
    const users = storageService.getUsers();
    const newUser: User = {
      id: `user-${data.role}-${Date.now()}`,
      name: data.name,
      email: data.email,
      dni: data.dni.trim(), // Contraseña inicial es su DNI
      role: data.role,
      avatar: data.avatar || `https://images.unsplash.com/photo-${data.role === 'teacher' ? '1544005313-94ddf0286df2' : '1535713875002-d1d0cf377fde'}?w=150`,
      phone: data.phone || '',
      status: 'active',
      courseIds: data.courseIds || [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storageService.saveUsers(users);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrador',
      role: currentUser?.role || 'admin',
      action: `Creó nuevo usuario (${data.role})`,
      target: `${newUser.name} (DNI: ${newUser.dni})`,
      type: 'user'
    });

    return newUser;
  },

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    storageService.saveUsers(users);

    // If current logged-in user is updated, update session too
    const current = storageService.getCurrentUser();
    if (current?.id === id) {
      storageService.setCurrentUser(users[index]);
    }

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrador',
      role: currentUser?.role || 'admin',
      action: 'Actualizó información de usuario',
      target: users[index].name,
      type: 'user'
    });

    return users[index];
  },

  deleteUser(id: string): boolean {
    const users = storageService.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return false;

    const filtered = users.filter(u => u.id !== id);
    storageService.saveUsers(filtered);

    const currentUser = storageService.getCurrentUser();
    storageService.addActivityLog({
      userId: currentUser?.id || 'admin',
      userName: currentUser?.name || 'Administrador',
      role: currentUser?.role || 'admin',
      action: 'Eliminó usuario',
      target: user.name,
      type: 'user'
    });

    return true;
  }
};
