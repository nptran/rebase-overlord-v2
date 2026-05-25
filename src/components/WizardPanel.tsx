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
  Clock
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
      selectAtLeastOne: "Vui lòng chọn ít nhất 1 commit để tiến hành squash!"
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
      selectAtLeastOne: "Ít nhất phải chọn một phát súng để nén chứ ní!"
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
      selectAtLeastOne: "Mày bị ngáo à? Chọn ít nhất 1 commit để gom bãi chứ!"
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
      selectAtLeastOne: "Please select at least one commit to squish!"
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

  // Handle commit checkbox toggle
  const handleToggleCommit = (sha: string) => {
    const isSelected = wizard.selectedCommits.includes(sha);
    const updated = isSelected 
      ? wizard.selectedCommits.filter(s => s !== sha) 
      : [...wizard.selectedCommits, sha];
    onUpdateWizard({ selectedCommits: updated });
  };

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

            <div className="text-[11px] text-slate-500 font-mono">
              {loc.step2.selectedCount.replace('{count}', wizard.selectedCommits.length).replace('{total}', commits.length)}
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

        {/* Step 6: Push option / complete */}
        {wizard.step === 6 && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-mono text-slate-200 block font-bold mb-1 uppercase text-[11px] flex items-center gap-1">
                <GitPullRequest className="w-4 h-4 text-purple-400 animate-pulse" /> {loc.step6.title}
              </span>
              {loc.step6.desc}
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
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step6.pushYes}</div>
                <div className="text-[11px] text-slate-500 font-sans">{loc.step6.pushYesDesc}</div>
              </button>

              <button
                onClick={() => onUpdateWizard({ autoPush: false })}
                className={`flex-grow p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  !wizard.autoPush 
                    ? 'bg-amber-500/10 border-amber-400/50 text-amber-300' 
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="font-bold text-xs font-mono uppercase mb-1">{loc.step6.pushNo}</div>
                <div className="text-[11px] text-slate-505 font-sans">{loc.step6.pushNoDesc}</div>
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
        {wizard.step < 6 && (
          <button
            id="wizard-next-btn"
            disabled={wizard.step === 4 && wizard.status !== 'completed'}
            onClick={() => {
              // Valid checkout list size
              if (wizard.step === 2 && wizard.selectedCommits.length === 0) {
                alert(loc.step2.selectAtLeastOne);
                return;
              }
              onUpdateWizard({ step: wizard.step + 1 });
            }}
            className={`px-5 py-2.5 text-xs rounded-lg border cursor-pointer active:scale-95 transition-all font-mono font-bold flex items-center gap-1 ${
              (wizard.step === 4 && wizard.status !== 'completed')
                ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-505 border-indigo-500/10 text-white shadow-md'
            }`}
          >
            <span>{loc.nextStepBtn}</span> <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Finish Button */}
        {wizard.step === 6 && (
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
