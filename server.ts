/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Path to stats persistence
const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(STATS_FILE))) {
  try {
    fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
  } catch (err) {
    console.error('Failed to create stats directory:', err);
  }
}

// Read stats
function loadStats() {
  if (fs.existsSync(STATS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    } catch {
      // Return defaults on corrupt file
    }
  }
  return { rebase_count: 0, first_run: new Date().toISOString().split('T')[0] };
}

// Save stats
function saveStats(stats: any) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save stats:', err);
  }
}

// Helpr to execute shell commands
function runCmd(cmd: string, cwd: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || '',
        stderr: stderr || '',
        code: error ? (error.code || 1) : 0
      });
    });
  });
}

// Check if a path has a .git folder
function isGitFolder(dirPath: string): boolean {
  try {
    return fs.existsSync(path.join(dirPath, '.git'));
  } catch {
    return false;
  }
}

// Active repository path tracker
let activeRepoPath = process.cwd();

// Endpoint to fetch system wide states
app.get('/api/git-status', async (req, res) => {
  const isSimulation = req.query.simulation === 'true';

  if (isSimulation) {
    return res.json({
      repoPath: '🤖 [Playground Giả lập]',
      isValid: true,
      currentBranch: 'feature/payment-v2',
      baseBranch: 'develop',
      isDirty: true,
      dirtyFiles: ['src/routes/payment.ts', 'src/services/stripe.ts', 'config/keys.json'],
      branches: [
        { name: 'develop', isLocal: true, isRemote: true, isCurrent: false, isBase: true },
        { name: 'main', isLocal: true, isRemote: true, isCurrent: false, isBase: true },
        { name: 'feature/payment-v2', isLocal: true, isRemote: false, isCurrent: true, isBase: false },
        { name: 'feature/auth-oauth', isLocal: true, isRemote: true, isCurrent: false, isBase: false },
        { name: 'bugfix/typo-header', isLocal: true, isRemote: false, isCurrent: false, isBase: false }
      ],
      commits: [
        { sha: 'f941a3c', author: 'Alex Nguyen', date: '5 mins ago', message: 'feat: add payment intent and webhook handles', type: 'feat', selected: true },
        { sha: 'a82bc4e', author: 'Alex Nguyen', date: '1 hour ago', message: 'fix: resolving null checkout responses', type: 'fix', selected: true },
        { sha: '662dbf1', author: 'Alex Nguyen', date: '3 hours ago', message: 'refactor: split gateways to dedicated instances', type: 'refactor', selected: true },
        { sha: '001ba90', author: 'Sarah Connor', date: '1 day ago', message: 'docs: document secure billing policies', type: 'docs', selected: true },
        { sha: 'd92a11b', author: 'Lead System', date: '2 days ago', message: 'chore: bump package requirements', type: 'chore', selected: false }
      ],
      rebaseInProgress: false,
      mergeInProgress: false,
      conflicts: [],
      ghAvailable: true,
      ghErrorKey: '',
      commandHistory: ['git status', 'git log --oneline -n 5']
    });
  }

  // Real Git Query Mode
  const isValid = isGitFolder(activeRepoPath);
  if (!isValid) {
    return res.json({
      repoPath: activeRepoPath,
      isValid: false,
      currentBranch: '',
      baseBranch: '',
      isDirty: false,
      dirtyFiles: [],
      branches: [],
      commits: [],
      rebaseInProgress: false,
      mergeInProgress: false,
      conflicts: [],
      ghAvailable: false,
      ghErrorKey: 'not_git_repo',
      commandHistory: []
    });
  }

  try {
    // 1. Get current branch
    const branchRes = await runCmd('git rev-parse --abbrev-ref HEAD', activeRepoPath);
    const currBranch = branchRes.stdout.trim() || 'unknown';

    // 2. Check if git worktree is dirty
    const statusRes = await runCmd('git status --porcelain', activeRepoPath);
    const dirtyLines = statusRes.stdout.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const isDirty = dirtyLines.length > 0;
    const dirtyFiles = dirtyLines.map(l => l.substring(3));

    // 3. Check for in-progress rebase or merge
    const gitDirRes = await runCmd('git rev-parse --git-dir', activeRepoPath);
    const gitDir = path.resolve(activeRepoPath, gitDirRes.stdout.trim());
    const rebaseInProgress = fs.existsSync(path.join(gitDir, 'rebase-merge')) || fs.existsSync(path.join(gitDir, 'rebase-apply'));
    const mergeInProgress = fs.existsSync(path.join(gitDir, 'MERGE_HEAD'));

    // 4. Load local / remote branches
    const branchesRes = await runCmd('git branch -a --format="%(refname:short)"', activeRepoPath);
    const rawBranchList = branchesRes.stdout.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    
    const branches = Array.from(new Set(rawBranchList.map(b => b.replace('origin/', ''))))
      .map(bName => ({
        name: bName,
        isLocal: rawBranchList.includes(bName),
        isRemote: rawBranchList.includes(`origin/${bName}`),
        isCurrent: bName === currBranch,
        isBase: ['main', 'master', 'develop', 'dev'].includes(bName)
      }));

    // 5. Load last 20 commits
    const logRes = await runCmd('git log --pretty="format:%h|%an|%ar|%s" -n 20', activeRepoPath);
    const commits = logRes.stdout.split('\n')
      .map(line => {
        const parts = line.split('|');
        if (parts.length < 4) return null;
        const [sha, author, date, message] = parts;
        
        let type = 'other';
        if (message.startsWith('feat:')) type = 'feat';
        else if (message.startsWith('fix:')) type = 'fix';
        else if (message.startsWith('refactor:')) type = 'refactor';
        else if (message.startsWith('docs:')) type = 'docs';
        else if (message.startsWith('chore:')) type = 'chore';

        return { sha, author, date, message, type, selected: true };
      })
      .filter(Boolean);

    // 6. Inspect rebase conflict files if rebase is in progress
    const conflictedFiles: any[] = [];
    if (rebaseInProgress) {
      const conflictRes = await runCmd('git diff --name-only --diff-filter=U', activeRepoPath);
      const cFiles = conflictRes.stdout.split('\n').map(f => f.trim()).filter(f => f.length > 0);
      cFiles.forEach(filepath => {
        let contentBefore = '';
        try {
          const fullPath = path.resolve(activeRepoPath, filepath);
          if (fs.existsSync(fullPath)) {
            contentBefore = fs.readFileSync(fullPath, 'utf-8');
          }
        } catch (e: any) {
          console.error(`Failed to read conflicted file on disk: ${filepath}`, e);
          contentBefore = '<<<<<<< HEAD\n// Code changes on local commit\n=======\n// Code changes on incoming base base\n>>>>>>> incoming';
        }
        conflictedFiles.push({
          filepath,
          status: 'conflicted',
          conflictsCount: 1,
          contentBefore,
          contentAfter: '',
          isResolved: false
        });
      });
    }

    // 7. Inspect GH Cli
    const ghVersionRes = await runCmd('gh --version', activeRepoPath);
    const ghAvailable = ghVersionRes.code === 0;

    res.json({
      repoPath: activeRepoPath,
      isValid: true,
      currentBranch: currBranch,
      baseBranch: branches.find(b => b.isBase)?.name || 'main',
      isDirty,
      dirtyFiles,
      branches,
      commits,
      rebaseInProgress,
      mergeInProgress,
      conflicts: conflictedFiles,
      ghAvailable,
      ghErrorKey: ghAvailable ? '' : 'no_gh_err',
      commandHistory: ['git status', 'git branch', 'git log -n 20']
    });

  } catch (error: any) {
    console.error('Error reading git status:', error);
    res.status(500).json({ error: 'Failed to extract git properties', details: error.message });
  }
});

// Update selected repository path
app.post('/api/set-repo', (req, res) => {
  const { path: newPath } = req.body;
  if (!newPath) {
    return res.status(400).json({ error: 'Path argument is required' });
  }

  let resolved = newPath;
  if (newPath === '.') {
    resolved = process.cwd();
  }

  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    activeRepoPath = resolved;
    return res.json({ success: true, path: resolved, isGit: isGitFolder(resolved) });
  } else {
    return res.status(404).json({ error: 'Folder does not exist or is not a directory' });
  }
});

// Trigger Native Operating System Folder Picker Dialog
app.post('/api/select-dir', async (req, res) => {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows native directory dialog via PowerShell
    // Windows native directory dialog via PowerShell with STA threading to prevent MTA hangs
    const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -STA -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = 'Select your Git repository folder'; $f.ShowNewFolderButton = $true; if ($f.ShowDialog() -eq 'OK') { $f.SelectedPath } else { 'CANCELLED' }"`;
    try {
      const result = await runCmd(psCommand, process.cwd());
      const selectedPath = result.stdout.trim();
      if (selectedPath && selectedPath !== 'CANCELLED') {
        return res.json({ success: true, path: selectedPath, mode: 'native_win' });
      } else {
        return res.json({ success: false, cancelled: true });
      }
    } catch (err: any) {
      return res.json({ success: false, fallback: true, error: err.message });
    }
  } else if (platform === 'darwin') {
    // macOS native directory dialog via AppleScript
    const appleScript = `osascript -e 'Tell application "System Events" to activate' -e 'POSIX path of (choose folder with prompt "Select your Git repository folder:")'`;
    try {
      const result = await runCmd(appleScript, process.cwd());
      const selectedPath = result.stdout.trim();
      if (selectedPath) {
        return res.json({ success: true, path: selectedPath, mode: 'native_darwin' });
      } else {
        return res.json({ success: false, cancelled: true });
      }
    } catch (err: any) {
      return res.json({ success: false, fallback: true, error: err.message });
    }
  } else {
    // Other/Headless platforms (e.g. Linux container dev-environment) - demand UI fallback
    return res.json({ success: false, fallback: true, reason: 'Platform does not support native desktop picker dialogs.' });
  }
});

// API endpoint to retrieve directories at any local absolute path for custom web explorer fallback
app.post('/api/list-local-dirs', (req, res) => {
  let { currentPath } = req.body;
  
  if (!currentPath || currentPath === '.' || currentPath === '🤖 [Playground Giả lập]') {
    currentPath = activeRepoPath || process.cwd();
  }

  // Support user home dir short alias
  if (currentPath === '~') {
    currentPath = os.homedir();
  } else {
    currentPath = path.resolve(currentPath);
  }

  try {
    // If path is a file, trace its parent directory
    if (fs.existsSync(currentPath) && !fs.statSync(currentPath).isDirectory()) {
      currentPath = path.dirname(currentPath);
    }

    // Double check existence
    if (!fs.existsSync(currentPath)) {
      // Fallback to active repo or process cwd
      currentPath = activeRepoPath || process.cwd();
    }

    const parentPath = path.dirname(currentPath);
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    
    // Read subdirectories safely
    const subdirectories = files
      .filter(item => {
        try {
          return item.isDirectory() && !item.name.startsWith('.');
        } catch {
          return false;
        }
      })
      .map(item => {
        const fullDir = path.join(currentPath, item.name);
        return {
          name: item.name,
          path: fullDir,
          isGit: isGitFolder(fullDir)
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.json({
      success: true,
      currentPath,
      parentPath: parentPath !== currentPath ? parentPath : null,
      directories: subdirectories
    });
  } catch (error: any) {
    console.error('Error listing local dirs:', error);
    
    // In case of error (e.g. restricted permissions), offer activeRepoPath or system home as fallback
    const recoveryPath = os.homedir() || process.cwd();
    return res.status(500).json({ 
      success: false, 
      error: 'Cannot browse directory due to permission constraints or folder system limits.', 
      details: error.message,
      currentPath,
      recoveryPath
    });
  }
});

// Real HTTPS Git Repository Cloning API
app.post('/api/clone-repo', async (req, res) => {
  const { repoUrl, token } = req.body;
  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  // Create a safe directory name
  const safeName = repoUrl.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50) + '_' + Date.now().toString().substring(10);
  const targetDir = path.join('/tmp', 'rebase-overlord-repos', safeName);

  try {
    // Ensure parent workspace exists
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });

    // Format URL with token if provided
    let cloneUrl = repoUrl.trim();
    if (token) {
      const trimmedToken = token.trim();
      if (cloneUrl.startsWith('https://')) {
        cloneUrl = `https://${trimmedToken}@${cloneUrl.substring(8)}`;
      } else if (cloneUrl.startsWith('http://')) {
        cloneUrl = `http://${trimmedToken}@${cloneUrl.substring(7)}`;
      }
    }

    // Run shallow clone with depth 50 to keep it extremely fast
    const cmd = `git clone --depth 50 "${cloneUrl}" "${targetDir}"`;
    const cloneResult = await runCmd(cmd, process.cwd());

    if (cloneResult.code !== 0) {
      return res.status(500).json({ 
        error: 'Failed to clone repository. Make sure URL is correct and public, or provide a correct Access Token.', 
        details: cloneResult.stderr || cloneResult.stdout 
      });
    }

    // Successfully cloned! Let's configure it so user can execute commits / branches safely
    await runCmd('git config user.name "Rebase Overlord User"', targetDir);
    await runCmd('git config user.email "overlord@user.internal"', targetDir);

    activeRepoPath = targetDir;
    return res.json({ 
      success: true, 
      path: targetDir, 
      isGit: true 
    });

  } catch (error: any) {
    console.error('Error cloning repo:', error);
    return res.status(500).json({ error: 'Exception occurred during clone.', details: error.message });
  }
});

// Save resolved file and execute git add
app.post('/api/save-resolved-file', async (req, res) => {
  const { filepath, content } = req.body;
  if (!filepath) {
    return res.status(400).json({ error: 'filepath is required' });
  }

  if (!activeRepoPath) {
    return res.status(400).json({ error: 'Active repository path is not setup.' });
  }

  const fullPath = path.resolve(activeRepoPath, filepath);
  
  // Guard path traversal
  if (!fullPath.startsWith(activeRepoPath)) {
    return res.status(400).json({ error: 'Access denied: path is outside active checkout repository.' });
  }

  try {
    fs.writeFileSync(fullPath, content || '', 'utf-8');
    
    // Run git add
    const addResult = await runCmd(`git add "${filepath}"`, activeRepoPath);
    if (addResult.code !== 0) {
      return res.status(500).json({ error: 'Failed to index resolved file with git add', details: addResult.stderr });
    }

    return res.json({ success: true, path: filepath });
  } catch (err: any) {
    console.error('Error saving resolved file:', err);
    return res.status(500).json({ error: 'Failed to write file contents', details: err.message });
  }
});

// Retrieve Statistics
app.get('/api/stats', (req, res) => {
  res.json(loadStats());
});

// Update Statistics
app.post('/api/stats/increment', (req, res) => {
  const stats = loadStats();
  stats.rebase_count = (stats.rebase_count || 0) + 1;
  stats.last_run = new Date().toISOString().replace('T', ' ').substring(0, 19);
  saveStats(stats);
  res.json(stats);
});

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Explain/suggest git command using Gemini 3.5 Flash server-side API
app.post('/api/explain-git-command', async (req, res) => {
  const { command, tone } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command details are missing.' });
  }

  // Quick offline parsing / fallback mapping in case Gemini API is missing or fails
  const parts = command.trim().split(/\s+/);
  const isGit = parts[0]?.toLowerCase() === 'git';
  const subcmd = isGit && parts[1] ? parts[1].toLowerCase() : 'unknown';

  let offlineExplanation = "Lệnh Git tùy chỉnh.";
  let offlineDestructive = false;
  let offlineWarning = "";
  let offlineSuggestion = "Hãy cẩn trọng khi tự gõ các lệnh Git tùy chỉnh.";

  // Default fallback suggestions
  let offlineSuggestedCommands = ['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v'];

  // Smart spelling/misspelling corrections and keyword-aware defaults
  const lowerCmd = command.toLowerCase();
  
  if (lowerCmd.includes('stat')) {
    offlineSuggestedCommands = ['git status', 'git diff', 'git status -s'];
    offlineExplanation = "Xem trạng thái hiện tại của workspace (các file đã chỉnh sửa, thêm mới hoặc xóa).";
  } else if (lowerCmd.includes('log') || lowerCmd.includes('commit') || lowerCmd.includes('show')) {
    offlineSuggestedCommands = ['git log --oneline -n 5', 'git show HEAD', 'git status'];
    offlineExplanation = "Xem lịch sử commit hoặc thông tin chi tiết của một commit cụ thể.";
  } else if (lowerCmd.includes('check') || lowerCmd.includes('co') || lowerCmd.includes('switch')) {
    offlineSuggestedCommands = ['git checkout develop', 'git checkout main', 'git checkout -b feature/payment-v2'];
    offlineExplanation = "Chuyển nhanh sang nhánh khác hoặc hoàn tác các tập tin đã sửa đổi.";
  } else if (lowerCmd.includes('branch') || lowerCmd.includes('br')) {
    offlineSuggestedCommands = ['git branch -a', 'git branch -v', 'git checkout -b feature/new-branch'];
    offlineExplanation = "Quản lý nhánh (create, list, delete branch).";
  } else if (lowerCmd.includes('stash')) {
    offlineSuggestedCommands = ['git stash list', 'git stash pop', 'git stash apply'];
    offlineExplanation = "Giải pháp cất tạm thời các code đang sửa dở dang sang một hàng đợi tạm thời.";
  } else if (lowerCmd.includes('rebase')) {
    offlineSuggestedCommands = ['git rebase --continue', 'git rebase --abort', 'git rebase develop'];
    offlineExplanation = "Gộp/Đắp lại các commit trên ngọn cây lịch sử mới.";
  } else if (lowerCmd.includes('reset')) {
    offlineSuggestedCommands = ['git reset HEAD~1', 'git reset --hard HEAD', 'git restore .'];
    offlineExplanation = "Sử dụng cỗ máy thời gian quay ngược cấu hình hoặc hủy bỏ staging file.";
  } else if (lowerCmd.includes('push')) {
    offlineSuggestedCommands = ['git push origin HEAD', 'git push --force-with-lease', 'git remote -v'];
    offlineExplanation = "Đẩy các commit local hiện tại lên remote repository.";
  } else if (lowerCmd.includes('pull')) {
    offlineSuggestedCommands = ['git pull origin develop', 'git fetch origin', 'git pull --rebase origin main'];
    offlineExplanation = "Kéo các commit mới nhất trên server về kết hợp với nhánh của bạn.";
  } else if (lowerCmd.includes('add')) {
    offlineSuggestedCommands = ['git add .', 'git add -u', 'git status'];
    offlineExplanation = "Lưu tạm snapshot thay đổi vào Staging Area chuẩn bị cho việc tạo commit.";
  } else {
    // Detect spelling mistakes
    const tokens = command.trim().split(/\s+/);
    const cmdToken = tokens[1]?.toLowerCase() || '';
    if (cmdToken) {
      const commonCorrections: Record<string, string> = {
        'com': 'commit',
        'comm': 'commit',
        'comit': 'commit',
        'cok': 'checkout',
        'co': 'checkout',
        'chekout': 'checkout',
        'stat': 'status',
        'stats': 'status',
        'statsu': 'status',
        'br': 'branch',
        'branc': 'branch',
        'logg': 'log',
        'rest': 'reset',
        'reb': 'rebase',
        'rebas': 'rebase',
        'pus': 'push',
        'pul': 'pull',
        'fetc': 'fetch',
        'stsh': 'stash',
        'revr': 'revert',
        'merg': 'merge'
      };

      let bestCmdName = '';
      if (commonCorrections[cmdToken]) {
        bestCmdName = commonCorrections[cmdToken];
      } else {
        const candidates = ['status', 'log', 'branch', 'checkout', 'add', 'commit', 'push', 'pull', 'fetch', 'stash', 'reset', 'rebase', 'revert', 'diff', 'merge', 'init', 'clone'];
        const matched = candidates.find(candidate => {
          return candidate.startsWith(cmdToken.substring(0, 3)) || cmdToken.startsWith(candidate.substring(0, 3));
        });
        if (matched) bestCmdName = matched;
      }

      if (bestCmdName) {
        offlineSuggestedCommands = [
          `git ${bestCmdName}`,
          `git status`,
          `git log --oneline -n 5`
        ];
        offlineExplanation = `Có vẻ lệnh bạn vừa gõ là một lỗi chính tả hoặc viết tắt của "git ${bestCmdName}". Chúng tôi khuyến nghị bạn sửa lại thành: git ${bestCmdName}`;
        offlineSuggestion = `Hãy sửa lại cú pháp của bạn thành "git ${bestCmdName}" để đảm bảo Git hoạt động đúng ý đồ.`;
      }
    }
  }

  // Quick hazard detection list
  const dangerousCommands = ['clean', 'reset', 'revert', 'push', 'checkout', 'branch', 'rm'];
  const dangerousArgs = ['--hard', '--force', '-f', '-D', 'force-with-lease'];
  
  const hasDangerousArg = parts.some(arg => dangerousArgs.includes(arg.toLowerCase()));
  if (dangerousCommands.includes(subcmd) || hasDangerousArg) {
    offlineDestructive = true;
    offlineWarning = "Cảnh báo nguy hiểm: Lệnh này có thể ghi đè lịch sử commits hoặc xoá file chưa lưu!";
  }

  // If Gemini API is available, ask the Oracle!
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = getGeminiClient();
      
      // Determine System Instruction based on tone persona
      let systemInstruction = "Bạn là trợ lý ảo 'Rebase Overlord Engine' thông thái chuyên về Git. Hãy giải thích lệnh Git một cách ngắn gọn, súc tích (phạm vi 2-3 câu). Trả về JSON theo đúng định dạng được cấu hình.";
      
      if (tone === 'vn_pro') {
        systemInstruction = "Bạn là trợ lý ảo 'Rebase Overlord Engine' chuẩn mực, chuyên nghiệp và thông thái về Git. Hãy giải thích lệnh Git rành mạch, rực rỡ, dễ hiểu với thuật ngữ chuẩn hóa bằng tiếng Việt.";
      } else if (tone === 'vn_joke') {
        systemInstruction = "Bạn là con robot vui tính, tấu táo, vô cùng thân thiện về Git, gọi user là 'sếp' hoặc 'ní'. Hãy giải thích lệnh Git hóm hỉnh, khôi hài, dùng các thuật ngữ hài hước giới dev (như 'toang', 'gánh team', 'bay màu', 'gỡ tơ vò', 'hóng hớt', 'combat').";
      } else if (tone === 'vn_toxic') {
        systemInstruction = "Bạn là con AI chửi dạo, cực kỳ cọc cằn, châm biếm, cà khịa phong cách 'toxic boss'. Hãy gọi lập trình viên là 'thằng ngáo', 'lập trình viên rác', 'thầy dạy khói', 'thằng gà'. Hãy chửi và sỉ nhục thói quen code ẩu của họ, nhưng phần giải thích giải thuật Git vẫn phải cực kỳ chính xác để họ khôn ra. Viết bằng tiếng Việt hài hước cọc cằn.";
      } else if (tone === 'en_pro') {
        systemInstruction = "You are a professional, polite, educational, and intelligent Git assistant 'Rebase Overlord Engine'. Explain the Git command in English clearly, precisely, with standard developer terminology.";
      }

      const promptUser = `Hãy giải thích lệnh Git sau đây: "${command}". 
Lưu ý quan trọng: Lệnh này đang được thực hiện tại thư mục repo "${activeRepoPath}".

Nếu lệnh này có tính huỷ hoại cao hoặc nguy hiểm có thể xoá dữ liệu (như: git reset --hard, git push --force/--mirror, git clean, git branch -D, git checkout . đại diện, v.v.), hãy đặc biệt thiết lập isDestructive là true và điền một lời cảnh báo bằng tiếng chuông cảnh tỉnh sâu sắc vào warningMessage!

Ngoài ra, hãy phân tích câu lệnh của người dùng gõ. Nếu câu lệnh bị lỗi chính tả (ví dụ như "git statsu" thay vì "git status" hoặc "git checkoutt" thay vì "git checkout") hoặc thiếu tham số, hãy sửa đổi nó và đề xuất câu đúng vào danh sách 'suggestedCommands'. Trả về ít nhất 3-4 câu lệnh cụ thể, khả thi nhất làm gợi ý hành động tiếp theo.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptUser,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: {
                type: Type.STRING,
                description: "Tóm tắt ngắn gọn và trực quan nhất lệnh Git làm cái gì trong phạm vi 2-3 câu."
              },
              isDestructive: {
                type: Type.BOOLEAN,
                description: "Có phải một lệnh Git nguy hiểm có tính huỷ hoại (ví dụ xoá thay đổi chưa commit, force push, xoá nhánh thô bạo) không?"
              },
              warningMessage: {
                type: Type.STRING,
                description: "Lời cảnh báo bảo hiểm hoặc thông tin rủi ro nếu có, để trống nếu hoàn toàn an toàn."
              },
              suggestion: {
                type: Type.STRING,
                description: "Đưa ra mẹo hoặc câu lệnh thay thế an toàn hơn hoặc bước nên làm tiếp theo."
              },
              suggestedCommands: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Danh sách 3-5 câu lệnh Git chuẩn xác tiếp theo phù hợp nhất cho người dùng (ví dụ: ['git status', 'git checkout main']) hoặc sửa lại lỗi cú pháp nếu câu gõ ban đầu bị lỗi chính tả."
              }
            },
            required: ["explanation", "isDestructive", "warningMessage", "suggestion", "suggestedCommands"]
          }
        }
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const geminiResult = JSON.parse(responseText);
        return res.json(geminiResult);
      } catch (parseErr) {
        console.error("Failed to parse Gemini JSON output structure:", responseText, parseErr);
      }
    } catch (geminiErr: any) {
      console.error("Gemini API call incurred an exception:", geminiErr);
    }
  }

  // Send fallback if Gemini isn't present or crashed
  return res.json({
    explanation: offlineExplanation,
    isDestructive: offlineDestructive,
    warningMessage: offlineWarning || (offlineDestructive ? "Cẩn thận! Lệnh này có thể làm mất các biến đổi chưa lưu." : ""),
    suggestion: offlineSuggestion,
    suggestedCommands: offlineSuggestedCommands
  });
});

// Explain any Git problem/roadblock using Gemini 3.5 Flash
app.post('/api/explain-git-problem', async (req, res) => {
  const { problemType, tone, details } = req.body;
  if (!problemType) {
    return res.status(400).json({ error: 'Problem type is missing.' });
  }

  // Pre-configured offline fallback contents matching selected humor tone and problemType
  const localFallbacks: Record<string, Record<string, string>> = {
    dirty_working_tree: {
      vn_pro: "Hệ thống phát hiện thư mục làm việc của bạn có các tệp tin chưa được commit hoặc lưu. Quy trình Git Rebase bắt buộc khu vực làm việc phải hoàn toàn sạch sẽ để tránh nguy cơ xung đột đè hoặc làm hỏng dữ liệu cục bộ.",
      vn_joke: "Sếp ơi, nhà bao việc mà sếp lôi bài ra chưa dọn đã vội đòi rebase! Có một vài tệp tin đang sửa dở bay nhảy tung tăng chưa lưu kìa. Sếp cất nhanh vào kho (git stash) hoặc gõ nhanh commit rồi rảnh nợ đi tiếp nha ní yêu!",
      vn_toxic: "Ơ cái thằng ngáo này! Nhìn đống rác chưa chịu commit của mày kìa, thế mà cũng đòi cắm đầu rebase à? Tí nữa Git nó nuốt chửng mất công sức rồi lại gào thét khóc lóc đổ lỗi cho cuộc đời nhé! Quẳng mẹ nó vào git stash ngay đi thằng gà!",
      en_pro: "The working directory displays uncommitted changes. Git interactive rebase requires a clean status in order to prevent accidental code overrides."
    },
    diverged_branch: {
      vn_pro: "Nhánh làm việc của bạn đã bị lệch pha (diverged) so với nhánh tương ứng trên Remote (GitHub/GitLab). Cả local và remote đều xuất hiện các commit mới độc lập.",
      vn_joke: "Ní ơi, hai bên đang lệch pha trầm trọng rồi! Local thì nặn ra commit mới, mà remote cũng có người vừa đẩy commit lên. Hai đầu không ai nhường ai, lệch nhau như múi giờ yêu xa vậy đó! Hãy dùng 'git pull --rebase origin' hoặc lực điền force-push nếu cực kỳ bản lĩnh nha sếp!",
      vn_toxic: "Đấy! Lại cái thói quen lười biếng không chịu fetch sync trước khi múa phím chứ gì nữa? Nhánh của mày lệch pha (diverged) mút chỉ với remote rồi kia kìa! Thằng trên server thì đẩy code mới, mày thì cắm đầu cày local. Giờ húc nhau rồi thì lo mà gộp bằng pull --rebase đi rồi gỡ tơ vò nhá thằng ngáo!",
      en_pro: "Your local branch has diverged from its remote tracker. Both branches contain unique, conflicting commits. Please perform a pull with rebase to align histories, or force push safely."
    },
    detached_head: {
      vn_pro: "Hệ thống cảnh báo trạng thái rời neo (Detached HEAD). Bạn đang đứng tạm thời ở một commit độc lập chứ không thuộc về bất kỳ nhánh chính thức nào. Mọi thay đổi viết ở đây có nguy cơ bị dọn dẹp mất dấu khi chuyển nhánh.",
      vn_joke: "Toang rồi sếp! Sếp đang rơi vào trạng thái 'hồn bay phách tán' (detached HEAD), trôi nổi tự do vô định giữa thiên hà Git! Hãy neo mình lại ngay bằng cách tạo một nhánh cứu hộ để giữ lấy đống code quý giá này nha!",
      vn_toxic: "Đúng là đồ thiếu muối! Mày đứng ở cái commit trần trụồng nào thế kia? Vấp phải đá detached HEAD rồi, không thuộc cái nhánh cụ thể nào hết ghen. Viết code tiếp ở đây rồi tối chuyển nhánh một phát là bay màu sạch sẽ, tha hồ khóc ré nhé con trai!",
      en_pro: "The repository has entered a detached HEAD state. You are viewing references independently without active branch tracks. Please check out a real branch or configure recovery branches to save your code."
    },
    stale_base_branch: {
      vn_pro: "Khuyến nghị cập nhật: Nhánh tham chiếu (Base branch) chưa đồng bộ các thay đổi mới từ máy chủ (stale reference). Việc cố tình rebase sẽ gây hàng loạt xung đột giả (virtual conflicts) không đáng có.",
      vn_joke: "Níu chân sếp lại: Nhánh gốc mốc meo rồi sếp ơi! Base branch trên server chạy trước rồi. Hãy kéo gió mát lành (git fetch origin) về bồi bổ rồi hãy mộng rebase cho giòn giã ghen ní!",
      vn_toxic: "Thầy dạy khói à! Lấy cái nhánh base từ đời tống để làm bia rebase hả thằng ngáo? Nhánh base trên server nó update mười vạn dặm rồi kia kìa. Lo mà fetch cập nhật đi rồi hãy gáy nhé!",
      en_pro: "Your historical base branch config is out-of-date compared to origin remote. Performing rebase now may invoke redundant conflicts. Recommend fetching first."
    }
  };

  const selectedTone = tone || 'vn_pro';
  const matchedToneObj = localFallbacks[problemType] || localFallbacks['dirty_working_tree'];
  const offlineResult = matchedToneObj[selectedTone] || matchedToneObj['vn_pro'] || matchedToneObj['en_pro'];

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = getGeminiClient();
      
      let systemInstruction = "Bạn là chuyên gia chẩn bệnh và cứu hộ Git (Git Diagnostic Doctor). Trả về JSON chứa 'explanation' (giải thích tại sao lỗi này xảy ra) và 'mitigation' (hướng dẫn cụ thể từng bước, gợi ý lệnh để sửa nhanh).";
      
      if (tone === 'vn_pro') {
        systemInstruction = "Bạn là Bác sĩ Git ảo 'Rebase Overlord Engine' vô cùng chuẩn mực, chuyên nghiệp và lịch sự. Hãy bắt bệnh và giải thích lỗi Git một cách gãy gọn, rành mạch bằng tiếng Việt kèm theo từng bước sơ cứu cực kỳ khoa lý.";
      } else if (tone === 'vn_joke') {
        systemInstruction = "Bạn là Bác sĩ Git tinh nghịch chuyên tấu hài, gọi user là 'sếp' hoặc 'ní'. Hãy chẩn trị lỗi Git bằng giọng văn hóm hỉnh cực vui tính, dùng các biệt hiệu giới dev (toang, bay màu, combat, cứu bồ, dọn rác, cúng cụ) để sếp bớt trầm cảm khi gỡ lỗi nhé.";
      } else if (tone === 'vn_toxic') {
        systemInstruction = "Bạn là Bác sĩ Git chửi dạo 'toxic' cộc lốc cà khịa trình độ dev non trẻ của user. Hãy gọi lập trình viên là 'thằng ngáo', 'thầy dạy khói', 'gà mờ', 'đồ ăn bớt'. Hãy sỉ nhục cái thói quen viết code ẩu dẫn đến lỗi Git hiện tại, nhưng bước sơ cứu (mitigation) và các lệnh khuyên dùng vẫn phải chuẩn xác 100% để nắn gân họ khôn ra. Viết bằng tiếng Việt hài hước cọc cằn.";
      } else if (tone === 'en_pro') {
        systemInstruction = "You are a professional, polite, and educational Git doctor. Diagnose the Git failure in English clearly and concisely. Outline straightforward, tactical mitigation steps for the developer.";
      }

      const promptUser = `Hãy chẩn đoán lỗi Git loại sau đây: "${problemType}".
Chi tiết đi kèm: ${JSON.stringify(details || {})}.

Bạn cần:
1. Giải thích lý do lỗi/bất thường này xảy ra trong Git (explanation).
2. Đưa ra hướng xử lý / giảm thiểu rủi ro (mitigation) rành mạch chi tiết cùng các câu lệnh Git tương ứng.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptUser,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: {
                type: Type.STRING,
                description: "Phân tích, bắt bệnh tại sao tình trạng này xảy ra (bản tiếng Việt/Anh tuỳ tone)."
              },
              mitigation: {
                type: Type.STRING,
                description: "Hướng dẫn sơ cứu khẩn cấp, từng bước chạy lệnh cụ thể dứt điểm tình trạng lỗi lỗi."
              }
            },
            required: ["explanation", "mitigation"]
          }
        }
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const geminiResult = JSON.parse(responseText);
        if (geminiResult.explanation && geminiResult.mitigation) {
          return res.json(geminiResult);
        }
      } catch (parseErr) {
        console.error("Failed to parse AI resolve JSON output:", responseText, parseErr);
      }
    } catch (geminiErr: any) {
      console.error("Gemini API call for doctor diagnostic failed:", geminiErr);
    }
  }

  // Fallback response with beautiful markdown content
  const fallbackMitigations: Record<string, string> = {
    dirty_working_tree: "🔧 **Hướng xử lý khẩn cấp:**\n1. Chạy lệnh `git stash` để cất tạm thời các file chỉnh sửa dở dang vào tủ chứa đồ tạm thời.\n2. Tiến hành Rebase nhịp nhàng bình thường.\n3. Sau khi Rebase hoàn tất tốt đẹp, chạy `git stash pop` để lấy lại code cũ sửa tiếp.",
    diverged_branch: "🔧 **Hướng xử lý khẩn cấp:**\n1. An toàn nhất: Chạy `git pull --rebase origin <nhánh>` để gộp commits mới từ server dưới chân các commit local của bạn.\n2. Liều lĩnh: Nếu local của bạn là chuẩn nhất và muốn ghi đè remote, hãy chạy `git push --force-with-lease` để đồng bộ lịch sử sạch lên nhánh remote.",
    detached_head: "🔧 **Hướng xử lý khẩn cấp:**\n1. Hãy lưu tạm lịch sử bốc hơi này bằng cách tạo một nhánh cứu nạn: `git checkout -b <tên-nhánh-cứu-hộ>`\n2. Chuyển về nhánh an toàn chính thức (develop/main) rồi merge/rebase tùy ý.",
    stale_base_branch: "🔧 **Hướng xử lý khẩn cấp:**\n1. Chạy lệnh `git fetch origin` để kéo các bản cập nhật mới nhất từ máy chủ.\n2. Đồng bộ nhánh base của bạn: `git checkout develop && git pull origin develop`\n3. Trở lại nhánh tính năng của bạn và chạy Rebase để gộp lịch sử đồng nhất."
  };

  return res.json({
    explanation: offlineResult,
    mitigation: fallbackMitigations[problemType] || "Hãy kiểm tra trạng thái Git cục bộ bằng lệnh `git status`."
  });
});

// AI-powered conflict resolution and explanation using Gemini 3.5 Flash
app.post('/api/resolve-conflict-ai', async (req, res) => {
  const { filepath, content, tone } = req.body;
  if (!filepath || !content) {
    return res.status(400).json({ error: 'Filepath or content is missing.' });
  }

  // Define offline fallback
  const offlineResult = (() => {
    const lines = content.split('\n');
    const resultLines: string[] = [];
    let inConflict = false;
    let inTheirs = false;
    for (const line of lines) {
      if (line.startsWith('<<<<<<<')) {
        inConflict = true;
      } else if (line.startsWith('=======')) {
        inTheirs = true;
      } else if (line.startsWith('>>>>>>>')) {
        inConflict = false;
        inTheirs = false;
      } else {
        if (inConflict) {
          if (!inTheirs) {
            resultLines.push(line); // Keep ours
          }
        } else {
          resultLines.push(line);
        }
      }
    }
    const resolved = resultLines.join('\n');
    
    let explanation = `[OFFLINE FALLBACK] Không có GEMINI_API_KEY. Đã tự động giữ lại phiên bản của bạn (OURS) để giải quyết xung đột cho tập tin ${path.basename(filepath)}.`;
    if (tone === 'vn_joke') {
      explanation = `[OFFLINE] Đại ca ơi, không thấy khóa GEMINI_API_KEY đâu cả rồi! Nên em cứu hộ bằng cách giữ bản của sếp (OURS) cho an toàn nhé!`;
    } else if (tone === 'vn_toxic') {
      explanation = `[OFFLINE ERR] Thiếu GEMINI_API_KEY kìa đồ ngáo! Không có AI cứu thì tao cứ dứt bản của mày (OURS) quất vào cho lẹ nhé!`;
    } else if (tone === 'en_pro') {
      explanation = `[OFFLINE FALLBACK] GEMINI_API_KEY is not defined. Automatically falling back to local changes (OURS) for ${path.basename(filepath)}.`;
    }
    return { explanation, resolvedContent: resolved };
  })();

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = getGeminiClient();
      
      let systemInstruction = "Bạn là chuyên gia Git thông thái dọn dẹp và giải quyết xung đột mã nguồn (merge conflict solver). Trả về JSON chứa explanation (giải thích tại sao conflict xảy ra) và resolvedContent (mã nguồn đã gộp sạch sẽ).";
      
      if (tone === 'vn_pro') {
        systemInstruction = "Bạn là trợ lý ảo 'Rebase Overlord Engine' chuẩn mực, chuyên nghiệp và thông thái về Git. Giải thích xung đột rành mạch, dễ hiểu bằng tiếng Việt chuẩn hóa, rồi trả về mã nguồn hợp nhất (resolvedContent) đã giải quyết xung đột hoàn hảo.";
      } else if (tone === 'vn_joke') {
        systemInstruction = "Bạn là robot tấu hài vui tính chuyên gỡ bom xung đột. Gọi user là 'sếp' hoặc 'ní'. Giải thích xung đột hài hước bằng từ ngữ giới dev tiếng Việt (toang, combat, bay màu, chia tài sản), rồi trả về mã nguồn hợp nhất (resolvedContent) sạch đẹp không còn marker.";
      } else if (tone === 'vn_toxic') {
        systemInstruction = "Bạn là AI chửi dạo 'toxic' cộc lốc cà khịa thói quen code ẩu của lập trình viên. Gọi họ là 'thằng ngáo', 'thầy dạy khói', 'gà'. Sỉ nhục họ mút chỉ vì viết code đè nhau gây conflict, nhưng phần giải quyết mã nguồn (resolvedContent) vẫn phải hợp nhất cực kỳ chính xác.";
      } else if (tone === 'en_pro') {
        systemInstruction = "You are a professional, polite, educational Git conflict resolution expert. Explain the conflict in English clearly and concisely, and return the perfectly merged code in resolvedContent with all conflict markers removed.";
      }

      const promptUser = `Hãy giải quyết xung đột (merge conflicts) trong file sau đây: "${filepath}".
Nội dung file hiện tại đang chứa các marker xung đột Git chuẩn:
\`\`\`
${content}
\`\`\`

Bạn cần:
1. Phân tích đoạn xung đột nằm giữa \`<<<<<<< HEAD\` và \`>>>>>>> incoming\`. Giải thích tại sao xung đột xảy ra (bên nào thay đổi cái gì, mục đích của từng bên).
2. Viết mã nguồn hợp nhất (resolvedContent). Mã nguồn này PHẢI logic, chính xác, kết hợp thông minh cả hai thay đổi nếu chúng bổ trợ cho nhau, hoặc chọn cái tối ưu nhất. Tuyệt đối không để sót bất kỳ marker xung đột \`<<<<<<<\`, \`=======\`, \`>>>>>>>\` nào bên trong resolvedContent!`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptUser,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: {
                type: Type.STRING,
                description: "Giải thích chi tiết trực quan lý do xung đột xảy ra và hướng sửa chữa."
              },
              resolvedContent: {
                type: Type.STRING,
                description: "Toàn bộ nội dung tập tin sau khi đã hợp nhất sạch sẽ không còn bất cứ vết tích marker xung đột nào."
              }
            },
            required: ["explanation", "resolvedContent"]
          }
        }
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const geminiResult = JSON.parse(responseText);
        if (geminiResult.explanation && geminiResult.resolvedContent) {
          return res.json(geminiResult);
        }
      } catch (parseErr) {
        console.error("Failed to parse AI resolve JSON output:", responseText, parseErr);
      }
    } catch (geminiErr: any) {
      console.error("Gemini API call for resolve conflict failed:", geminiErr);
    }
  }

  return res.json(offlineResult);
});

// Execute custom git CLI commands (read only/safe simulator elements)
app.post('/api/execute-command', async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command details is missing.' });
  }

  // Prevent hazardous injections or formatting
  const upperCmd = command.toUpperCase();
  if (upperCmd.includes('RM ') || upperCmd.includes('DEL ') || upperCmd.includes(':(')) {
    return res.status(400).json({ error: 'Forbidden command signature detected.' });
  }

  try {
    const result = await runCmd(command, activeRepoPath);
    res.json({
      code: result.code,
      stdout: result.stdout,
      stderr: result.stderr
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mounting Vite dev client
const startServer = async () => {
  console.log('[SERVER] startServer() entered');
  console.log('[SERVER] NODE_ENV=', process.env.NODE_ENV);

  if (process.env.NODE_ENV !== 'production') {
    const viteModule = await import('vite');
    const createViteServer = viteModule.createServer;
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Determine the production distribution path based on runtime context (bundled CJS vs ESM)
    let distPath = '';
    if (typeof __dirname !== 'undefined') {
      distPath = __dirname;
    } else {
      const __filename = fileURLToPath(import.meta.url);
      distPath = path.dirname(__filename);
    }
    
    console.log('distPath=', distPath);

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  console.log('[SERVER] About to listen on', PORT);
  app.listen(PORT, '0.0.0.0', () => {
    console.log('[SERVER] Listening on', PORT);
    console.log(`[Rebase Overlord Backend Server Started on port ${PORT}]`);
  });
};

startServer();
