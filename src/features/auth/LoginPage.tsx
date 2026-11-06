import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  BookOpen, 
  GraduationCap, 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('teacher@demo.com');
  const [password, setPassword] = useState('20000002'); // Default initial password is DNI/ID
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
    <div className="min-h-screen bg-gradient-to-br from-[#061734] via-[#0a2754] to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative mx-auto w-14 h-14 rounded-2xl bg-[#0d3471] flex items-center justify-center text-white shadow-xl shadow-[#0d3471]/30 mb-4 border border-white/10">
          <GraduationCap className="w-8 h-8 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#c81414] rounded-full ring-2 ring-[#061734]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Cambridge AI Studio
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          AI-Assisted Assessment & Feedback Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
          
          {/* Quick Demo Login Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Demo Access (1-Click)
              </span>
              <span className="text-[10px] bg-[#0d3471]/10 text-[#0d3471] px-2.5 py-0.5 rounded-full font-bold border border-[#0d3471]/20">
                Recommended
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Administrator</p>
                  <p className="text-[11px] text-slate-500">admin@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Teacher Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="group p-3 rounded-2xl border-2 border-[#0d3471] bg-[#0d3471]/5 hover:bg-[#0d3471]/10 transition-all text-left cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#0d3471] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-[#0d3471]">Teacher</p>
                  <p className="text-[11px] text-slate-500">teacher@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#0d3471] font-bold">
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-[#c81414] hover:bg-red-50/30 transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#c81414] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Student</p>
                  <p className="text-[11px] text-slate-500">student@demo.com</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#c81414] font-semibold">
                  <span>Sign In</span>
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
              <span className="bg-white px-3 text-slate-400 font-semibold">Or direct credentials</span>
            </div>
          </div>

          {/* Institutional Password Notice */}
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-[#0d3471] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Institutional Access Policy:</span>
              <p className="mt-0.5 text-slate-600">
                Each user's initial password is their <strong>ID / DNI</strong> (e.g. teacher = 20000002, student = 30000003).
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white transition-colors text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password (User's ID / DNI)
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your ID / DNI"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d3471] bg-slate-50 focus:bg-white transition-colors text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full py-2.5 rounded-xl font-bold text-sm shadow-md"
              >
                Sign In
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
