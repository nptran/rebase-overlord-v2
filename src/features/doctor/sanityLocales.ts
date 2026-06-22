import { TranslationTone } from '../../types';

export const sanityLoc: Record<TranslationTone, {
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
  simScenarioLargeHistory: string;
  simScenarioLargeNonLinear: string;
  simScenarioPowerBI: string;
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
    simScenarioLargeHistory: "Kịch bản siêu nhiều commits (30+ commits tuyến tính)",
    simScenarioLargeNonLinear: "Kịch bản siêu lớn + phi tuyến (40+ commits, nhiều nhánh)",
    simScenarioPowerBI: "Xung đột Power BI phức tạp (.tmdl + .json) (Power BI)",
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
    simScenarioLinear: "Nhánh thẳng tuột như ruột ngựa (Linear)",
    simScenarioNonLinear: "Có Merge Commit phá đám từ develop (Merge)",
    simScenarioRewrite: "Sau lưng đã bị viết lại lịch sử (Diverged)",
    simScenarioStale: "Base ở xó chợ mốc meo (Stale Base)",
    simScenarioDetached: "Đứt dây neo trôi vô định (Detached HEAD)",
    simScenarioLargeHistory: "Nhánh th siêu dài thườn thượt (30+ commits tuyến tính)",
    simScenarioLargeNonLinear: "Nhánh khủng phi tuyến lằng nhằng (40+ commits, 3 nhánh quấn nhau)",
    simScenarioPowerBI: "Độ bom xịt Power BI siêu rắc rối (.tmdl & .json) (Power BI)",
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
    simScenarioLargeHistory: "Nhánh dài tổ bố 30+ phát commit tuyến tính",
    simScenarioLargeNonLinear: "Đống rác khổng lồ 40+ commits quấn lộn lằng nhằn",
    simScenarioPowerBI: "Bãi rác Power BI lằng nhằng nổ tung đầu (.tmdl & .json) (Power BI)",
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
    simScenarioLargeHistory: "Large Linear Branch History (30+ Commits)",
    simScenarioLargeNonLinear: "Large Non-Linear History (40+ Commits, Multi-branch)",
    simScenarioPowerBI: "Complex Power BI Conflict Scenario (.tmdl & .json) (Power BI)",
    simScenarioDesc: "Simulate complex, real-world, non-linear Git histories to test commit graph layout and live anomaly warning diagnostics."
  }
};

export const staleWarningLoc = {
  [TranslationTone.PROFESSIONAL]: {
    modalTitle: "Cảnh báo: Nhánh quá cũ! 🕒",
    desc: (branch: string, age: string) => `Nhánh "${branch}" đã không có cập nhật mới trong ${age}. Việc trực tiếp Checkout / Rebase nhánh này có thể tiềm ẩn rủi ro xung đột (conflict) cực kỳ nghiêm trọng do code nền của dự án đã thay đổi quá nhanh.`,
    suggestion: "💡 Đề xuất an toàn: Khởi tạo một nhánh siêu sạch mới từ Base Branch hiện tại và đắp toàn bộ code thay đổi (commit changes) từ nhánh cũ sang.",
    selectBase: "Chọn nhánh nền (Base Branch) để rẽ nhánh mới:",
    newBranchInput: "Tên nhánh sạch mới:",
    buttonAutoMigrate: "Tự động Di chuyển & Làm sạch 🚀",
    buttonCheckoutAnyway: "Vẫn chuyển nhánh (Mạo hiểm ⚠️)",
    buttonCancel: "Hủy bỏ",
    migratingTitle: "Đang di chuyển nhánh cũ...",
    migrateSuccess: "✓ Đã tạo nhánh sạch mới và đồng bộ toàn bộ thay đổi thành công!",
  },
  [TranslationTone.JOKE]: {
    modalTitle: "Ới sếp! Nhánh này từ thời đồ đá rồi! 🦖",
    desc: (branch: string, age: string) => `Nhánh "${branch}" đóng băng tận ${age} rồi ní ơi. Leo lên thuyền này rebase hay checkout là va phải đá ngầm, conflict ngập mặt mệt xỉu á nha!`,
    suggestion: "💡 Kế khích tướng: Đẻ một nhánh tút lại vẻ đẹp trai từ nhánh base hiện tại rồi bê nguyên đai nguyên kiện ruột code cũ sang cho mượt bốc đầu.",
    selectBase: "Chọn gốc tổ tiên (Base Branch) để đu bám:",
    newBranchInput: "Tên nhánh mướt rượt mới:",
    buttonAutoMigrate: "Đẻ nhánh mới gom code auto 🚀",
    buttonCheckoutAnyway: "Kệ, cứ nhảy hố vôi (Liều ăn nhiều ⚠️)",
    buttonCancel: "Thôi quay xe",
    migratingTitle: "Đang gột rửa code thời đồ đá...",
    migrateSuccess: "✓ Đẻ nhánh mới mượt mà, bê code cũ sang sạch coong sếp ơi!",
  },
  [TranslationTone.TOXIC]: {
    modalTitle: "⚠️ CẢNH BÁO: NHÁNH CỔ LỖ SĨ, ĐỪNG CÓ NGU! ⚠️",
    desc: (branch: string, age: string) => `Cái nhánh rác rưởi "${branch}" này chết trôi ${age} rồi chưa chịu chôn! Mày định đâm đầu lôi nó ra rebase để ăn cả tấn conflict vào mồm à thằng ngốc?`,
    suggestion: "💡 Lời khuyên cho bớt ngu: Đẻ nhánh mới tinh từ gốc xịn, sau đó gom hết code rác từ nhánh cũ nhét sang một nốt nhạc.",
    selectBase: "Nhánh tổ tông rác ở đâu để bám:",
    newBranchInput: "Đặt tên nhánh rác mới lẹ lên:",
    buttonAutoMigrate: "Gom rác sang nhánh mới tự động 🚀",
    buttonCheckoutAnyway: "Cút sang luôn đi tao xem mày khổ ⚠️",
    buttonCancel: "Sợ quá, hủy gấp!",
    migratingTitle: "Đang dọn rác cổ lỗ sĩ...",
    migrateSuccess: "✓ Đã nhét hết code rác sang nhánh mới sạch sẽ rồi đấy!",
  },
  [TranslationTone.ENGLISH]: {
    modalTitle: "Warning: Stale Branch Detected! 🕒",
    desc: (branch: string, age: string) => `The branch "${branch}" hasn't been active in ${age}. Directly checking out or rebasing this branch poses a high risk of heavy merge conflicts as the base branch has evolved significantly.`,
    suggestion: "💡 Recommended Strategy: Spawn a fresh branch starting from the active base branch and automatically consolidate/cherry-pick the stale changes on top of it.",
    selectBase: "Choose Base Branch to spawn from:",
    newBranchInput: "Fresh branch name:",
    buttonAutoMigrate: "Auto-Migrate to Fresh Branch 🚀",
    buttonCheckoutAnyway: "Checkout anyway (Risky ⚠️)",
    buttonCancel: "Cancel",
    migratingTitle: "Migrating stale commits...",
    migrateSuccess: "✓ Created a healthy fresh branch and fully synced consolidated changes!",
  }
};

export const tooltipTexts: Record<TranslationTone, Record<string, { why: string; how: string }>> = {
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
