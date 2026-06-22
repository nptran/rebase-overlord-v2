import React from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Sparkles, 
  Clock, 
  FileCode, 
  Check, 
  Eye, 
  EyeOff, 
  GitBranch, 
  ShieldAlert, 
  Volume2
} from 'lucide-react';
import { TranslationTone } from '../types';
import { resolveApiUrl } from '../utils/apiResolver';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  tone?: TranslationTone;
  onRefreshAutoFetch?: () => void;
}

// Full tone dictionary map to fulfill "Zero Hardcoded UI Text" across all user tones
const LOCALIZED_DICTS: Record<TranslationTone, Record<string, string>> = {
  [TranslationTone.ENGLISH]: {
    title: "Application & Engine Settings",
    subTitle: "Configure AI intelligence, automated git triggers, and Power BI/Tabular file analytics formats.",
    tabAi: "AI Oracle Config",
    tabGit: "Git Automation",
    tabFiles: "File Type Rules",
    apiKeyLabel: "Custom Gemini API Key",
    apiKeyDesc: "Enter your own Google Gemini API key to power advanced diagnostics. Overrides native pool limits.",
    keyPlaceholder: "AIzaSy...",
    modelLabel: "Preferred Model Framework",
    modelFlash: "Gemini 3.5/1.5 Flash (Default - Rapid & Light)",
    modelPro: "Gemini 1.5 Pro (Heavy Duty - Complex Conflict Synthesis)",
    fallbackBehaviorLabel: "Offline / Missing Key Behavior",
    fallbackWarn: "Alert & Warn (Prompt for key on actions)",
    fallbackSilent: "Silent Fallback (Strict offline local static rule checkers)",
    autoFetchToggle: "Enable Background Auto-Fetch",
    autoFetchDesc: "Periodically connects to origin remote to query ahead/behind metrics. Low cost background thread.",
    intervalLabel: "Auto-Fetch Sync Frequency",
    interval1m: "Every 1 Minute",
    interval5m: "Every 5 Minutes (Recommended)",
    interval15m: "Every 15 Minutes",
    interval30m: "Every 30 Minutes",
    autoStashToggle: "Auto-Stash Working Tree before Rebase",
    autoStashDesc: "Safely stashes uncommitted files before starting a rebase sequence, then restores them automatically.",
    customBaseBranchesLabel: "Configurable Base Branches List",
    customBaseBranchesDesc: "Comma-separated list of branch names allowed as base branches in the quick dropdown selector.",
    defaultBaseBranchLabel: "Default Base Branch",
    defaultBaseBranchDesc: "Standard base branch selected automatically when starting or resetting your git rebase workflow.",
    patternsLabel: "File Analysis Identifier Rules",
    patternsDesc: "List of files/extensions triggering Tabular & Power BI schema checks (e.g. lineageTag double checker).",
    patternsPlaceholder: "*.tmdl, report.json, *.pbix",
    saveBtn: "Save Configurations",
    savedText: "Saved Successfully!",
    doneBtn: "Close",
    brandTitle: "Data Analytics Context (DA/BI Team)",
    brandDesc: "* .tmdl: Double-validates Tabular model layouts & indent rules.\n* report.json: Validates visuals arrangement parameters.",
    flashHint: "Extremely rapid, cost-effective. Best for instant branch analysis or small block summaries.",
    proHint: "High-quality context reasoning. Excel at solving logic conflicts across huge source files."
  },
  [TranslationTone.PROFESSIONAL]: {
    title: "Cấu hình Ứng dụng & Engine",
    subTitle: "Thiết lập trí tuệ nhân tạo AI, cơ chế tự động hóa Git và định dạng tệp phân tích dữ liệu chuyên dụng.",
    tabAi: "Trí Tuệ Nhân Tạo AI",
    tabGit: "Tự Động Hóa Git",
    tabFiles: "Quy Tắc Định Dạng Tệp",
    apiKeyLabel: "Khóa API Gemini Cá Nhân",
    apiKeyDesc: "Hãy điền khóa Gemini của riêng sếp vào để kích hoạt chuẩn chỉnh mọi chẩn đoán thông thái, không lo bóp băng thông.",
    keyPlaceholder: "AIzaSy...",
    modelLabel: "Lựa chọn dòng mô hình Gemini",
    modelFlash: "Gemini 3.5 Flash (Mặc định - Phản hồi siêu tốc & kinh tế)",
    modelPro: "Gemini 1.5 Pro (Hạng nặng - Phù hợp gộp xung đột loằng ngoằng)",
    fallbackBehaviorLabel: "Cơ chế khi mất mạng hoặc thiếu API Key",
    fallbackWarn: "Cảnh báo & Phát âm thanh nhắc nhở lắp khóa",
    fallbackSilent: "Chạy ẩn dật offline (Chỉ dùng bộ quy tắc tĩnh cục bộ)",
    autoFetchToggle: "Kích hoạt Tự động Fetch Nắm bắt Chi Nhánh",
    autoFetchDesc: "Định kỳ kết nối lấy dữ liệu từ nhánh remote để cập nhật xem có bị tụt hậu (ahead/behind) hay không.",
    intervalLabel: "Tần suất đồng bộ hóa Auto-Fetch",
    interval1m: "Mỗi 1 Phút",
    interval5m: "Mỗi 5 Phút (Khuyên dùng)",
    interval15m: "Mỗi 15 Phút",
    interval30m: "Mỗi 30 Phút",
    autoStashToggle: "Tự động Cất Trữ dòng Code dở dang (Auto-Stash)",
    autoStashDesc: "Trước khi nén hay rebase, tự động gom file dang dở cất vào kho tủ ẩn (git stash), xong xuôi tự động lấy ra (stash pop) cực mượt.",
    customBaseBranchesLabel: "Danh sách các Base Branch khả thi",
    customBaseBranchesDesc: "Danh sách các nhánh (cách nhau bởi dấu phẩy) được phép xuất hiện tại menu chọn nhanh (ví dụ: develop, main, master).",
    defaultBaseBranchLabel: "Nhánh Base mặc định",
    defaultBaseBranchDesc: "Nhánh base mặc định được hệ thống tự động thiết lập làm nền tảng mỗi khi khởi chạy phiên làm việc.",
    patternsLabel: "Bộ quy tắc nhận diện File phân tích dữ liệu",
    patternsDesc: "Danh sách dạng regex/pattern để áp dụng bộ chuẩn đoán Power BI, Tabular (như tmdl, report.json, pbix).",
    patternsPlaceholder: "*.tmdl, report.json, *.pbix",
    saveBtn: "Lưu Cấu Hình Trọng Tâm",
    savedText: "Đã kích hoạt & lưu thành công!",
    doneBtn: "Hoàn Tất",
    brandTitle: "Bối cảnh Phân tích dữ liệu (DA/BI Team)",
    brandDesc: "* .tmdl: Tự động phân tích sâu lề Tabular Model & lineageTag trùng lặp.\n* report.json: Kiểm chuẩn cấu hình visual JSON của báo cáo Power BI.",
    flashHint: "Phần hồi mất chưa đầy 1 giây, cực kỳ nhẹ nhàng gãy gọn. Thích hợp cho nhu cầu rebase cơ bản hàng ngày.",
    proHint: "Đọc hiểu ngữ cảnh đỉnh cao, phù hợp gỡ rác git lịch sử cực lớn, hoặc gộp các dòng code khó của tệp cấu hình Power BI."
  },
  [TranslationTone.JOKE]: {
    title: "Văn Phòng Tổng Tham Mưu Rebase Overlord 🚀",
    subTitle: "Nơi sếp độ lại bộ não AI lỏ, tinh chỉnh dây cót Git chạy bằng cơm, và gỡ rối mấy cái file Power BI nhức nách.",
    tabAi: "Độ Não AI Oracle 🧠",
    tabGit: "Dây Cót Git Tự Động ⚙️",
    tabFiles: "Định Danh File Phân Tích 📂",
    apiKeyLabel: "Mã Khóa API Gemini Bí Mật Của Sếp",
    apiKeyDesc: "Dán cái API Key xịn của sếp vào đây để gánh tạ cả team. Không có key lấy đâu ra cơm sườn cho AI ăn mà đòi khôn!",
    keyPlaceholder: "AIzaThầnThánhNàoĐớ...",
    modelLabel: "Gia phả mô hình sếp tin tưởng",
    modelFlash: "Gemini 3.5 Flash (Phản hồi siêu tốc, lướt như gió, tiết kiệm pin)",
    modelPro: "Gemini 1.5 Pro (Hạng nặng đô, chuyên trị các ca xung đột lú não)",
    fallbackBehaviorLabel: "Sẽ làm trò gì khi khóa bỗng bay màu hoặc mất mạng?",
    fallbackWarn: "Gào thét inh ỏi báo sếp lắp khóa ngay",
    fallbackSilent: "Chạy âm thầm bằng cơm offline (Dùng phễu lọc lỗi tĩnh lỏ)",
    autoFetchToggle: "Cho phép Git rình mò nhánh Origin từ xa",
    autoFetchDesc: "Được bật là nó sẽ thi thoảng rón rén đi ngó xem code sếp có bị thụt lại phía sau thiên hạ hay khum.",
    intervalLabel: "Nhịp độ tò mò thăm dò Origin",
    interval1m: "Cứ 1 phút nghía 1 lần (Nóng vội thế)",
    interval5m: "Mỗi 5 phút dòm một phát (Thiền định vừa đủ)",
    interval15m: "15 phút nhìn một lần (Thong thả uống trà)",
    interval30m: "Nửa tiếng mới nhúc nhích (Mạng lag lắm sếp)",
    autoStashToggle: "Auto-Stash trước khi múa Rebase có biến",
    autoStashDesc: "Trước khi nhào lộn lịch sử, tự động nhét code sếp đang viết dở vào két sắtt bí mật, rebase xong tự vung tiền trả mượt mà.",
    customBaseBranchesLabel: "Hội đồng các Nhánh Base tối cao",
    customBaseBranchesDesc: "Trưng dụng những nhánh này làm bệ đỡ chính. Ngon ăn thì gõ dấu phẩy phân tách sếp nhé.",
    defaultBaseBranchLabel: "Nhánh Base chân ái",
    defaultBaseBranchDesc: "Vừa mở app phát là tự động ôm khư khư nhánh này làm móng nhà, đéo cần sếp tốn một calo chuột chọn lại.",
    patternsLabel: "Bộ lọc tệp phân tích siêu to khổng lồ",
    patternsDesc: "Tệp nào chứa đuôi này sẽ được các điệp viên quét sạch từ lineageTag đến lề lối Tabular.",
    patternsPlaceholder: "*.tmdl, report.json, *.pbix",
    saveBtn: "Kích Hoạt Pháp Thuật ✨",
    savedText: "Lưu xong rồi ní ơi! AI đã thông thái hơn!",
    doneBtn: "Tắt Thôi Sếp",
    brandTitle: "Hội những người cuồng DA (Power BI / Tabular Team)",
    brandDesc: "* .tmdl: Quét sạch mọi lỗi tmdl râu ria, so chuẩn lề lối Tabular.\n* report.json: Dọn rác visual JSON, làm đẹp sơ đồ quan hệ để sếp lấy lòng sếp tổng!",
    flashHint: "Lướt mượt cực độ, chưa đầy 1 giây đã nhả chữ xong xuôi sạch sẽ cho sếp thảnh thơi.",
    proHint: "Thần y gỡ rối, giải quyết hết các ca quằn quại cấu trúc Power BI phức tạp nhất."
  },
  [TranslationTone.TOXIC]: {
    title: "Bảng Điều Khiển Cho Thằng Lười Thích Ngự Trị 💀",
    subTitle: "Cấu hình cái API Key với lề thói Git tự động đi, chứ mỗi lần lỗi lại réo tao rát cả tai mệt vcl.",
    tabAi: "Não AI (Đừng cài key lỏ) 🧠",
    tabGit: "Git Tự Động (Đỡ dùng tay) ⚙️",
    tabFiles: "Đuôi File Hành Xác 📂",
    apiKeyLabel: "Dán Khóa API Gemini Vào Mau",
    apiKeyDesc: "Éo dán API Key xịn thì dùng bản lỏ bị giới hạn ráng chịu, lúc đấy đừng có gào lên lỗi này lỗi nọ do AI lú nhé thèn ranh.",
    keyPlaceholder: "AIzaCútNgayĐi...",
    modelLabel: "Bộ óc mày muốn tao dùng",
    modelFlash: "Gemini 3.5 Flash (Chạy nhanh như chó đuổi, nhẹ ví)",
    modelPro: "Gemini 1.5 Pro (Đọc hiểu sâu xa, chuyên gỡ đống nợ của mày)",
    fallbackBehaviorLabel: "Trò hề khi mất mạng hoặc thiếu API Key?",
    fallbackWarn: "Gầm rú bắt mày dán API Key cho bằng được",
    fallbackSilent: "Chạy offline câm lặng (Éo thèm khôn nữa, lỗi đừng khóc)",
    autoFetchToggle: "Éo cần click, tự Fetch xa liên tục",
    autoFetchDesc: "Tự động gửi tín hiệu rình rập remote xem mày bị thiên hạ bỏ xa bao nhiêu dặm đường rồi.",
    intervalLabel: "Tần suất đi hóng hớt",
    interval1m: "Cứ 1 phút lượn 1 vòng (Hóng hớt kinh vc)",
    interval5m: "5 phút hóng một lần (Tạm ổn)",
    interval15m: "15 phút ngó một cái (Mạng chậm hay gì)",
    interval30m: "Bao giờ ngủ dậy thì ngó (Quá lười)",
    autoStashToggle: "Auto-Stash giấu code bẩn bựa",
    autoStashDesc: "Trước khi rebase phá hoại, tự động cất code đang code dở bảo toàn tính mạng, rebase xong lôi ra lại.",
    customBaseBranchesLabel: "Mấy nhánh Base mày hay xài",
    customBaseBranchesDesc: "Ngăn cách bằng dấu phẩy đi con chiên ngoan đạo. Gõ sai đíu chạy ráng chịu.",
    defaultBaseBranchLabel: "Nhánh Base ruột",
    defaultBaseBranchDesc: "Găm sẵn vào đầu máy làm mặc định từ đầu, khỏi mắc công khóc lóc gõ nhầm nhánh rồi nén đè tùm lum.",
    patternsLabel: "Đống định dạng tệp hành xác",
    patternsDesc: "Tmdl hay json hay pbix dột nát, nhập vào đây tao quét cho rách việc.",
    patternsPlaceholder: "*.tmdl, report.json, *.pbix",
    saveBtn: "Lưu Lẹ Đi Tao Đợi 🤬",
    savedText: "Lưu xong rồi đấy, bớt phá hoại đi!",
    doneBtn: "Lượn Mắt",
    brandTitle: "Chi bộ DA/BI khổ nạn tột cùng",
    brandDesc: "* .tmdl: Phanh phui mọi vụ nhân bản lineageTag giả dối, soi lề dột nát của mày.\n* report.json: Rà soát đống rác visual JSON ngu ngơ của lũ khóc mướn.",
    flashHint: "Tốc độ bàn thờ, éo tốn tiền, thích hợp cho lũ lười hối hả.",
    proHint: "Bác học nghiên cứu, ăn xong tháo gỡ cực nhọc đống rác mà cả team mày ỉa ra."
  }
};

export default function SettingsModal({
  isOpen,
  onClose,
  theme = 'dark',
  tone = TranslationTone.PROFESSIONAL,
  onRefreshAutoFetch
}: SettingsModalProps) {
  // Config states loaded from localStorage
  const [apiKey, setApiKey] = React.useState('');
  const [model, setModel] = React.useState('gemini-3.5-flash');
  const [fallbackMode, setFallbackMode] = React.useState('wait_api');
  const [autoFetchEnabled, setAutoFetchEnabled] = React.useState(true);
  const [autoFetchInterval, setAutoFetchInterval] = React.useState(300);
  const [autoStash, setAutoStash] = React.useState(true);
  const [filePatterns, setFilePatterns] = React.useState('*.tmdl, report.json, *.pbix');
  const [customBaseBranches, setCustomBaseBranches] = React.useState('develop, main, master, dev, test');
  const [defaultBaseBranch, setDefaultBaseBranch] = React.useState('develop');

  // Interactive local states
  const [showKey, setShowKey] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saved' | 'validating'>('idle');
  const [activeTab, setActiveTab] = React.useState<'ai' | 'git' | 'files'>('ai');

  // Key validation status
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = React.useState(false);

  // Load configuration on mount
  React.useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('gemini_api_key') || '');
      setModel(localStorage.getItem('gemini_model') || 'gemini-3.5-flash');
      setFallbackMode(localStorage.getItem('fallback_offline_mode') || 'wait_api');
      
      const savedFetchedEnabled = localStorage.getItem('auto_fetch_enabled');
      setAutoFetchEnabled(savedFetchedEnabled !== 'false');
      
      const savedInterval = localStorage.getItem('auto_fetch_interval');
      setAutoFetchInterval(savedInterval ? parseInt(savedInterval, 10) : 300);
      
      const savedStash = localStorage.getItem('auto_stash_before_rebase');
      setAutoStash(savedStash !== 'false');

      setFilePatterns(localStorage.getItem('file_type_patterns') || '*.tmdl, report.json, *.pbix');
      setCustomBaseBranches(localStorage.getItem('custom_base_branches_list') || 'develop, main, master, dev, test');
      setDefaultBaseBranch(localStorage.getItem('default_base_branch') || 'develop');
      setSaveStatus('idle');
      setValidationError(null);
      setValidationSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Single function to verify the specified key
  const handleVerifyKey = async (customKey?: string): Promise<boolean> => {
    const keyToTest = (customKey !== undefined ? customKey : apiKey).trim();
    if (!keyToTest) {
      setValidationError(
        tone === TranslationTone.ENGLISH
          ? 'API Key cannot be empty.'
          : tone === TranslationTone.JOKE
            ? 'Mã API Key trống rỗng à ní ơi! Thêm key chuẩn vào đi!'
            : tone === TranslationTone.TOXIC
              ? 'Mày đùa tao à? Điền API Key vào rồi mới bắt tao check chứ!'
              : 'Hãy nhập API Key để bắt đầu xác thực.'
      );
      setValidationSuccess(false);
      return false;
    }

    setIsValidating(true);
    setValidationError(null);
    setValidationSuccess(false);

    try {
      const response = await fetch(resolveApiUrl('/api/validate-api-key'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      if (data.valid) {
        setValidationSuccess(true);
        setValidationError(null);
        return true;
      } else {
        setValidationError(data.error || 'API Key validation failed.');
        setValidationSuccess(false);
        return false;
      }
    } catch (err: any) {
      setValidationError(
        tone === TranslationTone.ENGLISH
          ? `Connection error: ${err.message || err}`
          : tone === TranslationTone.JOKE
            ? `Ôi thôi mất mạng hay sập server rồi: ${err.message || err}`
            : tone === TranslationTone.TOXIC
              ? `Lỗi kết nối rồi cưng à: ${err.message || err}`
              : `Lỗi kết nối xác thực: ${err.message || err}`
      );
      setValidationSuccess(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Save specific parameters safely
  const handleSaveAll = async () => {
    const originalKey = localStorage.getItem('gemini_api_key') || '';
    const trimmedNewKey = apiKey.trim();

    // If API Key changed and is not empty, validate first
    if (trimmedNewKey !== originalKey && trimmedNewKey !== '') {
      setSaveStatus('validating');
      const isValid = await handleVerifyKey(trimmedNewKey);
      if (!isValid) {
        setSaveStatus('idle');
        return; // Halt and show error to keep existing AI setup offline and safe
      }
    }

    // Save configuration settings
    localStorage.setItem('gemini_api_key', trimmedNewKey);
    localStorage.setItem('gemini_model', model);
    localStorage.setItem('fallback_offline_mode', fallbackMode);
    localStorage.setItem('auto_fetch_enabled', autoFetchEnabled ? 'true' : 'false');
    localStorage.setItem('auto_fetch_interval', autoFetchInterval.toString());
    localStorage.setItem('auto_stash_before_rebase', autoStash ? 'true' : 'false');
    localStorage.setItem('file_type_patterns', filePatterns.trim());
    localStorage.setItem('custom_base_branches_list', customBaseBranches.trim());
    localStorage.setItem('default_base_branch', defaultBaseBranch.trim());

    setSaveStatus('saved');
    if (onRefreshAutoFetch) {
      onRefreshAutoFetch();
    }
    setTimeout(() => {
      setSaveStatus('idle');
    }, 1500);
  };

  // Get active translation dictionary based on selected tone with absolute Vietnamese/English tone compliance
  const loc = LOCALIZED_DICTS[tone] || LOCALIZED_DICTS[TranslationTone.PROFESSIONAL];

  return (
    <div 
      id="settings-modal-backdrop"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay backdrop */}
      <div 
        id="settings-modal-overlay"
        onClick={onClose} 
        className={`absolute inset-0 transition-opacity backdrop-blur-sm ${
          theme === 'light' ? 'bg-[#1e293b]/40' : 'bg-[#000000]/70'
        }`}
      />

      {/* Modal Main container */}
      <div 
        id="settings-modal-card"
        className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden transition-all duration-300 scale-100 flex flex-col ${
          theme === 'light' 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-[#0f111a] border-slate-800/80 text-slate-100'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header Bar */}
        <div 
          id="settings-modal-header"
          className={`flex items-center justify-between p-4 border-b ${
            theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-[#121522]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${
              theme === 'light' ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-505/10 text-indigo-400'
            }`}>
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">{loc.title}</h2>
              <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 max-w-md hidden sm:block">
                {loc.subTitle}
              </p>
            </div>
          </div>
          <button 
            id="settings-close-modal-header-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'light' ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400 font-bold'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div 
          id="settings-modal-tabs"
          className={`flex border-b px-4 ${
            theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-[#101320]'
          }`}
        >
          <button
            id="settings-tab-ai-btn"
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-indigo-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            {loc.tabAi}
          </button>
          <button
            id="settings-tab-git-btn"
            onClick={() => setActiveTab('git')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'git'
                ? 'border-indigo-500 text-indigo-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            {loc.tabGit}
          </button>
          <button
            id="settings-tab-files-btn"
            onClick={() => setActiveTab('files')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'files'
                ? 'border-indigo-500 text-indigo-500'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            {loc.tabFiles}
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div 
          id="settings-modal-body"
          className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin"
        >
          
          {/* Tab 1: AI Config */}
          {activeTab === 'ai' && (
            <div id="settings-panel-ai" className="space-y-4">
              {/* API Key management */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  {loc.apiKeyLabel}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="settings-api-key-input"
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setValidationSuccess(false);
                        setValidationError(null);
                      }}
                      placeholder={loc.keyPlaceholder}
                      className={`w-full px-3 py-2 pr-10 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                        validationError
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : validationSuccess
                            ? 'border-emerald-500 focus:ring-emerald-500 focus:border-emerald-500'
                            : theme === 'light'
                              ? 'bg-slate-50 border-slate-250 text-slate-900 focus:ring-indigo-600 focus:border-indigo-600'
                              : 'bg-slate-900/40 border-slate-800 text-slate-100 focus:ring-indigo-505 focus:border-indigo-505'
                      }`}
                    />
                    <button
                      id="settings-toggle-key-visibility-btn"
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    id="settings-api-key-verify-btn"
                    type="button"
                    onClick={() => handleVerifyKey()}
                    disabled={isValidating}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer select-none transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                      isValidating ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      validationSuccess
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        : theme === 'light'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                          : 'bg-[#1e293b] border-slate-800 text-indigo-400 hover:text-indigo-300'
                    }`}
                  >
                    {isValidating ? (
                      <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0"></span>
                    ) : validationSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    )}
                    {tone === TranslationTone.ENGLISH ? 'Verify' : 'Xác thực'}
                  </button>
                </div>
                {validationError && (
                  <p id="settings-api-key-error-msg" className="text-[11px] text-red-500 font-medium">
                    ⚠️ {validationError}
                  </p>
                )}
                {validationSuccess && (
                  <p id="settings-api-key-success-msg" className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {tone === TranslationTone.ENGLISH 
                      ? 'Valid API Key! AI features are fully ready.' 
                      : tone === TranslationTone.JOKE
                        ? 'API Key quá chuẩn ní ơi! AI hoạt động banh nóc rồi hén!'
                        : tone === TranslationTone.TOXIC
                          ? 'Key chuẩn đấy con chiên, AI đã hoạt động rồi, ngon nghẻ!'
                          : 'API Key hợp lệ! Toàn bộ tính năng AI đã sẵn sàng.'}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 italic">
                  {loc.apiKeyDesc}
                </p>
              </div>

              {/* Model Choice */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  {loc.modelLabel}
                </label>
                <select
                  id="settings-model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-250 text-slate-900 focus:ring-indigo-600'
                      : 'bg-indigo-950/20 border-slate-800 text-slate-100 focus:ring-indigo-505'
                  }`}
                >
                  <option value="gemini-3.5-flash" className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.modelFlash}</option>
                  <option value="gemini-1.5-pro" className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.modelPro}</option>
                </select>
                <div className={`p-3 rounded-lg border text-[10.5px] leading-relaxed flex items-start gap-1.5 ${
                  theme === 'light' 
                    ? 'bg-indigo-50 bg-opacity-35 border-indigo-100 text-indigo-900' 
                    : 'bg-[#151722] border-indigo-500/10 text-slate-300'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    {model === 'gemini-3.5-flash' ? (
                      <div>
                        <strong>{model === 'gemini-3.5-flash' ? 'Gemini 3.5 Flash' : 'AI Engine'}</strong>: {loc.flashHint}
                      </div>
                    ) : (
                      <div>
                        <strong>Gemini 1.5 Pro</strong>: {loc.proHint}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Offline fallback behavior */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  {loc.fallbackBehaviorLabel}
                </label>
                <select
                  id="settings-fallback-select"
                  value={fallbackMode}
                  onChange={(e) => setFallbackMode(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-250 text-slate-900'
                      : 'bg-indigo-950/20 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="wait_api" className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.fallbackWarn}</option>
                  <option value="strict_offline" className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.fallbackSilent}</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab 2: Git Settings */}
          {activeTab === 'git' && (
            <div id="settings-panel-git" className="space-y-5 text-left">
              {/* Background Auto-fetch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {loc.autoFetchToggle}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {loc.autoFetchDesc}
                    </p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      id="checkbox-auto-fetch-toggle"
                      type="checkbox"
                      checked={autoFetchEnabled}
                      onChange={(e) => setAutoFetchEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                </div>

                {autoFetchEnabled && (
                  <div className="pl-5 space-y-1.5 mt-2 transition-all">
                    <label className="text-[11px] font-medium text-slate-400">
                      {loc.intervalLabel}
                    </label>
                    <select
                      id="settings-auto-fetch-interval-select"
                      value={autoFetchInterval}
                      onChange={(e) => setAutoFetchInterval(parseInt(e.target.value, 10))}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-250 text-slate-900'
                          : 'bg-indigo-950/20 border-slate-800 text-slate-100'
                      }`}
                    >
                      <option value={60} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.interval1m}</option>
                      <option value={300} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.interval5m}</option>
                      <option value={900} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.interval15m}</option>
                      <option value={1800} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{loc.interval30m}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Automatic Stash toggle */}
              <div className="flex items-center justify-between border-t border-slate-850 pt-4">
                <div className="pr-3">
                  <label className="text-xs font-semibold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    {loc.autoStashToggle}
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {loc.autoStashDesc}
                  </p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="checkbox-auto-stash-toggle"
                    type="checkbox"
                    checked={autoStash}
                    onChange={(e) => setAutoStash(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </div>

              {/* Base Branches List Configuration */}
              <div className="border-t border-slate-850 pt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                    {loc.customBaseBranchesLabel}
                  </label>
                  <input
                    id="settings-custom-base-branches-input"
                    type="text"
                    value={customBaseBranches}
                    onChange={(e) => setCustomBaseBranches(e.target.value)}
                    placeholder="develop, main, master, dev"
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-250 text-slate-900 focus:ring-indigo-600 focus:border-indigo-600'
                        : 'bg-slate-900/40 border-slate-800 text-slate-100 focus:ring-indigo-505 focus:border-indigo-505'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">
                    {loc.customBaseBranchesDesc}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {loc.defaultBaseBranchLabel}
                  </label>
                  <select
                    id="settings-default-base-branch-select"
                    value={defaultBaseBranch}
                    onChange={(e) => setDefaultBaseBranch(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-250 text-slate-900'
                        : 'bg-indigo-950/20 border-slate-800 text-slate-100'
                    }`}
                  >
                    {customBaseBranches
                      .split(',')
                      .map(b => b.trim())
                      .filter(Boolean)
                      .map(b => (
                        <option key={b} value={b} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{b}</option>
                      ))
                    }
                    {/* fallback safeguard if the default is user-entered but not in list yet */}
                    {!customBaseBranches.split(',').map(b => b.trim()).filter(Boolean).includes(defaultBaseBranch) && (
                      <option value={defaultBaseBranch} className={theme === 'light' ? 'text-slate-900 bg-white' : 'text-slate-100 bg-[#0f111a]'}>{defaultBaseBranch}</option>
                    )}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    {loc.defaultBaseBranchDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: File patterns */}
          {activeTab === 'files' && (
            <div id="settings-panel-files" className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  {loc.patternsLabel}
                </label>
                <input
                  id="settings-file-patterns-input"
                  type="text"
                  value={filePatterns}
                  onChange={(e) => setFilePatterns(e.target.value)}
                  placeholder={loc.patternsPlaceholder}
                  className={`w-full px-3 py-2 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-250 text-slate-900 focus:ring-indigo-600 focus:border-indigo-600'
                      : 'bg-slate-900/40 border-slate-800 text-slate-100 focus:ring-indigo-505 focus:border-indigo-505'
                  }`}
                />
                <p className="text-[10px] text-slate-400 italic mt-1 leading-relaxed">
                  {loc.patternsDesc}
                </p>
              </div>

              <div className={`p-4 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2.5 ${
                theme === 'light' 
                  ? 'bg-emerald-50 bg-opacity-35 border-emerald-100 text-emerald-900' 
                  : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-300'
              }`}>
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs block mb-1">{loc.brandTitle}</strong>
                  <div className="space-y-1 font-mono text-[10px] opacity-90 leading-normal whitespace-pre-line">
                    {loc.brandDesc}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions bar */}
        <div 
          id="settings-modal-footer"
          className={`p-4 border-t flex items-center justify-between ${
            theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-[#121522]'
          }`}
        >
          <div className="flex items-center">
            {saveStatus === 'saved' && (
              <span id="settings-save-success-indicator" className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                {loc.savedText}
              </span>
            )}
            {saveStatus === 'validating' && (
              <span id="settings-save-validating-indicator" className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                {tone === TranslationTone.ENGLISH 
                  ? 'Verifying API Key...' 
                  : tone === TranslationTone.JOKE 
                    ? 'Đang check thử xem key thật hay giả...' 
                    : tone === TranslationTone.TOXIC 
                      ? 'Nín thở đợi tao check xem key chuẩn chưa...' 
                      : 'Đang xác thực API Key...'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              id="settings-save-config-btn"
              disabled={saveStatus === 'validating'}
              onClick={handleSaveAll}
              className={`px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer active:scale-95 ${
                saveStatus === 'validating' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saveStatus === 'validating' 
                ? (tone === TranslationTone.ENGLISH ? 'Verifying...' : 'Đang kiểm tra...') 
                : loc.saveBtn}
            </button>
            <button
              id="settings-close-modal-btn"
              onClick={onClose}
              className={`px-4 py-1.5 border font-semibold rounded-lg text-xs transition-all cursor-pointer active:scale-95 ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {loc.doneBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

