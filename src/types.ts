/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TranslationTone {
  PROFESSIONAL = 'vn_pro',
  JOKE = 'vn_joke',
  TOXIC = 'vn_toxic',
  ENGLISH = 'en_pro'
}

export interface Commit {
  sha: string;
  author: string;
  date: string;
  message: string;
  type?: 'feat' | 'fix' | 'refactor' | 'docs' | 'chore' | 'other';
  selected?: boolean;
  isMergeCommit?: boolean;
  parents?: string[];
  track?: number;
  pending?: boolean;
  status?: string;
  isConflicting?: boolean;
  isOriginalPending?: boolean;
}

export interface GitBranch {
  name: string;
  isLocal: boolean;
  isRemote: boolean;
  isCurrent: boolean;
  isBase?: boolean;
  aheadCount?: number;
  behindCount?: number;
}

export interface ConflictFile {
  filepath: string;
  status: 'modified' | 'staged' | 'conflicted';
  conflictsCount: number;
  contentBefore: string;
  contentAfter: string;
  resolvedContent?: string;
  isResolved?: boolean;
}

export interface GitRepoState {
  repoPath: string;
  isValid: boolean;
  currentBranch: string;
  baseBranch: string;
  isDirty: boolean;
  dirtyFiles: string[];
  branches: GitBranch[];
  commits: Commit[];
  rebaseInProgress: boolean;
  mergeInProgress: boolean;
  rebaseState?: any;
  conflicts: ConflictFile[];
  ghAvailable: boolean;
  ghErrorKey: string;
  commandHistory: string[];
  baseComparison?: {
    ahead: number;
    behind: number;
  };
}

export interface WizardState {
  step: number;
  baseBranch: string;
  doFetch: boolean;
  detectedType: string;
  detectedReason: string;
  historyType: 'clean' | 'merged' | '';
  basePoint: string;
  commitTotal: number;
  selectedCommits: string[]; // List of SHAs
  doBackup: boolean;
  backupBranchName: string;
  finalMsg: string;
  autoPush: boolean;
  status: 'idle' | 'running' | 'paused_conflict' | 'completed' | 'aborted';
}

export interface SessionStats {
  rebaseCount: number;
  firstRun: string;
  lastRun?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

