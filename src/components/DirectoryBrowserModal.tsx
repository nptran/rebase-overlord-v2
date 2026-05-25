import React from 'react';
import { 
  Folder, 
  FolderPlus, 
  ArrowLeft, 
  Search, 
  X, 
  FolderOpen, 
  Check, 
  Home, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface DirInfo {
  name: string;
  path: string;
  isGit: boolean;
}

interface DirectoryBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath: string;
  onSelect: (selectedPath: string) => void;
}

export default function DirectoryBrowserModal({
  isOpen,
  onClose,
  initialPath,
  onSelect
}: DirectoryBrowserModalProps) {
  const [currentPath, setCurrentPath] = React.useState(initialPath || '.');
  const [parentPath, setParentPath] = React.useState<string | null>(null);
  const [directories, setDirectories] = React.useState<DirInfo[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [manualPath, setManualPath] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Load directories for the active currentPath
  const loadPathDirs = async (targetPath: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/list-local-dirs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPath: targetPath })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentPath(data.currentPath);
        setManualPath(data.currentPath);
        setParentPath(data.parentPath);
        setDirectories(data.directories || []);
      } else {
        setErrorMsg(data.error || 'Permission denied or folder does not exist.');
        if (data.currentPath) {
          setCurrentPath(data.currentPath);
          setManualPath(data.currentPath);
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to read folder: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadPathDirs(initialPath);
    }
  }, [isOpen, initialPath]);

  if (!isOpen) return null;

  const handleDirectoryClick = (path: string) => {
    loadPathDirs(path);
  };

  const handleGoUp = () => {
    if (parentPath) {
      loadPathDirs(parentPath);
    }
  };

  const handleGoHome = () => {
    loadPathDirs('~');
  };

  const handleManualPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPath.trim()) {
      loadPathDirs(manualPath.trim());
    }
  };

  const handleConfirmSelect = () => {
    onSelect(currentPath);
    onClose();
  };

  // Build breadcrumbs that are interactive
  const pathParts = currentPath.split(/[/\\]/).filter(Boolean);
  const isWindows = currentPath.includes('\\') || /^[a-zA-Z]:/.test(currentPath);
  const separator = isWindows ? '\\' : '/';
  
  // Re-generate full paths for each breadcrumb piece
  const breadcrumbs = pathParts.map((part, idx) => {
    let fullPartPath = '';
    if (isWindows) {
      fullPartPath = pathParts.slice(0, idx + 1).join('\\');
      // For Windows drive letters like "C:"
      if (idx === 0 && part.endsWith(':')) {
        fullPartPath += '\\';
      }
    } else {
      fullPartPath = '/' + pathParts.slice(0, idx + 1).join('/');
    }
    return { name: part, path: fullPartPath };
  });

  const filteredDirs = directories.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="dir-browser-portal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        id="dir-browser-box" 
        className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px] max-h-[90vh]"
      >
        {/* Header */}
        <div id="dir-modal-header" className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="dir-modal-title" className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Server Directory Browser
              </h3>
              <p className="text-[10px] text-slate-400">Chọn thư mục chứa kho mã nguồn Git của bạn trên máy tính.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div id="dir-modal-toolbar" className="p-3 border-b border-slate-900 bg-[#080d16] flex flex-col gap-2">
          {/* Path Form */}
          <form onSubmit={handleManualPathSubmit} className="flex gap-1.5 items-center">
            <button
              type="button"
              onClick={handleGoHome}
              title="Đi tới Thư mục Cá nhân (~)"
              className="p-2 transition-all bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={!parentPath}
              onClick={handleGoUp}
              title="Lên một thư mục cha"
              className={`p-2 transition-all border rounded-lg shrink-0 cursor-pointer ${
                parentPath 
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-slate-950 border-slate-950 text-slate-650 cursor-not-allowed'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            
            <div className="relative flex-1">
              <input 
                type="text"
                value={manualPath}
                onChange={(e) => setManualPath(e.target.value)}
                placeholder="Đường dẫn tuyệt đối (Ví dụ: /Users/anh/projects/...)"
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-850 rounded-lg text-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <button 
              type="submit"
              className="px-3 py-1.5 text-xs bg-slate-850 border border-slate-750 hover:bg-slate-800 text-slate-300 rounded-lg shrink-0 font-mono transition-colors cursor-pointer"
            >
              Đi
            </button>
          </form>

          {/* Path Breadcrumbs */}
          <div className="flex items-center flex-wrap gap-1 px-1 py-0.5 text-[10px] font-mono text-slate-400 overflow-x-auto min-h-6">
            <span className="text-slate-500 shrink-0 select-none">Vị trí:</span>
            {!isWindows && (
              <button 
                type="button"
                onClick={() => loadPathDirs('/')}
                className="hover:text-white hover:underline shrink-0 text-slate-500 font-bold"
              >
                /
              </button>
            )}
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
                <button
                  type="button"
                  onClick={() => loadPathDirs(crumb.path)}
                  className="hover:text-indigo-400 hover:underline hover:bg-indigo-950/20 px-1 py-0.2 rounded transition-all shrink-0 font-semibold"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Directory Explorer Body */}
        <div id="dir-modal-explorer" className="flex-1 overflow-y-auto p-3 flex flex-col">
          {/* Live search input */}
          <div className="relative mb-2 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bộ lọc nhanh thư mục con..."
              className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-900 rounded text-[11px] font-mono text-slate-300 placeholder-slate-600 outline-none focus:border-slate-700"
            />
          </div>

          {/* Directory list */}
          {loading ? (
            <div id="dir-loading-status" className="flex-grow flex items-center justify-center flex-col gap-2">
              <div className="w-6 h-6 border-2 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-mono">Đang đọc cấu trúc thư mục...</span>
            </div>
          ) : errorMsg ? (
            <div id="dir-error-status" className="flex-grow flex items-center justify-center p-6 flex-col text-center">
              <AlertCircle className="w-8 h-8 text-rose-500/70 mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-rose-400 mb-1 font-mono">{errorMsg}</p>
              <p className="text-[10px] text-slate-500 max-w-sm">Hệ thống không thể mở vị trí này. Hãy kiểm tra phân quyền truy cập tập tin hoặc quay lại thư mục mặc định.</p>
              <button
                type="button"
                onClick={handleGoHome}
                className="mt-3 px-3 py-1 bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 text-[10px] font-semibold rounded-lg font-sans transition-all cursor-pointer"
              >
                Quay về Thư mục Gốc
              </button>
            </div>
          ) : (
            <div id="dir-list-grid" className="flex-grow overflow-y-auto border border-slate-900/40 rounded-lg bg-slate-950/40 divide-y divide-slate-950/50">
              {filteredDirs.length === 0 ? (
                <div id="dir-empty-status" className="p-8 text-center text-xs text-slate-600 font-mono flex flex-col items-center gap-1">
                  <Folder className="w-6 h-6 stroke-[1.2] stroke-slate-700" />
                  <span>Không tìm thấy thư mục con phù hợp.</span>
                </div>
              ) : (
                filteredDirs.map((dir, idx) => (
                  <div 
                    key={idx}
                    onDoubleClick={() => handleDirectoryClick(dir.path)}
                    onClick={() => setManualPath(dir.path)}
                    style={{ contentVisibility: 'auto' }}
                    className={`flex items-center justify-between p-2 text-xs font-mono transition-all cursor-pointer select-none ${
                      manualPath === dir.path 
                        ? 'bg-indigo-600/15 border-l-2 border-indigo-500 text-white' 
                        : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-4">
                      <Folder className={`w-4 h-4 shrink-0 ${
                        manualPath === dir.path ? 'text-indigo-400 fill-indigo-400/20' : 'text-slate-500 fill-slate-500/5'
                      }`} />
                      <span className="truncate font-medium">{dir.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {dir.isGit && (
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-401 py-0.5 px-1.5 rounded border border-indigo-500/20 font-bold tracking-tight">
                          Git Repo
                        </span>
                      )}
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectoryClick(dir.path);
                        }}
                        className="px-1.5 py-0.5 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[9px] hover:text-white rounded transition-all text-slate-500 cursor-pointer font-sans"
                      >
                        Mở &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div id="dir-modal-footer" className="p-3 border-t border-slate-900 bg-[#070b13] flex justify-between items-center shrink-0">
          <div className="text-[10px] font-mono text-slate-500 truncate max-w-xs md:max-w-md">
            Đường dẫn sẽ chọn: <span className="text-emerald-400">{manualPath || currentPath}</span>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-mono transition-colors rounded-lg bg-slate-900 hover:bg-slate-850 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmSelect}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 transition-all rounded-lg font-sans flex items-center gap-1 cursor-pointer shadow-md shadow-indigo-650/10"
            >
              <Check className="w-3.5 h-3.5" />
              Chọn thư mục này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
