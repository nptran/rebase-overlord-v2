/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Copy, 
  Check, 
  LifeBuoy, 
  AlertTriangle, 
  Flame, 
  FileCode,
  CornerDownRight,
  GitBranch,
  RefreshCw,
  MessageSquare,
  Search,
  Terminal,
  Settings,
  Activity,
  ArrowRight,
  Command,
  Trash2,
  Lock,
  Compass
} from 'lucide-react';
import { TranslationTone, GitRepoState } from '../../types';
import { resolveApiUrl } from '../../utils/apiResolver';
import { getApiHeaders } from '../../utils/apiKeyHelper';

// A simple but comprehensive nested markdown/terminal code block element formatter
interface FormattedMessageProps {
  content: string;
  theme: 'light' | 'dark';
}

const FormattedAiMessage: React.FC<FormattedMessageProps> = ({ content, theme }) => {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Safe simple markdown regex segments
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs md:text-sm leading-relaxed">
      {parts.map((p, index) => {
        if (p.startsWith('```')) {
          // Extract title if any (e.g. ```bash, ```git)
          const lines = p.split('\n');
          const firstLine = lines[0].replace('```', '').trim();
          const codeLines = lines.slice(1, lines.length - 1).join('\n');
          const isCopied = copiedText === codeLines;

          return (
            <div 
              key={index} 
              className={`my-1.5 rounded-lg border overflow-hidden font-mono text-xs ${
                theme === 'light' 
                  ? 'bg-slate-900 border-slate-700 text-slate-100' 
                  : 'bg-black/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[10px] text-slate-400">
                <span>{firstLine || 'code'}</span>
                <button 
                  onClick={() => handleCopy(codeLines)}
                  className="flex items-center justify-center p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title={isCopied ? "Copied" : "Copy code"}
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto whitespace-pre font-mono text-[11px] leading-tight text-emerald-300">
                <code>{codeLines}</code>
              </pre>
            </div>
          );
        }

        // Parse inline code like `git reflog`
        const inlineParts = p.split(/(`[^`]+`)/g);

        return (
          <p key={index} className="whitespace-pre-wrap text-[12px]">
            {inlineParts.map((ip, ipIdx) => {
              if (ip.startsWith('`') && ip.endsWith('`')) {
                const codeNode = ip.slice(1, -1);
                return (
                  <code 
                    key={ipIdx} 
                    className={`mx-0.5 px-1 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer select-all ${
                      theme === 'light'
                        ? 'bg-amber-100 border border-amber-200 text-amber-850'
                        : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-305'
                    }`}
                    onClick={() => handleCopy(codeNode)}
                    title="Click to copy syntax"
                  >
                    {codeNode}
                  </code>
                );
              }

              // Bold format matcher
              const boldParts = ip.split(/(\*\*[^*]+\*\*)/g);
              return (
                <span key={ipIdx}>
                  {boldParts.map((bp, bpIndex) => {
                    if (bp.startsWith('**') && bp.endsWith('**')) {
                      return <strong key={bpIndex} className="font-extrabold text-indigo-600 dark:text-indigo-400">{bp.slice(2, -2)}</strong>;
                    }
                    return bp;
                  })}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

interface AiDoctorFloatingChatProps {
  repoState: GitRepoState;
  tone: TranslationTone;
  isAiEnabled: boolean;
  onToggleAi: () => void;
  theme: 'light' | 'dark';
  appVersion?: string;
  isUpgraded?: boolean;
  
  // Launcher execution callbacks
  onSwitchDashboardMode?: (mode: 'daily' | 'rescue' | 'learning') => void;
  isSimulation?: boolean;
  onToggleSimulation?: (val: boolean) => void;
  onClearLogs?: () => void;
}

export default function AiDoctorFloatingChat({
  repoState,
  tone,
  isAiEnabled,
  onToggleAi,
  theme,
  appVersion = '1.12.0',
  isUpgraded = false,
  onSwitchDashboardMode,
  isSimulation = false,
  onToggleSimulation,
  onClearLogs
}: AiDoctorFloatingChatProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>('');
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [inputVal, setInputVal] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasNewResponse, setHasNewResponse] = React.useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = React.useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [showKeySetting, setShowKeySetting] = React.useState<boolean>(false);

  // Initialize conversations
  const [messages, setMessages] = React.useState<Array<{ id: string; role: 'user' | 'model'; content: string; timestamp: string }>>([]);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // States for Offline Q&A support
  const [activeTab, setActiveTab] = React.useState<'live' | 'offline'>('live');
  const [offlineMessages, setOfflineMessages] = React.useState<Array<{ id: string; role: 'user' | 'model'; content: string; timestamp: string }>>([
    {
      id: 'offline_greet',
      role: 'model',
      content: (() => {
        let text = "Chào mừng sếp tới Trung tâm Chẩn đoán Sơ cứu Ngoại tuyến (Offline Expert).";
        if (tone === 'vn_joke') {
          text = "Alo sếp ơi! Trạm sơ cứu Git Offline siêu tốc bằng kĩ năng cứng không thèm Internet đã lên nòng. Chọn một thắc mắc bên dưới để em gỡ rối tơ vò chớp nhoáng nhé!";
        } else if (tone === 'vn_toxic') {
          text = "Trạm xá Git Offline cứu hộ lũ gà mờ đây. Mạng mẽo đứt phanh hay tiếc tiền nạp key đúng không? Chọn nhanh chủ đề bên dưới đi tao chẩn đoán lâm sàng cho, khỏi phải đoán già đoán non!";
        } else if (tone === 'en_pro') {
          text = "Welcome to the Offline Consultation and Emergency First-Aid center. Choose one of the localized diagnostic questions below for instant, zero-latency clinical Git insights.";
        }
        return text;
      })(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isOfflineLoading, setIsOfflineLoading] = React.useState<boolean>(false);
  const [askedOfflineTopics, setAskedOfflineTopics] = React.useState<string[]>([]);
  const [didHandoffContext, setDidHandoffContext] = React.useState<boolean>(false);

  // Esc keyboard close control support
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Command palette Ctrl + K and Ctrl + I support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        setIsOpen(prev => {
          const next = !prev;
          if (next) {
            setHasNewResponse(false);
            setTimeout(() => {
              const el = document.getElementById('command-palette-search-input');
              if (el) (el as HTMLInputElement).focus();
            }, 100);
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set up decoupled custom event listener to allow other components to trigger the drawer
  React.useEffect(() => {
    const handleToggleEvent = () => {
      setIsOpen(prev => {
        const next = !prev;
        if (next) {
          setHasNewResponse(false);
          setTimeout(() => {
            const el = document.getElementById('command-palette-search-input');
            if (el) (el as HTMLInputElement).focus();
          }, 100);
        }
        return next;
      });
    };
    window.addEventListener('toggle-ai-doctor', handleToggleEvent);
    return () => window.removeEventListener('toggle-ai-doctor', handleToggleEvent);
  }, []);

  const offlineQuestions = React.useMemo(() => {
    return [
      {
        id: 'repo_health',
        tag: 'Repo Health',
        title: tone === 'en_pro' ? '📊 Full Repo Clinical Diagnosis' : '📊 Chẩn đoán Lâm sàng Repo đầy đủ',
        query: tone === 'en_pro' 
          ? 'Analyze my current local Git repository state and give me a complete clinical summary.' 
          : 'Hãy phân tích trạng thái Repository hiện tại và cho tôi báo cáo lâm sàng chi tiết.',
        answer: (repo: GitRepoState) => {
          const dirtyCount = repo.dirtyFiles?.length || 0;
          const conflictsCount = repo.conflicts?.length || 0;
          const branchName = repo.currentBranch || 'N/A';
          const rebaseStyle = repo.rebaseInProgress ? "🔴 Đang Rebase giang dở" : "🟢 Ổn định (Không rebase)";
          const mergeStyle = repo.mergeInProgress ? "🔴 Đang Merge giang dở" : "🟢 Ổn định (Không merge)";
          const stashCount = repo.stashes?.length || 0;
          const comms = repo.commits || [];

          let responseText = "";
          if (tone === 'en_pro') {
            responseText = `📊 **[Clinical Git Repository Status Report]**\n\n` +
              `- **Active Tracked Branch:** \`${branchName}\`\n` +
              `- **Working Tree Status:** ${repo.isDirty ? `⚠️ Dirty (${dirtyCount} uncommitted files)` : `🟢 Clean (Perfect alignment)`}\n` +
              `- **Rebase Status:** ${rebaseStyle}\n` +
              `- **Merge Status:** ${mergeStyle}\n` +
              `- **Pending Conflicts:** \`${conflictsCount}\` conflicting files present\n` +
              `- **Local Stash Bank:** \`${stashCount}\` stashed items stored securely\n` +
              `- **Recent History Log Count:** \`${comms.length}\` commits resolved on this branch\n\n` +
              `**Clinical Verdict:**\n`;
            if (conflictsCount > 0) {
              responseText += `🚨 **URGENT EMERGENCY:** Your tree is actively hemorrhaging from conflict block collisions. Use the **Conflict Solver** tab immediately before attempting any terminal command.`;
            } else if (repo.isDirty) {
              responseText += `⚠️ **WARNING:** You have modifications outside index. Run \`git stash\` or commit before merging or rebase to prevent local code vaporization.`;
            } else {
              responseText += `🟢 **HEALTHY ENGINE:** Zero immediate dangers identified. Your repository is in a pristine clinical state. Ready for standard branch maintenance!`;
            }
          } else if (tone === 'vn_joke') {
            responseText = `📊 **[Phiếu Khám Sức Khỏe Repo Thần Tốc]**\n\n` +
              `- **Nhánh yêu thương:** \`${branchName}\`\n` +
              `- **Bãi rác Working Tree:** ${repo.isDirty ? `⚠️ Đang bừa bộn (${dirtyCount} file uncommitted)` : `🟢 Sạch bong kin kít (Không hạt bụi)`}\n` +
              `- **Tình trạng Rebase:** ${repo.rebaseInProgress ? "⚠️ Đang rebase dở dang bấp bênh" : "🟢 Ổn áp"}\n` +
              `- **Tình trạng Merge:** ${repo.mergeInProgress ? "⚠️ Đang merge dở dang" : "🟢 Yên bình"}\n` +
              `- **Xung đột húc nhau:** \`${conflictsCount}\` chỗ nát bét cần vá gấp!\n` +
              `- **Kho báu Stash:** \`${stashCount}\` chiếc rương chứa code tạm bợ\n\n` +
              `**Lời khuyên từ Bác sỹ Git:**\n`;
            if (conflictsCount > 0) {
              responseText += `🚨 **BÁO ĐỘNG ĐỎ:** Nhà bao việc mà sao xung đột đầy đầu thế ní ơi! Mở tab **Conflict Solver** cứu hộ đội nhà ngay kẻo toang cả dự án giờ!`;
            } else if (repo.isDirty) {
              responseText += `⚠️ **CHÚ Ý NHẸ:** Có mớ code chưa commit kìa. Cất tạm vào rương \`git stash\` kẻo tí nữa rebase nó quét phát là khóc trôi hàng xóm nha ní!`;
            } else {
              responseText += `🟢 **CÔNG LỰC THƯỢNG THỪA:** Bạn sạch sẽ thơm tho, repo trơn tru không một tì vết. Sẵn sàng gộp nhánh hay push tẹt ga hổng sợ gì sếp ơi!`;
            }
          } else if (tone === 'vn_toxic') {
            responseText = `📊 **[Kết quả xét nghiệm lâm sàng đống hỗn lộn của mày]**\n\n` +
              `- **Nhánh mày đang đóng đô:** \`${branchName}\`\n` +
              `- **Độ ở dơ (Working Tree):** ${repo.isDirty ? `⚠️ Rác ngập đầu (${dirtyCount} tệp chưa thèm commit)` : `🟢 Đỡ dơ bẩn hơn mọi khi (Clean)`}\n` +
              `- **Rebase trạng thái:** ${repo.rebaseInProgress ? "⚠️ Đang ngáp ngoải giữa Rebase" : "🟢 Chưa quậy nát cái Rebase nào"}\n` +
              `- **Rác xung đột:** \`${conflictsCount}\` file bị nổ banh xác\n` +
              `- **Ngân hàng Stash:** \`${stashCount}\` thứ mày giấu giếm tạm thời\n\n` +
              `**Chẩn đoán từ Boss độc mồm:**\n`;
            if (conflictsCount > 0) {
              responseText += `🚨 **NGU THÌ CHẾT:** Xung đột đống lớn đống nhỏ ngập mặt kìa thằng lập trình viên nghiệp dư kia! Mở cái tab **Conflict Solver** ra mà nắn lại code đi, không bố sút bay màu khỏi team bây giờ!`;
            } else if (repo.isDirty) {
              responseText += `⚠️ **BỚT CHÉP BẬY:** Chưa commit mà cứ ham hố rebase là bay sạch thành quả lao động đấy nhé thằng ngốc! Dùng \`git stash\` giấu hộ tao đống rác đó trước khi làm trò con bò!`;
            } else {
              responseText += `🟢 **KÝ TÍCH:** Éo hiểu sao hôm nay repo lại sạch sẽ không đụng độ gì. Ăn may thôi con ạ, lo code tế nhị đi đừng để tao bắt được lỗi ngớ ngẩn nhé!`;
            }
          } else { // vn_pro (default)
            responseText = `📊 **[Bản Báo Cáo Chẩn Đoán Kỹ Thuật Repository]**\n\n` +
              `- **Tên Nhánh Hiện Tại:** \`${branchName}\`\n` +
              `- **Thay Đổi Chưa Lưu (Working Directory):** ${repo.isDirty ? `⚠️ Chưa lưu (${dirtyCount} tệp uncommitted)` : `🟢 Sạch sẽ (Trạng thái an toàn)`}\n` +
              `- **Trạng Thái Rebase:** ${repo.rebaseInProgress ? "⚠️ Đang thực hiện Rebase" : "🟢 Bình thường"}\n` +
              `- **Sự Cố Xung Đột (Conflicts):** Phát hiện \`${conflictsCount}\` tệp xung đột\n` +
              `- **Lưu Trữ Tạm (Stash):** Đang trữ \`${stashCount}\` phiên bản tạm thời\n\n` +
              `**Đánh giá chuyên môn:**\n`;
            if (conflictsCount > 0) {
              responseText += `🚨 **YÊU CẦU CỨU TRỢ:** Tệp tin đang bị xung đột dữ dội. Quý khách vui lòng mở tab **Conflict Solver** ở bảng bên trái để giải cứu mã nguồn đúng trình tự kỹ thuật.`;
            } else if (repo.isDirty) {
              responseText += `⚠️ **LƯU Ý:** Tránh gộp nhánh khi thư mục chứa mã nguồn chưa commit. Đề xuất cất giữ tạm thời bằng lệnh \`git stash\` để bảo vệ tính toàn vẹn dữ liệu.`;
            } else {
              responseText += `🟢 **TRẠNG THÁI HOÀN HẢO:** Hệ thống không phát hiện bất cứ rủi ro nghiêm trọng nào. Quý khách có thể tiến hành gộp nhánh hoặc làm việc bình thường.`;
            }
          }
          return responseText;
        }
      },
      {
        id: 'conflict_solver',
        tag: 'Conflict Advise',
        title: tone === 'en_pro' ? '🔧 Clinical Conflict Breakdown' : '🔧 Hướng dẫn Giải cứu Xung đột',
        query: tone === 'en_pro'
          ? 'Break down my current conflicts and guide me how to resolve them offline.'
          : 'Hãy phân tích các file xung đột hiện tại của tôi và hướng dẫn giải quyết ngoại tuyến.',
        answer: (repo: GitRepoState) => {
          const conflicts = repo.conflicts || [];
          let responseText = "";

          if (tone === 'en_pro') {
            responseText = `🔧 **[Offline Advanced Conflict Resolution Guide]**\n\n`;
            if (conflicts.length === 0) {
              responseText += `🟢 **No Active Conflicts:** Your branch is currently free from historical block crashes! Nice work.\n\n` +
                `*Pro-tip for avoiding future collisions:* Always fetch and rebase your feature branch against the shared mainline (\`git fetch origin && git rebase origin/main\`) regularly to maintain a clean progressive timeline.`;
            } else {
              responseText += `Found **${conflicts.length} conflicting files** awaiting manual triaging:\n\n`;
              conflicts.forEach((file, index) => {
                responseText += `${index + 1}. 📄 \`${file.filepath}\` (${file.conflictsCount} conflict markers)\n`;
              });
              responseText += `\n**Clinical Step-by-Step Offline Playbook:**\n` +
                `1. **Explore & Resolve Chunks:** Look at the visual **Conflict Solver** panel. We have parsed the conflict markers into readable blocks for you.\n` +
                `2. **Choose Ours or Theirs:** For each chunk, decide whether you want to preserve your code (\`Ours/HEAD\`) or remote upstream's revisions (\`Theirs/Incoming\`).\n` +
                `3. **Commit with Lease:** Once all files are designated as resolved (marked green), press **Save Resolved File** and transition in Terminal via: \`git rebase --continue\`.`;
            }
          } else if (tone === 'vn_joke') {
            responseText = `🔧 **[Bí Kíp Sơ Cứu Xung Đột Siêu Tốc]**\n\n`;
            if (conflicts.length === 0) {
              responseText += `🟢 **Không có combat nào:** Ôi chúc mừng ní! Nhánh của ní yên bình không có cuộc húc đầu sứt đầu sứt trán nào cả!\n\n` +
                `*Thần chú giữ gìn hoà bình:* Chăm chỉ kéo lúa (\`git pull --rebase\`) đều tay là đời lúc nào cũng êm ấm ní nhé!`;
            } else {
              responseText += `Phát hiện **${conflicts.length} hiện trường đâm xe** tơi tả:\n\n`;
              conflicts.forEach((file, index) => {
                responseText += `${index + 1}. 📄 \`${file.filepath}\` (Có ${file.conflictsCount} dấu vết húc nhau)\n`;
              });
              responseText += `\n**Phác đồ cứu nạn khẩn cấp offline:**\n` +
                `1. **Thủ tiêu dấu vết:** Mở ngay bảng **Conflict Solver**, ở đó có sẵn giao diện bấm nút là rụng răng đối phương. Chọn giữ đằng mình (Our) hay đằng xa xôi (Their).\n` +
                `2. **Lưu lại công sức:** Bấm **Save Resolved File** màu xanh lá dẹp tan tăm tối.\n` +
                `3. **Khải hoàn:** Gõ lệnh thần thông biến hoá \`git rebase --continue\` để bon bon về đích húp trà sữa không lo trễ deadline nha ní!`;
            }
          } else if (tone === 'vn_toxic') {
            responseText = `🔧 **[Cẩm nang vá lỗi xung đột cho kẻ phá hoại]**\n\n`;
            if (conflicts.length === 0) {
              responseText += `🟢 **Lành lặn lạ thường:** Kỳ diệu chưa kìa, cái repo ghẻ này lại không bị xung đột nào mới ghê chứ. Chắc là do chưa thèm gộp nhánh chứ gì? Đừng chủ quan con ạ!\n\n` +
                `*Lời vàng ngọc:* Lo mà fetch code thường xuyên đi kẻo hôm sau merge vô là nổ banh xác pháo lúc đó đừng có mà ré lên nhé!`;
            } else {
              responseText += `Đập vào mắt tao là **${conflicts.length} tệp tin nát như cám**:\n\n`;
              conflicts.forEach((file, index) => {
                responseText += `${index + 1}. 📄 \`${file.filepath}\` (Gây rối ${file.conflictsCount} chỗ)\n`;
              });
              responseText += `\n**Nhiệm vụ bắt buộc của mày:**\n` +
                `1. **Giải quyết triệt để:** Mở tab **Conflict Solver** ra. Đừng có nhắm mắt chọn bừa kẻo mất code của người khác rồi ăn chửi lây cả dòng họ nhé! Xem kĩ Our hay Their, hoặc trộn khôn ngoan vào.\n` +
                `2. **Ấn nút cứu sinh:** Giải quyết xong mà không click **Save Resolved File** thì múa phím nãy giờ vô nghĩa nha thằng gà.\n` +
                `3. **Cút tiếp công việc:** Gõ \`git rebase --continue\` ngay cho tao. Cấm gõ \`git push --force\` bừa bãi đè hết code nhà người ta đấy!`;
            }
          } else { // vn_pro (default)
            responseText = `🔧 **[Phương Án Xử Lý Xung Đột Tiêu Chuẩn Kỹ Thuật]**\n\n`;
            if (conflicts.length === 0) {
              responseText += `🟢 **Không phát hiện xung đột:** Hiện tại mã nguồn của quý khách hoàn toàn đồng bộ, không tồn tại va chạm chéo.\n\n` +
                `*Khuyên dùng từ chuyên gia:* Duy trì thao tác tích hợp nhánh liên tục thông qua rebase để kiểm soát xung đột tuyến tính ở mức tối thiểu.`;
            } else {
              responseText += `Ghi nhận **${conflicts.length} tệp xung đột** chưa xử lý:\n\n`;
              conflicts.forEach((file, index) => {
                responseText += `${index + 1}. 📄 \`${file.filepath}\` (${file.conflictsCount} điểm xung đột)\n`;
              });
              responseText += `\n**Các bước cứu trợ chuẩn chỉ ngoại tuyến:**\n` +
                `1. **Tách biệt dòng tệp:** Sử dụng giao diện trực quan **Conflict Solver** phía bên trái để dò từng block lỗi.\n` +
                `2. **Lựa chọn nội dung tích hợp:** Chọn phiên bản gốc nội bộ (Ours) hoặc phiên bản từ remote (Theirs) phù hợp với nghiệp vụ.\n` +
                `3. **Cập nhật & Chạy tiếp:** Nhấn nút **Save Resolved File** màu xanh lá cây, sau đó dùng terminal thực thi lệnh \`git rebase --continue\` để hoàn tất.`;
            }
          }
          return responseText;
        }
      },
      {
        id: 'lost_code',
        tag: 'Lost Code & Reflog',
        title: tone === 'en_pro' ? '🩹 Clinical Git Reflog Rescue' : '🩹 Bí kíp Reflog khôi phục mã nguồn kì diệu',
        query: tone === 'en_pro'
          ? 'Urgent clinical guide on how to rescue recently deleted commits or lost branch code.'
          : 'Học thuyết cứu hộ thần kỳ: Làm sao tìm lại commits đã biến mất?',
        answer: (repo: GitRepoState) => {
          let responseText = "";

          if (tone === 'en_pro') {
            responseText = `🩹 **[Emergency Operations: Clinical Reflog Salvage]**\n\n` +
              `Do not panic. Git utilizes defensive write-ahead logging called the "reference log" (reflog) which protects garbage collection of orphaned objects for up to 30 days.\n\n` +
              `**How to salvage your commits right now:**\n` +
              `1. **Deploy Diagnostic Probe:** Open terminal and run:\n` +
              `   \`\`\`bash\n` +
              `   git reflog\n` +
              `   \`\`\`\n` +
              `2. **Inspect Reference Entries:** Each line represents a historical state transition. Look for entries labeled with \`commit:\` or \`rebase:\` right before the error happened.\n` +
              `3. **Isolate specific SHA:** For example, you find \`HEAD@{3}: commit: feat: checkout checkout\`. The SHA will be on the leftmost column (e.g., \`b6a4f9d\`).\n` +
              `4. **Reconstruct rescue vessel:** Instantiate a new branch securely targeting that isolated checkpoint:\n` +
              `   \`\`\`bash\n` +
              `   git checkout -b rescue-branch b6a4f9d\n` +
              `   \`\`\`\n\n` +
              `*Context-related suggestion:* Your current HEAD is on branch \`${repo.currentBranch || 'main'}\`. If you lost commits from this branch during rebase, reflog is guaranteed to contain them!`;
          } else if (tone === 'vn_joke') {
            responseText = `🩹 **[Thần Thuật Hồi Sinh Vong Hồn Code Đã Mất]**\n\n` +
              `Gào khóc khản cổ vì lỡ tay \`git reset --hard\` hay rebase lỗi xoá bay màu commit? Nín đi ní ơi, Git có ngăn tủ bí mật tên là **Reflog** giữ xác vong hồn code trong vòng 30 ngày cơ ghen!\n\n` +
              `**Cách triệu hồi code yêu dấu quay về cực nhanh:**\n` +
              `1. **Mở két sắt:** Chạy lệnh soi gương chiếu yêu:\n` +
              `   \`\`\`bash\n` +
              `   git reflog\n` +
              `   \`\`\`\n` +
              `2. **Lọc tìm linh hồn:** Nhìn vào bảng lịch sử oanh liệt, kiếm cái dòng ngay trước khi xảy ra thảm hoạt (ví dụ: \`HEAD@{2}: rebase (start): checkout main\` hoặc \`commit: fix: login validation\`).\n` +
              `3. **Lấy mã hồi sinh:** Chộp lấy cái mã SHA gồm 7 chữ số lấp lánh (ví dụ \`7a1c4b9\`) ở đầu dòng đó.\n` +
              `4. **Thành hình:** Hét to lệnh kết giới tạo nhánh cứu nạn:\n` +
              `   \`\`\`bash\n` +
              `   git checkout -b nhanh-cuu-nan-yeu-thuong 7a1c4b9\n` +
              `   \`\`\`\n\n` +
              `Tada! Toàn bộ mớ code cũ tự dưng hiện về nhảy múa mượt mà! Thích nhé ní!`;
          } else if (tone === 'vn_toxic') {
            responseText = `🩹 **[Thuật triệu hồn cái đầu rỗng tuếch xóa nhầm code]**\n\n` +
              `Múa phím bậy bạ, reset bốc đồng rồi mất cmn code rồi ghé đít vào đây khóc ăn vạ đúng không? Đúng là đồ gà mờ! Nhưng thôi, tao thương hại chỉ cho cách sài thần thuật nhặt xác mang tên **Reflog** đây:\n\n` +
              `**Cút ra gõ đúng các lệnh này để cứu mạng mày:**\n` +
              `1. **Soi gương tự sám hối:** Gõ khẩn trương:\n` +
              `   \`\`\`bash\n` +
              `   git reflog\n` +
              `   \`\`\`\n` +
              `2. **Truy lùng SHA của tội lỗi:** Nhìn vào mấy cái dòng dài ngoằng kia kìa, tìm dòng ghi công sức trước lúc mày táy máy phá hoại (ví dụ: \`HEAD@{1}: commit: feat: core payment\`). Nhìn sang bên trái cùng có cái mã băm SHA (ví dụ \`6c9f3e1\`).\n` +
              `3. **Triệu hồi xác chết:** Quất lệnh checkout tạo nhánh mới hồi sinh đống commits đó ngay lập tức:\n` +
              `   \`\`\`bash\n` +
              `   git checkout -b nhanh-cuu-tinh 6c9f3e1\n` +
              `   \`\`\`\n\n` +
              `Lần sau lạy mày code cho có ý thức hộ tao cái. Cái reflog cứu mày được lần này chứ éo cứu được cái dốt cả đời đâu nhé thằng ngáo!`;
          } else { // vn_pro (default)
            responseText = `🩹 **[Quy Trình Khôi Phục Mã Nguồn Khẩn Cấp Bằng Git Reflog]**\n\n` +
              `Mất mát commit hoặc code uncommitted do thao tác rebase/reset nhầm lẫn hoàn toàn có thể cứu hộ được nhờ cơ chế lưu trữ lịch sử tham chiếu cục bộ (Repository Reference Log).\n\n` +
              `**Quy trình khôi phục kỹ thuật ngoại tuyến:**\n` +
              `1. **Kiểm tra Nhật ký Tham chiếu:** Thực hiện lệnh kiểm tra trong terminal:\n` +
              `   \`\`\`bash\n` +
              `   git reflog\n` +
              `   \`\`\`\n` +
              `2. **Xác định thời điểm an toàn:** Tìm dòng văn bản ghi nhận trạng thái ổn định gần nhất ngay trước lúc xảy ra lỗi (ví dụ: \`commit: feat: api connection\` tại ví trí \`HEAD@{4}\`).\n` +
              `3. **Ghi lại mã Hash SHA:** Lấy mã hash đại diện hiển thị ở đầu dòng tương ứng (ví dụ: \`d4e2f1a\`).\n` +
              `4. **Kiến tạo nhánh khôi phục:** Thiết lập một nhánh làm việc mới từ cột mốc SHA đã chọn để hồi sinh toàn vẹn mã nguồn:\n` +
              `   \`\`\`bash\n` +
              `   git checkout -b rescue-restore-branch d4e2f1a\n` +
              `   \`\`\`\n\n` +
              `Độ tin cậy của phương pháp này đạt tuyệt đối 100% đối với các commits cục bộ đã từng được tạo.`;
          }
          return responseText;
        }
      },
      {
        id: 'power_bi',
        tag: 'Power BI & TMDL Expert',
        title: tone === 'en_pro' ? '📊 Power BI, TMDL & JSON Clinical Fix' : '📊 Chẩn đoán sập nguồn Power BI, TMDL & JSON',
        query: tone === 'en_pro'
          ? 'Provide advanced offline diagnosis for Power BI TMDL model metadata merge issues.'
          : 'Cách sửa lỗi xung đột Power BI / TMDL / report.json offline?',
        answer: (repo: GitRepoState) => {
          let hasPbiFiles = false;
          if (repo.dirtyFiles?.some(f => f.includes('.tmdl') || f.includes('.bim') || f.includes('.json'))) {
            hasPbiFiles = true;
          }

          let responseText = "";
          if (tone === 'en_pro') {
            responseText = `📊 **[Power BI Metadata Clinical Diagnostics]**\n\n` +
              `Merging power BI tabular models (TMDL/BIM) often triggers major compiler exceptions. Let's consult the diagnostics rules:\n\n` +
              `1. **LineageTag Dup Hazard:** Power BI requires unique tags (\`lineageTag\`) per columns/measures. Concatenated merges produce twin targets. We auto-rewrite remote incoming tags with fresh UUIDs inside the Block editor to avoid Power BI Desktop reload loops.\n` +
              `2. **The Indentation Rule:** Tabular Model Definition Language (TMDL) strictly demands 2-space indentation. Mix-ups with tabs trigger parse failures. Enforce strict spaces on your modifications.\n` +
              `3. **Nested Layout Objects:** For complex \`report.json\` viewport settings, manually patching line collisions is highly hazardous due to brace breaking. Choose one clean host branch (Ours/HEAD or Theirs/Incoming) directly.\n\n` +
              `*Context detection:* ${hasPbiFiles ? "⚠️ We detected active metadata files under modification. Exercise strict caution during merging." : "🟢 No active Power BI files detected. Keep this playbook for upcoming report integration tasks."}`;
          } else if (tone === 'vn_joke') {
            responseText = `📊 **[Trạm Xá Cứu Độ Power BI & TMDL Cháy Khét Lẹt]**\n\n` +
              `Xung đột tệp báo cáo Power BI (TMDL/BIM/JSON) là chúa tể rắc rối làm các lập trình viên muốn điên đầu mệt mỏi! Nhưng đừng hoảng, em chỉ cho ba bài tủ giải cứu không tốn 1 xu tiền mạng:\n\n` +
              `1. **Trùng lineageTag (Lỗi nổ tung report):** Hệ thống Power BI bắt buộc mỗi ô đo phải có một cái thẻ chứng minh nhân dân \`lineageTag\` độc nhất. Rebase lỡ gộp chung là hai bên bị trùng nhãn ngay. Hãy dùng Block Merge bên cạnh, chọn đổi lineageTag của bên Incoming thành một UUID mới toanh là Power BI Desktop cười tươi rói gật đầu liền!\n` +
              `2. **Lệch ngã ba đường (TMDL 2-spaces):** TMDL sếp viết phải thụt lề chuẩn đét 2 khoảng trắng. Thụt lệch 3 hay quất phím TAB gàn dở là Microsoft nó giận nó không thèm render luôn á! Nắn lại đều tay cho em nha ní.\n` +
              `3. **File cấu trúc Report JSON nát bươm:** File layout \`report.json\` cực kì nguy hiểm nếu trộn lộn xộn mất ngoặc nhọn \`{}\`. Khuyên ní nếu rắc rối quá đừng ráng trộn dòng, quất luôn Our hoặc Their cho nó toàn vẹn gia môn!`;
          } else if (tone === 'vn_toxic') {
            responseText = `📊 **[Sửa lỗi Power BI / TMDL ngu ngốc - Chế độ sỉ nhục]**\n\n` +
              `Dám đem tệp mô hình dữ liệu Power BI (TMDL/BIM) đi gộp nhánh linh tinh mà không chịu học luật đúng không? Nhìn cái đống lineageTag trùng lặp toe toét đi thằng ngáo! Để tao chỉ cho mà sửa cho đỡ báo team:\n\n` +
              `1. **LineageTag trùng lặp vô học:** Máy Microsoft nó gào lên đòi thẻ UUID độc nhất mà mày cắm đầu copy trùng lặp làm nó treo cứng đơ. Dùng Block Merge tự động đổi UUID tệp để dẹp cái nạn dốt nát này hộ tao!\n` +
              `2. **Thụt lề bậy bạ:** TMDL bắt buộc thụt lề 2 khoảng trắng thẳng tắp. Mày rảnh tay quất phím TAB lộn xộn hoặc quất 3 khoảng trắng cẩu thả thế à? Nắn lại thẳng hàng 2-spaces ngay cho tao, cấm chế cháo bậy bạ!\n` +
              `3. **report.json dột nát:** Mấy cái file lưu toạ độ visual JSON siêu lằng nhằng, mày cố trộn tay là vỡ cấu trúc dấu ngoặc liền. Khôn hồn chọn luôn 1 tệp sạch (Ours hoặc Theirs) đi thằng khờ!`;
          } else { // vn_pro (default)
            responseText = `📊 **[Nghiệp Vụ Kiểm Soát Xung Đột Mô Hình Power BI / TMDL]**\n\n` +
              `Các tệp cấu trúc báo cáo của Microsoft Power BI (như TMDL, BIM, report.json) có cấu trúc cú pháp rất khắt khe. Xin lưu tâm các quy tắc chẩn đoán lỗi offline dưới đây:\n\n` +
              `1. **Sự Cố Trùng Lặp lineageTag:** Cơ sở dữ liệu Power BI yêu cầu định danh UUID (\`lineageTag\`) duy nhất cho mỗi đối tượng. Khi gộp nhánh, trùng lặp nhãn này gây lỗi nạp mô hình. Đề xuất gán nhãn UUID mới riêng biệt cho các measures chịu ảnh hưởng từ Remote.\n` +
              `2. **Quy Chuẩn Thụt Lề TMDL:** TMDL bắt buộc áp dụng cấu trúc thụt đầu dòng gãy gọn rộng đúng 2 khoảng trắng (2-spaces). Tránh pha trộn phím Tab hoặc khoảng trắng không đồng đều gây lỗi phân tích cú pháp.\n` +
              `3. **Bảo Vệ Cấu Trúc report.json:** File JSON định hình visual layout rất dễ hỏng cấu trúc đóng mở ngoặc nhọn \`{}\` nếu gộp dòng thủ công. Nếu xung đột quá phức tạp, khuyết khích chọn nguyên vẹn một bên (Ours hoặc Theirs) để đảm bảo tệp báo cáo hoạt động bình thường.`;
          }
          return responseText;
        }
      }
    ];
  }, [tone]);

  const handleSendOfflineQuestion = (title: string, query: string, answerFn?: (repo: GitRepoState) => string) => {
    if (isOfflineLoading) return;

    const userMsg = {
      id: `offline_usr_${Date.now()}`,
      role: 'user' as const,
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOfflineMessages(prev => [...prev, userMsg]);
    setIsOfflineLoading(true);

    const topicTag = title.substring(2); // Strip icon
    setAskedOfflineTopics(prev => {
      if (prev.includes(topicTag)) return prev;
      return [...prev, topicTag];
    });
    setDidHandoffContext(false);

    setTimeout(() => {
      let finalContent = "";
      if (answerFn) {
        finalContent = answerFn(repoState);
      } else {
        const isConflict = query.toLowerCase().includes('conflict') || query.toLowerCase().includes('xung đột');
        const isDiverge = query.toLowerCase().includes('diverge') || query.toLowerCase().includes('lệch');
        const isLost = query.toLowerCase().includes('mất code') || query.toLowerCase().includes('lost code') || query.toLowerCase().includes('reflog');

        if (isConflict) {
          finalContent = offlineQuestions.find(q => q.id === 'conflict_solver')?.answer(repoState) || "Chẩn trị xung đột cục bộ.";
        } else if (isDiverge) {
          finalContent = offlineQuestions.find(q => q.id === 'repo_health')?.answer(repoState) || "Giải quyết phân kỳ nhánh.";
        } else if (isLost) {
          finalContent = offlineQuestions.find(q => q.id === 'lost_code')?.answer(repoState) || "Giải cứu reflog.";
        } else {
          finalContent = offlineQuestions.find(q => q.id === 'repo_health')?.answer(repoState) || "Hỗ trợ lâm sàng cục bộ.";
        }
      }

      setOfflineMessages(prev => [...prev, {
        id: `offline_ai_${Date.now()}`,
        role: 'model',
        content: finalContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      setIsOfflineLoading(false);
    }, 450);
  };

  // Setup diagnostic triggers based on current Git problems
  const quickMitigations = React.useMemo(() => {
    const list = [];
    if (repoState.isDirty) {
      list.push({
        title: tone === 'en_pro' ? 'Clean Dirty Tree' : 'Cách dọn rác uncommitted?',
        query: tone === 'en_pro' 
          ? 'I have uncommitted changes. How do I stash or clean them up so I can perform my rebase safely?' 
          : 'Tôi có một số file chưa commit, tôi nên dọn dẹp hoặc cất đi bằng git stash thế nào để rebase an toàn?'
      });
    }
    
    // Diverged check
    const isDiverged = repoState.currentBranch?.includes('diverged') || repoState.commits.some(c => c.message?.includes('Remote'));
    if (isDiverged) {
      list.push({
        title: tone === 'en_pro' ? 'Solve Diverged Branch' : 'Giải quyết nhánh lệch pha (Diverged)?',
        query: tone === 'en_pro'
          ? 'My local branch has diverged from the remote. How can I resolve it using pull --rebase?'
          : 'Nhánh local của tôi bị lệch pha (diverged) so với remote. Làm thế nào để giải quyết súc tích nhất?'
      });
    }

    // Detached check
    const isDetached = repoState.currentBranch?.includes('detached') || repoState.currentBranch === '';
    if (isDetached) {
      list.push({
        title: tone === 'en_pro' ? 'Fix Detached HEAD' : 'Neo lại detached HEAD?',
        query: tone === 'en_pro'
          ? 'I am stuck in a Detached HEAD state. How do I point back to a real branch without losing changes?'
          : 'Tôi bị mắc kẹt ở trạng thái Detached HEAD. Hãy hướng dẫn tôi tạo nhánh cứu nạn để không mất code?'
      });
    }

    // Always append code loss / reflog help
    list.push({
      title: tone === 'en_pro' ? '😭 I lost code! Help me!' : '🔥 Bị mất code/Rebase lỗi, giúp!',
      query: tone === 'en_pro'
        ? 'Urgent: I completed conflict resolution but some commits seemed to vanish or I lost my code. How can I use git reflog to recover it?'
        : 'Cứu khẩn cấp: Tôi vừa giải quyết xung đột rebase xong thì thấy mất sạch commits hoặc mất code cũ. Làm thế nào để tìm lại code bằng thần thuật git reflog?'
    });

    list.push({
      title: tone === 'en_pro' ? 'What is Rebase vs Merge?' : 'Rebase khác gì Merge?',
      query: 'Hãy giải thích cho tôi điểm khác biệt cốt lõi giữa Git Rebase và Git Merge, khuyên dùng khi nào?'
    });

    if (isUpgraded) {
      list.push({
        title: tone === 'en_pro' ? '⚡ Advanced Reflog Rescue' : '⚡ Khôi Phục Reflog Nâng Cao',
        query: tone === 'en_pro'
          ? 'Deeply analyze how I can restore orphaned or lost commits from git reflog during a bad rebase, showing step-by-step cli and visual recovery.'
          : 'Bác Sĩ khuyên tai: Tôi vừa bị mất commit và code cũ do rebase đè. Hướng dẫn tôi thần chú khôi phục bằng lệnh git reflog nâng cao và giải cứu nhánh!'
      });
      list.push({
        title: tone === 'en_pro' ? '🔌 Diagnostic Sandbox Rules' : '🔌 Chẩn Đoán Ngoại Tuyến',
        query: tone === 'en_pro'
          ? 'What are the static diagnostic safety checks for git projects, including detached HEADs, diverged trees, and dangling references?'
          : `Hãy phân tích các lỗi tiềm ẩn của nhánh Git hiện tại bằng bộ luật chẩn đoán ngoại tuyến v${appVersion} của Bác Sĩ!`
      });
    }

    return list;
  }, [repoState, tone, isUpgraded, appVersion]);

  // Handle open greeting message based on active tone Persona
  React.useEffect(() => {
    if (messages.length === 0) {
      let proPrefix = "";
      if (isUpgraded) {
        if (tone === 'vn_joke') {
          proPrefix = `🚀 [BẢN NÂNG CẤP CHUYÊN NGHIỆP v${appVersion} ĐÃ KÍCH HOẠT!] 🌟\n\n`;
        } else if (tone === 'vn_toxic') {
          proPrefix = `🔥 [AI DOCTOR PRO v${appVersion} LÊN SÀN - CÔNG LỰC VÔ SONG!] 😈\n\n`;
        } else if (tone === 'en_pro') {
          proPrefix = `⚡ [AI GIT DOCTOR PRO v${appVersion} ENGINE LOADED] ⚡\n\n`;
        } else {
          proPrefix = `✨ [CHẾ ĐỘ AI DOCTOR PRO v${appVersion} ĐÃ SẮN SÀNG CHẨN ĐOÁN] ✨\n\n`;
        }
      }

      let greetText = "Xin chào! Tôi là Trợ lý Giáo sư AI Git Doctor. Trạng thái Git của bạn hiện đã được tự kết nối. Bạn vừa gặp sự cố, mất code hoặc có thắc mắc gì về quy trình Rebase?";
      if (tone === 'vn_joke') {
        greetText = "Chào ní yêu! 🩺 Bác Sĩ Git đã túc trực 24/7 đây. Nhánh rẽ, mất code, hay húc nhau tung toé gây xung đột à? Ní cứ ném hết vào đây em gầm rú gỡ tơ vò cho nhé!";
      } else if (tone === 'vn_toxic') {
        greetText = "Lại gây hoạ gây sập repo rồi bò vào đây ăn vạ đúng không? Thằng gà! Đã bảo rebase phải ngó trước sau rồi. Khai mau: bị mất code, bị conflict nát đầu hay lệch pha với remote? Tao ngó qua cứu mạng cho khôn ra nhá!";
      } else if (tone === 'en_pro') {
        greetText = "Greetings! I am your Git Overlord Solutions Advisor. I have auto-synced with your repository's context. Ask me anything about conflict resolution, diverged state, branch mismatches, or emergency reflog recovery!";
      }

      greetText = proPrefix + greetText;

      if (!isAiEnabled) {
        if (tone === 'vn_joke') {
          greetText += "\n\n*(Lưu ý nhẹ: Em đang chạy Offline bằng cơm vì sếp chưa bật AI trong Cài đặt á! Em sẽ dùng thuật chẩn đoán sơ cứu tĩnh siêu nhanh cho sếp nhé!)*";
        } else if (tone === 'vn_toxic') {
          greetText += "\n\n*(Lưu ý: Tắt AI rồi thì tao chỉ trả lời bằng phao sơ cứu offline được soạn sẵn thôi nhé thằng ngáo. Khôn hồn thì bật nút AI xanh lá ở Settings lên!)*";
        } else if (tone === 'en_pro') {
          greetText += "\n\n*(Please note: Since AI is disabled, I am operating in Offline first-aid mode. Responses will use structured static local diagnostic rules only.)*";
        } else {
          greetText += "\n\n*(Lưu ý: Bạn đang tắt Trợ lý AI. Doctor sẽ giải đáp nhanh dưới dạng các quy tắc sơ cứu / phao thông tin ngoại tuyến đã ghi nhớ.)*";
        }
      }

      setMessages([{
        id: 'initial_greet',
        role: 'model',
        content: greetText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [tone, isAiEnabled, messages.length]);

  // Scroll to bottom helper
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, offlineMessages, isOfflineLoading, activeTab, isOpen, searchText]);

  const handleSendChat = async (customQuery?: string) => {
    const textToSend = (customQuery || inputVal).trim();
    if (!textToSend) return;

    if (!customQuery) {
      setInputVal('');
    }

    // Set up the message content with offline handoff context injected if appropriate
    let msgContentToSend = textToSend;
    let localAskedTopics = [...askedOfflineTopics];
    if (localAskedTopics.length > 0 && isAiEnabled) {
      const topicsStr = localAskedTopics.join(', ');
      msgContentToSend = `[Context Handoff: Khi ngoại tuyến ở tab Offline, tôi đã tìm hiểu chẩn đoán cục bộ về các chủ đề: "${topicsStr}". Hãy trả lời câu hỏi dưới đây đồng thời tự nhiên tích hợp và khuyên tôi thêm dựa trên các chủ đề đó nếu liên quan nhé!] \n\n ${textToSend}`;
      setDidHandoffContext(true);
      setAskedOfflineTopics([]); // Clear after embedding
    }

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user' as const,
      content: textToSend, // Keep displayed message clean and original in the UI history!
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessagesForUi = [...messages, userMsg];
    setMessages(nextMessagesForUi);
    setIsLoading(true);

    try {
      // For the API body, we use the contextualized message content for the last entry
      const apiMessages = nextMessagesForUi.map((msg, idx) => {
        if (idx === nextMessagesForUi.length - 1) {
          return { role: msg.role, content: msgContentToSend };
        }
        return { role: msg.role, content: msg.content };
      });

      const response = await fetch(resolveApiUrl('/api/ai-chat'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          messages: apiMessages,
          repoContext: repoState,
          tone: tone,
          isAiEnabled: isAiEnabled
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API error (status ${response.status})`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (!isOpen) {
        setHasNewResponse(true);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'model',
        content: tone === 'en_pro'
          ? "⚠️ Sorry, there was an issue communicating with the AI engine. Please check your internet connection and active key settings in the secrets panel."
          : "⚠️ Xin lỗi sếp, em bị mất liên lạc tạm thời với máy chủ Trợ lý AI. Sếp vui lòng kiểm tra khoá API trong Cài đặt hoặc thử lại nha!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
  };

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setHasNewResponse(false);
      setTimeout(() => {
        const el = document.getElementById('command-palette-search-input');
        if (el) (el as HTMLInputElement).focus();
      }, 100);
    }
  };

  // Compile full search indexing elements for the prompt Command Palette & Action Launcher
  const commandActions = React.useMemo(() => {
    const list = [
      {
        id: 'set_daily',
        category: 'Thao tác hệ thống',
        title: '💻 Chuyển sang Developer Daily (Nhánh & Commits)',
        description: 'Mở màn hình làm việc hàng ngày, xem biểu đồ commit và các nhánh hiện có.',
        action: () => {
          onSwitchDashboardMode?.('daily');
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'set_rescue',
        category: 'Thao tác hệ thống',
        title: '🚑 Chuyển sang Cứu Hộ Git Rescue (Reflog & Conflicts)',
        description: 'Mở màn hình khẩn cấp cứu hộ, sửa xung đột Rebase và khôi phục commits bằng Reflogs.',
        action: () => {
          onSwitchDashboardMode?.('rescue');
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'set_learning',
        category: 'Thao tác hệ thống',
        title: '🏫 Chuyển sang Sa Bàn Mô Phỏng (Learning Mode)',
        description: 'Mở màn hình sa bàn huấn luyện, thực hành và xem các bài giảng Rebase.',
        action: () => {
          onSwitchDashboardMode?.('learning');
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'toggle_sim_active',
        category: 'Thao tác hệ thống',
        title: isSimulation ? '🔌 Chuyển Sang Kết Nối Repository Thật' : '🧪 Kích Hoạt Sa Bàn Giả Lập (Simulation mode)',
        description: isSimulation ? 'Nối dữ liệu thẳng tới thư mục Git thật trên ổ cứng.' : 'Chế độ mô phỏng an toàn giúp bạn tha hồ nghịch phá không lo sợ sập code thật.',
        action: () => {
          onToggleSimulation?.(!isSimulation);
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'clear_terminal',
        category: 'Dọn dẹp',
        title: '💥 Làm Sạch Nhật Ký Terminal (Clear Console)',
        description: 'Xoá vĩnh viễn toàn bộ lịch sử các dòng logs lệnh hiển thị ở terminal.',
        action: () => {
          onClearLogs?.();
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'copy_branch_command',
        category: 'Tiện ích',
        title: `📋 Sao Chép Tên Nhánh Làm Việc (\`${repoState.currentBranch || 'N/A'}\`)`,
        description: 'Lưu tên nhánh làm việc hiện tại vào bộ nhớ tạm (Clipboard) nhanh chóng.',
        action: () => {
          if (repoState.currentBranch) {
            navigator.clipboard.writeText(repoState.currentBranch);
            alert(`Đã sao chép: ${repoState.currentBranch}`);
          } else {
            alert('Không tìm thấy tên nhánh hợp lệ.');
          }
          setSearchText('');
        }
      },
      {
        id: 'open_keys',
        category: 'Cài đặt',
        title: '🔑 Cấu Hình Khóa Bảo Mật Gemini API Key',
        description: 'Thiết lập khoá API để kích hoạt bộ não AI Doctor chẩn đoán trực tuyến mượt mà.',
        action: () => {
          setShowKeySetting(true);
          setSearchText('');
        }
      },
      {
        id: 'toggle_dock',
        category: 'Workspace Layout (Bố cục)',
        title: '⚓ Neo Panel Terminal & Logs Xuống Dưới / Sang Phải (Dock bottom/right)',
        description: 'Phím tắt: Alt+D. Chuyển đổi vị trí Neo Terminal để mở rộng bảng biểu đồ Git.',
        action: () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 'd' }));
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'toggle_sidebar',
        category: 'Workspace Layout (Bố cục)',
        title: '🎛️ Chuyển Thanh Cấu Hình Qua Trái / Phải (Toggle Sidebar Alignment)',
        description: 'Phím tắt: Alt+S. Di chuyển thanh điều hướng nhánh và cấu hình sang trái/phải.',
        action: () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 's' }));
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'toggle_layout_width',
        category: 'Workspace Layout (Bố cục)',
        title: '🖥️ Layout: Chia đôi cột (Split) / Toàn màn hình rộng (Fullscreen)',
        description: 'Phím tắt: Alt+W. Chuyển đổi giữa chế độ chia cột IDE và chế độ tập trung phẳng.',
        action: () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 'w' }));
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'spawn_detached_window',
        category: 'Môi trường Electron (Multi-Window)',
        title: '🪟 Mở Thêm Cửa Sổ Phụ Độc Lập / Draggable Floating (Multi-Window client)',
        description: 'Phím tắt: Alt+J. Tách các panel quan trọng ra thành cửa sổ phụ kéo thả được.',
        action: () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 'j' }));
          setIsOpen(false);
          setSearchText('');
        }
      },
      {
        id: 'show_cheatsheet',
        category: 'Trợ giúp',
        title: '⌨️ Danh Sách Phím Tắt Tiêu Chuẩn IDE (Keyboard Shortcuts Map)',
        description: 'Phím tắt: Alt+H. Mở sơ đồ hệ thống phím tắt điều hướng nhanh như JetBrains/VSCode.',
        action: () => {
          window.dispatchEvent(new KeyboardEvent('keydown', { altKey: true, key: 'h' }));
          setIsOpen(false);
          setSearchText('');
        }
      }
    ];

    return list;
  }, [onSwitchDashboardMode, isSimulation, onToggleSimulation, onClearLogs, repoState.currentBranch]);

  const offlineCommandItems = React.useMemo(() => {
    return offlineQuestions.map(oq => ({
      id: `offline_cmd_${oq.id}`,
      category: 'Chẩn đoán lâm sang (Offline)',
      title: oq.title,
      description: oq.query,
      action: () => {
        setActiveTab('offline');
        handleSendOfflineQuestion(oq.title, oq.query, oq.answer);
        setSearchText('');
      }
    }));
  }, [offlineQuestions, repoState]);

  const quickMitigationItems = React.useMemo(() => {
    return quickMitigations.map((qm, i) => ({
      id: `qm_cmd_${i}`,
      category: 'Gợi ý sơ cứu nhanh',
      title: `🩺 ${qm.title}`,
      description: qm.query,
      action: () => {
        if (isAiEnabled) {
          setActiveTab('live');
          handleSendChat(qm.query);
        } else {
          setActiveTab('offline');
          handleSendOfflineQuestion(qm.title, qm.query);
        }
        setSearchText('');
      }
    }));
  }, [quickMitigations, isAiEnabled]);

  const allSearchItems = React.useMemo(() => {
    return [
      ...commandActions,
      ...offlineCommandItems,
      ...quickMitigationItems
    ];
  }, [commandActions, offlineCommandItems, quickMitigationItems]);

  const filteredSearchItems = React.useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.toLowerCase();
    return allSearchItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [allSearchItems, searchText]);

  // Reset keyboard cursor position on query change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchText]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredSearchItems.length > 0) {
        setSelectedIndex(prev => (prev + 1) % filteredSearchItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredSearchItems.length > 0) {
        setSelectedIndex(prev => (prev - 1 + filteredSearchItems.length) % filteredSearchItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSearchItems.length > 0 && selectedIndex < filteredSearchItems.length) {
        filteredSearchItems[selectedIndex].action();
      } else if (searchText.trim()) {
        // Fallback: If text doesn't explicitly match, run it as a regular chat message query! This is extremely smart.
        if (isAiEnabled) {
          setActiveTab('live');
          handleSendChat(searchText);
        } else {
          setActiveTab('offline');
          handleSendOfflineQuestion('🔍 Câu hỏi thông dụng', searchText);
        }
        setSearchText('');
      } else if (inputVal.trim()) {
        if (activeTab === 'live') {
          handleSendChat();
        } else {
          handleSendOfflineQuestion('🔍 Thắc mắc lâm sàng', inputVal);
          setInputVal('');
        }
      }
    }
  };

  return (
    <>
      {/* Floating Messenger Hint Badge when minimized with new response pending */}
      <AnimatePresence>
        {hasNewResponse && !isOpen && (
          <div className="fixed bottom-6 right-6 z-[95] flex flex-col items-end">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`mb-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium shadow-xl border cursor-pointer ${
                theme === 'light' 
                  ? 'bg-indigo-650 text-white border-indigo-700' 
                  : 'bg-indigo-500 text-slate-900 border-indigo-400'
              }`}
              onClick={toggleOpen}
            >
              <div className="flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>AI Doctor Trả lời! (Ctrl+K)</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-in Right Drawer consultation Window + Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] z-[100] cursor-pointer"
            />

            {/* Main Full-Height Right Drawer */}
            <motion.div
              id="ai-messenger-box"
              initial={{ x: '100%', opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.95 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className={`fixed top-0 right-0 h-screen w-full sm:w-[480px] z-[110] flex flex-col overflow-hidden border-l shadow-2xl ${
                isUpgraded
                  ? theme === 'light'
                    ? 'bg-white border-amber-300 ring-1 ring-amber-400/20 text-slate-800'
                    : 'bg-[#060812]/98 border-amber-500/30 backdrop-blur-md text-slate-100 shadow-[-10px_0_40px_rgba(0,0,0,0.6)]'
                  : theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#070913]/98 border-slate-800/80 backdrop-blur-md text-slate-100 shadow-[-10px_0_40px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Drawer Top Header */}
              <div className={`p-4 flex justify-between items-center border-b shrink-0 ${
                isUpgraded 
                  ? theme === 'light' 
                    ? 'bg-amber-50/50 border-amber-100' 
                    : 'bg-[#18120b] border-amber-500/20'
                  : theme === 'light' 
                    ? 'bg-indigo-50/50 border-slate-100' 
                    : 'bg-slate-900/50 border-indigo-500/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    isUpgraded
                      ? 'bg-amber-500/10 text-amber-500'
                      : theme === 'light' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    <Bot className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex items-center gap-1">
                        AI DOCTOR & LAUNCHER
                        {isUpgraded && (
                          <span className="text-[9px] text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1 py-0.2 rounded font-extrabold tracking-widest animate-pulse">
                            PRO v{appVersion}
                          </span>
                        )}
                      </span>
                      <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isAiEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`} />
                    </h3>
                    <p className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tone === 'vn_pro' && 'Trợ lý AI chẩn đoán lỗi Git, sửa conflict & Bảng lệnh tìm kiếm nhanh (AI Doctor)'}
                      {tone === 'vn_joke' && 'Bác sĩ Git khám mạch từ xa, cấp cứu code hỏng & Bắn lệnh tắt siêu tốc'}
                      {tone === 'vn_toxic' && 'Trạm cứu hộ, sửa lỗi ngu ngơ & Sỉ nhục Git gà mờ (Git Doctor)'}
                      {tone === 'en_pro' && 'AI Git Diagnostic Consultant, Conflict Helper & Shortcut Command Launcher'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Clear logs inside command palette */}
                  <button 
                    onClick={clearChatHistory}
                    className={`p-1 flex items-center gap-1 rounded hover:bg-slate-800 text-[10px] uppercase font-mono font-bold ${
                      theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Xoá lịch sử hội thoại"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 px-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-450 text-slate-400 transition-all duration-150 active:scale-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Simulated Git Real-time Context Banner */}
              <div className={`px-4 py-2 border-b text-[10px] font-mono flex items-center justify-between shrink-0 ${
                theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-900/40 border-slate-800/80 text-indigo-400'
              }`}>
                <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                  <GitBranch className="w-3 h-3 text-indigo-400" />
                  <span className="text-[9px] text-slate-500">Branch:</span>
                  <span className={`truncate font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                    {repoState.currentBranch || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {repoState.rebaseInProgress && (
                    <span className="bg-rose-550/20 border border-rose-500/30 text-rose-500 px-1 py-0.5 rounded font-bold uppercase text-[8px] animate-pulse">
                      REBASE ACTIVE
                    </span>
                  )}
                  {isSimulation ? (
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold uppercase text-[8px]">
                      SIMULATION
                    </span>
                  ) : (
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded font-bold uppercase text-[8px]">
                      HOST CODE
                    </span>
                  )}
                </div>
              </div>

              {/* API Key Configuration Dropdown */}
              <div className={`px-4 py-2 border-b text-[10px] font-mono flex flex-col gap-1.5 shrink-0 ${
                theme === 'light' ? 'bg-indigo-50/25 border-slate-100 text-slate-700' : 'bg-[#0f1225]/45 border-slate-800/60 text-slate-150'
              }`}>
                <div className="flex justify-between items-center bg-transparent">
                  <span className="text-slate-400 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Gemini Secret:</span>
                    <span className={`px-1 py-0.2 rounded text-[8px] font-mono ${
                      customApiKey.trim()
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {customApiKey.trim() ? "Active" : "System Def"}
                    </span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => setShowKeySetting(!showKeySetting)}
                    className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer font-bold uppercase"
                  >
                    {showKeySetting ? 'Hide panel' : 'Edit key'}
                  </button>
                </div>
                {showKeySetting && (
                  <div className="flex gap-1.5 mt-1">
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        setCustomApiKey(newKey);
                        localStorage.setItem('gemini_api_key', newKey);
                      }}
                      placeholder="AIzaSy... (Gemini API Key)"
                      className={`flex-1 px-2.5 py-1.5 rounded-lg text-[10px] border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-[#04060e] border-slate-800 text-indigo-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomApiKey('');
                        localStorage.removeItem('gemini_api_key');
                        alert('API Key cleared. Using server default.');
                      }}
                      className="px-2.5 py-1 bg-red-650/20 text-red-400 hover:text-white hover:bg-red-600 rounded text-[9px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-all active:scale-[0.95]"
                      title="Clear key and revert to defaults"
                    >
                      Clear Key
                    </button>
                  </div>
                )}
              </div>

              {/* Tab options switch */}
              <div className={`flex border-b text-[10px] uppercase font-bold shrink-0 ${
                theme === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-[#0f1224] border-slate-805'
              }`}>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveTab('live');
                    setSearchText('');
                  }}
                  className={`flex-1 py-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'live'
                      ? 'border-indigo-500 text-indigo-400 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Brain</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveTab('offline');
                    setSearchText('');
                  }}
                  className={`flex-1 py-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${
                    activeTab === 'offline'
                      ? 'border-indigo-500 text-indigo-400 font-bold' 
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-450 animate-pulse" />
                  <span>Clinical Offline Diagnose</span>
                </button>
              </div>

              {/* Flex Panel Content Area */}
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Search Bar / Launcher input (Command Palette Center!) */}
                <div className={`p-4 border-b shrink-0 flex flex-col gap-2 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-[#090b14]/70 border-slate-800/60'
                }`}>
                  <div className="relative flex items-center">
                    <Search className={`w-3.5 h-3.5 absolute left-3 ${
                      theme === 'light' ? 'text-slate-400' : 'text-indigo-400 animate-pulse'
                    }`} />
                    <input
                      id="command-palette-search-input"
                      type="text"
                      placeholder="Gõ lệnh hoặc câu hỏi... (e.g. daily, rescue, lost code)"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      className={`w-full pl-9 pr-14 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono font-bold ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-slate-950 border-slate-805 text-indigo-200 placeholder-slate-500 shadow-inner'
                      }`}
                    />
                    <span className="absolute right-3 inline-flex items-center gap-1 text-[8px] font-mono font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 px-1 py-0.5 rounded leading-none shrink-0 pointer-events-none">
                      ESC
                    </span>
                  </div>
                  
                  {/* Shortcut prompt guidance */}
                  <p className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                    <Command className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>Dùng <strong>↑↓</strong> chọn, <strong>Enter</strong> kích hoạt. Gõ từ tự do để hỏi AI Doctor!</span>
                  </p>
                </div>

                {/* SEARCH RESULTS PALETTE (Visible when query is typed) */}
                {searchText.trim().length > 0 ? (
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono">
                    <div className="text-[10px] text-indigo-455 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>Kết quả tìm kiếm phù hợp ({filteredSearchItems.length})</span>
                    </div>

                    {filteredSearchItems.length > 0 ? (
                      <div className="space-y-1.5">
                        {filteredSearchItems.map((item, idx) => {
                          const isSelected = selectedIndex === idx;
                          return (
                            <div
                              key={item.id}
                              onClick={item.action}
                              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? theme === 'light'
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-indigo-950/40 border-indigo-500/40 shadow-md ring-1 ring-indigo-500/20'
                                  : theme === 'light'
                                    ? 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                    : 'bg-[#0a0c16]/50 border-slate-900 hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[12px] font-bold ${
                                  isSelected 
                                    ? theme === 'light' ? 'text-indigo-700' : 'text-indigo-300' 
                                    : theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                                }`}>
                                  {item.title}
                                </span>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-sans shrink-0 ${
                                  isSelected
                                    ? 'bg-indigo-500/10 border-indigo-505/35 text-indigo-400 font-extrabold'
                                    : 'bg-slate-500/10 border-transparent text-slate-500'
                                }`}>
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                              {isSelected && (
                                <div className="text-[8px] text-indigo-450 mt-1.5 flex items-center justify-end gap-1 font-bold">
                                  <span>Bấm ENTER để thực hiện</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          if (isAiEnabled) {
                            setActiveTab('live');
                            handleSendChat(searchText);
                          } else {
                            setActiveTab('offline');
                            handleSendOfflineQuestion('🔍 Câu hỏi thông dụng', searchText);
                          }
                          setSearchText('');
                        }}
                        className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
                          theme === 'light' 
                            ? 'bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border-slate-200' 
                            : 'bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 border-slate-800/80'
                        }`}
                      >
                        <Bot className="w-10 h-10 text-indigo-400 animate-bounce" />
                        <h4 className="text-xs font-bold text-slate-300">Không tìm thấy lệnh cài sẵn</h4>
                        <p className="text-[10px] text-slate-400 max-w-sm mt-0.5 leading-relaxed">
                          Nhấn <strong>Enter</strong> hoặc click vào đây để gửi trực tiếp cụm từ <code className="text-indigo-400">"{searchText}"</code> tới {isAiEnabled ? 'Bộ não AI Doctor' : 'Phao cứu hộ Offline Doctor'}!
                        </p>
                        <button className="mt-2 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                          <span>Gửi câu hỏi ngay</span>
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* NORMAL MESSAGES BLOCK CHAT (Visible when search is empty) */
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {activeTab === 'live' ? (
                        <>
                          {/* Live Chat Message Iteration loop */}
                          {messages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`flex flex-col max-w-[85%] ${
                                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mb-1">
                                <span>{msg.role === 'user' ? 'You' : 'Doctor AI'}</span>
                                <span>•</span>
                                <span>{msg.timestamp}</span>
                              </div>
                              <div className={`p-3 rounded-2xl text-[12px] leading-relaxed relative ${
                                msg.role === 'user'
                                  ? 'bg-indigo-600 text-white rounded-tr-none'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border border-slate-200 text-slate-850 rounded-tl-none font-sans'
                                    : 'bg-slate-900/80 border border-indigo-500/10 text-slate-200 rounded-tl-none font-sans shadow-md'
                              }`}>
                                <FormattedAiMessage content={msg.content} theme={theme} />
                              </div>
                            </div>
                          ))}

                          {/* Loading typing indicator emulation */}
                          {isLoading && (
                            <div className="flex flex-col items-start mr-auto max-w-[85%]">
                              <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono mb-1">
                                <Bot className="w-3 h-3 animate-spin text-indigo-400" />
                                <span>Doctor is analyzing...</span>
                              </div>
                              <div className={`p-3.5 rounded-2xl rounded-tl-none border ${
                                theme === 'light' 
                                  ? 'bg-slate-100 border-slate-200' 
                                  : 'bg-slate-900/60 border-indigo-500/10'
                              }`}>
                                <div className="flex gap-1 items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-150" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-300" />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Offline Chat Message Iteration loop */}
                          {offlineMessages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`flex flex-col max-w-[85%] ${
                                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mb-1">
                                <span>{msg.role === 'user' ? 'You' : 'Expert Bot'}</span>
                                <span>•</span>
                                <span>{msg.timestamp}</span>
                              </div>
                              <div className={`p-3 rounded-2xl text-[12.5px] leading-relaxed font-sans ${
                                msg.role === 'user'
                                  ? 'bg-indigo-650 text-white rounded-tr-none font-mono'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                              }`}>
                                <FormattedAiMessage content={msg.content} theme={theme} />
                              </div>
                            </div>
                          ))}

                          {/* Loading indicators for offline answers */}
                          {isOfflineLoading && (
                            <div className="flex flex-col items-start mr-auto">
                              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mb-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Analyzing clinical datasets...</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* QUICK SEED SHORTCUT CLOUD (At the bottom of messages before writing bar) */}
                    <div className={`p-3 border-t shrink-0 flex flex-col gap-1.5 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/40 border-slate-805'
                    }`}>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>Chẩn đoán đề xuất ({activeTab === 'live' ? 'Bảo trợ AI' : 'Offline'}):</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                        {activeTab === 'live' ? (
                          /* Suggestions using regular prompt flows */
                          quickMitigations.map((qm, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendChat(qm.query)}
                              className={`px-2 py-1 rounded text-[10px] font-mono leading-tight border transition-all cursor-pointer text-left ${
                                theme === 'light'
                                  ? 'bg-white hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700'
                                  : 'bg-[#0f111c]/80 hover:bg-indigo-950/40 border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-200'
                              }`}
                            >
                              🩺 {qm.title}
                            </button>
                          ))
                        ) : (
                          /* Suggestions using offline preset analysis */
                          offlineQuestions.map((oq) => (
                            <button
                              key={oq.id}
                              type="button"
                              onClick={() => handleSendOfflineQuestion(oq.title, oq.query, oq.answer)}
                              className={`px-2 py-1 rounded text-[10px] font-mono leading-tight border transition-all cursor-pointer text-left ${
                                theme === 'light'
                                  ? 'bg-white hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700'
                                  : 'bg-[#0e101b]/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white'
                              }`}
                            >
                              {oq.title}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Standard Message Bottom Sticky Input Bar */}
                    <div className={`p-3 border-t shrink-0 flex gap-2 items-center ${
                      theme === 'light' ? 'bg-white border-slate-150' : 'bg-slate-950 border-slate-800/80'
                    }`}>
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder={
                          activeTab === 'live' 
                            ? (isAiEnabled ? "Hỏi Trợ lý AI Doctor..." : "AI Tắt. Vui lòng hỏi ở ô Tìm Kiếm trên...")
                            : "Tra cứu ngoại tuyến với mã..."
                        }
                        disabled={activeTab === 'live' && !isAiEnabled}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-505 font-medium transition-all ${
                          theme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white'
                            : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-slate-755'
                        }`}
                      />
                      <button
                        onClick={() => {
                          if (activeTab === 'live') {
                            handleSendChat();
                          } else {
                            handleSendOfflineQuestion('🔍 Câu hỏi thông dụng', inputVal);
                            setInputVal('');
                          }
                        }}
                        disabled={(activeTab === 'live' && !isAiEnabled) || !inputVal.trim() || isLoading || isOfflineLoading}
                        className={`p-2 rounded-xl text-white transition-all cursor-pointer active:scale-95 duration-100 ${
                          !inputVal.trim() || isLoading || isOfflineLoading || (activeTab === 'live' && !isAiEnabled)
                            ? 'bg-slate-805/30 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg'
                        }`}
                        title="Gửi câu hỏi"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
