import React from 'react';
import { ChevronLeft, ChevronRight, Link, FlaskConical, RotateCcw } from 'lucide-react';
import { TranslationTone, WizardState } from '../../types';
import { ToneLocalizations } from './locales';

interface GraphControlsProps {
  currentStep: number;
  totalSteps: number;
  isLight: boolean;
  tone: TranslationTone;
  loc: ToneLocalizations;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  wizard?: WizardState;
  isSyncedWithWizard: boolean;
  setIsSyncedWithWizard: (synced: boolean) => void;
  setIsPlaying: (playing: boolean | ((p: boolean) => boolean)) => void;
  setCurrentStep: (step: number) => void;
  handleReset: () => void;
}

export default function GraphControls({
  currentStep,
  totalSteps,
  isLight,
  tone,
  loc,
  handlePrevStep,
  handleNextStep,
  wizard,
  isSyncedWithWizard,
  setIsSyncedWithWizard,
  setIsPlaying,
  setCurrentStep,
  handleReset,
}: GraphControlsProps) {
  return (
    <div
      className={`flex items-center justify-between border-t pt-3 mt-1 px-1.5 ${
        isLight ? 'border-slate-100' : 'border-slate-900/80'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={`p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
          title={loc.prevStepBtn}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNextStep}
          disabled={currentStep === totalSteps - 1}
          className={`p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
          title={loc.nextStepBtn}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 animate-fade-in">
        {wizard && (
          <div
            className={`p-0.5 rounded-lg border flex items-center shadow-sm select-none ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Real Git Sync Toggle Button */}
            <button
              type="button"
              id="btn-vis-sync-toggle-footer"
              onClick={() => {
                setIsSyncedWithWizard(true);
                setIsPlaying(false);
              }}
              className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                isSyncedWithWizard
                  ? isLight
                    ? 'bg-white text-indigo-650 shadow-sm border border-slate-250/50 font-semibold'
                    : 'bg-indigo-600/35 text-indigo-300 border border-indigo-500/25'
                  : 'text-slate-400 hover:text-indigo-400'
              }`}
              title={tone === TranslationTone.ENGLISH ? 'Sync with Git Repo' : 'Đồng bộ với Git thực tế'}
            >
              <Link className="w-3.5 h-3.5" />
            </button>
            {/* Simulate Mode Toggle Button */}
            <button
              type="button"
              id="btn-vis-simulate-toggle-footer"
              onClick={() => {
                setIsSyncedWithWizard(false);
                if (currentStep >= totalSteps - 1) {
                  setCurrentStep(0);
                }
                setIsPlaying(true);
              }}
              className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                !isSyncedWithWizard
                  ? isLight
                    ? 'bg-white text-emerald-650 shadow-sm border border-slate-250/50 font-semibold'
                    : 'bg-emerald-600/35 text-emerald-300 border border-emerald-500/25'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
              title={tone === TranslationTone.ENGLISH ? 'Playground Simulation' : 'Sa bàn Giả lập'}
            >
              <FlaskConical className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={isSyncedWithWizard}
          className={`p-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
          title={loc.resetBtn}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
