
/**
 * 展示弹出框
 */
function showModal(title, content, btnConfirm, btnCancel, confirmText, cancelText) {
  var showTitle = '';
  var showContent = '';
  var showConfirmText = '确认';
  var showCancelText = '取消';

  if (title)
    showTitle = title;
  if (content)
    showContent = content;
  if (confirmText)
    showConfirmText = confirmText;
  if (cancelText)
    showCancelText = cancelText;

  wx.showModal({
    title: showTitle,
    content: showContent,
    confirmText: showConfirmText,
    cancelText: showCancelText,
    success: function (res) {
      if (res.confirm && btnConfirm) {
        btnConfirm();
      }
      if (res.cancel && btnCancel) {
        btnCancel();
      }
    }
  })
}
module.exports.showModal = showModal;