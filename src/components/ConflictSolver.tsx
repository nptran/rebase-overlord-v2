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
  ChevronDown
} from 'lucide-react';
import { ConflictFile, TranslationTone } from '../types';

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
    toolHelp: "Lớp màu tím/xanh nhạt thể hiện mã nguồn base/develop (Ours) làm móng. Lớp màu hổ phách đại diện cho các thay đổi từ nhánh tính năng của bạn (Theirs)."
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
  tone
}: SearchBarProps) {
  if (!isOpen) return null;

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
    <div className="bg-[#111216] border-b border-[#2d2f3c] px-3 py-1 flex items-center justify-between gap-2 text-xs font-mono select-none animate-fade-in text-slate-300">
      <div className="flex items-center gap-1.5 flex-1 max-w-[85%]">
        <div className="relative flex items-center bg-[#1c1d24] border border-[#2d2f3c] focus-within:border-violet-500 rounded-md shadow-inner h-6.5 px-2 w-full max-w-[280px]">
          <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onChange({ query: e.target.value, activeIndex: 0 })}
            onKeyDown={handleKeyDown}
            placeholder={tone === TranslationTone.ENGLISH ? "Search in pane (Enter/Shift+Enter)..." : "Tìm trong khung (Enter/Shift+Enter)..."}
            className="bg-transparent border-none outline-none text-[#e8eef5] text-xs w-full mr-2 h-full placeholder-slate-600 focus:ring-0 focus:outline-none"
            autoFocus
          />
          
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onChange({ matchCase: !matchCase, activeIndex: 0 })}
              className={`px-1 py-0.5 text-[8px] font-bold rounded transition-all cursor-pointer border ${
                matchCase 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
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
                  : 'text-slate-500 hover:text-slate-300 border-transparent bg-transparent'
              }`}
              title="Regular Expression (.*)"
            >
              .*
            </button>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 whitespace-nowrap px-1">
          {totalMatches > 0 ? (
            <span className="text-violet-400 font-extrabold font-mono">
              {activeIndex + 1}/{totalMatches} {tone === TranslationTone.ENGLISH ? "results" : "đáp án"}
            </span>
          ) : query ? (
            <span className="text-rose-450 font-bold">0 {tone === TranslationTone.ENGLISH ? "results" : "kết quả"}</span>
          ) : (
            <span className="text-slate-550">{tone === TranslationTone.ENGLISH ? "No query" : "Nhập từ khóa"}</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handlePrev}
          disabled={totalMatches === 0}
          className={`p-1 rounded transition-colors ${totalMatches === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-450 hover:text-white hover:bg-[#242532] cursor-pointer'}`}
          title="Previous Match (Shift+Enter)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={totalMatches === 0}
          className={`p-1 rounded transition-colors ${totalMatches === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-450 hover:text-white hover:bg-[#242532] cursor-pointer'}`}
          title="Next Match (Enter)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3 bg-[#2d2f3c] mx-0.5"></div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-rose-950/40 transition-colors cursor-pointer"
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
  baseBranch
}: ConflictSolverProps) {
  const [selectedFile, setSelectedFile] = React.useState<ConflictFile | null>(conflicts[0] || null);
  const [editorText, setEditorText] = React.useState('');
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

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
  
  // Track resolved status per block index
  const [resolvedBlocks, setResolvedBlocks] = React.useState<Record<number, 'ours' | 'theirs' | 'both' | 'ignore'>>({});

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

    const matches: { globalLineIdx: number; start: number; end: number; text: string }[] = [];
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
            text: match[0]
          });
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          });
        }
      }
    });
    return matches;
  }, [leftLines, stateLeftSearch.isOpen, stateLeftSearch.query, stateLeftSearch.matchCase, stateLeftSearch.wholeWord, stateLeftSearch.useRegex]);

  const rightMatches = React.useMemo(() => {
    if (!stateRightSearch.isOpen || !stateRightSearch.query) return [];
    const regex = getSearchRegex(stateRightSearch.query, stateRightSearch.matchCase, stateRightSearch.wholeWord, stateRightSearch.useRegex);
    if (!regex) return [];

    const matches: { globalLineIdx: number; start: number; end: number; text: string }[] = [];
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
            text: match[0]
          });
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matches.push({
            globalLineIdx,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          });
        }
      }
    });
    return matches;
  }, [rightLines, stateRightSearch.isOpen, stateRightSearch.query, stateRightSearch.matchCase, stateRightSearch.wholeWord, stateRightSearch.useRegex]);

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
    paneMatches: { globalLineIdx: number; start: number; end: number; text: string }[],
    paneActiveIdx: number
  ) => {
    const lineMatches = paneMatches.filter(m => m.globalLineIdx === globalLineIdx);
    if (lineMatches.length === 0) {
      return <span>{lineText || '\u00A0'}</span>;
    }

    const sortedMatches = [...lineMatches].sort((a, b) => a.start - b.start);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedMatches.forEach((m, matchIdx) => {
      const globalMatchIndex = paneMatches.indexOf(m);
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
          className={`px-0.5 rounded font-bold transition-colors select-text ${
            isActive
              ? 'bg-[#214283] text-white ring-2 ring-blue-400'
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

  React.useEffect(() => {
    // Reset our search fields on file selection transition
    setStateLeftSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateRightSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateResultSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));

    if (selectedFile) {
      if (selectedFile.isResolved && selectedFile.resolvedContent) {
        setEditorText(selectedFile.resolvedContent);
        // mark all block indexes as resolved
        const initialResolved: Record<number, 'ours' | 'theirs' | 'both' | 'ignore'> = {};
        blocks.forEach((b, i) => {
          if (b.type === 'conflict') {
            initialResolved[i] = 'ours';
          }
        });
        setResolvedBlocks(initialResolved);
      } else {
        setEditorText(activeContent);
        setResolvedBlocks({});
      }
    } else {
      setEditorText('');
      setResolvedBlocks({});
    }
  }, [selectedFile, activeContent, blocks]);

  const handleResolveBlock = (blockIdx: number, choice: 'ours' | 'theirs' | 'both' | 'ignore') => {
    const updatedChoices = { ...resolvedBlocks, [blockIdx]: choice };
    setResolvedBlocks(updatedChoices);

    const merged = blocks.map((block, idx) => {
      if (block.type === 'normal') {
        return block.commonText;
      } else {
        const bChoice = updatedChoices[idx];
        if (bChoice === 'ours') {
          return block.oursText;
        } else if (bChoice === 'theirs') {
          return block.theirsText;
        } else if (bChoice === 'both') {
          return `${block.oursText}\n${block.theirsText}`;
        } else if (bChoice === 'ignore') {
          return '';
        } else {
          return `<<<<<<< HEAD\n${block.oursText}\n=======\n${block.theirsText}\n>>>>>>> incoming`;
        }
      }
    }).join('\n');
    
    setEditorText(merged);
  };

  const handleApplyLeft = () => {
    const updated: Record<number, 'ours' | 'theirs' | 'both' | 'ignore'> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        updated[idx] = 'ours';
      }
    });
    setResolvedBlocks(updated);
    const merged = blocks.map((block, idx) => {
      if (block.type === 'normal') return block.commonText;
      return block.oursText;
    }).join('\n');
    setEditorText(merged);
  };

  const handleApplyRight = () => {
    const updated: Record<number, 'ours' | 'theirs' | 'both' | 'ignore'> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        updated[idx] = 'theirs';
      }
    });
    setResolvedBlocks(updated);
    const merged = blocks.map((block, idx) => {
      if (block.type === 'normal') return block.commonText;
      return block.theirsText;
    }).join('\n');
    setEditorText(merged);
  };

  const handleApplyBoth = () => {
    const updated: Record<number, 'ours' | 'theirs' | 'both' | 'ignore'> = {};
    blocks.forEach((block, idx) => {
      if (block.type === 'conflict') {
        updated[idx] = 'both';
      }
    });
    setResolvedBlocks(updated);
    const merged = blocks.map((block, idx) => {
      if (block.type === 'normal') return block.commonText;
      return `${block.oursText}\n${block.theirsText}`;
    }).join('\n');
    setEditorText(merged);
  };

  const handleResetMerge = () => {
    setResolvedBlocks({});
    setEditorText(activeContent);
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
  const totalMarkerBlocks = countOccurrences(editorText, '<<<<<<<');
  const isCurrentlyDirty = editorText.includes('<<<<<<<') || editorText.includes('=======') || editorText.includes('>>>>>>>');

  // Render Left Code column
  const renderLeftPane = () => {
    let lineNum = 1;
    let globalLineCounter = 0;
    return (
      <div className="font-mono text-[11px] leading-5 text-slate-300 w-full">
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
                  className="flex hover:bg-[#202124]/40 min-h-[20px] items-center animate-fade-in"
                >
                  <div className="w-9 text-right pr-2 text-slate-600 select-none border-r border-[#2d2f3c]/60 bg-[#16171a] font-mono text-[10px] shrink-0">
                    {currNum}
                  </div>
                  <div className="pl-3 select-text whitespace-pre text-slate-400 font-mono">
                    {renderLineWithHighlight(line, currentGlobalLineIdx, leftMatches, stateLeftSearch.activeIndex)}
                  </div>
                </div>
              );
            });
          } else {
            const oursLines = block.oursText ? block.oursText.split('\n') : [''];
            const theirsLines = block.theirsText ? block.theirsText.split('\n') : [''];
            const maxLines = Math.max(oursLines.length, theirsLines.length);
            const isResolved = resolvedBlocks[bIdx] !== undefined;

            return Array.from({ length: maxLines }).map((_, lIdx) => {
              const line = oursLines[lIdx];
              const hasLine = lIdx < oursLines.length;
              const currNum = hasLine ? lineNum++ : '';
              const currentGlobalLineIdx = globalLineCounter++;
              
              return (
                <div 
                  key={`c-L-${bIdx}-${lIdx}`} 
                  data-left-line={currentGlobalLineIdx}
                  className={`flex relative min-h-[20px] items-center ${
                    isResolved 
                      ? 'bg-emerald-950/15 text-emerald-400/80 border-l-2 border-emerald-500/50' 
                      : 'bg-rose-950/20 text-[#f28b82] border-l-2 border-rose-500/80'
                  }`}
                >
                  <div className="w-9 text-right pr-2 text-rose-550 bg-rose-950/30 select-none border-r border-[#2d2f3c]/60 font-mono text-[10px] font-bold shrink-0">
                    {currNum || '\u00A0'}
                  </div>
                  <div className="pl-3 flex-1 select-text whitespace-pre pr-24 font-medium font-mono">
                    {hasLine ? renderLineWithHighlight(line, currentGlobalLineIdx, leftMatches, stateLeftSearch.activeIndex) : ''}
                  </div>

                  {hasLine && lIdx === 0 && !isResolved && (
                    <div className="absolute right-2 z-15 flex gap-1 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlock(bIdx, 'ours');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white font-mono font-bold px-1.5 py-0.5 rounded text-[9px] shadow cursor-pointer transition-all flex items-center gap-0.5"
                        title={loc.btnOurs}
                      >
                        Accept <span className="font-black text-xs">»</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlock(bIdx, 'ignore');
                        }}
                        className="bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-white px-1 py-0.5 rounded text-[9px] cursor-pointer"
                        title="Ignore block"
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
      <div className="font-mono text-[11px] leading-5 text-slate-300 w-full">
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
                  className="flex hover:bg-[#202124]/40 min-h-[20px] items-center animate-fade-in"
                >
                  <div className="w-9 text-right pr-2 text-slate-600 select-none border-r border-[#2d2f3c]/60 bg-[#16171a] font-mono text-[10px] shrink-0">
                    {currNum}
                  </div>
                  <div className="pl-3 select-text whitespace-pre text-slate-400 font-mono">
                    {renderLineWithHighlight(line, currentGlobalLineIdx, rightMatches, stateRightSearch.activeIndex)}
                  </div>
                </div>
              );
            });
          } else {
            const oursLines = block.oursText ? block.oursText.split('\n') : [''];
            const theirsLines = block.theirsText ? block.theirsText.split('\n') : [''];
            const maxLines = Math.max(oursLines.length, theirsLines.length);
            const isResolved = resolvedBlocks[bIdx] !== undefined;

            return Array.from({ length: maxLines }).map((_, lIdx) => {
              const line = theirsLines[lIdx];
              const hasLine = lIdx < theirsLines.length;
              const currNum = hasLine ? lineNum++ : '';
              const currentGlobalLineIdx = globalLineCounter++;
              
              return (
                <div 
                  key={`c-R-${bIdx}-${lIdx}`} 
                  data-right-line={currentGlobalLineIdx}
                  className={`flex relative min-h-[20px] items-center ${
                    isResolved 
                      ? 'bg-emerald-950/15 text-emerald-400/80 border-r-2 border-emerald-500/50' 
                      : 'bg-[#3d2f1f]/60 text-amber-300 border-r-2 border-amber-500/80'
                  }`}
                >
                  <div className="w-9 text-right pr-2 text-amber-550 bg-amber-950/30 select-none border-r border-[#2d2f3c]/60 font-mono text-[10px] font-bold shrink-0">
                    {currNum || '\u00A0'}
                  </div>
                  <div className="pl-3 flex-1 select-text whitespace-pre pr-24 font-medium font-mono">
                    {hasLine ? renderLineWithHighlight(line, currentGlobalLineIdx, rightMatches, stateRightSearch.activeIndex) : ''}
                  </div>

                  {hasLine && lIdx === 0 && !isResolved && (
                    <div className="absolute right-2 z-15 flex gap-1 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlock(bIdx, 'theirs');
                        }}
                        className="bg-amber-600 hover:bg-amber-500 hover:scale-105 active:scale-95 text-slate-950 font-mono font-bold px-1.5 py-0.5 rounded text-[9px] shadow cursor-pointer transition-all flex items-center gap-0.5"
                        title={loc.btnTheirs}
                      >
                        <span className="font-black text-xs">«</span> Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveBlock(bIdx, 'ignore');
                        }}
                        className="bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-white px-1 py-0.5 rounded text-[9px] cursor-pointer"
                        title="Ignore block"
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

  if (isMinimized) {
    return (
      <>
        <div className="bg-[#1e1f26]/40 border border-dashed border-[#2d2f3c]/60 p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-inner my-2">
          <AlertTriangle className="w-8 h-8 text-amber-500/60 animate-pulse" />
          <div className="text-sm font-bold text-slate-350">
            {tone === TranslationTone.ENGLISH ? "JetBrains Merge Dialog is Minimized" : "Cửa sổ giải quyết xung đột đang thu nhỏ"}
          </div>
          <p className="text-xs text-slate-500 max-w-md font-sans">
            {tone === TranslationTone.ENGLISH 
              ? "The 3-way interactive compare dialog is active but currently minimized. You can verify other modules on this screen or resume merging below." 
              : "Bộ so sánh dòng mã trực quan đang hoạt động ẩn dưới nền. Bạn có thể xem các thông số hoặc khôi phục cửa sổ bên dưới."}
          </p>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-4 py-2 mt-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-450 border border-amber-500/30 font-mono text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-95 duration-100"
          >
            {tone === TranslationTone.ENGLISH ? "Resume Interactive Merging" : "Quay lại giải quyết xung đột"}
          </button>
        </div>

        <div 
          id="conflict-solver-minimized-floating" 
          className="fixed bottom-6 right-6 z-50 bg-[#1e1f26]/95 border-2 border-amber-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-5 justify-between backdrop-blur-md max-w-sm transition-all hover:scale-105 duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {tone === TranslationTone.ENGLISH ? "Resolve Conflicts" : "Xử lý xung đột Git"} ({conflicts.filter(c => !c.isResolved).length} file)
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                {tone === TranslationTone.ENGLISH ? "Merge tool minimized" : "Công cụ đang chạy thu nhỏ"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-xs font-extrabold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-orange-500/20 active:scale-95"
          >
            {tone === TranslationTone.ENGLISH ? "Maximize" : "Phục hồi"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-[#060814]/85 backdrop-blur-md flex items-center justify-center animate-fade-in overflow-y-auto ${isFullscreen ? 'p-0' : 'p-4 xl:p-8'}`}>
      <div 
        id="conflict-solver-container" 
        className={`bg-[#1e1f26] relative overflow-hidden text-slate-350 flex flex-col gap-4 ${
          isFullscreen 
            ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none p-6 animate-fade-in' 
            : 'border border-[#2d2f3c]/90 rounded-2xl p-6 shadow-2xl w-full max-w-7xl max-h-[92vh] animate-scale-up'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-600 to-amber-500"></div>

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#2d2f3c]/60 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#2d2f3c] text-violet-400 border border-violet-500/20 rounded font-mono text-[10px] font-bold tracking-wider uppercase">
                {isFullscreen ? "JETBRAINS 3-WAY MERGE (FULL SCREEN)" : "JETBRAINS 3-WAY MERGE"}
              </span>
              <h2 className="text-base font-black text-[#e8eef5] font-mono flex items-center gap-1.5">
                <Code2 className="w-5 h-5 text-violet-400 rotate-12" />
                {loc.title}
              </h2>
            </div>
            <p className="text-xs text-slate-450 font-sans mt-1">
              {loc.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 text-xs bg-[#242632] hover:bg-[#2d3042] text-violet-400 rounded-lg border border-violet-500/20 hover:border-violet-500/45 transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title={isFullscreen ? "Restore standard size" : "Expand to full screen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-violet-400" /> : <Maximize2 className="w-3.5 h-3.5 text-violet-400" />}
              <span>{isFullscreen ? (tone === TranslationTone.ENGLISH ? "Restore down" : "Cửa sổ nhỏ") : (tone === TranslationTone.ENGLISH ? "Full Screen" : "Toàn màn hình")}</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="px-4 py-2 text-xs bg-[#2b2d38] hover:bg-[#343644] text-slate-300 rounded-lg border border-[#2d2f3c] hover:text-white transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
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
          
          <div className={`${isSidebarCollapsed ? 'hidden' : 'lg:col-span-3 flex'} flex-col gap-2.5 bg-[#17181c] p-3 rounded-xl border border-[#2d2f3c]/60 h-full ${isFullscreen ? 'max-h-none h-[calc(100vh-210px)]' : 'max-h-[580px]'}`}>
            <div className="flex justify-between items-center border-b border-[#2d2f3c]/40 pb-2">
              <span className="text-[10px] text-slate-505 uppercase font-mono tracking-wider font-bold">{loc.colTitle}</span>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1 rounded hover:bg-[#252632] text-slate-450 hover:text-white transition-colors cursor-pointer"
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
                        ? 'bg-[#2b2d38] border-violet-500/50 text-[#e8eef5] shadow'
                        : file.isResolved
                          ? 'bg-[#182a20] border-[#22442b]/60 text-emerald-400 hover:bg-[#1b3425]'
                          : 'bg-[#1d1f26] border-[#25262c] text-slate-400 hover:border-[#2d2f3c] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[70%] truncate">
                      <FileCode2 className={`w-4 h-4 shrink-0 ${file.isResolved ? 'text-emerald-400' : 'text-amber-550'}`} />
                      <span className="truncate">{file.filepath}</span>
                    </div>
                    {file.isResolved ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                        RESOLVED
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-550/15 text-amber-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 animate-pulse">
                        CONFLICT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="bg-[#14151a] rounded-lg p-3 border border-[#23242c] text-[11px] text-slate-400 leading-relaxed font-sans mt-auto">
              <span className="font-bold text-slate-350 flex items-center gap-1 font-mono text-[10px] mb-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> {loc.guideTitle}
              </span>
              {loc.guideText}
            </div>
          </div>

          <div className={`${isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} bg-[#15161a] border border-[#2d2f3c]/50 rounded-xl p-4 flex flex-col gap-4 h-full`}>
            {selectedFile ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1c1d22] px-3.5 py-2 rounded border border-[#2d2f3c]/40 text-xs font-mono gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    {isSidebarCollapsed && (
                      <button
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="mr-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#242632] hover:bg-[#2d3042] border border-violet-500/30 hover:border-violet-500/65 rounded text-violet-400 transition-all font-mono cursor-pointer active:scale-95"
                      >
                        <Files className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{tone === TranslationTone.ENGLISH ? "Files Tree" : "Hiện danh sách"} ({conflicts.filter(c => c.isResolved).length}/{conflicts.length})</span>
                      </button>
                    )}
                    <span className="text-slate-405">File: </span>
                    <strong className="text-violet-400 px-1.5 py-0.5 bg-[#25262e] rounded-md border border-[#2d2f3c]/60">{selectedFile.filepath}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-amber-505 animate-pulse"></span>
                    {selectedFile.isResolved ? loc.statusResolved : `${loc.statusConflict} (${blocks.filter(b => b.type === 'conflict').length} Block)`}
                  </div>
                </div>

                {/* 3-WAY SIDE-BY-SIDE PANELS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                  
                  {/* LEFT PANE - Local Changes (Ours) */}
                  <div className="flex flex-col bg-[#1e2026] rounded-lg border border-[#2d2f3c]/70 overflow-hidden">
                    <div className="bg-[#17181c] px-3 py-1.5 border-b border-[#2d2f3c]/70 flex justify-between items-center select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-wider">{getLaneHeadingA()}</span>
                        <div className="h-2.5 w-[1px] bg-[#2d2f3c]"></div>
                        <span className="text-[9px] font-mono text-slate-500">Read-Only</span>
                      </div>
                      <button
                        onClick={() => setStateLeftSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                        className={`p-1 rounded transition-colors ${stateLeftSearch.isOpen ? 'bg-violet-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'} cursor-pointer`}
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
                    />

                    <div 
                      ref={leftPaneContainerRef}
                      className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'} overflow-y-auto index-0 bg-[#0f1013] scrollbar-thin scrollbar-thumb-slate-800`}
                    >
                      {renderLeftPane()}
                    </div>
                  </div>

                  {/* MIDDLE PANE - Merged result (Editable result) */}
                  <div className="flex flex-col bg-[#16171d] rounded-lg border-2 border-violet-500/50 shadow-inner overflow-hidden">
                    <div className="bg-[#0f1013] px-3 py-1.5 border-b border-[#2d2f3c]/70 flex justify-between items-center select-none">
                      <span className="text-[10px] font-mono text-violet-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <Settings2 className="w-3.5 h-3.5 text-violet-400" />
                        {loc.resultPane}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isCurrentlyDirty ? (
                          <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-md font-extrabold font-mono flex items-center gap-1 animate-pulse shrink-0">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                            {totalMarkerBlocks} {tone === TranslationTone.ENGLISH ? "REMAIN" : "CÒN LẠI"}
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-extrabold font-mono flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            READY
                          </span>
                        )}
                        <button
                          onClick={() => setStateResultSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                          className={`p-1 rounded transition-colors ${stateResultSearch.isOpen ? 'bg-violet-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'} cursor-pointer`}
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
                    />

                    <div className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'} overflow-y-auto font-mono text-[11px] leading-5`}>
                      <div className="bg-[#0e0f12] px-2 text-right text-slate-600 select-none border-r border-[#2d2f3c]/60 w-9 select-none pt-1">
                        {editorText.split('\n').map((_, i) => (
                          <div key={i} className="h-5 text-[10px] leading-5">{i + 1}</div>
                        ))}
                      </div>

                      <textarea
                        ref={textareaRef}
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                        className="w-full bg-[#16171d] border-none text-[#e8eef5] outline-none p-3 resize-none font-mono text-[11.5px] leading-5 focus:ring-0 leading-relaxed overflow-x-auto whitespace-pre select-text h-full placeholder:text-slate-650 scrollbar-thin scrollbar-thumb-slate-800 font-mono"
                        placeholder={loc.placeholderCustom}
                      />

                      {isCurrentlyDirty && (
                        <span className="absolute bottom-3 right-3 px-2 py-1 bg-rose-950/90 border border-rose-500/40 text-rose-350 rounded-md font-extrabold text-[9px] shadow-lg flex items-center gap-1 font-mono pointer-events-none select-none z-10">
                          <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />
                          {totalMarkerBlocks} UNRESOLVED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE - Incoming Changes (Theirs) */}
                  <div className="flex flex-col bg-[#1e2026] rounded-lg border border-[#2d2f3c]/70 overflow-hidden">
                    <div className="bg-[#17181c] px-3 py-1.5 border-b border-[#2d2f3c]/70 flex justify-between items-center select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wider">{getLaneHeadingB()}</span>
                        <div className="h-2.5 w-[1px] bg-[#2d2f3c]"></div>
                        <span className="text-[9px] font-mono text-slate-500">Read-Only</span>
                      </div>
                      <button
                        onClick={() => setStateRightSearch(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                        className={`p-1 rounded transition-colors ${stateRightSearch.isOpen ? 'bg-violet-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-200 hover:bg-[#252632]'} cursor-pointer`}
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
                    />

                    <div 
                      ref={rightPaneContainerRef}
                      className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] min-h-[420px]' : 'h-[420px]'} overflow-y-auto index-0 bg-[#0f1013] scrollbar-thin scrollbar-thumb-slate-800`}
                    >
                      {renderRightPane()}
                    </div>
                  </div>

                </div>

                <div className="text-[10px] text-slate-500 font-sans italic flex items-center gap-1 bg-[#16171d]/60 p-2 rounded border border-[#2d2f3c]/20 shrink-0">
                  <span className="font-bold text-violet-400 shrink-0 font-mono">Tip:</span> 
                  {loc.toolHelp}
                </div>

                {/* JB BULK CONTROL PANEL */}
                <div className="bg-[#14151b] p-4 rounded-xl border border-[#2d2f3c]/60 mt-auto shrink-0 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
                        {tone === TranslationTone.ENGLISH ? "BATCH SOLVER ACTION RAILS" : "CÔNG CỤ GỘP NHANH JETBRAINS"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <button
                        onClick={handleApplyLeft}
                        className="px-3 py-1.5 text-xs font-mono bg-[#1d2333] hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>« Accept All Left (Ours)</span>
                      </button>
                      <button
                        onClick={handleApplyRight}
                        className="px-3 py-1.5 text-xs font-mono bg-[#332615] hover:bg-amber-950/50 border border-amber-500/30 hover:border-amber-500 text-amber-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>Accept All Right (Theirs) »</span>
                      </button>
                      <button
                        onClick={handleApplyBoth}
                        className="px-3 py-1.5 text-xs font-mono bg-violet-950/40 hover:bg-violet-950/70 border border-violet-500/20 hover:border-violet-500 text-violet-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>Merge Both Chunks</span>
                      </button>
                      <button
                        onClick={handleResetMerge}
                        className="px-3 py-1.5 text-xs font-mono bg-[#282a36] hover:bg-slate-800 border border-[#44475a]/30 text-slate-400 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Reset File</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 border-t border-[#2d2f3c]/45 pt-4">
                    <button
                      onClick={handleResolveSubmit}
                      disabled={isCurrentlyDirty}
                      className={`text-xs px-5 py-2.5 rounded-lg font-mono font-black border flex items-center gap-1.5 transition-all active:scale-95 ${
                        isCurrentlyDirty 
                          ? 'bg-[#18191f] text-slate-600 border-none cursor-not-allowed' 
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


















