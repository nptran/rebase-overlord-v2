/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GitBranch, 
  Settings, 
  Sparkles, 
  Smile, 
  Languages, 
  AlertOctagon, 
  FileCode, 
  Database,
  Search,
  RefreshCw,
  TrendingUp,
  Link,
  Key,
  FolderOpen,
  Bot
} from 'lucide-react';
import { TranslationTone, GitRepoState, SessionStats } from '../types';
import { translate } from '../i18n';
import DirectoryBrowserModal from './DirectoryBrowserModal';
import { resolveApiUrl } from '../utils/apiResolver';

interface RepoHeaderProps {
  repoState: GitRepoState;
  stats: SessionStats;
  tone: TranslationTone;
  useEmoji: boolean;
  isSimulation: boolean;
  isCloning: boolean;
  isAiEnabled: boolean;
  onSetTone: (t: TranslationTone) => void;
  onToggleEmoji: () => void;
  onToggleSimulation: (val: boolean) => void;
  onToggleAi: () => void;
  onUpdateRepoPath: (path: string) => void;
  onCloneRepo: (repoUrl: string, token: string) => Promise<boolean>;
  onRefresh: () => void;
}

const headerLoc = {
  [TranslationTone.PROFESSIONAL]: {
    subtitle: "Trình trợ lý trực quan hóa luồng Git Squash & Rebase nâng cao dành cho lập trình viên.",
    repoPathPlaceholder: "Ví dụ: /path/to/my/project hoặc .",
    refreshTitle: "Làm mới thông tin",
    repoStatus: "Trạng thái Repo:",
    valid: "Hợp lệ",
    branch: "Chi nhánh:",
    changeStatus: "Trạng thái thay đổi:",
    hasChanges: "CÓ THAY ĐỔI",
    clean: "Sạch sẽ",
    sessionStats: "THỐNG KÊ PHIÊN",
    rebaseCountLabel: "Đã Rebase/Squash:",
    times: "lần",
    sessionStarted: "Khởi động:",
    lastRun: "Lần cuối",
    playgroundActive: "PLAYGROUND GIẢ LẬP ĐANG KÍCH HOẠT:",
    playgroundDesc: "Bạn không cần kết nối Git thật. Hệ thống đã chuẩn bị sẵn sơ đồ commits và tập tin xung đột mô phỏng.",
    connectRealRepo: "Kết nối Repo Thật",
    cloningTip: "Chúng tôi đang tải nhánh mặc định với --depth 50 về máy chủ ảo an toàn.",
    fileDialogTip: "Vui lòng kiểm tra màn hình máy tính của bạn để lựa chọn thư mục Git trong hộp thoại File Dialog.",
    orUseWebDir: "🌐 Hoặc sử dụng Trình duyệt Thư mục Web",
    patPlaceholder: "Personal Access Token / PAT (Tuỳ chọn cho Repo riêng tư)",
    chooseFolderBtn: "Chọn thư mục...",
    instructionTitle: "💡 Chỉ dẫn:",
    instructionDesc: "Nhấp vào hộp đường dẫn hoặc nút Chọn thư mục... để mở nhanh hộp thoại chọn thư mục Windows Explorer/Finder.",
    quickRepoTemplates: "⚡ Kho thử nghiệm chuẩn nhanh:",
    cloningTitle: "ĐANG SAO CHÉP KHO LƯU TRỮ TỪ XA...",
    systemDialogTitle: "ĐANG MỞ HỘP THOẠI HỆ ĐIỀU HÀNH..."
  },
  [TranslationTone.JOKE]: {
    subtitle: "Bệ phóng dọn rác git commit và nén luồng mượt mà như lụa sếp ơi! 🚀",
    repoPathPlaceholder: "Nhập ổ code cần trục vớt nè sếp...",
    refreshTitle: "Bơm lại dữ liệu 🔄",
    repoStatus: "Sức khỏe ổ code:",
    valid: "Ngon nghẻ đét",
    branch: "Nhánh đang quẩy:",
    changeStatus: "Mức biến động:",
    hasChanges: "BIẾN ĐỘNG MỚI",
    clean: "Sạch bóng",
    sessionStats: "BẢNG VÀNG THÀNH TÍCH 🌟",
    rebaseCountLabel: "Đã nén tà thuật:",
    times: "phát",
    sessionStarted: "Lên sóng lúc:",
    lastRun: "Mới múa",
    playgroundActive: "SÂN CHƠI GIẢ LẬP ĐANG HOẠT ĐỘNG: 🧪",
    playgroundDesc: "Thả cửa phá hoại! Không sợ hỏng code thật đâu sếp, quẩy nhiệt tình đi nha.",
    connectRealRepo: "Chốt Repo Thật Đi Sếp",
    cloningTip: "Đang ôm cả bầu trời code tinh hoa về ổ đĩa ảo rồi sếp ơi, đợi tí nhé!",
    fileDialogTip: "Liếc mắt sang màn hình để bấm chọn thư mục Git xinh tươi đi kìa sếp ơi.",
    orUseWebDir: "🌐 Hoặc lục lọi bằng Trình duyệt Thư mục Web",
    patPlaceholder: "Mã PAT bảo mật (Dành cho hầm trú ẩn private, nhập vào đây nhé)",
    chooseFolderBtn: "Chỉ định ổ code...",
    instructionTitle: "💡 Cẩm nang võ lâm:",
    instructionDesc: "Bấm chuột vào ô đường dẫn hoặc nút Chỉ định ổ code... để triệu hồi cửa sổ Windows Explorer/Finder.",
    quickRepoTemplates: "⚡ Mẫu thử tốc độ ánh sáng:",
    cloningTitle: "ĐANG KHUÂN VA VẬN CHUYỂN REPO...",
    systemDialogTitle: "ĐANG TRIỆU HỒI CỬA SỔ HỆ THỐNG..."
  },
  [TranslationTone.TOXIC]: {
    subtitle: "Công cụ dọn đống rác commit của tụi dev vớ vẩn trước khi gộp code.",
    repoPathPlaceholder: "Ném cái ổ rác mày vào đây đi lẹ...",
    refreshTitle: "Tải lại đi mệt quá",
    repoStatus: "Con hàng đang:",
    valid: "Đéo lỗi",
    branch: "Đống rác:",
    changeStatus: "Nghịch bậy bạ:",
    hasChanges: "SỬA BẬY BẠ",
    clean: "Gọn gàng",
    sessionStats: "HỒ SƠ BỆNH ÁN 💩",
    rebaseCountLabel: "Đã còng lưng dọn:",
    times: "bãi",
    sessionStarted: "Mò mặt vào lúc:",
    lastRun: "Ngoáy mông cuối",
    playgroundActive: "ĐANG CHƠI TRÒ TRẺ CON Ở SÂN CHƠI GIẢ LẬP:",
    playgroundDesc: "Cứ bấm nghịch đi kẻo phá nát code thật rồi khóc lóc. Ở đây đơm xạo mấy cái commit cho nghịch đỡ thèm.",
    connectRealRepo: "Vào Hàng Thật Đi Thằng Hèn",
    cloningTip: "Đang kéo cả mớ code rác về rồi, ngồi im đấy đừng có táy máy bấm khùng điên.",
    fileDialogTip: "Mắt mở to lên mà nhìn cái File Dialog đang hiện ra mà chọn thư mục kìa.",
    orUseWebDir: "🌐 Hoặc dùng hàng tự chế Web Folder Browser",
    patPlaceholder: "Token PAT (Chắc lại bày đặt xài repo private chứ gì, ném vào đây)",
    chooseFolderBtn: "Bới thư mục ra...",
    instructionTitle: "💡 Đọc kỹ giùm cái:",
    instructionDesc: "Click vào ô đường dẫn hoặc nút Bới thư mục ra... mà gọi cái Explorer/Finder lên.",
    quickRepoTemplates: "⚡ Repo cho mấy đứa lười:",
    cloningTitle: "KÉO REPO VỀ ĐÂY LẸ LÊN...",
    systemDialogTitle: "HỘP THOẠI ĐANG MỞ, BẬN MẮT MÀ NHÌN..."
  },
  [TranslationTone.ENGLISH]: {
    subtitle: "Advanced interactive assistant for visualizing and flattening Git Squash & Rebase workflows.",
    repoPathPlaceholder: "E.g. /path/to/my/repo or .",
    refreshTitle: "Refresh info",
    repoStatus: "Repo Status:",
    valid: "Valid",
    branch: "Branch:",
    changeStatus: "Changes Status:",
    hasChanges: "DIRTY CHANGES",
    clean: "Clean",
    sessionStats: "SESSION STATISTICS",
    rebaseCountLabel: "Rebased/Squashed:",
    times: "times",
    sessionStarted: "Session Started:",
    lastRun: "Last",
    playgroundActive: "PLAYGROUND SIMULATION ACTIVE:",
    playgroundDesc: "No real Git connection needed. The system has pre-configured simulated commit nodes and conflict files.",
    connectRealRepo: "Connect Real Repo",
    cloningTip: "We are cloning the default branch with --depth 50 into a secure virtual space.",
    fileDialogTip: "Please check your screen to select your Git repository in the file dialog.",
    orUseWebDir: "🌐 Or use Web Directory Browser",
    patPlaceholder: "Personal Access Token / PAT (Optional for private repos)",
    chooseFolderBtn: "Choose folder...",
    instructionTitle: "💡 Instruction:",
    instructionDesc: "Click the path input or 'Choose folder...' button to quickly open Windows Explorer/Finder dialog.",
    quickRepoTemplates: "⚡ Quick testing templates:",
    cloningTitle: "CLONING REMOTE REPOSITORY...",
    systemDialogTitle: "OPENING SYSTEM FILE DIALOG..."
  }
};

export default function RepoHeader({
  repoState,
  stats,
  tone,
  useEmoji,
  isSimulation,
  isCloning,
  isAiEnabled,
  onSetTone,
  onToggleEmoji,
  onToggleSimulation,
  onToggleAi,
  onUpdateRepoPath,
  onCloneRepo,
  onRefresh
}: RepoHeaderProps) {
  const [editingPath, setEditingPath] = React.useState(repoState.repoPath || '.');
  const [cloneUrl, setCloneUrl] = React.useState('');
  const [accessToken, setAccessToken] = React.useState('');
  const [connectionType, setConnectionType] = React.useState<'https' | 'local'>('https');
  const [isDirBrowserOpen, setIsDirBrowserOpen] = React.useState(false);
  const [isSelectingDirLocally, setIsSelectingDirLocally] = React.useState(false);
  const loc = headerLoc[tone] || headerLoc[TranslationTone.PROFESSIONAL];

  // Custom check/download states for non-signed custom update installer (Solution 2)
  interface UpdateData {
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    releaseName: string;
    releaseNotes: string;
    downloadUrl: string;
    publishedAt: string;
    simulated: boolean;
  }

  const [checkingUpdate, setCheckingUpdate] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState<UpdateData | null>(null);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = React.useState(false);
  const [downloadProgressValue, setDownloadProgressValue] = React.useState(0);
  const [applyingUpdate, setApplyingUpdate] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);
  const [successCheckMsg, setSuccessCheckMsg] = React.useState<string | null>(null);

  const handleCheckUpdates = async (forceSimulate = false) => {
    setCheckingUpdate(true);
    setUpdateError(null);
    setSuccessCheckMsg(null);
    try {
      const url = resolveApiUrl(`/api/update/check${forceSimulate ? '?simulate=true' : ''}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Could not contact update server.');
      const data = await res.json();
      setUpdateInfo(data);
      if (data.updateAvailable) {
        setShowUpdateModal(true);
      } else {
        const msg = translate('update_no_new', tone, { version: data.currentVersion }, useEmoji);
        setSuccessCheckMsg(msg);
        setTimeout(() => setSuccessCheckMsg(null), 4000);
      }
    } catch (err: any) {
      setUpdateError(err.message || 'Check update query failed.');
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleStartDownload = async () => {
    if (!updateInfo) return;
    setDownloadingUpdate(true);
    setUpdateError(null);
    setDownloadProgressValue(0);

    try {
      const url = resolveApiUrl('/api/update/download');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadUrl: updateInfo.downloadUrl,
          isSimulated: updateInfo.simulated
        })
      });
      if (!res.ok) throw new Error('Download request rejected by server.');

      const interval = setInterval(async () => {
        try {
          const progressRes = await fetch(resolveApiUrl('/api/update/progress'));
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setDownloadProgressValue(progressData.percent);
            if (progressData.error) {
              setUpdateError(progressData.error);
              clearInterval(interval);
              setDownloadingUpdate(false);
            }
            if (progressData.percent >= 100 && !progressData.isDownloading) {
              clearInterval(interval);
              handleApplyUpdate();
            }
          }
        } catch (pollErr) {
          console.error('Error polling download progress:', pollErr);
        }
      }, 300);

    } catch (err: any) {
      setUpdateError(err.message || 'Download failed.');
      setDownloadingUpdate(false);
    }
  };

  const handleApplyUpdate = async () => {
    setApplyingUpdate(true);
    try {
      const url = resolveApiUrl('/api/update/apply');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isSimulated: updateInfo?.simulated
        })
      });
      if (!res.ok) throw new Error('Failed to run update installer.');
      
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (err: any) {
      setUpdateError(err.message || 'Launching installer failed.');
      setApplyingUpdate(false);
    }
  };

  React.useEffect(() => {
    setEditingPath(repoState.repoPath);
  }, [repoState.repoPath]);

  const handleChooseLocalFolder = () => {
    if (isSimulation) return;
    setIsDirBrowserOpen(true);
  };

  const handleSubmitPath = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRepoPath(editingPath);
  };

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneUrl.trim()) return;
    const ok = await onCloneRepo(cloneUrl, accessToken);
    if (ok) {
      setCloneUrl('');
      setAccessToken('');
    }
  };

  const handleSelectPreset = async (url: string) => {
    setCloneUrl(url);
    await onCloneRepo(url, '');
  };

  return (
    <div id="repo-header-container" className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      
      {/* Background loading spinner overlay for Cloning or Folder selecting */}
      {(isCloning || isSelectingDirLocally) && (
        <div className="absolute inset-0 bg-[#060814]/90 backdrop-blur-sm flex flex-col items-center justify-center z-55 animate-fade-in gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-xs">
              {isCloning ? '📥' : '📂'}
            </span>
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              {isCloning ? loc.cloningTitle : loc.systemDialogTitle}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              {isCloning ? loc.cloningTip : loc.fileDialogTip}
            </p>
            {!isCloning && isSelectingDirLocally && (
              <button
                type="button"
                onClick={() => {
                  setIsSelectingDirLocally(false);
                  setIsDirBrowserOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-lg transition-all border border-indigo-500/20 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mx-auto active:scale-95 text-center font-mono"
              >
                {loc.orUseWebDir}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
        {/* Main Title & Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 id="app-main-heading" className="text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
              REBASE OVERLORD
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-sans tracking-normal font-medium animate-pulse">
                v0.4.0 - Web Native
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {loc.subtitle}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tone selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" /> Tone:
            </span>
            <button
              id="tone-pro-btn"
              onClick={() => onSetTone(TranslationTone.PROFESSIONAL)}
              className={`px-2 py-1 rounded transition-colors ${tone === TranslationTone.PROFESSIONAL ? 'bg-emerald-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Professional Vietnamese"
            >
              💼 Pro
            </button>
            <button
              id="tone-joke-btn"
              onClick={() => onSetTone(TranslationTone.JOKE)}
              className={`px-2 py-1 rounded transition-colors ${tone === TranslationTone.JOKE ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Vietnamese Joke"
            >
              🤪 Joke
            </button>
            <button
              id="tone-toxic-btn"
              onClick={() => onSetTone(TranslationTone.TOXIC)}
              className={`px-2 py-1 rounded transition-colors ${tone === TranslationTone.TOXIC ? 'bg-rose-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Toxic Vietnamese Slang"
            >
              🔥 Toxic
            </button>
            <button
              id="tone-en-btn"
              onClick={() => onSetTone(TranslationTone.ENGLISH)}
              className={`px-2 py-1 rounded transition-colors ${tone === TranslationTone.ENGLISH ? 'bg-amber-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="English Standard"
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Emoji mode */}
          <button
            id="toggle-emoji-btn"
            onClick={onToggleEmoji}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              useEmoji 
                ? 'bg-[#1e293b] border-amber-500/30 text-amber-400 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>{useEmoji ? '🤪' : '😶'}</span>
            <span>Emoji Mode: {useEmoji ? 'ON' : 'OFF'}</span>
          </button>

          {/* Gemini API toggle for cost saving */}
          <button
            id="toggle-gemini-ai-btn"
            onClick={onToggleAi}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isAiEnabled
                ? 'bg-indigo-950/45 border-violet-500/35 text-violet-300 font-medium hover:bg-indigo-950/60'
                : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
            }`}
            title={tone === TranslationTone.ENGLISH ? "Enable/Disable Gemini AI model processing to save API costs" : "Bật/tắt xử lý API Gemini để tiết kiệm chi phí dịch vụ"}
          >
            <Bot className={`w-3.5 h-3.5 ${isAiEnabled ? 'text-violet-400 animate-pulse' : 'text-slate-600'}`} />
            <span>
              {isAiEnabled
                ? (tone === TranslationTone.ENGLISH ? 'Gemini AI: ON' : tone === TranslationTone.TOXIC ? 'Gemini AI: GÁY TO' : tone === TranslationTone.JOKE ? 'Gemini AI: MỞ BÁT' : 'Gemini AI: BẬT')
                : (tone === TranslationTone.ENGLISH ? 'Gemini AI: Cost Saved' : tone === TranslationTone.TOXIC ? 'Gemini AI: NÍN (Tiết kiệm)' : tone === TranslationTone.JOKE ? 'Gemini AI: HẾT SÈNG' : 'Gemini AI: TẮT')}
            </span>
          </button>

          {/* Check Updates Button */}
          <div className="flex items-center bg-slate-950/40 border border-slate-850 rounded-lg p-0.5 gap-0.5">
            <button
              id="check-updates-btn"
              onClick={() => handleCheckUpdates(false)}
              disabled={checkingUpdate}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                checkingUpdate
                  ? 'bg-slate-900 border-slate-800 text-slate-500'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
              title={translate('update_check_btn', tone, undefined, useEmoji)}
            >
              <RefreshCw className={`w-3 h-3 ${checkingUpdate ? 'animate-spin' : ''}`} />
              <span>
                {checkingUpdate
                  ? translate('update_checking', tone, undefined, useEmoji)
                  : translate('update_check_btn', tone, undefined, useEmoji)}
              </span>
            </button>
            <button
              id="test-sim-update-btn"
              onClick={() => handleCheckUpdates(true)}
              className="text-[9px] px-1.5 py-1 text-slate-500 hover:text-emerald-405 hover:bg-slate-900 rounded-md transition-all font-mono"
              title="Chạy mô phỏng tải & cài đặt installer"
            >
              SIM 🧪
            </button>
          </div>

          {/* Success Latest Version Dialog Toast */}
          {successCheckMsg && (
            <div id="update-toast-banner" className="absolute top-4 right-4 bg-emerald-950 text-emerald-300 text-[11px] px-3.5 py-2.5 rounded-lg shadow-xl font-medium tracking-wide flex items-center gap-1.5 z-55 border border-emerald-500/30 animate-fade-in animate-duration-300">
              <span>🛡️</span>
              <span>{successCheckMsg}</span>
            </div>
          )}

          {/* Core Simulator / Real Workspace toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              id="toggle-sim-btn"
              onClick={() => onToggleSimulation(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all ${
                isSimulation 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Playground</span>
            </button>
            <button
              id="toggle-real-btn"
              onClick={() => onToggleSimulation(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all ${
                !isSimulation 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Real Git Repo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connection & Repo Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Repo connection form / path status */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {isSimulation ? (
            /* SIMULATION MODE ACTIVE BANNER */
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-mono text-teal-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="animate-bounce">🤖</span>
                <div>
                  <strong>{loc.playgroundActive}</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">{loc.playgroundDesc}</p>
                </div>
              </div>
              <button
                onClick={() => onToggleSimulation(false)}
                className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 transition-colors text-slate-950 font-bold rounded text-[10px] uppercase font-sans cursor-pointer shrink-0"
              >
                {loc.connectRealRepo}
              </button>
            </div>
          ) : (
            /* REAL GIT CONNECTION CONTROLS */
            <div className="flex flex-col gap-3">
              {/* Connection Type Tabs */}
              <div className="flex border-b border-slate-800 pb-1.5 gap-4">
                <button
                  type="button"
                  onClick={() => setConnectionType('https')}
                  className={`text-xs font-mono pb-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    connectionType === 'https' 
                      ? 'border-indigo-500 text-white font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Link className="w-3.5 h-3.5 text-indigo-400" />
                  Clone &amp; Connect HTTPS Repo
                </button>
                <button
                  type="button"
                  onClick={() => setConnectionType('local')}
                  className={`text-xs font-mono pb-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    connectionType === 'local' 
                      ? 'border-indigo-500 text-white font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                  Manual Server Directory
                </button>
              </div>

              {connectionType === 'https' ? (
                /* HTTPS CLONE FORM */
                <form onSubmit={handleCloneSubmit} className="flex flex-col md:flex-row gap-2 items-end">
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                        <Link className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="url"
                        required
                        value={cloneUrl}
                        onChange={(e) => setCloneUrl(e.target.value)}
                        placeholder="Git HTTPS URL (vd: https://github.com/octocat/Spoon-Knife.git)"
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200 rounded-lg outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-700 placeholder-slate-600"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                        <Key className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder={loc.patPlaceholder}
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200 rounded-lg outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-700 placeholder-slate-650"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 shrink-0 w-full md:w-auto justify-end">
                    <button
                      type="submit"
                      disabled={!cloneUrl.trim()}
                      className={`px-4 py-2 text-xs rounded-lg font-mono transition-all duration-150 border font-bold shadow-md w-full md:w-auto flex items-center justify-center gap-1.5 cursor-pointer ${
                        cloneUrl.trim() 
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500/30 text-white hover:from-indigo-500 hover:to-violet-500' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Clone &amp; Connect
                    </button>
                    <button
                      type="button"
                      onClick={onRefresh}
                      className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                      title={loc.refreshTitle}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* LOCAL PATH DIRECTORY SYSTEM FORM */
                <form id="repo-path-form" onSubmit={handleSubmitPath} className="flex flex-col gap-1 w-full">
                  <div className="flex gap-2 w-full items-center">
                    <div className="relative flex-grow">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                        <FolderOpen className="w-3.5 h-3.5" />
                      </span>
                      <input
                        id="repo-path-input"
                        type="text"
                        value={editingPath}
                        onClick={handleChooseLocalFolder}
                        onChange={(e) => setEditingPath(e.target.value)}
                        placeholder={loc.repoPathPlaceholder}
                        className="w-full pl-9 pr-28 py-2 text-xs font-mono rounded-lg border bg-slate-950 border-slate-800 text-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-700 outline-none placeholder-slate-600 cursor-pointer hover:bg-slate-900/40 transition-colors"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChooseLocalFolder();
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold font-sans bg-indigo-500/10 hover:bg-indigo-500 hover:text-white rounded text-indigo-400 transition-all border border-indigo-500/20 active:scale-95 cursor-pointer shadow-sm hover:shadow-indigo-500/15"
                        >
                          {loc.chooseFolderBtn}
                        </button>
                      </div>
                    </div>
                    <button
                      id="save-repo-path-btn"
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs text-white rounded-lg font-mono transition-colors border border-indigo-500/20 shadow-md flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      Connect
                    </button>
                    <button
                      id="refresh-repo-btn"
                      type="button"
                      onClick={onRefresh}
                      className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
                      title={loc.refreshTitle}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded bg-indigo-500/5 border border-indigo-500/10 w-fit">
                    <span className="text-indigo-400 font-bold">{loc.instructionTitle}</span>
                    {loc.instructionDesc}
                  </p>
                </form>
              )}

              {/* public template presets */}
              {connectionType === 'https' && (
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">{loc.quickRepoTemplates}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('https://github.com/octocat/Spoon-Knife.git')}
                    className="px-1.5 py-0.5 bg-slate-900 hover:bg-indigo-950/40 text-indigo-400 hover:text-indigo-300 rounded border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Spoon-Knife.git (Chỉ 200KB)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('https://github.com/expressjs/express.git')}
                    className="px-1.5 py-0.5 bg-slate-900 hover:bg-indigo-950/40 text-indigo-400 hover:text-indigo-300 rounded border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Express.git (Nhanh)
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1">
              {loc.repoStatus}{' '}
              {repoState.isValid ? (
                <span className="text-emerald-400 flex items-center gap-0.5 font-semibold">● {loc.valid}</span>
              ) : (
                <span className="text-rose-400 flex items-center gap-0.5 font-semibold">● {translate('not_git_repo', tone, undefined, useEmoji)}</span>
              )}
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              Active Path:{' '}
              <span className="text-slate-300 px-1 py-0.2 bg-slate-950 rounded border border-slate-800 text-[10px] max-w-[150px] truncate" title={repoState.repoPath === '🤖 [Playground Giả lập]' && tone === TranslationTone.ENGLISH ? '🤖 [Playground Simulation]' : repoState.repoPath}>
                {repoState.repoPath === '🤖 [Playground Giả lập]' && tone === TranslationTone.ENGLISH ? '🤖 [Playground Simulation]' : (repoState.repoPath || 'N/A')}
              </span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              {loc.branch} <span className="text-sky-400 font-semibold">{repoState.currentBranch || 'N/A'}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              {loc.changeStatus}{' '}
              {repoState.isDirty ? (
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1 text-[10px]">
                  ⚡ {loc.hasChanges} ({repoState.dirtyFiles.length})
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold">{translate('no_local_changes', tone, undefined, useEmoji)} {loc.clean}</span>
              )}
            </span>
          </div>
        </div>

        {/* Real-time Session Analytics Stats */}
        <div className="lg:col-span-4 flex items-center gap-3 bg-slate-950/50 border border-slate-900 rounded-lg p-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-xs font-mono">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{loc.sessionStats}</div>
            <div className="text-slate-200 mt-0.5">
              {loc.rebaseCountLabel} <span className="text-emerald-400 font-semibold">{stats.rebaseCount} {loc.times}</span>
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5">
              {loc.sessionStarted} {stats.firstRun} {stats.lastRun ? `(${loc.lastRun}: ${stats.lastRun})` : ''}
            </div>
          </div>
        </div>

      </div>

      {/* Custom Directory Browser Fallback Modal */}
      <DirectoryBrowserModal
        isOpen={isDirBrowserOpen}
        onClose={() => setIsDirBrowserOpen(false)}
        initialPath={editingPath}
        onSelect={(selectedPath) => {
          setEditingPath(selectedPath);
          onUpdateRepoPath(selectedPath);
        }}
      />

      {/* Dynamic Custom Update Modal (Solution 2) */}
      {showUpdateModal && updateInfo && (
        <div id="update-modal-backdrop" className="fixed inset-0 bg-[#02040d]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in animate-duration-200">
          <div id="update-modal-container" className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 shadow-2xl max-w-md w-full relative overflow-hidden">
            
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-full blur-2xl" />

            {/* Modal Title */}
            <h3 className="text-sm font-semibold text-slate-300 font-mono tracking-wider uppercase border-b border-slate-850 pb-3 flex items-center gap-2">
              <span>🚀</span> {translate('update_modal_title', tone, undefined, useEmoji)}
            </h3>

            {/* Release Version Header */}
            <div className="mt-4 flex items-center justify-between bg-slate-950/60 rounded-lg p-3 border border-slate-900">
              <div className="text-xs">
                <span className="text-slate-500 font-mono">Current:</span>{' '}
                <span className="text-slate-400 font-bold font-mono">{updateInfo.currentVersion}</span>
              </div>
              <div className="text-xs">
                <span className="text-emerald-500 font-mono font-bold">Latest:</span>{' '}
                <span className="text-emerald-400 font-bold font-mono text-sm">{updateInfo.latestVersion}</span>
              </div>
            </div>

            {/* Release Changelog Title */}
            <div className="mt-4 text-xs font-semibold text-slate-400 font-mono uppercase">
              {translate('update_found_title', tone, undefined, useEmoji)}
            </div>

            {/* Changelog text notes */}
            <div className="mt-2 bg-slate-950 border border-slate-900/80 rounded-lg p-3 text-xs max-h-36 overflow-y-auto block-custom no-scrollbar text-slate-300 font-sans leading-relaxed">
              <p className="font-semibold text-slate-200 mb-1 leading-snug">
                {updateInfo.releaseName}
              </p>
              <div className="text-slate-400 whitespace-pre-line border-t border-slate-900/60 pt-2 mt-2 font-sans text-[11px]">
                {updateInfo.releaseNotes}
              </div>
            </div>

            {/* Download Progress Bar */}
            {downloadingUpdate && (
              <div className="mt-5 bg-slate-950 border border-slate-900 p-3.5 rounded-lg">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {applyingUpdate 
                      ? translate('update_applying', tone, undefined, useEmoji)
                      : translate('update_downloading', tone, { percent: downloadProgressValue }, useEmoji)}
                  </span>
                  <span>{downloadProgressValue}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850/50">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                    style={{ width: `${downloadProgressValue}%` }}
                  />
                </div>
              </div>
            )}

            {/* Inline update errors */}
            {updateError && (
              <div className="mt-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded-lg font-sans">
                {translate('update_failed', tone, { error: updateError }, useEmoji)}
              </div>
            )}

            {/* Modal Controls */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-850 pt-4">
              {!downloadingUpdate && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors cursor-pointer animate-duration-150 active:scale-95"
                  >
                    {translate('update_later_btn', tone, undefined, useEmoji)}
                  </button>
                  <button
                    type="button"
                    onClick={handleStartDownload}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📥</span>
                    {translate('update_download_btn', tone, undefined, useEmoji)}
                  </button>
                </>
              )}
              {downloadingUpdate && (
                <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider animate-pulse py-2">
                  {applyingUpdate ? 'FINISHING INSTALLATION...' : 'FETCHING PAYLOAD...'}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
