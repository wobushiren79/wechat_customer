/**
 * http请求bean
 */
function HttpRequestData(url, data, method, header) {
  this.url = url;//请求地址
  this.data = data;//请求参数
  this.method = method;//请求方式
  this.header = header;//头文件

  this.filePath = '';//文件地址
  this.fileName = '';//文件名称
}
//-------------------------------------------------------------------------------------------------------------------
/**
 * 发送post请求
 */
function createPostHttpRequest(url, data, callback, header, isDialog) {
  var jsonData = JSON.stringify(data);
  var httpData = new HttpRequestData(url, jsonData, "POST", header);
  sendBaseHttp(httpData, callback, isDialog);
}
/**
 * 发送post请求formdata
 */
function createPostHttpRequestForFormData(url, data, callback, header, isDialog) {
  var httpData = new HttpRequestData(url, data, "POST", header);
  sendBaseHttp(httpData, callback, isDialog);
}
/**
 * 发送get请求
 */
function createGetHttpRequest(url, data, callback, header, isDialog) {
  var jsonData = JSON.stringify(data);
  var httpData = new HttpRequestData(url, jsonData, "GET", header);
  sendBaseHttp(httpData, callback, isDialog);
}

/**
 * 发送file上传请求
 */
function createFileHttpRequest(url,filePath,fileName,callback,header,isDialog){
  var httpData = new HttpRequestData(url, null, "POST", header);
  httpData.filePath=filePath;
  httpData.fileName = fileName;
  sendBaseFileHttp(httpData, callback, isDialog)
}
//-------------------------------------------------------------------------------------------------------------------
/**
 * 发送http请求
 * 参数：HttpRequestData
 */
function sendBaseHttp(httpData, callback, isDialog) {
  if (isDialog)
    wx.showLoading({
      title: '加载中!请稍后',
    });
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
 * 发送http请求（上传文件）
 */
function sendBaseFileHttp(httpData, callback, isDialog) {
  wx.uploadFile({
    url: httpData.url,
    filePath: httpData.filePath,
    header: httpData.header,
    name: httpData.fileName,//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
    success: function (res) {//接口调用成功的回调函数
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
//-------------------------------------------------------------------------------------------------------------------
/**
 *  请求成功结果处理
 */
function respsoneSuccessDeal(res, callback) {
  wx.hideLoading()
  console.log("RespsoneSuccess");
  console.log(res);
  if (!callback)
    return;
  if (res.data && res.data.code) {
    if (res.data.code == 1000) {
      if (callback.success)
        callback.success(res.data.content, res);
    }
    else {
      if (callback.fail)
        callback.fail(res.data.message, res);
    }
  } else{
    if (res.data.indexOf("html") >= 0){
      wx.navigateTo({
        url: '../../../pages/C_user_login/C_user_login',
      });
    }else{
      if (callback.success)
        callback.success(res.data.content, res);
    }
  }
   
}

/**
 *  请求失败结果处理
 */
function RespsoneFailDeal(res, callback) {
  wx.hideLoading()
  console.log("RespsoneFail");
  console.log(res);
  if (callback&&callback.fail)
  callback.fail("网络请求异常");
}

/**
 *  请求完成结果处理
 */
function RespsoneCompleteDeal(res, callback) {
  // console.log("RespsoneComplete");
  // console.log(res);
  
}

//-------------------------------------------------------------------------------------------------------------------
module.exports.createPostHttpRequest = createPostHttpRequest;
module.exports.createPostHttpRequestForFormData = createPostHttpRequestForFormData;
module.exports.createGetHttpRequest = createGetHttpRequest;
module.exports.createFileHttpRequest = createFileHttpRequest;