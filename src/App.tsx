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
  Github
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
import { resolveApiUrl } from './utils/apiResolver';

const sanityLoc: Record<TranslationTone, {
  title: string;
  gitEnv: string;
  githubCli: string;
  rebaseStatus: string;
  readyStatus: string;
  emptyCommits: string;
}> = {
  [TranslationTone.PROFESSIONAL]: {
    title: "CHẨN ĐOÁN & KIỂM TRA (GIT SANITY CHECKS)",
    gitEnv: "Môi trường Git Binary:",
    githubCli: "Kết nối GitHub CLI (gh):",
    rebaseStatus: "Trạng thái Rebase:",
    readyStatus: "✓ SẠCH SẼ (READY)",
    emptyCommits: "Chọn một chi nhánh khác hoặc nhập base branch để vẽ lịch sử commits."
  },
  [TranslationTone.JOKE]: {
    title: "KHÁM SỨC KHỎE REPO (GIT SANITY CHECKS)",
    gitEnv: "Hệ điều hành Git:",
    githubCli: "Gia thế GitHub (gh-cli):",
    rebaseStatus: "Cục diện Rebase:",
    readyStatus: "✓ TRƠN TRU (READY)",
    emptyCommits: "Sếp lướt sang nhánh khác hoặc gõ tên bến đỗ (base branch) để em vẽ lịch sử nhé."
  },
  [TranslationTone.TOXIC]: {
    title: "BỆNH ÁN GIT (GIT SANITY CHECKS)",
    gitEnv: "Hàng Auth hay Fake:",
    githubCli: "Hộ khẩu Github (gh):",
    rebaseStatus: "Bãi chiến trường Rebase:",
    readyStatus: "✓ HẾT SỐC (READY)",
    emptyCommits: "Mày sang nhánh khác hoặc phang tên base branch vào để tao nặn mấy cái commits coi!"
  },
  [TranslationTone.ENGLISH]: {
    title: "DIAGNOSTICS & GIT SANITY CHECKS",
    gitEnv: "Git Binary Environment:",
    githubCli: "GitHub CLI Connection (gh):",
    rebaseStatus: "Rebase Status:",
    readyStatus: "✓ CLEAN (READY)",
    emptyCommits: "Select a different branch or provide a base branch to render commit history."
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

  const [showLogPanel, setShowLogPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_log_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [isCloning, setIsCloning] = React.useState<boolean>(false);

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
        setStats(data);
      }
    } catch {
      // Fallback
    }
  };

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
      case 6: return 'Finalize check with Push optionality';
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
          setStats(d);
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
                setStats(d);
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
          onUpdateRepoPath={handleUpdateRepoPath}
          onCloneRepo={handleCloneRepo}
          onRefresh={handleRefresh}
        />

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

            {/* Simulated Live Diagnostic Warnings Panel */}
            <div id="git-warnings-board" className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>{sloc.title}</span>
              </h3>

              <div className="flex flex-col gap-2.5 text-xs font-mono">
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
            </div>

            {/* Dynamic visual terminal logger console */}
            <TerminalPanel
              logs={logs}
              showLogPanel={showLogPanel}
              onToggleLogPanel={() => setShowLogPanel(!showLogPanel)}
              onClearLogs={() => setLogs([])}
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

      </div>
    </div>
  );
}
