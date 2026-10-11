import React, { useState, useEffect, useRef } from 'react';
import { NonConformityItem, InterviewAvatar, ChapterSGSO } from '../types';
import {
  Compass,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Shield,
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Award,
  ChevronRight,
  Info,
  Radio,
  Flame,
  LifeBuoy
} from 'lucide-react';

interface Offshore3DLabProps {
  nonConformities: NonConformityItem[];
  onUpdateNonConformity: (updated: NonConformityItem) => void;
  avatars: InterviewAvatar[];
  onUpdateAvatar: (updated: InterviewAvatar) => void;
  onNavigateToModule?: (moduleNumber: number) => void;
}

type PlatformSector = 'all' | 'deck' | 'process' | 'ccr' | 'living';

export const Offshore3DLab: React.FC<Offshore3DLabProps> = ({
  nonConformities,
  onUpdateNonConformity,
  avatars,
  onUpdateAvatar,
  onNavigateToModule
}) => {
  const [activeTab, setActiveTab] = useState<'3d_hunt' | 'interviews' | 'report'>('3d_hunt');
  const [selectedSector, setSelectedSector] = useState<PlatformSector>('all');
  const [selectedNC, setSelectedNC] = useState<NonConformityItem | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<InterviewAvatar>(avatars[0]);

  // Form states for NC classification challenge
  const [userChapter, setUserChapter] = useState<ChapterSGSO>('Capítulo 3');
  const [userSeverity, setUserSeverity] = useState<string>('Grave');
  const [userActionNote, setUserActionNote] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // 3D Canvas rendering state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraAngle, setCameraAngle] = useState({ yaw: 45, pitch: 28, zoom: 1.0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter NCs by sector
  const filteredNCs = selectedSector === 'all'
    ? nonConformities
    : nonConformities.filter(nc => nc.location === selectedSector);

  const foundCount = nonConformities.filter(nc => nc.isFound).length;
  const totalNCs = nonConformities.length;
  const progressPercent = Math.round((foundCount / totalNCs) * 100);

  // Total interviews questions asked
  const totalQuestions = avatars.reduce((acc, av) => acc + av.questions.length, 0);
  const askedQuestions = avatars.reduce(
    (acc, av) => acc + av.questions.filter(q => q.isAsked).length,
    0
  );

  // Canvas drawing loop for 3D offshore rig simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let waveTime = 0;

    const render = () => {
      waveTime += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear sky and atmospheric gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#060d17'); // Dark navy night-dawn offshore sky
      skyGrad.addColorStop(0.5, '#0b192c');
      skyGrad.addColorStop(0.7, '#1e293b');
      skyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sea water with moving waves
      const horizonY = height * 0.42;
      const seaGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      seaGrad.addColorStop(0, '#041c32');
      seaGrad.addColorStop(0.4, '#042940');
      seaGrad.addColorStop(1, '#001e3d');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Draw subtle wave lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.2;
      for (let w = 0; w < 6; w++) {
        const yOffset = horizonY + (w * 45) + (height - horizonY) * 0.1;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 30) {
          const waveHeight = Math.sin((x * 0.015) + waveTime + w) * (3 + w * 1.5);
          if (x === 0) ctx.moveTo(x, yOffset + waveHeight);
          else ctx.lineTo(x, yOffset + waveHeight);
        }
        ctx.stroke();
      }

      // Center perspective projection for the semi-submersible platform
      const centerX = width / 2;
      const centerY = height * 0.62;
      const zoom = cameraAngle.zoom;
      const yawRad = (cameraAngle.yaw * Math.PI) / 180;
      const pitchRad = (cameraAngle.pitch * Math.PI) / 180;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);

      // 3D coordinate transformer
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis (yaw)
        const rotX = x * Math.cos(yawRad) - z * Math.sin(yawRad);
        const rotZ = x * Math.sin(yawRad) + z * Math.cos(yawRad);

        // Rotate around X axis (pitch)
        const rotY = y * Math.cos(pitchRad) - rotZ * Math.sin(pitchRad);
        const depth = y * Math.sin(pitchRad) + rotZ * Math.cos(pitchRad);

        const fov = 400;
        const scale = fov / (fov + depth);
        return {
          px: rotX * scale,
          py: rotY * scale,
          scale
        };
      };

      // 1. Draw Columns & Pontoons (Subsea hull)
      ctx.fillStyle = '#0f2744';
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 2;

      // 4 Main Columns
      const colRadius = 26;
      const colHeight = 70;
      const colPositions = [
        { x: -160, z: -120 },
        { x: 160, z: -120 },
        { x: 160, z: 120 },
        { x: -160, z: 120 }
      ];

      colPositions.forEach((pos) => {
        const bot = project(pos.x, 30, pos.z);
        const top = project(pos.x, 30 - colHeight, pos.z);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(bot.px, bot.py, colRadius * bot.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(bot.px - colRadius * bot.scale, bot.py);
        ctx.lineTo(top.px - colRadius * top.scale, top.py);
        ctx.lineTo(top.px + colRadius * top.scale, top.py);
        ctx.lineTo(bot.px + colRadius * bot.scale, bot.py);
        ctx.closePath();
        ctx.fillStyle = '#334155';
        ctx.fill();
        ctx.stroke();
      });

      // 2. Main Deck Slab (Yellow safety deck with steel beams)
      const deckCorners = [
        project(-210, -40, -160),
        project(210, -40, -160),
        project(210, -40, 160),
        project(-210, -40, 160)
      ];

      // Deck side skirt
      ctx.beginPath();
      ctx.moveTo(deckCorners[2].px, deckCorners[2].py);
      ctx.lineTo(deckCorners[3].px, deckCorners[3].py);
      ctx.lineTo(deckCorners[3].px, deckCorners[3].py + 18);
      ctx.lineTo(deckCorners[2].px, deckCorners[2].py + 18);
      ctx.closePath();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.stroke();

      // Deck Top Surface
      ctx.beginPath();
      ctx.moveTo(deckCorners[0].px, deckCorners[0].py);
      ctx.lineTo(deckCorners[1].px, deckCorners[1].py);
      ctx.lineTo(deckCorners[2].px, deckCorners[2].py);
      ctx.lineTo(deckCorners[3].px, deckCorners[3].py);
      ctx.closePath();
      ctx.fillStyle = '#263445';
      ctx.fill();
      ctx.strokeStyle = '#eab308'; // Safety yellow rim
      ctx.lineWidth = 3;
      ctx.stroke();

      // Deck walkways and grid pattern
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.lineWidth = 1;
      for (let i = -180; i <= 180; i += 60) {
        const p1 = project(i, -40, -140);
        const p2 = project(i, -40, 140);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // 3. Process Modules & High Pressure Vessels (Process Sector)
      const drawBox = (x: number, y: number, z: number, w: number, h: number, d: number, color: string) => {
        const c1 = project(x - w / 2, y, z - d / 2);
        const c2 = project(x + w / 2, y, z - d / 2);
        const c3 = project(x + w / 2, y, z + d / 2);
        const c4 = project(x - w / 2, y, z + d / 2);

        const t1 = project(x - w / 2, y - h, z - d / 2);
        const t2 = project(x + w / 2, y - h, z - d / 2);
        const t3 = project(x + w / 2, y - h, z + d / 2);
        const t4 = project(x - w / 2, y - h, z + d / 2);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(t1.px, t1.py);
        ctx.lineTo(t2.px, t2.py);
        ctx.lineTo(t3.px, t3.py);
        ctx.lineTo(t4.px, t4.py);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c3.px, c3.py);
        ctx.lineTo(t3.px, t3.py);
        ctx.lineTo(t4.px, t4.py);
        ctx.lineTo(c4.px, c4.py);
        ctx.closePath();
        ctx.fillStyle = '#334155';
        ctx.fill();
        ctx.stroke();
      };

      // Separator vessel (Cylinder horizontal)
      const sepCenter = project(70, -55, 30);
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(sepCenter.px, sepCenter.py, 35 * sepCenter.scale, 18 * sepCenter.scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      // Living Quarters & Bridge (Accommodation Tower)
      drawBox(-120, -40, -80, 80, 75, 70, '#f8fafc');
      // Bridge windows
      const bridgeWin = project(-120, -100, -50);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(bridgeWin.px - 22, bridgeWin.py, 44, 8);

      // Helideck cantilevered on Accommodation
      const heliCenter = project(-150, -115, -90);
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.arc(heliCenter.px, heliCenter.py, 28 * heliCenter.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // 'H' mark
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(18 * heliCenter.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', heliCenter.px, heliCenter.py);

      // 4. Drilling Derrick / Sonda Tower
      const derBot1 = project(20, -40, -40);
      const derBot2 = project(80, -40, -40);
      const derBot3 = project(80, -40, 20);
      const derBot4 = project(20, -40, 20);

      const derTop1 = project(35, -210, -25);
      const derTop2 = project(65, -210, -25);
      const derTop3 = project(65, -210, 5);
      const derTop4 = project(35, -210, 5);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.8;
      // Derrick vertical legs
      ctx.beginPath();
      ctx.moveTo(derBot1.px, derBot1.py);
      ctx.lineTo(derTop1.px, derTop1.py);
      ctx.moveTo(derBot2.px, derBot2.py);
      ctx.lineTo(derTop2.px, derTop2.py);
      ctx.moveTo(derBot3.px, derBot3.py);
      ctx.lineTo(derTop3.px, derTop3.py);
      ctx.moveTo(derBot4.px, derBot4.py);
      ctx.lineTo(derTop4.px, derTop4.py);
      // Derrick Cross trusses
      ctx.moveTo(derBot1.px, derBot1.py);
      ctx.lineTo(derTop2.px, derTop2.py);
      ctx.moveTo(derBot2.px, derBot2.py);
      ctx.lineTo(derTop1.px, derTop1.py);
      ctx.stroke();

      // Flare boom angled with animated fire torch
      const flareBot = project(160, -40, -100);
      const flareTip = project(230, -150, -140);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(flareBot.px, flareBot.py);
      ctx.lineTo(flareTip.px, flareTip.py);
      ctx.stroke();

      // Flare Fire Flame
      const flameFlicker = Math.sin(waveTime * 8) * 6;
      const flameGrad = ctx.createRadialGradient(
        flareTip.px, flareTip.py, 2,
        flareTip.px, flareTip.py, 28 + flameFlicker
      );
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#f59e0b');
      flameGrad.addColorStop(0.8, '#ef4444');
      flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(flareTip.px, flareTip.py, 28 + flameFlicker, 0, Math.PI * 2);
      ctx.fill();

      // Lifeboat TEMPSC (Orange)
      const boatPos = project(-180, -25, 40);
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.roundRect(boatPos.px - 14, boatPos.py - 6, 28, 12, 4);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 5. Draw Interactive Hotspots onto 3D projection
      const getHotspotCoords = (loc: string, index: number) => {
        switch (loc) {
          case 'deck':
            return project(50 + (index * 12), -45, -10 + (index * 15));
          case 'process':
            return project(80 + (index * 15), -65, 40 - (index * 10));
          case 'ccr':
            return project(-90 + (index * 10), -60, -40 + (index * 15));
          case 'living':
            return project(-140 + (index * 15), -45, 10 + (index * 20));
          default:
            return project(0, -45, 0);
        }
      };

      nonConformities.forEach((nc, idx) => {
        if (selectedSector !== 'all' && nc.location !== selectedSector) return;

        const pos = getHotspotCoords(nc.location, idx);
        const isPulse = Math.sin(waveTime * 4 + idx) > 0;

        // Pin halo
        ctx.beginPath();
        ctx.arc(pos.px, pos.py, isPulse ? 16 : 12, 0, Math.PI * 2);
        ctx.fillStyle = nc.isFound
          ? 'rgba(16, 185, 129, 0.3)' // Green when resolved
          : 'rgba(239, 68, 68, 0.4)'; // Red pulse when pending
        ctx.fill();

        // Pin inner circle
        ctx.beginPath();
        ctx.arc(pos.px, pos.py, 8, 0, Math.PI * 2);
        ctx.fillStyle = nc.isFound ? '#10b981' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Pin label tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${idx + 1}`, pos.px, pos.py + 3);
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraAngle, nonConformities, selectedSector]);

  // Mouse drag handlers to orbit the 3D scene
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setCameraAngle(prev => ({
      ...prev,
      yaw: (prev.yaw + dx * 0.4) % 360,
      pitch: Math.max(10, Math.min(60, prev.pitch - dy * 0.3))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Jump camera to preset view
  const setSectorView = (sector: PlatformSector) => {
    setSelectedSector(sector);
    switch (sector) {
      case 'deck':
        setCameraAngle({ yaw: 30, pitch: 35, zoom: 1.25 });
        break;
      case 'process':
        setCameraAngle({ yaw: 85, pitch: 26, zoom: 1.3 });
        break;
      case 'ccr':
        setCameraAngle({ yaw: -30, pitch: 22, zoom: 1.25 });
        break;
      case 'living':
        setCameraAngle({ yaw: -60, pitch: 30, zoom: 1.2 });
        break;
      case 'all':
      default:
        setCameraAngle({ yaw: 45, pitch: 28, zoom: 1.0 });
        break;
    }
  };

  const handleOpenNC = (nc: NonConformityItem) => {
    setSelectedNC(nc);
    setUserChapter(nc.userClassification?.chapter || 'Capítulo 3');
    setUserSeverity(nc.userClassification?.severity || 'Grave');
    setUserActionNote(nc.userClassification?.actionNote || '');
    setFeedbackMessage(null);
  };

  const handleSubmitClassification = () => {
    if (!selectedNC) return;

    const isChapterCorrect = userChapter === selectedNC.sgsoChapter;
    const isSeverityAcceptable =
      userSeverity === selectedNC.severity ||
      (selectedNC.severity === 'Crítica' && userSeverity === 'Grave');

    const updated: NonConformityItem = {
      ...selectedNC,
      isFound: true,
      userClassification: {
        chapter: userChapter,
        severity: userSeverity,
        actionNote: userActionNote || selectedNC.recommendedAction
      }
    };

    onUpdateNonConformity(updated);
    setSelectedNC(updated);

    if (isChapterCorrect) {
      setFeedbackMessage({
        isSuccess: true,
        text: `Diagnóstico Preciso! Constatação fundamentada com sucesso no ${selectedNC.sgsoChapter} (${selectedNC.regulatoryBasis}).`
      });
    } else {
      setFeedbackMessage({
        isSuccess: false,
        text: `Atenção: A autoridade regulatória enquadra este desvio no ${selectedNC.sgsoChapter} (${selectedNC.regulatoryBasis}). A constatação foi registrada.`
      });
    }
  };

  const handleAskQuestion = (qId: string) => {
    const updatedQuestions = selectedAvatar.questions.map(q => {
      if (q.id === qId) {
        return { ...q, isAsked: true };
      }
      return q;
    });

    const updatedAvatar = { ...selectedAvatar, questions: updatedQuestions };
    onUpdateAvatar(updatedAvatar);
    setSelectedAvatar(updatedAvatar);

    // If this reveals an NC, highlight it
    const askedQ = selectedAvatar.questions.find(q => q.id === qId);
    if (askedQ?.revealsNCId) {
      const targetNC = nonConformities.find(nc => nc.id === askedQ.revealsNCId);
      if (targetNC && !targetNC.isFound) {
        // Auto discover NC
        onUpdateNonConformity({ ...targetNC, isFound: true });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              Módulo 5: Inovação & Auditoria Prática
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Laboratório Virtual Offshore 3D
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Simulador FPSO / Rig
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Navegue pelas áreas industriais da plataforma, investigue evidências reais de integridade de barreiras e interrogue avatares da tripulação sob a regulação do SGSO e ISO 19011.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-amber-400 font-mono-code">{foundCount}/{totalNCs}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">NCs Auditadas</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-2xl font-black text-cyan-400 font-mono-code">{askedQuestions}/{totalQuestions}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Perguntas-Filtro</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-emerald-400 font-mono-code">{progressPercent}%</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Conclusão</div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('3d_hunt')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === '3d_hunt'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Caça a Não-Conformidades 3D ({foundCount}/{totalNCs})
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'interviews'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Simulador de Entrevistas a Bordo ({askedQuestions}/{totalQuestions})
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'report'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Relatório de Constatações ({foundCount} Registradas)
          </button>

          {onNavigateToModule && (
            <button
              onClick={() => onNavigateToModule(6)}
              className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-medium transition-colors"
            >
              Avançar para Módulo 6 (Relatórios)
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: 3D PLATFORM & HOTSPOT HUNT */}
      {activeTab === '3d_hunt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 3D Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Sector Switcher Bar */}
              <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSectorView('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSector === 'all'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Visão Geral
                  </button>
                  <button
                    onClick={() => setSectorView('deck')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSector === 'deck'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Convés / Rig
                  </button>
                  <button
                    onClick={() => setSectorView('process')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSector === 'process'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Processo & V-101
                  </button>
                  <button
                    onClick={() => setSectorView('ccr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSector === 'ccr'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Sala CCR
                  </button>
                  <button
                    onClick={() => setSectorView('living')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSector === 'living'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Acomodações / TEMPSC
                  </button>
                </div>

                {/* Camera Zoom / Reset Controls */}
                <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-slate-400 text-xs">
                  <button
                    onClick={() => setCameraAngle(p => ({ ...p, zoom: Math.min(2.0, p.zoom + 0.15) }))}
                    title="Aproximar Zoom"
                    className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCameraAngle(p => ({ ...p, zoom: Math.max(0.7, p.zoom - 0.15) }))}
                    title="Afastar Zoom"
                    className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCameraAngle({ yaw: 45, pitch: 28, zoom: 1.0 })}
                    title="Resetar Câmera"
                    className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* HTML5 Canvas with 3D Rendering */}
              <canvas
                ref={canvasRef}
                width={860}
                height={520}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
              />

              {/* Bottom HUD instructions overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Arraste com o mouse para orbitar a planta 3D em 360°</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-red-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    Ponto de Inspeção Pendente
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Auditoria Registrada
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Sector Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Deck & Rig Floor</div>
                  <div className="text-[11px] text-slate-400">Poço P-04 / BOP Skid</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Planta de Processo</div>
                  <div className="text-[11px] text-slate-400">Vaso V-101 / Skids</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Sala CCR</div>
                  <div className="text-[11px] text-slate-400">Sistemas SIS / SCADA</div>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Acomodações</div>
                  <div className="text-[11px] text-slate-400">Baleeiras / Rotas de Fuga</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Inspection List & Detail Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Pontos de Inspeção Física
                </h3>
                <span className="text-xs font-mono-code text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {filteredNCs.length} no setor
                </span>
              </div>

              {/* Scrollable list of findings */}
              <div className="space-y-2.5 py-3 overflow-y-auto max-h-[380px] pr-1">
                {filteredNCs.map((nc, index) => (
                  <div
                    key={nc.id}
                    onClick={() => handleOpenNC(nc)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedNC?.id === nc.id
                        ? 'border-amber-500 bg-amber-500/10 shadow-md'
                        : nc.isFound
                        ? 'border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-700'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            nc.isFound
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {nc.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          nc.severity === 'Crítica'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : nc.severity === 'Grave'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {nc.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {nc.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                      <span>{nc.locationName}</span>
                      <span className="font-semibold text-cyan-400">
                        {nc.isFound ? '✓ Auditado' : 'Auditando...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Callout Info */}
              <div className="mt-auto pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Clique em qualquer evidência acima para abrir o diagnóstico do SGSO.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NON-CONFORMITY CLASSIFICATION CHALLENGE */}
      {selectedNC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedNC(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">
              <Shield className="w-4 h-4" />
              Diagnóstico de Não-Conformidade SGSO
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{selectedNC.title}</h3>

            <div className="inline-block px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs mb-4">
              Localização: <span className="text-white font-medium">{selectedNC.locationName}</span>
            </div>

            {/* Evidence details card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 mb-5">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Pista Visual no Campo
                </span>
                <p className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-lg">
                  🔍 {selectedNC.visualClue}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Evidência Objetiva Constatada
                </span>
                <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {selectedNC.evidenceFound}
                </p>
              </div>
            </div>

            {/* Classification Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Capítulo Violado do Regulamento SGSO:
                  </label>
                  <select
                    value={userChapter}
                    onChange={(e) => setUserChapter(e.target.value as ChapterSGSO)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Capítulo 1">Capítulo 1 - Disposições Gerais</option>
                    <option value="Capítulo 2">Capítulo 2 - Liderança, Pessoal e Gestão</option>
                    <option value="Capítulo 3">Capítulo 3 - Instalações e Tecnologia (Barreiras)</option>
                    <option value="Capítulo 4">Capítulo 4 - Práticas Operacionais (PT / Emergência)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Classificação de Severidade do Risco:
                  </label>
                  <select
                    value={userSeverity}
                    onChange={(e) => setUserSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Crítica">Crítica (Interdição Imediata / Stop Work)</option>
                    <option value="Grave">Grave (Plano de Ação Corretiva em 24-48h)</option>
                    <option value="Moderada">Moderada (Plano de Ação em 15 dias)</option>
                    <option value="Leve">Leve / Oportunidade de Melhoria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Proposta de Ação Corretiva Imediata e Causa Raiz:
                </label>
                <textarea
                  value={userActionNote}
                  onChange={(e) => setUserActionNote(e.target.value)}
                  placeholder={`Ex: ${selectedNC.recommendedAction}`}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {feedbackMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    feedbackMessage.isSuccess
                      ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                      : 'bg-amber-950/40 border border-amber-800 text-amber-300'
                  }`}
                >
                  {feedbackMessage.isSuccess ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedNC(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSubmitClassification}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Registrar Constatação de Auditoria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERVIEWS SIMULATOR */}
      {activeTab === 'interviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Avatar selector sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider px-1">
              Liderança e Tripulação Auditável
            </h3>
            {avatars.map((av) => (
              <div
                key={av.id}
                onClick={() => setSelectedAvatar(av)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedAvatar.id === av.id
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${av.avatarColor} flex items-center justify-center text-white font-black text-lg shadow-inner`}
                  >
                    {av.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{av.name}</h4>
                    <p className="text-xs text-cyan-400 font-medium">{av.role}</p>
                    <span className="text-[10px] text-slate-400">{av.department}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>
                    Perguntas: {av.questions.filter(q => q.isAsked).length}/{av.questions.length}
                  </span>
                  <span className="text-cyan-400 font-medium">Entrevistar →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interview Dialogue Room (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAvatar.avatarColor} flex items-center justify-center text-white font-bold text-base`}
                >
                  {selectedAvatar.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedAvatar.name}</h3>
                  <p className="text-xs text-slate-400">{selectedAvatar.bio}</p>
                </div>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono-code">
                ISO 19011: Pergunta-Filtro
              </span>
            </div>

            {/* Question selection and dialog */}
            <div className="py-5 space-y-5 flex-1">
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Selecione a pergunta técnica de auditoria:
              </div>

              {selectedAvatar.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`border rounded-xl p-4 transition-all ${
                    q.isAsked
                      ? 'bg-slate-950/80 border-cyan-900/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-mono-code bg-slate-800 text-cyan-400 px-2 py-0.5 rounded mt-0.5">
                        P{idx + 1}
                      </span>
                      <p className="text-xs font-medium text-slate-200">{q.question}</p>
                    </div>

                    {!q.isAsked && (
                      <button
                        onClick={() => handleAskQuestion(q.id)}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-all shrink-0"
                      >
                        Interrogar
                      </button>
                    )}
                  </div>

                  {q.isAsked && (
                    <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-800">
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider shrink-0 mt-0.5">
                          Resposta:
                        </span>
                        <p className="text-xs text-slate-300 italic bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                          "{q.response}"
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-lg">
                        <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <strong className="text-amber-400 block mb-0.5">Pista de Auditoria (Triangulação):</strong>
                          {q.auditClue}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Diretriz: Manter postura investigativa ética sem atrito com o auditado.</span>
              <button
                onClick={() => setActiveTab('3d_hunt')}
                className="text-amber-400 hover:underline font-medium"
              >
                Voltar à Planta 3D →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONSOLIDATED AUDIT REPORT */}
      {activeTab === 'report' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Relatório Preliminar de Auditoria de SGSO (Módulo 5)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Constatações objetivas colhidas no laboratório virtual para apresentação na Reunião de Encerramento com a Diretoria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const text = nonConformities
                    .filter(nc => nc.isFound)
                    .map(
                      (nc, i) =>
                        `#${i + 1} - ${nc.title} [${nc.severity}]\nLocal: ${nc.locationName}\nRequisito: ${nc.regulatoryBasis}\nEvidência: ${nc.evidenceFound}\nAção: ${nc.recommendedAction}\n`
                    )
                    .join('\n---\n');
                  navigator.clipboard.writeText(text);
                  alert('Constatações de auditoria copiadas com sucesso para a área de transferência!');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Copiar Constatações
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {nonConformities.filter(nc => nc.isFound).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Nenhuma Não-Conformidade registrada ainda.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Vá até a aba "Caça a Não-Conformidades 3D" e inspecione os pontos para registrar desvios.
                </p>
              </div>
            ) : (
              nonConformities
                .filter(nc => nc.isFound)
                .map((nc, idx) => (
                  <div
                    key={nc.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{nc.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded font-mono-code bg-slate-800 text-cyan-300">
                          {nc.sgsoChapter}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                            nc.severity === 'Crítica'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : nc.severity === 'Grave'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {nc.severity}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold mb-0.5">Localização:</span>
                        <span className="text-slate-200">{nc.locationName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold mb-0.5">Base Regulatória:</span>
                        <span className="text-amber-300">{nc.regulatoryBasis}</span>
                      </div>
                    </div>

                    <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <strong className="text-slate-300 block mb-1">Evidência Objetiva Auditada:</strong>
                      <p className="text-slate-400">{nc.evidenceFound}</p>
                    </div>

                    <div className="text-xs bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-emerald-300">
                      <strong className="block mb-1 font-semibold">Ação Corretiva Exigida (Causa-Raiz):</strong>
                      <p className="text-emerald-200/90">{nc.userClassification?.actionNote || nc.recommendedAction}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
