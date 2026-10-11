import React, { useState } from 'react';
import { Course, Module, Lesson, EducationalVideo } from '../types';
import {
  createFormattedCourse,
  duplicateCourse,
  CreateCourseOptions,
  getDefaultCustomModules,
  CustomModuleSpec
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
  Eye,
  Sliders,
  Minus,
  UserCheck,
  ListOrdered,
  Settings2,
  CheckSquare,
  Square,
  RefreshCw,
  FileUp,
  CheckCircle2
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

  // Custom module structure state
  const [moduleMode, setModuleMode] = useState<'suggested' | 'custom'>('suggested');
  const [customModuleCount, setCustomModuleCount] = useState<number>(6);
  const [customModulesList, setCustomModulesList] = useState<Array<{ title: string; subtitle: string; badge: string }>>(() =>
    getDefaultCustomModules('standard_audit', 6).map(m => ({
      title: m.title,
      subtitle: m.subtitle,
      badge: m.badge || 'Formação Técnica'
    }))
  );
  const [includeFinalExam, setIncludeFinalExam] = useState<boolean>(true);

  // Thematic Profile Customization and Upload states
  const [thematicProfileName, setThematicProfileName] = useState<string>(
    '1. Auditoria de Sistemas de Gestão (ISO 19011)'
  );
  const [thematicProfileFocus, setThematicProfileFocus] = useState<string>(
    'Foco em ISO 9001, 14001, 45001, liderança de auditorias e técnicas em campo.'
  );
  const [thematicProfileText, setThematicProfileText] = useState<string>(
    `Módulo 1: Fundamentos Normativos, Marco Legal e Postura do Auditor Líder
Módulo 2: Interpretação Avançada de Requisitos e Controle de Riscos
Módulo 3: Planejamento de Auditoria, Plano de Amostragem e Cronograma
Módulo 4: Condução em Campo, Entrevistas e Triangulação de Evidências
Módulo 5: Constatação de Não-Conformidades, Relatório Final & Planos CAPA
Módulo 6: Reunião de Encerramento, Eficácia das Ações e Exame Final`
  );
  const [thematicUploadedFileName, setThematicUploadedFileName] = useState<string | null>(null);
  const [thematicReadingStatus, setThematicReadingStatus] = useState<string | null>(null);

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

  const handleSelectPreset = (preset: CreateCourseOptions['preset']) => {
    setNewPreset(preset);
    if (preset === 'standard_audit') {
      setThematicProfileName('1. Auditoria de Sistemas de Gestão (ISO 19011)');
      setThematicProfileFocus('Foco em ISO 9001, 14001, 45001, liderança de auditorias e técnicas em campo.');
      const defaults = getDefaultCustomModules('standard_audit', customModuleCount);
      setCustomModulesList(defaults.map(m => ({
        title: m.title,
        subtitle: m.subtitle,
        badge: m.badge || 'Formação Técnica'
      })));
      setThematicProfileText(defaults.map((m, i) => `Módulo ${i + 1}: ${m.title} - ${m.subtitle}`).join('\n'));
      setThematicReadingStatus(null);
    } else if (preset === 'maritime_compliance') {
      setThematicProfileName('2. Conformidade Marítima & Náutica (IMO / SOLAS)');
      setThematicProfileFocus('Foco no Código ISM, auditoria de embarcações, DPA e autoridade do Comandante.');
      const defaults = getDefaultCustomModules('maritime_compliance', customModuleCount);
      setCustomModulesList(defaults.map(m => ({
        title: m.title,
        subtitle: m.subtitle,
        badge: m.badge || 'Formação Marítima'
      })));
      setThematicProfileText(defaults.map((m, i) => `Módulo ${i + 1}: ${m.title} - ${m.subtitle}`).join('\n'));
      setThematicReadingStatus(null);
    } else {
      setThematicProfileName('3. Perfil Temático Personalizado');
      setThematicProfileFocus('Diretrizes técnicas e escopo temático customizado pelo Gestor.');
    }
  };

  const parseThematicTextAndApply = (content: string, sourceName?: string) => {
    if (!content || !content.trim()) {
      setThematicReadingStatus('O texto do perfil temático está vazio.');
      return;
    }

    const lines = content
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    let extractedName = '';
    const moduleCandidates: Array<{ title: string; subtitle: string; badge: string }> = [];
    const moduleRegex = /^(?:m[oó]dulo|unidade|cap[ií]tulo|parte|bloco|etapa|\d+[\.\)\-]|t[oó]pico)\s*(\d+)?[:\.\-\s]+(.+)$/i;
    const descLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!extractedName && !moduleRegex.test(line) && !line.startsWith('-') && !line.startsWith('*')) {
        extractedName = line.replace(/^[#*\s]+|[#*\s]+$/g, '');
        continue;
      }

      const match = line.match(moduleRegex);
      if (match) {
        const rawTitle = match[2].trim();
        const num = match[1] || `${moduleCandidates.length + 1}`;
        const parts = rawTitle.split(/\s*[-–—:]\s*/);
        const title = parts[0]?.trim() || rawTitle;
        const subtitle = parts.slice(1).join(' - ').trim() || 'Diretrizes técnicas e aplicação prática';
        moduleCandidates.push({
          title: title.toLowerCase().startsWith('módulo') ? title : `Módulo ${num}: ${title}`,
          subtitle: subtitle,
          badge: `Módulo ${num}`
        });
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const bullet = line.replace(/^[-*]\s*/, '').trim();
        if (bullet.length > 4) {
          const parts = bullet.split(/\s*[-–—:]\s*/);
          const num = `${moduleCandidates.length + 1}`;
          moduleCandidates.push({
            title: `Módulo ${num}: ${parts[0]}`,
            subtitle: parts.slice(1).join(' - ').trim() || 'Diretrizes técnicas e critérios de conformidade',
            badge: `Módulo ${num}`
          });
        }
      } else {
        if (descLines.length < 3) descLines.push(line);
      }
    }

    const finalName = extractedName || (sourceName ? sourceName.replace(/\.[^/.]+$/, '') : thematicProfileName);
    const finalFocus = descLines.join(' ').slice(0, 160) || thematicProfileFocus;

    setThematicProfileName(finalName);
    setThematicProfileFocus(finalFocus);
    setThematicProfileText(content);
    setNewPreset('custom_modules');

    if (!newTitle.trim()) {
      setNewTitle(finalName);
    }
    if (!newSubtitle.trim() && finalFocus) {
      setNewSubtitle(finalFocus);
    }

    if (moduleCandidates.length > 0) {
      setModuleMode('custom');
      setCustomModuleCount(moduleCandidates.length);
      setCustomModulesList(moduleCandidates);
      setThematicReadingStatus(
        `✓ Perfil temático lido com sucesso! ${moduleCandidates.length} módulos identificados e estruturados na grade.`
      );
    } else {
      setThematicReadingStatus(
        `✓ Texto do perfil temático processado com sucesso! (${lines.length} linhas lidas).`
      );
    }
  };

  const handleThematicFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThematicUploadedFileName(file.name);
    setThematicReadingStatus(`Lendo arquivo "${file.name}"...`);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content || !content.trim()) {
          setThematicReadingStatus('O arquivo enviado está vazio.');
          return;
        }

        // Try JSON parsing
        if (file.name.endsWith('.json')) {
          try {
            const parsed = JSON.parse(content);
            const name = parsed.title || parsed.profileName || parsed.thematicProfile || file.name.replace(/\.[^/.]+$/, '');
            const focus = parsed.focus || parsed.subtitle || parsed.description || 'Perfil temático importado via arquivo';
            setThematicProfileName(name);
            setThematicProfileFocus(focus);
            if (!newTitle.trim()) setNewTitle(name);
            if (!newSubtitle.trim() && parsed.subtitle) setNewSubtitle(parsed.subtitle);
            if (parsed.workloadHours) setNewWorkload(Number(parsed.workloadHours));

            if (parsed.modules && Array.isArray(parsed.modules)) {
              const modulesList = parsed.modules.map((m: any, idx: number) => ({
                title: m.title || `Módulo ${idx + 1}`,
                subtitle: m.subtitle || 'Diretrizes técnicas e critérios de conformidade',
                badge: m.badge || `Módulo ${idx + 1}`
              }));
              setModuleMode('custom');
              setCustomModuleCount(modulesList.length);
              setCustomModulesList(modulesList);
              setThematicProfileText(modulesList.map((m: any, i: number) => `Módulo ${i + 1}: ${m.title} - ${m.subtitle}`).join('\n'));
            }
            setNewPreset('custom_modules');
            setThematicReadingStatus(`✓ Arquivo JSON lido com sucesso! Perfil "${name}" carregado.`);
            return;
          } catch (jsonErr) {
            // Not JSON, fallback to text parsing
          }
        }

        // Text / Markdown / CSV parsing
        parseThematicTextAndApply(content, file.name);
      } catch (err) {
        console.error(err);
        setThematicReadingStatus('Erro ao ler arquivo. Formatos recomendados: .txt, .json, .csv, .md');
      }
    };

    reader.onerror = () => {
      setThematicReadingStatus('Falha técnica ao acessar o arquivo.');
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSetModuleCount = (newCount: number) => {
    const count = Math.max(1, Math.min(15, newCount));
    setCustomModuleCount(count);
    const defaults = getDefaultCustomModules(newPreset, count);
    setCustomModulesList(prev => {
      const next: Array<{ title: string; subtitle: string; badge: string }> = [];
      for (let i = 0; i < count; i++) {
        if (prev[i]) {
          next.push(prev[i]);
        } else {
          const d = defaults[i] || {
            title: `Módulo ${i + 1}: Tópico Especializado de Auditoria`,
            subtitle: 'Diretrizes técnicas, aplicação prática e critérios de conformidade',
            badge: i === count - 1 ? 'Avaliação & Homologação' : `Módulo ${i + 1}`
          };
          next.push({
            title: d.title,
            subtitle: d.subtitle,
            badge: d.badge || `Módulo ${i + 1}`
          });
        }
      }
      return next;
    });
  };

  const handleUpdateCustomModuleItem = (index: number, field: 'title' | 'subtitle', value: string) => {
    setCustomModulesList(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const handleAddCustomModuleItem = () => {
    setCustomModulesList(prev => {
      const nextIdx = prev.length + 1;
      return [
        ...prev,
        {
          title: `Módulo ${nextIdx}: Novo Tópico Especializado`,
          subtitle: 'Diretrizes técnicas, aplicação prática e critérios de conformidade',
          badge: `Módulo ${nextIdx}`
        }
      ];
    });
    setCustomModuleCount(prev => prev + 1);
  };

  const handleRemoveCustomModuleItem = (index: number) => {
    if (customModulesList.length <= 1) return;
    setCustomModulesList(prev => prev.filter((_, idx) => idx !== index));
    setCustomModuleCount(prev => Math.max(1, prev - 1));
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
      if (newInstructorRole.trim()) cloned.instructorRole = newInstructorRole.trim();
      if (newInstructorCredential.trim()) cloned.instructorCredential = newInstructorCredential.trim();
      if (newTargetAudience.trim()) cloned.targetAudience = newTargetAudience.trim();
      if (newDescription.trim()) cloned.description = newDescription.trim();

      // If user specified custom module count for clone
      if (moduleMode === 'custom' && customModuleCount > 0 && customModuleCount < cloned.modules.length) {
        cloned.modules = cloned.modules.slice(0, customModuleCount);
      }

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
      preset: newPreset,
      moduleMode: moduleMode,
      customModuleCount: customModuleCount,
      customModulesList: moduleMode === 'custom' ? customModulesList : undefined,
      includeFinalExam: includeFinalExam
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
    setModuleMode('suggested');
    setCustomModuleCount(6);
    setCustomModulesList(
      getDefaultCustomModules('standard_audit', 6).map(m => ({
        title: m.title,
        subtitle: m.subtitle,
        badge: m.badge || 'Formação Técnica'
      }))
    );
    setThematicProfileName('1. Auditoria de Sistemas de Gestão (ISO 19011)');
    setThematicProfileFocus('Foco em ISO 9001, 14001, 45001, liderança de auditorias e técnicas em campo.');
    setThematicProfileText(
      getDefaultCustomModules('standard_audit', 6)
        .map((m, i) => `Módulo ${i + 1}: ${m.title} - ${m.subtitle}`)
        .join('\n')
    );
    setThematicUploadedFileName(null);
    setThematicReadingStatus(null);
    setIncludeFinalExam(true);
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
            <form onSubmit={handleCreateNewCourseSubmit} className="space-y-6 py-5 overflow-y-auto flex-1 pr-1">
              {/* Method Selection: Preset vs. Clone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  1. Como deseja estruturar a base inicial do novo treinamento?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setCreationMethod('preset')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      creationMethod === 'preset'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Grade Padronizada Oficial</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Gera formação no padrão oficial da plataforma com aulas, checklists, estudos de caso e exame.
                    </p>
                  </div>

                  <div
                    onClick={() => setCreationMethod('clone')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      creationMethod === 'clone'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500/40'
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

              {/* If Preset: Thematic Profile Section (Editable + File Upload + Text Reading) */}
              {creationMethod === 'preset' && (
                <div className="space-y-3.5 p-4 bg-slate-950/95 rounded-2xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Perfil Temático da Grade (Editável & com Upload):
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Selecione um modelo sugerido, faça upload de arquivo com a ementa ou edite o perfil temático escrito.
                      </p>
                    </div>

                    {/* Botão de Upload de Arquivo do Perfil Temático */}
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-amber-400/10 hover:from-amber-500/30 hover:to-amber-400/20 text-amber-300 border border-amber-500/50 hover:border-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-500/10">
                        <FileUp className="w-4 h-4 text-amber-400" />
                        <span>Upload de Arquivo do Perfil</span>
                        <input
                          type="file"
                          accept=".txt,.json,.csv,.md,.docx,.pdf,.doc"
                          onChange={handleThematicFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Status da Leitura / Arquivo Uploaded */}
                  {thematicReadingStatus && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{thematicReadingStatus}</span>
                      </div>
                      {thematicUploadedFileName && (
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 rounded text-[10px] font-mono-code shrink-0">
                          {thematicUploadedFileName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Seleção dos Modelos Sugeridos ou Personalizado */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSelectPreset('standard_audit')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        newPreset === 'standard_audit'
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500/40 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">1. Auditoria de Sistemas (ISO 19011)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        Foco em ISO 9001, 14001, 45001, liderança de auditorias e técnicas em campo.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset('maritime_compliance')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        newPreset === 'maritime_compliance'
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500/40 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">2. Conformidade Marítima (IMO / SOLAS)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        Foco no Código ISM, auditoria de embarcações, DPA e autoridade do Comandante.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectPreset('custom_modules')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        newPreset === 'custom_modules'
                          ? 'bg-amber-500/15 border-amber-500 text-white font-bold ring-1 ring-amber-500/40 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">3. Perfil Customizado / Upload</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        Perfil temático e ementa customizados diretamente ou importados de arquivo.
                      </span>
                    </button>
                  </div>

                  {/* Campos Editáveis do Perfil Temático */}
                  <div className="space-y-3 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-300">
                          Nome do Perfil Temático (Editável):
                        </label>
                        <input
                          type="text"
                          value={thematicProfileName}
                          onChange={(e) => {
                            setThematicProfileName(e.target.value);
                            setNewPreset('custom_modules');
                          }}
                          placeholder="Ex: Auditoria de Segurança de Processos e Meio Ambiente"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-300">
                          Foco Temático & Diretrizes de Conformidade (Editável):
                        </label>
                        <input
                          type="text"
                          value={thematicProfileFocus}
                          onChange={(e) => {
                            setThematicProfileFocus(e.target.value);
                            setNewPreset('custom_modules');
                          }}
                          placeholder="Ex: Requisitos mandatórios, critérios de campo e mitigação de riscos"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Textarea de Leitura / Edição do Perfil Escrito */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          Conteúdo do Perfil Temático / Ementa Escrita:
                        </label>
                        <button
                          type="button"
                          onClick={() => parseThematicTextAndApply(thematicProfileText)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-lg text-[10px] font-bold transition-all"
                        >
                          <RefreshCw className="w-3 h-3 text-cyan-400" />
                          Fazer Leitura do Perfil Escrito e Atualizar Módulos
                        </button>
                      </div>

                      <textarea
                        value={thematicProfileText}
                        onChange={(e) => {
                          setThematicProfileText(e.target.value);
                          setNewPreset('custom_modules');
                        }}
                        rows={3}
                        placeholder="Escreva ou cole a ementa do perfil temático aqui. O sistema faz a leitura e extrai os módulos automaticamente..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono-code focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[10px] text-slate-400">
                        Você pode digitar/colar o texto da ementa acima ou usar o botão <strong>Upload de Arquivo</strong> para preenchimento e leitura automática.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== SEÇÃO: DEFINIR QUANTOS MÓDULOS OU MANTER O SUGERIDO ==================== */}
              <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      2. Quantidade & Estrutura de Módulos:
                    </label>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium">
                    Escolha se deseja manter os módulos sugeridos ou definir a quantidade
                  </span>
                </div>

                {/* Mode Selector: Suggested vs. Custom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div
                    onClick={() => setModuleMode('suggested')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      moduleMode === 'suggested'
                        ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/50 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Manter o Sugerido (6 Módulos)
                      </span>
                      {moduleMode === 'suggested' && (
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Gera a grade oficial recomendada com 6 módulos completos (fundamentos, interpretação, planejamento, campo, não-conformidades e exame final).
                    </p>
                  </div>

                  <div
                    onClick={() => setModuleMode('custom')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      moduleMode === 'custom'
                        ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/50 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                        Definir Quantidade de Módulos
                      </span>
                      {moduleMode === 'custom' && (
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Defina livremente quantos módulos o treinamento terá (1 a 15) e personalize os títulos de cada módulo antes de criar.
                    </p>
                  </div>
                </div>

                {/* Sub-panel when Custom Mode is selected */}
                {moduleMode === 'custom' && (
                  <div className="space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                    {/* Stepper and quick buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Quantos módulos deseja criar?
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Ajuste no contador ou clique em um atalho rápido
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Stepper */}
                        <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => handleSetModuleCount(customModuleCount - 1)}
                            disabled={customModuleCount <= 1}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-all"
                            title="Diminuir quantidade de módulos"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-extrabold text-amber-400 font-mono-code min-w-[5rem] text-center">
                            {customModuleCount} {customModuleCount === 1 ? 'Módulo' : 'Módulos'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSetModuleCount(customModuleCount + 1)}
                            disabled={customModuleCount >= 15}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-all"
                            title="Aumentar quantidade de módulos"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Count Pills */}
                        <div className="hidden sm:flex items-center gap-1">
                          {[2, 3, 4, 5, 6, 8, 10].map(cnt => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => handleSetModuleCount(cnt)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                customModuleCount === cnt
                                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                              }`}
                            >
                              {cnt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Final Exam Checkbox */}
                    <div
                      onClick={() => setIncludeFinalExam(!includeFinalExam)}
                      className="flex items-center gap-2.5 p-3 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={includeFinalExam}
                        onChange={(e) => setIncludeFinalExam(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Incluir Exame Final no último módulo (Avaliação e Homologação de Auditor)
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Gera automaticamente o teste avaliativo com nota de corte de 70% necessária para a emissão do certificado.
                        </span>
                      </div>
                    </div>

                    {/* Interactive List of Modules */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
                          Edição dos {customModulesList.length} Módulos a serem criados:
                        </span>
                        <button
                          type="button"
                          onClick={handleAddCustomModuleItem}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          Adicionar Mais um Módulo
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {customModulesList.map((mod, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-2.5 group hover:border-slate-700 transition-all"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-1">
                              {idx + 1}
                            </div>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => handleUpdateCustomModuleItem(idx, 'title', e.target.value)}
                                placeholder={`Título do Módulo ${idx + 1}`}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                              />
                              <input
                                type="text"
                                value={mod.subtitle}
                                onChange={(e) => handleUpdateCustomModuleItem(idx, 'subtitle', e.target.value)}
                                placeholder="Subtítulo ou foco técnico prático"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            {customModulesList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomModuleItem(idx)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all shrink-0 mt-1"
                                title="Remover este módulo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================== SEÇÃO: DADOS GERAIS DO TREINAMENTO ==================== */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  3. Informações Gerais do Treinamento:
                </label>

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
                      placeholder="Ex: Formação de Auditor Líder em Sistemas Integrados de Gestão"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Carga Horária (Horas-aula)
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
                      Marco Regulatório / Normas de Referência (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={newNormsText}
                      onChange={(e) => setNewNormsText(e.target.value)}
                      placeholder="Ex: ABNT NBR ISO 19011:2026, ISO 9001 / ISO 14001, Diretrizes Internacionais"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-code"
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
                      Descrição Geral e Escopo Pedagógico
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== SEÇÃO: PERFIL DO INSTRUTOR & CREDENCIAIS ==================== */}
              <div className="space-y-3 p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    4. Perfil do Instrutor & Credenciais Oficiais:
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Estes dados são exibidos na apresentação do curso e constarão no <strong>Certificado Oficial emitido ao aluno</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Nome do Instrutor / Responsável:
                    </label>
                    <input
                      type="text"
                      value={newInstructor}
                      onChange={(e) => setNewInstructor(e.target.value)}
                      placeholder="Ex: Lead Auditor EXPLORER SOLUTIONS"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Cargo / Especialidade Técnica:
                    </label>
                    <input
                      type="text"
                      value={newInstructorRole}
                      onChange={(e) => setNewInstructorRole(e.target.value)}
                      placeholder="Ex: Coordenador Pedagógico & Auditor Líder"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Credencial / Registro Profissional:
                    </label>
                    <input
                      type="text"
                      value={newInstructorCredential}
                      onChange={(e) => setNewInstructorCredential(e.target.value)}
                      placeholder="Ex: IRCA Lead Auditor / CREA"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono-code">
                  Total de Módulos a Criar:{' '}
                  <strong className="text-amber-400">
                    {moduleMode === 'suggested'
                      ? (creationMethod === 'clone' ? (courses.find(c => c.id === cloneSourceId)?.modules.length || 6) : 6)
                      : customModulesList.length}
                  </strong>
                </span>

                <div className="flex items-center gap-3">
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
                    Criar Treinamento Formatado ({moduleMode === 'suggested' ? (creationMethod === 'clone' ? (courses.find(c => c.id === cloneSourceId)?.modules.length || 6) : 6) : customModulesList.length} Módulos)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
