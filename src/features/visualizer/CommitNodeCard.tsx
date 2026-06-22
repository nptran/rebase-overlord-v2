import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Move, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { Commit, WizardState, TranslationTone } from '../../types';
import { translate } from '../../i18n';

interface CommitNodeCardProps {
  c: Commit;
  theme: 'light' | 'dark';
  tone: TranslationTone;
  activeTool: 'pan' | 'dragNode';
  isMobile: boolean;
  wizard: WizardState;
  expandedNodes: Record<string, boolean>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  nodeSizes: Record<string, { width: number; height: number }>;
  isSimulation: boolean;
  track: number;
  isGraphVertical: boolean;
  nodeWidth: number;
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  updateConnectionPaths: () => void;
  triggerRenderTick: () => void;
  handleResizeStart: (e: React.PointerEvent, sha: string, dir: 'w' | 'h' | 'both') => void;
  hoveredSha: string | null;
  setHoveredSha: (sha: string | null) => void;
  fetchCommitFiles: (sha: string) => void;
  loadingFilesShas: Record<string, boolean>;
  commitFiles: Record<string, Array<{ filepath: string; status: string }>>;
  isTouchOnly: boolean;
}

export default function CommitNodeCard({
  c,
  theme,
  tone,
  activeTool,
  isMobile,
  wizard,
  expandedNodes,
  setExpandedNodes,
  nodeSizes,
  isSimulation,
  track,
  isGraphVertical,
  nodeWidth,
  nodeRefs,
  updateConnectionPaths,
  triggerRenderTick,
  handleResizeStart,
  hoveredSha,
  setHoveredSha,
  fetchCommitFiles,
  loadingFilesShas,
  commitFiles,
  isTouchOnly,
}: CommitNodeCardProps) {
  const dragControls = useDragControls();

  const isSelect = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
  const isExpanded = !!expandedNodes[c.sha];
  const customSz = nodeSizes[c.sha];
  const finalWidth = customSz?.width ?? (isExpanded ? nodeWidth + 120 : nodeWidth);
  const finalHeight = customSz?.height ?? (isExpanded ? 140 : 80);

  let nodeOffsetX = 0;
  let nodeOffsetY = 0;
  if (isSimulation) {
    if (isGraphVertical) {
      if (track === 0) nodeOffsetX = -180;
      if (track === 2) nodeOffsetX = 180;
    } else {
      if (track === 0) nodeOffsetY = -110;
      if (track === 2) nodeOffsetY = 110;
    }
  }

  return (
    <motion.div
      ref={(el) => {
        nodeRefs.current[c.sha] = el;
      }}
      drag={!isMobile && activeTool === 'dragNode'}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={false}
      dragElastic={0.2}
      layout
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
        boxShadow: theme === 'light' ? '0 10px 20px rgba(0,0,0,0.1)' : '0 10px 25px rgba(0,0,0,0.4)',
      }}
      onDrag={() => {
        updateConnectionPaths();
      }}
      onDragEnd={() => {
        updateConnectionPaths();
      }}
      onMouseEnter={() => {
        setHoveredSha(c.sha);
        fetchCommitFiles(c.sha);
      }}
      onMouseLeave={() => {
        setHoveredSha(null);
      }}
      style={{
        width: `${finalWidth}px`,
        height: customSz?.height ? `${finalHeight}px` : 'auto',
        minHeight: customSz?.height ? `${finalHeight}px` : undefined,
        marginLeft: isGraphVertical ? `${nodeOffsetX}px` : undefined,
        marginTop: !isGraphVertical ? `${nodeOffsetY}px` : undefined,
      }}
      className={`flex flex-col items-stretch p-3 text-left border rounded-xl hover:shadow-md transition-colors duration-150 relative shrink-0 ${
        !isMobile && activeTool === 'dragNode' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${
        theme === 'light'
          ? 'bg-white border-slate-200/80 shadow-sm text-slate-800'
          : 'bg-slate-900/60 border-slate-800 text-slate-100 shadow'
      }`}
    >
      {/* Top header of node */}
      <div className="flex items-center justify-between gap-1.5 mb-2 pointer-events-auto">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
              isSelect
                ? 'bg-indigo-500/10 text-indigo-500 border-indigo-200/50 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30'
                : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-900'
            }`}
          >
            {isExpanded ? c.sha : c.sha.substring(0, 7)}
          </span>

          {/* Branch Track Badge */}
          {isSimulation && track === 0 && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]">
              develop
            </span>
          )}
          {isSimulation && track === 2 && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]" title="origin/remote">
              origin/remote
            </span>
          )}
          {isSimulation && track === 1 && c.isMergeCommit && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]">
              merge
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 select-none shrink-0">
          {/* Hover Grab Handle Indicator */}
          {!isMobile && activeTool === 'dragNode' && (
            <Move
              onPointerDown={(e) => {
                e.preventDefault();
                dragControls.start(e);
              }}
              className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
              title="Nhấn giữ để di chuyển (Hold to drag)"
            />
          )}

          {/* Maximize / Collapse Resize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedNodes((prev) => ({ ...prev, [c.sha]: !prev[c.sha] }));
              setTimeout(() => {
                updateConnectionPaths();
                triggerRenderTick();
              }, 80);
            }}
            className={`p-1 rounded cursor-pointer transition-colors ${
              theme === 'light' ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title={isExpanded ? "Collapse Details" : "Expand to view details"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3 text-rose-400" />
            ) : (
              <Maximize2 className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Body of node */}
      <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
        <span
          className={`text-[11px] font-medium leading-tight ${
            isExpanded ? 'whitespace-normal block break-words text-xs' : 'truncate block w-full text-[10px]'
          } ${
            isSelect ? (theme === 'light' ? 'text-slate-800' : 'text-slate-100') : 'text-slate-400 line-through opacity-60'
          }`}
          title={c.message}
        >
          {c.message}
        </span>

        {/* Smooth framer-motion expanded detailed contents */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-dashed border-slate-700 mt-2 pt-2 flex flex-col gap-1 text-[10px] font-mono text-slate-400"
            >
              {c.type && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold shrink-0 text-slate-500">Type:</span>
                  <span
                    className={`px-1 py-0.2 rounded font-black uppercase text-[8px] ${
                      c.type === 'feat'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : c.type === 'fix'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
              )}

              {c.author && (
                <div className="truncate">
                  <span className="font-bold text-slate-500 text-[9px]">Author:</span> {c.author}
                </div>
              )}

              {c.date && (
                <div className="text-[9px]">
                  <span className="font-bold text-slate-500">Date:</span> {c.date}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Drag-to-Resize Handles on Board Borders (hidden on touch machines) */}
      {!isTouchOnly && (
        <>
          {/* Right side resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'w')}
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-indigo-500/30 active:bg-indigo-500/40 transition-colors z-20 group"
            title="Kéo để chỉnh độ rộng (Drag to resize width)"
          >
            <div className="w-1 h-1/3 bg-slate-400/25 group-hover:bg-indigo-400/80 rounded mx-auto my-auto top-1/3 relative" />
          </div>

          {/* Bottom side resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'h')}
            className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize hover:bg-indigo-500/30 active:bg-indigo-500/40 transition-colors z-20 group"
            title="Kéo để chỉnh chiều cao (Drag to resize height)"
          >
            <div className="h-1 w-1/3 bg-slate-400/25 group-hover:bg-indigo-400/80 rounded mx-auto my-auto left-1/3 relative" />
          </div>

          {/* Bottom-right diagonal resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'both')}
            className="absolute bottom-0 right-0 w-4.5 h-4.5 cursor-se-resize hover:bg-indigo-500/50 hover:scale-110 active:scale-95 transition-all z-30 flex items-center justify-center rounded-bl group-hover:bg-indigo-500/10"
            title="Chỉnh cả 2 chiều (Resize both width and height)"
          >
            <svg
              className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 19H5m14 0V5" />
            </svg>
          </div>
        </>
      )}

      {/* Interactive hover tooltip previewing file changes */}
      <AnimatePresence>
        {hoveredSha === c.sha && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              width: '260px',
            }}
            className={`absolute left-[103%] top-0 z-55 p-3.5 rounded-xl border-2 shadow-2xl flex flex-col gap-2.5 backdrop-blur-md font-sans text-xs ${
              theme === 'light'
                ? 'bg-white/95 border-indigo-100 text-slate-800 shadow-slate-300/60'
                : 'bg-slate-950/95 border-indigo-900/80 text-slate-100 shadow-black/90'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-1.5 border-dashed border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[10px]">
                <span className="text-indigo-400">#</span>
                <span>{translate('commit_files_changed', tone)}</span>
              </div>
              <span className="text-[9px] font-mono opacity-60">{c.sha.substring(0, 7)}</span>
            </div>

            {loadingFilesShas[c.sha] ? (
              <div className="flex items-center gap-2 py-3 justify-center text-[10px] text-slate-400 animate-pulse font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                <span>{translate('commit_files_loading', tone)}</span>
              </div>
            ) : !commitFiles[c.sha] || commitFiles[c.sha].length === 0 ? (
              <div className="text-[10px] text-slate-500 py-3 text-center italic font-mono">
                {translate('commit_files_none', tone)}
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto pr-1">
                {commitFiles[c.sha].map((file, fi) => (
                  <div key={fi} className="flex items-center gap-1.5 text-[9.5px] font-mono truncate text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{file.filepath}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
