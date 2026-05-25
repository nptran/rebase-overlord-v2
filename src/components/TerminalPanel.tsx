/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Trash2, Copy, Check, EyeOff, Eye } from 'lucide-react';

interface TerminalPanelProps {
  logs: string[];
  showLogPanel: boolean;
  onToggleLogPanel: () => void;
  onClearLogs: () => void;
}

export default function TerminalPanel({
  logs,
  showLogPanel,
  onToggleLogPanel,
  onClearLogs
}: TerminalPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  if (!showLogPanel) {
    return (
      <div id="terminal-collapsed-panel" className="bg-[#020617] border border-slate-900 rounded-xl p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>Console Logs are hidden</span>
        </div>
        <button
          onClick={onToggleLogPanel}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded"
        >
          <Eye className="w-3.5 h-3.5" /> Show Logs
        </button>
      </div>
    );
  }

  return (
    <div id="terminal-panel-container" className="bg-[#020617] border border-slate-900 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-[#0b0f19] border-b border-slate-900 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono tracking-wide ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            COMMAND LOG CONSOLE
          </span>
        </div>

        {/* Console control options */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={onClearLogs}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={onToggleLogPanel}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono"
            title="Hide logs"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide</span>
          </button>
        </div>
      </div>

      {/* Console lines screen */}
      <div ref={containerRef} className="p-4 overflow-y-auto h-60 max-h-60 font-mono text-xs leading-relaxed text-slate-300 select-text flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-[11px] p-2 flex flex-col gap-1">
            <span>// No terminal logs recorded yet.</span>
            <span>// Run a Git Feature Flow step or check branches to inspect command traces here.</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const isCommand = log.trim().startsWith('$') || log.trim().startsWith('git');
            const isError = log.includes('error') || log.includes('ERR:') || log.includes('Failed') || log.startsWith('! ') || log.includes('LỖI');
            const isSuccess = log.includes('success') || log.includes('Done') || log.includes('Đã xác nhận') || log.includes('Hoàn tất') || log.includes('thành công');
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

      {/* Console status footer */}
      <div className="bg-[#080d1a] border-t border-slate-900 px-4 py-1.5 text-[10px] text-slate-500 font-mono flex justify-between items-center">
        <span>SESSION SHELL SIMULATOR</span>
        <span className="text-emerald-500 animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          ONLINE PORT: 3000
        </span>
      </div>
    </div>
  );
}
