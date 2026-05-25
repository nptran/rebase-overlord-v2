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
  Maximize2
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
    laneA: "LÀN A: OURS (Nhánh tính năng)",
    laneB: "LÀN B: THEIRS (Nhánh Develop)",
    btnOurs: "Bản của bạn",
    btnTheirs: "Bản Merge Gốc",
    actionTitle: "CHỌN PHƯƠNG ÁN HỢP NHẤT:",
    optOurs: "Lấy Ours (Lane A)",
    optTheirs: "Lấy Theirs (Lane B)",
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
    toolHelp: "Lớp màu tím/xanh nhạt thể hiện các thay đổi cục bộ (Ours). Lớp màu hổ phách đại diện cho mã nguồn develop (Theirs) từ xa."
  },
  [TranslationTone.JOKE]: {
    title: "🏥 PHÒNG CẤP CỨU REBASE (REBASE EMERGENCY)",
    desc: "Ối dồi ôi kìa sếp! Code đụng độ nảy lửa rồi. Chọn thuốc chữa nhanh nào.",
    btnContinue: "🔥 TIẾP TỤC KHÔ MÁU (REBASE CONTINUE)",
    colTitle: "HỒ SƠ BỆNH ÁN (CONFLICTS):",
    guideTitle: "KÍP TRỰC CẤP CỨU BÁO:",
    guideText: "Xe rebase đang đổ đèo thì xịt lốp (conflict). Sếp vui lòng chọn phe nhánh tính năng (Ours) hoặc nhánh mẹ (Theirs) gộp lại nhé, hoặc gõ tay sửa khẩn.",
    mergeLanes: "Màn hình gỡ bom hẹn giờ",
    laneA: "PHE TA: OURS (Code sếp viết)",
    laneB: "PHE ĐỊCH: THEIRS (Code trên server)",
    btnOurs: "Lưu hàng của sếp",
    btnTheirs: "Bơm hàng từ xa về",
    actionTitle: "LỰA CHỌN PHÂN CHIA CHIẾN LỢI PHẨM:",
    optOurs: "Lấy phe Ta (Lane A)",
    optTheirs: "Lấy phe Địch (Lane B)",
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
    toolHelp: "Làn màu tím mộng mơ đại diện cho chiếc code sếp viết. Làn màu hổ phách đại diện cho chiếc code vô tri từ thượng giới."
  },
  [TranslationTone.TOXIC]: {
    title: "💀 ĐỐNG NÁT REBASE (REBASE MESS CLEANER)",
    desc: "Sửa code ngu thì giờ ngồi dọn chứ khóc lóc cái gì. Gỡ nhanh tao còn đi ngủ!",
    btnContinue: "🤬 BẤM TIẾP (REBASE CONTINUE)",
    colTitle: "BÃI CHIẾN TRƯỜNG:",
    guideTitle: "VĂN PHÒNG CHỬI BỚT:",
    guideText: "Sửa chung 1 dòng chứ gì, dở hơi cám hấp! Chọn giải pháp lấy Ours (mày viết) hoặc Theirs (thằng khác viết) để dọn cái đống rác này, đừng để tao cáu.",
    mergeLanes: "Lớp chia tài sản tranh chấp",
    laneA: "BẢN CỦA MÀY: OURS (Tự làm tự chịu)",
    laneB: "BẢN GỐC: THEIRS (Của thằng đồng nghiệp)",
    btnOurs: "Lấy đồ của mày",
    btnTheirs: "Lấy đồ gốc",
    actionTitle: "ĐỊNH ĐOẠT SỐ PHẬN:",
    optOurs: "Lấy đồ ngu của Tao",
    optTheirs: "Lấy đồ gốc trên máy",
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
    toolHelp: "Học gõ code đi rồi biết màu nào ra màu nấy. Màu tím là code rác của mày, màu vàng là dọn phân của thằng commit chung."
  },
  [TranslationTone.ENGLISH]: {
    title: "COMPARE & RESOLVE (JETBRAINS 3-WAY MERGE)",
    desc: "A highly-polished 3-way conflict viewer mimicking JetBrains IDE. Resolve blocks or edit results live.",
    btnContinue: "SUBMIT & REBASE CONTINUE",
    colTitle: "CONFLICTED FILES VIEW:",
    guideTitle: "JETBRAINS DIRECTIVES:",
    guideText: "Click code insertion arrows (>> on Left, << on Right) to automatically inject blocks into the center pane. You can edit the code directly inside the Result panel.",
    mergeLanes: "JetBrains 3-Way Comparative Channels",
    laneA: "LOCAL CHANGES (OURS) — FEATURE BRANCH",
    laneB: "INCOMING CHANGES (THEIRS) — ORIGIN/DEVELOP",
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
    toolHelp: "Soft purple/blue indicates your local commit changes. Deep amber highlights development server modifications."
  }
};

interface ConflictSolverProps {
  conflicts: ConflictFile[];
  tone: TranslationTone;
  onResolveFile: (filepath: string, resolvedContent: string) => void;
  onCompleteRecovery: () => void;
}

// Conflict blocks parser
const parseConflictDetails = (file: ConflictFile) => {
  if (file.filepath.includes('payment.ts') || !file.contentBefore.includes('<<<<<<<')) {
    // Elegant realistic code for payment webhook conflict
    const commonBefore = [
      'const express = require("express");',
      'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);'
    ].join('\n');

    const oursCode = [
      '// Alex Nguyen: Add stripe secure charge webhook',
      'app.post("/api/v2/charge", async (req, res) => {',
      '  const { amount, currency } = req.body;',
      '  const paymentIntent = await stripe.paymentIntents.create({',
      '    amount,',
      '    currency,',
      '    metadata: { integration: "rebase-overlord-secured" }',
      '  });',
      '  res.json({ clientSecret: paymentIntent.client_secret });',
      '});'
    ].join('\n');

    const theirsCode = [
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
      '});'
    ].join('\n');

    const commonAfter = '';

    const originalText = [
      commonBefore,
      '',
      '<<<<<<< Local changes (Ours)',
      oursCode,
      '=======',
      theirsCode,
      '>>>>>>> Incoming develop changes (Theirs)',
      commonAfter
    ].join('\n').trim();

    return {
      commonBefore,
      ours: oursCode,
      theirs: theirsCode,
      commonAfter,
      originalText
    };
  }

  // Fallback dynamic string parsed from standard conflict markers
  const lines = file.contentBefore.split('\n');
  const oursLines: string[] = [];
  const theirsLines: string[] = [];
  const beforeLines: string[] = [];
  const afterLines: string[] = [];
  let currentSec: 'before' | 'ours' | 'theirs' | 'after' = 'before';

  for (const line of lines) {
    if (line.startsWith('<<<<<<<')) {
      currentSec = 'ours';
    } else if (line.startsWith('=======')) {
      currentSec = 'theirs';
    } else if (line.startsWith('>>>>>>>')) {
      currentSec = 'after';
    } else {
      if (currentSec === 'before') beforeLines.push(line);
      else if (currentSec === 'ours') oursLines.push(line);
      else if (currentSec === 'theirs') theirsLines.push(line);
      else if (currentSec === 'after') afterLines.push(line);
    }
  }

  return {
    commonBefore: beforeLines.join('\n'),
    ours: oursLines.join('\n'),
    theirs: theirsLines.join('\n'),
    commonAfter: afterLines.join('\n'),
    originalText: file.contentBefore
  };
};

export default function ConflictSolver({
  conflicts,
  tone,
  onResolveFile,
  onCompleteRecovery
}: ConflictSolverProps) {
  const [selectedFile, setSelectedFile] = React.useState<ConflictFile | null>(conflicts[0] || null);
  const [editorText, setEditorText] = React.useState('');
  const [activeDetails, setActiveDetails] = React.useState<ReturnType<typeof parseConflictDetails> | null>(null);
  const [isMinimized, setIsMinimized ] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (conflicts.length > 0 && (!selectedFile || !conflicts.some(c => c.filepath === selectedFile.filepath))) {
      setSelectedFile(conflicts[0]);
    }
  }, [conflicts, selectedFile]);

  React.useEffect(() => {
    if (selectedFile) {
      const details = parseConflictDetails(selectedFile);
      setActiveDetails(details);
      
      // If file is already resolved, use its resolvedContent
      if (selectedFile.isResolved && selectedFile.resolvedContent) {
        setEditorText(selectedFile.resolvedContent);
      } else {
        // Start center with conflict representation
        setEditorText(details.originalText);
      }
    } else {
      setActiveDetails(null);
      setEditorText('');
    }
  }, [selectedFile]);

  // Action methods to merge side values directly into center editor
  const handleApplyLeft = () => {
    if (!activeDetails) return;
    const merged = [
      activeDetails.commonBefore,
      '',
      activeDetails.ours,
      activeDetails.commonAfter
    ].join('\n').trim();
    setEditorText(merged);
  };

  const handleApplyRight = () => {
    if (!activeDetails) return;
    const merged = [
      activeDetails.commonBefore,
      '',
      activeDetails.theirs,
      activeDetails.commonAfter
    ].join('\n').trim();
    setEditorText(merged);
  };

  const handleApplyBoth = () => {
    if (!activeDetails) return;
    const merged = [
      activeDetails.commonBefore,
      '',
      activeDetails.theirs,
      '',
      activeDetails.ours,
      activeDetails.commonAfter
    ].join('\n').trim();
    setEditorText(merged);
  };

  const handleResetMerge = () => {
    if (!activeDetails) return;
    setEditorText(activeDetails.originalText);
  };

  const handleResolveSubmit = () => {
    if (!selectedFile) return;
    
    // Save final merged code
    onResolveFile(selectedFile.filepath, editorText);

    // Calculate how many unresolved conflicts remain (excluding the one we just resolved)
    const remainingUnresolved = conflicts.filter(
      c => c.filepath !== selectedFile.filepath && !c.isResolved
    );

    if (remainingUnresolved.length > 0) {
      setSelectedFile(remainingUnresolved[0]);
    } else {
      // No more unresolved files left! Automatically continue the rebase flow.
      onCompleteRecovery();
    }
  };

  const allResolved = conflicts.length > 0 && conflicts.every(c => c.isResolved);
  const loc = localization[tone] || localization[TranslationTone.PROFESSIONAL];

  // Helper to count conflict marker blocks remaining in the editor
  const countOccurrences = (str: string, substr: string) => {
    return str.split(substr).length - 1;
  };
  const totalMarkerBlocks = countOccurrences(editorText, '<<<<<<<');

  // Calculated display lines
  const parsedOursLines = activeDetails ? `${activeDetails.commonBefore}\n\n${activeDetails.ours}`.split('\n') : [];
  const parsedTheirsLines = activeDetails ? `${activeDetails.commonBefore}\n\n${activeDetails.theirs}`.split('\n') : [];
  const parsedCenterLines = editorText.split('\n');

  // JetBrains 3-Way synchronized Diff representation
  const isPaymentFile = selectedFile?.filepath.includes('payment.ts');

  // Define synchronized lines to layout side-by-side with identical rows
  const alignedOurs = [
    { text: 'const express = require("express");', type: 'normal' as const, el: <span>const express = require("express");</span> },
    { text: 'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);', type: 'normal' as const, el: <span>const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);</span> },
    { text: '', type: 'normal' as const, el: <span>&nbsp;</span> },
    { text: '// Alex Nguyen: Add stripe secure charge webhook', type: 'addition' as const, el: <span className="text-emerald-400 font-medium">// Alex Nguyen: Add stripe secure charge webhook</span> },
    { text: 'app.post("/api/v2/charge", async (req, res) => {', type: 'modification' as const, el: <span>app.post(<span className="bg-blue-500/15 text-blue-300 font-bold px-0.5 rounded">"/api/v2/charge"</span>, async (req, res) =&gt; {"{"}</span> },
    { text: '  const { amount, currency } = req.body;', type: 'modification' as const, el: <span>&nbsp;&nbsp;const {"{"} <span className="bg-blue-500/20 px-1 border-b border-blue-400/50 rounded text-blue-200">amount, currency</span> {"}"} = req.body;</span> },
    { text: '', type: 'spacer' as const, el: null },
    { text: '  const paymentIntent = await stripe.paymentIntents.create({', type: 'modification' as const, el: <span>&nbsp;&nbsp;const <span className="bg-blue-500/20 px-1 border-b border-blue-400/50 rounded text-blue-200">paymentIntent</span> = await stripe.<span className="bg-purple-500/20 px-1 border-b border-purple-400/50 rounded text-purple-200">paymentIntents</span>.create({"{"}</span> },
    { text: '    amount,', type: 'normal' as const, el: <span>&nbsp;&nbsp;&nbsp;&nbsp;amount,</span> },
    { text: '    currency,', type: 'normal' as const, el: <span>&nbsp;&nbsp;&nbsp;&nbsp;currency,</span> },
    { text: '    metadata: { integration: "rebase-overlord-secured" }', type: 'addition' as const, el: <span>&nbsp;&nbsp;&nbsp;&nbsp;metadata: {"{"} <span className="bg-emerald-500/20 px-1 border-b border-emerald-400/50 rounded text-emerald-300">integration: "rebase-overlord-secured"</span> {"}"}</span> },
    { text: '', type: 'spacer' as const, el: null },
    { text: '  });', type: 'normal' as const, el: <span>&nbsp;&nbsp;{"}"});</span> },
    { text: '  res.json({ clientSecret: paymentIntent.client_secret });', type: 'modification' as const, el: <span>&nbsp;&nbsp;res.json({"{"} <span className="bg-blue-500/20 px-1 border-b border-blue-400/50 rounded text-blue-200">clientSecret: paymentIntent.client_secret</span> {"}"});</span> },
    { text: '});', type: 'normal' as const, el: <span>{"}"});</span> }
  ];

  const alignedTheirs = [
    { text: 'const express = require("express");', type: 'normal' as const, el: <span>const express = require("express");</span> },
    { text: 'const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);', type: 'normal' as const, el: <span>const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);</span> },
    { text: '', type: 'normal' as const, el: <span>&nbsp;</span> },
    { text: '', type: 'spacer' as const, el: null },
    { text: 'app.post("/api/v2/charge", async (req, res) => {', type: 'modification' as const, el: <span>app.post(<span className="bg-blue-500/15 text-blue-300 font-bold px-0.5 rounded">"/api/v2/charge"</span>, async (req, res) =&gt; {"{"}</span> },
    { text: '  const { amount, currency, telemetryId } = req.body;', type: 'modification' as const, el: <span>&nbsp;&nbsp;const {"{"} amount, currency<span className="bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/45 px-1 py-0.5 rounded ml-1">, telemetryId</span> {"}"} = req.body;</span> },
    { text: '  logger.info(`Intake transaction telemetry: ${telemetryId}`);', type: 'addition' as const, el: <span className="text-emerald-400">&nbsp;&nbsp;<span className="bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30 px-1 rounded">logger.info(`Intake transaction telemetry: {"$"}{"{"}telemetryId{"}"}`);</span></span> },
    { text: '  const charge = await stripe.charges.create({', type: 'modification' as const, el: <span>&nbsp;&nbsp;const <span className="bg-amber-500/10 border-b border-amber-450/40 px-1 rounded text-amber-205">charge</span> = await stripe.<span className="bg-amber-500/10 border-b border-amber-450/40 px-1 rounded text-amber-205">charges</span>.create({"{"}</span> },
    { text: '    amount,', type: 'normal' as const, el: <span>&nbsp;&nbsp;&nbsp;&nbsp;amount,</span> },
    { text: '    currency,', type: 'normal' as const, el: <span>&nbsp;&nbsp;&nbsp;&nbsp;currency,</span> },
    { text: '', type: 'spacer' as const, el: null },
    { text: '    description: "Legacy charges backup pipeline"', type: 'addition' as const, el: <span className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;<span className="bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/30 px-1 rounded">description: "Legacy charges backup pipeline"</span></span> },
    { text: '  });', type: 'normal' as const, el: <span>&nbsp;&nbsp;{"}"});</span> },
    { text: '  res.json({ success: true, charge });', type: 'modification' as const, el: <span>&nbsp;&nbsp;res.json({"{"} <span className="bg-[#3b301a] border-b border-amber-500/40 px-0.5 rounded text-amber-250">success: true, charge</span> {"}"});</span> },
    { text: '});', type: 'normal' as const, el: <span>{"}"});</span> }
  ];

  // Verify if Git conflict markers still reside inside the merged text
  const isCurrentlyDirty = editorText.includes('<<<<<<<') || editorText.includes('=======') || editorText.includes('>>>>>>>');

  // Rendering for Minimized state - highly polished visual placeholder card and fixed floating widget
  if (isMinimized) {
    return (
      <>
        {/* Sleek inline placeholder on original board layout */}
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

        {/* Global floating hotkey bridge at bottom-right corner of web view */}
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
        {/* Top ambient JetBrains warning bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-600 via-amber-500 to-emerald-500"></div>

        {/* Main title section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-[#2d2f3c] pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#2d2f3c] text-violet-400 border border-violet-500/20 rounded font-mono text-[10px] font-bold tracking-wider uppercase">
                {isFullscreen ? "IDEA MERGE DIALOG (FULL SCREEN)" : "IDEA MERGE DIALOG"}
              </span>
              <h2 className="text-base font-black text-[#e8eef5] font-mono flex items-center gap-1.5">
                <Code2 className="w-5 h-5 text-violet-400 rotate-12" />
                {loc.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              {loc.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Elegant full screen toggle button next to minimize */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 text-xs bg-[#242632] hover:bg-[#2d3042] text-violet-400 rounded-lg border border-violet-500/20 hover:border-violet-500/45 transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title={isFullscreen ? "Restore standard size" : "Expand to full screen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-violet-400" /> : <Maximize2 className="w-3.5 h-3.5 text-violet-400" />}
              <span>{isFullscreen ? (tone === TranslationTone.ENGLISH ? "Restore down" : "Cửa sổ nhỏ") : (tone === TranslationTone.ENGLISH ? "Full Screen" : "Toàn màn hình")}</span>
            </button>

            {/* Elegant Minimize button next to Submit */}
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
                className="w-full xl:w-auto px-6 py-2.5 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-lg font-mono font-bold shadow-lg shadow-emerald-500/15 border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all animate-pulse"
              >
                <Check className="w-4 h-4 font-black" /> {loc.btnContinue}
              </button>
            )}
          </div>
        </div>

        {/* Grid Layout of JetBrains Conflicts Dialog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch overflow-y-auto flex-1 pr-1">
          
          {/* Leftmost Sidebar: Files Tree List */}
          <div className={`${isSidebarCollapsed ? 'hidden' : 'lg:col-span-3 flex'} flex-col gap-2.5 bg-[#17181c] p-3 rounded-xl border border-[#2d2f3c]/60 h-full ${isFullscreen ? 'max-h-none h-[calc(100vh-210px)]' : 'max-h-[560px]'}`}>
            <div className="flex justify-between items-center border-b border-[#2d2f3c]/40 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-bold">{loc.colTitle}</span>
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
                          : 'bg-[#1a1b22] border-[#25262c] text-slate-400 hover:border-[#2d2f3c] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[70%] truncate">
                      <FileCode2 className={`w-4 h-4 shrink-0 ${file.isResolved ? 'text-emerald-400' : 'text-amber-500'}`} />
                      <span className="truncate">{file.filepath}</span>
                    </div>
                    {file.isResolved ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                        RESOLVED
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 animate-pulse">
                        CONFLICT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="bg-[#14151a] rounded-lg p-3 border border-[#23242c] text-[11px] text-slate-400 leading-relaxed font-sans mt-auto">
              <span className="font-bold text-slate-300 flex items-center gap-1 font-mono text-[10px] mb-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> {loc.guideTitle}
              </span>
              {loc.guideText}
            </div>
          </div>

          {/* Right 3-Way Editor Workspace */}
          <div className={`${isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} bg-[#1a1b22] border border-[#2d2f3c]/50 rounded-xl p-4 flex flex-col gap-4 h-full`}>
            {selectedFile && activeDetails ? (
              <>
                {/* Active Header for File */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#17181c] px-3.5 py-2 rounded border border-[#2d2f3c]/40 text-xs font-mono gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    {isSidebarCollapsed && (
                      <button
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="mr-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#242632] hover:bg-[#2d3042] border border-violet-500/30 hover:border-violet-500/65 rounded text-violet-400 transition-all font-mono cursor-pointer active:scale-95"
                        title="Show File Tree list"
                      >
                        <Files className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{tone === TranslationTone.ENGLISH ? "Files Tree" : "Hiện danh sách"} ({conflicts.filter(c => c.isResolved).length}/{conflicts.length})</span>
                      </button>
                    )}
                    <span className="text-slate-400">File: </span>
                    <strong className="text-violet-400 px-1.5 py-0.5 bg-[#25262e] rounded-md border border-[#2d2f3c]/60">{selectedFile.filepath}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                    {selectedFile.isResolved ? loc.statusResolved : `${loc.statusConflict} (1 Block)`}
                  </div>
                </div>

                {/* JETBRAINS 3-WAY SIDE BY SIDE INTERACTIVE PANELS - Height enlarged to h-[440px] for massive workspace representation */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                  
                  {/* 1. LEFT PANE - Local Changes (Ours) */}
                  <div className="flex flex-col bg-[#1e2026] rounded-lg border border-[#2d2f3c] overflow-hidden">
                    <div className="bg-[#17181c] px-3 py-1.5 border-b border-[#2d2f3c] flex justify-between items-center">
                      <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-wider">{loc.laneA}</span>
                      <span className="text-[9px] font-mono text-slate-500">Read-Only</span>
                    </div>

                    {/* Left Code Area with insertion control */}
                    <div className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-300px)] min-h-[400px]' : 'h-[440px]'} overflow-y-auto index-0 font-mono text-[11px] leading-5 text-slate-300`}>
                      {/* Line numbers channel */}
                      <div className="bg-[#17181c] px-2 text-right text-slate-650 select-none border-r border-[#2d2f3c] w-9 flex flex-col pt-3">
                        {(() => {
                          let lineNumber = 0;
                          const linesToMap = isPaymentFile ? alignedOurs : parsedOursLines.map(text => ({ text, type: 'normal' as const }));
                          return linesToMap.map((row, i) => {
                            if (row.type !== 'spacer') {
                              lineNumber++;
                            }
                            return (
                              <div key={i} className="h-5 text-[10px] leading-5 font-mono select-none">
                                {row.type === 'spacer' ? ' ' : lineNumber}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Left Code content */}
                      <div className="p-3 w-full overflow-x-auto whitespace-pre select-text text-slate-400 scrollbar-thin scrollbar-thumb-slate-800">
                        {(() => {
                          const linesToMap = isPaymentFile ? alignedOurs : parsedOursLines.map(text => ({ text, type: 'normal' as const }));
                          return linesToMap.map((row, idx) => {
                            // Define class name based on row type
                            let rowClass = 'opacity-85 text-slate-300';
                            if (row.type === 'addition') {
                              rowClass = 'bg-emerald-950/20 text-emerald-250 font-semibold border-l-[3px] border-emerald-500';
                            } else if (row.type === 'deletion') {
                              rowClass = 'bg-slate-500/10 text-slate-400 line-through decoration-slate-600 border-l-[3px] border-slate-500/40';
                            } else if (row.type === 'modification') {
                              rowClass = 'bg-blue-950/30 text-blue-200 font-medium border-l-[3px] border-blue-500';
                            } else if (row.type === 'spacer') {
                              return (
                                <div key={idx} className="min-w-fit px-1 h-5 flex items-center bg-[#15161c]/50 text-[#1e1f26] font-mono select-none overflow-hidden pointer-events-none opacity-40">
                                  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                </div>
                              );
                            }

                            return (
                              <div 
                                key={idx} 
                                className={`min-w-fit px-1 h-5 flex items-center ${rowClass}`}
                              >
                                {row.el !== undefined ? row.el : (row.text || ' ')}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* JetBrains interactive Left Arrow insertion panel on right gutter */}
                      {(!selectedFile.isResolved) && (
                        <div className="absolute right-2 top-[100px] flex flex-col gap-1 z-10">
                          <button
                            onClick={handleApplyLeft}
                            title={loc.btnOurs}
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold p-1 rounded-md text-white border border-indigo-400 flex items-center justify-center cursor-pointer shadow-lg active:scale-90 transition-all hover:scale-105"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. MIDDLE PANE - Live Editable Result (Intellij Result Section) */}
                  <div className="flex flex-col bg-[#16171d] rounded-lg border-2 border-violet-500/50 shadow-inner overflow-hidden">
                    <div className="bg-[#0f1013] px-3 py-1.5 border-b border-[#2d2f3c] flex justify-between items-center">
                      <span className="text-[10px] font-mono text-violet-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <Settings2 className="w-3.5 h-3.5 text-violet-400" />
                        {loc.resultPane}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Active conflict counter in the Result pane header rather than an obstructive overlay */}
                        {isCurrentlyDirty ? (
                          <span className="text-[10px] px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-405 rounded-md font-extrabold font-mono flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            {totalMarkerBlocks} REMAIN
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-extrabold font-mono flex items-center gap-1">
                            <Check className="w-3" />
                            RESOLVED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Result Panel Editor */}
                    <div className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-300px)] min-h-[400px]' : 'h-[440px]'} overflow-y-auto font-mono text-[11px] leading-5`}>
                      {/* Line numbers gutter */}
                      <div className="bg-[#0e0f12] px-2 text-right text-slate-600 select-none border-r border-[#2d2f3c] w-9">
                        {parsedCenterLines.map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>

                      {/* Main Editable Text Area formatted elegantly like a dark editor */}
                      <textarea
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                        className="w-full bg-[#16171d] border-none text-[#e8eef5] outline-none p-3 resize-none font-mono text-[11.5px] leading-5 focus:ring-0 leading-relaxed overflow-x-auto whitespace-pre select-text h-full placeholder:text-slate-600 scrollbar-thin scrollbar-thumb-slate-800"
                        placeholder={loc.placeholderCustom}
                      />

                      {/* Tiny elegant corner badge displaying conflict alerts without obstruction */}
                      {isCurrentlyDirty && (
                        <span className="absolute bottom-3 right-3 px-2 py-1 bg-rose-950/90 border border-rose-500/40 text-rose-350 rounded-md font-extrabold text-[9px] shadow-lg flex items-center gap-1 font-mono pointer-events-none select-none z-10">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          {totalMarkerBlocks} {tone === TranslationTone.ENGLISH ? "CONFLICTS LEFT" : "MARKER CHƯA GIẢI QUYẾT"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. RIGHT PANE - Incoming Changes (Theirs) */}
                  <div className="flex flex-col bg-[#1e2026] rounded-lg border border-[#2d2f3c] overflow-hidden">
                    <div className="bg-[#17181c] px-3 py-1.5 border-b border-[#2d2f3c] flex justify-between items-center">
                      <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wider">{loc.laneB}</span>
                      <span className="text-[9px] font-mono text-slate-500">Read-Only</span>
                    </div>

                    {/* Right Code Area with insertion control */}
                    <div className={`flex relative items-stretch ${isFullscreen ? 'h-[calc(100vh-320px)] lg:h-[calc(100vh-300px)] min-h-[400px]' : 'h-[440px]'} overflow-y-auto index-0 font-mono text-[11px] leading-5 text-slate-300`}>
                      {/* Line numbers channel */}
                      <div className="bg-[#17181c] px-2 text-right text-slate-650 select-none border-r border-[#2d2f3c] w-9 flex flex-col pt-3">
                        {(() => {
                          let lineNumber = 0;
                          const linesToMap = isPaymentFile ? alignedTheirs : parsedTheirsLines.map(text => ({ text, type: 'normal' as const }));
                          return linesToMap.map((row, i) => {
                            if (row.type !== 'spacer') {
                              lineNumber++;
                            }
                            return (
                              <div key={i} className="h-5 text-[10px] leading-5 font-mono select-none">
                                {row.type === 'spacer' ? ' ' : lineNumber}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Right Code content */}
                      <div className="p-3 w-full overflow-x-auto whitespace-pre select-text text-slate-400 scrollbar-thin scrollbar-thumb-slate-800">
                        {(() => {
                          const linesToMap = isPaymentFile ? alignedTheirs : parsedTheirsLines.map(text => ({ text, type: 'normal' as const }));
                          return linesToMap.map((row, idx) => {
                            // Define class name based on row type
                            let rowClass = 'opacity-85 text-slate-300';
                            if (row.type === 'addition') {
                              rowClass = 'bg-emerald-950/20 text-emerald-250 font-semibold border-l-[3px] border-emerald-500';
                            } else if (row.type === 'deletion') {
                              rowClass = 'bg-slate-500/10 text-slate-400 line-through decoration-slate-600 border-l-[3px] border-slate-500/40';
                            } else if (row.type === 'modification') {
                              rowClass = 'bg-amber-950/20 text-amber-205 font-medium border-l-[3px] border-amber-500';
                            } else if (row.type === 'spacer') {
                              return (
                                <div key={idx} className="min-w-fit px-1 h-5 flex items-center bg-[#15161c]/50 text-[#1e1f26] font-mono select-none overflow-hidden pointer-events-none opacity-40">
                                  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                </div>
                              );
                            }

                            return (
                              <div 
                                key={idx} 
                                className={`min-w-fit px-1 h-5 flex items-center ${rowClass}`}
                              >
                                {row.el !== undefined ? row.el : (row.text || ' ')}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* JetBrains interactive Right Arrow insertion panel on left gutter */}
                      {(!selectedFile.isResolved) && (
                        <div className="absolute left-2 top-[100px] flex flex-col gap-1 z-10">
                          <button
                            onClick={handleApplyRight}
                            title={loc.btnTheirs}
                            className="bg-amber-600 hover:bg-amber-500 font-bold p-1 rounded-md text-slate-950 border border-amber-400 flex items-center justify-center cursor-pointer shadow-lg active:scale-90 transition-all hover:scale-105"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Intellij toolbar help label */}
                <div className="text-[10px] text-slate-500 font-sans italic flex items-center gap-1 bg-[#16171d]/60 p-2 rounded border border-[#2d2f3c]/20 shrink-0">
                  <span className="font-bold text-violet-400 shrink-0 font-mono">Tip:</span> 
                  {loc.toolHelp}
                </div>

                {/* JETBRAINS CONFLICT RESOLVING QUICK ACTIONS TOOLBAR */}
                <div className="bg-[#14151b] p-4 rounded-xl border border-[#2d2f3c]/60 mt-auto shrink-0 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">{loc.actionTitle}</span>
                    </div>

                    {/* Toolbar action buttons styling like JetBrains */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <button
                        onClick={handleApplyLeft}
                        className="px-3 py-1.5 text-xs font-mono bg-[#1d2333] hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>{loc.optOurs}</span>
                      </button>
                      <button
                        onClick={handleApplyRight}
                        className="px-3 py-1.5 text-xs font-mono bg-[#332615] hover:bg-amber-950/50 border border-amber-500/30 hover:border-amber-500 text-amber-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>{loc.optTheirs}</span>
                      </button>
                      <button
                        onClick={handleApplyBoth}
                        className="px-3 py-1.5 text-xs font-mono bg-violet-950/40 hover:bg-violet-950/70 border border-violet-500/20 hover:border-violet-500 text-violet-300 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                      >
                        <span>{loc.optBoth}</span>
                      </button>
                      <button
                        onClick={handleResetMerge}
                        className="px-3 py-1.5 text-xs font-mono bg-[#282a36] hover:bg-slate-800 border border-[#44475a]/30 text-slate-400 rounded cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
                        title={loc.optCustom}
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 border-t border-[#2d2f3c]/45 pt-4">
                    <button
                      onClick={handleResolveSubmit}
                      disabled={isCurrentlyDirty}
                      className={`text-xs px-5 py-2.5 rounded-lg font-mono font-bold border flex items-center gap-1.5 transition-all active:scale-95 ${
                        isCurrentlyDirty 
                          ? 'bg-[#18191f] text-slate-600 border-none cursor-not-allowed' 
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-600/20 shadow shadow-orange-505/10 cursor-pointer text-[#0b0f19]'
                      }`}
                    >
                      <GitCompare className="w-4 h-4 font-bold" /> {loc.btnConfirm}
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
