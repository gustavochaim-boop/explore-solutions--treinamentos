export interface StudentUser {
  id: string;
  name: string;
  email: string;
  document: string; // CPF or CIR Marítima
  username: string;
  password: string;
  isActive: boolean;
  enrolledCourseIds: string[]; // IDs of courses permitted by the manager
  createdAt: string;
  notes?: string;
}

export type ChapterSGSO = 'Capítulo 1' | 'Capítulo 2' | 'Capítulo 3' | 'Capítulo 4' | 'Geral / ISO 19011';

export interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube, Vimeo, direct MP4 or blob/base64 URL
  sourceType?: 'web_url' | 'uploaded_file';
  fileName?: string;
  fileSizeMb?: number;
  durationMinutes?: number;
  tags?: string[];
  addedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  technicalDetails: string[];
  practicalChecklist: string[];
  realCaseStudy?: {
    title: string;
    scenario: string;
    keyFindings: string[];
    correctiveActions: string[];
  };
  specialType?: 'NORMAL' | 'LAB_3D' | 'EXAM' | 'NETWORKING';
  isCompleted?: boolean;
  educationalVideos?: EducationalVideo[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  lessons: Lesson[];
  isLocked?: boolean;
  educationalVideos?: EducationalVideo[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  workloadHours: number;
  targetAudience: string;
  instructorName: string;
  instructorRole: string;
  instructorCredential: string;
  regulatoryFramework: string[];
  description: string;
  modules: Module[];
  thematicProfile?: {
    title: string;
    focus: string;
    sourceFileName?: string;
  };
}

export interface NonConformityItem {
  id: string;
  title: string;
  location: 'deck' | 'process' | 'ccr' | 'living';
  locationName: string;
  sgsoChapter: ChapterSGSO;
  severity: 'Crítica' | 'Grave' | 'Moderada' | 'Leve';
  description: string;
  visualClue: string;
  evidenceFound: string;
  regulatoryBasis: string;
  rootCause: string;
  recommendedAction: string;
  isFound: boolean;
  userClassification?: {
    chapter: ChapterSGSO;
    severity: string;
    actionNote: string;
  };
}

export interface InterviewAvatar {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarColor: string;
  bio: string;
  questions: {
    id: string;
    question: string;
    response: string;
    auditClue: string;
    revealsNCId?: string;
    isAsked: boolean;
  }[];
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  chapter: string;
}

export interface CertificateSigner {
  id: string;
  name: string;
  role: string;
  credential: string;
  signatureType: 'handwritten_font' | 'uploaded_image' | 'preset';
  signatureImageUrl?: string;
  fontStyle?: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  institutionName: string;
  institutionSubtitle: string;
  institutionLogoUrl?: string;
  sealLogoUrl?: string;
  headerTitle: string;
  headerSubtitle: string;
  bodyTemplate: string;
  courseTitle: string;
  workloadHours: number;
  borderStyle: 'guilloche_gold' | 'maritime_navy' | 'modern_tech' | 'minimalist_luxury';
  primaryColor: string;
  accentColor: string;
  backgroundPattern: 'subtle_waves' | 'guilloche_grid' | 'clean' | 'maritime_compass';
  showBacksideProgram: boolean;
  signers: CertificateSigner[];
  qrCodeEnabled: boolean;
  watermarkEnabled: boolean;
  validationUrlPrefix: string;
}

export interface IssuedCertificate {
  id: string;
  verificationCode: string;
  studentName: string;
  studentDocument: string;
  studentEmail?: string;
  courseName: string;
  workloadHours: number;
  completionDate: string;
  issueDate: string;
  scorePercentage: number;
  qrCodeUrl?: string;
  templateSnapshot: CertificateTemplate;
}
