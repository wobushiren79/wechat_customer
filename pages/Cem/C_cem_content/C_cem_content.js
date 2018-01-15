var cemeteryHttp = require('../../../utils/http/RequestForCemetery.js');
var util = require('../../../utils/util.js');
var storageKey = require('../../../utils/storage/StorageKey.js');
Page({
  data: {

    countries: ["公墓一", "公墓二", "公墓三"],
    countryIndex: 0,
    time: "2022-9-4",
    name: "李一",
    address: "万福园C区 5排2号",
    name1: "经办人名字",
    phone_num: "1234",
    time1: "2017-05-12",
    showModalStatus_img: false, //图片弹窗参数
    showModalStatus_text: false, //文字弹窗参数
    showModalStatus_mask: false, //遮罩层弹窗参数
    is_disabled: false
  },


  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  bindnavto: function () {
    wx.navigateTo({
      url: '../C_blank/C_blank'
    })
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  所有弹窗
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus_img: false,
            showModalStatus_text: false,
            showModalStatus_mask: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  图片弹窗
    if (currentStatu == "img_open") {
      this.setData(
        {
          showModalStatus_img: true,
          showModalStatus_mask: true
        }
      );
    }

    // 显示  文字弹窗
    if (currentStatu == "text_open") {
      this.setData(
        {
          showModalStatus_text: true,
          showModalStatus_mask: true
        }
      );
    }
  },

  onLoad: function (e) {
    /**
     *  查询墓位详情
     */
    var that = this
    var positionId = e.positionId;
    var detailsRequest = {
      positionId: positionId
    }
    var detilasCallBack = {
      success: function (dataContent, res) {
        if (dataContent == null || dataContent.length == 0) {
          return;
        }
        var agentPhone = dataContent.agentPhone;
        dataContent.agentPhone = agentPhone.replace(agentPhone.substr(3, 4), '****')
        if (dataContent.endDate != null) {
          var endDate = dataContent.endDate;
          endDate = endDate.replace(/-/g, '/');
          dataContent.endDate = util.formatDate(new Date(endDate))
        }
        //管理年费将 分 转换为 元 
        if (dataContent.feeYear != null) {
          var feeYear = dataContent.feeYear/100;
          dataContent.feeYear = feeYear;
        }
        that.setData({
          positionData: dataContent
        })
        wx.setStorageSync(storageKey.CEMETERY_POSITION_MGFEE_DETAIL, dataContent)
      },
      fail: function () {
        wx.stopPullDownRefresh()
      }
    }
    cemeteryHttp.queryMgtFeeByPositionId(detailsRequest, detilasCallBack);
  },
  bindMgFeeHistory: function () {
    /**
     * 交管理费记录
     */
    wx.redirectTo({
      url: '../C_order_payhistory/C_order_payhistory?userId=628',
    })
  },
  bindPayMgFee: function () {
    /**
     * 缴管理费
     */
    wx.redirectTo({
      url: '../C_cem_pay/C_cem_pay',
    })
  },
  formSubmit: function (option) {
    var that = this
    that.setData({
      is_disabled: true
    })
    // wx.showLoading({
    //   title: '发送中,请稍后',
    // })
    //获取access_token
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe8c2277798630262&secret=8ca56c0fc0ea1301ed1d96caece79724',
      method: "GET",
      data: '',

      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        //调用登录获取code
        wx.login({
          success: function (e) {
            if (e.code) {
              //利用获取的code获取openId
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxe8c2277798630262&secret=8ca56c0fc0ea1301ed1d96caece79724&js_code=' + e.code + '&grant_type=authorization_code',
                data: {
                  // code: res.code
                },
                success: function (o) {
                  var muweiData = that.data.muweiData
                  if (res.data.access_token && o.data.openid) {
                    var keyword1 = {}
                    keyword1.value = muweiData.orderDeath.name
                    keyword1.color = '#173177'
                    var keyword2 = {}
                    keyword2.value = muweiData.tombPositionText
                    keyword2.color = '#173177'
                    var keyword3 = {}
                    keyword3.value = muweiData.orderDeath.name
                    keyword3.color = '#173177'
                    var keyword4 = {}
                    keyword4.value = muweiData.managePayOverTime
                    keyword4.color = '#173177'
                    var Keydata = {}
                    Keydata.keyword1 = keyword1
                    Keydata.keyword2 = keyword2
                    Keydata.keyword3 = keyword3
                    Keydata.keyword4 = keyword4
                    var content = {}
                    content.touser = o.data.openid
                    content.template_id = 'H0T-eJFRw77XjoLBGLyt5XtXSAknjOwAQsWwxm4g2gc'
                    content.page = 'pages/C_cem/C_cem'
                    content.form_id = option.detail.formId
                    content.data = Keydata
                    // console.log(option)
                    //发送模板消息
                    wx.request({
                      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token,
                      method: "POST",
                      data: content,

                      header: {
                        "Content-Type": "application/x-www-form-urlencodeed",
                        // "Cookie": "sid=" + res.data.content.sessionId
                      },
                      success: function (res) {
                        // console.log(res)
                        if (res.data.errcode == 0) {
                          wx.showToast({
                            title: '请在微信聊天中查看墓穴位置信息',
                            duration: 5000
                          })
                        } else {
                          wx.showToast({
                            title: '发送失败',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    })
  }

});