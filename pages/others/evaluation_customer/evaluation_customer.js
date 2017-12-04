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
	  uploadFileStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var filePathPrefixUrl = getApp().globalData.QiniuFilePathPrefix;
	  this.setData({
		  filePathPrefix: filePathPrefixUrl
	  });
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
	  var fileNamePrefix = getApp().globalData.uploadFileNamePrefix;
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
				  toastUtil.showToast(msg);
				  methodFunc.setData({
					  uploadFileStatus: false
				  });
			  }
			  var fileObj = {
				  index: imgIndex,
				  tempFilePath: filePath,
				  remoteFilePath: null
			  };
			  fileObj.remoteFilePath = respData.content.nameMap[fileNamePrefix];
			  var tempImagesFilesArray = [];
			  tempImagesFilesArray.push(fileObj);
			  var chooseImages = methodFunc.data.imageFiles;
			  chooseImages = chooseImages.concat(tempImagesFilesArray);
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
			  toastUtil.showToast(msg);
			  methodFunc.setData({
				  uploadFileStatus: false
			  });
		  }
	  };
	  fileUploadUtil.uploadFileByQiniu(filePath, fileNamePrefix, respObj);
  },
  uploadImagesReady: function (tempFilePaths) {
	  if (tempFilePaths == null || tempFilePaths.length == 0) {
		  toastUtil.showToast('请重试');
	  }
	  wx.showLoading({
		  title: '图片上传中...'
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
			  methodFunc.uploadImagesReady(res.tempFilePaths);
		  },
		  fail: function (res) {
			  toastUtil.showToast('没有选择图片');
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
  requireFormDataWire: function () {
	  var requireFormData = [];
	  requireFormData.push(formValideTool.formValideWireObj('evaluationContent', '内容，未填入'));
	  return requireFormData;
  },
  formData: function (e) {
	  var formDataObj = e.detail.value;
	  var requireFormData = this.requireFormDataWire();
	  var isRealy = formValideTool.formValideRequireData(formDataObj, requireFormData);
	  if (!isRealy) {
		  return;
	  }
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
		  formDataObj.evaluationPicture = filePathSpellStr;
	  }
	  var respObj = {
		  success: function (dataContent, res) {
			  wx.hideLoading();
			  console.log(res);
			  toastUtil.showToast('ok');
		  },
		  fail: function (dataContent, res) {
			  wx.hideLoading();
			  console.log(res);
			  toastUtil.showToast('no');
		  }
	  };
	  console.log(JSON.stringify(formDataObj));
	  wx.showLoading({
		  title: '提交中...'
	  });
	  platformUtil.submitEvaluation(formDataObj, respObj);
  }
})