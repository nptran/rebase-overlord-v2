/**
 * Application Layer - Workflow Service
 * Coordinates use cases by linking domain rules with infrastructure adapters.
 */

import { ApiGateway } from '../infrastructure/api/apiGateway';
import { LocalStorageAdapter } from '../infrastructure/storage/localStorageAdapter';
import { isBranchStale } from '../domain/branch/branchModel';
import { generateBackupBranchName, suggestSquashedCommitMessage } from '../domain/rebase/rebaseModel';
import { GitRepoState, TranslationTone, Commit } from '../types';

export class WorkflowService {
  /**
   * Use Case: Fetches and synchronizes repository status, then monitors and checks if current branch is stale.
   */
  static async syncGitRepository(
    isSimulation: boolean,
    scenarioId: string,
    baseBranch: string
  ): Promise<{ repoState: GitRepoState; isCurrentStale: boolean; staleBranchInfo: any | null }> {
    const state = await ApiGateway.fetchGitStatus(isSimulation, scenarioId, baseBranch);
    
    // Check if the current branch checkout is outdated/stale
    const currentName = state.currentBranch;
    const currentMeta = state.branches.find(b => b.name === currentName);
    const lastCommitDate = currentMeta?.lastCommitDate;
    
    const isStale = isBranchStale(lastCommitDate);
    const staleInfo = isStale && currentMeta ? {
      name: currentMeta.name,
      age: currentMeta.commitAge || 'older than 7 days',
      lastCommitDate: currentMeta.lastCommitDate || ''
    } : null;

    return {
      repoState: state,
      isCurrentStale: isStale,
      staleBranchInfo: staleInfo
    };
  }

  /**
   * Use Case: Run a remote or simulated Git bash action.
   */
  static async triggerGitCommand(command: string): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const resp = await ApiGateway.executeCommand(command);
      if (resp.code === 0) {
        return { success: true, output: resp.stdout || 'Command completed successfully.' };
      }
      return { 
        success: false, 
        output: resp.stderr || resp.stdout || 'Execution failed.', 
        error: resp.error || 'Command returned non-zero code' 
      };
    } catch (err: any) {
      return { success: false, output: '', error: err.message };
    }
  }

  /**
   * Use Case: Automatic backup setup configuration helper.
   */
  static setupRebaseBackup(currentBranch: string): string {
    return generateBackupBranchName(currentBranch);
  }

  /**
   * Use Case: Compiles a recommended squashed commit message based on selected commits.
   */
  static compileSquashCommitMessage(commits: Commit[], placeholder: string): string {
    return suggestSquashedCommitMessage(commits, placeholder);
  }

  /**
   * Use Case: Resolves conflict block after reading and checking local doctor caches.
   */
  static async analyzeAnomalies(
    problemType: string,
    tone: TranslationTone,
    isAiEnabled: boolean,
    offlineFallbacks: Record<string, any>
  ): Promise<{ explanation: string; mitigation: string; isCached: boolean; isOffline: boolean }> {
    const cacheKey = `dr_diagnosis_${problemType}_${tone}`;
    
    // Check for cached AI diagnoses
    const cached = LocalStorageAdapter.getObject<any>('rebase_overlord_doctor_cache', null);
    if (cached && cached[cacheKey]) {
      return {
        explanation: cached[cacheKey].explanation,
        mitigation: cached[cacheKey].mitigation,
        isCached: true,
        isOffline: false
      };
    }

    // Handle offline fallback if AI toggled off
    if (!isAiEnabled) {
      const fallbackSet = offlineFallbacks[problemType];
      const lan = tone === TranslationTone.ENGLISH ? 'english' : 'vietnamese';
      const detail = fallbackSet ? fallbackSet[lan] : { explanation: 'No connection', mitigation: 'Check network' };
      return {
        explanation: detail.explanation + " (⚡ Offline AI Diagnostic Rules)",
        mitigation: detail.mitigation,
        isCached: false,
        isOffline: true
      };
    }

    // Call API Gateway trigger
    let rawPrompt = `What is Git issue '${problemType}'? Explain and provide mitigation.`;
    const resp = await ApiGateway.resolveConflictFileAi('doctor_query', rawPrompt, tone);
    
    const explanation = resp.explanation;
    const mitigation = resp.resolvedContent; // standard AI doc response parsing handles this

    // Write back to cache
    const cacheStore = LocalStorageAdapter.getObject<Record<string, any>>('rebase_overlord_doctor_cache', {});
    cacheStore[cacheKey] = { explanation, mitigation };
    LocalStorageAdapter.setObject('rebase_overlord_doctor_cache', cacheStore);

    return {
      explanation,
      mitigation,
      isCached: false,
      isOffline: false
    };
  }
}
