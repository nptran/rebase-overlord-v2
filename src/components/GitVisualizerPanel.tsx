/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Tv,
  ArrowRight,
  Bookmark,
  CloudLightning,
  AlertOctagon,
  Flame,
  CheckCircle,
  HelpCircle as QuestionIcon,
  RefreshCw,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Move,
  Link,
  FlaskConical,
  Minimize2,
  Maximize2,
  Layers
} from 'lucide-react';
import { TranslationTone, WizardState, GitRepoState } from '../types';

// Let's declare our available visualization types
export type VisualActionType = 'rebase' | 'stash' | 'merge' | 'commit' | 'push' | 'diverge' | 'fast-forward';

interface VisualStep {
  title: string;
  desc: string;
  // Specific visual position coordinates or properties can be derived inside render
}

interface ToneLocalizations {
  title: string;
  subtitle: string;
  selectPrompt: string;
  playBtn: string;
  pauseBtn: string;
  resetBtn: string;
  nextStepBtn: string;
  prevStepBtn: string;
  localLabel: string;
  remoteLabel: string;
  underTheHoodLabel: string;
  expectedResultLabel: string;
  syncToggleLabel: string;
  syncToggleActive: string;
  legendLabel: string;
  localBranchLegend: string;
  remoteBranchLegend: string;
  explanationTitle: string;
  opLabels: Record<VisualActionType, string>;
  opShortSummaries: Record<VisualActionType, string>;
  opDescriptions: Record<VisualActionType, Record<number, string>>; // stepIndex -> string
  opUnderTheHood: Record<VisualActionType, string>;
  opResult: Record<VisualActionType, string>;
}

const localizations: Record<TranslationTone, ToneLocalizations> = {
  [TranslationTone.PROFESSIONAL]: {
    title: "SA BÀN GIT ĐA TƯƠNG TÁC (INTERACTIVE GIT FLOW VISUALIZER)",
    subtitle: "Minh họa hoạt ảnh từng bước cách Git vận hành ở hậu trường",
    selectPrompt: "Chọn một tác vụ cần giải phẫu:",
    playBtn: "Phát trực quan",
    pauseBtn: "Tạm dừng",
    resetBtn: "Về ban đầu",
    nextStepBtn: "Bước sau",
    prevStepBtn: "Bước trước",
    localLabel: "Máy cá nhân (Local Repo)",
    remoteLabel: "Ủy thác (Remote Server)",
    underTheHoodLabel: "🔩 HOẠT ĐỘNG THỰC TẾ TRONG GIT:",
    expectedResultLabel: "🎯 KẾT QUẢ CUỐI CÙNG:",
    syncToggleLabel: "🔄 Đồng bộ với tiến trình Wizard",
    syncToggleActive: "Đang bám sát từng bước",
    legendLabel: "CHÚ THÍCH SƠ ĐỒ:",
    localBranchLegend: "💻 Local Branch / Commit (Viền đặc liền nét)",
    remoteBranchLegend: "☁️ origin/* (Remote-Tracking Branch - Viền nét đứt)",
    explanationTitle: "GIẢI THÍCH CHI TIẾT BƯỚC {step}:",
    opLabels: {
      rebase: "git rebase",
      stash: "git stash",
      merge: "git merge",
      commit: "git commit",
      push: "git push",
      diverge: "divergence (lệch nhánh)",
      'fast-forward': "fast-forward merge"
    },
    opShortSummaries: {
      rebase: "Tách commits nhánh con, cập nhật base mới rồi đắp tuần tự các thay đổi lên trên.",
      stash: "Cất tạm đống code dang dở vào tủ khóa để dọn sạch workspace mà không sợ mất.",
      merge: "Gộp hai nhánh lại bằng cách tạo một commit chung liên kết cả hai nguồn gốc.",
      commit: "Chụp ảnh trạng thái staging, lưu trữ vĩnh viễn và tiến con trỏ HEAD về trước.",
      push: "Tải toàn bộ commits mới từ máy cá nhân lên server và cập nhật pointer từ xa.",
      diverge: "Local và Remote cùng có commits mới khác nhau khiến push bị từ chối thẳng thừng.",
      'fast-forward': "Di chuyển trực tiếp nhãn con trỏ mà không cần tạo commit gộp (0ms)."
    },
    opUnderTheHood: {
      rebase: "Git lưu trữ các commit con gốc tạm thời dưới định dạng patch, đưa HEAD về base mới, rồi lần lượt áp từng patch, tự động tạo mã băm (SHA-1 hash) hoàn toàn mới cho từng commit.",
      stash: "Thay đổi trong Working Tree và Index được lưu trữ dưới dạng các đối tượng commit đặc biệt trỏ đến bởi ref 'refs/stash' dưới dạng stack LIFO, khôi phục lại mã nguồn về trạng thái HEAD sạch sẽ.",
      merge: "Tìm kiếm Commit Tổ tiên chung gần nhất (Common Ancestor), thực hiện so sánh 3 chiều (three-way merge). Nếu không xung đột, tự tạo một commit chứa hai con trỏ cha (parents).",
      commit: "Nén các file đã stage thành các đối tượng blob, xây dựng sơ đồ cây thư mục (tree object), ghi nhận thông tin tác giả và đóng gói thành commit trỏ về commit cha trước đó.",
      push: "Tính toán gói delta nén (pack file) các commits local mà remote chưa có, truyền qua giao thức SSH/HTTPS, cập nhật an toàn các file pointer refs/remotes/origin/* trên máy chủ.",
      diverge: "Nhãn remote và nhãn local không còn nằm trên cùng một đường thẳng tuyến tính. Cần thực hiện tích hợp trước (rebase/merge) để đồng nhất lịch sử trước khi gửi dữ liệu lên.",
      'fast-forward': "Nếu nhánh mục tiêu không có commit nào mới hơn nhánh nguồn kể từ điểm chia nhánh, Git chỉ dời tham chiếu (ref) của nhánh mục tiêu thẳng tiến tới đầu nhánh nguồn."
    },
    opResult: {
      rebase: "Một chuỗi lịch sử tuyến tính (thẳng mượt 100%), không sinh commit merge dư thừa, cực kỳ dễ đọc.",
      stash: "Workspace trống trải, an toàn để chuyển nhánh, lúc cần chỉ việc 'git stash pop' để gọi lại code.",
      merge: "Nhánh đích gộp trọn mã nguồn nhánh nguồn, đồ thị lịch sử bị rẽ nhiều đường phức tạp nhưng chân thực.",
      commit: "Lịch sử local ghi nhận mốc thời gian mới, mã nguồn của bạn được sao lưu an toàn ở local database.",
      push: "Cả local và remote đều trỏ đúng tới cùng một đỉnh commit mới nhất, đồng nghiệp có thể kéo code về.",
      diverge: "Sự cố bị đẩy lùi nếu bạn biết rebase đúng cách, tránh được tình trạng đè nát code của nhau.",
      'fast-forward': "Đầu nhánh gốc nhảy vọt tới đỉnh nhánh con ngay lập tức mà không có vết tích đứt đoạn."
    },
    opDescriptions: {
      rebase: {
        0: "Bối cảnh: Nhánh chính (Develop) có commit mới (M3) sau khi bạn bắt đầu code nhánh Feature (đang có F1, F2 rẽ từ M1).",
        1: "Tách rời: Git tháo rời tạm thời F1 và F2 ra khỏi móng cũ M1, cất chúng vào vùng patch bộ nhớ đệm.",
        2: "Trượt móng: Đầu nhánh Feature được điều hướng dời thẳng tiến tới vị trí commit mới nhất của Develop (M3).",
        3: "Áp commit F1: Git dán lại F1 lên đỉnh M3 thành F1'. Lưu ý: F1' có mã băm commit hoàn toàn khác với F1!",
        4: "Áp commit F2: Cứ thế dán tiếp F2 lên đỉnh F1' thành F2'. Hoàn hảo! Lịch sử rebase thẳng băng như một đường đua!"
      },
      stash: {
        0: "Bối cảnh: Bạn đang sửa dở dang fileA.js (màu đỏ) nhưng đột ngột phải nhảy sang sửa lỗi gấp ở nhánh khác.",
        1: "Đóng gói: Ra lệnh 'git stash', Git hốt trọn toàn bộ code sửa dở dang gói kín lại thành một gói quà.",
        2: "Cất vào két: Đẩy gói quà đó thả bổ nhào vào ngăn chứa Stash Stack (stash@{0}) an toàn.",
        3: "Tẩy rửa: Working Directory của bạn lập tức trở nên trắng sáng tinh tươm như chưa hề sửa gì.",
        4: "Hồi sinh: Khi quay lại, gõ 'git stash pop', tủ kính mở ra trả lại code dở dang về đúng chỗ cũ để code tiếp!"
      },
      merge: {
        0: "Bối cảnh: Develop có mốc M3, Feature có F1, F2 phát triển độc lập và bạn muốn gộp code dứt điểm.",
        1: "Tìm gốc: Git tự động mò về điểm xuất phát chung xa xưa M1 để so sánh sòng phẳng sự khác biệt.",
        2: "Cộng gộp: Git kết nối song song kéo cả hai đầu dây mốc M3 và F2 quy về một mối.",
        3: "Tạo liên mốc: Một commit liên minh mới (M4 - Merge Commit) được sinh ra, đứng trên vai của cả M3 lẫn F2!",
        4: "Đồng nhất: Trục phát triển chính thức hợp nhất thành công với đồ thị mạng nhện đặc trưng."
      },
      commit: {
        0: "Bối cảnh: Tập tin sửa đổi của bạn đang xếp hàng lơ lửng ở khu vực chờ (Staging Area).",
        1: "Chụp ảnh: Bạn gõ 'git commit -m \"feat: added billing\"', Git chớp camera đóng băng toàn bộ file.",
        2: "Tạo quả Hash: Chuyển dữ liệu thành một khối tròn mã băm C3 trỏ ngược về cha lành C2.",
        3: "Tiến bệ phóng: Pointer hiện tại rồ ga chạy thẳng tới ôm lấy khối C3 mới sinh. Hoàn thành ghi chép!"
      },
      push: {
        0: "Bối cảnh: Trực thăng Local ở mốc C3 nhưng tàu ngầm Remote Server vẫn còn tụt lại ở mốc cũ C2.",
        1: "Packs dữ liệu: Sẵn sàng phóng 'git push origin main', đóng gói hành lý C3 chuyển qua cáp quang biển.",
        2: "Phóng vút bay: Quả commit local C3 bay vèo vèo vượt biên giới mây khói hạ cánh xuống Remote.",
        3: "Cắm cờ: Nhãn 'origin/main' trên Remote dời mông nhảy lên mốc C3. Hai thế giới local-remote hòa làm một!"
      },
      diverge: {
        0: "Bối cảnh: Điểm chung là C1. Bạn lập trình âm thầm đẻ ra L2 ở Local. Ở nửa kia bán cầu, đồng nghiệp đẩy sút R2 lên Remote.",
        1: "Xung mạch: Bạn gõ 'git push', Git hoảng hốt phát hiện đường đi bị chẻ thành hai ngả đường chông gai.",
        2: "Khóa nòng: Máy chủ thẳng tay từ chối (Reject) lệnh push của bạn vì không thể leo lên tuyến tính.",
        3: "Dọn dẹp: Bắt buộc chọn kéo về nén Rebase hoặc nhắm mắt nhắm mũi Merge dọn rác để quy về một mối."
      },
      'fast-forward': {
        0: "Bối cảnh: Main đang ở mốc M2, Feature tiến lên M3, M4 độc tôn mà Main không phát sinh thêm commit lẻ nào.",
        1: "Phán đoán: Git nhận thấy đây là đường thẳng tắp, không có một chướng ngại vật hay ngã rẽ phức tạp nào cả.",
        2: "Trượt tiêu điểm: Không cần đẻ thêm commit gộp, Git tháo chốt nhãn 'main' và trượt phăm phăm về đỉnh M4.",
        3: "Bình yên: Main và Feature chạm trán tại M4 chỉ trong một tích tắc cực nhanh, không một dấu vết nối rác."
      }
    }
  },
  [TranslationTone.JOKE]: {
    title: "🎪 RẠP CHIẾU HOẠT HÌNH GIT TRỰC QUAN (GIT MOVIE THEATER)",
    subtitle: "Rạp chiếu phim hoạt hình giải mã Git siêu dễ hiểu cho hội sếp lười đọc tài liệu",
    selectPrompt: "Chọn quẻ bói hoạt họa cần xem:",
    playBtn: "Quẩy phim ngay",
    pauseBtn: "Ấn nút xịt",
    resetBtn: "Xem lại từ đầu",
    nextStepBtn: "Tập tiếp theo",
    prevStepBtn: "Tập trước đó",
    localLabel: "Máy cỏ sếp xài (Local)",
    remoteLabel: "Két sắt trên mây (Remote Server)",
    underTheHoodLabel: "🧙 BÊN TRONG CỖ MÁY PHÉP THUẬT:",
    expectedResultLabel: "🎁 QUÀ KHUI ĐƯỢC CUỐI NGÀY:",
    syncToggleLabel: "🛸 Bám đuôi từng bước của Wizard",
    syncToggleActive: "Hệ thống tự động đeo bám sếp",
    legendLabel: "GIẢI MÃ BẢN ĐỒ HUYỀN THUẬT:",
    localBranchLegend: "💻 Nhánh cỏ dưới máy sếp (Local Branch - Viền đặc)",
    remoteBranchLegend: "☁️ origin/* Đồ cổ trên mây (Remote-Tracking - Viền đứt/mây lơ lửng)",
    explanationTitle: "GIẢI THÍCH CHI TIẾT BƯỚC {step}:",
    opLabels: {
      rebase: "git rebase (Nhổ rễ cắm nhờ)",
      stash: "git stash (Hòm giấu quỹ đen)",
      merge: "git merge (Hợp hôn 2 dòng họ)",
      commit: "git commit (Cúng cụ đóng tủ)",
      push: "git push (Sút bóng lên mây)",
      diverge: "Diverge (Mỗi người một ngả)",
      'fast-forward': "Fast-forward (Nhảy cóc thần tốc)"
    },
    opShortSummaries: {
      rebase: "Bứng nguyên dàn commit con yêu quý đem cắm ký sinh lên đầu đỉnh cao của nhánh chính.",
      stash: "Nhét vội xấp code viết dở vào phong bao lì xì đem giấu sau bức tranh treo tường.",
      merge: "Kết duyên 2 nhánh, sinh ra một đứa con chung làm chứng nhân hòa bình (nhận cả 2 bố mẹ).",
      commit: "Đóng hộp sản phẩm, dán nhãn, thề cam kết không đổi ý rồi đẩy vào kho lưu trữ.",
      push: "Đóng thùng bọc chống sốc phóng vèo vèo lên kho đám mây cho thế giới chiêm ngưỡng.",
      diverge: "Sếp đi đường sếp, em đi đường em, hai ta lạc lối đâm đầu vào ngõ cụt conflict nổ tung.",
      'fast-forward': "Trượt ván mượt mà tiến thẳng tới đích không cần tốn 1 calo vẽ đường cong liên hiệp."
    },
    opUnderTheHood: {
      rebase: "Git hóa thân thành thần rừng, tạm nhổ các commit ra khỏi đất cũ, xúc dọn nền móng phẳng tăm tắp rồi trồng từng commit đắp chồng lên nhau như xếp gạch Lego.",
      stash: "Lén lút lập một kho lưu kho tạm bên lề đường, gom hết quần áo code chưa giặt sạch ném vội vào, khóa cửa tủ để phòng khách trông tươm tất đón khách.",
      merge: "Triệu hồi buổi họp gia đình 3 bên để tìm điểm đồng điệu, dán keo 502 hai đầu nhánh dính bét vào một quả bom commit chung cực khủng.",
      commit: "Chụp một pô ảnh lưu niệm kỷ niệm ngày code xong, gán cho nó mã định danh bí truyền để sau này lỡ có rách việc còn biết đường trốn nợ.",
      push: "Mở cổng không gian gửi bưu kiện mã hóa xuyên lục địa sang đại bản doanh GitHub, ép máy chủ bên kia cập nhật nhãn dán cho bằng chị bằng em.",
      diverge: "Chiến tranh lạnh xảy ra khi hai đầu cầu không ai chịu nhường ai, cùng múa code độc lập trên một gốc nên server khóa cổng không cho bọc hàng chui qua.",
      'fast-forward': "Lười biếng level tối thượng, Git bảo 'Đường thẳng băng thế này cần gì bắc cầu!', thế là đẩy nhãn di chuyển vèo cái xong phim."
    },
    opResult: {
      rebase: "Cây phả hệ gia đình thẳng đuồn đuột như cây tre trăm đốt, sếp nhìn vào khen nức nở vì dễ hiểu.",
      stash: "Workspace sạch bóng không một vết tích ăn vụng, tha hồ đi la cà nhánh khác mà không bị phát hiện.",
      merge: "Nhánh chung sum họp, mạng lưới quan hệ chằng chéo nhìn như tơ nhện nhưng không mất một cọng lông code nào.",
      commit: "Ghi danh bảng vàng lịch sử local, có bùa hộ mệnh có thể quay xe reset bất cứ khi nào hối hận.",
      push: "Hàng đã lên kệ, sếp ở Mỹ mở máy lên thấy code chạy vù vù, hết lý do trừ lương của em.",
      diverge: "Bi kịch tình yêu chia cắt! Nhưng gỡ được bằng rebase thì lại nắm tay nhau hạnh phúc.",
      'fast-forward': "Nhập cuộc êm ái, người ngoài nhìn vào cứ tưởng sếp múa phép dịch chuyển tức thời."
    },
    opDescriptions: {
      rebase: {
        0: "Xem kìa sếp: Develop trèo lên đỉnh M3 mới coong, trong khi nhánh Feature của sếp vẫn bám víu ở gốc M1 xa xưa.",
        1: "Nhổ gốc: Git nhổ tận rễ 2 củ khoai tây F1, F2 của sếp lên, cho ngồi xích lô chờ tạm ở sảnh chờ.",
        2: "Xây móng: Đường xá Develop dọn sẵn bọc lót lên tít đỉnh M3 trơn tru.",
        3: "Trồng khoai F1: Git cắm củ F1 lên đầu M3 thành F1'. Nhìn xa thì giống nhưng thực ra linh hồn củ khoai đã thay đổi!",
        4: "Trồng khoai F2: Gối đầu dán tiếp F2 lên đầu F1' thành F2'. Tuyệt tác! Lịch sử thẳng tuột sếp húp trọn vẹn điểm mười dưỡng thê!"
      },
      stash: {
        0: "Sếp đang vẽ bậy fileA.js (đốm đỏ lòm) dở tay thì sếp tổng gọi đi họp khẩn cấp bắt đổi nhánh.",
        1: "Gom rác: Sếp bấm 'vứt tạm bọc quần áo dơ', Git lập tức ôm khít đống file này cuộn tròn tít lại.",
        2: "Giấu kho: Quăng tọt bọc đồ dơ này giấu nhẹm vào gầm giường Stash Stack bí mật.",
        3: "Make up: Góc làm việc sạch bong kin kít, giả vờ như cả ngày chăm chỉ không vẽ bậy gì.",
        4: "Lục két: Họp xong về nhà, sếp lôi bọc đồ dơ ra 'pop' một phát, code dang dở lại bày bừa ra bàn làm tiếp!"
      },
      merge: {
        0: "Cặp uyên ương Develop (M3) và Feature (F2) đứng cách biệt hai đầu chiến tuyến thèm khát về chung một nhà.",
        1: "Xem gia phả: Git lội ngược dòng tìm cụ tổ chung M1 để xem ngày lành tháng tốt làm lễ cưới.",
        2: "Dắt tay: Git bắc dây tơ hồng kéo đầu M3 và đầu F2 tiến lại sát sàn sạt.",
        3: "Động phòng: Đẻ ra bé con Commit Merge M4 đại diện cho sự kết tinh vẹn toàn của cả hai dòng họ.",
        4: "Viên mãn: Đồ thị rẽ nhánh sum vầy rực rỡ, dù hơi loằng ngoằng xíu nhưng gia đình an vui không mất mát ai."
      },
      commit: {
        0: "File sửa đổi đang run rẩy đứng xếp hàng rồng rắn ở phòng chờ Staging Area.",
        1: "Chụp pô ảnh: Sếp bấm commit, Git bật đèn flash nháy mắt chụp vèo một phát đóng băng hiện trường.",
        2: "Đúc pha lê: Nén thông tin hành động thành khối tròn C3 bóng bẩy có dây liên kết giật lùi về bố C2.",
        3: "Thăng hạng: Cột sóng HEAD và nhãn nhánh của sếp bước một bước dài leo lên đỉnh C3 ngự trị."
      },
      push: {
        0: "Local có hàng hiệu C3 ngon nghẻ, Remote Server héo úa vẫn gặm nhấm mốc cũ C2.",
        1: "Đóng công-ten-nơ: Chuẩn bị động cơ, đóng gói quả commit C3 nhét vào tàu vũ trụ.",
        2: "Bắn đạn: Bấm push phát tàu vũ trụ mang commit C3 vượt mây bay thẳng tiến về tổng bộ GitHub.",
        3: "Cắm mốc: Nhãn 'origin/main' trên mây nhảy cẫng lên ăn mừng mốc C3. Hai bên tay bắt mặt mừng!"
      },
      diverge: {
        0: "Có biến sếp ơi! Sếp âm thầm rẽ trái đẻ ra L2 ở local, đồng nghiệp đầu hói rẽ phải đẻ ra R2 trên Remote.",
        1: "Va chạm chướng ngại: Sếp gõ push, Git nhận thấy đường xá rối ren, rẽ hai hướng đối lập chan chát.",
        2: "Bế tắc: GitHub giội gáo nước lạnh bảo 'Diverged rồi ní ơi, đéo cho push đè lên đâu nha cưng!'",
        3: "Hòa giải: Phải lôi kéo code Remote về nén rebase cho thẳng tắp hoặc merge tơi bời mới thông quan được."
      },
      'fast-forward': {
        0: "Nhánh gốc đóng băng ở M2, nhánh sếp múa code chạy tít tắp lên mốc M4 tự do tự tại.",
        1: "Soi đường: Git phát hiện chẳng có ai cản đường phá rối ở giữa, một đường băng bằng phẳng tuyệt đối.",
        2: "Slide mượt mà: Đạp ga trượt nhãn 'main' trôi lướt ván vèo một cái từ M2 sang thẳng M4.",
        3: "Xong tiệc: Không tốn một đồng tạo commit merge, nhanh gọn nhẹ như cách sếp lừa dối người yêu cũ!"
      }
    }
  },
  [TranslationTone.TOXIC]: {
    title: "💀 ĐẤT DIỄN CỦA ĐỒNG CHÍ LOW-TECH (GIT TRIAL ROAD)",
    subtitle: "Ảnh động nã thẳng vào não cách thức Git dọn rác code của mày ở hậu trường",
    selectPrompt: "Chọn con bệnh để mổ xẻ xem tóm lại mày đã phá hoại những gì:",
    playBtn: "Xông trận ngay",
    pauseBtn: "Xịt keo",
    resetBtn: "Làm lại cuộc đời",
    nextStepBtn: "Bước kế",
    prevStepBtn: "Giật lùi lại",
    localLabel: "Bãi rác local của mày",
    remoteLabel: "Thánh địa remote trên mây",
    underTheHoodLabel: "⚙️ SỰ THẬT TÀN NHẪN DƯỚI LÒNG ĐẤT:",
    expectedResultLabel: "🎁 THÀNH QUẢ SAU BÃI CHIẾN TRƯỜNG:",
    syncToggleLabel: "🔗 Bám đuôi Wizard (Khuyên dùng)",
    syncToggleActive: "Đang theo dõi từng dấu răng",
    legendLabel: "DỊCH CHỮ DƯỚI HÌNH (LEGEND):",
    localBranchLegend: "💻 Hàng bốc mùi của mày dưới local (Viền nét liền nét cứng)",
    remoteBranchLegend: "☁️ origin/* Nhánh xịn của người ta trên GitHub (Viền nét đứt)",
    explanationTitle: "THÔNG NÃO SÁNG MẮT BƯỚC {step}:",
    opLabels: {
      rebase: "git rebase (Cưỡng ép tuyến tính)",
      stash: "git stash (Hốt rác giấu két)",
      merge: "git merge (Hợp thể bừa bãi)",
      commit: "git commit (Đóng hòm code lỗi)",
      push: "git push (Tống khứ lên mây)",
      diverge: "Diverge (Lệch pha ăn tát)",
      'fast-forward': "Fast-forward (Đi tắt đón đầu)"
    },
    opShortSummaries: {
      rebase: "Nhổ phăng mấy quả commit rác của mày mang đặt đè đầu cưỡi cổ lên đỉnh cao nhất của develop.",
      stash: "Nhét tọt mớ code lem nhem dở dang vào cái hố đen vũ trụ để giả vờ ngoan hiền dọn sạch ổ đĩa.",
      merge: "Bắc cầu cưỡng ép hai nhánh húc đầu vào nhau đẻ ra một đống rác commit merge rối rắm lằng ngoằng.",
      commit: "Đóng kín nắp thùng sơn ghi nhận mốc phá hoại local mới rồi nhích con trỏ phá phách lên trước.",
      push: "Ném mạnh cái đống hỗn độn local của mày bay thẳng tắp qua mạng lưới đè lên server từ xa.",
      diverge: "Mày code một kiểu, người ta code một kiểu chẻ đôi nhánh ra thành ngã ba đường nổ banh xác.",
      'fast-forward': "Trượt phăng phăng cái nhãn chỉ đường tiến thẳng tới đích vì chẳng có ai thèm tranh giành đường đi."
    },
    opUnderTheHood: {
      rebase: "Git khinh bỉ vứt các commit cũ của mày vào sọt rác tạm, nhảy lên đỉnh develop mới tinh rồi tái sinh chúng dưới dạng các commit hoàn toàn mới với SHA khác hẳn nhằm che mắt thiên hạ.",
      stash: "Gom cả Working Directory rách nát vào một xó tối của Ref Stack, xóa trắng bệ phóng local của mày về mốc HEAD nguyên thủy để không làm bẩn mắt đồng nghiệp.",
      merge: "Mò tìm mốc tổ tiên chung, thực thi giải thuật so khác biệt 3 chiều lằng ngoằng, gượng ép nối đuôi 2 nhánh thành một mạng nhện bủa vây đầy rủi ro conflict.",
      commit: "Gói ghém đống file lem nhem trong index thành cây thư mục tree, bọc bùa bảo vệ SHA-1 rồi cưỡng ép con trỏ HEAD rít ga bám víu lấy cái commit vừa đẻ đó.",
      push: "Xoay tít băng thông mạng nạp các tệp chứa commit local nã thẳng vào remote server, buộc máy chủ GitHub bên kia phải đổi nhãn cập nhật theo đúng ý chí của mày.",
      diverge: "Hay lắm con rai! Local lệch một nẻo, remote chạy một đường, lịch sử chẻ đôi như sừng trâu. Không kéo code giải quyết xung đột mà đòi push là ăn vả chối tai!",
      'fast-forward': "Đường thẳng tắp rảnh rang, Git bảo 'Đéo cần tính toán so sánh bộc lót gì hết!', giật nhãn chính kéo tuột lên đỉnh nhánh phụ trong vòng nốt nhạc."
    },
    opResult: {
      rebase: "Nhìn lịch sử thẳng thớm sang chảnh như dân chuyên nghiệp, lòe được sếp là mày code sạch sẽ lắm.",
      stash: "Workspace trống rỗng xanh tươi, tha hồ lượn lờ nhánh khác giả vờ bận rộn.",
      merge: "Mạng lưới lịch sử rối rắm nhìn như mạng nhện rác thực thụ, sau này gỡ conflict gãy cả tay.",
      commit: "Ghi danh bảng vị local, mầm mống tai họa đã được bảo toàn trong ổ cứng, sẵn sàng ăn hành tiếp.",
      push: "Code ngu được lưu trữ an toàn trên máy chủ đám mây, bẫy gài sẵn đợi đồng nghiệp kéo về nổ tung.",
      diverge: "Bị khóa mõm đéo cho push! Phải còng lưng gỡ tơi bời rebase nén lại rồi mới được thông quan.",
      'fast-forward': "Hợp nhất êm ái không để lại một dấu vết mờ ám nào, sếp tưởng mày là thiên tài git."
    },
    opDescriptions: {
      rebase: {
        0: "Coi nè nồ: Develop leo lên tít đỉnh M3 mới coong, còn nhánh feature phế vật của mày lẹt đẹt ở gốc cũ M1.",
        1: "Tháo chốt: Git tháo tung 2 quả commit rác F1, F2 của mày ra treo lên trần nhà chờ xử lý.",
        2: "Nắn bệ: Git bứng gốc nhánh feature của mày trượt phăng phăng gá đầu lên đỉnh phát triển M3.",
        3: "Đắp gạch F1: Đóng đinh F1 dính chặt lên M3 thành F1'. Đổi hồn đổi xác, mã Hash mới hoàn toàn nhé cưng!",
        4: "Đề móng F2: Đắp nốt F2 lên đầu F1' thành F2'. Thẳng băng không tỳ vết! Lòe sếp bảo em code đỉnh vcl!"
      },
      stash: {
        0: "Mày bôi bẩn fileA.js dở dang (đốm đỏ loét), đột nhiên sếp bắt check nhánh gấp để cứu hỏa.",
        1: "Hút bụi: Quét sạch sành sanh đống code rác dở dang vứt vào một cái xô nhựa.",
        2: "Ném tủ: Ném mạnh cái xô nhựa chứa đống đồ dơ đấy vào hầm Stash Stack (stash@{0}) sâu hun hút.",
        3: "Tẩy não: Working tree sạch bóng như chùi, ra vẻ ta đây chăm chỉ hiền lành không phá hoại gì.",
        4: "Mở hòm: Quay lại sau cơn bão, dùng 'pop' giật nắp xô nhựa đổ nguyên đống rác trở lại bàn làm việc tiếp tục bôi bẩn."
      },
      merge: {
        0: "Lại múa nhánh vô tội vạ! Develop (M3) và Feature (F2) chẻ làm hai nhánh song song thách thức lẫn nhau.",
        1: "Truy vết: Git phải lội ngược dòng lướt mỏi mắt tìm mốc tổ tiên chung M1 cứu cánh.",
        2: "Húc đầu: Kéo xồng xộc hai dải ruy-băng M3 và F2 quy đầu hội ngộ tại một điểm giao thừa.",
        3: "Động binh: Khai sinh một mốc commit gộp quái thai M4 liên minh, có tận 2 bố mẹ chống lưng lăng nhăng.",
        4: "Mạng nhện: Lịch sử rẽ nhánh lòng vòng rác mắt, sau này rebase gỡ conflict méo cả mồm nhé con trai!"
      },
      commit: {
        0: "Đống code lem nhem của mày đang xếp hàng co rúm ró ở khu vực chờ Staging Area.",
        1: "Cạch pô ảnh: Gõ dứt khoát lệnh commit, Git lia máy chớp ảnh đóng băng toàn diện đống rác.",
        2: "Đúc bom: Nén thông tin hành vi thành quả commit C3 tròn vo dán nhãn SHA-1 nối ngược về cha C2.",
        3: "Chiếm đóng: Nhãn HEAD tiến lên chiếm đóng đỉnh C3 hân hoan. Tiễn đưa thêm một mốc code rác vào kho!"
      },
      push: {
        0: "Local của mày leo lên đỉnh C3 xịn mịn, Remote Server vẫn nghèo rách đắp chiếu ở mốc rùa bò C2.",
        1: "Gói hành lý: Đóng thùng bọc màng co quả commit C3 chuẩn bị phóng tên lửa xuyên biên giới.",
        2: "Kích nổ: Bơm đạn push vọt xà ngang, quả commit local bay vèo vèo qua internet sang tổng bộ GitHub.",
        3: "Xâm lấn: Nhãn 'origin/main' trên mây bị ép nhảy vọt lên nuốt lấy C3. Hai server khít khịt đồng bộ!"
      },
      diverge: {
        0: "Toang rồi nhóc! Chung móng C1 nhưng mày tự sướng đẻ L2 ở local, đồng nghiệp đầu hói đẩy đè R2 từ đời nào.",
        1: "Kẹt đạn: Mày hí hửng bay vào push, hai đầu cầu đối đầu lệch hướng tanh bành.",
        2: "An tát: Server đập thẳng cửa bảo: 'Rejected! Nhánh lệch sừng trâu rồi, đéo cho push đè lên đâu con trai!'",
        3: "Gục ngã: Phải lủi thủi kéo code về chạy rebase dập nén hoặc merge bừa bãi mới mong thông quan cứu thân."
      },
      'fast-forward': {
        0: "Main nằm im bất động ở M2, Feature của mày múa code thẳng tiến lên mốc M4 cô oanh.",
        1: "Nhòm ngó: Phát hiện đường xá quang đãng thẳng băng, không có con quái vật nào chắn lối ở giữa.",
        2: "Trượt nhãn: Đào đâu ra commit merge rác rưởi, Git lười nhác tháo nhãn 'main' trượt tuột vèo tới M4.",
        3: "Bình an: Main chạm trán Feature chỉ trong chớp mắt cực mượt, sếp nhìn vào tưởng mày múa phép ảo lòi."
      }
    }
  },
  [TranslationTone.ENGLISH]: {
    title: "⚡ DYNAMIC ACTIVE GIT OPERATIONAL SANDBOX (GIT FLOW VISUALIZER)",
    subtitle: "Animated step-by-step masterclass showing what Git accomplishes under the hood",
    selectPrompt: "Select a Git action to dissect:",
    playBtn: "Play Simulation",
    pauseBtn: "Pause",
    resetBtn: "Reset Simulation",
    nextStepBtn: "Next Step",
    prevStepBtn: "Prev Step",
    localLabel: "Your local machine (Local)",
    remoteLabel: "Upstream (Remote Server)",
    underTheHoodLabel: "⚙️ WHAT ACTUALLY HAPPENS UNDER THE HOOD:",
    expectedResultLabel: "🎁 EXPECTED FINAL OUTCOME:",
    syncToggleLabel: "🔄 Sync with Wizard Progress",
    syncToggleActive: "Live Wizard sync active",
    legendLabel: "DIAGRAM LEGEND:",
    localBranchLegend: "💻 Local Branch / commit (solid track & tag)",
    remoteBranchLegend: "☁️ origin/* (Remote-tracking branch - dashed track & tag)",
    explanationTitle: "DETAILED STEP {step} EXPLANATION:",
    opLabels: {
      rebase: "git rebase",
      stash: "git stash",
      merge: "git merge",
      commit: "git commit",
      push: "git push",
      diverge: "divergence (diverged)",
      'fast-forward': "fast-forward merge"
    },
    opShortSummaries: {
      rebase: "Detaches feature branch commits, shifts base to newest develop, then reapplies them sequentially.",
      stash: "Temporarily locks unfinished edits inside a dirty-stack cabinet to clean your working tree safely.",
      merge: "Integrates separate branch timelines by spawning a special shared merge commit pointing to both sources.",
      commit: "Packages changes inside the staging area, records a perpetual filesystem snapshot, and advances HEAD.",
      push: "Streams local-only commits over SSH/HTTPS and fast-forwards the corresponding remote reference pointers.",
      diverge: "Indicates that local and remote branches contain different commits since common split point, blocking push sync.",
      'fast-forward': "Slides targeted branch reference label straight to source branch tip without generating complex merge commits."
    },
    opUnderTheHood: {
      rebase: "Git temporarily detaches files as patch files, resets the feature branch head pointer to match the latest base, and applies patches one by one—generating brand new SHA-1 hashes for modified commits.",
      stash: "Saves both index modifications and untracked/dirty files as unique commit nodes pointed to by 'refs/stash' in a LIFO stack collection, restoring working directories to a clean HEAD.",
      merge: "Locates the nearest Common Ancestor commit, performing a smart 3-way integration. On success, it outputs a single commit referencing both parental heads directly.",
      commit: "Encapsulates staged changes into blobs, organizes directories to build a tree structure, appends author details, and advances HEAD to reference the new block.",
      push: "Calculates local commits missing from the remote database, constructs a compressed delta stream, transfers payloads, and updates remote references securely.",
      diverge: "Local and remote heads are no longer collinear. The remote rejects automatic fast-forwards. User must perform local reconciliation (rebase or merge) first.",
      'fast-forward': "Since no divergent commits were recorded on the target branch since the fork point, Git updates the target's ref pointer by shifting it directly to reference the newest tip."
    },
    opResult: {
      rebase: "A pristine linear track (100% straight history) without junk intermediate merge noise. Clean and readable.",
      stash: "A sparkly clean working tree free of half-baked edits; call 'git stash pop' anytime to resume work.",
      merge: "All code integrated with non-linear tree nodes; accurate history mapping, but creates branched complexity.",
      commit: "Local history captures user status, with a safe checkpoint saved locally in the local pack directory.",
      push: "Both local and server branches are unified at the newest commit. Colleagues can pull your latest contributions.",
      diverge: "Push is blocked initially. Re-aligning history resolves the split and ensures consistent deployment.",
      'fast-forward': "Instantaneous pointer update (0ms runtime) without generating extra nodes to cloud git history logs."
    },
    opDescriptions: {
      rebase: {
        0: "Context: Develop moved forward to M3, leaving your Feature branch (F1, F2) split at stale commit M1.",
        1: "Detach: Git temporarily detaches commits F1 and F2, saving them securely to background patch registers.",
        2: "Shift Base: Feature branch starting baseline smoothly moves up to latch directly on top of latest Develop head (M3).",
        3: "Reapply F1: Git replicates patch F1 as a brand new commit F1' on top of M3 (with a newly baked unique SHA hash!).",
        4: "Reapply F2: Continues by placing F2' directly on top of F1'. Success! History is perfectly linear!"
      },
      stash: {
        0: "Context: You modified fileA.js (red dot) but must switch immediately to dry-run critical production hotfixes.",
        1: "Bundle: Issuing 'stash' bundles all working directory modifications and staged items securely together.",
        2: "Deposit: Sweeps the modified code pack down into the Stash Stack drawer (referenced as stash@{0}).",
        3: "Pristine Tree: Your workspace reverts to a pristine, clean, unstaged state with zero dirty indicators.",
        4: "Pop back: Once hotfixes conclude, 'stash pop' restores the saved file pack back into your active sandbox directory!"
      },
      merge: {
        0: "Context: Develop (at M3) and Feature (at F2) branches diverge. You intend to merge Feature into Develop.",
        1: "Trace Origin: Git journeys backward to discover the nearest shared ancestral root commit node (M1).",
        2: "Converge: Connects both endpoint cords (M3 and F2) together toward a centralized merging juncture.",
        3: "Unite: Automates three-way merge logic and stamps a unique 'Merge Commit' node (M4) referencing both M3 and F2.",
        4: "Reconciled: Main timeline gains all secondary developments. Map splits but represents complete development logs."
      },
      commit: {
        0: "Staged changes sit compiled in the staging index (green outline) waiting to be packaged.",
        1: "Snapshot: Issuing 'commit' takes a snapshot of your workspace, creating a directory structure tree node.",
        2: "Generate SHA-1: Packages the files into a rounded commit block (C3) linking backward to preceding C2 parent.",
        3: "Advance Pointer: Moves the branch tag and HEAD identifier forward to lock onto new commit C3. Completed!"
      },
      push: {
        0: "Local contains fresh commit C3, whereas the upstream GitHub remote remains outdated at preceding C2.",
        1: "Package: Preparing payload, compiling local delta packs, and preparing connection streams.",
        2: "In Flight: Pack file flies across fiber-optics to be securely accepted inside GitHub's storage database.",
        3: "Advance Remote: Upstream pointer tag 'origin/main' shifts instantly to stand on C3. Platforms fully aligned!"
      },
      diverge: {
        0: "Split: Baseline shared at C1. You committed L2 locally, while a coworker independently pushed R2 upstream.",
        1: "Conflict: Attempting to push local alterations encounters a fork where paths split down distinct avenues.",
        2: "Access Denied: Server locks entry with a 'Non-fast-forward push rejected' warning blocking simple upstream writes.",
        3: "Resolution: Requires pulled integration—preferably via rebase to flatline timelines—to resume push actions."
      },
      'fast-forward': {
        0: "Baseline sits at M2. Feature records sequential commits up to M4, while Main remains unchanged in between.",
        1: "Clear Runway: Git scans history and identifies no divergent branches blocking direct progress paths.",
        2: "Label Slide: Rather than generating duplicate integration nodes, Git slides 'main' label directly up to point at M4.",
        3: "Fast-Merged: Merging completes instantaneously without messy extra merge headers in repository logs!"
      }
    }
  }
};

const mapWizardStepToConcept = (step: number): VisualActionType => {
  switch (step) {
    case 0: return 'diverge';
    case 1: return 'push'; // local-remote sync (pull/fetch)
    case 2: return 'commit'; // squash commits
    case 3: return 'stash'; // backup check behaves like stash / checkpoint
    case 4: return 'rebase'; // rebase execution
    case 5: return 'commit'; // write commit message
    case 6: return 'fast-forward'; // verification / checking linear
    case 7: return 'push'; // push to Remote
    default: return 'rebase';
  }
};

export default function GitVisualizerPanel({ 
  tone, 
  wizard,
  theme = 'dark',
  repoState,
  isSimulation = false,
  onToggleSimulation
}: { 
  tone: TranslationTone; 
  wizard?: WizardState; 
  theme?: 'light' | 'dark';
  repoState?: GitRepoState;
  isSimulation?: boolean;
  onToggleSimulation?: (val: boolean) => void;
}) {
  const isLight = theme === 'light';
  const [visScale, setVisScale] = useState<number>(1.0);
  const [resetKey, setResetKey] = useState<number>(0);

  const stageContainerRef = useRef<HTMLDivElement>(null);
  const cleanupVisWheelRef = useRef<(() => void) | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const touchStartDist = useRef<number | null>(null);
  const touchStartScl = useRef<number>(1.0);

  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [containerHeight, setContainerHeight] = useState<number>(230);

  const setStageContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (cleanupVisWheelRef.current) {
      cleanupVisWheelRef.current();
      cleanupVisWheelRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    
    (stageContainerRef as any).current = node;

    if (node) {
      const handleWheelEvent = (e: WheelEvent) => {
        e.preventDefault();
        // Dynamic zoom step relative to current scale to make zoom feel smooth at both low and high percentages
        let zoomStep = 0.05;
        if (visScale >= 5.0) zoomStep = 0.5;
        else if (visScale >= 1.5) zoomStep = 0.2;
        
        setVisScale(prev => {
          const next = prev + (e.deltaY < 0 ? zoomStep : -zoomStep);
          return Math.min(15.0, Math.max(0.4, Math.round(next * 100) / 100));
        });
      };

      node.addEventListener('wheel', handleWheelEvent, { passive: false });
      cleanupVisWheelRef.current = () => {
        if (node) {
          node.removeEventListener('wheel', handleWheelEvent);
        }
      };

      let debounceTimeout: any;
      const observer = new ResizeObserver((entries) => {
        if (!entries || entries.length === 0) return;
        const rect = entries[0].contentRect;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          if (rect.width > 0) setContainerWidth(rect.width);
          if (rect.height > 0) setContainerHeight(rect.height);
        }, 50);
      });
      observer.observe(node);
      resizeObserverRef.current = observer;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupVisWheelRef.current) cleanupVisWheelRef.current();
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartDist.current = dist;
      touchStartScl.current = visScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchStartDist.current;
      const targetScale = Math.min(15.0, Math.max(0.4, touchStartScl.current * ratio));
      setVisScale(Math.round(targetScale * 100) / 100);
    }
  };

  const handleTouchEnd = () => {
    touchStartDist.current = null;
  };

  const [activeAction, setActiveAction] = useState<VisualActionType>('rebase');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncedWithWizard, setIsSyncedWithWizard] = useState(true);
  const [hoveredCommitSha, setHoveredCommitSha] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [compactModeSetting, setCompactModeSetting] = useState<'auto' | 'compact' | 'detailed'>('auto');
  const [expandedCapsuleIds, setExpandedCapsuleIds] = useState<string[]>([]);

  useEffect(() => {
    setExpandedCapsuleIds([]);
  }, [repoState]);

  const isCompactActive = React.useMemo(() => {
    if (compactModeSetting === 'compact') return true;
    if (compactModeSetting === 'detailed') return false;
    
    // Auto mode: collapse when scale < 0.85 OR when there are more than 12 commits.
    const commitsCount = repoState?.commits?.length ?? 0;
    return visScale < 0.85 || commitsCount > 12;
  }, [compactModeSetting, visScale, repoState?.commits]);

  useEffect(() => {
    setIsSyncedWithWizard(true);
    setIsPlaying(false);
  }, [isSimulation]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_collapse_visualizer_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rebase_overlord_collapse_visualizer_panel', String(next));
      } catch (e) {}
      return next;
    });
  };

  const loc = localizations[tone] || localizations[TranslationTone.ENGLISH];

  // Number of steps in active operation
  const totalSteps = Object.keys(loc.opDescriptions[activeAction]).length;

  // Handle action selector change
  const handleActionChange = (action: VisualActionType) => {
    setActiveAction(action);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsSyncedWithWizard(false); // Disable sync on manual tabs interaction
  };

  // Synchronize with Wizard step changes
  useEffect(() => {
    if (!wizard || !isSyncedWithWizard) return;

    const mappedAction = mapWizardStepToConcept(wizard.step);
    setActiveAction(mappedAction);

    // Contextually adjust the animation's sub-step index based on state attributes
    if (mappedAction === 'rebase') {
      if (wizard.status === 'running') {
        setIsPlaying(true);
      } else if (wizard.status === 'paused_conflict') {
        setIsPlaying(false);
        setCurrentStep(1); // paused / conflict step
      } else if (wizard.status === 'completed') {
        setIsPlaying(false);
        setCurrentStep(4); // the success finish step
      } else {
        setCurrentStep(0);
        setIsPlaying(true); // Loop tutorial dynamically
      }
    } else if (mappedAction === 'push') {
      if (wizard.status === 'running') {
        setIsPlaying(true);
      } else if (wizard.status === 'completed') {
        setIsPlaying(false);
        setCurrentStep(3); // success synced remote step
      } else {
        setCurrentStep(0);
        setIsPlaying(true);
      }
    } else if (mappedAction === 'stash') {
      if (wizard.doBackup) {
        setCurrentStep(2); // stashed
      } else {
        setCurrentStep(0);
        setIsPlaying(true);
      }
    } else {
      // General operations loop smoothly to show the core concepts
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [wizard?.step, wizard?.status, wizard?.doBackup, isSyncedWithWizard]);

  // Autoplay simulation steps loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, totalSteps]);

  const handleToggleUnified = () => {
    const nextSimulation = !isSimulation;
    if (onToggleSimulation) {
      onToggleSimulation(nextSimulation);
    } else {
      setIsSyncedWithWizard(!nextSimulation);
    }
    
    if (nextSimulation) {
      if (currentStep >= totalSteps - 1) {
        setCurrentStep(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleNextStep = () => {
    if (isSyncedWithWizard && onToggleSimulation) {
      onToggleSimulation(true);
    } else {
      setIsSyncedWithWizard(false);
    }
    setIsPlaying(false);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (isSyncedWithWizard && onToggleSimulation) {
      onToggleSimulation(true);
    } else {
      setIsSyncedWithWizard(false);
    }
    setIsPlaying(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (isSyncedWithWizard && onToggleSimulation) {
      onToggleSimulation(true);
    } else {
      setIsSyncedWithWizard(false);
    }
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Render real-life git commit tree with connections, lanes and pointers
  const renderRealGitTree = (initialW: number, h: number) => {
    if (!repoState || !repoState.commits || repoState.commits.length === 0) {
      return (
        <div className="text-slate-500 font-mono text-[10px] text-center p-8">
          Không tìm thấy commit nào trong lịch sử Git thực tế.
        </div>
      );
    }

    // Sort/order commits from oldest to newest for left-to-right timeline
    const orderedCommits = [...repoState.commits].reverse();

    // 1. Build child mapping and branch tags mapping
    const childrenMap: Record<string, string[]> = {};
    orderedCommits.forEach(c => {
      (c.parents || []).forEach(p => {
        if (!childrenMap[p]) childrenMap[p] = [];
        if (!childrenMap[p].includes(c.sha)) {
          childrenMap[p].push(c.sha);
        }
      });
    });

    const latestTrack0 = [...orderedCommits].reverse().find(c => c.track === 0);
    const latestTrack1 = [...orderedCommits].reverse().find(c => c.track === 1 || typeof c.track !== 'number');
    const headCommit = orderedCommits[orderedCommits.length - 1];

    const baseBranchName = repoState.baseBranch || 'develop';
    const currentBranchName = repoState.currentBranch || 'feature';

    const taggedShas = new Set<string>();
    if (latestTrack0) taggedShas.add(latestTrack0.sha);
    if (latestTrack1) taggedShas.add(latestTrack1.sha);
    if (headCommit) taggedShas.add(headCommit.sha);
    orderedCommits.forEach(c => {
      const isRemoteMarker = c.message.includes('[Remote]') || (c.sha === '7c8d9e2' && orderedCommits.some(x => x.sha === 'f941a3c'));
      if (isRemoteMarker) {
        taggedShas.add(c.sha);
      }
    });

    // 2. Determine non-collapsible critical commits
    const isCritical = (c: any, idx: number) => {
      if (idx === 0 || idx === orderedCommits.length - 1) return true;
      if (taggedShas.has(c.sha)) return true;
      if (c.parents && c.parents.length > 1) return true;
      if (childrenMap[c.sha] && childrenMap[c.sha].length > 1) return true;
      if (c.isConflicting || c.pending) return true;
      if (wizard?.selectedCommits?.includes(c.sha)) return true;
      return false;
    };

    // 3. Compact grouping block and dynamic zoom-synchronized Progressive Reveal logic
    const activeExpandedGroups: { id: string; shas: string[]; track: number; startSha: string; endSha: string }[] = [];

    const processTempGroup = (group: any[], groupTrack: number) => {
      const M = group.length;
      if (M === 0) return [];

      // If length of linear sequence including endpoints is <= 4, then M <= 2.
      // Thus, if M < 3 (i.e. <= 2), we do not collapse.
      if (M < 3) {
        return group.map(item => ({
          type: 'commit',
          id: item.sha,
          commit: item,
          track: item.track ?? 0
        }));
      }

      const capsuleId = `collapsed-${group[0].sha}-${group[group.length - 1].sha}`;
      const isCustomExpanded = expandedCapsuleIds.includes(capsuleId);

      // Calculate how many middle commits to reveal based on visScale:
      // S <= 1.0 (100%): 0 revealed, show compact capsule.
      // S >= 10.0 (1000%): M revealed, fully detailed.
      // 1.0 < S < 10.0: reveal linearly proportional amount.
      // NOTE: Only apply progressive zoom reveal in 'auto' mode. In explicit 'compact' mode, stay fully compacted.
      // Also, if the capsule has been manually expanded, we reveal everything (k = M).
      let k = 0;
      if (isCustomExpanded) {
        k = M;
        activeExpandedGroups.push({
          id: capsuleId,
          shas: group.map(c => c.sha),
          track: groupTrack,
          startSha: group[0].sha,
          endSha: group[group.length - 1].sha
        });
      } else if (compactModeSetting === 'auto' && visScale > 1.0) {
        const fraction = Math.min(1.0, (visScale - 1.0) / 9.0);
        k = Math.floor(fraction * M);
      }

      // If remaining collapsed commits is < 3, just reveal all to prevent tiny meaningless stacks.
      if (M - k < 3) {
        k = M;
      }

      if (k === M) {
        return group.map(item => ({
          type: 'commit',
          id: item.sha,
          commit: item,
          track: item.track ?? 0
        }));
      }

      const kLeft = Math.ceil(k / 2);
      const kRight = Math.floor(k / 2);

      const nodes: any[] = [];
      // 1. Left revealed commits
      for (let i = 0; i < kLeft; i++) {
        nodes.push({
          type: 'commit',
          id: group[i].sha,
          commit: group[i],
          track: group[i].track ?? 0
        });
      }

      // 2. Middle collapsed capsule representing the remaining unrevealed commits
      const collapsedCommits = group.slice(kLeft, M - kRight);
      if (collapsedCommits.length > 0) {
        nodes.push({
          type: 'collapsed',
          id: `collapsed-${collapsedCommits[0].sha}-${collapsedCommits[collapsedCommits.length - 1].sha}`,
          commits: collapsedCommits,
          track: groupTrack
        });
      }

      // 3. Right revealed commits
      for (let i = M - kRight; i < M; i++) {
        nodes.push({
          type: 'commit',
          id: group[i].sha,
          commit: group[i],
          track: group[i].track ?? 0
        });
      }

      return nodes;
    };

    let compactNodes: any[] = [];
    if (isCompactActive) {
      let tempGroup: any[] = [];
      let currentGroupTrack: number | null = null;

      orderedCommits.forEach((c, idx) => {
        const critical = isCritical(c, idx);
        
        if (critical) {
          if (tempGroup.length > 0) {
            compactNodes.push(...processTempGroup(tempGroup, currentGroupTrack ?? 0));
            tempGroup = [];
            currentGroupTrack = null;
          }
          compactNodes.push({
            type: 'commit',
            id: c.sha,
            commit: c,
            track: c.track ?? 0
          });
        } else {
          const commitTrack = c.track ?? 0;
          if (tempGroup.length === 0) {
            tempGroup.push(c);
            currentGroupTrack = commitTrack;
          } else {
            if (commitTrack === currentGroupTrack) {
              tempGroup.push(c);
            } else {
              compactNodes.push(...processTempGroup(tempGroup, currentGroupTrack ?? 0));
              tempGroup = [c];
              currentGroupTrack = commitTrack;
            }
          }
        }
      });

      if (tempGroup.length > 0) {
        compactNodes.push(...processTempGroup(tempGroup, currentGroupTrack ?? 0));
      }
    } else {
      // Detailed: maps every single commit to a full node
      compactNodes = orderedCommits.map(c => ({
        type: 'commit',
        id: c.sha,
        commit: c,
        track: c.track ?? 0
      }));
    }

    const nodeCount = compactNodes.length;

    // Dynamically calculate wide width to avoid crowding of nodes when history is deep.
    const minSpacing = isCompactActive ? 95 : 85;
    const w = nodeCount > 1 ? Math.max(initialW, 130 + (nodeCount - 1) * minSpacing) : initialW;

    const startX = 65;
    const endX = w - 65;
    const spacing = nodeCount > 1 ? (endX - startX) / (nodeCount - 1) : 0;

    // Track coordinates for each node
    const nodeCoords: Record<string, { x: number; y: number }> = {};
    
    compactNodes.forEach((node, idx) => {
      const x = nodeCount > 1 ? startX + idx * spacing : w / 2;
      const trackVal = typeof node.track === 'number' ? node.track : 0;
      let y = 110; // Default center
      if (trackVal === 0) {
        y = 75; // Base track
      } else if (trackVal === 1) {
        y = 130; // Feature track
      } else {
        y = 175; // Remote track
      }
      y = Math.min(y, h - 25);
      nodeCoords[node.id] = { x, y };
    });

    // Resolve every individual original commit's SHA to its coordinate (or collapsed representative node Y/X coordinates)
    const commitCoords: Record<string, { x: number; y: number }> = {};
    compactNodes.forEach(node => {
      if (node.type === 'commit') {
        commitCoords[node.id] = nodeCoords[node.id];
      } else if (node.type === 'collapsed') {
        node.commits.forEach((c: any) => {
          commitCoords[c.sha] = nodeCoords[node.id];
        });
      }
    });

    return (
      <div className="relative w-full h-full flex flex-col" id="real-git-tree-viewport">
        {repoState.rebaseInProgress && repoState.rebaseState && (
          <div className={`w-full px-4 py-2 text-[10px] font-mono flex items-center justify-between border-b shrink-0 ${
            isLight ? 'bg-amber-50/90 border-amber-200 text-amber-900 animate-pulse' : 'bg-slate-900/90 border-amber-950/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                <strong>{tone === TranslationTone.ENGLISH ? 'REAL-TIME REBASE:' : 'TIẾN TRÌNH REBASE THỰC TẾ:'}</strong>{' '}
                {tone === TranslationTone.ENGLISH ? 'Step' : 'Bước'} {repoState.rebaseState.currentStep}/{repoState.rebaseState.totalSteps}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[8.5px] uppercase font-bold ${
                repoState.conflicts && repoState.conflicts.length > 0
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {repoState.conflicts && repoState.conflicts.length > 0
                  ? (tone === TranslationTone.ENGLISH ? 'Stopped at Conflict' : 'Đang tạm dừng sửa xung đột')
                  : (tone === TranslationTone.ENGLISH ? 'Replaying' : 'Đang áp dụng')}
              </span>
            </div>
            {repoState.rebaseState.stoppedSha && (
              <div className="text-[9px] opacity-90 flex items-center gap-1">
                <span>{tone === TranslationTone.ENGLISH ? 'Active SHA:' : 'SHA Hiện tại:'}</span>
                <span className="font-bold underline text-amber-400">{repoState.rebaseState.stoppedSha}</span>
              </div>
            )}
          </div>
        )}
        <div className="relative w-full flex-1 overflow-auto flex items-center justify-center">
          <svg 
            className="font-mono select-none" 
            viewBox={`0 0 ${w} ${h}`} 
            referrerPolicy="no-referrer" 
            style={{ width: `${w}px`, height: `${h}px`, minWidth: `${w}px`, minHeight: `${h}px` }}
          >
          {/* Defs for arrowheads and gradients */}
          <defs>
            <marker id="real-arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={isLight ? '#6366f1' : '#818cf8'} />
            </marker>
            <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Base guidelines for tracks to represent lanes cleanly */}
          <line x1="40" y1="75" x2={w - 40} y2="75" className={`${isLight ? 'stroke-slate-100' : 'stroke-slate-900/40'} stroke-1 stroke-dashed`} />
          <line x1="40" y1="130" x2={w - 40} y2="130" className={`${isLight ? 'stroke-slate-100' : 'stroke-slate-900/40'} stroke-1 stroke-dashed`} />

          {/* 2. Drawing lines (parent/child connections) */}
          {orderedCommits.map((c) => {
            const childCoords = commitCoords[c.sha];
            if (!childCoords) return null;

            return (c.parents || []).map((parentSha) => {
              const parentCoords = commitCoords[parentSha];
              if (!parentCoords) return null;

              // Skip rendering links if parent and child are housed in the same folded node
              if (Math.abs(parentCoords.x - childCoords.x) < 1 && Math.abs(parentCoords.y - childCoords.y) < 1) {
                return null;
              }

              const isSameTrack = Math.abs(parentCoords.y - childCoords.y) < 5;
              let pathColor = isLight ? 'stroke-slate-300' : 'stroke-slate-700';
              let isDashed = c.isMergeCommit;

              if (c.pending) {
                pathColor = 'stroke-amber-500/40';
                isDashed = true;
              } else if (c.isConflicting) {
                pathColor = 'stroke-rose-500/50';
                isDashed = true;
              }

              if (isSameTrack) {
                // Flat horizontal connection
                if (isDashed) {
                  return (
                    <line
                      key={`${parentSha}-${c.sha}`}
                      x1={parentCoords.x}
                      y1={parentCoords.y}
                      x2={childCoords.x}
                      y2={childCoords.y}
                      className={`${pathColor} stroke-2 stroke-dashed`}
                      strokeDasharray="3 3"
                      markerEnd="url(#real-arrow)"
                    />
                  );
                }
                return (
                  <line
                    key={`${parentSha}-${c.sha}`}
                    x1={parentCoords.x}
                    y1={parentCoords.y}
                    x2={childCoords.x}
                    y2={childCoords.y}
                    className={`${pathColor} stroke-2`}
                    markerEnd="url(#real-arrow)"
                  />
                );
              } else {
                // Curved connection representing branching or merging (Very professional!)
                const dx = childCoords.x - parentCoords.x;
                const cp1X = parentCoords.x + dx * 0.4;
                const cp2X = parentCoords.x + dx * 0.6;
                const dPath = `M ${parentCoords.x} ${parentCoords.y} C ${cp1X} ${parentCoords.y}, ${cp2X} ${childCoords.y}, ${childCoords.x} ${childCoords.y}`;

                return (
                  <path
                    key={`${parentSha}-${c.sha}`}
                    d={dPath}
                    fill="none"
                    className={`${pathColor} stroke-2`}
                    markerEnd="url(#real-arrow)"
                    strokeDasharray={isDashed ? '3 3' : undefined}
                  />
                );
              }
            });
          })}

          {/* 3. Drawing dirty uncommitted stash indicator if git tree has modifications */}
          {repoState.isDirty && headCommit && (() => {
            const headCoord = commitCoords[headCommit.sha];
            if (!headCoord) return null;
            const dirtyNodeX = Math.min(w - 20, headCoord.x + 35);
            const dirtyNodeY = headCoord.y;
            return (
              <g key="dirty-node" className="animate-pulse">
                <line 
                  x1={headCoord.x} 
                  y1={headCoord.y} 
                  x2={dirtyNodeX} 
                  y2={dirtyNodeY} 
                  className={`stroke-rose-500 stroke-1.5 stroke-dashed`} 
                />
                <circle 
                  cx={dirtyNodeX} 
                  cy={dirtyNodeY} 
                  r="7" 
                  className="stroke-rose-450 fill-slate-950 stroke-dashed stroke-1.5" 
                />
                <text x={dirtyNodeX} y={dirtyNodeY + 16} textAnchor="middle" className="fill-rose-400 text-[6.5px] font-bold uppercase font-mono">Dirty</text>
              </g>
            );
          })()}

          {/* 3.5. Drawing collapse indicators for user-expanded capsule groups */}
          {activeExpandedGroups.map(grp => {
            const startCoords = commitCoords[grp.startSha];
            const endCoords = commitCoords[grp.endSha];
            if (!startCoords || !endCoords) return null;

            const x1 = startCoords.x;
            const x2 = endCoords.x;
            const y = startCoords.y;
            const centerX = (x1 + x2) / 2;

            // Determine rendering direction: Base tracks flow ABOVE, Feature tracks flow BELOW
            const isBaseTrack = grp.track === 0;
            const dir = isBaseTrack ? -1 : 1;
            const bracketY = y + dir * 25;
            const centerY = y + dir * 35;

            const buttonLabel = tone === TranslationTone.ENGLISH ? 'Collapse' : 'Nén lại';

            return (
              <g 
                key={`collapse-handle-${grp.id}`}
                className="cursor-pointer group/collapse-badge select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCapsuleIds(prev => prev.filter(id => id !== grp.id));
                }}
              >
                {/* Connector bracket line */}
                <path
                  d={`M ${x1 - 10} ${y + dir * 16} L ${x1 - 10} ${bracketY} L ${x2 + 10} ${bracketY} L ${x2 + 10} ${y + dir * 16}`}
                  fill="none"
                  className={isLight ? "stroke-indigo-300" : "stroke-indigo-500/40"}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                
                {/* Button background capsule */}
                <rect
                  x={centerX - 35}
                  y={centerY - 8}
                  width="70"
                  height="16"
                  rx="8"
                  className={`transition-all duration-150 stroke shadow-sm ${
                    isLight 
                      ? 'fill-indigo-50 stroke-indigo-200 group-hover/collapse-badge:fill-indigo-100 group-hover/collapse-badge:stroke-indigo-400' 
                      : 'fill-slate-900 stroke-indigo-500/50 group-hover/collapse-badge:fill-indigo-950/40 group-hover/collapse-badge:stroke-indigo-400'
                  }`}
                />
                
                {/* Small minus sign indicator */}
                <line 
                  x1={centerX - 24} 
                  y1={centerY} 
                  x2={centerX - 18} 
                  y2={centerY} 
                  className={isLight ? 'stroke-indigo-600' : 'stroke-indigo-400'} 
                  strokeWidth="2" 
                />

                {/* Button label text */}
                <text
                  x={centerX + 6}
                  y={centerY + 3}
                  textAnchor="middle"
                  className={`text-[8px] font-extrabold font-sans transition-colors ${
                    isLight 
                      ? 'fill-indigo-700 group-hover/collapse-badge:fill-indigo-950' 
                      : 'fill-indigo-300 group-hover/collapse-badge:fill-indigo-200'
                  }`}
                >
                  {buttonLabel}
                </text>
              </g>
            );
          })}

          {/* 4. Drawing Nodes (Commit circles or Collapsed capsules) */}
          {compactNodes.map((node, idx) => {
            const coords = nodeCoords[node.id];
            if (!coords) return null;

            if (node.type === 'collapsed') {
              const messageTooltip = node.commits.map((cx: any) => `${cx.sha.slice(0, 7)}: ${cx.message}`).join('\n');
              const textWord = tone === TranslationTone.ENGLISH ? 'commits' : 'commits';
              const zoomHint = tone === TranslationTone.ENGLISH 
                ? '🔍 Zoom in (up to 1000%) to gradually reveal commits one by one.\n👉 Click to fully expand details.'
                : '🔍 Cuộn chuột hoặc phóng to (tới 1000%) để lộ diện thêm commit.\n👉 Click để mở rộng tất cả chi tiết.';

              return (
                <g 
                  key={node.id} 
                  className="cursor-pointer group/collapsed"
                  onClick={() => {
                    setExpandedCapsuleIds(prev => [...prev, node.id]);
                  }}
                  title={`${node.commits.length} ${textWord}\n\n${messageTooltip}\n\n${zoomHint}`}
                >
                  {/* Glowing background capsule for hover */}
                  <rect 
                    x={coords.x - 30} 
                    y={coords.y - 14} 
                    width="60" 
                    height="28" 
                    rx="14" 
                    className={`transition-all duration-150 stroke-2 ${
                      isLight 
                        ? 'fill-indigo-50/70 stroke-dashed stroke-indigo-300 hover:fill-indigo-100/50 hover:stroke-indigo-400' 
                        : 'fill-slate-900/80 stroke-dashed stroke-indigo-500/50 hover:fill-indigo-950/20 hover:stroke-indigo-400'
                    }`}
                  />
                  {/* Small stack indicator lines representing sheet/layers */}
                  <g className="opacity-75">
                    <line x1={coords.x - 12} y1={coords.y - 4} x2={coords.x + 12} y2={coords.y - 4} className={isLight ? 'stroke-indigo-400' : 'stroke-indigo-400'} strokeWidth="1.5" />
                    <line x1={coords.x - 12} y1={coords.y} x2={coords.x + 12} y2={coords.y} className={isLight ? 'stroke-indigo-400' : 'stroke-indigo-400'} strokeWidth="1.5" />
                    <line x1={coords.x - 12} y1={coords.y + 4} x2={coords.x + 12} y2={coords.y + 4} className={isLight ? 'stroke-indigo-400' : 'stroke-indigo-400'} strokeWidth="1.5" />
                  </g>
                  {/* Commits count label inside capsule */}
                  <rect 
                    x={coords.x - 18} 
                    y={coords.y - 8} 
                    width="36" 
                    height="16" 
                    rx="8" 
                    className={isLight ? 'fill-indigo-600' : 'fill-indigo-500/90'} 
                  />
                  <text 
                    x={coords.x} 
                    y={coords.y + 3} 
                    textAnchor="middle" 
                    className="fill-white text-[8px] font-bold font-mono"
                  >
                    +{node.commits.length}
                  </text>

                  {/* Subtext describing the range */}
                  <text 
                    x={coords.x} 
                    y={coords.y + 24} 
                    textAnchor="middle" 
                    className={`text-[6.5px] font-bold font-mono tracking-wider ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
                  >
                    {node.commits[0].sha.slice(0, 4)}..{node.commits[node.commits.length - 1].sha.slice(0, 4)}
                  </text>
                </g>
              );
            }

            const c = node.commit;
            const isSelected = wizard?.selectedCommits?.includes(c.sha);
            const isHovered = hoveredCommitSha === c.sha;
            const isConflicting = !!c.isConflicting;

            // Color palette depending on track
            const trackVal = typeof c.track === 'number' ? c.track : 0;
            let nodeColorClass = 'stroke-indigo-400';
            let fillColorClass = isLight ? 'fill-indigo-50/90' : 'fill-slate-950';
            let textTextColorClass = 'fill-indigo-300';

            if (c.isConflicting) {
              nodeColorClass = 'stroke-rose-500 stroke-3 animate-pulse';
              fillColorClass = isLight ? 'fill-rose-50' : 'fill-rose-950/20';
              textTextColorClass = 'fill-rose-400 font-extrabold';
            } else if (c.pending) {
              nodeColorClass = 'stroke-amber-400/80 stroke-2';
              fillColorClass = isLight ? 'fill-stone-50/40' : 'fill-slate-950/20';
              textTextColorClass = 'fill-amber-400/60';
            } else if (trackVal === 0) {
              nodeColorClass = 'stroke-emerald-400';
              textTextColorClass = 'fill-emerald-400';
              if (isLight) fillColorClass = 'fill-emerald-50/90';
            } else if (trackVal === 1) {
              nodeColorClass = 'stroke-indigo-400';
              textTextColorClass = 'fill-indigo-400';
              if (isLight) fillColorClass = 'fill-indigo-50/90';
            } else {
              nodeColorClass = 'stroke-amber-400';
              textTextColorClass = 'fill-amber-400';
              if (isLight) fillColorClass = 'fill-amber-50/90';
            }

            if (isSelected && !c.isConflicting && !c.pending) {
              nodeColorClass = 'stroke-amber-500 stroke-3';
              fillColorClass = isLight ? 'fill-amber-50' : 'fill-amber-950/20';
            }

            // Alternating labels to avoid overlapping lines
            const showLabelAbove = idx % 2 === 0;
            const truncatedMessage = c.message.length > 14 ? c.message.slice(0, 11) + '..' : c.message;

            return (
              <g 
                key={c.sha} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCommitSha(c.sha)}
                onMouseLeave={() => setHoveredCommitSha(null)}
              >
                {/* Visual hover highlight halo */}
                {isHovered && (
                  <circle cx={coords.x} cy={coords.y} r="18" className="fill-indigo-400/10 stroke-none" />
                )}

                {/* Conflict hotspot halo */}
                {c.isConflicting && (
                  <circle cx={coords.x} cy={coords.y} r="17" className="fill-none stroke-rose-500/20 stroke-2 animate-ping" />
                )}

                {/* Main commit node circle */}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r={isHovered ? "14" : "12"} 
                  className={`transition-all duration-150 ${nodeColorClass} ${fillColorClass} stroke-2`}
                  strokeDasharray={c.pending ? "3 3" : undefined}
                  filter={isHovered || isSelected ? "url(#glow-effect)" : undefined}
                />

                {/* Short SHA center code */}
                <text 
                  x={coords.x} 
                  y={coords.y + 3} 
                  textAnchor="middle" 
                  className={`text-[7.5px] font-bold font-mono ${isConflicting ? 'fill-rose-500 font-black' : isLight ? 'fill-slate-700' : textTextColorClass}`}
                >
                  {c.sha.slice(0, 4)}
                </text>

                {/* Commit subject shorthand labels */}
                <text 
                  x={coords.x} 
                  y={showLabelAbove ? coords.y - 18 : coords.y + 22} 
                  textAnchor="middle" 
                  className={`text-[7px] font-medium font-sans ${isConflicting ? 'fill-rose-400 font-bold' : isLight ? 'fill-slate-600' : 'fill-slate-400'}`}
                >
                  {truncatedMessage}
                </text>
              </g>
            );
          })}

          {/* 5. Draw branch pointers (HEAD, current, base) */}
          {orderedCommits.map((c) => {
            const coords = commitCoords[c.sha];
            if (!coords) return null;

            const isLatest0 = latestTrack0?.sha === c.sha;
            const isLatest1 = latestTrack1?.sha === c.sha;
            const isHead = headCommit?.sha === c.sha;

            const tagsRender: any[] = [];

            if (isLatest0) {
              tagsRender.push({
                text: `💻 ${baseBranchName}`,
                offsetY: -30,
                styleClass: isLight 
                  ? 'fill-emerald-50/90 stroke-emerald-400 text-emerald-800 border-emerald-400' 
                  : 'fill-emerald-555/10 stroke-emerald-500/40 text-emerald-300'
              });
            }

            if (isLatest1 && currentBranchName !== baseBranchName) {
              tagsRender.push({
                text: `💻 ${currentBranchName}`,
                offsetY: 30,
                styleClass: isLight
                  ? 'fill-indigo-50/90 stroke-indigo-400 text-indigo-800'
                  : 'fill-indigo-555/10 stroke-indigo-400/40 text-indigo-300'
              });
            }

            if (isHead) {
              tagsRender.push({
                text: `📍 HEAD`,
                offsetY: -44,
                styleClass: isLight
                  ? 'fill-rose-50/90 stroke-rose-400 text-rose-800 font-bold'
                  : 'fill-rose-555/15 stroke-rose-450/60 text-rose-300 font-bold'
              });
            }

            // Check if commit message indicates remote tracking
            const isRemoteMarker = c.message.includes('[Remote]') || c.sha === '7c8d9e2' && repoState.commits.some(x => x.sha === 'f941a3c');
            if (isRemoteMarker) {
              tagsRender.push({
                text: `☁️ origin/${baseBranchName}`,
                offsetY: -58,
                styleClass: isLight
                  ? 'fill-indigo-50/60 stroke-indigo-300 text-indigo-850 stroke-dashed'
                  : 'fill-indigo-555/5 stroke-indigo-450/30 text-indigo-300 stroke-dashed'
              });
            }

            return tagsRender.map((tag, tIdx) => {
              const widthTag = tag.text.length * 4.8 + 10;
              return (
                <g key={`${c.sha}-tag-${tIdx}`} transform={`translate(${coords.x}, ${coords.y + tag.offsetY})`} className="opacity-95 pointer-events-none">
                  <rect 
                    x={-widthTag / 2} 
                    y="-4.5" 
                    width={widthTag} 
                    height="9.5" 
                    rx="2" 
                    className={`${tag.styleClass} stroke`} 
                  />
                  <text 
                    x="0" 
                    y="2.5" 
                    textAnchor="middle" 
                    className={`text-[6px] font-bold`}
                    fill={tag.styleClass.includes('text-emerald-800') || tag.styleClass.includes('text-emerald-300') ? (isLight ? '#065f46' : '#a7f3d0') : tag.styleClass.includes('text-indigo-800') || tag.styleClass.includes('text-indigo-300') ? (isLight ? '#3730a3' : '#c7d2fe') : (isLight ? '#9f1239' : '#fecdd3')}
                  >
                    {tag.text}
                  </text>
                  <line 
                    x1="0" 
                    y1={tag.offsetY > 0 ? -4.5 : 5} 
                    x2="0" 
                    y2={tag.offsetY > 0 ? -tag.offsetY : -tag.offsetY} 
                    className={`stroke-1 ${isLight ? 'stroke-slate-300' : 'stroke-slate-800'} stroke-dashed`} 
                  />
                </g>
              );
            });
          })}
        </svg>
      </div>

        {/* 6. Interactive Floating Details Card on Node Hover */}
        {hoveredCommitSha && (() => {
          const matchingCommit = repoState.commits.find(c => c.sha === hoveredCommitSha);
          if (!matchingCommit) return null;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 p-3 rounded-lg border shadow-xl flex flex-col gap-1 min-w-[280px] max-w-[320px] transition-all pointer-events-none ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/95 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-slate-800/40">
                <span className="font-mono text-[9.5px] font-bold text-indigo-400">
                  Commit: {matchingCommit.sha}
                </span>
                <span className="text-[8px] font-mono font-bold bg-indigo-500/15 text-indigo-300 px-1.5 py-0.2 rounded uppercase border border-indigo-500/20">
                  {matchingCommit.type || 'commit'}
                </span>
              </div>
              <p className="text-[10px] font-sans font-bold leading-normal mb-1">
                {matchingCommit.message}
              </p>
              <div className="font-mono text-[8px] text-slate-400 flex flex-col gap-0.5">
                <div>🧑‍💻 Tác giả: <span className="font-sans font-medium">{matchingCommit.author}</span></div>
                <div>📅 Ngày: <span className="font-sans font-medium">{matchingCommit.date}</span></div>
                {matchingCommit.parents && matchingCommit.parents.length > 0 && (
                  <div>🔗 Parents: <span>{matchingCommit.parents.join(', ')}</span></div>
                )}
                {matchingCommit.selected && (
                  <div className="text-amber-400 font-bold mt-1">⭐️ Đang được chọn trong Wizard</div>
                )}
              </div>
            </motion.div>
          );
        })()}
      </div>
    );
  };

  // Track default aspect-ratio safe sizes
  const getStageDimensions = () => {
    if (isSyncedWithWizard && repoState && repoState.commits && repoState.commits.length > 0) {
      const count = repoState.commits.length;
      const minSpacing = 85;
      const computedW = count > 1 ? Math.max(600, 130 + (count - 1) * minSpacing) : 600;
      return { w: computedW, h: 220 };
    }
    return { w: 600, h: 180 };
  };

  const { w: stageW, h: stageH } = getStageDimensions();
  // Compute fitting scale factor bounded to avoid pixelation on ultra-wide
  const autoFitScale = containerWidth ? Math.min(1.2, (containerWidth - 16) / stageW) : 1.0;

  // Render nodes based on step and action type
  const renderVisualStage = () => {
    const width = stageW;
    const height = stageH;

    // Standard Real Git Tree synchronization if active
    if (isSyncedWithWizard && repoState && repoState.commits && repoState.commits.length > 0) {
      return renderRealGitTree(width, 220);
    }

    switch (activeAction) {
      case 'rebase':
        return renderRebaseVisual(width, height);
      case 'stash':
        return renderStashVisual(width, height);
      case 'merge':
        return renderMergeVisual(width, height);
      case 'commit':
        return renderCommitVisual(width, height);
      case 'push':
        return renderPushVisual(width, height);
      case 'diverge':
        return renderDivergeVisual(width, height);
      case 'fast-forward':
        return renderFastForwardVisual(width, height);
      default:
        return null;
    }
  };

  // Helpers to draw specific visualizers

  // REBASE
  const renderRebaseVisual = (w: number, h: number) => {
    // Develop baseline is M1(100,60) -> M2(200,60) -> M3(300,60)
    // Feature branch sprouts from M1 or M2. F1, F2
    // Step 0: F1(200,120), F2(300,120) split from M1. Develop advanced to M3.
    // Step 1: F1, F2 fade, shown floating in space detached.
    // Step 2: Feature base pointer slides from M1 to M3.
    // Step 3: F1 land on top of M3 -> F1'(400,60)
    // Step 4: F2 land on top of F1' -> F2'(500,60)

    const baseNodes = [
      { id: 'M1', x: 100, y: 60, status: 'stable', label: 'M1' },
      { id: 'M2', x: 200, y: 60, status: 'stable', label: 'M2' },
      { id: 'M3', x: 300, y: 60, status: 'develop-head', label: 'M3 (Develop Head)' }
    ];

    let f1X = 200, f1Y = 120, f1Color = isLight ? 'stroke-amber-500 fill-amber-50' : 'stroke-amber-400 fill-slate-900', f1Label = 'F1';
    let f2X = 300, f2Y = 120, f2Color = isLight ? 'stroke-amber-500 fill-amber-50' : 'stroke-amber-400 fill-slate-900', f2Label = 'F2';
    let f1Opacity = 1;
    let f2Opacity = 1;
    let baseLineEnd = 300;
    let featureLineEnd = 300;
    let showTempLines = true;
    let basePointX = 100;

    if (currentStep === 1) { // Detach
      f1Y = 140; f1Opacity = 0.55; f1Color = isLight ? 'stroke-amber-550/50 fill-amber-50/40' : 'stroke-amber-400/50 fill-slate-900/40';
      f2Y = 140; f2Opacity = 0.55; f2Color = isLight ? 'stroke-amber-550/50 fill-amber-50/40' : 'stroke-amber-400/50 fill-slate-900/40';
      showTempLines = false;
    } else if (currentStep === 2) { // Shifting Base
      f1Y = 150; f1Opacity = 0.2;
      f2Y = 150; f2Opacity = 0.2;
      showTempLines = false;
      basePointX = 300; // Pointer moves to M3
    } else if (currentStep === 3) { // F1 Reapplied
      f1X = 400; f1Y = 60; f1Color = isLight ? 'stroke-indigo-500 fill-indigo-100/60' : 'stroke-indigo-400 fill-indigo-950/40'; f1Label = "F1' (SHA*)";
      f2Y = 140; f2Opacity = 0.4;
      showTempLines = false;
      baseLineEnd = 400;
      basePointX = 300;
    } else if (currentStep === 4) { // F2 Reapplied
      f1X = 400; f1Y = 60; f1Color = isLight ? 'stroke-indigo-500 fill-indigo-100/60' : 'stroke-indigo-400 fill-indigo-950/40'; f1Label = "F1' (New)";
      f2X = 500; f2Y = 60; f2Color = isLight ? 'stroke-indigo-500 fill-indigo-100/60' : 'stroke-indigo-400 fill-indigo-950/40'; f2Label = "F2' (New)";
      showTempLines = false;
      baseLineEnd = 500;
      basePointX = 300;
    }

    return (
      <svg className="w-full h-full font-mono text-[10px]" viewBox={`0 0 ${w} ${h}`} referrerPolicy="no-referrer">
        {/* Develop baseline line */}
        <line x1="50" y1="60" x2={baseLineEnd} y2="60" className="stroke-emerald-500/60 stroke-2" />
        
        {/* Connection to feature branch old móng base */}
        {showTempLines && (
          <>
            <path d="M 100 60 Q 150 120 200 120" className={`${isLight ? 'stroke-slate-300' : 'stroke-slate-700'} stroke-2 fill-none stroke-dashed`} />
            <line x1="200" y1="120" x2={featureLineEnd} y2="120" className="stroke-amber-400/60 stroke-2" />
          </>
        )}

        {/* Shifting point indicator arrow */}
        {currentStep === 2 && (
          <path d="M 100 60 Q 200 100 300 60" className="stroke-indigo-400 stroke-2 fill-none stroke-dashed animate-pulse" markerEnd="url(#arrow)" />
        )}

        {/* Develop commits */}
        {baseNodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="16" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold font-mono text-[9px]}`}>{n.id}</text>
            {n.id === 'M3' ? (
              <g>
                {/* Local develop branch tag */}
                <g transform="translate(300, -18)" className="opacity-95">
                  <rect x="-34" y="-5" width="68" height="11" rx="2.5" className={`${isLight ? 'fill-emerald-100/85 stroke-emerald-400' : 'fill-emerald-500/15 stroke-emerald-400'}`} />
                  <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[7px]`}>💻 develop</text>
                </g>
                {/* Remote tracking develop branch tag */}
                <g transform="translate(300, -32)" className="opacity-80">
                  <rect x="-42" y="-5" width="84" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/70 stroke-indigo-405' : 'fill-indigo-500/10 stroke-indigo-400/40'} stroke-dashed`} />
                  <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-indigo-800 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/develop</text>
                </g>
              </g>
            ) : (
              <text x={n.x} y={n.y - 22} textAnchor="middle" className={`${isLight ? 'fill-slate-400 font-bold' : 'fill-slate-500'} text-[8px]`}>{n.label}</text>
            )}
          </g>
        ))}

        {/* Feature commit F1 */}
        <g opacity={f1Opacity} className="transition-all duration-700">
          <circle cx={f1X} cy={f1Y} r="16" className={`${f1Color} stroke-2`} />
          <text x={f1X} y={f1Y + 4} textAnchor="middle" className={`font-bold font-mono text-[9px] ${f1Color.includes('indigo') ? (isLight ? 'fill-indigo-800' : 'fill-indigo-350') : (isLight ? 'fill-amber-800' : 'fill-amber-350')}`}>{f1Label}</text>
          {currentStep < 3 && <text x={f1X} y={f1Y + 26} textAnchor="middle" className={`${isLight ? 'fill-amber-600/70' : 'fill-amber-500/60'} text-[8px]`}>feature local commit</text>}
        </g>

        {/* Feature commit F2 */}
        <g opacity={f2Opacity} className="transition-all duration-700">
          <circle cx={f2X} cy={f2Y} r="16" className={`${f2Color} stroke-2`} />
          <text x={f2X} y={f2Y + 4} textAnchor="middle" className={`font-bold font-mono text-[9px] ${f2Color.includes('indigo') ? (isLight ? 'fill-indigo-800' : 'fill-indigo-350') : (isLight ? 'fill-amber-800' : 'fill-amber-350')}`}>{f2Label}</text>
        </g>

        {/* Pointers & Markers label */}
        {currentStep < 3 ? (
          <g transform={`translate(${f2X}, ${f2Y - 32})`} className="opacity-90">
            <rect x="-44" y="-6" width="88" height="15" rx="3" className={`${isLight ? 'fill-amber-100/80 stroke-amber-400' : 'fill-amber-500/10 stroke-amber-500/30'}`} />
            <text x="0" y="4" textAnchor="middle" className={`text-[8.5px] font-bold ${isLight ? 'fill-amber-800' : 'fill-amber-400'}`}>💻 feature (local)</text>
            <line x1="0" y1="9" x2="0" y2="16" className={`${isLight ? 'stroke-amber-400/40' : 'stroke-amber-400/50'}`} />
          </g>
        ) : (
          <g transform={`translate(${f2X}, ${f2Y - 32})`} className="opacity-90 transition-all duration-500">
            <rect x="-48" y="-6" width="96" height="15" rx="3" className={`${isLight ? 'fill-indigo-100/80 stroke-indigo-405' : 'fill-indigo-500/20 stroke-indigo-400'}`} />
            <text x="0" y="4" textAnchor="middle" className={`text-[8.5px] font-bold ${isLight ? 'fill-indigo-800' : 'fill-indigo-300'}`}>💻 feature (local HEAD)</text>
            <line x1="0" y1="9" x2="0" y2="16" className={`${isLight ? 'stroke-indigo-400/30' : 'stroke-indigo-400/50'}`} />
          </g>
        )}

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-indigo-400" />
          </marker>
        </defs>
      </svg>
    );
  };

  // STASH
  const renderStashVisual = (w: number, h: number) => {
    // Step 0: Working directory with file1.js, file2.css (red) at top, repo commits (C1, C2) at center bottom
    // Step 1: Files grouping and flashing to prep
    // Step 2: Files falling/moving cleanly into the Stash Stack box (right shelf)
    // Step 3: Local working directory turns sparkling clean and shiny (green indicator)
    // Step 4: file pulls back right from Stash drawer into local sandbox

    let file1X = 130, file1Y = 40, file1Opacity = 1, file1Color = isLight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-500/15 border-rose-400 text-rose-300';
    let file2X = 230, file2Y = 40, file2Opacity = 1, file2Color = isLight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-500/15 border-rose-400 text-rose-300';
    let cleanIndicatorColor = isLight ? 'bg-rose-100 border-rose-200 text-rose-800 font-bold' : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    let cleanText = "DIRTY WORKING DIRECTORY";
    let stashBoxHighlight = isLight ? 'border-slate-250 bg-slate-100/50' : 'border-slate-800 bg-[#0d1324]/50';

    if (currentStep === 1) { // Bundled
      file1Color = isLight ? 'bg-amber-100/80 border-amber-400 text-amber-800 animate-pulse' : 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse';
      file2Color = isLight ? 'bg-amber-100/80 border-amber-400 text-amber-800 animate-pulse' : 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse';
    } else if (currentStep === 2) { // Falling into shelf
      file1X = 420; file1Y = 100; file1Opacity = 0.3; file1Color = isLight ? 'bg-indigo-100 border-indigo-300 text-indigo-800 scale-75' : 'bg-indigo-500/20 border-indigo-400 text-indigo-400 scale-75';
      file2X = 420; file2Y = 120; file2Opacity = 0.3; file2Color = isLight ? 'bg-indigo-100 border-indigo-300 text-indigo-800 scale-75' : 'bg-indigo-500/20 border-indigo-400 text-indigo-400 scale-75';
      stashBoxHighlight = isLight ? 'border-indigo-455 bg-indigo-50 shadow-md shadow-indigo-100/50' : 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/10';
    } else if (currentStep === 3) { // Clean working directory
      file1Opacity = 0;
      file2Opacity = 0;
      cleanIndicatorColor = isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      cleanText = "✓ PRISTINE & CLEAN WORKSPACE";
      stashBoxHighlight = isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-700 bg-slate-900/60';
    } else if (currentStep === 4) { // Pop back
      file1X = 140; file1Y = 50; file1Opacity = 1; file1Color = isLight ? 'bg-teal-50 border-teal-350 text-teal-800 animate-bounce' : 'bg-teal-500/20 border-teal-400 text-teal-300 animate-bounce';
      file2Opacity = 0; // Pop pop single item shown
      cleanIndicatorColor = isLight ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-teal-500/10 text-teal-300 border-teal-500/20';
      cleanText = "STASH POP REAPPLIED";
    }

    return (
      <div className="relative overflow-hidden" style={{ width: `${w}px`, height: `${h}px` }} id="stash-stage">
        {/* Working Sandbox area */}
        <div className={`absolute left-6 top-8 w-[280px] h-[110px] rounded-xl border border-dashed flex flex-col justify-between p-3 select-none ${
          isLight ? 'border-slate-305 bg-slate-100/40' : 'border-slate-800 bg-slate-950/30'
        }`}>
          <div className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">LOCAL TREE WORKSPACE</div>
          
          <div className="flex gap-4 items-center justify-center py-2 relative">
            {/* Dirty indicators */}
            <AnimatePresence>
              {file1Opacity > 0 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ x: file1X - 110, y: file1Y - 60, scale: 1, opacity: file1Opacity }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-mono font-semibold flex items-center gap-1.5 shadow-md ${file1Color}`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>file1.ts (modified)</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {file2Opacity > 0 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ x: file2X - 250, y: file2Y - 60, scale: 1, opacity: file2Opacity }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-mono font-semibold flex items-center gap-1.5 shadow-md ${file2Color}`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>styles.css (dirty)</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`px-2 py-0.5 rounded text-[8.5px] font-bold text-center border font-mono ${cleanIndicatorColor}`}>
            {cleanText}
          </div>
        </div>

        {/* Transfer pathway arrow */}
        <div className="absolute left-[305px] top-1/2 -translate-y-1/2 text-slate-800 text-lg flex flex-col items-center select-none">
          {currentStep === 2 && <span className="text-indigo-400 font-bold text-[10px] animate-pulse">stashing...</span>}
          <div className="flex items-center gap-1 relative">
            <ArrowRight className={`w-5 h-5 ${currentStep === 2 ? 'text-indigo-400 animate-bounce' : (isLight ? 'text-slate-355' : 'text-slate-800')}`} />
          </div>
        </div>

        {/* Cabinet shelf represents Stash Stack */}
        <div className={`absolute right-6 top-8 w-[200px] h-[110px] rounded-xl border p-3 flex flex-col justify-between transition-all duration-500 ${stashBoxHighlight}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>STASH STACK</span>
            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border font-bold ${
              isLight ? 'bg-indigo-150 text-indigo-805 border-indigo-200' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'
            }`}>refs/stash</span>
          </div>

          {/* Stashed blocks shelf items */}
          <div className="flex flex-col gap-1.5 py-1 select-none">
            {currentStep >= 2 ? (
              <div className={`border rounded p-1 text-[8.5px] font-mono flex items-center justify-between shadow-sm ${
                isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-805' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}>
                <span>📦 stash@{"{0}"}: "Work in progress"</span>
                <span className={`text-[7.5px] font-semibold px-1 rounded font-mono ${
                  isLight ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' : 'bg-indigo-950/50 text-indigo-400'
                }`}>1 commit</span>
              </div>
            ) : (
              <div className={`${isLight ? 'text-slate-455' : 'text-slate-705'} text-center text-[9px] py-2 italic font-mono`}>Empty stash shelf</div>
            )}
            <div className={`h-0.5 w-full mt-1.5 rounded opacity-40 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}></div>
          </div>

          <div className={`text-[8.5px] font-mono text-center ${isLight ? 'text-slate-450' : 'text-slate-400'}`}>
            Last-In, First-Out (LIFO) Stack
          </div>
        </div>
      </div>
    );
  };

  // MERGE
  const renderMergeVisual = (w: number, h: number) => {
    // Baseline: M1(100,50) -> M2(200,50) -> M3(300,50)
    // Feature branch: F1(200,130) -> F2(300,130)
    // Step 0: Base and feature diverging
    // Step 1: Git looking for Ancestor M1 (highlight M1 in red/purple)
    // Step 2: Connections forming between M3 and F2
    // Step 3: Spawn M4(420, 80) with two diagonal arrow lines merging in
    // Step 4: Feature fully integrated to main line, highlight final pathway

    const baseLineEnd = currentStep >= 3 ? 420 : 300;
    const isAncestorHot = currentStep === 1;

    return (
      <svg className="w-full h-full font-mono text-[10px]" viewBox={`0 0 ${w} ${h}`} referrerPolicy="no-referrer">
        {/* Branch Lines */}
        <path d="M 50 50 L 300 50" className="stroke-emerald-500/60 stroke-2 fill-none" />
        <path d="M 100 50 Q 150 130 200 130 L 300 130" className="stroke-amber-500/60 stroke-2 fill-none" />

        {/* Merge links */}
        {currentStep === 2 && (
          <>
            <line x1="300" y1="50" x2="380" y2="90" className="stroke-indigo-400/50 stroke-dashed stroke-2 animate-pulse" />
            <line x1="300" y1="130" x2="380" y2="90" className="stroke-indigo-400/50 stroke-dashed stroke-2 animate-pulse" />
          </>
        )}

        {currentStep >= 3 && (
          <>
            <path d="M 300 50 L 420 90" className="stroke-indigo-500 stroke-2 fill-none stroke-dashed" markerEnd="url(#arrow-merge)" />
            <path d="M 300 130 L 420 90" className="stroke-indigo-500 stroke-2 fill-none stroke-dashed" markerEnd="url(#arrow-merge)" />
            <line x1="420" y1="90" x2="520" y2="90" className="stroke-emerald-400 stroke-2" />
          </>
        )}

        {/* M1 node */}
        <g>
          <circle cx="100" cy="50" r="16" className={`stroke-2 transition-all ${isAncestorHot ? (isLight ? 'stroke-purple-500 fill-purple-100 animate-pingScale' : 'stroke-purple-400 fill-purple-950/50 animate-pingScale') : (`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'}`)}`} />
          <circle cx="100" cy="50" r="14" className={`${isLight ? 'fill-white stroke-slate-200' : 'fill-slate-950 stroke-slate-800'}`} />
          <text x="100" y="54" textAnchor="middle" className={`font-bold text-[9px] ${isAncestorHot ? (isLight ? 'fill-purple-900 font-extrabold' : 'fill-purple-300') : (isLight ? 'fill-emerald-800' : 'fill-emerald-300')}`}>M1</text>
          <text x="100" y="24" textAnchor="middle" className={`${isLight ? 'fill-slate-400 font-bold' : 'fill-slate-500'} text-[8px]`}>{isAncestorHot ? '🔮 Common Ancestor' : 'M1 Baseline'}</text>
        </g>

        {/* M2 & M3 nodes */}
        <g>
          <circle cx="200" cy="50" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
          <text x="200" y="54" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[9px]`}>M2</text>
        </g>
        <g>
          <circle cx="300" cy="50" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
          <text x="300" y="54" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[9px]`}>M3</text>
          
          {currentStep < 3 ? (
            <g>
              {/* Local master pointer tag on M3 */}
              <g transform="translate(300, 16)" className="opacity-95">
                <rect x="-28" y="-5" width="56" height="11" rx="2.5" className={`${isLight ? 'fill-emerald-100/90 stroke-emerald-400' : 'fill-emerald-500/15 stroke-emerald-400'}`} />
                <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-350'} font-bold text-[7px]`}>💻 master</text>
              </g>
              {/* Remote tracking origin/master tag on M3 */}
              <g transform="translate(300, -18)" className="opacity-80">
                <rect x="-38" y="-5" width="76" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/80 stroke-indigo-405' : 'fill-indigo-500/10 stroke-indigo-400/40'} stroke-dashed`} />
                <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-800 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/master</text>
              </g>
            </g>
          ) : (
            <g>
              {/* After merge, local master moves to M4 but remote tracker stays at M3! */}
              <g transform="translate(300, 16)" className="opacity-85">
                <rect x="-38" y="-5" width="76" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/80 stroke-indigo-405' : 'fill-indigo-500/10 stroke-indigo-400/40'} stroke-dashed`} />
                <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/master</text>
              </g>
            </g>
          )}
        </g>

        {/* F1 & F2 nodes */}
        <g>
          <circle cx="200" cy="130" r="14" className={`stroke-amber-400 ${isLight ? 'fill-amber-50' : 'fill-slate-950'} stroke-2`} />
          <text x="200" y="134" textAnchor="middle" className={`${isLight ? 'fill-amber-800' : 'fill-amber-300'} font-bold text-[9px]`}>F1</text>
        </g>
        <g>
          <circle cx="300" cy="130" r="14" className={`stroke-amber-400 ${isLight ? 'fill-amber-50' : 'fill-slate-950'} stroke-2`} />
          <text x="300" y="134" textAnchor="middle" className={`${isLight ? 'fill-amber-800' : 'fill-amber-300'} font-bold text-[9px]`}>F2</text>
          
          {/* Local feature branch pointer tag */}
          <g transform="translate(300, 162)" className="opacity-95">
            <rect x="-30" y="-5" width="60" height="11" rx="2.5" className={`${isLight ? 'fill-amber-100 border-amber-350 shadow-sm' : 'fill-amber-500/15 stroke-amber-500/40'}`} />
            <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-amber-800' : 'fill-amber-300'} font-bold text-[7px]`}>💻 feature</text>
          </g>
        </g>

        {/* Spawned Merge commit node */}
        {currentStep >= 3 && (
          <g className="transition-all duration-700">
            <circle cx="420" cy="90" r="18" className={`stroke-indigo-400 ${isLight ? 'fill-indigo-100 shadow-md' : 'fill-indigo-950'} border stroke-2 animate-bounce`} />
            <text x="420" y="93" textAnchor="middle" className={`${isLight ? 'fill-indigo-850' : 'fill-indigo-300'} font-bold text-[8.5px]`}>M4</text>
            <text x="420" y="122" textAnchor="middle" className={`${isLight ? 'fill-indigo-700' : 'fill-indigo-400'} text-[8px] font-bold`}>Merge Commit</text>
            
            {/* Merged master branch tag - local master advanced to M4 */}
            <g transform={`translate(420, 24)`}>
              <rect x="-38" y="-6" width="76" height="14" rx="3" className={`${isLight ? 'fill-emerald-100/95 stroke-emerald-405' : 'fill-emerald-500/20 stroke-emerald-400'}`} />
              <text x="0" y="4.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-850' : 'fill-emerald-350'} text-[7.5px] font-bold`}>💻 master (local)</text>
            </g>
          </g>
        )}

        <defs>
          <marker id="arrow-merge" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-indigo-500" />
          </marker>
        </defs>
      </svg>
    );
  };

  // COMMIT
  const renderCommitVisual = (w: number, h: number) => {
    // Baseline: C1(100,60) -> C2(220,60)
    // File queue at staging top index
    // Step 0: Edit file sitting in sandbox
    // Step 1: Fly files as packaged blobs to Staging Zone (340, 120)
    // Step 2: Freeze blob pack, calculating SHA cryptographic hash, transforming to new C3 (340,60) commit block
    // Step 3: Advance Head label from C2 to C3

    let showFiles = currentStep < 2;
    let fileXOffset = currentStep === 1 ? 160 : 0;
    let fileYOffset = currentStep === 1 ? 40 : 0;
    let fileOpacity = currentStep >= 2 ? 0 : 1;
    let fileColor = currentStep === 1 
      ? (isLight ? "bg-emerald-50 border-emerald-300 text-emerald-800 animate-pulse font-semibold" : "bg-emerald-500/20 border-emerald-400 text-emerald-300") 
      : (isLight ? "bg-slate-100 border-slate-205 text-slate-700" : "bg-slate-800/40 border-slate-700 text-slate-300");

    return (
      <div className="relative overflow-hidden" style={{ width: `${w}px`, height: `${h}px` }} id="commit-stage">
        {/* Staging Index Queue */}
        <div className={`absolute left-[30px] top-[15px] w-[260px] h-[55px] border border-dashed rounded-lg p-2 flex flex-col justify-between ${
          isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-950/20'
        }`}>
          <span className={`text-[8px] font-mono block uppercase font-bold tracking-wider ${isLight ? 'text-slate-450' : 'text-slate-500'}`}>Staging Area Index (Index)</span>
          <div className="flex gap-2 justify-center select-none" style={{ opacity: fileOpacity }}>
            <div className={`px-2 py-0.5 rounded border text-[8px] flex items-center gap-1.5 transition-all duration-700 ${fileColor}`} style={{ transform: `translate(${fileXOffset}px, ${fileYOffset}px)` }}>
              <Bookmark className="w-2.5 h-2.5" />
              <span>staged_code.ts</span>
            </div>
            <div className={`px-2 py-0.5 rounded border text-[8px] flex items-center gap-1.5 transition-all duration-700 ${fileColor}`} style={{ transform: `translate(${fileXOffset}px, ${fileYOffset}px)` }}>
              <Bookmark className="w-2.5 h-2.5" />
              <span>package.json</span>
            </div>
          </div>
        </div>

        {/* History timeline SVG */}
        <svg className="absolute left-0 bottom-0 w-full h-[100px] font-mono" viewBox="0 0 600 100" referrerPolicy="no-referrer">
          <line x1="50" y1="45" x2={currentStep >= 2 ? 380 : 220} y2="45" className="stroke-indigo-500/60 stroke-2" />

          {/* C1 & C2 Commits */}
          <g>
            <circle cx="110" cy="45" r="14" className={`stroke-indigo-400 ${isLight ? 'fill-indigo-50' : 'fill-slate-950'} stroke-2`} />
            <text x="110" y="49" textAnchor="middle" className={`${isLight ? 'fill-indigo-855 font-bold' : 'fill-indigo-300'} font-bold text-[8.5px]`}>C1</text>
          </g>

          <g>
            <circle cx="220" cy="45" r="14" className={`stroke-indigo-400 ${isLight ? 'fill-indigo-50' : 'fill-slate-950'} stroke-2`} />
            <text x="220" y="49" textAnchor="middle" className={`${isLight ? 'fill-indigo-855 font-bold' : 'fill-indigo-300'} font-bold text-[8.5px]`}>C2</text>
            {currentStep < 3 ? (
              <g>
                {/* Local branch pointer tag at C2 */}
                <g transform="translate(220, 14)" className="opacity-95">
                  <rect x="-24" y="-5" width="48" height="11" rx="2.5" className={`${isLight ? 'fill-emerald-100/90 stroke-emerald-400 font-bold' : 'fill-emerald-500/15 stroke-emerald-400'}`} />
                  <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[7px]`}>💻 main</text>
                </g>
                {/* Remote tracking branch tag at C2 */}
                <g transform="translate(220, -18)" className="opacity-80">
                  <rect x="-35" y="-5" width="70" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/80 stroke-indigo-405' : 'fill-indigo-500/10 stroke-indigo-400/40'} stroke-dashed`} />
                  <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/main</text>
                </g>
              </g>
            ) : (
              <g>
                {/* After commit, remote tracking tag stays at C2 */}
                <g transform="translate(220, 14)" className="opacity-85">
                  <rect x="-35" y="-5" width="70" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/80 stroke-indigo-405' : 'fill-indigo-500/10 stroke-indigo-400/40'} stroke-dashed`} />
                  <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/main</text>
                </g>
              </g>
            )}
          </g>

          {/* Spawning C3 */}
          {currentStep >= 2 && (
            <g className="transition-all duration-500 animate-zoomIn">
              <circle cx="340" cy="45" r="16" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50 shadow-sm' : 'fill-emerald-950/20'} stroke-2 shadow`} />
              <text x="340" y="48.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-850' : 'fill-emerald-300'} font-bold text-[8.5px]`}>C3</text>
              {currentStep === 3 && (
                <g>
                   {/* Local branch pointer tag moves to C3 */}
                   <g transform="translate(340, 14)">
                     <rect x="-24" y="-5" width="48" height="11" rx="2.5" className={`${isLight ? 'fill-emerald-100/90 stroke-emerald-400 font-bold' : 'fill-emerald-505/15 stroke-emerald-400'}`} />
                     <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-805' : 'fill-emerald-300'} font-bold text-[7px]`}>💻 main</text>
                   </g>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>
    );
  };

  // PUSH
  const renderPushVisual = (w: number, h: number) => {
    // Local: C1 -> C2 -> C3 (local main at C3)
    // Server: C1 -> C2 -> C3 (origin/main moves to C3 at step 3)
    const remoteContainsC3 = currentStep === 3;
    const isFlight = currentStep === 2;
    const isPackaging = currentStep === 1;

    return (
      <div className="relative overflow-hidden" style={{ width: `${w}px`, height: `${h}px` }} id="push-stage">
        {/* Local Area & Remote Area Side-by-Side Grid */}
        <div className="grid grid-cols-2 gap-4 h-full relative p-2">
          {/* Local Machine Dashboard */}
          <div className={`rounded-xl border p-3 flex flex-col justify-between ${
            isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-950/40 border-emerald-950/20'
          }`}>
            <div className="flex items-center justify-between border-b pb-1 mb-1 border-emerald-500/10">
              <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>💻 Local (Client)</span>
              <span className={`text-[7.5px] font-mono px-1 py-0.2 rounded border ${isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-250 font-semibold' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>refs/heads/main</span>
            </div>
            
            {/* Local Repository Timeline */}
            <div className="flex-1 flex items-center justify-center min-h-[50px] relative">
              <svg className="w-full h-full font-mono" viewBox="0 0 250 80" referrerPolicy="no-referrer">
                {/* Connection paths */}
                <line x1="30" y1="40" x2="190" y2="40" className="stroke-emerald-500/40 stroke-2" />
                
                {/* Commits */}
                <g>
                  <circle cx="45" cy="40" r="11" className={`stroke-emerald-500/60 ${isLight ? 'fill-emerald-50/40' : 'fill-slate-950'} stroke-2`} />
                  <text x="45" y="43" textAnchor="middle" className={`${isLight ? 'fill-emerald-800 font-bold' : 'fill-emerald-400'} font-bold text-[7.5px]`}>C1</text>
                </g>

                <g>
                  <circle cx="115" cy="40" r="11" className={`stroke-emerald-500/60 ${isLight ? 'fill-emerald-50/40' : 'fill-slate-950'} stroke-2`} />
                  <text x="115" y="43" textAnchor="middle" className={`${isLight ? 'fill-emerald-800 font-bold' : 'fill-emerald-400'} font-bold text-[7.5px]`}>C2</text>
                </g>

                <g className="animate-zoomIn">
                  <circle cx="185" cy="40" r="13" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-100' : 'fill-slate-950'} stroke-2`} />
                  <text x="185" y="43" textAnchor="middle" className={`${isLight ? 'fill-emerald-850' : 'fill-emerald-300'} font-bold text-[7.5px]`}>C3</text>
                  
                  {/* Local main tag stays at C3 */}
                  <g transform="translate(185, 14)">
                    <rect x="-18" y="-4" width="36" height="9" rx="1.5" className={`${isLight ? 'fill-emerald-100/95 stroke-emerald-350' : 'fill-emerald-500/20 stroke-emerald-400/60'}`} />
                    <text x="0" y="2.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-850 font-bold' : 'fill-emerald-300'} text-[5.5px] font-bold`}>main</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Packaging status bar */}
            {isPackaging && (
              <div className={`text-[7.5px] font-mono border rounded py-1 text-center animate-pulse ${isLight ? 'bg-emerald-100 text-emerald-855 border-emerald-250 font-bold' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'}`}>
                📦 Creating delta payload packs...
              </div>
            )}
            {!isPackaging && !isFlight && (
              <div className={`text-[7.5px] text-center font-mono py-1 rounded border-dashed border ${
                isLight ? 'border-slate-300 text-slate-500 bg-slate-50' : 'border-slate-900/60 text-slate-600'
              }`}>
                Ready to transmit object C3
              </div>
            )}
            {isFlight && (
              <div className={`text-[7.5px] font-mono border rounded py-1 text-center animate-pulse ${isLight ? 'bg-sky-100 text-sky-850 border-sky-250 font-bold' : 'bg-sky-500/10 text-sky-300 border-sky-500/20'}`}>
                ⚡ Transmitting Packfile stream...
              </div>
            )}
          </div>

          {/* Remote (Cloud GitHub Server) Area */}
          <div className={`rounded-xl border p-3 flex flex-col justify-between ${
            isLight ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-950/40 border-indigo-950/20'
          }`}>
            <div className="flex items-center justify-between border-b pb-1 mb-1 border-indigo-500/10">
              <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-indigo-805' : 'text-indigo-400'}`}>☁️ Remote (GitHub Server)</span>
              <span className={`text-[7.5px] font-mono px-1 py-0.2 rounded border ${isLight ? 'bg-indigo-100 text-indigo-800 border-indigo-250 font-semibold' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>origin/refs/heads/main</span>
            </div>

            {/* Remote Timeline */}
            <div className="flex-1 flex items-center justify-center min-h-[50px] relative">
              <svg className="w-full h-full font-mono" viewBox="0 0 250 80" referrerPolicy="no-referrer">
                {/* Connection line inside Remote */}
                <line x1="30" y1="40" x2={remoteContainsC3 ? "190" : "115"} y2="40" className="stroke-indigo-500/40 stroke-2" />

                <g>
                  <circle cx="45" cy="40" r="11" className={`stroke-indigo-405 $isLight ? 'fill-indigo-50' : 'fill-slate-950'} stroke-2`} />
                  <text x="45" y="43" textAnchor="middle" className={`${isLight ? 'fill-indigo-800' : 'fill-indigo-300'} font-bold text-[7.5px]`}>C1</text>
                </g>

                <g>
                  <circle cx="115" cy="40" r="11" className={`stroke-indigo-405 $isLight ? 'fill-indigo-50' : 'fill-slate-950'} stroke-2`} />
                  <text x="115" y="43" textAnchor="middle" className={`${isLight ? 'fill-indigo-800 font-bold' : 'fill-indigo-300'} font-bold text-[7.5px]`}>C2</text>
                  
                  {!remoteContainsC3 && (
                    <g transform="translate(115, 14)">
                      <rect x="-24" y="-4" width="48" height="9" rx="1.5" className={`${isLight ? 'fill-indigo-100/90 stroke-indigo-400' : 'fill-indigo-500/20 stroke-indigo-400/60'} shadow-md animate-pulse`} />
                      <text x="0" y="2.5" textAnchor="middle" className={`${isLight ? 'fill-indigo-850 font-bold' : 'fill-indigo-300'} text-[5.5px] font-bold`}>origin/main</text>
                    </g>
                  )}
                </g>

                {remoteContainsC3 ? (
                  <g className="animate-zoomIn">
                    <circle cx="185" cy="40" r="13" className={`stroke-indigo-400 ${isLight ? 'fill-indigo-100' : 'fill-indigo-950'} stroke-2 shadow`} />
                    <text x="185" y="43" textAnchor="middle" className={`${isLight ? 'fill-indigo-850' : 'fill-indigo-300'} font-bold text-[7.5px]`}>C3</text>
                    
                    <g transform="translate(185, 14)">
                      <rect x="-24" y="-4" width="48" height="9" rx="1.5" className={`${isLight ? 'fill-indigo-150 stroke-indigo-400' : 'fill-indigo-500/20 stroke-indigo-400/60'} shadow`} />
                      <text x="0" y="2.5" textAnchor="middle" className={`${isLight ? 'fill-indigo-900 font-bold' : 'fill-indigo-300'} text-[5.5px] font-bold`}>origin/main</text>
                    </g>
                  </g>
                ) : (
                  <g className="opacity-30">
                    <circle cx="185" cy="40" r="11" className={`${isLight ? 'stroke-slate-300 animate-pulse' : 'stroke-slate-800'} fill-none stroke-2 stroke-dashed`} />
                    <text x="185" y="43" textAnchor="middle" className={`${isLight ? 'fill-slate-400' : 'fill-slate-700'} text-[7.5px]`}>C3</text>
                  </g>
                )}
              </svg>
            </div>

            {remoteContainsC3 ? (
              <div className={`text-[7.5px] font-mono text-center rounded py-1 font-bold flex items-center justify-center gap-1 animate-pulse ${isLight ? 'bg-indigo-100 text-indigo-850 border border-indigo-300' : 'bg-indigo-550/25 text-indigo-300 border border-indigo-505'}`}>
                <span>🟢 {tone === TranslationTone.ENGLISH ? "origin/main is synced at C3" : "origin/main đã đồng bộ tại C3"}</span>
              </div>
            ) : (
              <div className={`text-[7.5px] font-mono text-center rounded py-1 flex items-center justify-center gap-1 border border-dashed ${isLight ? 'bg-rose-50 text-rose-800 border-rose-350' : 'bg-[#0c1329] text-indigo-300/70 border border-indigo-500/30'}`}>
                <span>🔴 {tone === TranslationTone.ENGLISH ? "origin/main is outdated (at C2)" : "origin/main bị lỗi thời (tại C2)"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Flying Pack Animation overlays */}
        {isFlight && (
          <motion.div
            initial={{ left: "25%", top: "50%", opacity: 0, scale: 0.5 }}
            animate={{ left: "70%", top: "50%", opacity: [0, 1, 1, 0], scale: 1.2 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 flex flex-col items-center gap-1 select-none pointer-events-none animate-bounce"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="text-[7px] font-mono font-bold uppercase tracking-wider">C3 PACK</span>
          </motion.div>
        )}
      </div>
    );
  };
  const renderDivergeVisual = (w: number, h: number) => {
    // Gốc chung: C1(120, 90).
    // Local: L2(240, 50) -> L3(360, 50). Tag: main
    // Remote: R2(240, 130) -> R3(360, 130). Tag: origin/main
    // Step 0: Base line splits at C1. Showing split.
    // Step 1: User works in local sandbox, coworker pushes independently. Paths rẽ hẳn hai bên.
    // Step 2: Fire flashing warning sign in center gap between local L3 and remote R3 showing incompatibilities.
    // Step 3: Git rejects push, flashing alert symbols.

    const showSplit = currentStep >= 0;
    const showForkCommitted = currentStep >= 1;
    const showConflictAlert = currentStep >= 2;
    const isPushRejected = currentStep === 3;

    return (
      <svg className="w-full h-full font-mono" viewBox={`0 0 ${w} ${h}`} referrerPolicy="no-referrer">
        {/* Baseline anchor lines */}
        <line x1="50" y1="90" x2="120" y2="90" className={`${isLight ? 'stroke-slate-300' : 'stroke-slate-700'} stroke-2 fill-none`} />

        {/* Local rẽ top */}
        {showSplit && (
          <path d="M 120 90 Q 180 50 240 50 L 380 50" className="stroke-emerald-500/60 stroke-2 fill-none" />
        )}
        {/* Remote rẽ bottom */}
        {showSplit && (
          <path d="M 120 90 Q 180 130 240 130 L 380 130" className="stroke-rose-500/40 stroke-2 fill-none" />
        )}

        {/* C1 common anchor commit */}
        <g>
          <circle cx="120" cy="90" r="14" className={`stroke-slate-600 ${isLight ? 'fill-slate-100' : 'fill-slate-950'} stroke-2`} />
          <text x="120" y="93.5" textAnchor="middle" className={`${isLight ? 'fill-slate-700 font-bold' : 'fill-slate-400'} font-bold text-[8.5px]`}>C1</text>
          <text x="120" y="118" textAnchor="middle" className={`${isLight ? 'fill-slate-600 font-bold' : 'fill-slate-500'} text-[8px] font-bold`}>
            {tone === TranslationTone.ENGLISH ? "Split Point" : "Điểm chia nhánh"}
          </text>
        </g>

        {/* Local Branch developments */}
        {showForkCommitted && (
          <>
            <g>
              <circle cx="240" cy="50" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
              <text x="240" y="53.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[8.5px]`}>L2</text>
            </g>
            <g>
              <circle cx="360" cy="50" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
              <text x="360" y="53.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-805' : 'fill-emerald-300'} font-bold text-[8.5px]`}>L3</text>
              
              <g transform="translate(360, 22)" className="opacity-95">
                <rect x="-32" y="-5" width="64" height="11" rx="2.5" className={`${isLight ? 'fill-emerald-100/95 stroke-emerald-400 font-bold' : 'fill-emerald-505/15 stroke-emerald-400'}`} />
                <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-805' : 'fill-emerald-355'} font-bold text-[7px]`}>💻 main (local)</text>
              </g>
            </g>
          </>
        )}

        {/* Remote Branch developments */}
        {showForkCommitted && (
          <>
            <g>
              <circle cx="240" cy="130" r="14" className={`stroke-rose-400/50 ${isLight ? 'fill-rose-50/80' : 'fill-slate-950'} stroke-2`} />
              <text x="240" y="133.5" textAnchor="middle" className={`${isLight ? 'fill-rose-800' : 'fill-rose-300/60'} font-bold text-[8.5px]`}>R2</text>
            </g>
            <g>
              <circle cx="360" cy="130" r="14" className={`stroke-rose-450 ${isLight ? 'fill-rose-50' : 'fill-slate-950'} stroke-2`} />
              <text x="360" y="133.5" textAnchor="middle" className={`${isLight ? 'fill-rose-805 font-bold' : 'fill-rose-300'} font-bold text-[8.5px]`}>R3</text>
              
              <g transform="translate(360, 154)" className="opacity-85">
                <rect x="-42" y="-5" width="84" height="11" rx="2.5" className={`${isLight ? 'fill-indigo-100/90 stroke-indigo-405' : 'fill-indigo-505/10 stroke-indigo-404/45'} stroke-dashed`} />
                <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/main</text>
              </g>
            </g>
          </>
        )}

        {/* Warning links */}
        {showConflictAlert && (
          <g>
            <line x1="360" y1="50" x2="360" y2="130" className="stroke-amber-500 stroke-2 stroke-dashed animate-pulse" />
            <g transform="translate(360, 90)" className="animate-bounce">
              <circle cx="0" cy="0" r="15" className={`${isLight ? 'fill-rose-100' : 'fill-rose-950/90'} stroke-rose-500 stroke-2`} />
              <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-rose-800 font-extrabold' : 'fill-rose-300'} font-bold text-[11px]`}>⚡</text>
            </g>
            <text x="360" y="112" textAnchor="middle" className={`${isLight ? 'fill-rose-800 font-black' : 'fill-amber-400'} text-[8px] font-bold font-mono`}>
              {tone === TranslationTone.ENGLISH ? "DIVERGED (SPLIT PATH)" : "BỊ LỆCH NHÁNH (SPLIT PATH)"}
            </text>
          </g>
        )}

        {/* Push Denied shield */}
        {isPushRejected && (
          <g transform="translate(480, 90)" className="animate-zoomIn">
            <rect x="-60" y="-30" width="120" height="60" rx="6" className={`${isLight ? 'fill-rose-50 border-rose-300 shadow-md stroke-rose-400' : 'fill-rose-950/90 border-rose-500/40 stroke-rose-500'} stroke-2`} />
            <text x="0" y="-12" textAnchor="middle" className={`${isLight ? 'fill-rose-850 font-black' : 'fill-rose-400'} text-[9px] font-bold`}>
              {tone === TranslationTone.ENGLISH ? "PUSH REJECTED!" : "PUSH BỊ TỪ CHỐI!"}
            </text>
            <text x="0" y="4" textAnchor="middle" className={`${isLight ? 'fill-slate-700 font-bold' : 'fill-slate-300'} text-[7.5px] font-mono leading-normal`}>
              {tone === TranslationTone.ENGLISH ? "Cannot Fast-Forward" : "Không thể Fast-Forward"}
            </text>
            <text x="0" y="18" textAnchor="middle" className={`${isLight ? 'fill-amber-805 font-bold' : 'fill-amber-450'} text-[7px] font-mono leading-normal font-bold`}>
              {tone === TranslationTone.ENGLISH ? "Merge/Rebase Needed" : "Cần Merge hoặc Rebase"}
            </text>
          </g>
        )}
      </svg>
    );
  };

  // FAST FORWARD
  const renderFastForwardVisual = (w: number, h: number) => {
    // Baseline: M1(100, 90) -> M2(220, 90). Tag: master
    // Feature branch sprouts on ahead L3(340, 90) -> L4(460, 90)
    // Step 0: Straight path. master pointer sitting at M2.
    // Step 1: Git scanning the track to see if anyone intervened
    // Step 2: Slide the master tag smoothly forward to M4 along the horizontal track.
    // Step 3: Fully synced pointer representation.

    let masterTagX = 220;
    let labelText = "💻 main";
    let highlightCircle = false;
    let guidePathColor = isLight ? "stroke-slate-300" : "stroke-slate-800";

    if (currentStep === 1) { // Scanning
      highlightCircle = true;
      guidePathColor = isLight ? "stroke-indigo-400 animate-pulse" : "stroke-indigo-500/50 animate-pulse";
    } else if (currentStep === 2) { // Sliding
      masterTagX = 340;
      labelText = tone === TranslationTone.ENGLISH ? "💻 main (sliding...)" : "💻 main (đang trượt...)";
    } else if (currentStep === 3) { // Completed
      masterTagX = 460;
      labelText = tone === TranslationTone.ENGLISH ? "💻 main (local HEAD)" : "💻 main (HEAD cá nhân)";
    }

    return (
      <svg className="w-full h-full font-mono" viewBox={`0 0 ${w} ${h}`} referrerPolicy="no-referrer">
        {/* Horizontal linear track */}
        <line x1="50" y1="90" x2="520" y2="90" className="stroke-emerald-500/60 stroke-2" />
        
        {/* Connection pipeline helper guides */}
        <line x1="220" y1="90" x2={masterTagX} y2="90" className={`stroke-2 stroke-dashed ${guidePathColor}`} />

        {/* Remote tracking main pointer: always stays at M2 since Fast-Forward is a local merge */}
        {currentStep < 2 ? (
          <g transform="translate(220, 16)" className="opacity-80">
            <rect x="-38" y="-5" width="76" height="11" rx="2" className={`${isLight ? 'fill-indigo-100/90 stroke-indigo-405 font-semibold' : 'fill-indigo-505/10 stroke-indigo-404/40'} stroke-dashed`} />
            <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/main</text>
            <line x1="0" y1="6" x2="0" y2="58" className="stroke-indigo-400/30 stroke-dashed" />
          </g>
        ) : (
          <g transform="translate(220, 35)" className="opacity-80">
            <rect x="-38" y="-5" width="76" height="11" rx="2" className={`${isLight ? 'fill-indigo-100/90 stroke-indigo-405 font-semibold' : 'fill-indigo-550/10 stroke-indigo-400/40'} stroke-dashed`} />
            <text x="0" y="3" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} text-[6.5px] font-mono`}>☁️ origin/main</text>
            <line x1="0" y1="6" x2="0" y2="40" className="stroke-indigo-400/30 stroke-dashed" />
          </g>
        )}

        {/* Commit Nodes */}
        <g>
          <circle cx="100" cy="90" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
          <text x="100" y="94" textAnchor="middle" className={`${isLight ? 'fill-emerald-800' : 'fill-emerald-300'} font-bold text-[8.5px]`}>M1</text>
        </g>

        <g>
          <circle cx="220" cy="90" r="14" className={`stroke-emerald-400 ${isLight ? 'fill-emerald-50' : 'fill-slate-950'} stroke-2`} />
          <text x="220" y="94" textAnchor="middle" className={`${isLight ? 'fill-emerald-805' : 'fill-emerald-300'} font-bold text-[8.5px]`}>M2</text>
          
          <g transform="translate(220, 126)">
            <rect x="-24" y="-5" width="48" height="12" rx="2.5" className={`${isLight ? 'fill-emerald-100/80 stroke-emerald-300 font-semibold' : 'fill-emerald-505/10 stroke-emerald-500/30'}`} />
            <text x="0" y="3.5" textAnchor="middle" className={`${isLight ? 'fill-emerald-805' : 'fill-emerald-400'} text-[7px] font-bold`}>
              {tone === TranslationTone.ENGLISH ? "split base" : "gốc chia nhánh"}
            </text>
          </g>
        </g>

        <g>
          <circle cx="340" cy="90" r="14" className={`stroke-indigo-400 ${isLight ? 'fill-indigo-50' : 'fill-slate-950'} stroke-2`} />
          <text x="340" y="94" textAnchor="middle" className={`${isLight ? 'fill-indigo-805 font-bold' : 'fill-indigo-300'} font-bold text-[8.5px]`}>M3</text>
        </g>

        <g>
          <circle cx="460" cy="90" r="15" className={`stroke-2 transition-all ${highlightCircle ? (isLight ? 'stroke-indigo-500 fill-indigo-110 animate-pingScale' : 'stroke-indigo-400 fill-indigo-950/20 animate-pingScale') : (`stroke-indigo-455 ${isLight ? 'fill-indigo-50' : 'fill-slate-950'}`)}`} />
          <text x="460" y="94" textAnchor="middle" className={`${isLight ? 'fill-indigo-850' : 'fill-indigo-300'} font-bold text-[8.5px]`}>M4</text>
          <text x="460" y="126" textAnchor="middle" className={`${isLight ? 'fill-indigo-700 font-bold' : 'fill-indigo-400'} text-[8px] font-bold`}>
            {tone === TranslationTone.ENGLISH ? "Feature Head" : "Đầu nhánh Feature"}
          </text>
        </g>

        {/* Sliding pointer master */}
        <g transform={`translate(${masterTagX}, 35)`} className="transition-all duration-1000 ease-in-out opacity-90">
          <rect x="-42" y="-6" width="84" height="14" rx="2.5" className={`${isLight ? 'fill-indigo-100 border border-indigo-400 font-bold' : 'fill-indigo-502/20 stroke stroke-indigo-400'} shadow-md animate-pulse`} />
          <text x="0" y="4" textAnchor="middle" className={`${isLight ? 'fill-indigo-850' : 'fill-indigo-300'} text-[8px] font-bold truncate`}>{labelText}</text>
          <line x1="0" y1="8" x2="0" y2="40" className="stroke-indigo-400/50 stroke-dashed" />
        </g>
      </svg>
    );
  };

  if (isCollapsed) {
    return (
      <div id="visualizer-panel-collapsed" className={`border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-900 text-slate-305'}`}>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Tv className="w-4 h-4 text-indigo-400" />
          <span className="font-bold uppercase tracking-wider">{loc.title}</span>
          <span className="text-[10px] text-slate-500 opacity-60">
            ({tone === TranslationTone.ENGLISH ? 'Hidden' : 'Đang ẩn'})
          </span>
        </div>
        <button
          onClick={toggleCollapse}
          className={`p-1.5 rounded cursor-pointer border shrink-0 flex items-center justify-center transition-all ${
            isLight
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-[#1e293b] border-indigo-505/20 text-indigo-400 hover:text-indigo-303'
          }`}
          title={tone === TranslationTone.ENGLISH ? 'Show' : 'Hiển thị'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div id="interactive-git-flow-visualizer" className={`border rounded-xl p-5 shadow-lg flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-800 text-slate-300'
    }`}>
      
      {/* Decorative absolute element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-xl pointer-events-none" />

      {/* Header section with status triggers */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-3.5 ${
        isLight ? 'border-slate-100' : 'border-slate-850/60'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${
            isLight ? 'bg-indigo-50 border-indigo-150' : 'bg-indigo-500/15 border-indigo-500/20'
          }`}>
            <Tv className={`w-4 h-4 animate-pulse ${isLight ? 'text-indigo-650' : 'text-indigo-400'}`} />
          </div>
          <div>
            <h3 className={`text-xs font-bold uppercase font-mono tracking-wider ${
              isLight ? 'text-slate-802' : 'text-slate-105'
            }`}>
              {loc.title}
            </h3>
            <p className={`text-[10px] mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-450'
            }`}>
              {loc.subtitle}
            </p>
          </div>
        </div>

        {/* Action Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex flex-wrap gap-1 w-full md:w-auto">
            {(['rebase', 'stash', 'merge', 'commit', 'push', 'diverge', 'fast-forward'] as VisualActionType[]).map((action) => {
              const isSelected = activeAction === action && isSimulation;
              return (
                <button
                  key={action}
                  id={`git-vis-tab-${action}`}
                  onClick={() => handleActionChange(action)}
                  className={`px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-650 border-indigo-500 text-white shadow-md shadow-indigo-605/20' 
                      : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:text-slate-800'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  } ${!isSimulation ? 'opacity-50 hover:opacity-100' : ''}`}
                  title={!isSimulation ? (tone === TranslationTone.ENGLISH ? 'Click to switch to simulation mode for this diagram' : 'Click để chuyển sang chế độ giả lập xem sơ đồ này') : ''}
                >
                  {loc.opLabels[action]}
                </button>
              );
            })}

            {/* Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className={`p-1.5 rounded transition-all text-xs flex items-center justify-center font-mono cursor-pointer border shrink-0 ${
                isLight 
                  ? 'bg-slate-100 border-slate-250 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                  : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-305'
              }`}
              title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
            >
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Main playground stage with interactive visual and controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Play stage display area (Left - col span 8) */}
        <div className={`lg:col-span-8 flex flex-col gap-3 justify-center min-h-[260px] rounded-xl p-4 overflow-hidden relative border ${
          isLight ? 'bg-indigo-50/20 border-indigo-100/60' : 'bg-slate-950/70 border-slate-905/60'
        }`}>
          
          {/* Active play indicators */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 select-none z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border rounded ${
                isLight ? 'text-slate-600 bg-white border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'
              }`}>
                {loc.opLabels[activeAction]}
              </span>
            </div>
            <div className={`text-[8px] font-medium font-sans flex items-center gap-1 px-1.5 py-0.5 rounded border ${
              isLight ? 'text-slate-500 bg-slate-50/80 border-slate-200' : 'text-slate-400 bg-slate-900/40 border-slate-900/60'
            }`}>
              <Move className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              <span>{tone === TranslationTone.ENGLISH ? 'Drag workspace to pan' : 'Kéo màn hình để di chuyển'}</span>
            </div>

            {/* Level of Detail Mode Controls */}
            <div className={`mt-1.5 px-2 py-1.5 rounded-lg border flex flex-col gap-1 items-start shadow-sm max-w-[170px] ${
              isLight ? 'bg-white border-slate-200 shadow-slate-100' : 'bg-slate-950/90 border-slate-800/80'
            }`}>
              <div className="flex items-center gap-1 text-[7.5px] font-bold font-mono tracking-widest text-slate-400 uppercase select-none">
                <Layers className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                <span>{tone === TranslationTone.ENGLISH ? "Level of Detail" : "Độ chi tiết sơ đồ"}</span>
              </div>
              <div className={`flex items-center gap-1 w-full p-0.5 rounded border ${
                isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-slate-900/40 border-slate-850'
              }`}>
                {(['auto', 'compact', 'detailed'] as const).map((mode) => {
                  const isActive = compactModeSetting === mode;
                  let label = 'Auto';
                  if (mode === 'compact') label = tone === TranslationTone.ENGLISH ? 'Compact' : 'Rút gọn';
                  if (mode === 'detailed') label = tone === TranslationTone.ENGLISH ? 'Details' : 'Chi tiết';
                  
                  return (
                    <button
                      key={mode}
                      onClick={() => setCompactModeSetting(mode)}
                      className={`text-[7.5px] font-bold font-mono flex-1 px-1 py-0.5 rounded text-center cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow'
                          : isLight 
                            ? 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/50' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="text-[7.5px] font-sans font-medium flex items-center gap-1 select-none">
                <span className={`w-1 h-1 rounded-full ${isCompactActive ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>
                  {isCompactActive 
                    ? (tone === TranslationTone.ENGLISH ? "Showing Compact (linear hidden)" : "Đang hiện rút gọn sơ đồ")
                    : (tone === TranslationTone.ENGLISH ? "Showing Details (full history)" : "Đang hiện chi tiết")}
                </span>
              </div>
            </div>
          </div>

          <div className={`absolute top-3 right-3 flex items-center gap-1.5 select-none text-[8.5px] font-mono font-bold border rounded px-2 py-0.5 z-20 ${
            isLight ? 'text-slate-600 bg-white border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'
          }`}>
            <span>STEP {currentStep + 1} / {totalSteps}</span>
          </div>

          {/* Active SVG dynamic stage area */}
          <div 
            ref={setStageContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1 w-full h-full min-h-[230px] overflow-hidden relative flex items-center justify-center pt-8 pb-2 cursor-grab active:cursor-grabbing"
          >
            <motion.div
              key={`vis-board-${resetKey}`}
              drag
              dragConstraints={false}
              dragElastic={0.15}
              dragMomentum={true}
              style={{
                scale: visScale * autoFitScale,
                width: `${stageW}px`,
                height: `${stageH}px`,
                transformOrigin: "center center"
              }}
              className="flex items-center justify-center touch-none select-none shrink-0"
            >
              {renderVisualStage()}
            </motion.div>
          </div>

          {/* Vertical map-style Pan/Zoom Controls securely anchored at top right under the step badge to prevent any element overlapping */}
          <div className="absolute top-[34px] right-3 flex flex-col items-center gap-1.5 z-25 select-none animate-fade-in animate-duration-300">
            <div className={`p-1 py-1.5 rounded-lg border flex flex-col items-center gap-1.5 shadow-xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0a0d18]/95 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setVisScale(s => {
                  let step = 0.1;
                  if (s >= 5.0) step = 1.0;
                  else if (s >= 1.5) step = 0.5;
                  return Math.min(15.0, Math.round((s + step) * 10) / 10);
                })}
                className={`p-1 rounded transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-450 hover:text-slate-200'
                }`}
                title="Phóng to (+)"
              >
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              
              <span className={`text-[8px] font-bold font-mono px-0.5 text-center min-w-[28px] ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {Math.round(visScale * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setVisScale(s => {
                  let step = 0.1;
                  if (s > 5.0) step = 1.0;
                  else if (s > 1.5) step = 0.5;
                  return Math.max(0.4, Math.round((s - step) * 10) / 10);
                })}
                className={`p-1 rounded transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-450 hover:text-slate-200'
                }`}
                title="Thu nhỏ (-)"
              >
                <ZoomOut className="w-3.5 h-3.5 text-rose-400" />
              </button>

              <div className={`w-3.5 h-[1px] ${isLight ? 'bg-slate-150' : 'bg-slate-800/80'}`} />

              {/* Autoplay / Pause & Continue Control */}
              <button
                type="button"
                id="btn-vis-play-pause-floating"
                onClick={() => {
                  if (isSyncedWithWizard) {
                    setIsSyncedWithWizard(false);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(p => !p);
                  }
                }}
                className={`p-1.5 rounded transition-all cursor-pointer hover:scale-110 active:scale-90 flex items-center justify-center ${
                  isPlaying
                    ? 'text-amber-505 hover:text-amber-400'
                    : 'text-emerald-505 hover:text-emerald-400'
                } ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-900'}`}
                title={isPlaying ? (tone === TranslationTone.ENGLISH ? "Pause simulation" : "Tạm dừng giả lập") : (tone === TranslationTone.ENGLISH ? "Continue simulation" : "Tiếp tục chạy giả lập")}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <div className={`w-3.5 h-[1px] ${isLight ? 'bg-slate-150' : 'bg-slate-800/80'}`} />

              <button
                type="button"
                onClick={() => {
                  setVisScale(1.0);
                  setResetKey(prev => prev + 1);
                }}
                className={`p-1 rounded transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 text-indigo-400 hover:text-indigo-300 ${
                  isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900'
                }`}
                title="Đặt lại vị trí (Reset Workspace)"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
              </button>
            </div>
          </div>

          {/* Differentiate local & remote-tracking branches legend */}
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-mono border-t pt-2.5 pb-0.5 opacity-90 select-none ${
            isLight ? 'border-slate-100 text-slate-600' : 'border-slate-900/85 text-slate-300'
          }`}>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">{loc.legendLabel}</span>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-400"></span>
              <span className={`font-medium ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>{loc.localBranchLegend}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-2.5 rounded bg-indigo-500/10 border border-dashed border-indigo-400/80"></span>
              <span className={`font-medium ${isLight ? 'text-indigo-600' : 'text-indigo-300'}`}>{loc.remoteBranchLegend}</span>
            </div>
          </div>

          {/* Player controls */}
          <div className={`flex items-center justify-between border-t pt-3 mt-1 px-1.5 ${
            isLight ? 'border-slate-100' : 'border-slate-900/80'
          }`}>
            <div className="flex items-center gap-1.5">
              <button
                id="btn-vis-prev"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={loc.prevStepBtn}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                id="btn-vis-next"
                onClick={handleNextStep}
                disabled={currentStep === totalSteps - 1}
                className={`p-1.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={loc.nextStepBtn}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 animate-fade-in">
              {wizard && (
                <div className={`p-0.5 rounded-lg border flex items-center shadow-sm select-none ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                  {/* Real Git Sync Toggle Button */}
                  <button
                    type="button"
                    id="btn-vis-sync-toggle-footer"
                    onClick={() => {
                      setIsSyncedWithWizard(true);
                      setIsPlaying(false);
                    }}
                    className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      isSyncedWithWizard
                        ? isLight
                          ? 'bg-white text-indigo-650 shadow-sm border border-slate-250/50 font-semibold'
                          : 'bg-indigo-600/35 text-indigo-300 border border-indigo-500/25'
                        : 'text-slate-400 hover:text-indigo-400'
                    }`}
                    title={tone === TranslationTone.ENGLISH ? 'Sync with Git Repo' : 'Đồng bộ với Git thực tế'}
                  >
                    <Link className="w-3.5 h-3.5" />
                  </button>
                  {/* Simulate Mode Toggle Button */}
                  <button
                    type="button"
                    id="btn-vis-simulate-toggle-footer"
                    onClick={() => {
                      setIsSyncedWithWizard(false);
                      if (currentStep >= totalSteps - 1) {
                        setCurrentStep(0);
                      }
                      setIsPlaying(true);
                    }}
                    className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      !isSyncedWithWizard
                        ? isLight
                          ? 'bg-white text-emerald-650 shadow-sm border border-slate-250/50 font-semibold'
                          : 'bg-emerald-600/35 text-emerald-300 border border-emerald-500/25'
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                    title={tone === TranslationTone.ENGLISH ? 'Playground Simulation' : 'Sa bàn Giả lập'}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                id="btn-vis-reset"
                onClick={handleReset}
                disabled={isSyncedWithWizard}
                className={`p-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={loc.resetBtn}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic active step descriptions (Right - col span 4) */}
        <div className={`lg:col-span-4 flex flex-col justify-between gap-3 p-4 border rounded-xl relative overflow-hidden ${
          isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-850 bg-slate-900/20'
        }`}>
          
          <div className="flex flex-col gap-3">
            <h4 className={`text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${
              isLight ? 'text-slate-500' : 'text-slate-450'
            }`}>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>{loc.explanationTitle.replace('{step}', String(currentStep + 1))}</span>
            </h4>

            {/* Simulated Live narration with animation */}
            <div className="min-h-[85px] py-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeAction}-${currentStep}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`text-xs leading-relaxed font-sans font-medium ${
                    isLight ? 'text-slate-700' : 'text-slate-200'
                  }`}
                >
                  {loc.opDescriptions[activeAction][currentStep] || "Scanning state logs..."}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Under the hood technical references */}
            <div className={`border-t pt-2.5 ${
              isLight ? 'border-slate-200/60' : 'border-slate-900/80'
            }`}>
              <span className={`text-[9px] font-mono font-bold tracking-wider block mb-1 ${
                isLight ? 'text-violet-700' : 'text-violet-400'
              }`}>
                {loc.underTheHoodLabel}
              </span>
              <p className={`text-[10px] leading-relaxed font-sans font-medium ${
                isLight ? 'text-slate-650' : 'text-slate-400'
              }`}>
                {loc.opUnderTheHood[activeAction]}
              </p>
            </div>
          </div>

          {/* Expected final outcome brief */}
          <div className={`rounded-lg p-2.5 border mt-2 ${
            isLight ? 'bg-indigo-50/40 border-indigo-100/60' : 'bg-indigo-950/20 border-indigo-505/10'
          }`}>
            <span className={`text-[9px] font-mono font-bold tracking-wider block mb-0.5 ${
              isLight ? 'text-indigo-700' : 'text-indigo-400'
            }`}>
              {loc.expectedResultLabel}
            </span>
            <p className={`text-[10px] font-sans font-medium leading-relaxed ${
              isLight ? 'text-indigo-800' : 'text-indigo-300'
            }`}>
              {loc.opResult[activeAction]}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
