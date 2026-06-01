/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Terminal, Trash2, Copy, Check, EyeOff, Eye, 
  Sparkles, Brain, AlertTriangle, Play, X, Info 
} from 'lucide-react';
import { TranslationTone } from '../types';

const termLoc: Record<string, Record<string, string>> = {
  [TranslationTone.PROFESSIONAL]: {
    suggestionHeader: "Gợi ý sửa lỗi / phù hợp:",
    quickSugHeader: "Gợi ý gõ nhanh:",
    restoreDefault: "Khôi phục mặc định",
    placeholder: "Gõ lệnh Git bất kỳ (ví dụ: git checkout develop, git restore file)...",
    analyzing: "Đang phân tích...",
    explainSuggest: "Giải thích & Gợi ý",
    aiTitle: "PHÂN TÍCH LỆNH GIT BẰNG GEMINI AI",
    offlineTitle: "PHÂN TÍCH LỆNH GIT (CHẾ ĐỘ TIẾT KIỆM)",
    cancel: "Huỷ bỏ",
    dangerousTitle: "Lệnh Nguy Hiểm!",
    dangerousWarning: "Cảnh báo: Lệnh này có thể ghi đè lịch sử commits hoặc xoá code chưa staged.",
    betterSolution: "Gợi ý / Giải pháp tốt hơn",
    runAnyway: "Vẫn chạy (Lệnh lỗi cú pháp)",
    confirmRun: "Xác nhận Chạy",
    runningSyntax: "Đang chạy...",
    runningNormal: "Đang chạy lệnh...",
    hiddenLogs: "Thông báo bảng lệnh đang tạm ẩn",
    showLogs: "Hiển thị gõ lệnh & Logs",
    noHistoryLine1: "// Chưa có bản ghi lệnh nào trong phiên làm việc.",
    noHistoryLine2: "// Bạn có thể tự gõ lệnh Git của mình hoặc bấm vào các nút điều hướng để bắt đầu.",
    gitPrefixError: "Chỉ hỗ trợ phân tích và chạy các câu lệnh Git bắt đầu bằng từ khóa \"git\"!",
    gitOnlyError: "Vui lòng chỉ định thêm hành động hoặc tùy chọn sau từ khóa \"git\" (ví dụ: git status, git checkout)!",
    cannotAnalyze: "Không thể phân tích: ",
    unknownError: "Lỗi không xác định",
    connectionError: "Lỗi kết nối phân tích: "
  },
  [TranslationTone.JOKE]: {
    suggestionHeader: "Sửa sai nhanh kẻo sếp chửi:",
    quickSugHeader: "Vẩy phím gõ nhanh:",
    restoreDefault: "Quay xe mặc định",
    placeholder: "Múa phím Git dạo đi nào sếp ơi...",
    analyzing: "Đang bấm quẻ...",
    explainSuggest: "Xin Quẻ & Gợi Ý",
    aiTitle: "GEMINI AI KHAI THÔNG PHÁN LUYỆN 🔮",
    offlineTitle: "ĐỘC SÁCH TRANH THỦ (CHẾ ĐỘ THẤP COI)",
    cancel: "Tha cho sếp",
    dangerousTitle: "Nghịch Dại Phát Hiện!",
    dangerousWarning: "Ớ kìa! Quả lệnh này nguy hiểm cực kỳ, coi chừng bay màu cả dự án nhé!",
    betterSolution: "Tuyệt đỉnh chiêu thức tốt hơn",
    runAnyway: "Lao đầu vào bụi rậm (Vẫn chạy)",
    confirmRun: "Bảo kê chạy luôn sếp",
    runningSyntax: "Đang phá hoại...",
    runningNormal: "Đang múa phím...",
    hiddenLogs: "Nhật ký đang che chắn rồi sếp",
    showLogs: "Khai sáng nhật ký & Cửa sổ lệnh",
    noHistoryLine1: "// Chưa có vụ án nào được lưu lại trong phiên.",
    noHistoryLine2: "// Gõ bừa một câu Git hoặc bấm mấy nút bự bự để quẩy xem sao nha.",
    gitPrefixError: "Gõ nghiêm túc giùm sếp ơi! Phải bắt đầu bằng từ khóa thần thánh \"git\" nhé!",
    gitOnlyError: "Gõ mỗi chữ \"git\" thì AI cũng chịu chết sếp ơi! Cho nó thêm cái đuôi đằng sau đi (ví dụ: git status, git checkout)!",
    cannotAnalyze: "Xem bói thất bại: ",
    unknownError: "Quẻ lỗi không rõ nữa sếp",
    connectionError: "Phát sóng AI nghẹt mũi: "
  },
  [TranslationTone.TOXIC]: {
    suggestionHeader: "Sửa giùm cái tay hư:",
    quickSugHeader: "Hốc tạm mấy cái này:",
    restoreDefault: "Về máng lợn cũ",
    placeholder: "Gõ bừa bãi cái gì vào đây đi cụ ơi...",
    analyzing: "Gõ láo à đợi tí đang rà soát...",
    explainSuggest: "Gáy to lên AI giải thích",
    aiTitle: "QUÁI VẬT GEMINI AI ĐANG SĂN LỖI",
    offlineTitle: "BỘ NÃO GIẤY OFFLINE TỰ TUY ĐOÁN",
    cancel: "Hèn thế từ bỏ à",
    dangerousTitle: "Tính Chuồn À?! (Lệnh Đốt Nhà)",
    dangerousWarning: "Cảnh báo: Lệnh này có thể đốt sạch ổ code của cưng đấy nhé!",
    betterSolution: "Đưa đầu đây tớ chỉ cách khôn hơn",
    runAnyway: "Thích thể hiện (Vẫn chạy)",
    confirmRun: "Liều ăn nhiều, Chạy!",
    runningSyntax: "Đang phá...",
    runningNormal: "Đang nổ máy...",
    hiddenLogs: "Logs giấu kín như mèo giấu cứt",
    showLogs: "Mở mắt ra mà nhìn Logs",
    noHistoryLine1: "// Đéo có vết tích lịch sử nào cả, quá sạch sẽ đáng ngờ.",
    noHistoryLine2: "// Tính lười đến bao giờ? Gõ lệnh rồi bấm chạy đi con lợn gợi cảm!",
    gitPrefixError: "Mắt mũi để đâu hả cụ? Chỉ hỗ trợ phân tích lệnh Git bắt đầu bằng \"git\" thôi!",
    gitOnlyError: "Gõ mỗi chữ \"git\" rồi bắt bà già AI đoán mò à? Thêm subcommand (như 'git status', 'git log') vào hộ cái!",
    cannotAnalyze: "Éo phân tích nổi: ",
    unknownError: "Rác gì tự đoán đi cưng",
    connectionError: "Đứt cáp quang phân tích rồi: "
  },
  [TranslationTone.ENGLISH]: {
    suggestionHeader: "Suggested fixes / matches:",
    quickSugHeader: "Quick suggestions:",
    restoreDefault: "Restore defaults",
    placeholder: "Type any Git command (e.g. git checkout develop, git restore file)...",
    analyzing: "Analyzing...",
    explainSuggest: "Explain & Suggest",
    aiTitle: "GIT ANALYSIS BY GEMINI AI",
    offlineTitle: "GIT ANALYSIS (COST-SAVING OFFLINE MODE)",
    cancel: "Cancel",
    dangerousTitle: "Dangerous Command!",
    dangerousWarning: "Warning: This command might overwrite commit history or discard unstaged changes.",
    betterSolution: "Better Suggestions / Solutions",
    runAnyway: "Run Anyway (Syntax issue)",
    confirmRun: "Confirm Execution",
    runningSyntax: "Running...",
    runningNormal: "Running command...",
    hiddenLogs: "Console output is hidden",
    showLogs: "Show Terminal & Logs",
    noHistoryLine1: "// No command records in this session yet.",
    noHistoryLine2: "// Try typing a Git command or click navigation buttons to get started.",
    gitPrefixError: "Only analysis and execution of Git commands starting with \"git\" are supported!",
    gitOnlyError: "Please specify a subcommand or action after \"git\" (e.g., git status, git log)!",
    cannotAnalyze: "Could not analyze: ",
    unknownError: "Unknown error",
    connectionError: "Analysis connection error: "
  }
};

interface TerminalPanelProps {
  logs: string[];
  showLogPanel: boolean;
  onToggleLogPanel: () => void;
  onClearLogs: () => void;
  tone: string;
  isSimulation: boolean;
  onCommandExecuted: () => void;
  addLog: (line: string) => void;
  resolveApiUrl: (path: string) => string;
  isAiEnabled?: boolean;
}

export default function TerminalPanel({
  logs,
  showLogPanel,
  onToggleLogPanel,
  onClearLogs,
  tone,
  isSimulation,
  onCommandExecuted,
  addLog,
  resolveApiUrl,
  isAiEnabled = true
}: TerminalPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const loc = termLoc[tone] || termLoc[TranslationTone.PROFESSIONAL];
  const containerRef = React.useRef<HTMLDivElement>(null);

  const findBestGitSubcommand = (subcmd: string): { bestCmdName: string; minDistance: number } => {
    const cleanSub = subcmd.toLowerCase().trim();
    const commonCorrections: Record<string, string> = {
      'com': 'commit',
      'comm': 'commit',
      'comit': 'commit',
      'cok': 'checkout',
      'co': 'checkout',
      'chekout': 'checkout',
      'stat': 'status',
      'stats': 'status',
      'statsu': 'status',
      'br': 'branch',
      'branc': 'branch',
      'logg': 'log',
      'rest': 'reset',
      'reb': 'rebase',
      'rebas': 'rebase',
      'pus': 'push',
      'pul': 'pull',
      'fetc': 'fetch',
      'stsh': 'stash',
      'revr': 'revert',
      'merg': 'merge'
    };

    if (commonCorrections[cleanSub]) {
      return { bestCmdName: commonCorrections[cleanSub], minDistance: 0.1 };
    }

    // Thuật toán tính khoảng cách Levenshtein cho so khớp xấp xỉ
    const getLevenshteinDistance = (a: string, b: string): number => {
      const matrix: number[][] = [];
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // Thay thế
              matrix[i][j - 1] + 1,     // Thêm vào
              matrix[i - 1][j] + 1      // Xóa đi
            );
          }
        }
      }
      return matrix[b.length][a.length];
    };

    const validSubcmds = ['status', 'log', 'branch', 'checkout', 'add', 'commit', 'push', 'pull', 'fetch', 'stash', 'reset', 'rebase', 'revert', 'diff', 'merge', 'init', 'clone'];
    
    let bestCmdName = '';
    let minDistance = 999;

    for (const vc of validSubcmds) {
      if (vc === cleanSub) {
        bestCmdName = vc;
        minDistance = 0;
        break;
      }
      if (vc.startsWith(cleanSub)) {
        const diffLen = vc.length - cleanSub.length;
        const score = diffLen * 0.1;
        if (score < minDistance) {
          minDistance = score;
          bestCmdName = vc;
        }
      } else if (cleanSub.startsWith(vc)) {
        const diffLen = cleanSub.length - vc.length;
        const score = diffLen * 0.15;
        if (score < minDistance) {
          minDistance = score;
          bestCmdName = vc;
        }
      } else {
        const dist = getLevenshteinDistance(cleanSub, vc);
        if (dist < minDistance) {
          minDistance = dist;
          bestCmdName = vc;
        }
      }
    }

    return { bestCmdName, minDistance };
  };

  // Custom Git Command prompt states
  const [commandInput, setCommandInput] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [executing, setExecuting] = React.useState(false);
  const [inlineError, setInlineError] = React.useState<string | null>(null);
  const [explanation, setExplanation] = React.useState<{
    explanation: string;
    isDestructive: boolean;
    warningMessage: string;
    suggestion: string;
    suggestedCommands?: string[];
    correctedCommand?: string;
    originalCommand?: string;
  } | null>(null);

  // Dynamic Suggestion Chips state
  const [suggestedChips, setSuggestedChips] = React.useState<string[]>([
    'git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v'
  ]);
  const [chipsSource, setChipsSource] = React.useState<'default' | 'ai'>('default');

  // Ref for typing debounce
  const typingTimeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOfflineGitExplanation = (cmd: string, selectedTone: string) => {
    const tokens = cmd.toLowerCase().trim().split(/\s+/);
    let subcmd = tokens[1] || 'help';
    subcmd = subcmd.trim();

    const { bestCmdName, minDistance } = findBestGitSubcommand(subcmd);

    // Nếu khoảng cách chỉnh sửa quá lớn (> 3.5), coi như không có lệnh phù hợp
    const isMatched = bestCmdName && minDistance <= 3.5;
    const matchedKey = isMatched ? bestCmdName : 'default';

    const db: Record<string, {
      explanation: Record<string, string>;
      warningMessage: Record<string, string>;
      suggestion: Record<string, string>;
      suggestedCommands: string[];
      isDestructive: boolean;
    }> = {
      status: {
        explanation: {
          [TranslationTone.ENGLISH]: "Show the working tree status. Lists paths that have differences between the index file and the current HEAD commit.",
          [TranslationTone.PROFESSIONAL]: "Kiểm tra trạng thái hiện tại của thư mục làm việc, xem có tệp tin nào chưa lưu hoặc bị sửa đổi hay không.",
          [TranslationTone.TOXIC]: "Gương thần bảo trạng thái code dơ hay sạch. Trông bừa bộn thế kia mà chưa thèm add commit à, lười chảy thây!",
          [TranslationTone.JOKE]: "Cân đo sức khỏe dự án. Giúp bạn xem thử mình đang 'nợ nần' Git bao nhiêu tệp tin chưa chịu đóng thuế!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "None. This is a read-only safe inspection command.",
          [TranslationTone.PROFESSIONAL]: "Không có. Đây là lệnh kiểm tra an toàn, không thay đổi bất cứ dữ liệu nào.",
          [TranslationTone.TOXIC]: "Không sợ chết à? Lệnh này chỉ dòm thôi không có làm hư hại gì đâu mà lo!",
          [TranslationTone.JOKE]: "Hoàn toàn vô hại, cứ bấm tẹt ga đi không sợ nổ máy tính đâu!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git add <file>' to track changes, or 'git diff' to view line-by-line updates.",
          [TranslationTone.PROFESSIONAL]: "Gõ 'git add .' để chuẩn bị commit, hoặc 'git diff' để xem chi tiết sửa đổi dòng mã.",
          [TranslationTone.TOXIC]: "Cầm bàn phím lên gõ 'git add .' lẹ đi chứ để đó ngắm à?",
          [TranslationTone.JOKE]: "Đừng quên đóng gói code bằng 'git add .' rồi làm một quả commit thật nghệ thuật nhé!"
        },
        suggestedCommands: ['git add .', 'git diff', 'git log --oneline'],
        isDestructive: false
      },
      log: {
        explanation: {
          [TranslationTone.ENGLISH]: "Show commit logs. Displays the history of commits in reversed chronological order.",
          [TranslationTone.PROFESSIONAL]: "Hiển thị lịch sử lưu trữ (commit history) của nhánh hiện tại, sắp xếp từ mới nhất đến cũ nhất.",
          [TranslationTone.TOXIC]: "Phơi bày toàn bộ lịch sử phạm tội và lười biếng viết code của bạn cùng đồng nghiệp thời gian qua!",
          [TranslationTone.JOKE]: "Cuốn sổ sinh tử ghi nhận mọi dấu vết gõ code của cả đội từ thuở khai thiên lập địa!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "None. Safe to use anytime.",
          [TranslationTone.PROFESSIONAL]: "An toàn tuyệt đối. Thích hợp để rà soát tiến trình lịch sử.",
          [TranslationTone.TOXIC]: "Coi chừng trầm cảm vì thấy đồng nghiệp push 99 cái commit dạo nha!",
          [TranslationTone.JOKE]: "An toàn 100%, bảo hành 5 năm không lo hỏng ổ cứng!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use '--oneline -n 5' to keep output concise, or '--graph' for vertical branching trees.",
          [TranslationTone.PROFESSIONAL]: "Sử dụng 'git log --oneline -n 5' để thu gọn hoặc '--graph' để vẽ luồng nhánh trực quan.",
          [TranslationTone.TOXIC]: "Bớt spam màn hình bằng cách thêm '--oneline' vào cho dễ thở!",
          [TranslationTone.JOKE]: "Muốn nhìn sành điệu như hacker? Thử ngay 'git log --oneline --graph --all' nhé!"
        },
        suggestedCommands: ['git log --oneline -n 5', 'git log --graph --all', 'git show HEAD'],
        isDestructive: false
      },
      rebase: {
        explanation: {
          [TranslationTone.ENGLISH]: "Reapply commits on top of another base tip. Rewrites the commit history of a branch on top of a new base commit.",
          [TranslationTone.PROFESSIONAL]: "Phát lại các commit của nhánh hiện tại lên trên đỉnh gốc của một nhánh tham chiếu mới. Giúp lịch sử Git thẳng tắp, sạch sẽ.",
          [TranslationTone.TOXIC]: "Tẩy não, viết lại lịch sử cuộc đời! Đập móng cũ xây móng mới, cẩn thận kẻo đè nát code của đồng nghiệp rồi khóc thét nha!",
          [TranslationTone.JOKE]: "Cỗ máy du hành thời gian bẻ thẳng tắp lịch sử, ghép thẳng tim bạn vào móng nhà của hàng xóm siêu mượt!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "This is a history-rewriting command. Avoid rebase on shared branches.",
          [TranslationTone.PROFESSIONAL]: "Lệnh thay đổi lịch sử. Không bao giờ Rebase các nhánh chung đã đẩy lên remote mà nhiều người đang làm việc.",
          [TranslationTone.TOXIC]: "REWRITE LỊCH SỬ! Rebase bậy bạ trên nhánh main/production là cả team sẽ tế sống em đó!",
          [TranslationTone.JOKE]: "Hành vi viết lại quá khứ cực kỳ nguy hiểm, có thể tạo ra nghịch lý thời gian và xung đột tung tóe!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git rebase -i HEAD~3' for interactive squash or 'git rebase --abort' if things go wrong.",
          [TranslationTone.PROFESSIONAL]: "Dùng 'git rebase -i HEAD~3' để nén commit, hoặc 'git rebase --abort' nếu gặp xung đột phức tạp muốn hủy bỏ.",
          [TranslationTone.TOXIC]: "Học thuộc lòng lệnh cứu cánh 'git rebase --abort' trước khi nghịch dại nha nhóc!",
          [TranslationTone.JOKE]: "Nếu lỡ tay bốc head Rebase bị xòe, hãy vả ngay 'git rebase --abort' để hồi sinh!"
        },
        suggestedCommands: ['git rebase -i HEAD~5', 'git rebase --abort', 'git rebase --continue'],
        isDestructive: true
      },
      reset: {
        explanation: {
          [TranslationTone.ENGLISH]: "Reset current HEAD to the specified state. Can be destructive if using --hard, reverting uncommitted changes.",
          [TranslationTone.PROFESSIONAL]: "Đặt lại con trỏ HEAD hiện tại về một trạng thái nhất định. Đạt hiệu quả cao để hủy bỏ các thay đổi cũ.",
          [TranslationTone.TOXIC]: "Reset cuộc đời về con số 0 tròn trĩnh! --hard một phát là bay màu hết đống code thức đêm gõ, lúc đó đừng bảo tao không cảnh báo trước nhé!",
          [TranslationTone.JOKE]: "Nút xóa sổ tối thượng, đưa thế giới về thời kỳ đồ đá. Hãy uống thuốc bổ não trước khi gõ '--hard' nha!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Using --hard will permanently discard any uncommitted files of your tree.",
          [TranslationTone.PROFESSIONAL]: "Tham số --hard sẽ xóa sạch vĩnh viễn mọi thay đổi chưa lưu trữ trong Workspace của bạn.",
          [TranslationTone.TOXIC]: "CẢNH BÁO CHÁY NHÀ! --hard sẽ quét sạch không để lại một dấu vết code dở, không cứu nổi đâu!",
          [TranslationTone.JOKE]: "Nghịch lửa diệt vong! Toàn bộ file chưa commit sẽ bốc hơi vào hư vô như cái ví ngày cuối tháng!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git reset --soft HEAD~1' to undo last commit while keeping modify code files.",
          [TranslationTone.PROFESSIONAL]: "Nên ưu tiên 'git reset --soft HEAD~1' để hủy commit gần nhất nhưng vẫn giữ nguyên code sửa đổi.",
          [TranslationTone.TOXIC]: "Khôn hồn thì gõ '--soft' để giữ lại xác code, đừng bao giờ đâm đầu vào '--hard' khi chưa hiểu luật!",
          [TranslationTone.JOKE]: "Muốn quay đầu là bờ? Dùng 'git reset --soft HEAD~1' để rút lại lời thề commit vừa rồi."
        },
        suggestedCommands: ['git reset --soft HEAD~1', 'git reset --hard HEAD~1', 'git reset HEAD'],
        isDestructive: true
      },
      revert: {
        explanation: {
          [TranslationTone.ENGLISH]: "Revert some existing commits. It records some new commits to reverse the effect of some earlier commits (safely without history rewrite).",
          [TranslationTone.PROFESSIONAL]: "Tạo một commit mới đảo ngược lại toàn bộ thay đổi của một commit cũ để sửa sai một cách an toàn mà không viết đè lịch sử.",
          [TranslationTone.TOXIC]: "Ăn vụng rồi đi chùi mép đây mà. Ém nhẹm tội lỗi bằng cách đẻ ra thêm commit ngược đời để chữa cháy. Thật là phong cách!",
          [TranslationTone.JOKE]: "Tấm vé quay xe đi lùi của Git. Đảo ngược thời gian để cứu vãn một đêm lỡ tay code bậy khi say xỉn!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "None. It is non-destructive since it adds a rewrite action on top.",
          [TranslationTone.PROFESSIONAL]: "Rất an toàn. Chỉ tạo thêm commit mới chứ không bôi xóa hay thay đổi các commit lịch sử cũ.",
          [TranslationTone.TOXIC]: "An toàn tuyệt đối nhưng nhìn lịch sử trông sẽ rác rưởi hơn vì lòi thêm một đống commit chùi mép đó cưng!",
          [TranslationTone.JOKE]: "Dễ dàng dọn dẹp hiện trường giả mà không sợ cảnh sát Git sờ gáy!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Provide the commit hash to revert, e.g. 'git revert <commit-hash>'.",
          [TranslationTone.PROFESSIONAL]: "Chỉ định chính xác mã băm commit muốn đảo ngược: 'git revert <commit-hash>'.",
          [TranslationTone.TOXIC]: "Cung cấp mã commit lẹ đi, gõ khơi khơi 'git revert' thì tao cũng chịu sầu!",
          [TranslationTone.JOKE]: "Bấm ngay 'git revert b7c8a12' (gán mã commit vào) để quay ngoắt 180 độ sửa sai!"
        },
        suggestedCommands: ['git revert HEAD', 'git revert --abort', 'git log --oneline'],
        isDestructive: false
      },
      checkout: {
        explanation: {
          [TranslationTone.ENGLISH]: "Switch branches or restore working tree files.",
          [TranslationTone.PROFESSIONAL]: "Chuyển đổi linh hoạt giữa các nhánh hoặc khôi phục các tệp tin trong thư mục làm việc.",
          [TranslationTone.TOXIC]: "Chạy trốn thực tại! Nhảy từ nhánh này sang nhánh khác để trốn tránh đống task chưa hoàn thành chứ gì?",
          [TranslationTone.JOKE]: "Nhảy tàu siêu tốc! Giúp bạn nhảy từ góc làm việc này sang thế giới song song khác mượt mà như rượt đón người yêu cũ."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Ensure your current working tree is clean or changes are stashed before switching.",
          [TranslationTone.PROFESSIONAL]: "Hãy gom sạch hoặc lưu trữ tạm thời thay đổi của bạn trước khi sang nhánh mới để tránh xung đột hoặc mất mát dòng mã.",
          [TranslationTone.TOXIC]: "Đầu óc bã đậu à, nhớ lưu hoặc stash code đi trước khi chuyển nhánh kẻo đè nát đống code chưa kịp lưu nha cưng!",
          [TranslationTone.JOKE]: "Không bọc hành lý là tàu phanh gấp hất văng hết sạch đống hành trang code dở của bạn ra đường đó!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git checkout -b <branch>' to create and switch to a new branch instantly.",
          [TranslationTone.PROFESSIONAL]: "Dùng 'git checkout -b <tên_nhánh>' để vừa tạo nhánh mới vừa chuyển sang nhánh đó trực tiếp.",
          [TranslationTone.TOXIC]: "Bấm 'git checkout -b <tên>' để mở một con đường máu mới cứu vãn cuộc đời đi!",
          [TranslationTone.JOKE]: "Muốn dựng giang sơn độc lập? Vẽ ngay 'git checkout -b feature/awesome'!"
        },
        suggestedCommands: ['git checkout main', 'git checkout -b feature/payment-v2', 'git checkout -- .'],
        isDestructive: false
      },
      branch: {
        explanation: {
          [TranslationTone.ENGLISH]: "List, create, or delete branches in your repository.",
          [TranslationTone.PROFESSIONAL]: "Liệt kê các nhánh đang tồn tại, tạo thêm nhánh phân nhánh mới hoặc xóa các nhánh lỗi thời.",
          [TranslationTone.TOXIC]: "Dựng rào phân lô bán nền! Tạo ra một rừng nhánh rác rưởi rồi cuối cùng có ghép được vào main không hay vứt xó đấy?",
          [TranslationTone.JOKE]: "Danh bạ thế giới song song! Nơi hội tụ các luồng ý tưởng bay bổng từ rực rỡ đến u tối của dự án."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Do not delete a branch that contains unmerged changes unless you are absolutely sure (-D).",
          [TranslationTone.PROFESSIONAL]: "Cẩn thận khi xóa nhánh bằng cờ '-D' (chữ hoa) nếu nhánh đó chứa các thay đổi chưa được gộp (merge) sang nhánh chính.",
          [TranslationTone.TOXIC]: "Gõ 'git branch -D' bậy bạ là tao tiễn đưa các dòng code đi chầu ông bà ông vải luôn không quay đầu lại được đâu!",
          [TranslationTone.JOKE]: "Xóa nhầm nhánh chưa gộp là bay màu công sức thức đêm, lúc đấy gõ cửa khóc thầy cũng chịu chết!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git branch -a' to see both local and remote branches on your upstream repo.",
          [TranslationTone.PROFESSIONAL]: "Nên gõ 'git branch -v' để liệt kê kèm thông tin tóm tắt commit mới nhất của từng nhánh.",
          [TranslationTone.TOXIC]: "Xem bớt đống nhánh rác bằng lệnh 'git branch --merged' để lo dọn dẹp đi!",
          [TranslationTone.JOKE]: "Soi gương thần 'git branch -a' để ngắm trọn vẹn khu rừng thế giới song song nhé."
        },
        suggestedCommands: ['git branch -a', 'git branch -v', 'git branch -d legacy-branch'],
        isDestructive: false
      },
      add: {
        explanation: {
          [TranslationTone.ENGLISH]: "Prepare content stage area for the next commit checkpoint.",
          [TranslationTone.PROFESSIONAL]: "Đưa các tệp thay đổi vào vùng đệm chờ (Staging Area), sẵn sàng đặt bút ký commit.",
          [TranslationTone.TOXIC]: "Mở vali nhét đồ vô! Chọn lọc file dơ để nhét vào hòm trước khi đem khóa. Nhớ né mấy file rác, config thừa ra kẻo vỡ mồm nha!",
          [TranslationTone.JOKE]: "Xếp trứng vào khay! Thu thập đống thành quả vụn vặt gửi chu du vào lồng kén bảo vệ của Git."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Verify what you are staging; adding unwanted binaries or secrets can bloat history.",
          [TranslationTone.PROFESSIONAL]: "Nên kiểm tra kỹ danh sách tệp lưu bằng 'git status' trước khi gõ 'git add .' để tránh đưa nhầm tệp dữ liệu mật hoặc thư mục rác.",
          [TranslationTone.TOXIC]: "Quét sạch rác đi! Đừng có bạ tệp tin rác nào cũng nhét bừa bãi vào staging rồi bắt cả team tải nợ kèm về máy!",
          [TranslationTone.JOKE]: "Cẩn thận nhét nhầm khóa bảo mật bí mật của cắm chốt database lên Cloud là hacker nó cướp trắng tay!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git add -p' to interactively choose specific hunks of changes to stage.",
          [TranslationTone.PROFESSIONAL]: "Đề xuất sử dụng 'git add -p' để duyệt và lưu chọn lọc từng khúc mã nhỏ thay vì gom tất cả.",
          [TranslationTone.TOXIC]: "Khôn hồn thì dùng 'git add <file_name>' thay vì lúc nào cũng bấm '.' một cách vô học và lười vô đối!",
          [TranslationTone.JOKE]: "Có thể chọn 'git add -i' để bước vào giao diện tương tác chọn hàng sành điệu như chuyên gia cổ điển."
        },
        suggestedCommands: ['git add .', 'git add -p', 'git status'],
        isDestructive: false
      },
      commit: {
        explanation: {
          [TranslationTone.ENGLISH]: "Snapshots the staged code files as a permanent version history log.",
          [TranslationTone.PROFESSIONAL]: "Đóng gói những tệp mã nguồn đã gom trong Staging Area thành một mốc phiên bản chính thức (Commit Checkpoint) trong lịch sử.",
          [TranslationTone.TOXIC]: "Đặt bút ký khế ước bán linh hồn cho thần Git! Ghi lời nhắn commit cho đàng hoàng, đừng có gõ 'fix', 'debug', 'asdasd' rồi sếp vả vỡ mồm nhé!",
          [TranslationTone.JOKE]: "Nút 'Lưu Game' thần thánh! Đóng băng hiện trạng code hoạt động hoàn tất để nhỡ đâu nghịch dại còn có đường khôi phục!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "A commit cannot be easily deleted without rewriting branch histories if is already pushed.",
          [TranslationTone.PROFESSIONAL]: "Hãy suy nghĩ kỹ lời miêu tả và nội dung commit của bạn trước khi gõ xác nhận vì nó sẽ đi vào biên sử mãi mãi.",
          [TranslationTone.TOXIC]: "Viết sai lời nhắn commit là dấu ấn tội lỗi lưu truyền ngàn thu, cả cơ quan sẽ cười chê em từ sáng tới tối đấy!",
          [TranslationTone.JOKE]: "Ghi log commit nhạt nhẽo như nước lã sẽ khiến nhà khảo cổ học Git tương lai nổi điên tế sống bạn!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git commit --amend' to quickly update your last local commit details (before push).",
          [TranslationTone.PROFESSIONAL]: "Nếu viết sai tin nhắn commit cuối cùng khi chưa push, hãy gõ ngay 'git commit --amend -m \"Lời nhắn mới\"' để thay thế.",
          [TranslationTone.TOXIC]: "Lỡ tay commit vớ vẩn đúng không? Gõ khẩn trương 'git commit --amend' cứu cánh đi!",
          [TranslationTone.JOKE]: "Dùng cờ cứu hộ '--amend' để chắp vá lỗi lầm lời nhắn tỏ tình vừa gửi lên cho Git."
        },
        suggestedCommands: ['git commit -m "feat: add secure payment v2 API"', 'git commit --amend', 'git commit -am "quick-fix"'],
        isDestructive: false
      },
      push: {
        explanation: {
          [TranslationTone.ENGLISH]: "Upload locally recorded changes onto the host cloud remote repository server.",
          [TranslationTone.PROFESSIONAL]: "Đẩy tất cả các mốc lịch sử commit mới nhất từ máy local của bạn lên máy chủ lưu trữ chung từ xa (ví dụ GitHub, GitLab).",
          [TranslationTone.TOXIC]: "Mang bom hẹn giờ quăng lên server chung! Đẩy code rách nát lên để cho đồng nghiệp gánh tạ chung đúng không?",
          [TranslationTone.JOKE]: "Xuất khẩu chất xám ra thị trường quốc tế! Đem phân phát của cải code sang máy chủ đám mây rực rỡ."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Never use force-push (-f) on mutual shared production branch unless coordinated.",
          [TranslationTone.PROFESSIONAL]: "Nghiêm cấm lạm dụng cờ '-f' (force push) ở các nhánh chính có nhiều người tham gia, vì sẽ ghi đè vĩnh viễn và phá cấu trúc mã của người khác.",
          [TranslationTone.TOXIC]: "BẬT CHẾ ĐỘ HỦY DIỆT! Force-push càn quét là cả team sẽ treo cổ cưng lên cột điện vì tội xóa sạch nợ code của họ đấy!",
          [TranslationTone.JOKE]: "Ấn nút tàn sát force push một cách điên dại có thể tống khứ đồng nghiệp của bạn bay màu khỏi vũ trụ liên hành tinh!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "First perform a pull upstream to integrate remote updates before you attempt push.",
          [TranslationTone.PROFESSIONAL]: "Luôn 'git pull' cập nhật trước khi cố gắng đẩy bài lên để hạn chế tối đa nguy cơ xung đột mã nguồn trực tiếp.",
          [TranslationTone.TOXIC]: "Kéo code mới của đồng nghiệp về gộp đi kẻo push lên bị máy chủ từ chối thẳng thừng nhục nhã mặt mũi!",
          [TranslationTone.JOKE]: "Chơi Git an toàn: Gõ 'git pull' làm lễ chào hỏi rồi mới ung dung 'git push' xuất quan nhé."
        },
        suggestedCommands: ['git push origin feature/payment-v2', 'git push origin main', 'git push --force-with-lease'],
        isDestructive: false
      },
      pull: {
        explanation: {
          [TranslationTone.ENGLISH]: "Fetch updates from the remote host and automatically integrates them into your current active local branch.",
          [TranslationTone.PROFESSIONAL]: "Tải các cập nhật mã nguồn mới nhất từ kho chứa từ xa và tự động hòa trộn, đồng bộ trực tiếp vào nhánh bạn đang đứng.",
          [TranslationTone.TOXIC]: "Lôi đống code mới (và có thể ngập ngụa bug) của người khác đắp vào máy mình! Chuẩn bị giẻ lau để dọn conflict đi!",
          [TranslationTone.JOKE]: "Mở cửa đón luồng gió mới ngoại quốc! Rinh về vô số phát kiến (và rủi ro sập ứng dụng) từ đồng đội."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Can cause merge conflicts on files you edited concurrently.",
          [TranslationTone.PROFESSIONAL]: "Hành động này có thể sinh ra các xung đột nghiêm trọng (Merge Conflicts) trên những dòng tệp tin bạn và đồng nghiệp cùng sửa.",
          [TranslationTone.TOXIC]: "CƠN ÁC MỘNG CONFLICTS! Chuẩn bị sẵn nước tăng lực để ngồi gỡ đống tơ vò sau lệnh pull này đi cưng!",
          [TranslationTone.JOKE]: "Có thể biến căn nhà tranh yên bình của bạn thành bãi chiến trường loang lổ vết chém đỏ rực của Git conflict!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Prefer using 'git pull --rebase' to keep your local commit timelines linear.",
          [TranslationTone.PROFESSIONAL]: "Khuyên dùng cờ '--rebase' để giữ lịch sử nhánh thẳng đẹp, tránh đẻ ra các commit gộp rác.",
          [TranslationTone.TOXIC]: "Bớt lười biếng và gõ thêm '--rebase' vào để vẽ một con đường lịch sử Git thẳng tắp văn minh giùm cái!",
          [TranslationTone.JOKE]: "Nâng cấp phong cách bằng 'git pull --rebase' dọn dẹp sạch bóng dấu vết bừa bộn!"
        },
        suggestedCommands: ['git pull origin feature/payment-v2', 'git pull --rebase', 'git pull origin main'],
        isDestructive: false
      },
      fetch: {
        explanation: {
          [TranslationTone.ENGLISH]: "Download changes and references from remote repository without merging any code.",
          [TranslationTone.PROFESSIONAL]: "Chỉ tải các dữ liệu lịch sử mới nhất từ máy chủ từ xa về để theo dõi tình hình mà không hề can thiệp, gộp đè vào các tệp tin local hiện có.",
          [TranslationTone.TOXIC]: "Đóng vai thám tử đi dòm lén sự lười biếng và lầm lỡ của đồng nghiệp mà không làm bẩn tay hay sứt mẻ code máy mình.",
          [TranslationTone.JOKE]: "Soi ngầm tin tức tình báo! Nhìn trước tương lai từ xa xem bão tố sập đến thế nào để kịp phòng thủ."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "None. This is a very safe, read-only downloading operation.",
          [TranslationTone.PROFESSIONAL]: "Vô hại hoàn toàn. Thích hợp để cập nhật danh sách nhánh mới mà không sợ bất kỳ rủi ro xung đột nào.",
          [TranslationTone.TOXIC]: "Lệnh này hiền khô như đất, không hư hao mảnh code nào đâu nên cứ tự nhiên nghịch thoải mái đi cưng!",
          [TranslationTone.JOKE]: "Lệnh an toàn chuẩn năm quốc gia, chạy xong ôm gối ngủ ngon lành không lo dập nát máy."
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "After fetch, use 'git status' or 'git log HEAD..origin/main' to compare incoming commits.",
          [TranslationTone.PROFESSIONAL]: "Sau khi fetch, gõ 'git branch -r' để xem danh sách nhánh từ xa hoặc so sánh khác biệt trước khi gộp.",
          [TranslationTone.TOXIC]: "Dòm xong rồi thì so sánh bằng 'git diff HEAD origin/main' đi rồi hẵng gộp bậy!",
          [TranslationTone.JOKE]: "Xem trọn vẹn sự khác biệt bằng 'git log --oneline..origin/main' xem thiên hạ viết gì."
        },
        suggestedCommands: ['git fetch origin', 'git fetch --all', 'git fetch --prune'],
        isDestructive: false
      },
      stash: {
        explanation: {
          [TranslationTone.ENGLISH]: "Temporarily shelves current work changes to obtain a completely clean directory state.",
          [TranslationTone.PROFESSIONAL]: "Tạm thời cất giấu toàn bộ các sửa đổi dở dang vào ngăn lưu trữ bí mật riêng để dọn sạch thư mục làm việc, sẵn sàng chuyển nhiệm vụ gấp.",
          [TranslationTone.TOXIC]: "Nhét đống rác chưa xong vào gầm giường để đón khách quý! Khi nào khách về thì lôi ra dọn tiếp kẻo sếp bắt quả tang code thối!",
          [TranslationTone.JOKE]: "Túi thần kỳ của Doraemon! Nhét hết code lộn xộn vào túi chân không rồi tung tăng đi uống trà sữa!"
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Untracked or ignored files might not be saved unless the '-u' flag is included.",
          [TranslationTone.PROFESSIONAL]: "Các tệp tin mới khởi tạo hoàn toàn (untracked files) sẽ bị bỏ sót không cất giấu trừ phi bạn truyền thêm cờ '-u' (include untracked).",
          [TranslationTone.TOXIC]: "Nhớ truyền cờ '-u' vào chứ không đống file mới tạo nó bơ vơ bên ngoài rồi kêu mất code nhé nhóc!",
          [TranslationTone.JOKE]: "Mẹo nhỏ: Phải gói thêm cờ '-u' kẻo hành lý quý giá mới sắm bị bỏ quên bên lề đường!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use 'git stash pop' to restore your hidden work later, or 'git stash list' to see all shelved items.",
          [TranslationTone.PROFESSIONAL]: "Dùng 'git stash pop' để khôi phục và xóa gói cất tạm gần nhất, hoặc 'git stash apply' để giữ nguyên bản sao dự phòng.",
          [TranslationTone.TOXIC]: "Xong việc rồi mời gõ 'git stash pop' lôi đống sắt vụn ra mài giũa tiếp đi cưng!",
          [TranslationTone.JOKE]: "Triệu hồi pháp bảo bằng 'git stash pop' để cứu rỗi đống ý tưởng dang dở!"
        },
        suggestedCommands: ['git stash', 'git stash -u', 'git stash pop', 'git stash list'],
        isDestructive: false
      },
      diff: {
        explanation: {
          [TranslationTone.ENGLISH]: "Show differences between commits, reference versions, index files, or local modifications.",
          [TranslationTone.PROFESSIONAL]: "Hiển thị chi tiết dòng-trên-dòng các thay đổi mã nguồn, giúp bạn biết chính xác những gì đã sửa đổi, xóa bỏ hoặc thêm mới.",
          [TranslationTone.TOXIC]: "Vạch lá tìm sâu! Phanh phui từng milimet dòng code lởm khởm đỏ sọc xanh lè rách nát của bạn!",
          [TranslationTone.JOKE]: "Trò chơi tìm điểm khác biệt bản cực hạn! Soi thấu tâm can dòng mã xem hôm nay đã tàn phá bao nhiêu dòng hữu ích."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "None. Safe to use for visual reviews anytime.",
          [TranslationTone.PROFESSIONAL]: "An toàn tuyệt đối. Thích hợp để rà soát chất lượng dòng mã trước khi dấn thân xa hơn.",
          [TranslationTone.TOXIC]: "Không có rủi ro gì, cứ gõ tẹt ga đi cho sáng mắt ra xem mình viết ngu chỗ nào!",
          [TranslationTone.JOKE]: "Vô hại 100%, bảo hành nguyên tem không lo chập cháy bốc khói ổ cứng."
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use '--staged' to see differences of files already prepared inside staging area.",
          [TranslationTone.PROFESSIONAL]: "Gõ 'git diff --staged' để so sánh riêng các tệp tin đã nạp vào Staging area nhằm chuẩn bị commit chính xác.",
          [TranslationTone.TOXIC]: "Dùng 'git diff --staged' để kiểm tra trước khi bấm nút commit bậy bạ đi!",
          [TranslationTone.JOKE]: "Xem trộm tệp tin chuẩn bị cưới hỏi bằng lệnh 'git diff --cached' nhé."
        },
        suggestedCommands: ['git diff', 'git diff --staged', 'git diff main branch-name'],
        isDestructive: false
      },
      merge: {
        explanation: {
          [TranslationTone.ENGLISH]: "Combine histories and changes from separate branches directly together.",
          [TranslationTone.PROFESSIONAL]: "Gộp toàn bộ tiến trình lịch sử commits và sửa đổi từ nhánh mục tiêu vào nhánh bạn đang đứng hiện tại.",
          [TranslationTone.TOXIC]: "Bày binh bố trận nghênh chiến! Trộn hai nhánh lại với nhau và chuẩn bị tinh thần đổ máu giải quyết đống xung đột ngập tràn!",
          [TranslationTone.JOKE]: "Hòa âm ánh sáng! Nơi hai nhánh code xa lạ bắt tay kết nghĩa anh em ruột thịt."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Merge conflicts are common. Always commit or stash your work before merging.",
          [TranslationTone.PROFESSIONAL]: "Dễ tạo nên Merge Conflicts nếu hai nhánh cùng can thiệp sửa một tệp tin. Hãy dọn dẹp hoặc commit code hiện tại trước khi merge.",
          [TranslationTone.TOXIC]: "SỨT ĐẦU MẺ TRÁN! Đừng bao giờ merge khi code local đang bừa bộn dơ ráy kẻo ăn combo lỗi không thể phục hồi!",
          [TranslationTone.JOKE]: "Cuộc hôn nhân định mệnh! Có thể tiến triển êm đẹp hoặc bùng nổ chiến tranh cãi vã ngập tràn màn hình!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Use '--no-ff' to force a merge commit creation even if fast-forward is possible.",
          [TranslationTone.PROFESSIONAL]: "Dùng cờ '--no-ff' để luôn lưu vết commit gộp trực quan, giúp sếp dễ quản lý tiến độ.",
          [TranslationTone.TOXIC]: "Bấm 'git merge --abort' gấp đi nếu thấy combat xung đột căng thẳng quá không gánh nổi nhé!",
          [TranslationTone.JOKE]: "Hủy bỏ lễ cưới khẩn cấp bằng 'git merge --abort' nếu cô dâu chú rể đánh nhau vỡ đầu!"
        },
        suggestedCommands: ['git merge feature/payment-v2', 'git merge --abort', 'git merge main'],
        isDestructive: false
      },
      init: {
        explanation: {
          [TranslationTone.ENGLISH]: "Creates a brand-new blank local Git repository inside your root folder.",
          [TranslationTone.PROFESSIONAL]: "Khởi tạo một kho lưu trữ Git trống mới toanh ngay tại thư mục hiện hành của dự án.",
          [TranslationTone.TOXIC]: "Khai tử sự tự do! Bắt đầu chui đầu vào rọ và chịu sự giám sát hà khắc, soi mói từng dòng code của Git kể từ giây phút này!",
          [TranslationTone.JOKE]: "Khai sơn phá thạch! Thổi linh hồn siêu năng lực cho thư mục phàm trần bắt đầu hành trình tu luyện."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Running inside an existing repo is harmless but might reinitialize config settings.",
          [TranslationTone.PROFESSIONAL]: "Chạy trong thư mục đã có Git sẽ không làm mất code nhưng sẽ cấu hình lại file cài đặt, hãy lưu ý.",
          [TranslationTone.TOXIC]: "Đứng núi này trông núi nọ à? Đừng chạy đè lung tung trên repository đang ngon lành cành đào nha nhóc!",
          [TranslationTone.JOKE]: "Dựng đè đền thờ cổ có thể đánh thức quái thú cấu hình làm náo loạn hệ thống!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Config your global credentials (user.name and user.email) right after init.",
          [TranslationTone.PROFESSIONAL]: "Nên thiết lập ngay tên và email của bạn bằng 'git config user.name' sau khi vừa khởi tạo kho chứa.",
          [TranslationTone.TOXIC]: "Lo khai báo danh tính 'git config user.email' lẹ đi kẻo mai sau push code nó ghi danh nặc danh hư hỏng!",
          [TranslationTone.JOKE]: "Rửa tay gác kiếm đăng ký hộ khẩu thường trú bằng cấu hình Git config ngay và luôn nhé."
        },
        suggestedCommands: ['git init', 'git config --global user.name "Your Name"', 'git status'],
        isDestructive: false
      },
      clone: {
        explanation: {
          [TranslationTone.ENGLISH]: "Clone down and pull standard repository from absolute online address.",
          [TranslationTone.PROFESSIONAL]: "Sao chép toàn bộ dự án từ địa chỉ kho trực tuyến từ xa về ổ cứng máy tính cá nhân local của bạn.",
          [TranslationTone.TOXIC]: "Bê nợ của thiên hạ về máy dọn dẹp! Thấy code người ta sạch sẽ thèm quá mang về chỉnh sửa gặm nhấm đây mà!",
          [TranslationTone.JOKE]: "Đại pháp copy vô ảnh kiếm! Thâu tóm tinh hoa chất xám của nhân loại trực tuyến chỉ bằng một cú click chuột."
        },
        warningMessage: {
          [TranslationTone.ENGLISH]: "Ensure you have proper write permissions if you plan to push changes back.",
          [TranslationTone.PROFESSIONAL]: "Hãy chắc chắn bạn đã được cấp quyền cộng tác viên (write permissions) trước khi tính chuyện chỉnh sửa và đẩy ngược code lên lại.",
          [TranslationTone.TOXIC]: "Coi chừng ăn quả đắng permission denied vì mưu đồ đẩy lén code lên kho của sếp khi chưa xin phép!",
          [TranslationTone.JOKE]: "Clone dạo phá phách không có chìa khóa phân quyền thì chỉ có nước ngồi ngắm nhìn từ xa thôi nhé bạn hiền!"
        },
        suggestion: {
          [TranslationTone.ENGLISH]: "Provide custom path after the link if you want to rename the directory on copy.",
          [TranslationTone.PROFESSIONAL]: "Có thể viết thêm tên thư mục mong muốn ở cuối lệnh để sao chép vào đúng tên thư mục sạch sẽ.",
          [TranslationTone.TOXIC]: "Muốn đổi tên thư mục cho gọn gàng thì gõ 'git clone <url> <tên_mới>' đi bà nội!",
          [TranslationTone.JOKE]: "Chỉ định địa danh hạ cánh đẹp mắt bằng cách thêm nhãn thư mục ở phía đuôi cú pháp."
        },
        suggestedCommands: ['git clone https://github.com/example/repo.git', 'git clone --depth 1 https://github.com/example/repo.git', 'git status'],
        isDestructive: false
      }
    };

    if (matchedKey !== 'default') {
      const item = db[matchedKey];
      // Đoán xem câu lệnh chuẩn xác là gì nếu người dùng gõ sai (v.d. "git stat" -> "git status")
      const correctCommand = isMatched && bestCmdName !== subcmd ? `git ${bestCmdName}` : '';
      
      // Đưa câu lệnh chuẩn sửa lỗi đứng ở ĐẦU TIÊN để cải thiện UX vượt trội
      let finalSuggested = [...item.suggestedCommands];
      if (correctCommand) {
        // Lọc bớt trùng lặp
        finalSuggested = finalSuggested.filter(c => c !== correctCommand);
        finalSuggested.unshift(correctCommand);
      }

      return {
        explanation: item.explanation[selectedTone] || item.explanation[TranslationTone.PROFESSIONAL] || item.explanation[TranslationTone.ENGLISH],
        isDestructive: item.isDestructive,
        warningMessage: item.warningMessage[selectedTone] || item.warningMessage[TranslationTone.PROFESSIONAL] || item.warningMessage[TranslationTone.ENGLISH],
        suggestion: item.suggestion[selectedTone] || item.suggestion[TranslationTone.PROFESSIONAL] || item.suggestion[TranslationTone.ENGLISH],
        suggestedCommands: finalSuggested,
        correctedCommand: correctCommand || undefined,
        originalCommand: cmd
      };
    }

    const genericExplanation = {
      [TranslationTone.ENGLISH]: `[OFFLINE - Gemini Disabled] This command represents a Git execution sequence. When AI mode is off, details are provided as reference: "${cmd}".`,
      [TranslationTone.PROFESSIONAL]: `[Chế độ Tiết kiệm - Đã tắt Gemini] Lệnh Git này dùng để thao tác với bộ lưu trữ: "${cmd}". Để nhận phân tích nâng cao, hãy bật lại Gemini trên Header.`,
      [TranslationTone.TOXIC]: `[OFFLINE - Đã tắt Gemini] Lại gõ lệnh gì linh tinh thế này cưng ơi: "${cmd}"? Bật Gemini lên tao vả cho tỉnh người nhé!`,
      [TranslationTone.JOKE]: `[OFFLINE - Gemini bận đi ngủ] Lệnh "${cmd}" nghe có vẻ chuyên nghiệp đấy nhưng Gemini đang tắt rồi, bật lên để mình bói quẻ cho nha!`
    };

    const genericWarning = {
      [TranslationTone.ENGLISH]: "Ensure syntax correctness. Destructive check is disabled in offline mode.",
      [TranslationTone.PROFESSIONAL]: "Hãy chắc chắn về cú pháp trước khi chạy. Kiểm tra rủi ro nâng cao đang tạm đóng.",
      [TranslationTone.TOXIC]: "Gõ láo xé xác! Tớ không gánh giùm khi cậu gõ bừa bãi đâu nhé!",
      [TranslationTone.JOKE]: "Mọi hoạt động tự chịu trách nhiệm, admin đi vắng không bảo hành code dạo!"
    };

    const genericSuggestion = {
      [TranslationTone.ENGLISH]: "View 'git --help' or turn on Gemini AI for fully localized smart command mapping.",
      [TranslationTone.PROFESSIONAL]: "Gõ 'git --help' hoặc bật công tắc Gemini AI màu tím ở góc trên để nhận hướng dẫn cực kỳ chi tiết từ AI.",
      [TranslationTone.TOXIC]: "Bật Gemini AI lên đi rồi tao dạy dỗ cho đến nơi đến chốn, tắt đi làm gì!",
      [TranslationTone.JOKE]: "Quay xe lên Header bật nút Gemini AI lên để khai mở thiên nhãn thôi nào bạn hiền!"
    };

    return {
      explanation: genericExplanation[selectedTone] || genericExplanation[TranslationTone.PROFESSIONAL] || genericExplanation[TranslationTone.ENGLISH],
      isDestructive: cmd.includes('--hard') || cmd.includes('delete') || cmd.includes('force') || cmd.includes('purge'),
      warningMessage: genericWarning[selectedTone] || genericWarning[TranslationTone.PROFESSIONAL] || genericWarning[TranslationTone.ENGLISH],
      suggestion: genericSuggestion[selectedTone] || genericSuggestion[TranslationTone.PROFESSIONAL] || genericSuggestion[TranslationTone.ENGLISH],
      suggestedCommands: ['git status', 'git log --oneline', 'git branch']
    };
  };

  const checkIsCommandInvalid = (cmd: string): boolean => {
    const tokens = cmd.trim().split(/\s+/);
    if (!tokens[0]) return false;
    if (tokens[0].toLowerCase() !== 'git') return true;
    if (tokens.length < 2) return false;
    const subcmd = tokens[1].toLowerCase();
    const validSubcmds = ['status', 'log', 'branch', 'checkout', 'add', 'commit', 'push', 'pull', 'fetch', 'stash', 'reset', 'rebase', 'revert', 'diff', 'merge', 'init', 'clone'];
    return !validSubcmds.includes(subcmd);
  };

  const performAnalysis = async (cmdValue: string, isFromTyping = false) => {
    setInlineError(null);
    const cleanCmd = cmdValue.trim();
    if (!cleanCmd) return;

    if (cleanCmd.toLowerCase() === 'git') {
      setExplanation(null);
      setChecking(false);
      return;
    }

    setChecking(true);

    const cacheKey = `${cleanCmd}_${tone}`;
    let cachedData: any = null;
    try {
      const cachedString = localStorage.getItem('rebase_overlord_explain_cmd_cache');
      if (cachedString) {
        const cacheStore = JSON.parse(cachedString);
        if (cacheStore[cacheKey]) {
          cachedData = cacheStore[cacheKey];
        }
      }
    } catch (err) {
      console.warn("Failed to read terminal explain cache", err);
    }

    if (cachedData) {
      setTimeout(() => {
        let correctedCommand = undefined;
        if (checkIsCommandInvalid(cleanCmd)) {
          const tokens = cleanCmd.toLowerCase().trim().split(/\s+/);
          const subcmd = tokens[1] || '';
          if (subcmd) {
            const { bestCmdName, minDistance } = findBestGitSubcommand(subcmd);
            if (bestCmdName && minDistance <= 3.5) {
              correctedCommand = `git ${bestCmdName}`;
            }
          }
        }

        const explanationWithCacheTag = {
          ...cachedData,
          explanation: cachedData.explanation + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)"),
          correctedCommand,
          originalCommand: cleanCmd
        };
        setExplanation(explanationWithCacheTag);
        if (explanationWithCacheTag.suggestedCommands && explanationWithCacheTag.suggestedCommands.length > 0) {
          setSuggestedChips(explanationWithCacheTag.suggestedCommands);
          setChipsSource('ai');
          if (!isFromTyping) {
            addLog(`💡 [Cache Hit] Khôi phục thành công phân tích AI từ bộ nhớ đệm cho: "${cleanCmd}"`);
          }
        }
        setChecking(false);
      }, 150);
      return;
    }

    if (!isAiEnabled) {
      setTimeout(() => {
        const offlineResult = getOfflineGitExplanation(cleanCmd, tone);
        setExplanation(offlineResult);
        if (offlineResult.suggestedCommands && offlineResult.suggestedCommands.length > 0) {
          setSuggestedChips(offlineResult.suggestedCommands);
          setChipsSource('ai');
          if (!isFromTyping) {
            addLog(`💡 [Offline Mode] Đã cập nhật ${offlineResult.suggestedCommands.length} gợi ý lệnh Git cho: "${cleanCmd}"`);
          }
        }
        setChecking(false);
      }, 200);
      return;
    }

    try {
      const explainUrl = resolveApiUrl('/api/explain-git-command');
      const res = await fetch(explainUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cleanCmd, tone })
      });
      if (res.ok) {
        const data = await res.json();
        
        let correctedCommand = undefined;
        if (checkIsCommandInvalid(cleanCmd)) {
          const tokens = cleanCmd.toLowerCase().trim().split(/\s+/);
          const subcmd = tokens[1] || '';
          if (subcmd) {
            const { bestCmdName, minDistance } = findBestGitSubcommand(subcmd);
            if (bestCmdName && minDistance <= 3.5) {
              correctedCommand = `git ${bestCmdName}`;
            }
          }
        }

        const enrichedData = {
          ...data,
          correctedCommand,
          originalCommand: cleanCmd
        };

        setExplanation(enrichedData);

        // Save to cache
        try {
          const cachedString = localStorage.getItem('rebase_overlord_explain_cmd_cache');
          const cacheStore = cachedString ? JSON.parse(cachedString) : {};
          cacheStore[cacheKey] = data;
          localStorage.setItem('rebase_overlord_explain_cmd_cache', JSON.stringify(cacheStore));
        } catch (err) {
          console.warn("Failed to write to terminal explain cache", err);
        }

        if (data.suggestedCommands && Array.isArray(data.suggestedCommands) && data.suggestedCommands.length > 0) {
          setSuggestedChips(data.suggestedCommands);
          setChipsSource('ai');
          if (!isFromTyping) {
            addLog(`💡 Đã cập nhật ${data.suggestedCommands.length} gợi ý lệnh Git phù hợp cho: "${cleanCmd}"`);
          }
        }
      } else {
        const errData = await res.json();
        setInlineError(`${loc.cannotAnalyze}${errData.error || loc.unknownError}`);
      }
    } catch (err: any) {
      setInlineError(`${loc.connectionError}${err.message}`);
    } finally {
      setChecking(false);
    }
  };

  const handleAnalyzeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setInlineError(null);
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    if (!cleanCmd.toLowerCase().startsWith('git')) {
      setInlineError(loc.gitPrefixError);
      return;
    }

    if (cleanCmd.toLowerCase() === 'git') {
      setInlineError(loc.gitOnlyError);
      return;
    }

    setExplanation(null);
    await performAnalysis(cleanCmd, false);
  };

  // Effect to automatically analyze command on typing (debounced at 1000ms)
  React.useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const cleanCmd = commandInput.trim();

    // If input is empty, clear the explanation instantly
    if (!cleanCmd) {
      setExplanation(null);
      setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
      setChipsSource('default');
      return;
    }

    // Only auto-explain if it is a Git command starting with 'git', but not when it is exactly 'git'
    if (cleanCmd.toLowerCase() === 'git') {
      setExplanation(null);
      setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
      setChipsSource('default');
      return;
    }

    // Only auto-explain if it is a Git command starting with 'git'
    if (!cleanCmd.toLowerCase().startsWith('git')) {
      return;
    }

    // Debounce for 1000ms
    typingTimeoutRef.current = setTimeout(() => {
      performAnalysis(cleanCmd, true);
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [commandInput, tone]);

  const handleCancel = () => {
    setExplanation(null);
    // Reset to default suggestion chips
    setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
    setChipsSource('default');
  };

  const handleExecuteVerifiedCommand = async () => {
    setInlineError(null);
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    setExecuting(true);
    setExplanation(null);

    // Prevent hazardous simple OS injections
    const upperCmd = cleanCmd.toUpperCase();
    if (upperCmd.includes('RM ') || upperCmd.includes('DEL ') || upperCmd.includes(':(')) {
      addLog(`! Lỗi thực thi: Phát hiện lệnh nhạy cảm có ý đồ phá hoại hệ thống.`);
      setExecuting(false);
      return;
    }

    addLog(`$ ${cleanCmd}`);

    if (isSimulation) {
      // Simulate Git command behavior
      setTimeout(() => {
        addLog(`// [Playground Giả lập] Đang thực thi: ${cleanCmd}`);
        const tokens = cleanCmd.split(/\s+/);
        const binaryName = tokens[0];

        // Terminal check: Git binary is lowercase 'git'
        if (binaryName !== 'git') {
          addLog(`bash: ${binaryName}: command not found`);
          addLog(`❌ Lệnh hoàn thành với mã trả về 127`);
          setExecuting(false);
          setCommandInput('');
          onCommandExecuted();
          return;
        }

        // usage help if no subcommand is passed
        if (!tokens[1]) {
          addLog(`usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]`);
          addLog(`           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]`);
          addLog(`           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]`);
          addLog(`           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]`);
          addLog(`           <command> [<args>]`);
          setExecuting(false);
          setCommandInput('');
          onCommandExecuted();
          return;
        }

        const subcmd = tokens[1];
        const validSubcmds = ['status', 'log', 'branch', 'checkout', 'add', 'commit', 'push', 'pull', 'fetch', 'stash', 'reset', 'rebase', 'revert', 'diff', 'merge', 'init', 'clone'];

        // Git subcommand case-sensitivity and spelling validation
        if (!validSubcmds.includes(subcmd)) {
          addLog(`git: '${subcmd}' is not a git command. See 'git --help'.`);
          addLog(`❌ Lệnh hoàn thành với mã trả về 1`);
          setExecuting(false);
          setCommandInput('');
          onCommandExecuted();
          return;
        }

        if (subcmd === 'status') {
          addLog(`On branch feature/payment-v2`);
          addLog(`Your branch is up to date with 'origin/feature/payment-v2'.`);
          addLog(`Changes not staged for commit:`);
          addLog(`  (use "git add <file>..." to update what will be committed)`);
          addLog(`        modified:   src/routes/payment.ts`);
          addLog(`        modified:   src/services/stripe.ts`);
          addLog(`no changes added to commit (use "git add" and/or "git commit -a")`);
        } else if (subcmd === 'log') {
          addLog(`commit f941a3c78d (HEAD -> feature/payment-v2)`);
          addLog(`Author: Alex Nguyen <alex@overlord.internal>`);
          addLog(`Date:   5 mins ago`);
          addLog(`    feat: add payment intent and webhook handles`);
          addLog(``);
          addLog(`commit a82bc4e12c`);
          addLog(`Author: Alex Nguyen <alex@overlord.internal>`);
          addLog(`Date:   1 hour ago`);
          addLog(`    fix: resolving null checkout responses`);
        } else if (subcmd === 'branch') {
          addLog(`  develop`);
          addLog(`  main`);
          addLog(`* feature/payment-v2`);
          addLog(`  feature/auth-oauth`);
          addLog(`  bugfix/typo-header`);
        } else if (subcmd === 'checkout') {
          const bName = tokens[2] || 'main';
          addLog(`Switched to branch '${bName}'`);
        } else if (subcmd === 'revert') {
          if (tokens.length < 3) {
            addLog(`fatal: no commit specified`);
            addLog(`❌ Lệnh hoàn thành với mã trả về 128`);
          } else {
            const commitHash = tokens[2];
            addLog(`[feature/payment-v2 b7c8a12] Revert "${commitHash}"`);
            addLog(` 2 files changed, 10 insertions(+), 3 deletions(-)`);
            addLog(`✓ Lệnh simulated "${cleanCmd}" đã thực hiện thành công trên Playground.`);
          }
        } else if (subcmd === 'add') {
          if (tokens.length < 3) {
            addLog(`Nothing specified, nothing added.`);
            addLog(`Maybe you wanted to say 'git add .'?`);
            addLog(`❌ Lệnh hoàn thành với mã trả về 1`);
          } else {
            addLog(`add '${tokens.slice(2).join(' ')}'`);
            addLog(`✓ Lệnh simulated "${cleanCmd}" đã thực hiện thành công trên Playground.`);
          }
        } else if (subcmd === 'commit') {
          const hasMessageFlag = tokens.includes('-m') || tokens.includes('--message');
          if (!hasMessageFlag) {
            addLog(`Aborting commit due to empty commit message.`);
            addLog(`❌ Lệnh hoàn thành với mã trả về 1`);
          } else {
            addLog(`[feature/payment-v2 d92a11b] Simulated commit via Playground`);
            addLog(` 1 file changed, 1 insertion(+)`);
            addLog(`✓ Lệnh simulated "${cleanCmd}" đã thực hiện thành công trên Playground.`);
          }
        } else {
          addLog(`✓ Lệnh simulated "${cleanCmd}" đã thực hiện thành công trên Playground.`);
        }
        setExecuting(false);
        setCommandInput('');
        onCommandExecuted();
      }, 800);
    } else {
      try {
        const execUrl = resolveApiUrl('/api/execute-command');
        const res = await fetch(execUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cleanCmd })
        });
        const data = await res.json();
        
        if (data.stdout && data.stdout.trim()) {
          const lines = data.stdout.split('\n');
          lines.forEach((l: string) => addLog(l));
        }
        if (data.stderr && data.stderr.trim()) {
          const lines = data.stderr.split('\n');
          lines.forEach((l: string) => addLog(`! ${l}`));
        }
        
        if (data.code !== 0) {
          addLog(`❌ Lệnh hoàn thành với mã trả về ${data.code}`);
        } else {
          addLog(`✓ Thực thi lệnh thành công!`);
        }

        setExecuting(false);
        setCommandInput('');
        onCommandExecuted();
      } catch (err: any) {
        addLog(`❌ Thất bại khi thực thi luồng lệnh hệ thống: ${err.message}`);
        setExecuting(false);
      }
    }
  };

  if (!showLogPanel) {
    return (
      <div id="terminal-collapsed-panel" className="bg-[#020617] border border-slate-900 rounded-xl p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>{loc.hiddenLogs}</span>
        </div>
        <button
          onClick={onToggleLogPanel}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" /> {loc.showLogs}
        </button>
      </div>
    );
  }

  return (
    <div id="terminal-panel-container" className="bg-[#020617] border border-slate-900 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-[#0b0f19] border-b border-slate-900 px-4 py-2.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-xs text-slate-400 font-bold font-mono tracking-wide ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            CONSOLE SHELL & INTERACTIVE GIT PROMPT
          </span>
        </div>

        {/* Console control options */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={onClearLogs}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={onToggleLogPanel}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded bg-slate-950 border border-slate-900 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            title="Hide logs"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Hide</span>
          </button>
        </div>
      </div>

      {/* Console lines screen */}
      <div ref={containerRef} className="p-4 overflow-y-auto h-52 max-h-52 font-mono text-xs leading-relaxed text-slate-300 select-text flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-[11px] p-2 flex flex-col gap-1">
            <span>{loc.noHistoryLine1}</span>
            <span>{loc.noHistoryLine2}</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const isCommand = log.trim().startsWith('$') || log.trim().startsWith('git');
            const isError = log.includes('error') || log.includes('ERR:') || log.includes('Failed') || log.startsWith('! ') || log.includes('LỖI') || log.includes('❌');
            const isSuccess = log.includes('success') || log.includes('Done') || log.includes('Đã xác nhận') || log.includes('Hoàn tất') || log.includes('thành công') || log.startsWith('✓');
            const isComment = log.trim().startsWith('//') || log.trim().startsWith('#');
            
            let colorClass = 'text-slate-300';
            if (isCommand) {
              colorClass = 'text-sky-400 font-semibold';
            } else if (isError) {
              colorClass = 'text-rose-400 font-medium bg-rose-500/5 px-1 rounded border border-rose-500/10';
            } else if (isSuccess) {
              colorClass = 'text-emerald-400 font-medium';
            } else if (isComment) {
              colorClass = 'text-slate-500 italic';
            }

            return (
              <div 
                key={index} 
                className={`py-0.5 border-l-2 pl-2 transition-all shrink-0 hover:bg-slate-950 ${colorClass} ${
                  isCommand ? 'border-sky-500/50' : isError ? 'border-rose-500/50' : isSuccess ? 'border-emerald-500/50' : 'border-transparent'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Command Prompt Section */}
      <div className="border-t border-slate-900 bg-[#070b14] p-3 shrink-0">
        {/* Inline validation errors */}
        {inlineError && (
          <div className="mb-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] px-3 py-1.5 rounded-lg flex justify-between items-center font-sans animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              {inlineError}
            </span>
            <button onClick={() => setInlineError(null)} className="text-rose-400 hover:text-rose-200 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Popular command suggestion chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5 items-center">
          <span className="text-[10px] text-slate-500 font-mono self-center mr-1 select-none flex items-center gap-1">
            {chipsSource === 'ai' ? (
              <>
                <Sparkles className="w-3 h-3 text-pink-400 animate-pulse animate-bounce" />
                <span className="text-pink-400 font-bold">{loc.suggestionHeader}</span>
              </>
            ) : (
              <span>{loc.quickSugHeader}</span>
            )}
          </span>
          {suggestedChips.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setCommandInput(cmd);
                setInlineError(null);
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }
                setExplanation(null);
                performAnalysis(cmd, false);
              }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer border ${
                chipsSource === 'ai'
                  ? 'bg-pink-950/20 text-pink-300 border-pink-700/40 hover:bg-pink-900/40 hover:text-white hover:scale-105'
                  : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:bg-indigo-950/40 hover:text-indigo-300'
              }`}
            >
              {cmd}
            </button>
          ))}
          {chipsSource === 'ai' && (
            <button
              type="button"
              onClick={() => {
                setSuggestedChips(['git status', 'git log --oneline -n 5', 'git branch -a', 'git stash list', 'git remote -v']);
                setChipsSource('default');
              }}
              className="text-[9px] text-slate-500 hover:text-slate-300 underline font-mono ml-auto cursor-pointer"
            >
              {loc.restoreDefault}
            </button>
          )}
        </div>

        <form onSubmit={handleAnalyzeCommand} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 font-mono text-sm pointer-events-none select-none">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => {
                setCommandInput(e.target.value);
                if (inlineError) setInlineError(null);
              }}
              placeholder={loc.placeholder}
              className="w-full bg-[#02050c] text-sky-400 font-mono placeholder-slate-650 border border-slate-800 rounded-lg py-2 pl-7 pr-3 text-xs outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={checking || executing || !commandInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-sans shrink-0 border border-indigo-500/35"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{checking ? loc.analyzing : loc.explainSuggest}</span>
          </button>
        </form>

        {/* Explanation Display Panel */}
        {explanation && (
          <div className="mt-3 bg-slate-950/90 border border-slate-850 rounded-lg p-3.5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-sans tracking-wide">
                <Brain className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>{isAiEnabled ? loc.aiTitle : loc.offlineTitle}</span>
              </h4>
              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-500 hover:text-slate-350 p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {explanation.correctedCommand && (() => {
              const currentTone = tone || TranslationTone.PROFESSIONAL;
              
              const titles: Record<string, string> = {
                [TranslationTone.PROFESSIONAL]: "⚠️ PHÁT HIỆN CÚ PHÁP HOẶC LỖI CHÍNH TẢ!",
                [TranslationTone.JOKE]: "⚠️ ỐI DỒI ÔI, LẤY ĐÚNG LỆNH KÌA BẠN ƠI!",
                [TranslationTone.TOXIC]: "⚠️ MẮT ĐỂ ĐI CHƠI À? LỖI CHÍNH TẢ RỒI!",
                [TranslationTone.ENGLISH]: "⚠️ SYNTAX OR TYPO DETECTED!"
              };

              const prefixText: Record<string, string> = {
                [TranslationTone.PROFESSIONAL]: "Bạn vừa gõ ",
                [TranslationTone.JOKE]: "Tay nhanh hơn não gõ nhầm ",
                [TranslationTone.TOXIC]: "Cái tay dở hơi gõ láo ",
                [TranslationTone.ENGLISH]: "You typed "
              };

              const midText: Record<string, string> = {
                [TranslationTone.PROFESSIONAL]: ". Hệ thống tự phỏng đoán và phân tích thông tin của lệnh chuẩn tương ứng: ",
                [TranslationTone.JOKE]: " rồi. Thầy bói quẻ phán thứ bạn thực sự cần là lệnh: ",
                [TranslationTone.TOXIC]: ". Học lại lớp 1 đi cưng, lệnh chuẩn người ta viết thế này này: ",
                [TranslationTone.ENGLISH]: ". The system automatically guessed and analyzed the corresponding standard command: "
              };

              const recommends: Record<string, string> = {
                [TranslationTone.PROFESSIONAL]: "Khuyên dùng:",
                [TranslationTone.JOKE]: "Phép thuật đề xuất:",
                [TranslationTone.TOXIC]: "Khôn hồn thì sửa:",
                [TranslationTone.ENGLISH]: "Recommended:"
              };

              const btnTexts: Record<string, string> = {
                [TranslationTone.PROFESSIONAL]: `Sửa nhanh ô nhập thành "${explanation.correctedCommand}"`,
                [TranslationTone.JOKE]: `Phép thuật biến hình thành "${explanation.correctedCommand}"`,
                [TranslationTone.TOXIC]: `Hối lỗi bằng cách sửa thành "${explanation.correctedCommand}"`,
                [TranslationTone.ENGLISH]: `Quick-fix input to "${explanation.correctedCommand}"`
              };

              const title = titles[currentTone] || titles[TranslationTone.PROFESSIONAL];
              const prefix = prefixText[currentTone] || prefixText[TranslationTone.PROFESSIONAL];
              const mid = midText[currentTone] || midText[TranslationTone.PROFESSIONAL];
              const recommend = recommends[currentTone] || recommends[TranslationTone.PROFESSIONAL];
              const btnText = btnTexts[currentTone] || btnTexts[TranslationTone.PROFESSIONAL];

              return (
                <div id="spelling-correction-banner" className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3.5 mb-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs font-sans">
                    <h5 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                      {title}
                    </h5>
                    <p className="text-slate-300 leading-relaxed">
                      {prefix}
                      <span className="font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-rose-500/15">
                        {explanation.originalCommand}
                      </span>
                      {mid}
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/15">
                        {explanation.correctedCommand}
                      </span>.
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-slate-400 text-[10px]">{recommend}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const targetCmd = explanation.correctedCommand || '';
                          setCommandInput(targetCmd);
                          if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                          }
                          setExplanation(null);
                          if (targetCmd) {
                            performAnalysis(targetCmd, false);
                          }
                        }}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/40 transition-all cursor-pointer font-sans font-medium animate-pulse"
                      >
                        {btnText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3 pr-2 whitespace-pre-line bg-indigo-950/10 p-2.5 rounded border border-indigo-900/10">
              {explanation.explanation}
            </p>

            {explanation.isDestructive && (
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 my-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">{loc.dangerousTitle}</h5>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed font-sans">
                    {explanation.warningMessage || loc.dangerousWarning}
                  </p>
                </div>
              </div>
            )}

            {explanation.suggestion && (
              <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-3 mb-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">{loc.betterSolution}</h5>
                  <p className="text-[11px] text-emerald-300/90 leading-relaxed font-sans">
                    {explanation.suggestion}
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation triggers */}
            <div className="flex gap-2 justify-end mt-3 border-t border-slate-900/80 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 font-sans text-[11px] px-3.5 py-1.5 rounded-md transition-colors cursor-pointer"
              >
                {loc.cancel}
              </button>
              {checkIsCommandInvalid(commandInput) ? (
                <button
                  type="button"
                  onClick={handleExecuteVerifiedCommand}
                  disabled={executing}
                  className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-sans text-[11px] px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer font-medium shadow-md shadow-rose-900/20 border border-rose-500/25"
                  title="Chú ý: Lệnh Git này không hợp lệ hoặc không có trong hệ thống giả lập"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-100 animate-pulse" />
                  <span>{executing ? loc.runningSyntax : loc.runAnyway}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExecuteVerifiedCommand}
                  disabled={executing}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-sans text-[11px] px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer font-medium shadow-md shadow-emerald-900/10"
                >
                  <Play className="w-3 h-3 text-emerald-250 animate-pulse" />
                  <span>{executing ? loc.runningNormal : loc.confirmRun}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Console status footer */}
      <div className="bg-[#080d1a] border-t border-slate-900 px-4 py-1.5 text-[10px] text-slate-500 font-mono flex justify-between items-center shrink-0">
        <span>SESSION SHELL SIMULATOR</span>
        <span className="text-emerald-500 animate-pulse flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          ONLINE PORT: 3000
        </span>
      </div>
    </div>
  );
}
