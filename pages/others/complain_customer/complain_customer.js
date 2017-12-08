// pages/others/complain_customer.js
var modalUtil = require('../../../utils/ModalUtil.js');
var toastUtil= require('../../../utils/ToastUtil.js');
var platformUtil=require('../../../utils/http/RequestForPlatform.js');
var fileUploadUtil = require('../../../utils/http/RequestForFile.js');
var formValideTool = require('../../../utils/formValideTool.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
	complaintType_SelectedIndex:0,
	complaintType_Set:[
		{ id: 0, text: '--未选择--'},
		{ id: 1, text: '公墓' },
		{ id: 2, text: '殡仪'},
		{ id: 3, text: '人员'}
	],
	complaintType: null,
	pagesPositionUrl: null,
	imageFiles:[],
	filePathPrefix:null,
	uploadFileStatus:true,
	isSelectedAdviser:false,
	isSelectedCemetery:false,
	cemeterySubsys_Index:0,
	cemeterySubsys_Set:null,
	cemeterySubsysLoadStatus: false,
	cemeteryName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var pagesPositionUrlObj = getApp().pagesPositionUrl;
	  var filePathPrefixUrl = getApp().globalData.QiniuFilePathPrefix;
	  this.setData({
		  pagesPositionUrl: pagesPositionUrlObj,
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
  /**
   * 类型选择
   */
  complaintTypeChange: function (e) {
	  var methodFunc = this;	  
	  var selectIndex = parseInt(e.detail.value);
	  var selectItem = methodFunc.data.complaintType_Set[selectIndex];
	  var selectIdVal = selectItem.id;
	  var selectedAdviser = false;
	  var selectedCemetery=false;
	  var cemeteryLoadStatusVal = methodFunc.data.cemeterySubsysLoadStatus;
	  if (selectIdVal == 3){
		//   人员
		  selectedAdviser = true;
	  } else if (selectIdVal == 1){
		//   公墓
		  selectedCemetery = true;
		  if (!cemeteryLoadStatusVal){
			  methodFunc.queryCemeterySubsysList();
		  }
	  }
	  methodFunc.setData({
		  complaintType_SelectedIndex: selectIndex,
		  complaintType: selectIdVal,
		  isSelectedAdviser: selectedAdviser,
		  isSelectedCemetery: selectedCemetery
	  });
  },
  requireFormDataWire: function(){
	  var requireFormData = [];
	  requireFormData.push(formValideTool.formValideWireObj('complaintContent', '内容，未填入'));
	  return requireFormData;
  },  
  formData: function (e) {
	  var methodFunc = this;
	  var formDataObj = e.detail.value;
	  var cotype=methodFunc.data.complaintType;
	  if (cotype == null || cotype ==0){
		  toastUtil.showToastReWrite('未选择类目', 'icon_info');
		  return;
	  }
	  formDataObj.complaintType = cotype;
	  var requireFormData = methodFunc.requireFormDataWire();
	  var complaintTypeIndexVal = methodFunc.data.complaintType_SelectedIndex;
	  if (complaintTypeIndexVal == 3) {
		  //   人员
		  requireFormData.push(formValideTool.formValideWireObj('complaintObjcet', '姓名，未填入'));
	  } else if (complaintTypeIndexVal == 1) {
		  //   公墓
		  var cename = methodFunc.data.cemeteryName;
		 if (cename == null || cename.length==0){
			 toastUtil.showToastReWrite('未选择公墓', 'icon_info');
			 return;
		 }else{
			 formDataObj.remark = cename;
		 }
	  }
	  var isRealy = formValideTool.formValideRequireData(formDataObj, requireFormData);
	  if (!isRealy){
		  return;
	  }
	  if (formDataObj.complaintType==0){
		  toastUtil.showToastReWrite('未选择类型', 'icon_info');
		  return;
	  }
	  var files = this.data.imageFiles;
	  if (files.length>0){
		  var filePathSpellStr="";
		  for (var i = 0; i < files.length; i++) {
			  var filePath=files[i];
			  if(i>0){
				  filePathSpellStr +=",";
			  }
			  filePathSpellStr += filePath.remoteFilePath;
		  }
		  formDataObj.complaintPicture = filePathSpellStr;
	  }

	  var respObj={
		  success: function (dataContent,res){
			  wx.hideLoading();
			  toastUtil.showToastReWrite('感谢反馈', null, function () {				  
				  setTimeout(function(){
					  wx.navigateBack({
						  delta: 1
					  });
				  },500);
			  }, 'success');
		  },
		  fail: function (dataContent,res){
			  wx.hideLoading();
			  toastUtil.showToastReWrite('提交失败', 'icon_info');
		  }
	  };
	  wx.showLoading({
		  title: '提交中...',
		  mask: true
	  });
	  platformUtil.submitComplaints(formDataObj, respObj);
  },
  cancelComplain: function (e) {
	  var methodFunc = this;
	  modalUtil.showModal('提示','需要取消？', function(){
		  wx.navigateBack({
			  delta:1
		  });
	  }, function(){		  
	  });
  },
  uploadAndWireImgArray: function (imgIndex, tempFilePaths){
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
  uploadImagesReady: function (tempFilePaths){
	  if (tempFilePaths == null || tempFilePaths.length==0){
		  toastUtil.showToastReWrite('请重试', 'icon_info');
	  }
	  wx.showLoading({
		  title: '图片上传中...',
		  mask: true
	  });
	  var methodFunc = this;
	  for (var i = 0; i < tempFilePaths.length; i++) {
		  var uploadStatus = methodFunc.data.uploadFileStatus;
		  if (!uploadStatus){
			  break;
		  }
		  methodFunc.uploadAndWireImgArray(i, tempFilePaths);  
	  }	  
  },
  chooseImage: function (e) {
	  var methodFunc=this;
	  var objParams={
		//   count:1,
		  success:function(res){
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
	  var fileObj=e.target.dataset;
	  var fileIndex = fileObj.index;
	  var files = this.data.imageFiles;
	  files.splice(fileIndex,1);
	  this.setData({
		  imageFiles: files
	  });
  },
  queryCemeterySubsysList: function () {
	  var methodFunc = this;
	  var reqParams = {}
	  reqParams.systemIndex = 1;
	  var respObj = {
		  success: function (dataContent, res) {
			  if (dataContent == null || dataContent.length == 0) {
				  return;
			  }
			  methodFunc.setData({
				  cemeterySubsysLoadStatus: true,
				  cemeterySubsys_Set: dataContent
			  });
		  },
		  fail: function (dataContent, res) {
			  toastUtil.showToastReWrite('切换类目重试', 'icon_info');
		  }
	  };
	  platformUtil.queryCemeterySubsysListBySysEnumId(reqParams, respObj);
  },
  cemeterySubsysChange: function (e) {
	  var methodFunc = this;
	  var selectIndex = parseInt(e.detail.value);
	  var selectItem = methodFunc.data.cemeterySubsys_Set[selectIndex];
	  var name = selectItem.name;
	  name ='公墓名称：'.concat(name);
	  methodFunc.setData({
		  cemeterySubsys_Index: selectIndex,
		  cemeteryName: name
	  })
  }
})