/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  GitBranch, 
  HelpCircle, 
  Settings, 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  GitMerge, 
  History, 
  TrendingUp, 
  Terminal as TerminalIcon,
  Laptop,
  Check,
  Calendar,
  Zap,
  Github,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Hand,
  MousePointer,
  RefreshCw,
  Move,
  Eye,
  EyeOff,
  ArrowUpCircle,
  ArrowDownCircle,
  Search
} from 'lucide-react';

import { 
  TranslationTone, 
  GitRepoState, 
  WizardState, 
  SessionStats, 
  Commit, 
  ConflictFile 
} from './types';
import { translate } from './i18n';
import { getApiHeaders } from './utils/apiKeyHelper';

// Modules
import RepoHeader from './components/RepoHeader';
import WizardPanel from './components/WizardPanel';
import BranchPanel from './components/BranchPanel';
import TerminalPanel from './components/TerminalPanel';
import ConflictSolver from './components/ConflictSolver';
import GitVisualizerPanel from './components/GitVisualizerPanel';
import AiDoctorFloatingChat from './components/AiDoctorFloatingChat';
import ReflogRescuePanel from './components/ReflogRescuePanel';
import { resolveApiUrl } from './utils/apiResolver';

const sanityLoc: Record<TranslationTone, {
  title: string;
  gitEnv: string;
  githubCli: string;
  rebaseStatus: string;
  readyStatus: string;
  emptyCommits: string;
  simulationAnomalyBadge: string;
  simulateAnomaliesHeading: string;
  divergedSafeLabel: string;
  divergedUnsafeLabel: string;
  detachedSafeLabel: string;
  detachedUnsafeLabel: string;
  staleSafeLabel: string;
  staleUnsafeLabel: string;
  diagnosticsActionHeading: string;
  uncommittedChangesTitle: string;
  uncommittedChangesDesc: string;
  diagnoseBtn: string;
  firstAidHeader: string;
  discardConfirm: string;
  divergedTitle: string;
  divergedDesc: string;
  forcePushConfirm: string;
  detachedTitle: string;
  detachedDesc: string;
  rescueBranchBtn: string;
  staleBaseTitle: string;
  staleBaseDesc: string;
  cleanAllClearTitle: string;
  cleanAllClearDesc: string;
  doctorRep: string;
  doctorExplanation: string;
  doctorMitigation: string;
  doctorApplyStash: string;
  doctorApplyRebase: string;
  doctorApplyRescue: string;
  doctorApplySync: string;
  scanAnomaliesLoading: string;
  visualTimelineTitle: string;
  squashCompletedTitle: string;
  dirtyFilesLabel: string;
  zoomIn: string;
  zoomOut: string;
  resetLayout: string;
  nodeSizeLabel: string;
  rotationLabel: string;
  dragTip: string;
  panModeLabel: string;
  dragNodeModeLabel: string;
  simScenarioHeading: string;
  simScenarioLinear: string;
  simScenarioNonLinear: string;
  simScenarioRewrite: string;
  simScenarioStale: string;
  simScenarioDetached: string;
  simScenarioDesc: string;
}> = {
  [TranslationTone.PROFESSIONAL]: {
    title: "CHẨN ĐOÁN & KIỂM TRA (GIT SANITY CHECKS)",
    gitEnv: "Môi trường Git Binary:",
    githubCli: "Kết nối GitHub CLI (gh):",
    rebaseStatus: "Trạng thái Rebase:",
    readyStatus: "✓ SẠCH SẼ (READY)",
    emptyCommits: "Chọn một chi nhánh khác hoặc nhập base branch để vẽ lịch sử commits.",
    simulationAnomalyBadge: "MÔ PHỎNG ANOMALY",
    simulateAnomaliesHeading: "⚡ BẬT LỖI MÔ PHỎNG ĐỂ AI DOCTOR CHẨN TRỊ:",
    divergedSafeLabel: "✓ Sạch (Diverged)",
    divergedUnsafeLabel: "⚠️ Có Diverged",
    detachedSafeLabel: "✓ Sạch (HEAD)",
    detachedUnsafeLabel: "⚠️ Có Detached HEAD",
    staleSafeLabel: "✓ Sạch (Base)",
    staleUnsafeLabel: "⚠️ Có Stale Base",
    diagnosticsActionHeading: "🚨 CHẨN ĐOÁN & SƠ CỨU BẤT THƯỜNG:",
    uncommittedChangesTitle: "Workspace có file chưa commit",
    uncommittedChangesDesc: "Còn {0} tệp tin chưa được lưu trữ.",
    diagnoseBtn: "🩺 Chẩn đoán",
    firstAidHeader: "Sơ cứu:",
    discardConfirm: "Xác nhận: Xóa sạch code chưa lưu?",
    divergedTitle: "Lệch pha Local & Remote (Diverged)",
    divergedDesc: "Cả local và remote đều có các commits mới lệch pha.",
    forcePushConfirm: "Nguy hiểm: Nhất quyết Force push đè lên server?",
    detachedTitle: "Lịch sử rời neo (Detached HEAD)",
    detachedDesc: "Bạn không đứng trên nhánh cụ thể; code mới dễ bị mất.",
    rescueBranchBtn: "tạo nhánh rescue",
    staleBaseTitle: "Nhánh base bị lỗi thời",
    staleBaseDesc: "Nhánh base '{0}' bị chậm nhịp so với Remote.",
    cleanAllClearTitle: "✓ HỆ THỐNG TRƠN TRU KHỎE MẠNH",
    cleanAllClearDesc: "Thư mục làm việc hoàn toàn sạch sẽ. Các chỉ mục Git đều hoạt động hài hòa và sẵn sàng bùng nổ tiến trình Rebase!",
    doctorRep: "🏥 PHÁC ĐỒ CHẨN TRỊ TỪ TRỢ LÝ AI",
    doctorExplanation: "🔍 LÝ DO BẤT THƯỜNG (EXPLANATION):",
    doctorMitigation: "💊 PHƯƠNG ÁN ĐIỀU TRỊ (MITIGATION):",
    doctorApplyStash: "Áp dụng: git stash",
    doctorApplyRebase: "Áp dụng: Pull --rebase",
    doctorApplyRescue: "Áp dụng: Tạo cứu hộ",
    doctorApplySync: "Áp dụng: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Đang quét lỗi bất thường của kho lưu trữ...",
    visualTimelineTitle: "TRỰC QUAN HÓA SƠ ĐỒ COMMITS (VISUAL COMMIT TIMELINE GRAPH)",
    squashCompletedTitle: "HỢP NHẤT THÀNH CÔNG (CÒN LẠI 1 COMMIT)",
    dirtyFilesLabel: "Danh sách tệp tin chưa commit:",
    zoomIn: "Phóng to (+)",
    zoomOut: "Thu nhỏ (-)",
    resetLayout: "Đặt lại vị trí",
    nodeSizeLabel: "Kích thước các ô:",
    rotationLabel: "Xoay chiều (Dọc/Ngang)",
    dragTip: "💡 Kéo thả tự do các ô commit để tổ chức sắp xếp sơ đồ!",
    panModeLabel: "🖐️ Cuộn sơ đồ",
    dragNodeModeLabel: "🖱️ Kéo thả ô",
    simScenarioHeading: "🧬 KỊCH BẢN GIẢ LẬP ĐỂ TEST (SCENARIOS):",
    simScenarioLinear: "Nhánh ngon / Tuyến tính (Linear)",
    simScenarioNonLinear: "Merge Commit từ develop trước đó (Merge)",
    simScenarioRewrite: "Develop bị Rewrite History (Diverged)",
    simScenarioStale: "Nhánh Base bị cũ mốc (Stale Base)",
    simScenarioDetached: "Lịch sử rỗng rênh (Detached HEAD)",
    simScenarioDesc: "Mô phỏng lại các kịch bản khó nhằn trong Git để kiểm thử trực quan và phác đồ AI Doctor."
  },
  [TranslationTone.JOKE]: {
    title: "KHÁM SỨC KHỎE REPO (GIT SANITY CHECKS)",
    gitEnv: "Hệ điều hành Git:",
    githubCli: "Gia thế GitHub (gh-cli):",
    rebaseStatus: "Cục diện Rebase:",
    readyStatus: "✓ TRƠN TRU (READY)",
    emptyCommits: "Sếp lướt sang nhánh khác hoặc gõ tên bến đỗ (base branch) để em vẽ lịch sử nhé.",
    simulationAnomalyBadge: "ẢO LÒI ANOMALY 🌀",
    simulateAnomaliesHeading: "🔥 TRIỆU HỒI LỖI GIẢ LẬP CHO AI GÕ ĐẦU:",
    divergedSafeLabel: "✓ Diverged Sạch Bóng",
    divergedUnsafeLabel: "⚠️ Có Diverged Rồi Sếp",
    detachedSafeLabel: "✓ HEAD Đã Cắm Neo",
    detachedUnsafeLabel: "⚠️ HEAD Đang Bay Màu",
    staleSafeLabel: "✓ Base Mới Cứng",
    staleUnsafeLabel: "⚠️ Base Mốc Meo",
    diagnosticsActionHeading: "🛎️ PHÒNG KHÁM CẤP CỨU ĐỘC LẬP:",
    uncommittedChangesTitle: "Workspace Đang Bẩn Thỉu",
    uncommittedChangesDesc: "Còn {0} file đang bơ vơ ngoài đường chưa được cất giữ.",
    diagnoseBtn: "🩺 Khám bệnh",
    firstAidHeader: "Sơ cứu nhanh:",
    discardConfirm: "Tính vứt sạch hết tinh hoa code chưa lưu à sếp?",
    divergedTitle: "Trống đánh xuôi kèn thổi ngược (Diverged)",
    divergedDesc: "Local và Remote mỗi bên đi một ngả mất rồi.",
    forcePushConfirm: "Dùng tuyệt chiêu tối thượng Force Push đè nát server nhé?",
    detachedTitle: "Đầu lìa khỏi cổ (Detached HEAD)",
    detachedDesc: "Đang bay lơ lửng giữa hư vô không có nhánh nâng đỡ.",
    rescueBranchBtn: "mở phao cứu hộ",
    staleBaseTitle: "Base rệu rã (Stale Base)",
    staleBaseDesc: "Nhánh gốc '{0}' đang mốc meo so với trên mây rồi.",
    cleanAllClearTitle: "✓ TRỜI QUANG MÂY TẢNH KHÔNG BỆNH TẬT",
    cleanAllClearDesc: "Sạch sẽ láng o như chưa từng code hỏng, quẩy thôi sếp ơi!",
    doctorRep: "🏥 QUẺ PHÁN BỆNH TỪ THẦY AI",
    doctorExplanation: "🔍 CAO NHÂN CHỈ ĐIỂM (EXPLANATION):",
    doctorMitigation: "💊 PHÉP MÀU KHẮC PHỤC (MITIGATION):",
    doctorApplyStash: "Triển ngay: git stash",
    doctorApplyRebase: "Triển ngay: Pull --rebase",
    doctorApplyRescue: "Triển ngay: Tạo phao cứu sinh",
    doctorApplySync: "Triển ngay: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Thầy bói đang xem mạch kho chứa...",
    visualTimelineTitle: "RẠP CHIẾU HOẠT HÌNH GIT TRỰC QUAN (GIT MOVIE THEATER)",
    squashCompletedTitle: "HỢP NHẤT XONG XUÔI (CÒN ĐÚNG 1 COMMIT DUY NHẤT)",
    dirtyFilesLabel: "Mấy quả file đang bừa bãi chưa dọn dẹp:",
    zoomIn: "Phóng to nha sếp",
    zoomOut: "Thu bé lại",
    resetLayout: "Hoàn tác khung hình",
    nodeSizeLabel: "Phóng to dẹt ô:",
    rotationLabel: "Xoay dọc/ngang cực phê",
    dragTip: "💡 Sếp kéo kéo thả thả mấy cục commit bay lượn tung tăng kìa!",
    panModeLabel: "🖐️ Kéo nền",
    dragNodeModeLabel: "🖱️ Kéo ô",
    simScenarioHeading: "🧬 KHUNG TRẬN GIẢ LẬP SIÊU CẤP (SCENARIOS):",
    simScenarioLinear: "Nhánh ngoan hiền / Thẳng tuột (Linear)",
    simScenarioNonLinear: "Có Merge Commit phá đám từ develop (Merge)",
    simScenarioRewrite: "Sau lưng đã bị viết lại lịch sử (Diverged)",
    simScenarioStale: "Base ở xó chợ mốc meo (Stale Base)",
    simScenarioDetached: "Đứt dây neo trôi vô định (Detached HEAD)",
    simScenarioDesc: "Toàn bộ kịch bản bốc mùi của Git để sếp nghịch cho biết thế nào là đau đớn."
  },
  [TranslationTone.TOXIC]: {
    title: "BỆNH ÁN GIT (GIT SANITY CHECKS)",
    gitEnv: "Hàng Auth hay Fake:",
    githubCli: "Hộ khẩu Github (gh):",
    rebaseStatus: "Bãi chiến trường Rebase:",
    readyStatus: "✓ HẾT SỐC (READY)",
    emptyCommits: "Mày sang nhánh khác hoặc phang tên base branch vào để tao nặn mấy cái commits coi!",
    simulationAnomalyBadge: "ĐỐNG RÁC MÔ PHỎNG",
    simulateAnomaliesHeading: "💩 KHẤN VÁI TỰ BẬT LỖI RA ĐÂY:",
    divergedSafeLabel: "✓ Éo Diverged",
    divergedUnsafeLabel: "⚠️ Đứng Hình (Diverged)",
    detachedSafeLabel: "✓ HEAD Không Rời Cổ",
    detachedUnsafeLabel: "⚠️ HEAD Rời Cỏ",
    staleSafeLabel: "✓ Base Sạch",
    staleUnsafeLabel: "⚠️ Base Cũ Rích",
    diagnosticsActionHeading: "🚑 NHÀ XÁC DI ĐỘNG & GẶM NHẤM LỖI:",
    uncommittedChangesTitle: "Workspace Bừa Bộn Như Bãi Rác",
    uncommittedChangesDesc: "Chừa {0} cái file mốc chưa thèm commit kìa.",
    diagnoseBtn: "🩺 Mổ xẻ",
    firstAidHeader: "Sửa gấp:",
    discardConfirm: "Xoá sạch sành sanh code hả? Mất ráng chịu nha!",
    divergedTitle: "Lệch pha banh chành (Diverged)",
    divergedDesc: "Local với Server đập nhau chan chát rồi cụ ơi.",
    forcePushConfirm: "Liều mạng đè nát code của đồng đội bằng Force Push à?",
    detachedTitle: "Rụng đầu mất xác (Detached HEAD)",
    detachedDesc: "Không chịu đứng trên nhánh nào cả, code bay màu ráng chịu.",
    rescueBranchBtn: "nhặt xác lập nhánh rescue",
    staleBaseTitle: "Base rách lỗi thời",
    staleBaseDesc: "Nhánh gốc '{0}' rách nát chậm rùa bò so với Remote server rồi.",
    cleanAllClearTitle: "✓ CHỬI AI NỮA CODE NGON RỒI",
    cleanAllClearDesc: "Sạch sẽ rồi đấy, nổ máy Rebase lẹ đi ngủ chứ thức đêm hoài báo quá báo!",
    doctorRep: "🏥 GIẤY KHÁM BỆNH CỦA QUÁI VẬT AI",
    doctorExplanation: "🔍 LỖI NGU ĐẦY ĐƯỜNG (EXPLANATION):",
    doctorMitigation: "💊 THUỐC ĐẮNG DÃ TẬT (MITIGATION):",
    doctorApplyStash: "Bấm đại: git stash",
    doctorApplyRebase: "Bấm đại: Pull --rebase",
    doctorApplyRescue: "Bấm đại: Tạo cứu thương",
    doctorApplySync: "Bấm đại: Đồng bộ nhánh base",
    scanAnomaliesLoading: "Đang dọn rác bất thường...",
    visualTimelineTitle: "SƠ ĐỒ COMMITS BẤT HỦ (VISUAL COMMIT TIMELINE GRAPH)",
    squashCompletedTitle: "SQUASH SẠCH BÓNG (CÒN LẠI 1 TÊN COMMIT SỐNG SÓT)",
    dirtyFilesLabel: "Đống nợ chưa thèm thắt nút cứu vớt:",
    zoomIn: "Bành to ra",
    zoomOut: "Bóp bé tí",
    resetLayout: "Dẹp hết dọn về chỗ cũ",
    nodeSizeLabel: "Kích cỡ đống tạ:",
    rotationLabel: "Xoay vẹo ngang dọc",
    dragTip: "💡 Thích thì ném quăng quật mấy cục commit cho đỡ ngứa mắt nhé!",
    panModeLabel: "🖐️ Lướt nền",
    dragNodeModeLabel: "🖱️ Bốc đầu ô",
    simScenarioHeading: "🧬 BÃI PHÂN TÍCH GIẢ LẬP ĐỂ CHỬI (SCENARIOS):",
    simScenarioLinear: "Nhánh thẳng tuột như ruột ngựa (Linear)",
    simScenarioNonLinear: "Merge Commit bốc mùi từ develop (Merge)",
    simScenarioRewrite: "Develop bị đè nát (Rewrite/Diverged)",
    simScenarioStale: "Base cổ lỗ sĩ mốc xanh (Stale Base)",
    simScenarioDetached: "Bay đầu mất xác giữa chợ (Detached HEAD)",
    simScenarioDesc: "Mấy quả phá hoại Git điển hình để test não AI Doctor và cách chữa bệnh."
  },
  [TranslationTone.ENGLISH]: {
    title: "DIAGNOSTICS & GIT SANITY CHECKS",
    gitEnv: "Git Binary Environment:",
    githubCli: "GitHub CLI Connection (gh):",
    rebaseStatus: "Rebase Status:",
    readyStatus: "✓ CLEAN (READY)",
    emptyCommits: "Select a different branch or provide a base branch to render commit history.",
    simulationAnomalyBadge: "SIMULATED ANOMALY",
    simulateAnomaliesHeading: "⚡ ENABLE SIMULATED ANOMALIES FOR AI DOCTOR TO TREAT:",
    divergedSafeLabel: "✓ Clear (Diverged)",
    divergedUnsafeLabel: "⚠️ Has Diverged",
    detachedSafeLabel: "✓ Clear (HEAD)",
    detachedUnsafeLabel: "⚠️ Has Detached HEAD",
    staleSafeLabel: "✓ Clear (Base)",
    staleUnsafeLabel: "⚠️ Has Stale Base",
    diagnosticsActionHeading: "🚨 DIAGNOSTICS & FIRST AID:",
    uncommittedChangesTitle: "Uncommitted Changes (Dirty Workspace)",
    uncommittedChangesDesc: "{0} uncommitted/unstaged file(s) remaining.",
    diagnoseBtn: "🩺 Diagnose",
    firstAidHeader: "First aid:",
    discardConfirm: "Discard all modified code? This cannot be undone!",
    divergedTitle: "Diverged Local & Remote Branches",
    divergedDesc: "Local and remote repositories have diverged with conflicting timelines.",
    forcePushConfirm: "Perform force push? This overrides remote changes!",
    detachedTitle: "Detached HEAD State",
    detachedDesc: "You are not currently on any active branch container.",
    rescueBranchBtn: "create rescue branch",
    staleBaseTitle: "Stale Reference Base Branch",
    staleBaseDesc: "Base branch '{0}' is outdated compared to the remote.",
    cleanAllClearTitle: "✓ ALL CLEAR (NO ISSUES)",
    cleanAllClearDesc: "Your working tree is completely clean. All Git parameters are aligned and ready for a smooth Rebase replay!",
    doctorRep: "🏥 DYNAMIC BACTERIA REPORT BY AI ASSISTANT",
    doctorExplanation: "🔍 ANOMALY EXPLANATION (EXPLANATION):",
    doctorMitigation: "💊 ACTION PLAN (MITIGATION):",
    doctorApplyStash: "Apply: git stash",
    doctorApplyRebase: "Apply: Pull --rebase",
    doctorApplyRescue: "Apply: Create rescue branch",
    doctorApplySync: "Apply: Sync reference",
    scanAnomaliesLoading: "Scanning repository anomalies...",
    visualTimelineTitle: "VISUAL COMMIT TIMELINE GRAPH",
    squashCompletedTitle: "SQUASH COMPLETED (1 COMMIT REMAINING)",
    dirtyFilesLabel: "Detailed list of uncommitted changes:",
    zoomIn: "Zoom In (+)",
    zoomOut: "Zoom Out (-)",
    resetLayout: "Reset Layout",
    nodeSizeLabel: "Node Size:",
    rotationLabel: "Toggle Vertical/Horizontal",
    dragTip: "💡 Free drag and reposition commit nodes around the canvas board!",
    panModeLabel: "🖐️ Pan Canvas",
    dragNodeModeLabel: "🖱️ Drag Nodes",
    simScenarioHeading: "🧬 CHOOSE SIMULATED SCENARIO TO TEST:",
    simScenarioLinear: "Linear Feature Branch (Linear)",
    simScenarioNonLinear: "Merge Commit Checkpoint from develop (Merge)",
    simScenarioRewrite: "Diverged History / Rewrite (Diverged)",
    simScenarioStale: "Stale Base Branch Reference (Stale Base)",
    simScenarioDetached: "Detached HEAD State (Detached HEAD)",
    simScenarioDesc: "Simulate complex, real-world, non-linear Git histories to test commit graph layout and live anomaly warning diagnostics."
  }
};

const tooltipTexts: Record<TranslationTone, Record<string, { why: string; how: string }>> = {
  [TranslationTone.PROFESSIONAL]: {
    dirty: {
      why: "Workspace đang có thay đổi chưa được commit. Tiến trình Rebase yêu cầu một thư mục làm việc sạch sẽ (clean working tree) để có thể tạm nén và sau đó áp dụng tuần tự từng commit mới của bạn lên phía trên nhánh base mà không gây đè hoặc mất dữ liệu.",
      how: "Hãy chạy lệnh 'git stash' để lưu tạm thời các sửa đổi hiện tại vào bộ nhớ đệm ẩn, hoặc bấm nút 'discard' để xóa sạch các thay đổi nháp nếu bạn không cần sử dụng chúng nữa."
    },
    diverged: {
      why: "Nhánh ở local máy tính của bạn và nhánh theo dõi từ xa (remote tracking branch) trên GitHub đều có thêm các commit mới khác nhau. Điều này khiến dòng lịch sử bị rẽ đôi chéo, Git không thể tự động fast-forward khi push.",
      how: "Nên sử dụng 'git pull --rebase' để chèn những commit chưa đẩy của bạn lên sau các commit mới nhất của remote. Chỉ dùng Force Push khi bạn muốn ghi đè hoàn toàn bảo bối của mình lên máy chủ."
    },
    detached: {
      why: "Con trỏ HEAD đang trỏ thẳng vào một commit cụ thể thay vì bám trụ vào một nhánh tham chiếu cụ thể. Trạng thái này là 'vô gia cư', các commit mới tạo ra sẽ không thuộc nhánh nào và dễ bị tiến trình dọn dẹp bộ nhớ (garbage collection) của Git xóa mất.",
      how: "Hãy nhấp ngay nút 'tạo nhánh rescue' (mô phỏng 'git checkout -b <nhánh_mới>') để gắn neo liên kết, giữ an toàn toàn vẹn cho đống lịch sử code của bạn."
    },
    stale: {
      why: "Nhánh đích cơ sở (thường là 'develop' hoặc 'main') đang bị tụt hậu so với remote server mây, khiến bạn chuẩn bị Rebase trên một cái nền móng cũ kĩ và dễ dẫn tới hàng tấn xung đột không đáng có.",
      how: "Chọn cách 'fetch & pull sync' để cập nhật nhanh móng nhà base về trạng thái mới nhất, giúp quá trình nhấc - đặt commit diễn ra mượt mờ."
    }
  },
  [TranslationTone.JOKE]: {
    dirty: {
      why: "Workspace ngổn ngang quần áo chưa gấp (chưa commit) kìa sếp! Đang tái cấu trúc lịch sử mà đồ đạc quăng lung tung là Git nó bạo loạn làm loạn xì ngầu đó.",
      how: "Gấp gọn nhét tủ bằng 'git stash' hoặc vứt sọt rác bằng Discard cho nhẹ gánh giang hồ nha sếp."
    },
    diverged: {
      why: "Sếp đi đường sếp, Server đi đường Server, hai bên đã rẽ lối chia hai ngả rồi kìa. Push đè lên là ăn dép của đồng nghiệp ngay!",
      how: "Triển chiêu 'pull --rebase' dỗ dành kéo hai bên sát lại gần nhau, hoặc bá đạo hơn thì 'force push' đè bẹp server luôn."
    },
    detached: {
      why: "Đầu lìa khỏi xác rồi sếp ơi! Trùng khơi vô định không bến đỗ, tắt máy đi ngủ là đống commit bay màu không dấu vết như người yêu cũ luôn.",
      how: "Nhanh tay quăng phao 'tạo nhánh rescue' buộc cổ HEAD lại ngay kẻo code trôi sông trôi biển!"
    },
    stale: {
      why: "Nhánh móng (base) mốc meo từ thời tống rồi kìa sếp! Móng nhà rệu rã thế này mà xây đè gạch rebase lên là nát bét đó.",
      how: "Bật ngay 'fetch & pull' hút tinh khí từ remote về bơm căng nhánh base cho tươi trẻ lại sếp ơi."
    }
  },
  [TranslationTone.TOXIC]: {
    dirty: {
      why: "Code bôi ra lung tung chưa thèm dọn dẹp mà đòi múa Rebase rồi à? Đừng để đống bừa bộn này làm hỏng bét cả tiến trình gộp nhé cụ.",
      how: "Thả đống rác vào túi 'git stash' cất đi, hoặc bấm nút 'discard' xoá hết công sức xạo xạo vừa bôi ra đi cho rảnh."
    },
    diverged: {
      why: "Mỗi bên đi một ngả chọc gáy nhau rồi. Nghĩ sao đòi push thẳng khi server đang có hàng xịn hơn? Úp sọt lộn xộn rồi đó.",
      how: "Nhanh cái tay gõ 'pull --rebase' xếp hàng trật tự đi. Còn nếu thích ăn chửi thì phang 'force push' đè nát cả lò server."
    },
    detached: {
      why: "HEAD mất xác, bay đầu lơ lửng ngoài vũ trụ rồi con giời ơi! Code vớ vẩn này không bám vào nhánh nào thì tắt tab một cái là bay màu sạch đừng khóc.",
      how: "Hồn về với xác lẹ! Bấm mịa nó nút 'rescue' để tự chế ra cái nhánh cứu rỗi linh hồn đống commit đi kìa!"
    },
    stale: {
      why: "Nhánh gốc (base) nát từ kiếp nào rồi không chịu cập nhật, tính Rebase đè lên cái nền mục nát để ăn cám cả lũ à?",
      how: "Bớt lười lại, bấm 'fetch & pull sync' dọn dẹp móng cho sạch mới mong code chạy mượt được."
    }
  },
  [TranslationTone.ENGLISH]: {
    dirty: {
      why: "You have uncommitted modifications in your workspace. Rebasing works by rewriting commit history, which strictly requires a clean working tree to prevent conflicting untracked code collisions.",
      how: "Run 'git stash' to store your current progress into a temporary stack cabinet, or click 'discard' to wipe them if you don't need them anymore."
    },
    diverged: {
      why: "Your local branch and remote origin have diverged with differing commit chains. Git will reject standard push requests because the remote history is not a parent of local HEAD.",
      how: "Perform 'git pull --rebase' to cleanly fetch and replay your commits over the fetched remote timeline, or use force push to override."
    },
    detached: {
      why: "HEAD is in a detached state, pointing directly to a naked commit instead of a reference branch container. Any future commits here are orphaned and at risk of being pruned by Git's garbage collection.",
      how: "Instantly create a rescue branch ('git checkout -b rescue-branch') to anchor and safely secure your commits under a permanent pointer."
    },
    stale: {
      why: "Your reference base branch is stale and outdated compared to remote origin master. Rebasing features on a stale root will yield severe and unnecessary merge conflicts.",
      how: "Trigger origin sync using 'fetch & pull' to bring the base branch reference completely up-to-date, ensuring smooth rebase operations."
    }
  }
};

async function safeParseError(res: Response, fallbackMsg: string): Promise<string> {
  try {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data.error || data.details || fallbackMsg;
    } catch {
      return `HTTP ${res.status}: ${text.substring(0, 150)}`;
    }
  } catch (err: any) {
    return `${fallbackMsg} (${err.message})`;
  }
}

interface CommitNodeCardProps {
  c: Commit;
  theme: 'light' | 'dark';
  tone: TranslationTone;
  activeTool: 'pan' | 'dragNode';
  isMobile: boolean;
  wizard: WizardState;
  expandedNodes: Record<string, boolean>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  nodeSizes: Record<string, { width: number; height: number }>;
  isSimulation: boolean;
  track: number;
  isGraphVertical: boolean;
  nodeWidth: number;
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  updateConnectionPaths: () => void;
  triggerRenderTick: () => void;
  handleResizeStart: (e: React.PointerEvent, sha: string, dir: 'w' | 'h' | 'both') => void;
  hoveredSha: string | null;
  setHoveredSha: (sha: string | null) => void;
  fetchCommitFiles: (sha: string) => void;
  loadingFilesShas: Record<string, boolean>;
  commitFiles: Record<string, Array<{ filepath: string; status: string }>>;
  isTouchOnly: boolean;
}

function CommitNodeCard({
  c,
  theme,
  tone,
  activeTool,
  isMobile,
  wizard,
  expandedNodes,
  setExpandedNodes,
  nodeSizes,
  isSimulation,
  track,
  isGraphVertical,
  nodeWidth,
  nodeRefs,
  updateConnectionPaths,
  triggerRenderTick,
  handleResizeStart,
  hoveredSha,
  setHoveredSha,
  fetchCommitFiles,
  loadingFilesShas,
  commitFiles,
  isTouchOnly,
}: CommitNodeCardProps) {
  const dragControls = useDragControls();

  const isSelect = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
  const isExpanded = !!expandedNodes[c.sha];
  const customSz = nodeSizes[c.sha];
  const finalWidth = customSz?.width ?? (isExpanded ? nodeWidth + 120 : nodeWidth);
  const finalHeight = customSz?.height ?? (isExpanded ? 140 : 80);

  let nodeOffsetX = 0;
  let nodeOffsetY = 0;
  if (isSimulation) {
    if (isGraphVertical) {
      if (track === 0) nodeOffsetX = -180;
      if (track === 2) nodeOffsetX = 180;
    } else {
      if (track === 0) nodeOffsetY = -110;
      if (track === 2) nodeOffsetY = 110;
    }
  }

  return (
    <motion.div
      ref={(el) => {
        nodeRefs.current[c.sha] = el;
      }}
      drag={!isMobile && activeTool === 'dragNode'}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={false}
      dragElastic={0.2}
      layout
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
        boxShadow: theme === 'light' ? '0 10px 20px rgba(0,0,0,0.1)' : '0 10px 25px rgba(0,0,0,0.4)',
      }}
      onDrag={() => {
        updateConnectionPaths();
      }}
      onDragEnd={() => {
        updateConnectionPaths();
      }}
      onMouseEnter={() => {
        setHoveredSha(c.sha);
        fetchCommitFiles(c.sha);
      }}
      onMouseLeave={() => {
        setHoveredSha(null);
      }}
      style={{
        width: `${finalWidth}px`,
        height: customSz?.height ? `${finalHeight}px` : 'auto',
        minHeight: customSz?.height ? `${finalHeight}px` : undefined,
        marginLeft: isGraphVertical ? `${nodeOffsetX}px` : undefined,
        marginTop: !isGraphVertical ? `${nodeOffsetY}px` : undefined,
      }}
      className={`flex flex-col items-stretch p-3 text-left border rounded-xl hover:shadow-md transition-colors duration-150 relative shrink-0 ${
        !isMobile && activeTool === 'dragNode' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${
        theme === 'light'
          ? 'bg-white border-slate-200/80 shadow-sm text-slate-800'
          : 'bg-slate-900/60 border-slate-800 text-slate-100 shadow'
      }`}
    >
      {/* Top header of node */}
      <div className="flex items-center justify-between gap-1.5 mb-2 pointer-events-auto">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
              isSelect
                ? 'bg-indigo-500/10 text-indigo-500 border-indigo-200/50 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30'
                : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-900'
            }`}
          >
            {isExpanded ? c.sha : c.sha.substring(0, 7)}
          </span>

          {/* Branch Track Badge */}
          {isSimulation && track === 0 && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]">
              develop
            </span>
          )}
          {isSimulation && track === 2 && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]" title="origin/remote">
              origin/remote
            </span>
          )}
          {isSimulation && track === 1 && c.isMergeCommit && (
            <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20 uppercase tracking-wider scale-[0.9] origin-left truncate max-w-[70px]">
              merge
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 select-none shrink-0">
          {/* Hover Grab Handle Indicator */}
          {!isMobile && activeTool === 'dragNode' && (
            <Move
              onPointerDown={(e) => {
                e.preventDefault();
                dragControls.start(e);
              }}
              className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
              title="Nhấn giữ để di chuyển (Hold to drag)"
            />
          )}

          {/* Maximize / Collapse Resize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedNodes((prev) => ({ ...prev, [c.sha]: !prev[c.sha] }));
              setTimeout(() => {
                updateConnectionPaths();
                triggerRenderTick();
              }, 80);
            }}
            className={`p-1 rounded cursor-pointer transition-colors ${
              theme === 'light' ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title={isExpanded ? "Collapse Details" : "Expand to view details"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3 text-rose-400" />
            ) : (
              <Maximize2 className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Body of node */}
      <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
        <span
          className={`text-[11px] font-medium leading-tight ${
            isExpanded ? 'whitespace-normal block break-words text-xs' : 'truncate block w-full text-[10px]'
          } ${
            isSelect ? (theme === 'light' ? 'text-slate-800' : 'text-slate-100') : 'text-slate-400 line-through opacity-60'
          }`}
          title={c.message}
        >
          {c.message}
        </span>

        {/* Smooth framer-motion expanded detailed contents */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-dashed border-slate-700 mt-2 pt-2 flex flex-col gap-1 text-[10px] font-mono text-slate-400"
            >
              {c.type && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold shrink-0 text-slate-500">Type:</span>
                  <span
                    className={`px-1 py-0.2 rounded font-black uppercase text-[8px] ${
                      c.type === 'feat'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : c.type === 'fix'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
              )}

              {c.author && (
                <div className="truncate">
                  <span className="font-bold text-slate-500 text-[9px]">Author:</span> {c.author}
                </div>
              )}

              {c.date && (
                <div className="text-[9px]">
                  <span className="font-bold text-slate-500">Date:</span> {c.date}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Drag-to-Resize Handles on Board Borders (hidden on touch machines) */}
      {!isTouchOnly && (
        <>
          {/* Right side resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'w')}
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-indigo-500/30 active:bg-indigo-500/40 transition-colors z-20 group"
            title="Kéo để chỉnh độ rộng (Drag to resize width)"
          >
            <div className="w-1 h-1/3 bg-slate-400/25 group-hover:bg-indigo-400/80 rounded mx-auto my-auto top-1/3 relative" />
          </div>

          {/* Bottom side resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'h')}
            className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize hover:bg-indigo-500/30 active:bg-indigo-500/40 transition-colors z-20 group"
            title="Kéo để chỉnh chiều cao (Drag to resize height)"
          >
            <div className="h-1 w-1/3 bg-slate-400/25 group-hover:bg-indigo-400/80 rounded mx-auto my-auto left-1/3 relative" />
          </div>

          {/* Bottom-right diagonal resize handle */}
          <div
            onPointerDown={(e) => handleResizeStart(e, c.sha, 'both')}
            className="absolute bottom-0 right-0 w-4.5 h-4.5 cursor-se-resize hover:bg-indigo-500/50 hover:scale-110 active:scale-95 transition-all z-30 flex items-center justify-center rounded-bl group-hover:bg-indigo-500/10"
            title="Chỉnh cả 2 chiều (Resize both width and height)"
          >
            <svg
              className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 19H5m14 0V5" />
            </svg>
          </div>
        </>
      )}

      {/* Interactive hover tooltip previewing file changes */}
      <AnimatePresence>
        {hoveredSha === c.sha && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              width: '260px',
            }}
            className={`absolute left-[103%] top-0 z-55 p-3.5 rounded-xl border-2 shadow-2xl flex flex-col gap-2.5 backdrop-blur-md font-sans text-xs ${
              theme === 'light'
                ? 'bg-white/95 border-indigo-100 text-slate-800 shadow-slate-300/60'
                : 'bg-slate-950/95 border-indigo-900/80 text-slate-100 shadow-black/90'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-1.5 border-dashed border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[10px]">
                <span className="text-indigo-400">#</span>
                <span>{translate('commit_files_changed', tone)}</span>
              </div>
              <span className="text-[9px] font-mono opacity-60">{c.sha.substring(0, 7)}</span>
            </div>

            {loadingFilesShas[c.sha] ? (
              <div className="flex items-center gap-2 py-3 justify-center text-[10px] text-slate-400 animate-pulse font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                <span>{translate('commit_files_loading', tone)}</span>
              </div>
            ) : !commitFiles[c.sha] || commitFiles[c.sha].length === 0 ? (
              <div className="text-[10px] text-slate-500 py-3 text-center italic font-mono">
                {translate('commit_files_none', tone)}
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-h-[140px] overflow-y-auto pr-1">
                {commitFiles[c.sha].map((file, fi) => (
                  <div key={fi} className="flex items-center gap-1.5 text-[9.5px] font-mono truncate text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{file.filepath}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  // Configs persistent states with localStorage fallback
  const [tone, setTone] = React.useState<TranslationTone>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_tone');
      if (saved && Object.values(TranslationTone).includes(saved as TranslationTone)) {
        return saved as TranslationTone;
      }
    } catch (e) {}
    return TranslationTone.PROFESSIONAL;
  });

  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    // Tự động đổi giao diện light mode/dark mode theo thời gian sáng tối khi khởi động
    // Từ 7h tối (19:00) đến 7h sáng (07:00) => tối (dark). Các thời gian còn lại => sáng (light)
    try {
      const hours = new Date().getHours();
      return (hours >= 19 || hours < 7) ? 'dark' : 'light';
    } catch (e) {}
    return 'dark';
  });

  const [useEmoji, setUseEmoji] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_use_emoji');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const [isSimulation, setIsSimulation] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_is_simulation');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [simScenarioId, setSimScenarioId] = React.useState<'linear' | 'nonlinear' | 'rewrite' | 'stale' | 'detached'>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_sim_scenario_id') as any;
      if (['linear', 'nonlinear', 'rewrite', 'stale', 'detached'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'linear';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_scenario_id', simScenarioId);
    } catch (e) {}
  }, [simScenarioId]);

  const [isAiEnabled, setIsAiEnabled] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_is_ai_enabled');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const [showLogPanel, setShowLogPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_log_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [showWarningsPanel, setShowWarningsPanel] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_warnings_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const [showGraphTimeline, setShowGraphTimeline] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_show_graph_timeline');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_graph_timeline', String(showGraphTimeline));
    } catch (e) {}
  }, [showGraphTimeline]);


  // Interactive Commit Graph Controls
  const [zoomScale, setZoomScale] = React.useState<number>(1.0);
  const [nodeWidth, setNodeWidth] = React.useState<number>(180);
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({});
  const [isGraphVertical, setIsGraphVertical] = React.useState<boolean>(true);
  const [activeTool, setActiveTool] = React.useState<'pan' | 'dragNode'>('dragNode');
  const [resetKey, setResetKey] = React.useState<number>(0);

  // Dense graph handle with pagination, limits, and search filtering
  const [maxVisibleCommits, setMaxVisibleCommits] = React.useState<number | 'all'>(10);
  const [commitPageOffset, setCommitPageOffset] = React.useState<number>(0);
  const [commitSearchTerm, setCommitSearchTerm] = React.useState<string>('');

  // File changes preview tooltip state
  const [hoveredSha, setHoveredSha] = React.useState<string | null>(null);
  const [commitFiles, setCommitFiles] = React.useState<Record<string, { filepath: string; status: 'modified' | 'added' | 'deleted' }[]>>({});
  const [loadingFilesShas, setLoadingFilesShas] = React.useState<Record<string, boolean>>({});

  const [isCloning, setIsCloning] = React.useState<boolean>(false);
  const [isFetchingGlobal, setIsFetchingGlobal] = React.useState<boolean>(false);

  // Easter Eggs Toast system
  interface ActiveToast {
    id: string;
    type: 'info' | 'success' | 'warn' | 'error' | 'milestone' | 'owl' | 'rage' | 'spam';
    title: string;
    message: string;
    emoji?: string;
  }
  const [toasts, setToasts] = React.useState<ActiveToast[]>([]);
  const triggerToast = React.useCallback((type: ActiveToast['type'], title: string, message: string, emoji?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, title, message, emoji }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  }, []);

  // Night Owl state
  const [isNightOwl, setIsNightOwl] = React.useState<boolean>(() => {
    const hr = new Date().getHours();
    return hr >= 23 || hr <= 4;
  });
  const [showNightOwlBanner, setShowNightOwlBanner] = React.useState<boolean>(true);

  // Custom API configuration for serverless deployment fallback (Vercel, GitHub Pages, etc.)
  const [backendStatus, setBackendStatus] = React.useState<'checking' | 'connected' | 'unreachable'>('checking');
  const [customBackendUrl, setCustomBackendUrl] = React.useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('rebase_overlord_backend_url')) || '';
  });

  const [appVersion, setAppVersion] = React.useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('rebase_overlord_patch_version')) || '1.12.0';
  });

  // New States for Update Verification & Diagnostics
  const [updateMismatchError, setUpdateMismatchError] = React.useState<string | null>(null);
  const [isVersionRed, setIsVersionRed] = React.useState(false);
  const [verifyBtnVisible, setVerifyBtnVisible] = React.useState(false);
  const [updateFailedModal, setUpdateFailedModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    exitCode?: number | null;
  } | null>(null);
  const isUpgraded = React.useMemo(() => {
    const cleanVersion = appVersion.replace(/^v/, '');
    const parts = cleanVersion.split('.').map(v => parseInt(v, 10) || 0);
    // Baseline is 1.12.0; any version greater than that is an upgrade
    if (parts[0] > 1) return true;
    if (parts[0] === 1) {
      if (parts[1] > 12) return true;
      if (parts[1] === 12 && parts[2] > 0) return true;
    }
    return false;
  }, [appVersion]);

  const sloc = sanityLoc[tone];

  const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

  // Core Git States with localStorage fallback
  const [repoState, setRepoState] = React.useState<GitRepoState>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_repo_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      repoPath: '.',
      isValid: true,
      currentBranch: 'feature/payment-v2',
      baseBranch: 'develop',
      isDirty: true,
      dirtyFiles: [
        'src/routes/payment.ts',
        'src/services/stripe.ts',
        'config/keys.json',
        'src/components/ConflictSolver.tsx',
        'package.json'
      ],
      branches: [],
      commits: [],
      rebaseInProgress: false,
      mergeInProgress: false,
      conflicts: [],
      ghAvailable: true,
      ghErrorKey: '',
      commandHistory: []
    };
  });

  // Session stats state
  const [stats, setStats] = React.useState<SessionStats>({
    rebaseCount: 3,
    firstRun: new Date().toISOString().split('T')[0]
  });

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Detection for mobile to optimize dragging performance on small screen devices
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobileWidth = () => {
      // 768px is standard MD breakpoint
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      if (isMob) {
        setActiveTool('pan');
      }
    };
    checkMobileWidth();
    window.addEventListener('resize', checkMobileWidth);
    return () => window.removeEventListener('resize', checkMobileWidth);
  }, []);

  // Wizard state machine with localStorage fallback
  const [wizard, setWizard] = React.useState<WizardState>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_wizard');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      step: 0,
      baseBranch: 'develop',
      doFetch: true,
      detectedType: 'clean',
      detectedReason: 'Nhánh gọn gàng, không trùng lặp commits',
      historyType: 'clean',
      basePoint: '',
      commitTotal: 0,
      selectedCommits: [],
      doBackup: true,
      backupBranchName: '',
      finalMsg: 'feat: add payment intent and webhook handles',
      autoPush: false,
      status: 'idle'
    };
  });

  const activeCommitsForSquash = repoState.commits.filter(c => c.selected);

  // Filter commits based on search/filtering (message, author, SHA, type, status)
  const filteredCommitsForSquash = React.useMemo(() => {
    if (!commitSearchTerm.trim()) return activeCommitsForSquash;
    const term = commitSearchTerm.toLowerCase();
    return activeCommitsForSquash.filter(c => 
      c.message.toLowerCase().includes(term) || 
      c.sha.toLowerCase().includes(term) ||
      (c.type && c.type.toLowerCase().includes(term)) ||
      (c.author && c.author.toLowerCase().includes(term))
    );
  }, [activeCommitsForSquash, commitSearchTerm]);

  // Paginated window representing dense layout
  const paginatedCommitsForSquash = React.useMemo(() => {
    if (maxVisibleCommits === 'all') return filteredCommitsForSquash;
    const size = maxVisibleCommits;
    const startIdx = commitPageOffset * size;
    return filteredCommitsForSquash.slice(startIdx, startIdx + size);
  }, [filteredCommitsForSquash, maxVisibleCommits, commitPageOffset]);

  // Adjust page offset if index is out of scope
  React.useEffect(() => {
    if (maxVisibleCommits === 'all') {
      setCommitPageOffset(0);
      return;
    }
    const size = maxVisibleCommits;
    const maxPageIdx = Math.max(0, Math.ceil(filteredCommitsForSquash.length / size) - 1);
    if (commitPageOffset > maxPageIdx) {
      setCommitPageOffset(maxPageIdx);
    }
  }, [filteredCommitsForSquash.length, maxVisibleCommits, commitPageOffset]);

  // Git Branch Metrics (Ahead & Behind metrics analytics)
  const branchMetrics = React.useMemo(() => {
    const currentName = repoState.currentBranch;
    const currentMeta = repoState.branches.find(b => b.name === currentName);
    
    // Fallbacks or real numbers
    let aheadCount = currentMeta?.aheadCount ?? 0;
    let behindCount = currentMeta?.behindCount ?? 0;
    
    // If we have activeCommitsForSquash we can calculate track indices too (track 1 is feature, track 0 is develop)
    const commitsTrack1 = repoState.commits.filter(c => c.selected && c.track === 1);
    const commitsTrack0 = repoState.commits.filter(c => c.track === 0);
    
    if (isSimulation) {
      if (currentName === 'develop') {
        aheadCount = 3;
        behindCount = 2;
      } else if (currentName.startsWith('feature/payment')) {
        aheadCount = commitsTrack1.length || 5;
        behindCount = commitsTrack0.length || 2;
      } else if (currentName === 'feature/auth-oauth') {
        aheadCount = 0;
        behindCount = 3;
      } else {
        aheadCount = commitsTrack1.length || 3;
        behindCount = commitsTrack0.length || 2;
      }
    } else {
      // In real repo mode, use counts or commits calculation
      aheadCount = currentMeta?.aheadCount ?? commitsTrack1.length;
      behindCount = currentMeta?.behindCount ?? commitsTrack0.length;
    }
    
    return {
      ahead: aheadCount,
      behind: behindCount,
      total: repoState.commits.length,
      actionable: activeCommitsForSquash.length
    };
  }, [repoState.commits, repoState.branches, repoState.currentBranch, isSimulation, activeCommitsForSquash.length]);

  // DOM references for measuring lines connect position dynamic calculation
  const boardRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const cleanupWheelRef = React.useRef<(() => void) | null>(null);

  const setViewportRef = React.useCallback((node: HTMLDivElement | null) => {
    if (cleanupWheelRef.current) {
      cleanupWheelRef.current();
      cleanupWheelRef.current = null;
    }
    
    (viewportRef as any).current = node;

    if (node) {
      let limitCooldown = false;
      const handleWheelEvent = (e: WheelEvent) => {
        e.preventDefault();
        const zoomStep = 0.05;
        setZoomScale(prev => {
          let next = prev + (e.deltaY < 0 ? zoomStep : -zoomStep);
          next = Math.round(next * 100) / 100;

          if (next >= 5.0) {
            if (!limitCooldown) {
              triggerToast('owl', '🔍 CHẠM TRẦN KÍNH LÚP', 'Phóng to cực hạn 500%! Code to như bánh xe bò rồi sếp ơi!', '🦖');
              limitCooldown = true;
              setTimeout(() => { limitCooldown = false; }, 3500);
            }
            return 5.0;
          }
          
          if (next <= 0.15) {
            if (!limitCooldown) {
              triggerToast('info', '🔍 TẦM NHÌN VŨ TRỤ', 'Thu nhỏ kịch sàn 15%! Sắp nhìn thấy cả sơ đồ tổng thể hệ sao rồi!', '🌌');
              limitCooldown = true;
              setTimeout(() => { limitCooldown = false; }, 3505);
            }
            return 0.15;
          }

          return next;
        });
      };

      node.addEventListener('wheel', handleWheelEvent, { passive: false });
      cleanupWheelRef.current = () => {
        node.removeEventListener('wheel', handleWheelEvent);
      };
    }
  }, [triggerToast]);

  const devRef = React.useRef<HTMLDivElement>(null);
  const nodeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  
  const [connections, setConnections] = React.useState<Array<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isDash?: boolean;
  }>>([]);
  
  const [nodeSizes, setNodeSizes] = React.useState<Record<string, { width: number; height: number }>>({});
  const [tick, setTick] = React.useState<number>(0);
  const triggerRenderTick = React.useCallback(() => {
    setTick(t => t + 1);
  }, []);

  const getConnectorPoints = (
    from: { x: number; y: number; w: number; h: number },
    to: { x: number; y: number; w: number; h: number }
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    let startX = from.x;
    let startY = from.y;
    let endX = to.x;
    let endY = to.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal dominated
      if (dx > 0) {
        startX = from.x + from.w / 2;
        endX = to.x - to.w / 2;
      } else {
        startX = from.x - from.w / 2;
        endX = to.x + to.w / 2;
      }
    } else {
      // Vertical dominated
      if (dy > 0) {
        startY = from.y + from.h / 2;
        endY = to.y - to.h / 2;
      } else {
        startY = from.y - from.h / 2;
        endY = to.y + to.h / 2;
      }
    }
    return { startX, startY, endX, endY };
  };

  const updatingConnectionsRef = React.useRef(false);
  const updateConnectionPaths = React.useCallback(() => {
    if (updatingConnectionsRef.current) return;
    updatingConnectionsRef.current = true;
    
    requestAnimationFrame(() => {
      updatingConnectionsRef.current = false;
      const container = boardRef.current;
      const devEl = devRef.current;
      if (!container || !devEl) return;
      
      const containerRect = container.getBoundingClientRect();
      const getCenterAndSize = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left + rect.width / 2 - containerRect.left) / zoomScale;
        const y = (rect.top + rect.height / 2 - containerRect.top) / zoomScale;
        return {
          x,
          y,
          w: rect.width / zoomScale,
          h: rect.height / zoomScale
        };
      };
      
      const list: Array<{ startX: number; startY: number; endX: number; endY: number; isDash?: boolean }> = [];
      const activeCommits = paginatedCommitsForSquash;
      const activeKeys = activeCommits.map(c => c.sha);
      
      if (activeKeys.length > 0) {
        const devNode = getCenterAndSize(devEl);
        
        // Map through all active commits and link to parents
        activeCommits.forEach((c) => {
          const currentEl = nodeRefs.current[c.sha];
          if (!currentEl) return;
          const currentMeta = getCenterAndSize(currentEl);
          
          if (c.parents && c.parents.length > 0) {
            c.parents.forEach((parentSha) => {
              const parentEl = nodeRefs.current[parentSha];
              if (parentEl) {
                const parentMeta = getCenterAndSize(parentEl);
                const pts = getConnectorPoints(currentMeta, parentMeta);
                
                const isCurrentSelected = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
                const isParentSelected = wizard.selectedCommits.includes(parentSha) || wizard.selectedCommits.length === 0;
                
                list.push({
                  startX: pts.startX,
                  startY: pts.startY,
                  endX: pts.endX,
                  endY: pts.endY,
                  isDash: !(isCurrentSelected && isParentSelected)
                });
              }
            });
          } else {
            // Sequential fallback for compatibility and live CLI support
            const idx = activeKeys.indexOf(c.sha);
            if (idx !== -1 && idx < activeKeys.length - 1) {
              const nextSha = activeKeys[idx + 1];
              const nextEl = nodeRefs.current[nextSha];
              if (nextEl) {
                const nextMeta = getCenterAndSize(nextEl);
                const pts = getConnectorPoints(currentMeta, nextMeta);
                
                const isCurrentSelected = wizard.selectedCommits.includes(c.sha) || wizard.selectedCommits.length === 0;
                const isNextSelected = wizard.selectedCommits.includes(nextSha) || wizard.selectedCommits.length === 0;
                
                list.push({
                  startX: pts.startX,
                  startY: pts.startY,
                  endX: pts.endX,
                  endY: pts.endY,
                  isDash: !(isCurrentSelected && isNextSelected)
                });
              }
            }
          }
        });
        
        // Connect develop HEAD
        const track0Commits = activeCommits.filter(c => c.track === 0);
        let targetDevConnectSha = track0Commits.length > 0 ? track0Commits[0].sha : null;
        if (!targetDevConnectSha) {
          targetDevConnectSha = activeKeys[activeKeys.length - 1];
        }
        
        const targetDevConnectEl = targetDevConnectSha ? nodeRefs.current[targetDevConnectSha] : null;
        if (targetDevConnectEl) {
          const targetNode = getCenterAndSize(targetDevConnectEl);
          const pts = getConnectorPoints(devNode, targetNode);
          list.push({
            startX: pts.startX,
            startY: pts.startY,
            endX: pts.endX,
            endY: pts.endY
          });
        }
      }
      
      setConnections(list);
    });
  }, [paginatedCommitsForSquash, wizard.selectedCommits, zoomScale, nodeWidth, resetKey, isGraphVertical]);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      updateConnectionPaths();
    });
    return () => cancelAnimationFrame(handle);
  }, [updateConnectionPaths, tick, isGraphVertical, resetKey]);

  React.useEffect(() => {
    window.addEventListener('resize', updateConnectionPaths);
    return () => {
      window.removeEventListener('resize', updateConnectionPaths);
    };
  }, [updateConnectionPaths]);

  // Handle Drag size resize event of node
  const handleResizeStart = (e: React.PointerEvent, sha: string, direction: 'w' | 'h' | 'both') => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const isExpanded = !!expandedNodes[sha];
    const startWidth = nodeSizes[sha]?.width ?? nodeWidth;
    const startHeight = nodeSizes[sha]?.height ?? (isExpanded ? 140 : 80);
    
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoomScale;
      const deltaY = (moveEvent.clientY - startY) / zoomScale;
      
      setNodeSizes(prev => {
        const currentWidth = prev[sha]?.width ?? nodeWidth;
        const currentHeight = prev[sha]?.height ?? (isExpanded ? 140 : 80);
        return {
          ...prev,
          [sha]: {
            width: direction === 'h' ? currentWidth : Math.max(120, Math.min(600, startWidth + deltaX)),
            height: direction === 'w' ? currentHeight : Math.max(60, Math.min(400, startHeight + deltaY))
          }
        };
      });
      triggerRenderTick();
    };
    
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const [isTouchOnly, setIsTouchOnly] = React.useState<boolean>(false);
  React.useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchOnly(isTouch);
  }, []);

  const touchStartDistance = React.useRef<number | null>(null);
  const touchStartScale = React.useRef<number>(1.0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartDistance.current = dist;
      touchStartScale.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchStartDistance.current;
      const targetScale = Math.min(2.0, Math.max(0.5, touchStartScale.current * ratio));
      setZoomScale(targetScale);
      updateConnectionPaths();
      triggerRenderTick();
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  // Log buffer for terminal with localStorage fallback
  const [logs, setLogs] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_logs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      '// Rebase Overlord Engine v0.3.5 activated.',
      '// Welcome aboard Nguyen Tran. Tone: Professional VN.'
    ];
  });

  // Add line to terminal
  const addLog = React.useCallback((line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${line}`]);
  }, []);

  // Fetch files changed for a given commit SHA
  const fetchCommitFiles = React.useCallback(async (sha: string) => {
    if (commitFiles[sha] || loadingFilesShas[sha]) {
      return;
    }
    setLoadingFilesShas(prev => ({ ...prev, [sha]: true }));
    try {
      const url = resolveApiUrl(`/api/commit-changes?sha=${sha}&simulation=${isSimulation}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch commit files');
      }
      const data = await res.json();
      setCommitFiles(prev => ({ ...prev, [sha]: data.files || [] }));
    } catch (err) {
      console.error('Error fetching commit files:', err);
      // Suppress error and put empty files so we don't loading forever
      setCommitFiles(prev => ({ ...prev, [sha]: [] }));
    } finally {
      setLoadingFilesShas(prev => ({ ...prev, [sha]: false }));
    }
  }, [commitFiles, loadingFilesShas, isSimulation]);

  // Animated Git Doctor states
  const [doctorProblem, setDoctorProblem] = React.useState<string | null>(null);
  const [doctorLoading, setDoctorLoading] = React.useState<boolean>(false);
  const [doctorDiagnosis, setDoctorDiagnosis] = React.useState<{
    dr_overlord: { explanation: string; mitigation: string };
    dr_compiler?: { explanation: string; mitigation: string };
    dr_schema?: { explanation: string; mitigation: string };
  } | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = React.useState<'overlord' | 'compiler' | 'schema'>('overlord');
  const [doctorError, setDoctorError] = React.useState<string | null>(null);

  // Simulated Anomalies State
  const [isDivergedSimulated, setIsDivergedSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_diverged') !== 'false';
    } catch (e) {
      return true;
    }
  });
  const [isDetachedHeadSimulated, setIsDetachedHeadSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_detached') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isStaleBaseSimulated, setIsStaleBaseSimulated] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('rebase_overlord_sim_stale') !== 'false';
    } catch (e) {
      return true;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_diverged', String(isDivergedSimulated));
    } catch (e) {}
  }, [isDivergedSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_detached', String(isDetachedHeadSimulated));
    } catch (e) {}
  }, [isDetachedHeadSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_sim_stale', String(isStaleBaseSimulated));
    } catch (e) {}
  }, [isStaleBaseSimulated]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_theme', theme);
    } catch (e) {}
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    }
  }, [theme]);

  // Side effects to seamlessly persist states inside localStorage on changes
  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_tone', tone);
    } catch (e) {}
  }, [tone]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_use_emoji', String(useEmoji));
    } catch (e) {}
  }, [useEmoji]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_is_simulation', String(isSimulation));
    } catch (e) {}
  }, [isSimulation]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_is_ai_enabled', String(isAiEnabled));
    } catch (e) {}
  }, [isAiEnabled]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_log_panel', String(showLogPanel));
    } catch (e) {}
  }, [showLogPanel]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_show_warnings_panel', String(showWarningsPanel));
    } catch (e) {}
  }, [showWarningsPanel]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_repo_state', JSON.stringify(repoState));
    } catch (e) {}
  }, [repoState]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_wizard', JSON.stringify(wizard));
    } catch (e) {}
  }, [wizard]);

  React.useEffect(() => {
    try {
      localStorage.setItem('rebase_overlord_logs', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  // Fetch metrics upon settings updates
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [checkingOutBranch, setCheckingOutBranch] = React.useState<string | null>(null);
  const handleRefresh = React.useCallback(async (overrideSim?: boolean) => {
    setIsRefreshing(true);
    try {
      const activeSim = overrideSim !== undefined ? overrideSim : isSimulation;
      addLog(`$ Refreshing git states (Simulation: ${activeSim}, Scenario: ${simScenarioId})...`);
      const url = resolveApiUrl(`/api/git-status?simulation=${activeSim}&scenario=${simScenarioId}`);
      const res = await fetch(url);
      
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || contentType.includes('text/html')) {
        throw new Error(`Máy chủ trả về trang HTML thay vì JSON (Code ${res.status}). Có thể bạn đang chạy trên Vercel/Static Host mà chưa bật Express Backend.`);
      }
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Đầu ra API lỗi, không chứa JSON hợp lệ. Response: "${text.substring(0, 50)}..."`);
      }

      setRepoState(data);
      setBackendStatus('connected');

      // Align wizard state if a rebase was aborted or finished outside of the app
      if (!data.rebaseInProgress) {
        setWizard(prev => {
          if (prev.status === 'paused_conflict' || prev.status === 'running') {
            // Needs to log within state update, but we can do it safely
            setTimeout(() => {
              addLog(`🔙 Wizard synchronized: Rebase progress was terminated outside the application.`);
            }, 50);
            return {
              ...prev,
              status: 'idle',
              step: 0
            };
          }
          return prev;
        });
      }
      
      // Auto-increment checkout stats locally on initial fetch
      if (data.isValid) {
        addLog(`✓ Git states extracted cleanly for path: ${data.repoPath}`);
      } else {
        addLog(`! Path does not contain a valid Git repository.`);
      }
    } catch (err: any) {
      console.error(err);
      addLog(`⚠️ Cảnh báo kết nối: ${err.message}`);
      
      // Auto toggle simulation on to let interface keep working
      if (overrideSim === undefined && !isSimulation) {
        setIsSimulation(true);
        addLog(`🤖 Đã tự động kích hoạt "Simulation Playground" do Backend không phản hồi chính xác JSON.`);
      }
      setBackendStatus('unreachable');
    } finally {
      setIsRefreshing(false);
    }
  }, [isSimulation, simScenarioId, addLog]);

  React.useEffect(() => {
    if (isSimulation) {
      if (simScenarioId === 'linear') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'nonlinear') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'rewrite') {
        setIsDivergedSimulated(true);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'stale') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(true);
        setIsDetachedHeadSimulated(false);
      } else if (simScenarioId === 'detached') {
        setIsDivergedSimulated(false);
        setIsStaleBaseSimulated(false);
        setIsDetachedHeadSimulated(true);
      }
      handleRefresh();
    }
  }, [simScenarioId, isSimulation]);

  const quietRefresh = React.useCallback(async () => {
    try {
      const url = resolveApiUrl(`/api/git-status?simulation=false`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRepoState(data);

        // Align wizard state in background if rebase stopped externally
        if (!data.rebaseInProgress) {
          setWizard(prev => {
            if (prev.status === 'paused_conflict' || prev.status === 'running') {
              setTimeout(() => {
                addLog(`🔙 Background auto-sync: Rebase progress was terminated outside the application.`);
              }, 50);
              return {
                ...prev,
                status: 'idle',
                step: 0
              };
            }
            return prev;
          });
        }
      }
    } catch (err) {
      // quiet fail
    }
  }, []);

  // Background polling during real active rebase operations to track external aborts or progress
  React.useEffect(() => {
    if (isSimulation) return;
    
    const shouldPoll = repoState.rebaseInProgress || wizard.status === 'paused_conflict' || wizard.status === 'running';
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      quietRefresh();
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSimulation, repoState.rebaseInProgress, wizard.status, quietRefresh]);

  // Sync statistics from node server
  const fetchStats = async () => {
    try {
      const res = await fetch(resolveApiUrl('/api/stats'));
      if (res.ok) {
        const data = await res.json();
        setStats({
          rebaseCount: data.rebase_count !== undefined ? data.rebase_count : (data.rebaseCount ?? 0),
          firstRun: data.first_run !== undefined ? data.first_run : (data.firstRun ?? ''),
          lastRun: data.last_run !== undefined ? data.last_run : data.lastRun
        });
      }
    } catch {
      // Fallback
    }
  };

  const verifyInstallationWithMetadata = React.useCallback(async (triggerManualPrompt = false) => {
    try {
      const res = await fetch(resolveApiUrl('/api/update/metadata'));
      if (res.ok) {
        const metadata = await res.json();
        // Fallback checks
        const metadataVer = (metadata.version || '1.12.0').replace(/^v/, '');
        const stateVer = appVersion.replace(/^v/, '');
        
        if (metadataVer !== stateVer) {
          setIsVersionRed(true);
          setVerifyBtnVisible(true);
          
          const errMsg = `Update failed/corrupted: Version mismatch! App state is v${appVersion}, but read-only metadata has v${metadata.version || '1.12.0'}.`;
          addLog(`❌ [ERROR] ${errMsg}`);
          console.error(errMsg);
          
          try {
            await fetch(resolveApiUrl('/api/log-error'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: 'Update failed: Local version mismatch at filesystem level',
                version: appVersion,
                expected: metadata.version || '1.12.0'
              })
            });
          } catch (_) {}
          
          if (triggerManualPrompt) {
            triggerToast(
              'error',
              tone === TranslationTone.ENGLISH ? 'Verification Failed' : 'Xác thực thất bại',
              tone === TranslationTone.ENGLISH
                ? `Disagreement detected! State claims v${appVersion} but physical metadata verified v${metadata.version || '1.12.0'}.`
                : `Phát hiện xung đột! Phiên bản v${appVersion} không khớp dữ liệu metadata v${metadata.version || '1.12.0'}.`,
              '🛑'
            );
          }
        } else {
          setIsVersionRed(false);
          setVerifyBtnVisible(false);
          if (triggerManualPrompt) {
            triggerToast(
              'success',
              tone === TranslationTone.ENGLISH ? 'Verification Passed' : 'Xác thực thành công',
              tone === TranslationTone.ENGLISH ? 'Your local space and binary metadata are in perfect alignment!' : 'Hệ thống phiên bản và dữ liệu tệp tin của bạn đang đồng bộ tương thích gốc đạt 100%!',
              '✓'
            );
            addLog(`✓ [VERIFY] Binary verification passed successfully.`);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to verify installation with metadata:', err);
    }
  }, [appVersion, addLog, tone, triggerToast]);

  // Dynamically probe update version on mount
  React.useEffect(() => {
    const probeVersion = async () => {
      let probeOk = false;
      try {
        const url = resolveApiUrl('/api/update/check');
        const res = await fetch(url);
        if (res.ok) {
          probeOk = true;
          const data = await res.json();
          
          // Feature 1: Version mismatch logic
          if (data.currentVersion) {
            const localExpected = localStorage.getItem('rebase_overlord_patch_version');
            if (localExpected && localExpected !== data.currentVersion) {
              setUpdateMismatchError('Update failed: Local version mismatch');
              addLog('❌ Update check failed: Local expected version differs from server version.');
            } else {
              setUpdateMismatchError(null);
            }

            setAppVersion(data.currentVersion);
            localStorage.setItem('rebase_overlord_patch_version', data.currentVersion);
            
            // If we are upgraded relative to 1.12.0, celebrate!
            const cleanVer = data.currentVersion.replace(/^v/, '');
            const parts = cleanVer.split('.').map((v: string) => parseInt(v, 10) || 0);
            const isLatest = parts[0] > 1 || (parts[0] === 1 && (parts[1] > 12 || (parts[1] === 12 && parts[2] > 0)));
            if (isLatest) {
              const hasAnnounced = localStorage.getItem('rebase_overlord_announced_v15');
              if (!hasAnnounced) {
                setTimeout(() => {
                  triggerToast(
                    'success',
                    tone === TranslationTone.ENGLISH ? `🎉 UPGRADED TO v${data.currentVersion}!` : `🎉 ĐÃ NÂNG CẤP LÊN v${data.currentVersion}!`,
                    tone === TranslationTone.ENGLISH 
                      ? 'Congratulations! The advanced features (AI Doctor Pro, Reflog Diagnostics, and interactive recovery) are fully unlocked.'
                      : `Chúc mừng! Bạn đã nâng cấp thành công lên phiên bản v${data.currentVersion}. Toàn bộ tính năng cao cấp (AI Doctor Pro, Khôi phục Reflog, Chẩn đoán offline) đã được kích hoạt!`,
                    '🚀'
                  );
                  localStorage.setItem('rebase_overlord_announced_v15', 'true');
                }, 2000);
              }
            } else {
              localStorage.removeItem('rebase_overlord_announced_v15');
            }
          }

          // Feature 2: Check for exit error code on load
          if (data.lastUpdateExitCode !== null && data.lastUpdateExitCode !== 0) {
            setUpdateFailedModal({
              isOpen: true,
              title: tone === TranslationTone.ENGLISH ? 'System Update Failed' : 'Nâng cấp hệ thống thất bại',
              message: data.lastUpdateError || (tone === TranslationTone.ENGLISH 
                ? 'The background update process reported a non-zero exit code or failed to write new binaries.' 
                : 'Tiến trình nâng cấp/ghi tệp tin của bộ cài đặt thực tế đã thất bại.'),
              exitCode: data.lastUpdateExitCode
            });
            addLog(`❌ [ALERT] Last update process failed with exit code ${data.lastUpdateExitCode}!`);
          }
        }
      } catch (err) {
        console.warn('Failed to dynamically probe version from App.tsx:', err);
      }
      
      // Feature 1: Trigger banner if update check returns an error (or failed to fetch)
      if (!probeOk) {
        setUpdateMismatchError('Update failed: Local version mismatch');
        addLog('❌ Update check failed: Update server API reported error or could not be reached.');
      }

      // Feature 3: Compare with metadata file on load
      verifyInstallationWithMetadata();
    };
    probeVersion();
  }, [tone, triggerToast, addLog, verifyInstallationWithMetadata]);

  // Trigger ee_night_owl Easter Egg on load if late
  React.useEffect(() => {
    const hr = new Date().getHours();
    if (hr >= 23 || hr <= 4) {
      const msg = translate('ee_night_owl', tone);
      const title = tone === TranslationTone.ENGLISH ? "🌙 Night Owl Active" : "🌙 Chế độ Cú Đêm";
      const timer = setTimeout(() => {
        triggerToast('owl', title, msg, '🦉');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tone]);

  // Watch stats.rebaseCount for milestones
  const prevRebaseCountRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    const count = stats.rebaseCount ?? 0;
    if (prevRebaseCountRef.current !== null && count > prevRebaseCountRef.current) {
      if (count === 1 || count % 5 === 0) {
        let eeKey = "ee_rebase_milestone";
        if (tone === TranslationTone.TOXIC) {
          if (count >= 30) {
            eeKey = "vn_toxic_level_3";
          } else if (count >= 15) {
            eeKey = "vn_toxic_level_2";
          } else {
            eeKey = "vn_toxic_level_1";
          }
        }
        const titleLine = tone === TranslationTone.ENGLISH ? "🏆 REBASE MILESTONE!" : "🏆 CỘT MỐC SQUASH CHIẾN THẦN!";
        const translatedMsg = translate(eeKey, tone, { count });
        triggerToast('milestone', titleLine, translatedMsg, '🏆');
      }
    }
    prevRebaseCountRef.current = count;
  }, [stats.rebaseCount, tone]);

  React.useEffect(() => {
    handleRefresh();
    fetchStats();
  }, [isSimulation, handleRefresh]);

  // Watch branch name to suggest a backup branch
  React.useEffect(() => {
    if (repoState.currentBranch) {
      const cleanBranch = repoState.currentBranch.replace(/\//g, '_');
      setWizard(w => ({
        ...w,
        backupBranchName: `backup/rebase-overlord-${cleanBranch}`
      }));
    }
  }, [repoState.currentBranch]);

  // Safe Execute updates of wizard properties
  const handleUpdateWizard = (updates: Partial<WizardState>) => {
    setWizard(prev => ({ ...prev, ...updates }));
    
    // Add logging hooks
    if (updates.step !== undefined) {
      addLog(`[WIZARD] Moved to step ${updates.step + 1}: ${getStepLabel(updates.step)}`);
    }
    if (updates.baseBranch) {
      addLog(`$ git merge-base ${updates.baseBranch} HEAD`);
    }
    if (updates.doFetch !== undefined) {
      addLog(`[CONFIG] Fetch Origin toggled to: ${updates.doFetch}`);
    }
  };

  const getStepLabel = (step: number) => {
    switch(step) {
      case 0: return 'Base Branch Name Input';
      case 1: return 'Sync / Fetch Prompt';
      case 2: return 'Commit Squash checklists selection';
      case 3: return 'Safe Backup configuration';
      case 4: return 'Rebase/Squash execution engine';
      case 5: return 'Unified commit message editing';
      case 6: return 'Verify rebase integrity & local consistency checks';
      case 7: return 'Finalize check with Push optionality';
      default: return 'Idle';
    }
  };

  // Execute wizard rebase triggering breakpoints simulation
  const handleExecuteWizardRebase = async () => {
    handleUpdateWizard({ status: 'running' });
    
    if (isSimulation) {
      addLog(`$ git checkout -b ${wizard.backupBranchName}`);
      addLog(`✓ Backup created successfully: ${wizard.backupBranchName}`);
      addLog(`$ git rebase -i ${wizard.baseBranch}`);

      // Wait 2 seconds to simulate conflicts breakpoint
      setTimeout(() => {
        // Setup conflict files state dynamically inside app
        const activeConflicts: ConflictFile[] = [
          {
            filepath: 'src/routes/payment.ts',
            status: 'conflicted',
            conflictsCount: 2,
            contentBefore: [
              'import { Request, Response, Router } from "express";',
              'import Stripe from "stripe";',
              'import { logger } from "../utils/logger";',
              'import { getStripeClient } from "../lib/stripe";',
              'import { authMiddleware } from "../middleware/auth";',
              '',
              'const router = Router();',
              '',
              '// Retrieve payment dashboard analytics',
              'router.get("/dashboard", authMiddleware, async (req: Request, res: Response) => {',
              '  try {',
              '    const userId = req.user?.id;',
              '    logger.info(`Fetching dashboard metrics for user: ${userId}`);',
              '    ',
              '    // Fetch user subscription details',
              '    const stripe = getStripeClient();',
              '    const payments = await stripe.paymentIntents.list({ limit: 10 });',
              '    ',
              '    res.status(200).json({',
              '      status: "success",',
              '      count: payments.data.length,',
              '      recent: payments.data.map(p => ({',
              '        id: p.id,',
              '        amount: p.amount / 100,',
              '        currency: p.currency,',
              '        status: p.status,',
              '      }))',
              '    });',
              '  } catch (err: any) {',
              '    logger.error("Failed to query dashboard database", err);',
              '    res.status(500).json({ error: "INTERNAL_DATABASE_ERR" });',
              '  }',
              '});',
              '',
              '// CREATE CHARGE ENDPOINT',
              'router.post("/charge", authMiddleware, async (req: Request, res: Response) => {',
              '  const { amount, currency, promoCode, paymentMethodId } = req.body;',
              '  const stripe = getStripeClient();',
              '  ',
              '  logger.info(`Starting transaction intake for manual charge: ${amount} ${currency}`);',
              '',
              '<<<<<<< HEAD',
              '  // Alex Nguyen: Add stripe secure charge webhook, telemetry tracking, and retry logic',
              '  let finalAmount = amount;',
              '  if (promoCode === "REBASE_WARRIOR") {',
              '    finalAmount = Math.max(50, Math.round(amount * 0.8)); // 20% discount, min charge 50 cents',
              '    logger.info(`Promo code applied: REBASE_WARRIOR. Discounted amount: ${finalAmount}`);',
              '  }',
              '',
              '  try {',
              '    const paymentIntent = await stripe.paymentIntents.create({',
              '      amount: finalAmount,',
              '      currency,',
              '      payment_method: paymentMethodId,',
              '      confirm: true,',
              '      automatic_payment_methods: { enabled: true, allow_redirects: "never" },',
              '      metadata: { ',
              '        integration: "rebase-overlord-secured",',
              '        developer: "Alex Nguyen",',
              '        telemetry_rate: "ultra-high"',
              '      }',
              '    });',
              '',
              '    res.json({ ',
              '      success: true, ',
              '      clientSecret: paymentIntent.client_secret, ',
              '      transactionId: paymentIntent.id,',
              '      amountApplied: finalAmount',
              '    });',
              '=======',
              '  // Sarah Connor: Bump rate-limits, add deep telemetry handlers & legacy pipeline',
              '  let rateLimitWindow = 60 * 1000; // 1 minute',
              '  let maxRequests = 10;',
              '  logger.info(`Asserting security rate limiting window of ${rateLimitWindow}ms with max ${maxRequests} requests.`);',
              '',
              '  try {',
              '    const charge = await stripe.charges.create({',
              '      amount: amount,',
              '      currency,',
              '      source: paymentMethodId,',
              '      description: "Legacy charges backup pipeline for active CRM sync",',
              '      metadata: {',
              '        crm_id: req.body.crmId || "N/A",',
              '        developer: "Sarah Connor"',
              '      }',
              '    });',
              '',
              '    res.json({ ',
              '      success: true, ',
              '      charge: charge.id,',
              '      telemetryId: req.body.telemetryId || "legacy-fallback-id",',
              '      receiptUrl: charge.receipt_url',
              '    });',
              '>>>>>>> develop',
              '  } catch (err: any) {',
              '    logger.error("Transaction pipeline crashed!", err);',
              '    res.status(400).json({ error: err.message || "TRANSACTION_FAILED" });',
              '  }',
              '});',
              '',
              '// WEBHOOK DISPATCHER',
              '<<<<<<< HEAD',
              'router.post("/webhooks/stripe", async (req: Request, res: Response) => {',
              '  const sig = req.headers["stripe-signature"] as string;',
              '  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_V2;',
              '  const stripe = getStripeClient();',
              '',
              '  if (!endpointSecret) {',
              '    logger.warn("Webhook system not fully initialized - STRIPE_WEBHOOK_SECRET_V2 missing!");',
              '    return res.status(500).send("Webhook config error");',
              '  }',
              '',
              '  let event: Stripe.Event;',
              '  try {',
              '    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);',
              '  } catch (err: any) {',
              '    logger.error(`Webhook signature validation failed v2: ${err.message}`);',
              '    return res.status(400).send(`Webhook Error: ${err.message}`);',
              '  }',
              '',
              '  // Handle high priority payment webhook types',
              '  if (event.type === "payment_intent.succeeded") {',
              '    const pi = event.data.object as Stripe.PaymentIntent;',
              '    logger.info(`✨ Webhook Success: payment_intent.succeeded! ID: ${pi.id}`);',
              '    // database sync routine goes here',
              '  }',
              '',
              '  res.json({ received: true, version: "v2.0-alex" });',
              '});',
              '=======',
              'router.post("/webhook/stripe", async (req: Request, res: Response) => {',
              '  const sig = req.headers["stripe-signature"] as string;',
              '  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;',
              '  const stripe = getStripeClient();',
              '',
              '  let event: Stripe.Event;',
              '  try {',
              '    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);',
              '  } catch (err: any) {',
              '    logger.error(`Webhook signature validation failed legacy: ${err.message}`);',
              '    return res.status(400).send(`Webhook Error: ${err.message}`);',
              '  }',
              '',
              '  if (event.type === "charge.succeeded") {',
              '    const charge = event.data.object as Stripe.Charge;',
              '    logger.info(`Legacy Webhook Success: charge.succeeded! ID: ${charge.id}`);',
              '  }',
              '',
              '  res.json({ received: true, version: "v1.2-legacy-sarah" });',
              '});',
              '>>>>>>> develop',
              '',
              'export default router;'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'src/services/stripe.ts',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              'import Stripe from "stripe";',
              'import { logger } from "../utils/logger";',
              '',
              'let stripeInstance: Stripe | null = null;',
              '',
              '/**',
              ' * Lazy initialization of the Stripe SDK Client to prevent startup crashes.',
              ' * Resolves API key securely from environment variables.',
              ' */',
              'export function getStripeClient(): Stripe {',
              '  if (stripeInstance) {',
              '    return stripeInstance;',
              '  }',
              '',
              '<<<<<<< HEAD',
              '  const apiKey = process.env.STRIPE_SECRET_KEY;',
              '  if (!apiKey) {',
              '    logger.error("FATAL: STRIPE_SECRET_KEY is undefined securely at module loading.");',
              '    throw new Error("Missing STRIPE_SECRET_KEY runtime environment variable");',
              '  }',
              '',
              '  logger.info("Initializing Stripe SDK v12 in Secure Mode - Server Side proxy");',
              '  stripeInstance = new Stripe(apiKey, {',
              '    apiVersion: "2023-10-16",',
              '    typescript: true,',
              '    maxNetworkRetries: 3,',
              '    timeout: 10000,',
              '    appInfo: {',
              '      name: "Rebase Overlord Gateway",',
              '      version: "2.1.0-alpha"',
              '    }',
              '  });',
              '=======',
              '  const legacyKey = process.env.STRIPE_LEGACY_KEY || process.env.STRIPE_SECRET_KEY;',
              '  if (!legacyKey) {',
              '    logger.warn("Warning: STRIPE_SECRET_KEY is empty. Initializing with mock token generator.");',
              '  }',
              '',
              '  logger.info("Initializing Stripe Client in Legacy Compatibility Mode");',
              '  stripeInstance = new Stripe(legacyKey || "mock-inactive-token", {',
              '    apiVersion: "2022-11-15",',
              '    typescript: true,',
              '    maxNetworkRetries: 1,',
              '    timeout: 30000',
              '  });',
              '>>>>>>> develop',
              '',
              '  return stripeInstance;',
              '}',
              '',
              '/**',
              ' * Validate active customer session',
              ' */',
              'export async function validateCustomerSession(customerId: string): Promise<boolean> {',
              '  const stripe = getStripeClient();',
              '  try {',
              '    const customer = await stripe.customers.retrieve(customerId);',
              '    return !customer.deleted;',
              '  } catch (err) {',
              '    logger.warn(`Stripe customer validation failed silently for ${customerId}`);',
              '    return false;',
              '  }',
              '}'
            ].join('\n'),
            contentAfter: ''
          },
          {
            filepath: 'config/keys.json',
            status: 'conflicted',
            conflictsCount: 1,
            contentBefore: [
              '{',
              '  "project_id": "rebase-overlord-prod",',
              '  "environment": "production",',
              '  "version": "2.4.0",',
              '<<<<<<< HEAD',
              '  "api": {',
              '    "host": "https://api.rebaseoverlord.dev",',
              '    "timeout_ms": 5000,',
              '    "ssl_only": true,',
              '    "security_headers": {',
              '      "x_frame_options": "DENY",',
              '      "content_security_policy": "default-src \'self\'"',
              '    }',
              '  },',
              '  "database": {',
              '    "pool_max": 25,',
              '    "pool_min": 5,',
              '    "idle_timeout_ms": 30000',
              '  }',
              '=======',
              '  "api": {',
              '    "host": "https://legacy-gateway.internal.net",',
              '    "timeout_ms": 15000,',
              '    "ssl_only": false,',
              '    "legacy_endpoints": true',
              '  },',
              '  "database": {',
              '    "pool_max": 10,',
              '    "pool_min": 1,',
              '    "idle_timeout_ms": 10000',
              '  }',
              '>>>>>>> develop',
              '}'
            ].join('\n'),
            contentAfter: ''
          }
        ];

        setRepoState(prev => ({
          ...prev,
          rebaseInProgress: true,
          conflicts: activeConflicts
        }));

        handleUpdateWizard({ status: 'paused_conflict' });
        addLog(`⚠️ CONFLICTS DETECTED during interactive rebase. Rebase paused.`);
        addLog(`  conflict: src/routes/payment.ts (2 conflicts)`);
        addLog(`  conflict: src/services/stripe.ts (1 conflict)`);
        addLog(`  conflict: config/keys.json (1 conflict)`);
        addLog(`// Please use the interactive 3-Way Merge solver below to rescue your branches!`);
      }, 2000);
    } else {
      // REAL LIVE GIT REBASE WORKFLOW
      try {
        if (wizard.doBackup && wizard.backupBranchName) {
          addLog(`$ git checkout -b ${wizard.backupBranchName}`);
          const backupRes = await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: `git checkout -b ${wizard.backupBranchName}` })
          });
          const backupData = await backupRes.json();
          if (backupRes.ok && backupData.code === 0) {
            addLog(`✓ Created backup branch: ${wizard.backupBranchName}`);
          } else {
            addLog(`⚠️ Backup branch warning: ${backupData.stderr || 'Branch might already exist.'}`);
          }
        }

        addLog(`$ git rebase ${wizard.baseBranch}`);
        const rebaseRes = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git rebase ${wizard.baseBranch}` })
        });
        const rebaseData = await rebaseRes.json();
        
        // Refresh the actual Git state right away
        addLog(`$ Refreshing repository status to fetch conflicts...`);
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false`);
        const refreshRes = await fetch(refreshUrl);
        if (refreshRes.ok) {
          const refreshedRepoState = await refreshRes.json();
          setRepoState(refreshedRepoState);

          if (rebaseData.code === 0) {
            addLog(`✓ Rebase completed successfully without any conflicts!`);
            handleUpdateWizard({ status: 'completed', step: 5 });
          } else {
            if (refreshedRepoState.rebaseInProgress) {
              handleUpdateWizard({ status: 'paused_conflict' });
              addLog(`⚠️ CONFLICT DETECTED during real rebase. Please use the Conflict Solver below.`);
            } else {
              addLog(`❌ Rebase failed to proceed: ${rebaseData.stderr || 'Unknown Git error'}`);
              handleUpdateWizard({ status: 'idle' });
            }
          }
        } else {
          addLog(`❌ Failed to retrieve git status after rebase execution`);
          handleUpdateWizard({ status: 'idle' });
        }
      } catch (err: any) {
        addLog(`❌ Network thread exception: ${err.message}`);
        handleUpdateWizard({ status: 'idle' });
      }
    }
  };

  // Advanced Reflog Rescue - injects recovered dangling commit node directly into the branch timeline
  const handleRescueCommit = React.useCallback((sha: string, message: string, author: string, date: string) => {
    addLog(`$ git reflog --date=relative`);
    addLog(`$ git cherry-pick ${sha}`);
    addLog(`✓ Reflog Rescue success: Recovered dangling commit ${sha}`);
    
    // Inject the rescued commit at the top of the timeline!
    setRepoState(prev => {
      // Avoid duplicate insertion
      if (prev.commits.some(c => c.sha === sha)) return prev;

      const rescuedNode: Commit = {
        sha,
        author,
        date,
        message,
        type: 'feat',
        selected: true,
        parents: prev.commits.length > 0 ? [prev.commits[0].sha] : [],
        track: 1
      };

      // Put rescued node at the front of the commit list so it renders in the SVG graph immediately
      return {
        ...prev,
        commits: [rescuedNode, ...prev.commits]
      };
    });

    triggerToast(
      'success',
      tone === TranslationTone.ENGLISH ? '🎉 COMMIT RESCUED LIVE!' : '🎉 CỨU HỘ VỀ NHÁNH THÀNH CÔNG!',
      tone === TranslationTone.ENGLISH
        ? `Commit ${sha} ("${message}") was successfully retrieved from reflog history.`
        : `Commit ${sha} ("${message}") đã được cứu khỏi ngục tối Reflog và khôi phục về sơ đồ lực lượng.`,
      '⚡'
    );
  }, [tone, triggerToast, addLog]);

  // Conflict resolved signal from child solver click
  const handleResolveFile = async (filepath: string, resolvedContent: string) => {
    if (isSimulation) {
      setRepoState(prev => {
        const updated = prev.conflicts.map(c => 
          c.filepath === filepath ? { ...c, isResolved: true, resolvedContent } : c
        );
        return { ...prev, conflicts: updated };
      });

      addLog(`✓ Resolved conflict lines in: ${filepath}`);
      addLog(`$ git add ${filepath}`);
    } else {
      try {
        addLog(`✏️ Saving resolved content and running git add for: ${filepath}...`);
        const res = await fetch(resolveApiUrl('/api/save-resolved-file'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filepath, content: resolvedContent })
        });
        if (res.ok) {
          addLog(`✓ Content saved and git add executed cleanly for: ${filepath}`);
          setRepoState(prev => {
            const updated = prev.conflicts.map(c => 
              c.filepath === filepath ? { ...c, isResolved: true, resolvedContent } : c
            );
            return { ...prev, conflicts: updated };
          });
        } else {
          const errMsg = await safeParseError(res, 'Failed to save merge output');
          addLog(`❌ Save merge failed: ${errMsg}`);
          alert(`Lỗi lưu gộp file: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`❌ Network thread exception: ${err.message}`);
      }
    }
  };

  // Complete rebase recovery and return home safely
  const handleCompleteRecovery = async () => {
    if (isSimulation) {
      addLog(`$ git rebase --continue`);
      addLog(`✓ Rebase completed successfully! Squashed ${wizard.selectedCommits.length} commits.`);
      
      // Save locally
      setRepoState(prev => ({
        ...prev,
        rebaseInProgress: false,
        conflicts: []
      }));

      handleUpdateWizard({ status: 'completed', step: 5 });

      // Update session count
      try {
        const incrementRes = await fetch(resolveApiUrl('/api/stats/increment'), { method: 'POST' });
        if (incrementRes.ok) {
          const d = await incrementRes.json();
          setStats({
            rebaseCount: d.rebase_count !== undefined ? d.rebase_count : (d.rebaseCount ?? 0),
            firstRun: d.first_run !== undefined ? d.first_run : (d.firstRun ?? ''),
            lastRun: d.last_run !== undefined ? d.last_run : d.lastRun
          });
        }
      } catch {
        setStats(prev => ({ ...prev, rebaseCount: prev.rebaseCount + 1 }));
      }
    } else {
      try {
        addLog(`$ git -c core.editor=true rebase --continue`);
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git -c core.editor=true rebase --continue' })
        });
        const data = await res.json();
        
        // Refresh git status to see if completed or another conflict occurred
        const refreshUrl = resolveApiUrl(`/api/git-status?simulation=false`);
        const refreshRes = await fetch(refreshUrl);
        if (refreshRes.ok) {
          const refreshedRepoState = await refreshRes.json();
          setRepoState(refreshedRepoState);

          if (refreshedRepoState.rebaseInProgress) {
            addLog(`🚧 Rebase paused at next commit conflicts. Please continue resolving conflicts below.`);
          } else {
            addLog(`✓ Real Git rebase completed successfully on disk!`);
            handleUpdateWizard({ status: 'completed', step: 5 });
            
            // Increment statistics
            try {
              const incrementRes = await fetch(resolveApiUrl('/api/stats/increment'), { method: 'POST' });
              if (incrementRes.ok) {
                const d = await incrementRes.json();
                setStats({
                  rebaseCount: d.rebase_count !== undefined ? d.rebase_count : (d.rebaseCount ?? 0),
                  firstRun: d.first_run !== undefined ? d.first_run : (d.firstRun ?? ''),
                  lastRun: d.last_run !== undefined ? d.last_run : d.lastRun
                });
              }
            } catch {
              // Ignore stats increments issues
            }
          }
        }
      } catch (err: any) {
        addLog(`❌ Failed executing rebase --continue: ${err.message}`);
      }
    }
  };

  // Reset/Abort wizard flow
  const handleResetWizard = async () => {
    // Trigger ee_rage_quit Easter Egg if they are already far into the flow
    if (wizard.step >= 3) {
      const rageQuitMsg = translate('ee_rage_quit', tone);
      const title = tone === TranslationTone.ENGLISH ? "🛑 Flow Aborted" : "🛑 Hủy ngang xương (Rage Quit)";
      triggerToast('rage', title, rageQuitMsg, '😡');
    }

    if (isSimulation) {
      addLog(`$ git rebase --abort`);
      addLog(`🔙 Wizard reset. Rebase process aborted cleanly.`);
      
      setRepoState(prev => ({
        ...prev,
        rebaseInProgress: false,
        conflicts: []
      }));
    } else {
      try {
        addLog(`$ git rebase --abort`);
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git rebase --abort' })
        });
        const data = await res.json();
        addLog(`🔙 Real Rebase Aborted. Code ${data.code}`);
        handleRefresh(false);
      } catch (err: any) {
        addLog(`❌ Failed execution rebase --abort: ${err.message}`);
      }
    }

    setWizard({
      step: 0,
      baseBranch: 'develop',
      doFetch: true,
      detectedType: 'clean',
      detectedReason: 'Nhánh gọn gàng, không trùng lặp commits',
      historyType: 'clean',
      basePoint: '',
      commitTotal: 0,
      selectedCommits: [],
      doBackup: true,
      backupBranchName: '',
      finalMsg: 'feat: add payment intent and webhook handles',
      autoPush: false,
      status: 'idle'
    });
  };

  // Offline diagnostic helpers to bypass AI API calls and save cost
  const offlineAnomalies = {
    dirty_working_tree: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Local working tree contains modifications that have not been tracked or committed. This locks important branch moves or rebase replays which require a clean tree register.",
        mitigation: "Either stash away your temporary changes using 'git stash' or discard all uncommitted edits via 'git checkout . && git clean -fd'."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Có các tệp tin trong thư mục làm việc đã bị sửa đổi nhưng chưa được lưu trữ (commit hoặc stash). Điều này ngăn cản quá trình chuyển nhánh hoặc Rebase Git an toàn.",
        mitigation: "Sơ cứu nhanh: Chạy 'git stash' để cất giữ tạm thời, hoặc chạy 'git checkout . && git clean -fd' để dọn dẹp sạch sẽ toàn bộ thay đổi chưa commit."
      }
    },
    diverged_branch: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Your local branch and the remote origin tracking branch have diverged. Both contain independent commits that do not exist on the other.",
        mitigation: "Use 'git pull --rebase' to fetch remote commits and place your local commits nicely on top, or do a 'git push --force-with-lease' if you are sure your local branch is the source of truth."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Nhánh của bạn ở máy tính của bạn và ở máy chủ (remote server) đang bị 'lệch pha chéo' (diverged). Cả hai đều có commit mới riêng.",
        mitigation: "Giải pháp: Chạy 'git pull --rebase' để kéo dồn commit máy chủ và phát lại commit local lên đầu; hoặc bấm 'force push' nếu bạn tuyệt đối tin tưởng code dưới máy."
      }
    },
    detached_head: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] You are in a 'Detached HEAD' state. You are pointing directly to a specific commit timeline hash instead of an active branch container.",
        mitigation: "Create a temporary safety rescue branch via 'git checkout -b recovery/detached-rescue' to preserve any new commits you write from being pruned by Git's garbage collection."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Bạn đang rơi vào trạng thái 'Detached HEAD' (đầu rời neo). Bạn đang trỏ trực tiếp vào một mã băm commit cụ thể thay vì một nhánh.",
        mitigation: "Biện pháp cấp cứu: Tạo một nhánh mới an toàn ngay bằng lệnh 'git checkout -b recovery/detached-rescue' để bảo tồn các thử nghiệm mới viết."
      }
    },
    stale_base_branch: {
      english: {
        explanation: "[OFFLINE Fallback - AI Assistant is Disabled (Cost Saved)] Your reference base branch (e.g. develop or master) on your local computer is outdated compared to the remote origin registry.",
        mitigation: "Trigger a remote synchronization fetch and pull updates using 'git fetch origin && git checkout <base> && git pull origin <base>' to avoid massive rebasing conflicts on stale roots."
      },
      vietnamese: {
        explanation: "[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] Nhánh gốc tham chiếu của bạn ở local nằm tụt lại quá sâu so với remote server. Rebase trên nền một nhánh mốc meo lỗi thời sẽ gây ra xung đột cực lớn.",
        mitigation: "Sơ cứu khẩn cấp: Đồng bộ và cập nhật nhánh base bằng chuỗi lệnh 'git fetch origin && git checkout base && git pull origin base' để lấy cập nhật mới nhất từ nhánh gốc."
      }
    }
  };

  // AI Git Doctor Diagnostic and self-healing controls
  const handleDiagnoseProblem = async (problemType: string) => {
    setDoctorProblem(problemType);
    setDoctorLoading(true);
    setDoctorDiagnosis(null);
    setDoctorError(null);

    const cacheKey = `${problemType}_${tone}`;
    let cachedData: any = null;
    try {
      const cachedString = localStorage.getItem('rebase_overlord_doctor_cache');
      if (cachedString) {
        const cacheStore = JSON.parse(cachedString);
        if (cacheStore[cacheKey]) {
          cachedData = cacheStore[cacheKey];
        }
      }
    } catch (e) {
      console.warn("Failed to read doctor cache", e);
    }

    if (cachedData) {
      setTimeout(() => {
        const isEnglish = tone === TranslationTone.ENGLISH;
        // Parse into multi-expert shape, fallback gracefully
        const resolvedCache = {
          dr_overlord: {
            explanation: (cachedData.dr_overlord?.explanation || cachedData.explanation || (isEnglish ? "Cached overlord details" : "Thông tin chẩn trị từ bộ nhớ đệm")) + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)"),
            mitigation: (cachedData.dr_overlord?.mitigation || cachedData.mitigation || (isEnglish ? "Cached overlord mitigations" : "Hướng xử lý từ bộ nhớ đệm")) + (isAiEnabled ? " (⚡ Cached)" : " (⚡ Offline Cache)")
          },
          dr_compiler: cachedData.dr_compiler,
          dr_schema: cachedData.dr_schema
        };
        setActiveDoctorTab('overlord');
        setDoctorDiagnosis(resolvedCache);
        addLog(`🏥 [Cache Hit] Khôi phục chẩn trị AI từ bộ nhớ đệm cho triệu chứng: ${problemType}`);
        setDoctorLoading(false);
      }, 200);
      return;
    }
    
    if (!isAiEnabled) {
      setTimeout(() => {
        const isEnglish = tone === TranslationTone.ENGLISH;
        const fallbackGroup = offlineAnomalies[problemType as keyof typeof offlineAnomalies];
        if (fallbackGroup) {
          const rawExplanation = isEnglish ? fallbackGroup.english.explanation : fallbackGroup.vietnamese.explanation;
          const rawMitigation = isEnglish ? fallbackGroup.english.mitigation : fallbackGroup.vietnamese.mitigation;
          
          let explanation = rawExplanation;
          let mitigation = rawMitigation;

          if (tone === TranslationTone.TOXIC) {
            explanation = `[OFFLINE - ĐÃ TẮT TRỢ LÝ AI TIẾT KIỆM TIỀN] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] ", "")} Code lỗi tèm lem thế này chần chừ gì nữa hả nhóc!`;
            mitigation = `${rawMitigation} Fix lẹ đi đừng chần chừ!`;
          } else if (tone === TranslationTone.JOKE) {
            explanation = `[OFFLINE - TRỢ LÝ AI ĐANG TẬP YOGA] ${rawExplanation.replace("[Chế độ Tiết kiệm - Đã tắt Trợ lý AI] ", "")} Quẻ phán lỗi này rebase siêu sập tiệm á haha!`;
            mitigation = `${rawMitigation} Làm lẹ giải hạn đi bạn hiền bớ người ta!`;
          }

          setActiveDoctorTab('overlord');
          setDoctorDiagnosis({
            dr_overlord: {
              explanation,
              mitigation
            }
          });
        } else {
          setActiveDoctorTab('overlord');
          setDoctorDiagnosis({
            dr_overlord: {
              explanation: isEnglish ? "Offline generic anomaly alert. AI is disabled." : "Cảnh báo bất thường cục bộ hệ thống. Trợ lý AI đang tắt.",
              mitigation: isEnglish ? "Proceed with manual fixes." : "Thực hiện xử lý thủ công các nhánh Git."
            }
          });
        }
        setDoctorLoading(false);
      }, 300);
      return;
    }
    
    try {
      const res = await fetch(resolveApiUrl('/api/explain-git-problem'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          problemType,
          tone,
          details: {
            isSimulation,
            currentBranch: repoState.currentBranch,
            dirtyFilesCount: repoState.dirtyFiles?.length || 0
          },
          doctorTriggerContext: {
            files: repoState.dirtyFiles || []
          }
        })
      });

      if (!res.ok) {
        throw new Error(tone === TranslationTone.ENGLISH ? 'Failed to contact AI Doctor.' : 'Không thể kết nối đến Trạm cấp cứu AI.');
      }

      const data = await res.json();
      
      // Structure of multi-doctor advice
      const newDgn = {
        dr_overlord: data.dr_overlord || {
          explanation: data.explanation || (tone === TranslationTone.ENGLISH ? "No explanation response received." : "Không nhận được phản hồi giải thích."),
          mitigation: data.mitigation || (tone === TranslationTone.ENGLISH ? "No mitigation suggestions received." : "Không nhận được gợi ý giải pháp.")
        },
        dr_compiler: data.dr_compiler,
        dr_schema: data.dr_schema
      };

      setActiveDoctorTab('overlord');
      setDoctorDiagnosis(newDgn);

      // Save to cache
      try {
        const cached = localStorage.getItem('rebase_overlord_doctor_cache');
        const cacheStore = cached ? JSON.parse(cached) : {};
        cacheStore[cacheKey] = newDgn;
        localStorage.setItem('rebase_overlord_doctor_cache', JSON.stringify(cacheStore));
      } catch (e) {
        console.warn("Failed to write to doctor cache", e);
      }
    } catch (e: any) {
      console.error(e);
      setDoctorError(e.message || 'An error occurred during diagnostics.');
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleTriggerDoctorAction = async (problemType: string, actionKey: string) => {
    addLog(`🔧 [Git Doctor] Sơ cứu: ${problemType} -> ${actionKey}`);
    
    if (problemType === 'dirty_working_tree') {
      if (actionKey === 'stash') {
        addLog(`$ git stash`);
        if (isSimulation) {
          setRepoState(prev => ({
            ...prev,
            isDirty: false,
            dirtyFiles: []
          }));
          addLog(`✓ Saved working directory and index WIP state: Saved to stash queue`);
          addLog(`✓ [PASS] Working tree resolved. Clean stage.`);
        } else {
          try {
            const res = await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: 'git stash' })
            });
            const data = await res.json();
            if (res.ok && data.code === 0) {
              addLog(`✓ Git stash executed successfully.`);
              handleRefresh();
            } else {
              addLog(`! Failed git stash: ${data.stderr || 'unknown output'}`);
            }
          } catch (err: any) {
            addLog(`! Network timeout stashing files: ${err.message}`);
          }
        }
      } else if (actionKey === 'discard') {
        addLog(`$ git checkout . && git clean -fd`);
        if (isSimulation) {
          setRepoState(prev => ({
            ...prev,
            isDirty: false,
            dirtyFiles: []
          }));
          addLog(`✓ Discarded all local files uncommitted modifications.`);
          addLog(`✓ [PASS] Working directory cleaned successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: 'git checkout . && git clean -fd' })
            });
            handleRefresh();
          } catch (e) {}
        }
      }
    } else if (problemType === 'diverged_branch') {
      if (actionKey === 'rebase_pull') {
        const cmd = `git pull --rebase origin ${repoState.currentBranch || 'feature/payment-v2'}`;
        addLog(`$ ${cmd}`);
        if (isSimulation) {
          setIsDivergedSimulated(false);
          addLog(`✓ Pulled remote changes and replayed local commits successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: cmd })
            });
            setIsDivergedSimulated(false);
            handleRefresh();
          } catch (e) {}
        }
      } else if (actionKey === 'force_push') {
        const cmd = `git push --force-with-lease origin ${repoState.currentBranch || 'feature/payment-v2'}`;
        addLog(`$ ${cmd}`);
        if (isSimulation) {
          setIsDivergedSimulated(false);
          addLog(`✓ Force pushed local commits to remote tracker successfully.`);
        } else {
          try {
            await fetch(resolveApiUrl('/api/execute-command'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: cmd })
            });
            setIsDivergedSimulated(false);
            handleRefresh();
          } catch (e) {}
        }
      }
    } else if (problemType === 'detached_head') {
      addLog(`$ git checkout -b recovery/detached-rescue`);
      if (isSimulation) {
        setIsDetachedHeadSimulated(false);
        addLog(`Switched to a new branch 'recovery/detached-rescue'`);
        addLog(`✓ Detached HEAD resolved successfully!`);
      } else {
        try {
          await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'git checkout -b recovery/detached-rescue' })
          });
          setIsDetachedHeadSimulated(false);
          handleRefresh();
        } catch (e) {}
      }
    } else if (problemType === 'stale_base_branch') {
      const cmd = `git fetch origin && git checkout ${wizard.baseBranch || 'develop'} && git pull origin ${wizard.baseBranch || 'develop'}`;
      addLog(`$ ${cmd}`);
      if (isSimulation) {
        setIsStaleBaseSimulated(false);
        addLog(`✓ Pulled developments updates standard from remote.`);
        addLog(`✓ base branch is now in sync with origin remote.`);
      } else {
        try {
          await fetch(resolveApiUrl('/api/execute-command'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: cmd })
          });
          setIsStaleBaseSimulated(false);
          handleRefresh();
        } catch (e) {}
      }
    }

    // Reset Doctor States so the diagnosis details are closed clean
    setDoctorProblem(null);
    setDoctorDiagnosis(null);
  };

  // Active Checkout action
  const handleCheckoutBranch = async (branchName: string) => {
    setCheckingOutBranch(branchName);
    addLog(`$ git checkout ${branchName}`);
    
    try {
      if (isSimulation) {
        // Small artificial delay to let user observe checkout animation gracefully
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let targetScenario: 'linear' | 'nonlinear' | 'rewrite' | 'stale' | 'detached' | null = null;
        if (branchName === 'feature/payment-linear') {
          targetScenario = 'linear';
        } else if (branchName === 'feature/payment-nonlinear') {
          targetScenario = 'nonlinear';
        } else if (branchName === 'feature/payment-diverged-rewrite') {
          targetScenario = 'rewrite';
        } else if (branchName === 'feature/payment-stale-base') {
          targetScenario = 'stale';
        }

        if (targetScenario) {
          setSimScenarioId(targetScenario);
        } else {
          setRepoState(prev => ({
            ...prev,
            currentBranch: branchName
          }));
        }
        addLog(`✓ Checkout local branch successful: ${branchName}`);
      } else {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Checkout successful for actual branch: ${branchName}`);
          await handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error checking out branch');
          addLog(`! Error checking out branch: ${errMsg}`);
        }
      }
    } catch (err: any) {
      addLog(`! Failed network thread executing checkout: ${err.message}`);
    } finally {
      setCheckingOutBranch(null);
    }
  };

  // Create branch action
  const handleCreateBranch = async (branchName: string, baseBranch?: string) => {
    const startPoint = baseBranch ? ` ${baseBranch}` : '';
    addLog(`$ git checkout -b ${branchName}${startPoint}`);
    
    if (isSimulation) {
      const newB = { name: branchName, isLocal: true, isRemote: false, isCurrent: true, isBase: false };
      setRepoState(prev => {
        // Set currentBranch isCurrent to false
        const updatedBranches = prev.branches.map(b => 
          b.name === prev.currentBranch ? { ...b, isCurrent: false } : b
        );
        return {
          ...prev,
          currentBranch: branchName,
          branches: [...updatedBranches, newB]
        };
      });
      addLog(`✓ Created and checkout brand new simulated branch: ${branchName} starting from ${baseBranch || 'current HEAD'}`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git checkout -b ${branchName}${startPoint}` })
        });
        if (res.ok) {
          addLog(`✓ Created branch: ${branchName} from base ${baseBranch || 'current HEAD'}`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error creating branch');
          addLog(`! Error creating branch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout creating branch: ${err.message}`);
      }
    }
  };

  const handleDeleteBranch = async (branchName: string) => {
    addLog(`$ git branch -D ${branchName}`);
    if (isSimulation) {
      setRepoState(prev => ({
        ...prev,
        branches: prev.branches.filter(b => b.name !== branchName)
      }));
      addLog(`✓ Deleted local branch ${branchName} (Simulated)`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git branch -D ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Deleted local branch: ${branchName}`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error deleting branch');
          addLog(`! Error deleting branch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout deleting branch: ${err.message}`);
      }
    }
  };

  const handleFetch = async () => {
    setIsFetchingGlobal(true);
    addLog(`$ git fetch origin --prune`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (tone === TranslationTone.ENGLISH) {
        addLog(`✓ Successfully fetched latest references from remote (Simulated).`);
      } else if (tone === TranslationTone.TOXIC) {
        addLog(`✓ Fetch xong rồi thằng lười! Nhìn đống thay đổi gớm giếc của đồng nghiệp kìa (Simulated).`);
      } else if (tone === TranslationTone.JOKE) {
        addLog(`✓ Hóng hớt remote thành công sếp ơi! Có cập nhật mới rồi nhé (Simulated).`);
      } else {
        addLog(`✓ Thành công lấy các tham chiếu mới nhất từ remote (Simulated).`);
      }
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === 'develop') {
            return { ...b, aheadCount: 3, behindCount: 2 };
          }
          if (b.name === 'feature/auth-oauth') {
            return { ...b, aheadCount: 0, behindCount: 5 };
          }
          return b;
        });
        return { ...prev, branches: updated };
      });
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'git fetch origin --prune' })
        });
        if (res.ok) {
          addLog(`✓ Successfully fetched latest references from remote.`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Unknown error executing fetch');
          addLog(`! Error running git fetch: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout fetching: ${err.message}`);
      }
    }
    setIsFetchingGlobal(false);
  };

  const handlePullBranch = async (branchName: string) => {
    const isCurrent = repoState.currentBranch === branchName;
    const command = isCurrent ? `git pull origin ${branchName}` : `git checkout ${branchName} && git pull origin ${branchName}`;
    addLog(`$ ${command}`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === branchName) {
            return { ...b, behindCount: 0 };
          }
          return b;
        });
        return { ...prev, currentBranch: branchName, branches: updated };
      });
      addLog(`✓ Successfully pulled and merged latest commits for [${branchName}] (Simulated).`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command })
        });
        if (res.ok) {
          addLog(`✓ Pulled and updated [${branchName}] successfully.`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Pull command failed');
          addLog(`! Pull error: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout pulling: ${err.message}`);
      }
    }
  };

  const handlePushBranch = async (branchName: string) => {
    addLog(`$ git push origin ${branchName}`);
    if (isSimulation) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRepoState(prev => {
        const updated = prev.branches.map(b => {
          if (b.name === branchName) {
            return { ...b, aheadCount: 0 };
          }
          return b;
        });
        return { ...prev, branches: updated };
      });
      addLog(`✓ Successfully pushed local branch [${branchName}] to origin remote repository (Simulated).`);
    } else {
      try {
        const res = await fetch(resolveApiUrl('/api/execute-command'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: `git push origin ${branchName}` })
        });
        if (res.ok) {
          addLog(`✓ Brand new commits of [${branchName}] pushed cleanly.`);
          handleRefresh();
        } else {
          const errMsg = await safeParseError(res, 'Push command failed');
          addLog(`! Push error: ${errMsg}`);
        }
      } catch (err: any) {
        addLog(`! Network timeout pushing: ${err.message}`);
      }
    }
  };

  const handleCloneRepo = async (repoUrl: string, token: string) => {
    setIsCloning(true);
    addLog(`$ git clone --depth 50 ${repoUrl} (Cloning to secure container sandbox...)`);
    try {
      const res = await fetch(resolveApiUrl('/api/clone-repo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, token })
      });
      if (res.ok) {
        const d = await res.json();
        addLog(`✓ Successfully cloned repository: ${repoUrl}`);
        addLog(`📂 Root sandbox set to: ${d.path}`);
        setIsSimulation(false);
        await handleRefresh(false);
        setIsCloning(false);
        return true;
      } else {
        const errMsg = await safeParseError(res, 'Unknown error cloning repository');
        addLog(`❌ Clone failed: ${errMsg}`);
        alert(`Clone thất bại: ${errMsg}`);
        setIsCloning(false);
        return false;
      }
    } catch (e: any) {
      addLog(`❌ Exception during clone: ${e.message}`);
      setIsCloning(false);
      return false;
    }
  };

  const handleUpdateRepoPath = async (newPath: string) => {
    addLog(`$ Updating workspace repository path to: ${newPath}...`);
    try {
      const res = await fetch(resolveApiUrl('/api/set-repo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath })
      });
      if (res.ok) {
        const d = await res.json();
        addLog(`✓ Joined repository cleanly on directory: ${d.path}`);
        setIsSimulation(false);
        handleRefresh(false);
      } else {
        const errMsg = await safeParseError(res, 'Folder path invalid or inaccessible');
        addLog(`! Folder path is invalid or lacks .git: ${errMsg}`);
        alert(`Lỗi: ${errMsg}`);
      }
    } catch (e: any) {
      addLog(`! Failed to execute connection: ${e.message}`);
    }
  };



  return (
    <div id="rebase-overlord-app" className={`min-h-screen transition-colors duration-205 p-4 font-sans select-none antialiased ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#060814] text-slate-100'}`}>
      <div className="max-w-[1800px] w-full mx-auto flex flex-col gap-5 px-1 sm:px-2 md:px-4">
        
        {updateMismatchError && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-red-500/5 animate-pulse" id="update-mismatch-error-banner">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin">⚠️</span>
              <div>
                <strong className="font-mono text-sm uppercase tracking-wider block">Critical system mismatch error!</strong>
                <p className="text-xs text-red-400 font-sans mt-0.5 font-semibold">Update failed: Local version mismatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  localStorage.setItem('rebase_overlord_patch_version', '1.12.0');
                  setAppVersion('1.12.0');
                  setUpdateMismatchError(null);
                  triggerToast('success', 'Reset completed', 'Reset version override to baseline v1.12.0.');
                  addLog('✓ [RESET] Local expected version reset to baseline v1.12.0.');
                }}
                className="px-3 py-1.5 bg-red-650/30 hover:bg-red-650/50 text-white border border-red-500/30 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer active:scale-95"
              >
                Force Reset Baseline
              </button>
            </div>
          </div>
        )}

        {/* Workspace Configurations & Tones Dashboard Header */}
        <RepoHeader
          repoState={repoState}
          stats={stats}
          tone={tone}
          useEmoji={useEmoji}
          isSimulation={isSimulation}
          isCloning={isCloning}
          isAiEnabled={isAiEnabled}
          theme={theme}
          onSetTone={(t) => {
            setTone(t);
            addLog(`🗣️ Updated translation personality tone to: ${t}`);
            
            // Easter egg toasts based on tone
            if (t === TranslationTone.TOXIC) {
              triggerToast('rage', '🔥 TOXIC BOSS INBOUND', 'Chế độ Sát Thương Vật Lý lý thuyết đã nạp! Chuẩn bị màng nhĩ nhận sát thương mỉa mai cực gắt nhé!', '💀');
            } else if (t === TranslationTone.JOKE) {
              triggerToast('owl', '🎭 HỀ CŨNG CÓ GIA PHẢ', 'Ní vừa khởi động Rạp xiếc trung ương. Nhớ mang theo bỏng ngô và trà sữa nha sếp!', '🤡');
            } else if (t === TranslationTone.PROFESSIONAL) {
              triggerToast('success', '💼 QUÝ TỘC CÔNG SỞ', 'Tác phong chuẩn ISO-9001 và mẫu mực gãy gọn như senior 10 năm kinh nghiệm!', '🤵');
            } else if (t === TranslationTone.ENGLISH) {
              triggerToast('info', '🇬🇧 ENTERPRISE COMPLIANCE', 'You have engaged absolute compliance with standard elite international protocols.', '🇬🇧');
            }
          }}
          onToggleEmoji={() => {
            setUseEmoji(!useEmoji);
            addLog(useEmoji ? '🤪 Emoji layout deactivated.' : '🤪 Emoji display active!');
            triggerToast('info', useEmoji ? 'Plain Mode' : 'Emoji Overload', useEmoji ? 'Giao diện truyền thống nghiêm túc' : 'Bão táp emoji đổ bộ giao diện!', '🤪');
          }}
          onToggleSimulation={(val) => {
            setIsSimulation(val);
            addLog(`🤖 Mode toggled. Simulation Playground: ${val ? 'ACTIVE' : 'OFF'}`);
            handleRefresh(val);
            
            if (val) {
              triggerToast('milestone', '⚡ SIMULATION RUNTIME', 'Sandbox mô phỏng an toàn đã kích hoạt. Đập phá, commit láo thoải mái không sợ sập server!', '🧪');
            } else {
              triggerToast('warn', '🔌 REAL GIT CONNECTED', 'Chú ý: Đã chuyển ngữ trực tiếp vào tệp tin và Repo thật trên ổ đĩa máy chủ!', '⚠️');
            }
          }}
          onToggleAi={() => {
            const newVal = !isAiEnabled;
            setIsAiEnabled(newVal);
            addLog(newVal ? '🤖 AI Engine Enabled (Full AI Features activated)' : '🤖 AI Engine Disabled (Cost saved - falling back to offline mode)');
            
            if (newVal) {
              triggerToast('success', '🧠 BRAIN EXTENSION ENABLED', 'Đã nhồi thêm hàng tỷ nơ-ron từ mô hình sinh mẫu trợ lý trí tuệ nhân tạo thông minh!', '🤖');
            } else {
              triggerToast('warn', '🔌 COMPUTE COST SAVER', 'Trợ lý AI đã chuyển sang chẩn đoán ngoại tuyến (Offline rules) để tiết kiệm chi phí cho bạn.', '🔌');
            }
          }}
          onToggleTheme={() => {
            const nextTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
            addLog(nextTheme === 'light' ? '🔆 Theme set to Light Mode.' : '🌙 Theme set to Dark Mode.');
            
            if (nextTheme === 'light') {
              triggerToast('info', '🔆 FLASHBANG INBOUND', 'Flashbang sáng loà! Đôi mắt cú đêm của lập trình viên đang khóc thét.', '😎');
            } else {
              triggerToast('owl', '🌙 SHADOWS OF REBASE', 'Đã về với bóng đêm sâu thẳm. Bảo vệ đôi mắt, thắp sáng dòng code.', '🦉');
            }
          }}
          onUpdateRepoPath={handleUpdateRepoPath}
          onCloneRepo={handleCloneRepo}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isVersionRed={isVersionRed}
          verifyBtnVisible={verifyBtnVisible}
          onVerifyInstallation={() => verifyInstallationWithMetadata(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
          <div className="lg:col-span-8 flex flex-col gap-5">

        {/* Serverless / Vercel Host Warn & Config Banner */}
        {backendStatus === 'unreachable' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-xl p-5 shadow-xl flex flex-col md:flex-row gap-5 items-start justify-between ${theme === 'light' ? 'bg-white border-slate-200 text-slate-855 shadow-sm' : 'bg-slate-900 border-slate-850 text-slate-100'}`}
          >
            <div className="flex gap-3.5 items-start">
              <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg border border-amber-500/20 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-sm font-semibold font-mono tracking-wide uppercase flex items-center gap-2 ${theme === 'light' ? 'text-slate-950' : 'text-slate-100'}`}>
                  ⚠️ Phát Hiện Máy Chủ Tĩnh (Vercel / GitHub Pages Hosting detected)
                </h4>
                <p className={`text-xs leading-relaxed font-sans max-w-3xl ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  Để thực hiện các thao tác Git thực tế (như <code className={`px-1 py-0.5 rounded font-mono border text-[10px] ${theme === 'light' ? 'text-amber-800 bg-amber-50/50 border-amber-200' : 'text-amber-400 bg-slate-950 border-slate-900'}`}>git clone</code>, chọn thư mục ổ đĩa của bạn), hệ thống cần một máy chủ liên tục (stateful Node Express backend). Do Vercel là nền tảng Serverless tĩnh, hệ thống đã <strong className="text-emerald-400 font-semibold">Tự Thừa Kế & Tự Động Kích Hoạt chế độ Giả Lập (Simulation Playground)</strong> để bạn có thể trải nghiệm toàn vẹn dòng chảy logic Rebase mượt mà.
                </p>
                <p className="text-[11px] text-indigo-400 leading-relaxed font-mono">
                  💡 Bạn muốn lấy repo thật từ Windows/MacOS của mình? Hãy chạy lệnh <code className={`px-1 rounded ${theme === 'light' ? 'text-slate-800 bg-slate-100' : 'text-slate-300 bg-slate-950'}`}>npm start</code> cục bộ trên máy và dán địa chỉ localhost ở khung cấu hình bên phải!
                </p>
              </div>
            </div>

            <div className={`border rounded-xl p-4 w-full md:w-[320px] shrink-0 self-stretch flex flex-col justify-between gap-3 text-xs ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cầu Nối API Cục Bộ (Hybrid Live Switcher)</span>
                <input
                  type="text"
                  placeholder="Ví dụ: http://localhost:3000"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  className={`w-full rounded px-2.5 py-1.5 font-mono text-[11px] focus:outline-none focus:border-indigo-500 border ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#060814] border-slate-800 text-slate-300'}`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (customBackendUrl.trim()) {
                      localStorage.setItem('rebase_overlord_backend_url', customBackendUrl.trim());
                      addLog(`🔗 Kết nối Custom Backend URL: ${customBackendUrl.trim()}`);
                    } else {
                      localStorage.removeItem('rebase_overlord_backend_url');
                      addLog(`🔗 Đã gỡ bỏ Custom Backend URL. Sử dụng cấu hình mặc định.`);
                    }
                    handleRefresh();
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-slate-500 hover:text-white transition-all text-white font-mono text-[10px] py-1.5 px-2 rounded font-bold cursor-pointer border border-indigo-500/20 active:scale-95 text-center"
                >
                  Kết nối Live
                </button>
                {localStorage.getItem('rebase_overlord_backend_url') && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('rebase_overlord_backend_url');
                      setCustomBackendUrl('');
                      addLog(`🔗 Reset Custom Backend. Sử dụng mặc định.`);
                      handleRefresh();
                    }}
                    className="bg-rose-950/40 hover:bg-rose-900/60 transition-all text-rose-400 font-mono text-[10px] py-1.5 px-2.5 rounded border border-rose-900/30 cursor-pointer text-center"
                    title="Xóa cấu hình địa chỉ tự chọn"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Git Branch Metrics & Insights Panel */}
        <div className={`p-4 rounded-xl border mb-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans text-xs transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-slate-900/40 border-slate-800 text-slate-200'
        }`}>
          {/* Branch Status details */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-2.5 py-1 rounded-md border font-mono font-bold tracking-tight text-xs flex items-center gap-1.5 ${
              theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-500/15 border-indigo-500/20 text-indigo-300'
            }`}>
              <GitBranch className="w-3.5 h-3.5" />
              <span>{repoState.currentBranch}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-405 font-medium">
              <span>{tone === TranslationTone.ENGLISH ? "compared to" : "so với"}</span>
              <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350">{repoState.baseBranch || 'develop'}</span>
            </div>

            {/* Metrics Badges */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 border ${
                branchMetrics.ahead > 0
                  ? (theme === 'light' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
              }`} title={tone === TranslationTone.ENGLISH ? `${branchMetrics.ahead} ahead commits (ready to squash/rebase)` : `${branchMetrics.ahead} commit ahead (đã sẵn sàng để gộp hoặc rebase)`}>
                <ArrowUpCircle className="w-3 h-3 text-emerald-400" />
                <span>Ahead: {branchMetrics.ahead}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 border ${
                branchMetrics.behind > 0
                  ? 'bg-amber-500/10 border-amber-505/20 text-amber-550'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
              }`} title={tone === TranslationTone.ENGLISH ? `${branchMetrics.behind} behind commits (develop updates exist)` : `${branchMetrics.behind} commit behind (nhánh base đã có thay đổi mới)`}>
                <ArrowDownCircle className="w-3 h-3 text-amber-500" />
                <span>Behind: {branchMetrics.behind}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-slate-200 dark:border-slate-800 font-mono text-[10px] font-semibold text-indigo-400">
                {tone === TranslationTone.ENGLISH ? 'To Process' : 'Sẽ xử lý'}: {branchMetrics.actionable}/{branchMetrics.total} commits
              </span>
            </div>
          </div>

          {/* Status advice or warner based on ahead/behind metrics */}
          {branchMetrics.behind > 0 ? (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-500 max-w-md text-[11px] leading-snug">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>{tone === TranslationTone.ENGLISH ? "Conflict Warning:" : "Cảnh báo:"}</strong> {tone === TranslationTone.ENGLISH ? `Your branch is behind by ${branchMetrics.behind} commits. Rebasing is strongly recommended to stay updated.` : `Nhánh của bạn đang bị chậm ${branchMetrics.behind} commit so với base branch. Hãy chạy Rebase để cập nhật mã nguồn mới nhất và tránh xung đột khi merge!`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{tone === TranslationTone.ENGLISH ? "Healthy branch! Fully up-to-date with base branch." : "Nhánh sạch sẽ, đã đồng bộ hoàn toàn với base branch!"}</span>
            </div>
          )}
        </div>

        {/* Dense Commits Handler: Pagination & Search filter */}
        <div className={`p-3 rounded-xl border mb-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none ${
          theme === 'light' ? 'bg-slate-50 border-slate-200/80 shadow-sm' : 'bg-slate-900 border-slate-800/80 text-slate-200'
        }`}>
          {/* Search component */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={tone === TranslationTone.ENGLISH ? "Search commits by msg or SHA..." : "Tìm commit bằng SHA hoặc nội dung..."}
              value={commitSearchTerm}
              onChange={(e) => {
                setCommitSearchTerm(e.target.value);
                setCommitPageOffset(0); // reset page offset on search change
              }}
              className={`w-full rounded-lg pl-8 pr-2.5 py-1.5 font-sans focus:outline-none focus:border-indigo-500 border ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-[#060814] border-slate-800 text-slate-200'
              }`}
            />
          </div>

          {/* Range settings and pagination */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Max commits visible select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{tone === TranslationTone.ENGLISH ? "Nodes Limit:" : "Trượt màn hình:"}</span>
              <select
                value={maxVisibleCommits}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxVisibleCommits(val === 'all' ? 'all' : parseInt(val, 10));
                  setCommitPageOffset(0);
                }}
                className={`rounded border px-2 py-1 select-none font-mono text-[11px] focus:outline-none ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-850 text-slate-300'
                }`}
              >
                <option value="5">5 commits</option>
                <option value="10">10 commits ({tone === TranslationTone.ENGLISH ? 'Default' : 'Chuẩn'})</option>
                <option value="15">15 commits</option>
                <option value="25">25 commits</option>
                <option value="all">{tone === TranslationTone.ENGLISH ? 'Show All' : 'Tất cả'} ({filteredCommitsForSquash.length})</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {maxVisibleCommits !== 'all' && filteredCommitsForSquash.length > maxVisibleCommits && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={commitPageOffset === 0}
                  onClick={() => setCommitPageOffset(prev => Math.max(0, prev - 1))}
                  className={`p-1 px-2.5 rounded transition-all cursor-pointer font-bold select-none border border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
                    theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 hover:bg-slate-850 text-white shadow'
                  }`}
                  title={tone === TranslationTone.ENGLISH ? "Newer commits" : "Commit mới hơn / Trang trước"}
                >
                  &larr; {tone === TranslationTone.ENGLISH ? "Newer" : "Mới hơn"}
                </button>
                
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                  {commitPageOffset + 1} / {Math.ceil(filteredCommitsForSquash.length / (maxVisibleCommits as number))}
                </span>

                <button
                  type="button"
                  disabled={commitPageOffset >= Math.ceil(filteredCommitsForSquash.length / (maxVisibleCommits as number)) - 1}
                  onClick={() => setCommitPageOffset(prev => prev + 1)}
                  className={`p-1 px-2.5 rounded transition-all cursor-pointer font-bold select-none border border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
                    theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 shadow-sm' : 'bg-slate-950 border-slate-800 hover:bg-slate-850 text-white shadow'
                  }`}
                  title={tone === TranslationTone.ENGLISH ? "Older commits" : "Commit cũ hơn / Trang sau"}
                >
                  {tone === TranslationTone.ENGLISH ? "Older" : "Cũ hơn"} &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

            {/* Clean Controls Toolbar Row (outside viewport to guarantee zero overlaps with rendered graph nodes) */}
              <div className={`flex flex-wrap items-center justify-between gap-3 p-2 mb-3.5 rounded-lg border shadow-sm select-none font-mono text-xs ${
                theme === 'light' 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-900 border-slate-800/80 text-slate-200'
              }`}>
                {/* Left side actions */}
                <div className="flex items-center gap-2">
                  {/* Mode Selector (Desktop only) */}
                  {!isMobile && (
                    <div className="flex items-center gap-0.5 bg-slate-200/50 dark:bg-slate-950/60 p-0.5 rounded-md border border-slate-300 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTool('dragNode')}
                        className={`p-1.5 rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                          activeTool === 'dragNode'
                            ? 'bg-indigo-650 text-white shadow font-semibold'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-405 hover:bg-slate-800/50'
                        }`}
                        title={sloc.dragNodeModeLabel}
                      >
                        <MousePointer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveTool('pan')}
                        className={`p-1.5 rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                          activeTool === 'pan'
                            ? 'bg-indigo-650 text-white shadow font-semibold'
                            : theme === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-405 hover:bg-slate-850'
                        }`}
                        title={sloc.panModeLabel}
                      >
                        <Hand className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {!isMobile && <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />}

                  {/* Left/Right / Rotation layout toggler */}
                  <button
                    onClick={() => setIsGraphVertical(v => !v)}
                    className={`p-1.5 rounded border border-transparent hover:border-slate-350 dark:hover:border-slate-800 transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                      theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title={isGraphVertical ? "Layout Dọc. Bấm để chuyển sang Ngang (Horizontal Layout)" : "Layout Ngang. Bấm để chuyển sang Dọc (Vertical Layout)"}
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-emerald-400 transition-transform duration-350 ${isGraphVertical ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Right side adjustments */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Node width slide adjustment */}
                  <div className="flex items-center gap-1.5 px-1" title={sloc.nodeSizeLabel}>
                    <Move className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <input
                      type="range"
                      min="140"
                      max="340"
                      step="10"
                      value={nodeWidth}
                      onChange={(e) => setNodeWidth(parseInt(e.target.value))}
                      className="w-16 sm:w-20 accent-indigo-505 cursor-ew-resize h-1 bg-slate-205 dark:bg-slate-800 rounded appearance-none"
                    />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none font-bold font-mono transition-all ${
                      theme === 'light'
                        ? 'bg-indigo-50 border-indigo-200/80 text-indigo-700 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-indigo-300 shadow-sm'
                    }`}>
                      {nodeWidth}px
                    </span>
                  </div>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80" />

                  {/* Zoom adjustment */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setZoomScale(z => Math.max(0.15, Math.round((z - 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-805 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomOut}
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                    <span className="w-8 text-center font-bold text-[10px]">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale(z => Math.min(5.0, Math.round((z + 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-855 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomIn}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800/80" />

                  {/* Reset Layout */}
                  <button
                    onClick={() => {
                      setZoomScale(1.0);
                      setNodeWidth(180);
                      setResetKey(k => k + 1);
                      setExpandedNodes({});
                      setNodeSizes({});
                      setConnections([]);
                      triggerRenderTick();
                    }}
                    className="p-1 px-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                    title={sloc.resetLayout}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Graphical representation of the Rebase squash action (Board Viewport) */}
              <div 
                ref={setViewportRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`w-full h-[480px] rounded-xl border relative overflow-hidden flex items-center justify-center select-none ${
                  theme === 'light' 
                    ? 'bg-slate-50/50 border-slate-205 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]' 
                    : 'bg-[#090d16] border-slate-900 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
                }`}
              >
                {/* Active Tool Overlay Badge */}
                <div className={`hidden sm:flex absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-mono border uppercase items-center gap-1 ${
                  theme === 'light' 
                    ? 'bg-white text-slate-800 border-slate-200 shadow-sm' 
                    : 'bg-slate-900/85 text-white border-slate-850 shadow-md'
                }`}>
                  {activeTool === 'pan' ? (
                    <>
                      <Hand className="w-3 h-3 text-sky-400" />
                      <span>{sloc.panModeLabel}</span>
                    </>
                  ) : (
                    <>
                      <MousePointer className="w-3 h-3 text-indigo-400" />
                      <span>{sloc.dragNodeModeLabel}</span>
                    </>
                  )}
                </div>

                {/* Micro Drag n drop Tip overlay */}
                {!isMobile && (
                  <div className={`absolute bottom-3 left-3 z-10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono border font-semibold ${
                    theme === 'light' 
                      ? 'bg-white/80 border-slate-200 text-indigo-600 shadow-sm' 
                      : 'bg-slate-900/80 border-slate-850 text-indigo-400 shadow'
                  }`}>
                    <span>💡 {sloc.dragTip}</span>
                  </div>
                )}

                <div className="hidden sm:flex absolute top-3 right-3 z-20 items-center gap-1.5 p-1.5 rounded-lg border bg-white dark:bg-slate-900 shadow-sm" title={sloc.nodeSizeLabel}>
                    <Move className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <input
                      type="range"
                      min="140"
                      max="340"
                      step="10"
                      value={nodeWidth}
                      onChange={(e) => setNodeWidth(parseInt(e.target.value))}
                      className="w-14 sm:w-18 accent-indigo-500 cursor-ew-resize h-1 bg-slate-205 dark:bg-slate-800 rounded appearance-none"
                    />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none font-bold font-mono transition-all ${
                      theme === 'light'
                        ? 'bg-indigo-50 border-indigo-200/80 text-indigo-700 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-indigo-300 shadow-sm'
                    }`}>
                      {nodeWidth}px
                    </span>


                  <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />

                  {/* Zoom adjustment */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setZoomScale(z => Math.max(0.15, Math.round((z - 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-805 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomOut}
                    >
                      <ZoomOut className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                    <span className="w-8 text-center font-bold text-[10px]">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale(z => Math.min(5.0, Math.round((z + 0.1) * 10) / 10))}
                      className={`p-1 rounded transition-colors cursor-pointer border border-transparent hover:border-slate-350 dark:hover:border-slate-855 ${
                        theme === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-950 hover:bg-slate-900'
                      }`}
                      title={sloc.zoomIn}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-800/80 mx-0.5" />

                  {/* Reset Layout */}
                  <button
                    onClick={() => {
                      setZoomScale(1.0);
                      setNodeWidth(180);
                      setResetKey(k => k + 1);
                      setExpandedNodes({});
                      setNodeSizes({});
                      setConnections([]);
                      triggerRenderTick();
                    }}
                    className="p-1 px-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-all cursor-pointer active:scale-95"
                    title={sloc.resetLayout}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inner zoomable and pannable board */}
                <motion.div
                  ref={boardRef}
                  key={`board-${resetKey}`}
                  drag={activeTool === 'pan'}
                  dragConstraints={false}
                  dragElastic={0.1}
                  dragMomentum={true}
                  style={{
                    scale: zoomScale,
                    transformOrigin: "center center"
                  }}
                  className="w-full h-full flex items-center justify-center relative touch-none"
                >
                  {/* SVG connections overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                    <defs>
                      <marker
                        id="arrowhead-connector"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 7 3.5, 0 7" fill={theme === 'light' ? '#6366f1' : '#818cf8'} />
                      </marker>
                    </defs>
                    {connections.map((conn, idx) => {
                      const isVertical = isGraphVertical;
                      let pathD = '';
                      if (isVertical) {
                        const dy = conn.endY - conn.startY;
                        const cp1Y = conn.startY + dy * 0.45;
                        const cp2Y = conn.startY + dy * 0.55;
                        pathD = `M ${conn.startX} ${conn.startY} C ${conn.startX} ${cp1Y}, ${conn.endX} ${cp2Y}, ${conn.endX} ${conn.endY}`;
                      } else {
                        const dx = conn.endX - conn.startX;
                        const cp1X = conn.startX + dx * 0.45;
                        const cp2X = conn.startX + dx * 0.55;
                        pathD = `M ${conn.startX} ${conn.startY} C ${cp1X} ${conn.startY}, ${cp2X} ${conn.endY}, ${conn.endX} ${conn.endY}`;
                      }
                      return (
                        <path
                          key={idx}
                          d={pathD}
                          stroke={theme === 'light' ? '#6366f1' : '#818cf8'}
                          strokeWidth="2.5"
                          strokeDasharray={conn.isDash ? '4 4' : undefined}
                          fill="none"
                          markerEnd="url(#arrowhead-connector)"
                          className="opacity-75 transition-all duration-75"
                        />
                      );
                    })}
                  </svg>

                  {/* The actual flow nodes */}
                  <div className={`flex items-center justify-center gap-12 p-24 relative z-10 ${
                    isGraphVertical ? 'flex-col' : 'flex-row'
                  }`}>

                    {/* Develop Head represent */}
                    <motion.div
                      ref={devRef}
                      drag={!isMobile && activeTool === 'dragNode'}
                      dragConstraints={false}
                      dragElastic={0.2}
                      whileDrag={{ scale: 1.05 }}
                      onDrag={() => {
                        updateConnectionPaths();
                      }}
                      onDragEnd={() => {
                        updateConnectionPaths();
                      }}
                      style={{
                        marginLeft: (isSimulation && isGraphVertical) ? '-180px' : undefined,
                        marginTop: (isSimulation && !isGraphVertical) ? '-110px' : undefined,
                      }}
                      className={`flex flex-col items-center gap-1.5 px-3 min-w-fit relative ${!isMobile && activeTool === 'dragNode' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-md flex items-center justify-center text-xs font-mono font-bold text-emerald-300">
                        dev
                      </div>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>develop head</div>
                    </motion.div>

                    {wizard.step < 5 ? (
                      <>
                        {/* Commits checklist visualization line items before squash */}
                        {activeCommitsForSquash.length === 0 ? (
                          <div className="text-slate-400 text-xs italic py-2">
                            {sloc.emptyCommits}
                          </div>
                        ) : filteredCommitsForSquash.length === 0 ? (
                          <div className="text-slate-400 text-xs italic py-2">
                            {tone === TranslationTone.ENGLISH ? "No commits match your current filter." : "Không tìm thấy commit nào khớp bộ lọc tìm kiếm."}
                          </div>
                        ) : (
                          paginatedCommitsForSquash.map((c, i) => {
                            const track = c.track !== undefined ? c.track : 1;
                            return (
                              <React.Fragment key={c.sha}>
                                <CommitNodeCard
                                  c={c}
                                  theme={theme}
                                  tone={tone}
                                  activeTool={activeTool}
                                  isMobile={isMobile}
                                  wizard={wizard}
                                  expandedNodes={expandedNodes}
                                  setExpandedNodes={setExpandedNodes}
                                  nodeSizes={nodeSizes}
                                  isSimulation={isSimulation}
                                  track={track}
                                  isGraphVertical={isGraphVertical}
                                  nodeWidth={nodeWidth}
                                  nodeRefs={nodeRefs}
                                  updateConnectionPaths={updateConnectionPaths}
                                  triggerRenderTick={triggerRenderTick}
                                  handleResizeStart={handleResizeStart}
                                  hoveredSha={hoveredSha}
                                  setHoveredSha={setHoveredSha}
                                  fetchCommitFiles={fetchCommitFiles}
                                  loadingFilesShas={loadingFilesShas}
                                  commitFiles={commitFiles}
                                  isTouchOnly={isTouchOnly}
                                />
                              </React.Fragment>
                            );
                          })
                        )}
                      </>
                    ) : (
                      /* Commits squashed visual state showing a single clean unified block head */
                      <div className={`flex items-center gap-3 border p-4 rounded-xl animate-fade-in text-center max-w-md w-full ${theme === 'light' ? 'bg-indigo-50/50 border-indigo-200' : 'bg-indigo-550/10 border-indigo-500/30'}`}>
                        <div className="bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 p-2.5 rounded-lg border border-indigo-500/30 shrink-0">
                          <GitMerge className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="text-xs text-left">
                          <div className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-wider mb-0.5">{sloc.squashCompletedTitle}</div>
                          <div className={`font-mono font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-100'}`}>{wizard.finalMsg}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-1">Author: Nguyen Tran | Date: Just now</div>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              </div>

            {/* Dynamic Active Git Operational Visualizer */}
            <GitVisualizerPanel 
              tone={tone} 
              wizard={wizard} 
              theme={theme} 
              repoState={repoState} 
              isSimulation={isSimulation}
              onToggleSimulation={(val) => {
                setIsSimulation(val);
                addLog(`🤖 Mode toggled from Sa bàn. Simulation Playground: ${val ? 'ACTIVE' : 'OFF'}`);
                handleRefresh(val);
                
                if (val) {
                  triggerToast('milestone', '⚡ SIMULATION RUNTIME', 'Sandbox mô phỏng an toàn đã kích hoạt. Đập phá, commit láo thoải mái không sợ sập server!', '🧪');
                } else {
                  triggerToast('warn', '🔌 REAL GIT CONNECTED', 'Chú ý: Đã chuyển ngữ trực tiếp vào tệp tin và Repo thật trên ổ đĩa máy chủ!', '⚠️');
                }
              }}
            />

            {/* Core Wizard state dashboard */}
            <WizardPanel
              commits={repoState.commits}
              wizard={wizard}
              tone={tone}
              useEmoji={useEmoji}
              theme={theme}
              onUpdateWizard={handleUpdateWizard}
              onExecuteWizardRebase={handleExecuteWizardRebase}
              onResetWizard={handleResetWizard}
            />

            {/* Emergency Conflict Resolution Panel if in rebaseProgress */}
            {(repoState.rebaseInProgress || wizard.status === 'paused_conflict') && (
              <ConflictSolver
                conflicts={repoState.conflicts}
                tone={tone}
                currentBranch={repoState.currentBranch || 'feature-branch'}
                baseBranch={wizard.baseBranch || repoState.baseBranch || 'develop'}
                isAiEnabled={isAiEnabled}
                theme={theme}
                onResolveFile={handleResolveFile}
                onCompleteRecovery={handleCompleteRecovery}
              />
            )}
          </div>

          {/* Right Panel Rails split containing branch widgets, diagnostics and terminal logs */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Git Branch Interactive Hub switcher */}
            <BranchPanel
              branches={repoState.branches}
              currentBranch={repoState.currentBranch}
              tone={tone}
              useEmoji={useEmoji}
              theme={theme}
              checkingOutBranch={checkingOutBranch}
              onCheckout={handleCheckoutBranch}
              onCreateBranch={handleCreateBranch}
              onDeleteBranch={handleDeleteBranch}
              onFetch={handleFetch}
              onPullBranch={handlePullBranch}
              onPushBranch={handlePushBranch}
              isFetchingGlobal={isFetchingGlobal}
            />

            {/* Simulated Live Diagnostic Warnings Panel with AI Git Doctor Integration */}
            {!showWarningsPanel ? (
              <div id="git-warnings-collapsed" className={`border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-900 text-slate-305'}`}>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Settings className="w-4 h-4 text-violet-400 animate-spin-slow" />
                  <span className="font-bold uppercase tracking-wider">{sloc.title}</span>
                  <span className="text-[10px] text-slate-500 opacity-60">
                    ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'})
                  </span>
                </div>
                <button
                  onClick={() => setShowWarningsPanel(true)}
                  className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
                    theme === 'light'
                      ? 'bg-violet-50 border-violet-200 text-violet-750 hover:bg-violet-100'
                      : 'bg-[#1e293b] border-violet-505/20 text-violet-400 hover:text-violet-303'
                  }`}
                  title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div id="git-warnings-board" className={`border rounded-xl p-5 shadow-lg flex flex-col gap-4 transition-all duration-200 ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-[#0f172a] border-slate-850 text-slate-100 shadow-2xl'}`}>
                <div className={`flex items-center justify-between border-b pb-3 ${theme === 'light' ? 'border-slate-150' : 'border-slate-800/60'}`}>
                  <h3 className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                    <Settings className="w-4 h-4 text-violet-400 animate-spin-slow" />
                    <span>{sloc.title}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {isSimulation && (
                      <span className="text-[9px] font-mono text-indigo-400 bg-indigo-505/10 px-1.5 py-0.5 rounded border border-indigo-500/30">
                        {sloc.simulationAnomalyBadge}
                      </span>
                    )}

                    {/* Collapse Toggle */}
                    <button
                      onClick={() => setShowWarningsPanel(false)}
                      className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
                        theme === 'light' 
                          ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                          : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-355'
                      }`}
                      title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
                    >
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                <div className={`flex flex-col gap-2.5 text-xs font-mono border-b pb-3 ${theme === 'light' ? 'border-slate-150' : 'border-slate-800/60'}`}>
                {/* 1. Git Installation Health */}
                <div className={`flex justify-between items-center p-2 rounded border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-900'}`}>
                  <span className="text-slate-500">{sloc.gitEnv}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                    ✓ STABLE (v2.41)
                  </span>
                </div>

                {/* 2. GitHub auth check */}
                <div className={`flex justify-between items-center p-2 rounded border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-900'}`}>
                  <span className="text-slate-500">{sloc.githubCli}</span>
                  {repoState.ghAvailable ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px] flex items-center gap-1">
                      <Github className="w-3 h-3" /> ✓ AUTHORIZED
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-[10px]" title="Please sign-in to gh-cli on system">
                      ⚠️ NOT SIGNED
                    </span>
                  )}
                </div>

                {/* 3. Rebase health check indicator */}
                <div className={`flex justify-between items-center p-2 rounded border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-900'}`}>
                  <span className="text-slate-500">{sloc.rebaseStatus}</span>
                  {repoState.rebaseInProgress ? (
                    <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[10px] animate-pulse">
                      🚧 PAUSED_CONFL (PAUSE)
                    </span>
                  ) : (
                    <span className="text-emerald-500 text-[10px] uppercase font-bold">
                      {sloc.readyStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* SIMULATION ANOMALY TOGGLERS FOR TESTING/EXPERIMENTATION */}
              {isSimulation && (
                <div className={`rounded-lg p-3 flex flex-col gap-3.5 border transition-all duration-200 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0b0f19]/80 border-slate-850/50'}`}>
                  {/* Preset Scenario Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block font-bold">
                      {sloc.simScenarioHeading}
                    </span>
                    <select
                      value={simScenarioId}
                      onChange={(e) => {
                        const targetVal = e.target.value as any;
                        setSimScenarioId(targetVal);
                        addLog(`[Mô phỏng] Đã chuyển đổi kịch bản kiểm thử Git sang: ${targetVal.toUpperCase()}`);
                      }}
                      className={`w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors outline-none cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-350'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-750'
                      }`}
                    >
                      <option value="linear">🟢 {sloc.simScenarioLinear}</option>
                      <option value="nonlinear">🟣 {sloc.simScenarioNonLinear}</option>
                      <option value="rewrite">🟡 {sloc.simScenarioRewrite}</option>
                      <option value="stale">🟠 {sloc.simScenarioStale}</option>
                      <option value="detached">🔴 {sloc.simScenarioDetached}</option>
                    </select>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      {sloc.simScenarioDesc}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-slate-800/40" />

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                      {sloc.simulateAnomaliesHeading}
                    </span>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      <button 
                        onClick={() => {
                          const current = !isDivergedSimulated;
                          setIsDivergedSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt lỗi lệch pha (Diverged)' : 'Đã xoá lỗi lệch pha'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isDivergedSimulated 
                            ? theme === 'light'
                              ? 'bg-amber-100 hover:bg-amber-200 border-amber-400/70 text-amber-955 font-bold shadow-sm'
                              : 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isDivergedSimulated ? sloc.divergedUnsafeLabel : sloc.divergedSafeLabel}
                      </button>

                      <button 
                        onClick={() => {
                          const current = !isDetachedHeadSimulated;
                          setIsDetachedHeadSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt trạng thái Detached HEAD' : 'Đã xoá Detached HEAD'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isDetachedHeadSimulated 
                            ? theme === 'light'
                              ? 'bg-rose-100 hover:bg-rose-200 border-rose-400/70 text-rose-955 font-bold shadow-sm'
                              : 'bg-rose-550/15 border-rose-500/30 text-rose-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-205 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isDetachedHeadSimulated ? sloc.detachedUnsafeLabel : sloc.detachedSafeLabel}
                      </button>

                      <button 
                        onClick={() => {
                          const current = !isStaleBaseSimulated;
                          setIsStaleBaseSimulated(current);
                          addLog(`[Mô phỏng] ${current ? 'Đã kích hoạt trạng thái base mốc lỗi thời' : 'Đã đồng bộ base'}`);
                        }}
                        className={`px-2 py-0.5 text-[9px] rounded border transition-all cursor-pointer ${
                          isStaleBaseSimulated 
                            ? theme === 'light'
                              ? 'bg-amber-100 hover:bg-amber-200 border-amber-400/70 text-amber-955 font-bold shadow-sm'
                              : 'bg-amber-550/15 border-amber-500/30 text-amber-300' 
                            : theme === 'light'
                            ? 'bg-white border-slate-205 text-slate-500 hover:text-slate-700 hover:border-slate-350'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        {isStaleBaseSimulated ? sloc.staleUnsafeLabel : sloc.staleSafeLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ANOMALIES & DIAGNOSTIC DIRECTIVES CENTER */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase block">
                  {sloc.diagnosticsActionHeading}
                </span>

                <div className="flex flex-col gap-2">
                  {/* Issue A: Uncommitted Changes */}
                  {repoState.isDirty && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-200 bg-amber-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'dirty_working_tree' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-50/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.dirty.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-violet-700 dark:text-violet-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.dirty.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
                              {sloc.uncommittedChangesTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'dirty_working_tree' ? null : 'dirty_working_tree');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/80 text-amber-800' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {sloc.uncommittedChangesDesc.replace("{0}", String(repoState.dirtyFiles?.length || 0))}
                          </span>

                          {repoState.dirtyFiles && repoState.dirtyFiles.length > 0 && (
                            <div className="mt-2 text-[10px]">
                              <span className={`font-semibold block ${theme === 'light' ? 'text-slate-700 font-bold' : 'text-slate-300 font-bold'} mb-1`}>
                                {sloc.dirtyFilesLabel}
                              </span>
                              <div className="mt-1 flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                                {repoState.dirtyFiles.map(file => (
                                  <div key={file} className="flex items-center gap-1.5">
                                    <span className="w-1.2 h-1.2 rounded-full bg-amber-500"></span>
                                    <span className={`font-mono text-[10px] truncate ${theme === 'light' ? 'text-slate-700 bg-slate-100 border-slate-200' : 'text-amber-250 bg-slate-950/40 border-amber-500/10'} px-1.5 py-0.5 rounded border`}>
                                      {file}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('dirty_working_tree')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-slate-105 hover:bg-slate-200 border-slate-300 text-slate-700 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                          }`}
                        >
                          stash
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: tone === TranslationTone.ENGLISH ? "Discard Changes" : tone === TranslationTone.TOXIC ? "HUỶ BỎ TOÀN BỘ CÔNG SỨC" : "Hủy bỏ thay đổi",
                              message: sloc.discardConfirm,
                              onConfirm: () => handleTriggerDoctorAction('dirty_working_tree', 'discard')
                            });
                          }}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 font-medium'
                              : 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          discard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue B: Diverged Branch */}
                  {(isSimulation ? isDivergedSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-300 bg-amber-50/80 shadow-xs' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'diverged_branch' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-5/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.diverged.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-violet-700 dark:text-violet-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.diverged.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-955' : 'text-amber-300'}`}>
                              {sloc.divergedTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'diverged_branch' ? null : 'diverged_branch');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/85 text-amber-955' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.divergedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('diverged_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-850'
                          }`}
                        >
                          pull --rebase
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: tone === TranslationTone.ENGLISH ? "Force Push Warning" : tone === TranslationTone.TOXIC ? "CẢNH BÁO FORCE PUSH THÔ BẠO" : "Cảnh báo Force Push",
                              message: sloc.forcePushConfirm,
                              onConfirm: () => handleTriggerDoctorAction('diverged_branch', 'force_push')
                            });
                          }}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                              : 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          force push
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue C: Detached HEAD */}
                  {(isSimulation ? isDetachedHeadSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-rose-300 bg-rose-50/80 shadow-xs' : 'border-rose-500/20 bg-rose-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'detached_head' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-rose-50/98 border border-rose-205 text-slate-900' 
                            : 'bg-slate-950/98 border border-rose-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-rose-600 dark:text-rose-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-rose-700 dark:text-rose-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.detached.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-violet-700 dark:text-violet-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.detached.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-rose-955 font-bold' : 'text-rose-300'}`}>
                              {sloc.detachedTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'detached_head' ? null : 'detached_head');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-rose-200/85 text-rose-955' : 'hover:bg-slate-800 text-rose-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.detachedDesc}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('detached_head')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-rose-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                          className="px-1.5 py-0.5 bg-rose-600 text-white border border-rose-500/25 rounded cursor-pointer font-medium hover:bg-rose-500 transition-colors"
                        >
                          {sloc.rescueBranchBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Issue D: Stale Base Branch */}
                  {(isSimulation ? isStaleBaseSimulated : false) && (
                    <div className={`border p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden ${theme === 'light' ? 'border-amber-300 bg-amber-50/80 shadow-xs' : 'border-amber-500/20 bg-amber-500/5'}`}>
                      {/* Interactive Tooltip Overlay */}
                      {activeTooltip === 'stale_base_branch' && (
                        <div className={`absolute inset-0 z-40 p-3 rounded-xl flex flex-col justify-between ${
                          theme === 'light' 
                            ? 'bg-amber-50/98 border border-amber-300 text-slate-900' 
                            : 'bg-slate-950/98 border border-amber-500/30 text-slate-100'
                        } backdrop-blur-xs transition-all duration-200 animate-fade-in`}>
                          <div className="flex flex-col gap-1.5 h-full overflow-y-auto pr-1 font-mono text-[10px]">
                            <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800/80">
                              <span className="font-bold flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 animate-pulse">
                                <HelpCircle className="w-3.5 h-3.5" />
                                {tone === TranslationTone.ENGLISH ? "DIAGNOSIS TIPS" : "CẨM NANG CHẨN ĐOÁN"}
                              </span>
                              <button 
                                onClick={() => setActiveTooltip(null)}
                                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition-all font-sans font-semibold ${
                                  theme === 'light' ? 'bg-slate-200/70 hover:bg-slate-250 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {tone === TranslationTone.ENGLISH ? "Close" : "Đóng"}
                              </button>
                            </div>
                            <div className="space-y-2 mt-1">
                              <div>
                                <span className="font-bold block text-[9.5px] text-amber-700 dark:text-amber-400">
                                  ❓ {tone === TranslationTone.ENGLISH ? "Why is this flagged?" : "Tại sao xảy ra?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.stale.why}
                                </p>
                              </div>
                              <div>
                                <span className="font-bold block text-[9.5px] text-violet-700 dark:text-violet-400">
                                  💡 {tone === TranslationTone.ENGLISH ? "How to resolve?" : "Cách khắc phục?"}
                                </span>
                                <p className="leading-relaxed mt-0.5 text-[9.5px] opacity-90 font-sans">
                                  {tooltipTexts[tone]?.stale.how}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1">
                        <div className="text-[11px] font-mono leading-tight w-full">
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className={`font-bold block ${theme === 'light' ? 'text-amber-955' : 'text-amber-305'}`}>
                              {sloc.staleBaseTitle}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip(activeTooltip === 'stale_base_branch' ? null : 'stale_base_branch');
                              }}
                              className={`p-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${
                                theme === 'light' ? 'hover:bg-amber-200/85 text-amber-955' : 'hover:bg-slate-800 text-amber-400'
                              }`}
                              title={tone === TranslationTone.ENGLISH ? "Learn why and how to resolve" : "Xem lý do và hướng giải quyết"}
                            >
                              <HelpCircle className="w-3.5 h-3.5 cursor-pointer animate-pulse" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sloc.staleBaseDesc.replace("{0}", wizard.baseBranch || 'develop')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDiagnoseProblem('stale_base_branch')}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded cursor-pointer transition-all active:scale-95 border border-violet-500/30"
                        >
                          {sloc.diagnoseBtn}
                        </button>
                      </div>

                      <div className={`flex gap-2 text-[10px] items-center border-t pt-1.5 font-mono ${theme === 'light' ? 'border-slate-200' : 'border-amber-500/10'}`}>
                        <span className="text-slate-500">{sloc.firstAidHeader}</span>
                        <button 
                          onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                          className={`px-1.5 py-0.5 border rounded cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 font-medium'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          fetch & pull sync
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean State Fallback */}
                  {!repoState.isDirty && 
                   !(isSimulation && isDivergedSimulated) && 
                   !(isSimulation && isDetachedHeadSimulated) && 
                   !(isSimulation && isStaleBaseSimulated) && (
                    <div className="border border-emerald-500/10 bg-emerald-950/5 p-3 rounded-xl text-center flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                      <div className="text-[10px] font-mono font-semibold text-emerald-300">
                        {sloc.cleanAllClearTitle}
                      </div>
                      <p className="text-[9px] text-slate-400 font-sans max-w-xs leading-relaxed">
                        {sloc.cleanAllClearDesc}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED ACTIVE DIAGNOSTIC CLINIC DRAWER REPORT */}
              {doctorProblem && (
                <div className="bg-[#111219] border border-violet-500/30 p-3 rounded-xl flex flex-col gap-2 animate-fade-in text-slate-300">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span className="text-[9px] font-mono font-black text-violet-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 text-violet-400 animate-pulse" />
                      {sloc.doctorRep}
                    </span>
                    <button
                      onClick={() => {
                        setDoctorProblem(null);
                        setDoctorDiagnosis(null);
                      }}
                      className="text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {doctorLoading ? (
                     <div className="flex flex-col items-center gap-2 py-4 text-center text-xs font-mono">
                       <span className="animate-spin h-4.5 w-4.5 border-2 border-violet-500 border-t-transparent rounded-full font-mono"></span>
                       <span className="text-slate-400 animate-pulse">{sloc.scanAnomaliesLoading}</span>
                     </div>
                  ) : doctorError ? (
                     <div className="text-[10px] font-mono text-rose-400 p-2 border border-rose-500/20 bg-rose-950/20 rounded">
                       ⚠️ {doctorError}
                     </div>
                  ) : doctorDiagnosis ? (
                     <div className="flex flex-col gap-2.5 animate-fadeIn">
                       {/* Animated Expert Consultant Dock */}
                       {(doctorDiagnosis.dr_compiler || doctorDiagnosis.dr_schema) && (
                         <div className="flex gap-1.5 border-b border-[#2d2f3c]/40 pb-2">
                           <button
                             type="button"
                             onClick={() => setActiveDoctorTab('overlord')}
                             className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                               activeDoctorTab === 'overlord'
                                 ? 'bg-violet-600/15 border-violet-500/50 text-violet-300'
                                 : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                             }`}
                           >
                             <span>👑</span> Overlord
                           </button>
                           {doctorDiagnosis.dr_compiler && (
                             <button
                               type="button"
                               onClick={() => setActiveDoctorTab('compiler')}
                               className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                 activeDoctorTab === 'compiler'
                                   ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-300'
                                   : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                               }`}
                             >
                               <span>💻</span> Compiler
                             </button>
                           )}
                           {doctorDiagnosis.dr_schema && (
                             <button
                               type="button"
                               onClick={() => setActiveDoctorTab('schema')}
                               className={`flex-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                 activeDoctorTab === 'schema'
                                   ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300'
                                   : 'bg-[#0a0b10] border-[#2d2f3c]/20 text-slate-400 hover:text-slate-300'
                               }`}
                             >
                               <span>🗃️</span> Dr. Schema
                             </button>
                           )}
                         </div>
                       )}

                       {/* List affected files if working tree is dirty */}
                       {doctorProblem === 'dirty_working_tree' && repoState.dirtyFiles && repoState.dirtyFiles.length > 0 && (
                         <div className="text-[10px] text-slate-300 bg-slate-950/30 p-2 rounded border border-[#2d2f3c]/30 flex flex-col gap-1.5">
                           <strong className="text-[9px] font-mono font-bold text-violet-350 uppercase block tracking-wider">
                             {sloc.dirtyFilesLabel}
                           </strong>
                           <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                             {repoState.dirtyFiles.map(file => (
                               <div key={file} className="flex items-center gap-1 font-mono text-[9px]">
                                 <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                                 <span className={`px-1.5 py-0.5 rounded border ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-705' : 'bg-slate-900/40 border-amber-500/10 text-amber-300'}`}>
                                   {file}
                                 </span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       {(() => {
                         const activeDoc = 
                           activeDoctorTab === 'compiler' && doctorDiagnosis.dr_compiler ? doctorDiagnosis.dr_compiler :
                           activeDoctorTab === 'schema' && doctorDiagnosis.dr_schema ? doctorDiagnosis.dr_schema :
                           doctorDiagnosis.dr_overlord;

                         const docStyle = 
                           activeDoctorTab === 'compiler' ? { border: 'border-emerald-500/30', text: 'text-emerald-300', bg: 'bg-emerald-950/20' } :
                           activeDoctorTab === 'schema' ? { border: 'border-cyan-500/30', text: 'text-cyan-300', bg: 'bg-cyan-950/20' } :
                           { border: 'border-violet-500/25', text: 'text-violet-300', bg: 'bg-slate-950/50' };

                         const headingLabel = 
                           activeDoctorTab === 'compiler' ? "🩺 BÁO CÁO CÚ PHÁP (DR. COMPILER)" :
                           activeDoctorTab === 'schema' ? "🩺 CHẨN ĐOÁN CƠ SỞ DỮ LIỆU (DR. SCHEMA)" :
                           "🩺 THAM VẤN HỆ THỐNG (DR. OVERLORD)";

                         return (
                           <div className="flex flex-col gap-2 animate-fadeIn font-mono">
                             <div className={`text-[10px] text-slate-350 p-2.5 rounded-lg border ${docStyle.border} ${docStyle.bg}`}>
                               <strong className={`text-[9px] font-mono font-bold uppercase block tracking-wider ${docStyle.text}`}>
                                 {headingLabel}
                               </strong>
                               <p className="font-sans leading-relaxed text-slate-200 mt-1 whitespace-pre-line text-[11px]">
                                 {activeDoc.explanation}
                               </p>
                             </div>

                             <div className="text-[10px] text-slate-300 bg-indigo-950/15 p-2.5 rounded-lg border border-indigo-500/15">
                               <strong className="text-[9px] font-mono font-bold text-[#a5b4fc] uppercase block tracking-wider">
                                 💡 CHỈ ĐỊNH ĐIỀU TRỊ (MITIGATION PLAN)
                               </strong>
                               <div className="font-sans leading-relaxed text-slate-250 mt-1 whitespace-pre-line border-l-2 border-indigo-500/30 pl-2 text-[11px]">
                                 {activeDoc.mitigation}
                               </div>
                             </div>
                           </div>
                         );
                       })()}

                       {/* Inject quick operation under summary based on problem */}
                       <div className="flex justify-end gap-1.5 mt-0.5">
                         {doctorProblem === 'dirty_working_tree' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('dirty_working_tree', 'stash')}
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyStash}
                           </button>
                         )}
                         {doctorProblem === 'diverged_branch' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('diverged_branch', 'rebase_pull')}
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyRebase}
                           </button>
                         )}
                         {doctorProblem === 'detached_head' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('detached_head', 'recover')}
                             className="px-2 py-1 bg-rose-600 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplyRescue}
                           </button>
                         )}
                         {doctorProblem === 'stale_base_branch' && (
                           <button
                             onClick={() => handleTriggerDoctorAction('stale_base_branch', 'sync_base')}
                             className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] font-bold rounded transition-all cursor-pointer"
                           >
                             {sloc.doctorApplySync}
                           </button>
                         )}
                       </div>
                     </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {isUpgraded && (
            <ReflogRescuePanel
              theme={theme}
              tone={tone}
              onRescueCommit={handleRescueCommit}
            />
          )}

            {/* Dynamic visual terminal logger console */}
            <TerminalPanel
              logs={logs}
              showLogPanel={showLogPanel}
              onToggleLogPanel={() => setShowLogPanel(!showLogPanel)}
              onClearLogs={() => setLogs([])}
              tone={tone}
              isSimulation={isSimulation}
              isAiEnabled={isAiEnabled}
              onCommandExecuted={() => handleRefresh(true)}
              addLog={addLog}
              resolveApiUrl={resolveApiUrl}
              theme={theme}
            />

          </div>

        </div>

        {/* Dashboard Footer credits and hints */}
        <div className={`rounded-xl p-4 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center gap-2 mt-2 border transition-colors duration-200 ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#0b0f19]/40 border-slate-900/60'}`}>
          <span>Rebase Overlord — The Git Feature Flow Assistant</span>
          <span className="flex items-center gap-1 text-[10px]">
            Created for <strong className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>boybibo98@gmail.com</strong>
          </span>
        </div>

        {/* Floating Toast Notification Containers for Achievements and Easter Eggs */}
        <div id="rebase-overlord-toast-container" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3.5 max-w-[420px] w-full p-4 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`pointer-events-auto p-4 rounded-xl border shadow-2xl flex gap-3.5 relative backdrop-blur-md transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white/98 border-slate-200/90 text-slate-800 shadow-slate-300/40'
                    : 'bg-[#070913]/95 border-slate-800 text-slate-100 shadow-black'
                } ${
                  toast.type === 'milestone'
                    ? theme === 'light'
                      ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/10 to-white/98'
                      : 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-[#070913]/95'
                    : toast.type === 'owl'
                    ? theme === 'light'
                      ? 'border-indigo-400/50 bg-gradient-to-r from-indigo-500/10 to-white/98'
                      : 'border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-[#070913]/95'
                    : toast.type === 'rage'
                    ? theme === 'light'
                      ? 'border-rose-400/50 bg-gradient-to-r from-rose-500/10 to-white/98'
                      : 'border-rose-500/30 bg-gradient-to-r from-rose-950/20 to-[#070913]/95'
                    : ''
                }`}
              >
                {/* Accent line on left */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-xl ${
                  toast.type === 'milestone' ? 'bg-amber-500' : toast.type === 'owl' ? 'bg-indigo-500' : toast.type === 'rage' ? 'bg-rose-500' : 'bg-slate-400'
                }`} />

                {toast.emoji && (
                  <div className={`text-2xl select-none shrink-0 ${toast.type === 'rage' ? 'animate-bounce' : 'animate-pulse'}`}>
                    {toast.emoji}
                  </div>
                )}

                <div className="flex-1 font-sans pr-4">
                  <h5 className={`text-xs font-bold font-mono tracking-wider uppercase mb-1 ${
                    toast.type === 'milestone'
                      ? 'text-amber-600 dark:text-amber-400'
                      : toast.type === 'owl'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : toast.type === 'rage'
                      ? 'text-rose-600 dark:text-rose-400'
                      : (theme === 'light' ? 'text-slate-700' : 'text-slate-300')
                  }`}>
                    {toast.title}
                  </h5>
                  <p className={`text-[11px] leading-relaxed font-sans font-medium whitespace-pre-line ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className={`absolute top-3 right-3 p-1 rounded-lg transition-all cursor-pointer ${
                    theme === 'light' ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
                  }`}
                  title="Dismiss alert"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      {/* Interactive Deep-context Git Doctor Messenger Chatbot */}
        <AiDoctorFloatingChat
          repoState={repoState}
          tone={tone}
          isAiEnabled={isAiEnabled}
          onToggleAi={() => {
            const newVal = !isAiEnabled;
            setIsAiEnabled(newVal);
            addLog(newVal ? '🤖 AI Engine Enabled (Full AI Features activated)' : '🤖 AI Engine Disabled (Cost saved - falling back to offline mode)');
          }}
          theme={theme}
          appVersion={appVersion}
          isUpgraded={isUpgraded}
        />

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {confirmModal && confirmModal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmModal(null)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-50 ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#0f172a] border-slate-800 text-slate-100'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {confirmModal.title}
                    </h3>
                    <p className={`text-[11px] mt-1.5 leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {confirmModal.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs text-mono">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tone === TranslationTone.ENGLISH ? 'Cancel' : tone === TranslationTone.TOXIC ? 'Thôi cút' : 'Hủy bỏ'}
                  </button>
                  <button
                    onClick={() => {
                      confirmModal.onConfirm();
                      setConfirmModal(null);
                    }}
                    className="px-3.5 py-1.5 rounded font-bold text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/20 shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
                  >
                    {tone === TranslationTone.ENGLISH ? 'Confirm' : tone === TranslationTone.TOXIC ? 'Chốt luôn, sợ đéo' : 'Xác nhận'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {updateFailedModal && updateFailedModal.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUpdateFailedModal(null)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`relative max-w-md w-full p-6 rounded-xl border shadow-2xl font-mono z-50 ${
                  theme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#0f172a] border-rose-950 text-slate-100 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-500 shrink-0 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-bounce animate-duration-1000">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-rose-500 flex items-center gap-2">
                      {updateFailedModal.title}
                      {updateFailedModal.exitCode !== undefined && (
                        <span className="text-[10px] bg-red-550/10 font-bold border border-red-500/35 text-red-400 px-1.5 py-0.5 rounded">
                          CODE {updateFailedModal.exitCode}
                        </span>
                      )}
                    </h3>
                    <p className={`text-[11px] mt-2 leading-relaxed ${theme === 'light' ? 'text-slate-650' : 'text-slate-350'}`}>
                      {updateFailedModal.message}
                    </p>
                    <div className={`mt-3 p-2.5 rounded border text-[10px] bg-red-950/20 border-red-900/30 font-semibold font-mono ${theme === 'light' ? 'text-red-800' : 'text-red-400'}`}>
                      STATUS: Fail: Binary execution restricted or signature checks failed.
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-200/10 text-xs text-mono">
                  <button
                    onClick={() => {
                      // Trigger diagnostic clearing
                      fetch(resolveApiUrl('/api/update/check?clear_fail=true'))
                        .then(() => {
                          setUpdateFailedModal(null);
                          triggerToast('success', 'Cleared Simulation', 'Simulation failure status has been cleared.');
                          addLog('✓ [SUCCESS] Diagnostics cleared.');
                        })
                        .catch(() => setUpdateFailedModal(null));
                    }}
                    className={`px-3 py-1.5 rounded font-medium border cursor-pointer select-none transition-all active:scale-[0.98] ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-750 text-slate-350 hover:text-slate-100 font-bold'
                    }`}
                  >
                    Clear failure state & Close
                  </button>
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="px-3.5 py-1.5 rounded font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-rose-500/20 shadow-md cursor-pointer select-none transition-all active:scale-[0.98] flex items-center gap-1"
                  >
                    🔄 Restart & Recheck
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
