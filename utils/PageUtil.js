var pageData = {
  pageSize: 5,
  pageNumber: 1
}
var listData = new Array();

/**
 * 初始化数据
 */
function initData() {
  listData = new Array();
  onePage();
}
/**
 * 获取请求参数
 */
function getPageData() {
  return pageData;
}

/**
 * 获取请求响应
 */
function getPageCallBack(dataSuccess, dataFail) {
  var pageCallBack = {
    success: function (data, res) {
      var isLast = false;
      if (data && data.content ) {
        if (data.totalPage == data.pageNumber || data.pageNumber==0) {
          isLast = true;
        }
        pageData.pageNumber = data.pageNumber;
        if (data.total > listData.length) {
          setListaData(data.content);
        }
        nextPage();
      }
      dataSuccess(listData, res, isLast);
    },
    fail: function (data, res) {
      dataFail(data, res);
    }
  }
  return pageCallBack
}
/**
 * 下一页
 */
function nextPage() {
  pageData.pageNumber = pageData.pageNumber + 1;
}

/**
 * 上一页
 */
function lastPage() {
  pageData.pageNumber = pageData.pageNumber - 1;
}

/**
 * 第一页
 */
function onePage() {
  pageData.pageNumber = 1
}

/**
 * 设置列表数据
 */
function setListaData(newListData) {
  if (newListData && newListData.length > 0)
    for (var i = 0; i < newListData.length; i++) {
      listData.push(newListData[i]);
    }
}

module.exports.initData = initData;
module.exports.getPageData = getPageData;
module.exports.getPageCallBack = getPageCallBack;