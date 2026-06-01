/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Calendar,
  Zap,
  Github,
  X
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

// Modules
import RepoHeader from './components/RepoHeader';
import WizardPanel from './components/WizardPanel';
import BranchPanel from './components/BranchPanel';
import TerminalPanel from './components/TerminalPanel';
import ConflictSolver from './components/ConflictSolver';
import GitVisualizerPanel from './components/GitVisualizerPanel';
import { resolveApiUrl } from './utils/apiResolver';

const sanityLoc: Record<TranslationTone, {
  title: string;
  gitEnv: string;
  githubCli: string;
  rebaseStatus: string;
  readyStatus: string;
  emptyCommits: string;
  simulationAnomalyBadge: string;
  simulateAnomaliesHeading: string;
  divergedSafeLabel: string;
  divergedUnsafeLabel: string;
  detachedSafeLabel: string;
  detachedUnsafeLabel: string;
  staleSafeLabel: string;
  staleUnsafeLabel: string;
  diagnosticsActionHeading: string;
  uncommittedChangesTitle: string;
  uncommittedChangesDesc: string;
  diagnoseBtn: string;
  firstAidHeader: string;
  discardConfirm: string;
  divergedTitle: string;
  divergedDesc: string;
  forcePushConfirm: string;
  detachedTitle: string;
  detachedDesc: string;
  rescueBranchBtn: string;
  staleBaseTitle: string;
  staleBaseDesc: string;
  cleanAllClearTitle: string;
  cleanAllClearDesc: string;
  doctorRep: string;
  doctorExplanation: string;
  doctorMitigation: string;
  doctorApplyStash: string;
  doctorApplyRebase: string;
  doctorApplyRescue: string;
  doctorApplySync: string;
  scanAnomaliesLoading: string;
}> = {
  [TranslationTone.PROFESSIONAL]: {
    title: "CHẨN ĐOÁN & KIỂM TRA (GIT SANITY CHECKS)",
    gitEnv: "Môi trường Git Binary:",
    githubCli: "Kết nối GitHub CLI (gh):",
    rebaseStatus: "Trạng thái Rebase:",
    readyStatus: "✓ SẠCH SẼ (READY)",
    emptyCommits: "Chọn một chi nhánh khác hoặc nhập base branch để vẽ lịch sử commits.",
    simulationAnomalyBadge: "MÔ PHỎNG ANOMALY",
    simulateAnomaliesHeading: "⚡ BẬT LỖI MÔ PHỎNG ĐỂ AI DOCTOR CHẨN TRỊ:",
    divergedSafeLabel: "✓ Sạch (Diverged)",
    divergedUnsafeLabel: "⚠️ Có Diverged",
    detachedSafeLabel: "✓ Sạch (HEAD)",
    detachedUnsafeLabel: "⚠️ Có Detached HEAD",
    staleSafeLabel: "✓ Sạch (Base)",
    staleUnsafeLabel: "⚠️ Có Stale Base",
    diagnosticsActionHeading: "🚨 CHẨN ĐOÁN & SƠ CỨU BẤT THƯỜNG:",
    uncommittedChangesTitle: "Workspace có file chưa commit",
    uncommittedChangesDesc: "Còn {0} tệp tin chưa được lưu trữ.",
    diagnoseBtn: "🩺 Chẩn đoán",
    firstAidHeader: "Sơ cứu:",
    discardConfirm: "Xác nhận: Xóa sạch code chưa lưu?",
    divergedTitle: "Lệch pha Local & Remote (Diverged)",
    divergedDesc: "Cả local và remote đều có các commits mới lệch pha.",
    forcePushConfirm: "Nguy hiểm: Nhất quyết Force push đè lên server?",
    detachedTitle: "Lịch sử rời neo (Detached HEAD)",
    detachedDesc: "Bạn không đứng trên nhánh cụ thể; code mới dễ bị mất.",
    rescueBranchBtn: "tạo nhánh rescue",
    staleBaseTitle: "Nhánh base bị lỗi thời",
    staleBaseDesc: "Nhánh base '{0}' bị chậm nhịp so với Remote.",
    cleanAllClearTitle: "✓ HỆ THỐNG TRƠN TRU KHỎE MẠNH",
    cleanAllClearDesc: "Thư mục làm việc hoàn toàn sạch sẽ. Các chỉ mục Git đều hoạt động hài hòa và sẵn sàng bùng nổ tiến trình Rebase!",
    doctorRep: "🏥 PHÁC ĐỒ CHẨN TRỊ TỪ GEMINI AI",
    doctorExplanation: "🔍 LÝ DO BẤT THƯỜNG (EXPLANATION):",
    doctorMitigation: "💊 PHƯƠNG ÁN ĐIỀU TRỊ (MITIGATION):",
    doctorApplyStash: "Áp dụng: git stash",
    doctorApplyRebase: "Áp dụng: Pull --rebase",
    doctorApplyRescue: "Áp dụng: Tạo cứu hộ",
    doctorApplySync: "Áp dụng: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Đang quét lỗi bất thường của kho lưu trữ..."
  },
  [TranslationTone.JOKE]: {
    title: "KHÁM SỨC KHỎE REPO (GIT SANITY CHECKS)",
    gitEnv: "Hệ điều hành Git:",
    githubCli: "Gia thế GitHub (gh-cli):",
    rebaseStatus: "Cục diện Rebase:",
    readyStatus: "✓ TRƠN TRU (READY)",
    emptyCommits: "Sếp lướt sang nhánh khác hoặc gõ tên bến đỗ (base branch) để em vẽ lịch sử nhé.",
    simulationAnomalyBadge: "ẢO LÒI ANOMALY 🌀",
    simulateAnomaliesHeading: "🔥 TRIỆU HỒI LỖI GIẢ LẬP CHO AI GÕ ĐẦU:",
    divergedSafeLabel: "✓ Diverged Sạch Bóng",
    divergedUnsafeLabel: "⚠️ Có Diverged Rồi Sếp",
    detachedSafeLabel: "✓ HEAD Đã Cắm Neo",
    detachedUnsafeLabel: "⚠️ HEAD Đang Bay Màu",
    staleSafeLabel: "✓ Base Mới Cứng",
    staleUnsafeLabel: "⚠️ Base Mốc Meo",
    diagnosticsActionHeading: "🛎️ PHÒNG KHÁM CẤP CỨU ĐỘC LẬP:",
    uncommittedChangesTitle: "Workspace Đang Bẩn Thỉu",
    uncommittedChangesDesc: "Còn {0} file đang bơ vơ ngoài đường chưa được cất giữ.",
    diagnoseBtn: "🩺 Khám bệnh",
    firstAidHeader: "Sơ cứu nhanh:",
    discardConfirm: "Tính vứt sạch hết tinh hoa code chưa lưu à sếp?",
    divergedTitle: "Trống đánh xuôi kèn thổi ngược (Diverged)",
    divergedDesc: "Local và Remote mỗi bên đi một ngả mất rồi.",
    forcePushConfirm: "Dùng tuyệt chiêu tối thượng Force Push đè nát server nhé?",
    detachedTitle: "Đầu lìa khỏi cổ (Detached HEAD)",
    detachedDesc: "Đang bay lơ lửng giữa hư vô không có nhánh nâng đỡ.",
    rescueBranchBtn: "mở phao cứu hộ",
    staleBaseTitle: "Base rệu rã (Stale Base)",
    staleBaseDesc: "Nhánh gốc '{0}' đang mốc meo so với trên mây rồi.",
    cleanAllClearTitle: "✓ TRỜI QUANG MÂY TẢNH KHÔNG BỆNH TẬT",
    cleanAllClearDesc: "Sạch sẽ láng o như chưa từng code hỏng, quẩy thôi sếp ơi!",
    doctorRep: "🏥 QUẺ PHÁN BỆNH TỪ THẦY GEMINI",
    doctorExplanation: "🔍 CAO NHÂN CHỈ ĐIỂM (EXPLANATION):",
    doctorMitigation: "💊 PHÉP MÀU KHẮC PHỤC (MITIGATION):",
    doctorApplyStash: "Triển ngay: git stash",
    doctorApplyRebase: "Triển ngay: Pull --rebase",
    doctorApplyRescue: "Triển ngay: Tạo phao cứu sinh",
    doctorApplySync: "Triển ngay: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Thầy bói đang xem mạch kho chứa..."
  },
  [TranslationTone.TOXIC]: {
    title: "BỆNH ÁN GIT (GIT SANITY CHECKS)",
    gitEnv: "Hàng Auth hay Fake:",
    githubCli: "Hộ khẩu Github (gh):",
    rebaseStatus: "Bãi chiến trường Rebase:",
    readyStatus: "✓ HẾT SỐC (READY)",
    emptyCommits: "Mày sang nhánh khác hoặc phang tên base branch vào để tao nặn mấy cái commits coi!",
    simulationAnomalyBadge: "ĐỐNG RÁC MÔ PHỎNG",
    simulateAnomaliesHeading: "💩 KHẤN VÁI TỰ BẬT LỖI RA ĐÂY:",
    divergedSafeLabel: "✓ Éo Diverged",
    divergedUnsafeLabel: "⚠️ Đứng Hình (Diverged)",
    detachedSafeLabel: "✓ HEAD Không Rời Cổ",
    detachedUnsafeLabel: "⚠️ HEAD Rời Cỏ",
    staleSafeLabel: "✓ Base Sạch",
    staleUnsafeLabel: "⚠️ Base Cũ Rích",
    diagnosticsActionHeading: "🚑 NHÀ XÁC DI ĐỘNG & GẶM NHẤM LỖI:",
    uncommittedChangesTitle: "Workspace Bừa Bộn Như Bãi Rác",
    uncommittedChangesDesc: "Chừa {0} cái file mốc chưa thèm commit kìa.",
    diagnoseBtn: "🩺 Mổ xẻ",
    firstAidHeader: "Sửa gấp:",
    discardConfirm: "Xoá sạch sành sanh code hả? Mất ráng chịu nha!",
    divergedTitle: "Lệch pha banh chành (Diverged)",
    divergedDesc: "Local với Server đập nhau chan chát rồi cụ ơi.",
    forcePushConfirm: "Liều mạng đè nát code của đồng đội bằng Force Push à?",
    detachedTitle: "Rụng đầu mất xác (Detached HEAD)",
    detachedDesc: "Không chịu đứng trên nhánh nào cả, code bay màu ráng chịu.",
    rescueBranchBtn: "nhặt xác lập nhánh rescue",
    staleBaseTitle: "Base rách lỗi thời",
    staleBaseDesc: "Nhánh gốc '{0}' rách nát chậm rùa bò so với Remote server rồi.",
    cleanAllClearTitle: "✓ CHỬI AI NỮA CODE NGON RỒI",
    cleanAllClearDesc: "Sạch sẽ rồi đấy, nổ máy Rebase lẹ đi ngủ chứ thức đêm hoài báo quá báo!",
    doctorRep: "🏥 GIẤY KHÁM BỆNH CỦA QUÁI VẬT AI",
    doctorExplanation: "🔍 LỖI NGU ĐẦY ĐƯỜNG (EXPLANATION):",
    doctorMitigation: "💊 THUỐC ĐẮNG DÃ TẬT (MITIGATION):",
    doctorApplyStash: "Bấm đại: git stash",
    doctorApplyRebase: "Bấm đại: Pull --rebase",
    doctorApplyRescue: "Bấm đại: Tạo cứu thương",
    doctorApplySync: "Bấm đại: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Đang dọn rác bất thường..."
  },
  [TranslationTone.ENGLISH]: {
    title: "DIAGNOSTICS & GIT SANITY CHECKS",
    gitEnv: "Git Binary Environment:",
    githubCli: "GitHub CLI Connection (gh):",
    rebaseStatus: "Rebase Status:",
    readyStatus: "✓ CLEAN (READY)",
    emptyCommits: "Select a different branch or provide a base branch to render commit history.",
    simulationAnomalyBadge: "SIMULATED ANOMALY",
    simulateAnomaliesHeading: "⚡ ENABLE SIMULATED ANOMALIES FOR AI DOCTOR TO TREAT:",
    divergedSafeLabel: "✓ Clear (Diverged)",
    divergedUnsafeLabel: "⚠️ Has Diverged",
    detachedSafeLabel: "✓ Clear (HEAD)",
    detachedUnsafeLabel: "⚠️ Has Detached HEAD",
    staleSafeLabel: "✓ Clear (Base)",
    staleUnsafeLabel: "⚠️ Has Stale Base",
    diagnosticsActionHeading: "🚨 DIAGNOSTICS & FIRST AID:",
    uncommittedChangesTitle: "Uncommitted Changes (Dirty Workspace)",
    uncommittedChangesDesc: "{0} uncommitted/unstaged file(s) remaining.",
    diagnoseBtn: "🩺 Diagnose",
    firstAidHeader: "First aid:",
    discardConfirm: "Discard all modified code? This cannot be undone!",
    divergedTitle: "Diverged Local & Remote Branches",
    divergedDesc: "Local and remote repositories have diverged with conflicting timelines.",
    forcePushConfirm: "Perform force push? This overrides remote changes!",
    detachedTitle: "Detached HEAD State",
    detachedDesc: "You are not currently on any active branch container.",
    rescueBranchBtn: "create rescue branch",
    staleBaseTitle: "Stale Reference Base Branch",
    staleBaseDesc: "Base branch '{0}' is outdated compared to the remote.",
    cleanAllClearTitle: "✓ ALL CLEAR (NO ISSUES)",
    cleanAllClearDesc: "Your working tree is completely clean. All Git parameters are aligned and ready for a smooth Rebase replay!",
    doctorRep: "🏥 DYNAMIC BACTERIA REPORT BY GEMINI AI",
    doctorExplanation: "🔍 ANOMALY EXPLANATION (EXPLANATION):",
    doctorMitigation: "💊 ACTION PLAN (MITIGATION):",
    doctorApplyStash: "Apply: git stash",
    doctorApplyRebase: "Apply: Pull --rebase",
    doctorApplyRescue: "Apply: Create rescue branch",
    doctorApplySync: "Apply: Sync reference",
    scanAnomaliesLoading: "Scanning repository anomalies..."
  }
};

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

  const [isAiEnabled, setIsAiEnabled] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_is_ai_enabled');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [showLogPanel, setShowLogPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_log_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [isCloning, setIsCloning] = React.useState<boolean>(false);

  // Easter Eggs Toast system
  interface ActiveToast {
    id: string;
    type: 'info' | 'success' | 'warn' | 'error' | 'milestone' | 'owl' | 'rage' | 'spam';
    title: string;
    message: string;
    emoji?: string;
  }
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);
  const triggerToast = (type: ActiveToast['type'], title: string, message: string, emoji?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, message, emoji }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  };

  // Night Owl state
  const [isNightOwl, setIsNightOwl] = React.useState<boolean>(() => {
    const hr = new Date().getHours();
    return hr >= 23 || hr <= 4;
  });
  const [showNightOwlBanner, setShowNightOwlBanner] = React.useState<boolean>(true);

  // Custom API configuration for serverless deployment fallback (Vercel, GitHub Pages, etc.)
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'connected' | 'unreachable'>('checking');
  const [customBackendUrl, setCustomBackendUrl] = React.useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('rebase_overlord_backend_url')) || '';
  });

  const sloc = sanityLoc[tone];

  // Core Git States with localStorage fallback
  const [repoState, setRepoState] = React.useState<GitRepoState>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_repo_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      repoPath: '.',
      isValid: true,
      currentBranch: 'feature/payment-v2',
      baseBranch: 'develop',
      isDirty: true,
      dirtyFiles: ['src/routes/payment.ts', 'src/services/stripe.ts', 'config/keys.json'],
      branches: [],
      commits: [],
      rebaseInProgress: false,
      mergeInProgress: false,
      conflicts: [],
      ghAvailable: true,
      ghErrorKey: '',
      commandHistory: []
    };
  });

  // Session stats state
  const [stats, setStats] = React.useState<SessionStats>({
    rebaseCount: 3,
    firstRun: new Date().toISOString().split('T')[0]
  });

  // Wizard state machine with localStorage fallback
  const [wizard, setWizard] = React.useState<WizardState>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_wizard');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
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
    };
  });

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

  // Animated Git Doctor states
  const [doctorProblem, setDoctorProblem] = React.useState<string | null>(null);
  const [doctorLoading, setDoctorLoading] = React.useState<boolean>(false);
  const [doctorDiagnosis, setDoctorDiagnosis] = React.useState<{ explanation: string; mitigation: string } | null>(null);
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

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_log_panel', String(showLogPanel));
    } catch (e) {}
  }, [showLogPanel]);

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
  const handleRefresh = React.useCallback(async (overrideSim?: boolean) => {
    try {
      const activeSim = overrideSim !== undefined ? overrideSim : isSimulation;
      addLog(`$ Refreshing git states (Simulation: ${activeSim})...`);
      const url = resolveApiUrl(`/api/git-status?simulation=${activeSim}`);
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
    }
  }, [isSimulation]);

  const quietRefresh = React.useCallback(async () => {
    try {
      const url = resolveApiUrl(`/api/git-status?simulation=false`);
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
  }, []);

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

  // Add line to terminal
  const addLog = (line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${line}`]);
  };

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
            conflictsCount: 1,
            contentBefore: '<<<<<<< HEAD\n// Code changes on local commit\n=======\n// Code changes on incoming develop base\n>>>>>>> develop',
            contentAfter: ''
          }
        ];

        setRepoState(prev => ({
          ...prev,
          rebaseInProgress: true,
          conflicts: activeConflicts
        }));

        handleUpdateWizard({ status: 'paused_conflict' });
        addLog(`⚠️ CONFLICT DETECTED in src/routes/payment.ts during interactive rebase. Rebase paused.`);
        addLog(`// Please use the Recovery Center to salvage line items.`);
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
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false`);
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
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false`);
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

  // Offline diagnostic helpers to bypass Gemini API calls and save cost
  const offlineAnomalies = {
    dirty_working_tree: {
      english: {
        explanation: "[OFFLINE Fallback - Gemini API is Disabled (Cost Saved)] Local working tree contains modifications that have not been tracked or committed. This locks important branch moves or rebase replays which require a clean tree register.",
        mitigation: "Either stash away your temporary changes using 'git stash' or discard all uncommitted edits via 'git checkout . && git clean -fd'."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Gemini] Có các tệp tin trong thư mục làm việc đã bị sửa đổi nhưng chưa được lưu trữ (commit hoặc stash). Điều này ngăn cản quá trình chuyển nhánh hoặc Rebase Git an toàn.",
        mitigation: "Sơ cứu nhanh: Chạy 'git stash' để cất giữ tạm thời, hoặc chạy 'git checkout . && git clean -fd' để dọn dẹp sạch sẽ toàn bộ thay đổi chưa commit."
      }
    },
    diverged_branch: {
      english: {
        explanation: "[OFFLINE Fallback - Gemini API is Disabled (Cost Saved)] Your local branch and the remote origin tracking branch have diverged. Both contain independent commits that do not exist on the other.",
        mitigation: "Use 'git pull --rebase' to fetch remote commits and place your local commits nicely on top, or do a 'git push --force-with-lease' if you are sure your local branch is the source of truth."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Gemini] Nhánh của bạn ở máy tính của bạn và ở máy chủ (remote server) đang bị 'lệch pha chéo' (diverged). Cả hai đều có commit mới riêng.",
        mitigation: "Giải pháp: Chạy 'git pull --rebase' để kéo dồn commit máy chủ và phát lại commit local lên đầu; hoặc bấm 'force push' nếu bạn tuyệt đối tin tưởng code dưới máy."
      }
    },
    detached_head: {
      english: {
        explanation: "[OFFLINE Fallback - Gemini API is Disabled (Cost Saved)] You are in a 'Detached HEAD' state. You are pointing directly to a specific commit timeline hash instead of an active branch container.",
        mitigation: "Create a temporary safety rescue branch via 'git checkout -b recovery/detached-rescue' to preserve any new commits you write from being pruned by Git's garbage collection."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Gemini] Bạn đang rơi vào trạng thái 'Detached HEAD' (đầu rời neo). Bạn đang trỏ trực tiếp vào một mã băm commit cụ thể thay vì một nhánh.",
        mitigation: "Biện pháp cấp cứu: Tạo một nhánh mới an toàn ngay bằng lệnh 'git checkout -b recovery/detached-rescue' để bảo tồn các thử nghiệm mới viết."
      }
    },
    stale_base_branch: {
      english: {
        explanation: "[OFFLINE Fallback - Gemini API is Disabled (Cost Saved)] Your reference base branch (e.g. develop or master) on your local computer is outdated compared to the remote origin registry.",
        mitigation: "Trigger a remote synchronization fetch and pull updates using 'git fetch origin && git checkout <base> && git pull origin <base>' to avoid massive rebasing conflicts on stale roots."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Gemini] Nhánh gốc tham chiếu của bạn ở local nằm tụt lại quá sâu so với remote server. Rebase trên nền một nhánh mốc meo lỗi thời sẽ gây ra xung đột cực lớn.",
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
        setDoctorDiagnosis({
          explanation: cachedData.explanation + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)"),
          mitigation: cachedData.mitigation + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)")
        });
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
            explanation = `[OFFLINE - ĐÃ TẮT GEMINI TIẾT KIỆM TIỀN] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Gemini] ", "")} Code lỗi tèm lem thế này chần chừ gì nữa hả nhóc!`;
            mitigation = `${rawMitigation} Fix lẹ đi đừng chần chừ!`;
          } else if (tone === TranslationTone.JOKE) {
            explanation = `[OFFLINE - GEMINI ĐANG TẬP YOGA] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Gemini] ", "")} Quẻ phán lỗi này rebase siêu sập tiệm á haha!`;
            mitigation = `${rawMitigation} Làm lẹ giải hạn đi bạn hiền bớ người ta!`;
          }

          setDoctorDiagnosis({
            explanation,
            mitigation
          });
        } else {
          setDoctorDiagnosis({
            explanation: isEnglish ? "Offline generic anomaly alert. Gemini is disabled." : "Cảnh báo bất thường cục bộ hệ thống. API Gemini đang tắt.",
            mitigation: isEnglish ? "Proceed with manual fixes." : "Thực hiện xử lý thủ công các nhánh Git."
          });
        }
        setDoctorLoading(false);
      }, 300);
      return;
    }
    
    try {
      const res = await fetch(resolveApiUrl('/api/explain-git-problem'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemType,
          tone,
          details: {
            isSimulation,
            currentBranch: repoState.currentBranch,
            dirtyFilesCount: repoState.dirtyFiles?.length || 0
          }
        })
      });

      if (!res.ok) {
        throw new Error(tone === TranslationTone.ENGLISH ? 'Failed to contact AI Doctor.' : 'Không thể kết nối đến Trạm cấp cứu AI.');
      }

      const data = await res.json();
      const newDgn = {
        explanation: data.explanation || '',
        mitigation: data.mitigation || ''
      };
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
  const handleCheckoutBranch = async (branchName: string) => {
    addLog(`$ git checkout ${branchName}`);
    
    if (isSimulation) {
      setRepoState(prev => ({
        ...prev,
        currentBranch: branchName
      }));
      addLog(`✓ Checkout local branch successful: ${branchName}`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Checkout successful for actual branch: ${branchName}`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error checking out branch');
          addLog(`! Error checking out branch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Failed network thread executing checkout: ${err.message}`);
      }
    }
  };

  // Create branch action
  const handleCreateBranch = async (branchName: string) => {
    addLog(`$ git checkout -b ${branchName}`);
    
    if (isSimulation) {
      const newB = { name: branchName, isLocal: true, isRemote: false, isCurrent: true, isBase: false };
      setRepoState(prev => ({
        ...prev,
        currentBranch: branchName,
        branches: [...prev.branches, newB]
      }));
      addLog(`✓ Created and checkout brand new simulated branch: ${branchName}`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout -b ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Created branch: ${branchName}`);
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

  const handleDeleteBranch = (branchName: string) => {
    addLog(`$ git branch -D ${branchName}`);
    setRepoState(prev => ({
      ...prev,
      branches: prev.branches.filter(b => b.name !== branchName)
    }));
    addLog(`✓ Deleted local and remote tracking of ${branchName}`);
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

  const activeCommitsForSquash = repoState.commits.filter(c => c.selected);

  return (
    <div id="rebase-overlord-app" className="min-h-screen bg-[#060814] text-slate-100 p-4 font-sans select-none antialiased">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        
        {/* Workspace Configurations & Tones Dashboard Header */}
        <RepoHeader
          repoState={repoState}
          stats={stats}
          tone={tone}
          useEmoji={useEmoji}
          isSimulation={isSimulation}
          isCloning={isCloning}
          isAiEnabled={isAiEnabled}
          onSetTone={(t) => {
            setTone(t);
            addLog(`🗣️ Updated translation personality tone to: ${t}`);
          }}
          onToggleEmoji={() => {
            setUseEmoji(!useEmoji);
            addLog(useEmoji ? '🤪 Emoji layout deactivated.' : '🤪 Emoji display active!');
          }}
          onToggleSimulation={(val) => {
            setIsSimulation(val);
            addLog(`🤖 Mode toggled. Simulation Playground: ${val ? 'ACTIVE' : 'OFF'}`);
            handleRefresh(val);
          }}
          onToggleAi={() => {
            const newVal = !isAiEnabled;
            setIsAiEnabled(newVal);
            addLog(newVal ? '🤖 Gemini API Enabled (Full AI Features activated)' : '🤖 Gemini API Disabled (Cost saved - falling back to offline mode)');
          }}
          onUpdateRepoPath={handleUpdateRepoPath}
          onCloneRepo={handleCloneRepo}
          onRefresh={handleRefresh}
        />

        {/* Night Owl Persistent Banner */}
        {isNightOwl && showNightOwlBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 shadow-xl flex items-center justify-between gap-4 backdrop-blur-md"
          >
            <div className="flex gap-3 items-center">
              <div className="bg-indigo-505/10 text-indigo-400 p-2 rounded-lg border border-indigo-500/20 shrink-0 text-xl animate-pulse">
                🦉
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-300 font-mono tracking-wider uppercase mb-0.5">
                  {tone === TranslationTone.ENGLISH ? "🌙 NIGHT OWL MISSION DETECTED (EASTER EGG)" : "🌙 PHÁT HIỆN CHẾ ĐỘ CỦ ĐÊM (EASTER EGG)"}
                </h4>
                <p className="text-xs text-indigo-200/80 leading-relaxed font-sans font-medium">
                  {translate('ee_night_owl', tone)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNightOwlBanner(false)}
              className="text-indigo-400 hover:text-indigo-200 rounded-lg p-1.5 hover:bg-indigo-500/10 cursor-pointer transition-all shrink-0"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Serverless / Vercel Host Warn & Config Banner */}
        {backendStatus === 'unreachable' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl flex flex-col md:flex-row gap-5 items-start justify-between"
          >
            <div className="flex gap-3.5 items-start">
              <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg border border-amber-500/20 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-100 font-mono tracking-wide uppercase flex items-center gap-2">
                  ⚠️ Phát Hiện Máy Chủ Tĩnh (Vercel / GitHub Pages Hosting detected)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-3xl">
                  Để thực hiện các thao tác Git thực tế (như <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded font-mono border border-slate-900 text-[10px]">git clone</code>, chọn thư mục ổ đĩa của bạn), hệ thống cần một máy chủ liên tục (stateful Node Express backend). Do Vercel là nền tảng Serverless tĩnh, hệ thống đã <strong className="text-emerald-400 font-semibold">Tự Thừa Kế & Tự Động Kích Hoạt chế độ Giả Lập (Simulation Playground)</strong> để bạn có thể trải nghiệm toàn vẹn dòng chảy logic Rebase mượt mà.
                </p>
                <p className="text-[11px] text-indigo-400 leading-relaxed font-mono">
                  💡 Bạn muốn lấy repo thật từ Windows/MacOS của mình? Hãy chạy lệnh <code className="text-slate-300 bg-slate-950 px-1 rounded">npm start</code> cục bộ trên máy và dán địa chỉ localhost ở khung cấu hình bên phải!
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 w-full md:w-[320px] shrink-0 self-stretch flex flex-col justify-between gap-3 text-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cầu Nối API Cục Bộ (Hybrid Live Switcher)</span>
                <input
                  type="text"
                  placeholder="Ví dụ: http://localhost:3000"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  className="w-full bg-[#060814] border border-slate-800 rounded px-2.5 py-1.5 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
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
                    title="Xóa địa chỉ tùy chỉnh"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboard Panels Grid split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Workspace Left panel containing State Wizard and visual helpers */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* Real-time Visual Commit Squashing Timeline Graph */}
            <div id="live-git-visualization" className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider mb-4 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-400" />
                <span>TRỰC QUAN HÓA SƠ ĐỒ COMMITS (VISUAL COMMIT TIMELINE GRAPH)</span>
              </h3>

              {/* Graphical representation of the Rebase squash action */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 p-4 bg-slate-950/80 rounded-xl border border-slate-900/60 overflow-x-auto min-h-36">
                
                {/* Develop Head represent */}
                <div className="flex flex-col items-center gap-1.5 px-3 min-w-fit select-none">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-md flex items-center justify-center text-xs font-mono font-bold text-emerald-300">
                    dev
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">develop head</div>
                </div>

                <div className="text-slate-700 text-lg hidden md:block">══════▶</div>
                <div className="text-slate-700 text-lg md:hidden">▼</div>

                {wizard.step < 5 ? (
                  <>
                    {/* Commits checklist visualization line items before squash */}
                    {activeCommitsForSquash.length === 0 ? (
                      <div className="text-slate-600 text-xs italic py-2">
                        {sloc.emptyCommits}
                      </div>
                    ) : (
                      activeCommitsForSquash.map((c, i) => {
                        const isSelect = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
                        return (
                          <React.Fragment key={c.sha}>
                            <div className="flex flex-col items-center gap-1 px-2.5 py-1.5 min-w-[120px] max-w-[140px] text-center border border-slate-900 bg-slate-900/40 rounded-lg">
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                isSelect ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-950 text-slate-600 border border-slate-900'
                              }`}>
                                {c.sha}
                              </span>
                              <span className={`text-[10px] truncate w-full font-medium ${isSelect ? 'text-slate-300' : 'text-slate-600'}`}>
                                {c.message}
                              </span>
                            </div>
                            {i < activeCommitsForSquash.length - 1 && (
                              <>
                                <div className="text-slate-800 text-sm hidden md:block">➜</div>
                                <div className="text-slate-800 text-sm md:hidden">▼</div>
                              </>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </>
                ) : (
                  /* Commits squashed visual state showing a single clean unified block head */
                  <div className="flex items-center gap-3 bg-indigo-505/10 border border-indigo-500/30 p-4 rounded-xl animate-fade-in text-center max-w-md w-full">
                    <div className="bg-indigo-500/20 text-indigo-400 p-2.5 rounded-lg border border-indigo-500/30 shrink-0">
                      <GitMerge className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-slate-200 text-xs text-left">
                      <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider mb-0.5">SQUASH COMPLETED (1 COMMIT REMAINING)</div>
                      <div className="font-mono font-semibold text-slate-100">{wizard.finalMsg}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1">Author: Nguyen Tran | Date: Just now</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Active Git Operational Visualizer */}
            <GitVisualizerPanel tone={tone} wizard={wizard} />

            {/* Core Wizard state dashboard */}
            <WizardPanel
              commits={repoState.commits}
              wizard={wizard}
              tone={tone}
              useEmoji={useEmoji}
              onUpdateWizard={handleUpdateWizard}
              onExecuteWizardRebase={handleExecuteWizardRebase}
              onResetWizard={handleResetWizard}
            />

            {/* Emergency Conflict Resolution Panel if in rebaseProgress */}
            {(repoState.rebaseInProgress || wizard.status === 'paused_conflict') && (
              <ConflictSolver
                conflicts={repoState.conflicts}
                tone={tone}
                currentBranch={repoState.currentBranch || 'feature-branch'}
                baseBranch={wizard.baseBranch || repoState.baseBranch || 'develop'}
                isAiEnabled={isAiEnabled}
                onResolveFile={handleResolveFile}
                onCompleteRecovery={handleCompleteRecovery}
              />
            )}
          </div>

          {/* Right Panel Rails split containing branch widgets, diagnostics and terminal logs */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Git Branch Interactive Hub switcher */}
            <BranchPanel
              branches={repoState.branches}
              currentBranch={repoState.currentBranch}
              tone={tone}
              useEmoji={useEmoji}
              onCheckout={handleCheckoutBranch}
              onCreateBranch={handleCreateBranch}
              onDeleteBranch={handleDeleteBranch}
            />

            {/* Simulated Live Diagnostic Warnings Panel with AI Git Doctor Integration */}
            <div id="git-warnings-board" className="bg-[#0f172a] border border-slate-850 rounded-xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-805/60 pb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-violet-400 animate-spin-slow" />
                  <span>{sloc.title}</span>
                </h3>
                {isSimulation && (
                  <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    {sloc.simulationAnomalyBadge}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5 text-xs font-mono border-b border-slate-800/60 pb-3">
                {/* 1. Git Installation Health */}
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-900">
                  <span className="text-slate-500">{sloc.gitEnv}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                    ✓ STABLE (v2.41)
                  </span>
                </div>

                {/* 2. GitHub auth check */}
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-900">
                  <span className="text-slate-500">{sloc.githubCli}</span>
                  {repoState.ghAvailable ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px] flex items-center gap-1">
                      <Github className="w-3 h-3" /> ✓ AUTHORIZED
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[10px]" title="Please sign-in to gh-cli on system">
                      ⚠️ NOT SIGNED
                    </span>
                  )}
                </div>

                {/* 3. Rebase health check indicator */}
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-900">
                  <span className="text-slate-500">{sloc.rebaseStatus}</span>
                  {repoState.rebaseInProgress ? (
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px] animate-pulse">
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
                <div className="bg-[#0b0f19]/80 border border-slate-850/50 rounded-lg p-2.5 flex flex-col gap-1.5">
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
                          ? 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
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
                          ? 'bg-rose-550/15 border-rose-500/30 text-rose-300' 
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
                          ? 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {isStaleBaseSimulated ? sloc.staleUnsafeLabel : sloc.staleSafeLabel}
                    </button>
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
                    <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight">
                          <span className="font-bold text-amber-300 block">
                            {sloc.uncommittedChangesTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {sloc.uncommittedChangesDesc.replace("{0}", String(repoState.dirtyFiles?.length || 0))}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('dirty_working_tree')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className="flex gap-2 text-[10px] items-center border-t border-amber-500/10 pt-1.5 font-mono">
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer"
                        >
                          stash
                        </button>
                        <button 
                          onClick={() => {
                            const confirmVal = window.confirm(sloc.discardConfirm);
                            if (confirmVal) handleTriggerDoctorAction('dirty_working_tree', 'discard');
                          }}
                          className="px-1.5 py-0.5 bg-rose-950/20 text-rose-400 border border-rose-500/20 rounded cursor-pointer"
                        >
                          discard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue B: Diverged Branch */}
                  {(isSimulation ? isDivergedSimulated : false) && (
                    <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight">
                          <span className="font-bold text-amber-300 block">
                            {sloc.divergedTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {sloc.divergedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('diverged_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className="flex gap-2 text-[10px] items-center border-t border-amber-500/10 pt-1.5 font-mono">
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-850 rounded cursor-pointer"
                        >
                          pull --rebase
                        </button>
                        <button 
                          onClick={() => {
                            const confirmVal = window.confirm(sloc.forcePushConfirm);
                            if (confirmVal) handleTriggerDoctorAction('diverged_branch', 'force_push');
                          }}
                          className="px-1.5 py-0.5 bg-rose-950/20 text-rose-400 border border-rose-500/20 rounded cursor-pointer"
                        >
                          force push
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue C: Detached HEAD */}
                  {(isSimulation ? isDetachedHeadSimulated : false) && (
                    <div className="border border-rose-500/20 bg-rose-500/5 p-3 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight">
                          <span className="font-bold text-rose-300 block">
                            {sloc.detachedTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {sloc.detachedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('detached_head')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className="flex gap-2 text-[10px] items-center border-t border-rose-500/10 pt-1.5 font-mono">
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                          className="px-1.5 py-0.5 bg-rose-600 text-white border border-rose-500/25 rounded cursor-pointer"
                        >
                          {sloc.rescueBranchBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue D: Stale Base Branch */}
                  {(isSimulation ? isStaleBaseSimulated : false) && (
                    <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight">
                          <span className="font-bold text-amber-300 block">
                            {sloc.staleBaseTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {sloc.staleBaseDesc.replace("{0}", wizard.baseBranch || 'develop')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('stale_base_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className="flex gap-2 text-[10px] items-center border-t border-amber-500/10 pt-1.5 font-mono">
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded cursor-pointer"
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
                <div className="bg-[#111219] border border-violet-500/30 p-3 rounded-xl flex flex-col gap-2 animate-fade-in text-slate-300">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="text-[9px] font-mono font-black text-violet-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 text-violet-400 animate-pulse" />
                      {sloc.doctorRep}
                    </span>
                    <button
                      onClick={() => {
                        setDoctorProblem(null);
                        setDoctorDiagnosis(null);
                      }}
                      className="text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {doctorLoading ? (
                     <div className="flex flex-col items-center gap-2 py-4 text-center text-xs font-mono">
                       <span className="animate-spin h-4.5 w-4.5 border-2 border-violet-500 border-t-transparent rounded-full font-mono"></span>
                       <span className="text-slate-400 animate-pulse">{sloc.scanAnomaliesLoading}</span>
                     </div>
                  ) : doctorError ? (
                     <div className="text-[10px] font-mono text-rose-400 p-2 border border-rose-500/20 bg-rose-950/20 rounded">
                       ⚠️ {doctorError}
                     </div>
                  ) : doctorDiagnosis ? (
                     <div className="flex flex-col gap-2.5">
                       <div className="text-[10px] text-slate-300 bg-slate-950/50 p-2.5 rounded border border-[#2d2f3c]/50">
                         <strong className="text-[9px] font-mono font-bold text-violet-300 uppercase block tracking-wider">
                           {sloc.doctorExplanation}
                         </strong>
                         <p className="font-sans leading-relaxed text-slate-300 mt-0.5">
                           {doctorDiagnosis.explanation}
                         </p>
                       </div>

                       <div className="text-[10px] text-slate-300 bg-indigo-950/20 p-2.5 rounded border border-indigo-500/20">
                         <strong className="text-[9px] font-mono font-bold text-[#a5b4fc] uppercase block tracking-wider">
                           {sloc.doctorMitigation}
                         </strong>
                         <div className="font-sans leading-relaxed text-slate-200 mt-0.5 whitespace-pre-line border-l-2 border-[#a5b4fc]/30 pl-2">
                           {doctorDiagnosis.mitigation}
                         </div>
                       </div>

                       {/* Inject quick operation under summary based on problem */}
                       <div className="flex justify-end gap-1.5 mt-0.5">
                         {doctorProblem === 'dirty_working_tree' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyStash}
                           </button>
                         )}
                         {doctorProblem === 'diverged_branch' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
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
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
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

            {/* Dynamic visual terminal logger console */}
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
            />

          </div>

        </div>

        {/* Dashboard Footer credits and hints */}
        <div className="bg-[#0b0f19]/40 border border-slate-900/60 rounded-xl p-4 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center gap-2 mt-2">
          <span>Rebase Overlord — The Git Feature Flow Assistant</span>
          <span className="flex items-center gap-1 text-[10px]">
            Created for <strong className="text-slate-400">boybibo98@gmail.com</strong> in AI Studio Build Environment
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
                className={`pointer-events-auto bg-[#070913]/95 text-slate-100 p-4 rounded-xl border shadow-2xl flex gap-3.5 relative backdrop-blur-md ${
                  toast.type === 'milestone'
                    ? 'border-amber-500/30 shadow-amber-500/5 bg-gradient-to-r from-amber-950/20 to-[#070913]/95'
                    : toast.type === 'owl'
                    ? 'border-indigo-500/30 shadow-indigo-505/5 bg-gradient-to-r from-indigo-950/20 to-[#070913]/95'
                    : toast.type === 'rage'
                    ? 'border-rose-500/30 shadow-rose-505/5 bg-gradient-to-r from-rose-950/20 to-[#070913]/95'
                    : 'border-slate-800 shadow-black'
                }`}
              >
                {/* Accent line on left */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-xl ${
                  toast.type === 'milestone' ? 'bg-amber-500' : toast.type === 'owl' ? 'bg-indigo-500' : toast.type === 'rage' ? 'bg-rose-500' : 'bg-slate-700'
                }`} />

                {toast.emoji && (
                  <div className={`text-2xl select-none shrink-0 ${toast.type === 'rage' ? 'animate-bounce' : 'animate-pulse'}`}>
                    {toast.emoji}
                  </div>
                )}

                <div className="flex-1 font-sans pr-4">
                  <h5 className={`text-xs font-bold font-mono tracking-wider uppercase mb-1 ${
                    toast.type === 'milestone' ? 'text-amber-400' : toast.type === 'owl' ? 'text-indigo-400' : toast.type === 'rage' ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {toast.title}
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium whitespace-pre-line">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-slate-500 hover:text-slate-300 cursor-pointer absolute top-3 right-3 p-1 rounded-lg transition-all"
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

      </div>
    </div>
  );
}
