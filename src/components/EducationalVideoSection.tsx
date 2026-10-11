import React, { useState, useRef } from 'react';
import { EducationalVideo, Module } from '../types';
import {
  Video,
  Play,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  Film,
  Sparkles,
  CheckCircle,
  Clock,
  Upload,
  Globe,
  FileVideo,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface EducationalVideoSectionProps {
  module: Module;
  isAdminMode: boolean;
  onAddVideo: (moduleId: string, video: EducationalVideo) => void;
  onDeleteVideo: (moduleId: string, videoId: string) => void;
  onRequestManagerLogin?: () => void;
}

export const EducationalVideoSection: React.FC<EducationalVideoSectionProps> = ({
  module,
  isAdminMode,
  onAddVideo,
  onDeleteVideo,
  onRequestManagerLogin
}) => {
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(
    module.educationalVideos?.[0] || null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Upload Type Selector: 'web_url' or 'file_upload'
  const [uploadType, setUploadType] = useState<'web_url' | 'file_upload'>('web_url');

  // Form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [tagsInput, setTagsInput] = useState<string>('SGSO, Treinamento');

  // Uploaded file state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const videos = module.educationalVideos || [];

  // Helper to convert YouTube standard watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const isWebEmbed = (url: string) => {
    return url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  // Handle local video file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setUploadedFilePreviewUrl(objectUrl);

      // Default title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Try reading duration from video metadata
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration) {
          setDurationMinutes(Math.max(1, Math.round(tempVideo.duration / 60)));
        }
      };
      tempVideo.src = objectUrl;
    }
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVideoUrl = '';
    let finalSourceType: 'web_url' | 'uploaded_file' = 'web_url';
    let fileName: string | undefined = undefined;
    let fileSizeMb: number | undefined = undefined;

    if (uploadType === 'file_upload') {
      if (!uploadedFile || !uploadedFilePreviewUrl) {
        alert('Por favor, selecione um arquivo de vídeo do seu computador.');
        return;
      }
      finalVideoUrl = uploadedFilePreviewUrl;
      finalSourceType = 'uploaded_file';
      fileName = uploadedFile.name;
      fileSizeMb = Math.round((uploadedFile.size / (1024 * 1024)) * 10) / 10;
    } else {
      if (!videoUrl.trim()) {
        alert('Por favor, informe a URL do vídeo.');
        return;
      }
      finalVideoUrl = videoUrl.trim();
      finalSourceType = 'web_url';
    }

    if (!title.trim()) {
      alert('Por favor, informe o título do vídeo.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newVideo: EducationalVideo = {
      id: `vid-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Videoaula do treinamento para capacitação técnica.',
      videoUrl: finalVideoUrl,
      sourceType: finalSourceType,
      fileName,
      fileSizeMb,
      durationMinutes: Number(durationMinutes) || 20,
      tags,
      addedAt: new Date().toLocaleDateString('pt-BR')
    };

    onAddVideo(module.id, newVideo);
    setSelectedVideo(newVideo);
    setIsModalOpen(false);

    // Reset form
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setUploadedFile(null);
    setUploadedFilePreviewUrl(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Vídeos Educativos do Módulo {module.number}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono-code">
                {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Material audiovisual do treinamento (suporta links da Web e upload de arquivos de vídeo locais).
            </p>
          </div>
        </div>

        {/* Action Button: ONLY visible / enabled for Manager Mode */}
        <div>
          {isAdminMode ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Incluir Vídeo Educativo (Gestor)
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Inclusão restrita ao Módulo Gestor</span>
              {onRequestManagerLogin && (
                <button
                  onClick={onRequestManagerLogin}
                  className="text-amber-400 hover:underline font-semibold ml-1"
                >
                  Entrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Content & Player Area */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Embedded Player (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              {selectedVideo ? (
                isWebEmbed(selectedVideo.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    key={selectedVideo.id + selectedVideo.videoUrl}
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay={false}
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                  <Play className="w-10 h-10 text-slate-600" />
                  <p className="text-xs">Selecione um vídeo na lista lateral para reproduzir.</p>
                </div>
              )}
            </div>

            {selectedVideo && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {selectedVideo.title}
                    </h4>
                    {selectedVideo.sourceType === 'uploaded_file' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                        <FileVideo className="w-3 h-3" />
                        Arquivo MP4 {selectedVideo.fileSizeMb ? `(${selectedVideo.fileSizeMb} MB)` : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Web Link
                      </span>
                    )}
                  </div>

                  {selectedVideo.durationMinutes && (
                    <span className="text-[11px] text-slate-400 font-mono-code bg-slate-900 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {selectedVideo.durationMinutes} min
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedVideo.description}
                </p>

                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedVideo.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-purple-950/40 border border-purple-800/40 text-purple-300 rounded text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Videos Playlist List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block px-1">
              Grade de Vídeos deste Módulo:
            </span>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {videos.map((vid) => {
                const isCurrent = selectedVideo?.id === vid.id;

                return (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'bg-purple-950/30 border-purple-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          isCurrent
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-white truncate">
                            {vid.title}
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {vid.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-purple-400 font-mono-code">
                            {vid.durationMinutes ? `${vid.durationMinutes} min` : 'Vídeo Aula'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono-code">
                            {vid.sourceType === 'uploaded_file' ? '• Arquivo Local' : '• Link Web'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Manager deletion control */}
                    {isAdminMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remover o vídeo "${vid.title}" deste módulo?`)) {
                            onDeleteVideo(module.id, vid.id);
                            if (selectedVideo?.id === vid.id) {
                              setSelectedVideo(null);
                            }
                          }
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg shrink-0 transition-colors"
                        title="Excluir vídeo (Modo Gestor)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-8 text-center space-y-3">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Nenhum vídeo cadastrado neste módulo</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isAdminMode
              ? 'Como Gestor, você pode clicar no botão acima para incluir videoaulas via Link da Web ou fazer Upload de um arquivo de vídeo do seu computador.'
              : 'O gestor pedagógico ainda não disponibilizou gravações extras para este módulo.'}
          </p>

          {isAdminMode && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              Cadastrar Primeiro Vídeo Educativo
            </button>
          )}
        </div>
      )}

      {/* MODAL: ADD VIDEO (GESTÃO DO GESTOR COM UPLOAD DE ARQUIVO E LINK WEB) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 text-xs font-bold text-purple-400 uppercase tracking-wide mb-1">
              <Video className="w-4 h-4" />
              Gestão de Conteúdo Audiovisual (Módulo Gestor)
            </div>

            <h3 className="text-lg font-bold text-white mb-3">
              Incluir Vídeo Educativo no Módulo {module.number}
            </h3>

            {/* TAB SELECTOR: Web Link vs Local File Upload */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => setUploadType('web_url')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  uploadType === 'web_url'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Link da Web (YouTube/Vimeo)
              </button>

              <button
                type="button"
                onClick={() => setUploadType('file_upload')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  uploadType === 'file_upload'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload de Arquivo (MP4/WebM)
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              {/* Option 1: File Upload Section */}
              {uploadType === 'file_upload' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Selecione o arquivo de vídeo no seu computador:
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/70 hover:bg-slate-950 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <FileVideo className="w-6 h-6" />
                    </div>

                    {uploadedFile ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block truncate">
                          {uploadedFile.name}
                        </span>
                        <span className="text-[11px] text-purple-300 font-mono-code block">
                          Tamanho: {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Pronto para visualização
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Arquivo carregado com sucesso
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-300 block">
                          Clique aqui para escolher um vídeo (.mp4, .webm, .mov)
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Ou arraste o arquivo de vídeo do seu dispositivo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Immediate Preview of selected local file */}
                  {uploadedFilePreviewUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-40 mx-auto">
                      <video
                        src={uploadedFilePreviewUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Option 2: Web URL Section */}
              {uploadType === 'web_url' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL do Vídeo (YouTube, Vimeo ou link direto MP4):
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono-code"
                    required={uploadType === 'web_url'}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Exemplo YouTube: <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
                  </span>
                </div>
              )}

              {/* Video metadata common fields */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título da Videoaula:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Análise de Riscos de Processo e Lições do Deepwater Horizon"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duração Estimada (minutos):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (separadas por vírgula):
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="SGSO, Barreiras, ANP"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descrição e Orientações aos Alunos:
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resuma os pontos principais abordados nesta aula em vídeo..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center gap-1.5"
                >
                  {uploadType === 'file_upload' ? (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Publicar Vídeo do Computador
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Salvar Vídeo Educativo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
