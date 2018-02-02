
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

/**
 * 请求数据
 */
function TempRequestData(httpData, callback, isDialog) {
  this.httpData = httpData;
  this.callback = callback;
  this.isDialog = isDialog
  this.isUpFile = false;
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
function createGetHttpRequest(url, data, callback, header, isDialog, ec) {
  var jsonData = JSON.stringify(data);
  var dataStr = urlEncode(data);
  if (ec != null) {
    dataStr += ec
  }
  var httpData = new HttpRequestData(url + "?" + dataStr, jsonData, "GET", header);
  sendBaseHttp(httpData, callback, isDialog);
}

/**
 * 发送file上传请求
 */
function createFileHttpRequest(url, filePath, fileName, callback, header, isDialog) {
  var httpData = new HttpRequestData(url, null, "POST", header);
  httpData.filePath = filePath;
  httpData.fileName = fileName;
  sendBaseFileHttp(httpData, callback, isDialog)
}
//-------------------------------------------------------------------------------------------------------------------
/**
 * 发送http请求
 * 参数：HttpRequestData
 */
function sendBaseHttp(httpData, callback, isDialog) {
  var tempData = null;
  if (callback.loginAgain) {
    tempData = new TempRequestData(httpData, callback, isDialog);
  }

  if (isDialog)
    wx.showLoading({
      title: '加载中!请稍后',
      mask: true
    });
  console.log(httpData);
  wx.request({
    url: httpData.url.replace(" ", ""),
    data: httpData.data,
    method: httpData.method,
    header: httpData.header,
    success: function (res) {
      respsoneSuccessDeal(res, callback, tempData);
    },
    fail: function (res) {
      respsoneFailDeal(res, callback);
    },
    complete: function (res) {
      respsoneCompleteDeal(res, callback);
    }
  })
}

/**
 * 发送http请求（上传文件）
 */
function sendBaseFileHttp(httpData, callback, isDialog) {
  var tempData = null;
  if (callback.loginAgain) {
    tempData = new TempRequestData(httpData, callback, isDialog);
    tempData.isUpFile = true;
  }

  wx.uploadFile({
    url: httpData.url.replace(" ", ""),
    filePath: httpData.filePath,
    header: httpData.header,
    name: httpData.fileName,//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
    success: function (res) {//接口调用成功的回调函数
      respsoneSuccessDeal(res, callback, tempData);
    },
    fail: function (res) {
      respsoneFailDeal(res, callback);
    },
    complete: function (res) {
      respsoneCompleteDeal(res, callback);
    }
  })
}
//-------------------------------------------------------------------------------------------------------------------
/**
 *  请求成功结果处理
 */
function respsoneSuccessDeal(res, callback, tempData) {
  wx.hideLoading()
  console.log("RespsoneSuccess");
  console.log(res);
  if (!callback)
    return;
  if (res.data && res.data.code) {
    if (res.data.code == 1000) {
      if (callback.success)
        callback.success(res.data.content, res);
    } else if (res.data.code == 9999) {
      if (callback.loginAgain) {
        callback.loginAgain(tempData);
      } else {
        callback.success(null, res);
      }
    } else {
      if (callback.fail)
        callback.fail(res.data.message, res);
    }
  } else {
    try {
      if (res.data.indexOf("登录") >= 0) {
        if (callback.loginAgain) {
          callback.loginAgain(tempData);
        } else {
          if (callback.success)
            callback.success(null, res);
        }
      } else {
        if (callback.success)
          callback.success(res.data.content, res);
      }
    } catch (error) {
      if (callback.success)
        callback.success(null, res);
    }
  }
}

/**
 *  请求失败结果处理
 */
function respsoneFailDeal(res, callback) {
  wx.hideLoading()
  console.log("RespsoneFail");
  console.log(res);
  if (callback && callback.fail)
    callback.fail("网络请求异常");
}

/**
 *  请求完成结果处理
 */
function respsoneCompleteDeal(res, callback) {
  // console.log("RespsoneComplete");
  // console.log(res);

}

/** 
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
//-------------------------------------------------------------------------------------------------------------------



module.exports.createPostHttpRequest = createPostHttpRequest;
module.exports.createPostHttpRequestForFormData = createPostHttpRequestForFormData;
module.exports.createGetHttpRequest = createGetHttpRequest;
module.exports.createFileHttpRequest = createFileHttpRequest;
module.exports.sendBaseHttp = sendBaseHttp;
module.exports.sendBaseFileHttp = sendBaseFileHttp;