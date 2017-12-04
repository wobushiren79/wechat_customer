// pages/others/complain_customer.js
var modalUtil = require('../../../utils/ModalUtil.js');
var toastUtil= require('../../../utils/ToastUtil.js');
var platformUrl=require('../../../utils/http/RequestForPlatform.js');
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
	complaintPicture:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var pagesPositionUrlObj = getApp().pagesPositionUrl;
	  this.setData({
		  pagesPositionUrl: pagesPositionUrlObj
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
  complaintTypeChange: function(e){	  
	  var selectIndex = parseInt(e.detail.value);
	  var selectItem = this.data.complaintType_Set[selectIndex];
	  this.setData({
		  complaintType_SelectedIndex: selectIndex,
		  complaintType: selectItem.id
	  });
  },
  wireValideFormObj: function(name, msg){
	var obj={};
	obj.name=name;
	obj.msg=msg;
	return obj;
  },
  requireFormDataWire: function(){
	  var requireFormData = [];
	  requireFormData.push(this.wireValideFormObj('complaintType','类型，需要选择'));
	  requireFormData.push(this.wireValideFormObj('complaintObjcet', '名称，未填入'));
	  requireFormData.push(this.wireValideFormObj('complaintContent', '内容，未填入'));
	  return requireFormData;
  },
  valideFormData: function (formDataObj, requireFormData) {
	  if (formDataObj == null || requireFormData == null ||
		  requireFormData.length == null || requireFormData.length == 0) {
		  return false;
	  }
	  var isFill=true;
	  var msg=null;
	  for (var i in requireFormData) {
		  var item=requireFormData[i];
		  var itemVal = formDataObj[item.name];
		  if (itemVal == null || (typeof (itemVal)=='string'&& itemVal.length == 0)){
			  isFill = false;
			  msg = item.msg;
			  break;
		  }
	  }
	  if (!isFill){
		  toastUtil.showToast(msg);
		  return false;
	  }
	  return true;
  },
  formData: function (e) {
	  var formDataObj = e.detail.value;
	  formDataObj.complaintType = this.data.complaintType;
	  formDataObj.complaintPicture = this.data.complaintPicture;
	  var requireFormData = this.requireFormDataWire();
	  var isRealy=this.valideFormData(formDataObj, requireFormData);
	  if (!isRealy){
		  return;
	  }
	  var resp={
		  success:function(data,res){
			  console.log(res);
		  },
		  fail:function(data,res){
			  console.log(res);
		  }
	  };	
	  platformUrl.submitComplaints(formDataObj, resp);
  },
  cancelComplain: function(e){
	  modalUtil.showModal('提示','需要取消？', function(){
		  var C_aboutme = pagesPositionUrl['C_aboutme'];
		  wx.redirectTo({
			  url: C_aboutme
		  });
	  }, function(){		  
	  });
 }
})