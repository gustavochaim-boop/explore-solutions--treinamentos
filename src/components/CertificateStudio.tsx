import React, { useState, useRef } from 'react';
import { CertificateTemplate, IssuedCertificate, Course } from '../types';
import { INSTITUTION_LOGO_PRESETS, SEAL_PRESETS } from '../utils/logoPresets';
import { downloadCertificateAsPng, generateVerificationCode } from '../utils/certificateCanvas';
import confetti from 'canvas-confetti';
import {
  Printer,
  Download,
  Upload,
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Users,
  Palette,
  FileText,
  RotateCcw,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  Award,
  Lock
} from 'lucide-react';

interface CertificateStudioProps {
  course: Course;
  template: CertificateTemplate;
  onUpdateTemplate: (template: CertificateTemplate) => void;
  issuedCertificates: IssuedCertificate[];
  onSaveIssuedCertificate: (cert: IssuedCertificate) => void;
  studentScore?: number;
  isAdminMode?: boolean;
  onRequestManagerLogin?: () => void;
}

export const CertificateStudio: React.FC<CertificateStudioProps> = ({
  course,
  template,
  onUpdateTemplate,
  issuedCertificates,
  onSaveIssuedCertificate,
  studentScore = 95,
  isAdminMode = false,
  onRequestManagerLogin
}) => {
  // Current student being issued
  const [studentName, setStudentName] = useState<string>('Eng. Leonardo Vasconcelos Ribeiro');
  const [studentDocument, setStudentDocument] = useState<string>('084.721.905-32 (CIR Marítima: 201889-4)');
  const [studentEmail, setStudentEmail] = useState<string>('leonardo.ribeiro@petrosgi.com.br');
  const [completionDate, setCompletionDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [scorePercentage, setScorePercentage] = useState<number>(studentScore);
  const [activeTab, setActiveTab] = useState<'preview' | 'customizer' | 'batch' | 'history'>('preview');
  const [showBackside, setShowBackside] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Batch issuance state
  const [batchText, setBatchText] = useState<string>(
    `Eng. Marcelo Quintanilha; 129.403.882-10; 92%\nMariana Silveira Braga; 098.412.333-01; 96%\nCap. André Albuquerque; 455.012.934-88; 88%`
  );
  const [batchSuccessCount, setBatchSuccessCount] = useState<number | null>(null);

  // File input refs for uploading logos
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const sealInputRef = useRef<HTMLInputElement | null>(null);

  // Verification Code for current preview
  const [currentVerificationCode, setCurrentVerificationCode] = useState<string>(() => generateVerificationCode());

  // Dynamic token replacer
  const renderFormattedBody = (rawText: string) => {
    return rawText
      .replace(/{{nome}}/g, studentName || '[Nome do Aluno]')
      .replace(/{{cpf}}/g, studentDocument || '[Documento]')
      .replace(/{{curso}}/g, template.courseTitle || course.title)
      .replace(/{{carga_horaria}}/g, `${template.workloadHours || course.workloadHours}`)
      .replace(/{{data_conclusao}}/g, completionDate)
      .replace(/{{codigo_autenticidade}}/g, currentVerificationCode)
      .replace(/{{nota}}/g, `${scorePercentage}`);
  };

  // Upload handler for custom institution logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateTemplate({
          ...template,
          institutionLogoUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload handler for custom seal
  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateTemplate({
          ...template,
          sealLogoUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct print trigger
  const handlePrintCertificate = () => {
    // Record certificate before printing
    recordIssuedCertificate();
    window.print();
  };

  // Download high-resolution PNG
  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      const certRecord = recordIssuedCertificate();
      await downloadCertificateAsPng(certRecord, 'certificate-preview-card');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Register in issued history
  const recordIssuedCertificate = (): IssuedCertificate => {
    const newCert: IssuedCertificate = {
      id: `cert-${Date.now()}`,
      verificationCode: currentVerificationCode,
      studentName,
      studentDocument,
      studentEmail,
      courseName: template.courseTitle,
      workloadHours: template.workloadHours,
      completionDate,
      issueDate: new Date().toLocaleDateString('pt-BR'),
      scorePercentage,
      templateSnapshot: { ...template }
    };
    onSaveIssuedCertificate(newCert);
    return newCert;
  };

  // Issue in batch
  const handleProcessBatch = () => {
    const lines = batchText.split('\n').filter(l => l.trim().length > 0);
    let count = 0;

    lines.forEach((line) => {
      const parts = line.split(';').map(p => p.trim());
      if (parts[0]) {
        const name = parts[0];
        const doc = parts[1] || 'Sob Consulta';
        const score = parseInt(parts[2]?.replace('%', '') || '90', 10);
        const code = generateVerificationCode();

        const cert: IssuedCertificate = {
          id: `batch-${Date.now()}-${count}`,
          verificationCode: code,
          studentName: name,
          studentDocument: doc,
          courseName: template.courseTitle,
          workloadHours: template.workloadHours,
          completionDate,
          issueDate: new Date().toLocaleDateString('pt-BR'),
          scorePercentage: isNaN(score) ? 90 : score,
          templateSnapshot: { ...template }
        };
        onSaveIssuedCertificate(cert);
        count++;
      }
    });

    setBatchSuccessCount(count);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Guard: O painel de certificados para edição e emissão só é permitido pelo gestor
  if (!isAdminMode) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 my-8 shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
            Acesso Restrito ao Gestor
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Painel de Edição & Emissão de Certificados
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            A personalização de modelos e emissão de certificados oficiais é permitida exclusivamente para o <strong>Gestor</strong> da plataforma. O aluno não tem permissão para emitir certificados diretamente.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onRequestManagerLogin}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Entrar com Login e Senha do Gestor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold uppercase mb-2">
              <Award className="w-3.5 h-3.5" />
              Estúdio de Certificação & Emissão Oficial
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Emissor de Certificados Totalmente Editável
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-normal">
                Pronto para Impressão & Exportação
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Personalize logos, bordas em guilhochê, textos com marcadores dinâmicos, assinaturas, autenticidade por QR Code e emita certificados individuais ou em lote.
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Abre diálogo do navegador pronto para salvar como PDF paisagem"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Imprimir / Salvar em PDF
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Renderizando...' : 'Baixar Imagem PNG (Alta Res.)'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Prévia do Certificado
            </button>

            {isAdminMode ? (
              <>
                <button
                  onClick={() => setActiveTab('customizer')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'customizer'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Personalizar Logos & Textos (Gestor)
                </button>

                <button
                  onClick={() => setActiveTab('batch')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'batch'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Emissão em Lote (Gestor)
                </button>
              </>
            ) : (
              <button
                onClick={() => onRequestManagerLogin?.()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700"
                title="Acesso exclusivo ao Modo Gestor"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Personalizar Logos / Lote (Gestor)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Histórico ({issuedCertificates.length} Emitidos)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBackside(!showBackside)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                showBackside
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {showBackside ? 'Exibindo Verso (Conteúdo)' : 'Alternar para Verso Curricular'}
            </button>

            <button
              onClick={() => setCurrentVerificationCode(generateVerificationCode())}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-mono-code"
              title="Gerar novo hash de autenticidade"
            >
              <RotateCcw className="w-3 h-3" />
              Novo Hash
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STUDENT DATA BAR (Visible on Preview tab) */}
      {activeTab === 'preview' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md no-print">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Dados do Aluno para Emissão Instantânea:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nome Completo do Aluno:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">CPF / CIR Marítima / Passaporte:</label>
              <input
                type="text"
                value={studentDocument}
                onChange={(e) => setStudentDocument(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Data de Conclusão:</label>
              <input
                type="text"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nota de Avaliação (%):</label>
              <input
                type="number"
                min={70}
                max={100}
                value={scorePercentage}
                onChange={(e) => setScorePercentage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: PREVIEW (THE CERTIFICATE SHEET) */}
      {activeTab === 'preview' && (
        <div className="flex flex-col items-center justify-center p-2 sm:p-4 overflow-x-auto">
          {/* A4 Landscape Document Container */}
          <div
            id="certificate-preview-card"
            className="printable-certificate relative w-[1000px] h-[705px] shrink-0 bg-white text-slate-900 rounded-xl shadow-2xl p-10 flex flex-col justify-between overflow-hidden select-none border border-slate-200"
            style={{
              backgroundImage:
                template.backgroundPattern === 'maritime_compass'
                  ? 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.04) 0%, rgba(255, 255, 255, 1) 70%)'
                  : 'none'
            }}
          >
            {/* Guilloche / Luxury Outer Double Borders */}
            <div className="absolute inset-4 pointer-events-none border-[3px] border-[#d4af37] rounded-lg" />
            <div className="absolute inset-6 pointer-events-none border border-[#0b192c]/40 rounded-md" />
            <div className="absolute inset-7 pointer-events-none border border-[#d4af37]/50 rounded-sm" />

            {/* Corner Ornamental Flourishes */}
            <div className="absolute top-5 left-5 w-12 h-12 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#d4af37] stroke-[3]">
                <path d="M 0 0 L 80 0 C 40 10 10 40 0 80 Z" />
                <circle cx="25" cy="25" r="6" fill="#d4af37" />
              </svg>
            </div>
            <div className="absolute top-5 right-5 w-12 h-12 pointer-events-none rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#d4af37] stroke-[3]">
                <path d="M 0 0 L 80 0 C 40 10 10 40 0 80 Z" />
                <circle cx="25" cy="25" r="6" fill="#d4af37" />
              </svg>
            </div>
            <div className="absolute bottom-5 left-5 w-12 h-12 pointer-events-none -rotate-90">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#d4af37] stroke-[3]">
                <path d="M 0 0 L 80 0 C 40 10 10 40 0 80 Z" />
                <circle cx="25" cy="25" r="6" fill="#d4af37" />
              </svg>
            </div>
            <div className="absolute bottom-5 right-5 w-12 h-12 pointer-events-none rotate-180">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#d4af37] stroke-[3]">
                <path d="M 0 0 L 80 0 C 40 10 10 40 0 80 Z" />
                <circle cx="25" cy="25" r="6" fill="#d4af37" />
              </svg>
            </div>

            {/* FRENTE DO CERTIFICADO */}
            {!showBackside ? (
              <>
                {/* 1. Header: Institution Logo & Names */}
                <div className="relative z-10 flex items-center justify-between px-6 pt-2">
                  {/* Left: Institution Logo */}
                  <div className="flex items-center gap-4">
                    {template.institutionLogoUrl ? (
                      <img
                        src={template.institutionLogoUrl}
                        alt="Logo da Instituição"
                        className="w-20 h-20 object-contain drop-shadow"
                      />
                    ) : (
                      <img
                        src={INSTITUTION_LOGO_PRESETS[0].svgDataUri}
                        alt="Logo Padrão Marítimo"
                        className="w-20 h-20 object-contain"
                      />
                    )}

                    <div>
                      <h2 className="font-cinzel text-base font-bold tracking-widest text-[#0b192c]">
                        {template.institutionName}
                      </h2>
                      <p className="text-[10px] text-slate-600 tracking-wider uppercase font-medium max-w-sm">
                        {template.institutionSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Golden Seal / Brasão */}
                  <div className="flex items-center gap-3">
                    {template.sealLogoUrl ? (
                      <img
                        src={template.sealLogoUrl}
                        alt="Selo Oficial"
                        className="w-20 h-20 object-contain drop-shadow"
                      />
                    ) : (
                      <img
                        src={SEAL_PRESETS[0].svgDataUri}
                        alt="Selo Ouro"
                        className="w-20 h-20 object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* 2. Certificate Title Section */}
                <div className="relative z-10 text-center my-1">
                  <h1 className="font-cinzel text-3xl font-extrabold tracking-widest text-[#0b192c] mb-1">
                    {template.headerTitle}
                  </h1>
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-16 h-[1.5px] bg-[#d4af37]" />
                    <p className="font-serif italic text-xs tracking-wider text-[#b45309] uppercase font-bold">
                      {template.headerSubtitle}
                    </p>
                    <span className="w-16 h-[1.5px] bg-[#d4af37]" />
                  </div>
                </div>

                {/* 3. Student Recipient Name (Grand & Prominent) */}
                <div className="relative z-10 text-center my-1 px-8">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block mb-1">
                    Outorgado com distinção a:
                  </span>
                  <div className="font-playfair text-3xl font-bold text-[#0b192c] border-b-2 border-[#d4af37] inline-block px-10 pb-1">
                    {studentName}
                  </div>
                </div>

                {/* 4. Body Description Paragraph */}
                <div className="relative z-10 px-12 text-center max-w-3xl mx-auto my-1">
                  <p className="text-xs leading-relaxed text-slate-800 font-serif text-justify font-normal">
                    {renderFormattedBody(template.bodyTemplate)}
                  </p>
                </div>

                {/* 5. Footer: Signatures, Seal & Authenticity QR Code */}
                <div className="relative z-10 grid grid-cols-12 items-end px-6 pb-2 gap-4">
                  {/* Signer 1 */}
                  <div className="col-span-4 text-center">
                    <div className="h-10 flex items-center justify-center font-script text-2xl text-[#0b192c]">
                      {template.signers[0]?.name || 'Cap. Roberto Alencar'}
                    </div>
                    <div className="w-48 h-[1px] bg-slate-400 mx-auto mb-1" />
                    <div className="text-[11px] font-bold text-[#0b192c]">
                      {template.signers[0]?.name}
                    </div>
                    <div className="text-[9px] text-slate-600 uppercase font-medium">
                      {template.signers[0]?.role}
                    </div>
                    <div className="text-[9px] text-[#b45309] font-mono-code">
                      {template.signers[0]?.credential}
                    </div>
                  </div>

                  {/* Center: QR Code & Verification Data */}
                  <div className="col-span-4 flex flex-col items-center justify-center text-center">
                    <div className="p-1.5 bg-white border border-[#d4af37] rounded-lg shadow-sm mb-1">
                      {/* Stylized QR Code SVG */}
                      <svg viewBox="0 0 100 100" className="w-14 h-14">
                        <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                        {/* Position markers */}
                        <rect x="5" y="5" width="28" height="28" fill="#0b192c" />
                        <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                        <rect x="13" y="13" width="12" height="12" fill="#0b192c" />

                        <rect x="67" y="5" width="28" height="28" fill="#0b192c" />
                        <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                        <rect x="75" y="13" width="12" height="12" fill="#0b192c" />

                        <rect x="5" y="67" width="28" height="28" fill="#0b192c" />
                        <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                        <rect x="13" y="75" width="12" height="12" fill="#0b192c" />

                        {/* Data dots */}
                        <rect x="40" y="15" width="8" height="8" fill="#0b192c" />
                        <rect x="50" y="25" width="8" height="8" fill="#0b192c" />
                        <rect x="45" y="45" width="10" height="10" fill="#d4af37" />
                        <rect x="65" y="45" width="8" height="8" fill="#0b192c" />
                        <rect x="40" y="75" width="8" height="8" fill="#0b192c" />
                        <rect x="55" y="65" width="8" height="8" fill="#0b192c" />
                        <rect x="75" y="75" width="8" height="8" fill="#0b192c" />
                      </svg>
                    </div>

                    <div className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold">
                      Chave de Autenticidade Digital
                    </div>
                    <div className="font-mono-code text-[9px] font-bold text-[#0b192c] tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {currentVerificationCode}
                    </div>
                    <div className="text-[8px] text-slate-500 mt-0.5">
                      Emitido em: {new Date().toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Signer 2 */}
                  <div className="col-span-4 text-center">
                    <div className="h-10 flex items-center justify-center font-script text-2xl text-[#0b192c]">
                      {template.signers[1]?.name || 'Dra. Vanessa Mendonça'}
                    </div>
                    <div className="w-48 h-[1px] bg-slate-400 mx-auto mb-1" />
                    <div className="text-[11px] font-bold text-[#0b192c]">
                      {template.signers[1]?.name}
                    </div>
                    <div className="text-[9px] text-slate-600 uppercase font-medium">
                      {template.signers[1]?.role}
                    </div>
                    <div className="text-[9px] text-[#b45309] font-mono-code">
                      {template.signers[1]?.credential}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* VERSO DO CERTIFICADO (Grade Curricular e Conteúdo dos 7 Módulos) */
              <div className="relative z-10 flex flex-col justify-between h-full p-6 text-slate-800">
                <div className="text-center pb-3 border-b border-slate-200">
                  <h2 className="font-cinzel text-lg font-bold text-[#0b192c] tracking-wider">
                    ANEXO CURRICULAR OFICIAL & REGISTRO DE COMPETÊNCIAS
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    {course.title} • Carga Horária Total: {course.workloadHours} Horas • Regulamentação ANP / ISO 19011:2026
                  </p>
                </div>

                {/* 7 Modules List Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 my-2 text-[10px]">
                  {course.modules.map((m) => (
                    <div key={m.id} className="border-l-2 border-[#d4af37] pl-3 py-0.5">
                      <div className="font-bold text-[#0b192c]">
                        Módulo {m.number}: {m.title}
                      </div>
                      <div className="text-slate-600 text-[9px] line-clamp-2">
                        {m.description}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legal and Compliance Footnote */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                  <div>
                    <strong>Normas de Referência:</strong> Regulamento Técnico do SGSO (ANP) | ABNT NBR ISO 19011:2026 | Convenção SOLAS | Código MODU.
                  </div>
                  <div className="font-mono-code">
                    Registro nº: {currentVerificationCode}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMIZER (CUSTOM LOGO UPLOAD & TEXT EDITING) */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
          {/* Logo & Visual Options (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Custom Logo Upload Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                Upload do Logotipo da Empresa / Instituição
              </h3>
              <p className="text-xs text-slate-400">
                Suba o arquivo da sua empresa (PNG transparente, SVG ou JPG) para substituir o brasão padrão.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center p-2 shrink-0">
                  {template.institutionLogoUrl ? (
                    <img
                      src={template.institutionLogoUrl}
                      alt="Logo Atual"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <img
                      src={INSTITUTION_LOGO_PRESETS[0].svgDataUri}
                      alt="Logo Padrão"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Carregar Logo do Computador
                  </button>

                  {template.institutionLogoUrl && (
                    <button
                      onClick={() => onUpdateTemplate({ ...template, institutionLogoUrl: '' })}
                      className="w-full py-1 text-[11px] text-red-400 hover:underline"
                    >
                      Remover Logo Customizado
                    </button>
                  )}
                </div>
              </div>

              {/* Presets library */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-2">
                  Ou escolha um logotipo predefinido:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {INSTITUTION_LOGO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onUpdateTemplate({ ...template, institutionLogoUrl: preset.svgDataUri })}
                      className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-center flex flex-col items-center gap-1.5 transition-all"
                    >
                      <img src={preset.svgDataUri} alt={preset.name} className="w-10 h-10 object-contain" />
                      <span className="text-[10px] text-slate-300 font-medium truncate w-full">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Seal / Stamp */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Selo de Autenticidade / Brasão
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center p-2 shrink-0">
                  {template.sealLogoUrl ? (
                    <img
                      src={template.sealLogoUrl}
                      alt="Selo Atual"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <img
                      src={SEAL_PRESETS[0].svgDataUri}
                      alt="Selo Padrão"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    ref={sealInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSealUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => sealInputRef.current?.click()}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-700"
                  >
                    Subir Imagem de Selo Próprio
                  </button>
                </div>
              </div>
            </div>

            {/* Signers Personalization */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Signatários & Assinaturas Oficiais
              </h3>

              {template.signers.map((signer, idx) => (
                <div key={signer.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-amber-400">
                    Signatário {idx + 1}
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Nome:</label>
                    <input
                      type="text"
                      value={signer.name}
                      onChange={(e) => {
                        const next = [...template.signers];
                        next[idx].name = e.target.value;
                        onUpdateTemplate({ ...template, signers: next });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400">Cargo / Função:</label>
                      <input
                        type="text"
                        value={signer.role}
                        onChange={(e) => {
                          const next = [...template.signers];
                          next[idx].role = e.target.value;
                          onUpdateTemplate({ ...template, signers: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400">CREA / Registro:</label>
                      <input
                        type="text"
                        value={signer.credential}
                        onChange={(e) => {
                          const next = [...template.signers];
                          next[idx].credential = e.target.value;
                          onUpdateTemplate({ ...template, signers: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Fields & Template Body Editor (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Palette className="w-4 h-4 text-amber-400" />
              Campos de Texto & Declaração Legal
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome da Instituição Emissora:
              </label>
              <input
                type="text"
                value={template.institutionName}
                onChange={(e) => onUpdateTemplate({ ...template, institutionName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subtítulo Institucional:
              </label>
              <input
                type="text"
                value={template.institutionSubtitle}
                onChange={(e) => onUpdateTemplate({ ...template, institutionSubtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título Principal do Certificado:
                </label>
                <input
                  type="text"
                  value={template.headerTitle}
                  onChange={(e) => onUpdateTemplate({ ...template, headerTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtítulo / Declaração de Especialidade:
                </label>
                <input
                  type="text"
                  value={template.headerSubtitle}
                  onChange={(e) => onUpdateTemplate({ ...template, headerSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título do Curso:
                </label>
                <input
                  type="text"
                  value={template.courseTitle}
                  onChange={(e) => onUpdateTemplate({ ...template, courseTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Carga Horária (Horas):
                </label>
                <input
                  type="number"
                  value={template.workloadHours}
                  onChange={(e) => onUpdateTemplate({ ...template, workloadHours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Texto Descritivo do Certificado (Suporta Tags Dinâmicas):
                </label>
                <span className="text-[10px] text-amber-400 font-mono-code">
                  Tags: {'{{nome}}'}, {'{{cpf}}'}, {'{{curso}}'}, {'{{carga_horaria}}'}, {'{{nota}}'}
                </span>
              </div>
              <textarea
                value={template.bodyTemplate}
                onChange={(e) => onUpdateTemplate({ ...template, bodyTemplate: e.target.value })}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 font-mono-code"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('preview')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
              >
                Concluir Edição e Ver Prévia →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BATCH ISSUANCE */}
      {activeTab === 'batch' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 no-print shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Emissão em Lote de Certificados para Turmas
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cole a lista de alunos (um por linha) no formato: <code>Nome Completo; CPF ou Identificação; Nota%</code>
              </p>
            </div>
          </div>

          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            rows={8}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-white font-mono-code leading-relaxed"
            placeholder="Ex: Carlos Drummond; 012.345.678-90; 94%"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Linhas detectadas: {batchText.split('\n').filter(l => l.trim().length > 0).length} participantes
            </span>

            <button
              onClick={handleProcessBatch}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Processar e Emitir Todos os Certificados
            </button>
          </div>

          {batchSuccessCount !== null && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Sucesso!</strong> {batchSuccessCount} certificados foram gerados e salvos no registro de autenticidade oficial.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ISSUED HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 no-print shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Livro de Registro de Certificados Emitidos
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total de {issuedCertificates.length} certificados oficiais registrados nesta plataforma.
              </p>
            </div>
          </div>

          {issuedCertificates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Nenhum certificado emitido até o momento.</p>
              <p className="text-xs text-slate-400">Utilize a aba "Prévia do Certificado" para gerar o primeiro.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Código de Autenticidade</th>
                    <th className="py-2.5 px-3">Nome do Aluno</th>
                    <th className="py-2.5 px-3">Documento</th>
                    <th className="py-2.5 px-3">Nota</th>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {issuedCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-mono-code text-amber-400 font-bold">
                        {cert.verificationCode}
                      </td>
                      <td className="py-2.5 px-3 text-white font-medium">{cert.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-400">{cert.studentDocument}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">{cert.scorePercentage}%</td>
                      <td className="py-2.5 px-3 text-slate-400">{cert.completionDate}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setStudentName(cert.studentName);
                            setStudentDocument(cert.studentDocument);
                            setScorePercentage(cert.scorePercentage);
                            setCurrentVerificationCode(cert.verificationCode);
                            setActiveTab('preview');
                          }}
                          className="text-cyan-400 hover:underline font-semibold"
                        >
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
