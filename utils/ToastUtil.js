
/**
 * 展示Toast
 */
function showToast(title, duration, success, fail, complete, image) {
  var showTitle = '';
  var showImage = '../../../images/icon_info.png'
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
/**
 * 消息提示框
 */
function showToastReWrite(promptContent, image, complete, icon, timer){
	var params={
		title:'',
		mask: true,
		duration: 1000
	};
	if (promptContent){
		params.title=promptContent;
	}
	if (image) {
		image = image == 'icon_info' ? '../../../images/icon_info.png' : image;
		params.image = image;
	}
	// if (success) {
	// 	params.success = success;
	// }
	// if (fail) {
	// 	params.fail = fail;
	// }
	if (complete) {
		params.complete = complete;
	}	
	if (icon) {
		params.icon = icon;
	}
	if (timer) {
		params.duration = timer;
	}
	wx.showToast(params);
}

module.exports.showToast = showToast;
module.exports.showToastReWrite = showToastReWrite;
