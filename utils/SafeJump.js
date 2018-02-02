
/**
 *  开始跳转
 */
function startNavigate(url) {
  if (url == null)
    return
  var isJump = baseDataDeal(url);
  if (isJump) {
    wx.navigateTo({
      url: url,
    })
  }
}

/**
 * 判断是否跳转
 */
function baseDataDeal(url) {
  var oldTime = wx.getStorageSync(url);
  var nowTime = new Date();
  if (oldTime == null || oldTime.length == 0) {
    wx.setStorageSync(url, nowTime)
    return true;
  }
  var paresTime = parseInt(nowTime - oldTime) / 1000;
  if (paresTime > 3) {
    wx.setStorageSync(url, nowTime)
    return true;
  } else {
    return false;
  }
}

module.exports.startNavigate = startNavigate;