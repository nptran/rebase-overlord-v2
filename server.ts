/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { createServer as createViteServer } from 'vite';
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
    const cmdToken = tokens[1] || '';
    if (cmdToken) {
      const candidates = ['status', 'log', 'branch', 'checkout', 'add', 'commit', 'push', 'pull', 'fetch', 'stash', 'reset', 'rebase'];
      const matched = candidates.find(candidate => {
        return candidate.startsWith(cmdToken.substring(0, 3)) || cmdToken.startsWith(candidate.substring(0, 3));
      });
      if (matched) {
        offlineSuggestedCommands = [
          `git ${matched}`,
          `git status`,
          `git log --oneline -n 5`
        ];
        offlineExplanation = `Có vẻ lệnh bạn vừa gõ là một lỗi chính tả của "git ${matched}". Chúng tôi khuyến nghị bạn sửa lại thành: git ${matched}`;
        offlineSuggestion = `Hãy thử click vào nút gợi ý gợi nhớ "git ${matched}" bên dưới để sửa lỗi lập tức.`;
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
  console.log('NODE_ENV=', process.env.NODE_ENV);

  if (process.env.NODE_ENV !== 'production') {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Rebase Overlord Backend Server Started on port ${PORT}]`);
  });
};

startServer();
