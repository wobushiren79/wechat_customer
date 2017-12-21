var pageSizeValue = 4;

var pageData = {
  pageSize: pageSizeValue,
  pageNumber: 1
}
var listData = new Array();

/**
 * 初始化数据
 */
function initData() {
  pageData={
    pageSize: pageSizeValue,
    pageNumber: 1
  }
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
 * 获取列表数据
 */
function getListData() {
  return listData;
}
/**
 * 获取请求响应
 */
function getPageCallBack(dataSuccess, dataFail) {
  var pageCallBack = {
    success: function (data, res) {
      var isLast = false;
      if(data){
        if(data.content){
          //java 后台page类型处理
          if (data.totalPage == data.pageNumber || data.pageNumber == 0) {
            isLast = true;
          }
          pageData.pageNumber = data.pageNumber;
          if (data.total > listData.length) {
            setListaData(data.content);
          }
          nextPage();
        }else{
          //php 后台page类型处理
          if (!data.length || data.length == 0) {
            isLast = true;
          } else {
            setListaData(data);
            nextPage();
          }
        }
      }else{
        //php 后台page类型处理
        if (!res.data.list || res.data.list.length == 0) {
          isLast = true;
        } else {
          setListaData(res.data.list);
          nextPage();
        }
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
module.exports.getListData = getListData;