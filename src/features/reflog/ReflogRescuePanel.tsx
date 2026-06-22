import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, LifeBuoy, AlertTriangle, Sparkles, CheckCircle, RotateCcw } from 'lucide-react';
import { TranslationTone } from '../../types';
import { useReflogRecovery, ReflogEntry } from './useReflogRecovery';

interface ReflogRescuePanelProps {
  theme: 'light' | 'dark';
  tone: TranslationTone;
  onRescueCommit: (sha: string, message: string, author: string, date: string) => void;
}

export default function ReflogRescuePanel({
  theme,
  tone,
  onRescueCommit
}: ReflogRescuePanelProps) {
  const {
    entries,
    activeRescuingSha,
    terminalOutput,
    successCommit,
    startRescue
  } = useReflogRecovery({ tone, onRescueCommit });

  // Translate labels based on the chosen tone
  const getLabel = (key: string) => {
    const isEn = tone === TranslationTone.ENGLISH;
    const isJoke = tone === TranslationTone.JOKE;
    const isToxic = tone === TranslationTone.TOXIC;

    switch (key) {
      case 'title':
        if (isEn) return '⚡ Git Reflog Rescue (Oxy Reflog)';
        if (isJoke) return '⚡ Bộ Cứu Hộ Git Reflog & Cứu Hộ Code';
        if (isToxic) return '⚡ Bình Oxy Reflog Cứu Repo Nát Vụn';
        return '⚡ Bộ Công Cụ Khôi Phục Git Reflog';
      case 'subtitle':
        if (isEn) return 'Recover lost commits and branches (Khôi phục commit & nhánh đã mất)';
        if (isJoke) return 'Hồi sinh mớ commit lỡ tay xóa nhầm, kéo code về chỉ trong 1 nốt nhạc!';
        if (isToxic) return 'Nhặt xác mấy commits và tệp tin bị mày ngu ngốc xóa sổ khi Rebase hỏng';
        return 'Sơ cứu và lấy lại commits thất lạc do Rebase lỗi, Hard Reset hoặc xóa lầm nhánh';
      case 'terminal_header':
        if (isEn) return 'Interactive Recovery CLI';
        return 'CLI Khôi Phục Tương Tác';
      case 'dangling_badge':
        if (isEn) return 'DANGLING/LOST';
        if (isJoke) return 'CẬU BÉ MỒ CÔI';
        if (isToxic) return 'PHẾ THẢI CHƯA DỌN';
        return 'MẤT TÍCH (DANGLING)';
      case 'rescue_btn':
        if (isEn) return 'Rescue';
        if (isJoke) return 'Triệu hồi';
        if (isToxic) return 'Nhặt hộ';
        return 'Khôi phục';
      case 'desc':
        if (isEn) return 'Reflog recording tracks every single update of HEAD. Even if you checked out or run hard resets, lost commits remain in Git database for 30-90 days until vacuumed by GC.';
        return 'Lịch sử Reflog lưu vết mọi hành động dịch chuyển HEAD. Ngay cả khi bạn checkout/rebase sai dẫn đến mất commit, dữ liệu thực tế vẫn trôi nổi trong bộ nhớ Git 30 ngày trước khi bị dọn dẹp.';
    }
    return '';
  };

  return (
    <div id="reflog-rescue-card" className={`rounded-xl p-6 transition-all duration-200 ${
      theme === 'light' 
        ? 'bg-white text-slate-900 shadow-sm' 
        : 'bg-[#0f172a] text-slate-100'
    } flex flex-col gap-4`}>
      {/* Title block with sparkles */}
      <div className={`flex items-center justify-between border-b pb-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 animate-pulse">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>{getLabel('title')}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-amber-400 bg-amber-500/10 border border-amber-500/20">
                PRO ACTIVE
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              {getLabel('subtitle')}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
        {getLabel('desc')}
      </p>

      {/* Reflog actions list */}
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className={`border p-3 rounded-lg flex items-center justify-between gap-4 font-mono text-[10px] transition-all ${
              entry.isDangling
                ? theme === 'light'
                  ? 'bg-amber-550/[0.03] border-amber-200'
                  : 'bg-amber-500/5 border-amber-500/25 shadow-[0_0_15px_-5px_rgba(245,158,11,0.15)]'
                : theme === 'light'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-900/40 border-slate-800/80'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-amber-500 font-bold">{entry.sha}</span>
                <span className="text-slate-500">({entry.selector})</span>
                <span className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase ${
                  entry.type.includes('commit') 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : theme === 'light'
                      ? 'bg-slate-100 border-slate-205 border text-slate-500'
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {entry.type}
                </span>

                {entry.isDangling && (
                  <span className="flex items-center gap-1 text-[8.5px] font-extrabold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                    {getLabel('dangling_badge')}
                  </span>
                )}
              </div>
              <p className={`mt-1.5 truncate text-[11px] font-sans ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                {entry.message}
              </p>
            </div>

            <button
              onClick={() => startRescue(entry)}
              disabled={!!activeRescuingSha || !entry.isDangling}
              className={`shrink-0 px-3 py-1.5 font-bold rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-[10px] ${
                entry.isDangling
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md font-bold'
                  : theme === 'light'
                    ? 'bg-slate-100 border-slate-200 border text-slate-400 cursor-not-allowed'
                    : 'bg-slate-800/40 border-slate-800 border text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{getLabel('rescue_btn')}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Live CLI Rescue interactive output */}
      <AnimatePresence>
        {terminalOutput.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-amber-500/20 font-mono text-[10px] overflow-hidden"
          >
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 border-b border-slate-900 pb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                {getLabel('terminal_header')}
              </span>
              <span className="text-amber-500/60 animate-ping">●</span>
            </div>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1 text-emerald-400">
              {terminalOutput.map((line, i) => (
                <div key={i} className="leading-relaxed whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {successCommit && (
              <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-2.5 text-emerald-400 animate-bounce">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-[11px] uppercase tracking-wider">
                    {tone === TranslationTone.ENGLISH ? 'Recovery Successful!' : 'Khôi Phục Thành Công!'}
                  </div>
                  <div className="text-[9px] text-slate-300">
                    {tone === TranslationTone.ENGLISH 
                      ? `Commit Node ${successCommit} re-attached to your visual timeline pipeline.` 
                      : `Mã nút của commit ${successCommit} đã quay lại tuyến nhánh visual timeline pipeline của bạn.`}
                  </div>
                </div>
                <Sparkles className="w-4 h-4 ml-auto text-amber-400 animate-pulse" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
