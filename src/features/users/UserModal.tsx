import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useData } from '../../contexts/DataContext';
import { mockUserService } from '../../services/mockUserService';
import { useToast } from '../../contexts/ToastContext';
import { KeyRound, Shield, BookOpen, GraduationCap } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
}) => {
  const { reloadAll } = useData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setDni(userToEdit.dni);
      setRole(userToEdit.role);
      setPhone(userToEdit.phone || '');
    } else {
      setName('');
      setEmail('');
      setDni('');
      setRole('student');
      setPhone('');
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni.trim()) {
      showToast('error', 'ID / DNI Required', 'The ID (DNI) is mandatory as it serves as the user\'s initial password.');
      return;
    }

    if (userToEdit) {
      mockUserService.updateUser(userToEdit.id, {
        name,
        email,
        dni: dni.trim(),
        role,
        phone,
      });
      showToast('success', 'User Updated', `Account details for ${name} were updated successfully.`);
    } else {
      mockUserService.createUser({
        name,
        email,
        dni: dni.trim(),
        role,
        phone,
      });
      showToast(
        'success',
        'User Created Successfully',
        `User registered. Initial password assigned: ID (${dni.trim()})`
      );
    }

    reloadAll();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userToEdit ? 'Edit User' : 'Register New User'}
      subtitle="Set institutional profile, role, and identity document for platform access."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rule Alert Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Credentials Policy:</span>
            <p className="mt-0.5 text-amber-800">
              Each user's initial password is their <strong>ID (DNI)</strong>. Ensure it is entered accurately.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Prof. Emily Watson / John Davis"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ID / DNI (Initial Password)
            </label>
            <input
              type="text"
              required
              value={dni}
              onChange={e => setDni(e.target.value)}
              placeholder="e.g. 38450123"
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white font-medium"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@institute.edu"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+54 11 5555-1234"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {userToEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
