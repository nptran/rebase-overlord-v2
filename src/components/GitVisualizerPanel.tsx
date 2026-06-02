/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { TranslationTone, WizardState } from '../types';

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
  theme = 'dark'
}: { 
  tone: TranslationTone; 
  wizard?: WizardState; 
  theme?: 'light' | 'dark';
}) {
  const isLight = theme === 'light';
  const [activeAction, setActiveAction] = useState<VisualActionType>('rebase');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncedWithWizard, setIsSyncedWithWizard] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const togglePlay = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Render nodes based on step and action type
  const renderVisualStage = () => {
    const width = 600;
    const height = 180;

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

    let f1X = 200, f1Y = 120, f1Color = 'stroke-amber-400 fill-slate-900', f1Label = 'F1';
    let f2X = 300, f2Y = 120, f2Color = 'stroke-amber-400 fill-slate-900', f2Label = 'F2';
    let f1Opacity = 1;
    let f2Opacity = 1;
    let baseLineEnd = 300;
    let featureLineEnd = 300;
    let showTempLines = true;
    let basePointX = 100;

    if (currentStep === 1) { // Detach
      f1Y = 140; f1Opacity = 0.55; f1Color = 'stroke-amber-400/50 fill-slate-900/40 dashed';
      f2Y = 140; f2Opacity = 0.55; f2Color = 'stroke-amber-400/50 fill-slate-900/40 dashed';
      showTempLines = false;
    } else if (currentStep === 2) { // Shifting Base
      f1Y = 150; f1Opacity = 0.2;
      f2Y = 150; f2Opacity = 0.2;
      showTempLines = false;
      basePointX = 300; // Pointer moves to M3
    } else if (currentStep === 3) { // F1 Reapplied
      f1X = 400; f1Y = 60; f1Color = 'stroke-indigo-400 fill-indigo-950/40'; f1Label = "F1' (SHA*)";
      f2Y = 140; f2Opacity = 0.4;
      showTempLines = false;
      baseLineEnd = 400;
      basePointX = 300;
    } else if (currentStep === 4) { // F2 Reapplied
      f1X = 400; f1Y = 60; f1Color = 'stroke-indigo-400 fill-indigo-950/40'; f1Label = "F1' (New)";
      f2X = 500; f2Y = 60; f2Color = 'stroke-indigo-400 fill-indigo-950/40'; f2Label = "F2' (New)";
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
            <path d="M 100 60 Q 150 120 200 120" className="stroke-slate-700 stroke-2 fill-none stroke-dashed" />
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
            <circle cx={n.x} cy={n.y} r="16" className="stroke-emerald-400 fill-slate-950 stroke-2" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="fill-emerald-300 font-bold font-mono text-[9px]">{n.id}</text>
            {n.id === 'M3' ? (
              <g>
                {/* Local develop branch tag */}
                <g transform="translate(300, -18)" className="opacity-95">
                  <rect x="-34" y="-5" width="68" height="11" rx="2.5" className="fill-emerald-500/15 stroke stroke-emerald-400" />
                  <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[7px]">💻 develop</text>
                </g>
                {/* Remote tracking develop branch tag */}
                <g transform="translate(300, -32)" className="opacity-80">
                  <rect x="-42" y="-5" width="84" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
                  <text x="0" y="3.5" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/develop</text>
                </g>
              </g>
            ) : (
              <text x={n.x} y={n.y - 22} textAnchor="middle" className="fill-slate-500 text-[8px]">{n.label}</text>
            )}
          </g>
        ))}

        {/* Feature commit F1 */}
        <g opacity={f1Opacity} className="transition-all duration-700">
          <circle cx={f1X} cy={f1Y} r="16" className={`${f1Color} stroke-2`} />
          <text x={f1X} y={f1Y + 4} textAnchor="middle" className="fill-amber-300 font-bold font-mono text-[9px]">{f1Label}</text>
          {currentStep < 3 && <text x={f1X} y={f1Y + 26} textAnchor="middle" className="fill-amber-500/60 text-[8px]">feature local commit</text>}
        </g>

        {/* Feature commit F2 */}
        <g opacity={f2Opacity} className="transition-all duration-700">
          <circle cx={f2X} cy={f2Y} r="16" className={`${f2Color} stroke-2`} />
          <text x={f2X} y={f2Y + 4} textAnchor="middle" className="fill-amber-300 font-bold font-mono text-[9px]">{f2Label}</text>
        </g>

        {/* Pointers & Markers label */}
        {currentStep < 3 ? (
          <g transform={`translate(${f2X}, ${f2Y - 32})`} className="opacity-90">
            <rect x="-44" y="-6" width="88" height="15" rx="3" className="fill-amber-500/10 stroke stroke-amber-500/30" />
            <text x="0" y="4" textAnchor="middle" className="fill-amber-400 text-[8.5px] font-bold">💻 feature (local)</text>
            <line x1="0" y1="9" x2="0" y2="16" className="stroke-amber-400/50" />
          </g>
        ) : (
          <g transform={`translate(${f2X}, ${f2Y - 32})`} className="opacity-90 transition-all duration-500">
            <rect x="-48" y="-6" width="96" height="15" rx="3" className="fill-indigo-500/20 stroke stroke-indigo-400" />
            <text x="0" y="4" textAnchor="middle" className="fill-indigo-300 text-[8.5px] font-bold">💻 feature (local HEAD)</text>
            <line x1="0" y1="9" x2="0" y2="16" className="stroke-indigo-400/50" />
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

    let file1X = 130, file1Y = 40, file1Opacity = 1, file1Color = 'bg-rose-500/15 border-rose-400 text-rose-300';
    let file2X = 230, file2Y = 40, file2Opacity = 1, file2Color = 'bg-rose-500/15 border-rose-400 text-rose-300';
    let cleanIndicatorColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    let cleanText = "DIRTY WORKING DIRECTORY";
    let stashBoxHighlight = "border-slate-800 bg-[#0d1324]/50";

    if (currentStep === 1) { // Bundled
      file1Color = 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse';
      file2Color = 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse';
    } else if (currentStep === 2) { // Falling into shelf
      file1X = 420; file1Y = 100; file1Opacity = 0.3; file1Color = 'bg-indigo-500/20 border-indigo-400 text-indigo-400 scale-75';
      file2X = 420; file2Y = 120; file2Opacity = 0.3; file2Color = 'bg-indigo-500/20 border-indigo-400 text-indigo-400 scale-75';
      stashBoxHighlight = "border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/10";
    } else if (currentStep === 3) { // Clean working directory
      file1Opacity = 0;
      file2Opacity = 0;
      cleanIndicatorColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      cleanText = "✓ PRISTINE & CLEAN WORKSPACE";
      stashBoxHighlight = "border-slate-700 bg-slate-900/60";
    } else if (currentStep === 4) { // Pop back
      file1X = 140; file1Y = 50; file1Opacity = 1; file1Color = 'bg-teal-500/20 border-teal-400 text-teal-300 animate-bounce';
      file2Opacity = 0; // Pop pop single item shown
      cleanIndicatorColor = 'bg-teal-500/10 text-teal-300 border-teal-500/20';
      cleanText = "STASH POP REAPPLIED";
    }

    return (
      <div className="w-full h-full relative" id="stash-stage">
        {/* Working Sandbox area */}
        <div className="absolute left-6 top-8 w-[280px] h-[110px] rounded-xl border border-dashed border-slate-800 flex flex-col justify-between p-3 bg-slate-950/30 select-none">
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
            <ArrowRight className={`w-5 h-5 ${currentStep === 2 ? 'text-indigo-400 animate-bounce' : 'text-slate-800'}`} />
          </div>
        </div>

        {/* Cabinet shelf represents Stash Stack */}
        <div className={`absolute right-6 top-8 w-[200px] h-[110px] rounded-xl border p-3 flex flex-col justify-between transition-all duration-500 ${stashBoxHighlight}`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">STASH STACK</span>
            <span className="text-[8px] font-mono bg-indigo-505/20 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-500/20 font-bold">refs/stash</span>
          </div>

          {/* Stashed blocks shelf items */}
          <div className="flex flex-col gap-1.5 py-1 select-none">
            {currentStep >= 2 ? (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded p-1 text-[8.5px] text-indigo-300 font-mono flex items-center justify-between shadow-sm">
                <span>📦 stash@{"{0}"}: "Work in progress"</span>
                <span className="text-[7.5px] text-indigo-400 font-semibold px-1 bg-indigo-950/50 rounded font-mono">1 commit</span>
              </div>
            ) : (
              <div className="text-slate-700 text-center text-[9px] py-2 italic font-mono">Empty stash shelf</div>
            )}
            <div className="h-0.5 bg-slate-800 w-full mt-1.5 rounded opacity-40"></div>
          </div>

          <div className="text-[8.5px] font-mono text-slate-500 text-center">
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
          <circle cx="100" cy="50" r="16" className={`stroke-2 transition-all ${isAncestorHot ? 'stroke-purple-400 fill-purple-950/50 animate-pingScale' : 'stroke-emerald-400 fill-slate-950'}`} />
          <circle cx="100" cy="50" r="14" className="fill-slate-950 stroke-slate-800" />
          <text x="100" y="54" textAnchor="middle" className={`font-bold text-[9px] ${isAncestorHot ? 'fill-purple-300' : 'fill-emerald-300'}`}>M1</text>
          <text x="100" y="24" textAnchor="middle" className="fill-slate-500 text-[8px]">{isAncestorHot ? '🔮 Common Ancestor' : 'M1 Baseline'}</text>
        </g>

        {/* M2 & M3 nodes */}
        <g>
          <circle cx="200" cy="50" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
          <text x="200" y="54" textAnchor="middle" className="fill-emerald-300 font-bold text-[9px]">M2</text>
        </g>
        <g>
          <circle cx="300" cy="50" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
          <text x="300" y="54" textAnchor="middle" className="fill-emerald-300 font-bold text-[9px]">M3</text>
          
          {currentStep < 3 ? (
            <g>
              {/* Local master pointer tag on M3 */}
              <g transform="translate(300, 16)" className="opacity-95">
                <rect x="-28" y="-5" width="56" height="11" rx="2.5" className="fill-emerald-500/15 stroke stroke-emerald-400" />
                <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-350 font-bold text-[7px]">💻 master</text>
              </g>
              {/* Remote tracking origin/master tag on M3 */}
              <g transform="translate(300, -18)" className="opacity-80">
                <rect x="-38" y="-5" width="76" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
                <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/master</text>
              </g>
            </g>
          ) : (
            <g>
              {/* After merge, local master moves to M4 but remote tracker stays at M3! */}
              <g transform="translate(300, 16)" className="opacity-85">
                <rect x="-38" y="-5" width="76" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
                <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/master</text>
              </g>
            </g>
          )}
        </g>

        {/* F1 & F2 nodes */}
        <g>
          <circle cx="200" cy="130" r="14" className="stroke-amber-400 fill-slate-950 stroke-2" />
          <text x="200" y="134" textAnchor="middle" className="fill-amber-300 font-bold text-[9px]">F1</text>
        </g>
        <g>
          <circle cx="300" cy="130" r="14" className="stroke-amber-400 fill-slate-950 stroke-2" />
          <text x="300" y="134" textAnchor="middle" className="fill-amber-300 font-bold text-[9px]">F2</text>
          
          {/* Local feature branch pointer tag */}
          <g transform="translate(300, 162)" className="opacity-95">
            <rect x="-30" y="-5" width="60" height="11" rx="2.5" className="fill-amber-500/15 stroke stroke-amber-500/40" />
            <text x="0" y="3.5" textAnchor="middle" className="fill-amber-300 font-bold text-[7px]">💻 feature</text>
          </g>
        </g>

        {/* Spawned Merge commit node */}
        {currentStep >= 3 && (
          <g className="transition-all duration-700">
            <circle cx="420" cy="90" r="18" className="stroke-indigo-400 fill-indigo-950 border stroke-2 animate-bounce" />
            <text x="420" y="93" textAnchor="middle" className="fill-indigo-300 font-bold text-[8.5px]">M4</text>
            <text x="420" y="122" textAnchor="middle" className="fill-indigo-400 text-[8px] font-bold">Merge Commit</text>
            
            {/* Merged master branch tag - local master advanced to M4 */}
            <g transform={`translate(420, 24)`}>
              <rect x="-38" y="-6" width="76" height="14" rx="3" className="fill-emerald-500/20 stroke stroke-emerald-400" />
              <text x="0" y="4.5" textAnchor="middle" className="fill-emerald-350 text-[7.5px] font-bold">💻 master (local)</text>
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
    let fileColor = currentStep === 1 ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-slate-800/40 border-slate-700 text-slate-300";

    return (
      <div className="w-full h-full relative" id="commit-stage">
        {/* Staging Index Queue */}
        <div className="absolute left-[30px] top-[15px] w-[260px] h-[55px] border border-dashed border-slate-800 rounded-lg p-2 flex flex-col justify-between bg-slate-950/20">
          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Staging Area Index (Index)</span>
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
            <circle cx="110" cy="45" r="14" className="stroke-indigo-400 fill-slate-950 stroke-2" />
            <text x="110" y="49" textAnchor="middle" className="fill-indigo-300 font-bold text-[8.5px]">C1</text>
          </g>

          <g>
            <circle cx="220" cy="45" r="14" className="stroke-indigo-400 fill-slate-950 stroke-2" />
            <text x="220" y="49" textAnchor="middle" className="fill-indigo-300 font-bold text-[8.5px]">C2</text>
            {currentStep < 3 ? (
              <g>
                {/* Local branch pointer tag at C2 */}
                <g transform="translate(220, 14)" className="opacity-95">
                  <rect x="-24" y="-5" width="48" height="11" rx="2.5" className="fill-emerald-500/15 stroke stroke-emerald-400" />
                  <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[7px]">💻 main</text>
                </g>
                {/* Remote tracking branch tag at C2 */}
                <g transform="translate(220, -18)" className="opacity-80">
                  <rect x="-35" y="-5" width="70" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
                  <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/main</text>
                </g>
              </g>
            ) : (
              <g>
                {/* After commit, remote tracking tag stays at C2 */}
                <g transform="translate(220, 14)" className="opacity-85">
                  <rect x="-35" y="-5" width="70" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
                  <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/main</text>
                </g>
              </g>
            )}
          </g>

          {/* Spawning C3 */}
          {currentStep >= 2 && (
            <g className="transition-all duration-500 animate-zoomIn">
              <circle cx="340" cy="45" r="16" className="stroke-emerald-400 fill-emerald-950/20 stroke-2 shadow" />
              <text x="340" y="48.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[8.5px]">C3</text>
              {currentStep === 3 && (
                <g>
                   {/* Local branch pointer tag moves to C3 */}
                   <g transform="translate(340, 14)">
                     <rect x="-24" y="-5" width="48" height="11" rx="2.5" className="fill-emerald-500/15 stroke stroke-emerald-400" />
                     <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[7px]">💻 main</text>
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
      <div className="w-full h-full relative" id="push-stage">
        {/* Local Area & Remote Area Side-by-Side Grid */}
        <div className="grid grid-cols-2 gap-4 h-full relative p-2">
          {/* Local Machine Dashboard */}
          <div className={`rounded-xl border p-3 flex flex-col justify-between ${
            isLight ? 'bg-emerald-50/20 border-emerald-100/60' : 'bg-slate-950/40 border-emerald-950/20'
          }`}>
            <div className="flex items-center justify-between border-b pb-1 mb-1 border-emerald-500/10">
              <span className="text-[8.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider">💻 Local (Client)</span>
              <span className="text-[7.5px] font-mono bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/20">refs/heads/main</span>
            </div>
            
            {/* Local Repository Timeline */}
            <div className="flex-1 flex items-center justify-center min-h-[50px] relative">
              <svg className="w-full h-full font-mono" viewBox="0 0 250 80" referrerPolicy="no-referrer">
                {/* Connection paths */}
                <line x1="30" y1="40" x2="190" y2="40" className="stroke-emerald-500/40 stroke-2" />
                
                {/* Commits */}
                <g>
                  <circle cx="45" cy="40" r="11" className="stroke-emerald-500/60 fill-slate-950 stroke-2" />
                  <text x="45" y="43" textAnchor="middle" className="fill-emerald-400 font-bold text-[7.5px]">C1</text>
                </g>

                <g>
                  <circle cx="115" cy="40" r="11" className="stroke-emerald-500/60 fill-slate-950 stroke-2" />
                  <text x="115" y="43" textAnchor="middle" className="fill-emerald-400 font-bold text-[7.5px]">C2</text>
                </g>

                <g className="animate-zoomIn">
                  <circle cx="185" cy="40" r="13" className="stroke-emerald-400 fill-slate-950 stroke-2" />
                  <text x="185" y="43" textAnchor="middle" className="fill-emerald-300 font-bold text-[7.5px]">C3</text>
                  
                  {/* Local main tag stays at C3 */}
                  <g transform="translate(185, 14)">
                    <rect x="-18" y="-4" width="36" height="9" rx="1.5" className="fill-emerald-500/20 stroke stroke-emerald-400/60" />
                    <text x="0" y="2.5" textAnchor="middle" className="fill-emerald-300 text-[5.5px] font-bold">main</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Packaging status bar */}
            {isPackaging && (
              <div className="text-[7.5px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 rounded py-1 text-center animate-pulse">
                📦 Creating delta payload packs...
              </div>
            )}
            {!isPackaging && !isFlight && (
              <div className={`text-[7.5px] text-center font-mono py-1 rounded border-dashed border ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900/60 text-slate-600'
              }`}>
                Ready to transmit object C3
              </div>
            )}
            {isFlight && (
              <div className="text-[7.5px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 rounded py-1 text-center animate-pulse">
                ⚡ Transmitting Packfile stream...
              </div>
            )}
          </div>

          {/* Remote (Cloud GitHub Server) Area */}
          <div className={`rounded-xl border p-3 flex flex-col justify-between ${
            isLight ? 'bg-indigo-50/20 border-indigo-100/60' : 'bg-slate-950/40 border-indigo-950/20'
          }`}>
            <div className="flex items-center justify-between border-b pb-1 mb-1 border-indigo-500/10">
              <span className="text-[8.5px] font-mono font-bold text-indigo-400 uppercase tracking-wider">☁️ Remote (GitHub Server)</span>
              <span className="text-[7.5px] font-mono bg-indigo-500/10 text-indigo-400 px-1 py-0.2 rounded border border-indigo-500/20">origin/refs/heads/main</span>
            </div>

            {/* Remote Timeline */}
            <div className="flex-1 flex items-center justify-center min-h-[50px] relative">
              <svg className="w-full h-full font-mono" viewBox="0 0 250 80" referrerPolicy="no-referrer">
                {/* Connection line inside Remote */}
                <line x1="30" y1="40" x2={remoteContainsC3 ? "190" : "115"} y2="40" className="stroke-indigo-500/40 stroke-2" />

                <g>
                  <circle cx="45" cy="40" r="11" className="stroke-indigo-455 fill-slate-950 stroke-2" />
                  <text x="45" y="43" textAnchor="middle" className="fill-indigo-300 font-bold text-[7.5px]">C1</text>
                </g>

                <g>
                  <circle cx="115" cy="40" r="11" className="stroke-indigo-455 fill-slate-950 stroke-2" />
                  <text x="115" y="43" textAnchor="middle" className="fill-indigo-300 font-bold text-[7.5px]">C2</text>
                  
                  {!remoteContainsC3 && (
                    <g transform="translate(115, 14)">
                      <rect x="-24" y="-4" width="48" height="9" rx="1.5" className="fill-indigo-500/20 stroke stroke-indigo-400/60 shadow-md animate-pulse" />
                      <text x="0" y="2.5" textAnchor="middle" className="fill-indigo-300 text-[5.5px] font-bold">origin/main</text>
                    </g>
                  )}
                </g>

                {remoteContainsC3 ? (
                  <g className="animate-zoomIn">
                    <circle cx="185" cy="40" r="13" className="stroke-indigo-400 fill-indigo-950 stroke-2 shadow" />
                    <text x="185" y="43" textAnchor="middle" className="fill-indigo-300 font-bold text-[7.5px]">C3</text>
                    
                    <g transform="translate(185, 14)">
                      <rect x="-24" y="-4" width="48" height="9" rx="1.5" className="fill-indigo-500/20 stroke stroke-indigo-400/60 shadow" />
                      <text x="0" y="2.5" textAnchor="middle" className="fill-indigo-300 text-[5.5px] font-bold">origin/main</text>
                    </g>
                  </g>
                ) : (
                  <g className="opacity-30">
                    <circle cx="185" cy="40" r="11" className="stroke-slate-800 fill-none stroke-2 stroke-dashed" />
                    <text x="185" y="43" textAnchor="middle" className="fill-slate-700 text-[7.5px]">C3</text>
                  </g>
                )}
              </svg>
            </div>

            {remoteContainsC3 ? (
              <div className="text-[7.5px] font-mono bg-indigo-550/25 text-indigo-300 border border-indigo-505 text-center rounded py-1 font-bold flex items-center justify-center gap-1 animate-pulse">
                <span>🟢 origin/main is synced at C3</span>
              </div>
            ) : (
              <div className="text-[7.5px] font-mono bg-[#0c1329] text-indigo-300/70 border border-dashed border-indigo-500/30 text-center rounded py-1 flex items-center justify-center gap-1">
                <span>🔴 origin/main is outdated (at C2)</span>
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

  // DIVERGE
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
        <line x1="50" y1="90" x2="120" y2="90" className="stroke-slate-700 stroke-2 fill-none" />

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
          <circle cx="120" cy="90" r="14" className="stroke-slate-600 fill-slate-950 stroke-2" />
          <text x="120" y="93.5" textAnchor="middle" className="fill-slate-400 font-bold text-[8.5px]">C1</text>
          <text x="120" y="118" textAnchor="middle" className="fill-slate-500 text-[8px] font-bold">Split Point</text>
        </g>

        {/* Local Branch developments */}
        {showForkCommitted && (
          <>
            <g>
              <circle cx="240" cy="50" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
              <text x="240" y="53.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[8.5px]">L2</text>
            </g>
            <g>
              <circle cx="360" cy="50" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
              <text x="360" y="53.5" textAnchor="middle" className="fill-emerald-300 font-bold text-[8.5px]">L3</text>
              
              <g transform="translate(360, 22)" className="opacity-95">
                <rect x="-32" y="-5" width="64" height="11" rx="2.5" className="fill-emerald-500/15 stroke stroke-emerald-400" />
                <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-355 font-bold text-[7px]">💻 main (local)</text>
              </g>
            </g>
          </>
        )}

        {/* Remote Branch developments */}
        {showForkCommitted && (
          <>
            <g>
              <circle cx="240" cy="130" r="14" className="stroke-rose-400/50 fill-slate-950 stroke-2" />
              <text x="240" y="133.5" textAnchor="middle" className="fill-rose-300/60 font-bold text-[8.5px]">R2</text>
            </g>
            <g>
              <circle cx="360" cy="130" r="14" className="stroke-rose-450 fill-slate-950 stroke-2" />
              <text x="360" y="133.5" textAnchor="middle" className="fill-rose-300 font-bold text-[8.5px]">R3</text>
              
              <g transform="translate(360, 154)" className="opacity-85">
                <rect x="-42" y="-5" width="84" height="11" rx="2.5" className="fill-indigo-500/10 stroke stroke-indigo-400/45 stroke-dashed" />
                <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/main</text>
              </g>
            </g>
          </>
        )}

        {/* Warning links */}
        {showConflictAlert && (
          <g>
            <line x1="360" y1="50" x2="360" y2="130" className="stroke-amber-500 stroke-2 stroke-dashed animate-pulse" />
            <g transform="translate(360, 90)" className="animate-bounce">
              <circle cx="0" cy="0" r="15" className="fill-rose-950/90 stroke-rose-500 stroke-2" />
              <text x="0" y="3.5" textAnchor="middle" className="fill-rose-300 font-bold text-[11px]">⚡</text>
            </g>
            <text x="360" y="112" textAnchor="middle" className="fill-amber-400 text-[8px] font-bold font-mono">DIVERGED (SPLIT PATH)</text>
          </g>
        )}

        {/* Push Denied shield */}
        {isPushRejected && (
          <g transform="translate(480, 90)" className="animate-zoomIn">
            <rect x="-60" y="-30" width="120" height="60" rx="6" className="fill-rose-950/90 border border-rose-500/40 text-center stroke-rose-500 stroke-2" />
            <text x="0" y="-12" textAnchor="middle" className="fill-rose-400 text-[9px] font-bold">PUSH REJECTED!</text>
            <text x="0" y="4" textAnchor="middle" className="fill-slate-300 text-[7.5px] font-mono leading-normal">Cannot Fast-Forward</text>
            <text x="0" y="18" textAnchor="middle" className="fill-amber-450 text-[7px] font-mono leading-normal font-bold">Merge/Rebase Needed</text>
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
    let guidePathColor = "stroke-slate-800";

    if (currentStep === 1) { // Scanning
      highlightCircle = true;
      guidePathColor = "stroke-indigo-500/50 animate-pulse";
    } else if (currentStep === 2) { // Sliding
      masterTagX = 340;
      labelText = "💻 main (sliding...)";
    } else if (currentStep === 3) { // Completed
      masterTagX = 460;
      labelText = "💻 main (local HEAD)";
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
            <rect x="-38" y="-5" width="76" height="11" rx="2" className="fill-indigo-500/10 stroke stroke-indigo-400/40 stroke-dashed" />
            <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/main</text>
            <line x1="0" y1="6" x2="0" y2="58" className="stroke-indigo-400/30 stroke-dashed" />
          </g>
        ) : (
          <g transform="translate(220, 35)" className="opacity-80">
            <rect x="-38" y="-5" width="76" height="11" rx="2" className="fill-indigo-550/10 stroke stroke-indigo-400/40 stroke-dashed" />
            <text x="0" y="3" textAnchor="middle" className="fill-indigo-300 text-[6.5px] font-mono">☁️ origin/main</text>
            <line x1="0" y1="6" x2="0" y2="40" className="stroke-indigo-400/30 stroke-dashed" />
          </g>
        )}

        {/* Commit Nodes */}
        <g>
          <circle cx="100" cy="90" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
          <text x="100" y="94" textAnchor="middle" className="fill-emerald-300 font-bold text-[8.5px]">M1</text>
        </g>

        <g>
          <circle cx="220" cy="90" r="14" className="stroke-emerald-400 fill-slate-950 stroke-2" />
          <text x="220" y="94" textAnchor="middle" className="fill-emerald-300 font-bold text-[8.5px]">M2</text>
          
          <g transform="translate(220, 126)">
            <rect x="-24" y="-5" width="48" height="12" rx="2.5" className="fill-emerald-500/10 stroke stroke-emerald-500/30" />
            <text x="0" y="3.5" textAnchor="middle" className="fill-emerald-400 text-[7px] font-bold">split base</text>
          </g>
        </g>

        <g>
          <circle cx="340" cy="90" r="14" className="stroke-indigo-400 fill-slate-950 stroke-2" />
          <text x="340" y="94" textAnchor="middle" className="fill-indigo-300 font-bold text-[8.5px]">M3</text>
        </g>

        <g>
          <circle cx="460" cy="90" r="15" className={`stroke-2 transition-all ${highlightCircle ? 'stroke-indigo-400 fill-indigo-950/20' : 'stroke-indigo-450 fill-slate-950'}`} />
          <text x="460" y="94" textAnchor="middle" className="fill-indigo-300 font-bold text-[8.5px]">M4</text>
          <text x="460" y="126" textAnchor="middle" className="fill-indigo-400 text-[8px] font-bold">Feature Head</text>
        </g>

        {/* Sliding pointer master */}
        <g transform={`translate(${masterTagX}, 35)`} className="transition-all duration-1000 ease-in-out opacity-90">
          <rect x="-42" y="-6" width="84" height="14" rx="2.5" className="fill-indigo-500/20 stroke stroke-indigo-400 shadow-md animate-pulse" />
          <text x="0" y="4" textAnchor="middle" className="fill-indigo-300 text-[8px] font-bold truncate">{labelText}</text>
          <line x1="0" y1="8" x2="0" y2="40" className="stroke-indigo-400/50 stroke-dashed" />
        </g>
      </svg>
    );
  };

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
              isLight ? 'text-slate-800' : 'text-slate-100'
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

        {/* Action Selector and Wizard sync toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {wizard && (
            <button
              id="btn-vis-sync-wizard"
              onClick={() => {
                setIsSyncedWithWizard(!isSyncedWithWizard);
              }}
              className={`px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSyncedWithWizard
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse'
                    : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 animate-pulse'
                  : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
              title={loc.syncToggleLabel}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncedWithWizard ? 'animate-spin' : ''}`} style={{ animationDuration: isSyncedWithWizard ? '5s' : '0s' }} />
              <span>{isSyncedWithWizard ? loc.syncToggleActive : loc.syncToggleLabel}</span>
            </button>
          )}

          <div className="flex flex-wrap gap-1 w-full md:w-auto">
            {(['rebase', 'stash', 'merge', 'commit', 'push', 'diverge', 'fast-forward'] as VisualActionType[]).map((action) => {
              const isSelected = activeAction === action;
              return (
                <button
                  key={action}
                  id={`git-vis-tab-${action}`}
                  onClick={() => handleActionChange(action)}
                  className={`px-2.5 py-1 text-[9.5px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-605 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                      : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  {loc.opLabels[action]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main playground stage with interactive visual and controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Play stage display area (Left - col span 8) */}
        <div className={`lg:col-span-8 flex flex-col gap-3 justify-center min-h-[220px] rounded-xl p-4 overflow-hidden relative border ${
          isLight ? 'bg-indigo-50/20 border-indigo-100/60' : 'bg-slate-950/70 border-slate-905/60'
        }`}>
          
          {/* Active play indicators */}
          <div className="absolute top-3 left-3 flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border rounded ${
              isLight ? 'text-slate-600 bg-white border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'
            }`}>
              {loc.opLabels[activeAction]}
            </span>
          </div>

          <div className={`absolute top-3 right-3 flex items-center gap-1.5 select-none text-[8.5px] font-mono font-bold border rounded px-2 py-0.5 ${
            isLight ? 'text-slate-600 bg-white border-slate-200' : 'text-slate-400 bg-slate-900/80 border-slate-800'
          }`}>
            <span>STEP {currentStep + 1} / {totalSteps}</span>
          </div>

          {/* Active SVG dynamic stage area */}
          <div className="flex-1 flex items-center justify-center pt-5 pb-2">
            {renderVisualStage()}
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
                className={`p-1 px-2.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-[10px] flex items-center gap-1 cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={loc.prevStepBtn}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{loc.prevStepBtn}</span>
              </button>

              <button
                id="btn-vis-next"
                onClick={handleNextStep}
                disabled={currentStep === totalSteps - 1}
                className={`p-1 px-2.5 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed transition-all text-[10px] flex items-center gap-1 cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={loc.nextStepBtn}
              >
                <span>{loc.nextStepBtn}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="btn-vis-play"
                onClick={togglePlay}
                className={`p-1.5 px-3 rounded-lg border text-[10px] font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPlaying 
                    ? 'bg-amber-600/20 border-amber-500/30 text-amber-300 hover:bg-amber-600/30' 
                    : 'bg-indigo-650 border-indigo-500 hover:bg-indigo-550 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? loc.pauseBtn : loc.playBtn}</span>
              </button>

              <button
                id="btn-vis-reset"
                onClick={handleReset}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
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
