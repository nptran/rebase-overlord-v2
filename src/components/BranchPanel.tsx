/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GitBranch, 
  Search, 
  PlusCircle, 
  Trash2, 
  ArrowRight, 
  Globe, 
  Laptop, 
  CheckCircle2,
  GitPullRequest,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { GitBranch as GitBranchType, TranslationTone } from '../types';
import { translate } from '../i18n';

const branchLoc = {
  [TranslationTone.PROFESSIONAL]: {
    newBranch: "Thêm nhánh mới",
    titleCreate: "TẠO NHÁNH MỚI:",
    createBtn: "Tạo nhánh",
    tipCreate: "* Sẽ được chuyển hướng trực tiếp sau khi hoàn tất khởi tạo.",
    searchPlaceholder: "Tìm chi nhánh (E.g. main, develop...)",
    emptyText: "Không tìm thấy chi nhánh nào.",
    checkoutBtn: "Chuyển sang",
    deleteConfirm: (b: string) => `Bạn có chắc chắn muốn xóa chi nhánh [${b}] không? Hành động này sẽ gây mất dữ liệu nếu chưa push.`,
    metrics: "CHỈ SỐ CHI NHÁNH",
    checkingOut: "Đang chuyển nhánh..."
  },
  [TranslationTone.JOKE]: {
    newBranch: "Phun nhánh mới 🌿",
    titleCreate: "MÚA NHÁNH MỚI NÈ SẾP:",
    createBtn: "Khai sinh ngay",
    tipCreate: "* Auto bay sang khi sút nút tạo nha sếp.",
    searchPlaceholder: "Tìm nhánh xịn xò (E.g. main, feature...)",
    emptyText: "Tìm mỏi mắt không thấy cái nhánh nào hết trơn.",
    checkoutBtn: "Lượn sang",
    deleteConfirm: (b: string) => `Xóa cái nhánh [${b}] là bốc hơi luôn nha sếp? Chắc chưa á?`,
    metrics: "CHỈ SỐ SINH TRƯỞNG",
    checkingOut: "Nhánh hịn đang load..."
  },
  [TranslationTone.TOXIC]: {
    newBranch: "Đẻ nhánh mới lẹ lên!",
    titleCreate: "MÀY ĐỐI PHÓ TẠO NHÁNH GÌ ĐẤY:",
    createBtn: "Đẻ đi",
    tipCreate: "* Khởi tạo xong là tao ép sang nhánh mới luôn đó.",
    searchPlaceholder: "Tìm cái nhánh rác rưởi nào (E.g. main, feature...)",
    emptyText: "Xịt keo, đéo tìm thấy nhánh nào hết!",
    checkoutBtn: "Cút sang",
    deleteConfirm: (b: string) => `Tao hỏi thật mày muốn khai tử cái nhánh [${b}] đúng không? Đéo khôi phục được đâu!`,
    metrics: "TỔNG SỐ ĐỐNG RÁC",
    checkingOut: "Đang chuyển... đợi tí đi!"
  },
  [TranslationTone.ENGLISH]: {
    newBranch: "New Branch",
    titleCreate: "CREATE NEW BRANCH:",
    createBtn: "Create",
    tipCreate: "* Will checkout automatically once initialized.",
    searchPlaceholder: "Search branches (E.g. main, feature...)",
    emptyText: "No matching branches detected.",
    checkoutBtn: "Checkout",
    deleteConfirm: (b: string) => `Are you sure you want to delete branch [${b}]? Unpushed changes will be lost permanently.`,
    metrics: "BRANCH METRICS",
    checkingOut: "Checking out..."
  }
};

interface BranchPanelProps {
  branches: GitBranchType[];
  currentBranch: string;
  tone: TranslationTone;
  useEmoji: boolean;
  theme?: 'light' | 'dark';
  checkingOutBranch?: string | null;
  onCheckout: (branchName: string) => void;
  onCreateBranch: (branchName: string) => void;
  onDeleteBranch: (branchName: string) => void;
}

export default function BranchPanel({
  branches,
  currentBranch,
  tone,
  useEmoji,
  theme = 'dark',
  checkingOutBranch = null,
  onCheckout,
  onCreateBranch,
  onDeleteBranch
}: BranchPanelProps) {
  const [search, setSearch] = React.useState('');
  const [newBranchName, setNewBranchName] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_collapse_branch_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rebase_overlord_collapse_branch_panel', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Dynamic localization selection
  const loc = branchLoc[tone] || branchLoc[TranslationTone.PROFESSIONAL];

  // Filter branches
  const filtered = branches.filter(val => 
    val.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    
    // Clean and validate branch name
    const cleaned = newBranchName.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9/\-_.]/g, '');

    onCreateBranch(cleaned);
    setNewBranchName('');
    setShowCreateForm(false);
  };

  const isLight = theme === 'light';

  if (isCollapsed) {
    return (
      <div id="branch-panel-collapsed" className={`border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-900 text-slate-305'}`}>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span className="font-bold uppercase tracking-wider">{translate('m_checkout', tone, undefined, useEmoji)}</span>
          <span className="text-[10px] text-slate-500 opacity-60">
            ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'})
          </span>
        </div>
        <button
          onClick={toggleCollapse}
          className={`text-xs font-mono flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer border ${
            isLight
              ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              : 'bg-[#1e293b] border-slate-750 text-sky-400 hover:text-sky-303'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}</span>
        </button>
      </div>
    );
  }

  return (
    <div id="branch-panel" className={`border rounded-xl p-5 shadow-xl transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-slate-800 text-slate-100'}`}>
      <div className={`flex justify-between items-center mb-4 pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span className={isLight ? 'text-slate-900' : 'text-white'}>{translate('m_checkout', tone, undefined, useEmoji)}</span>
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Branch Create button */}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`text-xs font-mono flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
              isLight ? 'bg-sky-50 text-sky-600 border border-sky-250 hover:bg-sky-100' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:text-sky-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{loc.newBranch}</span>
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
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

      {/* Quick create form collapsed state */}
      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className={`mb-4 p-3 rounded-lg border animate-fade-in ${isLight ? 'bg-slate-50 border-sky-200' : 'bg-slate-950 border-sky-500/20'}`}>
          <div className={`text-xs mb-2 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{loc.titleCreate}</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="E.g. feature/checkout-refactor"
              className={`flex-grow border px-3 py-1.5 text-xs font-mono rounded outline-none ${
                isLight ? 'bg-white border-slate-250 text-slate-800 focus:border-sky-500' : 'bg-slate-900 border-slate-800 text-slate-250 focus:border-sky-500'
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded font-mono border border-sky-500/10 cursor-pointer"
            >
              {loc.createBtn}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 italic font-mono">
            {loc.tipCreate}
          </p>
        </form>
      )}

      {/* Hint and Information */}
      <div className="text-[10px] text-slate-500 mb-2.5 font-mono flex items-center gap-1 select-none">
        <span className="text-sky-500">💡</span>
        <span>
          {tone === TranslationTone.ENGLISH && 'Tip: Double-click any row to checkout instantly!'}
          {tone === TranslationTone.PROFESSIONAL && 'Mẹo: Nhấp đúp chuột vào bất kỳ nhánh nào để chuyển đổi nhanh.'}
          {tone === TranslationTone.JOKE && 'Mẹo: Click đúp phát để lướt sóng chuyển nhánh tức thì nhé sếp!'}
          {tone === TranslationTone.TOXIC && 'Mẹo: Gõ đúp chuột vào cái nhánh để cút lẹ sang đó.'}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
          <Search className="w-3.5 h-3.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={loc.searchPlaceholder}
          className={`w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs font-mono outline-none transition-colors ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-350 focus:ring-1 focus:ring-slate-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-800'
          }`}
        />
      </div>

      {/* Interactive Branch List */}
      <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
        {filtered.length === 0 ? (
          <div className="text-xs text-slate-600 text-center italic py-4">
            {loc.emptyText}
          </div>
        ) : (
          filtered.map((branch) => {
            const isCurrent = branch.name === currentBranch;
            const tooltipText = isCurrent
              ? (tone === TranslationTone.ENGLISH ? `Current branch: ${branch.name}` : tone === TranslationTone.PROFESSIONAL ? `Nhánh hiện tại: ${branch.name}` : tone === TranslationTone.JOKE ? `👑 Nhánh mẹ thiên hạ đang ngự trị: ${branch.name}` : `Nhánh hiện tại: ${branch.name}. Click đúp cũng đéo chạy đi đâu được.`)
              : (tone === TranslationTone.ENGLISH ? `Double-click to checkout: ${branch.name}` : tone === TranslationTone.PROFESSIONAL ? `Nhấp đúp chuột để chuyển nhanh sang nhánh: ${branch.name}` : tone === TranslationTone.JOKE ? `Click đúp phát để lướt ván sang nhánh: ${branch.name} 🚀` : `Click đúp phát để cút lẹ sang nhánh: ${branch.name}`);

            const isCheckingOutThis = checkingOutBranch === branch.name;
            const isAnyCheckingOut = checkingOutBranch !== null;

            return (
              <div
                key={branch.name}
                onDoubleClick={() => {
                  if (!isCurrent && !isAnyCheckingOut) {
                    onCheckout(branch.name);
                  }
                }}
                title={isCheckingOutThis ? loc.checkingOut : tooltipText}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs font-mono select-none ${
                  isCurrent
                    ? 'bg-sky-500/10 border-sky-400/30 text-sky-500 font-bold shadow-md'
                    : isCheckingOutThis
                      ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-400 animate-pulse'
                      : isLight
                        ? `bg-slate-50 border-slate-150 text-slate-700 ${isAnyCheckingOut ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100/80 hover:border-slate-300 hover:text-slate-905 cursor-pointer active:scale-[0.99]'}`
                        : `bg-slate-950 border-slate-900/65 text-slate-400 ${isAnyCheckingOut ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-900/60 hover:border-slate-700/50 hover:text-slate-200 cursor-pointer active:scale-[0.99]'}`
                }`}
              >
                {/* Branch Info Left */}
                <div className="flex items-center gap-2 max-w-[calc(100%-28px)] w-full overflow-hidden">
                  {isCheckingOutThis ? (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  ) : isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  ) : (
                    <GitBranch className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
                  )}
                  <span className={`font-semibold truncate flex-grow ${isCurrent ? 'text-sky-600' : isCheckingOutThis ? 'text-indigo-400 font-bold' : isLight ? 'text-slate-800' : 'text-slate-300'}`} title={branch.name}>
                    {branch.name}
                    {isCheckingOutThis && (
                      <span className="text-[10px] text-indigo-400 font-bold ml-1.5 italic animate-pulse">
                        ({loc.checkingOut})
                      </span>
                    )}
                  </span>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-1 shrink-0">
                    {branch.isBase && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1 rounded uppercase font-bold">
                        BASE
                      </span>
                    )}
                    {branch.isLocal && !branch.isRemote && (
                      <span className="text-[9px] bg-sky-500/10 text-sky-600 border border-sky-500/20 px-1 rounded uppercase" title="Local only branch">
                        <Laptop className="w-2.5 h-2.5 inline mr-0.5" />Local
                      </span>
                    )}
                    {branch.isRemote && !branch.isLocal && (
                      <span className="text-[9px] bg-purple-500/10 text-purple-600 border border-purple-500/20 px-1 rounded uppercase" title="Remote only branch">
                        <Globe className="w-2.5 h-2.5 inline mr-0.5" />Remote
                      </span>
                    )}
                  </div>
                </div>

                {/* Operations Right */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Deletion protection */}
                  {!isCurrent && !branch.isBase && !isAnyCheckingOut && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering double click checkout
                        const confirmDel = window.confirm(loc.deleteConfirm(branch.name));
                        if (confirmDel) onDeleteBranch(branch.name);
                      }}
                      className={`p-1 rounded border border-transparent transition-all active:scale-90 cursor-pointer ${
                        isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200' : 'text-slate-600 hover:text-rose-450 hover:bg-rose-500/10 hover:border-rose-500/20'
                      }`}
                      title={tone === TranslationTone.ENGLISH ? "Delete branch" : "Xoá nhánh"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Local & Remote Branch status indicators metrics */}
      <div className={`mt-4 pt-3 border-t flex justify-between items-center text-[10px] text-slate-500 font-mono ${isLight ? 'border-slate-200' : 'border-slate-900'}`}>
        <span>{loc.metrics}</span>
        <span>
          Local: {branches.filter(b => b.isLocal).length} | Remote: {branches.filter(b => b.isRemote).length}
        </span>
      </div>
    </div>
  );
}
