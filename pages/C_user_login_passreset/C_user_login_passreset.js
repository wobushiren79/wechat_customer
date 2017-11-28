var platHttp = require('../../utils/http/RequestForPlatform.js')
var toastUtil = require('../../utils/ToastUtil.js');
var modalUtil = require('../../utils/ModalUtil.js');
var storageKey = require('../../utils/storage/StorageKey.js');
var content;

Page({
  data: {
    second: 60,
    selected: false,
    selected1: true,
    logo_src: "../../images/logo.png"
  },
  onLoad: function () {
    content = this;
  },

  /**
   * 获取短信验证码
   */
  phoneData: function (e) {
    if (!e.detail.value.mobile || e.detail.value.mobile == "") {
      toastUtil.showToast("没有手机号码");
      return;
    }
    //发送短信
    var sendSMSData = {
      mobile: e.detail.value.mobile
    }
    var sendSMSCallBack = {
      success: function () {
        content.setData({
          selected: true,
          selected1: false,
          xianshi: true,
          second: 60,
        })
        countdown(content)
        toastUtil.showToast("发送成功");
      },
      fail: function (data) {
        toastUtil.showToast(data);
      }
    }
    platHttp.changeForPassWord(sendSMSData, sendSMSCallBack);
  },

  /**
   * 提交新密码
   */
  formSubmit: function (e) {
    if (e.detail.value.msgCode == '') {
      toastUtil.showToast("验证码不能为空");
      return;
    }
    if (e.detail.value.keys == '') {
      toastUtil.showToast("新密码不能为空");
      return;
    }
    if (e.detail.value.mobile == '') {
      toastUtil.showToast("手机号不能为空");
      return;
    }

    //修改密码
    var changeData = {
      mobile: e.detail.value.mobile,
      keys: e.detail.value.keys,
      msgCode: e.detail.value.msgCode
    };
    var changeCallBack = {
      success: function () {
        function btnConfirm() {
          wx.navigateBack({
            delta: 1
          })
        }
        modalUtil.showModal("提示", "重置密码成功", btnConfirm);
      },
      fail: function (data) {
        toastUtil.showToast(data);
      }
    };
    platHttp.changeForPassWord(changeData, changeCallBack);
  }
})

/**
 * 倒计时
 */
function countdown(that) {
  console.log(that.data.second);
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
