import React, { useState } from 'react';
import { IssuedCertificate } from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  QrCode
} from 'lucide-react';

interface CertificateVerificationProps {
  issuedCertificates: IssuedCertificate[];
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({
  issuedCertificates
}) => {
  const [searchCode, setSearchCode] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [foundCert, setFoundCert] = useState<IssuedCertificate | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    const match = issuedCertificates.find(
      c => c.verificationCode.toUpperCase() === cleanCode
    );

    setSearched(true);
    setFoundCert(match || null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Search Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Validação Pública de Autenticidade de Certificados
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Consulte a integridade, validade e dados de registro de auditores líderes formados nesta plataforma sob os regulamentos da ANP e ISO 19011:2026.
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Digite o código (ex: SGI-SGSO-2026-...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono-code uppercase"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Verificar Certificado
          </button>
        </form>

        {/* Quick click suggestions from issued history */}
        {issuedCertificates.length > 0 && (
          <div className="pt-2 text-xs text-slate-400">
            <span>Certificados emitidos recentemente para teste: </span>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {issuedCertificates.slice(0, 3).map(cert => (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => {
                    setSearchCode(cert.verificationCode);
                    setSearched(true);
                    setFoundCert(cert);
                  }}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-amber-400 font-mono-code rounded text-[11px] hover:border-amber-500"
                >
                  {cert.verificationCode} ({cert.studentName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verification Result Card */}
      {searched && (
        <div>
          {foundCert ? (
            <div className="bg-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase mb-1">
                    Certificado Válido & Autêntico
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Registro de Qualificação Profissional Homologado
                  </h3>
                  <p className="text-xs text-slate-400 font-mono-code">
                    Código de Rastreabilidade: {foundCert.verificationCode}
                  </p>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Auditor Diplomado:</span>
                  <span className="text-white font-bold text-sm block">
                    {foundCert.studentName}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Doc: {foundCert.studentDocument}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Programa / Treinamento:</span>
                  <span className="text-amber-400 font-semibold block">
                    {foundCert.courseName}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Carga Horária: {foundCert.workloadHours} Horas
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Aproveitamento Acadêmico:</span>
                  <span className="text-emerald-400 font-bold text-sm block">
                    {foundCert.scorePercentage}% de Acertos
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Conclusão: {foundCert.completionDate}
                  </span>
                </div>
              </div>

              {/* Institution and Legal Basis */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Instituição Emissora:</span>
                  <span className="text-white font-bold">{foundCert.templateSnapshot.institutionName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Data de Emissão no Livro de Registros:</span>
                  <span className="text-slate-200">{foundCert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Diretrizes Normativas Cumpridas:</span>
                  <span className="text-cyan-400 font-mono-code text-[11px]">
                    SGSO da ANP • ABNT NBR ISO 19011:2026 • SOLAS / MODU
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-red-900/60 rounded-3xl p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Certificado Não Localizado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                O código <code className="text-amber-400 font-mono-code font-bold">{searchCode}</code> não foi encontrado em nossa base de registros oficiais. Verifique a digitação ou certifique-se de que o documento foi emitido.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
