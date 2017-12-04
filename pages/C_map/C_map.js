// map.js
var phpGoodsHttp = require('../../utils/http/RequestForPHPGoods.js')
var content;
Page({
  data: {
  },

  onLoad: function () {
    content = this;
    this.getListData()
  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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
    var storeId = item.id;
    var storeUserId = item.consultant_id
    var naviUrl = '../Customer/customer_index/customer_index?storeId=' + storeId + "&storeUserId=" + storeUserId+"&consultantId=" + item.consultant_id;
    var markerItem =
      {
        iconPath: "../../images/zuobiao.png",
        id: [naviUrl, item.shop_name, item.consultant_name, item.shop_location, item.shop_img, item.id],
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
    var array = e.markerId
    this.setData(
      {
        maker: true,
        info_url: array[0],
        info_stroe: array[1],
        info_name: array[2],
        info_address: array[3],
        info_img: array[4]
      }
    );
  },


  callouttap(e) {
    var array = e.markerId
    this.setData(
      {
        maker: true,
        info_url: array[0],
        info_stroe: array[1],
        info_name: array[2],
        info_address: array[3],
        info_img: array[4]
      }
    );
  },
  bind_info_show(e) {
    this.setData(
      {
        maker: false
      }
    );
  },
  /**
   * 客户电话
   */
  bind_phone(e) {
    wx.makePhoneCall({
      phoneNumber: "966188"
    })
  },
  /**
   * 门店跳转
   */
  bind_go(e) {
    var navigateUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      url: navigateUrl
    })
  },
  /**
   * 定位
   */
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
})