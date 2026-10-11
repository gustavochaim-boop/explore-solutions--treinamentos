import React, { useState } from 'react';
import { StudentUser, Course } from '../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Search,
  BookOpen,
  Lock,
  Unlock,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface StudentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentUser[];
  courses: Course[];
  onSaveStudent: (student: StudentUser) => void;
  onDeleteStudent: (studentId: string) => void;
  onToggleCoursePermission: (studentId: string, courseId: string) => void;
}

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  courses,
  onSaveStudent,
  onDeleteStudent,
  onToggleCoursePermission
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New/Edit student form state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [document, setDocument] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setName('');
    setEmail('');
    setDocument('');
    setUsername('');
    setPassword('senha123');
    setSelectedCourseIds(courses.map(c => c.id)); // Default enrolled in all or first
    setNotes('');
    setIsAddingNew(true);
  };

  const handleOpenEdit = (student: StudentUser) => {
    setEditingStudentId(student.id);
    setName(student.name);
    setEmail(student.email);
    setDocument(student.document);
    setUsername(student.username);
    setPassword(student.password);
    setSelectedCourseIds([...student.enrolledCourseIds]);
    setNotes(student.notes || '');
    setIsAddingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('Por favor, preencha os campos obrigatórios (Nome, Usuário e Senha).');
      return;
    }

    const studentToSave: StudentUser = {
      id: editingStudentId || `stud-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${username.toLowerCase().replace(/\s+/g, '')}@aluno.maritimo.com`,
      document: document.trim() || 'Sob consulta',
      username: username.trim().toLowerCase(),
      password: password.trim(),
      isActive: true,
      enrolledCourseIds: selectedCourseIds,
      createdAt: editingStudentId
        ? students.find(s => s.id === editingStudentId)?.createdAt || new Date().toLocaleDateString('pt-BR')
        : new Date().toLocaleDateString('pt-BR'),
      notes: notes.trim()
    };

    onSaveStudent(studentToSave);
    setIsAddingNew(false);
  };

  const handleCopyCredentials = (s: StudentUser) => {
    const courseNames = courses
      .filter(c => s.enrolledCourseIds.includes(c.id))
      .map(c => `• ${c.title}`)
      .join('\n');

    const text = `Prezado(a) ${s.name},\nSeu acesso individual ao portal de capacitação foi liberado pelo gestor!\n\nUsuário: ${s.username}\nSenha: ${s.password}\n\nTreinamento(s) Liberado(s):\n${courseNames}\n\nAcesse a plataforma e bons estudos!`;

    navigator.clipboard.writeText(text);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-xs font-semibold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Painel do Administrador do Treinamento
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Gestão de Alunos & Concessão de Acessos
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cadastre alunos, crie login e senha individuais e conceda permissões aos treinamentos desejados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Cadastrar Novo Aluno
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="py-5 overflow-y-auto flex-1 pr-1 space-y-5">
          {/* Form for Add/Edit Student */}
          {isAddingNew ? (
            <div className="bg-slate-950 border border-purple-900/60 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  {editingStudentId ? 'Editar Cadastro do Aluno' : 'Novo Aluno: Login, Senha e Permissões'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nome Completo do Aluno: *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex: Oficial Marina Costa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CPF ou CIR Marítima:
                    </label>
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      placeholder="ex: 123.456.789-00 (CIR: 201994)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      E-mail:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aluno@navegacao.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Usuário de Acesso (Login Individual): *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ex: marina.costa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-code"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Senha Individual de Acesso: *
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ex: ism2026"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-code"
                      required
                    />
                  </div>
                </div>

                {/* Course Permission Checkboxes */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Concessão de Acesso aos Treinamentos Disponíveis:
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Marque os cursos que este aluno tem autorização para cursar e emitir certificado:
                  </p>

                  <div className="space-y-2 pt-1">
                    {courses.map((course) => {
                      const isChecked = selectedCourseIds.includes(course.id);
                      return (
                        <label
                          key={course.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-purple-950/30 border-purple-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedCourseIds(selectedCourseIds.filter(id => id !== course.id));
                              } else {
                                setSelectedCourseIds([...selectedCourseIds, course.id]);
                              }
                            }}
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                          />
                          <div>
                            <span className="text-xs font-bold block">{course.title}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {course.subtitle} ({course.workloadHours} horas)
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Anotações Internas do Gestor:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ex: Turma Outubro/2026 • Armador Wilson Sons"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Voltar à Lista
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {editingStudentId ? 'Salvar Alterações' : 'Concluir Cadastro & Conceder Acesso'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Search Bar & Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome, login ou CPF..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="text-xs text-slate-400">
                  Total de alunos cadastrados: <strong className="text-white font-mono-code">{students.length}</strong>
                </div>
              </div>

              {/* Students Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Aluno & Documento</th>
                      <th className="py-3 px-3">Login / Senha Individual</th>
                      <th className="py-3 px-3">Treinamentos Liberados</th>
                      <th className="py-3 px-3 text-right">Ações do Administrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{s.name}</div>
                            <div className="text-[11px] text-slate-400">{s.document}</div>
                            <div className="text-[10px] text-slate-400 font-mono-code">{s.email}</div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-mono-code">
                              <span className="text-slate-400">Usuário:</span>
                              <strong className="text-amber-400">{s.username}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono-code text-[11px]">
                              <span className="text-slate-400">Senha:</span>
                              <span className="text-slate-300">{s.password}</span>
                            </div>
                            <button
                              onClick={() => handleCopyCredentials(s)}
                              className="mt-1 text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              {copiedId === s.id ? 'Credenciais Copiadas!' : 'Copiar Acesso'}
                            </button>
                          </td>

                          <td className="py-3 px-3">
                            <div className="space-y-1.5">
                              {courses.map((course) => {
                                const isPermitted = s.enrolledCourseIds.includes(course.id);
                                return (
                                  <button
                                    key={course.id}
                                    type="button"
                                    onClick={() => onToggleCoursePermission(s.id, course.id)}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                                      isPermitted
                                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 font-semibold'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                    }`}
                                    title={isPermitted ? 'Clique para revogar permissão' : 'Clique para liberar permissão'}
                                  >
                                    {isPermitted ? (
                                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate max-w-[170px]">{course.title.split('(')[0]}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(s)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title="Editar dados e senha do aluno"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Excluir o cadastro de ${s.name}?`)) {
                                    onDeleteStudent(s.id);
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
                                title="Remover aluno"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Nenhum aluno encontrado com o filtro "{searchTerm}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>O aluno utiliza seu usuário e senha individual para acessar apenas os cursos liberados.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
