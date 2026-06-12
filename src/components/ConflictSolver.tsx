/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Files, 
  GitCompare, 
  Shuffle, 
  HelpCircle,
  FileCode2,
  Settings2,
  Undo2,
  Code2,
  Minimize2,
  Maximize2,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Bot,
  Sparkles,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { ConflictFile, TranslationTone } from '../types';
import { getApiHeaders } from '../utils/apiKeyHelper';

const localization = {
  [TranslationTone.PROFESSIONAL]: {
    title: "TRÌNH KHÔI PHỤC REBASE (REBASE RECOVERY CENTER)",
    desc: "Phát hiện xung đột tập tin trong quá trình rebase. Hãy xử lý theo định dạng trực quan dưới đây.",
    btnContinue: "TRÌNH LÊN REBASE CONTINUE",
    colTitle: "CÁC TẬP TIN XUNG ĐỘT:",
    guideTitle: "HƯỚNG DẪN CỨU HỘ:",
    guideText: "Khi Rebase Overlord phát hiện xung đột, nó sẽ tạm dừng. Bạn chọn chọn giải pháp nhập liệu của Nhánh chính (Ours) hoặc Nhánh gốc (Theirs) để tự động gộp, sau đó nhấn nút \"Confirm Resolve\".",
    mergeLanes: "Phân làn gộp trực quan",
    laneA: "LÀN A: OURS (Nhánh Develop / Base)",
    laneB: "LÀN B: THEIRS (Nhánh Tính năng / Feature)",
    btnOurs: "Bản Gốc (Left)",
    btnTheirs: "Bản của bạn (Right)",
    actionTitle: "CHỌN PHƯƠNG ÁN HỢP NHẤT:",
    optOurs: "Lấy Bản Gốc (Lane A)",
    optTheirs: "Lấy Bản của bạn (Lane B)",
    optBoth: "Giữ Cả Hai (Lớp A + B)",
    optCustom: "Sửa Thủ Công",
    btnConfirm: "CONFIRM RESOLVED",
    placeholderCustom: "Sửa hoặc gột thủ công mã nguồn đã được merge...",
    allResolved: "🎉 Đã xử lý toàn bộ xung đột thành công!",
    clickTip: "Chọn một tập tin xung đột bên trái để bắt đầu cứu trợ.",
    nextTip: "→ Click \"TRÌNH LÊN REBASE CONTINUE\" ở góc phải để tiếp tục luồng.",
    statusConflict: "XUNG ĐỘT",
    statusResolved: "ĐÃ GIẢI QUYẾT",
    resultPane: "KẾT QUẢ HỢP NHẤT (SỬA THỦ CÔNG)",
    toolHelp: "Lớp màu tím/xanh nhạt thể hiện mã nguồn base/develop (Ours) làm nền. Lớp màu hổ phách đại diện cho các thay đổi từ nhánh tính năng của bạn (Theirs)."
  },
  [TranslationTone.JOKE]: {
    title: "🏥 PHÒNG CẤP CỨU REBASE (REBASE EMERGENCY)",
    desc: "Ối dồi ôi kìa sếp! Code đụng độ nảy lửa rồi. Chọn thuốc chữa nhanh nào.",
    btnContinue: "🔥 TIẾP TỤC KHÔ MÁU (REBASE CONTINUE)",
    colTitle: "HỒ SƠ BỆNH ÁN (CONFLICTS):",
    guideTitle: "KÍP TRỰC CẤP CỨU BÁO:",
    guideText: "Xe rebase đang đổ đèo thì xịt lốp (conflict). Sếp vui lòng chọn phe nhánh develop gốc (Ours) hoặc nhánh tính năng sếp múa (Theirs) gộp lại nhé, hoặc gõ tay sửa khẩn.",
    mergeLanes: "Màn hình gỡ bom hẹn giờ",
    laneA: "PHE TA: OURS (Nhánh Develop gốc)",
    laneB: "PHE ĐỊCH: THEIRS (Nhánh Tính năng sếp múa)",
    btnOurs: "Bơm hàng bên Develop",
    btnTheirs: "Lưu hàng của sếp",
    actionTitle: "LỰA CHỌN PHÂN CHIA CHIẾN LỢI PHẨM:",
    optOurs: "Lấy phe Gốc (Lane A)",
    optTheirs: "Lấy phe Ta (Lane B)",
    optBoth: "Gộp cả 2 phe (A + B)",
    optCustom: "Tự múa phím sửa",
    btnConfirm: "🎯 CHỐT GỠ CONFLICT",
    placeholderCustom: "Múa phím cứu vớt linh hồn đoạn code này...",
    allResolved: "🏆 Ca mổ thành công, bệnh nhân đã hồi tỉnh!",
    clickTip: "Ní ơi chọn 1 file giãy đành đạch bên trái để bắt đầu cấp cứu nhé.",
    nextTip: "→ Nhấn ngay nút \"TIẾP TỤC KHÔ MÁU\" bên trên để quẩy tiếp sếp ơi!",
    statusConflict: "ĐANG NGUY KỊCH",
    statusResolved: "CỨU SỐNG THÀNH CÔNG",
    resultPane: "KẾT QUẢ GỘP HOÀN CHỈNH (HÚ GÕ CHỮ VÀO)",
    toolHelp: "Làn màu tím mộng mơ đại diện cho chiếc code gốc trên server (Ours). Làn màu hổ phách đại diện cho chiếc code sếp múa trên nhánh tính năng (Theirs)."
  },
  [TranslationTone.TOXIC]: {
    title: "💀 ĐỐNG NÁT REBASE (REBASE MESS CLEANER)",
    desc: "Sửa code ngu thì giờ ngồi dọn chứ khóc lóc cái gì. Gỡ nhanh tao còn đi ngủ!",
    btnContinue: "🤬 BẤM TIẾP (REBASE CONTINUE)",
    colTitle: "BÃI CHIẾN TRƯỜNG:",
    guideTitle: "VĂN PHÒNG CHỬI BỚT:",
    guideText: "Sửa chung 1 dòng chứ gì, dở hơi cám hấp! Chọn giải pháp lấy Ours (develop gốc) hoặc Theirs (mày tự múa) để dọn cái đống rác này, đừng để tao cáu.",
    mergeLanes: "Lớp chia tài sản tranh chấp",
    laneA: "BẢN GỐC: OURS (Nhánh Develop gốc trên server)",
    laneB: "BẢN CỦA MÀY: THEIRS (Nhánh Tính năng mày viết)",
    btnOurs: "Lấy đồ gốc",
    btnTheirs: "Lấy đồ ngu của mày",
    actionTitle: "ĐỊNH ĐOẠT SỐ PHẬN:",
    optOurs: "Lấy đồ gốc trên máy (Lane A)",
    optTheirs: "Lấy đồ ngu của Tao (Lane B)",
    optBoth: "Cố đấm ăn xôi giữ cả hai",
    optCustom: "Sửa bằng tay lẹ lên",
    btnConfirm: "🔥 XÁC NHẬN DỌN XONG",
    placeholderCustom: "Gõ gõ cái l** gì thì gõ lẹ lên rồi nén...",
    allResolved: "🤬 Sương sương giải quyết xong mớ rác, mệt vcl!",
    clickTip: "Mù à? Click chọn cái file nát bét bên trái để cứu xét cái!",
    nextTip: "→ Bấm mẹ nút \"BẤM TIẾP\" góc trên rồi lượn giùm tao cái!",
    statusConflict: "BÃI RÁC TO ĐÙNG",
    statusResolved: "NÍT GIAO XONG ĐẤY",
    resultPane: "EDIT MANUAL LẸ LÊN CON GIỜI",
    toolHelp: "Học gõ code đi rồi biết màu nào ra màu nấy. Màu tím là code gốc develop của thằng khác trên server, màu vàng là dọn phân rác mày tự viết trên nhánh tính năng."
  },
  [TranslationTone.ENGLISH]: {
    title: "COMPARE & RESOLVE (JETBRAINS 3-WAY MERGE)",
    desc: "A highly-polished 3-way conflict viewer mimicking JetBrains IDE. Resolve blocks or edit results live.",
    btnContinue: "SUBMIT & REBASE CONTINUE",
    colTitle: "CONFLICTED FILES VIEW:",
    guideTitle: "JETBRAINS DIRECTIVES:",
    guideText: "Click code insertion arrows (>> on Left, << on Right) to automatically inject blocks into the center pane. You can edit the code directly inside the Result panel.",
    mergeLanes: "JetBrains 3-Way Comparative Channels",
    laneA: "BASE CHANGES (OURS) — ORIGIN/DEVELOP",
    laneB: "INCOMING CHANGES (THEIRS) — FEATURE BRANCH",
    resultPane: "EDITABLE MERGE RESULT EDITOR",
    btnOurs: "Accept Left (>>)",
    btnTheirs: "Accept Right (<<)",
    actionTitle: "DETERMINE RESOLUTION PLAN:",
    optOurs: "Accept Ours (Left)",
    optTheirs: "Accept Theirs (Right)",
    optBoth: "Merge Both Blocks (RHS + LHS)",
    optCustom: "Reset to Conflict State",
    btnConfirm: "CONFIRM RESOLVED & APPLY",
    placeholderCustom: "Resolving final merge stream here...",
    allResolved: "🎉 All file conflicts mapped and resolved successfully!",
    clickTip: "Click a conflicted item on the left rail to initiate diagnostics.",
    nextTip: "→ Click \"SUBMIT & REBASE CONTINUE\" to execute the next pipeline step.",
    unresolvedBadge: "Conflict",
    resolvedBadge: "Resolved",
    statusConflict: "CONFLICT DETECTED",
    statusResolved: "SUCCESSFULLY MERGED",
    quickActions: "Quick merge presets:",
    toolHelp: "Soft purple/blue indicates base development server modifications (Ours). Deep amber highlights your incoming feature commit changes (Theirs)."
  }
};

interface ConflictSolverProps {
  conflicts: ConflictFile[];
  tone: TranslationTone;
  onResolveFile: (filepath: string, resolvedContent: string) => void;
  onCompleteRecovery: () => void;
  currentBranch?: string;
  baseBranch?: string;
  isAiEnabled?: boolean;
  theme?: 'light' | 'dark';
}

interface CodeBlock {
  type: 'normal' | 'conflict';
  commonText?: string;
  oursText?: string;
  theirsText?: string;
}

// Dynamic parser to extract conflict blocks from text
const parseConflictFile = (content: string): CodeBlock[] => {
  if (!content) return [];
  const lines = content.split('\n');
  const blocks: CodeBlock[] = [];
  let currentNormalLines: string[] = [];
  let isInsideOurs = false;
  let isInsideTheirs = false;
  let currentOursLines: string[] = [];
  let currentTheirsLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<<<<<<<')) {
      if (currentNormalLines.length > 0) {
        blocks.push({ type: 'normal', commonText: currentNormalLines.join('\n') });
        currentNormalLines = [];
      }
      isInsideOurs = true;
    } else if (line.startsWith('=======')) {
      isInsideOurs = false;
      isInsideTheirs = true;
    } else if (line.startsWith('>>>>>>>')) {
      isInsideTheirs = false;
      blocks.push({
        type: 'conflict',
        oursText: currentOursLines.join('\n'),
        theirsText: currentTheirsLines.join('\n')
      });
      currentOursLines = [];
      currentTheirsLines = [];
    } else {
      if (isInsideOurs) {
        currentOursLines.push(line);
      } else if (isInsideTheirs) {
        currentTheirsLines.push(line);
      } else {
        currentNormalLines.push(line);
      }
    }
  }

  if (currentNormalLines.length > 0) {
    blocks.push({ type: 'normal', commonText: currentNormalLines.join('\n') });
  }

  return blocks;
};

interface ConflictBlockAnalysis {
  isSimpleConflict: boolean;
  isNonConflicting: boolean;
  mergedProposal: string;
  reason: string;
}

const analyzeAndMergeConflictBlock = (block: CodeBlock): ConflictBlockAnalysis => {
  const ours = block.oursText || '';
  const theirs = block.theirsText || '';

  // 1. Non-conflicting changes: One side changed, other side has no overlap (empty)
  if (ours === '' && theirs !== '') {
    return {
      isSimpleConflict: false,
      isNonConflicting: true,
      mergedProposal: theirs,
      reason: 'Non-conflicting Change: Added/modified only in Theirs (Right)'
    };
  }
  if (theirs === '' && ours !== '') {
    return {
      isSimpleConflict: false,
      isNonConflicting: true,
      mergedProposal: ours,
      reason: 'Non-conflicting Change: Added/modified only in Ours (Left)'
    };
  }

  // 2. Simple Conflict Heuristic Detection: Same lines edited but with zero actual spatial/text overlap
  const oursLines = ours.split('\n');
  const theirsLines = theirs.split('\n');

  if (oursLines.length === theirsLines.length) {
    let matchesHeuristic = true;
    const mergedLines: string[] = [];

    for (let i = 0; i < oursLines.length; i++) {
      const o = oursLines[i];
      const t = theirsLines[i];

      if (o === t) {
        mergedLines.push(o);
        continue;
      }

      // Check for Indentation discrepancies only
      if (o.trim() === t.trim()) {
        const oSpaces = o.length - o.trim().length;
        const tSpaces = t.length - t.trim().length;
        mergedLines.push(oSpaces >= tSpaces ? o : t);
        continue;
      }

      // Check for spatial head/tail edits (no middle collisions)
      let commonPrefix = '';
      let j = 0;
      while (j < o.length && j < t.length && o[j] === t[j]) {
        commonPrefix += o[j];
        j++;
      }

      let commonSuffix = '';
      let kLineO = o.length - 1;
      let kLineT = t.length - 1;
      while (kLineO >= j && kLineT >= j && o[kLineO] === t[kLineT]) {
        commonSuffix = o[kLineO] + commonSuffix;
        kLineO--;
        kLineT--;
      }

      const oMiddle = o.substring(j, kLineO + 1);
      const tMiddle = t.substring(j, kLineT + 1);

      if (oMiddle !== '' && tMiddle !== '') {
        // Spatial clash on same line segment
        matchesHeuristic = false;
        break;
      } else {
        // One side has an edit on start, the other on tail or none. Safety combine
        const combined = commonPrefix + (oMiddle || tMiddle) + commonSuffix;
        mergedLines.push(combined);
      }
    }

    if (matchesHeuristic) {
      return {
        isSimpleConflict: true,
        isNonConflicting: false,
        mergedProposal: mergedLines.join('\n'),
        reason: 'Simple Conflict: Disjoint changes on same line. Auto-mergeable.'
      };
    }
  }

  return {
    isSimpleConflict: false,
    isNonConflicting: false,
    mergedProposal: '',
    reason: 'Complex Conflict: Overlapping line segment changes'
  };
};

// Return either the file conflict content or initial fallback for simulated payment.ts file
const getContentWithConflictMarkers = (file: ConflictFile) => {
  if (file.contentBefore && file.contentBefore.includes('<<<<<<<')) {
    return file.contentBefore;
  }
  
  return [
    'const express = require("express");',
    'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);',
    '',
    '<<<<<<< HEAD',
    '// Alex Nguyen: Add stripe secure charge webhook',
    'app.post("/api/v2/charge", async (req, res) => {',
    '  const { amount, currency } = req.body;',
    '  const paymentIntent = await stripe.paymentIntents.create({',
    '    amount,',
    '    currency,',
    '    metadata: { integration: "rebase-overlord-secured" }',
    '  });',
    '  res.json({ clientSecret: paymentIntent.client_secret });',
    '});',
    '=======',
    '// Sarah Connor: Bump rate-limits and add telemetry handlers',
    'app.post("/api/v2/charge", async (req, res) => {',
    '  const { amount, currency, telemetryId } = req.body;',
    '  logger.info(`Intake transaction telemetry: ${telemetryId}`);',
    '  const charge = await stripe.charges.create({',
    '    amount,',
    '    currency,',
    '    description: "Legacy charges backup pipeline"',
    '  });',
    '  res.json({ success: true, charge });',
    '});',
    '>>>>>>> incoming'
  ].join('\n');
};

interface SearchBarProps {
  isOpen: boolean;
  query: string;
  matchCase: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  activeIndex: number;
  totalMatches: number;
  onChange: (updates: { query?: string; matchCase?: boolean; wholeWord?: boolean; useRegex?: boolean; activeIndex?: number }) => void;
  onClose: () => void;
  tone: TranslationTone;
  theme?: 'light' | 'dark';
}

function SearchInputBar({
  isOpen,
  query,
  matchCase,
  wholeWord,
  useRegex,
  activeIndex,
  totalMatches,
  onChange,
  onClose,
  tone,
  theme = 'dark'
}: SearchBarProps) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const handlePrev = () => {
    if (totalMatches === 0) return;
    const nextIdx = (activeIndex - 1 + totalMatches) % totalMatches;
    onChange({ activeIndex: nextIdx });
  };

  const handleNext = () => {
    if (totalMatches === 0) return;
    const nextIdx = (activeIndex + 1) % totalMatches;
    onChange({ activeIndex: nextIdx });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handlePrev();
      } else {
        handleNext();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={`border-b px-3 py-1 flex items-center justify-between gap-2 text-xs font-mono select-none animate-fade-in ${
      isLight 
        ? 'bg-slate-100 border-slate-250 text-slate-700' 
        : 'bg-[#111216] border-b border-[#2d2f3c] text-slate-300'
    }`}>
      <div className="flex items-center gap-1.5 flex-1 max-w-[85%]">
        <div className={`relative flex items-center rounded-md shadow-inner h-6.5 px-2 w-full max-w-[280px] border ${
          isLight 
            ? 'bg-white border-slate-200 focus-within:border-violet-500' 
            : 'bg-[#1c1d24] border-[#2d2f3c] focus-within:border-violet-500'
        }`}>
          <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onChange({ query: e.target.value, activeIndex: 0 })}
            onKeyDown={handleKeyDown}
            placeholder={tone === TranslationTone.ENGLISH ? "Search in pane (Enter/Shift+Enter)..." : "Tìm trong khung (Enter/Shift+Enter)..."}
            className={`bg-transparent border-none outline-none text-xs w-full mr-2 h-full placeholder-slate-600 focus:ring-0 focus:outline-none ${
              isLight ? 'text-slate-800 placeholder-slate-400' : 'text-[#e8eef5]'
            }`}
            autoFocus
          />
          
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onChange({ matchCase: !matchCase, activeIndex: 0 })}
              className={`px-1 py-0.5 text-[8px] font-bold rounded transition-all cursor-pointer border ${
                matchCase 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                  : isLight 
                    ? 'text-slate-400 hover:text-slate-700 border-transparent bg-transparent'
                    : 'text-slate-500 hover:text-slate-300 border-transparent bg-transparent'
              }`}
              title="Match Case (Cc)"
            >
              Cc
            </button>
            <button
              onClick={() => onChange({ wholeWord: !wholeWord, activeIndex: 0 })}
              className={`px-1 py-0.5 text-[8px] font-bold rounded transition-all cursor-pointer border ${
                wholeWord 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                  : isLight 
                    ? 'text-slate-400 hover:text-slate-700 border-transparent bg-transparent'
                    : 'text-slate-500 hover:text-slate-300 border-transparent bg-transparent'
              }`}
              title="Words (W)"
            >
              W
            </button>
            <button
              onClick={() => onChange({ useRegex: !useRegex, activeIndex: 0 })}
              className={`px-1 py-0.5 text-[8px] font-bold rounded transition-all cursor-pointer border ${
                useRegex 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                  : isLight 
                    ? 'text-slate-400 hover:text-slate-700 border-transparent bg-transparent'
                    : 'text-slate-500 hover:text-slate-300 border-transparent bg-transparent'
              }`}
              title="Regular Expression (.*)"
            >
              .*
            </button>
          </div>
        </div>

        <span className="text-[10px] text-slate-505 whitespace-nowrap px-1">
          {totalMatches > 0 ? (
            <span className="text-violet-550 font-extrabold font-mono">
              {activeIndex + 1}/{totalMatches} {tone === TranslationTone.ENGLISH ? "results" : "đáp án"}
            </span>
          ) : query ? (
            <span className="text-rose-500 font-bold">0 {tone === TranslationTone.ENGLISH ? "results" : "kết quả"}</span>
          ) : (
            <span className={`${isLight ? 'text-slate-400' : 'text-slate-550'}`}>{tone === TranslationTone.ENGLISH ? "No query" : "Nhập từ khóa"}</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handlePrev}
          disabled={totalMatches === 0}
          className={`p-1 rounded transition-colors ${
            totalMatches === 0 
              ? isLight ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-not-allowed' 
              : isLight 
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer' 
                : 'text-slate-450 hover:text-white hover:bg-[#242532] cursor-pointer'
          }`}
          title="Previous Match (Shift+Enter)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={totalMatches === 0}
          className={`p-1 rounded transition-colors ${
            totalMatches === 0 
              ? isLight ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-not-allowed' 
              : isLight 
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer' 
                : 'text-slate-450 hover:text-white hover:bg-[#242532] cursor-pointer'
          }`}
          title="Next Match (Enter)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className={`w-[1px] h-3 mx-0.5 ${isLight ? 'bg-slate-300' : 'bg-[#2d2f3c]'}`}></div>
        <button
          onClick={onClose}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isLight 
              ? 'text-slate-500 hover:text-slate-800 lg:hover:bg-slate-200' 
              : 'text-slate-400 hover:text-white hover:bg-rose-950/40'
          }`}
          title="Close search (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

const getSearchRegex = (query: string, matchCase: boolean, wholeWord: boolean, useRegex: boolean): RegExp | null => {
  if (!query) return null;
  try {
    let pattern = useRegex ? query : query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = matchCase ? 'g' : 'gi';
    return new RegExp(pattern, flags);
  } catch (e) {
    return null; // invalid regex
  }
};

export default function ConflictSolver({
  conflicts,
  tone,
  onResolveFile,
  onCompleteRecovery,
  currentBranch,
  baseBranch,
  isAiEnabled = true,
  theme = 'dark'
}: ConflictSolverProps) {
  const isLight = theme === 'light';
  const [selectedFile, setSelectedFile] = React.useState<ConflictFile | null>(conflicts[0] || null);
  const [editorText, setEditorText] = React.useState('');
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [editMode, setEditMode] = React.useState<'jetbrains' | 'raw'>('jetbrains');
  const [customBlockTexts, setCustomBlockTexts] = React.useState<Record<number, string>>({});
  const [acceptOrder, setAcceptOrder] = React.useState<Record<number, 'left' | 'right' | null>>({});
  const [history, setHistory] = React.useState<Array<{
    blockChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>;
    customBlockTexts: Record<number, string>;
    acceptOrder: Record<number, 'left' | 'right' | null>;
    editorText: string;
  }>>([]);

  const pushCurrentToHistory = React.useCallback((
    choices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>,
    customs: Record<number, string>,
    order: Record<number, 'left' | 'right' | null>,
    text: string
  ) => {
    setHistory(prev => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const isChoicesEqual = JSON.stringify(last.blockChoices) === JSON.stringify(choices);
        const isCustomsEqual = JSON.stringify(last.customBlockTexts) === JSON.stringify(customs);
        const isOrderEqual = JSON.stringify(last.acceptOrder) === JSON.stringify(order);
        const isTextEqual = last.editorText === text;
        if (isChoicesEqual && isCustomsEqual && isOrderEqual && isTextEqual) {
          return prev;
        }
      }
      const nextItem = {
        blockChoices: JSON.parse(JSON.stringify(choices)),
        customBlockTexts: { ...customs },
        acceptOrder: { ...order },
        editorText: text
      };
      const nextHistory = [...prev, nextItem];
      if (nextHistory.length > 20) {
        nextHistory.shift();
      }
      return nextHistory;
    });
  }, []);

  const handleUndo = React.useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const lastState = prev[prev.length - 1];
      
      setBlockChoices(lastState.blockChoices);
      setCustomBlockTexts(lastState.customBlockTexts);
      setAcceptOrder(lastState.acceptOrder);
      setEditorText(lastState.editorText);
      
      return prev.slice(0, -1);
    });
  }, []);

  const handleResetSingleBlock = (blockIdx: number) => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);

    const nextChoices = { ...blockChoices };
    nextChoices[blockIdx] = { left: 'pending', right: 'pending' };
    setBlockChoices(nextChoices);

    const nextCustoms = { ...customBlockTexts };
    delete nextCustoms[blockIdx];
    setCustomBlockTexts(nextCustoms);

    const updatedAcceptOrder = { ...acceptOrder };
    delete updatedAcceptOrder[blockIdx];
    setAcceptOrder(updatedAcceptOrder);

    setEditorText(getMergedContent(nextChoices, nextCustoms, updatedAcceptOrder));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'textarea' && document.activeElement?.hasAttribute('rows')) {
          e.preventDefault();
          handleUndo();
        } else if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo]);

  // Block-level AI suggestions states
  const [blockAiLoading, setBlockAiLoading] = React.useState<Record<number, boolean>>({});
  const [blockAiExplanations, setBlockAiExplanations] = React.useState<Record<number, string>>({});
  const [blockAiApplied, setBlockAiApplied] = React.useState<Record<number, boolean>>({});

  // AI Resolution and Explanation states
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<string | null>(null);
  const [aiProposedContent, setAiProposedContent] = React.useState<string | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [wasAiApplied, setWasAiApplied] = React.useState(false);

  const handleAiResolve = async () => {
    if (!selectedFile) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiExplanation(null);
    setAiProposedContent(null);
    setWasAiApplied(false);

    const cacheKey = `${selectedFile.filepath}_${tone}`;
    let cachedData: any = null;
    try {
      const cachedString = localStorage.getItem('rebase_overlord_conflict_cache');
      if (cachedString) {
        const cacheStore = JSON.parse(cachedString);
        if (cacheStore[cacheKey]) {
          cachedData = cacheStore[cacheKey];
        }
      }
    } catch (e) {
      console.warn("Failed to read conflict resolve cache", e);
    }

    if (cachedData) {
      setTimeout(() => {
        setAiExplanation(cachedData.explanation + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)"));
        setAiProposedContent(cachedData.resolvedContent);
        setIsAiLoading(false);
      }, 200);
      return;
    }

    if (!isAiEnabled) {
      setTimeout(() => {
        let msg = '';
        if (tone === TranslationTone.ENGLISH) {
          msg = 'AI Assistant is currently turned off to save cost. Please toggle it back on in the top header menu to use AI-Powered conflict resolving!';
        } else if (tone === TranslationTone.TOXIC) {
          msg = '🔥 Tiết kiệm từng xu lẻ mà đòi sờ vào AI á? Lên cái header bật nút lên đi rồi hãy gõ nhé, nín hộ cái!';
        } else if (tone === TranslationTone.JOKE) {
          msg = '⚠️ Cửa tiệm AI đã dán biển: "HẾT TIỀN - TẠM NGHỈ BÁN"! Hãy lượn lên Header búng nhẹ công tắc để cứu rỗi nhân phẩm nhé!';
        } else {
          msg = 'Tính năng Trợ lý AI đang tạm tắt để tiết kiệm chi phí. Bạn có thể bật lại trong phần Thiết lập (Header trên cùng) bất cứ lúc nào.';
        }
        setAiError(msg);
        setIsAiLoading(false);
      }, 300);
      return;
    }

    try {
      const response = await fetch('/api/resolve-conflict-ai', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          filepath: selectedFile.filepath,
          content: activeContent, // Pass original raw content with conflict markers intact
          tone: tone
        })
      });

      if (!response.ok) {
        throw new Error(tone === TranslationTone.ENGLISH ? 'Failed to connect to the server.' : 'Không thể kết nối đến máy chủ.');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setAiExplanation(result.explanation);
      setAiProposedContent(result.resolvedContent);

      // Save to cache
      try {
        const cachedString = localStorage.getItem('rebase_overlord_conflict_cache');
        const cacheStore = cachedString ? JSON.parse(cachedString) : {};
        cacheStore[cacheKey] = {
          explanation: result.explanation,
          resolvedContent: result.resolvedContent
        };
        localStorage.setItem('rebase_overlord_conflict_cache', JSON.stringify(cacheStore));
      } catch (e) {
        console.warn("Failed to write conflict resolve cache", e);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || (tone === TranslationTone.ENGLISH ? 'An error occurred during AI processing.' : 'Đã có lỗi xảy ra trong quá trình xử lý AI.'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderSyntaxHighlightedPreviewLine = (line: string) => {
    if (!line) return <span>{'\u00A0'}</span>;
    
    // Check for comment
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span className="text-[#6a9955] dark:text-[#6a9955]/95 italic">{line}</span>;
    }

    const regex = /(".*?"|'.*?'|`.*?`)|(\b(?:const|let|var|function|return|import|export|from|class|interface|type|async|await|if|else|for|while|switch|case|try|catch|true|false|null|undefined)\b)/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(line)) !== null) {
      const matchIdx = match.index;
      if (matchIdx > lastIndex) {
        parts.push(<span key={`text-${keyCounter++}`}>{line.substring(lastIndex, matchIdx)}</span>);
      }

      if (match[1]) {
        // String literal
        parts.push(<span key={`str-${keyCounter++}`} className="text-[#ce9178] dark:text-[#ce9178]/95">{match[1]}</span>);
      } else if (match[2]) {
        // Keyword
        const isFlow = ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch'].includes(match[2]);
        const colorClass = isFlow ? "text-[#c586c0]" : "text-[#569cd6]";
        parts.push(<span key={`kw-${keyCounter++}`} className={`${colorClass} font-semibold`}>{match[2]}</span>);
      }
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={`text-${keyCounter++}`}>{line.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  const handleApplyAiProposedContent = () => {
    if (aiProposedContent) {
      setEditorText(aiProposedContent);
      setEditMode('raw'); // Switch to raw mode so the changes are visible in the central textarea editor
      setWasAiApplied(true);
    }
  };

  const getLaneHeadingA = () => {
    const branchSuffix = baseBranch ? `: ${baseBranch}` : '';
    switch (tone) {
      case TranslationTone.PROFESSIONAL:
        return `LÀN A: OURS (Nhánh Develop / Base${branchSuffix})`;
      case TranslationTone.JOKE:
        return `PHE TA: OURS (Nhánh Develop gốc${branchSuffix})`;
      case TranslationTone.TOXIC:
        return `BẢN GỐC: OURS (Code server develop${branchSuffix})`;
      case TranslationTone.ENGLISH:
      default:
        return `BASE CHANGES (OURS) — ORIGIN/DEVELOP${branchSuffix ? ` (${baseBranch})` : ''}`;
    }
  };

  const getLaneHeadingB = () => {
    const branchSuffix = currentBranch ? `: ${currentBranch}` : '';
    switch (tone) {
      case TranslationTone.PROFESSIONAL:
        return `LÀN B: THEIRS (Nhánh Tính năng / Feature${branchSuffix})`;
      case TranslationTone.JOKE:
        return `PHE ĐỊCH: THEIRS (Nhánh Tính năng sếp múa${branchSuffix})`;
      case TranslationTone.TOXIC:
        return `BẢN CỦA MÀY: THEIRS (Nhánh Tính năng mày viết${branchSuffix})`;
      case TranslationTone.ENGLISH:
      default:
        return `INCOMING CHANGES (THEIRS) — FEATURE BRANCH${branchSuffix ? ` (${currentBranch})` : ''}`;
    }
  };

  const getRebaseInversionExplanation = (tone: TranslationTone) => {
    switch (tone) {
      case TranslationTone.JOKE:
        return "Cảnh báo lú lẫn: Rebase xoay chuyển càn khôn! Bình thường merge thì code của mình là 'Ours' (HEAD), nhưng rebase thì Git lại âm thầm check out nhánh Develop làm HEAD trước (nên Develop thành 'Ours'), còn đống commit sếp múa lại biến thành 'Theirs' được quét vào sau! Bản lĩnh dev nằm ở chỗ không bị Git lừa phỉnh chỗ này nhe sếp!";
      case TranslationTone.TOXIC:
        return "Ủa lú à? Git rebase là thế đấy con! Đừng cãi Git làm gì cho mệt xác. Merge thì Ours là code của mày, nhưng Rebase thì Git nhảy cẩu sang nhánh gốc trước làm HEAD (biến develop gốc thành 'Ours'), rồi mới phanh thây đống commit rác của mày đè lên (biến feature của mày thành 'Theirs'). Căng mắt ra mà dọn rác đúng bên!";
      case TranslationTone.ENGLISH:
        return "A classic mind-bender! During a standard merge, 'Ours' represents your current branch (HEAD). However, during a rebase, Git temporarily switches HEAD to the target base branch first (making public base 'Ours'), then replays your design commits sequentially (making your feature branch 'Theirs'). Keep your eyes sharp!";
      case TranslationTone.PROFESSIONAL:
      default:
        return "Trong quá trình gộp nhánh thông thường (merge), 'Ours' là nhánh hiện tại của bạn. Tuy nhiên, khi rebase, Git tạm chuyển HEAD về nhánh base trước (biến develop gốc thành 'Ours'), sau đó mới đưa các commit của nhánh tính năng đè lên sau (biến tính năng thành 'Theirs'). Vì vậy nhãn bị đảo ngược so với merge thông thường.";
    }
  };
  
  // Track resolved status per block index with independent left and right options for JetBrains style
  const [blockChoices, setBlockChoices] = React.useState<Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>>({});
  const [blockAnalyses, setBlockAnalyses] = React.useState<Record<number, ConflictBlockAnalysis>>({});
  const activeScrollSourceRef = React.useRef<HTMLElement | null>(null);

  const mapScrollBetweenPanes = (
    srcTop: number,
    srcBlockLines: { startLine: number; height: number }[],
    tgtBlockLines: { startLine: number; height: number }[],
    lineHeight = 20
  ): number => {
    if (srcBlockLines.length === 0 || tgtBlockLines.length === 0) return srcTop;
    
    const srcFLine = srcTop / lineHeight;
    
    // Find the block
    let blockIdx = 0;
    for (let i = 0; i < srcBlockLines.length; i++) {
      const block = srcBlockLines[i];
      if (srcFLine >= block.startLine && srcFLine <= block.startLine + block.height) {
        blockIdx = i;
        break;
      }
      if (i === srcBlockLines.length - 1) {
        blockIdx = i;
      }
    }
    
    const srcBlock = srcBlockLines[blockIdx];
    const tgtBlock = tgtBlockLines[blockIdx];
    
    if (!srcBlock || !tgtBlock) return srcTop;
    
    const blockFraction = srcBlock.height > 0 
      ? (srcFLine - srcBlock.startLine) / srcBlock.height 
      : 0;
      
    const tgtFLine = tgtBlock.startLine + blockFraction * tgtBlock.height;
    return tgtFLine * lineHeight;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget as HTMLElement;
    
    if (activeScrollSourceRef.current && activeScrollSourceRef.current !== target) {
      return; // Ignore programmatically triggered scrolls to avoid feedback loops
    }
    
    activeScrollSourceRef.current = target;
    const top = target.scrollTop;

    // Synchronize to Left, Right, or Center depending on which one was scrolled
    const isLeft = target === leftPaneContainerRef.current;
    const isRight = target === rightPaneContainerRef.current;
    const isMiddleRaw = target === textareaRef.current;
    const isMiddleVisual = target === middlePaneContainerRef.current;
    const isMiddle = isMiddleRaw || isMiddleVisual;

    let leftTop = 0;
    let rightTop = 0;
    let middleTop = 0;

    if (isLeft) {
      leftTop = top;
      rightTop = top; // Left and Right are 1:1 identical in block lines layout
      middleTop = mapScrollBetweenPanes(top, leftBlockLines, middleBlockLines);
    } else if (isRight) {
      leftTop = top; // Left and Right are 1:1 identical in block lines layout
      rightTop = top;
      middleTop = mapScrollBetweenPanes(top, leftBlockLines, middleBlockLines);
    } else if (isMiddle) {
      middleTop = top;
      leftTop = mapScrollBetweenPanes(top, middleBlockLines, leftBlockLines);
      rightTop = leftTop;
    }

    // Scroll other containers programmatically
    if (!isLeft && leftPaneContainerRef.current) {
      leftPaneContainerRef.current.scrollTop = leftTop;
    }
    if (!isRight && rightPaneContainerRef.current) {
      rightPaneContainerRef.current.scrollTop = rightTop;
    }
    if (!isMiddleRaw && textareaRef.current) {
      textareaRef.current.scrollTop = middleTop;
    }
    if (!isMiddleVisual && middlePaneContainerRef.current) {
      middlePaneContainerRef.current.scrollTop = middleTop;
    }

    // Synchronize middle line numbers container perfectly with the scrolled element
    if (middleLineNumbersRef.current) {
      middleLineNumbersRef.current.scrollTop = middleTop;
    }

    window.requestAnimationFrame(() => {
      activeScrollSourceRef.current = null;
    });
  };

  // 3-way Search states
  const [stateLeftSearch, setStateLeftSearch] = React.useState({
    isOpen: false,
    query: '',
    matchCase: false,
    wholeWord: false,
    useRegex: false,
    activeIndex: 0
  });

  const [stateRightSearch, setStateRightSearch] = React.useState({
    isOpen: false,
    query: '',
    matchCase: false,
    wholeWord: false,
    useRegex: false,
    activeIndex: 0
  });

  const [stateResultSearch, setStateResultSearch] = React.useState({
    isOpen: false,
    query: '',
    matchCase: false,
    wholeWord: false,
    useRegex: false,
    activeIndex: 0
  });

  // Reference hooks
  const leftPaneContainerRef = React.useRef<HTMLDivElement>(null);
  const rightPaneContainerRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const middleLineNumbersRef = React.useRef<HTMLDivElement>(null);
  const middlePaneContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (conflicts.length > 0 && (!selectedFile || !conflicts.some(c => c.filepath === selectedFile.filepath))) {
      setSelectedFile(conflicts[0]);
    }
  }, [conflicts, selectedFile]);

  // Read current active file content and initialize UI
  const activeContent = React.useMemo(() => {
    if (!selectedFile) return '';
    return getContentWithConflictMarkers(selectedFile);
  }, [selectedFile]);

  const blocks = React.useMemo(() => {
    return parseConflictFile(activeContent);
  }, [activeContent]);

  // Analyze activeContent structure once to distinguish line origins in preview
  const conflictAnalysis = React.useMemo(() => {
    const ours = new Set<string>();
    const theirs = new Set<string>();
    const common = new Set<string>();

    if (!activeContent) return { ours, theirs, common };

    const lines = activeContent.split('\n');
    let state: 'common' | 'ours' | 'theirs' = 'common';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (rawLine.startsWith('<<<<<<<')) {
        state = 'ours';
      } else if (rawLine.startsWith('=======')) {
        state = 'theirs';
      } else if (rawLine.startsWith('>>>>>>>')) {
        state = 'common';
      } else {
        if (line) {
          if (state === 'common') {
            common.add(line);
          } else if (state === 'ours') {
            ours.add(line);
          } else if (state === 'theirs') {
            theirs.add(line);
          }
        }
      }
    }

    return { ours, theirs, common };
  }, [activeContent]);

  // For each block, calculate the start line index in left pane (and right pane):
  const leftBlockLines = React.useMemo(() => {
    let currentLine = 0;
    return blocks.map((block) => {
      const startLine = currentLine;
      if (block.type === 'normal') {
        const linesCount = block.commonText ? block.commonText.split('\n').length : 1;
        currentLine += linesCount;
        return { startLine, height: linesCount };
      } else {
        const oursCount = block.oursText ? block.oursText.split('\n').length : 1;
        const theirsCount = block.theirsText ? block.theirsText.split('\n').length : 1;
        const maxLines = Math.max(oursCount, theirsCount);
        currentLine += maxLines;
        return { startLine, height: maxLines };
      }
    });
  }, [blocks]);

  // For each block, calculate start line index inside middle (result) textarea editor:
  const middleBlockLines = React.useMemo(() => {
    let currentLine = 0;
    return blocks.map((block, idx) => {
      const startLine = currentLine;
      if (block.type === 'normal') {
        const linesCount = block.commonText ? block.commonText.split('\n').length : 1;
        currentLine += linesCount;
        return { startLine, height: linesCount };
      } else {
        const choice = blockChoices[idx] || { left: 'pending', right: 'pending' };
        let linesCount = 0;
        if (choice.left === 'accepted' && choice.right === 'accepted') {
          const oursCount = block.oursText ? block.oursText.split('\n').length : 1;
          const theirsCount = block.theirsText ? block.theirsText.split('\n').length : 1;
          linesCount = oursCount + theirsCount;
        } else if (choice.left === 'accepted') {
          linesCount = block.oursText ? block.oursText.split('\n').length : 1;
        } else if (choice.right === 'accepted') {
          linesCount = block.theirsText ? block.theirsText.split('\n').length : 1;
        } else if (choice.left === 'ignored' && choice.right === 'ignored') {
          linesCount = 0;
        } else if (choice.left === 'ignored' && choice.right === 'pending') {
          linesCount = block.theirsText ? block.theirsText.split('\n').length : 1;
        } else if (choice.right === 'ignored' && choice.left === 'pending') {
          linesCount = block.oursText ? block.oursText.split('\n').length : 1;
        } else {
          const oursCount = block.oursText ? block.oursText.split('\n').length : 1;
          const theirsCount = block.theirsText ? block.theirsText.split('\n').length : 1;
          linesCount = oursCount + theirsCount + 3;
        }
        currentLine += linesCount;
        return { startLine, height: linesCount };
      }
    });
  }, [blocks, blockChoices]);

  // Parse arrays of lines sequentially to find matches easily in left and right lanes
  const leftLines = React.useMemo(() => {
    const linesList: { text: string; blockIdx: number; lineIdxInBlock: number; isConflict: boolean }[] = [];
    blocks.forEach((block, bIdx) => {
      if (block.type === 'normal') {
        const lines = block.commonText ? block.commonText.split('\n') : [''];
        lines.forEach((line, lIdx) => {
          linesList.push({ text: line, blockIdx: bIdx, lineIdxInBlock: lIdx, isConflict: false });
        });
      } else {
        const oursLines = block.oursText ? block.oursText.split('\n') : [''];
        oursLines.forEach((line, lIdx) => {
          linesList.push({ text: line, blockIdx: bIdx, lineIdxInBlock: lIdx, isConflict: true });
        });
      }
    });
    return linesList;
  }, [blocks]);

  const rightLines = React.useMemo(() => {
    const linesList: { text: string; blockIdx: number; lineIdxInBlock: number; isConflict: boolean }[] = [];
    blocks.forEach((block, bIdx) => {
      if (block.type === 'normal') {
        const lines = block.commonText ? block.commonText.split('\n') : [''];
        lines.forEach((line, lIdx) => {
          linesList.push({ text: line, blockIdx: bIdx, lineIdxInBlock: lIdx, isConflict: false });
        });
      } else {
        const theirsLines = block.theirsText ? block.theirsText.split('\n') : [''];
        theirsLines.forEach((line, lIdx) => {
          linesList.push({ text: line, blockIdx: bIdx, lineIdxInBlock: lIdx, isConflict: true });
        });
      }
    });
    return linesList;
  }, [blocks]);

  // Calculate Matches in our lanes using high performance regex generators
  const leftMatches = React.useMemo(() => {
    if (!stateLeftSearch.isOpen || !stateLeftSearch.query) return [];
    const regex = getSearchRegex(stateLeftSearch.query, stateLeftSearch.matchCase, stateLeftSearch.wholeWord, stateLeftSearch.useRegex);
    if (!regex) return [];

    const matches: { globalLineIdx: number; start: number; end: number; text: string; globalMatchIdx: number }[] = [];
    leftLines.forEach((lineObj, globalLineIdx) => {
      const text = lineObj.text;
      regex.lastIndex = 0;
      let match;
      if (regex.global) {
        while ((match = regex.exec(text)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            globalMatchIdx: matches.length
          });
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            globalMatchIdx: matches.length
          });
        }
      }
    });
    return matches;
  }, [leftLines, stateLeftSearch.isOpen, stateLeftSearch.query, stateLeftSearch.matchCase, stateLeftSearch.wholeWord, stateLeftSearch.useRegex]);

  const leftMatchesByLine = React.useMemo(() => {
    const map: Record<number, typeof leftMatches> = {};
    leftMatches.forEach(m => {
      if (!map[m.globalLineIdx]) {
        map[m.globalLineIdx] = [];
      }
      map[m.globalLineIdx].push(m);
    });
    return map;
  }, [leftMatches]);

  const rightMatches = React.useMemo(() => {
    if (!stateRightSearch.isOpen || !stateRightSearch.query) return [];
    const regex = getSearchRegex(stateRightSearch.query, stateRightSearch.matchCase, stateRightSearch.wholeWord, stateRightSearch.useRegex);
    if (!regex) return [];

    const matches: { globalLineIdx: number; start: number; end: number; text: string; globalMatchIdx: number }[] = [];
    rightLines.forEach((lineObj, globalLineIdx) => {
      const text = lineObj.text;
      regex.lastIndex = 0;
      let match;
      if (regex.global) {
        while ((match = regex.exec(text)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            globalMatchIdx: matches.length
          });
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            globalMatchIdx: matches.length
          });
        }
      }
    });
    return matches;
  }, [rightLines, stateRightSearch.isOpen, stateRightSearch.query, stateRightSearch.matchCase, stateRightSearch.wholeWord, stateRightSearch.useRegex]);

  const rightMatchesByLine = React.useMemo(() => {
    const map: Record<number, typeof rightMatches> = {};
    rightMatches.forEach(m => {
      if (!map[m.globalLineIdx]) {
        map[m.globalLineIdx] = [];
      }
      map[m.globalLineIdx].push(m);
    });
    return map;
  }, [rightMatches]);

  const middleMatches = React.useMemo(() => {
    if (!stateResultSearch.isOpen || !stateResultSearch.query) return [];
    const regex = getSearchRegex(stateResultSearch.query, stateResultSearch.matchCase, stateResultSearch.wholeWord, stateResultSearch.useRegex);
    if (!regex) return [];

    const matches: { start: number; end: number; text: string }[] = [];
    regex.lastIndex = 0;
    let match;
    if (regex.global) {
      while ((match = regex.exec(editorText)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    } else {
      match = regex.exec(editorText);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    }
    return matches;
  }, [editorText, stateResultSearch.isOpen, stateResultSearch.query, stateResultSearch.matchCase, stateResultSearch.wholeWord, stateResultSearch.useRegex]);

  // Handle auto scrolling into view for search navigation
  React.useEffect(() => {
    if (stateLeftSearch.isOpen && leftPaneContainerRef.current && leftMatches.length > 0) {
      const activeIdx = stateLeftSearch.activeIndex;
      if (activeIdx >= 0 && activeIdx < leftMatches.length) {
        const match = leftMatches[activeIdx];
        const lineEl = leftPaneContainerRef.current.querySelector(`[data-left-line="${match.globalLineIdx}"]`);
        if (lineEl) {
          lineEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      }
    }
  }, [stateLeftSearch.isOpen, stateLeftSearch.activeIndex, leftMatches]);

  React.useEffect(() => {
    if (stateRightSearch.isOpen && rightPaneContainerRef.current && rightMatches.length > 0) {
      const activeIdx = stateRightSearch.activeIndex;
      if (activeIdx >= 0 && activeIdx < rightMatches.length) {
        const match = rightMatches[activeIdx];
        const lineEl = rightPaneContainerRef.current.querySelector(`[data-right-line="${match.globalLineIdx}"]`);
        if (lineEl) {
          lineEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      }
    }
  }, [stateRightSearch.isOpen, stateRightSearch.activeIndex, rightMatches]);

  React.useEffect(() => {
    if (stateResultSearch.isOpen && textareaRef.current && middleMatches.length > 0) {
      const activeIdx = stateResultSearch.activeIndex;
      if (activeIdx >= 0 && activeIdx < middleMatches.length) {
        const match = middleMatches[activeIdx];
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(match.start, match.end);

        // Center on matched line inside result pane
        const textToMatch = editorText.substring(0, match.start);
        const linesBefore = textToMatch.split('\n').length;
        const lineHeight = 20;
        const textarea = textareaRef.current;
        const targetScrollTop = (linesBefore - 1) * lineHeight - (textarea.clientHeight / 2);
        textarea.scrollTop = Math.max(0, targetScrollTop);
      }
    }
  }, [stateResultSearch.isOpen, stateResultSearch.activeIndex, middleMatches, editorText]);

  // Utility to render text strings with matching highlights
  const renderLineWithHighlight = (
    lineText: string,
    globalLineIdx: number,
    paneMatchesOrLineMatches: any[],
    paneActiveIdx: number
  ) => {
    if (!paneMatchesOrLineMatches || paneMatchesOrLineMatches.length === 0) {
      return <span>{lineText || '\u00A0'}</span>;
    }

    // Determine if we need to filter (backward compatibility fallback)
    let lineMatches = paneMatchesOrLineMatches;
    if (paneMatchesOrLineMatches[0] && paneMatchesOrLineMatches[0].globalLineIdx !== undefined && paneMatchesOrLineMatches[0].globalLineIdx !== globalLineIdx) {
      // Filter if it's not pre-filtered
      lineMatches = paneMatchesOrLineMatches.filter(m => m.globalLineIdx === globalLineIdx);
    }

    if (lineMatches.length === 0) {
      return <span>{lineText || '\u00A0'}</span>;
    }

    const sortedMatches = [...lineMatches].sort((a, b) => a.start - b.start);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((m) => {
      // Use precomputed index, or fallback to indexOf if not set
      const globalMatchIndex = m.globalMatchIdx !== undefined ? m.globalMatchIdx : paneMatchesOrLineMatches.indexOf(m);
      const isActive = globalMatchIndex === paneActiveIdx;

      if (m.start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {lineText.substring(lastIndex, m.start)}
          </span>
        );
      }

      elements.push(
        <mark
          key={`match-${m.start}`}
          className={`px-0.5 rounded font-bold transition-all select-text ${
            isActive
              ? 'bg-[#214283] text-white ring-2 ring-blue-400'
              : isLight
                ? 'bg-amber-300 text-slate-900 border border-amber-400/60'
                : 'bg-amber-500/30 text-[#e8eef5] ring-1 ring-amber-500/40'
          }`}
        >
          {lineText.substring(m.start, m.end)}
        </mark>
      );

      lastIndex = m.end;
    });

    if (lastIndex < lineText.length) {
      elements.push(
        <span key={`text-end`}>
          {lineText.substring(lastIndex)}
        </span>
      );
    }

    return <>{elements}</>;
  };

  const getMergedContent = React.useCallback((
    choices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>,
    customTexts: Record<number, string> = {},
    orderRecord: Record<number, 'left' | 'right' | null> = acceptOrder
  ) => {
    return blocks.map((block, idx) => {
      if (block.type === 'normal') {
        return block.commonText;
      } else {
        const choice = choices[idx] || { left: 'pending', right: 'pending' };
        
        // If there's custom text entered for this block
        if (customTexts[idx] !== undefined && customTexts[idx] !== '') {
          return customTexts[idx];
        }

        // If both accepted
        if (choice.left === 'accepted' && choice.right === 'accepted') {
          const order = orderRecord[idx];
          if (order === 'right') {
            // Right was accepted first, so Left goes under Right
            return `${block.theirsText}\n${block.oursText}`;
          }
          // Default or Left was accepted first, so Right goes under Left
          return `${block.oursText}\n${block.theirsText}`;
        }
        // If left accepted
        if (choice.left === 'accepted') {
          return block.oursText;
        }
        // If right accepted
        if (choice.right === 'accepted') {
          return block.theirsText;
        }
        // If both ignored
        if (choice.left === 'ignored' && choice.right === 'ignored') {
          return '';
        }
        // If left ignored, right pending
        if (choice.left === 'ignored' && choice.right === 'pending') {
          return block.theirsText;
        }
        // If right ignored, left pending
        if (choice.right === 'ignored' && choice.left === 'pending') {
          return block.oursText;
        }
        // Both pending -> blank/empty like in JetBrains!
        return '';
      }
    }).join('\n');
  }, [blocks, acceptOrder]);

  const handleResolveBlockAi = async (bIdx: number) => {
    const block = blocks[bIdx];
    if (!block || block.type !== 'conflict') return;

    setBlockAiLoading(prev => ({ ...prev, [bIdx]: true }));
    try {
      const response = await fetch('/api/resolve-block-ai', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          filepath: selectedFile?.filepath || 'source_code',
          oursText: block.oursText || '',
          theirsText: block.theirsText || '',
          tone: tone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resolve block conflict');
      }

      const data = await response.json();
      
      pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
      
      // Update block choice to accepted/accepted
      const updatedChoices = { ...blockChoices };
      updatedChoices[bIdx] = { left: 'accepted', right: 'accepted' };
      setBlockChoices(updatedChoices);

      // Update block's custom text with the AI resolved content
      const updatedCustoms = { ...customBlockTexts };
      updatedCustoms[bIdx] = data.resolvedContent;
      setCustomBlockTexts(updatedCustoms);

      // Update explanation if any
      setBlockAiExplanations(prev => ({ ...prev, [bIdx]: data.explanation }));
      setBlockAiApplied(prev => ({ ...prev, [bIdx]: true }));

      // Sync master editorText
      setEditorText(getMergedContent(updatedChoices, updatedCustoms));
    } catch (err) {
      console.error("Failed to AI resolve block:", err);
    } finally {
      setBlockAiLoading(prev => ({ ...prev, [bIdx]: false }));
    }
  };

  React.useEffect(() => {
    // Reset our search fields on file selection transition
    setStateLeftSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateRightSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateResultSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));

    // Reset AI states
    setAiExplanation(null);
    setAiProposedContent(null);
    setAiError(null);
    setIsAiLoading(false);
    setWasAiApplied(false);

    setBlockAiLoading({});
    setBlockAiExplanations({});
    setBlockAiApplied({});
    setAcceptOrder({});
    setHistory([]);

    if (selectedFile) {
      const initialChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }> = {};
      const initialCustoms: Record<number, string> = {};
      const initialAnalyses: Record<number, ConflictBlockAnalysis> = {};

      if (selectedFile.isResolved && selectedFile.resolvedContent) {
        setEditorText(selectedFile.resolvedContent);
        blocks.forEach((b, i) => {
          if (b.type === 'conflict') {
            initialChoices[i] = { left: 'accepted', right: 'ignored' };
            initialCustoms[i] = b.oursText || '';
            initialAnalyses[i] = analyzeAndMergeConflictBlock(b);
          }
        });
        setBlockAnalyses(initialAnalyses);
      } else {
        blocks.forEach((b, i) => {
          if (b.type === 'conflict') {
            const analysis = analyzeAndMergeConflictBlock(b);
            initialAnalyses[i] = analysis;

            if (analysis.isNonConflicting || analysis.isSimpleConflict) {
              // Automatically resolve and fill the merge results
              if (b.oursText !== '' && b.theirsText === '') {
                initialChoices[i] = { left: 'accepted', right: 'ignored' };
              } else if (b.theirsText !== '' && b.oursText === '') {
                initialChoices[i] = { left: 'ignored', right: 'accepted' };
              } else {
                initialChoices[i] = { left: 'accepted', right: 'accepted' };
              }
              initialCustoms[i] = analysis.mergedProposal;
            } else {
              initialChoices[i] = { left: 'pending', right: 'pending' };
              initialCustoms[i] = '';
            }
          }
        });
        
        setBlockAnalyses(initialAnalyses);

        const initialMerged = blocks.map((b, i) => {
          if (b.type === 'normal') {
            return b.commonText;
          } else {
            const analysis = initialAnalyses[i];
            if (analysis && (analysis.isNonConflicting || analysis.isSimpleConflict)) {
              return analysis.mergedProposal;
            }
            return ''; // Leave empty for complex conflicts just like JetBrains IDE
          }
        }).join('\n');

        setEditorText(initialMerged);
      }
      setBlockChoices(initialChoices);
      setCustomBlockTexts(initialCustoms);
    } else {
      setEditorText('');
      setBlockChoices({});
      setCustomBlockTexts({});
      setBlockAnalyses({});
    }
  }, [selectedFile?.filepath, blocks]);

  const handleResolveSide = (blockIdx: number, side: 'left' | 'right', action: 'accept' | 'ignore') => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
    const currentChoices = blockChoices[blockIdx] || { left: 'pending', right: 'pending' };
    const updatedChoicesForBlock = { ...currentChoices };

    let nextFirstAccepted = acceptOrder[blockIdx] || null;

    if (side === 'left') {
      if (action === 'accept') {
        updatedChoicesForBlock.left = 'accepted';
        if (currentChoices.right !== 'accepted') {
          nextFirstAccepted = 'left';
        }
      } else {
        updatedChoicesForBlock.left = 'ignored';
        if (nextFirstAccepted === 'left') {
          nextFirstAccepted = null;
        }
      }
    } else {
      if (action === 'accept') {
        updatedChoicesForBlock.right = 'accepted';
        if (currentChoices.left !== 'accepted') {
          nextFirstAccepted = 'right';
        }
      } else {
        updatedChoicesForBlock.right = 'ignored';
        if (nextFirstAccepted === 'right') {
          nextFirstAccepted = null;
        }
      }
    }

    const updatedAcceptOrder = { ...acceptOrder, [blockIdx]: nextFirstAccepted };
    setAcceptOrder(updatedAcceptOrder);

    const nextChoices = { ...blockChoices, [blockIdx]: updatedChoicesForBlock };
    setBlockChoices(nextChoices);

    const nextCustoms = { ...customBlockTexts };
    if (action === 'accept') {
      if (side === 'left') {
        if (currentChoices.right === 'accepted') {
          // Right was accepted first, so Left goes under Right
          nextCustoms[blockIdx] = `${blocks[blockIdx].theirsText || ''}\n${blocks[blockIdx].oursText || ''}`;
        } else {
          nextCustoms[blockIdx] = blocks[blockIdx].oursText || '';
        }
      } else {
        if (currentChoices.left === 'accepted') {
          // Left was accepted first, so Right goes under Left
          nextCustoms[blockIdx] = `${blocks[blockIdx].oursText || ''}\n${blocks[blockIdx].theirsText || ''}`;
        } else {
          nextCustoms[blockIdx] = blocks[blockIdx].theirsText || '';
        }
      }
    } else {
      // action === 'ignore'
      if (side === 'left') {
        if (updatedChoicesForBlock.right === 'accepted') {
          nextCustoms[blockIdx] = blocks[blockIdx].theirsText || '';
        } else {
          nextCustoms[blockIdx] = '';
        }
      } else {
        if (updatedChoicesForBlock.left === 'accepted') {
          nextCustoms[blockIdx] = blocks[blockIdx].oursText || '';
        } else {
          nextCustoms[blockIdx] = '';
        }
      }
    }
    setCustomBlockTexts(nextCustoms);

    setEditorText(getMergedContent(nextChoices, nextCustoms, updatedAcceptOrder));
  };

  const handleApplyLeft = () => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
    const nextChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }> = {};
    const nextCustoms: Record<number, string> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        nextChoices[idx] = { left: 'accepted', right: 'ignored' };
        nextCustoms[idx] = block.oursText || '';
      }
    });
    setBlockChoices(nextChoices);
    setCustomBlockTexts(nextCustoms);
    setEditorText(getMergedContent(nextChoices, nextCustoms));
  };

  const handleApplyRight = () => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
    const nextChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }> = {};
    const nextCustoms: Record<number, string> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        nextChoices[idx] = { left: 'ignored', right: 'accepted' };
        nextCustoms[idx] = block.theirsText || '';
      }
    });
    setBlockChoices(nextChoices);
    setCustomBlockTexts(nextCustoms);
    setEditorText(getMergedContent(nextChoices, nextCustoms));
  };

  const handleApplyBoth = () => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
    const nextChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }> = {};
    const nextCustoms: Record<number, string> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        nextChoices[idx] = { left: 'accepted', right: 'accepted' };
        nextCustoms[idx] = `${block.oursText}\n${block.theirsText}`;
      }
    });
    setBlockChoices(nextChoices);
    setCustomBlockTexts(nextCustoms);
    setEditorText(getMergedContent(nextChoices, nextCustoms));
  };

  const handleResetMerge = () => {
    pushCurrentToHistory(blockChoices, customBlockTexts, acceptOrder, editorText);
    const nextChoices: Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }> = {};
    const nextCustoms: Record<number, string> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        nextChoices[idx] = { left: 'pending', right: 'pending' };
        nextCustoms[idx] = '';
      }
    });
    setBlockChoices(nextChoices);
    setCustomBlockTexts(nextCustoms);
    const initialMerged = getMergedContent(nextChoices, nextCustoms);
    setEditorText(initialMerged);
  };

  const handleResolveSubmit = () => {
    if (!selectedFile) return;
    onResolveFile(selectedFile.filepath, editorText);

    // Auto select next unresolved file
    const remainingUnresolved = conflicts.filter(
      c => c.filepath !== selectedFile.filepath && !c.isResolved
    );

    if (remainingUnresolved.length > 0) {
      setSelectedFile(remainingUnresolved[0]);
    } else {
      onCompleteRecovery();
    }
  };

  const allResolved = conflicts.length > 0 && conflicts.every(c => c.isResolved);
  const loc = localization[tone] || localization[TranslationTone.PROFESSIONAL];

  const countOccurrences = (str: string, substr: string) => {
    return str.split(substr).length - 1;
  };
  const hasPendingBlocks = blocks.some((b, i) => b.type === 'conflict' && (blockChoices[i]?.left === 'pending' || blockChoices[i]?.right === 'pending'));
  const isCurrentlyDirty = editMode === 'jetbrains'
    ? hasPendingBlocks
    : (editorText.includes('<<<<<<<') || editorText.includes('=======') || editorText.includes('>>>>>>>'));

  const getBlockVal = React.useCallback((bIdx: number, block: CodeBlock): string => {
    const choice = blockChoices[bIdx] || { left: 'pending', right: 'pending' };
    
    // Get current text value for this block
    let blockVal = customBlockTexts[bIdx] !== undefined ? customBlockTexts[bIdx] : '';

    // Fallback if not customized but side is approved
    if (customBlockTexts[bIdx] === undefined || customBlockTexts[bIdx] === '') {
      if (choice.left === 'accepted' && choice.right === 'accepted') {
        const order = acceptOrder[bIdx];
        if (order === 'right') {
          blockVal = `${block.theirsText}\n${block.oursText}`;
        } else {
          blockVal = `${block.oursText}\n${block.theirsText}`;
        }
      } else if (choice.left === 'accepted') {
        blockVal = block.oursText || '';
      } else if (choice.right === 'accepted') {
        blockVal = block.theirsText || '';
      } else if (choice.left === 'ignored' && choice.right === 'ignored') {
        blockVal = '';
      } else if (choice.left === 'ignored' && choice.right === 'pending') {
        blockVal = block.theirsText || '';
      } else if (choice.right === 'ignored' && choice.left === 'pending') {
        blockVal = block.oursText || '';
      } else {
        blockVal = ''; // Pending -> totally blank like in JetBrains!
      }
    }
    return blockVal;
  }, [blockChoices, customBlockTexts, acceptOrder]);

  const totalMarkerBlocks = editMode === 'jetbrains'
    ? blocks.filter((b, i) => b.type === 'conflict' && (blockChoices[i]?.left === 'pending' || blockChoices[i]?.right === 'pending')).length
    : countOccurrences(editorText, '<<<<<<<');

  const renderLeftPane = () => {
    let lineNum = 1;
    let globalLineCounter = 0;
    return (
      <div className={`font-mono text-[11px] leading-5 w-full pt-3 pb-8 ${isLight ? 'text-slate-705 bg-[#f8f9fa]' : 'text-slate-300'}`}>
        {blocks.map((block, bIdx) => {
          if (block.type === 'normal') {
            const lines = block.commonText ? block.commonText.split('\n') : [''];
            return lines.map((line, lIdx) => {
              const currNum = lineNum++;
              const currentGlobalLineIdx = globalLineCounter++;
              return (
                <div 
                  key={`n-L-${bIdx}-${lIdx}`} 
                  data-left-line={currentGlobalLineIdx}
                  className={`flex min-h-[20px] items-center animate-fade-in ${
                    isLight ? 'hover:bg-slate-205/50' : 'hover:bg-[#202124]/40'
                  }`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}
                >
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[10px] shrink-0 ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#16171a] border-[#2d2f3c]/60 text-slate-600'
                  }`}>
                    {currNum}
                  </div>
                  <div className={`pl-3 select-text whitespace-pre font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                    {renderLineWithHighlight(line, currentGlobalLineIdx, leftMatchesByLine[currentGlobalLineIdx] || [], stateLeftSearch.activeIndex)}
                  </div>
                </div>
              );
            });
          } else {
            const oursLines = block.oursText ? block.oursText.split('\n') : [''];
            const theirsLines = block.theirsText ? block.theirsText.split('\n') : [''];
            const maxLines = Math.max(oursLines.length, theirsLines.length);
            const choice = blockChoices[bIdx] || { left: 'pending', right: 'pending' };
            const blockVal = getBlockVal(bIdx, block);

            return Array.from({ length: maxLines }).map((_, lIdx) => {
              const line = oursLines[lIdx];
              const hasLine = lIdx < oursLines.length;
              const currNum = hasLine ? lineNum++ : '';
              const currentGlobalLineIdx = globalLineCounter++;
              
              const isIgnored = choice.left === 'ignored';
              const isLineInMerged = hasLine && blockVal.split('\n').includes(line || '');
              const isGrayLine = !hasLine && lIdx < theirsLines.length && blockVal.split('\n').includes(theirsLines[lIdx] || '');
              
              return (
                <div 
                  key={`c-L-${bIdx}-${lIdx}`} 
                  data-left-line={currentGlobalLineIdx}
                  className={`flex relative min-h-[20px] items-center ${
                    isIgnored
                      ? isLight
                        ? 'bg-slate-100/70 text-slate-400/85 border-l-2 border-slate-300 line-through decoration-slate-400'
                        : 'bg-slate-900/40 text-slate-500/80 border-l-2 border-slate-700/50 line-through decoration-slate-600/50'
                      : hasLine
                        ? isLineInMerged
                          ? isLight 
                            ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500'
                            : 'bg-emerald-950/20 text-emerald-400 border-l-2 border-emerald-500/80'
                          : isLight
                            ? 'bg-rose-50 text-rose-800 border-l-2 border-rose-450'
                            : 'bg-rose-950/20 text-[#f28b82] border-l-2 border-rose-500/80'
                        : isGrayLine
                          ? isLight
                            ? 'bg-slate-100/50 text-slate-450 border-l-2 border-dashed border-slate-350'
                            : 'bg-[#1b1c23]/60 text-slate-500/80 border-l-2 border-dashed border-[#2d2f3c]'
                          : ''
                  }`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}
                >
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[10px] font-bold shrink-0 ${
                    isIgnored
                      ? isLight
                        ? 'text-slate-400 bg-slate-100/40 border-slate-200/50'
                        : 'text-slate-600 bg-slate-900/20 border-[#2d2f3c]/60'
                      : hasLine
                        ? isLineInMerged
                          ? isLight 
                            ? 'text-emerald-700 bg-emerald-100/50 border-emerald-200' 
                            : 'text-emerald-550 bg-emerald-950/30 border-emerald-550/40'
                          : isLight 
                            ? 'text-rose-700 bg-rose-100/50 border-rose-200' 
                            : 'text-rose-550 bg-rose-950/30 border-[#2d2f3c]/60'
                        : isGrayLine
                          ? isLight
                            ? 'text-slate-405 bg-slate-100/60 border-slate-200'
                            : 'text-slate-550 bg-[#1b1c23] border-[#2d2f3c]/60'
                          : isLight
                            ? 'text-slate-400 bg-slate-50 border-slate-200'
                            : 'text-slate-605 bg-[#17181c] border-[#2d2f3c]/60'
                  }`}>
                    {currNum || '\u00A0'}
                  </div>
                  <div className="pl-3 flex-1 select-text whitespace-pre pr-24 font-medium font-mono">
                    {hasLine ? renderLineWithHighlight(line, currentGlobalLineIdx, leftMatchesByLine[currentGlobalLineIdx] || [], stateLeftSearch.activeIndex) : ''}
                  </div>

                  {hasLine && lIdx === 0 && choice.left === 'pending' && (
                    <div className="absolute right-2 z-15 flex gap-1 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveSide(bIdx, 'left', 'accept');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-505 hover:scale-105 active:scale-95 text-white font-mono px-2 py-0.5 rounded text-xs font-black shadow cursor-pointer transition-all flex items-center justify-center"
                        title={loc.btnOurs}
                      >
                        »
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlockAi(bIdx);
                        }}
                        disabled={blockAiLoading[bIdx]}
                        className={`px-1.5 py-0.5 rounded text-xs font-black shadow cursor-pointer transition-all flex items-center justify-center border hover:scale-105 active:scale-95 ${
                          blockAiLoading[bIdx]
                            ? 'bg-violet-950/20 text-violet-400 border-violet-500/20 animate-pulse'
                            : isLight
                              ? 'bg-violet-50 hover:bg-violet-100 text-violet-600 border-violet-200'
                              : 'bg-violet-900/30 hover:bg-violet-900/50 text-violet-300 border-violet-500/30'
                        }`}
                        title={
                          tone === TranslationTone.ENGLISH
                            ? "AI Proposed Resolve (Smart Merge)"
                            : tone === TranslationTone.TOXIC
                              ? "🤖 Để bố AI giải bùa hộ mày cái!"
                              : tone === TranslationTone.JOKE
                                ? "🤖 Nhờ vả sư phụ AI gộp hộ"
                                : "🤖 Đề xuất gộp thông minh bằng AI"
                        }
                      >
                        {blockAiLoading[bIdx] ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-violet-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveSide(bIdx, 'left', 'ignore');
                        }}
                        className={`px-2 py-0.5 font-bold rounded text-xs border cursor-pointer transition-colors ${
                          isLight 
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300' 
                            : 'bg-[#2d2f3c] border-[#3f4152] text-slate-300 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800'
                        }`}
                        title="Ignore block (Reject)"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              );
            });
          }
        })}
      </div>
    );
  };

  // Render Right Code column
  const renderRightPane = () => {
    let lineNum = 1;
    let globalLineCounter = 0;
    return (
      <div className={`font-mono text-[11px] leading-5 w-full pt-3 pb-8 ${isLight ? 'text-slate-705 bg-[#f8f9fa]' : 'text-slate-300'}`}>
        {blocks.map((block, bIdx) => {
          if (block.type === 'normal') {
            const lines = block.commonText ? block.commonText.split('\n') : [''];
            return lines.map((line, lIdx) => {
              const currNum = lineNum++;
              const currentGlobalLineIdx = globalLineCounter++;
              return (
                <div 
                  key={`n-R-${bIdx}-${lIdx}`} 
                  data-right-line={currentGlobalLineIdx}
                  className={`flex min-h-[20px] items-center animate-fade-in ${
                    isLight ? 'hover:bg-slate-205/50' : 'hover:bg-[#202124]/40'
                  }`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}
                >
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[10px] shrink-0 ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#16171a] border-[#2d2f3c]/60 text-slate-600'
                  }`}>
                    {currNum}
                  </div>
                  <div className={`pl-3 select-text whitespace-pre font-mono ${isLight ? 'text-slate-800' : 'text-slate-400'}`}>
                    {renderLineWithHighlight(line, currentGlobalLineIdx, rightMatchesByLine[currentGlobalLineIdx] || [], stateRightSearch.activeIndex)}
                  </div>
                </div>
              );
            });
          } else {
            const oursLines = block.oursText ? block.oursText.split('\n') : [''];
            const theirsLines = block.theirsText ? block.theirsText.split('\n') : [''];
            const maxLines = Math.max(oursLines.length, theirsLines.length);
            const choice = blockChoices[bIdx] || { left: 'pending', right: 'pending' };
            const blockVal = getBlockVal(bIdx, block);

            return Array.from({ length: maxLines }).map((_, lIdx) => {
              const line = theirsLines[lIdx];
              const hasLine = lIdx < theirsLines.length;
              const currNum = hasLine ? lineNum++ : '';
              const currentGlobalLineIdx = globalLineCounter++;
              
              const isIgnored = choice.right === 'ignored';
              const isLineInMerged = hasLine && blockVal.split('\n').includes(line || '');
              const isGrayLine = !hasLine && lIdx < oursLines.length && blockVal.split('\n').includes(oursLines[lIdx] || '');
              
              return (
                <div 
                  key={`c-R-${bIdx}-${lIdx}`} 
                  data-right-line={currentGlobalLineIdx}
                  className={`flex relative min-h-[20px] items-center ${
                    isIgnored
                      ? isLight
                        ? 'bg-slate-100/70 text-slate-400/85 border-r-2 border-slate-300 line-through decoration-slate-400'
                        : 'bg-slate-900/40 text-slate-500/80 border-r-2 border-slate-700/50 line-through decoration-slate-600/50'
                      : hasLine
                        ? isLineInMerged
                          ? isLight 
                            ? 'bg-emerald-50 text-emerald-800 border-r-2 border-emerald-500'
                            : 'bg-emerald-950/20 text-emerald-400 border-r-2 border-emerald-500/80'
                          : isLight
                            ? 'bg-rose-50 text-rose-800 border-r-2 border-rose-450'
                            : 'bg-rose-950/20 text-[#f28b82] border-r-2 border-rose-500/80'
                        : isGrayLine
                          ? isLight
                            ? 'bg-slate-100/50 text-slate-450 border-r-2 border-dashed border-slate-350'
                            : 'bg-[#1b1c23]/60 text-slate-500/80 border-r-2 border-dashed border-[#2d2f3c]'
                          : ''
                  }`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}
                >
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[10px] font-bold shrink-0 ${
                    isIgnored
                      ? isLight
                        ? 'text-slate-400 bg-slate-100/40 border-slate-205/50'
                        : 'text-slate-600 bg-slate-900/20 border-[#2d2f3c]/60'
                      : hasLine
                        ? isLineInMerged
                          ? isLight 
                            ? 'text-emerald-700 bg-emerald-100/50 border-emerald-200' 
                            : 'text-emerald-550 bg-emerald-950/30 border-emerald-550/40'
                          : isLight 
                            ? 'text-rose-750 bg-rose-100/50 border-rose-200' 
                            : 'text-rose-550 bg-rose-950/30 border-[#2d2f3c]/60'
                        : isGrayLine
                          ? isLight
                            ? 'text-slate-405 bg-slate-100/60 border-slate-200'
                            : 'text-slate-550 bg-[#1b1c23] border-[#2d2f3c]/60'
                          : isLight
                            ? 'text-slate-405 bg-slate-50 border-slate-200'
                            : 'text-slate-605 bg-[#17181c] border-[#2d2f3c]/60'
                  }`}>
                    {currNum || '\u00A0'}
                  </div>
                  <div className="pl-3 flex-1 select-text whitespace-pre pr-24 font-medium font-mono">
                    {hasLine ? renderLineWithHighlight(line, currentGlobalLineIdx, rightMatchesByLine[currentGlobalLineIdx] || [], stateRightSearch.activeIndex) : ''}
                  </div>

                  {hasLine && lIdx === 0 && choice.right === 'pending' && (
                    <div className="absolute right-2 z-15 flex gap-1 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveSide(bIdx, 'right', 'accept');
                        }}
                        className="bg-amber-600 hover:bg-amber-500 hover:scale-105 active:scale-95 text-slate-950 font-mono px-2 py-0.5 rounded text-xs font-black shadow cursor-pointer transition-all flex items-center justify-center"
                        title={loc.btnTheirs}
                      >
                        «
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlockAi(bIdx);
                        }}
                        disabled={blockAiLoading[bIdx]}
                        className={`px-1.5 py-0.5 rounded text-xs font-black shadow cursor-pointer transition-all flex items-center justify-center border hover:scale-105 active:scale-95 ${
                          blockAiLoading[bIdx]
                            ? 'bg-violet-950/20 text-violet-400 border-violet-500/20 animate-pulse'
                            : isLight
                              ? 'bg-violet-50 hover:bg-violet-100 text-violet-600 border-violet-200'
                              : 'bg-violet-900/30 hover:bg-violet-900/50 text-violet-300 border-violet-500/30'
                        }`}
                        title={
                          tone === TranslationTone.ENGLISH
                            ? "AI Proposed Resolve (Smart Merge)"
                            : tone === TranslationTone.TOXIC
                              ? "🤖 Để bố AI giải bùa hộ mày cái!"
                              : tone === TranslationTone.JOKE
                                ? "🤖 Nhờ vả sư phục AI gộp hộ"
                                : "🤖 Đề xuất gộp thông minh bằng AI"
                        }
                      >
                        {blockAiLoading[bIdx] ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-violet-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveSide(bIdx, 'right', 'ignore');
                        }}
                        className={`px-2 py-0.5 font-bold rounded text-xs border cursor-pointer transition-colors ${
                          isLight 
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300' 
                            : 'bg-[#2d2f3c] border-[#3f4152] text-slate-300 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800'
                        }`}
                        title="Ignore block (Reject)"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              );
            });
          }
        })}
      </div>
    );
  };

  const renderMiddlePaneJetBrains = () => {
    let lineNum = 1;
    return (
      <div 
        ref={middlePaneContainerRef}
        onScroll={handleScroll}
        className={`font-mono text-[11px] leading-5 w-full pt-3 pb-8 h-full overflow-y-auto scrollbar-thin select-none ${
          isLight 
            ? 'text-slate-705 bg-white scrollbar-thumb-slate-300' 
            : 'text-slate-300 bg-[#16171d] scrollbar-thumb-slate-800'
        }`}
      >
        {blocks.map((block, bIdx) => {
          if (block.type === 'normal') {
            const lines = block.commonText ? block.commonText.split('\n') : [''];
            return lines.map((line, lIdx) => {
              const currNum = lineNum++;
              return (
                <div 
                  key={`n-M-${bIdx}-${lIdx}`} 
                  className={`flex min-h-[20px] items-center ${
                    isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202124]/40'
                  }`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}
                >
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[10px] shrink-0 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-[#0e0f12] border-[#2d2f3c]/60 text-slate-600'
                  }`}>
                    {currNum}
                  </div>
                  <div className={`pl-3 select-text whitespace-pre font-mono ${isLight ? 'text-[#1e293b]' : 'text-slate-300'}`}>
                    {renderLineWithHighlight(line, currNum, [], stateResultSearch.activeIndex)}
                  </div>
                </div>
              );
            });
          } else {
            const choice = blockChoices[bIdx] || { left: 'pending', right: 'pending' };
            
            // Get current text value for this block
            let blockVal = customBlockTexts[bIdx] !== undefined ? customBlockTexts[bIdx] : '';

            // Fallback if not customized but side is approved
            if (customBlockTexts[bIdx] === undefined || customBlockTexts[bIdx] === '') {
              if (choice.left === 'accepted' && choice.right === 'accepted') {
                const order = acceptOrder[bIdx];
                if (order === 'right') {
                  blockVal = `${block.theirsText}\n${block.oursText}`;
                } else {
                  blockVal = `${block.oursText}\n${block.theirsText}`;
                }
              } else if (choice.left === 'accepted') {
                blockVal = block.oursText || '';
              } else if (choice.right === 'accepted') {
                blockVal = block.theirsText || '';
              } else if (choice.left === 'ignored' && choice.right === 'ignored') {
                blockVal = '';
              } else if (choice.left === 'ignored' && choice.right === 'pending') {
                blockVal = block.theirsText || '';
              } else if (choice.right === 'ignored' && choice.left === 'pending') {
                blockVal = block.oursText || '';
              } else {
                blockVal = ''; // Pending -> totally blank like in JetBrains!
              }
            }

            const blockLines = blockVal ? blockVal.split('\n') : [''];
            const rowCount = Math.max(blockLines.length, 3); // minimum 3 rows spacing

            const isPending = choice.left === 'pending' && choice.right === 'pending';
            const isOursOnly = choice.left === 'accepted' && choice.right !== 'accepted';
            const isTheirsOnly = choice.right === 'accepted' && choice.left !== 'accepted';
            const isBoth = choice.left === 'accepted' && choice.right === 'accepted';
            const isIgnored = choice.left === 'ignored' && choice.right === 'ignored';

            return (
              <div 
                key={`c-M-${bIdx}`} 
                className={`relative border-y my-1.5 transition-all select-text ${
                  isPending
                    ? isLight
                      ? 'border-indigo-200 bg-indigo-50/70'
                      : 'border-indigo-500/30 bg-indigo-500/15'
                    : isOursOnly
                      ? isLight
                        ? 'border-emerald-200 bg-emerald-50/75'
                        : 'border-emerald-500/30 bg-emerald-500/15'
                      : isTheirsOnly
                        ? isLight
                          ? 'border-emerald-200 bg-emerald-50/75'
                          : 'border-emerald-500/30 bg-emerald-500/15'
                        : isBoth
                          ? isLight
                            ? 'border-teal-200 bg-teal-50/75'
                            : 'border-teal-500/30 bg-teal-500/15'
                          : isLight
                            ? 'border-slate-205 bg-slate-100/70'
                            : 'border-slate-700/30 bg-slate-800/10'
                }`}
              >
                <div className="flex items-stretch">
                  <div className={`w-9 text-right pr-2 select-none border-r font-mono text-[9px] font-bold shrink-0 py-2 flex flex-col ${
                    isPending
                      ? isLight 
                        ? 'text-indigo-600 bg-indigo-50/80 border-indigo-200'
                        : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                      : isOursOnly
                        ? isLight
                          ? 'text-emerald-700 bg-emerald-50/80 border-emerald-200'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : isTheirsOnly
                        ? isLight
                          ? 'text-emerald-700 bg-emerald-50/80 border-emerald-200'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : isLight
                          ? 'text-slate-550 bg-slate-50 border-slate-200'
                          : 'text-slate-500 bg-slate-800/20 border-[#2d2f3c]/60'
                  }`}>
                    {blockLines.map((_, li) => {
                      const blockLineNum = lineNum++;
                      return <div key={li} className="h-5 leading-5">{blockLineNum}</div>;
                    })}
                  </div>

                  <div className="flex-1 relative py-2">
                    <textarea
                      rows={rowCount}
                      value={blockVal}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setCustomBlockTexts(prev => {
                          const next = { ...prev, [bIdx]: newVal };
                          // Sync main editor text consolidated string
                          setEditorText(getMergedContent(blockChoices, next));
                          return next;
                        });
                      }}
                      className={`w-full border-none outline-none focus:ring-0 leading-5 text-[11.5px] font-mono whitespace-pre bg-transparent px-3 placeholder-slate-500/70 resize-y ${
                        isLight ? 'text-slate-850' : 'text-[#e8eef5]'
                      }`}
                      placeholder={
                        isPending
                          ? (tone === TranslationTone.ENGLISH 
                            ? "« Empty conflict area. Accept Left (<<) or Right (>>) arrows, or customize code here..." 
                            : "« Vùng xung đột trống. Hãy chọn Nhận Trái (<<) hoặc Nhận Phải (>>), hoặc tự gõ code tại đây...")
                          : (tone === TranslationTone.ENGLISH
                            ? "Merged output. Type here to customize..."
                            : "Đã trộn thành công. Bạn vẫn có thể gõ nội dung tùy chỉnh tại đây...")
                      }
                    />

                    <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-100 select-none pointer-events-none">
                      {!isPending && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetSingleBlock(bIdx);
                          }}
                          className={`pointer-events-auto px-1.5 py-0.5 text-[8px] font-mono font-extrabold uppercase rounded border cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-sm ${
                            isLight 
                              ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700' 
                              : 'bg-rose-950/20 hover:bg-rose-950/50 border border-rose-500/30 text-rose-400'
                          }`}
                          title="Hoàn tác thay đổi của khối này (Reset block)"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset Block</span>
                        </button>
                      )}
                      {blockAiApplied[bIdx] && (
                        <span 
                          className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/35 text-violet-400 uppercase tracking-widest flex items-center gap-1 cursor-help pointer-events-auto"
                          title={blockAiExplanations[bIdx]}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-violet-400 animate-pulse" />
                          <span>AI Option</span>
                        </span>
                      )}
                      {blockAnalyses[bIdx] && (
                        (() => {
                          const ana = blockAnalyses[bIdx];
                          if (ana.isNonConflicting) {
                            return (
                              <span 
                                className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 uppercase tracking-widest flex items-center shrink-0 cursor-help pointer-events-auto"
                                title={ana.reason}
                              >
                                <span>Auto-Merged (Non-Conflicting)</span>
                              </span>
                            );
                          } else if (ana.isSimpleConflict) {
                            return (
                              <span 
                                className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-500/35 text-teal-400 uppercase tracking-widest flex items-center shrink-0 cursor-help pointer-events-auto animate-pulse"
                                title={ana.reason}
                              >
                                <span>Heuristic (Simple Conflict)</span>
                              </span>
                            );
                          } else {
                            return (
                              <span 
                                className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/35 text-indigo-400 uppercase tracking-widest flex items-center shrink-0 cursor-help pointer-events-auto"
                                title={ana.reason}
                              >
                                <span>Complex Conflict</span>
                              </span>
                            );
                          }
                        })()
                      )}
                      {isPending ? (
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-550/20 border border-indigo-550/35 text-indigo-400 uppercase tracking-widest animate-pulse shrink-0">
                          Pending
                        </span>
                      ) : isOursOnly ? (
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 uppercase tracking-widest shrink-0">
                          Ours (Left)
                        </span>
                      ) : isTheirsOnly ? (
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 uppercase tracking-widest shrink-0">
                          Theirs (Right)
                        </span>
                      ) : isBoth ? (
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/35 text-teal-400 uppercase tracking-widest shrink-0">
                          Both (Merged)
                        </span>
                      ) : (
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-500/25 border border-slate-500/35 text-slate-400 uppercase tracking-widest shrink-0">
                          Ignored
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  if (isMinimized) {
    return (
      <>
        <div className={`border border-dashed p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-inner my-2 ${
          isLight ? 'bg-slate-100/50 border-slate-300 text-slate-700' : 'bg-[#1e1f26]/40 border border-[#2d2f3c]/60 text-slate-350'
        }`}>
          <AlertTriangle className="w-8 h-8 text-amber-500/60 animate-pulse" />
          <div className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-350'}`}>
            {tone === TranslationTone.ENGLISH ? "JetBrains Merge Dialog is Minimized" : "Cửa sổ giải quyết xung đột đang thu nhỏ"}
          </div>
          <p className={`text-xs max-w-md font-sans ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {tone === TranslationTone.ENGLISH 
              ? "The 3-way interactive compare dialog is active but currently minimized. You can verify other modules on this screen or resume merging below." 
              : "Bộ so sánh dòng mã trực quan đang hoạt động ẩn dưới nền. Bạn có thể xem các thông số hoặc khôi phục cửa sổ bên dưới."}
          </p>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-4 py-2 mt-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-505 border border-amber-500/30 font-mono text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-95 duration-100"
          >
            {tone === TranslationTone.ENGLISH ? "Resume Interactive Merging" : "Quay lại giải quyết xung đột"}
          </button>
        </div>

        <div 
          id="conflict-solver-minimized-floating" 
          className={`fixed bottom-6 right-6 z-50 border-2 rounded-2xl p-4 shadow-2xl flex items-center gap-5 justify-between backdrop-blur-md max-w-sm transition-all hover:scale-105 duration-200 ${
            isLight ? 'bg-white border-amber-500 text-slate-800' : 'bg-[#1e1f26]/95 border-2 border-amber-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
            <div>
              <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {tone === TranslationTone.ENGLISH ? "Resolve Conflicts" : "Xử lý xung đột Git"} ({conflicts.filter(c => !c.isResolved).length} file)
              </div>
              <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {tone === TranslationTone.ENGLISH ? "Merge tool minimized" : "Công cụ đang chạy thu nhỏ"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono text-xs font-extrabold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-orange-500/20 active:scale-95"
          >
            {tone === TranslationTone.ENGLISH ? "Maximize" : "Phục hồi"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center animate-fade-in overflow-y-auto ${
      isLight ? 'bg-slate-900/40' : 'bg-[#060814]/85'
    } ${isFullscreen ? 'p-0' : 'p-4 xl:p-8'}`}>
      <div 
        id="conflict-solver-container" 
        className={`relative overflow-hidden flex flex-col gap-4 ${
          isLight ? 'bg-white text-slate-700' : 'bg-[#1e1f26] text-slate-350'
        } ${
          isFullscreen 
            ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none p-6 animate-fade-in' 
            : isLight 
              ? 'border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-7xl max-h-[92vh] animate-scale-up'
              : 'border border-[#2d2f3c]/90 rounded-2xl p-6 shadow-2xl w-full max-w-7xl max-h-[92vh] animate-scale-up'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-600 to-amber-500"></div>

        <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 shrink-0 border-b ${
          isLight ? 'border-slate-205' : 'border-b border-[#2d2f3c]/60'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase border border-violet-500/20 ${
                isLight ? 'bg-violet-50 text-violet-600' : 'bg-[#2d2f3c] text-violet-400'
              }`}>
                {isFullscreen ? "JETBRAINS 3-WAY MERGE (FULL SCREEN)" : "JETBRAINS 3-WAY MERGE"}
              </span>
              <h2 className={`text-base font-black font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-[#e8eef5]'}`}>
                <Code2 className="w-5 h-5 text-violet-400 rotate-12" />
                {loc.title}
              </h2>
            </div>
            <p className={`text-xs font-sans mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {loc.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`px-4 py-2 text-xs rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                isLight 
                  ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-600 hover:border-violet-300' 
                  : 'bg-[#242632] hover:bg-[#2d3042] text-violet-400 border border-violet-500/20 hover:border-violet-500/45'
              }`}
              title={isFullscreen ? "Restore standard size" : "Expand to full screen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? (tone === TranslationTone.ENGLISH ? "Restore down" : "Cửa sổ nhỏ") : (tone === TranslationTone.ENGLISH ? "Full Screen" : "Toàn màn hình")}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className={`px-4 py-2 text-xs rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                isLight 
                  ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-705 hover:text-slate-900' 
                  : 'bg-[#2b2d38] hover:bg-[#343644] text-slate-300 border border-[#2d2f3c] hover:text-white'
              }`}
              title="Minimize to main screen"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{tone === TranslationTone.ENGLISH ? "Minimize" : "Thu nhỏ"}</span>
            </button>

            {allResolved && (
              <button
                onClick={onCompleteRecovery}
                className="w-full xl:w-auto px-6 py-2.5 text-xs bg-gradient-to-r from-emerald-500 to-teal-550 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-lg font-mono font-bold shadow-lg shadow-emerald-500/15 border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all animate-pulse"
              >
                <Check className="w-4 h-4 font-black" /> {loc.btnContinue}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch overflow-y-auto flex-1 pr-1">
          
          <div className={`${isSidebarCollapsed ? 'hidden' : 'lg:col-span-3 flex'} flex-col gap-2.5 p-3 rounded-xl border h-full ${
            isFullscreen ? 'max-h-none h-[calc(100vh-210px)]' : 'max-h-[580px]'
          } ${
            isLight ? 'bg-slate-50 border-slate-205' : 'bg-[#17181c] border-[#2d2f3c]/60'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${
              isLight ? 'border-slate-200' : 'border-[#2d2f3c]/40'
            }`}>
              <span className={`text-[10px] uppercase font-mono tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-505'}`}>{loc.colTitle}</span>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800' : 'hover:bg-[#252632] text-slate-450 hover:text-white'
                }`}
                title="Collapse sidebar to maximize code space"
              >
                <ChevronLeft className="w-4 h-4 text-violet-450" />
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 overflow-y-auto flex-1">
              {conflicts.map((file) => {
                const isSelected = selectedFile?.filepath === file.filepath;
                return (
                  <button
                    key={file.filepath}
                    onClick={() => setSelectedFile(file)}
                    className={`p-3 rounded-lg border text-left font-mono text-xs transition-all flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-violet-50 border-violet-300 text-violet-750 shadow-sm'
                          : 'bg-[#2b2d38] border-violet-500/50 text-[#e8eef5] shadow'
                        : file.isResolved
                          ? isLight
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-[#182a20] border-[#22442b]/60 text-emerald-400 hover:bg-[#1b3425]'
                          : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-[#1d1f26] border-[#25262c] text-slate-400 hover:border-[#2d2f3c] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[70%] truncate" title={file.filepath}>
                      <FileCode2 className={`w-4 h-4 shrink-0 ${file.isResolved ? 'text-emerald-400' : 'text-amber-550'}`} />
                      <span className="truncate">{file.filepath}</span>
                    </div>
                    {file.isResolved ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                        RESOLVED
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-550/15 text-amber-500 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 animate-pulse">
                        CONFLICT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className={`rounded-lg p-3 border text-[11px] leading-relaxed font-sans mt-auto ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#14151a] border-[#23242c] text-slate-400'
            }`}>
              <span className={`font-bold flex items-center gap-1 font-mono text-[10px] mb-1.5 ${
                isLight ? 'text-slate-800' : 'text-slate-350'
              }`}>
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> {loc.guideTitle}
              </span>
              {loc.guideText}
            </div>
          </div>

          <div className={`${isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} rounded-xl p-4 flex flex-col gap-4 h-full border ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#15161a] border-[#2d2f3c]/50'
          }`}>
            {selectedFile ? (
              <>
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center px-3.5 py-2 rounded border text-xs font-mono gap-2 shrink-0 ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-705' : 'bg-[#1c1d22] border-[#2d2f3c]/40 text-[#e8eef5]'
                }`}>
                  <div className="flex items-center gap-2">
                    {isSidebarCollapsed && (
                      <button
                        onClick={() => setIsSidebarCollapsed(false)}
                        className={`mr-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] border rounded transition-all font-mono cursor-pointer active:scale-95 ${
                          isLight 
                            ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-600 font-bold'
                            : 'bg-[#242632] hover:bg-[#2d3042] border-violet-500/30 text-violet-400'
                        }`}
                      >
                        <Files className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{tone === TranslationTone.ENGLISH ? "Files Tree" : "Hiện danh sách"} ({conflicts.filter(c => c.isResolved).length}/{conflicts.length})</span>
                      </button>
                    )}
                    <span className={isLight ? 'text-slate-500' : 'text-slate-405'}>File: </span>
                    <strong className={`px-1.5 py-0.5 rounded-md border ${
                      isLight 
                        ? 'text-violet-700 bg-violet-50 border-violet-200' 
                        : 'text-violet-400 bg-[#25262e] border-[#2d2f3c]/60'
                    }`}>{selectedFile.filepath}</strong>
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>
                    <span className="h-2 w-2 rounded-full bg-amber-550 animate-pulse"></span>
                    {selectedFile.isResolved ? loc.statusResolved : `${loc.statusConflict} (${blocks.filter(b => b.type === 'conflict').length} Block)`}
                  </div>
                </div>

                {/* JB BULK CONTROL PANEL */}
                <div className={`p-4 rounded-xl border shrink-0 animate-fade-in ${
                  isLight 
                    ? 'bg-slate-50 border-slate-205 shadow-inner' 
                    : 'bg-[#14151b] border-[#2d2f3c]/60'
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-violet-400" />
                      <span className={`text-xs font-mono font-bold uppercase tracking-wide ${
                        isLight ? 'text-slate-800' : 'text-slate-205'
                      }`}>
                        {tone === TranslationTone.ENGLISH ? "BATCH SOLVER ACTION RAILS" : "CÔNG CỤ GỘP NHANH JETBRAINS"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <button
                        onClick={handleApplyLeft}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                          isLight 
                            ? 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-250 text-indigo-700 shadow-sm' 
                            : 'bg-[#1d2333] hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300'
                        }`}
                      >
                        <span>{"Accept All Left >>"}</span>
                      </button>
                      <button
                        onClick={handleApplyRight}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                          isLight 
                            ? 'bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-850 shadow-sm' 
                            : 'bg-[#332615] hover:bg-amber-950/50 border border-amber-500/30 hover:border-amber-500 text-amber-300'
                        }`}
                      >
                        <span>{"<< Accept All Right"}</span>
                      </button>
                      <button
                        onClick={handleApplyBoth}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                          isLight 
                            ? 'bg-violet-50 hover:bg-violet-100 border border-violet-250 text-violet-750 shadow-sm' 
                            : 'bg-violet-950/40 hover:bg-violet-950/70 border border-violet-500/20 hover:border-violet-500 text-violet-300'
                        }`}
                      >
                        <span>Merge Both Chunks</span>
                      </button>
                      <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all active:scale-95 flex items-center gap-1 border ${
                          history.length === 0
                            ? isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                              : 'bg-slate-50/10 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                            : isLight 
                              ? 'bg-white hover:bg-slate-50 border-slate-205 text-indigo-750 shadow-sm' 
                              : 'bg-[#212330] hover:bg-[#2d3043] border-[#3f4152] text-indigo-400'
                        }`}
                        title="Hoàn tác bước trước (Ctrl+Z)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo ({history.length})</span>
                      </button>
                      <button
                        onClick={handleResetMerge}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all active:scale-95 flex items-center gap-1 border ${
                          isLight 
                            ? 'bg-white hover:bg-slate-100 border-slate-205 text-slate-700 shadow-sm' 
                            : 'bg-[#282a36] hover:bg-slate-800 border-[#44475a]/30 text-slate-400'
                        }`}
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Reset File</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary bar for automated 3-way merge resolution */}
                  <div className={`mt-3.5 pt-3 border-t flex flex-wrap items-center justify-between text-[11px] gap-2.5 ${
                    isLight ? 'border-slate-200 text-slate-600' : 'border-[#2d2f3c]/40 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span>
                        <strong>3-Way Engine:</strong> BASE revision được định vị tự động qua <code className="px-1 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono text-[10px]">git merge-base</code>.
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="flex items-center gap-1 text-emerald-500 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Tự động gộp: {Object.values(blockAnalyses).filter((a: any) => a.isNonConflicting || a.isSimpleConflict).length} blocks an toàn
                      </span>
                      <span className="text-slate-500 border-l pl-3 border-slate-500/30">
                        Scroll Sync: Line-by-Line Alignment
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-WAY SIDE-BY-SIDE PANELS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                  
                  {/* LEFT PANE - Local Changes (Ours) */}
                  <div className={`flex flex-col rounded-lg border overflow-hidden ${
                    isLight ? 'bg-white border-slate-205 shadow-sm' : 'bg-[#1e2026] border-[#2d2f3c]/70'
                  }`}>
                    <div className={`px-3 py-1.5 border-b flex justify-between items-center select-none ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#17181c] border-b border-[#2d2f3c]/70'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-indigo-500 font-extrabold uppercase tracking-wider">{getLaneHeadingA()}</span>
                        <div className={`h-2.5 w-[1px] ${isLight ? 'bg-slate-300' : 'bg-[#2d2f3c]'}`}></div>
                        <span className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Read-Only</span>
                      </div>
                      <button
                        onClick={() => setStateLeftSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                        className={`p-1 rounded transition-colors ${
                          stateLeftSearch.isOpen 
                            ? 'bg-violet-600 text-white animate-pulse' 
                            : isLight 
                              ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'
                        } cursor-pointer`}
                        title="Search inside this box"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <SearchInputBar
                      isOpen={stateLeftSearch.isOpen}
                      query={stateLeftSearch.query}
                      matchCase={stateLeftSearch.matchCase}
                      wholeWord={stateLeftSearch.wholeWord}
                      useRegex={stateLeftSearch.useRegex}
                      activeIndex={stateLeftSearch.activeIndex}
                      totalMatches={leftMatches.length}
                      onChange={(updates) => setStateLeftSearch(prev => ({ ...prev, ...updates }))}
                      onClose={() => setStateLeftSearch(prev => ({ ...prev, isOpen: false }))}
                      tone={tone}
                      theme={theme}
                    />

                    <div 
                      ref={leftPaneContainerRef}
                      onScroll={handleScroll}
                      className={`flex relative items-stretch ${
                        isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'
                      } overflow-y-auto index-0 scrollbar-thin ${
                        isLight ? 'bg-[#f8f9fa] scrollbar-thumb-slate-300' : 'bg-[#0f1013] scrollbar-thumb-slate-800'
                      }`}
                    >
                      {renderLeftPane()}
                    </div>
                  </div>

                  {/* MIDDLE PANE - Merged result (Editable result) */}
                  <div className={`flex flex-col rounded-lg overflow-hidden border-2 ${
                    isLight ? 'bg-[#fafafa] border-violet-400 shadow shadow-violet-200/50' : 'bg-[#16171d] border-violet-500/50 shadow-inner'
                  }`}>
                    <div className={`px-3 py-1.5 border-b flex justify-between items-center select-none ${
                        isLight ? 'bg-slate-100/85 border-slate-205' : 'bg-[#0f1013] border-[#2d2f3c]/70'
                    }`}>
                      <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1 ${
                        isLight ? 'text-violet-600' : 'text-violet-400'
                      }`}>
                        <Settings2 className={`w-3.5 h-3.5 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
                        {loc.resultPane}
                      </span>

                      {/* JetBrains style premium switcher */}
                      <div className="hidden xs:flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/40 p-0.5 rounded-lg border border-slate-350/40 dark:border-slate-700/40 shrink-0">
                        <button
                          onClick={() => setEditMode('jetbrains')}
                          className={`px-2 py-0.5 rounded text-[8.5px] font-bold font-mono transition-all cursor-pointer ${
                            editMode === 'jetbrains'
                              ? 'bg-violet-600 text-white shadow-sm'
                              : isLight ? 'text-slate-600 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="JetBrains interactive block mode (Clean empty states, no raw markers)"
                        >
                          JetBrains Mode
                        </button>
                        <button
                          onClick={() => setEditMode('raw')}
                          className={`px-2 py-0.5 rounded text-[8.5px] font-bold font-mono transition-all cursor-pointer ${
                            editMode === 'raw'
                              ? 'bg-violet-600 text-white shadow-sm'
                              : isLight ? 'text-slate-600 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title="Classic full-text file editor (Shows raw Git conflict markers)"
                        >
                          Classic (Raw)
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCurrentlyDirty ? (
                          <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-md font-extrabold font-mono flex items-center gap-1 animate-pulse shrink-0">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                            {totalMarkerBlocks} {tone === TranslationTone.ENGLISH ? "REMAIN" : "CÒN LẠI"}
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md font-extrabold font-mono flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            READY
                          </span>
                        )}
                        <button
                          onClick={() => setStateResultSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                          className={`p-1 rounded transition-colors ${
                            stateResultSearch.isOpen 
                              ? 'bg-violet-600 text-white animate-pulse' 
                              : isLight 
                                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'
                          } cursor-pointer`}
                          title="Search inside this box"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <SearchInputBar
                      isOpen={stateResultSearch.isOpen}
                      query={stateResultSearch.query}
                      matchCase={stateResultSearch.matchCase}
                      wholeWord={stateResultSearch.wholeWord}
                      useRegex={stateResultSearch.useRegex}
                      activeIndex={stateResultSearch.activeIndex}
                      totalMatches={middleMatches.length}
                      onChange={(updates) => setStateResultSearch(prev => ({ ...prev, ...updates }))}
                      onClose={() => setStateResultSearch(prev => ({ ...prev, isOpen: false }))}
                      tone={tone}
                      theme={theme}
                    />

                    {editMode === 'jetbrains' ? (
                      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'} overflow-hidden`}>
                        {renderMiddlePaneJetBrains()}
                      </div>
                    ) : (
                      <div className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'} overflow-hidden font-mono text-[11px] leading-5`}>
                        <div 
                          ref={middleLineNumbersRef}
                          className={`text-right select-none border-r w-9 py-3 overflow-hidden h-full font-mono text-[10px] ${
                            isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#0e0f12] border-[#2d2f3c]/60 text-slate-600'
                          }`}
                        >
                          {editorText.split('\n').map((_, i) => (
                            <div key={i} className="h-5 leading-5 px-1" style={{ contentVisibility: 'auto', containIntrinsicSize: '20px' }}>{i + 1}</div>
                          ))}
                        </div>

                        <textarea
                          ref={textareaRef}
                          value={editorText}
                          onChange={(e) => setEditorText(e.target.value)}
                          onScroll={handleScroll}
                          className={`w-full border-none outline-none p-3 resize-none font-mono text-[11.5px] leading-5 focus:ring-0 leading-relaxed overflow-x-auto whitespace-pre select-text h-full scrollbar-thin ${
                            isLight 
                              ? 'bg-white text-slate-850 placeholder:text-slate-400 scrollbar-thumb-slate-300' 
                              : 'bg-[#16171d] text-[#e8eef5] placeholder:text-slate-650 scrollbar-thumb-slate-800'
                          }`}
                          placeholder={loc.placeholderCustom}
                        />

                        {isCurrentlyDirty && (
                          <span className={`absolute bottom-3 right-3 px-2 py-1 border rounded-md font-extrabold text-[9px] shadow-lg flex items-center gap-1 font-mono pointer-events-none select-none z-10 ${
                            isLight 
                              ? 'bg-rose-50 border-rose-200 text-rose-700' 
                              : 'bg-rose-950/90 border border-rose-500/40 text-rose-350'
                          }`}>
                            <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                            {totalMarkerBlocks} UNRESOLVED
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RIGHT PANE - Incoming Changes (Theirs) */}
                  <div className={`flex flex-col rounded-lg border overflow-hidden ${
                    isLight ? 'bg-white border-slate-205 shadow-sm' : 'bg-[#1e2026] border-[#2d2f3c]/70'
                  }`}>
                    <div className={`px-3 py-1.5 border-b flex justify-between items-center select-none ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#17181c] border-b border-[#2d2f3c]/70'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-500 font-extrabold uppercase tracking-wider">{getLaneHeadingB()}</span>
                        <div className={`h-2.5 w-[1px] ${isLight ? 'bg-slate-300' : 'bg-[#2d2f3c]'}`}></div>
                        <span className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Read-Only</span>
                      </div>
                      <button
                        onClick={() => setStateRightSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                        className={`p-1 rounded transition-colors ${
                          stateRightSearch.isOpen 
                            ? 'bg-violet-600 text-white animate-pulse' 
                            : isLight 
                              ? 'text-slate-505 hover:bg-slate-100 hover:text-slate-805' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'
                        } cursor-pointer`}
                        title="Search inside this box"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <SearchInputBar
                      isOpen={stateRightSearch.isOpen}
                      query={stateRightSearch.query}
                      matchCase={stateRightSearch.matchCase}
                      wholeWord={stateRightSearch.wholeWord}
                      useRegex={stateRightSearch.useRegex}
                      activeIndex={stateRightSearch.activeIndex}
                      totalMatches={rightMatches.length}
                      onChange={(updates) => setStateRightSearch(prev => ({ ...prev, ...updates }))}
                      onClose={() => setStateRightSearch(prev => ({ ...prev, isOpen: false }))}
                      tone={tone}
                      theme={theme}
                    />

                    <div 
                      ref={rightPaneContainerRef}
                      onScroll={handleScroll}
                      className={`flex relative items-stretch ${
                        isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'
                      } overflow-y-auto index-0 scrollbar-thin ${
                        isLight ? 'bg-[#f8f9fa] scrollbar-thumb-slate-300' : 'bg-[#0f1013] scrollbar-thumb-slate-800'
                      }`}
                    >
                      {renderRightPane()}
                    </div>
                  </div>

                </div>

                <div className={`text-[10px] font-sans italic flex flex-col gap-2 p-3 rounded-xl border shrink-0 ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-600 shadow-sm' 
                    : 'bg-[#16171d]/60 border-[#2d2f3c]/20 text-slate-300'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-violet-500 shrink-0 font-mono">💡 Tip:</span> 
                    <span>{loc.toolHelp}</span>
                  </div>
                  <div className={`border-t pt-1.5 text-[9.5px] leading-relaxed flex items-start gap-1.5 ${
                    isLight ? 'border-slate-200 text-slate-500' : 'border-[#2d2f3c]/40 text-slate-400'
                  }`}>
                    <span className="font-bold text-amber-500 shrink-0 font-mono">⚠️ {tone === TranslationTone.ENGLISH ? "Rebase Paradox:" : "Nghịch lý Rebase:"}</span>
                    <span>
                      {getRebaseInversionExplanation(tone)}
                    </span>
                  </div>
                </div>

                {/* AI RESOLUTION & EXPLANATION CO-PILOT PANEL */}
                {(() => {
                  const getAiLabels = () => {
                    switch (tone) {
                      case TranslationTone.JOKE:
                        return {
                          title: "🔮 PHÙ THỦY GỠ CONFLICT AI",
                          desc: "Đại ca ơi, code đập nhau sứt đầu mẻ trán rồi kìa! Bấm nút bên dưới để em quăng bùa phép Trợ lý AI phân xử và gộp sạch sành sanh cho sếp nha!",
                          btnRun: "🔥 Triệu hồi AI dẹp loạn",
                          btnRunLoading: "🔮 Đang múa bùa phép...",
                          btnApply: "🚀 Táng luôn code của AI vào kết quả",
                          successAlert: "🚀 Hoạt cảnh hoàn hảo! Đã tống khứ conflict marker và táng code giải cứu của AI vào khung kết quả. Đại ca kiểm tra lại rồi chốt nha!",
                          explanationLabel: "🧙 Báo cáo phân tích quỷ quái của AI:",
                          previewLabel: "🔮 Preview bản code thần thánh gộp bởi AI:"
                        };
                      case TranslationTone.TOXIC:
                        return {
                          title: "🤬 CỖ MÁY HUỶ DIỆT RÁC CODE BẰNG AI (CHÂN KINH)",
                          desc: "Xem hai thằng rác tụi mày đè code lên nhau hăm hở chưa kìa. Để tao lấy Trợ lý AI quét và dọn phân cho tụi mày khôn ra nhé. Bấm nhanh rảnh nợ!",
                          btnRun: "💀 Dọn rác code ngu này đi",
                          btnRunLoading: "💩 Đang cào rác, đợi xíu...",
                          btnApply: "🔥 Lắp code AI nắn gân rác của mày",
                          successAlert: "🔥 Ok đã cào rác sạch sẽ, đè code AI vào trung tâm rồi đấy. Đọc phần chửi bới của AI bên dưới mà sửa đổi nết code đi con trai!",
                          explanationLabel: "💀 AI sỉ nhục thẳng mặt:",
                          previewLabel: "💀 Xem trước cái thành quả AI gộp lại cho tụi mày:"
                        };
                      case TranslationTone.ENGLISH:
                        return {
                          title: "🧠 AI CONFLICT CO-PILOT",
                          desc: "Harness the server-side intelligence of our advanced AI to automatically interpret semantic changes and propose a production-ready, synthetic merge solution.",
                          btnRun: "💡 Analyze & Propose Merge with AI",
                          btnRunLoading: "🧠 Running AI Synthesis...",
                          btnApply: "⚡ Apply AI Merged Suggestion",
                          successAlert: "✓ AI-proposed solution loaded! Review the combined results inside the center editor and make any final custom adjustments as required.",
                          explanationLabel: "🧠 AI Conflict Analysis Report:",
                          previewLabel: "🔍 Preview AI Proposed Merged Code:"
                        };
                      case TranslationTone.PROFESSIONAL:
                      default:
                        return {
                          title: "TRỢ LÝ GIẢI QUYẾT XUNG ĐỘT THÔNG MINH AI",
                          desc: "Hệ thống AI 'Rebase Overlord Engine' sẽ quét tập tin xung đột, phân tích chi tiết luồng thay đổi của cả hai bên và tiến hành hợp nhất thông minh, bảo toàn logic nghiệp vụ tối đa cho bạn.",
                          btnRun: "💡 Phân tích & Gộp thông minh bằng AI",
                          btnRunLoading: "🔄 Đang phân tích logic...",
                          btnApply: "⚡ Áp dụng giải pháp hợp nhất từ AI",
                          successAlert: "🎉 Đã tự động giải quyết xung đột thành công! Toàn bộ mã nguồn sạch của AI đã được điền vào khung trung tâm. Bạn vẫn có thể xem chi tiết hoặc sửa tay tiếp.",
                          explanationLabel: "📝 Báo cáo phân tích xung đột từ AI:",
                          previewLabel: "🔍 Xem trước mã nguồn hợp nhất đề xuất từ AI:"
                        };
                    }
                  };
                  const aiLabels = getAiLabels();

                  return (
                    <div className={`p-4 rounded-xl flex flex-col gap-3.5 shrink-0 shadow-sm relative overflow-hidden border ${
                      isLight 
                        ? 'bg-violet-50/40 border-violet-200/50 text-slate-700 shadow-violet-100/20' 
                        : 'bg-[#1b1c25] border-violet-500/30 text-slate-350 shadow-lg'
                    }`}>
                      <div className="absolute top-0 right-0 p-1 opacity-10">
                        <Bot className="w-24 h-24 text-violet-400 rotate-12 -mr-6 -mt-6" />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 px-1.5 rounded-lg border ${
                            isLight
                              ? 'bg-violet-100/60 border-violet-200 text-violet-600'
                              : 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                          }`}>
                            <Bot className={`w-4 h-4 animate-pulse ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
                          </div>
                          <div>
                            <span className={`text-xs font-mono font-black tracking-wide flex items-center gap-1 ${
                              isLight ? 'text-slate-900' : 'text-[#e8eef5]'
                            }`}>
                              {aiLabels.title}
                              <span className="h-1.5 w-1.5 bg-violet-400 rounded-full inline-block animate-ping"></span>
                            </span>
                            <span className={`text-[10px] font-mono block sm:inline ${
                              isLight ? 'text-violet-700/85' : 'text-purple-400/70'
                            }`}>Powered by Advanced AI</span>
                          </div>
                        </div>

                        <button
                          onClick={handleAiResolve}
                          disabled={isAiLoading}
                          className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer transition-all active:scale-95 duration-100 flex items-center justify-center gap-1.5 shadow ${
                            isAiLoading
                              ? 'bg-[#252632] text-slate-400 border border-[#2d2f3c] cursor-not-allowed'
                              : 'bg-violet-600 hover:bg-violet-500 hover:shadow-violet-600/20 text-white border border-violet-500/40'
                          }`}
                        >
                          {isAiLoading ? (
                            <>
                              <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent rounded-full mr-1"></span>
                              <span>{aiLabels.btnRunLoading}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                              <span>{aiLabels.btnRun}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className={`text-[11px] max-w-3xl leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {aiLabels.desc}
                      </p>

                      {aiError && (
                        <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 text-rose-400 text-xs font-mono">
                          ⚠️ {aiError}
                        </div>
                      )}

                      {aiExplanation && (
                        <div className={`border rounded-lg p-3.5 flex flex-col gap-2.5 animate-fade-in ${
                          isLight 
                            ? 'bg-white border-slate-200 text-slate-800' 
                            : 'bg-[#111217] border-[#2d2f3c] text-slate-300'
                        }`}>
                          <span className="text-[10px] font-mono font-black text-violet-400 uppercase tracking-widest flex items-center gap-1">
                            <Bot className="w-3.5 h-3.5 text-violet-400" />
                            {aiLabels.explanationLabel}
                          </span>
                          <div className={`text-xs font-sans leading-relaxed whitespace-pre-line border-l-2 border-violet-500/40 pl-3 ${
                            isLight ? 'text-slate-700' : 'text-slate-300'
                          }`}>
                            {aiExplanation}
                          </div>

                          {aiProposedContent && (
                            <div className="flex flex-col gap-1.5 mt-3 select-none">
                              <span className="text-[10px] font-mono font-black text-violet-400 uppercase tracking-widest flex items-center gap-1">
                                <Code2 className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                                {aiLabels.previewLabel}
                              </span>

                              {/* Legend Panel */}
                              {(() => {
                                const getBadgeLabels = () => {
                                  switch (tone) {
                                    case TranslationTone.JOKE:
                                      return {
                                        ours: "HÀNG CỦA SẾP (OURS)",
                                        theirs: "HÀNG ĐỐI THỦ (THEIRS)",
                                        ai: "AI MÚA BÙA"
                                      };
                                    case TranslationTone.TOXIC:
                                      return {
                                        ours: "CODE CỦA MÀY (OURS)",
                                        theirs: "RÁC BÊN KIA (THEIRS)",
                                        ai: "AI GÁNH CÕNG LƯNG"
                                      };
                                    case TranslationTone.ENGLISH:
                                      return {
                                        ours: "OURS (LEFT)",
                                        theirs: "THEIRS (RIGHT)",
                                        ai: "AI SYNTHESIS"
                                      };
                                    case TranslationTone.PROFESSIONAL:
                                    default:
                                      return {
                                        ours: "GIỮ OURS (LEFT)",
                                        theirs: "GIỮ THEIRS (RIGHT)",
                                        ai: "AI SỬA/THÊM MỚI"
                                      };
                                  }
                                };
                                const badgeLabels = getBadgeLabels();
                                return (
                                  <div className={`flex flex-wrap items-center gap-4 text-[10px] font-mono px-3 py-1.5 border border-dashed rounded-lg mb-1.5 ${
                                    isLight 
                                      ? 'bg-slate-100/50 border-slate-200' 
                                      : 'bg-[#15161e] border-[#2d2f3c]/40'
                                  }`}>
                                    <span className={isLight ? 'text-slate-500 font-bold' : 'text-slate-400 font-bold'}>Màu chỉ thị / Colors:</span>
                                    <span className="flex items-center gap-1.5 font-bold text-sky-500">
                                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500/20 border border-sky-400" />
                                      {badgeLabels.ours}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-450" />
                                      {badgeLabels.theirs}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-bold text-amber-500">
                                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-450 animate-pulse" />
                                      {badgeLabels.ai}
                                    </span>
                                  </div>
                                );
                              })()}

                              <div className={`border rounded-lg p-3.5 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed select-text text-left scrollbar-thin ${
                                isLight 
                                  ? 'bg-slate-50 border-slate-205 text-slate-805 scrollbar-thumb-slate-300' 
                                  : 'bg-[#0b0c10] border-[#2d2f3c]/60 text-slate-300 scrollbar-thumb-slate-805'
                              }`}>
                                {aiProposedContent.split('\n').map((line, idx) => {
                                  const trimmed = line.trim();
                                  let lineBgClass = '';
                                  let borderClass = 'border-l-[3px] border-transparent pl-2.5';
                                  let badgeTag = '';
                                  let badgeTagColor = '';

                                  if (trimmed) {
                                    if (conflictAnalysis.ours.has(trimmed) && !conflictAnalysis.common.has(trimmed)) {
                                      lineBgClass = isLight 
                                        ? 'bg-sky-50 text-[#0c4a6e] hover:bg-sky-100/80' 
                                        : 'bg-sky-950/15 text-sky-200 hover:bg-sky-950/25';
                                      borderClass = 'border-l-[3px] border-sky-500/60 pl-2.5';
                                      badgeTag = 'OURS';
                                      badgeTagColor = 'text-sky-500 bg-sky-500/10 border border-sky-500/20';
                                    } else if (conflictAnalysis.theirs.has(trimmed) && !conflictAnalysis.common.has(trimmed)) {
                                      lineBgClass = isLight 
                                        ? 'bg-emerald-50 text-[#064e3b] hover:bg-emerald-100/80' 
                                        : 'bg-emerald-950/15 text-emerald-200 hover:bg-emerald-950/25';
                                      borderClass = 'border-l-[3px] border-emerald-500/60 pl-2.5';
                                      badgeTag = 'THEIRS';
                                      badgeTagColor = 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20';
                                    } else if (!conflictAnalysis.common.has(trimmed)) {
                                      lineBgClass = isLight 
                                        ? 'bg-amber-50 text-[#78350f] hover:bg-amber-100/80 font-medium' 
                                        : 'bg-amber-950/20 text-amber-200 hover:bg-amber-950/30';
                                      borderClass = 'border-l-[3px] border-amber-500/70 pl-2.5';
                                      badgeTag = 'AI';
                                      badgeTagColor = 'text-amber-500 bg-amber-500/10 border border-amber-500/20 animate-pulse';
                                    } else {
                                      lineBgClass = isLight ? 'hover:bg-slate-100/60' : 'hover:bg-[#1a1c24]/30';
                                    }
                                  } else {
                                    lineBgClass = isLight ? 'hover:bg-slate-100/60' : 'hover:bg-[#1a1c24]/30';
                                  }

                                  return (
                                    <div className={`flex select-text min-h-[22px] items-center relative group transition-all duration-100 ${lineBgClass}`} key={idx}>
                                      <span className={`w-8 select-none text-right pr-2 border-r mr-3 font-mono text-[9px] font-bold ${
                                        isLight ? 'text-slate-400 border-slate-200' : 'text-slate-650 border-[#2d2f3c]/25'
                                      }`}>{idx + 1}</span>
                                      <span className={`text-left font-mono whitespace-pre flex-1 overflow-x-auto ${borderClass}`}>
                                        {renderSyntaxHighlightedPreviewLine(line)}
                                      </span>
                                      {badgeTag && (
                                        <span className={`absolute right-2 px-1.5 py-0.2 text-[8px] font-mono font-black rounded uppercase tracking-wider select-none ${badgeTagColor}`}>
                                          {badgeTag}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {aiProposedContent && !wasAiApplied && (
                            <div className="mt-2 text-right">
                              <button
                                onClick={handleApplyAiProposedContent}
                                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 text-white font-mono text-xs font-extrabold rounded-lg cursor-pointer transition-all active:scale-95 duration-100 flex items-center gap-1.5 ml-auto"
                              >
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <span>{aiLabels.btnApply}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {wasAiApplied && (
                        <div className={`rounded-lg p-3 text-xs font-sans leading-relaxed animate-fade-in border ${
                          isLight 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-400'
                        }`}>
                          {aiLabels.successAlert}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* SAVE & SUBMIT ACTION PANEL */}
                <div className={`p-4 rounded-xl border mt-auto shrink-0 animate-fade-in ${
                  isLight 
                    ? 'bg-slate-50 border-slate-205 shadow-inner' 
                    : 'bg-[#14151b] border-[#2d2f3c]/60'
                }`}>
                  <div className="flex justify-end">
                    <button
                      onClick={handleResolveSubmit}
                      disabled={isCurrentlyDirty}
                      className={`text-xs px-5 py-2.5 rounded-lg font-mono font-black border flex items-center gap-1.5 transition-all active:scale-95 ${
                        isCurrentlyDirty 
                          ? isLight
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-[#18191f] text-slate-600 border-none cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-emerald-500/25 shadow shadow-emerald-500/10 cursor-pointer text-[#0b0f19]'
                      }`}
                    >
                      <GitCompare className="w-4 h-4 font-bold" /> 
                      {tone === TranslationTone.ENGLISH ? "Save & Apply Resolution" : "Ghi nhận & Xử lý xong file này"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-xs text-slate-500 font-mono italic flex flex-col items-center justify-center gap-3">
                <Files className="w-10 h-10 text-slate-700 animate-pulse" />
                <span className="text-slate-400 font-bold text-sm not-italic">{allResolved ? loc.allResolved : loc.clickTip}</span>
                {allResolved && (
                  <span className="text-emerald-400 text-[11px] uppercase font-bold not-italic mt-2 tracking-wide block bg-[#1b3425] px-4 py-2 rounded-lg border border-emerald-500/20">
                    {loc.nextTip}
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


















