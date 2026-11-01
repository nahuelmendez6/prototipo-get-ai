import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { 
  Sparkles, 
  Shield, 
  BookOpen, 
  GraduationCap, 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('teacher@demo.com');
  const [password, setPassword] = useState('20000002'); // Default initial password is DNI
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    loginAsDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          AI Writing Assistant
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Plataforma de Corrección Inteligente de Inglés para Institutos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          
          {/* Quick Demo Login Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Acceso Rápido de Demostración (1 Clic)
              </span>
              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                Recomendado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Administrador</p>
                  <p className="text-[11px] text-slate-500">admin@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-600 font-semibold">
                  <span>Ingresar</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Teacher Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="group p-3 rounded-2xl border-2 border-teal-500/80 bg-teal-50/30 hover:bg-teal-50 transition-all text-left cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Docente</p>
                  <p className="text-[11px] text-slate-500">teacher@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-teal-100 flex items-center justify-between text-[10px] text-teal-700 font-bold">
                  <span>Ingresar</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Estudiante</p>
                  <p className="text-[11px] text-slate-500">student@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-sky-600 font-semibold">
                  <span>Ingresar</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">O iniciar sesión manual</span>
            </div>
          </div>

          {/* Institutional Password Notice */}
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Política de Seguridad del Instituto:</span>
              <p className="mt-0.5 text-amber-800">
                La contraseña inicial de cada usuario es su <strong>DNI</strong> (ej: docente = 20000002, alumno = 30000003).
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="ejemplo@demo.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Contraseña (DNI del Usuario)
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Ingrese el DNI"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                Ingresar al Sistema
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
