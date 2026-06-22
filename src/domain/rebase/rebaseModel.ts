import { Commit } from '../../types';

export type RebaseScenarioId = 
  | 'linear' 
  | 'nonlinear' 
  | 'rewrite' 
  | 'stale' 
  | 'detached' 
  | 'large_history' 
  | 'large_nonlinear' 
  | 'powerbi';

export interface RebaseScenario {
  id: RebaseScenarioId;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Supported Interactive simulation scenarios registry.
 */
export const REBASE_SCENARIOS: RebaseScenario[] = [
  {
    id: 'linear',
    name: 'Standard Linear Feature Rebase',
    description: 'Clean rebase of a flat feature branch onto develop with zero conflict blocks.',
    difficulty: 'easy'
  },
  {
    id: 'nonlinear',
    name: 'Nonlinear Divergent Tree',
    description: 'Rebase when both base branch and your feature branch have independent commits.',
    difficulty: 'medium'
  },
  {
    id: 'rewrite',
    name: 'Conflict Storm & History Rewriting',
    description: 'Manual and AI-powered multi-file conflict solving with interactive re-picks.',
    difficulty: 'hard'
  },
  {
    id: 'stale',
    name: 'Mouldy Outdated Base Branch Warning',
    description: 'Rebasing on top of an extremely stale develop base branch trigger.',
    difficulty: 'easy'
  },
  {
    id: 'detached',
    name: 'Dangling Detached HEAD Rescue',
    description: 'Rescues orphaned states before garbage collection sweeps up changes.',
    difficulty: 'hard'
  },
  {
    id: 'powerbi',
    name: 'Power BI Metadata Solver',
    description: 'Specialized conflict solver that automatically handles messy biological binary PBI layouts.',
    difficulty: 'medium'
  }
];

/**
 * Domain rule: Generates a standard backup branch name based on the target branch name.
 */
export function generateBackupBranchName(branchName: string): string {
  if (!branchName) return 'backup/rebase-overlord-unnamed';
  const cleanBranch = branchName.replace(/\//g, '_');
  return `backup/rebase-overlord-${cleanBranch}`;
}

/**
 * Domain rule: Retrieves human-readable label for wizard step.
 */
export function getWizardStepLabel(step: number): string {
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
}

/**
 * Domain helper: analyzes commit types to suggest commit message squash structures.
 */
export function suggestSquashedCommitMessage(commits: Commit[], defaultMsg: string): string {
  if (commits.length === 0) return defaultMsg;
  
  // Find lead message or compile them elegantly
  const cleanCommits = commits.filter(c => !c.message.startsWith('squash!') && !c.message.startsWith('fixup!'));
  if (cleanCommits.length > 0) {
    // Check if the primary commit message is a feat or fix
    const lead = cleanCommits[0].message;
    if (cleanCommits.length === 1) return lead;
    
    // Group and list extra logs
    const summaries = cleanCommits.map(c => `  - ${c.message}`).join('\n');
    return `${lead}\n\nMerged & squashed commits:\n${summaries}`;
  }
  
  return defaultMsg;
}
