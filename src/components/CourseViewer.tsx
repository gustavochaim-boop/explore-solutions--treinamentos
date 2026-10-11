import React, { useState, useEffect } from 'react';
import { Course, Module, Lesson, EducationalVideo, StudentUser } from '../types';
import { EducationalVideoSection } from './EducationalVideoSection';
import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Shield,
  Layers,
  Compass,
  FileText,
  AlertTriangle,
  Award,
  Sparkles,
  ExternalLink,
  CheckSquare,
  Square,
  Lock,
  Video,
  Phone,
  Mail,
  GraduationCap,
  Users,
  Anchor,
  CheckCircle2,
  HelpCircle,
  Edit,
  Plus
} from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  completedLessonIds: string[];
  onToggleLessonCompletion: (lessonId: string) => void;
  onOpen3DLab: () => void;
  onOpenExam: () => void;
  onOpenCertificateStudio: () => void;
  isAdminMode: boolean;
  onAddModuleVideo: (moduleId: string, video: EducationalVideo) => void;
  onDeleteModuleVideo: (moduleId: string, videoId: string) => void;
  onRequestManagerLogin: () => void;
  // Multiple Courses & Student context
  courses?: Course[];
  onSelectCourse?: (courseId: string) => void;
  currentStudent?: StudentUser | null;
  onOpenStudentManager?: () => void;
  onNavigateToEditor?: (courseId?: string, openCreateModal?: boolean) => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  completedLessonIds,
  onToggleLessonCompletion,
  onOpen3DLab,
  onOpenExam,
  onOpenCertificateStudio,
  isAdminMode,
  onAddModuleVideo,
  onDeleteModuleVideo,
  onRequestManagerLogin,
  courses = [],
  onSelectCourse,
  currentStudent,
  onOpenStudentManager,
  onNavigateToEditor
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(course.modules[0]?.id || '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    course.modules[0]?.lessons[0]?.id || ''
  );

  // Sync selected module and lesson when course changes
  useEffect(() => {
    if (course.modules && course.modules.length > 0) {
      setSelectedModuleId(course.modules[0].id);
      if (course.modules[0].lessons && course.modules[0].lessons.length > 0) {
        setSelectedLessonId(course.modules[0].lessons[0].id);
      }
    }
  }, [course.id]);

  // Checked state for practical audit checklists within the lesson
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>({});

  const toggleChecklistItem = (itemKey: string) => {
    setCheckedChecklistItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const activeModule =
    course.modules.find(m => m.id === selectedModuleId) || course.modules[0];
  const activeLesson =
    activeModule?.lessons.find(l => l.id === selectedLessonId) || activeModule?.lessons[0];

  // Flattened lessons list to handle Next / Previous navigation seamlessly
  const allLessons = course.modules.flatMap(m =>
    m.lessons.map(l => ({ ...l, moduleId: m.id }))
  );
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const next = allLessons[currentLessonIndex + 1];
      setSelectedModuleId(next.moduleId);
      setSelectedLessonId(next.id);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prev = allLessons[currentLessonIndex - 1];
      setSelectedModuleId(prev.moduleId);
      setSelectedLessonId(prev.id);
    }
  };

  const isCompleted = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;
  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.filter(id =>
    allLessons.some(l => l.id === id)
  ).length;
  const courseProgressPercent = Math.round((completedCount / (totalLessonsCount || 1)) * 100);

  // Check if current student is permitted for this course
  const isStudentPermitted =
    isAdminMode ||
    !currentStudent ||
    currentStudent.enrolledCourseIds.includes(course.id);

  return (
    <div className="space-y-6">
      {/* Course Switcher Pills Bar (if multiple courses available or Admin Mode) */}
      {(courses.length > 1 || isAdminMode) && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pl-1">
              <BookOpen className="w-3.5 h-3.5" />
              Treinamentos Disponíveis:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            {courses.map(c => {
              const isSelected = c.id === course.id;
              const hasPermission =
                isAdminMode || !currentStudent || currentStudent.enrolledCourseIds.includes(c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCourse?.(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : hasPermission ? (
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span>{c.title.split('(')[0]}</span>
                  <span className="text-[10px] font-mono-code opacity-75">
                    ({c.workloadHours}h)
                  </span>
                </button>
              );
            })}

            {/* Quick Actions for Gestor right on the Treinamentos Disponíveis bar */}
            {isAdminMode && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800/80">
                <button
                  onClick={() => onNavigateToEditor?.(course.id, false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/60 flex items-center gap-1.5 transition-all"
                  title="Editar dados, módulos e aulas deste treinamento selecionado"
                >
                  <Edit className="w-3.5 h-3.5 text-purple-300" />
                  <span>Editar Treinamento</span>
                </button>

                <button
                  onClick={() => onNavigateToEditor?.(undefined, true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                  title="Criar e formatar um novo treinamento na plataforma com todos os módulos"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Novo Treinamento</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Permission Gate if Student is Not Permitted for this Course */}
      {!isStudentPermitted ? (
        <div className="bg-slate-900 border border-amber-900/50 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
              Aguardando Concessão de Acesso
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Treinamento Restrito para seu Perfil
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
              Olá, <strong>{currentStudent?.name}</strong>. O curso{' '}
              <strong className="text-amber-400">"{course.title}"</strong> ainda não foi liberado para o seu login pelo Gestor do treinamento.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
            <span className="text-slate-400 block font-bold uppercase text-[10px] tracking-wider">
              Como liberar o acesso a este treinamento?
            </span>
            <p className="text-slate-300">
              O Administrador / Gestor do treinamento pode conceder a permissão com 1 clique no painel <strong>"Alunos & Permissões"</strong>. Entre em contato com a coordenação pedagógica ou selecione um curso já liberado:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {courses.find(c => currentStudent?.enrolledCourseIds.includes(c.id)) && (
              <button
                onClick={() => {
                  const allowed = courses.find(c => currentStudent?.enrolledCourseIds.includes(c.id));
                  if (allowed) onSelectCourse?.(allowed.id);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Ir para Treinamento Liberado
              </button>
            )}

            <button
              onClick={onRequestManagerLogin}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Shield className="w-4 h-4" />
              Sou o Gestor (Fazer Login)
            </button>
          </div>

          {/* Gate Footer */}
          <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 text-center">
            <span className="text-slate-300 font-semibold">
              EXPLORER SOLUTIONS • Coordenação e Gestão Pedagógica
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Course Hero & Global Progress Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      isAdminMode
                        ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {isAdminMode ? 'Modo Gestor: Controle Total' : 'Módulo Aluno: Treinamento'}
                  </span>

                  {currentStudent && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-200">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      Aluno: <strong>{currentStudent.name}</strong>
                    </span>
                  )}

                  {isAdminMode && (
                    <>
                      {onOpenStudentManager && (
                        <button
                          onClick={onOpenStudentManager}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-200 transition-colors font-semibold"
                        >
                          <Users className="w-3 h-3 text-purple-300" />
                          Cadastrar / Gerenciar Alunos
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateToEditor?.(course.id, false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors font-bold shadow-sm"
                        title="Editar conteúdo, módulos e aulas deste curso"
                      >
                        <Edit className="w-3 h-3" />
                        Editar Este Treinamento
                      </button>

                      <button
                        onClick={() => onNavigateToEditor?.(undefined, true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition-all font-extrabold shadow-md shadow-amber-500/20"
                        title="Formatar e incluir novo treinamento com todos os módulos padrão"
                      >
                        <Plus className="w-3 h-3" />
                        + Formatar Novo Treinamento
                      </button>
                    </>
                  )}

                  {!isAdminMode && (
                    <button
                      onClick={onRequestManagerLogin}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Fazer login para acessar os recursos do gestor"
                    >
                      <Lock className="w-3 h-3 text-amber-400" />
                      Entrar como Gestor
                    </button>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {course.title}
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-3xl">
                  {course.subtitle} • Carga Horária: <strong>{course.workloadHours}h</strong> • Instrutor: {course.instructorName} ({course.instructorCredential})
                </p>
              </div>

              {/* Overall Progress Widget */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[260px]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">Progresso no Treinamento:</span>
                  <span className="font-bold text-amber-400 font-mono-code">{courseProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${courseProgressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{completedCount} de {totalLessonsCount} aulas</span>
                  {courseProgressPercent === 100 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Concluído
                    </span>
                  ) : (
                    <span>Em andamento</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 pt-4 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1">
                Normas & Resoluções:
              </span>
              {course.regulatoryFramework.map((reg, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[11px] font-mono-code"
                >
                  {reg}
                </span>
              ))}
            </div>
          </div>

          {/* Main 2-Column Learning Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Modules & Lessons Navigator (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Módulos do Treinamento ({course.modules.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  {totalLessonsCount} aulas no total
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod) => {
                  const isModSelected = mod.id === selectedModuleId;
                  const modLessonsCount = mod.lessons.length;
                  const modCompletedCount = mod.lessons.filter(l =>
                    completedLessonIds.includes(l.id)
                  ).length;
                  const isModComplete =
                    modLessonsCount > 0 && modCompletedCount === modLessonsCount;

                  return (
                    <div
                      key={mod.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isModSelected
                          ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Module Header Bar */}
                      <div
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          if (mod.lessons[0]) setSelectedLessonId(mod.lessons[0].id);
                        }}
                        className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              isModComplete
                                ? 'bg-emerald-500 text-slate-950'
                                : isModSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {mod.number}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white line-clamp-1">
                                {mod.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {mod.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono-code text-slate-400">
                            {modCompletedCount}/{modLessonsCount}
                          </span>
                        </div>
                      </div>

                      {/* Lessons list inside this module */}
                      {isModSelected && (
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-800/60">
                          {mod.lessons.map((lesson) => {
                            const isLessonActive = lesson.id === activeLesson?.id;
                            const isDone = completedLessonIds.includes(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => setSelectedLessonId(lesson.id)}
                                className={`p-2.5 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer text-xs transition-all ${
                                  isLessonActive
                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-semibold'
                                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {isDone ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {lesson.specialType === 'LAB_3D' && (
                                    <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded text-[9px] font-mono-code border border-cyan-800">
                                      3D
                                    </span>
                                  )}
                                  {lesson.specialType === 'EXAM' && (
                                    <span className="px-1.5 py-0.5 bg-purple-950 text-purple-400 rounded text-[9px] font-mono-code border border-purple-800">
                                      Prova
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400 font-mono-code">
                                    {lesson.durationMinutes}m
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lesson Active Content View (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card de Vídeos Educativos do Módulo (Com controle exclusivo do Gestor para adicionar/remover) */}
              {activeModule && (
                <EducationalVideoSection
                  module={activeModule}
                  isAdminMode={isAdminMode}
                  onAddVideo={onAddModuleVideo}
                  onDeleteVideo={onDeleteModuleVideo}
                  onRequestManagerLogin={onRequestManagerLogin}
                />
              )}

              {activeLesson ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  {/* Lesson Top Meta Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 rounded text-xs font-bold">
                          Módulo {activeModule?.number} • Aula {currentLessonIndex + 1}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-mono-code">
                          <Clock className="w-3.5 h-3.5" />
                          {activeLesson.durationMinutes} minutos
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {activeLesson.title}
                      </h2>
                    </div>

                    <button
                      onClick={() => onToggleLessonCompletion(activeLesson.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Aula Concluída
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          Marcar como Concluída
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Objetivo da Aula:
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeLesson.summary}
                    </p>
                  </div>

                  {/* Special Modules Callouts (Lab 3D or Exam) */}
                  {activeLesson.specialType === 'LAB_3D' && (
                    <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Laboratório Prático de Auditoria 3D Offshore
                          </h4>
                          <p className="text-xs text-slate-400">
                            Navegue na planta industrial virtual, cace não-conformidades de SGSO e entreviste avatares da tripulação.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onOpen3DLab}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shrink-0 shadow-lg shadow-cyan-500/20"
                      >
                        Abrir Simulador 3D
                      </button>
                    </div>
                  )}

                  {activeLesson.specialType === 'EXAM' && (
                    <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Avaliação Final de Competência do Auditor
                          </h4>
                          <p className="text-xs text-slate-400">
                            Resolução de casos práticos de auditoria de SGSO e emissão do certificado com aproveitamento mínimo de 70%.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onOpenExam}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-xl text-xs transition-all shrink-0 shadow-lg shadow-purple-500/20"
                      >
                        Iniciar Prova de Certificação
                      </button>
                    </div>
                  )}

                  {/* Technical Points of the Lesson */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      Fundamentos Técnicos & Requisitos Regulatórios
                    </h4>

                    <div className="space-y-2">
                      {activeLesson.technicalDetails.map((detail, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Audit Checklist (Interactive) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        Checklist Prático de Campo do Auditor Líder
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Itens verificáveis a bordo
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeLesson.practicalChecklist.map((checkItem, idx) => {
                        const itemKey = `${activeLesson.id}-check-${idx}`;
                        const isChecked = !!checkedChecklistItems[itemKey];

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklistItem(itemKey)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                              isChecked
                                ? 'bg-emerald-950/20 border-emerald-800 text-emerald-200'
                                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            )}
                            <span className={isChecked ? 'line-through opacity-80' : ''}>
                              {checkItem}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Real Case Study (if available) */}
                  {activeLesson.realCaseStudy && (
                    <div className="bg-amber-950/15 border border-amber-900/40 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400 tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        Estudo de Caso Real da Indústria Marítima: {activeLesson.realCaseStudy.title}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{activeLesson.realCaseStudy.scenario}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <strong className="text-red-400 block mb-1">Falhas Críticas Identificadas:</strong>
                          <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                            {activeLesson.realCaseStudy.keyFindings.map((kf, i) => (
                              <li key={i}>{kf}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <strong className="text-emerald-400 block mb-1">Medidas de Barreira e Causa Raiz:</strong>
                          <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                            {activeLesson.realCaseStudy.correctiveActions.map((ca, i) => (
                              <li key={i}>{ca}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Nav: Previous & Next Lesson */}
                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={handlePrevLesson}
                      disabled={currentLessonIndex === 0}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Aula Anterior
                    </button>

                    <button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === allLessons.length - 1}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      Próxima Aula
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  Selecione uma aula na barra lateral para começar a estudar.
                </div>
              )}
            </div>
          </div>

          {/* Institutional Banner EXPLORER SOLUTIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  EXPLORER SOLUTIONS
                </div>
                <h3 className="text-base font-bold text-white">
                  Plataforma de Capacitação & Formação de Auditores
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ambiente de excelência operacional, conformidade regulatória marítima e auditoria de sistemas de gestão.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-cinzel text-sm font-bold text-slate-200 tracking-wider">
                  EXPLORER SOLUTIONS
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
