import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Compass,
  Award,
  Search,
  Settings,
  Edit,
  Lock,
  LogOut,
  GraduationCap,
  Users,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Course, StudentUser } from '../types';

export type ActiveTab = 'course' | 'lab3d' | 'certificate' | 'verify' | 'editor';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isAdminMode: boolean;
  onRequestLogin: () => void;
  onLogoutAdmin: () => void;
  completedCount: number;
  totalLessons: number;
  // Multiple Courses support
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  // Student Auth support
  currentStudent: StudentUser | null;
  onOpenStudentLogin: () => void;
  onLogoutStudent: () => void;
  onOpenStudentManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isAdminMode,
  onRequestLogin,
  onLogoutAdmin,
  completedCount,
  totalLessons,
  courses,
  activeCourseId,
  onSelectCourse,
  currentStudent,
  onOpenStudentLogin,
  onLogoutStudent,
  onOpenStudentManager
}) => {
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState<boolean>(false);
  const percent = Math.round((completedCount / (totalLessons || 1)) * 100);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const handleTabClick = (tab: ActiveTab) => {
    // If student clicks Gestor-only tab (editor or certificate), prompt manager login
    if (!isAdminMode && (tab === 'editor' || tab === 'certificate')) {
      onRequestLogin();
      return;
    }
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Logo & Platform Title */}
          <div
            onClick={() => onSelectTab('course')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wider">
                  EXPLORER SOLUTIONS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">
                {isAdminMode
                  ? 'Painel Administrativo do Gestor'
                  : currentStudent
                  ? `Portal do Aluno: ${currentStudent.name.split(' ')[0]}`
                  : 'Plataforma de Capacitação Profissional'}
              </p>
            </div>
          </div>

          {/* Course Switcher Dropdown */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all max-w-[280px]"
              title="Clique para alternar o treinamento"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="text-left truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">Treinamento Ativo:</span>
                <span className="font-bold truncate block">{activeCourse?.title.split('(')[0]}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {isCourseDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Selecione o Treinamento:
                </div>
                {courses.map(course => {
                  const isSelected = course.id === activeCourseId;
                  const isPermitted =
                    isAdminMode || !currentStudent || currentStudent.enrolledCourseIds.includes(course.id);

                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        onSelectCourse(course.id);
                        setIsCourseDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-colors mb-1 ${
                        isSelected
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isSelected ? (
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                        ) : isPermitted ? (
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold block truncate">{course.title}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {course.workloadHours} horas • {course.modules.length} módulos
                        </span>
                        {!isPermitted && (
                          <span className="text-[9px] text-red-400 block font-semibold">
                            Requer concessão de acesso pelo Gestor
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {isAdminMode && (
                  <div className="pt-1.5 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        onSelectTab('editor');
                        setIsCourseDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 text-amber-400 hover:bg-amber-500/10 transition-colors font-bold"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Formatar Novo Treinamento</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => handleTabClick('course')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'course'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Módulo do Treinamento
            </button>

            <button
              onClick={() => handleTabClick('lab3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'lab3d'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Laboratório 3D
            </button>

            {/* Certificados - Exclusivo do Modo Gestor */}
            {isAdminMode ? (
              <button
                onClick={() => handleTabClick('certificate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'certificate'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Certificados (Gestor)
              </button>
            ) : (
              <button
                onClick={() => onRequestLogin()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-all"
                title="Emissão e edição restrita ao Gestor"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="opacity-80">Certificados</span>
              </button>
            )}

            <button
              onClick={() => handleTabClick('verify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'verify'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Validador
            </button>

            {/* Gestão do Curso - Exclusivo do Modo Gestor */}
            {isAdminMode ? (
              <button
                onClick={() => handleTabClick('editor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'editor'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md font-extrabold shadow-amber-500/20'
                    : 'bg-purple-950/40 text-purple-200 border border-purple-800/60 hover:bg-purple-900/60 hover:text-white'
                }`}
                title="Editar os treinamentos disponíveis e formatar novos cursos com todos os módulos"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Gestão de Treinamentos</span>
              </button>
            ) : (
              <button
                onClick={() => onRequestLogin()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-all"
                title="Acesso exclusivo do Gestor (requer login e senha)"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="opacity-80">Gestão</span>
              </button>
            )}
          </nav>

          {/* Right Action: Auth States & Student/Gestor Badges */}
          <div className="flex items-center gap-2">
            {/* If Manager is Logged In */}
            {isAdminMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStudentManager}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  title="Gerenciar cadastro de alunos, senhas e concessão de treinamentos"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Alunos & Permissões</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-purple-950/80 border border-purple-700/60 rounded-xl text-xs text-purple-300 font-semibold">
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gestor</span>
                </div>

                <button
                  onClick={onLogoutAdmin}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 transition-all flex items-center gap-1"
                  title="Sair do Modo Gestor"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : currentStudent ? (
              /* If Student is Logged In */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold max-w-[120px] truncate hidden sm:inline">
                    {currentStudent.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono-code hidden md:inline">
                    ({percent}%)
                  </span>
                </div>

                <button
                  onClick={onLogoutStudent}
                  className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                  title="Sair da conta do aluno"
                >
                  <LogOut className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              /* If Guest (Not Logged In) */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onOpenStudentLogin}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Entrar com login e senha individual do aluno"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Acesso Aluno</span>
                </button>

                <button
                  onClick={onRequestLogin}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Entrar com login e senha no Modelo Gestor"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Acesso Gestor</span>
                  <span className="sm:hidden">Gestor</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation & Course Bar */}
        <div className="lg:hidden flex flex-col py-2 border-t border-slate-800/60 gap-2 text-xs">
          {/* Mobile Course Switcher */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Treinamento:</span>
            <div className="flex items-center gap-1 shrink-0">
              {courses.map(course => {
                const isSelected = course.id === activeCourseId;
                return (
                  <button
                    key={course.id}
                    onClick={() => onSelectCourse(course.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] truncate max-w-[170px] ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {course.title.split('(')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-around text-xs">
            <button
              onClick={() => handleTabClick('course')}
              className={`p-1.5 rounded-lg ${activeTab === 'course' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
            >
              Treinamento
            </button>
            <button
              onClick={() => handleTabClick('lab3d')}
              className={`p-1.5 rounded-lg ${activeTab === 'lab3d' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
            >
              3D Lab
            </button>
            {isAdminMode ? (
              <button
                onClick={() => handleTabClick('certificate')}
                className={`p-1.5 rounded-lg ${activeTab === 'certificate' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
              >
                Certificados
              </button>
            ) : (
              <button
                onClick={() => onRequestLogin()}
                className="p-1.5 rounded-lg text-slate-400 flex items-center gap-1"
                title="Certificados: exclusivo do Gestor"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                Certificados
              </button>
            )}
            <button
              onClick={() => handleTabClick('verify')}
              className={`p-1.5 rounded-lg ${activeTab === 'verify' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
            >
              Validador
            </button>
            {isAdminMode && (
              <button
                onClick={() => handleTabClick('editor')}
                className={`p-1.5 rounded-lg ${activeTab === 'editor' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
