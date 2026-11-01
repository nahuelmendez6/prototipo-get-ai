import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserRole } from '../../types';
import { 
  Users, 
  RotateCcw, 
  Shield, 
  BookOpen, 
  GraduationCap, 
  KeyRound, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  const { role, currentUser, loginAsDemo } = useAuth();
  const { resetDemoData } = useData();
  const [isExpanded, setIsExpanded] = useState(false);

  const demoAccounts: { role: UserRole; name: string; email: string; dni: string; icon: any }[] = [
    {
      role: 'admin',
      name: 'Lic. Roberto Santillán',
      email: 'admin@demo.com',
      dni: '10000001',
      icon: Shield,
    },
    {
      role: 'teacher',
      name: 'Prof. Laura Morales',
      email: 'teacher@demo.com',
      dni: '20000002',
      icon: BookOpen,
    },
    {
      role: 'student',
      name: 'Carlos Gómez',
      email: 'student@demo.com',
      dni: '30000003',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40 font-sans">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden text-xs max-w-sm">
        {/* Header Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between gap-3 bg-slate-800/90 hover:bg-slate-800 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="font-semibold text-slate-200">Modo Prototipo Demo:</span>
            <span className="capitalize px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 font-bold border border-teal-700/50">
              {role}
            </span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="p-4 space-y-3 bg-slate-900/95 border-t border-slate-800">
            <div>
              <p className="text-[11px] font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Cambiar de Rol al Instante:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {demoAccounts.map(account => {
                  const Icon = account.icon;
                  const isActive = role === account.role;
                  return (
                    <button
                      key={account.role}
                      onClick={() => loginAsDemo(account.role)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-left border ${
                        isActive
                          ? 'bg-teal-950/70 border-teal-500/80 text-white shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <p className="font-semibold text-xs leading-none truncate">{account.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{account.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        DNI: {account.dni}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password memory note */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Regla de Acceso:</span> La contraseña inicial de cada usuario es su <strong className="text-white underline">DNI</strong>.
              </div>
            </div>

            {/* Reset data */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">¿Deseas restaurar valores iniciales?</span>
              <button
                onClick={resetDemoData}
                className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] transition-colors border border-slate-700 cursor-pointer"
                title="Restaura cursos, asignaciones y entregas iniciales"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reiniciar Datos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
