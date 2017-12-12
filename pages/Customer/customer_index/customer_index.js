var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var toastUtil = require('../../../utils/ToastUtil.js')
var pageUtil = require('../../../utils/PageUtil.js')
var content;
var storeId;
var storeUserId;
var goodsClassId;

Page({
  data: {
    tab_bd_title: 1,
    tab_hd: 1,
    popup:false,
    right_nav: false,
    mystroe_right_nav_btn: '../../../images/mystroe_right_nav_btn.png'

  },
  bind_popup_img: function (e) {
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
    } else {
      this.setData({
        right_nav: 1,
        mystroe_right_nav_btn: '../../../images/mystroe_right_nav_btn_close.png'
      });
    }
  },

  bind_label: function (e) {
    this.setData({
      label: e.target.dataset.label
    })
    pageUtil.initData();
    content.getEvaluationList(storeUserId, e.target.dataset.label)
  },
  bind_tab_hd: function (e) {
    console.log(e.target.dataset.tab_hd)
    this.setData({
      tab_hd: e.target.dataset.tab_hd,
      label:''
    })
    pageUtil.initData();
    if (e.target.dataset.tab_hd == 1) {
      content.getStoreGoodsClass(storeId);
    } else if (e.target.dataset.tab_hd == 2) {
      content.getListByEvaluateTag();
      content.getEvaluationList(storeUserId, null)
    }
  },

  bingd_tab_bd_title: function (e) {
    content.goodsClassId = e.target.dataset.tab_bd_title
    this.setData({
      tab_bd_title: content.goodsClassId
    })
    pageUtil.initData();
    content.getStoreGoods(storeId, content.goodsClassId);
  },

  onShow: function () {
    content.getUserStarts();
  },
  onLoad: function (evet) {
    content = this;
    pageUtil.initData();
    storeId = evet.storeId;
    storeUserId = evet.storeUserId;
    content.getStoreInfo(evet.storeId);
    content.getStoreGoodsClass(evet.storeId);
    content.setData({
      storeId: evet.storeId,
      storeUserId: evet.storeUserId
    })
    console.log(evet.storeId)
  },
  // //下拉刷新页面
  // onPullDownRefresh: function () {
  //   if (content.data.tab_hd == 1) {

  //   } else if (content.data.tab == 2) {

  //   }
  //   content.onLoad()
  // },
  //上拉添加记录条数
  onReachBottom: function () {
    if (content.data.tab_hd == 1) {
      content.getStoreGoods(storeId, content.goodsClassId);
    } else if (content.data.tab == 2) {
      content.getEvaluationList(storeUserId, content.data.label)
    }
  
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
        content.setData({
          shop_name: data.shop_name,
          consultant_name: data.consultant_name,
          consultant_tel: data.consultant_tel,
          shop_location: data.shop_location,
          shop_latitude: data.shop_latitude,
          shop_longitude: data.shop_longitude,
          shop_pic: data.shop_img
        })
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    };
    goodsPHPHttp.findStoreInfoByStoreId(storeInfoRequest, storeInfoCallBack);
  },

  /**
   * 获取门店商品分类属性
   */
  getStoreGoodsClass: function (storeId) {
    var storeGoodsClassRequest = {
      id: storeId
    };
    var storeGoodsClassCallBack = {
      success: function (data, res) {
        content.setData({
          listGoodsClass: data,
          tab_bd_title: data[0].id
        })
        if (data[0]) {
          content.goodsClassId = data[0].id
          content.getStoreGoods(storeId, content.goodsClassId);
        }
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    };
    goodsPHPHttp.findStoreGoodsClass(storeGoodsClassRequest, storeGoodsClassCallBack);
  },

  /**
   * 获取门店商品列表
   */
  getStoreGoods: function (storeId, goodsClassId) {
    var storeGoodsRequest = pageUtil.getPageData();
    storeGoodsRequest.id = storeId;
    storeGoodsRequest.class_id = goodsClassId;

    var storeGoodsCallBack = pageUtil.getPageCallBack(
      function (data, res, isLast) {
        for (var i = 0; i < data.length; i++) {
          data[i].picUrl = getApp().globalData.PHPGoodsPicUrl + data[i].title_img;
        }
        content.setData({
          listGoods: data
        })
      },
      function (data, res) {
        toastUtil.showToast(data);
      }
    );
    goodsPHPHttp.findStoreGoods(storeGoodsRequest, storeGoodsCallBack);
  },

  /**
   * 获取评价列表
   */
  getEvaluationList: function (evaluationId, tagId) {
    var evaluationListRequest = pageUtil.getPageData();
    evaluationListRequest.params = {
      evaluationId: evaluationId,
      tagId: tagId
    };
    var evaluationListCallBack = pageUtil.getPageCallBack(
      function (data, res, isLast) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].evaluationPicture != null) {
            var picList = data[i].evaluationPicture.split(",");
            for (var j = 0; j < picList.length; j++) {
              picList[j] = getApp().globalData.QiniuFilePathPrefix + picList[j];
            }
          }

          data[i].picList = picList
          var tempMark = Math.floor(parseFloat(data[i].evaluationMark) / 2);
          data[i].starts = new Array();
          for (var y = 0; y < 5; y++) {
            if (y < tempMark) {
              data[i].starts.push(2);
            } else {
              data[i].starts.push(0);
            }
          }

        }
        content.setData({
          evaluationList: data
        })
      },
      function (data, res) {

      })
    platformHttp.findEvaluationListByUserId(evaluationListRequest, evaluationListCallBack);
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
        content.setData({
          user_scoring: data.startsAve,
          user_starts: starts + "星"

        })
      },
      fail: function (data, res) {

      }
    }
    platformHttp.findUserStarts(findUserStartsRequest, findUserStartsCallBack);
  },

  /**
   * 获取标签列表
   */
  getListByEvaluateTag: function () {
    var evaluateTagRequest = {
      tagType: 'evaluate',
      evaluateUserId: parseInt(storeUserId)
    }
    var evaluateTagCallBack = {
      success: function (data, res) {
        content.setData({
          labelList: data
        })
      },
      fail: function (data, res) {

      }
    }
    platformHttp.findListByEvaluateTag(evaluateTagRequest, evaluateTagCallBack);
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
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: '顾问门店',
      desc: '顾问门店详情',
      path: '/pages/Customer/customer_index/customer_index?storeId=' + storeId + "&storeUserId=" + storeUserId
    }
  },
  
  /**
   * 查看图片
   */
    bind_popup_img: function (e) {
    this.setData({
      popup_img: e.target.dataset.pic,
      popup: !this.data.popup
    })
  },
})
