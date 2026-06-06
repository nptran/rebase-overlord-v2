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
  EyeOff,
  ArrowDownLeft,
  ArrowDown,
  ArrowUp
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
    checkingOut: "Đang chuyển nhánh...",
    modalTitle: "Tạo nhánh mới chuẩn hóa",
    baseBranchLabel: "Nhánh cơ sở (Base branch)",
    prefixLabel: "Tiền tố tiêu chuẩn (Prefix)",
    suffixLabel: "Tên nhánh tùy chọn (Suffix)",
    previewLabel: "Tên nhánh hoàn thiện",
    cancelBtn: "Hủy bỏ",
    invalidSuffix: "Tên nhánh không hợp lệ. Vui lòng chỉ dùng ký tự chữ, số, gạch ngang và không để trống.",
    duplicateBranch: "Tên nhánh này đã tồn tại trong repository.",
    fetchBtn: "Fetch",
    fetchTooltip: "Lấy các thay đổi mới nhất từ tất cả các nhánh trên remote",
    pullTooltip: (n: number) => `Kéo ${n} commit mới từ remote về nhánh local này`,
    pushTooltip: (n: number) => `Đẩy ${n} commit mới từ local này lên remote`
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
    checkingOut: "Nhánh hịn đang load...",
    modalTitle: "Nơi hạ sinh nhánh xịn sò 🌱",
    baseBranchLabel: "Gốc gác từ đâu thế sếp",
    prefixLabel: "Họ nhà nhánh (Tiền tố tiêu chuẩn)",
    suffixLabel: "Tên riêng tự sướng (Suffix)",
    previewLabel: "Dáng dấp nhánh tương lai",
    cancelBtn: "Thôi cút",
    invalidSuffix: "Nhập tên cho đàng hoàng chữ số thôi sếp ơi, đừng chế cháo ký tự lạ.",
    duplicateBranch: "Nhánh này bị trùng gốc rồi nha sếp.",
    fetchBtn: "Fetch",
    fetchTooltip: "Hóng hớt xem server có biến gì mới chưa sếp ơi",
    pullTooltip: (n: number) => `Kéo liền ${n} quà xịn xò từ remote về sếp ơi`,
    pushTooltip: (n: number) => `Đẩy ${n} phát kiến vĩ đại lên remote đi ní`
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
    checkingOut: "Đang chuyển... đợi tí đi!",
    modalTitle: "ĐẺ THÊM NHÁNH RÁC NỮA HẢ",
    baseBranchLabel: "Nhánh tổ tông rác ở đâu",
    prefixLabel: "Mày muốn làm loại gì (Prefix)",
    suffixLabel: "Đặt tên xàm xí gì nhập nốt vào",
    previewLabel: "Hình dáng sản phẩm lỗi sắp đẻ",
    cancelBtn: "Hủy cút",
    invalidSuffix: "Tên rác quá, đéo hợp lệ rồi. Nhập chữ cái, số, gạch ngang thôi thằng ngu!",
    duplicateBranch: "Nhánh này có rồi mày đẻ lắm thế!",
    fetchBtn: "Fetch",
    fetchTooltip: "Dò la xem đồng nghiệp nó có đè code rác lên không chứ gì nữa",
    pullTooltip: (n: number) => `Hốt ${n} đống rác mới nhất trên remote về máy đi`,
    pushTooltip: (n: number) => `Đẩy ${n} đống phân code rác rưởi của mày lên remote đi`
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
    checkingOut: "Checking out...",
    modalTitle: "Create Standardized Branch",
    baseBranchLabel: "Base branch",
    prefixLabel: "Standardized prefix",
    suffixLabel: "Custom name suffix",
    previewLabel: "Resulting branch name",
    cancelBtn: "Cancel",
    invalidSuffix: "Invalid branch suffix. Please use letters, numbers, hyphens or underscores only.",
    duplicateBranch: "This branch already exists in the repository.",
    fetchBtn: "Fetch",
    fetchTooltip: "Fetch latest updates from all remote branches",
    pullTooltip: (n: number) => `Pull ${n} new commit${n > 1 ? 's' : ''} from remote`,
    pushTooltip: (n: number) => `Push ${n} new commit${n > 1 ? 's' : ''} to remote`
  }
};

const STANDARD_PREFIXES = [
  'feature/',
  'bugfix/',
  'hotfix/',
  'release/',
  'refactor/',
  'docs/',
  'chore/'
];

interface BranchPanelProps {
  branches: GitBranchType[];
  currentBranch: string;
  tone: TranslationTone;
  useEmoji: boolean;
  theme?: 'light' | 'dark';
  checkingOutBranch?: string | null;
  onCheckout: (branchName: string) => void;
  onCreateBranch: (branchName: string, baseBranch?: string) => void;
  onDeleteBranch: (branchName: string) => void;
  onFetch: () => void;
  onPullBranch: (branchName: string) => void;
  onPushBranch: (branchName: string) => void;
  isFetchingGlobal?: boolean;
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
  onDeleteBranch,
  onFetch,
  onPullBranch,
  onPushBranch,
  isFetchingGlobal = false
}: BranchPanelProps) {
  const [search, setSearch] = React.useState('');
  const [branchToDelete, setBranchToDelete] = React.useState<string | null>(null);

  // States for the creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [baseBranch, setBaseBranch] = React.useState('');
  const [selectedPrefix, setSelectedPrefix] = React.useState('feature/');
  const [customSuffix, setCustomSuffix] = React.useState('');
  const [modalError, setModalError] = React.useState<string | null>(null);

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

  const openCreateModal = () => {
    const defaultBase = branches.find(b => b.name === 'develop')?.name ||
                        branches.find(b => b.name === 'dev')?.name ||
                        branches.find(b => b.name === currentBranch)?.name ||
                        branches.find(b => b.name === 'main')?.name ||
                        branches.find(b => b.name === 'master')?.name ||
                        currentBranch || 'develop';
    setBaseBranch(defaultBase);
    setSelectedPrefix('feature/');
    setCustomSuffix('');
    setModalError(null);
    setIsCreateModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSuffix.trim()) {
      setModalError(loc.invalidSuffix);
      return;
    }

    const cleanedSuffix = customSuffix.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_.]/g, '');

    if (!cleanedSuffix) {
      setModalError(loc.invalidSuffix);
      return;
    }

    const fullBranchName = `${selectedPrefix}${cleanedSuffix}`;

    // check if branch already exists
    const isDuplicate = branches.some(b => b.name.toLowerCase() === fullBranchName.toLowerCase());
    if (isDuplicate) {
      setModalError(loc.duplicateBranch);
      return;
    }

    onCreateBranch(fullBranchName, baseBranch);
    setIsCreateModalOpen(false);
  };

  // Filter branches and remove 'origin' or empty or HEAD
  const filteredAndOnHold = branches.filter(val => {
    const lowerName = val.name.toLowerCase();
    return lowerName.includes(search.toLowerCase()) && 
           lowerName !== 'origin' && 
           !lowerName.includes('head') && 
           !lowerName.includes('->');
  });

  // Sort: current branch first, then base branches, then others alphabetically
  const baseBranchNames = ['main', 'master', 'develop', 'dev', 'production'];
  const filtered = [...filteredAndOnHold].sort((a, b) => {
    const aIsCurrent = a.name === currentBranch;
    const bIsCurrent = b.name === currentBranch;
    if (aIsCurrent !== bIsCurrent) {
      return aIsCurrent ? -1 : 1;
    }

    const aIsBase = a.isBase || baseBranchNames.includes(a.name.toLowerCase());
    const bIsBase = b.isBase || baseBranchNames.includes(b.name.toLowerCase());
    if (aIsBase !== bIsBase) {
      return aIsBase ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

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
          className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
            isLight
              ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              : 'bg-[#1e293b] border-slate-755 text-sky-400 hover:text-sky-303'
          }`}
          title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
        >
          <Eye className="w-3.5 h-3.5" />
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
          {/* Fetch remote button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFetch();
            }}
            disabled={isFetchingGlobal}
            title={loc.fetchTooltip}
            className={`p-1.5 rounded border transition-all text-xs flex items-center justify-center shrink-0 cursor-pointer active:scale-95 ${
              isFetchingGlobal ? 'animate-pulse opacity-50 cursor-not-allowed' : ''
            } ${
              isLight 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-750 hover:bg-indigo-100 hover:text-indigo-900' 
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <ArrowDownLeft className={`w-4 h-4 ${isFetchingGlobal ? 'animate-spin' : ''}`} />
          </button>

          {/* Branch Create button */}
          <button
            onClick={openCreateModal}
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
                  {/* Pull Button */}
                  {branch.isLocal && typeof branch.behindCount === 'number' && branch.behindCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPullBranch(branch.name);
                      }}
                      className={`p-1 rounded border border-transparent transition-all active:scale-90 cursor-pointer flex items-center gap-0.5 text-emerald-500 font-mono text-[10px] ${
                        isLight ? 'hover:bg-emerald-50 hover:border-emerald-200' : 'hover:bg-emerald-500/10 hover:border-emerald-500/20'
                      }`}
                      title={loc.pullTooltip(branch.behindCount)}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span className="font-bold">{branch.behindCount}</span>
                    </button>
                  )}

                  {/* Push Button */}
                  {branch.isLocal && typeof branch.aheadCount === 'number' && branch.aheadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPushBranch(branch.name);
                      }}
                      className={`p-1 rounded border border-transparent transition-all active:scale-90 cursor-pointer flex items-center gap-0.5 text-sky-500 font-mono text-[10px] ${
                        isLight ? 'hover:bg-sky-50 hover:border-sky-200' : 'hover:bg-sky-500/10 hover:border-sky-500/20'
                      }`}
                      title={loc.pushTooltip(branch.aheadCount)}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span className="font-bold">{branch.aheadCount}</span>
                    </button>
                  )}

                  {/* Deletion protection */}
                  {!isCurrent && branch.isLocal && !isAnyCheckingOut && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering double click checkout
                        setBranchToDelete(branch.name);
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
          Local: {branches.filter(b => b.isLocal && b.name !== 'origin').length} | Remote: {branches.filter(b => b.isRemote && b.name !== 'origin').length}
        </span>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 font-sans">
          {/* Backdrop with elegant blur */}
          <div 
            onClick={() => setBranchToDelete(null)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />
          {/* Modal Card */}
          <div
            className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-10 scale-100 transition-all ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-800' 
                : 'bg-[#0f172a] border-slate-800 text-slate-100'
            }`}
          >
            {/* Alert Icon and Title */}
            <div className="flex items-start gap-3.5 mb-4 font-sans">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {tone === TranslationTone.ENGLISH ? 'Delete Branch' : tone === TranslationTone.TOXIC ? 'KHAI TỬ CHI NHÁNH RÁC' : 'Xoá chi nhánh'}
                </h3>
                <p className={`text-[11px] mt-1.5 leading-relaxed font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {loc.deleteConfirm(branchToDelete)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs font-mono">
              <button
                onClick={() => setBranchToDelete(null)}
                className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tone === TranslationTone.ENGLISH ? 'Cancel' : tone === TranslationTone.TOXIC ? 'Thôi cút' : 'Hủy bỏ'}
              </button>
              <button
                onClick={() => {
                  onDeleteBranch(branchToDelete);
                  setBranchToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/20 shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
              >
                {tone === TranslationTone.ENGLISH ? 'Confirm' : tone === TranslationTone.TOXIC ? 'Xoá luôn, sợ gì' : 'Xác nhận xoá'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Standardized Create Branch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 font-sans">
          {/* Backdrop with elegant blur */}
          <div 
            onClick={() => setIsCreateModalOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />
          {/* Modal Card */}
          <div
            className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-10 scale-100 transition-all ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-850' 
                : 'bg-[#0f172a] border-slate-800 text-slate-100'
            }`}
          >
            {/* Title with icon */}
            <div className="flex items-start gap-3 mb-5 font-sans">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                <GitBranch className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {loc.modalTitle}
                </h3>
                <p className={`text-[10px] mt-1 leading-relaxed font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {tone === TranslationTone.ENGLISH 
                    ? 'Spawn standard git branches starting from any specific base checkout' 
                    : tone === TranslationTone.TOXIC 
                      ? 'Đẻ nhánh mới cho đúng bộ quy tắc chuẩn chỉnh' 
                      : 'Sinh nhánh mới theo cấu trúc Git tiêu chuẩn'}
                </p>
              </div>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-12 gap-x-3.5 gap-y-4">
                {/* Base Branch Selection */}
                <div className="col-span-12">
                  <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {loc.baseBranchLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={baseBranch}
                      onChange={(e) => {
                        setBaseBranch(e.target.value);
                        setModalError(null);
                      }}
                      className={`w-full px-3 py-2 pr-8 text-xs font-mono rounded border outline-none cursor-pointer appearance-none focus:border-sky-500 transition-colors ${
                        isLight 
                          ? 'bg-white border-slate-250 text-slate-800 focus:ring-1 focus:ring-sky-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-200 focus:ring-1 focus:ring-sky-950'
                      }`}
                    >
                      {Array.from(new Set(branches.map(b => b.name)))
                        .filter(bName => bName !== 'origin' && !bName.includes('HEAD') && !bName.includes('->'))
                        .map(bName => (
                          <option key={bName} value={bName}>{bName}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Prefix Select */}
                <div className="col-span-5">
                  <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {loc.prefixLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPrefix}
                      onChange={(e) => {
                        setSelectedPrefix(e.target.value);
                        setModalError(null);
                      }}
                      className={`w-full px-2.5 py-2 pr-8 text-xs font-mono rounded border outline-none cursor-pointer appearance-none focus:border-sky-500 transition-colors ${
                        isLight 
                          ? 'bg-white border-slate-250 text-slate-800 focus:ring-1 focus:ring-sky-200' 
                          : 'bg-slate-900 border-slate-800 text-slate-200 focus:ring-1 focus:ring-sky-950'
                      }`}
                    >
                      {STANDARD_PREFIXES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Suffix Input */}
                <div className="col-span-7">
                  <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {loc.suffixLabel}
                  </label>
                  <input
                    type="text"
                    value={customSuffix}
                    onChange={(e) => {
                      // automatic raw formatting inside typing to guarantee git compatibility
                      const cleanVal = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9\-_.]/g, '');
                      setCustomSuffix(cleanVal);
                      setModalError(null);
                    }}
                    placeholder="e.g. login-page-fix"
                    className={`w-full px-3 py-2 text-xs font-mono rounded border outline-none focus:border-sky-500 transition-colors ${
                      isLight 
                        ? 'bg-white border-slate-250 text-slate-800 focus:ring-1 focus:ring-sky-200' 
                        : 'bg-slate-900 border-slate-800 text-slate-200 focus:ring-1 focus:ring-sky-950'
                    }`}
                    autoFocus
                  />
                </div>
              </div>

              {/* Dynamic visual preview */}
              <div className={`p-3 rounded-lg border text-xs font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-850/60'
              }`}>
                <div className="flex flex-col gap-1 w-full">
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {loc.previewLabel}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap text-xs font-bold font-mono">
                    <span className="text-emerald-500 shrink-0">{baseBranch || '...'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-sky-500 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded truncate max-w-[200px]" title={`${selectedPrefix}${customSuffix}`}>
                      {selectedPrefix}{customSuffix || '...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validation errors */}
              {modalError && (
                <div className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 rounded p-2 text-left leading-relaxed">
                  ⚠️ {modalError}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {loc.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-bold text-white bg-sky-600 hover:bg-sky-500 border border-sky-500/20 shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
                >
                  {loc.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
