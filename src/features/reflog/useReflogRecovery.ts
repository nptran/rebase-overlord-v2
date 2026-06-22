import React from 'react';
import { TranslationTone } from '../../types';

export interface ReflogEntry {
  id: string;
  sha: string;
  selector: string;
  type: string;
  message: string;
  isDangling: boolean;
  author: string;
  date: string;
}

interface UseReflogRecoveryProps {
  tone: TranslationTone;
  onRescueCommit: (sha: string, message: string, author: string, date: string) => void;
}

export function useReflogRecovery({ tone, onRescueCommit }: UseReflogRecoveryProps) {
  const [entries, setEntries] = React.useState<ReflogEntry[]>([
    {
      id: '1',
      sha: 'ea203b5',
      selector: 'HEAD@{1}',
      type: 'commit',
      message: 'feat: integrate stripe subscription models and pricing tables',
      isDangling: true,
      author: 'Alex Nguyen',
      date: '2 hours ago'
    },
    {
      id: '2',
      sha: 'ba51c11',
      selector: 'HEAD@{2}',
      type: 'rebase (abort)',
      message: 'rebase: checkout develop',
      isDangling: false,
      author: 'Alex Nguyen',
      date: '3 hours ago'
    },
    {
      id: '3',
      sha: 'f9421ea',
      selector: 'HEAD@{3}',
      type: 'checkout',
      message: 'moving from feature/payment-v2 to bugfix/typo-header',
      isDangling: false,
      author: 'System',
      date: '4 hours ago'
    },
    {
      id: '4',
      sha: 'd92a11b',
      selector: 'HEAD@{4}',
      type: 'commit',
      message: 'wip: temp commit before pulling latest upgrades',
      isDangling: true,
      author: 'Alex Nguyen',
      date: '1 day ago'
    }
  ]);

  const [activeRescuingSha, setActiveRescuingSha] = React.useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = React.useState<string[]>([]);
  const [successCommit, setSuccessCommit] = React.useState<string | null>(null);

  const startRescue = (entry: ReflogEntry) => {
    if (activeRescuingSha) return;

    setActiveRescuingSha(entry.sha);
    setTerminalOutput([
      `$ git reflog --date=relative | grep '${entry.sha}'`,
      `Found dangling commit pointer of HEAD: ${entry.sha} (${entry.selector})`,
      `Message: "${entry.message}"`,
      `$ git checkout -b rescue-branch-${entry.sha} ${entry.sha}`,
      `Creating local recovery head branch...`,
      `Applying git cherry-pick or hard-reset simulation...`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setTerminalOutput(prev => [...prev, `[PROCESS] Extracting git index database segments...`]);
      } else if (step === 2) {
        setTerminalOutput(prev => [...prev, `[PROCESS] Reviving commit object trees: ${entry.sha}`]);
      } else if (step === 3) {
        setTerminalOutput(prev => [...prev, `[PROCESS] Appending node to visual DAG pipeline...`]);
      } else if (step === 4) {
        setTerminalOutput(prev => [...prev, `✓ Success: HEAD moved back to restored commit ${entry.sha}`]);
        clearInterval(interval);
        
        // Execute callback to parent
        onRescueCommit(entry.sha, entry.message, entry.author, entry.date);

        setSuccessCommit(entry.sha);
        setActiveRescuingSha(null);
        // Mark entry as not dangling anymore
        setEntries(prev => prev.map(e => e.sha === entry.sha ? { ...e, isDangling: false } : e));

        setTimeout(() => {
          setSuccessCommit(null);
          setTerminalOutput([]);
        }, 6500);
      }
    }, 1000);
  };

  return {
    entries,
    activeRescuingSha,
    terminalOutput,
    successCommit,
    startRescue
  };
}
