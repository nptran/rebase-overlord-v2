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
  MessageSquare
} from 'lucide-react';
import { TranslationTone, GitRepoState } from '../types';
import { resolveApiUrl } from '../utils/apiResolver';

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
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
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
          <p key={index} className="whitespace-pre-wrap">
            {inlineParts.map((ip, ipIdx) => {
              if (ip.startsWith('`') && ip.endsWith('`')) {
                const codeNode = ip.slice(1, -1);
                return (
                  <code 
                    key={ipIdx} 
                    className={`mx-0.5 px-1 py-0.5 rounded font-mono text-xs font-semibold cursor-pointer select-all ${
                      theme === 'light'
                        ? 'bg-amber-100 border border-amber-200 text-amber-800'
                        : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
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
                      return <strong key={bpIndex} className="font-extrabold text-indigo-500 dark:text-indigo-400">{bp.slice(2, -2)}</strong>;
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
}

export default function AiDoctorFloatingChat({
  repoState,
  tone,
  isAiEnabled,
  onToggleAi,
  theme
}: AiDoctorFloatingChatProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isMaximized, setIsMaximized] = React.useState<boolean>(false);
  const [inputVal, setInputVal] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasNewResponse, setHasNewResponse] = React.useState<boolean>(false);

  // Initialize conversations
  const [messages, setMessages] = React.useState<Array<{ id: string; role: 'user' | 'model'; content: string; timestamp: string }>>([]);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

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
        title: tone === 'en_pro' ? 'Fix Detached HEAD' : 'Neo lại detached HEAD cứu hộ?',
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

    return list;
  }, [repoState, tone]);

  // Handle open greeting message based on active tone Persona
  React.useEffect(() => {
    if (messages.length === 0) {
      let greetText = "Xin chào! Tôi là Trợ lý Giáo sư AI Git Doctor. Trạng thái Git của bạn hiện đã được tự kết nối. Bạn vừa gặp sự cố, mất code hoặc có thắc mắc gì về quy trình Rebase?";
      if (tone === 'vn_joke') {
        greetText = "Chào ní yêu! 🩺 Bác Sĩ Git đã túc trực 24/7 đây. Nhánh rẽ, mất code, hay húc nhau tung toé gây xung đột à? Ní cứ ném hết vào đây em gầm rú gỡ tơ vò cho nhé!";
      } else if (tone === 'vn_toxic') {
        greetText = "Lại gây hoạ gây sập repo rồi bò vào đây ăn vạ đúng không? Thằng gà! Đã bảo rebase phải ngó trước sau rồi. Khai mau: bị mất code, bị conflict nát đầu hay lệch pha với remote? Tao ngó qua cứu mạng cho khôn ra nhá!";
      } else if (tone === 'en_pro') {
        greetText = "Greetings! I am your Git Overlord Solutions Advisor. I have auto-synced with your repository's context. Ask me anything about conflict resolution, diverged state, branch mismatches, or emergency reflog recovery!";
      }

      if (!isAiEnabled) {
        if (tone === 'vn_joke') {
          greetText += "\n\n*(Lưu ý nhẹ: Em đang chạy Offline bằng cơm vì sếp chưa bật AI trong Cài đặt á! Em sẽ dùng thuật chẩn đoán sơ cứu tĩnh siêu nhanh cho sếp nhé!)*";
        } else if (tone === 'vn_toxic') {
          greetText += "\n\n*(Lưu ý: Tắt AI rồi thì tao chỉ trả lời bằng phao sơ cứu offline được soạn sẵn thôi nhé thằng ngáo. Khôn hồn thì bật nút AI xanh lá ở Settings lên!)*";
        } else if (tone === 'en_pro') {
          greetText += "\n\n*(Please note: Since AI is disabled, I am operating in Offline first-aid mode. Responses will use structured static local diagnostic rules only.)*";
        } else {
          greetText += "\n\n*(Lưu ý: Bạn đang tắt Gemini AI. Doctor sẽ giải đáp nhanh dưới dạng các quy tắc sơ cứu / phao thông tin ngoại tuyến đã ghi nhớ.)*";
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
  }, [messages, isLoading]);

  const handleSendChat = async (customQuery?: string) => {
    const textToSend = (customQuery || inputVal).trim();
    if (!textToSend) return;

    if (!customQuery) {
      setInputVal('');
    }

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch(resolveApiUrl('/api/ai-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(msg => ({ role: msg.role, content: msg.content })),
          repoContext: repoState,
          tone: tone
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
          ? "⚠️ Sorry, there was an issue communicating with the Gemini engine. Please check your internet connection and active key settings in the secrets panel."
          : "⚠️ Xin lỗi sếp, em bị mất liên lạc tạm thời với máy chủ Oracle AI. Sếp vui lòng kiểm tra khoá GEMINI_API_KEY trong Cài đặt hoặc thử lại nha!",
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
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewResponse(false);
    }
  };

  return (
    <>
      {/* Floating Messenger Bubble Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {hasNewResponse && !isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`mb-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium shadow-xl border cursor-pointer ${
                theme === 'light' 
                  ? 'bg-indigo-600 text-white border-indigo-700' 
                  : 'bg-indigo-500 text-slate-900 border-indigo-400'
              }`}
              onClick={toggleOpen}
            >
              <div className="flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>AI Doctor Trả lời! Click xem</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="floating-ai-messenger-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleOpen}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center border transition-all cursor-pointer ${
            isOpen 
              ? 'bg-rose-500 border-rose-400 text-white' 
              : theme === 'light'
                ? 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white'
                : 'bg-[#10172a] hover:bg-indigo-950 border-indigo-500/50 text-indigo-400 hover:text-indigo-300'
          }`}
          title="Hỏi AI Doctor tư vấn cứu rỗi repository"
        >
          {/* Animated Glow effect (only if AI is enabled) */}
          {isAiEnabled && (
            <span className="absolute inset-0 rounded-full bg-indigo-500/25 animate-ping opacity-60"></span>
          )}
          
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              {/* Notifications marker indicating integrated context (green if active, grey if offline) */}
              <span className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border border-[#0f172a] transition-all duration-300 ${
                isAiEnabled ? 'bg-emerald-500' : 'bg-slate-500'
              }`} />
            </div>
          )}
        </motion.button>
      </div>

      {/* Floating Chat consultation Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-messenger-box"
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              x: 0,
              width: isMaximized ? 'calc(100vw - 3rem)' : '380px',
              height: isMaximized ? 'calc(100vh - 8rem)' : '550px',
              maxWidth: isMaximized ? '1200px' : '380px',
              maxHeight: isMaximized ? '850px' : '550px'
            }}
            exit={{ opacity: 0, scale: 0.85, y: 40, x: 10 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className={`fixed bottom-24 right-6 z-50 rounded-2xl shadow-3xl border flex flex-col overflow-hidden transition-all duration-150 ${
              theme === 'light' 
                ? 'bg-white border-slate-200 text-slate-800' 
                : 'bg-slate-950/95 border-indigo-500/30 backdrop-blur-md text-slate-100'
            }`}
          >
            {/* Header section styled elegantly */}
            <div className={`p-4 flex justify-between items-center border-b shrink-0 ${
              theme === 'light' ? 'bg-indigo-50/50 border-slate-100' : 'bg-slate-900 border-indigo-500/20'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${
                  theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>AI Git Doctor</span>
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isAiEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`} />
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
                      isAiEnabled 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                        : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    }`}>
                      {isAiEnabled ? 'ONLINE' : 'OFFLINE MODE'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {tone === 'vn_pro' && 'Trợ lý Kỹ sư Git chuẩn mực'}
                    {tone === 'vn_joke' && 'Bác sĩ Git gàn dở vô cùng vui tính'}
                    {tone === 'vn_toxic' && 'Gia sư sỉ nhục Git Master'}
                    {tone === 'en_pro' && 'Enterprise Solutions Consultant'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                {/* Clear local chat state option */}
                <button 
                  onClick={clearChatHistory}
                  className="p-1.5 rounded-lg hover:bg-slate-800/80 hover:text-slate-200 text-[10px] uppercase font-mono font-bold"
                  title="Xoá lịch sử hội thoại"
                >
                  Clear
                </button>

                {/* Maximum Size Handler */}
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 rounded-lg hover:bg-slate-800/80 hover:text-slate-200"
                  title={isMaximized ? "Thu nhỏ" : "Phóng to cửa sổ"}
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button 
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Git Real-time Context Banner inside AI Chat */}
            <div className={`px-4 py-2 border-b text-[10px] font-mono flex items-center justify-between shrink-0 ${
              theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-900/40 border-slate-800/80 text-indigo-400'
            }`}>
              <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                <GitBranch className="w-3 h-3 text-indigo-400 animate-pulse" />
                <span className="text-[9px] text-slate-400">Context:</span>
                <span className="truncate font-bold text-slate-200">{repoState.currentBranch || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 scale-[0.85] origin-right">
                {repoState.rebaseInProgress && (
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-500 px-1 py-0.5 rounded font-bold uppercase text-[8px] animate-pulse">
                    REBASE IN-PROGRESS
                  </span>
                )}
                {repoState.isDirty && (
                  <span className="bg-rose-500/20 border border-rose-500/30 text-rose-500 px-1 py-0.5 rounded font-bold uppercase text-[8px]">
                    DIRTY (Changes)
                  </span>
                )}
                {!repoState.rebaseInProgress && !repoState.isDirty && (
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 px-1 py-0.5 rounded font-bold uppercase text-[8px]">
                    HEALTHY
                  </span>
                )}
              </div>
            </div>

            {/* Warning banner indicating active offline rules diagnosis */}
            {!isAiEnabled && (
              <div className={`px-4 py-2 border-b text-[10px] font-mono flex items-center gap-2 shrink-0 ${
                theme === 'light' 
                  ? 'bg-amber-50 border-amber-250 text-amber-800' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                <span className="leading-tight">
                  {tone === 'en_pro'
                    ? "Offline mode active. Chat responses will be rule-based static diagnostics."
                    : "Đang ngoại tuyến. Bác sĩ hỗ trợ sơ cứu bằng Luật Tĩnh (Static Rules) & Dự đoán Offline."}
                </span>
              </div>
            )}

            {/* Live Interactive Advice Suggestion Deck */}
            <div className={`p-2 border-b flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none scroll-smooth ${
              theme === 'light' ? 'bg-indigo-50/10 border-slate-150' : 'bg-slate-900/10 border-slate-800/50'
            }`}>
              {quickMitigations.map((qm, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(qm.query)}
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold text-left shrink-0 transition-all ${
                    theme === 'light'
                      ? 'bg-white hover:bg-indigo-50 border-slate-200 text-indigo-600 hover:border-indigo-300'
                      : 'bg-[#0f172a]/60 hover:bg-slate-800 border-indigo-500/20 text-indigo-300 hover:border-indigo-400'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <LifeBuoy className="w-3 h-3 shrink-0 text-amber-400 animate-pulse" />
                    {qm.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Converged Dialogue Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs [scrollbar-width:thin]">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar for AI Doctor */}
                      {!isUser && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                          theme === 'light' 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Msg bubble container */}
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs ${
                        isUser 
                          ? 'bg-indigo-600 text-white !text-white rounded-br-none font-medium'
                          : theme === 'light'
                            ? 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                      }`}>
                        {/* If AI message, render our structured code copy-aware element */}
                        {isUser ? (
                          <div className="whitespace-pre-wrap leading-relaxed text-white !text-white font-medium">{msg.content}</div>
                        ) : (
                          <FormattedAiMessage content={msg.content} theme={theme} />
                        )}

                        {/* Timestamp helper code */}
                        <div className={`text-[8px] font-mono mt-1 text-right ${
                          isUser ? 'text-indigo-205 !text-indigo-200' : 'text-slate-500'
                        }`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing indicator simulator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    theme === 'light' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 border rounded-tl-none ${
                    theme === 'light' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wide">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider ml-1 animate-pulse">Doctor is diagnosing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form controls */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className={`p-3 border-t shrink-0 flex gap-2 items-center ${
                theme === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-slate-900/60 border-slate-800/80'
              }`}
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={tone === 'en_pro' ? "Ask AI Doctor (e.g. 'How to use reflog?')" : "Nhập câu hỏi (ví dụ: 'Cách dùng reflog để cứu code')..."}
                className={`flex-1 min-w-0 text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono ${
                  theme === 'light'
                    ? 'bg-white border-slate-250 text-slate-800 focus:border-indigo-400'
                    : 'bg-[#0f172a] border-slate-800 text-slate-200 focus:border-indigo-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                  inputVal.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    : 'bg-slate-800/50 text-slate-500 border border-slate-800/80 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
