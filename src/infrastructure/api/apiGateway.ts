import { resolveApiUrl } from '../../utils/apiResolver';
import { getApiHeaders } from '../../utils/apiKeyHelper';
import { GitRepoState, TranslationTone } from '../../types';

export class ApiGateway {
  /**
   * Fetches Git repository status from backend server.
   */
  static async fetchGitStatus(simulation: boolean, scenario: string, baseBranch: string): Promise<GitRepoState> {
    const url = resolveApiUrl(`/api/git-status?simulation=${simulation}&scenario=${scenario}&baseBranch=${encodeURIComponent(baseBranch)}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }
    return res.json();
  }

  /**
   * Executes a Git bash shell command.
   */
  static async executeCommand(command: string): Promise<{ code: number; stdout: string; stderr: string; error?: string }> {
    const url = resolveApiUrl('/api/execute-command');
    const res = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({ command })
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status} execution failed`);
    }
    return res.json();
  }

  /**
   * Fetches commit detail metadata - files touched by custom SHA.
   */
  static async fetchCommitChanges(sha: string, isSimulation: boolean): Promise<{ files: Array<{ filepath: string; status: 'modified' | 'added' | 'deleted' }> }> {
    const url = resolveApiUrl(`/api/commit-changes?sha=${sha}&simulation=${isSimulation}`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load commit files`);
    }
    return res.json();
  }

  /**
   * Resolves a whole file with merge-markers using Gemini AI context.
   */
  static async resolveConflictFileAi(filepath: string, rawContent: string, tone: TranslationTone): Promise<{ explanation: string; resolvedContent: string; error?: string }> {
    const url = resolveApiUrl('/api/resolve-conflict-ai');
    const res = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({ filepath, content: rawContent, tone })
    });
    if (!res.ok) {
      throw new Error(`Fetch failure resolving file conflict`);
    }
    return res.json();
  }

  /**
   * Resolves an individual conflict block using Gemini AI.
   */
  static async resolveConflictBlockAi(filepath: string, oursText: string, theirsText: string, tone: TranslationTone): Promise<{ explanation: string; resolvedContent: string; error?: string }> {
    const url = resolveApiUrl('/api/resolve-block-ai');
    const res = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({ filepath, oursText, theirsText, tone })
    });
    if (!res.ok) {
      throw new Error(`Fetch failure resolving block conflict`);
    }
    return res.json();
  }

  /**
   * Fetches telemetry stats.
   */
  static async fetchSessionStats(): Promise<{ rebase_count?: number; rebaseCount?: number; first_run?: string; firstRun?: string; last_run?: string; lastRun?: string }> {
    const res = await fetch(resolveApiUrl('/api/stats'));
    if (!res.ok) {
      throw new Error(`Failed to check statistics`);
    }
    return res.json();
  }

  /**
   * Retrieves alignment update metadata.
   */
  static async fetchUpdateMetadata(): Promise<{ status: string; version?: string }> {
    const res = await fetch(resolveApiUrl('/api/update/metadata'));
    if (!res.ok) {
      throw new Error(`Fetch failed for update metadata`);
    }
    return res.json();
  }
}
