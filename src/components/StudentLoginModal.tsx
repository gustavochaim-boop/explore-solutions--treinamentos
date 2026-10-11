import React, { useState } from 'react';
import { StudentUser } from '../types';
import {
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Eye,
  EyeOff,
  BookOpen,
  HelpCircle,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentUser[];
  onSuccessStudentLogin: (student: StudentUser) => void;
  onRequestManagerLogin: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  students,
  onSuccessStudentLogin,
  onRequestManagerLogin
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim().toLowerCase();
    const foundStudent = students.find(
      s => s.username.toLowerCase() === cleanUser && s.password === password.trim()
    );

    if (foundStudent) {
      if (!foundStudent.isActive) {
        setErrorMessage('Seu cadastro está temporariamente inativo. Entre em contato com o Gestor pedagógico.');
        return;
      }
      onSuccessStudentLogin(foundStudent);
      onClose();
    } else {
      setErrorMessage('Usuário ou senha incorretos. Verifique suas credenciais fornecidas pelo Gestor.');
    }
  };

  const handleQuickFill = (s: StudentUser) => {
    setUsername(s.username);
    setPassword(s.password);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-semibold uppercase tracking-wider">
            Portal de Capacitação do Aluno
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Acesso Individual do Aluno
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Digite seu usuário e senha individual concedidos pelo Gestor para acessar seus treinamentos liberados.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Usuário do Aluno (Login):
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: aluno ou marina.costa"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code transition-colors"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              Senha Individual:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha individual"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            Acessar Treinamento Autorizado
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-400" />
              Alunos Cadastrados de Exemplo (Clique para preencher):
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {students.slice(0, 3).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleQuickFill(st)}
                className="w-full text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-[11px] flex items-center justify-between transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-slate-200 group-hover:text-emerald-300 block truncate">
                    {st.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-code">
                    login: <strong className="text-amber-400">{st.username}</strong> | senha: {st.password}
                  </span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-slate-800 group-hover:bg-emerald-950 group-hover:text-emerald-300 rounded-full text-slate-400 shrink-0 border border-slate-700">
                  {st.enrolledCourseIds.length} curso(s)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Links & Contact */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestManagerLogin();
            }}
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            É o Administrador? Entrar como Gestor
          </button>

          <span className="text-slate-400 font-semibold">
            EXPLORER SOLUTIONS
          </span>
        </div>
      </div>
    </div>
  );
};
