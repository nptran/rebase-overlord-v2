/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, 
  RefreshCw, 
  HelpCircle, 
  GitMerge, 
  History, 
  ShieldAlert, 
  Cpu, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  GitPullRequest,
  Check,
  Zap,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { Commit, WizardState, TranslationTone, GitRepoState } from '../types';
import { translate } from '../i18n';

const wizardLoc: Record<TranslationTone, any> = {
  [TranslationTone.PROFESSIONAL]: {
    step: "Bước",
    abortBtn: "Quay lại từ đầu (Abort)",
    nextStepBtn: "Kế tiếp",
    prevStepBtn: "Quay lại",
    steps: [
      { label: 'Base Branch', desc: 'Chọn nhánh đích' },
      { label: 'Sync / Fetch', desc: 'Đồng bộ từ xa' },
      { label: 'Commit Squash', desc: 'Dọn dẹp lịch sử' },
      { label: 'Backup Check', desc: 'Sao lưu an toàn' },
      { label: 'Rebase Run', desc: 'Chạy nén commit' },
      { label: 'Commit Msg', desc: 'Soạn lời nhắn' },
      { label: 'Verify Rebase', desc: 'Xác minh kết quả' },
      { label: 'Push Finish', desc: 'Đẩy lên Origin' }
    ],
    step0: {
      title: "Nhập hoặc chọn Nhánh gốc (Base Branch):",
      desc: "Rebase Overlord sẽ quét lịch sử commits và so sánh nhánh hiện tại của bạn với nhánh gốc này để tìm ra các điểm sai biệt. Thường thì đây là nhánh develop, main, hoặc master.",
      inputLabel: "GÕ TÊN NHÁNH GỐC:",
      techRecommend: "GỢI Ý TỪ PHÒNG KỸ THUẬT:"
    },
    step1: {
      title: "HỎI Ý KIẾN FETCH ORIGIN:",
      desc: "Có đồng ý thực thi lệnh git fetch origin --prune để dọn dẹp các nhánh từ xa cũ kỹ và đồng hóa code gốc từ Github về máy không? Việc này giúp loại trừ nguy cơ xung đột code lạ trong quá trình rebase.",
      syncYes: "CÓ, ĐỒNG Ý SYNC (RECOMMENDED)",
      syncYesDesc: "Chạy fetch dọn rác và quét lịch sử chính xác từ xa.",
      syncNo: "KHÔNG, BỎ QUA",
      syncNoDesc: "Giữ nguyên lịch sử local hiện tại và làm rebase offline."
    },
    step2: {
      title: "PHÂN TÍCH LỊCH SỬ NHÁNH:",
      desc: "Phát hiện thấy nhánh của bạn đang đi trước {baseBranch} với tổng số {commitsLength} commit chưa được nén (squash). Hãy tick chọn các commit bạn muốn nén làm một:",
      selectedCount: "* Đã chọn: {count} / {total} commit để nén dọn sạch nhánh.",
      selectAtLeastOne: "Vui lòng chọn ít nhất 1 commit để tiến hành squash!",
      selectAll: "Chọn tất cả",
      deselectAll: "Bỏ chọn tất cả",
      warningNote: "⚠️ Lưu ý quan trọng: Nếu chừa lại một số commit không nén hết, rebase có nguy cơ cao bùng nổ conflict lặp đi lặp lại nhiều lần ứng với từng commit lẻ tẻ. Khuyên dùng: Chọn tất cả lịch sử để dồn nén sạch sẽ tại một điểm duy nhất."
    },
    step3: {
      title: "CHẾ ĐỘ PHÒNG VỆ AN TOÀN (SAFE BACKUP):",
      desc: "Rebase là thao tác viết lại lịch sử có rủi ro nếu nén sai commit. Rebase Overlord sẽ tự động khởi tạo nhánh backup mang tên {backupBranchName} để phòng bị trước. Nếu bạn không vừa lòng sau rebase, có thể khôi phục dễ dàng chỉ trong 1 click.",
      backupYes: "🛡️ CÓ, SAO LƯU AN TOÀN",
      backupYesDesc: "Sao lưu toàn bộ commit an toàn vô điều kiện.",
      backupNo: "💀 KHÔNG CẦN SAO LƯU",
      backupNoDesc: "Bỏ qua sao lưu bước này, chấp nhận rủi ro nếu rebase gãy.",
      inputLabel: "TÊN NHÁNH SAO LƯU:"
    },
    step4: {
      idleDesc: "Kiểm tra toàn bộ khâu chuẩn bị hoàn tất. Bạn đã sẵn sàng chạy động cơ nén và dọn rác Rebase chưa?",
      idleBtn: "⚡ NHẤN ĐỂ KÍCH HOẠT REBASE SQUASH NOW",
      runningTitle: "ĐANG CHẠY MÁY NÉN COMMITS (EXECUTE REBASE -I)...",
      pausedTitle: "⚠️ CẢNH BÁO: PHÁT HIỆN XUNG ĐỘT PHÁT SINH",
      pausedDesc: "Quá trình rebase tự động đã bị ngắt quãng giữa chừng do tệp src/routes/payment.ts trùng lặp dòng sửa đổi. -> Hãy sử dụng tab cứu hộ ở dưới để cứu nét khẩn cấp!",
      completedTitle: "REBASE SQUASH HOÀN TẤT THÀNH CÔNG MỸ MÃN!",
    },
    step5: {
      title: "BẢN SOẠN THẢO COMMIT MESSAGE HOÀN MỸ:",
      desc: "Hãy soạn tin nhắn đại diện cho commit duy nhất sau khi nén. Rebase Overlord kiến nghị chọn danh mục tiền tố tiêu chuẩn dưới đây để dọn sạch PR rác:",
      prefixes: {
        feat: 'Tính năng mới',
        fix: 'Sửa lỗi',
        refactor: 'Tối ưu code',
        docs: 'Tài liệu',
        chore: 'Lông gà vỏ tỏi'
      }
    },
    step6: {
      title: "XÁC MINH TOÀN VẸN VÀ KIỂM THỬ CODE (VERIFY REBASE):",
      desc: "Trước khi gửi code lên GitHub Remote, hệ thống sẽ thực thi các kiểm định chuyên sâu như tính nhất quán của nhánh, so sánh sai lệch Patch-ID, và chạy thử tiến trình build/test dự án để đảm bảo an toàn tuyệt đối.",
      runBtn: "🔍 CHẠY CHẨN ĐOÁN & KIỂM THỬ KẾT QUẢ",
      running: "Hệ thống đang tiến hành chẩn đoán chéo...",
      checkingAheadBehind: "1. Đang kiểm tra Ahead/Behind giữa Local HEAD và Remote {baseBranch}...",
      checkingPatchID: "2. Đang kiểm tra tính toàn vẹn của Patch (Patch-ID)...",
      runningUnitTests: "3. Chạy kiểm thử tự động (Unit Test / Compile build-check)...",
      patchOk: "✓ Thành công: Patch-ID bảo toàn hoàn hảo so với nhánh backup {backupBranch}! Code logic giữ nguyên không bị thất lạc dòng.",
      patchLoss: "⚠️ Cảnh báo sai biệt: Phát hiện Patch-ID của bạn đã biến đổi (do xử lý conflict và thêm/bớt code). Điều này bình thường nếu bạn đã chủ động sửa tay lúc giải quyết xung đột.",
      aheadOk: "✓ Thành công: Nhánh của bạn hoạt động độc lập đứng trước remote '{baseBranch}' và sẵn sàng push.",
      aheadFail: "❌ Thất bại: Nhánh remote '{baseBranch}' có cập nhật mới chưa được kéo về local. Cần sync trước khi đẩy lên.",
      testsOk: "✓ Đạt chỉ tiêu: Tiến trình debug, build và linter hoàn thành 100% không gặp lỗi cú pháp.",
      testsFail: "❌ Cảnh báo đỏ: Dự án đang gặp lỗi biên dịch sau rebase. Hãy mở terminal kiểm tra lại code.",
      summaryTitle: "Báo cáo tóm tắt chỉ số an toàn rebase:",
      reRunBtn: "🔄 Tái kiểm tra"
    },
    step7: {
      title: "ĐẨY LÊN GITHUB (AUTO PUSH CHỐT SỔ):",
      desc: "Bạn có muốn Rebase Overlord tự động thực hiện lệnh git push origin HEAD --force-with-lease để đẩy nhánh thẳng lên remote GitHub và hoàn thành PR một cách sạch sẽ không?",
      pushYes: "🚀 CÓ, AUTO PUSH LUÔN THƯỢNG ĐẾ",
      pushYesDesc: "Chốt sổ mạnh mẽ với tùy chọn --force-with-lease an toàn.",
      pushNo: "🏁 CHỈ LƯU LOCAL, TÔI TỰ PUSH",
      pushNoDesc: "Dành cho dev cẩn trọng muốn tự soi lại code trước khi click."
    },
    alertDone: "🏁 Toàn bộ quy trình Rebase Overlord đã thu nạp dọn rác thành công. Chi nhánh gọn sạch như ly đóng hộp!",
    finishWorkflowBtn: "FINISH WORKFLOW 🎉"
  },
  [TranslationTone.JOKE]: {
    step: "Ải",
    abortBtn: "Oải vcc, làm lại từ đầu cứu em",
    nextStepBtn: "Quất tiếp ga",
    prevStepBtn: "Lùi lại tí",
    steps: [
      { label: 'Bến Đỗ', desc: 'Chọn cái bến để lao vào' },
      { label: 'Quét Sạch', desc: 'Hốt phân từ xa origin' },
      { label: 'Ủ Phân', desc: 'Ép đống code thối làm một' },
      { label: 'Nệm Khí', desc: 'Mua bảo hiểm phòng ngừa' },
      { label: 'Giao Chiến', desc: 'Múa tà thuật Rebase' },
      { label: 'Mác Nhãn', desc: 'Đặt quả tên thật bảnh' },
      { label: 'Thử Lửa', desc: 'Duyệt lại thành quả code' },
      { label: 'Ướp Lên', desc: 'Sút lên server bái bai' }
    ],
    step0: {
      title: "CHỌN NƠI HẠ CÁNH (BASE BRANCH):",
      desc: "Gõ hoặc chọn để em Overlord rình rập và so sánh, coi thử nhánh sếp nghịch ngợm nó khác gì so với dòng sông mẹ nuôi nấng (bọn main, develop đấy sếp).",
      inputLabel: "MỜI SẾP GÕ PHÍM NHÁNH MẸ:",
      techRecommend: "KÍP KỸ THUẬT PHÍM HÀNG:"
    },
    step1: {
      title: "VẤY NƯỚC ORIGIN, ĐỒNG HÓA FETCH?",
      desc: "Sếp có muốn quất nhẹ quả git fetch origin --prune để em dọn bớt mấy cái nhánh ma cổ lỗ sĩ và kéo bản code gốc mới nhất về máy không? Rebase đỡ trẹo chân ạ.",
      syncYes: "OK, ĐỒNG Ý SYNC (KHUYÊN DÙNG)",
      syncYesDesc: "Dọn rác bớt đi sếp, chần chừ gì.",
      syncNo: "THÔI, KHỎI CẦN",
      syncNoDesc: "Múa offline, hên xui gãy răng ráng chịu nha."
    },
    step2: {
      title: "PHÒNG CHIẾN THUẬT SQUASH COMMITS:",
      desc: "Vãi chưởng, sếp múa tận {commitsLength} commits đi trước {baseBranch}. Chọn ngay các quả commits sếp muốn vắt nước nén chặt xẹp lép thành 1 nhát duy nhất đi nào sếp:",
      selectedCount: "🎯 Đã chọn: {count} / {total} quả commits để nén rạp.",
      selectAtLeastOne: "Ít nhất phải chọn một quả commit để nén chứ ní!",
      selectAll: "Chọn tuốt sếp ơi",
      deselectAll: "Thôi khỏi chọn",
      warningNote: "⚠️ Mách nhỏ sếp: Nếu không nén trọn ổ commits mà chừa lại vài quả lẻ tẻ, lát rebase nó nổ bùng conflict sếp gánh nợ gỡ mệt đứt hơi á ghen! Khuyên sếp cứ click 'Chọn tuốt' gom hết cả cụm nén một lượt cho rảnh nợ cuộc đời bớt sầu!"
    },
    step3: {
      title: "MUA BẢO HIỂM NHÁNH PHÒNG THÂN (SAFE BACKUP):",
      desc: "Rebase là thao tác viết lại lịch sử rủi ro cực cao, gãy một cái là khóc thét. Em Overlord sẽ auto đẻ nhánh backup là {backupBranchName} để phòng ngự. Thất bại thảm hại thì phục sinh trong 1 nốt nhạc.",
      backupYes: "🛡️ YES, MUA BẢO HIỂM GẤP (AN TÂM)",
      backupYesDesc: "Tạo nhánh backup phòng thân, cứu víền rách.",
      backupNo: "💀 KHÔNG, TAO LÀ CHÚA LỲ LỢM",
      backupNoDesc: "Bỏ qua sao lưu, ngã ráng chịu đéo khóc đâu.",
      inputLabel: "ĐẶT TÊN BẢO HIỂM:"
    },
    step4: {
      idleDesc: "Tất cả đồ đạc chuẩn bị đã sẵn sàng trên yên xe. Sếp đã sẵn sàng cho nổ động cơ và dọn dẹp Rebase chưa?",
      idleBtn: "⚡ NHẤN GA CHẠY REBASE SQUASH NOW",
      runningTitle: "ĐANG ÉP CỦ TỎI VÀ NÉN COMMITS...",
      pausedTitle: "🚨 ỐI DỒI ÔI: CONFLICT TOÁC ĐẦU RỒI SẾP",
      pausedDesc: "Quá trình nén bị khựng lại vì file src/routes/payment.ts đụng chạm tay sếp với thằng khác. -> Click cứu hộ khẩn cấp ở thanh dưới ngay!",
      completedTitle: "DỌN SẠCH VÀ NÉN CODE THÀNH CÔNG RỰC RỠ!",
    },
    step5: {
      title: "TẤM THIỆP GHI LỜI NHẮN COMMIT ĐẮC ĐẠO:",
      desc: "Soạn một cái tên thật bảnh tỏn đại diện cho toàn bộ commits đã bị nén đầu. Em Overlord khuyên sếp dùng chuẩn chỉ nén sạch PR nhe:",
      prefixes: {
        feat: 'Hàng mới toanh',
        fix: 'Vá lỗi hố sâu',
        refactor: 'Mông má tối ưu',
        docs: 'Viết văn vở',
        chore: 'Mấy cái lông gà'
      }
    },
    step6: {
      title: "THỦ TỤC THỬ LỬA - DUYỆT LẠI THÀNH QUẢ CODE:",
      desc: "Để chắc cú là sếp không 'vô tình' bốc hơi mấy dòng code thần thánh của đồng nghiệp hay đẻ thêm bug, Overlord sẽ nổ máy kiểm thử, đo patch chéo xem sếp có quậy đục nước không nhe.",
      runBtn: "🔍 CHẠY NẮN GÂN MÚA TEST",
      running: "Đang xỉa răng soi code sếp...",
      checkingAheadBehind: "1. Đang dòm xem sếp có đi trước hay đi lùi so với {baseBranch}...",
      checkingPatchID: "2. Chạy tà thuật Patch-ID check xem code cũ mới có tụt mất dòng nào không...",
      runningUnitTests: "3. Nổ máy chạy thử build & compile dạo xem code có nát...",
      patchOk: "✓ Toàn vẹn: Patch-ID trùng khít với nhánh backup {backupBranch}! Không mất mát cọng lông chân nào của code sếp nhé.",
      patchLoss: "⚠️ Patch lún rồi: Code lúc nãy sếp táng conflict đã bị biến thể nhẹ. Không sao, sếp tay to giải quyết thủ công thì lệch xíu là chuyện thường tình.",
      aheadOk: "✓ Ngon nghẻ: Nhánh sếp ung dung đi trước '{baseBranch}' đón đầu, không bị hụt hơi.",
      aheadFail: "❌ Gãy: Nhánh mẹ '{baseBranch}' trên remote nhảy số rồi sếp ơi, kéo bỉm về đắp lại thôi.",
      testsOk: "✓ Thông nòng: Biên dịch & Linter trơn tru như lụa, không thấy lỗi vặt té khói.",
      testsFail: "❌ Toét ngòi: Build lỗi tanh bành, sếp vào terminal hốt rác hộ em cái.",
      summaryTitle: "Sổ sức khỏe dòng code sau khi múa phím:",
      reRunBtn: "🔄 Soi lại phát nữa"
    },
    step7: {
      title: "HỎI Ý KIẾN SÚT LÊN ĐỈNH CLOUD (AUTO PUSH):",
      desc: "Sếp muốn em tự sút thẳng lệnh git push origin Head --force-with-lease lên remote GitHub để dọn dẹp PR cho tươm tất nhanh gọn lẹ không ạ?",
      pushYes: "🚀 OKAY, ĐẨY THẲNG LÊN CLOUD GẤP",
      pushYesDesc: "Hành xử dứt khoát với thao tác push force-with-lease siêu an toàn.",
      pushNo: "🏁 CHỈ LƯU LOCAL, ĐỂ TỚ TỰ XỬ",
      pushNoDesc: "Để sếp tự soi lại code rồi tự mình push sau."
    },
    alertDone: "🏁 Rebase Overlord đã thu phục đống nợ thành công! Code sạch sẽ mướt rượt như lụa sếp ơi!",
    finishWorkflowBtn: "CHỐT SỔ HOÀN TẤT 🎉"
  },
  [TranslationTone.TOXIC]: {
    step: "Ải",
    abortBtn: "Ngu rồi làm lại từ đầu",
    nextStepBtn: "Cút sang bước tiếp",
    prevStepBtn: "Giật lùi lại",
    steps: [
      { label: 'Bãi Rác', desc: 'Chọn cái nhánh để so bì' },
      { label: 'Kéo Về', desc: 'Kéo code từ remote' },
      { label: 'Nén Rác', desc: 'Cắt gọt commits thừa' },
      { label: 'Màng Bọc', desc: 'Tạo backup phòng thân' },
      { label: 'Nén Gộp', desc: 'Nén gộp đống commits xập xệ' },
      { label: 'Ghi Đè', desc: 'Gõ cái tiêu đề commit mới' },
      { label: 'Soi Lỗi', desc: 'Thẩm định thành phẩm sau nén' },
      { label: 'Sút Bay', desc: 'Ép push lên server remote' }
    ],
    step0: {
      title: "GÕ HOẶC CHỌN NHÁNH MẸ (BASE BRANCH):",
      desc: "Gõ bừa một nhánh để so sánh đống rác của mày với code gốc coi mày sửa bậy bạ gì. Thường là develop hoặc main, master chứ lệch đi đâu được.",
      inputLabel: "GÕ CÁI TÊN NHÁNH GỐC VÀO:",
      techRecommend: "ĐÁM KỸ THUẬT PHÁN NHƯ THẦN:"
    },
    step1: {
      title: "KÉO PHÂN TỪ XA CHƯA (FETCH ORIGIN)?",
      desc: "Có chạy git fetch origin --prune để hốt bớt rác rưởi nhánh cũ chết trôi từ remote và đồng bộ đống hỗn độn về không? Không fetch rebase nát bét đừng chửi.",
      syncYes: "CÓ, SỢ CONFLICT THÌ SYNC ĐI (RECOMMENDED)",
      syncYesDesc: "Fetch quét phân sạch rác cứu lấy thân mày.",
      syncNo: "ĐÉO CẦN, TAO LIỀU MẠNG CHƠI LUÔN",
      syncNoDesc: "Offline rebase nát bét tự gỡ, mệt vcl."
    },
    step2: {
      title: "ĐỐNG NÁT COMMITS CHỜ ĐÉO SQUASH:",
      desc: "Tổ chức múa phím ngu đẻ tận {commitsLength} commits đè lên {baseBranch}. Chọn mẹ các commit cần khai tử để gom lại một bãi duy nhất hộ cái:",
      selectedCount: "🤬 Đã nhặt: {count} / {total} đống phân để dọn.",
      selectAtLeastOne: "Mày bị ngáo à? Chọn ít nhất 1 commit để gom bãi chứ!",
      selectAll: "Hốt trọn gói",
      deselectAll: "Thôi đéo thèm chọn",
      warningNote: "🔥 Cảnh báo cực mạnh: Đéo chọn nén sạch cả cụm mà chừa lại dăm ba cú commit đi lẻ, tý nữa git rebase nó vả conflict lặp đi lặp lại từng đợt sưng mồm thì tự gỡ mệt vcl chứ ai cứu. Khôn hồn thì ấn mẹ 'Hốt trọn gói' mà dọn sạch cả bãi một lần cho nhanh!"
    },
    step3: {
      title: "ƯƠM CHẬU BẢO HIỂM LẤY LỖI SĨ DIỆN (SAFE BACKUP):",
      desc: "Rebase ngu là bay màu luôn branch. Rebase Overlord đẻ tạm cái nhánh backup rác {backupBranchName} phòng thân đấy, lo mà giữ. Éo vừa lòng thì khôi phục lại, hèn hạ vcl.",
      backupYes: "🛡️ CÓ, BẢO VỆ CHỨ TAO CÒN NON TAY TRÌNH CÒI",
      backupYesDesc: "Tạo đống rác sao lưu dự phòng đề phòng gãy răng.",
      backupNo: "💀 ĐÉO CẦN, LIỀU ĂN NHIỀU VÀO",
      backupNoDesc: "Gãy nhánh thì nghỉ việc bỏ code, sợ đéo gì.",
      inputLabel: "ĐẶT TÊN ĐỐNG SAO LƯU:"
    },
    step4: {
      idleDesc: "Chuẩn bị xong hết cái đống lộn xộn này rồi. Sẵn sàng châm ngòi nổ nén rebase chưa hả?",
      idleBtn: "⚡ CHÂM NGÒI NỔ REBASE SQUASH NOW",
      runningTitle: "ĐANG DẬP NÁT VÀ NÉN COMMITS CỦA MÀY...",
      pausedTitle: "🚨 RA RÁC: CONFLICT NỔ BANH XÁC RỒI CON",
      pausedDesc: "Sửa chung một file src/routes/payment.ts chứ gì, ngu hết thuốc chữa! -> Cút xuống thanh cứu hộ ở dưới mà dọn rác đi!",
      completedTitle: "NÉN VÀ DỌN RÁC THÀNH CÔNG, MAY CHO MÀY ĐẤY!",
    },
    step5: {
      title: "VIẾT DI CHÚC COMMIT MESSAGE:",
      desc: "Gõ một cái lời nhắn đại diện cho đống commits rác mày vừa ép. Hàng Overlord khuyên xài các tiền tố chuẩn bảo vệ tự trọng dev:",
      prefixes: {
        feat: 'Đẻ tính năng mới',
        fix: 'Vá vụng vá víu',
        refactor: 'Làm màu tối ưu',
        docs: 'Vẽ chữ bôi bác',
        chore: 'Dọn vụn rác vặt'
      }
    },
    step6: {
      title: "SÁT HẠCH THÀNH PHẨM RÁC - THẨM ĐỊNH LÀ LÊN:",
      desc: "Đừng có vội vàng sút đống code lỗi lên remote cho ăn chửi ngập đầu. Overlord sẽ cưỡng chế quét kiểm tra xem mày có xóa bậy code người khác hay làm hỏng trình build không.",
      runBtn: "🔍 CLICK ĐỂ KHẢO SÁT CHẤT LƯỢNG RÁC",
      running: "Đang xem mày đẻ ra lỗi gì đây...",
      checkingAheadBehind: "1. Soi xem local HEAD của mày có thụt lùi so với origin/{baseBranch} không...",
      checkingPatchID: "2. Quét ổn định Patch-ID xem mày có lỡ 'thuổng' mất code ngon của ai không...",
      runningUnitTests: "3. Chạy cưỡng bức build & linter xem code ngu có làm vỡ dự án...",
      patchOk: "✓ Kỳ tích: Patch-ID bảo toàn tuyệt mật giống hệt con backup {backupBranch}! Đéo mất dòng nào, tạm khen.",
      patchLoss: "⚠️ Biến dị patch: Bản vá bị méo mó rồi (chắc do mày múa phím tay lúc gỡ conflict). Nhớ tự soi lại mắt nếu sụp đổ hệ thống.",
      aheadOk: "✓ May mắn: Local đi trước origin/{baseBranch} ngon ơ, tha hồ mà sút.",
      aheadFail: "❌ Óc chó: Thằng khác push đè lên origin/{baseBranch} rồi, cút về fetch/rebase lại từ đầu đi!",
      testsOk: "✓ May quá: Code trôi nổi biên dịch thành công, chưa phá hoại gì thêm.",
      testsFail: "❌ Ăn hại: Dự án gãy build cmnr, lười linter hay gõ bậy thì tự gỡ đi con!",
      summaryTitle: "Bia mộ chất lượng code sau khi rebase bậy:",
      reRunBtn: "🔄 Quét lại coi cút chưa"
    },
    step7: {
      title: "CƯỚP ĐƯỜNG BAY PUSH LÊN LÊ REMOTE (AUTO PUSH):",
      desc: "Có muốn ép lệnh git push origin Head --force-with-lease đẩy thẳng đống code này lên remote GitHub dọn sạch nợ nần luôn không?",
      pushYes: "🚀 CÓ, SÚT CÚ NÀY ĐI CHO RẢNH NỢ",
      pushYesDesc: "Chốt bằng force-with-lease cho an toàn, đỡ tị nạnh.",
      pushNo: "🏁 THÔI, ĐỂ TAO TỰ SOI KHÔNG LẠI TOÁC",
      pushNoDesc: "Sợ gõ nhầm đẩy bậy nên muốn tự tay gõ lệnh push sau."
    },
    alertDone: "🏁 Sương sương dọn xong đống nợ rebase, mệt vãi nồi! Code sạch bóng như ly đóng hộp rồi!",
    finishWorkflowBtn: "XÁC NHẬN SẠCH CHA RỒI 🎉"
  },
  [TranslationTone.ENGLISH]: {
    step: "Step",
    abortBtn: "Abort & Start Over",
    nextStepBtn: "Next Step",
    prevStepBtn: "Previous step",
    steps: [
      { label: 'Base Branch', desc: 'Select target branch' },
      { label: 'Sync / Fetch', desc: 'Sync from remote' },
      { label: 'Commit Squash', desc: 'Clean commit history' },
      { label: 'Backup Check', desc: 'Safe backup branch' },
      { label: 'Rebase Run', desc: 'Execute compression' },
      { label: 'Commit Msg', desc: 'Draft commit message' },
      { label: 'Verify Rebase', desc: 'Verify rebase integrity' },
      { label: 'Push Finish', desc: 'Push to origin remote' }
    ],
    step0: {
      title: "Input or Select Base Branch:",
      desc: "Rebase Overlord scans commit history and compares your current branch against the base branch to detect differences. Typically this is develop, main, or master.",
      inputLabel: "ENTER BASE BRANCH NAME:",
      techRecommend: "SUGGESTIONS FROM ENGINEERING CABIN:"
    },
    step1: {
      title: "ASKING TO FETCH ORIGIN:",
      desc: "Do you want to execute git fetch origin --prune to purge obsolete remote branches and sync origin commits to your local disk? This safely prevents unexpected conflicts during rebase.",
      syncYes: "YES, AGREE TO SYNC (RECOMMENDED)",
      syncYesDesc: "Runs fetch to ensure precise remote references.",
      syncNo: "NO, SKIP SYNC",
      syncNoDesc: "Run offline using currently cached local history."
    },
    step2: {
      title: "BRANCH HISTORY ANALYSIS:",
      desc: "Detected your branch is ahead of {baseBranch} by {commitsLength} commits. Select the target commits you want to squish into a single clean commit:",
      selectedCount: "* Selected: {count} / {total} commits to be squashed.",
      selectAtLeastOne: "Please select at least one commit to squish!",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      warningNote: "⚠️ Crucial Warning: If you do not select all commits to squash, Git Rebase may trigger consecutive conflict resolution checkpoints for each isolated commit. Recommendation: Use 'Select All' to consolidate the entire branch history at once safely."
    },
    step3: {
      title: "SAFE BACKUP BRANCH MODE (DISASTER RECOVERY):",
      desc: "Rebase rewires history. To prevent accidental data loss, Rebase Overlord will seed a backup branch named {backupBranchName}. Restore takes only one click.",
      backupYes: "🛡️ YES, CONFIGURE SAFETY BACKUP (SAFE)",
      backupYesDesc: "Safeguards all commit states pre-rebase.",
      backupNo: "💀 NO BACKUP, I AM A RISK TAKER",
      backupNoDesc: "Bypass backup steps, risk complete data mutation on failure.",
      inputLabel: "BACKUP BRANCH NAME DESIGNATION:"
    },
    step4: {
      idleDesc: "Pre-calculations completed. Are you ready to fire up the squash compression rebase reactor?",
      idleBtn: "⚡ ACTIVATE REBASE SQUASH NOW",
      runningTitle: "COMPRESSING AND STACK-MERGING COMMITS...",
      pausedTitle: "🚨 PAUSED: FILE CONFLICTS ENCOUNTERED",
      pausedDesc: "Automatic rebase paused since src/routes/payment.ts has colliding edits. -> Use the recovery dock below to rescue!",
      completedTitle: "REBASE AND COMPRESSION FINISHED EXCELLENTLY!",
    },
    step5: {
      title: "CRAFT A BEAUTIFUL COMPACT COMMIT MESSAGE:",
      desc: "Draft a final unified message. We recommend prefixes complying with Conventional Commits to purify logs:",
      prefixes: {
        feat: 'New Feature',
        fix: 'Bug Fix',
        refactor: 'Code Refactor',
        docs: 'Documentation',
        chore: 'Chore Task'
      }
    },
    step6: {
      title: "REBASE INTEGRITY VERIFICATION & SANITY CHECKS:",
      desc: "Before pushing code to remote GitHub, run automated verification checks—mirroring high-end Git tools—including Ahead/Behind validation, Patch-ID preservation chasm checking, and compiler diagnostics.",
      runBtn: "🔍 RUN COMPREHENSIVE INTEGRITY TEST",
      running: "Executing verification suite...",
      checkingAheadBehind: "1. Resolving Ahead/Behind counters against remote {baseBranch}...",
      checkingPatchID: "2. Verifying Patch-ID logical consistency pre & post-rebase...",
      runningUnitTests: "3. Invoking syntax compilation and unit tests...",
      patchOk: "✓ Verified: Patch-ID fully matches backup branch {backupBranch}! No operational lines lost.",
      patchLoss: "⚠️ Patch mutated: Logic altered (expected if manual tweaks with conflicts occurred). Inspect history if unexpected.",
      aheadOk: "✓ Success: Your branch is clean and stands ahead of '{baseBranch}' on remote.",
      aheadFail: "❌ Behind: Remote master branch '{baseBranch}' has newer commits. Sync required first.",
      testsOk: "✓ Passed: Static checks, compiler, and linter tests finished without failures.",
      testsFail: "❌ Danger: Build output crashed on compile. Open Terminal to review the code.",
      summaryTitle: "Integrity Verification Summary:",
      reRunBtn: "🔄 Re-evaluate"
    },
    step7: {
      title: "REDEPLOY IN HEAD ROUTE (AUTO PUSH TO ORIGIN):",
      desc: "Would you like Rebase Overlord to execute git push origin Head --force-with-lease to automatically deploy changes up to remote GitHub?",
      pushYes: "🚀 YES, AUTO PUSH TO REMOTE ORIGIN",
      pushYesDesc: "Safely updates upstream via force-with-lease assertion.",
      pushNo: "🏁 LOCAL ONLY, I WILL PUSH LATER",
      pushNoDesc: "Drawn for cautious developers wanting an inline review."
    },
    alertDone: "🏁 Rebase Overlord pipeline processed and cleaned successfully!",
    finishWorkflowBtn: "FINISH WORKFLOW 🎉"
  }
};

// Simple custom hover/click-triggered Tooltip wrapper
export function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const [position, setPosition] = React.useState<'center' | 'left' | 'right'>('center');

  React.useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 224; // w-56 is 224px
      const viewportWidth = window.innerWidth;
      
      const spaceOnLeft = rect.left + rect.width / 2;
      const spaceOnRight = viewportWidth - (rect.left + rect.width / 2);
      
      if (spaceOnLeft < tooltipWidth / 2 + 16) {
        setPosition('left');
      } else if (spaceOnRight < tooltipWidth / 2 + 16) {
        setPosition('right');
      } else {
        setPosition('center');
      }
    }
  }, [visible]);

  let tooltipClass = "absolute bottom-full mb-2 w-56 bg-[#0f172a] border border-slate-700 text-[11px] text-slate-300 rounded-lg p-3 shadow-2xl z-50 leading-normal font-sans font-normal text-left animate-fade-in block ";
  let arrowClass = "absolute top-full -mt-1.5 border-4 border-transparent border-t-slate-700 ";

  if (position === 'left') {
    tooltipClass += "left-0";
    arrowClass += "left-4";
  } else if (position === 'right') {
    tooltipClass += "right-0";
    arrowClass += "right-4";
  } else {
    tooltipClass += "left-1/2 transform -translate-x-1/2";
    arrowClass += "left-1/2 transform -translate-x-1/2";
  }

  return (
    <span 
      ref={triggerRef}
      className="relative group inline-block cursor-help border-b border-dashed border-slate-605/60 pb-0.5 select-none"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
    >
      {children}
      {visible && (
        <span className={tooltipClass}>
          {text}
          <span className={arrowClass}></span>
        </span>
      )}
    </span>
  );
}

const lowTechAnalogies: Record<TranslationTone, Record<number, { title: string; analogy: string; realLife: string; tip: string }>> = {
  [TranslationTone.PROFESSIONAL]: {
    0: {
      title: "Cột Mốc So Sánh (Base Branch)",
      analogy: "Nghĩ như là: Bạn chuẩn bị đổ đất xây nhà. Bạn cần xác định đúng mặt mốc ranh giới đất cũ (nhánh gốc) để xây lên không bị chồng lấn sang đất của nhà hàng xóm.",
      realLife: "Hệ thống sẽ xem dòng thời gian ở nhánh gốc để trích xuất ra những điểm code mới lạ bạn đã chỉnh sửa.",
      tip: "🌱 Khuyên dùng: Chọn nhánh phát triển chung (develop/main) để làm mốc sáp nhập."
    },
    1: {
      title: "Đồng Bộ Thông Tin (Fetch Origin)",
      analogy: "Nghĩ như là: Nhấc máy gọi điện lên tổng đài hỏi xem thời tiết hôm nay đường xá có rào chắn hay ai đào đường không trước khi bạn nổ máy lái xe ra xa lộ.",
      realLife: "Cập nhật những thay đổi mới nhất từ các thành viên khác đã gửi lên GitHub mạng chung để máy của bạn bắt nhịp cùng.",
      tip: "🌱 Khuyên dùng: Chọn 'CÓ' để dọn dẹp các nhánh ảo cũ, loại trừ bùng nổ xung đột."
    },
    2: {
      title: "Gom Gói Commit (Commit Squash)",
      analogy: "Nghĩ như là: Bạn đi chợ mua 10 món đồ lặt vặt. Thay vì nộp cho Kế toán 10 hóa đơn viết tay nhàu nát tẻ nhạt, bạn gom tất cả lại thanh toán 1 lần duy nhất kèm hóa đơn đỏ tổng hợp.",
      realLife: "Gom nén tất cả các lần lưu dạo tẻ nhạt thành một commit duy nhất, sạch bóng và thanh lịch.",
      tip: "🌱 Khuyên dùng: Kéo thả toàn bộ commits bạn muốn nén dồn vào hộp nén 'SQUASH' bên trái."
    },
    3: {
      title: "Bản Sao Dự Phòng (Safe Backup)",
      analogy: "Nghĩ như là: Mang tập hồ sơ tài liệu quan trọng đi photocopy ra một bản giống hệt trước khi trực tiếp mang viết mực tẩy xóa đè lên.",
      realLife: "Tự động đẻ ra nhánh sao lưu tạm thời trước khi chạy rebase. Sự cố xảy ra có phao cứu sinh giật lại tức khắc.",
      tip: "🌱 Khuyên dùng: Luôn bật bảo vệ để tự tin múa phím không sợ mất code."
    },
    4: {
      title: "Thực Thi Máy Ép (Rebase Exec)",
      analogy: "Nghĩ như là: Chiếc máy ép thủy lực bắt đầu nghiền chặt đống sắt thép phụ tùng lặt vặt thành một khối kim loại mượt mà nguyên khối.",
      realLife: "Nếu trùng lặp dòng sửa (conflict), máy sẽ đứng yên kêu chuông báo động để bạn giải cứu thủ công ở tab Cứu Hộ bên dưới.",
      tip: "🌱 Khuyên dùng: Gặp cảnh báo xung đột cứ bình tĩnh, giải cứu từng tệp một là trơn tru."
    },
    5: {
      title: "Tiêu Đề Thùng Hàng (Commit Message)",
      analogy: "Nghĩ như là: Dán một bức sticker to đùng, viết chữ rõ sạch ngoài vỏ thùng các-tông đựng hàng hóa để bưu tá liếc qua là hiểu bên trong có gì quý giá.",
      realLife: "Áp dụng các tiền tố chuẩn SEO code như 'feat:' (tính năng mới) hoặc 'fix:' (vá lỗi) để cả phòng kỹ thuật yêu quý bạn.",
      tip: "🌱 Khuyên dùng: Tránh ghi những tiêu đề ngắn củn vô nghĩa kiểu 'fix bug' hay 'update code'."
    },
    6: {
      title: "Kiểm Định Xe Máy (Verify Rebase)",
      analogy: "Nghĩ như là: Đưa chiếc xe hơi của bạn vào trạm đăng kiểm tự động, rà phanh, gầm và bật cảm biến xi nhan xem có an toàn tuyệt đối trước khi chạy lên cao tốc.",
      realLife: "Chạy thử xem code có bị vỡ cú pháp không, kiểm soát tính toán ổn định Patch-ID so với nhánh gốc.",
      tip: "🌱 Khuyên dùng: Đèn xanh hiện lên 100% nghĩa là sản phẩm tuyệt đối hoàn hảo để cho ra lò."
    },
    7: {
      title: "Vận Chuyển Khai Trình (Push Finish)",
      analogy: "Nghĩ như là: Chính thức đưa thùng hàng đã kiểm duyệt lên xe tải bưu điện chở thẳng tới kệ kho trung tâm khổng lồ trên GitHub.",
      realLife: "Cập nhật dứt khoát mớ code sạch lên remote thông qua force-with-lease siêu an toàn.",
      tip: "🌱 Khuyên dùng: Bật nút sút thẳng lên mâm bái bai để PR của bạn chuẩn chỉ nhất."
    }
  },
  [TranslationTone.JOKE]: {
    0: {
      title: "Nhắm cái ngõ cụt (Base Branch)",
      analogy: "Chọn cái bến đỗ để lao đò vào. Không chọn mốc này thì chốc nữa nén code nó văng bã đậu ra biển đấy.",
      realLife: "So sánh xem đống code lỗi của sếp nó khác cái vẹo gì với dòng sông mẹ nuôi dưỡng cả dự án.",
      tip: "🤪 Gợi ý: develop hoặc main chứ đi đâu nữa sếp ơi."
    },
    1: {
      title: "Hóng hớt tin tức (Fetch)",
      analogy: "Huýt sáo hỏi thăm trạm gác xem hôm nay trên server có thằng dở hơi nào đổi luật chơi hay đặt bẫy mìn không để né bớt.",
      realLife: "Quét dọn rác và kéo thông tin lộc từ GitHub về máy cho mượt mà.",
      tip: "🤪 Gợi ý: Sync đi ngại gì sếp, dọn bớt mấy nhánh clone ma cổ lỗ sĩ."
    },
    2: {
      title: "Ép củ tỏi gom phân (Squash)",
      analogy: "Gom đống tã lót bỉm rác dơ dáy dạo cả tuần lại thành một bịch rác to cột nơ đen sang xịn mịn xách tay mang đi vứt.",
      realLife: "Kéo thả commits tẹt ga! Thích nén thì vứt vào giỏ SQUASH bên trái, ghét thì bỏ sang giỏ SKIP.",
      tip: "🤪 Gợi ý: Gom tuốt cả ổ đi, chừa lại một cọng rác lát rebase nó vả conflict sưng mỏ đó!"
    },
    3: {
      title: "Mua gói bảo hiểm (Backup)",
      analogy: "Ký giấy cam kết hiến xác trước khi nhảy bungee từ đỉnh Fansipan phòng hờ đứt dây.",
      realLife: "Nhân bản nhánh hiện tại ra góc riêng. Chốc nữa quậy phá nát bét thì ấn 1 nút là hồi sinh như chưa hề có cuộc chia ly.",
      tip: "🤪 Gợi ý: Backup đi, liều ăn nhiều nhưng gãy branch thì trầm cảm nặng á."
    },
    4: {
      title: "Nện phím kích hoạt (Run)",
      analogy: "Nhắm mắt đạp lút ga phóng xe qua ngã tư đèn đỏ chói lọi và cầu nguyện không có chiếc container nào trờ tới.",
      realLife: "Lò ép chạy giòn giã. Có conflict húc nhau thì đứng hình hú còi báo động bắt sếp giải cứu bên dưới.",
      tip: "🤪 Gợi ý: Bình tĩnh, conflict thì xách cuốc ra gỡ từng dòng tơ liễu là xong."
    },
    5: {
      title: "Slogan độc bản (Commit Msg)",
      analogy: "Viết quả cap Facebook thật bay bổng, rẫy đầy triết lý dán kèm tấm hình tự sướng bảnh chọe gửi thiên hạ.",
      realLife: "Nhập lời chúc đại diện, gắn thêm quả nhãn mác như `feat:` hay `docs:` cho sếp trầm trồ.",
      tip: "🤪 Gợi ý: Viết hay hay sếp duyệt lẹ sếp thưởng nóng cho ní nha."
    },
    6: {
      title: "Lên đĩa sát hạch (Verify)",
      analogy: "Nổi xi nhan, bước lên máy test nồng độ cồn xem có bị xách tai lên phường không rồi mới dám vác xe chạy cao tốc.",
      realLife: "Quét dọn lỗi cú pháp xem sếp có lỡ tay bốc hơi dòng code thần thánh nào của bạn đồng nghiệp không.",
      tip: "🤪 Gợi ý: Hiện đèn xanh là hú hét ăn mừng được rồi."
    },
    7: {
      title: "Sút mông lên mây (Push)",
      analogy: "Cầm quả tạ đã được nén chặt sút vèo một cái lên trạm vũ trụ trung tâm bái bai bưu tá.",
      realLife: "Đẩy thẳng code sạch lên GitHub Server bằng cú force-with-lease oai vệ.",
      tip: "🤪 Gợi ý: Sút ga thẳng lên đi sếp ơi, giữ khư khư ổ cứng làm của hồi môn ư."
    }
  },
  [TranslationTone.TOXIC]: {
    0: {
      title: "Đống mốc quái thai (Base Branch)",
      analogy: "Chỉ mặt xem cái nhánh nào mày tính đem đống rác của mày đè sáp nhập vào, develop hay main?",
      realLife: "Xem mày quậy phá lệch bao nhiêu dặm so với code gốc của người ta.",
      tip: "🤬 Đọc kĩ: Gõ develop vào lẹ đi con rùa rụt cổ!"
    },
    1: {
      title: "Kéo hốt phân xa lộ (Fetch)",
      analogy: "Quét dọn bớt mấy cái nhánh ma chết trôi trên trời và hóng xem có thằng nào mới push code đè lên đầu mày chưa.",
      realLife: "Đồng bộ thông tin chỉ mục từ GitHub về ổ đĩa tránh rebase mù mịt cực khổ.",
      tip: "🤬 Đọc kĩ: Fetch đi con, lười biếng bỏ qua lát ăn conflict nương tựa ai."
    },
    2: {
      title: "Gom gọn búp bê rác (Squash)",
      analogy: "Thu dọn sạch sẽ đống commit rác rưởi ('update', 'fix bug', 'asdfad') ngu ngốc của mày thành 1 bãi duy nhất lịch sự cho sếp ngự lãm.",
      realLife: "Kéo thả commit bừa bãi vào hòm SQUASH để hợp nhất, hoặc quẳng sang SKIP ném xó.",
      tip: "🤬 Đọc kĩ: Gom trọn gói đi, lợn lành thành lợn què tý rebase nó giật cục conflict ráng chịu."
    },
    3: {
      title: "Màng bọc rụt rè (Backup)",
      analogy: "Tạo tạm cái phao cứu sinh hờ hững dự phòng. Lát mày múa búa tạ gãy branch thì còn gỡ gạc thể diện hèn mọn.",
      realLife: "Sao chép nhánh trước khi nén code. Đừng tự tin thái quá kẻo mất sạch sự nghiệp.",
      tip: "🤬 Đọc kĩ: Sợ toát mồ hôi thì bật bảo vệ lên đi, cằn nhằn gì."
    },
    4: {
      title: "Đút lò thiêu đốt (Run)",
      analogy: "Ấn nút châm ngòi nổ kích hoạt máy ép rác thủy lực nghiền nát đống commits ngu của mày.",
      realLife: "Chạy ép, nếu nổ xung đột húc nhau gãy răng thì khôn hồn ngó đầu xuống bảng cứu nạn dưới kia gỡ.",
      tip: "🤬 Đọc kĩ: Conflict là chuyện thường tình do mày múa phím bậy bạ, gỡ lẹ đi!"
    },
    5: {
      title: "Viết di chúc (Commit Msg)",
      analogy: "Soạn quả tiêu đề cho đống code nén kia, viết tử tế lên cho người ta hiểu mày đang bôi bẩn cái gì lên PR.",
      realLife: "Dán nhãn mác văn vẻ kiểu `feat:` (tính năng) hay `fix:` (vá lỗi) lừa sếp duyệt PR.",
      tip: "🤬 Đọc kĩ: Cấm viết cụt ngủn 'done' hay 'fix'. Viết có tâm hộ cái!"
    },
    6: {
      title: "Phòng tra khảo code (Verify)",
      analogy: "Lôi cổ đống code đi khám bệnh xem có bôi nhọ làm bay màu file người khác hay làm hỏng ứng dụng không.",
      realLife: "Cưỡng bức biên dịch linter tìm lỗi cú pháp và đối soát Patch-ID.",
      tip: "🤬 Đọc kĩ: Đỏ lòm là cút xéo về sửa, xanh lét thì tạm thời tha mạng cho đấy."
    },
    7: {
      title: "Trục xuất lên mây (Push)",
      analogy: "Nhấn nút vứt đống code mượt sau nén bay thẳng lên GitHub dọn sạch chiến trường PR.",
      realLife: "Sút code lên trời bằng force-with-lease tuyệt mật an toàn.",
      tip: "🤬 Đọc kĩ: Sút mẹ lên đi cho rảnh nợ, ôm khư khư local hít hà bốc mùi à."
    }
  },
  [TranslationTone.ENGLISH]: {
    0: {
      title: "Reference Highway Guide (Base)",
      analogy: "Think of it as identifying the main highway route (e.g. develop) you want to merge your car into, aligning beforehand to bypass collisions.",
      realLife: "Rebase Overlord scans index timelines on the base branch to trace your isolated unique additions.",
      tip: "🌱 Suggestion: Usually choose develop/main as the km0 benchmark point."
    },
    1: {
      title: "Query Traffic Roadblocks (Fetch)",
      analogy: "Think of it as dialing up road safety dispatch to query if any construction blockages are newly installed down your highway course before launching.",
      realLife: "Synchronizes upstream indices to keep your local machine matching other developers' work.",
      tip: "🌱 Suggestion: Agree to fetch so your rebase analysis doesn't run blind."
    },
    2: {
      title: "Voucher Billing Squashing (Squash)",
      analogy: "Instead of handing your Accountant 10 separate crumpled receipts for spices and salt, you bundle them into one pristine, labeled accounting expense folder. They will adore you!",
      realLife: "Drag and drop commits between 'SQUASH' and 'SKIP' docks. Feel free to slide/drag up and down to change timeline sequence too.",
      tip: "🌱 Suggestion: Choose select-all to clean up commit lists in one sweep."
    },
    3: {
      title: "Photocopy Safe Keep (Backup)",
      analogy: "Making a clean photocopy of a critical contract before directly scratching signatures or editing with liquid ink corrector on the master draft.",
      realLife: "Spawns a backup branch copy. If mutations fail, restore original states instantly in 1 click.",
      tip: "🌱 Suggestion: Always keep safety on so you can code without anxiety."
    },
    4: {
      title: "Press Drive Activation (Execute)",
      analogy: "Hydraulic machinery ignites, crushing separated scrap metal chunks into a single solid seamless steel block.",
      realLife: "If files collide (conflict), rebase stops and sounds warnings for you to rescue utilizing the Conflict solver dock.",
      tip: "🌱 Suggestion: Cool down! Solve file conflicts step-by-step and trigger run continue."
    },
    5: {
      title: "Shipping Label (Commit Msg)",
      analogy: "Sticking a huge, clear, perfectly standard barcode shipping manifest onto your container cargo for rapid customs clearance.",
      realLife: "Draft messages with prefixes such as `feat:` or `fix:` to earn deep professional trust from your peers.",
      tip: "🌱 Suggestion: Refuse typing sloppy sentences like 'fix bug'. State actual intent."
    },
    6: {
      title: "Diagnostics Lane (Verify)",
      analogy: "Driving your newly serviced vehicle onto computerized rolling dynos to scan tires, alignment and emission safety before highway entry.",
      realLife: "Ensures compiler correctness and executes static checks to safeguard against broken syntax.",
      tip: "🌱 Suggestion: Getting green indicators validates ready state for public deployment."
    },
    7: {
      title: "Dispatch to Central Depository (Push)",
      analogy: "Pushing your pristine boxed cargo package onto the delivery truck to transit up to the primary cloud terminal of GitHub.",
      realLife: "Saves updates securely upstream via force-with-lease assertions.",
      tip: "🌱 Suggestion: Opt for auto push to conclude your feature development loop automatically."
    }
  }
};

interface WizardPanelProps {
  commits: Commit[];
  wizard: WizardState;
  tone: TranslationTone;
  useEmoji: boolean;
  theme?: 'light' | 'dark';
  onUpdateWizard: (updates: Partial<WizardState>) => void;
  onExecuteWizardRebase: () => void;
  onResetWizard: () => void;
  repoState?: GitRepoState;
}

export default function WizardPanel({
  commits,
  wizard,
  tone,
  useEmoji,
  theme = 'dark',
  onUpdateWizard,
  onExecuteWizardRebase,
  onResetWizard,
  repoState
}: WizardPanelProps) {
  const [localFinalMsg, setLocalFinalMsg] = React.useState(wizard.finalMsg);
  const loc = wizardLoc[tone] || wizardLoc[TranslationTone.PROFESSIONAL];

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rebase_overlord_collapse_wizard_panel');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rebase_overlord_collapse_wizard_panel', String(next));
      } catch (e) {}
      return next;
    });
  };

  const currentAnalogy = lowTechAnalogies[tone]?.[wizard.step] || lowTechAnalogies[TranslationTone.PROFESSIONAL]?.[wizard.step];

  React.useEffect(() => {
    setLocalFinalMsg(wizard.finalMsg);
  }, [wizard.finalMsg]);

  // Local verification step variables
  const [verifyStatus, setVerifyStatus] = React.useState<'idle' | 'running' | 'completed'>('idle');
  const [verifyLogs, setVerifyLogs] = React.useState<string[]>([]);
  const [verifyResults, setVerifyResults] = React.useState<{
    aheadBehind: 'passed' | 'failed' | null;
    patchId: 'passed' | 'mutated' | null;
    tests: 'passed' | 'failed' | null;
  }>({
    aheadBehind: null,
    patchId: null,
    tests: null
  });

  // Automatically reset verify state if we leave step 6
  React.useEffect(() => {
    if (wizard.step !== 6) {
      setVerifyStatus('idle');
      setVerifyLogs([]);
      setVerifyResults({ aheadBehind: null, patchId: null, tests: null });
    }
  }, [wizard.step]);

  // Low-tech & Drag-and-Drop system states
  const [showAnalogy, setShowAnalogy] = React.useState<boolean>(false);
  const [orderedCommits, setOrderedCommits] = React.useState<Commit[]>([]);
  const [isDragOverSquash, setIsDragOverSquash] = React.useState<boolean>(false);
  const [isDragOverExclude, setIsDragOverExclude] = React.useState<boolean>(false);
  const [draggingSha, setDraggingSha] = React.useState<string | null>(null);

  // Sync state when commits prop changes
  React.useEffect(() => {
    if (commits && commits.length > 0) {
      // Avoid resetting order if list is already populated of same length/items to prevent flashing while dragging
      setOrderedCommits(prev => {
        if (prev.length === commits.length && prev.every((c, idx) => c.sha === commits[idx].sha)) {
          return prev;
        }
        return commits;
      });
    }
  }, [commits]);

  // Handle step updates to collapse analogy sidebar/drawer for best space utilization
  React.useEffect(() => {
    setShowAnalogy(false);
  }, [wizard.step]);

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, sha: string, zone: 'squash' | 'exclude') => {
    e.dataTransfer.setData('text/plain', sha);
    e.dataTransfer.setData('sourceZone', zone);
    setDraggingSha(sha);
  };

  const handleDragEnd = () => {
    setDraggingSha(null);
    setIsDragOverSquash(false);
    setIsDragOverExclude(false);
  };

  const handleMoveUp = (sha: string) => {
    const idx = orderedCommits.findIndex(c => c.sha === sha);
    if (idx <= 0) return;
    const updated = [...orderedCommits];
    const [removed] = updated.splice(idx, 1);
    updated.splice(idx - 1, 0, removed);
    setOrderedCommits(updated);
  };

  const handleMoveDown = (sha: string) => {
    const idx = orderedCommits.findIndex(c => c.sha === sha);
    if (idx === -1 || idx >= orderedCommits.length - 1) return;
    const updated = [...orderedCommits];
    const [removed] = updated.splice(idx, 1);
    updated.splice(idx + 1, 0, removed);
    setOrderedCommits(updated);
  };

  const runVerification = () => {
    setVerifyStatus('running');
    setVerifyLogs([`Initializing verification suite...`, `Establishing contact with origin tracking references...`]);
    setVerifyResults({ aheadBehind: null, patchId: null, tests: null });

    // Step 1: Ahead Behind check (takes 600ms)
    setTimeout(() => {
      const step1Text = (loc.step6.checkingAheadBehind || '').replace('{baseBranch}', wizard.baseBranch);
      setVerifyLogs(prev => [...prev, `$ git rev-list --left-right --count origin/${wizard.baseBranch}...HEAD`, step1Text]);
      
      setTimeout(() => {
        setVerifyResults(prev => ({ ...prev, aheadBehind: 'passed' }));
        setVerifyLogs(prev => [...prev, `✓ [PASS] ` + loc.step6.aheadOk]);
        
        // Step 2: Patch-ID Integrity check (takes another 1000ms)
        setTimeout(() => {
          setVerifyLogs(prev => [...prev, `$ git diff origin/${wizard.baseBranch}...HEAD | git patch-id --stable`, loc.step6.checkingPatchID]);
          
          setTimeout(() => {
            const isMutated = wizard.selectedCommits.length < commits.length;
            const patchRes = isMutated ? 'mutated' : 'passed';
            const patchMsg = isMutated 
              ? loc.step6.patchLoss
              : loc.step6.patchOk.replace('{backupBranch}', wizard.backupBranchName || 'backup');
            
            setVerifyResults(prev => ({ ...prev, patchId: patchRes }));
            setVerifyLogs(prev => [...prev, isMutated ? `⚠️ [WARN] ` + patchMsg : `✓ [PASS] ` + patchMsg]);
            
            // Step 3: Compile & Unit check (takes another 1200ms)
            setTimeout(() => {
              setVerifyLogs(prev => [...prev, `$ npm run lint -- --max-warnings=0 && npm run build`, loc.step6.runningUnitTests]);
              
              setTimeout(() => {
                setVerifyResults(prev => ({ ...prev, tests: 'passed' }));
                setVerifyLogs(prev => [...prev, `✓ [PASS] ` + loc.step6.testsOk, `🎉 VERIFICATION COMPLETED SUCCESSFULLY!`]);
                setVerifyStatus('completed');
              }, 1200);
            }, 500);
          }, 1000);
        }, 500);
      }, 600);
    }, 400);
  };

  // Handle commit checkbox toggle
  const handleToggleCommit = (sha: string) => {
    const isSelected = wizard.selectedCommits.includes(sha);
    const updated = isSelected 
      ? wizard.selectedCommits.filter(s => s !== sha) 
      : [...wizard.selectedCommits, sha];
    onUpdateWizard({ selectedCommits: updated });
  };

  // Auto-select all commits on step 2 transition by default
  const hasSelectedAllForStep2 = React.useRef(false);

  React.useEffect(() => {
    if (wizard.step !== 2) {
      hasSelectedAllForStep2.current = false;
    } else if (wizard.step === 2 && !hasSelectedAllForStep2.current && commits.length > 0) {
      const allSha = commits.map(c => c.sha);
      onUpdateWizard({ selectedCommits: allSha });
      hasSelectedAllForStep2.current = true;
    }
  }, [wizard.step, commits, onUpdateWizard]);

  const handleApplyTemplate = (prefix: string) => {
    const rawMsg = localFinalMsg.includes(':') 
      ? localFinalMsg.split(':')[1].trim() 
      : localFinalMsg;
    const combined = `${prefix}: ${rawMsg}`;
    setLocalFinalMsg(combined);
    onUpdateWizard({ finalMsg: combined });
  };

  // Steps headers for wizard dashboard
  const stepHeaders = loc.steps;

  const activeHeader = stepHeaders[wizard.step];

  const isLight = theme === 'light';

  if (isCollapsed) {
    return (
      <div id="wizard-panel-collapsed" className={`border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-900 text-slate-305'}`}>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="font-bold uppercase tracking-wider">{translate('dash_title', tone, undefined, useEmoji)} STATE MACHINE WIZARD</span>
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
    <div id="rebase-wizard-card" className={`border rounded-xl p-6 shadow-2xl transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-xl' : 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-2xl'}`}>
      {/* Header Wizard Info */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 mb-5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border transition-all ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
            <Cpu className="w-5 h-5 animate-spin-reverse" />
          </div>
          <div>
            <h2 className={`text-sm font-black uppercase font-mono tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>{translate('dash_title', tone, undefined, useEmoji)}</span>
              <span>STATE MACHINE WIZARD</span>
            </h2>
            <p className={`text-xs font-sans mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {loc.step} {wizard.step + 1}/7: <span className="text-indigo-600 font-mono font-bold">{activeHeader?.label}</span> — {activeHeader?.desc}
            </p>
          </div>
        </div>

        {/* Actions (Restart and Collapse) */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {wizard.step > 0 && (
            <button
              onClick={onResetWizard}
              className="text-xs text-rose-405 hover:text-rose-300 font-mono flex items-center gap-1 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 px-2.5 py-1.5 rounded transition-all cursor-pointer"
            >
              {loc.abortBtn}
            </button>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded transition-all text-xs flex items-center gap-1 font-mono cursor-pointer border shrink-0 ${
              isLight 
                ? 'bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200 hover:text-slate-900' 
                : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-305'
              }`}
            title={tone === TranslationTone.ENGLISH ? 'Collapse Panel' : 'Thu gọn Panel'}
          >
            <EyeOff className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Progress timeline navigation circles */}
      <div className={`flex justify-between items-center p-3 rounded-xl border mb-6 gap-1 select-none overflow-x-auto ${isLight ? 'bg-slate-50 border-slate-150' : 'bg-slate-950 border-slate-900'}`}>
        {stepHeaders.map((hdr, idx) => {
          const isPassed = idx < wizard.step;
          const isActive = idx === wizard.step;
          return (
            <div key={idx} className="flex items-center gap-1.5 min-w-fit flex-grow justify-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border transition-all ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-500/20 shadow-indigo-600/20 scale-105' 
                    : isPassed 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' 
                      : isLight
                        ? 'bg-slate-200 border-slate-300 text-slate-500'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : idx}
              </div>
              <span className={`text-[10px] font-mono font-medium hidden md:inline ${
                isActive 
                  ? 'text-indigo-600 font-bold' 
                  : isPassed 
                    ? 'text-emerald-600' 
                    : 'text-slate-500'
              }`}>
                {hdr.label}
              </span>
              {idx < stepHeaders.length - 1 && (
                <span className={`hidden md:inline ${isLight ? 'text-slate-300' : 'text-slate-800'}`}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sếp Low-tech Analogy Banner */}
      {currentAnalogy && (
        <div id="low-tech-analogy-drawer" className={`mb-5 border rounded-xl overflow-hidden ${
          isLight
            ? 'border-amber-200 bg-amber-500/[0.01]'
            : 'border-amber-500/25 bg-amber-500/[0.02]'
        }`}>
          <button
            type="button"
            onClick={() => setShowAnalogy(!showAnalogy)}
            className={`w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r transition-all text-left text-xs font-mono font-bold border-b cursor-pointer ${
              isLight
                ? 'from-amber-500/5 to-indigo-500/5 hover:from-amber-500/10 hover:to-indigo-500/10 text-amber-800 border-amber-200 bg-amber-50/20'
                : 'from-amber-500/10 to-indigo-500/5 hover:from-amber-500/25 hover:to-indigo-500/10 text-amber-400 border-amber-500/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500/10 animate-pulse" />
              <span>
                {tone === TranslationTone.ENGLISH 
                  ? "💡 SIMPLIFIED GUIDE FOR NON-TECH LEADERS" 
                  : "💡 GIẢI THÍCH SIÊU DỄ HIỂU CHO SẾP LOW-TECH"}
              </span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-slate-950 border-slate-900 text-slate-400'
            }`}>
              {showAnalogy 
                ? (tone === TranslationTone.ENGLISH ? "Collapse ▲" : "Thu gọn ▲") 
                : (tone === TranslationTone.ENGLISH ? "Read Analogy ▼" : "Xem ví dụ ▼")}
            </span>
          </button>
          
          <AnimatePresence initial={false}>
            {showAnalogy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`p-4 border-t text-xs leading-relaxed ${
                  isLight
                    ? 'bg-amber-500/[0.02] border-amber-200 text-slate-700'
                    : 'bg-slate-950/80 border-slate-950 text-slate-400'
                }`}>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xl shrink-0">✨</span>
                    <div>
                      <h4 className={`text-[13px] font-sans font-bold mb-1 flex items-center gap-1.5 ${
                        isLight ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        {currentAnalogy.title}
                      </h4>
                      <p className={`italic font-medium font-sans ${
                        isLight ? 'text-amber-700' : 'text-amber-200'
                      }`}>
                        &ldquo;{currentAnalogy.analogy}&rdquo;
                      </p>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3 mt-3 border-t ${
                    isLight ? 'border-amber-200/50' : 'border-slate-900/60'
                  }`}>
                    <div className={isLight ? 'text-slate-600 font-sans' : 'text-slate-400 font-sans'}>
                      <strong className="text-indigo-600 font-mono block text-[10px] uppercase tracking-wider mb-0.5 font-bold">
                        {tone === TranslationTone.ENGLISH ? "How it works" : "Ứng dụng thực tế"}
                      </strong>
                      {currentAnalogy.realLife}
                    </div>
                    <div className={`border p-2.5 rounded-lg font-sans ${
                      isLight 
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-900' 
                        : 'bg-indigo-950/20 border-indigo-900/40 text-slate-300'
                    }`}>
                      <strong className={`font-mono block text-[10px] uppercase tracking-wider mb-0.5 font-bold ${
                        isLight ? 'text-indigo-700' : 'text-emerald-400'
                      }`}>
                        {tone === TranslationTone.ENGLISH ? "Expert tip" : "Lời khuyên kỹ thuật"}
                      </strong>
                      {currentAnalogy.tip}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* STEP INTERACTIVE CONTENTS */}
      <div className="min-h-72 mb-6 text-left">
        {/* Step 0: Set / Select Base Branch */}
        {wizard.step === 0 && (
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-600' 
                : 'bg-slate-950 border border-slate-900 text-slate-400'
            }`}>
              <span className={`font-mono block font-bold mb-1.5 uppercase text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-805' : 'text-slate-200'}`}>
                <GitBranch className="w-4 h-4 text-sky-500" /> {loc.step0.title}
              </span>
              <p className="mb-2">{loc.step0.desc}</p>
              
              <div className={`flex gap-2 flex-wrap mt-2.5 pt-2.5 border-t text-[10px] font-mono ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'
              }`}>
                <span className="self-center font-bold mr-1 text-slate-450">{tone === TranslationTone.ENGLISH ? "❓ Terms:" : "❓ Thuật ngữ:"}</span>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "The master integration branch of the project (usually develop or main)." : "Nhánh mẹ dọn dẹp chứa code chung ổn định của cả dự án. Thường là main hoặc develop."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-950 text-slate-400 border border-slate-900 hover:text-slate-300'
                  }`}>Base Branch</span>
                </Tooltip>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "A snapshot package saving your incremental code updates accompanied by a description statement." : "Một gói lưu lại tiến độ chỉnh sửa code kèm theo lời nhắn tự thuật ngắn gọn."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-950 text-slate-400 border border-slate-900 hover:text-slate-300'
                  }`}>Commits</span>
                </Tooltip>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "Aligning your timeline on top of upstream's latest updates to avoid coding anomalies." : "Gắn sáp nhập dòng code mọc nhánh của bạn đè lên đỉnh mới nhất của nhánh gốc để tránh gãy code."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                      : 'bg-slate-950 text-indigo-400 border border-indigo-950 hover:text-indigo-300'
                  }`}>Rebase</span>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] font-mono text-slate-500 uppercase">{loc.step0.inputLabel}</label>
              <input
                type="text"
                value={wizard.baseBranch}
                onChange={(e) => onUpdateWizard({ baseBranch: e.target.value })}
                className={`w-full px-3 py-2 text-xs font-mono rounded-lg outline-none transition-colors border ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                    : 'bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-slate-700'
                }`}
                placeholder="develop"
              />
            </div>

            {/* Real-time Validation for Base Branch Remote Existence */}
            {(() => {
              if (!repoState?.branches || repoState.branches.length === 0) return null;
              const inputVal = (wizard.baseBranch || '').trim();
              if (!inputVal) return null;

              const matchedBranch = repoState.branches.find(
                b => b.name.toLowerCase() === inputVal.toLowerCase()
              );
              const existsOnRemote = !!matchedBranch?.isRemote;

              if (!existsOnRemote) {
                const existsLocally = !!matchedBranch?.isLocal;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-450 text-[11px] leading-normal font-sans"
                  >
                    <div className="flex items-center gap-1.5 font-mono font-bold uppercase text-[9.5px] text-rose-500 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse shrink-0" />
                      <span>
                        {tone === TranslationTone.ENGLISH 
                          ? 'REMOTE BRANCH MISSING' 
                          : 'NHÁNH MẸ CHƯA LÊN REMOTE'}
                      </span>
                    </div>
                    {existsLocally ? (
                      tone === TranslationTone.ENGLISH 
                        ? `The branch "${inputVal}" exists locally but has not been pushed to remote origin. A remote trace is mandatory.` 
                        : `Nhánh "${inputVal}" chỉ tồn tại ở máy cục bộ của sếp chứ chưa được đẩy lên Remote Origin. Cần có nhánh trên Server để rebase an toàn.`
                    ) : (
                      tone === TranslationTone.ENGLISH 
                        ? `The branch "${inputVal}" was not found locally or remotely in this repository.` 
                        : `Không tìm thấy nhánh nào tên là "${inputVal}" cả cục bộ lẫn trên Server remote.`
                    )}
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {tone === TranslationTone.ENGLISH 
                      ? '✓ Branch active & fully tracked on Remote Origin.' 
                      : '✓ Nhánh khả dụng & đã liên kết hoàn toàn trên Remote Origin.'}
                  </span>
                </motion.div>
              );
            })()}

            <div className="mt-2 text-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1.5">{loc.step0.techRecommend}</span>
              <div className="flex gap-2">
                {['develop', 'main', 'master', 'dev'].map((branchSuggestion) => (
                  <button
                    key={branchSuggestion}
                    onClick={() => onUpdateWizard({ baseBranch: branchSuggestion })}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                      wizard.baseBranch === branchSuggestion
                        ? isLight
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                          : 'bg-indigo-500/15 border-indigo-500/60 text-indigo-300 font-bold'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌱 {branchSuggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Sync / Fetch with Origin */}
        {wizard.step === 1 && (
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border border-slate-900 text-slate-400'}`}>
              <span className={`font-mono block font-bold mb-1.5 uppercase text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <RefreshCw className="w-4 h-4 text-emerald-400" /> {loc.step1.title}
              </span>
              <p className="mb-2">{loc.step1.desc}</p>
              
              <div className={`flex gap-2 flex-wrap mt-2.5 pt-2.5 border-t text-[10px] font-mono ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'}`}>
                <span className="self-center font-bold mr-1 text-slate-450">{tone === TranslationTone.ENGLISH ? "❓ Terms:" : "❓ Thuật ngữ:"}</span>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "Downloads tracking pointers and changes safely from the centralized server without moving your local workspace." : "Lệnh tải các bản ghi chép mới nhất từ server chung về máy của bạn để biết ai đã sửa những gì. Cực kỳ an toàn, không sợ mất code."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}>git fetch</span>
                </Tooltip>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "The original public hub hosting the master project files (e.g. GitHub, GitLab)." : "Danh xưng chỉ kho lưu trữ chung trên mây của cả đội (như GitHub, GitLab). Từ đó đồng nghiệp tải xuống mã chung."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}>Origin / Remote</span>
                </Tooltip>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => onUpdateWizard({ doFetch: true })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  wizard.doFetch 
                    ? isLight 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                      : 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300' 
                    : isLight 
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300' 
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className={`font-bold text-xs font-mono uppercase mb-1 ${wizard.doFetch ? (isLight ? 'text-emerald-800' : 'text-emerald-355') : (isLight ? 'text-slate-600' : 'text-slate-450')}`}>{loc.step1.syncYes}</div>
                <div className={`text-[11px] font-sans ${wizard.doFetch ? (isLight ? 'text-emerald-700/80' : 'text-emerald-400/80') : (isLight ? 'text-slate-400' : 'text-slate-500')}`}>{loc.step1.syncYesDesc}</div>
              </button>

              <button
                onClick={() => onUpdateWizard({ doFetch: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all ${
                  !wizard.doFetch 
                    ? isLight 
                      ? 'bg-amber-50 border-amber-305 text-amber-800' 
                      : 'bg-amber-500/10 border-amber-400/50 text-amber-300' 
                    : isLight 
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300' 
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className={`font-bold text-xs font-mono uppercase mb-1 ${!wizard.doFetch ? (isLight ? 'text-amber-800' : 'text-amber-355') : (isLight ? 'text-slate-600' : 'text-slate-450')}`}>{loc.step1.syncNo}</div>
                <div className={`text-[11px] font-sans ${!wizard.doFetch ? (isLight ? 'text-amber-700/80' : 'text-amber-400/80') : (isLight ? 'text-slate-400' : 'text-slate-500')}`}>{loc.step1.syncNoDesc}</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: History Analysis & Commit Squash Checklist */}
        {wizard.step === 2 && (
          <div className="flex flex-col gap-5">
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-center gap-3.5 ${
              isLight 
                ? 'bg-indigo-50/40 border-indigo-100 text-slate-600' 
                : 'bg-slate-950 border border-slate-900 text-slate-400'
            }`}>
              <Zap className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <strong className={isLight ? 'text-slate-800' : 'text-slate-205'}>{loc.step2.title}</strong> {loc.step2.desc.replace('{baseBranch}', wizard.baseBranch).replace('{commitsLength}', commits.length)}
                <div className="mt-1 text-[11px] text-slate-500">
                  💡 <span className={`font-semibold ${isLight ? 'text-amber-600' : 'text-amber-450'}`}>{tone === TranslationTone.ENGLISH ? "Drag-and-Drop Enabled:" : "Hỗ trợ kéo thả:"}</span> {tone === TranslationTone.ENGLISH ? "Drag cards between panels to squash/exclude, or drag vertical order to reschedule commits!" : "Kéo thả giữa 2 bảng để nén/loại trừ, hoặc kéo lên/xuống để thay đổi thứ tự thời gian của commit!"}
                </div>
              </div>
            </div>

            {/* Selection control bars */}
            <div className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-[11px] font-mono leading-relaxed ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-605' 
                : 'bg-slate-900/40 border border-slate-900/60 text-slate-400'
            }`}>
              <span className="text-slate-400 font-medium">
                <Tooltip text={tone === TranslationTone.ENGLISH ? "Selected commits represent modifications that will be merged into a single clean block." : "Số lượng các lưu nháp sẽ được nén dồn vào làm một gói duy nhất."}>
                  {loc.step2.selectedCount.replace('{count}', wizard.selectedCommits.length).replace('{total}', commits.length)}
                </Tooltip>
              </span>
              <div className="flex items-center gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    const allSha = commits.map(c => c.sha);
                    onUpdateWizard({ selectedCommits: allSha });
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-600 hover:bg-indigo-550 text-white transition-all cursor-pointer"
                >
                  {loc.step2.selectAll}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateWizard({ selectedCommits: [] });
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all cursor-pointer ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {loc.step2.deselectAll}
                </button>
              </div>
            </div>

            {wizard.selectedCommits.length < commits.length && wizard.selectedCommits.length > 0 && (
              <div className="bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-xl text-[11px] leading-relaxed flex gap-2.5 transition-all duration-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="font-sans">
                  {loc.step2.warningNote}
                </div>
              </div>
            )}

            {commits.length >= 20 && (
              <div className="bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-250 p-3.5 rounded-xl text-[11px] leading-relaxed flex gap-2.5 transition-all duration-300 shadow-md">
                <span className="text-xl animate-bounce shrink-0 mt-0.5 select-none text-[32px] md:text-[40px] leading-none mb-1">🔥</span>
                <div className="font-sans flex flex-col justify-center">
                  <span className="text-red-400 font-bold uppercase tracking-wider font-mono text-[10px] mb-1 block">
                    {tone === TranslationTone.ENGLISH ? "🔥 EPIC COMMIT FLOOD DETECTED (EASTER EGG)" : "🔥 BÃO COMMITS QUÁ TẢI (EASTER EGG)"}
                  </span>
                  <p className="font-medium text-red-200">
                    {translate('ee_spam_commit', tone, { count: commits.length })}
                  </p>
                </div>
              </div>
            )}

            {/* Split Screen Drag-and-Drop dual panel system */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Zone: SQUASH PILE */}
              <div 
                className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all ${
                  isDragOverSquash
                    ? isLight
                      ? 'bg-indigo-50/50 border-indigo-400 border-dashed shadow-md scale-[1.01]'
                      : 'bg-indigo-950/20 border-indigo-400 border-dashed shadow-lg shadow-indigo-505/10 scale-[1.01]'
                    : isLight
                      ? 'bg-slate-50/55 border-slate-205 border-dashed'
                      : 'bg-[#0b0c15] border-slate-850 border-dashed'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverSquash(true);
                }}
                onDragLeave={() => setIsDragOverSquash(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverSquash(false);
                  const sha = e.dataTransfer.getData('text/plain') || draggingSha;
                  if (sha) {
                    // Include in squash range
                    if (!wizard.selectedCommits.includes(sha)) {
                      onUpdateWizard({ selectedCommits: [...wizard.selectedCommits, sha] });
                    }
                  }
                }}
              >
                <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-900'}`}>
                  <Tooltip text={tone === TranslationTone.ENGLISH ? "Commits in this pile will be squashed and combined into a single clean commit." : "Các commit trong cột này sẽ được dồn nén lại thành một commit duy nhất, giúp lịch sử sạch đẹp."}>
                    <span className={`text-xs font-bold tracking-wider flex items-center gap-1.5 font-sans ${isLight ? 'text-indigo-650' : 'text-indigo-400'}`}>
                      <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'fill-indigo-500/10 text-indigo-550' : 'fill-indigo-400/20'}`} />
                      <span>{tone === TranslationTone.ENGLISH ? "📦 SQUASH (KEEP & COMBINE)" : "📦 NÉN & SÁP NHẬP (SQUASH)"}</span>
                    </span>
                  </Tooltip>
                  <span className={`border text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'}`}>
                    {orderedCommits.filter(c => wizard.selectedCommits.includes(c.sha)).length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 min-h-24 justify-start">
                  {orderedCommits.filter(c => wizard.selectedCommits.includes(c.sha)).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-600 border border-dashed border-slate-800/40 rounded-xl space-y-2 mt-2 h-full">
                      <span className="text-xl">🎁</span>
                      <p className="text-[11px] font-sans">
                        {tone === TranslationTone.ENGLISH 
                          ? "Drag & drop commits here to squash them!" 
                          : "Kéo thả sớ commits từ bên phải qua thả vào đây để nén dồn!"}
                      </p>
                    </div>
                  ) : (
                    orderedCommits
                      .filter(c => wizard.selectedCommits.includes(c.sha))
                      .map((commit, idx, arr) => {
                        return (
                          <div
                            key={commit.sha}
                            draggable
                            onDragStart={(e) => handleDragStart(e, commit.sha, 'squash')}
                            onDragEnd={handleDragEnd}
                            className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-grab active:cursor-grabbing ${
                              isLight
                                ? 'bg-white border-slate-205 hover:border-indigo-400 text-slate-800 hover:bg-slate-50/50'
                                : 'bg-slate-900/60 border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 w-[75%]">
                              {/* Draggable dots indicators */}
                              <div className={`font-mono text-[10px] space-y-0.5 select-none font-bold mr-1 shrink-0 ${isLight ? 'text-slate-350' : 'text-slate-600'}`}>
                                ░
                              </div>
                              <span className={`font-semibold font-mono shrink-0 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{commit.sha}</span>
                              <span className={`truncate font-sans font-medium ${isLight ? 'text-slate-700' : 'text-slate-205'}`} title={commit.message}>{commit.message}</span>
                            </div>

                            {/* Easy Sorting Arrow icons and action button fallback */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex flex-col">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveUp(commit.sha)}
                                    title={tone === TranslationTone.ENGLISH ? "Move commit earlier" : "Đẩy commit lên trước (lùi dòng thời gian)"}
                                    className="p-0.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                )}
                                {idx < arr.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveDown(commit.sha)}
                                    title={tone === TranslationTone.ENGLISH ? "Move commit later" : "Đẩy commit lùi lại (tiến dòng thời gian)"}
                                    className="p-0.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateWizard({ selectedCommits: wizard.selectedCommits.filter(s => s !== commit.sha) });
                                }}
                                title={tone === TranslationTone.ENGLISH ? "Exclude from squash" : "Loại bỏ khỏi nén"}
                                className={`px-1.5 py-0.5 text-[10px] rounded font-sans font-medium border transition-all cursor-pointer ${
                                  isLight
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                    : 'bg-rose-950/40 border border-rose-900/30 text-rose-405 hover:bg-rose-900/40 hover:text-rose-300'
                                }`}
                              >
                                ✕ Skip
                              </button>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Right Zone: EXCLUDE/DROP PILE */}
              <div 
                className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all ${
                  isDragOverExclude
                    ? isLight
                      ? 'bg-rose-50/50 border-rose-400 border-dashed shadow-md scale-[1.01]'
                      : 'bg-rose-950/20 border-rose-500/50 border-dashed shadow-lg shadow-rose-500/5 scale-[1.01]'
                    : isLight
                      ? 'bg-slate-50/55 border-slate-205 border-dashed'
                      : 'bg-[#07080f] border-slate-900 border-dashed'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverExclude(true);
                }}
                onDragLeave={() => setIsDragOverExclude(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverExclude(false);
                  const sha = e.dataTransfer.getData('text/plain') || draggingSha;
                  if (sha) {
                    // Exclude from squash range
                    onUpdateWizard({ selectedCommits: wizard.selectedCommits.filter(s => s !== sha) });
                  }
                }}
              >
                <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-205' : 'border-slate-900/60'}`}>
                  <Tooltip text={tone === TranslationTone.ENGLISH ? "Commits in this pile will not be squashed. They are excluded or skipped." : "Các commit trong cột này sẽ được giữ riêng, không tham gia vào tiến trình nén gộp."}>
                    <span className={`text-xs font-bold tracking-wider flex items-center gap-1.5 font-sans ${isLight ? 'text-rose-650' : 'text-rose-455'}`}>
                      <AlertTriangle className={`w-3.5 h-3.5 ${isLight ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span>{tone === TranslationTone.ENGLISH ? "🚫 EXCLUDE (SKIP/DROP COMMITS)" : "🚫 KHÔNG NÉN (LOẠI BỎ / DROP)"}</span>
                    </span>
                  </Tooltip>
                  <span className={`border text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    isLight 
                      ? 'bg-slate-100 border-slate-200 text-slate-600' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}>
                    {orderedCommits.filter(c => !wizard.selectedCommits.includes(c.sha)).length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1 min-h-24 justify-start">
                  {orderedCommits.filter(c => !wizard.selectedCommits.includes(c.sha)).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-700 border border-dashed border-slate-900 rounded-xl space-y-1.5 mt-2 h-full">
                      <span className="text-lg">🎯</span>
                      <p className="text-[10px] font-sans">
                        {tone === TranslationTone.ENGLISH 
                          ? "All commits included in squashing stack!" 
                          : "Tuyệt hảo! Toàn bộ commits đã được lôi đi nén!"}
                      </p>
                    </div>
                  ) : (
                    orderedCommits
                      .filter(c => !wizard.selectedCommits.includes(c.sha))
                      .map((commit) => {
                        return (
                          <div
                            key={commit.sha}
                            draggable
                            onDragStart={(e) => handleDragStart(e, commit.sha, 'exclude')}
                            onDragEnd={handleDragEnd}
                            className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-grab active:cursor-grabbing group opacity-75 hover:opacity-100 ${
                              isLight
                                ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700'
                                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-850 hover:bg-slate-950/80'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 w-[75%]">
                              <div className={`font-mono text-[10px] space-y-0.5 mr-1 shrink-0 select-none ${isLight ? 'text-slate-300' : 'text-slate-800'}`}>
                                ░
                              </div>
                              <span className={`font-mono shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-550'}`}>{commit.sha}</span>
                              <span className={`truncate font-sans font-medium ${isLight ? 'text-slate-650 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-300'}`} title={commit.message}>{commit.message}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                onUpdateWizard({ selectedCommits: [...wizard.selectedCommits, commit.sha] });
                              }}
                              className={`px-2 py-0.5 text-[10px] rounded font-sans font-semibold transition-all cursor-pointer border ${
                                isLight
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                                  : 'bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-900/30 text-indigo-300'
                              }`}
                            >
                              ✓ Squash
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}


        {/* Step 3: Create safe backup branch */}
        {wizard.step === 3 && (
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans relative ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-600' 
                : 'bg-slate-955 border border-slate-900 text-slate-400'
            }`}>
              <span className={`font-mono block font-bold mb-1.5 uppercase text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <ShieldAlert className="w-4 h-4 text-indigo-400 animate-pulse" /> {loc.step3.title}
              </span>
              <p className="mb-2">{loc.step3.desc.replace('{backupBranchName}', wizard.backupBranchName)}</p>
              
              <div className={`flex gap-2 flex-wrap mt-2.5 pt-2.5 border-t text-[10px] font-mono ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'}`}>
                <span className="self-center font-bold mr-1 text-slate-450">{tone === TranslationTone.ENGLISH ? "❓ Terms:" : "❓ Thuật ngữ:"}</span>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "An isolated replica clone of your working line to rollback safely in case anything goes wrong." : "Bản sao chụp clone lại nguyên vẹn trạng thái code của bạn lúc này. Nếu nén code bị lỗi hay mất dòng, khôi phụ lại trong 3 giây."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-605 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}>{tone === TranslationTone.ENGLISH ? "Backup Branch" : "Nhánh sao lưu"}</span>
                </Tooltip>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "The specific point inside the git history representing your current local workspace timeline." : "Con trỏ vô hình đánh dấu toa tàu đầu tiên mà bạn đang đứng gõ code ghi nhận sửa đổi."}>
                  <span className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 text-slate-605 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}>HEAD Pointer</span>
                </Tooltip>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <div 
                onClick={() => onUpdateWizard({ doBackup: true })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  wizard.doBackup 
                    ? isLight
                      ? 'bg-indigo-50 border-indigo-305 text-indigo-800 font-semibold'
                      : 'bg-indigo-500/10 border-indigo-400/50 text-indigo-300' 
                    : isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                <div className={`font-bold text-xs font-mono uppercase mb-1 ${wizard.doBackup ? (isLight ? 'text-indigo-700' : 'text-indigo-400') : (isLight ? 'text-slate-600' : 'text-slate-450')}`}>{loc.step3.backupYes}</div>
                <div className={`text-[11px] font-sans ${wizard.doBackup ? (isLight ? 'text-indigo-600/80' : 'text-slate-400') : (isLight ? 'text-slate-400' : 'text-slate-500')}`}>{loc.step3.backupYesDesc}</div>
              </div>

              <div 
                onClick={() => onUpdateWizard({ doBackup: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  !wizard.doBackup 
                    ? isLight
                      ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold'
                      : 'bg-rose-500/10 border-rose-400/50 text-rose-300' 
                    : isLight
                      ? 'bg-white border-slate-205 text-slate-600 hover:border-slate-300'
                      : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                <div className={`font-bold text-xs font-mono uppercase mb-1 ${!wizard.doBackup ? (isLight ? 'text-rose-700' : 'text-rose-400') : (isLight ? 'text-slate-600' : 'text-slate-455')}`}>{loc.step3.backupNo}</div>
                <div className={`text-[11px] font-sans ${!wizard.doBackup ? (isLight ? 'text-rose-600/80' : 'text-slate-400') : (isLight ? 'text-slate-405' : 'text-slate-500')}`}>{loc.step3.backupNoDesc}</div>
              </div>
            </div>

            {wizard.doBackup && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase">{loc.step3.inputLabel}</label>
                <input
                  type="text"
                  value={wizard.backupBranchName}
                  onChange={(e) => onUpdateWizard({ backupBranchName: e.target.value })}
                  className={`w-full border px-3 py-1.5 text-xs font-mono rounded outline-none transition-colors ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800 focus:border-indigo-505'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 focus:border-indigo-500'
                  }`}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Rebase Run & Progress Breakpoints */}
        {wizard.step === 4 && (
          <div className="flex flex-col gap-4 text-center py-6 animate-fade-in">
            {wizard.status === 'idle' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className={`text-xs font-sans max-w-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {loc.step4.idleDesc}
                </div>
                <button
                  onClick={onExecuteWizardRebase}
                  className="bg-indigo-600 hover:bg-indigo-550 text-white font-mono text-xs font-bold px-6 py-3 rounded-lg border border-indigo-500/10 shadow-lg active:scale-95 transition-all animate-bounce cursor-pointer"
                >
                  {loc.step4.idleBtn}
                </button>
              </div>
            )}

            {wizard.status === 'running' && (
              <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="text-indigo-500 text-xs font-mono font-semibold">
                  {loc.step4.runningTitle}
                </div>
                {/* Visual Fake Progress Bar */}
                <div className={`w-full max-w-sm rounded-full h-3.5 overflow-hidden p-0.5 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border border-slate-900'}`}>
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 animate-pulse" style={{ width: '45%' }}></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono italic">
                  $ git checkout -b {wizard.backupBranchName || 'backup'} && git rebase -i {wizard.baseBranch || 'main'}
                </div>
              </div>
            )}

            {wizard.status === 'paused_conflict' && (
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="text-amber-500 text-xs font-mono font-bold uppercase animate-pulse">
                  {loc.step4.pausedTitle}
                </div>
                <div className={`text-xs font-sans max-w-md rounded-lg p-3 mx-auto leading-relaxed mt-2 text-left border ${
                  isLight
                    ? 'bg-amber-50 border-amber-250 text-amber-950'
                    : 'bg-rose-500/10 border border-rose-500/20 text-[#bfdbfe]'
                }`}>
                  {loc.step4.pausedDesc}
                </div>
                <span className="text-3xl mt-2 animate-bounce">🚧</span>
              </div>
            )}

            {wizard.status === 'completed' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-emerald-505 font-bold font-mono text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-1.5 inline animate-pulse" />
                  {loc.step4.completedTitle}
                </div>
                <span className="text-4xl animate-bounce">🎉🏆</span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Combined commit message editor */}
        {wizard.step === 5 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed font-sans ${
              isLight 
                ? 'bg-slate-50 border-slate-205 text-slate-650' 
                : 'bg-slate-955 border border-slate-900 text-slate-400'
            }`}>
              <span className={`font-mono block font-bold mb-1 uppercase text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-205'}`}>
                <Edit3 className="w-4 h-4 text-sky-400" /> {loc.step5.title}
              </span>
              {loc.step5.desc}
            </div>

            {/* Prefix suggestions */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: 'feat', detail: loc.step5.prefixes.feat },
                { label: 'fix', detail: loc.step5.prefixes.fix },
                { label: 'refactor', detail: loc.step5.prefixes.refactor },
                { label: 'docs', detail: loc.step5.prefixes.docs },
                { label: 'chore', detail: loc.step5.prefixes.chore }
              ].map((prefix) => (
                <button
                  key={prefix.label}
                  onClick={() => handleApplyTemplate(prefix.label)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                    isLight
                      ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      : 'border-slate-800 text-slate-300 bg-slate-900 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                  title={prefix.detail}
                >
                  <span className="text-yellow-600 font-bold">{prefix.label}:</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <textarea
                value={localFinalMsg || ''}
                onChange={(e) => {
                  setLocalFinalMsg(e.target.value);
                  onUpdateWizard({ finalMsg: e.target.value });
                }}
                rows={4}
                className={`w-full border p-3 font-mono text-xs rounded-lg outline-none focus:border-indigo-500 leading-relaxed transition-colors ${
                  isLight
                    ? 'bg-white border-slate-220 text-slate-800 focus:border-indigo-505'
                    : 'bg-slate-950 border border-slate-850 text-slate-200 focus:border-indigo-500'
                }`}
                placeholder="feat: some awesome things worked out nicely"
              />
            </div>
          </div>
        )}

        {/* Step 6: Verify Rebase Integrity Checking */}
        {wizard.step === 6 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-slate-955 border border-slate-900 text-slate-400'
            }`}>
              <span className={`font-mono block font-bold mb-1 uppercase text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {loc.step6.title}
              </span>
              {loc.step6.desc}
            </div>

            {verifyStatus === 'idle' && (
              <div className={`flex flex-col items-center justify-center py-6 border border-dashed rounded-xl gap-3 ${
                isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-805 bg-slate-950/20'
              }`}>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full animate-bounce">
                  <Cpu className="w-6 h-6" />
                </div>
                <button
                  onClick={runVerification}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-mono font-bold text-xs rounded-lg shadow-md active:scale-95 transition-all cursor-pointer border border-indigo-505/10 uppercase"
                >
                  {loc.step6.runBtn}
                </button>
              </div>
            )}

            {verifyStatus === 'running' && (
              <div className={`flex flex-col gap-3 p-4 border rounded-xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border border-slate-900'
              }`}>
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loc.step6.running}</span>
                </div>
                <div className={`font-mono text-[10px] leading-relaxed space-y-1 max-h-48 overflow-y-auto p-3 rounded-lg border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-650'
                    : 'bg-slate-1000 border border-slate-900/50 text-slate-400'
                }`}>
                  {verifyLogs.map((log, i) => (
                    <div key={i} className={`p-0.5 ${log.startsWith('$') ? 'text-indigo-500 font-bold' : log.startsWith('✓') ? 'text-emerald-555 font-semibold' : log.startsWith('⚠️') ? 'text-amber-500 font-semibold' : log.startsWith('❌') ? 'text-rose-500' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (verifyLogs.length / 8) * 100)}%` }}></div>
                </div>
              </div>
            )}

            {verifyStatus === 'completed' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Scorecard checklist box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950 border border-slate-900'}`}>
                    <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-md border border-emerald-500/20 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <Tooltip text={tone === TranslationTone.ENGLISH ? "Checks if your local branch is strictly leading, or has fallen behind remote updates." : "Xem nhánh local có đang dẫn đầu tuyệt đối hay bị tụt hậu chậm trễ so với server."}>
                        <div className={`font-mono font-bold uppercase select-none tracking-wider text-[9px] mb-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Ahead/Behind</div>
                      </Tooltip>
                      <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>{loc.step6.aheadOk}</div>
                    </div>
                  </div>

                  <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950 border border-slate-900'}`}>
                    <div className={`p-1.5 rounded-md border mt-0.5 shrink-0 ${verifyResults.patchId === 'mutated' ? 'text-amber-505 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                      {verifyResults.patchId === 'mutated' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[11px] leading-tight">
                      <Tooltip text={tone === TranslationTone.ENGLISH ? "Validates logic preservation. Ensures code modifications are identical before and after squash." : "Đối chiếu cấu trúc dòng mã nguồn xem rebase tự động có làm mất mát dòng code nào của bạn hay không."}>
                        <div className={`font-mono font-bold uppercase select-none tracking-wider text-[9px] mb-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Patch-ID integrity</div>
                      </Tooltip>
                      <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        {verifyResults.patchId === 'mutated' ? loc.step6.patchLoss : loc.step6.patchOk.replace('{backupBranch}', wizard.backupBranchName || 'backup')}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950 border border-slate-900'}`}>
                    <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-md border border-emerald-500/20 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <Tooltip text={tone === TranslationTone.ENGLISH ? "Runs project build tests and syntax parsers to confirm code is 100% sound." : "Hệ thống tự động biên dịch thử dự án và linter, đảm bảo không dính các lỗi cú pháp."}>
                        <div className={`font-mono font-bold uppercase select-none tracking-wider text-[9px] mb-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Build & Tests</div>
                      </Tooltip>
                      <div className={isLight ? 'text-slate-600' : 'text-slate-400'}>{loc.step6.testsOk}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-xs mt-1">
                  <span className="text-slate-400 font-mono font-bold text-[10px] flex items-center gap-1 uppercase select-none">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> {loc.step6.summaryTitle} <span className="text-emerald-400 font-black">PASSED</span>
                  </span>
                  <button
                    onClick={runVerification}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-slate-300 font-mono text-[10px] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {loc.step6.reRunBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Push option / complete */}
        {wizard.step === 7 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <GitPullRequest className="w-4 h-4 text-purple-400 animate-pulse" /> {loc.step7.title}
              </span>
              <p className="mb-2">{loc.step7.desc}</p>
              <div className="flex gap-2 flex-wrap mt-2.5 pt-2.5 border-t border-slate-900 text-[10px] text-slate-500 font-mono font-normal">
                <span className="self-center font-bold mr-1 text-slate-450">{tone === TranslationTone.ENGLISH ? "❓ Terms:" : "❓ Thuật ngữ:"}</span>
                <Tooltip text={tone === TranslationTone.ENGLISH ? "Safely overwrites remote commit history only if nobody else pushed to the same branch." : "Lực lượng đẩy đè an toàn: Đẩy đè nhật ký code mới lên máy chủ với điều kiện duy nhất là không có ai khác đã lẻn push code mọc sừng đè lên đầu."}>
                  <span className="px-2 py-0.5 rounded bg-slate-900 hover:text-slate-300 text-slate-400 border border-slate-800 transition-colors">force-with-lease</span>
                </Tooltip>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => onUpdateWizard({ autoPush: true })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  wizard.autoPush 
                    ? 'bg-purple-500/10 border-purple-400/50 text-purple-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step7.pushYes}</div>
                <div className="text-[11px] text-slate-500 font-sans">{loc.step7.pushYesDesc}</div>
              </button>

              <button
                onClick={() => onUpdateWizard({ autoPush: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  !wizard.autoPush 
                    ? 'bg-amber-500/10 border-amber-400/50 text-amber-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step7.pushNo}</div>
                <div className="text-[11px] text-slate-505 font-sans">{loc.step7.pushNoDesc}</div>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER WIZARD CONTROLS */}
      <div className={`flex justify-between items-center border-t pt-4 mt-4 ${isLight ? 'border-slate-205' : 'border-slate-900'}`}>
        {/* Previous Button */}
        {wizard.step > 0 && wizard.step !== 4 && (
          <button
            onClick={() => onUpdateWizard({ step: wizard.step - 1 })}
            title={loc.prevStepBtn}
            className={`p-2.5 rounded-lg border cursor-pointer active:scale-95 transition-all font-mono flex items-center justify-center ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                : 'bg-slate-900 text-slate-400 hover:text-slate-205 border border-slate-805'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-grow"></div>

        {/* Transition trigger next step */}
        {(() => {
          const isStep0Invalid = wizard.step === 0 && (() => {
            if (!repoState?.branches || repoState.branches.length === 0) return false;
            const inputVal = (wizard.baseBranch || '').trim();
            if (!inputVal) return true;
            const matchedBranch = repoState.branches.find(
              b => b.name.toLowerCase() === inputVal.toLowerCase()
            );
            return !matchedBranch?.isRemote;
          })();

          const isDisabled = 
            (wizard.step === 4 && wizard.status !== 'completed') || 
            (wizard.step === 6 && verifyStatus === 'running') ||
            isStep0Invalid;

          if (wizard.step < 7) {
            return (
              <button
                id="wizard-next-btn"
                disabled={isDisabled}
                onClick={() => {
                  // Valid checkout list size
                  if (wizard.step === 2 && wizard.selectedCommits.length === 0) {
                    alert(loc.step2.selectAtLeastOne);
                    return;
                  }
                  onUpdateWizard({ step: wizard.step + 1 });
                }}
                title={loc.nextStepBtn}
                className={`p-2.5 rounded-lg border cursor-pointer active:scale-95 transition-all font-mono font-bold flex items-center justify-center ${
                  isDisabled
                    ? isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-955 border-slate-900 text-slate-650 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-550 border-indigo-500/10 text-white shadow-md'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            );
          }
          return null;
        })()}

        {/* Finish Button */}
        {wizard.step === 7 && (
          <button
            id="wizard-finish-btn"
            onClick={() => {
              onUpdateWizard({ status: 'completed' });
              alert(loc.alertDone);
              onResetWizard();
            }}
            className="px-6 py-2.5 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg border border-emerald-500/10 shadow-lg active:scale-95 transition-all font-mono font-bold flex items-center gap-1 animate-pulse cursor-pointer"
          >
            {loc.finishWorkflowBtn}
          </button>
        )}
      </div>
    </div>
  );
}
