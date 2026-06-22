/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  GitBranch, 
  HelpCircle, 
  Settings, 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  GitMerge, 
  History, 
  TrendingUp, 
  Terminal as TerminalIcon,
  Laptop,
  Check,
  Copy,
  Calendar,
  Zap,
  Github,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Hand,
  MousePointer,
  RefreshCw,
  Move,
  Eye,
  EyeOff,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Columns,
  AlignLeft,
  AlignRight,
  Layers,
  Keyboard
} from 'lucide-react';

import { 
  TranslationTone, 
  GitRepoState, 
  WizardState, 
  SessionStats, 
  Commit, 
  ConflictFile 
} from './types';
import { translate } from './i18n';
import { getApiHeaders } from './utils/apiKeyHelper';

// Modules
import RepoHeader from './features/repo/RepoHeader';
import SettingsModal from './components/SettingsModal';
import WizardPanel from './features/wizard/WizardPanel';
import BranchPanel from './features/repo/BranchPanel';
import TerminalPanel from './features/terminal/TerminalPanel';
import ConflictSolver from './features/doctor/ConflictSolver';
import GitVisualizerPanel from './features/visualizer/GitVisualizerPanel';
import AiDoctorFloatingChat from './features/doctor/AiDoctorFloatingChat';
import ReflogRescuePanel from './features/reflog/ReflogRescuePanel';
import StashPanel from './features/repo/StashPanel';
import { resolveApiUrl } from './utils/apiResolver';

// Locales and visualizer subcomponents
import { sanityLoc, staleWarningLoc, tooltipTexts } from './features/doctor/sanityLocales';
import CommitNodeCard from './features/visualizer/CommitNodeCard';

async function safeParseError(res: Response, fallbackMsg: string): Promise<string> {
  try {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data.error || data.details || fallbackMsg;
    } catch {
      return `HTTP ${res.status}: ${text.substring(0, 150)}`;
    }
  } catch (err: any) {
    return `${fallbackMsg} (${err.message})`;
  }
}

export default function App() {
  // Configs persistent states with localStorage fallback
  const [tone, setTone] = React.useState<TranslationTone>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_tone');
      if (saved && Object.values(TranslationTone).includes(saved as TranslationTone)) {
        return saved as TranslationTone;
      }
    } catch (e) {}
    return TranslationTone.PROFESSIONAL;
  });

  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    // Tự động đổi giao diện light mode/dark mode theo thời gian sáng tối khi khởi động
    // Từ 7h tối (19:00) đến 7h sáng (07:00) => tối (dark). Các thời gian còn lại => sáng (light)
    try {
      const hours = new Date().getHours();
      return (hours >= 19 || hours < 7) ? 'dark' : 'light';
    } catch (e) {}
    return 'dark';
  });

  const [useEmoji, setUseEmoji] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_use_emoji');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const [isSimulation, setIsSimulation] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_is_simulation');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [simScenarioId, setSimScenarioId] = React.useState<'linear' | 'nonlinear' | 'rewrite' | 'stale' | 'detached' | 'large_history' | 'large_nonlinear' | 'powerbi'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_sim_scenario_id') as any;
      if (['linear', 'nonlinear', 'rewrite', 'stale', 'detached', 'large_history', 'large_nonlinear', 'powerbi'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'linear';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_scenario_id', simScenarioId);
    } catch (e) {}
  }, [simScenarioId]);

  const [isAiEnabled, setIsAiEnabled] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_is_ai_enabled');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const [showLogPanel, setShowLogPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_log_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [showWarningsPanel, setShowWarningsPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_warnings_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [showGraphTimeline, setShowGraphTimeline] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_graph_timeline');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_graph_timeline', String(showGraphTimeline));
    } catch (e) {}
  }, [showGraphTimeline]);


  // Interactive Commit Graph Controls
  const [zoomScale, setZoomScale] = React.useState<number>(1.0);
  const [nodeWidth, setNodeWidth] = React.useState<number>(180);
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({});
  const [isGraphVertical, setIsGraphVertical] = React.useState<boolean>(true);
  const [activeTool, setActiveTool] = React.useState<'pan' | 'dragNode'>('dragNode');
  const [resetKey, setResetKey] = React.useState<number>(0);

  // Dense graph handle with pagination, limits, and search filtering
  const [maxVisibleCommits, setMaxVisibleCommits] = React.useState<number | 'all'>(10);
  const [commitPageOffset, setCommitPageOffset] = React.useState<number>(0);
  const [commitSearchTerm, setCommitSearchTerm] = React.useState<string>('');
  const [copiedCurrentBranch, setCopiedCurrentBranch] = React.useState<boolean>(false);

  // File changes preview tooltip state
  const [hoveredSha, setHoveredSha] = React.useState<string | null>(null);
  const [commitFiles, setCommitFiles] = React.useState<Record<string, { filepath: string; status: 'modified' | 'added' | 'deleted' }[]>>({});
  const [loadingFilesShas, setLoadingFilesShas] = React.useState<Record<string, boolean>>({});

  const [isCloning, setIsCloning] = React.useState<boolean>(false);
  const [isFetchingGlobal, setIsFetchingGlobal] = React.useState<boolean>(false);

  // Easter Eggs Toast system
  interface ActiveToast {
    id: string;
    type: 'info' | 'success' | 'warn' | 'error' | 'milestone' | 'owl' | 'rage' | 'spam';
    title: string;
    message: string;
    emoji?: string;
  }
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);
  const triggerToast = React.useCallback((type: ActiveToast['type'], title: string, message: string, emoji?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, message, emoji }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  }, []);

  // Night Owl state
  const [isNightOwl, setIsNightOwl] = React.useState<boolean>(() => {
    const hr = new Date().getHours();
    return hr >= 23 || hr <= 4;
  });
  const [showNightOwlBanner, setShowNightOwlBanner] = React.useState<boolean>(true);

  // Modern dashboard Mode Switcher state
  const [dashboardMode, setDashboardMode] = React.useState<'daily' | 'rescue' | 'learning'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_dashboard_mode');
      if (saved === 'daily' || saved === 'rescue' || saved === 'learning') {
        return saved;
      }
    } catch (e) {}
    return 'daily';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_dashboard_mode', dashboardMode);
    } catch (e) {}
  }, [dashboardMode]);

  // Custom API configuration for serverless deployment fallback (Vercel, GitHub Pages, etc.)
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'connected' | 'unreachable'>('checking');
  const [customBackendUrl, setCustomBackendUrl] = React.useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('rebase_overlord_backend_url')) || '';
  });

  const [appVersion, setAppVersion] = React.useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('rebase_overlord_patch_version')) || '1.12.0';
  });

  // New States for Update Verification & Diagnostics
  const [updateMismatchError, setUpdateMismatchError] = React.useState<string | null>(null);
  const [isVersionRed, setIsVersionRed] = React.useState(false);
  const [verifyBtnVisible, setVerifyBtnVisible] = React.useState(false);
  const [updateFailedModal, setUpdateFailedModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    exitCode?: number | null;
  } | null>(null);

  // States for stale branch warning and auto-migration
  const [staleBranchWarning, setStaleBranchWarning] = React.useState<{
    name: string;
    age: string;
    lastCommitDate: string;
  } | null>(null);
  const [staleMigrateBase, setStaleMigrateBase] = React.useState<string>('develop');
  const [staleMigrateNewName, setStaleMigrateNewName] = React.useState<string>('');
  const [isStaleMigrating, setIsStaleMigrating] = React.useState<boolean>(false);

  // Helper inside component to check if a branch is older than 7 days
  const isBranchStale = React.useCallback((lastCommitDate: string | undefined): boolean => {
    if (!lastCommitDate) return false;
    try {
      const commitTime = new Date(lastCommitDate).getTime();
      if (isNaN(commitTime)) return false;
      const nowTime = Math.max(new Date().getTime(), new Date("2026-06-15").getTime()); 
      const diffDays = (nowTime - commitTime) / (1000 * 60 * 60 * 24);
      return diffDays > 7;
    } catch (_) {
      return false;
    }
  }, []);
  const isUpgraded = React.useMemo(() => {
    const cleanVersion = appVersion.replace(/^v/, '');
    const parts = cleanVersion.split('.').map(v => parseInt(v, 10) || 0);
    // Baseline is 1.12.0; any version greater than that is an upgrade
    if (parts[0] > 1) return true;
    if (parts[0] === 1) {
      if (parts[1] > 12) return true;
      if (parts[1] === 12 && parts[2] > 0) return true;
    }
    return false;
  }, [appVersion]);

  const sloc = sanityLoc[tone];

  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  // TECH ISSUE-006: Electron Desktop/IDE Native Experience states
  const [dockTerminalPosition, setDockTerminalPosition] = React.useState<'right' | 'bottom'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_dock_terminal');
      return saved === 'bottom' ? 'bottom' : 'right';
    } catch (_) { return 'right'; }
  });
  const [sidebarPosition, setSidebarPosition] = React.useState<'right' | 'left'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_sidebar_position');
      return saved === 'left' ? 'left' : 'right';
    } catch (_) { return 'right'; }
  });
  const [workspaceLayout, setWorkspaceLayout] = React.useState<'split' | 'fullscreen'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_workspace_layout');
      return saved === 'fullscreen' ? 'fullscreen' : 'split';
    } catch (_) { return 'split'; }
  });
  const [showShortcutCheatSheet, setShowShortcutCheatSheet] = React.useState<boolean>(false);
  const [detachedWindows, setDetachedWindows] = React.useState<{ id: string; title: string; type: 'commits' | 'visualizer' | 'diagnostics' | 'shortcuts' | 'terminal'; x: number; y: number; width?: number; height?: number }[]>([]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_dock_terminal', dockTerminalPosition);
    } catch (_) {}
  }, [dockTerminalPosition]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sidebar_position', sidebarPosition);
    } catch (_) {}
  }, [sidebarPosition]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_workspace_layout', workspaceLayout);
    } catch (_) {}
  }, [workspaceLayout]);

  // Global Shortcut listener for Electron native desktop feel
  React.useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Ctrl + I (or Meta + I) for Command Palette (Dispatch custom event so Floating Chat opens)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-ai-doctor'));
        return;
      }

      // If user is inside an input, only support Ctrl+K and Ctrl+I triggers, ignore other single-hotkeys or Alt-hotkeys to prevent collision
      if (isInput) return;

      // Alt + 1: Daily tab
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setDashboardMode('daily');
        triggerToast('info', '⌨️ Alt+1 SHORTCUT', 'Chuyển sang màn hình Developer Daily thành công!', '💻');
      }
      // Alt + 2: Rescue tab
      else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setDashboardMode('rescue');
        triggerToast('info', '⌨️ Alt+2 SHORTCUT', 'Chuyển sang màn hình khôi phục Git Rescue / Reflog!', '🚑');
      }
      // Alt + 3: Learning tab
      else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setDashboardMode('learning');
        triggerToast('info', '⌨️ Alt+3 SHORTCUT', 'Chuyển sang Sa bàn mô phỏng trực quan & Wizard!', '🏫');
      }
      // Alt + T: Clear logs
      else if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setLogs([]);
        triggerToast('milestone', '🧹 Alt+T LOGS CLEARED', 'Lịch sử dòng lệnh Terminal đã được dọn dẹp sạch sẽ!', '✨');
      }
      // Alt + D: Toggle dock terminal position
      else if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDockTerminalPosition(prev => {
          const next = prev === 'right' ? 'bottom' : 'right';
          triggerToast('info', '⌨️ Alt+D SHORTCUT', `Đã di chuyển Panel Terminal & Logs xuống: ${next.toUpperCase()}`, '⚓');
          return next;
        });
      }
      // Alt + S: Toggle sidebar alignment
      else if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSidebarPosition(prev => {
          const next = prev === 'right' ? 'left' : 'right';
          triggerToast('info', '⌨️ Alt+S SHORTCUT', `Đã chuyển thanh Sidebar sang bên: ${next.toUpperCase()}`, '🎛️');
          return next;
        });
      }
      // Alt + W: Toggle workspace layout split vs fullscreen
      else if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setWorkspaceLayout(prev => {
          const next = prev === 'split' ? 'fullscreen' : 'split';
          triggerToast('info', '⌨️ Alt+W SHORTCUT', `Đã đổi chế độ bố cục màn hình: ${next.toUpperCase()}`, '🖥️');
          return next;
        });
      }
      // Alt + J: Detach current view / open custom window
      else if (e.altKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        // Spawn a detached floating window
        const randomX = 100 + Math.random() * 150;
        const randomY = 100 + Math.random() * 150;
        const types: ('commits' | 'visualizer' | 'diagnostics' | 'shortcuts')[] = ['commits', 'diagnostics', 'shortcuts'];
        const activeType = types[detachedWindows.length % types.length];
        const titles = {
          commits: '🌳 Detached Git Commit Graph',
          diagnostics: '🩺 Detached Live Diagnostician',
          shortcuts: '⌨️ Shortcuts Quick Reference Window'
        };
        const newWin = {
          id: `win-${Date.now()}`,
          title: titles[activeType],
          type: activeType,
          x: randomX,
          y: randomY,
          width: 440,
          height: 380
        };
        setDetachedWindows(prev => [...prev, newWin]);
        triggerToast('milestone', '🖥️ MULTI-WINDOW SPAWNED', `Đã mở một cửa sổ phụ phác đồ: ${titles[activeType]}`, '🪟');
      }
      // Alt + H or Alt + / (e.g. e.key === '?'): Toggle Help Cheat Sheet
      else if (e.altKey && (e.key.toLowerCase() === 'h' || e.key === '/' || e.key === '?')) {
        e.preventDefault();
        setShowShortcutCheatSheet(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [detachedWindows, triggerToast]);

  const handleDragWindowStart = (e: React.PointerEvent, windowId: string) => {
    e.preventDefault();
    const activeWindow = document.getElementById(`detached-win-${windowId}`);
    if (!activeWindow) return;
    activeWindow.setPointerCapture(e.pointerId);
    
    // Get initial cursor offset
    const startX = e.clientX;
    const startY = e.clientY;
    const winObj = detachedWindows.find(w => w.id === windowId);
    if (!winObj) return;
    const initialX = winObj.x;
    const initialY = winObj.y;
    
    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setDetachedWindows(prev => prev.map(w => {
        if (w.id === windowId) {
          return {
            ...w,
            x: Math.max(10, Math.min(window.innerWidth - 300, initialX + deltaX)),
            y: Math.max(10, Math.min(window.innerHeight - 200, initialY + deltaY))
          };
        }
        return w;
      }));
    };
    
    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        activeWindow.releasePointerCapture(upEvent.pointerId);
      } catch (_) {}
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Core Git States with localStorage fallback
  const [repoState, setRepoState] = React.useState<GitRepoState>(() => {
    const defaultBase = localStorage.getItem('default_base_branch') || 'develop';
    try {
      const saved = localStorage.getItem('rebase_overlord_repo_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.baseBranch) {
          parsed.baseBranch = defaultBase;
        }
        return parsed;
      }
    } catch (e) {}
    return {
      repoPath: '.',
      isValid: true,
      currentBranch: 'feature/payment-v2',
      baseBranch: defaultBase,
      isDirty: true,
      dirtyFiles: [
        'src/routes/payment.ts',
        'src/services/stripe.ts',
        'config/keys.json',
        'src/components/ConflictSolver.tsx',
        'package.json'
      ],
      branches: [],
      commits: [],
      rebaseInProgress: false,
      mergeInProgress: false,
      conflicts: [],
      ghAvailable: true,
      ghErrorKey: '',
      commandHistory: [],
      stashes: []
    };
  });

  // Session stats state
  const [stats, setStats] = React.useState<SessionStats>({
    rebaseCount: 3,
    firstRun: new Date().toISOString().split('T')[0]
  });

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmBtnClassName?: string;
    iconType?: 'danger' | 'info';
  } | null>(null);

  // Settings Modal open state
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);

  // Detection for mobile to optimize dragging performance on small screen devices
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobileWidth = () => {
      // 768px is standard MD breakpoint
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      if (isMob) {
        setActiveTool('pan');
      }
    };
    checkMobileWidth();
    window.addEventListener('resize', checkMobileWidth);
    return () => window.removeEventListener('resize', checkMobileWidth);
  }, []);

  // Wizard state machine with localStorage fallback
  const [wizard, setWizard] = React.useState<WizardState>(() => {
    const defaultBase = localStorage.getItem('default_base_branch') || 'develop';
    try {
      const saved = localStorage.getItem('rebase_overlord_wizard');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.baseBranch) {
          parsed.baseBranch = defaultBase;
        }
        return parsed;
      }
    } catch (e) {}
    return {
      step: 0,
      baseBranch: defaultBase,
      doFetch: true,
      detectedType: 'clean',
      detectedReason: 'Nhánh gọn gàng, không trùng lặp commits',
      historyType: 'clean',
      basePoint: '',
      commitTotal: 0,
      selectedCommits: [],
      doBackup: true,
      backupBranchName: '',
      finalMsg: 'feat: add payment intent and webhook handles',
      autoPush: false,
      status: 'idle'
    };
  });

  const activeCommitsForSquash = repoState.commits.filter(c => c.selected);

  // Filter commits based on search/filtering (message, author, SHA, type, status)
  const filteredCommitsForSquash = React.useMemo(() => {
    if (!commitSearchTerm.trim()) return activeCommitsForSquash;
    const term = commitSearchTerm.toLowerCase();
    return activeCommitsForSquash.filter(c => 
      c.message.toLowerCase().includes(term) || 
      c.sha.toLowerCase().includes(term) ||
      (c.type && c.type.toLowerCase().includes(term)) ||
      (c.author && c.author.toLowerCase().includes(term))
    );
  }, [activeCommitsForSquash, commitSearchTerm]);

  // Paginated window representing dense layout
  const paginatedCommitsForSquash = React.useMemo(() => {
    if (maxVisibleCommits === 'all') return filteredCommitsForSquash;
    const size = maxVisibleCommits;
    const startIdx = commitPageOffset * size;
    return filteredCommitsForSquash.slice(startIdx, startIdx + size);
  }, [filteredCommitsForSquash, maxVisibleCommits, commitPageOffset]);

  // Adjust page offset if index is out of scope
  React.useEffect(() => {
    if (maxVisibleCommits === 'all') {
      setCommitPageOffset(0);
      return;
    }
    const size = maxVisibleCommits;
    const maxPageIdx = Math.max(0, Math.ceil(filteredCommitsForSquash.length / size) - 1);
    if (commitPageOffset > maxPageIdx) {
      setCommitPageOffset(maxPageIdx);
    }
  }, [filteredCommitsForSquash.length, maxVisibleCommits, commitPageOffset]);

  // Git Branch Metrics (Ahead & Behind metrics analytics)
  const branchMetrics = React.useMemo(() => {
    const currentName = repoState.currentBranch;
    const currentMeta = repoState.branches.find(b => b.name === currentName);
    
    // Fallbacks or real numbers
    let aheadCount = currentMeta?.aheadCount ?? 0;
    let behindCount = currentMeta?.behindCount ?? 0;
    
    // If we have activeCommitsForSquash we can calculate track indices too (track 1 is feature, track 0 is develop)
    const commitsTrack1 = repoState.commits.filter(c => c.selected && c.track === 1);
    const commitsTrack0 = repoState.commits.filter(c => c.track === 0);
    
    if (isSimulation) {
      if (currentName === 'develop') {
        aheadCount = 3;
        behindCount = 2;
      } else if (currentName.startsWith('feature/payment')) {
        aheadCount = commitsTrack1.length || 5;
        behindCount = commitsTrack0.length || 2;
      } else if (currentName === 'feature/auth-oauth') {
        aheadCount = 0;
        behindCount = 3;
      } else {
        aheadCount = commitsTrack1.length || 3;
        behindCount = commitsTrack0.length || 2;
      }
    } else {
      // In real repo mode, use counts or commits calculation compared to the base branch of the repo
      aheadCount = repoState.baseComparison?.ahead ?? commitsTrack1.length;
      behindCount = repoState.baseComparison?.behind ?? commitsTrack0.length;
    }
    
    return {
      ahead: aheadCount,
      behind: behindCount,
      total: repoState.commits.length,
      actionable: activeCommitsForSquash.length
    };
  }, [repoState.commits, repoState.branches, repoState.currentBranch, repoState.baseComparison, isSimulation, activeCommitsForSquash.length]);

  // DOM references for measuring lines connect position dynamic calculation
  const boardRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const cleanupWheelRef = React.useRef<(() => void) | null>(null);

  const setViewportRef = React.useCallback((node: HTMLDivElement | null) => {
    if (cleanupWheelRef.current) {
      cleanupWheelRef.current();
      cleanupWheelRef.current = null;
    }
    
    (viewportRef as any).current = node;

    if (node) {
      let limitCooldown = false;
      const handleWheelEvent = (e: WheelEvent) => {
        e.preventDefault();
        const zoomStep = 0.05;
        setZoomScale(prev => {
          let next = prev + (e.deltaY < 0 ? zoomStep : -zoomStep);
          next = Math.round(next * 100) / 100;

          if (next >= 5.0) {
            if (!limitCooldown) {
              triggerToast('owl', '🔍 CHẠM TRẦN KÍNH LÚP', 'Phóng to cực hạn 500%! Code to như bánh xe bò rồi sếp ơi!', '🦖');
              limitCooldown = true;
              setTimeout(() => { limitCooldown = false; }, 3500);
            }
            return 5.0;
          }
          
          if (next <= 0.15) {
            if (!limitCooldown) {
              triggerToast('info', '🔍 TẦM NHÌN VŨ TRỤ', 'Thu nhỏ kịch sàn 15%! Sắp nhìn thấy cả sơ đồ tổng thể hệ sao rồi!', '🌌');
              limitCooldown = true;
              setTimeout(() => { limitCooldown = false; }, 3505);
            }
            return 0.15;
          }

          return next;
        });
      };

      node.addEventListener('wheel', handleWheelEvent, { passive: false });
      cleanupWheelRef.current = () => {
        node.removeEventListener('wheel', handleWheelEvent);
      };
    }
  }, [triggerToast]);

  const devRef = React.useRef<HTMLDivElement>(null);
  const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  
  const [connections, setConnections] = React.useState<Array<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isDash?: boolean;
  }>>([]);
  
  const [nodeSizes, setNodeSizes] = React.useState<Record<string, { width: number; height: number }>>({});
  const [tick, setTick] = React.useState<number>(0);
  const triggerRenderTick = React.useCallback(() => {
    setTick(t => t + 1);
  }, []);

  const getConnectorPoints = (
    from: { x: number; y: number; w: number; h: number },
    to: { x: number; y: number; w: number; h: number }
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    let startX = from.x;
    let startY = from.y;
    let endX = to.x;
    let endY = to.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal dominated
      if (dx > 0) {
        startX = from.x + from.w / 2;
        endX = to.x - to.w / 2;
      } else {
        startX = from.x - from.w / 2;
        endX = to.x + to.w / 2;
      }
    } else {
      // Vertical dominated
      if (dy > 0) {
        startY = from.y + from.h / 2;
        endY = to.y - to.h / 2;
      } else {
        startY = from.y - from.h / 2;
        endY = to.y + to.h / 2;
      }
    }
    return { startX, startY, endX, endY };
  };

  const updatingConnectionsRef = React.useRef(false);
  const updateConnectionPaths = React.useCallback(() => {
    if (updatingConnectionsRef.current) return;
    updatingConnectionsRef.current = true;
    
    requestAnimationFrame(() => {
      updatingConnectionsRef.current = false;
      const container = boardRef.current;
      const devEl = devRef.current;
      if (!container || !devEl) return;
      
      const containerRect = container.getBoundingClientRect();
      const getCenterAndSize = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left + rect.width / 2 - containerRect.left) / zoomScale;
        const y = (rect.top + rect.height / 2 - containerRect.top) / zoomScale;
        return {
          x,
          y,
          w: rect.width / zoomScale,
          h: rect.height / zoomScale
        };
      };
      
      const list: Array<{ startX: number; startY: number; endX: number; endY: number; isDash?: boolean }> = [];
      const activeCommits = paginatedCommitsForSquash;
      const activeKeys = activeCommits.map(c => c.sha);
      
      if (activeKeys.length > 0) {
        const devNode = getCenterAndSize(devEl);
        
        // Map through all active commits and link to parents
        activeCommits.forEach((c) => {
          const currentEl = nodeRefs.current[c.sha];
          if (!currentEl) return;
          const currentMeta = getCenterAndSize(currentEl);
          
          if (c.parents && c.parents.length > 0) {
            c.parents.forEach((parentSha) => {
              const parentEl = nodeRefs.current[parentSha];
              if (parentEl) {
                const parentMeta = getCenterAndSize(parentEl);
                const pts = getConnectorPoints(currentMeta, parentMeta);
                
                const isCurrentSelected = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
                const isParentSelected = wizard.selectedCommits.includes(parentSha) || wizard.selectedCommits.length === 0;
                
                list.push({
                  startX: pts.startX,
                  startY: pts.startY,
                  endX: pts.endX,
                  endY: pts.endY,
                  isDash: !(isCurrentSelected && isParentSelected)
                });
              }
            });
          } else {
            // Sequential fallback for compatibility and live CLI support
            const idx = activeKeys.indexOf(c.sha);
            if (idx !== -1 && idx < activeKeys.length - 1) {
              const nextSha = activeKeys[idx + 1];
              const nextEl = nodeRefs.current[nextSha];
              if (nextEl) {
                const nextMeta = getCenterAndSize(nextEl);
                const pts = getConnectorPoints(currentMeta, nextMeta);
                
                const isCurrentSelected = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
                const isNextSelected = wizard.selectedCommits.includes(nextSha) || wizard.selectedCommits.length === 0;
                
                list.push({
                  startX: pts.startX,
                  startY: pts.startY,
                  endX: pts.endX,
                  endY: pts.endY,
                  isDash: !(isCurrentSelected && isNextSelected)
                });
              }
            }
          }
        });
        
        // Connect develop HEAD
        const track0Commits = activeCommits.filter(c => c.track === 0);
        let targetDevConnectSha = track0Commits.length > 0 ? track0Commits[0].sha : null;
        if (!targetDevConnectSha) {
          targetDevConnectSha = activeKeys[activeKeys.length - 1];
        }
        
        const targetDevConnectEl = targetDevConnectSha ? nodeRefs.current[targetDevConnectSha] : null;
        if (targetDevConnectEl) {
          const targetNode = getCenterAndSize(targetDevConnectEl);
          const pts = getConnectorPoints(devNode, targetNode);
          list.push({
            startX: pts.startX,
            startY: pts.startY,
            endX: pts.endX,
            endY: pts.endY
          });
        }
      }
      
      setConnections(list);
    });
  }, [paginatedCommitsForSquash, wizard.selectedCommits, zoomScale, nodeWidth, resetKey, isGraphVertical]);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      updateConnectionPaths();
    });
    return () => cancelAnimationFrame(handle);
  }, [updateConnectionPaths, tick, isGraphVertical, resetKey]);

  React.useEffect(() => {
    window.addEventListener('resize', updateConnectionPaths);
    return () => {
      window.removeEventListener('resize', updateConnectionPaths);
    };
  }, [updateConnectionPaths]);

  // Handle Drag size resize event of node
  const handleResizeStart = (e: React.PointerEvent, sha: string, direction: 'w' | 'h' | 'both') => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const isExpanded = !!expandedNodes[sha];
    const startWidth = nodeSizes[sha]?.width ?? nodeWidth;
    const startHeight = nodeSizes[sha]?.height ?? (isExpanded ? 140 : 80);
    
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoomScale;
      const deltaY = (moveEvent.clientY - startY) / zoomScale;
      
      setNodeSizes(prev => {
        const currentWidth = prev[sha]?.width ?? nodeWidth;
        const currentHeight = prev[sha]?.height ?? (isExpanded ? 140 : 80);
        return {
          ...prev,
          [sha]: {
            width: direction === 'h' ? currentWidth : Math.max(120, Math.min(600, startWidth + deltaX)),
            height: direction === 'w' ? currentHeight : Math.max(60, Math.min(400, startHeight + deltaY))
          }
        };
      });
      triggerRenderTick();
    };
    
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const [isTouchOnly, setIsTouchOnly] = React.useState<boolean>(false);
  React.useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchOnly(isTouch);
  }, []);

  const touchStartDistance = React.useRef<number | null>(null);
  const touchStartScale = React.useRef<number>(1.0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartDistance.current = dist;
      touchStartScale.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchStartDistance.current;
      const targetScale = Math.min(2.0, Math.max(0.5, touchStartScale.current * ratio));
      setZoomScale(targetScale);
      updateConnectionPaths();
      triggerRenderTick();
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  // Log buffer for terminal with localStorage fallback
  const [logs, setLogs] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_logs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      '// Rebase Overlord Engine v0.3.5 activated.',
      '// Welcome aboard Nguyen Tran. Tone: Professional VN.'
    ];
  });

  // Add line to terminal
  const addLog = React.useCallback((line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${line}`]);
  }, []);

  // Fetch files changed for a given commit SHA
  const fetchCommitFiles = React.useCallback(async (sha: string) => {
    if (commitFiles[sha] || loadingFilesShas[sha]) {
      return;
    }
    setLoadingFilesShas(prev => ({ ...prev, [sha]: true }));
    try {
      const url = resolveApiUrl(`/api/commit-changes?sha=${sha}&simulation=${isSimulation}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch commit files');
      }
      const data = await res.json();
      setCommitFiles(prev => ({ ...prev, [sha]: data.files || [] }));
    } catch (err) {
      console.error('Error fetching commit files:', err);
      // Suppress error and put empty files so we don't loading forever
      setCommitFiles(prev => ({ ...prev, [sha]: [] }));
    } finally {
      setLoadingFilesShas(prev => ({ ...prev, [sha]: false }));
    }
  }, [commitFiles, loadingFilesShas, isSimulation]);

  // Animated Git Doctor states
  const [doctorProblem, setDoctorProblem] = React.useState<string | null>(null);
  const [doctorLoading, setDoctorLoading] = React.useState<boolean>(false);
  const [doctorDiagnosis, setDoctorDiagnosis] = React.useState<{
    dr_overlord: { explanation: string; mitigation: string };
    dr_compiler?: { explanation: string; mitigation: string };
    dr_schema?: { explanation: string; mitigation: string };
  } | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = React.useState<'overlord' | 'compiler' | 'schema'>('overlord');
  const [doctorError, setDoctorError] = React.useState<string | null>(null);

  // Simulated Anomalies State
  const [isDivergedSimulated, setIsDivergedSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_diverged') !== 'false';
    } catch (e) {
      return true;
    }
  });
  const [isDetachedHeadSimulated, setIsDetachedHeadSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_detached') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isStaleBaseSimulated, setIsStaleBaseSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_stale') !== 'false';
    } catch (e) {
      return true;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_diverged', String(isDivergedSimulated));
    } catch (e) {}
  }, [isDivergedSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_detached', String(isDetachedHeadSimulated));
    } catch (e) {}
  }, [isDetachedHeadSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_stale', String(isStaleBaseSimulated));
    } catch (e) {}
  }, [isStaleBaseSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_theme', theme);
    } catch (e) {}
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    }
  }, [theme]);

  // Side effects to seamlessly persist states inside localStorage on changes
  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_tone', tone);
    } catch (e) {}
  }, [tone]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_use_emoji', String(useEmoji));
    } catch (e) {}
  }, [useEmoji]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_is_simulation', String(isSimulation));
    } catch (e) {}
  }, [isSimulation]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_is_ai_enabled', String(isAiEnabled));
    } catch (e) {}
  }, [isAiEnabled]);

  const handleToggleAiMode = React.useCallback(() => {
    // Check if API key is present
    const hasKey = !!localStorage.getItem('gemini_api_key')?.trim();
    if (!hasKey) {
      if (!isAiEnabled) {
        setConfirmModal({
          isOpen: true,
          title: translate('missing_api_key_title', tone),
          message: translate('missing_api_key_desc', tone),
          confirmText: translate('missing_api_key_confirm', tone),
          cancelText: translate('missing_api_key_not_now', tone),
          confirmBtnClassName: 'bg-indigo-600 hover:bg-indigo-505 border-indigo-500/25 shadow-md',
          iconType: 'info',
          onConfirm: () => {
            setIsSettingsOpen(true);
          }
        });
        return;
      }
    }

    const newVal = !isAiEnabled;
    setIsAiEnabled(newVal);
    addLog(newVal ? '🤖 AI Engine Enabled (Full AI Features activated)' : '🤖 AI Engine Disabled (Cost saved - falling back to offline mode)');
    
    if (newVal) {
      triggerToast('success', '🧠 BRAIN EXTENSION ENABLED', 'Đã nhồi thêm hàng tỷ nơ-ron từ mô hình sinh mẫu trợ lý trí tuệ nhân tạo thông minh!', '🤖');
    } else {
      triggerToast('warn', '🔌 COMPUTE COST SAVER', 'Trợ lý AI đã chuyển sang chẩn đoán ngoại tuyến (Offline rules) để tiết kiệm chi phí cho bạn.', '🔌');
    }
  }, [isAiEnabled, tone]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_log_panel', String(showLogPanel));
    } catch (e) {}
  }, [showLogPanel]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_warnings_panel', String(showWarningsPanel));
    } catch (e) {}
  }, [showWarningsPanel]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_repo_state', JSON.stringify(repoState));
    } catch (e) {}
  }, [repoState]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_wizard', JSON.stringify(wizard));
    } catch (e) {}
  }, [wizard]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_logs', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  // Fetch metrics upon settings updates
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [checkingOutBranch, setCheckingOutBranch] = React.useState<string | null>(null);
  const handleRefresh = React.useCallback(async (overrideSim?: boolean, customBase?: string) => {
    setIsRefreshing(true);
    try {
      const activeSim = overrideSim !== undefined ? overrideSim : isSimulation;
      const baseVal = customBase !== undefined ? customBase : (wizard.baseBranch || 'develop');
      addLog(`$ Refreshing git states (Simulation: ${activeSim}, Scenario: ${simScenarioId}, Base branch: ${baseVal})...`);
      const url = resolveApiUrl(`/api/git-status?simulation=${activeSim}&scenario=${simScenarioId}&baseBranch=${encodeURIComponent(baseVal)}`);
      const res = await fetch(url);
      
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) {
        throw new Error(`Máy chủ trả về trang HTML thay vì JSON (Code ${res.status}). Có thể bạn đang chạy trên Vercel/Static Host mà chưa bật Express Backend.`);
      }
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Đầu ra API lỗi, không chứa JSON hợp lệ. Response: "${text.substring(0, 50)}..."`);
      }

      setRepoState(data);
      setBackendStatus('connected');

      // Align wizard state if a rebase was aborted or finished outside of the app
      if (!data.rebaseInProgress) {
        setWizard(prev => {
          if (prev.status === 'paused_conflict' || prev.status === 'running') {
            // Needs to log within state update, but we can do it safely
            setTimeout(() => {
              addLog(`🔙 Wizard synchronized: Rebase progress was terminated outside the application.`);
            }, 50);
            return {
              ...prev,
              status: 'idle',
              step: 0
            };
          }
          return prev;
        });
      }
      
      // Auto-increment checkout stats locally on initial fetch
      if (data.isValid) {
        addLog(`✓ Git states extracted cleanly for path: ${data.repoPath}`);
      } else {
        addLog(`! Path does not contain a valid Git repository.`);
      }
    } catch (err: any) {
      console.error(err);
      addLog(`⚠️ Cảnh báo kết nối: ${err.message}`);
      
      // Auto toggle simulation on to let interface keep working
      if (overrideSim === undefined && !isSimulation) {
        setIsSimulation(true);
        addLog(`🤖 Đã tự động kích hoạt "Simulation Playground" do Backend không phản hồi chính xác JSON.`);
      }
      setBackendStatus('unreachable');
    } finally {
      setIsRefreshing(false);
    }
  }, [isSimulation, simScenarioId, addLog, wizard.baseBranch]);

  React.useEffect(() => {
    if (isSimulation) {
      if (simScenarioId === 'linear') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'nonlinear') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'rewrite') {
        setIsDivergedSimulated(true);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'stale') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(true);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'detached') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(true);
      }
      handleRefresh();
    }
  }, [simScenarioId, isSimulation]);

  const quietRefresh = React.useCallback(async () => {
    try {
      const url = resolveApiUrl(`/api/git-status?simulation=false&baseBranch=${encodeURIComponent(wizard.baseBranch || 'develop')}`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRepoState(data);

        // Align wizard state in background if rebase stopped externally
        if (!data.rebaseInProgress) {
          setWizard(prev => {
            if (prev.status === 'paused_conflict' || prev.status === 'running') {
              setTimeout(() => {
                addLog(`🔙 Background auto-sync: Rebase progress was terminated outside the application.`);
              }, 50);
              return {
                ...prev,
                status: 'idle',
                step: 0
              };
            }
            return prev;
          });
        }
      }
    } catch (err) {
      // quiet fail
    }
  }, [wizard.baseBranch]);

  // Background polling during real active rebase operations to track external aborts or progress
  React.useEffect(() => {
    if (isSimulation) return;
    
    const shouldPoll = repoState.rebaseInProgress || wizard.status === 'paused_conflict' || wizard.status === 'running';
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      quietRefresh();
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSimulation, repoState.rebaseInProgress, wizard.status, quietRefresh]);

  // Trigger to reload auto-fetch configuration
  const [autoFetchTrigger, setAutoFetchTrigger] = React.useState(0);

  // Periodic background origin auto-fetch
  React.useEffect(() => {
    if (isSimulation || !repoState.repoPath || !repoState.isValid) return;

    const autoFetchEnabled = localStorage.getItem('auto_fetch_enabled') !== 'false';
    const autoFetchIntervalStr = localStorage.getItem('auto_fetch_interval') || '300';
    const intervalMs = parseInt(autoFetchIntervalStr, 10) * 1000;

    if (!autoFetchEnabled || intervalMs <= 0) return;

    const intervalId = setInterval(async () => {
      addLog(`🔄 [Auto-Fetch] Running periodic remote synchronization (origin fetch)...`);
      try {
        const url = resolveApiUrl(`/api/execute-command`);
        await fetch(url, {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({
            command: `git fetch origin`
          })
        });
        await quietRefresh();
      } catch (err) {
        // Quiet fail
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSimulation, repoState.repoPath, repoState.isValid, quietRefresh, addLog, autoFetchTrigger]);

  // Sync statistics from node server
  const fetchStats = async () => {
    try {
      const res = await fetch(resolveApiUrl('/api/stats'));
      if (res.ok) {
        const data = await res.json();
        setStats({
          rebaseCount: data.rebase_count !== undefined ? data.rebase_count : (data.rebaseCount ?? 0),
          firstRun: data.first_run !== undefined ? data.first_run : (data.firstRun ?? ''),
          lastRun: data.last_run !== undefined ? data.last_run : data.lastRun
        });
      }
    } catch {
      // Fallback
    }
  };

  const verifyInstallationWithMetadata = React.useCallback(async (triggerManualPrompt = false) => {
    try {
      const res = await fetch(resolveApiUrl('/api/update/metadata'));
      if (res.ok) {
        const metadata = await res.json();
        
        // If the filesystem report is clean/original (untouched fresh install), we are in alignment
        if (metadata.status === 'original') {
          setIsVersionRed(false);
          setVerifyBtnVisible(false);
          if (triggerManualPrompt) {
            triggerToast(
              'success',
              tone === TranslationTone.ENGLISH ? 'Verification Passed' : 'Xác thực thành công',
              tone === TranslationTone.ENGLISH ? 'Your local space is running a pristine clean setup!' : 'Hệ thống đang chạy bản cài đặt sạch nguyên bản 100%!',
              '✓'
            );
            addLog(`✓ [VERIFY] Pristine standard installation verified (no updates active).`);
          }
          return;
        }

        // Fallback checks for active updates
        const metadataVer = (metadata.version || '1.12.0').replace(/^v/, '');
        const stateVer = appVersion.replace(/^v/, '');
        
        if (metadataVer !== stateVer) {
          setIsVersionRed(true);
          setVerifyBtnVisible(true);
          
          const errMsg = `Update failed/corrupted: Version mismatch! App state is v${appVersion}, but read-only metadata has v${metadata.version || '1.12.0'}.`;
          addLog(`❌ [ERROR] ${errMsg}`);
          console.error(errMsg);
          
          try {
            await fetch(resolveApiUrl('/api/log-error'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: 'Update failed: Local version mismatch at filesystem level',
                version: appVersion,
                expected: metadata.version || '1.12.0'
              })
            });
          } catch (_) {}
          
          if (triggerManualPrompt) {
            triggerToast(
              'error',
              tone === TranslationTone.ENGLISH ? 'Verification Failed' : 'Xác thực thất bại',
              tone === TranslationTone.ENGLISH
                ? `Disagreement detected! State claims v${appVersion} but physical metadata verified v${metadata.version || '1.12.0'}.`
                : `Phát hiện xung đột! Phiên bản v${appVersion} không khớp dữ liệu metadata v${metadata.version || '1.12.0'}.`,
              '🛑'
            );
          }
        } else {
          setIsVersionRed(false);
          setVerifyBtnVisible(false);
          if (triggerManualPrompt) {
            triggerToast(
              'success',
              tone === TranslationTone.ENGLISH ? 'Verification Passed' : 'Xác thực thành công',
              tone === TranslationTone.ENGLISH ? 'Your local space and binary metadata are in perfect alignment!' : 'Hệ thống phiên bản và dữ liệu tệp tin của bạn đang đồng bộ tương thích gốc đạt 100%!',
              '✓'
            );
            addLog(`✓ [VERIFY] Binary verification passed successfully.`);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to verify installation with metadata:', err);
    }
  }, [appVersion, addLog, tone, triggerToast]);

  // Dynamically probe update version on mount
  React.useEffect(() => {
    const probeVersion = async () => {
      let probeOk = false;
      try {
        const url = resolveApiUrl('/api/update/check');
        const res = await fetch(url);
        if (res.ok) {
          probeOk = true;
          const data = await res.json();
          
          // Feature 1: Version mismatch logic
          if (data.currentVersion) {
            const localExpected = localStorage.getItem('rebase_overlord_patch_version');
            
            const isV1GreaterThanV2 = (v1: string, v2: string) => {
              const p1 = v1.replace(/^v/, '').split('.').map(v => parseInt(v, 10) || 0);
              const p2 = v2.replace(/^v/, '').split('.').map(v => parseInt(v, 10) || 0);
              for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                const n1 = p1[i] || 0;
                const n2 = p2[i] || 0;
                if (n1 > n2) return true;
                if (n2 > n1) return false;
              }
              return false;
            };

            if (localExpected && isV1GreaterThanV2(localExpected, data.currentVersion)) {
              setUpdateMismatchError('Update failed: Local version mismatch');
              addLog('❌ Update check failed: Local expected version differs from server version.');
            } else {
              setUpdateMismatchError(null);
            }

            setAppVersion(data.currentVersion);
            localStorage.setItem('rebase_overlord_patch_version', data.currentVersion);
            
            // If we are upgraded relative to 1.12.0, celebrate!
            const cleanVer = data.currentVersion.replace(/^v/, '');
            const parts = cleanVer.split('.').map((v: string) => parseInt(v, 10) || 0);
            const isLatest = parts[0] > 1 || (parts[0] === 1 && (parts[1] > 12 || (parts[1] === 12 && parts[2] > 0)));
            if (isLatest) {
              const hasAnnounced = localStorage.getItem('rebase_overlord_announced_v15');
              if (!hasAnnounced) {
                setTimeout(() => {
                  triggerToast(
                    'success',
                    tone === TranslationTone.ENGLISH ? `🎉 UPGRADED TO v${data.currentVersion}!` : `🎉 ĐÃ NÂNG CẤP LÊN v${data.currentVersion}!`,
                    tone === TranslationTone.ENGLISH 
                      ? 'Congratulations! The advanced features (AI Doctor Pro, Reflog Diagnostics, and interactive recovery) are fully unlocked.'
                      : `Chúc mừng! Bạn đã nâng cấp thành công lên phiên bản v${data.currentVersion}. Toàn bộ tính năng cao cấp (AI Doctor Pro, Khôi phục Reflog, Chẩn đoán offline) đã được kích hoạt!`,
                    '🚀'
                  );
                  localStorage.setItem('rebase_overlord_announced_v15', 'true');
                }, 2000);
              }
            } else {
              localStorage.removeItem('rebase_overlord_announced_v15');
            }
          }

          // Feature 2: Check for exit error code on load
          if (data.lastUpdateExitCode !== null && data.lastUpdateExitCode !== 0) {
            setUpdateFailedModal({
              isOpen: true,
              title: tone === TranslationTone.ENGLISH ? 'System Update Failed' : 'Nâng cấp hệ thống thất bại',
              message: data.lastUpdateError || (tone === TranslationTone.ENGLISH 
                ? 'The background update process reported a non-zero exit code or failed to write new binaries.' 
                : 'Tiến trình nâng cấp/ghi tệp tin của bộ cài đặt thực tế đã thất bại.'),
              exitCode: data.lastUpdateExitCode
            });
            addLog(`❌ [ALERT] Last update process failed with exit code ${data.lastUpdateExitCode}!`);
          }
        }
      } catch (err) {
        console.warn('Failed to dynamically probe version from App.tsx:', err);
      }
      
      // Feature 1: Trigger banner if update check returns an error (or failed to fetch)
      if (!probeOk) {
        setUpdateMismatchError('Update failed: Local version mismatch');
        addLog('❌ Update check failed: Update server API reported error or could not be reached.');
      }

      // Feature 3: Compare with metadata file on load
      verifyInstallationWithMetadata();
    };
    probeVersion();
  }, [tone, triggerToast, addLog, verifyInstallationWithMetadata]);

  // Trigger ee_night_owl Easter Egg on load if late
  React.useEffect(() => {
    const hr = new Date().getHours();
    if (hr >= 23 || hr <= 4) {
      const msg = translate('ee_night_owl', tone);
      const title = tone === TranslationTone.ENGLISH ? "🌙 Night Owl Active" : "🌙 Chế độ Cú Đêm";
      const timer = setTimeout(() => {
        triggerToast('owl', title, msg, '🦉');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tone]);

  // Watch stats.rebaseCount for milestones
  const prevRebaseCountRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    const count = stats.rebaseCount ?? 0;
    if (prevRebaseCountRef.current !== null && count > prevRebaseCountRef.current) {
      if (count === 1 || count % 5 === 0) {
        let eeKey = "ee_rebase_milestone";
        if (tone === TranslationTone.TOXIC) {
          if (count >= 30) {
            eeKey = "vn_toxic_level_3";
          } else if (count >= 15) {
            eeKey = "vn_toxic_level_2";
          } else {
            eeKey = "vn_toxic_level_1";
          }
        }
        const titleLine = tone === TranslationTone.ENGLISH ? "🏆 REBASE MILESTONE!" : "🏆 CỘT MỐC SQUASH CHIẾN THẦN!";
        const translatedMsg = translate(eeKey, tone, { count });
        triggerToast('milestone', titleLine, translatedMsg, '🏆');
      }
    }
    prevRebaseCountRef.current = count;
  }, [stats.rebaseCount, tone]);

  React.useEffect(() => {
    handleRefresh();
    fetchStats();
  }, [isSimulation, handleRefresh]);

  // Watch branch name to suggest a backup branch
  React.useEffect(() => {
    if (repoState.currentBranch) {
      const cleanBranch = repoState.currentBranch.replace(/\//g, '_');
      setWizard(w => ({
        ...w,
        backupBranchName: `backup/rebase-overlord-${cleanBranch}`
      }));
    }
  }, [repoState.currentBranch]);

  // Safe Execute updates of wizard properties
  const handleUpdateWizard = (updates: Partial<WizardState>) => {
    setWizard(prev => ({ ...prev, ...updates }));
    
    // Add logging hooks
    if (updates.step !== undefined) {
      addLog(`[WIZARD] Moved to step ${updates.step + 1}: ${getStepLabel(updates.step)}`);
    }
    if (updates.baseBranch) {
      addLog(`$ git merge-base ${updates.baseBranch} HEAD`);
    }
    if (updates.doFetch !== undefined) {
      addLog(`[CONFIG] Fetch Origin toggled to: ${updates.doFetch}`);
    }
  };

  const getStepLabel = (step: number) => {
    switch(step) {
      case 0: return 'Base Branch Name Input';
      case 1: return 'Sync / Fetch Prompt';
      case 2: return 'Commit Squash checklists selection';
      case 3: return 'Safe Backup configuration';
      case 4: return 'Rebase/Squash execution engine';
      case 5: return 'Unified commit message editing';
      case 6: return 'Verify rebase integrity & local consistency checks';
      case 7: return 'Finalize check with Push optionality';
      default: return 'Idle';
    }
  };

  // Execute wizard rebase triggering breakpoints simulation
  const handleExecuteWizardRebase = async () => {
    handleUpdateWizard({ status: 'running' });
    
    if (isSimulation) {
      addLog(`$ git checkout -b ${wizard.backupBranchName}`);
      addLog(`✓ Backup created successfully: ${wizard.backupBranchName}`);
      addLog(`$ git rebase -i ${wizard.baseBranch}`);

      // Wait 2 seconds to simulate conflicts breakpoint
      setTimeout(() => {
        // Setup conflict files state dynamically inside app
        const activeConflicts: ConflictFile[] = [
          {
            filepath: 'src/routes/payment.ts',
            status: 'conflicted',
            conflictsCount: 2,
            contentBefore: [
              'import { Request, Response, Router } from "express";',
              'import Stripe from "stripe";',
              'import { logger } from "../utils/logger";',
              'import { getStripeClient } from "../lib/stripe";',
              'import { authMiddleware } from "../middleware/auth";',
              '',
              'const router = Router();',
              '',
              '// Retrieve payment dashboard analytics',
              'router.get("/dashboard", authMiddleware, async (req: Request, res: Response) => {',
              '  try {',
              '    const userId = req.user?.id;',
              '    logger.info(`Fetching dashboard metrics for user: ${userId}`);',
              '    ',
              '    // Fetch user subscription details',
              '    const stripe = getStripeClient();',
              '    const payments = await stripe.paymentIntents.list({ limit: 10 });',
              '    ',
              '    res.status(200).json({',
              '      status: "success",',
              '      count: payments.data.length,',
              '      recent: payments.data.map(p => ({',
              '        id: p.id,',
              '        amount: p.amount / 100,',
              '        currency: p.currency,',
              '        status: p.status,',
              '      }))',
              '    });',
              '  } catch (err: any) {',
              '    logger.error("Failed to query dashboard database", err);',
              '    res.status(500).json({ error: "INTERNAL_DATABASE_ERR" });',
              '  }',
              '});',
              '',
              '// CREATE CHARGE ENDPOINT',
              'router.post("/charge", authMiddleware, async (req: Request, res: Response) => {',
              '  const { amount, currency, promoCode, paymentMethodId } = req.body;',
              '  const stripe = getStripeClient();',
              '  ',
              '  logger.info(`Starting transaction intake for manual charge: ${amount} ${currency}`);',
              '',
              '<<<<<<< HEAD',
              '  // Alex Nguyen: Add stripe secure charge webhook, telemetry tracking, and retry logic',
              '  let finalAmount = amount;',
              '  if (promoCode === "REBASE_WARRIOR") {',
              '    finalAmount = Math.max(50, Math.round(amount * 0.8)); // 20% discount, min charge 50 cents',
              '    logger.info(`Promo code applied: REBASE_WARRIOR. Discounted amount: ${finalAmount}`);',
              '  }',
              '',
              '  try {',
              '    const paymentIntent = await stripe.paymentIntents.create({',
              '      amount: finalAmount,',
              '      currency,',
              '      payment_method: paymentMethodId,',
              '      confirm: true,',
              '      automatic_payment_methods: { enabled: true, allow_redirects: "never" },',
              '      metadata: { ',
              '        integration: "rebase-overlord-secured",',
              '        developer: "Alex Nguyen",',
              '        telemetry_rate: "ultra-high"',
              '      }',
              '    });',
              '',
              '    res.json({ ',
              '      success: true, ',
              '      clientSecret: paymentIntent.client_secret, ',
              '      transactionId: paymentIntent.id,',
              '      amountApplied: finalAmount',
              '    });',
              '=======',
              '  // Sarah Connor: Bump rate-limits, add deep telemetry handlers & legacy pipeline',
              '  let rateLimitWindow = 60 * 1000; // 1 minute',
              '  let maxRequests = 10;',
              '  logger.info(`Asserting security rate limiting window of ${rateLimitWindow}ms with max ${maxRequests} requests.`);',
              '',
              '  try {',
              '    const charge = await stripe.charges.create({',
              '      amount: amount,',
              '      currency,',
              '      source: paymentMethodId,',
              '      description: "Legacy charges backup pipeline for active CRM sync",',
              '      metadata: {',
              '        crm_id: req.body.crmId || "N/A",',
              '        developer: "Sarah Connor"',
              '      }',
              '    });',
              '',
              '    res.json({ ',
              '      success: true, ',
              '      charge: charge.id,',
              '      telemetryId: req.body.telemetryId || "legacy-fallback-id",',
              '      receiptUrl: charge.receipt_url',
              '    });',
              '>>>>>>> develop',
              '  } catch (err: any) {',
              '    logger.error("Transaction pipeline crashed!", err);',
              '    res.status(400).json({ error: err.message || "TRANSACTION_FAILED" });',
              '  }',
              '});',
              '',
              '// WEBHOOK DISPATCHER',
              '<<<<<<< HEAD',
              'router.post("/webhooks/stripe", async (req: Request, res: Response) => {',
              '  const sig = req.headers["stripe-signature"] as string;',
              '  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_V2;',
              '  const stripe = getStripeClient();',
              '',
              '  if (!endpointSecret) {',
              '    logger.warn("Webhook system not fully initialized - STRIPE_WEBHOOK_SECRET_V2 missing!");',
              '    return res.status(500).send("Webhook config error");',
              '  }',
              '',
              '  let event: Stripe.Event;',
              '  try {',
              '    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);',
              '  } catch (err: any) {',
              '    logger.error(`Webhook signature validation failed v2: ${err.message}`);',
              '    return res.status(400).send(`Webhook Error: ${err.message}`);',
              '  }',
              '',
              '  // Handle high priority payment webhook types',
              '  if (event.type === "payment_intent.succeeded") {',
              '    const pi = event.data.object as Stripe.PaymentIntent;',
              '    logger.info(`✨ Webhook Success: payment_intent.succeeded! ID: ${pi.id}`);',
              '    // database sync routine goes here',
              '  }',
              '',
              '  res.json({ received: true, version: "v2.0-alex" });',
              '});',
              '=======',
              'router.post("/webhook/stripe", async (req: Request, res: Response) => {',
              '  const sig = req.headers["stripe-signature"] as string;',
              '  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;',
              '  const stripe = getStripeClient();',
              '',
              '  let event: Stripe.Event;',
              '  try {',
              '    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);',
              '  } catch (err: any) {',
              '    logger.error(`Webhook signature validation failed legacy: ${err.message}`);',
              '    return res.status(400).send(`Webhook Error: ${err.message}`);',
              '  }',
              '',
              '  if (event.type === "charge.succeeded") {',
              '    const charge = event.data.object as Stripe.Charge;',
              '    logger.info(`Legacy Webhook Success: charge.succeeded! ID: ${charge.id}`);',
              '  }',
              '',
              '  res.json({ received: true, version: "v1.2-legacy-sarah" });',
              '});',
              '>>>>>>> develop',
              '',
              'export default router;'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'src/services/stripe.ts',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              'import Stripe from "stripe";',
              'import { logger } from "../utils/logger";',
              '',
              'let stripeInstance: Stripe | null = null;',
              '',
              '/**',
              ' * Lazy initialization of the Stripe SDK Client to prevent startup crashes.',
              ' * Resolves API key securely from environment variables.',
              ' */',
              'export function getStripeClient(): Stripe {',
              '  if (stripeInstance) {',
              '    return stripeInstance;',
              '  }',
              '',
              '<<<<<<< HEAD',
              '  const apiKey = process.env.STRIPE_SECRET_KEY;',
              '  if (!apiKey) {',
              '    logger.error("FATAL: STRIPE_SECRET_KEY is undefined securely at module loading.");',
              '    throw new Error("Missing STRIPE_SECRET_KEY runtime environment variable");',
              '  }',
              '',
              '  logger.info("Initializing Stripe SDK v12 in Secure Mode - Server Side proxy");',
              '  stripeInstance = new Stripe(apiKey, {',
              '    apiVersion: "2023-10-16",',
              '    typescript: true,',
              '    maxNetworkRetries: 3,',
              '    timeout: 10000,',
              '    appInfo: {',
              '      name: "Rebase Overlord Gateway",',
              '      version: "2.1.0-alpha"',
              '    }',
              '  });',
              '=======',
              '  const legacyKey = process.env.STRIPE_LEGACY_KEY || process.env.STRIPE_SECRET_KEY;',
              '  if (!legacyKey) {',
              '    logger.warn("Warning: STRIPE_SECRET_KEY is empty. Initializing with mock token generator.");',
              '  }',
              '',
              '  logger.info("Initializing Stripe Client in Legacy Compatibility Mode");',
              '  stripeInstance = new Stripe(legacyKey || "mock-inactive-token", {',
              '    apiVersion: "2022-11-15",',
              '    typescript: true,',
              '    maxNetworkRetries: 1,',
              '    timeout: 30000',
              '  });',
              '>>>>>>> develop',
              '',
              '  return stripeInstance;',
              '}',
              '',
              '/**',
              ' * Validate active customer session',
              ' */',
              'export async function validateCustomerSession(customerId: string): Promise<boolean> {',
              '  const stripe = getStripeClient();',
              '  try {',
              '    const customer = await stripe.customers.retrieve(customerId);',
              '    return !customer.deleted;',
              '  } catch (err) {',
              '    logger.warn(`Stripe customer validation failed silently for ${customerId}`);',
              '    return false;',
              '  }',
              '}'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'config/keys.json',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              '{',
              '  "project_id": "rebase-overlord-prod",',
              '  "environment": "production",',
              '  "version": "2.4.0",',
              '<<<<<<< HEAD',
              '  "api": {',
              '    "host": "https://api.rebaseoverlord.dev",',
              '    "timeout_ms": 5000,',
              '    "ssl_only": true,',
              '    "security_headers": {',
              '      "x_frame_options": "DENY",',
              '      "content_security_policy": "default-src \'self\'"',
              '    }',
              '  },',
              '  "database": {',
              '    "pool_max": 25,',
              '    "pool_min": 5,',
              '    "idle_timeout_ms": 30000',
              '  }',
              '=======',
              '  "api": {',
              '    "host": "https://legacy-gateway.internal.net",',
              '    "timeout_ms": 15000,',
              '    "ssl_only": false,',
              '    "legacy_endpoints": true',
              '  },',
              '  "database": {',
              '    "pool_max": 10,',
              '    "pool_min": 1,',
              '    "idle_timeout_ms": 10000',
              '  }',
              '>>>>>>> develop',
              '}'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'powerbi_dataset/model.tmdl',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              'table InternetSales',
              '  lineageTag: fdb17e41-0ed5-433b-821f-db905c102a7b',
              '',
              '<<<<<<< HEAD',
              '  measure TotalSales = SUM(InternetSales[Amount])',
              '    lineageTag: ab8d132c-7bbf-4c74-98da-de4b6f123abc',
              '=======',
              '  measure TotalSalesAmount = SUM(InternetSales[SalesAmount])',
              '    lineageTag: ab8d132c-7bbf-4c74-98da-de4b6f123abc',
              '>>>>>>> develop'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'powerbi_dataset/relationships.json',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              '{',
              '  "relationships": [',
              '<<<<<<< HEAD',
              '    {',
              '      "name": "rel_sales_customer",',
              '      "fromTable": "Sales",',
              '      "fromColumn": "CustomerID",',
              '      "toTable": "Customer",',
              '      "toColumn": "ID",',
              '      "lineageTag": "38da6410-b5bc-4673-aee3-127ca96013a7"',
              '    }',
              '=======',
              '    {',
              '      "name": "rel_sales_customer_alt",',
              '      "fromTable": "Sales",',
              '      "fromColumn": "CustomerID",',
              '      "toTable": "Customer",',
              '      "toColumn": "ID",',
              '      "lineageTag": "f9b4c030-cf2f-410a-ade0-6d4590ee85ad"',
              '    }',
              '>>>>>>> develop',
              '  ]',
              '}'
            ].join('\n'),
            contentAfter: ''
          }
        ];

        // Override with extra complex Power BI conflict scenario for helper testing
        const pbiConflicts: ConflictFile[] = [
          {
            filepath: 'powerbi_dataset/model.tmdl',
            status: 'conflicted',
            conflictsCount: 3,
            contentBefore: [
              'table InternetSales',
              '  lineageTag: fdb17e41-0ed5-433b-821f-db905c102a7b',
              '',
              '<<<<<<< HEAD',
              '  measure TotalSales = SUM(InternetSales[SalesAmount])',
              '    lineageTag: ab8d132c-7bbf-4c74-98da-de4b6f123abc',
              '    formatString: \\$#,0.00;(\\$#,0.00);\\$#,0.00',
              '    displayFolder: "Core Measures"',
              '',
              '   measure SalesGrowth = DIVIDE([TotalSales] - [PriorYearSales], [PriorYearSales])',
              '    lineageTag: 2bc0db96-3b3a-4da2-9f37-124b69ee2f87',
              '=======',
              '  measure TotalRevenue = SUM(InternetSales[GrossRevenue])',
              '    lineageTag: ab8d132c-7bbf-4c74-98da-de4b6f123abc',
              '    formatString: \\$#,0',
              '    displayFolder: "Sales Metrics"',
              '',
              '  measure GrowthYTD = DIVIDE([TotalRevenue] - [LastYearRevenue], [LastYearRevenue])',
              '    lineageTag: e3a763bd-8c34-45aa-bd77-df9036c64fed',
              '>>>>>>> develop',
              '',
              '  measure ProfitMargin = DIVIDE([ProfitAmount], [TotalSales])',
              '    lineageTag: a769b7f5-30fa-4006-8d18-df8cbbfd1a7b'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'powerbi_dataset/relationships.json',
            status: 'conflicted',
            conflictsCount: 2,
            contentBefore: [
              '{',
              '  "relationships": [',
              '<<<<<<< HEAD',
              '    {',
              '      "name": "rel_sales_customer",',
              '      "fromTable": "InternetSales",',
              '      "fromColumn": "CustomerID",',
              '      "toTable": "Customer",',
              '      "toColumn": "ID",',
              '      "lineageTag": "38da6410-b5bc-4673-aee3-127ca96013a7"',
              '    },',
              '    {',
              '      "name": "rel_sales_date",',
              '      "fromTable": "InternetSales",',
              '      "fromColumn": "OrderDate",',
              '      "toTable": "DimDate",',
              '      "toColumn": "DateKey",',
              '      "lineageTag": "7bf3ccae-6b19-4592-be22-d04bbf1db22b"',
              '    }',
              '=======',
              '    {',
              '      "name": "rel_sales_customer_alt",',
              '      "fromTable": "InternetSales",',
              '      "fromColumn": "CustomerID",',
              '      "toTable": "Customer",',
              '      "toColumn": "ID",',
              '      "lineageTag": "f9b4c030-cf2f-410a-ade0-6d4590ee85ad"',
              '    },',
              '    {',
              '      "name": "rel_sales_date_analytics",',
              '      "fromTable": "InternetSales",',
              '      "fromColumn": "OrderDate",',
              '      "toTable": "DimDate",',
              '      "toColumn": "DateKey",',
              '      "lineageTag": "7bf3ccae-6b19-4592-be22-d04bbf1db22b"',
              '    }',
              '>>>>>>> develop',
              '  ]',
              '}'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'powerbi_dataset/sales_analysis.tmdl',
            status: 'conflicted',
            conflictsCount: 2,
            contentBefore: [
              'table SalesAnalysis',
              '  lineageTag: c31c828d-19cd-4a24-9b2f-98c55dc433f8',
              '',
              '<<<<<<< HEAD',
              '  column SegmentKey',
              '    dataType: int64',
              '    lineageTag: 5b4c19fd-faac-4dfa-8a62-87adffc10ccf',
              '    summarizeBy: none',
              '',
              '  measure SegmentSales = CALCULATE(SUM(SalesAnalysis[Amount]), SalesAnalysis[SegmentKey] = 2)',
              '    lineageTag: e1425ab3-48bd-474c-8fc4-934fa7123999',
              '=======',
              '  column SalesSegmentID',
              '    dataType: int64',
              '    lineageTag: 5b4c19fd-faac-4dfa-8a62-87adffc10ccf',
              '    summarizeBy: none',
              '',
              '  measure SegmentRevenue = CALCULATE(SUM(SalesAnalysis[GrossAmount]), SalesAnalysis[SalesSegmentID] = 2)',
              '    lineageTag: d85a4bf9-e935-430c-ab22-67abfc12b325',
              '>>>>>>> develop'
            ].join('\n'),
            contentAfter: ''
          }
        ];

        const finalConflicts = simScenarioId === 'powerbi' ? pbiConflicts : activeConflicts;

        setRepoState(prev => ({
          ...prev,
          rebaseInProgress: true,
          conflicts: finalConflicts
        }));

        handleUpdateWizard({ status: 'paused_conflict' });
        addLog(`⚠️ CONFLICTS DETECTED during interactive rebase. Rebase paused.`);
        if (simScenarioId === 'powerbi') {
          addLog(`  conflict: powerbi_dataset/model.tmdl (3 conflicts)`);
          addLog(`  conflict: powerbi_dataset/relationships.json (2 conflicts)`);
          addLog(`  conflict: powerbi_dataset/sales_analysis.tmdl (2 conflicts)`);
          addLog(`// SPECIALIST Power BI Conflict Solver is active! Click files to diagnose lineage tags, nested structures and auto-indent details.`);
        } else {
          addLog(`  conflict: src/routes/payment.ts (2 conflicts)`);
          addLog(`  conflict: src/services/stripe.ts (1 conflict)`);
          addLog(`  conflict: config/keys.json (1 conflict)`);
          addLog(`  conflict: powerbi_dataset/model.tmdl (1 conflict)`);
          addLog(`  conflict: powerbi_dataset/relationships.json (1 conflict)`);
        }
        addLog(`// Please use the interactive 3-Way Merge solver below to rescue your branches!`);
      }, 2000);
    } else {
      // REAL LIVE GIT REBASE WORKFLOW
      try {
        if (wizard.doBackup && wizard.backupBranchName) {
          addLog(`$ git checkout -b ${wizard.backupBranchName}`);
          const backupRes = await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: `git checkout -b ${wizard.backupBranchName}` })
          });
          const backupData = await backupRes.json();
          if (backupRes.ok && backupData.code === 0) {
            addLog(`✓ Created backup branch: ${wizard.backupBranchName}`);
          } else {
            addLog(`⚠️ Backup branch warning: ${backupData.stderr || 'Branch might already exist.'}`);
          }
        }

        addLog(`$ git rebase ${wizard.baseBranch}`);
        const rebaseRes = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git rebase ${wizard.baseBranch}` })
        });
        const rebaseData = await rebaseRes.json();
        
        // Refresh the actual Git state right away
        addLog(`$ Refreshing repository status to fetch conflicts...`);
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false&baseBranch=${encodeURIComponent(wizard.baseBranch || 'develop')}`);
        const refreshRes = await fetch(refreshUrl);
        if (refreshRes.ok) {
          const refreshedRepoState = await refreshRes.json();
          setRepoState(refreshedRepoState);

          if (rebaseData.code === 0) {
            addLog(`✓ Rebase completed successfully without any conflicts!`);
            handleUpdateWizard({ status: 'completed', step: 5 });
          } else {
            if (refreshedRepoState.rebaseInProgress) {
              handleUpdateWizard({ status: 'paused_conflict' });
              addLog(`⚠️ CONFLICT DETECTED during real rebase. Please use the Conflict Solver below.`);
            } else {
              addLog(`❌ Rebase failed to proceed: ${rebaseData.stderr || 'Unknown Git error'}`);
              handleUpdateWizard({ status: 'idle' });
            }
          }
        } else {
          addLog(`❌ Failed to retrieve git status after rebase execution`);
          handleUpdateWizard({ status: 'idle' });
        }
      } catch (err: any) {
        addLog(`❌ Network thread exception: ${err.message}`);
        handleUpdateWizard({ status: 'idle' });
      }
    }
  };

  // Advanced Reflog Rescue - injects recovered dangling commit node directly into the branch timeline
  const handleRescueCommit = React.useCallback((sha: string, message: string, author: string, date: string) => {
    addLog(`$ git reflog --date=relative`);
    addLog(`$ git cherry-pick ${sha}`);
    addLog(`✓ Reflog Rescue success: Recovered dangling commit ${sha}`);
    
    // Inject the rescued commit at the top of the timeline!
    setRepoState(prev => {
      // Avoid duplicate insertion
      if (prev.commits.some(c => c.sha === sha)) return prev;

      const rescuedNode: Commit = {
        sha,
        author,
        date,
        message,
        type: 'feat',
        selected: true,
        parents: prev.commits.length > 0 ? [prev.commits[0].sha] : [],
        track: 1
      };

      // Put rescued node at the front of the commit list so it renders in the SVG graph immediately
      return {
        ...prev,
        commits: [rescuedNode, ...prev.commits]
      };
    });

    triggerToast(
      'success',
      tone === TranslationTone.ENGLISH ? '🎉 COMMIT RESCUED LIVE!' : '🎉 CỨU HỘ VỀ NHÁNH THÀNH CÔNG!',
      tone === TranslationTone.ENGLISH
        ? `Commit ${sha} ("${message}") was successfully retrieved from reflog history.`
        : `Commit ${sha} ("${message}") đã được cứu khỏi ngục tối Reflog và khôi phục về sơ đồ lực lượng.`,
      '⚡'
    );
  }, [tone, triggerToast, addLog]);

  // Conflict resolved signal from child solver click
  const handleResolveFile = async (filepath: string, resolvedContent: string) => {
    if (isSimulation) {
      setRepoState(prev => {
        const updated = prev.conflicts.map(c => 
          c.filepath === filepath ? { ...c, isResolved: true, resolvedContent } : c
        );
        return { ...prev, conflicts: updated };
      });

      addLog(`✓ Resolved conflict lines in: ${filepath}`);
      addLog(`$ git add ${filepath}`);
    } else {
      try {
        addLog(`✏️ Saving resolved content and running git add for: ${filepath}...`);
        const res = await fetch(resolveApiUrl('/api/save-resolved-file'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filepath, content: resolvedContent })
        });
        if (res.ok) {
          addLog(`✓ Content saved and git add executed cleanly for: ${filepath}`);
          setRepoState(prev => {
            const updated = prev.conflicts.map(c => 
              c.filepath === filepath ? { ...c, isResolved: true, resolvedContent } : c
            );
            return { ...prev, conflicts: updated };
          });
        } else {
          const errMsg = await safeParseError(res, 'Failed to save merge output');
          addLog(`❌ Save merge failed: ${errMsg}`);
          alert(`Lỗi lưu gộp file: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`❌ Network thread exception: ${err.message}`);
      }
    }
  };

  // Complete rebase recovery and return home safely
  const handleCompleteRecovery = async () => {
    if (isSimulation) {
      addLog(`$ git rebase --continue`);
      addLog(`✓ Rebase completed successfully! Squashed ${wizard.selectedCommits.length} commits.`);
      
      // Save locally
      setRepoState(prev => ({
        ...prev,
        rebaseInProgress: false,
        conflicts: []
      }));

      handleUpdateWizard({ status: 'completed', step: 5 });

      // Update session count
      try {
        const incrementRes = await fetch(resolveApiUrl('/api/stats/increment'), { method: 'POST' });
        if (incrementRes.ok) {
          const d = await incrementRes.json();
          setStats({
            rebaseCount: d.rebase_count !== undefined ? d.rebase_count : (d.rebaseCount ?? 0),
            firstRun: d.first_run !== undefined ? d.first_run : (d.firstRun ?? ''),
            lastRun: d.last_run !== undefined ? d.last_run : d.lastRun
          });
        }
      } catch {
        setStats(prev => ({ ...prev, rebaseCount: prev.rebaseCount + 1 }));
      }
    } else {
      try {
        addLog(`$ git -c core.editor=true rebase --continue`);
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git -c core.editor=true rebase --continue' })
        });
        const data = await res.json();
        
        // Refresh git status to see if completed or another conflict occurred
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false&baseBranch=${encodeURIComponent(wizard.baseBranch || 'develop')}`);
        const refreshRes = await fetch(refreshUrl);
        if (refreshRes.ok) {
          const refreshedRepoState = await refreshRes.json();
          setRepoState(refreshedRepoState);

          if (refreshedRepoState.rebaseInProgress) {
            addLog(`🚧 Rebase paused at next commit conflicts. Please continue resolving conflicts below.`);
          } else {
            addLog(`✓ Real Git rebase completed successfully on disk!`);
            handleUpdateWizard({ status: 'completed', step: 5 });
            
            // Increment statistics
            try {
              const incrementRes = await fetch(resolveApiUrl('/api/stats/increment'), { method: 'POST' });
              if (incrementRes.ok) {
                const d = await incrementRes.json();
                setStats({
                  rebaseCount: d.rebase_count !== undefined ? d.rebase_count : (d.rebaseCount ?? 0),
                  firstRun: d.first_run !== undefined ? d.first_run : (d.firstRun ?? ''),
                  lastRun: d.last_run !== undefined ? d.last_run : d.lastRun
                });
              }
            } catch {
              // Ignore stats increments issues
            }
          }
        }
      } catch (err: any) {
        addLog(`❌ Failed executing rebase --continue: ${err.message}`);
      }
    }
  };

  // Reset/Abort wizard flow
  const handleResetWizard = async () => {
    // Trigger ee_rage_quit Easter Egg if they are already far into the flow
    if (wizard.step >= 3) {
      const rageQuitMsg = translate('ee_rage_quit', tone);
      const title = tone === TranslationTone.ENGLISH ? "🛑 Flow Aborted" : "🛑 Hủy ngang xương (Rage Quit)";
      triggerToast('rage', title, rageQuitMsg, '😡');
    }

    if (isSimulation) {
      addLog(`$ git rebase --abort`);
      addLog(`🔙 Wizard reset. Rebase process aborted cleanly.`);
      
      setRepoState(prev => ({
        ...prev,
        rebaseInProgress: false,
        conflicts: []
      }));
    } else {
      try {
        addLog(`$ git rebase --abort`);
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git rebase --abort' })
        });
        const data = await res.json();
        addLog(`🔙 Real Rebase Aborted. Code ${data.code}`);
        handleRefresh(false);
      } catch (err: any) {
        addLog(`❌ Failed execution rebase --abort: ${err.message}`);
      }
    }

    setWizard({
      step: 0,
      baseBranch: 'develop',
      doFetch: true,
      detectedType: 'clean',
      detectedReason: 'Nhánh gọn gàng, không trùng lặp commits',
      historyType: 'clean',
      basePoint: '',
      commitTotal: 0,
      selectedCommits: [],
      doBackup: true,
      backupBranchName: '',
      finalMsg: 'feat: add payment intent and webhook handles',
      autoPush: false,
      status: 'idle'
    });
  };

  // Offline diagnostic helpers to bypass AI API calls and save cost
  const offlineAnomalies = {
    dirty_working_tree: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Local working tree contains modifications that have not been tracked or committed. This locks important branch moves or rebase replays which require a clean tree register.",
        mitigation: "Either stash away your temporary changes using 'git stash' or discard all uncommitted edits via 'git checkout . && git clean -fd'."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Có các tệp tin trong thư mục làm việc đã bị sửa đổi nhưng chưa được lưu trữ (commit hoặc stash). Điều này ngăn cản quá trình chuyển nhánh hoặc Rebase Git an toàn.",
        mitigation: "Sơ cứu nhanh: Chạy 'git stash' để cất giữ tạm thời, hoặc chạy 'git checkout . && git clean -fd' để dọn dẹp sạch sẽ toàn bộ thay đổi chưa commit."
      }
    },
    diverged_branch: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Your local branch and the remote origin tracking branch have diverged. Both contain independent commits that do not exist on the other.",
        mitigation: "Use 'git pull --rebase' to fetch remote commits and place your local commits nicely on top, or do a 'git push --force-with-lease' if you are sure your local branch is the source of truth."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Nhánh của bạn ở máy tính của bạn và ở máy chủ (remote server) đang bị 'lệch pha chéo' (diverged). Cả hai đều có commit mới riêng.",
        mitigation: "Giải pháp: Chạy 'git pull --rebase' để kéo dồn commit máy chủ và phát lại commit local lên đầu; hoặc bấm 'force push' nếu bạn tuyệt đối tin tưởng code dưới máy."
      }
    },
    detached_head: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] You are in a 'Detached HEAD' state. You are pointing directly to a specific commit timeline hash instead of an active branch container.",
        mitigation: "Create a temporary safety rescue branch via 'git checkout -b recovery/detached-rescue' to preserve any new commits you write from being pruned by Git's garbage collection."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Bạn đang rơi vào trạng thái 'Detached HEAD' (đầu rời neo). Bạn đang trỏ trực tiếp vào một mã băm commit cụ thể thay vì một nhánh.",
        mitigation: "Biện pháp cấp cứu: Tạo một nhánh mới an toàn ngay bằng lệnh 'git checkout -b recovery/detached-rescue' để bảo tồn các thử nghiệm mới viết."
      }
    },
    stale_base_branch: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Your reference base branch (e.g. develop or master) on your local computer is outdated compared to the remote origin registry.",
        mitigation: "Trigger a remote synchronization fetch and pull updates using 'git fetch origin && git checkout <base> && git pull origin <base>' to avoid massive rebasing conflicts on stale roots."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Nhánh gốc tham chiếu của bạn ở local nằm tụt lại quá sâu so với remote server. Rebase trên nền một nhánh mốc meo lỗi thời sẽ gây ra xung đột cực lớn.",
        mitigation: "Sơ cứu khẩn cấp: Đồng bộ và cập nhật nhánh base bằng chuỗi lệnh 'git fetch origin && git checkout base && git pull origin base' để lấy cập nhật mới nhất từ nhánh gốc."
      }
    }
  };

  // AI Git Doctor Diagnostic and self-healing controls
  const handleDiagnoseProblem = async (problemType: string) => {
    setDoctorProblem(problemType);
    setDoctorLoading(true);
    setDoctorDiagnosis(null);
    setDoctorError(null);

    const cacheKey = `${problemType}_${tone}`;
    let cachedData: any = null;
    try {
      const cachedString = localStorage.getItem('rebase_overlord_doctor_cache');
      if (cachedString) {
        const cacheStore = JSON.parse(cachedString);
        if (cacheStore[cacheKey]) {
          cachedData = cacheStore[cacheKey];
        }
      }
    } catch (e) {
      console.warn("Failed to read doctor cache", e);
    }

    if (cachedData) {
      setTimeout(() => {
        const isEnglish = tone === TranslationTone.ENGLISH;
        // Parse into multi-expert shape, fallback gracefully
        const resolvedCache = {
          dr_overlord: {
            explanation: (cachedData.dr_overlord?.explanation || cachedData.explanation || (isEnglish ? "Cached overlord details" : "Thông tin chẩn trị từ bộ nhớ đệm")) + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)"),
            mitigation: (cachedData.dr_overlord?.mitigation || cachedData.mitigation || (isEnglish ? "Cached overlord mitigations" : "Hướng xử lý từ bộ nhớ đệm")) + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)")
          },
          dr_compiler: cachedData.dr_compiler,
          dr_schema: cachedData.dr_schema
        };
        setActiveDoctorTab('overlord');
        setDoctorDiagnosis(resolvedCache);
        addLog(`🏥 [Cache Hit] Khôi phục chẩn trị AI từ bộ nhớ đệm cho triệu chứng: ${problemType}`);
        setDoctorLoading(false);
      }, 200);
      return;
    }
    
    if (!isAiEnabled) {
      setTimeout(() => {
        const isEnglish = tone === TranslationTone.ENGLISH;
        const fallbackGroup = offlineAnomalies[problemType as keyof typeof offlineAnomalies];
        if (fallbackGroup) {
          const rawExplanation = isEnglish ? fallbackGroup.english.explanation : fallbackGroup.vietnamese.explanation;
          const rawMitigation = isEnglish ? fallbackGroup.english.mitigation : fallbackGroup.vietnamese.mitigation;
          
          let explanation = rawExplanation;
          let mitigation = rawMitigation;

          if (tone === TranslationTone.TOXIC) {
            explanation = `[OFFLINE - ĐÃ TẮT TRỢ LÝ AI TIẾT KIỆM TIỀN] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] ", "")} Code lỗi tèm lem thế này chần chừ gì nữa hả nhóc!`;
            mitigation = `${rawMitigation} Fix lẹ đi đừng chần chừ!`;
          } else if (tone === TranslationTone.JOKE) {
            explanation = `[OFFLINE - TRỢ LÝ AI ĐANG TẬP YOGA] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] ", "")} Quẻ phán lỗi này rebase siêu sập tiệm á haha!`;
            mitigation = `${rawMitigation} Làm lẹ giải hạn đi bạn hiền bớ người ta!`;
          }

          setActiveDoctorTab('overlord');
          setDoctorDiagnosis({
            dr_overlord: {
              explanation,
              mitigation
            }
          });
        } else {
          setActiveDoctorTab('overlord');
          setDoctorDiagnosis({
            dr_overlord: {
              explanation: isEnglish ? "Offline generic anomaly alert. AI is disabled." : "Cảnh báo bất thường cục bộ hệ thống. Trợ lý AI đang tắt.",
              mitigation: isEnglish ? "Proceed with manual fixes." : "Thực hiện xử lý thủ công các nhánh Git."
            }
          });
        }
        setDoctorLoading(false);
      }, 300);
      return;
    }
    
    try {
      const res = await fetch(resolveApiUrl('/api/explain-git-problem'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          problemType,
          tone,
          details: {
            isSimulation,
            currentBranch: repoState.currentBranch,
            dirtyFilesCount: repoState.dirtyFiles?.length || 0
          },
          doctorTriggerContext: {
            files: repoState.dirtyFiles || []
          }
        })
      });

      if (!res.ok) {
        throw new Error(tone === TranslationTone.ENGLISH ? 'Failed to contact AI Doctor.' : 'Không thể kết nối đến Trạm cấp cứu AI.');
      }

      const data = await res.json();
      
      // Structure of multi-doctor advice
      const newDgn = {
        dr_overlord: data.dr_overlord || {
          explanation: data.explanation || (tone === TranslationTone.ENGLISH ? "No explanation response received." : "Không nhận được phản hồi giải thích."),
          mitigation: data.mitigation || (tone === TranslationTone.ENGLISH ? "No mitigation suggestions received." : "Không nhận được gợi ý giải pháp.")
        },
        dr_compiler: data.dr_compiler,
        dr_schema: data.dr_schema
      };

      setActiveDoctorTab('overlord');
      setDoctorDiagnosis(newDgn);

      // Save to cache
      try {
        const cached = localStorage.getItem('rebase_overlord_doctor_cache');
        const cacheStore = cached ? JSON.parse(cached) : {};
        cacheStore[cacheKey] = newDgn;
        localStorage.setItem('rebase_overlord_doctor_cache', JSON.stringify(cacheStore));
      } catch (e) {
        console.warn("Failed to write to doctor cache", e);
      }
    } catch (e: any) {
      console.error(e);
      setDoctorError(e.message || 'An error occurred during diagnostics.');
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleTriggerDoctorAction = async (problemType: string, actionKey: string) => {
    addLog(`🔧 [Git Doctor] Sơ cứu: ${problemType} -> ${actionKey}`);
    
    if (problemType === 'dirty_working_tree') {
      if (actionKey === 'stash') {
        addLog(`$ git stash`);
        if (isSimulation) {
          setRepoState(prev => ({
            ...prev,
            isDirty: false,
            dirtyFiles: []
          }));
          addLog(`✓ Saved working directory and index WIP state: Saved to stash queue`);
          addLog(`✓ [PASS] Working tree resolved. Clean stage.`);
        } else {
          try {
            const res = await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: 'git stash' })
            });
            const data = await res.json();
            if (res.ok && data.code === 0) {
              addLog(`✓ Git stash executed successfully.`);
              handleRefresh();
            } else {
              addLog(`! Failed git stash: ${data.stderr || 'unknown output'}`);
            }
          } catch (err: any) {
            addLog(`! Network timeout stashing files: ${err.message}`);
          }
        }
      } else if (actionKey === 'discard') {
        addLog(`$ git checkout . && git clean -fd`);
        if (isSimulation) {
          setRepoState(prev => ({
            ...prev,
            isDirty: false,
            dirtyFiles: []
          }));
          addLog(`✓ Discarded all local files uncommitted modifications.`);
          addLog(`✓ [PASS] Working directory cleaned successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: 'git checkout . && git clean -fd' })
            });
            handleRefresh();
          } catch (e) {}
        }
      }
    } else if (problemType === 'diverged_branch') {
      if (actionKey === 'rebase_pull') {
        const cmd = `git pull --rebase origin ${repoState.currentBranch || 'feature/payment-v2'}`;
        addLog(`$ ${cmd}`);
        if (isSimulation) {
          setIsDivergedSimulated(false);
          addLog(`✓ Pulled remote changes and replayed local commits successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: cmd })
            });
            setIsDivergedSimulated(false);
            handleRefresh();
          } catch (e) {}
        }
      } else if (actionKey === 'force_push') {
        const cmd = `git push --force-with-lease origin ${repoState.currentBranch || 'feature/payment-v2'}`;
        addLog(`$ ${cmd}`);
        if (isSimulation) {
          setIsDivergedSimulated(false);
          addLog(`✓ Force pushed local commits to remote tracker successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: cmd })
            });
            setIsDivergedSimulated(false);
            handleRefresh();
          } catch (e) {}
        }
      }
    } else if (problemType === 'detached_head') {
      addLog(`$ git checkout -b recovery/detached-rescue`);
      if (isSimulation) {
        setIsDetachedHeadSimulated(false);
        addLog(`Switched to a new branch 'recovery/detached-rescue'`);
        addLog(`✓ Detached HEAD resolved successfully!`);
      } else {
        try {
          await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'git checkout -b recovery/detached-rescue' })
          });
          setIsDetachedHeadSimulated(false);
          handleRefresh();
        } catch (e) {}
      }
    } else if (problemType === 'stale_base_branch') {
      const cmd = `git fetch origin && git checkout ${wizard.baseBranch || 'develop'} && git pull origin ${wizard.baseBranch || 'develop'}`;
      addLog(`$ ${cmd}`);
      if (isSimulation) {
        setIsStaleBaseSimulated(false);
        addLog(`✓ Pulled developments updates standard from remote.`);
        addLog(`✓ base branch is now in sync with origin remote.`);
      } else {
        try {
          await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: cmd })
          });
          setIsStaleBaseSimulated(false);
          handleRefresh();
        } catch (e) {}
      }
    }

    // Reset Doctor States so the diagnosis details are closed clean
    setDoctorProblem(null);
    setDoctorDiagnosis(null);
  };

  // Active Checkout action
  const handleCheckoutBranch = async (branchName: string, bypassStaleCheck = false) => {
    // 1. Check if the branch is stale (>7 days)
    if (!bypassStaleCheck) {
      const targetBranch = repoState.branches.find(b => b.name === branchName);
      if (targetBranch && isBranchStale(targetBranch.lastCommitDate)) {
        setStaleBranchWarning({
          name: branchName,
          age: targetBranch.commitAge || 'unknown time',
          lastCommitDate: targetBranch.lastCommitDate || 'unknown date'
        });
        setStaleMigrateBase(repoState.baseBranch || 'develop');
        setStaleMigrateNewName(`${branchName}-fresh`);
        return;
      }
    }

    setCheckingOutBranch(branchName);
    addLog(`$ git checkout ${branchName}`);
    
    try {
      if (isSimulation) {
        // Small artificial delay to let user observe checkout animation gracefully
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let targetScenario: 'linear' | 'nonlinear' | 'rewrite' | 'stale' | 'detached' | 'large_history' | 'large_nonlinear' | null = null;
        if (branchName === 'feature/payment-linear') {
          targetScenario = 'linear';
        } else if (branchName === 'feature/payment-large-history') {
          targetScenario = 'large_history';
        } else if (branchName === 'feature/payment-large-nonlinear') {
          targetScenario = 'large_nonlinear';
        } else if (branchName === 'feature/payment-nonlinear') {
          targetScenario = 'nonlinear';
        } else if (branchName === 'feature/payment-diverged-rewrite') {
          targetScenario = 'rewrite';
        } else if (branchName === 'feature/payment-stale-base') {
          targetScenario = 'stale';
        }

        if (targetScenario) {
          setSimScenarioId(targetScenario);
        } else {
          setRepoState(prev => ({
            ...prev,
            currentBranch: branchName
          }));
        }
        addLog(`✓ Checkout local branch successful: ${branchName}`);
      } else {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Checkout successful for actual branch: ${branchName}`);
          await handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error checking out branch');
          addLog(`! Error checking out branch: ${errMsg}`);
        }
      }
    } catch (err: any) {
      addLog(`! Failed network thread executing checkout: ${err.message}`);
    } finally {
      setCheckingOutBranch(null);
    }
  };

  // Perform auto-migration for a stale branch
  const handleMigrateStaleBranch = async () => {
    if (!staleBranchWarning) return;
    setIsStaleMigrating(true);
    const { name: staleBranch } = staleBranchWarning;
    const baseBranch = staleMigrateBase;
    const newBranchName = staleMigrateNewName.trim() || `${staleBranch}-fresh`;

    addLog(`$ git migrate-stale-branch --from ${staleBranch} --onto ${baseBranch} --new ${newBranchName}`);
    
    try {
      if (isSimulation) {
        // Small delay to make simulation look highly authentic and technical
        await new Promise(resolve => setTimeout(resolve, 2000));

        addLog(`[SIMULATION] $ git merge-base ${baseBranch} ${staleBranch}`);
        addLog(`[SIMULATION] Identified split commit point: b5a2e1d`);
        addLog(`[SIMULATION] $ git checkout ${staleBranch}`);
        addLog(`[SIMULATION] $ git checkout -b temp-migrate-sim`);
        addLog(`[SIMULATION] $ git reset --soft b5a2e1d`);
        addLog(`[SIMULATION] $ git stash push -m "stale-branch-migration-${newBranchName}"`);
        addLog(`[SIMULATION] $ git checkout ${baseBranch}`);
        addLog(`[SIMULATION] $ git checkout -b ${newBranchName}`);
        addLog(`[SIMULATION] $ git stash pop`);
        addLog(`[SIMULATION] $ git add -A`);
        addLog(`[SIMULATION] $ git commit -m "Consolidated changes from stale branch ${staleBranch}"`);
        addLog(`[SIMULATION] $ git branch -D temp-migrate-sim`);

        // Update local simulated branches list
        setRepoState(prev => {
          // Check if already exists
          const exists = prev.branches.some(b => b.name === newBranchName);
          const updatedBranches = prev.branches.map(b => {
            if (b.name === prev.currentBranch) {
              return { ...b, isCurrent: false };
            }
            return b;
          });

          const newBranchObj = {
            name: newBranchName,
            isLocal: true,
            isRemote: false,
            isCurrent: true,
            isBase: false,
            commitAge: 'Just now',
            lastCommitDate: '2026-06-15'
          };

          const finalBranches = exists ? updatedBranches : [newBranchObj, ...updatedBranches];

          return {
            ...prev,
            currentBranch: newBranchName,
            branches: finalBranches,
            isDirty: true,
            dirtyFiles: Array.from(new Set([...prev.dirtyFiles, 'src/routes/payment.ts', 'src/services/stripe.ts']))
          };
        });

        triggerToast('success', 'Migration Clean Successful', 'Merged conflict-free changes onto fresh branch.');
        addLog(`✓ Stale branch successfully migrated to: ${newBranchName}`);
        setStaleBranchWarning(null);
      } else {
        // Actual mode
        const res = await fetch(resolveApiUrl('/api/migrate-stale-branch'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            staleBranch,
            baseBranch,
            newBranchName
          })
        });

        if (res.ok) {
          const data = await res.json();
          addLog(`✓ Server response: ${data.message}`);
          triggerToast('success', 'Migrate Success', `Migrated onto ${data.newBranch}`);
          await handleRefresh();
          setStaleBranchWarning(null);
        } else {
          const errMsg = await safeParseError(res, 'Migration backend process failed');
          addLog(`! Error migrating stale branch: ${errMsg}`);
          triggerToast('error', 'Migration Failed', errMsg);
        }
      }
    } catch (err: any) {
      addLog(`! Failed network thread executing migration: ${err.message}`);
      triggerToast('error', 'Network Error', err.message);
    } finally {
      setIsStaleMigrating(false);
    }
  };

  // Create branch action
  const handleCreateBranch = async (branchName: string, baseBranch?: string) => {
    const startPoint = baseBranch ? ` ${baseBranch}` : '';
    addLog(`$ git checkout -b ${branchName}${startPoint}`);
    
    if (isSimulation) {
      const newB = { name: branchName, isLocal: true, isRemote: false, isCurrent: true, isBase: false };
      setRepoState(prev => {
        // Set currentBranch isCurrent to false
        const updatedBranches = prev.branches.map(b => 
          b.name === prev.currentBranch ? { ...b, isCurrent: false } : b
        );
        return {
          ...prev,
          currentBranch: branchName,
          branches: [...updatedBranches, newB]
        };
      });
      addLog(`✓ Created and checkout brand new simulated branch: ${branchName} starting from ${baseBranch || 'current HEAD'}`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout -b ${branchName}${startPoint}` })
        });
        if (res.ok) {
          addLog(`✓ Created branch: ${branchName} from base ${baseBranch || 'current HEAD'}`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error creating branch');
          addLog(`! Error creating branch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout creating branch: ${err.message}`);
      }
    }
  };

  const handleDeleteBranch = async (branchName: string) => {
    addLog(`$ git branch -D ${branchName}`);
    if (isSimulation) {
      setRepoState(prev => ({
        ...prev,
        branches: prev.branches.filter(b => b.name !== branchName)
      }));
      addLog(`✓ Deleted local branch ${branchName} (Simulated)`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git branch -D ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Deleted local branch: ${branchName}`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error deleting branch');
          addLog(`! Error deleting branch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout deleting branch: ${err.message}`);
      }
    }
  };

  const handleUnstash = async (index: number) => {
    const stashName = `stash@{${index}}`;
    addLog(`$ git stash pop "${stashName}"`);
    setIsFetchingGlobal(true);
    
    try {
      const res = await fetch(resolveApiUrl('/api/execute-command'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `git stash pop "${stashName}"` })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.code === 0) {
          addLog(`✓ Successfully pop stashed item: ${stashName}`);
          triggerToast(
            'ok',
            tone === TranslationTone.ENGLISH ? 'STASH POPPED' : 'ĐÃ KHÔI PHỤC STASH',
            tone === TranslationTone.ENGLISH 
              ? `Workspace restored from ${stashName} successfully.` 
              : `Đã lôi đống tệp tin khôi phục từ ${stashName} thành công.`,
            '📦'
          );
        } else {
          addLog(`! Error popping stash: ${data.stderr || data.stdout}`);
          triggerToast(
            'warn',
            tone === TranslationTone.ENGLISH ? 'STASH POP FAILED' : 'KHÔNG THỂ GIẢI BẢN NHÁP',
            data.stderr || data.stdout || 'Conflicts detected or command failed.',
            '⚠️'
          );
        }
        handleRefresh();
      } else {
        const errMsg = await safeParseError(res, 'Unknown error popping stash');
        addLog(`! Error popping stash: ${errMsg}`);
      }
    } catch (err: any) {
      addLog(`! Network timeout popping stash: ${err.message}`);
    } finally {
      setIsFetchingGlobal(false);
    }
  };

  const handleFetch = async () => {
    setIsFetchingGlobal(true);
    addLog(`$ git fetch origin --prune`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (tone === TranslationTone.ENGLISH) {
        addLog(`✓ Successfully fetched latest references from remote (Simulated).`);
      } else if (tone === TranslationTone.TOXIC) {
        addLog(`✓ Fetch xong rồi thằng lười! Nhìn đống thay đổi gớm giếc của đồng nghiệp kìa (Simulated).`);
      } else if (tone === TranslationTone.JOKE) {
        addLog(`✓ Hóng hớt remote thành công sếp ơi! Có cập nhật mới rồi nhé (Simulated).`);
      } else {
        addLog(`✓ Thành công lấy các tham chiếu mới nhất từ remote (Simulated).`);
      }
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === 'develop') {
            return { ...b, aheadCount: 3, behindCount: 2 };
          }
          if (b.name === 'feature/auth-oauth') {
            return { ...b, aheadCount: 0, behindCount: 5 };
          }
          return b;
        });
        return { ...prev, branches: updated };
      });
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git fetch origin --prune' })
        });
        if (res.ok) {
          addLog(`✓ Successfully fetched latest references from remote.`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error executing fetch');
          addLog(`! Error running git fetch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout fetching: ${err.message}`);
      }
    }
    setIsFetchingGlobal(false);
  };

  const handleQuickBaseChange = async (newBase: string) => {
    handleUpdateWizard({ baseBranch: newBase });
    setRepoState(prev => ({ ...prev, baseBranch: newBase }));
    addLog(`🔄 Changing base comparison branch to: [${newBase}]`);
    await handleRefresh(undefined, newBase);
  };

  const handlePullBranch = async (branchName: string) => {
    const isCurrent = repoState.currentBranch === branchName;
    const command = isCurrent ? `git pull origin ${branchName}` : `git fetch origin ${branchName}:${branchName}`;
    addLog(`$ ${command}`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === branchName) {
            return { ...b, behindCount: 0 };
          }
          return b;
        });
        return { ...prev, branches: updated };
      });
      if (isCurrent) {
        addLog(`✓ Successfully pulled and merged latest commits for [${branchName}] (Simulated).`);
      } else {
        addLog(`✓ Fast-forwarded and updated [${branchName}] from origin directly without checking out! You are still on [${repoState.currentBranch}].`);
      }
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command })
        });
        if (res.ok) {
          if (isCurrent) {
            addLog(`✓ Pulled and updated [${branchName}] successfully.`);
          } else {
            addLog(`✓ Fast-forwarded and updated [${branchName}] directly without checking out! You are still on [${repoState.currentBranch}].`);
          }
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Pull/fetch command failed');
          if (!isCurrent) {
            addLog(`! Direct update failed: ${errMsg}`);
            addLog(`💡 Gợi ý: Có vẻ nhánh [${branchName}] không thể chuyển nhanh (non-fast-forward). Hãy checkout qua [${branchName}] để thực hiện kéo code thủ công.`);
          } else {
            addLog(`! Pull error: ${errMsg}`);
          }
        }
      } catch (err: any) {
        addLog(`! Network timeout pulling: ${err.message}`);
      }
    }
  };

  const handlePushBranch = async (branchName: string) => {
    addLog(`$ git push origin ${branchName}`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === branchName) {
            return { ...b, aheadCount: 0 };
          }
          return b;
        });
        return { ...prev, branches: updated };
      });
      addLog(`✓ Successfully pushed local branch [${branchName}] to origin remote repository (Simulated).`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git push origin ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Brand new commits of [${branchName}] pushed cleanly.`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Push command failed');
          addLog(`! Push error: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout pushing: ${err.message}`);
      }
    }
  };

  const handleCloneRepo = async (repoUrl: string, token: string) => {
    setIsCloning(true);
    addLog(`$ git clone --depth 50 ${repoUrl} (Cloning to secure container sandbox...)`);
    try {
      const res = await fetch(resolveApiUrl('/api/clone-repo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, token })
      });
      if (res.ok) {
        const d = await res.json();
        addLog(`✓ Successfully cloned repository: ${repoUrl}`);
        addLog(`📂 Root sandbox set to: ${d.path}`);
        setIsSimulation(false);
        await handleRefresh(false);
        setIsCloning(false);
        return true;
      } else {
        const errMsg = await safeParseError(res, 'Unknown error cloning repository');
        addLog(`❌ Clone failed: ${errMsg}`);
        alert(`Clone thất bại: ${errMsg}`);
        setIsCloning(false);
        return false;
      }
    } catch (e: any) {
      addLog(`❌ Exception during clone: ${e.message}`);
      setIsCloning(false);
      return false;
    }
  };

  const handleUpdateRepoPath = async (newPath: string) => {
    addLog(`$ Updating workspace repository path to: ${newPath}...`);
    try {
      const res = await fetch(resolveApiUrl('/api/set-repo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath })
      });
      if (res.ok) {
        const d = await res.json();
        addLog(`✓ Joined repository cleanly on directory: ${d.path}`);
        setIsSimulation(false);
        handleRefresh(false);
      } else {
        const errMsg = await safeParseError(res, 'Folder path invalid or inaccessible');
        addLog(`! Folder path is invalid or lacks .git: ${errMsg}`);
        alert(`Lỗi: ${errMsg}`);
      }
    } catch (e: any) {
      addLog(`! Failed to execute connection: ${e.message}`);
    }
  };

  const renderSidebarContent = () => {
    const doctorStatusItems = [
      {
        title: tone === TranslationTone.ENGLISH ? 'WORKING TREE' : 'CÂY THƯ MỤC',
        status: doctorProblem === 'uncommitted_changes' ? 'fail' : 'ok',
        badge: doctorProblem === 'uncommitted_changes' ? '⚠️ DIRTY' : '✓ CLEAN',
        fixAvailable: true,
        message: doctorProblem === 'uncommitted_changes'
          ? (tone === TranslationTone.ENGLISH
              ? 'You have uncommitted changes in your workspace. Please commit or stash them.'
              : 'Bạn đang có các thay đổi chưa commit. Hãy commit hoặc tạm cất (stash) chúng.')
          : (tone === TranslationTone.ENGLISH
              ? 'Working tree is clean. No uncommitted modifications.'
              : 'Thư mục làm việc hoàn toàn sạch sẽ, không có thay đổi dở dang.')
      },
      {
        title: tone === TranslationTone.ENGLISH ? 'LOCAL & REMOTE SYNC' : 'ĐỒNG BỘ LOCAL & REMOTE',
        status: doctorProblem === 'diverged_branch' ? 'fail' : 'ok',
        badge: doctorProblem === 'diverged_branch' ? '⚠️ DIVERGED' : '✓ SYNCED',
        fixAvailable: true,
        message: doctorProblem === 'diverged_branch'
          ? (tone === TranslationTone.ENGLISH
              ? 'Your local branch is out of sync with upstream remote. Rebase pull suggested.'
              : 'Nhánh local của bạn đang lệch pha với Remote thượng nguồn. Hãy chạy Rebase Pull.')
          : (tone === TranslationTone.ENGLISH
              ? 'Local branch is fully synced with upstream remote.'
              : 'Nhánh local đã đồng bộ hoàn hảo với máy chủ remote.')
      },
      {
        title: tone === TranslationTone.ENGLISH ? 'HEAD POSITION' : 'VỊ TRÍ ĐẦU HEAD',
        status: doctorProblem === 'detached_head' ? 'fail' : 'ok',
        badge: doctorProblem === 'detached_head' ? '⚠️ DETACHED' : '✓ LINKED',
        fixAvailable: true,
        message: doctorProblem === 'detached_head'
          ? (tone === TranslationTone.ENGLISH
              ? 'HEAD is detached. You are commit-safe but your branch lineage is broken.'
              : 'Đầu HEAD đang bị tách rời (Detached HEAD). Nhánh lưu trữ của bạn đang bị đứt gãy.')
          : (tone === TranslationTone.ENGLISH
              ? 'HEAD is correctly pointed to active branch tip.'
              : 'HEAD đang trỏ chính xác vào đầu mút nhánh hoạt động.')
      },
      {
        title: tone === TranslationTone.ENGLISH ? 'BASE BRANCH HEALTH' : 'SỨC KHỎE NHÁNH GỐC',
        status: doctorProblem === 'stale_base_branch' ? 'fail' : 'ok',
        badge: doctorProblem === 'stale_base_branch' ? '⚠️ STALE' : '✓ FRESH',
        fixAvailable: true,
        message: doctorProblem === 'stale_base_branch'
          ? (tone === TranslationTone.ENGLISH
              ? 'Developing base branch is behind remote. Suggest base branch synchronization.'
              : 'Nhánh gốc cơ sở (develop/main) đã lạc hậu so với Remote. Hãy chạy đồng bộ nhánh gốc.')
          : (tone === TranslationTone.ENGLISH
              ? 'Base branch is completely fresh and up to date.'
              : 'Nhánh gốc cơ sở hoàn toàn mới và cập nhật.')
      }
    ];

    return (
      <React.Fragment>
        {/* Git Branch Interactive Hub switcher */}
        {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
          <BranchPanel
            branches={repoState.branches}
            currentBranch={repoState.currentBranch}
            tone={tone}
            useEmoji={useEmoji}
            theme={theme}
            checkingOutBranch={checkingOutBranch}
            onCheckout={handleCheckoutBranch}
            onCreateBranch={handleCreateBranch}
            onDeleteBranch={handleDeleteBranch}
            onFetch={handleFetch}
            onPullBranch={handlePullBranch}
            onPushBranch={handlePushBranch}
            isFetchingGlobal={isFetchingGlobal}
          />
        )}

        {/* Simulated Live Diagnostic Warnings Panel with AI Git Doctor Integration */}
        {(dashboardMode === 'rescue' || dashboardMode === 'learning') && (
          !showWarningsPanel ? (
            <div id="git-warnings-collapsed" className={`rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${theme === 'light' ? 'bg-slate-50/70 text-slate-600' : 'bg-[#0b0c10]/40 text-slate-455'}`}>
              <div className="flex items-center gap-2 text-xs text-slate-450 font-mono">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold uppercase tracking-wider">{sloc.title}</span>
                <span className="text-[10px] text-slate-405 opacity-60">
                  ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowWarningsPanel(true)}
                className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-750 hover:bg-indigo-100'
                    : 'bg-[#1e293b] border-indigo-505/20 text-indigo-400 hover:text-indigo-303'
                }`}
                title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div id="git-warnings-board" className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${theme === 'light' ? 'bg-slate-50/60 text-slate-700 font-mono text-[11px]' : 'bg-[#0b0c10]/40 text-slate-300 font-mono text-[11px]'}`}>
              <div className={`flex items-center justify-between border-b pb-2 ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/40'}`}>
                <h3 className={`text-[11px] font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                  <Settings className="w-3.5 h-3.5 text-slate-455 animate-spin-slow" />
                  <span>{sloc.title}</span>
                </h3>
                <div className="flex items-center gap-2">
                  {isSimulation && (
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-501/10 px-1.5 py-0.5 rounded border border-indigo-501/15">
                      {sloc.simulationAnomalyBadge}
                    </span>
                  )}

                  {/* Collapse Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowWarningsPanel(false)}
                    className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
                      theme === 'light' 
                        ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                        : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-355'
                    }`}
                    title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
                  >
                    <EyeOff className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              <div className={`flex flex-col gap-1.5 text-xs font-mono border-b pb-2 ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/40'}`}>
                {/* 1. Git Installation Health */}
                <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                  <span className="text-slate-455">{sloc.gitEnv}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                    ✓ STABLE (v2.41)
                  </span>
                </div>

                {/* 2. GitHub auth check */}
                <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                  <span className="text-slate-455">{sloc.githubCli}</span>
                  {repoState.ghAvailable ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px] flex items-center gap-1">
                      <Github className="w-3" /> ✓ AUTHORIZED
                    </span>
                  ) : (
                    <span className="text-rose-455 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/15 text-[10px]" title="Please sign-in to gh-cli on system">
                      ⚠️ NOT SIGNED
                    </span>
                  )}
                </div>

                {/* 3. Rebase health check indicator */}
                <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                  <span className="text-slate-455">{sloc.rebaseStatus}</span>
                  {repoState.rebaseInProgress ? (
                    <span className="text-rose-400 font-bold bg-rose-550/10 px-1.5 py-0.5 rounded border border-rose-550/15 text-[10px] animate-pulse">
                      ⚡ REBASING (PAUSED)
                    </span>
                  ) : repoState.mergeInProgress ? (
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px]">
                      ⚡ MERGING (CONFLICTS)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                      ✓ COMPLIANT
                    </span>
                  )}
                </div>
              </div>

              {/* Warnings diagnostics lists */}
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {doctorStatusItems.map((item, index) => (
                  <div 
                    key={index} 
                    id={`diagnostic-item-${index}`}
                    className={`border-b pb-3.5 last:border-0 last:pb-0 ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/40'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-455 font-mono tracking-tight text-[10px] uppercase">
                        {item.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wide ${
                        item.status === 'ok' 
                          ? 'bg-emerald-550/15 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-rose-550/15 text-rose-450 border border-rose-550/10 animate-pulse'
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className={`text-xs font-sans font-medium mt-1.5 leading-relaxed ${theme === 'light' ? 'text-slate-655' : 'text-slate-355'}`}>
                      {item.message}
                    </p>

                    {item.status !== 'ok' && item.fixAvailable ? (
                      <div className="mt-2.5 flex flex-col gap-1.5 bg-rose-500/5 dark:bg-rose-600/5 p-2 rounded border border-rose-500/10 dark:border-rose-500/5">
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-400">
                          <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />
                          <span className="font-semibold">AI Doctor Recommendations</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('toggle-ai-doctor'));
                              addLog(`🩹 AI Doctor: Hướng dẫn sơ cứu lỗi ${item.title}`);
                            }}
                            className={`px-1.5 py-0.5 rounded transition-all font-sans text-[9px] shadow-sm font-semibold capitalize border cursor-pointer ${
                              theme === 'light'
                                ? 'bg-white hover:bg-slate-5 border-slate-200 text-slate-700'
                                : 'bg-[#151b2d] border-indigo-501/20 text-indigo-300 hover:bg-[#1a233d]'
                            }`}
                          >
                            {sloc.doctorAskAI}
                          </button>
                          {doctorProblem === 'uncommitted_changes' && (
                            <button
                              onClick={() => handleTriggerDoctorAction('uncommitted_changes', 'stash')}
                              className="px-2 py-1 bg-indigo-650 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                            >
                              {sloc.doctorApplyStash}
                            </button>
                          )}
                          {doctorProblem === 'diverged_branch' && (
                            <button
                              onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                            >
                              {sloc.doctorApplyRebase}
                            </button>
                          )}
                          {doctorProblem === 'detached_head' && (
                            <button
                              onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                              className="px-2 py-1 bg-rose-650 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                            >
                              {sloc.doctorApplyRescue}
                            </button>
                          )}
                          {doctorProblem === 'stale_base_branch' && (
                            <button
                              onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                            >
                              {sloc.doctorApplySync}
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {isUpgraded && dashboardMode === 'rescue' && (
          <ReflogRescuePanel
            theme={theme}
            tone={tone}
            onRescueCommit={handleRescueCommit}
          />
        )}

        {/* Neo Terminal - DOCK ON RIGHT */}
        {dockTerminalPosition === 'right' && (dashboardMode === 'daily' || dashboardMode === 'rescue') && (
          <TerminalPanel
            logs={logs}
            showLogPanel={showLogPanel}
            onToggleLogPanel={() => setShowLogPanel(!showLogPanel)}
            onClearLogs={() => setLogs([])}
            tone={tone}
            isSimulation={isSimulation}
            isAiEnabled={isAiEnabled}
            onCommandExecuted={() => handleRefresh(true)}
            addLog={addLog}
            resolveApiUrl={resolveApiUrl}
            theme={theme}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <div id="rebase-overlord-app" className={`min-h-screen transition-colors duration-205 p-4 font-sans select-none antialiased ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#060814] text-slate-100'}`}>
      <div className="max-w-[1800px] w-full mx-auto flex flex-col gap-5 px-1 sm:px-2 md:px-4">
        
        {updateMismatchError && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-red-500/5 animate-pulse" id="update-mismatch-error-banner">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin">⚠️</span>
              <div>
                <strong className="font-mono text-sm uppercase tracking-wider block">Critical system mismatch error!</strong>
                <p className="text-xs text-red-400 font-sans mt-0.5 font-semibold">Update failed: Local version mismatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  localStorage.setItem('rebase_overlord_patch_version', '1.12.0');
                  setAppVersion('1.12.0');
                  setUpdateMismatchError(null);
                  triggerToast('success', 'Reset completed', 'Reset version override to baseline v1.12.0.');
                  addLog('✓ [RESET] Local expected version reset to baseline v1.12.0.');
                }}
                className="px-3 py-1.5 bg-red-650/30 hover:bg-red-650/50 text-white border border-red-500/30 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer active:scale-95"
              >
                Force Reset Baseline
              </button>
            </div>
          </div>
        )}

        {/* Workspace Configurations & Tones Dashboard Header */}
        <RepoHeader
          repoState={repoState}
          stats={stats}
          tone={tone}
          useEmoji={useEmoji}
          isSimulation={isSimulation}
          isCloning={isCloning}
          isAiEnabled={isAiEnabled}
          theme={theme}
          onSetTone={(t) => {
            setTone(t);
            addLog(`🗣️ Updated translation personality tone to: ${t}`);
            
            // Easter egg toasts based on tone
            if (t === TranslationTone.TOXIC) {
              triggerToast('rage', '🔥 TOXIC BOSS INBOUND', 'Chế độ Sát Thương Vật Lý lý thuyết đã nạp! Chuẩn bị màng nhĩ nhận sát thương mỉa mai cực gắt nhé!', '💀');
            } else if (t === TranslationTone.JOKE) {
              triggerToast('owl', '🎭 HỀ CŨNG CÓ GIA PHẢ', 'Ní vừa khởi động Rạp xiếc trung ương. Nhớ mang theo bỏng ngô và trà sữa nha sếp!', '🤡');
            } else if (t === TranslationTone.PROFESSIONAL) {
              triggerToast('success', '💼 QUÝ TỘC CÔNG SỞ', 'Tác phong chuẩn ISO-9001 và mẫu mực gãy gọn như senior 10 năm kinh nghiệm!', '🤵');
            } else if (t === TranslationTone.ENGLISH) {
              triggerToast('info', '🇬🇧 ENTERPRISE COMPLIANCE', 'You have engaged absolute compliance with standard elite international protocols.', '🇬🇧');
            }
          }}
          onToggleEmoji={() => {
            setUseEmoji(!useEmoji);
            addLog(useEmoji ? '🤪 Emoji layout deactivated.' : '🤪 Emoji display active!');
            triggerToast('info', useEmoji ? 'Plain Mode' : 'Emoji Overload', useEmoji ? 'Giao diện truyền thống nghiêm túc' : 'Bão táp emoji đổ bộ giao diện!', '🤪');
          }}
          onToggleSimulation={(val) => {
            setIsSimulation(val);
            addLog(`🤖 Mode toggled. Simulation Playground: ${val ? 'ACTIVE' : 'OFF'}`);
            handleRefresh(val);
            
            if (val) {
              triggerToast('milestone', '⚡ SIMULATION RUNTIME', 'Sandbox mô phỏng an toàn đã kích hoạt. Đập phá, commit láo thoải mái không sợ sập server!', '🧪');
            } else {
              triggerToast('warn', '🔌 REAL GIT CONNECTED', 'Chú ý: Đã chuyển ngữ trực tiếp vào tệp tin và Repo thật trên ổ đĩa máy chủ!', '⚠️');
            }
          }}
          onToggleAi={handleToggleAiMode}
          onToggleTheme={() => {
            const nextTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
            addLog(nextTheme === 'light' ? '🔆 Theme set to Light Mode.' : '🌙 Theme set to Dark Mode.');
            
            if (nextTheme === 'light') {
              triggerToast('info', '🔆 FLASHBANG INBOUND', 'Flashbang sáng loà! Đôi mắt cú đêm của lập trình viên đang khóc thét.', '😎');
            } else {
              triggerToast('owl', '🌙 SHADOWS OF REBASE', 'Đã về với bóng đêm sâu thẳm. Bảo vệ đôi mắt, thắp sáng dòng code.', '🦉');
            }
          }}
          onUpdateRepoPath={handleUpdateRepoPath}
          onCloneRepo={handleCloneRepo}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isVersionRed={isVersionRed}
          verifyBtnVisible={verifyBtnVisible}
          onVerifyInstallation={() => verifyInstallationWithMetadata(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCommandPalette={() => window.dispatchEvent(new CustomEvent('toggle-ai-doctor'))}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          tone={tone}
          onRefreshAutoFetch={() => {
            setAutoFetchTrigger(prev => prev + 1);
            const newDefault = localStorage.getItem('default_base_branch') || 'develop';
            setRepoState(prev => ({ ...prev, baseBranch: newDefault }));
            handleUpdateWizard({ baseBranch: newDefault });
            
            const hasKey = !!localStorage.getItem('gemini_api_key')?.trim();
            if (!hasKey && isAiEnabled) {
              setIsAiEnabled(false);
              addLog('🤖 AI Engine Disabled automatically because the Gemini API key was cleared.');
            }
          }}
        />

        {/* Unified Mode Switcher Menu Bar */}
        <div 
          id="dashboard-mode-selector" 
          className={`p-1.5 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md backdrop-blur-md transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white/80 border-slate-200/90 shadow-indigo-100/10' 
              : 'bg-[#0a0f1d]/75 border-slate-800/40 shadow-black/20'
          }`}
        >
          {/* Active Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setDashboardMode('daily');
                addLog(`⚙️ Mode switched to: DEVELOPER DAILY. Daily work view activated.`);
                triggerToast('owl', 'DEVELOPER DAILY', tone === TranslationTone.ENGLISH ? 'Showing branches, commit tree history, and stashes.' : 'Đang hiển thị nhánh, cây lịch sử commit, stash hàng ngày.', '💻');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                dashboardMode === 'daily'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 shrink-0 text-current" />
              <span>{tone === TranslationTone.ENGLISH ? "Daily Mode" : "Developer Daily"}</span>
            </button>

            <button
              onClick={() => {
                setDashboardMode('rescue');
                addLog(`🚨 Mode switched to: GIT RESCUE. Emergency recovery view activated.`);
                triggerToast('rage', 'GIT RESCUE', tone === TranslationTone.ENGLISH ? 'Showing reflogs, interactive conflict solvers, and diagnostics.' : 'Đang hiển thị cứu hộ reflogs, giải quyết xung đột rebase, và chẩn đoán lỗi.', '🚑');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                dashboardMode === 'rescue'
                  ? 'bg-rose-600 text-white shadow-lg'
                  : theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-current animate-pulse" />
              <span>{tone === TranslationTone.ENGLISH ? "Git Rescue" : "Git Rescue"}</span>
              {repoState.rebaseInProgress && (
                <span className="w-2 h-2 rounded-full bg-rose-450 animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                setDashboardMode('learning');
                addLog(`🎓 Mode switched to: LEARNING & SIMULATION. Rebase wizards and simulation models activated.`);
                triggerToast('milestone', 'LEARNING & SIMULATION', tone === TranslationTone.ENGLISH ? 'Showing interactive tutorials, flow sandboxes, and simulated scenarios.' : 'Đang hiển thị kịch bản mô phỏng mẫu, bài tập rebase và sa bàn hướng dẫn.', '🏫');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                dashboardMode === 'learning'
                  ? 'bg-emerald-600 dark:bg-emerald-650 text-white shadow-lg'
                  : theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-405 hover:bg-slate-800/50'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 shrink-0 text-current" />
              <span>{tone === TranslationTone.ENGLISH ? "Learning & Sim" : "Learning Mode"}</span>
            </button>
          </div>

          {/* Description of active mode */}
          <div className="px-3 py-1 text-left flex-1 min-w-0 md:block hidden">
            <p className={`text-[11px] leading-relaxed font-sans font-medium truncate ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              <strong className={`font-mono text-[9px] uppercase font-bold tracking-wider mr-1.5 ${
                dashboardMode === 'daily' ? 'text-indigo-600 dark:text-indigo-400' : dashboardMode === 'rescue' ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {tone === TranslationTone.ENGLISH ? 'Scope' : 'Phạm vi'}:
              </strong>
              {dashboardMode === 'daily' 
                ? (tone === TranslationTone.ENGLISH ? "Daily branch maintenance, commits history graph and stashes" : "Nhánh làm việc hàng ngày, biểu đồ lịch sử commit và quản lý stash")
                : dashboardMode === 'rescue'
                ? (tone === TranslationTone.ENGLISH ? "Reflog rescue, conflict solver and repo health diagnostics" : "Khôi phục Reflog, xử lý xung đột Rebase và chẩn đoán sức khỏe Repo")
                : (tone === TranslationTone.ENGLISH ? "Rebase visual wizard, flow simulations and AI clinical lessons" : "Wizard hướng dẫn Rebase, sa bàn mô phỏng kịch bản và thực hành AI")
              }
            </p>
          </div>

          {/* Electron Desktop/IDE Workspace Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/40">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-45 px-1 sm:block hidden">
              WORKSPACE:
            </span>
            
            {/* Split layout toggle */}
            <button
              type="button"
              onClick={() => setWorkspaceLayout(v => v === 'split' ? 'fullscreen' : 'split')}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                workspaceLayout === 'split'
                  ? theme === 'light' ? 'bg-slate-50 hover:bg-slate-150 text-slate-700 border-slate-205' : 'bg-[#151a2d] hover:bg-slate-900 text-slate-300 border-slate-800'
                  : 'bg-indigo-600 text-white border-indigo-700 shadow-inner'
              }`}
              title="Chia cột (Alt+W) | Đổi giữa layout 2 cột IDE và layout Toàn màn hình rộng"
            >
              <Columns className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-mono font-semibold hidden md:inline">
                {workspaceLayout === 'split' ? 'Split' : 'Full'}
              </span>
            </button>

            {/* Sidebar Left/Right toggle */}
            {workspaceLayout !== 'fullscreen' && (
              <button
                type="button"
                onClick={() => setSidebarPosition(v => v === 'left' ? 'right' : 'left')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'light' ? 'hover:bg-slate-100 border-slate-200 text-slate-650' : 'hover:bg-slate-950 border-slate-800 text-slate-300'
                }`}
                title="Vị trí thanh bên (Alt+S) | Đổi vị trí sidebar sang Trái / Phải"
              >
                {sidebarPosition === 'left' ? <AlignLeft className="w-3.5 h-3.5 text-indigo-405" /> : <AlignRight className="w-3.5 h-3.5 text-indigo-405" />}
                <span className="text-[10px] font-mono font-semibold hidden lg:inline capitalize">
                  {sidebarPosition}
                </span>
              </button>
            )}

            {/* Terminal docking toggle */}
            {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
              <button
                type="button"
                onClick={() => setDockTerminalPosition(v => v === 'right' ? 'bottom' : 'right')}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  dockTerminalPosition === 'right'
                    ? theme === 'light' ? 'hover:bg-slate-100 border-slate-200 text-slate-650' : 'hover:bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-[#115e59]/20 text-teal-400 border-[#115e59]/30'
                }`}
                title="Neo Terminal (Alt+D) | Chuyển terminal xuống Dưới (Bottom) hoặc sang Phải (Sidebar)"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="text-[10px] font-mono font-semibold hidden lg:inline capitalize">
                  Dock: {dockTerminalPosition}
                </span>
              </button>
            )}

            {/* Multi-window spawn */}
            <button
              type="button"
              onClick={() => {
                const randomX = 120 + Math.random() * 120;
                const randomY = 120 + Math.random() * 120;
                const newWin = {
                  id: `win-${Date.now()}`,
                  title: '🌳 Detached Git Commit Graph',
                  type: 'commits' as const,
                  x: randomX,
                  y: randomY,
                  width: 440,
                  height: 380
                };
                setDetachedWindows(prev => [...prev, newWin]);
                triggerToast('milestone', '🖥️ MULTI-WINDOW SPAWNED', 'Đã mở cửa sổ phụ kéo thả real-time của Git Commits Graph!', '🪟');
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                theme === 'light' ? 'hover:bg-slate-100 border-slate-200 text-slate-650' : 'hover:bg-slate-955 border-slate-800 text-slate-300'
              }`}
              title="Spawn Window (Alt+J) | Mở thêm cửa sổ phác đồ phụ độc lập kéo thả tự do"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-mono font-semibold hidden md:inline">
                Window
              </span>
            </button>

            {/* Shortcut map */}
            <button
              type="button"
              onClick={() => setShowShortcutCheatSheet(true)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                showShortcutCheatSheet
                  ? 'bg-indigo-600 text-white shadow'
                  : theme === 'light' ? 'hover:bg-slate-100 border-slate-200 text-slate-655' : 'hover:bg-slate-955 border-slate-800 text-slate-300'
                }`}
              title="Phím tắt IDE (Alt+H) | Xem sơ đồ bàn phím của Rebase Overlord Pro"
            >
              <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
          {/* Sidebar on LEFT */}
          {sidebarPosition === 'left' && workspaceLayout !== 'fullscreen' && (
            <div className="lg:col-span-4 flex flex-col gap-5">
              {renderSidebarContent()}
            </div>
          )}

          <div className={`${workspaceLayout === 'fullscreen' ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-5`}>

        {/* Serverless / Vercel Host Warn & Config Banner */}
        {backendStatus === 'unreachable' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-xl p-5 shadow-xl flex flex-col md:flex-row gap-5 items-start justify-between ${theme === 'light' ? 'bg-white border-slate-200 text-slate-855 shadow-sm' : 'bg-slate-900 border-slate-850 text-slate-100'}`}
          >
            <div className="flex gap-3.5 items-start">
              <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg border border-amber-500/20 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-sm font-semibold font-mono tracking-wide uppercase flex items-center gap-2 ${theme === 'light' ? 'text-slate-950' : 'text-slate-100'}`}>
                  ⚠️ Phát Hiện Máy Chủ Tĩnh (Vercel / GitHub Pages Hosting detected)
                </h4>
                <p className={`text-xs leading-relaxed font-sans max-w-3xl ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Để thực hiện các thao tác Git thực tế (như <code className={`px-1 py-0.5 rounded font-mono border text-[10px] ${theme === 'light' ? 'text-amber-800 bg-amber-50/50 border-amber-200' : 'text-amber-400 bg-slate-950 border-slate-900'}`}>git clone</code>, chọn thư mục ổ đĩa của bạn), hệ thống cần một máy chủ liên tục (stateful Node Express backend). Do Vercel là nền tảng Serverless tĩnh, hệ thống đã <strong className="text-emerald-400 font-semibold">Tự Thừa Kế & Tự Động Kích Hoạt chế độ Giả Lập (Simulation Playground)</strong> để bạn có thể trải nghiệm toàn vẹn dòng chảy logic Rebase mượt mà.
                </p>
                <p className="text-[11px] text-indigo-400 leading-relaxed font-mono">
                  💡 Bạn muốn lấy repo thật từ Windows/MacOS của mình? Hãy chạy lệnh <code className={`px-1 rounded ${theme === 'light' ? 'text-slate-800 bg-slate-100' : 'text-slate-300 bg-slate-950'}`}>npm start</code> cục bộ trên máy và dán địa chỉ localhost ở khung cấu hình bên phải!
                </p>
              </div>
            </div>

            <div className={`border rounded-xl p-4 w-full md:w-[320px] shrink-0 self-stretch flex flex-col justify-between gap-3 text-xs ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cầu Nối API Cục Bộ (Hybrid Live Switcher)</span>
                <input
                  type="text"
                  placeholder="Ví dụ: http://localhost:3000"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  className={`w-full rounded px-2.5 py-1.5 font-mono text-[11px] focus:outline-none focus:border-indigo-500 border ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#060814] border-slate-800 text-slate-300'}`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (customBackendUrl.trim()) {
                      localStorage.setItem('rebase_overlord_backend_url', customBackendUrl.trim());
                      addLog(`🔗 Kết nối Custom Backend URL: ${customBackendUrl.trim()}`);
                    } else {
                      localStorage.removeItem('rebase_overlord_backend_url');
                      addLog(`🔗 Đã gỡ bỏ Custom Backend URL. Sử dụng cấu hình mặc định.`);
                    }
                    handleRefresh();
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-slate-500 hover:text-white transition-all text-white font-mono text-[10px] py-1.5 px-2 rounded font-bold cursor-pointer border border-indigo-500/20 active:scale-95 text-center"
                >
                  Kết nối Live
                </button>
                {localStorage.getItem('rebase_overlord_backend_url') && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('rebase_overlord_backend_url');
                      setCustomBackendUrl('');
                      addLog(`🔗 Reset Custom Backend. Sử dụng mặc định.`);
                      handleRefresh();
                    }}
                    className="bg-rose-950/40 hover:bg-rose-900/60 transition-all text-rose-400 font-mono text-[10px] py-1.5 px-2.5 rounded border border-rose-900/30 cursor-pointer text-center"
                    title="Xóa cấu hình địa chỉ tự chọn"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Git Branch Metrics & Insights Panel */}
        {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
          <div className={`p-4 rounded-xl border mb-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans text-xs transition-all ${
            theme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-slate-900/40 border-slate-800 text-slate-200'
          }`}>
            {/* Branch Status details */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`px-2.5 py-1 rounded-md border font-mono font-bold tracking-tight text-xs flex items-center gap-2 ${
                theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-500/15 border-indigo-500/20 text-indigo-300'
              }`}>
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{repoState.currentBranch}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(repoState.currentBranch || '');
                      setCopiedCurrentBranch(true);
                      setTimeout(() => setCopiedCurrentBranch(false), 1500);
                    } catch (err) {}
                  }}
                  className={`p-1 rounded cursor-pointer transition-all duration-150 shrink-0 flex items-center justify-center ${
                    theme === 'light'
                      ? 'hover:bg-slate-200/50 text-indigo-655 active:bg-slate-300/60'
                      : 'hover:bg-slate-800/60 text-indigo-300 active:bg-slate-800/80'
                  }`}
                  title={tone === TranslationTone.ENGLISH ? "Copy branch name" : "Sao chép tên nhánh"}
                >
                  {copiedCurrentBranch ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-405 font-medium">
                <span>{tone === TranslationTone.ENGLISH ? "compared to" : "so với"}</span>
                <div className="relative inline-block">
                  <select
                    value={repoState.baseBranch || 'develop'}
                    onChange={(e) => handleQuickBaseChange(e.target.value)}
                    className={`font-mono font-semibold px-2 py-0.5 pr-6 rounded border text-[11px] outline-none cursor-pointer appearance-none transition-colors ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    style={{ backgroundImage: 'none' }}
                  >
                    {(() => {
                      const customListStr = localStorage.getItem('custom_base_branches_list') || 'develop, main, master, dev, test';
                      const customList = customListStr.split(',').map(s => s.trim()).filter(Boolean);
                      const currentActive = repoState.baseBranch || 'develop';
                      const finalOptions = Array.from(new Set([...customList, currentActive]));
                      return finalOptions.map(bName => (
                        <option key={bName} value={bName} className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-slate-900 text-slate-200'}>
                          {bName}
                        </option>
                      ));
                    })()}
                  </select>
                  <div className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Metrics Badges */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 border transition-all duration-150 ${
                  branchMetrics.ahead > 0
                    ? (theme === 'light' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                    : (theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-800/40 border-slate-800 text-slate-500')
                }`} title={tone === TranslationTone.ENGLISH ? `${branchMetrics.ahead} ahead commits (ready to squash/rebase)` : `${branchMetrics.ahead} commit ahead (đã sẵn sàng để gộp hoặc rebase)`}>
                  <ArrowUpCircle className={`w-3 h-3 ${branchMetrics.ahead > 0 ? (theme === 'light' ? 'text-emerald-600' : 'text-emerald-400') : 'text-slate-400'}`} />
                  <span>Ahead: {branchMetrics.ahead}</span>
                </span>

                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 border transition-all duration-150 ${
                  theme === 'light'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-indigo-500/15 border-indigo-500/25 text-indigo-400'
                }`}>
                  <span>{tone === TranslationTone.ENGLISH ? 'To Process' : 'Sẽ xử lý'}: {branchMetrics.actionable}/{branchMetrics.total} commits</span>
                </span>
              </div>
            </div>

            {/* Status advice or warner based on ahead/behind metrics */}
            {branchMetrics.behind > 0 ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-500 max-w-md text-[11px] leading-snug">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>{tone === TranslationTone.ENGLISH ? "Conflict Warning:" : "Cảnh báo:"}</strong> {tone === TranslationTone.ENGLISH ? `Your branch is behind by ${branchMetrics.behind} commits. Rebasing is strongly recommended to stay updated.` : `Nhánh của bạn đang bị chậm ${branchMetrics.behind} commit so với base branch. Hãy chạy Rebase để cập nhật mã nguồn mới nhất và tránh xung đột khi merge!`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{tone === TranslationTone.ENGLISH ? "Healthy branch! Fully up-to-date with base branch." : "Nhánh sạch sẽ, đã đồng bộ hoàn toàn với base branch!"}</span>
              </div>
            )}
          </div>
        )}

        {/* Dense Commits Handler: Pagination & Search filter */}
        {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
          <div className={`p-3 rounded-xl border mb-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none ${
            theme === 'light' ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-slate-900 border-slate-800/80 text-slate-200'
          }`}>
            {/* Search component */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={tone === TranslationTone.ENGLISH ? "Search commits by msg or SHA..." : "Tìm commit bằng SHA hoặc nội dung..."}
                value={commitSearchTerm}
                onChange={(e) => {
                  setCommitSearchTerm(e.target.value);
                  setCommitPageOffset(0); // reset page offset on search change
                }}
                className={`w-full rounded-lg pl-8 pr-2.5 py-1.5 font-sans focus:outline-none focus:border-indigo-500 border ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-855' : 'bg-[#060814] border-slate-800 text-slate-200'
                }`}
              />
            </div>

            {/* Range settings and pagination */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Max commits visible select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{tone === TranslationTone.ENGLISH ? "Nodes Limit:" : "Trượt màn hình:"}</span>
                <select
                  value={maxVisibleCommits}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMaxVisibleCommits(val === 'all' ? 'all' : parseInt(val, 10));
                    setCommitPageOffset(0);
                  }}
                  className={`rounded border px-2 py-1 select-none font-mono text-[11px] focus:outline-none ${
                    theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-850 text-slate-300'
                  }`}
                >
                  <option value="5">5 commits</option>
                  <option value="10">10 commits ({tone === TranslationTone.ENGLISH ? 'Default' : 'Chuẩn'})</option>
                  <option value="15">15 commits</option>
                  <option value="25">25 commits</option>
                  <option value="all">{tone === TranslationTone.ENGLISH ? 'Show All' : 'Tất cả'} ({filteredCommitsForSquash.length})</option>
                </select>
              </div>

              {/* Pagination Controls */}
              {maxVisibleCommits !== 'all' && filteredCommitsForSquash.length > maxVisibleCommits && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={commitPageOffset === 0}
                    onClick={() => setCommitPageOffset(prev => Math.max(0, prev - 1))}
                    className={`p-1 px-2.5 rounded transition-all cursor-pointer font-bold select-none border border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
                      theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 hover:bg-slate-850 text-white shadow'
                    }`}
                    title={tone === TranslationTone.ENGLISH ? "Newer commits" : "Commit mới hơn / Trang trước"}
                  >
                    &larr; {tone === TranslationTone.ENGLISH ? "Newer" : "Mới hơn"}
                  </button>
                  
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                    {commitPageOffset + 1} / {Math.ceil(filteredCommitsForSquash.length / (maxVisibleCommits as number))}
                  </span>

                  <button
                    type="button"
                    disabled={commitPageOffset >= Math.ceil(filteredCommitsForSquash.length / (maxVisibleCommits as number)) - 1}
                    onClick={() => setCommitPageOffset(prev => prev + 1)}
                    className={`p-1 px-2.5 rounded transition-all cursor-pointer font-bold select-none border border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
                      theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-805 shadow-sm' : 'bg-slate-950 border-slate-800 hover:bg-slate-850 text-white shadow'
                    }`}
                    title={tone === TranslationTone.ENGLISH ? "Older commits" : "Commit cũ hơn / Trang sau"}
                  >
                    {tone === TranslationTone.ENGLISH ? "Older" : "Cũ hơn"} &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {(dashboardMode === 'daily' || dashboardMode === 'learning') && (
          <>
            {/* Clean Controls Toolbar Row (outside viewport to guarantee zero overlaps with rendered graph nodes) */}
              <div className={`flex flex-wrap items-center justify-between gap-3 p-2 mb-3.5 rounded-lg border shadow-sm select-none font-mono text-xs ${
                theme === 'light' 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-900 border-slate-800/80 text-slate-200'
              }`}>
                {/* Left side actions */}
                <div className="flex items-center gap-2">
                  {/* Mode Selector (Desktop only) */}
                  {!isMobile && (
                    <div className="flex items-center gap-0.5 bg-slate-200/50 dark:bg-slate-950/60 p-0.5 rounded-md border border-slate-300 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTool('dragNode')}
                        className={`p-1.5 rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                          activeTool === 'dragNode'
                            ? 'bg-indigo-650 text-white shadow font-semibold'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-405 hover:bg-slate-800/50'
                        }`}
                        title={sloc.dragNodeModeLabel}
                      >
                        <MousePointer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveTool('pan')}
                        className={`p-1.5 rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                          activeTool === 'pan'
                            ? 'bg-indigo-650 text-white shadow font-semibold'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-405 hover:bg-slate-850'
                        }`}
                        title={sloc.panModeLabel}
                      >
                        <Hand className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {!isMobile && <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />}

                  {/* Left/Right / Rotation layout toggler */}
                  <button
                    onClick={() => setIsGraphVertical(v => !v)}
                    className={`p-1.5 rounded border border-transparent hover:border-slate-350 dark:hover:border-slate-800 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                      theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title={isGraphVertical ? "Layout Dọc. Bấm để chuyển sang Ngang (Horizontal Layout)" : "Layout Ngang. Bấm để chuyển sang Dọc (Vertical Layout)"}
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-350 ${isGraphVertical ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Right side adjustments */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Node width slide adjustment */}
                  <div className="flex items-center gap-1.5 px-1" title={sloc.nodeSizeLabel}>
                    <Move className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <input
                      type="range"
                      min="140"
                      max="340"
                      step="10"
                      value={nodeWidth}
                      onChange={(e) => setNodeWidth(parseInt(e.target.value))}
                      className="w-16 sm:w-20 accent-indigo-505 cursor-ew-resize h-1 bg-slate-205 dark:bg-slate-800 rounded appearance-none"
                    />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none font-bold font-mono transition-all ${
                      theme === 'light'
                        ? 'bg-indigo-50 border-indigo-200/80 text-indigo-700 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-indigo-300 shadow-sm'
                    }`}>
                      {nodeWidth}px
                    </span>
                  </div>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80" />

                  {/* Zoom adjustment */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setZoomScale(z => Math.max(0.15, Math.round((z - 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-805 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomOut}
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                    <span className="w-8 text-center font-bold text-[10px]">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale(z => Math.min(5.0, Math.round((z + 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-855 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomIn}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80" />

                  {/* Reset Layout */}
                  <button
                    onClick={() => {
                      setZoomScale(1.0);
                      setNodeWidth(180);
                      setResetKey(k => k + 1);
                      setExpandedNodes({});
                      setNodeSizes({});
                      setConnections([]);
                      triggerRenderTick();
                    }}
                    className="p-1 px-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                    title={sloc.resetLayout}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Graphical representation of the Rebase squash action (Board Viewport) */}
              <div 
                ref={setViewportRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`w-full h-[480px] rounded-xl border relative overflow-hidden flex items-center justify-center select-none ${
                  theme === 'light' 
                    ? 'bg-slate-50/50 border-slate-205 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]' 
                    : 'bg-[#090d16] border-slate-900 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
                }`}
              >
                {/* Active Tool Overlay Badge */}
                <div className={`hidden sm:flex absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-mono border uppercase items-center gap-1 ${
                  theme === 'light' 
                    ? 'bg-white text-slate-800 border-slate-200 shadow-sm' 
                    : 'bg-slate-900/85 text-white border-slate-850 shadow-md'
                }`}>
                  {activeTool === 'pan' ? (
                    <>
                      <Hand className="w-3 h-3 text-indigo-400" />
                      <span>{sloc.panModeLabel}</span>
                    </>
                  ) : (
                    <>
                      <MousePointer className="w-3 h-3 text-indigo-400" />
                      <span>{sloc.dragNodeModeLabel}</span>
                    </>
                  )}
                </div>

                {/* Micro Drag n drop Tip overlay */}
                {!isMobile && (
                  <div className={`absolute bottom-3 left-3 z-10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono border font-semibold ${
                    theme === 'light' 
                      ? 'bg-white/80 border-slate-200 text-indigo-600 shadow-sm' 
                      : 'bg-slate-900/80 border-slate-850 text-indigo-400 shadow'
                  }`}>
                    <span>💡 {sloc.dragTip}</span>
                  </div>
                )}

                <div className="hidden sm:flex absolute top-3 right-3 z-20 items-center gap-1.5 p-1.5 rounded-lg border bg-white dark:bg-slate-900 shadow-sm" title={sloc.nodeSizeLabel}>
                    <Move className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <input
                      type="range"
                      min="140"
                      max="340"
                      step="10"
                      value={nodeWidth}
                      onChange={(e) => setNodeWidth(parseInt(e.target.value))}
                      className="w-14 sm:w-18 accent-indigo-500 cursor-ew-resize h-1 bg-slate-205 dark:bg-slate-800 rounded appearance-none"
                    />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none font-bold font-mono transition-all ${
                      theme === 'light'
                        ? 'bg-indigo-50 border-indigo-200/80 text-indigo-700 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-indigo-300 shadow-sm'
                    }`}>
                      {nodeWidth}px
                    </span>


                  <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />

                  {/* Zoom adjustment */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setZoomScale(z => Math.max(0.15, Math.round((z - 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-805 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomOut}
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                    <span className="w-8 text-center font-bold text-[10px]">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale(z => Math.min(5.0, Math.round((z + 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-855 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomIn}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />

                  {/* Reset Layout */}
                  <button
                    onClick={() => {
                      setZoomScale(1.0);
                      setNodeWidth(180);
                      setResetKey(k => k + 1);
                      setExpandedNodes({});
                      setNodeSizes({});
                      setConnections([]);
                      triggerRenderTick();
                    }}
                    className="p-1 px-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-all cursor-pointer active:scale-95"
                    title={sloc.resetLayout}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inner zoomable and pannable board */}
                <motion.div
                  ref={boardRef}
                  key={`board-${resetKey}`}
                  drag={activeTool === 'pan'}
                  dragConstraints={false}
                  dragElastic={0.1}
                  dragMomentum={true}
                  style={{
                    scale: zoomScale,
                    transformOrigin: "center center"
                  }}
                  className="w-full h-full flex items-center justify-center relative touch-none"
                >
                  {/* SVG connections overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                    <defs>
                      <marker
                        id="arrowhead-connector"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 7 3.5, 0 7" fill={theme === 'light' ? '#6366f1' : '#818cf8'} />
                      </marker>
                    </defs>
                    {connections.map((conn, idx) => {
                      const isVertical = isGraphVertical;
                      let pathD = '';
                      if (isVertical) {
                        const dy = conn.endY - conn.startY;
                        const cp1Y = conn.startY + dy * 0.45;
                        const cp2Y = conn.startY + dy * 0.55;
                        pathD = `M ${conn.startX} ${conn.startY} C ${conn.startX} ${cp1Y}, ${conn.endX} ${cp2Y}, ${conn.endX} ${conn.endY}`;
                      } else {
                        const dx = conn.endX - conn.startX;
                        const cp1X = conn.startX + dx * 0.45;
                        const cp2X = conn.startX + dx * 0.55;
                        pathD = `M ${conn.startX} ${conn.startY} C ${cp1X} ${conn.startY}, ${cp2X} ${conn.endY}, ${conn.endX} ${conn.endY}`;
                      }
                      return (
                        <path
                          key={idx}
                          d={pathD}
                          stroke={theme === 'light' ? '#6366f1' : '#818cf8'}
                          strokeWidth="2.5"
                          strokeDasharray={conn.isDash ? '4 4' : undefined}
                          fill="none"
                          markerEnd="url(#arrowhead-connector)"
                          className="opacity-75 transition-all duration-75"
                        />
                      );
                    })}
                  </svg>

                  {/* The actual flow nodes */}
                  <div className={`flex items-center justify-center gap-12 p-24 relative z-10 ${
                    isGraphVertical ? 'flex-col' : 'flex-row'
                  }`}>

                    {/* Develop Head represent */}
                    <motion.div
                      ref={devRef}
                      drag={!isMobile && activeTool === 'dragNode'}
                      dragConstraints={false}
                      dragElastic={0.2}
                      whileDrag={{ scale: 1.05 }}
                      onDrag={() => {
                        updateConnectionPaths();
                      }}
                      onDragEnd={() => {
                        updateConnectionPaths();
                      }}
                      style={{
                        marginLeft: (isSimulation && isGraphVertical) ? '-180px' : undefined,
                        marginTop: (isSimulation && !isGraphVertical) ? '-110px' : undefined,
                      }}
                      className={`flex flex-col items-center gap-1.5 px-3 min-w-fit relative ${!isMobile && activeTool === 'dragNode' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-md flex items-center justify-center text-xs font-mono font-bold text-emerald-300">
                        dev
                      </div>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>develop head</div>
                    </motion.div>

                    {wizard.step < 5 ? (
                      <>
                        {/* Commits checklist visualization line items before squash */}
                        {activeCommitsForSquash.length === 0 ? (
                          <div className="text-slate-400 text-xs italic py-2">
                            {sloc.emptyCommits}
                          </div>
                        ) : filteredCommitsForSquash.length === 0 ? (
                          <div className="text-slate-400 text-xs italic py-2">
                            {tone === TranslationTone.ENGLISH ? "No commits match your current filter." : "Không tìm thấy commit nào khớp bộ lọc tìm kiếm."}
                          </div>
                        ) : (
                          paginatedCommitsForSquash.map((c, i) => {
                            const track = c.track !== undefined ? c.track : 1;
                            return (
                              <React.Fragment key={c.sha}>
                                <CommitNodeCard
                                  c={c}
                                  theme={theme}
                                  tone={tone}
                                  activeTool={activeTool}
                                  isMobile={isMobile}
                                  wizard={wizard}
                                  expandedNodes={expandedNodes}
                                  setExpandedNodes={setExpandedNodes}
                                  nodeSizes={nodeSizes}
                                  isSimulation={isSimulation}
                                  track={track}
                                  isGraphVertical={isGraphVertical}
                                  nodeWidth={nodeWidth}
                                  nodeRefs={nodeRefs}
                                  updateConnectionPaths={updateConnectionPaths}
                                  triggerRenderTick={triggerRenderTick}
                                  handleResizeStart={handleResizeStart}
                                  hoveredSha={hoveredSha}
                                  setHoveredSha={setHoveredSha}
                                  fetchCommitFiles={fetchCommitFiles}
                                  loadingFilesShas={loadingFilesShas}
                                  commitFiles={commitFiles}
                                  isTouchOnly={isTouchOnly}
                                />
                              </React.Fragment>
                            );
                          })
                        )}
                      </>
                    ) : (
                      /* Commits squashed visual state showing a single clean unified block head */
                      <div className={`flex items-center gap-3 border p-4 rounded-xl animate-fade-in text-center max-w-md w-full ${theme === 'light' ? 'bg-indigo-50/50 border-indigo-200' : 'bg-indigo-550/10 border-indigo-500/30'}`}>
                        <div className="bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 p-2.5 rounded-lg border border-indigo-500/30 shrink-0">
                          <GitMerge className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="text-xs text-left">
                          <div className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-wider mb-0.5">{sloc.squashCompletedTitle}</div>
                          <div className={`font-mono font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{wizard.finalMsg}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-1">Author: Nguyen Tran | Date: Just now</div>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              </div>
          </>
        )}

            {/* Dynamic Active Git Operational Visualizer */}
            {dashboardMode === 'learning' && (
              <GitVisualizerPanel 
                tone={tone} 
                wizard={wizard} 
                theme={theme} 
                repoState={repoState} 
                isSimulation={isSimulation}
                isAiEnabled={isAiEnabled}
                onToggleSimulation={(val) => {
                  setIsSimulation(val);
                  addLog(`🤖 Mode toggled from Sa bàn. Simulation Playground: ${val ? 'ACTIVE' : 'OFF'}`);
                  handleRefresh(val);
                  
                  if (val) {
                    triggerToast('milestone', '⚡ SIMULATION RUNTIME', 'Sandbox mô phỏng an toàn đã kích hoạt. Đập phá, commit láo thoải mái không sợ sập server!', '🧪');
                  } else {
                    triggerToast('warn', '🔌 REAL GIT CONNECTED', 'Chú ý: Đã chuyển ngữ trực tiếp vào tệp tin và Repo thật trên ổ đĩa máy chủ!', '⚠️');
                  }
                }}
              />
            )}

            {/* Core Wizard state dashboard */}
            {dashboardMode === 'learning' && (
              <WizardPanel
                commits={repoState.commits}
                wizard={wizard}
                tone={tone}
                useEmoji={useEmoji}
                theme={theme}
                onUpdateWizard={handleUpdateWizard}
                onExecuteWizardRebase={handleExecuteWizardRebase}
                onResetWizard={handleResetWizard}
                repoState={repoState}
              />
            )}

            {/* Visual Git Stash Inventory Shelf Panel */}
            {dashboardMode === 'daily' && (
              <StashPanel
                theme={theme}
                tone={tone}
                stashes={repoState.stashes || []}
                currentBranch={repoState.currentBranch || 'master'}
                rebaseInProgress={repoState.rebaseInProgress}
                mergeInProgress={repoState.mergeInProgress}
                isRefreshing={isFetchingGlobal}
                onUnstash={handleUnstash}
              />
            )}

            {/* Emergency Conflict Resolution Panel if in rebaseProgress */}
            {(dashboardMode === 'rescue' || repoState.rebaseInProgress || wizard.status === 'paused_conflict') && (
              <ConflictSolver
                conflicts={repoState.conflicts}
                tone={tone}
                currentBranch={repoState.currentBranch || 'feature-branch'}
                baseBranch={wizard.baseBranch || repoState.baseBranch || 'develop'}
                isAiEnabled={isAiEnabled}
                theme={theme}
                onResolveFile={handleResolveFile}
                onCompleteRecovery={handleCompleteRecovery}
              />
            )}

            {/* Dynamic visual terminal logger console (bottom-docked) */}
            {dockTerminalPosition === 'bottom' && (dashboardMode === 'daily' || dashboardMode === 'rescue') && (
              <TerminalPanel
                logs={logs}
                showLogPanel={showLogPanel}
                onToggleLogPanel={() => setShowLogPanel(!showLogPanel)}
                onClearLogs={() => setLogs([])}
                tone={tone}
                isSimulation={isSimulation}
                isAiEnabled={isAiEnabled}
                onCommandExecuted={() => handleRefresh(true)}
                addLog={addLog}
                resolveApiUrl={resolveApiUrl}
                theme={theme}
              />
            )}
          </div>

          {/* Right Sidebar Position */}
          {sidebarPosition === 'right' && workspaceLayout !== 'fullscreen' && (
            <div id="workspace-sidebar-right" className="lg:col-span-4 flex flex-col gap-5">
              {renderSidebarContent()}
            </div>
          )}

          {/* Original Right Panel Rails split containing branch widgets, diagnostics and terminal logs (to be removed next) */}
          <div className="lg:col-span-4 flex flex-col gap-5 select-none" style={{ display: 'none' }}>
            
            {/* Git Branch Interactive Hub switcher */}
            {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
              <BranchPanel
                branches={repoState.branches}
                currentBranch={repoState.currentBranch}
                tone={tone}
                useEmoji={useEmoji}
                theme={theme}
                checkingOutBranch={checkingOutBranch}
                onCheckout={handleCheckoutBranch}
                onCreateBranch={handleCreateBranch}
                onDeleteBranch={handleDeleteBranch}
                onFetch={handleFetch}
                onPullBranch={handlePullBranch}
                onPushBranch={handlePushBranch}
                isFetchingGlobal={isFetchingGlobal}
              />
            )}

            {/* Simulated Live Diagnostic Warnings Panel with AI Git Doctor Integration */}
            {(dashboardMode === 'rescue' || dashboardMode === 'learning') && (
              !showWarningsPanel ? (
              <div id="git-warnings-collapsed" className={`rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${theme === 'light' ? 'bg-slate-50/70 text-slate-600' : 'bg-[#0b0c10]/40 text-slate-450'}`}>
                <div className="flex items-center gap-2 text-xs text-slate-450 font-mono">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold uppercase tracking-wider">{sloc.title}</span>
                  <span className="text-[10px] text-slate-405 opacity-60">
                    ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWarningsPanel(true)}
                  className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-750 hover:bg-indigo-100'
                      : 'bg-[#1e293b] border-indigo-505/20 text-indigo-400 hover:text-indigo-303'
                  }`}
                  title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div id="git-warnings-board" className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${theme === 'light' ? 'bg-slate-50/60 text-slate-700 font-mono text-[11px]' : 'bg-[#0b0c10]/40 text-slate-300 font-mono text-[11px]'}`}>
                <div className={`flex items-center justify-between border-b pb-2 ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/40'}`}>
                  <h3 className={`text-[11px] font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Settings className="w-3.5 h-3.5 text-slate-450 animate-spin-slow" />
                    <span>{sloc.title}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {isSimulation && (
                      <span className="text-[9px] font-mono text-indigo-400 bg-indigo-501/10 px-1.5 py-0.5 rounded border border-indigo-501/15">
                        {sloc.simulationAnomalyBadge}
                      </span>
                    )}

                    {/* Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowWarningsPanel(false)}
                      className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
                        theme === 'light' 
                          ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                          : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-355'
                      }`}
                      title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
                    >
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                <div className={`flex flex-col gap-1.5 text-xs font-mono border-b pb-2 ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-800/40'}`}>
                  {/* 1. Git Installation Health */}
                  <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                    <span className="text-slate-450">{sloc.gitEnv}</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                      ✓ STABLE (v2.41)
                    </span>
                  </div>

                  {/* 2. GitHub auth check */}
                  <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                    <span className="text-slate-450">{sloc.githubCli}</span>
                    {repoState.ghAvailable ? (
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px] flex items-center gap-1">
                        <Github className="w-3" /> ✓ AUTHORIZED
                      </span>
                    ) : (
                      <span className="text-rose-450 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/15 text-[10px]" title="Please sign-in to gh-cli on system">
                        ⚠️ NOT SIGNED
                      </span>
                    )}
                  </div>

                  {/* 3. Rebase health check indicator */}
                  <div className={`flex justify-between items-center p-1.5 rounded ${theme === 'light' ? 'bg-white/80' : 'bg-slate-900/30'}`}>
                    <span className="text-slate-450">{sloc.rebaseStatus}</span>
                    {repoState.rebaseInProgress ? (
                      <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px] animate-pulse">
                        🚧 PAUSED_CONFL (PAUSE)
                      </span>
                    ) : (
                      <span className="text-emerald-500 text-[10px] uppercase font-bold">
                        {sloc.readyStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* SIMULATION ANOMALY TOGGLERS FOR TESTING/EXPERIMENTATION */}
                {isSimulation && (
                  <div className={`rounded-lg p-2.5 flex flex-col gap-2 ${theme === 'light' ? 'bg-white/40' : 'bg-slate-900/20'}`}>
                    {/* Preset Scenario Selector */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block font-bold">
                        {sloc.simScenarioHeading}
                      </span>
                      <select
                        value={simScenarioId}
                        onChange={(e) => {
                          const targetVal = e.target.value as any;
                          setSimScenarioId(targetVal);
                          addLog(`[Mô phỏng] Đã chuyển đổi kịch bản kiểm thử Git sang: ${targetVal.toUpperCase()}`);
                        }}
                        className={`w-full px-2.5 py-1 text-xs font-mono rounded border transition-colors outline-none cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-750'
                        }`}
                      >
                        <option value="linear">🟢 {sloc.simScenarioLinear}</option>
                        <option value="powerbi">📊 {sloc.simScenarioPowerBI}</option>
                        <option value="large_history">⚡ {sloc.simScenarioLargeHistory}</option>
                        <option value="large_nonlinear">🌀 {sloc.simScenarioLargeNonLinear}</option>
                        <option value="nonlinear">🟣 {sloc.simScenarioNonLinear}</option>
                        <option value="rewrite">🟡 {sloc.simScenarioRewrite}</option>
                        <option value="stale">🟠 {sloc.simScenarioStale}</option>
                        <option value="detached">🔴 {sloc.simScenarioDetached}</option>
                      </select>
                      <p className="text-[9.5px] text-slate-500 leading-normal font-sans">
                        {sloc.simScenarioDesc}
                      </p>
                    </div>

                    <div className="border-t border-slate-200/40 dark:border-slate-800/30" />
<div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                      {sloc.simulateAnomaliesHeading}
                    </span>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      <button 
                        onClick={() => {
                          const current = !isDivergedSimulated;
                          setIsDivergedSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt lỗi lệch pha (Diverged)' : 'Đã xoá lỗi lệch pha'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isDivergedSimulated 
                            ? theme === 'light'
                              ? 'bg-amber-100 hover:bg-amber-200 border-amber-400/70 text-amber-955 font-bold shadow-sm'
                              : 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isDivergedSimulated ? sloc.divergedUnsafeLabel : sloc.divergedSafeLabel}
                      </button>

                      <button 
                        onClick={() => {
                          const current = !isDetachedHeadSimulated;
                          setIsDetachedHeadSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt trạng thái Detached HEAD' : 'Đã xoá Detached HEAD'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isDetachedHeadSimulated 
                            ? theme === 'light'
                              ? 'bg-rose-100 hover:bg-rose-200 border-rose-400/70 text-rose-955 font-bold shadow-sm'
                              : 'bg-rose-550/15 border-rose-500/30 text-rose-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-205 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isDetachedHeadSimulated ? sloc.detachedUnsafeLabel : sloc.detachedSafeLabel}
                      </button>

                      <button 
                        onClick={() => {
                          const current = !isStaleBaseSimulated;
                          setIsStaleBaseSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt trạng thái base mốc lỗi thời' : 'Đã đồng bộ base'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isStaleBaseSimulated 
                            ? theme === 'light'
                              ? 'bg-amber-100 hover:bg-amber-200 border-amber-400/70 text-amber-955 font-bold shadow-sm'
                              : 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-205 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isStaleBaseSimulated ? sloc.staleUnsafeLabel : sloc.staleSafeLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ANOMALIES & DIAGNOSTIC DIRECTIVES CENTER */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase block">
                  {sloc.diagnosticsActionHeading}
                </span>

                <div className="flex flex-col gap-2">
                  {/* Issue A: Uncommitted Changes */}
                  {repoState.isDirty && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-200 bg-amber-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'dirty_working_tree' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-50/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.dirty.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-indigo-700 dark:text-indigo-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.dirty.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
                              {sloc.uncommittedChangesTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'dirty_working_tree' ? null : 'dirty_working_tree');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/80 text-amber-800' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {sloc.uncommittedChangesDesc.replace("{0}", String(repoState.dirtyFiles?.length || 0))}
                          </span>

                          {repoState.dirtyFiles && repoState.dirtyFiles.length > 0 && (
                            <div className="mt-2 text-[10px]">
                              <span className={`font-semibold block ${theme === 'light' ? 'text-slate-700 font-bold' : 'text-slate-300 font-bold'} mb-1`}>
                                {sloc.dirtyFilesLabel}
                              </span>
                              <div className="mt-1 flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                                {repoState.dirtyFiles.map(file => (
                                  <div key={file} className="flex items-center gap-1.5">
                                    <span className="w-1.2 h-1.2 rounded-full bg-amber-500"></span>
                                    <span className={`font-mono text-[10px] truncate ${theme === 'light' ? 'text-slate-700 bg-slate-100 border-slate-200' : 'text-amber-250 bg-slate-950/40 border-amber-500/10'} px-1.5 py-0.5 rounded border`}>
                                      {file}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('dirty_working_tree')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-indigo-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-slate-105 hover:bg-slate-200 border-slate-300 text-slate-700 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                          }`}
                        >
                          stash
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: tone === TranslationTone.ENGLISH ? "Discard Changes" : tone === TranslationTone.TOXIC ? "HUỶ BỎ TOÀN BỘ CÔNG SỨC" : "Hủy bỏ thay đổi",
                              message: sloc.discardConfirm,
                              onConfirm: () => handleTriggerDoctorAction('dirty_working_tree', 'discard')
                            });
                          }}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 font-medium'
                              : 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          discard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue B: Diverged Branch */}
                  {(isSimulation ? isDivergedSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-300 bg-amber-50/80 shadow-xs' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'diverged_branch' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-5/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.diverged.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-indigo-700 dark:text-indigo-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.diverged.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-955' : 'text-amber-300'}`}>
                              {sloc.divergedTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'diverged_branch' ? null : 'diverged_branch');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/85 text-amber-955' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.divergedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('diverged_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-indigo-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-850'
                          }`}
                        >
                          pull --rebase
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: tone === TranslationTone.ENGLISH ? "Force Push Warning" : tone === TranslationTone.TOXIC ? "CẢNH BÁO FORCE PUSH THÔ BẠO" : "Cảnh báo Force Push",
                              message: sloc.forcePushConfirm,
                              onConfirm: () => handleTriggerDoctorAction('diverged_branch', 'force_push')
                            });
                          }}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                              : 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          force push
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue C: Detached HEAD */}
                  {(isSimulation ? isDetachedHeadSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-rose-300 bg-rose-50/80 shadow-xs' : 'border-rose-500/20 bg-rose-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'detached_head' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-rose-50/98 border border-rose-205 text-slate-900' 
                            : 'bg-slate-950/98 border border-rose-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-rose-600 dark:text-rose-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-rose-700 dark:text-rose-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.detached.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-indigo-700 dark:text-indigo-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.detached.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-rose-955 font-bold' : 'text-rose-300'}`}>
                              {sloc.detachedTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'detached_head' ? null : 'detached_head');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-rose-200/85 text-rose-955' : 'hover:bg-slate-800 text-rose-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.detachedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('detached_head')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-indigo-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-rose-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                          className="px-1.5 py-0.5 bg-rose-600 text-white border border-rose-500/25 rounded cursor-pointer font-medium hover:bg-rose-500 transition-colors"
                        >
                          {sloc.rescueBranchBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue D: Stale Base Branch */}
                  {(isSimulation ? isStaleBaseSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-300 bg-amber-50/80 shadow-xs' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'stale_base_branch' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-50/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.stale.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-indigo-700 dark:text-indigo-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.stale.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-955' : 'text-amber-305'}`}>
                              {sloc.staleBaseTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'stale_base_branch' ? null : 'stale_base_branch');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/85 text-amber-955' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.staleBaseDesc.replace("{0}", wizard.baseBranch || 'develop')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('stale_base_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-indigo-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          fetch & pull sync
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean State Fallback */}
                  {!repoState.isDirty && 
                   !(isSimulation && isDivergedSimulated) && 
                   !(isSimulation && isDetachedHeadSimulated) && 
                   !(isSimulation && isStaleBaseSimulated) && (
                    <div className="border border-emerald-500/10 bg-emerald-950/5 p-3 rounded-xl text-center flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                      <div className="text-[10px] font-mono font-semibold text-emerald-300">
                        {sloc.cleanAllClearTitle}
                      </div>
                      <p className="text-[9px] text-slate-400 font-sans max-w-xs leading-relaxed">
                        {sloc.cleanAllClearDesc}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED ACTIVE DIAGNOSTIC CLINIC DRAWER REPORT */}
              {doctorProblem && (
                <div className={`p-3 rounded-xl flex flex-col gap-2 animate-fade-in ${
                  theme === 'light'
                    ? 'bg-slate-50 border border-slate-200 text-slate-800 shadow-sm shadow-slate-100/50'
                    : 'bg-[#111219] border border-indigo-500/30 text-slate-300'
                }`}>
                  <div className={`flex justify-between items-center border-b pb-1.5 ${
                    theme === 'light' ? 'border-slate-200' : 'border-slate-800'
                  }`}>
                    <span className={`text-[9px] font-mono font-black uppercase tracking-widest flex items-center gap-1 ${
                      theme === 'light' ? 'text-indigo-605' : 'text-indigo-400'
                    }`}>
                      <Zap className={`w-3 h-3 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'} animate-pulse`} />
                      {sloc.doctorRep}
                    </span>
                    <button
                      onClick={() => {
                        setDoctorProblem(null);
                        setDoctorDiagnosis(null);
                      }}
                      className={`cursor-pointer transition-colors ${
                        theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {doctorLoading ? (
                     <div className="flex flex-col items-center gap-2 py-4 text-center text-xs font-mono">
                       <span className="animate-spin h-4.5 w-4.5 border-2 border-indigo-500 border-t-transparent rounded-full font-mono"></span>
                       <span className={`${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} animate-pulse`}>{sloc.scanAnomaliesLoading}</span>
                     </div>
                  ) : doctorError ? (
                     <div className={`text-[10px] font-mono p-2 border rounded ${
                       theme === 'light' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-rose-500/20 bg-rose-950/20 text-rose-400'
                     }`}>
                       ⚠️ {doctorError}
                     </div>
                  ) : doctorDiagnosis ? (
                     <div className="flex flex-col gap-2.5 animate-fadeIn">
                       {/* Animated Expert Consultant Dock */}
                       {(doctorDiagnosis.dr_compiler || doctorDiagnosis.dr_schema) && (
                         <div className={`flex gap-1.5 border-b pb-2 ${
                           theme === 'light' ? 'border-slate-200' : 'border-[#2d2f3c]/40'
                         }`}>
                           <button
                             type="button"
                             onClick={() => setActiveDoctorTab('overlord')}
                             className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                               activeDoctorTab === 'overlord'
                                 ? theme === 'light'
                                   ? 'bg-indigo-600/10 border-indigo-500 text-indigo-750 font-extrabold'
                                   : 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300'
                                 : theme === 'light'
                                   ? 'bg-[#f8fafc] border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                   : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                             }`}
                           >
                             <span>👑</span> Overlord
                           </button>
                           {doctorDiagnosis.dr_compiler && (
                             <button
                               type="button"
                               onClick={() => setActiveDoctorTab('compiler')}
                               className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                 activeDoctorTab === 'compiler'
                                   ? theme === 'light'
                                     ? 'bg-emerald-600/10 border-emerald-500 text-emerald-750 font-extrabold'
                                     : 'bg-emerald-600/15 border-emerald-500/50 text-emerald-300'
                                   : theme === 'light'
                                     ? 'bg-[#f8fafc] border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                     : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                               }`}
                             >
                               <span>💻</span> Compiler
                             </button>
                           )}
                           {doctorDiagnosis.dr_schema && (
                             <button
                               type="button"
                               onClick={() => setActiveDoctorTab('schema')}
                               className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                 activeDoctorTab === 'schema'
                                   ? theme === 'light'
                                     ? 'bg-cyan-600/10 border-cyan-500 text-cyan-750 font-extrabold'
                                     : 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300'
                                   : theme === 'light'
                                     ? 'bg-[#f8fafc] border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                                     : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                               }`}
                             >
                               <span>🗃️</span> Dr. Schema
                             </button>
                           )}
                         </div>
                       )}

                       {/* List affected files if working tree is dirty */}
                       {doctorProblem === 'dirty_working_tree' && repoState.dirtyFiles && repoState.dirtyFiles.length > 0 && (
                         <div className={`text-[10px] p-2 rounded border flex flex-col gap-1.5 ${
                           theme === 'light'
                             ? 'bg-slate-100 border-slate-200 text-slate-700'
                             : 'text-slate-300 bg-slate-950/30 border border-[#2d2f3c]/30'
                         }`}>
                           <strong className={`text-[9px] font-mono font-bold uppercase block tracking-wider ${
                             theme === 'light' ? 'text-indigo-700' : 'text-indigo-350'
                           }`}>
                             {sloc.dirtyFilesLabel}
                           </strong>
                           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                             {repoState.dirtyFiles.map(file => (
                               <div key={file} className="flex items-center gap-1 font-mono text-[9px]">
                                 <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                                 <span className={`px-1.5 py-0.5 rounded border ${
                                   theme === 'light' 
                                     ? 'bg-white border-slate-200 text-slate-700 shadow-xs' 
                                     : 'bg-slate-900/40 border-amber-500/10 text-amber-300'
                                 }`}>
                                   {file}
                                 </span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       {(() => {
                         const activeDoc = 
                           activeDoctorTab === 'compiler' && doctorDiagnosis.dr_compiler ? doctorDiagnosis.dr_compiler :
                           activeDoctorTab === 'schema' && doctorDiagnosis.dr_schema ? doctorDiagnosis.dr_schema :
                           doctorDiagnosis.dr_overlord;

                         const docStyle = 
                           activeDoctorTab === 'compiler' 
                             ? theme === 'light'
                               ? { border: 'border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50' }
                               : { border: 'border-emerald-500/30', text: 'text-emerald-300', bg: 'bg-emerald-950/20' }
                             : activeDoctorTab === 'schema'
                               ? theme === 'light'
                                 ? { border: 'border-cyan-200', text: 'text-cyan-700', bg: 'bg-cyan-50' }
                                 : { border: 'border-cyan-500/30', text: 'text-cyan-300', bg: 'bg-cyan-950/20' }
                               : theme === 'light'
                                 ? { border: 'border-indigo-250', text: 'text-indigo-850', bg: 'bg-indigo-50/50' }
                                 : { border: 'border-indigo-500/25', text: 'text-indigo-300', bg: 'bg-slate-950/50' };

                         const headingLabel = 
                           activeDoctorTab === 'compiler' ? "🩺 BÁO CÁO CÚ PHÁP (DR. COMPILER)" :
                           activeDoctorTab === 'schema' ? "🩺 CHẨN ĐOÁN CƠ SỞ DỮ LIỆU (DR. SCHEMA)" :
                           "🩺 THAM VẤN HỆ THỐNG (DR. OVERLORD)";

                         return (
                           <div className="flex flex-col gap-2 animate-fadeIn font-mono">
                             <div className={`text-[10px] p-2.5 rounded-lg border ${docStyle.border} ${docStyle.bg}`}>
                               <strong className={`text-[9px] font-mono font-bold uppercase block tracking-wider ${docStyle.text}`}>
                                 {headingLabel}
                               </strong>
                               <p className={`font-sans leading-relaxed mt-1 whitespace-pre-line text-[11px] ${
                                 theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                               }`}>
                                 {activeDoc.explanation}
                               </p>
                             </div>

                             <div className={`text-[10px] p-2.5 rounded-lg border ${
                               theme === 'light'
                                 ? 'bg-indigo-50/70 border-indigo-200 text-slate-800'
                                 : 'text-slate-300 bg-indigo-950/15 border border-indigo-500/15'
                             }`}>
                               <strong className={`text-[9px] font-mono font-bold uppercase block tracking-wider ${
                                 theme === 'light' ? 'text-indigo-700' : 'text-[#a5b4fc]'
                               }`}>
                                 💡 CHỈ ĐỊNH ĐIỀU TRỊ (MITIGATION PLAN)
                                </strong>
                               <div className={`font-sans leading-relaxed mt-1 whitespace-pre-line border-l-2 pl-2 text-[11px] ${
                                 theme === 'light'
                                   ? 'border-indigo-300 text-slate-705'
                                   : 'border-indigo-500/30 text-slate-250'
                               }`}>
                                 {activeDoc.mitigation}
                               </div>
                             </div>
                           </div>
                         );
                       })()}

                       {/* Inject quick operation under summary based on problem */}
                       <div className="flex justify-end gap-1.5 mt-0.5">
                         {doctorProblem === 'dirty_working_tree' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                             className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyStash}
                           </button>
                         )}
                         {doctorProblem === 'diverged_branch' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                             className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyRebase}
                           </button>
                         )}
                         {doctorProblem === 'detached_head' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                             className="px-2 py-1 bg-rose-600 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyRescue}
                           </button>
                         )}
                         {doctorProblem === 'stale_base_branch' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                             className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplySync}
                           </button>
                         )}
                       </div>
                     </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}

          {isUpgraded && dashboardMode === 'rescue' && (
            <ReflogRescuePanel
              theme={theme}
              tone={tone}
              onRescueCommit={handleRescueCommit}
            />
          )}

            {/* Dynamic visual terminal logger console */}
            {(dashboardMode === 'daily' || dashboardMode === 'rescue') && (
              <TerminalPanel
                logs={logs}
                showLogPanel={showLogPanel}
                onToggleLogPanel={() => setShowLogPanel(!showLogPanel)}
                onClearLogs={() => setLogs([])}
                tone={tone}
                isSimulation={isSimulation}
                isAiEnabled={isAiEnabled}
                onCommandExecuted={() => handleRefresh(true)}
                addLog={addLog}
                resolveApiUrl={resolveApiUrl}
                theme={theme}
              />
            )}

          </div>

        </div>

        {/* Dashboard Footer credits and hints */}
        <div className={`rounded-xl p-4 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center gap-2 mt-2 border transition-colors duration-200 ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#0b0f19]/40 border-slate-900/60'}`}>
          <span>Rebase Overlord — The Git Feature Flow Assistant</span>
          <span className="flex items-center gap-1 text-[10px]">
            Created for <strong className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>boybibo98@gmail.com</strong>
          </span>
        </div>

        {/* Floating Toast Notification Containers for Achievements and Easter Eggs */}
        <div id="rebase-overlord-toast-container" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3.5 max-w-[420px] w-full p-4 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`pointer-events-auto p-4 rounded-xl border shadow-2xl flex gap-3.5 relative backdrop-blur-md transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white/98 border-slate-200/90 text-slate-800 shadow-slate-300/40'
                    : 'bg-[#070913]/95 border-slate-800 text-slate-100 shadow-black'
                } ${
                  toast.type === 'milestone'
                    ? theme === 'light'
                      ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/10 to-white/98'
                      : 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-[#070913]/95'
                    : toast.type === 'owl'
                    ? theme === 'light'
                      ? 'border-indigo-400/50 bg-gradient-to-r from-indigo-500/10 to-white/98'
                      : 'border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-[#070913]/95'
                    : toast.type === 'rage'
                    ? theme === 'light'
                      ? 'border-rose-400/50 bg-gradient-to-r from-rose-500/10 to-white/98'
                      : 'border-rose-500/30 bg-gradient-to-r from-rose-950/20 to-[#070913]/95'
                    : ''
                }`}
              >
                {/* Accent line on left */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-xl ${
                  toast.type === 'milestone' ? 'bg-amber-500' : toast.type === 'owl' ? 'bg-indigo-500' : toast.type === 'rage' ? 'bg-rose-500' : 'bg-slate-400'
                }`} />

                {toast.emoji && (
                  <div className={`text-2xl select-none shrink-0 ${toast.type === 'rage' ? 'animate-bounce' : 'animate-pulse'}`}>
                    {toast.emoji}
                  </div>
                )}

                <div className="flex-1 font-sans pr-4">
                  <h5 className={`text-xs font-bold font-mono tracking-wider uppercase mb-1 ${
                    toast.type === 'milestone'
                      ? 'text-amber-600 dark:text-amber-400'
                      : toast.type === 'owl'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : toast.type === 'rage'
                      ? 'text-rose-600 dark:text-rose-400'
                      : (theme === 'light' ? 'text-slate-700' : 'text-slate-300')
                  }`}>
                    {toast.title}
                  </h5>
                  <p className={`text-[11px] leading-relaxed font-sans font-medium whitespace-pre-line ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className={`absolute top-3 right-3 p-1 rounded-lg transition-all cursor-pointer ${
                    theme === 'light' ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                  }`}
                  title="Dismiss alert"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      {/* Floating Detached Windows Container (Multi-window desktop space) */}
      {detachedWindows.map(win => (
        <div
          key={win.id}
          id={`detached-win-${win.id}`}
          className={`fixed z-50 rounded-xl shadow-2xl border flex flex-col overflow-hidden backdrop-blur-md select-none transition-all duration-100 ${
            theme === 'light'
              ? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-200/50'
              : 'bg-[#0b101f]/95 border-indigo-500/20 text-slate-200 shadow-black/80'
          }`}
          style={{
            left: `${win.x}px`,
            top: `${win.y}px`,
            width: `${win.width || 440}px`,
            height: `${win.height || 380}px`,
          }}
        >
          {/* Header Draggable Bar */}
          <div
            onPointerDown={(e) => handleDragWindowStart(e, win.id)}
            className={`px-4 py-2 flex items-center justify-between cursor-move select-none border-b shrink-0 ${
              theme === 'light'
                ? 'bg-slate-100/80 border-slate-250 text-slate-700'
                : 'bg-slate-950/80 border-slate-800 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{win.title}</span>
            </div>
            
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  setDetachedWindows(prev => prev.filter(w => w.id !== win.id));
                  triggerToast('milestone', 'WINDOW CLOSED', 'Đã thu hẹp cửa sổ phụ.', '🪟');
                }}
                className={`p-1 rounded-md transition-colors ${
                  theme === 'light' ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-805 text-slate-400'
                }`}
                title="Đóng cửa sổ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Window Body Contents */}
          <div className="p-4 flex-1 overflow-y-auto font-sans text-xs">
            {win.type === 'commits' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-indigo-400 uppercase font-semibold">
                  🌳 REAL-TIME CENTRAL GIT PATHWAY
                </span>
                <div className={`rounded-lg p-2.5 border font-mono text-[11px] leading-relaxed ${theme === 'light' ? 'bg-slate-50 border-slate-150 text-slate-655' : 'bg-slate-950/60 border-slate-900 text-slate-300'}`}>
                  {repoState.commits.length === 0 ? (
                    <span className="opacity-50">Empty repo history</span>
                  ) : (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto">
                      {repoState.commits.map((c, index) => (
                        <div key={index} className="flex items-start gap-2 border-l-2 border-indigo-500/30 pl-2">
                          <span className="font-bold text-indigo-405 text-[10px] bg-indigo-500/10 px-1 rounded">
                            {c.hash ? c.hash.substring(0, 7) : 'HEAD'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-semibold text-xs truncate">{c.message}</p>
                            <span className="text-[9px] text-[#888]">{c.author} · {c.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {win.type === 'diagnostics' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-rose-405 uppercase font-semibold">
                  🩺 DETACHED REPO TELEMETRY CLINIC
                </span>
                <div className="space-y-2">
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 text-slate-700' : 'bg-slate-955/60 border-slate-900 text-slate-350'}`}>
                    <span className="font-mono">Current Branch:</span>
                    <strong className="text-indigo-400 font-mono">{repoState.currentBranch}</strong>
                  </div>
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 text-slate-700' : 'bg-slate-955/60 border-slate-900 text-slate-355'}`}>
                    <span className="font-mono">Base Branch Alignment:</span>
                    <strong className="text-emerald-450 font-mono">{repoState.baseBranch}</strong>
                  </div>
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 text-slate-700' : 'bg-slate-955/60 border-slate-900 text-slate-355'}`}>
                    <span className="font-mono">Conflicts State:</span>
                    <strong className={`${repoState.conflicts && repoState.conflicts.length > 0 ? 'text-rose-400' : 'text-emerald-400'} font-mono`}>
                      {repoState.conflicts && repoState.conflicts.length > 0 ? `${repoState.conflicts.length} conflicted files` : 'HEALTHY'}
                    </strong>
                  </div>
                </div>
              </div>
            )}
            
            {win.type === 'shortcuts' && (
              <div className="space-y-2.5 font-mono text-[11px]">
                <span className="text-xs font-semibold text-indigo-400 font-sans block mb-1">
                  ⌨️ ELECTRON NATIVE short-cuts mappings:
                </span>
                <div className="grid grid-cols-12 gap-1.5 border-b pb-1 opacity-70 font-bold uppercase tracking-wider text-[10px]">
                  <div className="col-span-5">Combo</div>
                  <div className="col-span-7">Action outcome</div>
                </div>
                <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-12 gap-1.5">
                    <div className="col-span-5 text-indigo-400 font-bold">Ctrl + K / I</div>
                    <div className="col-span-7">AI Doctor chat panel launcher</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + 1 / 2 / 3</div>
                    <div className="col-span-7">Toggle Dashboard screens</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + W</div>
                    <div className="col-span-7">Toggle 2-Col Split Workspace</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + S</div>
                    <div className="col-span-7">Flip Sidebar position Left/Right</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + D</div>
                    <div className="col-span-7">Dock Terminal on bottom/sidebar</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + J</div>
                    <div className="col-span-7">Spawn detached helper window</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5 border-t border-slate-900/10 pt-1.5">
                    <div className="col-span-5 text-indigo-405 font-bold">Alt + H</div>
                    <div className="col-span-7">Trigger shortcut cheat sheet</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Native Keyboard Shortcut Cheat Sheet Modal */}
      {showShortcutCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-4 shadow-2xl ${
              theme === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-[#0a0f1d] border-indigo-500/20 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-205/20">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-455" />
                <span>⌨️ Electron Keyboard Short-cuts Map</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutCheatSheet(false)}
                className={`p-1 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'hover:bg-slate-100 text-slate-505' : 'hover:bg-slate-900 text-slate-400'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Sử dụng các tổ hợp phím tắt bên dưới để thao tác nhanh như một Desktop IDE thực thụ:
              </p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {[
                  { keys: ['Ctrl', 'K'], desc: 'Mở Command Palette & AI Doctor chatbot' },
                  { keys: ['Ctrl', 'I'], desc: 'Mở Drawer AI Doctor chat phụ' },
                  { keys: ['Alt', '1'], desc: 'Chuyển sang "Daily Mode" (Phác đồ ngày)' },
                  { keys: ['Alt', '2'], desc: 'Chuyển sang "Git Rescue" (Cứu hộ Reflog)' },
                  { keys: ['Alt', '3'], desc: 'Chuyển sang "Learning Mode" (Mô phỏng)' },
                  { keys: ['Alt', 'W'], desc: 'Bật/Tắt layout chia 2 cột góc nhìn rộng' },
                  { keys: ['Alt', 'S'], desc: 'Đổi vị trí sidebar qua Trái / Phải' },
                  { keys: ['Alt', 'D'], desc: 'Neo Terminal xuống Dưới / sang Phải sidebar' },
                  { keys: ['Alt', 'J'], desc: 'Mở các cửa sổ phác đồ phụ kéo thả' },
                  { keys: ['Alt', 'T'], desc: 'Xóa bộ nhớ đệm terminal logs' },
                  { keys: ['Alt', 'H'], desc: 'Bật/Tắt bảng phím tắt này' },
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 border-b last:border-0 border-slate-205/10 text-xs`}>
                    <span className={`font-sans font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-350'}`}>
                      {item.desc}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border ${
                            theme === 'light'
                              ? 'bg-slate-100 border-slate-250 text-slate-700'
                              : 'bg-indigo-950/40 border-indigo-505/20 text-indigo-300'
                          }`}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowShortcutCheatSheet(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-555 text-white font-mono text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer box-shadow-xl"
              >
                Close Reference Map
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Interactive Deep-context Git Doctor Messenger Chatbot & Command Palette Drawer */}
        <AiDoctorFloatingChat
          repoState={repoState}
          tone={tone}
          isAiEnabled={isAiEnabled}
          onToggleAi={handleToggleAiMode}
          theme={theme}
          appVersion={appVersion}
          isUpgraded={isUpgraded}
          onSwitchDashboardMode={setDashboardMode}
          isSimulation={isSimulation}
          onToggleSimulation={(sim) => {
            setIsSimulation(sim);
            addLog(`🤖 Simulation mode changed: ${sim ? 'ACTIVE' : 'OFF'}`);
            handleRefresh(sim);
            triggerToast(sim ? 'milestone' : 'warn', sim ? 'SIMULATION MODE' : 'REAL GIT ENGAGED', sim ? 'Sandbox mô phỏng' : 'Code thật trên ổ đĩa');
          }}
          onClearLogs={() => {
            setLogs([]);
            addLog('🧹 Terminal console history cleared by AI Doctor Command Palette.');
          }}
        />

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {confirmModal && confirmModal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmModal(null)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-50 ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#0f172a] border-slate-800 text-slate-100'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  {confirmModal.iconType === 'info' ? (
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-505 shrink-0">
                      <HelpCircle className="w-5 h-5 animate-pulse text-indigo-400" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {confirmModal.title}
                    </h3>
                    <p className={`text-[11px] mt-1.5 leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {confirmModal.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs text-mono">
                  <button
                    id="confirm-modal-cancel-btn"
                    onClick={() => setConfirmModal(null)}
                    className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {confirmModal.cancelText || (tone === TranslationTone.ENGLISH ? 'Cancel' : tone === TranslationTone.TOXIC ? 'Thôi cút' : 'Hủy bỏ')}
                  </button>
                  <button
                    id="confirm-modal-confirm-btn"
                    onClick={() => {
                      confirmModal.onConfirm();
                      setConfirmModal(null);
                    }}
                    className={`px-3.5 py-1.5 rounded font-bold text-white border shadow-md cursor-pointer select-none transition-all active:scale-[0.98] ${
                      confirmModal.confirmBtnClassName || 'bg-rose-600 hover:bg-rose-500 border-rose-500/20'
                    }`}
                  >
                    {confirmModal.confirmText || (tone === TranslationTone.ENGLISH ? 'Confirm' : tone === TranslationTone.TOXIC ? 'Chốt luôn, sợ đéo' : 'Xác nhận')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {updateFailedModal && updateFailedModal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUpdateFailedModal(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-50 ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#0f172a] border-rose-950 text-slate-100 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-500 shrink-0 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-bounce animate-duration-1000">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-rose-500 flex items-center gap-2">
                      {updateFailedModal.title}
                      {updateFailedModal.exitCode !== undefined && (
                        <span className="text-[10px] bg-red-550/10 font-bold border border-red-500/35 text-red-400 px-1.5 py-0.5 rounded">
                          CODE {updateFailedModal.exitCode}
                        </span>
                      )}
                    </h3>
                    <p className={`text-[11px] mt-2 leading-relaxed ${theme === 'light' ? 'text-slate-650' : 'text-slate-350'}`}>
                      {updateFailedModal.message}
                    </p>
                    <div className={`mt-3 p-2.5 rounded border text-[10px] bg-red-950/20 border-red-900/30 font-semibold font-mono ${theme === 'light' ? 'text-red-800' : 'text-red-400'}`}>
                      STATUS: Fail: Binary execution restricted or signature checks failed.
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs text-mono">
                  <button
                    onClick={() => {
                      // Trigger diagnostic clearing
                      fetch(resolveApiUrl('/api/update/check?clear_fail=true'))
                        .then(() => {
                          setUpdateFailedModal(null);
                          triggerToast('success', 'Cleared Simulation', 'Simulation failure status has been cleared.');
                          addLog('✓ [SUCCESS] Diagnostics cleared.');
                        })
                        .catch(() => setUpdateFailedModal(null));
                    }}
                    className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-750 text-slate-350 hover:text-slate-100 font-bold'
                    }`}
                  >
                    Clear failure state & Close
                  </button>
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="px-3.5 py-1.5 rounded font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-rose-500/20 shadow-md cursor-pointer select-none transition-all active:scale-[0.98] flex items-center gap-1"
                  >
                    🔄 Restart & Recheck
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Stale Branch Warning & Auto-Migration Modal */}
          {staleBranchWarning && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isStaleMigrating && setStaleBranchWarning(null)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`relative max-w-lg w-full p-6 rounded-xl border shadow-2xl font-mono z-50 ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800 shadow-[0_15px_50px_rgba(0,0,0,0.1)]' 
                    : 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* Warning Header */}
                <div className="flex items-start gap-4 mb-4 text-left">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {staleWarningLoc[tone]?.modalTitle || staleWarningLoc[TranslationTone.PROFESSIONAL].modalTitle}
                    </h3>
                    <p className={`text-[11px] mt-2.5 leading-relaxed font-sans ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {(staleWarningLoc[tone]?.desc || staleWarningLoc[TranslationTone.PROFESSIONAL].desc)(staleBranchWarning.name, staleBranchWarning.age)}
                    </p>
                    <div className={`mt-3 p-2.5 rounded-lg text-[10px] leading-relaxed font-sans font-semibold border ${
                      theme === 'light' ? 'bg-amber-50/50 border-amber-200/60 text-amber-800/95' : 'bg-amber-500/5 border-amber-500/15 text-amber-400/90'
                    }`}>
                      {staleWarningLoc[tone]?.suggestion || staleWarningLoc[TranslationTone.PROFESSIONAL].suggestion}
                    </div>
                  </div>
                </div>

                {/* Migration Parameters Grid */}
                <div className="space-y-4 pt-3.5 border-t border-slate-200/10 text-xs text-left">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Base branch to fork from */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className={`block text-[9px] uppercase font-black tracking-widest mb-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {staleWarningLoc[tone]?.selectBase || staleWarningLoc[TranslationTone.PROFESSIONAL].selectBase}
                      </label>
                      <div className="relative">
                        <select
                          value={staleMigrateBase}
                          disabled={isStaleMigrating}
                          onChange={(e) => setStaleMigrateBase(e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs font-mono rounded border outline-none cursor-pointer appearance-none transition-colors ${
                            theme === 'light' 
                              ? 'bg-white border-slate-250 text-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200' 
                              : 'bg-slate-900 border-slate-805 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-950'
                          }`}
                        >
                          {Array.from(new Set(repoState.branches.map(b => b.name as string)))
                            .filter((bName: string) => bName !== 'origin' && !bName.includes('HEAD') && !bName.includes('->'))
                            .map((bName: string) => (
                              <option key={bName} value={bName}>{bName}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* New clean branch name */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className={`block text-[9px] uppercase font-black tracking-widest mb-1.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {staleWarningLoc[tone]?.newBranchInput || staleWarningLoc[TranslationTone.PROFESSIONAL].newBranchInput}
                      </label>
                      <input
                        type="text"
                        value={staleMigrateNewName}
                        disabled={isStaleMigrating}
                        onChange={(e) => {
                          const val = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9\-_./]/g, '');
                          setStaleMigrateNewName(val);
                        }}
                        className={`w-full px-2.5 py-1.5 text-xs font-mono rounded border outline-none transition-colors ${
                          theme === 'light' 
                            ? 'bg-white border-slate-250 text-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200' 
                            : 'bg-slate-900 border-slate-805 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-950'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions buttons footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 pt-4 border-t border-slate-200/10 text-xs">
                  {/* Checkout anyway action - small & riindigo */}
                  <button
                    type="button"
                    disabled={isStaleMigrating}
                    onClick={() => {
                      handleCheckoutBranch(staleBranchWarning.name, true);
                      setStaleBranchWarning(null);
                    }}
                    className={`order-3 sm:order-1 px-3 py-1.5 rounded border transition-all text-[11px] font-bold cursor-pointer select-none active:scale-[0.98] ${
                      theme === 'light'
                        ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                        : 'bg-rose-950/20 border-rose-950/50 text-rose-400 hover:bg-rose-900/30'
                    }`}
                  >
                    {staleWarningLoc[tone]?.buttonCheckoutAnyway || staleWarningLoc[TranslationTone.PROFESSIONAL].buttonCheckoutAnyway}
                  </button>

                  <div className="order-2 flex gap-2 w-full sm:w-auto justify-end">
                    {/* Cancel btn */}
                    <button
                      type="button"
                      disabled={isStaleMigrating}
                      onClick={() => setStaleBranchWarning(null)}
                      className={`px-3 py-1.5 rounded border cursor-pointer select-none transition-all active:scale-[0.98] ${
                        theme === 'light'
                          ? 'bg-slate-150 hover:bg-slate-200 border-slate-350 text-slate-700'
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {staleWarningLoc[tone]?.buttonCancel || staleWarningLoc[TranslationTone.PROFESSIONAL].buttonCancel}
                    </button>

                    {/* Auto-Migrate clean commit stack btn */}
                    <button
                      type="button"
                      disabled={isStaleMigrating || !staleMigrateNewName.trim()}
                      onClick={handleMigrateStaleBranch}
                      className={`px-4 py-1.5 rounded font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 border border-amber-500/20 shadow-lg cursor-pointer select-none transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 min-w-[150px] ${
                        isStaleMigrating ? 'animate-pulse' : ''
                      }`}
                    >
                      {isStaleMigrating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{(staleWarningLoc[tone]?.migratingTitle || staleWarningLoc[TranslationTone.PROFESSIONAL].migratingTitle)}</span>
                        </>
                      ) : (
                        <span>{(staleWarningLoc[tone]?.buttonAutoMigrate || staleWarningLoc[TranslationTone.PROFESSIONAL].buttonAutoMigrate)}</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
