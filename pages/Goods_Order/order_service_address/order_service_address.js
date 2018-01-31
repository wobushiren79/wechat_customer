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
    content.setData({
      region: e.detail.value
    })
  },
  bind_popup_form: function (e) {
    var submitData = e.currentTarget.dataset.updatedata;
    var submitType = e.currentTarget.dataset.submittype;

    if (submitType != undefined) {
      content.setData({
        submitType: submitType
      })
    }

    if (submitType == "1") {
      setSubmitData(null, "", "", "", "添加地址");
    } else if (submitType == "2") {
      setSubmitData(submitData.id, submitData.recipientName, submitData.recipientPhone, submitData.address, "编辑地址");
    }

    content.setData({
      popup: !content.data.popup
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
    var value = e.detail.value;
    var selectId = content.data.selectId
    //创建地址
    if (submitType == "1") {
      addAddress(value.addressCity, value.addressDetails, value.recipientName, value.recipientPhone);
    }
    //更新地址
    else if (submitType == "2") {
      updateServiceInfoAddress(selectId, value.addressCity, value.addressDetails, value.recipientName, value.recipientPhone)
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
function setSubmitData(id, name, phone, address, title) {
  var addressArray;
  if (address == null || address.length == 0) {
    addressArray = ['四川省', '成都市', '全部', ""];
  } else {
    var addressArrayTemp = address.split(",");
    if (addressArrayTemp.length < 4) {
      addressArray = ['', '', '', addressArrayTemp[0]];
    } else {
      addressArray = addressArrayTemp;
    }
  }
  var addressDetails = "";
  for (var i in addressArray) {
    if (i >= 3) {
      addressDetails += addressArray[i];
    }
  }
  content.setData({
    submitName: name,
    submitPhone: phone,
    region: [addressArray[0], addressArray[1], addressArray[2]],
    addressInfo: addressDetails,
    selectId: id,
    addTitle: title
  })
}

/**
 * 获取送货地址列表
 */
function getAddressList() {
  var addressListCallBack = {
    success: function (data, res) {
      listAddress = data;
      for (var i in listAddress) {
        listAddress[i].addressStr = listAddress[i].address.split(",").join("");;
      }
      content.setData({
        listAddress: data,
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
      toastUtil.showToastReWrite("设置成功");
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
    if (addressCity[i].indexOf("全部") >= 0 || addressCity[i].length == 0) {
      toastUtil.showToast("还未选择城市");
      return;
    }
    address += addressCity[i] + ",";
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


/**
 * 更新地址
 */
function updateServiceInfoAddress(id, addressCity, addressDetails, recipientName, recipientPhone) {
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
    if (addressCity[i].indexOf("全部") >= 0 || addressCity[i].length == 0) {
      toastUtil.showToast("还未选择城市");
      return;
    }
    address += addressCity[i] + ",";
  }
  address += addressDetails

  var updateRequest = {
    id: id,
    address: address,
    recipientName: recipientName,
    recipientPhone: recipientPhone
  }
  var updateCallBack = {
    success: function (data, res) {
      content.setData({
        popup: !content.data.popup
      })
      getAddressList();
    },
    fail: function (data, res) {
      toastUtil.showToast("更新失败");
    }
  }
  goodsHttp.updateServiceInfoAddress(updateRequest, updateCallBack);
}