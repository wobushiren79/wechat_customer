var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var content;
var storeId;
var storeUserId;
Page({
  data: {
    icon:"",
    popup:false,
    right_nav: false,
    mystroe_right_nav_btn: '../../../images/mystroe_right_nav_btn.png',
    img:"../../../images/dog_chang.jpg"
  },

  bind_phone: function (e) {

    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone  //仅为示例，并非真实的电话号码
    })
  },
  bind_popup_img:function(e){
    this.setData({
      popup_img: e.target.dataset.pic,
      popup: !this.data.popup
    })
  },

  bind_right_nav: function (e) {
    if (this.data.right_nav == 1) {
      this.setData({
        right_nav: 0,
        mystroe_right_nav_btn: '../../../images/mystroe_right_nav_btn.png'
      });
    }else{
      this.setData({
        right_nav: 1,
        mystroe_right_nav_btn: '../../../images/mystroe_right_nav_btn_close.png'
      });
    }
  },
  onLoad: function (evet){
    content=this;
    storeId = evet.storeId;
    storeUserId = evet.storeUserId;
    content.getStoreInfo(evet.storeId);
    content.getUserStarts();
  },
  /**
 * 获取门店信息
 */
  getStoreInfo: function (storeId) {
    var storeInfoRequest = {
      stores_id: storeId
    };
    var storeInfoCallBack = {
      success: function (data, res) {
        var storePics=new Array();
        storePics.push(data.shop_img) ;
        content.setData({
          shop_name: data.shop_name,
          consultant_name: data.consultant_name,
          consultant_tel: data.consultant_tel,
          shop_location: data.shop_location,
          shop_latitude: data.shop_latitude,
          shop_longitude: data.shop_longitude,
          store_pics:storePics,
          shop_pic: data.shop_img,
          shop_title: data.shop_title
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    };
    goodsPHPHttp.findStoreInfoByStoreId(storeInfoRequest, storeInfoCallBack);
  },
 /**
   * 查询用户星级
   */
  getUserStarts: function () {
    var findUserStartsRequest = {
      userId: storeUserId
    };
    var findUserStartsCallBack = {
      success: function (data, res) {
        var starts = Math.floor(parseFloat(data.startsAve) / 2);
        var serviceArea='无';
        if (data.serviceArea!=null)
         serviceArea = data.serviceArea;
        content.setData({
          user_scoring: data.startsAve,
          user_starts: starts + "星",
          user_serviceArea: serviceArea
        })
      },
      fail: function (data, res) {

      }
    }
    platformHttp.findUserStarts(findUserStartsRequest, findUserStartsCallBack);
  },
  /**
 * 导航
 */
  navigationLocation: function (e) {
    var latitude = content.data.shop_latitude;
    var longitude = content.data.shop_longitude;
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 18
    })
  },
})