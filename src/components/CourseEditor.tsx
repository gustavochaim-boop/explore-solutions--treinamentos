import React, { useState } from 'react';
import { Course, Module, Lesson, EducationalVideo } from '../types';
import {
  createFormattedCourse,
  duplicateCourse,
  CreateCourseOptions
} from '../utils/courseFormatting';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  X,
  Award,
  Video,
  ArrowUp,
  ArrowDown,
  Tag,
  GraduationCap,
  Eye
} from 'lucide-react';

interface CourseEditorProps {
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onUpdateCourse: (updated: Course) => void;
  onCreateCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onDuplicateCourse: (courseId: string) => void;
  onResetToDefault: () => void;
  initialOpenCreateModal?: boolean;
  onCloseCreateModal?: () => void;
  onNavigateToCourseView?: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  courses,
  activeCourseId,
  onSelectCourse,
  onUpdateCourse,
  onCreateCourse,
  onDeleteCourse,
  onDuplicateCourse,
  onResetToDefault,
  initialOpenCreateModal,
  onCloseCreateModal,
  onNavigateToCourseView
}) => {
  // Course being currently edited
  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Active module inside current course
  const [activeModuleId, setActiveModuleId] = useState<string>(() => {
    return currentCourse?.modules[0]?.id || '';
  });

  // Track lesson being edited
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Active tab in editor: 'content' | 'metadata' | 'all_courses'
  const [editorTab, setEditorTab] = useState<'content' | 'metadata' | 'all_courses'>('content');

  // New Course Creation Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newWorkload, setNewWorkload] = useState<number>(40);
  const [newTargetAudience, setNewTargetAudience] = useState<string>('Auditores Internos, Engenheiros, Oficiais e Gestores de Qualidade');
  const [newInstructor, setNewInstructor] = useState<string>('Lead Auditor EXPLORER SOLUTIONS');
  const [newInstructorRole, setNewInstructorRole] = useState<string>('Coordenador Pedagógico & Auditor Líder Sênior');
  const [newInstructorCredential, setNewInstructorCredential] = useState<string>('IRCA Lead Auditor / Registro Técnico');
  const [newNormsText, setNewNormsText] = useState<string>('ABNT NBR ISO 19011:2026, ISO 9001 / ISO 14001, Diretrizes Internacionais');
  const [newDescription, setNewDescription] = useState<string>('Programa de formação e capacitação técnica com abordagem prática, checklists de auditoria em campo e simulações.');
  const [newPreset, setNewPreset] = useState<CreateCourseOptions['preset']>('standard_audit');
  const [cloneSourceId, setCloneSourceId] = useState<string>(courses[0]?.id || '');
  const [creationMethod, setCreationMethod] = useState<'preset' | 'clone'>('preset');

  // Toast feedback
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // When currentCourse changes, make sure activeModuleId is valid
  React.useEffect(() => {
    if (currentCourse) {
      if (!currentCourse.modules.some(m => m.id === activeModuleId)) {
        setActiveModuleId(currentCourse.modules[0]?.id || '');
      }
    }
  }, [currentCourse, activeModuleId]);

  // Sync initialOpenCreateModal
  React.useEffect(() => {
    if (initialOpenCreateModal) {
      resetCreateForm();
      setIsCreateModalOpen(true);
    }
  }, [initialOpenCreateModal]);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    onCloseCreateModal?.();
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Active module
  const activeModule = currentCourse?.modules.find(m => m.id === activeModuleId) || currentCourse?.modules[0];

  // ==================== Course Level Handlers ====================

  const handleCreateNewCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Por favor, informe o título do novo treinamento.');
      return;
    }

    if (creationMethod === 'clone') {
      const sourceCourse = courses.find(c => c.id === cloneSourceId) || currentCourse;
      if (!sourceCourse) return;
      const cloned = duplicateCourse(sourceCourse, newTitle.trim());
      if (newSubtitle.trim()) cloned.subtitle = newSubtitle.trim();
      if (newWorkload) cloned.workloadHours = newWorkload;
      if (newInstructor.trim()) cloned.instructorName = newInstructor.trim();

      onCreateCourse(cloned);
      onSelectCourse(cloned.id);
      setActiveModuleId(cloned.modules[0]?.id || '');
      setIsCreateModalOpen(false);
      triggerToast(`Novo treinamento "${cloned.title}" criado com sucesso!`);
      resetCreateForm();
      return;
    }

    // Preset formatting
    const norms = newNormsText
      .split(',')
      .map(n => n.trim())
      .filter(Boolean);

    const formattedCourse = createFormattedCourse({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Diretrizes Técnicas, Interpretação e Metodologia de Auditoria',
      workloadHours: newWorkload || 40,
      targetAudience: newTargetAudience.trim(),
      instructorName: newInstructor.trim(),
      instructorRole: newInstructorRole.trim(),
      instructorCredential: newInstructorCredential.trim(),
      regulatoryFramework: norms.length > 0 ? norms : ['ABNT NBR ISO 19011:2026'],
      description: newDescription.trim(),
      preset: newPreset
    });

    onCreateCourse(formattedCourse);
    onSelectCourse(formattedCourse.id);
    setActiveModuleId(formattedCourse.modules[0]?.id || '');
    setIsCreateModalOpen(false);
    triggerToast(`Treinamento formatado com ${formattedCourse.modules.length} módulos criado com sucesso!`);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewSubtitle('');
    setNewWorkload(40);
    setNewTargetAudience('Auditores Internos, Engenheiros, Oficiais e Gestores de Qualidade');
    setNewInstructor('Lead Auditor EXPLORER SOLUTIONS');
    setNewInstructorRole('Coordenador Pedagógico & Auditor Líder Sênior');
    setNewInstructorCredential('IRCA Lead Auditor / Registro Técnico');
    setNewNormsText('ABNT NBR ISO 19011:2026, ISO 9001 / ISO 14001, Diretrizes Internacionais');
    setNewDescription('Programa de formação e capacitação técnica com abordagem prática, checklists de auditoria em campo e simulações.');
    setNewPreset('standard_audit');
    setCreationMethod('preset');
  };

  const handleDeleteCurrentCourse = (courseId: string) => {
    if (courses.length <= 1) {
      alert('A plataforma precisa ter pelo menos um treinamento ativo.');
      return;
    }
    const target = courses.find(c => c.id === courseId);
    if (confirm(`Tem certeza de que deseja excluir permanentemente o treinamento "${target?.title}"? Esta ação removerá todos os seus módulos e aulas.`)) {
      onDeleteCourse(courseId);
      triggerToast('Treinamento excluído com sucesso.');
    }
  };

  const handleDuplicateCurrentCourse = (courseId: string) => {
    onDuplicateCourse(courseId);
    triggerToast('Treinamento duplicado com sucesso! Você já pode editar esta nova versão.');
  };

  // ==================== Module Handlers ====================

  const handleAddModule = () => {
    if (!currentCourse) return;
    const newModNumber = currentCourse.modules.length + 1;
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      number: newModNumber,
      title: `Novo Módulo ${newModNumber}: Tópico Avançado de Auditoria`,
      subtitle: 'Diretrizes técnicas, aplicação prática e critérios de conformidade',
      badge: 'Especialização',
      description: 'Objetivos de aprendizagem, verificação em campo e evidências mandatórias.',
      educationalVideos: [],
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: 'Aula Inicial: Conceitos e Requisitos Mandatórios',
          durationMinutes: 45,
          summary: 'Resumo dos critérios essenciais e pontos de atenção para o auditor líder.',
          technicalDetails: [
            'Requisito mandatório aplicável à sistemática de auditoria.',
            'Coleta e triangulação de evidências objetivas em campo.',
            'Confronto com os registros documentais obrigatórios.'
          ],
          practicalChecklist: [
            'Verificar a conformidade do procedimento operacional padrão.',
            'Checar a lista de presença e qualificação dos envolvidos.',
            'Registrar constatações com base estrita no critério normativo.'
          ],
          realCaseStudy: {
            title: 'Desvio Crítico Constatado em Auditoria Interna',
            scenario: 'Inspeção de campo identificou ausência de controle em processo mandatória.',
            keyFindings: [
              'Falta de rastreabilidade na cadeia de custódia dos dados.',
              'Ausência de evidência objetiva na pasta de registros.'
            ],
            correctiveActions: [
              'Revisão do fluxo de aprovação e treinamento imediato da equipe.',
              'Instituição de lista de verificação de pré-inspeção.'
            ]
          }
        }
      ]
    };

    const updated = {
      ...currentCourse,
      modules: [...currentCourse.modules, newModule]
    };
    onUpdateCourse(updated);
    setActiveModuleId(newModule.id);
    triggerToast('Novo módulo formatado adicionado com sucesso!');
  };

  const handleDeleteModule = (modId: string) => {
    if (!currentCourse) return;
    if (currentCourse.modules.length <= 1) {
      alert('O treinamento deve conter pelo menos um módulo.');
      return;
    }
    if (confirm('Tem certeza de que deseja remover este módulo e todas as suas aulas?')) {
      const filtered = currentCourse.modules.filter(m => m.id !== modId);
      const renumbered = filtered.map((m, idx) => ({ ...m, number: idx + 1 }));
      const updated = { ...currentCourse, modules: renumbered };
      onUpdateCourse(updated);
      setActiveModuleId(renumbered[0]?.id || '');
      triggerToast('Módulo removido e numeração ajustada.');
    }
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if (!currentCourse) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentCourse.modules.length) return;

    const list = [...currentCourse.modules];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    const renumbered = list.map((m, idx) => ({ ...m, number: idx + 1 }));
    onUpdateCourse({ ...currentCourse, modules: renumbered });
    triggerToast('Ordem dos módulos atualizada.');
  };

  // ==================== Lesson Handlers ====================

  const handleAddLesson = () => {
    if (!currentCourse || !activeModule) return;
    const newLessonIndex = activeModule.lessons.length + 1;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `Nova Aula ${newLessonIndex}: Metodologia e Critérios Técnicos`,
      durationMinutes: 50,
      summary: 'Resumo dos critérios mandatórios, evidências requeridas e roteiro de verificação do auditor.',
      technicalDetails: [
        'Parâmetro técnico a ser investigado durante a auditoria em campo.',
        'Documentação mandatória e registros mínimos exigidos pela norma.',
        'Critérios para identificação de conformidade e oportunidades de melhoria.'
      ],
      practicalChecklist: [
        'Verificação física de conformidade in loco.',
        'Confronto com ordens de serviço e relatórios no sistema informatizado.',
        'Entrevista com os executores para confirmação de entendimento do processo.'
      ]
    };

    const updatedModules = currentCourse.modules.map(m => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          lessons: [...m.lessons, newLesson]
        };
      }
      return m;
    });

    onUpdateCourse({ ...currentCourse, modules: updatedModules });
    setEditingLessonId(newLesson.id);
    triggerToast('Nova aula adicionada ao módulo.');
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!currentCourse || !activeModule) return;
    if (activeModule.lessons.length <= 1) {
      alert('O módulo deve ter pelo menos uma aula.');
      return;
    }
    const updatedModules = currentCourse.modules.map(m => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        };
      }
      return m;
    });
    onUpdateCourse({ ...currentCourse, modules: updatedModules });
    triggerToast('Aula excluída com sucesso.');
  };

  // ==================== Import / Export ====================

  const handleExportJson = () => {
    if (!currentCourse) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCourse, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentCourse.id}-backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.modules && parsed.title) {
            // Check if we replace current course or create as a new one
            if (!parsed.id) parsed.id = `curso-${Date.now()}`;
            onUpdateCourse(parsed);
            setActiveModuleId(parsed.modules[0]?.id || '');
            triggerToast('Treinamento importado com sucesso!');
          } else {
            alert('Arquivo JSON não possui a estrutura válida de um curso.');
          }
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!currentCourse) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum treinamento encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-medium text-xs flex items-center gap-2 animate-bounce border border-emerald-400">
          <CheckCircle className="w-4 h-4" />
          {saveToast}
        </div>
      )}

      {/* Top Banner / Course Selector & Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
              <Layers className="w-3.5 h-3.5" />
              Gestão de Treinamentos & Grade Curricular Oficial
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Painel do Gestor: Edição de Treinamentos
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Edite todos os treinamentos disponíveis, crie novos cursos formatados com a grade padrão de módulos (ISO 19011 / ISM / SGSO) e personalize requisitos, checklists e vídeos educativos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Voltar e Visualizar no Ambiente do Aluno */}
            {onNavigateToCourseView && (
              <button
                onClick={onNavigateToCourseView}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Voltar à tela de visualização do curso para ver a experiência do aluno"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver no Ambiente do Aluno</span>
              </button>
            )}

            {/* Novo Treinamento Button */}
            <button
              onClick={() => {
                resetCreateForm();
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Novo Treinamento Formatado
            </button>

            {/* Duplicar Treinamento Button */}
            <button
              onClick={() => handleDuplicateCurrentCourse(currentCourse.id)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              title="Clonar este treinamento para criar uma nova versão com todos os módulos"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              Clonar Treinamento
            </button>

            {/* Exportar JSON */}
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              title="Baixar backup completo deste curso em JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Exportar JSON
            </button>

            {/* Importar JSON */}
            <label className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              Importar JSON
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {/* Excluir Treinamento */}
            {courses.length > 1 && (
              <button
                onClick={() => handleDeleteCurrentCourse(currentCourse.id)}
                className="px-3 py-2.5 bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Excluir este treinamento da plataforma"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir
              </button>
            )}
          </div>
        </div>

        {/* Treinamentos Disponíveis Selector Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Treinamentos Disponíveis na Plataforma ({courses.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Clique para selecionar e editar o conteúdo de cada curso
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map(course => {
              const isSelected = course.id === currentCourse.id;
              const totalLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id);
                    setActiveModuleId(course.modules[0]?.id || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {course.workloadHours}h
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono-code">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {course.modules.length} módulos • {totalLessonsCount} aulas
                    </span>
                    {isSelected && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Editando Agora
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher for Active Course: Content vs. Metadata */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setEditorTab('content')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              editorTab === 'content'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Grade Curricular & Aulas ({currentCourse.modules.length} Módulos)
          </button>

          <button
            onClick={() => setEditorTab('metadata')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              editorTab === 'metadata'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Dados Gerais & Instrutor ({currentCourse.workloadHours} Horas)
          </button>
        </div>
      </div>

      {/* TAB 1: METADATA & GENERAL COURSE SETTINGS */}
      {editorTab === 'metadata' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Configurações Gerais do Treinamento: {currentCourse.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Altere o título, carga horária, perfil do instrutor e normas técnicas que aparecem no certificado e no portal do aluno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Título Oficial do Treinamento:
              </label>
              <input
                type="text"
                value={currentCourse.title}
                onChange={(e) => onUpdateCourse({ ...currentCourse, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                placeholder="Ex: Formação de Auditor Líder em Sistemas Integrados de Gestão..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Carga Horária Total (Horas-aula):
              </label>
              <input
                type="number"
                value={currentCourse.workloadHours}
                onChange={(e) => onUpdateCourse({ ...currentCourse, workloadHours: Number(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Subtítulo Técnico e Foco de Conformidade:
              </label>
              <input
                type="text"
                value={currentCourse.subtitle}
                onChange={(e) => onUpdateCourse({ ...currentCourse, subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Ex: Regulamentação Técnica ANP, ISO 19011:2026 e Código ISM..."
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Público-Alvo Recomendado:
              </label>
              <input
                type="text"
                value={currentCourse.targetAudience}
                onChange={(e) => onUpdateCourse({ ...currentCourse, targetAudience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Ex: Oficiais de Náutica, Engenheiros de Petróleo, Inspetores Navais e Auditores..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Nome do Instrutor / Auditor Responsável:
              </label>
              <input
                type="text"
                value={currentCourse.instructorName}
                onChange={(e) => onUpdateCourse({ ...currentCourse, instructorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Cargo / Especialidade do Instrutor:
              </label>
              <input
                type="text"
                value={currentCourse.instructorRole}
                onChange={(e) => onUpdateCourse({ ...currentCourse, instructorRole: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Credencial Técnica / Registro:
              </label>
              <input
                type="text"
                value={currentCourse.instructorCredential}
                onChange={(e) => onUpdateCourse({ ...currentCourse, instructorCredential: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Normas Técnicas e Regulamentos */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Marco Regulatório & Normas Técnicas (uma por linha):
              </label>
              <textarea
                value={currentCourse.regulatoryFramework.join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  onUpdateCourse({ ...currentCourse, regulatoryFramework: lines });
                }}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-code"
                placeholder="ABNT NBR ISO 19011:2026&#10;Convenção SOLAS 1974&#10;Regulamento SGSO..."
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Descrição Geral e Escopo Pedagógico:
              </label>
              <textarea
                value={currentCourse.description}
                onChange={(e) => onUpdateCourse({ ...currentCourse, description: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODULES & LESSONS SPLIT VIEW */}
      {editorTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Módulos ({currentCourse.modules.length})
              </h3>
              <button
                onClick={handleAddModule}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Módulo
              </button>
            </div>

            <div className="space-y-2">
              {currentCourse.modules.map((mod, idx) => {
                const isSelected = activeModule?.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {mod.number}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {mod.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Reorder Buttons */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveModule(idx, 'up');
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        )}
                        {idx < currentCourse.modules.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveModule(idx, 'down');
                            }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono-code ml-1">
                          {mod.lessons.length} aulas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 pl-8 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold truncate">
                        {mod.badge}
                      </span>
                      <span className="truncate">{mod.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Content & Lessons Editor (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            {activeModule ? (
              <>
                {/* Module Metadata Form */}
                <div className="pb-5 border-b border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold">
                        Módulo {activeModule.number}
                      </span>
                      <h3 className="font-extrabold text-white text-base">
                        Configurações do Módulo
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteModule(activeModule.id)}
                      className="px-2.5 py-1 text-red-400 hover:bg-red-950/40 border border-red-900/30 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      title="Excluir este módulo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir Módulo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Título do Módulo:
                      </label>
                      <input
                        type="text"
                        value={activeModule.title}
                        onChange={(e) => {
                          const updated = currentCourse.modules.map(m =>
                            m.id === activeModule.id ? { ...m, title: e.target.value } : m
                          );
                          onUpdateCourse({ ...currentCourse, modules: updated });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Badge / Etiqueta do Módulo:
                      </label>
                      <input
                        type="text"
                        value={activeModule.badge}
                        onChange={(e) => {
                          const updated = currentCourse.modules.map(m =>
                            m.id === activeModule.id ? { ...m, badge: e.target.value } : m
                          );
                          onUpdateCourse({ ...currentCourse, modules: updated });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-semibold"
                        placeholder="Ex: Fundamentos, Requisitos, Campo..."
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Subtítulo Técnico:
                      </label>
                      <input
                        type="text"
                        value={activeModule.subtitle}
                        onChange={(e) => {
                          const updated = currentCourse.modules.map(m =>
                            m.id === activeModule.id ? { ...m, subtitle: e.target.value } : m
                          );
                          onUpdateCourse({ ...currentCourse, modules: updated });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Descrição e Objetivos de Aprendizagem:
                      </label>
                      <textarea
                        value={activeModule.description}
                        onChange={(e) => {
                          const updated = currentCourse.modules.map(m =>
                            m.id === activeModule.id ? { ...m, description: e.target.value } : m
                          );
                          onUpdateCourse({ ...currentCourse, modules: updated });
                        }}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Educational Videos Management for this Module */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Video className="w-3.5 h-3.5" />
                        <span>Vídeos Educativos do Módulo ({activeModule.educationalVideos?.length || 0})</span>
                      </label>

                      <div className="flex items-center gap-1.5">
                        <label className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow">
                          <Upload className="w-3 h-3" />
                          Upload de Vídeo Arquivo
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const objectUrl = URL.createObjectURL(file);
                                const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                                const newVid: EducationalVideo = {
                                  id: `vid-${Date.now()}`,
                                  title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
                                  description: `Arquivo de vídeo (${(file.size / (1024 * 1024)).toFixed(1)} MB) carregado do computador.`,
                                  videoUrl: objectUrl,
                                  sourceType: 'uploaded_file',
                                  fileName: file.name,
                                  fileSizeMb: Math.round((file.size / (1024 * 1024)) * 10) / 10,
                                  durationMinutes: 25,
                                  tags: ['Treinamento', 'Arquivo Local'],
                                  addedAt: new Date().toLocaleDateString('pt-BR')
                                };
                                const updated = currentCourse.modules.map(m =>
                                  m.id === activeModule.id
                                    ? { ...m, educationalVideos: [...(m.educationalVideos || []), newVid] }
                                    : m
                                );
                                onUpdateCourse({ ...currentCourse, modules: updated });
                                triggerToast('Arquivo de vídeo carregado com sucesso!');
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Informe a URL do vídeo educativo (YouTube, Vimeo ou link MP4):', 'https://www.youtube.com/watch?v=');
                            if (url) {
                              const title = prompt('Título da Videoaula:', 'Videoaula Técnica de Auditoria') || 'Vídeo Educativo';
                              const newVid: EducationalVideo = {
                                id: `vid-${Date.now()}`,
                                title,
                                description: 'Videoaula complementar de capacitação e diretrizes do módulo.',
                                videoUrl: url,
                                sourceType: 'web_url',
                                durationMinutes: 30,
                                tags: ['Treinamento', 'Videoaula'],
                                addedAt: new Date().toLocaleDateString('pt-BR')
                              };
                              const updated = currentCourse.modules.map(m =>
                                m.id === activeModule.id
                                  ? { ...m, educationalVideos: [...(m.educationalVideos || []), newVid] }
                                  : m
                              );
                              onUpdateCourse({ ...currentCourse, modules: updated });
                              triggerToast('Vídeo adicionado ao módulo!');
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-amber-400" />
                          Link Web (YouTube)
                        </button>
                      </div>
                    </div>

                    {activeModule.educationalVideos && activeModule.educationalVideos.length > 0 ? (
                      <div className="space-y-1.5">
                        {activeModule.educationalVideos.map(v => (
                          <div
                            key={v.id}
                            className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-white truncate block flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                {v.title}
                                {v.sourceType === 'uploaded_file' && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-purple-900/50 text-purple-300 rounded border border-purple-700">
                                    Arquivo Local ({v.fileSizeMb} MB)
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate block font-mono-code mt-0.5">
                                {v.videoUrl}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remover o vídeo "${v.title}" deste módulo?`)) {
                                  const updated = currentCourse.modules.map(m =>
                                    m.id === activeModule.id
                                      ? { ...m, educationalVideos: (m.educationalVideos || []).filter(x => x.id !== v.id) }
                                      : m
                                  );
                                  onUpdateCourse({ ...currentCourse, modules: updated });
                                  triggerToast('Vídeo removido.');
                                }
                              }}
                              className="p-1 text-red-400 hover:bg-red-950/40 rounded shrink-0"
                              title="Excluir vídeo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                        Nenhum vídeo cadastrado neste módulo. Clique em "+ Upload de Vídeo Arquivo" ou "+ Link Web" acima.
                      </div>
                    )}
                  </div>
                </div>

                {/* Lessons Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Aulas Deste Módulo ({activeModule.lessons.length})
                    </h4>

                    <button
                      onClick={handleAddLesson}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar Nova Aula
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeModule.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {lIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {lesson.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-code mt-0.5">
                                <span className="bg-slate-900 px-1.5 py-0.5 rounded">
                                  {lesson.durationMinutes} min
                                </span>
                                {lesson.specialType === 'EXAM' && (
                                  <span className="bg-amber-950/60 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded font-bold">
                                    Avaliação Final / Exame
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() =>
                                setEditingLessonId(editingLessonId === lesson.id ? null : lesson.id)
                              }
                              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                editingLessonId === lesson.id
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                              title="Editar detalhes completos da aula"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              {editingLessonId === lesson.id ? 'Recolher' : 'Editar'}
                            </button>

                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
                              title="Excluir aula"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 pl-7 leading-relaxed">
                          {lesson.summary}
                        </p>

                        {/* Expanded In-depth Editor for this lesson */}
                        {editingLessonId === lesson.id && (
                          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 pl-2 sm:pl-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2 space-y-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Título da Aula:
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => {
                                    const updatedModules = currentCourse.modules.map(m => {
                                      if (m.id === activeModule.id) {
                                        return {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, title: e.target.value } : l
                                          )
                                        };
                                      }
                                      return m;
                                    });
                                    onUpdateCourse({ ...currentCourse, modules: updatedModules });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Duração (Minutos):
                                </label>
                                <input
                                  type="number"
                                  value={lesson.durationMinutes}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    const updatedModules = currentCourse.modules.map(m => {
                                      if (m.id === activeModule.id) {
                                        return {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, durationMinutes: val } : l
                                          )
                                        };
                                      }
                                      return m;
                                    });
                                    onUpdateCourse({ ...currentCourse, modules: updatedModules });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-300">
                                Resumo Executivo da Aula:
                              </label>
                              <textarea
                                value={lesson.summary}
                                onChange={(e) => {
                                  const updatedModules = currentCourse.modules.map(m => {
                                    if (m.id === activeModule.id) {
                                      return {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === lesson.id ? { ...l, summary: e.target.value } : l
                                        )
                                      };
                                    }
                                    return m;
                                  });
                                  onUpdateCourse({ ...currentCourse, modules: updatedModules });
                                }}
                                rows={2}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            {/* Requisitos Técnicos Mandatórios */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-amber-300 flex items-center justify-between">
                                <span>Requisitos Técnicos Mandatórios (um por linha):</span>
                                <span className="text-[10px] text-slate-400 font-normal">Critérios de evidência</span>
                              </label>
                              <textarea
                                value={lesson.technicalDetails.join('\n')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\n');
                                  const updatedModules = currentCourse.modules.map(m => {
                                    if (m.id === activeModule.id) {
                                      return {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === lesson.id ? { ...l, technicalDetails: lines } : l
                                        )
                                      };
                                    }
                                    return m;
                                  });
                                  onUpdateCourse({ ...currentCourse, modules: updatedModules });
                                }}
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code"
                              />
                            </div>

                            {/* Checklist Prático de Auditoria */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                                <span>Checklist Prático de Auditoria em Campo (um por linha):</span>
                                <span className="text-[10px] text-slate-400 font-normal">Itens de verificação</span>
                              </label>
                              <textarea
                                value={lesson.practicalChecklist.join('\n')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\n');
                                  const updatedModules = currentCourse.modules.map(m => {
                                    if (m.id === activeModule.id) {
                                      return {
                                        ...m,
                                        lessons: m.lessons.map(l =>
                                          l.id === lesson.id ? { ...l, practicalChecklist: lines } : l
                                        )
                                      };
                                    }
                                    return m;
                                  });
                                  onUpdateCourse({ ...currentCourse, modules: updatedModules });
                                }}
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono-code"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400">
                Selecione um módulo na barra lateral para começar a edição.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL: CRIAR NOVO TREINAMENTO FORMATADO ==================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-6 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-800 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Assistente de Formatação de Treinamentos
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Incluir Novo Treinamento na Plataforma
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Crie uma formação completa com todos os módulos estruturados conforme o padrão oficial da <strong>EXPLORER SOLUTIONS</strong>.
                </p>
              </div>

              <button
                onClick={handleCloseCreateModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateNewCourseSubmit} className="space-y-5 py-5 overflow-y-auto flex-1 pr-1">
              {/* Method Selection: Preset vs. Clone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Como deseja estruturar os módulos do novo treinamento?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setCreationMethod('preset')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      creationMethod === 'preset'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Grade Padronizada Oficial</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Gera 6 módulos formatados com aulas, checklists em campo, estudos de caso e exame final.
                    </p>
                  </div>

                  <div
                    onClick={() => setCreationMethod('clone')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      creationMethod === 'clone'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Copy className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Clonar Treinamento Existente</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Copia toda a estrutura de módulos e aulas de um curso atual como modelo inicial.
                    </p>
                  </div>
                </div>
              </div>

              {/* If Clone: select which course */}
              {creationMethod === 'clone' && (
                <div className="space-y-1.5 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">
                    Selecione o Treinamento Matriz para Clonar:
                  </label>
                  <select
                    value={cloneSourceId}
                    onChange={(e) => setCloneSourceId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.modules.length} módulos, {c.workloadHours}h)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* If Preset: select preset type */}
              {creationMethod === 'preset' && (
                <div className="space-y-1.5 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">
                    Selecione o Perfil Temático da Grade:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewPreset('standard_audit')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        newPreset === 'standard_audit'
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">1. Auditoria de Sistemas de Gestão (ISO 19011)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        6 Módulos completos com foco em ISO 9001, 14001, 45001 e técnicas em campo.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewPreset('maritime_compliance')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        newPreset === 'maritime_compliance'
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">2. Conformidade Marítima & Náutica (IMO / SOLAS)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        6 Módulos marítimos com foco no Código ISM, auditoria de embarcações e DPA.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* General Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Título Oficial do Novo Treinamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Formação de Auditor Líder em Segurança Operacional e Meio Ambiente"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Carga Horária (Horas)
                  </label>
                  <input
                    type="number"
                    value={newWorkload}
                    onChange={(e) => setNewWorkload(Number(e.target.value) || 40)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Subtítulo Técnico e Foco de Conformidade
                  </label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Ex: Requisitos Normativos, Diretrizes Técnicas e Metodologia de Avaliação em Campo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Normas de Referência / Marco Regulatório (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newNormsText}
                    onChange={(e) => setNewNormsText(e.target.value)}
                    placeholder="Ex: ABNT NBR ISO 19011:2026, ISO 14001, Regulamento ANP"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Público-Alvo Recomendado
                  </label>
                  <input
                    type="text"
                    value={newTargetAudience}
                    onChange={(e) => setNewTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Descrição Completa do Treinamento
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Criar e Abrir no Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
