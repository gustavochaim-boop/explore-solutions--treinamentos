import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CourseViewer } from './components/CourseViewer';
import { Offshore3DLab } from './components/Offshore3DLab';
import { CertificateStudio } from './components/CertificateStudio';
import { CertificateVerification } from './components/CertificateVerification';
import { CourseEditor } from './components/CourseEditor';
import { ExamModal } from './components/ExamModal';
import { ManagerLoginModal } from './components/ManagerLoginModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { StudentManagerModal } from './components/StudentManagerModal';
import { duplicateCourse } from './utils/courseFormatting';
import {
  DEFAULT_COURSE,
  DEFAULT_ISM_COURSE,
  INITIAL_NON_CONFORMITIES,
  INITIAL_INTERVIEW_AVATARS,
  DEFAULT_CERTIFICATE_TEMPLATE,
  DEFAULT_ISM_CERTIFICATE_TEMPLATE,
  DEFAULT_STUDENTS
} from './data/defaultCourseData';
import {
  Course,
  NonConformityItem,
  InterviewAvatar,
  CertificateTemplate,
  IssuedCertificate,
  EducationalVideo,
  StudentUser
} from './types';
import { ShieldCheck, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('course');

  // Manager State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('sgi_admin_logged') === 'true';
  });
  const [isManagerLoginOpen, setIsManagerLoginOpen] = useState<boolean>(false);
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState<boolean>(false);

  // Student State
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => {
    const saved = localStorage.getItem('sgi_current_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to sample student logged in for immediate pleasant experience
    return DEFAULT_STUDENTS[0];
  });

  // Students list state (managed by Gestor)
  const [students, setStudents] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem('sgi_all_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_STUDENTS;
  });

  // Multiple Courses state
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sgi_all_courses_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [DEFAULT_COURSE, DEFAULT_ISM_COURSE];
  });

  // Active Course ID
  const [activeCourseId, setActiveCourseId] = useState<string>(() => {
    const saved = localStorage.getItem('sgi_active_course_id');
    if (saved) {
      return saved;
    }
    return DEFAULT_COURSE.id;
  });

  const currentCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const [isExamOpen, setIsExamOpen] = useState<boolean>(false);
  const [studentScore, setStudentScore] = useState<number>(95);

  // Persistent Non-conformities state
  const [nonConformities, setNonConformities] = useState<NonConformityItem[]>(() => {
    const saved = localStorage.getItem('sgi_ncs_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NON_CONFORMITIES;
  });

  // Persistent Avatars state
  const [avatars, setAvatars] = useState<InterviewAvatar[]>(() => {
    const saved = localStorage.getItem('sgi_avatars_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_INTERVIEW_AVATARS;
  });

  // Persistent Certificate Template state
  const [certificateTemplate, setCertificateTemplate] = useState<CertificateTemplate>(() => {
    const saved = localStorage.getItem('sgi_cert_template');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CERTIFICATE_TEMPLATE;
  });

  // Automatically adapt certificate template when active course switches
  useEffect(() => {
    if (activeCourseId === 'ism-code-internal-auditor') {
      setCertificateTemplate(DEFAULT_ISM_CERTIFICATE_TEMPLATE);
    } else if (activeCourseId === 'sgso-sgi-auditor-master') {
      setCertificateTemplate(DEFAULT_CERTIFICATE_TEMPLATE);
    } else {
      const activeObj = courses.find(c => c.id === activeCourseId);
      if (activeObj) {
        setCertificateTemplate({
          ...DEFAULT_CERTIFICATE_TEMPLATE,
          id: `template-${activeObj.id}`,
          name: `Certificado Oficial - ${activeObj.title}`,
          courseTitle: activeObj.title,
          workloadHours: activeObj.workloadHours,
          headerSubtitle: activeObj.title.toUpperCase(),
          institutionName: 'EXPLORER SOLUTIONS',
          institutionSubtitle: 'Centro Integrado de Capacitação, Auditoria & Segurança Operacional'
        });
      }
    }
  }, [activeCourseId, courses]);

  // Persistent Completed Lessons
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sgi_completed_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Pre-mark first two lessons
    return ['les-1-1', 'les-1-2', 'ism-les-1-1'];
  });

  // Persistent Issued Certificates list
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>(() => {
    const saved = localStorage.getItem('sgi_issued_certs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'cert-sample-1',
        verificationCode: 'SGI-SGSO-2026-X9K2',
        studentName: 'Eng. Leonardo Vasconcelos Ribeiro',
        studentDocument: '084.721.905-32 (CIR: 201889-4)',
        courseName: 'Formação de Auditor Líder de SGI & SGSO Offshore (ANP / ISO 19011:2026)',
        workloadHours: 40,
        completionDate: '10/10/2026',
        issueDate: '10/10/2026',
        scorePercentage: 98,
        templateSnapshot: DEFAULT_CERTIFICATE_TEMPLATE
      },
      {
        id: 'cert-sample-2',
        verificationCode: 'ISM-IMO-2026-W4M8',
        studentName: '1º Oficial de Náutica Marina Costa e Silva',
        studentDocument: '119.843.201-90 (CIR: 310928-1)',
        courseName: 'Formação de Auditor Interno do Código ISM (International Safety Management - IMO/SOLAS)',
        workloadHours: 40,
        completionDate: '08/10/2026',
        issueDate: '08/10/2026',
        scorePercentage: 95,
        templateSnapshot: DEFAULT_ISM_CERTIFICATE_TEMPLATE
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sgi_all_courses_list', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sgi_active_course_id', activeCourseId);
  }, [activeCourseId]);

  useEffect(() => {
    localStorage.setItem('sgi_all_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('sgi_current_student', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('sgi_current_student');
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('sgi_admin_logged', isAdminMode ? 'true' : 'false');
  }, [isAdminMode]);

  useEffect(() => {
    localStorage.setItem('sgi_ncs_data', JSON.stringify(nonConformities));
  }, [nonConformities]);

  useEffect(() => {
    localStorage.setItem('sgi_avatars_data', JSON.stringify(avatars));
  }, [avatars]);

  useEffect(() => {
    localStorage.setItem('sgi_cert_template', JSON.stringify(certificateTemplate));
  }, [certificateTemplate]);

  useEffect(() => {
    localStorage.setItem('sgi_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem('sgi_issued_certs', JSON.stringify(issuedCertificates));
  }, [issuedCertificates]);

  // Handlers
  const handleToggleLessonCompletion = (lessonId: string) => {
    setCompletedLessonIds(prev =>
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleUpdateNC = (updated: NonConformityItem) => {
    setNonConformities(prev => prev.map(nc => (nc.id === updated.id ? updated : nc)));
  };

  const handleUpdateAvatar = (updated: InterviewAvatar) => {
    setAvatars(prev => prev.map(av => (av.id === updated.id ? updated : av)));
  };

  const handleSaveIssuedCert = (newCert: IssuedCertificate) => {
    setIssuedCertificates(prev => [newCert, ...prev.filter(c => c.verificationCode !== newCert.verificationCode)]);
  };

  const handlePassExam = (score: number) => {
    setStudentScore(score);
    // Mark final exam lesson as complete
    const examLessonId = activeCourseId === 'ism-code-internal-auditor' ? 'ism-les-8-1' : 'les-7-1';
    if (!completedLessonIds.includes(examLessonId)) {
      setCompletedLessonIds(prev => [...prev, examLessonId]);
    }
    if (isAdminMode) {
      setActiveTab('certificate');
    } else {
      setActiveTab('verify');
    }
  };

  const handleResetCourse = () => {
    setCourses([DEFAULT_COURSE, DEFAULT_ISM_COURSE]);
    setNonConformities(INITIAL_NON_CONFORMITIES);
    setAvatars(INITIAL_INTERVIEW_AVATARS);
    setCertificateTemplate(DEFAULT_CERTIFICATE_TEMPLATE);
  };

  const handleUpdateCourse = (updated: Course) => {
    setCourses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const handleCreateCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setActiveCourseId(newCourse.id);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (courses.length <= 1) {
      alert('A plataforma precisa ter pelo menos um treinamento ativo.');
      return;
    }
    const filtered = courses.filter(c => c.id !== courseId);
    setCourses(filtered);
    if (activeCourseId === courseId) {
      setActiveCourseId(filtered[0]?.id || DEFAULT_COURSE.id);
    }
  };

  const handleDuplicateCourse = (courseId: string) => {
    const target = courses.find(c => c.id === courseId);
    if (!target) return;
    const duplicated = duplicateCourse(target);
    setCourses(prev => [...prev, duplicated]);
    setActiveCourseId(duplicated.id);
  };

  // Video Management (Exclusivo Gestor)
  const handleAddModuleVideo = (moduleId: string, newVideo: EducationalVideo) => {
    setCourses(prevCourses =>
      prevCourses.map(c => {
        if (c.id === activeCourseId) {
          const updatedModules = c.modules.map(mod => {
            if (mod.id === moduleId) {
              return {
                ...mod,
                educationalVideos: [...(mod.educationalVideos || []), newVideo]
              };
            }
            return mod;
          });
          return { ...c, modules: updatedModules };
        }
        return c;
      })
    );
  };

  const handleDeleteModuleVideo = (moduleId: string, videoId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(c => {
        if (c.id === activeCourseId) {
          const updatedModules = c.modules.map(mod => {
            if (mod.id === moduleId) {
              return {
                ...mod,
                educationalVideos: (mod.educationalVideos || []).filter(v => v.id !== videoId)
              };
            }
            return mod;
          });
          return { ...c, modules: updatedModules };
        }
        return c;
      })
    );
  };

  // Student Management Handlers
  const handleSaveStudent = (savedStudent: StudentUser) => {
    setStudents(prev => {
      const exists = prev.some(s => s.id === savedStudent.id);
      if (exists) {
        return prev.map(s => (s.id === savedStudent.id ? savedStudent : s));
      }
      return [savedStudent, ...prev];
    });

    // If current logged student was modified, update their session
    if (currentStudent && currentStudent.id === savedStudent.id) {
      setCurrentStudent(savedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (currentStudent && currentStudent.id === studentId) {
      setCurrentStudent(null);
    }
  };

  const handleToggleCoursePermission = (studentId: string, courseId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const isEnrolled = s.enrolledCourseIds.includes(courseId);
          const newCourseIds = isEnrolled
            ? s.enrolledCourseIds.filter(id => id !== courseId)
            : [...s.enrolledCourseIds, courseId];
          const updated = { ...s, enrolledCourseIds: newCourseIds };
          if (currentStudent && currentStudent.id === studentId) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Auth Mode Switching
  const handleSuccessManagerLogin = () => {
    setIsAdminMode(true);
    setIsManagerLoginOpen(false);
  };

  const handleLogoutManager = () => {
    setIsAdminMode(false);
    if (activeTab === 'editor') {
      setActiveTab('course');
    }
  };

  const handleSuccessStudentLogin = (student: StudentUser) => {
    setCurrentStudent(student);
    setIsAdminMode(false);
    setIsStudentLoginOpen(false);
    // If student has access to active course, stay, else switch to first allowed course
    if (!student.enrolledCourseIds.includes(activeCourseId) && student.enrolledCourseIds.length > 0) {
      setActiveCourseId(student.enrolledCourseIds[0]);
    }
    setActiveTab('course');
  };

  const handleLogoutStudent = () => {
    setCurrentStudent(null);
  };

  // Total lessons count for current course
  const totalLessons = currentCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isAdminMode={isAdminMode}
        onRequestLogin={() => setIsManagerLoginOpen(true)}
        onLogoutAdmin={handleLogoutManager}
        completedCount={completedLessonIds.length}
        totalLessons={totalLessons}
        courses={courses}
        activeCourseId={activeCourseId}
        onSelectCourse={setActiveCourseId}
        currentStudent={currentStudent}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onLogoutStudent={handleLogoutStudent}
        onOpenStudentManager={() => setIsStudentManagerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'course' && (
          <CourseViewer
            course={currentCourse}
            completedLessonIds={completedLessonIds}
            onToggleLessonCompletion={handleToggleLessonCompletion}
            onOpen3DLab={() => setActiveTab('lab3d')}
            onOpenExam={() => setIsExamOpen(true)}
            onOpenCertificateStudio={() => setActiveTab('certificate')}
            isAdminMode={isAdminMode}
            onAddModuleVideo={handleAddModuleVideo}
            onDeleteModuleVideo={handleDeleteModuleVideo}
            onRequestManagerLogin={() => setIsManagerLoginOpen(true)}
            courses={courses}
            onSelectCourse={setActiveCourseId}
            currentStudent={currentStudent}
            onOpenStudentManager={() => setIsStudentManagerOpen(true)}
          />
        )}

        {activeTab === 'lab3d' && (
          <Offshore3DLab
            nonConformities={nonConformities}
            onUpdateNonConformity={handleUpdateNC}
            avatars={avatars}
            onUpdateAvatar={handleUpdateAvatar}
            onNavigateToModule={() => setActiveTab('course')}
          />
        )}

        {activeTab === 'certificate' && (
          isAdminMode ? (
            <CertificateStudio
              course={currentCourse}
              template={certificateTemplate}
              onUpdateTemplate={setCertificateTemplate}
              issuedCertificates={issuedCertificates}
              onSaveIssuedCertificate={handleSaveIssuedCert}
              studentScore={studentScore}
              isAdminMode={isAdminMode}
              onRequestManagerLogin={() => setIsManagerLoginOpen(true)}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 my-8 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
                  Acesso Restrito ao Gestor
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Painel de Edição & Emissão de Certificados
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  O painel de certificados para edição e emissão é permitido exclusivamente para o <strong>Gestor</strong>. Alunos não possuem autorização para emissão direta.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Os alunos recebem seus certificados emitidos pela coordenação da <strong>EXPLORER SOLUTIONS</strong> após conclusão e aprovação na avaliação.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsManagerLoginOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Entrar como Gestor
                </button>

                <button
                  onClick={() => setActiveTab('verify')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
                >
                  Consultar Autenticidade no Validador
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'verify' && (
          <CertificateVerification issuedCertificates={issuedCertificates} />
        )}

        {activeTab === 'editor' && (
          isAdminMode ? (
            <CourseEditor
              courses={courses}
              activeCourseId={activeCourseId}
              onSelectCourse={setActiveCourseId}
              onUpdateCourse={handleUpdateCourse}
              onCreateCourse={handleCreateCourse}
              onDeleteCourse={handleDeleteCourse}
              onDuplicateCourse={handleDuplicateCourse}
              onResetToDefault={handleResetCourse}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mx-auto">
                🔒
              </div>
              <h2 className="text-xl font-bold text-white">Acesso Restrito ao Gestor</h2>
              <p className="text-xs text-slate-400">
                A gestão e edição dos módulos é restrita à administração pedagógica. Faça login com suas credenciais de gestor para continuar.
              </p>
              <button
                onClick={() => setIsManagerLoginOpen(true)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Entrar com Login e Senha do Gestor
              </button>
            </div>
          )
        )}
      </main>

      {/* Competency Exam Modal */}
      <ExamModal
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
        onPassExam={handlePassExam}
      />

      {/* Manager Login Modal */}
      <ManagerLoginModal
        isOpen={isManagerLoginOpen}
        onClose={() => setIsManagerLoginOpen(false)}
        onSuccessLogin={handleSuccessManagerLogin}
      />

      {/* Student Individual Login Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        students={students}
        onSuccessStudentLogin={handleSuccessStudentLogin}
        onRequestManagerLogin={() => {
          setIsStudentLoginOpen(false);
          setIsManagerLoginOpen(true);
        }}
      />

      {/* Manager Student Management & Permission Granting Modal */}
      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        onClose={() => setIsStudentManagerOpen(false)}
        students={students}
        courses={courses}
        onSaveStudent={handleSaveStudent}
        onDeleteStudent={handleDeleteStudent}
        onToggleCoursePermission={handleToggleCoursePermission}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-slate-200 font-bold text-sm tracking-wider">EXPLORER SOLUTIONS</span>
              <span>— {isAdminMode ? 'Painel de Gestão e Certificação' : 'Portal de Capacitação do Aluno'}</span>
            </div>

            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-300">EXPLORER SOLUTIONS</span> • Plataforma de Treinamento
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-900">
            Regulamento Técnico SGSO ANP • Código ISM Resoluções IMO A.741(18) / SOLAS Capítulo IX • ABNT NBR ISO 19011:2026 • EXPLORER SOLUTIONS
          </div>
        </div>
      </footer>
    </div>
  );
}
