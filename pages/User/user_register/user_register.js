var platformHttp = require('../../../utils/http/RequestForPlatform.js');
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    selected: false,
    selected1: true,
    logo_src: "../../../images/logo.png",
    systemType: 2,
    value3: '',
    value4: '',
    str: '',
    subSystems: [
      "funeral.advisor",
    ],
    is_loction: 0,
    hasDealSubSystem: 0
  },
  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },
  phoneData: function (e) {
    /**
     * 发送验证码
     */
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    if (e.detail.value.mobile != "") {
      var get_data = {
        mobile: e.detail.value.mobile
      }
      // get_data.content = e.detail.value
      var detilasCallBack = {
        success: function (data) {
          wx.hideLoading()
          that.setData({
            selected: true,
            selected1: false,
            isSendMsg: true,
            second: 60,
          })
          countdown(that)
          wx.showToast({
            title: '发送成功',
            duration: 3000,
            // mask:true
          })
        },
        fail: function (msg) {
          wx.showToast({
            title: msg,
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      }
      platformHttp.sendVerificationCode(get_data, detilasCallBack)
    } else {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }

  },
  formSubmit: function (e) {
    console.log(e.detail)
    var formValues = e.detail.value
    if (formValues.mobile == "") {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
    else if (formValues.msgCode == "") {
      wx.showToast({
        title: '验证码不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
    else if (formValues.password == "") {
      wx.showToast({
        title: '密码不能为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }else{
      //注册
      var dataRequest={
        mobile:formValues.mobile,
        keys: formValues.password,
        msgCode: formValues.msgCode
      }
      var detilasCallBack = {
        success: function (msg) {
          console.log(msg)
          wx.hideLoading()
          // that.setData({
          //   selected: true,
          //   selected1: false,
          //   isSendMsg: true,
          //   second: 60,
          // })
          // countdown(that)
          wx.showToast({
            title: "注册成功!",
            duration: 3000,
            // mask:true
          })
        },
        fail: function (msg) {
          wx.showToast({
            title: msg,
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      }
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
          duration: 3000,
        })
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          image: '../../../images/icon_info.png',
          duration: 3000,
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
        })
        // 頁面跳轉
        wx.reLaunch({
          url: '../index/index',
        })
        // console.log(00000)
      }
    } else {
    }
  }
})

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
