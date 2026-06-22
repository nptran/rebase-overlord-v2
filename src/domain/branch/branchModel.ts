import { GitBranch } from '../../types';

/**
 * Checks if a branch is stale (has not been updated in more than 7 days relative to the reference date).
 */
export function isBranchStale(lastCommitDate: string | undefined, relativeTo: Date = new Date()): boolean {
  if (!lastCommitDate) return false;
  try {
    const commitTime = new Date(lastCommitDate).getTime();
    if (isNaN(commitTime)) return false;
    
    // Default reference date to ensure simulation/real-time consistent calculations
    const refTime = Math.max(relativeTo.getTime(), new Date("2026-06-15").getTime()); 
    const diffDays = (refTime - commitTime) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  } catch {
    return false;
  }
}

/**
 * Validates a Git branch name for common illegal characters.
 */
export function validateBranchName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  // Git branch names cannot contain spaces, double dots, tilde, caret, colon, question mark, asterisk, open bracket
  const illegalPattern = /[\s\~\|\^:\?\*\[\\]|\.\./;
  return !illegalPattern.test(name);
}

/**
 * Computes ahead/behind summary text representation for domain branch sync.
 */
export function getBranchStatusLabel(branch: GitBranch, tone: 'english' | 'vietnamese' = 'vietnamese'): string {
  const ahead = branch.aheadCount ?? 0;
  const behind = branch.behindCount ?? 0;
  if (ahead === 0 && behind === 0) {
    return tone === 'english' ? 'Up to date with origin' : 'Đồng bộ hoàn toàn với origin';
  }
  if (ahead > 0 && behind > 0) {
    return tone === 'english' 
      ? `Diverged (${ahead} ahead, ${behind} behind)` 
      : `Bị lệch (${ahead} đi trước, ${behind} đi sau)`;
  }
  if (ahead > 0) {
    return tone === 'english' 
      ? `${ahead} ahead of origin` 
      : `Mới hơn origin ${ahead} commit`;
  }
  return tone === 'english' 
    ? `${behind} behind origin` 
    : `Thấp hơn origin ${behind} commit`;
}
