// pages/others/evaluation_customer.js
var modalUtil = require('../../../utils/ModalUtil.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var platformUtil = require('../../../utils/http/RequestForPlatform.js');
var fileUploadUtil = require('../../../utils/http/RequestForFile.js');
var formValideTool = require('../../../utils/formValideTool.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  pagesPositionUrl: null,
	  imageFiles: [],
	  filePathPrefix: null,
	  uploadFileStatus: true,
	  extent_Set:[
		  {index: 0, name: '好评', isChecked: true, img:"../../../images/love1.png"},
		  {index: 1, name: '中评', isChecked: false, img:"../../../images/love0.png"},
		  {index: 2, name: '差评', isChecked: false, img:"../../../images/love0.png"}
	  ],
	  extent: '好评',
	  tag_Set:null,
	  tagLoadStatus:false,
	  evaluationUserId: null,
	  orderId: null,
	  storeName: null,
	  mark_set: [],
	  evaluationMark: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var userIdVal =options.storeUserId;
	  var orderIdVal =options.orderId;
	  var storeNameVal = options.storeName;
	  if (orderIdVal == null || userIdVal == null ||
	   orderIdVal.length == 0 || userIdVal.length==0){
		  toastUtil.showToastReWrite('参数有误', null, function () {
			  setTimeout(function () {
				  wx.navigateBack({
					  delta: 1
				  });
			  }, 1000);
		  });
		  return;
	  }
	  userIdVal = parseInt(userIdVal);
	  orderIdVal = parseInt(orderIdVal);
	  if (storeNameVal == null || storeNameVal.length==0){
		  storeNameVal ='--未定义--';
	  }
	  this.queryTagsList();
	  var pagesPositionUrlObj = getApp().pagesPositionUrl;
	  var filePathPrefixUrl = getApp().globalData.QiniuFilePathPrefix;
	  this.setData({
		  pagesPositionUrl: pagesPositionUrlObj,
		  filePathPrefix: filePathPrefixUrl,
		  evaluationUserId: userIdVal,
		  orderId: orderIdVal,
		  storeName: storeNameVal
	  });
	  this.markArrayStar(-1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  var methodFunc = this;
	  var tagLoadStatusVal=methodFunc.data.tagLoadStatus;
	  if (!tagLoadStatusVal) {
		  methodFunc.queryTagsList();
	  }  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  uploadAndWireImgArray: function (imgIndex, tempFilePaths) {
	  var methodFunc = this;
	  var fileNamePrefix = getApp().globalData.UploadFileNamePrefix;
	  var filePath = tempFilePaths[imgIndex];
	  var respObj = {
		  success: function (dataContent, resp) {
			  var respData = JSON.parse(resp.data);
			  if (respData.code != 1000) {
				  wx.hideLoading();
				  var msg = '图片上传失败';
				  if (imgIndex > 0) {
					  msg = '部分'.concat(msg);
				  }
				  toastUtil.showToastReWrite(msg, 'icon_info');
				  methodFunc.setData({
					  uploadFileStatus: false
				  });
          return;
			  }
			  var fileObj = {
				  index: imgIndex,
				  tempFilePath: filePath,
				  remoteFilePath: null
			  };
			  fileObj.remoteFilePath = respData.content.nameMap[fileNamePrefix];
			  var chooseImages = methodFunc.data.imageFiles;
			  chooseImages.push(fileObj);
			  methodFunc.setData({
				  imageFiles: chooseImages
			  });
			  if (imgIndex == (tempFilePaths.length - 1)) {
				  wx.hideLoading();
			  }
		  },
		  fail: function (data, res) {
			  wx.hideLoading();
			  var msg = '图片上传失败';
			  if (imgIndex > 0) {
				  msg = '部分'.concat(msg);
			  }
			  toastUtil.showToastReWrite(msg, 'icon_info');
			  methodFunc.setData({
				  uploadFileStatus: false
			  });
		  }
	  };
	  fileUploadUtil.uploadFileByQiniu(filePath, fileNamePrefix, respObj);
  },
  uploadImagesReady: function (tempFilePaths) {
	  if (tempFilePaths == null || tempFilePaths.length == 0) {
		  toastUtil.showToastReWrite('请重试', 'icon_info');
	  }
	  wx.showLoading({
		  title: '图片上传中...',
		  mask: true
	  });
	  var methodFunc = this;
	  for (var i = 0; i < tempFilePaths.length; i++) {
		  var uploadStatus = methodFunc.data.uploadFileStatus;
		  if (!uploadStatus) {
			  break;
		  }
		  methodFunc.uploadAndWireImgArray(i, tempFilePaths);
	  }
  },
  chooseImage: function (e) {
	  var methodFunc = this;
	  var objParams = {
		  //   count:1,
		  success: function (res) {
			  methodFunc.setData({
				  uploadFileStatus: true
			  });
			  methodFunc.uploadImagesReady(res.tempFilePaths);
		  },
		  fail: function (res) {
			  toastUtil.showToastReWrite('没有选择图片', 'icon_info');
		  }
	  };
	  wx.chooseImage(objParams);
  },
  deleteImage: function (e) {
	  var fileObj = e.target.dataset;
	  var fileIndex = fileObj.index;
	  var files = this.data.imageFiles;
	  files.splice(fileIndex, 1);
	  this.setData({
		  imageFiles: files
	  });
  },
  cancelComplain: function (e) {
	  var methodFunc = this;
	  modalUtil.showModal('提示', '需要取消？', function () {
		  wx.navigateBack({
			  delta: 1
		  });
	  }, function () {
	  });
  },
  formData: function (e) {
	  var reqParams = e.detail.value;
	  var markVal = this.data.evaluationMark;
	  if (markVal ==0){
		  toastUtil.showToastReWrite('未选择服务评分', 'icon_info');
		  return;
	  }
	  reqParams.evaluationMark = markVal;
	  reqParams.extent = this.data.extent;
	  reqParams.evaluationId=this.data.evaluationUserId;
	  reqParams.orderId = this.data.orderId;
	  var files = this.data.imageFiles;
	  if (files.length > 0) {
		  var filePathSpellStr = "";
		  for (var i = 0; i < files.length; i++) {
			  var filePath = files[i];
			  if (i > 0) {
				  filePathSpellStr += ",";
			  }
			  filePathSpellStr += filePath.remoteFilePath;
		  }
		  reqParams.evaluationPicture = filePathSpellStr;
	  }
	  var tags = this.data.tag_Set;
	  if (tags !=null&& tags.length > 0) {
		  var tagIds=[];
		  for (var i = 0; i < tags.length; i++) {
			  var obj = tags[i];
			  if (obj.isSelected){
				  tagIds.push(obj.id);
			  }
		  }
		  reqParams.tagIds = tagIds;
	  }
	  var respObj = {
		  success: function (dataContent, res) {
			  wx.hideLoading();
			  toastUtil.showToastReWrite('提交成功', null, function () {
				  setTimeout(function () {
					  wx.navigateBack({
						  delta: 1
					  });
				  }, 500);
			  }, 'success');
		  },
		  fail: function (dataContent, res) {
			  wx.hideLoading();
			  toastUtil.showToastReWrite('提交失败', 'icon_info');
		  }
	  };
	  wx.showLoading({
		  title: '提交中...',
		  mask:true
	  });
	  platformUtil.submitEvaluation(reqParams, respObj);
  },
  extentArray: function (index){
	  var extentItems = this.data.extent_Set;
	  var extents=[];
	  for (var i = 0; i < extentItems.length;i++){
		  var item = extentItems[i];
		  	item.isChecked = false;
		  if (i == index){
			  item.isChecked=true;			  
		  }
		  extents.push(item);
	  }
	  this.setData({
		  extent_Set: extents
	  });
  },
  extentChange: function (e) {
	  var props = e.currentTarget.dataset;
	  var indexVal = props.index;
	  var extentVal = props.extent;
	  this.extentArray(indexVal);
	  this.setData({
		  extent: extentVal
	  });
  },
  queryTagsList: function () {
	  var methodFunc = this;
	  var reqParams={};
	  reqParams.tagType ='evaluate';
	  var respObj={
		  success: function (dataContent, res) {
			  if (dataContent == null || dataContent.length == 0){
				  return;
			  }
			  methodFunc.setData({
				  tagLoadStatus:true,
				  tag_Set:dataContent
			  });
		  },
		  fail: function (dataContent, res) {
		  } 
	  };
	  platformUtil.queryTagsListByType(reqParams, respObj);
  },
  tagChange: function (e) {
	  var props = e.currentTarget.dataset;
	  var checkedIdVal = props.id;
	  var tags = this.data.tag_Set;
	  var tagArray=[];
	  for (var i = 0; i < tags.length;i++){
		  var obj = tags[i];
		  if (obj.id == checkedIdVal && (obj.isSelected == null || !obj.isSelected)){
			  obj.isSelected =true;
		  } else if (obj.id == checkedIdVal && obj.isSelected){
			  obj.isSelected = false;
		  }
		  tagArray.push(obj);
	  }
	  this.setData({
		  tag_Set: tagArray
	  });
  },
  markArrayStar:function(index){
	  var grayStarSrc ="../../../images/mystroe_index_star0.png";
	  var lightStarSrc = "../../../images/mystroe_index_star1.png";
	  var starts=[];
	  for(var i=0; i<5;i++){
		  var starObj={};
		  starObj.index=i;
		  starObj.score=i*2+2;
		  if (i <= index){
			  starObj.star = lightStarSrc;
			  starts.push(starObj);
			  continue;
		  }
		  starObj.star = grayStarSrc;
		  starts.push(starObj);
	  }
	  this.setData({
		mark_set: starts
	  });
  },
  markClickStar:function(e){
	  var props=e.target.dataset;
	  var indexVal = props.index;
	  var scoreVal = parseInt(props.score);
	  this.markArrayStar(indexVal);
	  this.setData({
		  evaluationMark: scoreVal
	  });
  }
})