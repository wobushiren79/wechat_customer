// map.js
var phpGoodsHttp = require('../../utils/http/RequestForPHPGoods.js')
var content;
Page({
  data: {
  },

  onLoad: function () {
    content = this;
    wx.getLocation({
      success: function (res) {
        content.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        content.getListData(res.latitude, res.longitude)
      }
    })

  },


  //-----------------------------------------------------------------------------------------
  /**
   * 获取顾问门店列表数据
   */
  getListData: function (latitude, longitude) {
    var getListRequest = {
      latitude: latitude,
      longitude: longitude,
      distance: 5
    }
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
    phpGoodsHttp.findAdviserStoreList(getListRequest, getListCallBack);
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
    var naviUrl = '../Customer/customer_index/customer_index?storeId=' + storeId + "&storeUserId=" + storeUserId + "&consultantId=" + item.consultant_id;
    var markerItem =
      {
        iconPath: "../../images/zuobiao.png",
        id: [naviUrl, item.shop_name, item.consultant_name, item.shop_location, item.shop_img, item.id],
        alpha: 1,
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
        width: 40,
        height: 48
      };
    return markerItem;
  },




  /**
   * marker点击事件
   */
  markertap(e) {
    console.log("test:" + e.markerId);
    var array = e.markerId
    this.setData(
      {
        maker: true,
        showDiv: 1,
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
        showDiv: 1,
        info_url: array[0],
        info_stroe: array[1],
        info_name: array[2],
        info_address: array[3],
        info_img: array[4]
      }
    );
  },
  bind_info_show(e) {
    var mapcontent = wx.createMapContext("map")
    mapcontent.getCenterLocation({
      success: function (res) {
        content.getListData(res.latitude, res.longitude)
      }
    })
    this.setData(
      {
        maker: false,
        showDiv: 0,
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
  bind_address: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
        content.getListData(latitude, longitude)
      }
    })
  },
  bind_location: function () {
    var that = this
    that.onLoad()
  }
  ,
  my_apply: function () {
    wx.navigateTo({
      url: '../User/user_apply/user_apply',
    })
  },

    /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: "圆满人生",
      desc: '门店搜索',
      path: '/pages/C_map/C_map'
    }
  },
})