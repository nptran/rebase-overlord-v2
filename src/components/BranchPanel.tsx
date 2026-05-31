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
  GitPullRequest
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
    metrics: "CHỈ SỐ CHI NHÁNH"
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
    metrics: "CHỈ SỐ SINH TRƯỞNG"
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
    metrics: "TỔNG SỐ ĐỐNG RÁC"
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
    metrics: "BRANCH METRICS"
  }
};

interface BranchPanelProps {
  branches: GitBranchType[];
  currentBranch: string;
  tone: TranslationTone;
  useEmoji: boolean;
  onCheckout: (branchName: string) => void;
  onCreateBranch: (branchName: string) => void;
  onDeleteBranch: (branchName: string) => void;
}

export default function BranchPanel({
  branches,
  currentBranch,
  tone,
  useEmoji,
  onCheckout,
  onCreateBranch,
  onDeleteBranch
}: BranchPanelProps) {
  const [search, setSearch] = React.useState('');
  const [newBranchName, setNewBranchName] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);

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

  return (
    <div id="branch-panel" className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span>{translate('m_checkout', tone, undefined, useEmoji)}</span>
        </h2>
        
        {/* Branch Create button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{loc.newBranch}</span>
        </button>
      </div>

      {/* Quick create form collapsed state */}
      {showCreateForm && (
        <form onSubmit={handleCreateSubmit} className="mb-4 bg-slate-950 p-3 rounded-lg border border-sky-500/20 animate-fade-in">
          <div className="text-xs text-slate-400 mb-2 font-mono">{loc.titleCreate}</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="E.g. feature/checkout-refactor"
              className="flex-grow bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono rounded text-slate-200 focus:border-sky-500 outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded font-mono border border-sky-500/10"
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
          className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:border-slate-700 focus:ring-1 focus:ring-slate-800 outline-none placeholder-slate-600"
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

            return (
              <div
                key={branch.name}
                onDoubleClick={() => {
                  if (!isCurrent) {
                    onCheckout(branch.name);
                  }
                }}
                title={tooltipText}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs font-mono select-none ${
                  isCurrent
                    ? 'bg-sky-500/10 border-sky-400/30 text-sky-300 shadow-md'
                    : 'bg-slate-950 hover:bg-slate-900/60 hover:border-slate-700/50 text-slate-400 hover:text-slate-200 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {/* Branch Info Left */}
                <div className="flex items-center gap-2 max-w-[calc(100%-28px)] w-full overflow-hidden">
                  {isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <GitBranch className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className={`font-semibold truncate flex-grow ${isCurrent ? 'text-sky-300' : 'text-slate-300'}`}>
                    {branch.name}
                  </span>
                  
                  {/* Status Badges */}
                  <div className="flex items-center gap-1 shrink-0">
                    {branch.isBase && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded uppercase font-bold">
                        BASE
                      </span>
                    )}
                    {branch.isLocal && !branch.isRemote && (
                      <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1 rounded uppercase" title="Local only branch">
                        <Laptop className="w-2.5 h-2.5 inline mr-0.5" />Local
                      </span>
                    )}
                    {branch.isRemote && !branch.isLocal && (
                      <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 rounded uppercase" title="Remote only branch">
                        <Globe className="w-2.5 h-2.5 inline mr-0.5" />Remote
                      </span>
                    )}
                  </div>
                </div>

                {/* Operations Right */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Deletion protection */}
                  {!isCurrent && !branch.isBase && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering double click checkout
                        const confirmDel = window.confirm(loc.deleteConfirm(branch.name));
                        if (confirmDel) onDeleteBranch(branch.name);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all active:scale-90"
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
      <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span>{loc.metrics}</span>
        <span>
          Local: {branches.filter(b => b.isLocal).length} | Remote: {branches.filter(b => b.isRemote).length}
        </span>
      </div>
    </div>
  );
}
