import { TranslationTone } from '../../types';
import { VisualActionType } from './GitVisualizerPanel';

export interface ToneLocalizations {
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

export const localizations: Record<TranslationTone, ToneLocalizations> = {
  [TranslationTone.PROFESSIONAL]: {
    title: "SA BÀN HOẠT ẢNH GIT (INTERACTIVE GIT FLOW VISUALIZER)",
    subtitle: "Biểu đồ hoạt ảnh mô phỏng trực quan các thao tác cốt lõi: Rebase, Merge, Commit, Stash (Sa bàn Battlefield)",
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
    title: "🎪 RẠP CHIẾU HOẠT HÌNH GIT (GIT MOVIE THEATER)",
    subtitle: "Phim hoạt ảnh vui giải mã Git Rebase, Merge & Stash siêu trực quan cho sếp lười đọc tài liệu (Sa bàn Battlefield)",
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
    subtitle: "Ảnh động gõ thẳng vô sọ cách thức Git dọn rác, Rebase, và sửa lỗi code của mày (Sa bàn Battlefield)",
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
    title: "⚡ DYNAMIC ACTIVE GIT SANDBOX (GIT FLOW VISUALIZER)",
    subtitle: "Animated masterclass of core Git actions: Rebase, Merge, Commit (Git Battlefield Sandbox)",
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

export const mapWizardStepToConcept = (step: number): VisualActionType => {
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