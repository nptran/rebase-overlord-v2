import React from 'react';
import { EyeOff } from 'lucide-react';
import { TranslationTone } from '../../types';
import { VisualActionType } from './GitVisualizerPanel';
import { ToneLocalizations } from './locales';

interface GraphToolbarProps {
  activeAction: VisualActionType;
  isSimulation: boolean;
  isLight: boolean;
  tone: TranslationTone;
  loc: ToneLocalizations;
  handleActionChange: (action: VisualActionType) => void;
  toggleCollapse: () => void;
}

export default function GraphToolbar({
  activeAction,
  isSimulation,
  isLight,
  tone,
  loc,
  handleActionChange,
  toggleCollapse,
}: GraphToolbarProps) {
  const actions: VisualActionType[] = ['rebase', 'stash', 'merge', 'commit', 'push', 'diverge', 'fast-forward'];

  return (
    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
      <div className="flex flex-wrap gap-1 w-full md:w-auto">
        {actions.map((action) => {
          const isSelected = activeAction === action && isSimulation;
          return (
            <button
              key={action}
              id={`git-vis-tab-${action}`}
              onClick={() => handleActionChange(action)}
              className={`px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-650 border-indigo-500 text-white shadow-md shadow-indigo-605/20'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-800'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              } ${!isSimulation ? 'opacity-50 hover:opacity-100' : ''}`}
              title={
                !isSimulation
                  ? tone === TranslationTone.ENGLISH
                    ? 'Click to switch to simulation mode for this diagram'
                    : 'Click để chuyển sang chế độ giả lập xem sơ đồ này'
                  : ''
              }
            >
              {loc.opLabels[action]}
            </button>
          );
        })}

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded transition-all text-xs flex items-center justify-center font-mono cursor-pointer border shrink-0 ${
            isLight
              ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900'
              : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-305'
          }`}
          title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
        >
          <EyeOff className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
