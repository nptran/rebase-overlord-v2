/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Terminal, Trash2, Copy, Check, EyeOff, Eye, 
  Sparkles, Brain, AlertTriangle, Play, X, Info 
} from 'lucide-react';

interface TerminalPanelProps {
  logs: string[];
  showLogPanel: boolean;
  onToggleLogPanel: () => void;
  onClearLogs: () => void;
  tone: string;
  isSimulation: boolean;
  onCommandExecuted: () => void;
  addLog: (line: string) => void;
  resolveApiUrl: (path: string) => string;
}

export default function TerminalPanel({
  logs,
  showLogPanel,
  onToggleLogPanel,
  onClearLogs,
  tone,
  isSimulation,
  onCommandExecuted,
  addLog,
  resolveApiUrl
}: TerminalPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Custom Git Command prompt states
  const [commandInput, setCommandInput] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [executing, setExecuting] = React.useState(false);
  const [inlineError, setInlineError] = React.useState<string | null>(null);
  const [explanation, setExplanation] = React.useState<{
    explanation: string;
    isDestructive: boolean;
    warningMessage: string;
    suggestion: string;
    suggestedCommands?: string[];
  } | null>(null);

  // Dynamic Suggestion Chips state
  const [suggestedChips, setSuggestedChips] = React.useState<string[]>([
    'git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v'
  ]);
  const [chipsSource, setChipsSource] = React.useState<'default' | 'ai'>('default');

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    if (!cleanCmd.toLowerCase().startsWith('git')) {
      setInlineError('Chỉ hỗ trợ phân tích và chạy các câu lệnh Git bắt đầu bằng từ khóa "git"!');
      return;
    }

    setChecking(true);
    setExplanation(null);

    try {
      const explainUrl = resolveApiUrl('/api/explain-git-command');
      const res = await fetch(explainUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cleanCmd, tone })
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation(data);
        if (data.suggestedCommands && Array.isArray(data.suggestedCommands) && data.suggestedCommands.length > 0) {
          setSuggestedChips(data.suggestedCommands);
          setChipsSource('ai');
          addLog(`💡 Đã cập nhật ${data.suggestedCommands.length} gợi ý lệnh Git phù hợp cho: "${cleanCmd}"`);
        }
      } else {
        const errData = await res.json();
        setInlineError(`Không thể phân tích: ${errData.error || 'Lỗi không xác định'}`);
      }
    } catch (err: any) {
      setInlineError(`Lỗi kết nối phân tích: ${err.message}`);
    } finally {
      setChecking(false);
    }
  };

  const handleCancel = () => {
    setExplanation(null);
    // Reset to default suggestion chips
    setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
    setChipsSource('default');
  };

  const handleExecuteVerifiedCommand = async () => {
    setInlineError(null);
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    setExecuting(true);
    setExplanation(null);

    // Prevent hazardous simple OS injections
    const upperCmd = cleanCmd.toUpperCase();
    if (upperCmd.includes('RM ') || upperCmd.includes('DEL ') || upperCmd.includes(':(')) {
      addLog(`! Lỗi thực thi: Phát hiện lệnh nhạy cảm có ý đồ phá hoại hệ thống.`);
      setExecuting(false);
      return;
    }

    addLog(`$ ${cleanCmd}`);

    if (isSimulation) {
      // Simulate Git command behavior
      setTimeout(() => {
        addLog(`// [Playground Giả lập] Đang thực thi: ${cleanCmd}`);
        const parts = cleanCmd.toLowerCase().split(/\s+/);
        const subcmd = parts[1];

        if (subcmd === 'status') {
          addLog(`On branch feature/payment-v2`);
          addLog(`Your branch is up to date with 'origin/feature/payment-v2'.`);
          addLog(`Changes not staged for commit:`);
          addLog(`  (use "git add <file>..." to update what will be committed)`);
          addLog(`        modified:   src/routes/payment.ts`);
          addLog(`        modified:   src/services/stripe.ts`);
          addLog(`no changes added to commit (use "git add" and/or "git commit -a")`);
        } else if (subcmd === 'log') {
          addLog(`commit f941a3c78d (HEAD -> feature/payment-v2)`);
          addLog(`Author: Alex Nguyen <alex@overlord.internal>`);
          addLog(`Date:   5 mins ago`);
          addLog(`    feat: add payment intent and webhook handles`);
          addLog(``);
          addLog(`commit a82bc4e12c`);
          addLog(`Author: Alex Nguyen <alex@overlord.internal>`);
          addLog(`Date:   1 hour ago`);
          addLog(`    fix: resolving null checkout responses`);
        } else if (subcmd === 'branch') {
          addLog(`  develop`);
          addLog(`  main`);
          addLog(`* feature/payment-v2`);
          addLog(`  feature/auth-oauth`);
          addLog(`  bugfix/typo-header`);
        } else if (subcmd === 'checkout') {
          const bName = parts[2] || 'main';
          addLog(`Switched to branch '${bName}'`);
        } else {
          addLog(`✓ Lệnh simulated "${cleanCmd}" đã thực hiện thành công trên Playground.`);
        }
        setExecuting(false);
        setCommandInput('');
        onCommandExecuted();
      }, 800);
    } else {
      try {
        const execUrl = resolveApiUrl('/api/execute-command');
        const res = await fetch(execUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cleanCmd })
        });
        const data = await res.json();
        
        if (data.stdout && data.stdout.trim()) {
          const lines = data.stdout.split('\n');
          lines.forEach((l: string) => addLog(l));
        }
        if (data.stderr && data.stderr.trim()) {
          const lines = data.stderr.split('\n');
          lines.forEach((l: string) => addLog(`! ${l}`));
        }
        
        if (data.code !== 0) {
          addLog(`❌ Lệnh hoàn thành với mã trả về ${data.code}`);
        } else {
          addLog(`✓ Thực thi lệnh thành công!`);
        }

        setExecuting(false);
        setCommandInput('');
        onCommandExecuted();
      } catch (err: any) {
        addLog(`❌ Thất bại khi thực thi luồng lệnh hệ thống: ${err.message}`);
        setExecuting(false);
      }
    }
  };

  if (!showLogPanel) {
    return (
      <div id="terminal-collapsed-panel" className="bg-[#020617] border border-slate-900 rounded-xl p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>Thông báo bảng lệnh đang tạm ẩn</span>
        </div>
        <button
          onClick={onToggleLogPanel}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" /> Hiển thị gõ lệnh & Logs
        </button>
      </div>
    );
  }

  return (
    <div id="terminal-panel-container" className="bg-[#020617] border border-slate-900 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-[#0b0f19] border-b border-slate-900 px-4 py-2.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono tracking-wide ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            CONSOLE SHELL & INTERACTIVE GIT PROMPT
          </span>
        </div>

        {/* Console control options */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={onClearLogs}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={onToggleLogPanel}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Hide logs"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide</span>
          </button>
        </div>
      </div>

      {/* Console lines screen */}
      <div ref={containerRef} className="p-4 overflow-y-auto h-52 max-h-52 font-mono text-xs leading-relaxed text-slate-300 select-text flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-[11px] p-2 flex flex-col gap-1">
            <span>// Chưa có bản ghi lệnh nào trong phiên làm việc.</span>
            <span>// Bạn có thể tự gõ lệnh Git của mình hoặc bấm vào các nút điều hướng để bắt đầu.</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const isCommand = log.trim().startsWith('$') || log.trim().startsWith('git');
            const isError = log.includes('error') || log.includes('ERR:') || log.includes('Failed') || log.startsWith('! ') || log.includes('LỖI') || log.includes('❌');
            const isSuccess = log.includes('success') || log.includes('Done') || log.includes('Đã xác nhận') || log.includes('Hoàn tất') || log.includes('thành công') || log.startsWith('✓');
            const isComment = log.trim().startsWith('//') || log.trim().startsWith('#');
            
            let colorClass = 'text-slate-300';
            if (isCommand) {
              colorClass = 'text-sky-400 font-semibold';
            } else if (isError) {
              colorClass = 'text-rose-400 font-medium bg-rose-500/5 px-1 rounded border border-rose-500/10';
            } else if (isSuccess) {
              colorClass = 'text-emerald-400 font-medium';
            } else if (isComment) {
              colorClass = 'text-slate-500 italic';
            }

            return (
              <div 
                key={index} 
                className={`py-0.5 border-l-2 pl-2 transition-all shrink-0 hover:bg-slate-950 ${colorClass} ${
                  isCommand ? 'border-sky-500/50' : isError ? 'border-rose-500/50' : isSuccess ? 'border-emerald-500/50' : 'border-transparent'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Command Prompt Section */}
      <div className="border-t border-slate-900 bg-[#070b14] p-3 shrink-0">
        {/* Inline validation errors */}
        {inlineError && (
          <div className="mb-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] px-3 py-1.5 rounded-lg flex justify-between items-center font-sans animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              {inlineError}
            </span>
            <button onClick={() => setInlineError(null)} className="text-rose-400 hover:text-rose-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Popular command suggestion chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5 items-center">
          <span className="text-[10px] text-slate-500 font-mono self-center mr-1 select-none flex items-center gap-1">
            {chipsSource === 'ai' ? (
              <>
                <Sparkles className="w-3 h-3 text-pink-400 animate-pulse animate-bounce" />
                <span className="text-pink-400 font-bold">Gợi ý sửa lỗi / phù hợp:</span>
              </>
            ) : (
              <span>Gợi ý gõ nhanh:</span>
            )}
          </span>
          {suggestedChips.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setCommandInput(cmd);
                setInlineError(null);
              }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer border ${
                chipsSource === 'ai'
                  ? 'bg-pink-950/20 text-pink-300 border-pink-700/40 hover:bg-pink-900/40 hover:text-white hover:scale-105'
                  : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:bg-indigo-950/40 hover:text-indigo-300'
              }`}
            >
              {cmd}
            </button>
          ))}
          {chipsSource === 'ai' && (
            <button
              type="button"
              onClick={() => {
                setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
                setChipsSource('default');
              }}
              className="text-[9px] text-slate-500 hover:text-slate-300 underline font-mono ml-auto cursor-pointer"
            >
              Khôi phục mặc định
            </button>
          )}
        </div>

        <form onSubmit={handleAnalyzeCommand} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 font-mono text-sm pointer-events-none select-none">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => {
                setCommandInput(e.target.value);
                if (inlineError) setInlineError(null);
              }}
              placeholder="Gõ lệnh Git bất kỳ (ví dụ: git checkout develop, git restore file)..."
              className="w-full bg-[#02050c] text-sky-400 font-mono placeholder-slate-650 border border-slate-800 rounded-lg py-2 pl-7 pr-3 text-xs outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={checking || executing || !commandInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-sans shrink-0 border border-indigo-500/35"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{checking ? 'Đang phân tích...' : 'Giải thích & Gợi ý'}</span>
          </button>
        </form>

        {/* Explanation Display Panel */}
        {explanation && (
          <div className="mt-3 bg-slate-950/90 border border-slate-850 rounded-lg p-3.5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans tracking-wide">
                <Brain className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>PHÂN TÍCH LỆNH GIT BẰNG GEMINI AI</span>
              </h4>
              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-500 hover:text-slate-350 p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3 pr-2 whitespace-pre-line bg-indigo-950/10 p-2.5 rounded border border-indigo-900/10">
              {explanation.explanation}
            </p>

            {explanation.isDestructive && (
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 my-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Lệnh Nguy Hiểm!</h5>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed font-sans">
                    {explanation.warningMessage || "Cảnh báo: Lệnh này có thể ghi đè lịch sử commits hoặc xoá code chưa staged."}
                  </p>
                </div>
              </div>
            )}

            {explanation.suggestion && (
              <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-3 mb-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Gợi ý / Giải pháp tốt hơn</h5>
                  <p className="text-[11px] text-emerald-300/90 leading-relaxed font-sans">
                    {explanation.suggestion}
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation triggers */}
            <div className="flex gap-2 justify-end mt-3 border-t border-slate-900/80 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 font-sans text-[11px] px-3.5 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteVerifiedCommand}
                disabled={executing}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-sans text-[11px] px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium shadow-md shadow-emerald-900/10"
              >
                <Play className="w-3 h-3 text-emerald-250 animate-pulse" />
                <span>{executing ? 'Đang chạy lệnh...' : 'Xác nhận Chạy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Console status footer */}
      <div className="bg-[#080d1a] border-t border-slate-900 px-4 py-1.5 text-[10px] text-slate-500 font-mono flex justify-between items-center shrink-0">
        <span>SESSION SHELL SIMULATOR</span>
        <span className="text-emerald-500 animate-pulse flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          ONLINE PORT: 3000
        </span>
      </div>
    </div>
  );
}
