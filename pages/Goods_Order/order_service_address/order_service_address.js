var goodsHttp = require("../../../utils/http/RequestForGoods.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var content;
var listAddress = new Array();
Page({
  data: {
    popup: false,
    region: ['四川省', '成都市', '全部'],
    customItem: '全部'
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bind_popup_form: function (e) {
    var submitData = e.target.dataset.updatedata;
    if (e.target.dataset.submittype == "1"){
      setSubmitData("", "", "");
    }
    if (submitData != null && e.target.dataset.submittype=="2"){
      setSubmitData(submitData.recipientName, submitData.recipientPhone, "");
    }
    this.setData({
      popup: !this.data.popup,
      submitType: e.target.dataset.submittype
    })
  },
  /**
   * radio选择
   */
  radioChange: function (e) {
    setDefaultAddress(e.detail.value)
    for (var i in listAddress) {
      if (listAddress[i].id == e.detail.value) {
        listAddress[i].isDefault = 1;
      } else {
        listAddress[i].isDefault = 0;
      }
    }
    content.setData({
      listAddress: listAddress
    })
  },
  /**
   * 提交表单数据
   */
  formSubmit: function (e) {
    var submitType = e.detail.target.dataset.submittype
    //创建地址
    if (submitType == "1") {
      var value = e.detail.value;
      addAddress(value.addressCity, value.addressDetails, value.recipientName, value.recipientPhone);
    }
    //更新地址
    else if (submitType == "2") {

    }

  },
  /**
   * 删除地址
   */
  deleteAddress: function (e) {
    var id = e.currentTarget.dataset.addressid;
    deleteAddress(id)
  },
  onLoad: function (e) {
    content = this;
    getAddressList();
  }
});


/**
 * 设置提交数据
 */
function setSubmitData(name, phone, address) {
  content.setData({
    submitName: name,
    submitPhone: phone,
    submitAddressDetail: address
  })
}

/**
 * 获取送货地址列表
 */
function getAddressList() {
  var addressListCallBack = {
    success: function (data, res) {
      listAddress = data;
      content.setData({
        listAddress: data
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取地址失败");
    }
  }
  goodsHttp.findServiceInfoAddressList(null, addressListCallBack);
}

/**
 * 设置默认地址
 */
function setDefaultAddress(id) {
  var setDefaultAddressRequest = {
    id: id
  }
  var setDefaultAddressCallBack = {
    success: function (data, res) {
      toastUtil.showToast("设置成功");
    },
    fail: function (data, res) {
      toastUtil.showToast("设置失败");
    }
  }
  goodsHttp.setServiceInfoDefaultAddress(setDefaultAddressRequest, setDefaultAddressCallBack);
}

/**
 * 增加地址
 */
function addAddress(addressCity, addressDetails, recipientName, recipientPhone) {
  if (recipientName == null || recipientName.length == 0) {
    toastUtil.showToast("联系人为空");
    return;
  }
  if (recipientPhone == null || recipientPhone.length == 0) {
    toastUtil.showToast("联系电话为空");
    return;
  }
  if (addressDetails == null || addressDetails.length == 0) {
    toastUtil.showToast("地址不能为空");
    return;
  }

  var address = "";
  for (var i in addressCity) {
    address += addressCity[i];
  }
  address += addressDetails

  var addAddressReqeust = {
    address: address,
    recipientName: recipientName,
    recipientPhone: recipientPhone
  }
  var addAddressCallBack = {
    success: function (data, res) {
      content.setData({
        popup: !content.data.popup
      })
      getAddressList();
    },
    fail: function (data, res) {
      toastUtil.showToast("添加失败");
    }
  }
  goodsHttp.createServiceInfoAddress(addAddressReqeust, addAddressCallBack);
}

/**
 * 删除地址
 */
function deleteAddress(id) {
  var deleteAddressRequest = {
    id: id
  }
  var deleteAddressCallBack = {
    success: function () {
      for (var i in listAddress) {
        if (listAddress[i].id == id) {
          listAddress.splice(i, 1);
        }
      }
      content.setData({
        listAddress: listAddress
      })
    },
    fail: function () {
      toastUtil.showToast("删除失败");
    }
  }
  goodsHttp.deleteServiceInfoAddress(deleteAddressRequest, deleteAddressCallBack);
}