import { ReflogEntry } from '../../features/reflog/useReflogRecovery';

/**
 * Domain rule: Filters entries to only retrieve dangling commits that are lost in the Git timeline.
 */
export function filterDanglingEntries(entries: ReflogEntry[]): ReflogEntry[] {
  return entries.filter(e => e.isDangling);
}

/**
 * Domain rule: Generates a rescue branch name for a rescued commit SHA.
 */
export function generateRescueBranchName(sha: string): string {
  if (!sha) return 'rescue-branch-unspecified';
  const shortSha = sha.substring(0, 7);
  return `rescue-branch-${shortSha}`;
}

/**
 * Domain rule: Classifies a reflog selector action type for metadata tags.
 */
export function classifyReflogAction(selector: string, message: string): 'checkout' | 'commit' | 'rebase' | 'reset' | 'unknown' {
  const normSelector = selector.toLowerCase();
  const normMsg = message.toLowerCase();
  
  if (normMsg.includes('rebase')) return 'rebase';
  if (normMsg.includes('checkout')) return 'checkout';
  if (normMsg.includes('reset')) return 'reset';
  if (normMsg.includes('commit') || normMsg.includes('amend')) return 'commit';
  
  return 'unknown';
}
