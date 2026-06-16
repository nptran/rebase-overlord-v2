import React from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  FileCode, 
  Sliders, 
  Check, 
  Eye, 
  EyeOff, 
  GitBranch, 
  ShieldAlert, 
  Database,
  Volume2
} from 'lucide-react';
import { TranslationTone } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  tone?: TranslationTone;
  onRefreshAutoFetch?: () => void;
}

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
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saved'>('idle');
  const [activeTab, setActiveTab] = React.useState<'ai' | 'git' | 'files'>('ai');

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
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Save specific parameters safely
  const handleSaveAll = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
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

  // Localizations based on tone
  const isEn = tone === TranslationTone.ENGLISH;
  const isToxic = tone === TranslationTone.TOXIC;
  const isJoke = tone === TranslationTone.JOKE;

  const loc = {
    title: isEn ? "Application & Engine Settings" : "Cấu hình Ứng dụng & Engine",
    subTitle: isEn ? "Configure AI intelligence, automated git triggers, and Power BI/Tabular file analytics formats." : "Thiết lập trí tuệ nhân tạo AI, cơ chế tự động hóa Git và định dạng tệp phân tích dữ liệu chuyên dụng.",
    tabAi: isEn ? "AI Oracle Config" : "Trí Tuệ Nhân Tạo AI",
    tabGit: isEn ? "Git Automation" : "Tự Động Hóa Git",
    tabFiles: isEn ? "File Type Rules" : "Quy Tắc Định Dạng Tệp",
    
    // AI Section
    apiKeyLabel: isEn ? "Custom Gemini API Key" : "Khóa API Gemini Cá Nhân",
    apiKeyDesc: isEn 
      ? "Enter your own Google Gemini API key to power advanced diagnostics. Overrides native pool limits." 
      : "Hãy điền khóa Gemini của riêng sếp vào để kích hoạt chuẩn chỉnh mọi chẩn đoán thông thái, không lo bóp băng thông.",
    keyPlaceholder: "AIzaSy...",
    modelLabel: isEn ? "Preferred Model Framework" : "Lựa chọn dòng mô hình Gemini",
    modelFlash: isEn ? "Gemini 2.5/1.5 Flash (Default - Rapid & Light)" : "Gemini 3.5 Flash (Mặc định - Phản hồi siêu tốc & kinh tế)",
    modelPro: isEn ? "Gemini 1.5 Pro (Heavy Duty - Complex Conflict Synthesis)" : "Gemini 1.5 Pro (Hạng nặng - Phù hợp gộp xung đột loằng ngoằng)",
    fallbackBehaviorLabel: isEn ? "Offline / Missing Key Behavior" : "Cơ chế khi mất mạng hoặc thiếu API Key",
    fallbackWarn: isEn ? "Alert & Warn (Prompt for key on actions)" : "Cảnh báo & Phát âm thanh nhắc nhở lắp khóa",
    fallbackSilent: isEn ? "Silent Fallback (Strict offline local static rule checkers)" : "Chạy ẩn dật offline (Chỉ dùng bộ quy tắc tĩnh cục bộ)",

    // Git section
    autoFetchToggle: isEn ? "Enable Background Auto-Fetch" : "Kích hoạt Tự động Fetch Nắm bắt Chi Nhánh",
    autoFetchDesc: isEn 
      ? "Periodically connects to origin remote to query ahead/behind metrics. Low cost background thread." 
      : "Định kỳ kết nối lấy dữ liệu từ nhánh remote để cập nhật xem có bị tụt hậu (ahead/behind) hay không.",
    intervalLabel: isEn ? "Auto-Fetch Sync Frequency" : "Tần suất đồng bộ hóa Auto-Fetch",
    interval1m: isEn ? "Every 1 Minute" : "Mỗi 1 Phút",
    interval5m: isEn ? "Every 5 Minutes (Recommended)" : "Mỗi 5 Phút (Khuyên dùng)",
    interval15m: isEn ? "Every 15 Minutes" : "Mỗi 15 Phút",
    interval30m: isEn ? "Every 30 Minutes" : "Mỗi 30 Phút",
    autoStashToggle: isEn ? "Auto-Stash Working Tree before Rebase" : "Tự động Cất Trữ dòng Code dở dang (Auto-Stash)",
    autoStashDesc: isEn 
      ? "Safely stashes uncommitted files before starting a rebase sequence, then restores them automatically." 
      : "Trước khi nén hay rebase, tự động gom file dang dở cất vào kho tủ ẩn (git stash), xong xuôi tự động lấy ra (stash pop) cực mượt.",
    customBaseBranchesLabel: isEn ? "Configurable Base Branches List" : "Danh sách các Base Branch khả thi",
    customBaseBranchesDesc: isEn 
      ? "Comma-separated list of branch names allowed as base branches in the quick dropdown selector." 
      : "Danh sách các nhánh (cách nhau bởi dấu phẩy) được phép xuất hiện tại menu chọn nhanh (ví dụ: develop, main, master).",
    defaultBaseBranchLabel: isEn ? "Default Base Branch" : "Nhánh Base mặc định",
    defaultBaseBranchDesc: isEn 
      ? "Standard base branch selected automatically when starting or resetting your git rebase workflow." 
      : "Nhánh base mặc định được hệ thống tự động thiết lập làm nền tảng mỗi khi khởi chạy phiên làm việc.",

    // File patterns section
    patternsLabel: isEn ? "File Analysis Identifier Rules" : "Bộ quy tắc nhận diện File phân tích dữ liệu",
    patternsDesc: isEn 
      ? "List of files/extensions triggering Tabular & Power BI schema checks (e.g. lineageTag double checker)." 
      : "Danh sách regex/pattern đặc chủng để áp dụng bộ chuẩn đoán Power BI, Tabular (như tmdl, report.json, pbix).",
    patternsPlaceholder: "*.tmdl, report.json, *.pbix",
    saveBtn: isEn ? "Save Configurations" : "Lưu Cấu Hình Trọng Tâm",
    savedText: isEn ? "Saved Successfully!" : "Đã kích hoạt & lưu thành công!",
    doneBtn: isEn ? "Close" : "Hoàn Tất"
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Overlay backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Main container */}
      <div 
        className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden transition-all duration-300 scale-100 flex flex-col ${
          theme === 'light' 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-[#0f111a] border-slate-800 text-slate-100'
        }`}
        style={{ maxHeight: '85vh' }}
        id="app-settings-modal-panel"
      >
        {/* Header Bar */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-800 bg-[#121522]'
        }`}>
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
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'light' ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-4 ${
          theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-[#101320]'
        }`}>
          <button
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Tab 1: AI Config */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {/* API Key management */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-violet-400" />
                  {loc.apiKeyLabel}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={loc.keyPlaceholder}
                    className={`w-full px-3 py-2 pr-10 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 text-slate-100 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-900/60 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="gemini-3.5-flash">{loc.modelFlash}</option>
                  <option value="gemini-1.5-pro">{loc.modelPro}</option>
                </select>
                <div className={`p-2.5 rounded-lg border text-[10px] leading-relaxed flex items-start gap-1.5 ${
                  theme === 'light' 
                    ? 'bg-indigo-50 bg-opacity-30 border-indigo-100 text-indigo-800' 
                    : 'bg-[#151722] border-indigo-500/10 text-slate-300'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    {model === 'gemini-3.5-flash' ? (
                      <div>
                        <strong>{isEn ? "Gemini 3.5 Flash" : "Khuyên dùng (Gemini 3.5 Flash)"}</strong>: 
                        {isEn 
                          ? " Extremely rapid, cost-effective. Best for instant branch analysis or small block summaries."
                          : " Phản hồi mất chưa đầy 1 giây, cực kỳ nhẹ nhàng gãy gọn. Thích hợp cho nhu cầu rebase cơ bản hàng ngày."}
                      </div>
                    ) : (
                      <div>
                        <strong>{isEn ? "Gemini 1.5 Pro" : "Nâng cao (Gemini 1.5 Pro)"}</strong>: 
                        {isEn 
                          ? " High-quality context reasoning. Excel at solving logic conflicts across huge source files or reflog salvages."
                          : " Đọc hiểu ngữ cảnh đỉnh cao, phù hợp gỡ rác git lịch sử cực lớn, hoặc gộp các dòng code khó của tệp cấu hình Power BI."}
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
                  value={fallbackMode}
                  onChange={(e) => setFallbackMode(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-900/60 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="wait_api">{loc.fallbackWarn}</option>
                  <option value="strict_offline">{loc.fallbackSilent}</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab 2: Git Settings */}
          {activeTab === 'git' && (
            <div className="space-y-5 text-left">
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
                      type="checkbox"
                      checked={autoFetchEnabled}
                      onChange={(e) => setAutoFetchEnabled(e.target.checked)}
                      className="sr-only peer"
                      id="checkbox-auto-fetch-toggle"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                </div>

                {autoFetchEnabled && (
                  <div className="pl-5 space-y-1.5 mt-2">
                    <label className="text-[11px] font-medium text-slate-400">
                      {loc.intervalLabel}
                    </label>
                    <select
                      value={autoFetchInterval}
                      onChange={(e) => setAutoFetchInterval(parseInt(e.target.value, 10))}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-slate-900/60 border-slate-800 text-slate-100'
                      }`}
                    >
                      <option value={60}>{loc.interval1m}</option>
                      <option value={300}>{loc.interval5m}</option>
                      <option value={900}>{loc.interval15m}</option>
                      <option value={1800}>{loc.interval30m}</option>
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
                    type="checkbox"
                    checked={autoStash}
                    onChange={(e) => setAutoStash(e.target.checked)}
                    className="sr-only peer"
                    id="checkbox-auto-stash-toggle"
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
                    type="text"
                    value={customBaseBranches}
                    onChange={(e) => setCustomBaseBranches(e.target.value)}
                    placeholder="develop, main, master, dev"
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 text-slate-100 focus:ring-indigo-500'
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
                    value={defaultBaseBranch}
                    onChange={(e) => setDefaultBaseBranch(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-medium cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-900/60 border-slate-800 text-slate-100'
                    }`}
                  >
                    {customBaseBranches
                      .split(',')
                      .map(b => b.trim())
                      .filter(Boolean)
                      .map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))
                    }
                    {/* fallback safeguard if the default is user-entered but not in list yet */}
                    {!customBaseBranches.split(',').map(b => b.trim()).filter(Boolean).includes(defaultBaseBranch) && (
                      <option value={defaultBaseBranch}>{defaultBaseBranch}</option>
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
            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  {loc.patternsLabel}
                </label>
                <input
                  type="text"
                  value={filePatterns}
                  onChange={(e) => setFilePatterns(e.target.value)}
                  placeholder={loc.patternsPlaceholder}
                  className={`w-full px-3 py-2 text-xs rounded-lg border font-mono outline-none focus:ring-1 transition-all ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-indigo-500'
                      : 'bg-slate-900/60 border-slate-800 text-slate-100 focus:ring-indigo-500'
                  }`}
                />
                <p className="text-[10px] text-slate-450 italic mt-1 leading-relaxed">
                  {loc.patternsDesc}
                </p>
              </div>

              <div className={`p-3 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2 ${
                theme === 'light' 
                  ? 'bg-emerald-50 bg-opacity-30 border-emerald-100 text-emerald-800' 
                  : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-300'
              }`}>
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>{isEn ? "Data Analytics Context (DA/BI Team)" : "Tối ưu hóa phân tích (Nhóm phân tích dữ liệu DA/BI)"}</strong>:
                  <p className="mt-1 font-mono text-[10px] opacity-90 leading-tight">
                    * .tmdl: {isEn ? "Double-validates Tabular model layouts & indent rules." : "Tự động phân tích sâu lề Tabular Model & lineageTag trùng lặp."}<br/>
                    * report.json: {isEn ? "Validates visuals arrangement parameters." : "Kiểm chuẩn cấu hình visual JSON của báo cáo Power BI."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions bar */}
        <div className={`p-4 border-t flex items-center justify-between ${
          theme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-[#121522]'
        }`}>
          <div className="flex items-center">
            {saveStatus === 'saved' && (
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" />
                {loc.savedText}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              {loc.saveBtn}
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-1.5 border font-semibold rounded-lg text-xs transition-colors cursor-pointer ${
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
