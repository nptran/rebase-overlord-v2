import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Archive, ChevronDown, Eye, EyeOff, FileText, Check, AlertCircle, Copy } from 'lucide-react';
import { StashItem, TranslationTone } from '../../types';

interface StashPanelProps {
  theme: 'light' | 'dark';
  tone: TranslationTone;
  stashes: StashItem[];
  currentBranch: string;
  rebaseInProgress: boolean;
  mergeInProgress: boolean;
  isRefreshing: boolean;
  onUnstash: (index: number) => void;
}

export default function StashPanel({
  theme,
  tone,
  stashes,
  currentBranch,
  rebaseInProgress,
  mergeInProgress,
  isRefreshing,
  onUnstash
}: StashPanelProps) {
  const [expandedStash, setExpandedStash] = React.useState<number | null>(null);
  const [previewFile, setPreviewFile] = React.useState<{ stashIndex: number; filepath: string; content?: string } | null>(null);
  const [copiedFile, setCopiedFile] = React.useState<string | null>(null);
  const [showAllBranches, setShowAllBranches] = React.useState(false);

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_collapse_stash_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rebase_overlord_collapse_stash_panel', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Normalize branch name helper
  const cleanBranchName = (b: string) => b.trim().toLowerCase();

  const activeStashes = React.useMemo(() => {
    if (showAllBranches || !currentBranch) return stashes;
    return stashes.filter(s => cleanBranchName(s.branch) === cleanBranchName(currentBranch));
  }, [stashes, currentBranch, showAllBranches]);

  const hiddenCount = stashes.length - activeStashes.length;

  const getLabel = (key: string) => {
    const isEn = tone === TranslationTone.ENGLISH;
    const isJoke = tone === TranslationTone.JOKE;
    const isToxic = tone === TranslationTone.TOXIC;

    switch (key) {
      case 'title':
        if (isEn) return '📦 Stashed Items (Git Shelf)';
        if (isJoke) return '📦 Ngăn Kéo Lưu Trữ Bí Mật (Git Stash)';
        if (isToxic) return '📦 Kho Phế Liệu Chưa Tẩy Rửa (Git Stash)';
        return '📦 Kho Chứa Thư Mục Tạm (Git Stash)';
      case 'subtitle':
        if (isEn) return 'Manage shelved workspace changes to preserve local experiments safely';
        if (isJoke) return 'Cất gọn gàng đống rác dang dở tránh vợ sếp sờ vào làm bung bét.';
        return 'Xếp tạm các file sửa dở dang vào ngăn tủ mật để rebase/merge thoải mái.';
      case 'empty_state':
        if (isEn) return showAllBranches ? 'No stashed changes found.' : `No stashed changes found for branch "${currentBranch}".`;
        if (isJoke) return showAllBranches ? 'Tủ đồ sạch bong kin kít sếp ơi.' : `Nhánh "${currentBranch}" sạch bong kin kít, không giấu tệp nào.`;
        if (isToxic) return showAllBranches ? 'Nhà kho trống rỗng tẻ nhạt.' : `Nhánh "${currentBranch}" chả chứa nổi một tệp rác nào sếp ạ.`;
        return showAllBranches ? 'Không tìm thấy các thay đổi stash nào.' : `Không tìm thấy thay đổi stash nào cho nhánh "${currentBranch}".`;
      case 'unstash_btn':
        if (isEn) return 'Unstash (git pop)';
        if (isJoke) return 'Triệu hồi (pop)';
        if (isToxic) return 'Móc ra ngoài (pop)';
        return 'Khôi phục (pop)';
      case 'view_changes_badge':
        if (isEn) return 'View files';
        if (isJoke) return 'Săm soi tệp';
        return 'Xem tệp';
      case 'created_on':
        if (isEn) return 'stashed on branch';
        if (isJoke) return 'giấu từ nhánh';
        return 'lưu từ';
      case 'disabled_reason':
        if (isEn) return 'Cannot unstash during rebase/merge/status loading processes';
        if (isJoke) return 'Cảnh báo: Đang phong ấn bảo vệ rebase/merge, cấm lấy đồ!';
        return 'Không thể khôi phục file khi đang di chuyển Rebase, Merge hoặc đang tải dữ liệu';
      default:
        return '';
    }
  };

  const handleCopy = async (text: string, path: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFile(path);
      setTimeout(() => setCopiedFile(null), 1500);
    } catch (err) {}
  };

  const isLight = theme === 'light';
  const isBlocked = rebaseInProgress || mergeInProgress || isRefreshing;

  if (isCollapsed) {
    return (
      <div 
        id="stash-panel-collapsed" 
        className={`rounded-xl p-3.5 flex justify-between items-center transition-all duration-200 ${
          isLight ? 'bg-white text-slate-800 shadow-sm' : 'bg-[#0f172a] text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Archive className="w-4 h-4 text-indigo-505" />
          <span className="font-bold uppercase tracking-wider">{getLabel('title')}</span>
          <span className="text-[10px] text-slate-500 opacity-60">
            ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'}) {stashes.length > 0 && `• ${stashes.length} item${stashes.length > 1 ? 's' : ''}`}
          </span>
        </div>
        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
            isLight
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-[#1e293b] border-slate-755 text-indigo-400 hover:text-indigo-303'
          }`}
          title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl p-6 transition-all duration-300 ${
        isLight ? 'bg-white text-slate-800 shadow-sm' : 'bg-[#0f172a] text-slate-300'
      }`}
      id="stash-panel-root"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div className="space-y-1">
          <h3 className={`text-base font-semibold font-mono tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-slate-50'
          }`}>
            <Archive className="w-5 h-5 text-indigo-500" />
            {getLabel('title')}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            {getLabel('subtitle')}
          </p>
        </div>

        {/* Action controls container */}
        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          {/* Dynamic Branch filter Selector Tabs */}
          {stashes.length > 0 && (
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowAllBranches(false)}
                className={`px-3 py-1.5 rounded-md font-medium tracking-wide transition-all cursor-pointer ${
                  !showAllBranches
                    ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌿 {tone === TranslationTone.ENGLISH ? currentBranch : (tone === TranslationTone.JOKE ? `Mỗi ${currentBranch}` : `Nhánh: ${currentBranch}`)}
              </button>
              <button
                type="button"
                onClick={() => setShowAllBranches(true)}
                className={`px-3 py-1.5 rounded-md font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  showAllBranches
                    ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌐 {tone === TranslationTone.ENGLISH ? `All (${stashes.length})` : (tone === TranslationTone.JOKE ? `Cả ổ (${stashes.length})` : `Tất cả (${stashes.length})`)}
              </button>
            </div>
          )}

          {/* Collapse Toggle with eye icon */}
          <button
            type="button"
            onClick={toggleCollapse}
            className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
              isLight 
                ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-300'
            }`}
            title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
          >
            <EyeOff className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {stashes.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/60 p-4">
          <Archive className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5 " />
          <p className="text-xs font-mono text-slate-400">
            {getLabel('empty_state')}
          </p>
        </div>
      ) : activeStashes.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/60 p-4">
          <Archive className="w-8 h-8 text-indigo-550/60 dark:text-indigo-400/30 mx-auto mb-2.5" />
          <p className="text-xs font-mono text-slate-400 mb-3">
            {getLabel('empty_state')}
          </p>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllBranches(true)}
              className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 hover:opacity-85 decoration-dotted underline cursor-pointer active:scale-95 transition-transform"
            >
              {tone === TranslationTone.ENGLISH 
                ? `Show ${hiddenCount} stash item${hiddenCount > 1 ? 's' : ''} folder from other branches`
                : `Hiển thị ${hiddenCount} bản nháp thuộc các nhánh khác`
              }
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {activeStashes.map((stash) => {
            const isExpanded = expandedStash === stash.index;
            return (
              <div 
                key={`stash-item-${stash.index}`}
                id={`stash-card-${stash.index}`}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  isLight 
                    ? 'border-slate-100 bg-slate-50/50 hover:bg-slate-50' 
                    : 'border-slate-850/50 bg-[#16223f]/20 hover:bg-[#16223f]/40'
                }`}
              >
                {/* Header of card element */}
                <div 
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedStash(isExpanded ? null : stash.index)}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">
                          {stash.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans font-medium px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/60">
                          {getLabel('created_on')} <code className="font-mono text-indigo-300 font-semibold">{stash.branch}</code>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          • {stash.date}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold font-mono truncate ${
                        isLight ? 'text-slate-700' : 'text-slate-200'
                      }`}>
                        {stash.message}
                      </p>
                    </div>
                  </div>

                  {/* Right side actions controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setExpandedStash(isExpanded ? null : stash.index)}
                      className={`p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 transition-colors ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      title={getLabel('view_changes_badge')}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </button>
                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => onUnstash(stash.index)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all duration-200 ${
                        isBlocked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-405 dark:text-slate-600 cursor-not-allowed opacity-50'
                          : 'bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer active:scale-95 shadow-sm hover:shadow shadow-indigo-600/10'
                      }`}
                      title={isBlocked ? getLabel('disabled_reason') : getLabel('unstash_btn')}
                    >
                      {getLabel('unstash_btn')}
                    </button>
                  </div>
                </div>

                {/* Directory listing inside stash */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-t ${isLight ? 'border-slate-100 bg-white' : 'border-slate-900 bg-[#0c1222]/40'}`}
                    >
                      <div className="p-3.5 space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                          {stash.files.length} Modified file{stash.files.length > 1 ? 's' : ''} in stash:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stash.files.map((file, fIdx) => {
                            const isCurrentlyPreviewed = previewFile?.stashIndex === stash.index && previewFile?.filepath === file.filepath;
                            return (
                              <div
                                key={`file-${fIdx}`}
                                className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-all duration-150 ${
                                  isCurrentlyPreviewed
                                    ? isLight 
                                      ? 'border-indigo-200 bg-indigo-50/50' 
                                      : 'border-indigo-500/30 bg-indigo-500/10'
                                    : isLight
                                    ? 'border-slate-100 bg-slate-50/20 hover:bg-slate-50'
                                    : 'border-slate-850 bg-slate-900/40 hover:bg-slate-900/80'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className={`truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                                    {file.filepath}
                                  </span>
                                  {file.status === 'added' ? (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-black tracking-widest scale-90">A</span>
                                  ) : file.status === 'deleted' ? (
                                    <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-black tracking-widest scale-90">D</span>
                                  ) : null}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewFile({
                                    stashIndex: stash.index,
                                    filepath: file.filepath,
                                    content: file.content
                                  })}
                                  className="p-1 rounded hover:bg-indigo-500/15 text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Expand content preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider">{tone === TranslationTone.ENGLISH ? 'Preview' : 'Xem'}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Expandable file contents preview sandbox box */}
                        {previewFile && previewFile.stashIndex === stash.index && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`border rounded-lg mt-3 overflow-hidden ${
                              isLight ? 'border-slate-200 bg-[#f8fafc]' : 'border-slate-800 bg-[#0b0f19]'
                            }`}
                          >
                            <div className={`px-3 py-2 border-b flex justify-between items-center ${
                              isLight ? 'border-slate-200 bg-slate-100' : 'border-slate-800 bg-slate-950'
                            }`}>
                              <span className="text-xs font-mono text-indigo-400 font-bold max-w-[280px] sm:max-w-md truncate">
                                📝 {previewFile.filepath}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleCopy(previewFile.content || '', previewFile.filepath)}
                                  className="p-1 rounded hover:bg-slate-800/80 text-slate-400 transition-colors cursor-pointer"
                                  title="Copy content"
                                >
                                  {copiedFile === previewFile.filepath ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => setPreviewFile(null)}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isLight ? 'bg-slate-200 text-slate-605' : 'bg-slate-800 text-slate-350'
                                  } hover:opacity-85`}
                                >
                                  {tone === TranslationTone.ENGLISH ? 'Close' : 'Đóng'}
                                </button>
                              </div>
                            </div>
                            <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[220px] text-slate-305 bg-[#090d16] select-text whitespace-pre-wrap">
                              {previewFile.content || '// Content unavailable or empty'}
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {isBlocked && (
        <div className="mt-2.5 flex items-center gap-2 text-[10px] text-amber-500 font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
          <span>{getLabel('disabled_reason')}</span>
        </div>
      )}
    </div>
  );
}
