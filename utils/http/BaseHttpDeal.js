/**
 * http请求bean
 */
function HttpRequestData(url, data, method, header) {
  this.url = url;//请求地址
  this.data = data;//请求参数
  this.method = method;//请求方式
  this.header = header;//头文件
}


/**
 * 发送post请求
 */
function createPostHttpRequest(url, data, callback, header) {
  var jsonData = JSON.stringify(data);
  var httpData = new HttpRequestData(url, jsonData, "POST", header);
  sendBaseHttp(httpData, callback);
}


/**
 * 发送http请求
 * 参数：HttpRequestData
 */
function sendBaseHttp(httpData, callback) {
  console.log(httpData);
  wx.request({
    url: httpData.url,
    data: httpData.data,
    method: httpData.method,
    header: httpData.header,
    success: function (res) {
      respsoneSuccessDeal(res, callback);
    },
    fail: function (res) {
      RespsoneFailDeal(res, callback);
    },
    complete: function (res) {
      RespsoneCompleteDeal(res, callback);
    }
  })
}

/**
 *  请求成功结果处理
 */
function respsoneSuccessDeal(res, callback) {
  console.log("RespsoneSuccess");
  console.log(res);
  if (!callback)
    return;
  if (res.data) {
    if (res.data.code)
      if (res.data.code == 1000)
        if (callback.success)
          callback.success(res.data.content,res);
        else
          if (callback.fail)
            callback.fail(res.data.message, res);
          else
            if (callback.success)
              callback.success(null, res);
  } else
    if (callback.success)
      callback.success(null, res);
}

/**
 *  请求失败结果处理
 */
function RespsoneFailDeal(res, callback) {
  console.log("RespsoneFail");
  console.log(res);
  callback.fail("网络请求异常");
}
/**
 *  请求完成结果处理
 */
function RespsoneCompleteDeal(res, callback) {
  // console.log("RespsoneComplete");
  // console.log(res);
}


module.exports.createPostHttpRequest = createPostHttpRequest;