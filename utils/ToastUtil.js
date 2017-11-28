
/**
 * 展示Toast
 */
function showToast(title, duration, success, fail, complete, image) {
  var showTitle = '';
  var showImage = '../../images/icon_info.png'
  var showDuration = 3000;

  if (title)
    showTitle = title;
  if (image)
    showImage = image;
  if (duration)
    showDuration = duration

  wx.showToast({
    title: showTitle,
    image: showImage,
    duration: showDuration,
    success: success,
    fail: fail,
    complete: complete
  })
}


module.exports.showToast = showToast;
