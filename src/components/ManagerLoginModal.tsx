import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldAlert,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  Info
} from 'lucide-react';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin
}) => {
  const [username, setUsername] = useState<string>('gestor@petrosgi.com.br');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default valid credentials:
    // Username can be 'gestor', 'gestor@petrosgi.com.br', 'admin'
    // Password is 'sgso2026' or 'admin123'
    const validUsernames = ['gestor', 'gestor@petrosgi.com.br', 'admin', 'auditor.lider@petrosgi.com'];
    const validPasswords = ['sgso2026', 'admin123', 'gestor2026'];

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (validUsernames.includes(cleanUser) && validPasswords.includes(cleanPass)) ||
      cleanPass === 'sgso2026'
    ) {
      setErrorMsg(null);
      setPassword('');
      onSuccessLogin();
    } else {
      setErrorMsg('Credenciais inválidas. Utilize a senha padrão do gestor.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Fechar"
        >
          ✕
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Acesso Restrito: Modo Gestor
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Área administrativa para gestão de módulos, vídeos educativos do treinamento e controle de certificados.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Usuário / E-mail Corporativo
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: gestor@petrosgi.com.br"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha do gestor"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Helper credential hint badge */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300 block">Credenciais Padrão do Gestor:</span>
              <span>Usuário: <code className="text-amber-300 font-mono-code">gestor@petrosgi.com.br</code> | Senha: <code className="text-amber-300 font-mono-code">sgso2026</code></span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Voltar ao Módulo Aluno
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              Entrar como Gestor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
