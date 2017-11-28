
/**
 * 展示弹出框
 */
function showModal(title,content,btnConfirm,btnCancel){
  var showTitle='';
  var showContent='';

  if(title)
  showTitle=title;
  if(content)

  showContent=content;
  wx.showModal({
    title: showTitle,
    content: showContent,
    success: function (res) {
      if (res.confirm) {
        btnConfirm;
      } else if (res.cancel) {
        btnCancel;
      }
    }
  })
} 
module.exports.showModal = showModal;