import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, UserRole } from '../../types';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserModal } from './UserModal';
import { mockUserService } from '../../services/mockUserService';
import { useToast } from '../../contexts/ToastContext';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  KeyRound, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { switchUser, currentUser } = useAuth();
  const { users, reloadAll } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  let visibleUsers = users;

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visibleUsers = visibleUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.dni.includes(q)
    );
  }

  if (roleFilter !== 'all') {
    visibleUsers = visibleUsers.filter(u => u.role === roleFilter);
  }

  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser?.id) {
      showToast('error', 'Action Not Allowed', 'You cannot delete your own active user account.');
      return;
    }
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      mockUserService.deleteUser(id);
      showToast('info', 'User Deleted', `User ${name} was successfully removed.`);
      reloadAll();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User & Access Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central administration of teachers, students, and institutional administrators.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setUserToEdit(null);
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          New User
        </Button>
      </div>

      {/* Password Rule Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 shadow-2xs">
        <KeyRound className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Institutional Credentials Policy:</span>
          <p className="mt-0.5 text-amber-800">
            Each user's initial password is their <strong>ID (DNI)</strong>. When onboarding a new teacher or student, their ID number is the key used to access the platform for the first time.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or ID (DNI)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Role filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'student', label: 'Students' },
            { id: 'teacher', label: 'Teachers' },
            { id: 'admin', label: 'Admins' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === f.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">ID / DNI (Initial Password)</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {visibleUsers.map(user => {
                const isCurrent = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {user.dni}
                    </td>

                    <td className="py-3 px-4">
                      <RoleBadge role={user.role} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {user.phone || '—'}
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => switchUser(user.id)}
                          className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                          title="Switch session to this user"
                        >
                          Switch
                        </button>
                        <button
                          onClick={() => {
                            setUserToEdit(user);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
      />
    </div>
  );
};
