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
  TrendingUp
} from 'lucide-react';
import { TranslationTone, GitRepoState, SessionStats } from '../types';
import { translate } from '../i18n';

interface RepoHeaderProps {
  repoState: GitRepoState;
  stats: SessionStats;
  tone: TranslationTone;
  useEmoji: boolean;
  isSimulation: boolean;
  onSetTone: (t: TranslationTone) => void;
  onToggleEmoji: () => void;
  onToggleSimulation: (val: boolean) => void;
  onUpdateRepoPath: (path: string) => void;
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
    lastRun: "Lần cuối"
  },
  [TranslationTone.JOKE]: {
    subtitle: "Bệ phóng dọn rác git commit và nén luồng mượt mà như lụa sếp ơi! 🚀",
    repoPathPlaceholder: "Nhập ổ code cần trục vớt nè sếp...",
    refreshTitle: "Bơm lại dữ liệu 🔄",
    repoStatus: "Sức khỏe ổ code:",
    valid: "Ngon nghẻ đét",
    branch: "Nhánh đậu:",
    changeStatus: "Mức biến động:",
    hasChanges: "BIẾN ĐỘNG MỚI",
    clean: "Sạch bóng",
    sessionStats: "BẢNG VÀNG THÀNH TÍCH 🌟",
    rebaseCountLabel: "Đã nén tà thuật:",
    times: "phát",
    sessionStarted: "Lên sóng lúc:",
    lastRun: "Mới múa"
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
    lastRun: "Ngoáy mông cuối"
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
    lastRun: "Last"
  }
};

export default function RepoHeader({
  repoState,
  stats,
  tone,
  useEmoji,
  isSimulation,
  onSetTone,
  onToggleEmoji,
  onToggleSimulation,
  onUpdateRepoPath,
  onRefresh
}: RepoHeaderProps) {
  const [editingPath, setEditingPath] = React.useState(repoState.repoPath || '.');
  const loc = headerLoc[tone] || headerLoc[TranslationTone.PROFESSIONAL];

  React.useEffect(() => {
    setEditingPath(repoState.repoPath);
  }, [repoState.repoPath]);

  const handleSubmitPath = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRepoPath(editingPath);
  };

  return (
    <div id="repo-header-container" className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
        {/* Main Title & Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 id="app-main-heading" className="text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
              REBASE OVERLORD
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-sans tracking-normal font-medium animate-pulse">
                v0.3.5 - Web Client
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
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              useEmoji 
                ? 'bg-[#1e293b] border-amber-500/30 text-amber-400 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span>{useEmoji ? '🤪' : '😶'}</span>
            <span>Emoji Mode: {useEmoji ? 'ON' : 'OFF'}</span>
          </button>

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Repo connection form / path status */}
        <div className="lg:col-span-8">
          <form id="repo-path-form" onSubmit={handleSubmitPath} className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs font-mono">
                {isSimulation ? '🤖' : '📁'}
              </span>
              <input
                id="repo-path-input"
                type="text"
                disabled={isSimulation}
                value={editingPath}
                onChange={(e) => setEditingPath(e.target.value)}
                placeholder={loc.repoPathPlaceholder}
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border transition-all duration-150 outline-none ${
                  isSimulation 
                    ? 'bg-slate-950/60 border-slate-900 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-950 border-slate-800 text-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-700'
                }`}
              />
            </div>
            {!isSimulation && (
              <button
                id="save-repo-path-btn"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs text-white rounded-lg font-mono transition-colors border border-indigo-500/20 shadow-md flex items-center gap-1"
              >
                Connect
              </button>
            )}
            <button
                id="refresh-repo-btn"
                type="button"
                onClick={onRefresh}
                className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                title={loc.refreshTitle}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              {loc.repoStatus}{' '}
              {repoState.isValid ? (
                <span className="text-emerald-400 flex items-center gap-0.5">● {loc.valid}</span>
              ) : (
                <span className="text-rose-400 flex items-center gap-0.5">● {translate('not_git_repo', tone, undefined, useEmoji)}</span>
              )}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              {loc.branch} <span className="text-sky-400 font-semibold">{repoState.currentBranch || 'N/A'}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              {loc.changeStatus}{' '}
              {repoState.isDirty ? (
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1 text-[10px]">
                  ⚡ {loc.hasChanges} ({repoState.dirtyFiles.length})
                </span>
              ) : (
                <span className="text-emerald-400">{translate('no_local_changes', tone, undefined, useEmoji)} {loc.clean}</span>
              )}
            </span>
          </div>
        </div>

        {/* Real-time Session Analytics Stats */}
        <div className="lg:col-span-4 flex items-center gap-3 bg-slate-950/50 border border-slate-900 rounded-lg p-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400">
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
    </div>
  );
}
