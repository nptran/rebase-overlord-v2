import React from 'react';
import { ConflictFile, TranslationTone } from '../../types';
import { getApiHeaders } from '../../utils/apiKeyHelper';

import { 
  CodeBlock, 
  ConflictBlockAnalysis, 
  parseConflictFile, 
  analyzeAndMergeConflictBlock, 
  getContentWithConflictMarkers 
} from '../../domain/merge/mergeModel';

interface UseConflictSolverProps {
  conflicts: ConflictFile[];
  tone: TranslationTone;
  isAiEnabled: boolean;
  onResolveFile: (filepath: string, resolvedContent: string) => void;
  onCompleteRecovery: () => void;
}

export function useConflictSolver({
  conflicts,
  tone,
  isAiEnabled,
  onResolveFile,
  onCompleteRecovery
}: UseConflictSolverProps) {
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

  const [blockChoices, setBlockChoices] = React.useState<Record<number, { left: 'pending' | 'accepted' | 'ignored'; right: 'pending' | 'accepted' | 'ignored' }>>({});
  const [blockAnalyses, setBlockAnalyses] = React.useState<Record<number, ConflictBlockAnalysis>>({});

  const [blockAiLoading, setBlockAiLoading] = React.useState<Record<number, boolean>>({});
  const [blockAiExplanations, setBlockAiExplanations] = React.useState<Record<number, string>>({});
  const [blockAiApplied, setBlockAiApplied] = React.useState<Record<number, boolean>>({});

  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<string | null>(null);
  const [aiProposedContent, setAiProposedContent] = React.useState<string | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [wasAiApplied, setWasAiApplied] = React.useState(false);

  const activeContent = React.useMemo(() => {
    if (!selectedFile) return '';
    return getContentWithConflictMarkers(selectedFile);
  }, [selectedFile]);

  const blocks = React.useMemo(() => {
    return parseConflictFile(activeContent);
  }, [activeContent]);

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
          if (state === 'ours') ours.add(line);
          else if (state === 'theirs') theirs.add(line);
          else common.add(line);
        }
      }
    }

    return { ours, theirs, common };
  }, [activeContent]);

  React.useEffect(() => {
    if (conflicts.length > 0 && (!selectedFile || !conflicts.some(c => c.filepath === selectedFile.filepath))) {
      setSelectedFile(conflicts[0]);
    }
  }, [conflicts, selectedFile]);

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
        if (customTexts[idx] !== undefined && customTexts[idx] !== '') {
          return customTexts[idx];
        }
        if (choice.left === 'accepted' && choice.right === 'accepted') {
          const order = orderRecord[idx];
          if (order === 'right') {
            return `${block.theirsText}\n${block.oursText}`;
          }
          return `${block.oursText}\n${block.theirsText}`;
        }
        if (choice.left === 'accepted') {
          return block.oursText;
        }
        if (choice.right === 'accepted') {
          return block.theirsText;
        }
        if (choice.left === 'ignored' && choice.right === 'ignored') {
          return '';
        }
        if (choice.left === 'ignored' && choice.right === 'pending') {
          return block.theirsText;
        }
        if (choice.right === 'ignored' && choice.left === 'pending') {
          return block.oursText;
        }
        return '';
      }
    }).join('\n');
  }, [blocks, acceptOrder]);

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
      return [
        ...prev.slice(-19),
        {
          blockChoices: JSON.parse(JSON.stringify(choices)),
          customBlockTexts: { ...customs },
          acceptOrder: { ...order },
          editorText: text
        }
      ];
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
          content: activeContent,
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

      const updatedChoices = { ...blockChoices };
      updatedChoices[bIdx] = { left: 'accepted', right: 'accepted' };
      setBlockChoices(updatedChoices);

      const updatedCustoms = { ...customBlockTexts };
      updatedCustoms[bIdx] = data.resolvedContent;
      setCustomBlockTexts(updatedCustoms);

      setBlockAiExplanations(prev => ({ ...prev, [bIdx]: data.explanation }));
      setBlockAiApplied(prev => ({ ...prev, [bIdx]: true }));

      setEditorText(getMergedContent(updatedChoices, updatedCustoms));
    } catch (err) {
      console.error("Failed to AI resolve block:", err);
    } finally {
      setBlockAiLoading(prev => ({ ...prev, [bIdx]: false }));
    }
  };

  const handleResolveSubmit = () => {
    if (!selectedFile) return;
    onResolveFile(selectedFile.filepath, editorText);

    const remainingUnresolved = conflicts.filter(
      c => c.filepath !== selectedFile.filepath && !c.isResolved
    );

    if (remainingUnresolved.length > 0) {
      setSelectedFile(remainingUnresolved[0]);
    } else {
      onCompleteRecovery();
    }
  };

  // Run on file transition/selection changes
  React.useEffect(() => {
    setStateLeftSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateRightSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));
    setStateResultSearch(prev => ({ ...prev, isOpen: false, query: '', activeIndex: 0 }));

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
            return '';
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
  }, [selectedFile, blocks]);

  // Hook global listeners
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

  return {
    selectedFile,
    setSelectedFile,
    editorText,
    setEditorText,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    setIsFullscreen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    editMode,
    setEditMode,
    customBlockTexts,
    setCustomBlockTexts,
    acceptOrder,
    setAcceptOrder,
    blockChoices,
    setBlockChoices,
    blockAnalyses,
    setBlockAnalyses,
    blockAiLoading,
    blockAiExplanations,
    blockAiApplied,
    isAiLoading,
    aiExplanation,
    setAiExplanation,
    aiProposedContent,
    setAiProposedContent,
    aiError,
    setAiError,
    wasAiApplied,
    setWasAiApplied,
    stateLeftSearch,
    setStateLeftSearch,
    stateRightSearch,
    setStateRightSearch,
    stateResultSearch,
    setStateResultSearch,
    activeContent,
    blocks,
    conflictAnalysis,
    getMergedContent,
    pushCurrentToHistory,
    handleUndo,
    handleResetSingleBlock,
    handleAiResolve,
    handleResolveBlockAi,
    handleResolveSubmit
  };
}
