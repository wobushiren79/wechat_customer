var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var modalUtil = require('../../../utils/ModalUtil.js');
var toastUtil = require('../../../utils/ToastUtil.js');
//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    selected: false,
    selected1: true,
    logo_src: "../../../images/logo.png",
    systemType: 2,
    phoneType: 0,//手机号验证结果:0 手机号为空 1 格式不正确 2 正确
    value3: '',
    value4: '',
    str: '',
    subSystems: [
      "funeral.advisor"
    ],
    is_loction: 0,
    hasDealSubSystem: 0
  },
  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },
  phoneBlur: function (e) {
    var that = this;
    var mobile = e.detail.value;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile == "") {
      toastUtil.showToastReWrite('手机号不能为空', 'icon_info');
      that.setData({
        phoneType: 0
      })
    }
    else if (!myreg.test(mobile)) {
      toastUtil.showToastReWrite('请填写正确手机', 'icon_info');
      that.setData({
        phoneType: 1
      })
    } else {
      that.setData({
        phoneType: 2
      })
    }
  },
  phoneData: function (e) {
    /**
     * 发送验证码
     */
    var that = this;
    wx.showLoading({
      title: '请稍后'
    });
    var phoneType = that.data.phoneType;
    if (phoneType == 2) {

      var get_data = {
        mobile: mobile
      };
      // get_data.content = e.detail.value
      var detilasCallBack = {
        success: function (data) {
          wx.hideLoading();
          that.setData({
            selected: true,
            selected1: false,
            isSendMsg: true,
            second: 60
          });
          countdown(that);
          wx.showToast({
            title: '发送成功',
            duration: 3000
            // mask:true
          })
        },
        fail: function (msg) {
          wx.showToast({
            title: msg,
            image: '../../../images/icon_info.png',
            duration: 3000
            // mask:true
          })
        }
      };
      platformHttp.sendVerificationCode(get_data, detilasCallBack)

    } else if (phoneType == 0) {
      toastUtil.showToastReWrite('手机号不能为空', 'icon_info');
    } else if (phoneType == 1) {
      toastUtil.showToastReWrite('请输入正确手机号', 'icon_info');
    } else {
      toastUtil.showToastReWrite('手机号有误', 'icon_info');
    }

  },

  formSubmit: function (e) {
    var that = this;
    var phoneType = that.data.phoneType;
    var select = that.data.selected;
    var formValues = e.detail.value;
    if (phoneType == 0) {
      toastUtil.showToastReWrite('手机号不能为空', 'icon_info');
    } else if (phoneType == 1) {
      //验证手机号的格式
      toastUtil.showToastReWrite('请输入正确手机号', 'icon_info');
    } else if (!select) {
      toastUtil.showToastReWrite('请先获取验证码!', 'icon_info');
    }
    else if (formValues.msgCode == "") {
      toastUtil.showToastReWrite('验证码不能为空', 'icon_info');
    }
    else if (formValues.password == "") {
      toastUtil.showToastReWrite('密码不能为空', 'icon_info');
    } else {
      //注册
      var dataRequest = {
        mobile: formValues.mobile,
        keys: formValues.password,
        msgCode: formValues.msgCode
      };
      var detilasCallBack = {
        success: function (msg) {
          wx.hideLoading();
          // countdown(that)
          function btnConfirm() {
            wx.navigateBack({
              delta: 1
            })
          }
          modalUtil.showModal("提示", "注册成功", btnConfirm);
          // wx.navigateTo({
          //   url: '../../C_user_login/C_user_login',
          // })
        },
        fail: function (msg) {
          toastUtil.showToastReWrite(msg, 'icon_info');
        }
      };
      platformHttp.sendVerificationCode(dataRequest, detilasCallBack)
    }
  }

  ,
  //设置页面转发功能
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/login/login',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          // image: '../../images/icon_info.png',
          duration: 3000
        });
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          image: '../../../images/icon_info.png',
          duration: 3000
        })
      }
    }
  },
  //判断跳转首页条件是否满足
  is_login: function (hasDealSubSystem, subSystems, is_loction) {
    if (subSystems.length == hasDealSubSystem) {
      if (is_loction == 0) {
        this.setData({
          is_loction: 1
        });
        // 頁面跳轉
        wx.reLaunch({
          url: '../index/index'
        });
        // console.log(00000)
      }
    } else {
    }
  }
});

function countdown(that) {
  /**
   * 验证码倒计时
   */
  console.log(that.data.second);
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60
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
