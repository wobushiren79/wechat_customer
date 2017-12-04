var WxParse = require('../../../wxParse/wxParse.js');
var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js')
var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var storageKey = require('../../../utils/storage/StorageKey.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var content;
var app = getApp()
Page({
  data: {
    goods_number: 1,
    // 是否出现焦点
    indicatorDots: true,
    // 是否自动播放
    autoplay: false,
    // 自动播放间隔时间
    interval: 5000,
    // 滑动动画时间
    duration: 500,
    userInfo: {},
    // chatxian:true
  },
  // onShareAppMessage: function () {
  //   var goods_id = this.data.goods_id
  //   return {
  //     title: '圆满人生公共殡葬服务平台',
  //     // path: '/pages/service_forward/service_forward?goods_id='+goods_id,
  //     path: '/pages/service_content/service_content?goods_id=' + goods_id,
  //     success: function (res) {
  //       wx.showToast({
  //         title: '转发成功',
  //         duration: 2000
  //       })
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: '转发失败',
  //         image: '../../images/icon_info.png',
  //         // mask:true,
  //         duration: 2000
  //       })
  //     }
  //   }
  // },
  onLoad: function (event) {
    content=this;
    var that = this
    wx.showLoading({
      title: '加载中',
      // mask: true,
    })
    // console.log(event)
    // if (event.storeId){
    var storeId = event.storeId
    var storeUserId = event.storeUserId
    // }
    var goods_id = event.goods_id
    if (event.is_package) {
      var is_package = event.is_package
    }
    var getData = {}
    if (is_package == 0) {
      getData.goods_id = goods_id
    } else if (is_package == 1) {
      getData.package_id = goods_id
    }


    var amateurLevel = 0
    var findGoodsInfoCallBack = {
      success: function (data, res) {
        var list = res.data.list
        if (list.is_package == 0) {
          var goods_cate_id = res.data.list.goods_cate_id
        } else {
          var goods_cate_id = res.data.list.package_cate_id
        }
        WxParse.wxParse('descrip_detail', 'html', list.descrip_detail, that, );
        if (list.specprice.length > 0) {
          wx.setStorageSync('speclist', res.data.list.specprice)
          that.setData({
            list: list,
            channel: 4,
            amateurLevel: parseFloat(amateurLevel),
            goods_spec: res.data.list.specprice,
            xuanzhe: 0,
            xuanzhedata: res.data.list.specprice[0],
            spec_price: res.data.list.specprice[0].spec_price,
            // shoppingTotalNumber: shoppingTotalNumber,
            storeId: storeId,
            storeUserId: storeUserId,
            goods_number: 1,
            goods_cate_id: goods_cate_id,
            spec_attr_id: res.data.list.spec_attr_id,
            goods_id: goods_id,
            chatxian: true
          })
          content.getShoppingCartNumber()
        }
        that.setData({
          list: res.data.list
        })
      },
      fail: function (meg, res) {

      }
    }
    goodsPHPHttp.findGoodsInfo(getData, findGoodsInfoCallBack);
  },
  popup: function () {
    var that = this
    that.setData({
      popup: true
    })
  },
  popup_close: function () {
    this.setData({
      popup: false
    })
  },
  //选择规格
  xuanzhe: function (e) {
    var that = this
    var goods_spec = that.data.goods_spec
    var xuanzhedata = goods_spec[e.target.dataset.index]
    var spec_price = goods_spec[e.target.dataset.index].spec_price
    that.setData({
      xuanzhe: e.target.dataset.index,
      xuanzhedata: xuanzhedata,
      goods_number: 1,
      spec_price: spec_price
    })
  },
  //点击数量添加
  add: function (e) {
    var that = this
    that.setData({
      goods_number: e.target.dataset.goods_number + 1,
    })
  },
  //点击数量减少
  reduce: function (e) {
    var that = this
    var goods_number = e.target.dataset.goods_number
    if (goods_number == 1) {
      that.setData({
        goods_number: goods_number,
      })
    } else {
      that.setData({
        goods_number: goods_number - 1,
      })
    }

  },
  /**
   *  直接购买
   */
  purchase: function () {
    var that = this
    var goods_number = that.data.goods_number
    var xuanzhedata = that.data.xuanzhedata
    xuanzhedata.number = goods_number

    var findGoodsDetailsRequest = {
      channelId: xuanzhedata.channel_id
    }
    if (xuanzhedata.goods_id) {
      findGoodsDetailsRequest.goodsId = xuanzhedata.goods_id
      findGoodsDetailsRequest.goodsSpecId = xuanzhedata.goods_spec_id
    } else {
      findGoodsDetailsRequest.packageId = xuanzhedata.package_id
      findGoodsDetailsRequest.packageSpecId = xuanzhedata.package_spec_id
    }
    var getData = {}
    var findGoodsDetailsCallBack = {
      success: function (data, res) {
        // console.log(res)
        var totla_price = 0;
        var storeId = that.data.storeId
        var storeUserId = that.data.storeUserId
        //分类名称
        for (var i in res.data.list) {
          res.data.list[i].specNum = goods_number
          totla_price += parseFloat(res.data.list[i].specNum) * parseFloat(res.data.list[i].spec_price)
          res.data.list[i].storeId = storeId;
          res.data.list[i].storeUserId = storeUserId;
        }
        //结算购物车数据
        wx.setStorageSync(storageKey.STORE_BUY_GOODS, res.data.list)
        //总价格
        wx.setStorageSync(storageKey.STORE_BUY_TOTAL_PRICE, totla_price)
        wx.hideLoading()
        wx.redirectTo({
          url: '../order_create/order_create'
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    }
    goodsPHPHttp.findGoodsDetails(findGoodsDetailsRequest, findGoodsDetailsCallBack);
  },
  /**
   *  加入购物车
   */
  cart: function () {
    var that = this
    var goods_number = that.data.goods_number
    var Goodsdata = that.data.xuanzhedata
    var setlist = that.data.list
    var spec_attr_id = that.data.spec_attr_id
    var goods_cate_id = that.data.goods_cate_id
    var storeId = that.data.storeId
    var storeUserId = that.data.storeUserId
    // console.log(storeId)
    var formdata = {}
    if (setlist.is_package == 1) {
      formdata.goodsId = Goodsdata.package_id
      formdata.goodsSpecId = Goodsdata.package_spec_id
    } else {
      formdata.goodsId = Goodsdata.goods_id
      formdata.goodsSpecId = Goodsdata.goods_spec_id
    }

    formdata.classifyAttrId = spec_attr_id
    formdata.classifyId = goods_cate_id
    formdata.specNum = goods_number
    formdata.channelId = Goodsdata.channel_id
    formdata.isPackage = setlist.is_package
    formdata.storeId = storeId
    formdata.storeUserId = storeUserId
    var list = []
    list.push(formdata)
    var addGoodsShoppingRequest = { list: list }
    var addGoodsShoppingCallBack = {
      success: function () {
        content.getShoppingCartNumber();
        toastUtil.showToast("加入成功");
      },
      fail: function () {
        toastUtil.showToast("加入失败");
      }
    }
    goodsHttp.addGoodsShopping(addGoodsShoppingRequest, addGoodsShoppingCallBack);
  },

  /**
   * 获取购物车数量
   */
  getShoppingCartNumber: function () {
    var getShoppingNumberCallBack = {
      success: function (data, res) {
        var shoppingTotalNumber = data.shoppingTotalNumber
        content.setData({
          shoppingTotalNumber: shoppingTotalNumber,
        })
      },
      fail: function () {

      }
    }
    goodsHttp.getShoppingNumber(null, getShoppingNumberCallBack);
  },

  cartlist: function () {
    //頁面跳轉
    wx.redirectTo({
      url: '../order_shopping_cart/order_shopping_cart'
    })
  }
})  