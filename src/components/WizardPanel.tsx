/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { Commit, WizardState, TranslationTone } from '../types';
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
      desc: "Phát hiện thấy nhánh của bạn đang đi trước {baseBranch} với tổng số {commitsLength} commits chưa được squash. Hãy tick chọn các commits bạn muốn nén làm một:",
      selectedCount: "* Đã chọn: {count} / {total} commits để nén dọn sạch nhánh.",
      selectAtLeastOne: "Vui lòng chọn ít nhất 1 commit để tiến hành squash!",
      selectAll: "Chọn tất cả",
      deselectAll: "Bỏ chọn tất cả",
      warningNote: "⚠️ Lưu ý quan trọng: Nếu chừa lại một số commit không nén hết, rebase có nguy cơ cao bùng nổ conflict lặp đi lặp lại nhiều lần ứng với từng commit lẻ tẻ. Khuyên dùng: Chọn tất cả lịch sử để dồn nén sạch sẽ tại một điểm duy nhất."
    },
    step3: {
      title: "CHẾ ĐỘ PHÒNG VỆ AN TOÀN (SAFE BACKUP):",
      desc: "Rebase là thao tác viết lại lịch sử có rủi ro nếu nén sai commits. Rebase Overlord sẽ tự động khởi tạo nhánh backup mang tên {backupBranchName} để phòng bị trước. Nếu bạn không vừa lòng sau rebase, có thể khôi phục rùa bò chỉ trong 1 click.",
      backupYes: "🛡️ CÓ, BẢO VỆ TAO (KHOAN KHOÁI)",
      backupYesDesc: "Sao lưu toàn bộ commits an toàn vô điều kiện.",
      backupNo: "💀 ĐÉO CẦN, TAO LÀ DEV LIỀU",
      backupNoDesc: "Bỏ qua sao lưu bước này, chấp nhận mất mát nếu rebase gãy.",
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
      title: "XÁC MINH TOÀN VẸN VÀ KIỂM THỬ CODES (VERIFY REBASE):",
      desc: "Trước khi gửi codes lên GitHub Remote, hệ thống sẽ thực thi các kiểm định chuyên sâu như tính nhất quán của nhánh, so sánh sai lệch Patch-ID, và chạy thử tiến trình build/test dự án để đảm bảo an toàn tuyệt đối.",
      runBtn: "🔍 CHẠY CHẨN ĐOÁN & KIỂM THỬ KẾT QUẢ",
      running: "Hệ thống đang tiến hành chẩn đoán chéo...",
      checkingAheadBehind: "1. Đang kiểm tra Ahead/Behind giữa Local HEAD và Remote {baseBranch}...",
      checkingPatchID: "2. Đang kiểm tra tính toàn vẹn của Patch (Patch-ID)...",
      runningUnitTests: "3. Chạy kiểm thử tự động (Unit Test / Compile build-check)...",
      patchOk: "✓ Thành công: Patch-ID bảo toàn hoàn hảo so với nhánh backup {backupBranch}! Code logic giữ nguyên không bị thất lạc dòng.",
      patchLoss: "⚠️ Cảnh báo sai biệt: Phát hiện Patch-ID của bạn đã biến đổi (do xử lý conflict và thêm/bớt codes). Điều này bình thường nếu bạn đã chủ động sửa tay lúc giải quyết xung đột.",
      aheadOk: "✓ Thành công: Nhánh của bạn hoạt động độc lập đứng trước remote '{baseBranch}' và sẵn sàng push.",
      aheadFail: "❌ Thất bại: Nhánh remote '{baseBranch}' có cập nhật mới chưa được kéo về local. Cần sync trước khi đẩy lên.",
      testsOk: "✓ Đạt chỉ tiêu: Tiến trình debug, build và linter hoàn thành 100% không gặp lỗi cú pháp.",
      testsFail: "❌ Cảnh báo đỏ: Dự án đang gặp lỗi biên dịch sau rebase. Hãy mở terminal kiểm tra lại codes.",
      summaryTitle: "Báo cáo tóm tắt chỉ số an toàn rebase:",
      reRunBtn: "🔄 Tái kiểm tra"
    },
    step7: {
      title: "ĐẨY LÊN GITHUB (AUTO PUSH CHỐT SỔ):",
      desc: "Bạn có muốn Rebase Overlord tự động thực hiện lệnh git push origin HEAD --force-with-lease để đẩy nhánh thẳng lên remote GitHub và hoàn thành PR một cách sạch sẽ không?",
      pushYes: "🚀 CÓ, AUTO PUSH LUÔN THƯỢNG ĐẾ",
      pushYesDesc: "Chốt sổ mạnh mẽ với lực lượng --force-with-lease an toàn.",
      pushNo: "🏁 CHỈ COMMIT LOCAL, CON TỰ PUSH",
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
      { label: 'Thử Lửa', desc: 'Duyệt lại lộc lá code' },
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
      desc: "Sếp có muốn quất nhẹ quả git fetch origin --prune để em dọn bớt mấy cái nhánh ma cổ lỗ sĩ và kéo lộc lá code gốc về máy không? Rebase đỡ trẹo chân ạ.",
      syncYes: "OK, ĐỒNG Ý SYNC (KHUYÊN DÙNG)",
      syncYesDesc: "Dọn rác bớt đi sếp, chần chừ gì.",
      syncNo: "THÔI, KHỎI CẦN",
      syncNoDesc: "Múa offline, hên xui gãy răng ráng chịu nha."
    },
    step2: {
      title: "PHÒNG CHIẾN THUẬT SQUASH COMMITS:",
      desc: "Vãi chưởng, sếp múa tận {commitsLength} commits đi trước {baseBranch}. Chọn ngay các phát súng sếp muốn dồn đạn dập dẹp thành 1 viên duy nhất đi nào sếp:",
      selectedCount: "🎯 Đã nhắm: {count} / {total} phát súng để thổi bay.",
      selectAtLeastOne: "Ít nhất phải chọn một phát súng để nén chứ ní!",
      selectAll: "Chọn tuốt sếp ơi",
      deselectAll: "Thôi khỏi chọn",
      warningNote: "⚠️ Mách nhỏ sếp: Nếu không nén trọn ổ súng mà chừa lại vài viên lẻ tẻ, lát rebase nó nổ bùng conflict sếp gánh nợ gỡ mệt đứt hơi á ghen! Khuyên sếp cứ click 'Chọn tuốt' gom hết cả cụm nén một lượt cho rảnh nợ cuộc đời bớt sầu!"
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
      title: "THỦ TỤC THỬ LỬA - DUYỆT LẠI LỘC LÁ CODES:",
      desc: "Để chắc cú là sếp không 'vô tình' bốc hơi mấy dòng code thần thánh của đồng nghiệp hay đẻ thêm bug, Overlord sẽ nổ máy kiểm thử, đo patch chéo xem sếp có quậy đục nước không nhe.",
      runBtn: "🔍 CHẠY NẮN GÂN MÚA TEST",
      running: "Đang xỉa răng soi code sếp...",
      checkingAheadBehind: "1. Đang dòm xem sếp có đi trước hay đi lùi so với {baseBranch}...",
      checkingPatchID: "2. Chạy tà thuật Patch-ID check xem code cũ mới có tụt mất dòng nào không...",
      runningUnitTests: "3. Nổ máy chạy thử build & compile dạo xem codes có nát...",
      patchOk: "✓ Toàn vẹn: Patch-ID trùng khít với nhánh backup {backupBranch}! Không mất mát cọng lông chân nào của codes sếp nhé.",
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
      pushYes: "🚀 OKAY, BẮN THẲNG LÊN MÂY GẤP",
      pushYesDesc: "Hành xử dứt khoát với súng force-with-lease siêu an toàn.",
      pushNo: "🏁 CHỈ LƯU LOCAL, ĐỂ TAY TAO",
      pushNoDesc: "Để sếp soi gương nắn bóp lại rồi sếp tự bắn cơm."
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
      { label: 'Bại Rác', desc: 'Chọn cái nhánh để so bì' },
      { label: 'Kéo Về', desc: 'Hút đống phân remote' },
      { label: 'Ép Rác', desc: 'Cắt gọt commits ngu' },
      { label: 'Màng Bọc', desc: 'Ươm con backup hèn' },
      { label: 'Ép Cọc', desc: 'Ép nén code tơi tả' },
      { label: 'Ghi Đè', desc: 'Gõ cái tiêu đề rác' },
      { label: 'Soi Lỗi', desc: 'Thẩm định thành phẩm rác' },
      { label: 'Sút Bay', desc: 'Ép push lên server' }
    ],
    step0: {
      title: "GÕ HOẶC CHỌN NHÁNH MẸ (BASE BRANCH):",
      desc: "Gõ bừa một nhánh để so sánh đống rác của mày với code gốc coi mày sửa bậy bạ gì. Thường là develop hoặc main, master chứ đục đi đâu được.",
      inputLabel: "GÕ CÁI TÊN NHÁNH GỐC VÀO:",
      techRecommend: "ĐÁM KỸ THUẬT PHÁN NHƯ THẦN:"
    },
    step1: {
      title: "KÉO PHÂN TỪ XA CHƯA (FETCH ORIGIN)?",
      desc: "Có chạy git fetch origin --prune để hốt bớt rác rưởi nhánh cũ chết trôi từ remote và đồng bộ đống hỗn độn về không? Không fetch rebase nát bét đừng chửi.",
      syncYes: "CÓ, SỢ CONFLICT THÌ SYNC ĐI (RECOMMENDED)",
      syncYesDesc: "Fetch quét phân sạch rác cứu lấy thân mày.",
      syncNo: "ĐÉO CẦN, TAO ĐIẾC KHÔNG SỢ SÚNG",
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
      backupYes: "🛡️ CÓ, BẢO VỆ CHỨ TAO YẾU TAY NGHỀ",
      backupYesDesc: "Tạo đống rác sao lưu dự phòng đề phòng gãy răng.",
      backupNo: "💀 ĐÉO CẦN, LIỀU ĂN NHIỀU VÀO",
      backupNoDesc: "Gãy nhánh thì nghỉ việc bỏ code, sợ đéo gì.",
      inputLabel: "ĐẶT TÊN ĐỐNG SAO LƯU:"
    },
    step4: {
      idleDesc: "Chuẩn bị xong hết cái đống lộn xộn này rồi. Sẵn sàng châm ngòi nổ nén rebase chưa hả?",
      idleBtn: "⚡ CHÂM NGÒI NẰNG REBASE SQUASH NOW",
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
      testsOk: "✓ May quá: Codes trôi nổi biên dịch thành công, chưa phá hoại gì thêm.",
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
      pushNoDesc: "Hèn nhát sợ bắn bậy muốn tự gõ tay push sau."
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

interface WizardPanelProps {
  commits: Commit[];
  wizard: WizardState;
  tone: TranslationTone;
  useEmoji: boolean;
  onUpdateWizard: (updates: Partial<WizardState>) => void;
  onExecuteWizardRebase: () => void;
  onResetWizard: () => void;
}

export default function WizardPanel({
  commits,
  wizard,
  tone,
  useEmoji,
  onUpdateWizard,
  onExecuteWizardRebase,
  onResetWizard
}: WizardPanelProps) {
  const [localFinalMsg, setLocalFinalMsg] = React.useState(wizard.finalMsg);
  const loc = wizardLoc[tone] || wizardLoc[TranslationTone.PROFESSIONAL];

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

  return (
    <div id="rebase-wizard-card" className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-2xl">
      {/* Header Wizard Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5 animate-spin-reverse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <span>{translate('dash_title', tone, undefined, useEmoji)}</span>
              <span>STATE MACHINE WIZARD</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {loc.step} {wizard.step + 1}/7: <span className="text-indigo-400 font-mono font-bold">{activeHeader?.label}</span> — {activeHeader?.desc}
            </p>
          </div>
        </div>

        {/* Restart Button */}
        {wizard.step > 0 && (
          <button
            onClick={onResetWizard}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 px-2.5 py-1.5 rounded transition-all cursor-pointer"
          >
            {loc.abortBtn}
          </button>
        )}
      </div>

      {/* Progress timeline navigation circles */}
      <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900 mb-6 gap-1 select-none overflow-x-auto">
        {stepHeaders.map((hdr, idx) => {
          const isPassed = idx < wizard.step;
          const isActive = idx === wizard.step;
          return (
            <div key={idx} className="flex items-center gap-1.5 min-w-fit flex-grow justify-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border transition-all ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-505/20 shadow-indigo-600/20 scale-105' 
                    : isPassed 
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : idx}
              </div>
              <span className={`text-[10px] font-mono font-medium hidden md:inline ${isActive ? 'text-indigo-400 font-semibold' : isPassed ? 'text-emerald-500' : 'text-slate-600'}`}>
                {hdr.label}
              </span>
              {idx < stepHeaders.length - 1 && (
                <span className="text-slate-800 hidden md:inline">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* STEP INTERACTIVE CONTENTS */}
      <div className="min-h-72 mb-6 text-left">
        {/* Step 0: Set / Select Base Branch */}
        {wizard.step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <GitBranch className="w-4 h-4 text-sky-400" /> {loc.step0.title}
              </span>
              {loc.step0.desc}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] font-mono text-slate-500 uppercase">{loc.step0.inputLabel}</label>
              <input
                type="text"
                value={wizard.baseBranch}
                onChange={(e) => onUpdateWizard({ baseBranch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono rounded-lg text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-slate-700"
                placeholder="develop"
              />
            </div>

            <div className="mt-2 text-xs">
              <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1.5">{loc.step0.techRecommend}</span>
              <div className="flex gap-2">
                {['develop', 'main', 'master', 'dev'].map((branchSuggestion) => (
                  <button
                    key={branchSuggestion}
                    onClick={() => onUpdateWizard({ baseBranch: branchSuggestion })}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      wizard.baseBranch === branchSuggestion
                        ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-300 font-bold'
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
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <RefreshCw className="w-4 h-4 text-emerald-400" /> {loc.step1.title}
              </span>
              {loc.step1.desc}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => onUpdateWizard({ doFetch: true })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  wizard.doFetch 
                    ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step1.syncYes}</div>
                <div className="text-[11px] text-slate-500 font-sans">{loc.step1.syncYesDesc}</div>
              </button>

              <button
                onClick={() => onUpdateWizard({ doFetch: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all ${
                  !wizard.doFetch 
                    ? 'bg-amber-500/10 border-amber-400/50 text-amber-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step1.syncNo}</div>
                <div className="text-[11px] text-slate-500 font-sans">{loc.step1.syncNoDesc}</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: History Analysis & Commit Squash Checklist */}
        {wizard.step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed flex items-center gap-3">
              <Zap className="w-7 h-7 text-indigo-400 shrink-0" />
              <div>
                <strong>{loc.step2.title}</strong> {loc.step2.desc.replace('{baseBranch}', wizard.baseBranch).replace('{commitsLength}', commits.length)}
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-900/40 px-3.5 py-2 rounded-xl border border-slate-900/60 text-[11px] font-mono leading-relaxed">
              <span className="text-slate-400 font-medium">
                {loc.step2.selectedCount.replace('{count}', wizard.selectedCommits.length).replace('{total}', commits.length)}
              </span>
              <div className="flex items-center gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    const allSha = commits.map(c => c.sha);
                    onUpdateWizard({ selectedCommits: allSha });
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-600 hover:bg-indigo-550 text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all border border-indigo-500/10 cursor-pointer text-center"
                >
                  {loc.step2.selectAll}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateWizard({ selectedCommits: [] });
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white hover:scale-[1.02] active:scale-95 transition-all border border-slate-700/40 cursor-pointer text-center"
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

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {commits.map((commit) => {
                const isSelected = wizard.selectedCommits.includes(commit.sha);
                return (
                  <div
                    key={commit.sha}
                    onClick={() => handleToggleCommit(commit.sha)}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-505/40 text-slate-200'
                        : 'opacity-50 border-slate-950 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-[80%]">
                      {/* Custom styled checkbox */}
                      <div 
                        className={`w-4 class-checkbox h-4 rounded border transition-colors flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      
                      <span className="text-slate-500 font-mono shrink-0">{commit.sha}</span>
                      <span className="truncate max-w-[70%] font-sans text-slate-300 font-medium">
                        {commit.message}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3 h-3" /> {commit.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Step 3: Create safe backup branch */}
        {wizard.step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-indigo-400 animate-pulse" /> {loc.step3.title}
              </span>
              {loc.step3.desc.replace('{backupBranchName}', wizard.backupBranchName)}
            </div>

            <div className="flex gap-4 mt-2">
              <div 
                onClick={() => onUpdateWizard({ doBackup: true })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  wizard.doBackup 
                    ? 'bg-indigo-500/10 border-indigo-400/50 text-indigo-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step3.backupYes}</div>
                <div className="text-[11px] text-slate-505 font-sans">{loc.step3.backupYesDesc}</div>
              </div>

              <div 
                onClick={() => onUpdateWizard({ doBackup: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  !wizard.doBackup 
                    ? 'bg-rose-500/10 border-rose-400/50 text-rose-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step3.backupNo}</div>
                <div className="text-[11px] text-slate-505 font-sans">{loc.step3.backupNoDesc}</div>
              </div>
            </div>

            {wizard.doBackup && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase">{loc.step3.inputLabel}</label>
                <input
                  type="text"
                  value={wizard.backupBranchName}
                  onChange={(e) => onUpdateWizard({ backupBranchName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-mono rounded text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Rebase Run & Progress Breakpoints */}
        {wizard.step === 4 && (
          <div className="flex flex-col gap-4 text-center py-6">
            {wizard.status === 'idle' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-slate-400 text-xs font-sans max-w-sm font-medium">
                  {loc.step4.idleDesc}
                </div>
                <button
                  onClick={onExecuteWizardRebase}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-6 py-3 rounded-lg border border-indigo-500/10 shadow-lg active:scale-95 transition-all animate-bounce cursor-pointer"
                >
                  {loc.step4.idleBtn}
                </button>
              </div>
            )}

            {wizard.status === 'running' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-indigo-400 text-xs font-mono font-semibold animate-pulse">
                  {loc.step4.runningTitle}
                </div>
                
                {/* Visual Fake Progress Bar */}
                <div className="w-full max-w-sm bg-slate-950 border border-slate-900 rounded-full h-3.5 overflow-hidden p-0.5">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 animate-pulse" style={{ width: '45%' }}></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono italic">
                  $ git checkout -b backup_branch && git rebase -i HEAD~3
                </div>
              </div>
            )}

            {wizard.status === 'paused_conflict' && (
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="text-amber-500 text-xs font-mono font-bold uppercase animate-pulse">
                  {loc.step4.pausedTitle}
                </div>
                <div className="text-[#bfdbfe] text-xs font-sans max-w-md bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 mx-auto leading-relaxed mt-2 text-left">
                  {loc.step4.pausedDesc}
                </div>
                
                {/* Visual Broken Anchor */}
                <span className="text-3xl mt-2 animate-bounce">🚧</span>
              </div>
            )}

            {wizard.status === 'completed' && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-emerald-400 font-bold font-mono text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-1.5 inline animate-pulse" />
                  {loc.step4.completedTitle}
                </div>
                <span className="text-4xl animate-bounce">🎉🏆</span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Combined commit message editor */}
        {wizard.step === 5 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
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
                  className="px-2.5 py-1 text-xs font-mono rounded border border-slate-800 text-slate-300 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  title={prefix.detail}
                >
                  <span className="text-yellow-500 font-bold">{prefix.label}:</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <textarea
                value={localFinalMsg}
                onChange={(e) => {
                  setLocalFinalMsg(e.target.value);
                  onUpdateWizard({ finalMsg: e.target.value });
                }}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-200 rounded-lg outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="feat: some awesome things worked out nicely"
              />
            </div>
          </div>
        )}

        {/* Step 6: Verify Rebase Integrity Checking */}
        {wizard.step === 6 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {loc.step6.title}
              </span>
              {loc.step6.desc}
            </div>

            {verifyStatus === 'idle' && (
              <div className="flex flex-col items-center justify-center py-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/20 gap-3">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full animate-bounce">
                  <Cpu className="w-6 h-6" />
                </div>
                <button
                  onClick={runVerification}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white font-mono font-bold text-xs rounded-lg shadow-md active:scale-95 transition-all cursor-pointer border border-indigo-500/10 uppercase"
                >
                  {loc.step6.runBtn}
                </button>
              </div>
            )}

            {verifyStatus === 'running' && (
              <div className="flex flex-col gap-3 p-4 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loc.step6.running}</span>
                </div>
                <div className="font-mono text-[10px] leading-relaxed text-slate-400 space-y-1 max-h-48 overflow-y-auto bg-slate-1000 p-3 rounded-lg border border-slate-900/50">
                  {verifyLogs.map((log, i) => (
                    <div key={i} className={`p-0.5 ${log.startsWith('$') ? 'text-indigo-300' : log.startsWith('✓') ? 'text-emerald-400' : log.startsWith('⚠️') ? 'text-amber-400 font-semibold' : log.startsWith('❌') ? 'text-rose-400' : 'text-slate-500'}`}>
                      {log}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (verifyLogs.length / 8) * 100)}%` }}></div>
                </div>
              </div>
            )}

            {verifyStatus === 'completed' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Scorecard checklist box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-900">
                    <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-md border border-emerald-500/20 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <div className="font-mono font-bold text-slate-300 uppercase select-none tracking-wider text-[9px] mb-0.5">Ahead/Behind</div>
                      <div className="text-slate-400">{loc.step6.aheadOk}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-900">
                    <div className={`p-1.5 rounded-md border mt-0.5 shrink-0 ${verifyResults.patchId === 'mutated' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                      {verifyResults.patchId === 'mutated' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[11px] leading-tight">
                      <div className="font-mono font-bold text-slate-300 uppercase select-none tracking-wider text-[9px] mb-0.5">Patch-ID integrity</div>
                      <div className="text-slate-400">
                        {verifyResults.patchId === 'mutated' ? loc.step6.patchLoss : loc.step6.patchOk.replace('{backupBranch}', wizard.backupBranchName || 'backup')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-900">
                    <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-md border border-emerald-500/20 mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <div className="font-mono font-bold text-slate-300 uppercase select-none tracking-wider text-[9px] mb-0.5">Build & Tests</div>
                      <div className="text-slate-400">{loc.step6.testsOk}</div>
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
              {loc.step7.desc}
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
      <div className="flex justify-between items-center border-t border-slate-900 pt-4 mt-4">
        {/* Previous Button */}
        {wizard.step > 0 && wizard.step !== 4 && (
          <button
            onClick={() => onUpdateWizard({ step: wizard.step - 1 })}
            className="px-4 py-2 text-xs bg-slate-900 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 cursor-pointer active:scale-95 transition-all font-mono flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {loc.prevStepBtn}
          </button>
        )}
        <div className="flex-grow"></div>

        {/* Transition trigger next step */}
        {wizard.step < 7 && (
          <button
            id="wizard-next-btn"
            disabled={(wizard.step === 4 && wizard.status !== 'completed') || (wizard.step === 6 && verifyStatus === 'running')}
            onClick={() => {
              // Valid checkout list size
              if (wizard.step === 2 && wizard.selectedCommits.length === 0) {
                alert(loc.step2.selectAtLeastOne);
                return;
              }
              onUpdateWizard({ step: wizard.step + 1 });
            }}
            className={`px-5 py-2.5 text-xs rounded-lg border cursor-pointer active:scale-95 transition-all font-mono font-bold flex items-center gap-1 ${
              (wizard.step === 4 && wizard.status !== 'completed') || (wizard.step === 6 && verifyStatus === 'running')
                ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-550 border-indigo-500/10 text-white shadow-md'
            }`}
          >
            <span>{loc.nextStepBtn}</span> <ArrowRight className="w-4 h-4" />
          </button>
        )}

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
