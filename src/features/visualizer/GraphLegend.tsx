import React from 'react';
import { TranslationTone } from '../../types';
import { ToneLocalizations } from './locales';

interface GraphLegendProps {
  isLight: boolean;
  tone: TranslationTone;
  loc: ToneLocalizations;
}

export default function GraphLegend({ isLight, tone, loc }: GraphLegendProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-mono border-t pt-2.5 pb-0.5 opacity-90 select-none ${
        isLight ? 'border-slate-100 text-slate-600' : 'border-slate-900/85 text-slate-300'
      }`}
    >
      <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">{loc.legendLabel}</span>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-400"></span>
        <span className={`font-medium ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
          {loc.localBranchLegend}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3.5 h-2.5 rounded bg-indigo-500/10 border border-dashed border-indigo-400/80"></span>
        <span className={`font-medium ${isLight ? 'text-indigo-600' : 'text-indigo-300'}`}>
          {loc.remoteBranchLegend}
        </span>
      </div>
    </div>
  );
}
