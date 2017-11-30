// map.js
var phpGoodsHttp = require('../../utils/http/RequestForPHPGoods.js')
var content;
Page({
  data: {
  },

  onLoad:function(){
    content = this;
    this.getListData()
  },

  onReady: function () {
  var page= getCurrentPages();
  },

  onUnload: function () {
    content = this;
    this.getListData()
  },

  //-----------------------------------------------------------------------------------------
  /**
   * 获取顾问门店列表数据
   */
  getListData: function () {
    var getListCallBack = {
      success: function (data, res) {
        content.setListData(data);
      },
      fail: function (data, res) {
        wx.showToast({
          title: data,
        })
      }
    };
    phpGoodsHttp.findAdviserStoreList(null, getListCallBack);
  },

  /**
   * 设置顾问门店信息
   */
  setListData: function (data) {
    var markers = new Array();
    if (data) {
      for (var i = 0; i < data.length; i++) {
        var markItem = this.getMarkerItemByData(data[i]);
        markers.push(markItem);
      }
    }
    this.setData({
      markers: markers
    });
  },


  /**
   * 获取单个marker点
   */
  getMarkerItemByData: function (item) {
    var markerItem =
      {
        iconPath: "../../images/zuobiao.png",
        id: item.id,
        alpha: 0.5,
        callout: {
          content: item.shop_name,
          color: "#353535",
          fontSize: "12px",
          borderRadius: "5px",
          bgColor: "#e6e6e6",
          padding: "10px",
          display: "BYCLICK"
        },
        latitude: item.shop_latitude,
        longitude: item.shop_longitude,
        width: 25,
        height: 25
      };
    return markerItem;
  },


  
  
  /**
   * marker点击事件
   */
  markertap(e) {
    
  },


  /**
   * 弹窗点击
   */
  callouttap(e) {
    var storeId = e.markerId;
    wx.navigateTo({
      url: '../Customer/customer_index/customer_index?storeId=' + storeId
    })
  },


  /**
   * 绑定客户电话
   */
  bindcallphone: function () {
    wx.makePhoneCall({
      phoneNumber: '966188'
    })
  }

})