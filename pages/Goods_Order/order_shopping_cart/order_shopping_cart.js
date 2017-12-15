var goodsHttp = require('../../../utils/http/RequestForGoods.js');
var goodsPHPHttp = require('../../../utils/http/RequestForPHPGoods.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var storageKey = require('../../../utils/storage/StorageKey.js');

var content;
var shoppingCartList;
Page({
  data: {
    edit: true,
    totla_price: 0,
  },
  bind_edit: function () {
    this.setData({
      edit: false,
      over: true
    })
  },
  bind_over: function () {
    this.setData({
      edit: true,
      over: false
    })
  },
  onShow: function () {
  
  },
  onLoad: function () {
    content = this;
    content.getGoodsShoppingList();
  },
  /**
   * 获取商品详情
   */
  getGoodsListDetails: function (requestData) {
    var getGoodsListDetailsCallBack = {
      success: function (data, res) {
        var listDetails = res.data.list;
        var class_name = res.data.class_name;
        var totla_price = 0;
        var formData = new Array();
        for (var i = 0; i < content.shoppingCartList.length; i++) {
          var itemData = new Object();
          for (var j in listDetails) {
            if (content.shoppingCartList[i].goodsId == parseInt(listDetails[j].goods_id)
              && content.shoppingCartList[i].goodsSpecId == parseInt(listDetails[j].spec_id)
              && content.shoppingCartList[i].channelId == parseInt(listDetails[j].channel_id)
              || content.shoppingCartList[i].goodsId == parseInt(listDetails[j].package_id)
              && content.shoppingCartList[i].goodsSpecId == parseInt(listDetails[j].spec_id)
              && content.shoppingCartList[i].channelId == parseInt(listDetails[j].channel_id)) {
              listDetails[j].id = content.shoppingCartList[i].id
              listDetails[j].specNum = content.shoppingCartList[i].specNum
              // totla_price += parseFloat(content.shoppingCartList[i].specNum) * parseFloat(listDetails[j].spec_price)
              itemData = Object.assign({}, listDetails[j]);

            }
          }
          itemData.storeName = content.shoppingCartList[i].storeName;
          itemData.storeId = content.shoppingCartList[i].storeId;
          itemData.storeUserId = content.shoppingCartList[i].storeUserId;
          itemData.isCheck = false;
          formData.push(itemData)
        }
        content.setData({
          class_name: content.getStoreNames(),
          // totla_price: totla_price,
          formData: formData
        })
        content.setGoodsTotalPrice();
      },
      fail: function () {

      }
    }
    goodsPHPHttp.findGoodsDetails(requestData, getGoodsListDetailsCallBack);
  },

  /**
   * 获取购物车列表
   */
  getGoodsShoppingList() {
    var goodsShoppingListRequest = {
      pageSize: 1000,
      pageNumber: 1,
      content: { sourceChannels: 1}
    }
    var goodsShoppingListCallBack = {
      success: function (data, res) {
        content.shoppingCartList = data.content
        var goodsId = ''
        var channelId = ''
        var goodsSpecId = ''
        var packageId = ''
        var packageSpecId = ''
        var str = {}
        for (var i in content.shoppingCartList) {
          if (content.shoppingCartList[i]['isPackage'] == 0) {
            goodsId += content.shoppingCartList[i]['goodsId'] + ','
            channelId += content.shoppingCartList[i]['channelId'] + ','
            goodsSpecId += content.shoppingCartList[i]['goodsSpecId'] + ','
          }
          if (content.shoppingCartList[i]['isPackage'] == 1) {
            packageSpecId += content.shoppingCartList[i]['goodsSpecId'] + ','
            packageId += content.shoppingCartList[i]['goodsId'] + ','
            channelId += content.shoppingCartList[i]['channelId'] + ','
          }
        }
        str.goodsId = goodsId
        str.channelId = channelId
        str.goodsSpecId = goodsSpecId
        str.packageSpecId = packageSpecId
        str.packageId = packageId
        content.getGoodsListDetails(str)
      },
      fail: function () {

      }
    }
    goodsHttp.getGoodsShoppingList(goodsShoppingListRequest, goodsShoppingListCallBack);
  },



  /**
   * 获取商品门店列表
   */
  getStoreNames: function () {
    var storeNameArry = new Array();
    if (content.shoppingCartList)
      for (var i in content.shoppingCartList) {
        if (content.shoppingCartList[i].storeName)
          storeNameArry.push(content.shoppingCartList[i].storeName)
      }
    return Array.from(new Set(storeNameArry));
  },

  /**
   * 获取当前商品总价
   */
  setGoodsTotalPrice() {
    var formData = content.data.formData
    var totla_price = 0;
    for (var i in formData) {
      if (formData[i].isCheck)
        totla_price += parseFloat(formData[i].specNum) * parseFloat(formData[i].spec_price)
    }
    content.setData({
      totla_price: totla_price
    })
  },

  //点击减少数量
  reduce: function (e) {
    var index = e.target.dataset.index
    var formData = content.data.formData
    var changeNumber = formData[index].specNum - 1;
    content.changeGoodsNumber(e, changeNumber);
  },

  //点击数量添加
  add: function (e) {
    var index = e.target.dataset.index
    var formData = content.data.formData
    var changeNumber = formData[index].specNum + 1;
    content.changeGoodsNumber(e, changeNumber);
  },

  //直接修改数量
  EventHandle: function (e) {
    var index = e.target.dataset.index
    var changeNumber = e.detail.value;
    content.changeGoodsNumber(e, changeNumber);
  },

  /**
   * 删除购物车商品
   */
  del: function (e) {
    content.removeGoods(e);
  },


  /**
    * 更新商品数量
    */
  changeGoodsNumber(e, changeNumber) {
    if (changeNumber == null) {
      toastUtil.showToast("没有修改数量");
      return;
    }
    if (isNaN(parseFloat(changeNumber))) {
      toastUtil.showToast("数量格式错误");
      return;
    }
    if (parseFloat(changeNumber) < 1) {
      toastUtil.showToast("数量小于1");
      return;
    }
    var specNum = parseFloat(changeNumber);
    var shoppingCartId = e.target.dataset.id
    var index = e.target.dataset.index
    var getdata = content.data.getdata
    var formData = content.data.formData

    var upShoppingCartRequest = {
      id: shoppingCartId,
      specNum: specNum
    };
    var upShoppingCartCallBack = {
      success: function (data) {
        if (formData[index].id == shoppingCartId) {
          formData[index].specNum = specNum;
        }
        content.setData({
          formData: formData
        })
        content.setGoodsTotalPrice();
      },
      fail: function (data) {
        toastUtil.showToast(data);
      }
    }
    goodsHttp.upShopingCartNum(upShoppingCartRequest, upShoppingCartCallBack);
  },

  /**
   * 删除商品
   */
  removeGoods: function (e) {
    var shoppingCartId = e.target.dataset.id;
    var index = e.target.dataset.index
    var formData = content.data.formData

    var removeShoppingCartRequest = {
      shoppingCartIds: [e.target.dataset.id]
    }
    var removeShoppingCartCallBack = {
      success: function () {
        delete formData[index]
        content.setData({
          formData: formData
        })
        content.setGoodsTotalPrice();
      },
      fail: function () {
        toastUtil.showToast(data);
      }
    }
    goodsHttp.removeShoppingCartGoods(removeShoppingCartRequest, removeShoppingCartCallBack)
  },


  /**
   * 选中商品
   */
  check: function (e) {
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = content.data.totla_price
    var formData = content.data.formData
    var itemData = formData[index];
    if (itemData.isCheck) {
      itemData.isCheck = false;
    } else {
      itemData.isCheck = true;
    }
    content.setGoodsTotalPrice();
  },


  /**
   * 提交参数
   */
  formSubmit: function () {
    var formData = content.data.formData
    var totlaPrice = content.data.totla_price
    var submitData = new Array();
    var storeIds = new Array();
    for (var i in formData) {
      if (formData[i].isCheck) {
        submitData.push(formData[i]);
        storeIds.push(formData[i].storeId);
      }
    }
    if (submitData.length < 1) {
      toastUtil.showToast("未选择商品");
      return;
    }
    if (Array.from(new Set(storeIds)).length > 1) {
      toastUtil.showToast("请在一家下单");
      return;
    }
    //结算购物车数据
    wx.setStorageSync(storageKey.STORE_BUY_GOODS, submitData)
    //总价格
    wx.setStorageSync(storageKey.STORE_BUY_TOTAL_PRICE, totlaPrice)
    wx.redirectTo({
      url: '../order_create/order_create'

    })
  }
})  