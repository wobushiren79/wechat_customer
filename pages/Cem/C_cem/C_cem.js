var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var cemeteryHttp = require('../../../utils/http/RequestForCemetery.js');
var toastUtil = require('../../../utils/ToastUtil.js');
Page({
  data: {

    GmList: [],
    cemeteryIndex: 0,
    cemeteryName: null,
    cemeteryId: null,
    agentNameLength: 0,//经办人姓名长度
    deathNameLength: 0,//使用者姓名长度
    phoneType: 0,//手机号验证结果:0 手机号为空 1 格式不正确 2 正确

  },

  cemeteryListQuery: function () {
    /**
     * 查询公墓列表初始化
     */
    var that = this;

    var detailsRequest = {
      systemIndex: 1
    }
    var detilasCallBack = {
      success: function (dataContent, res) {
        if (dataContent == null || dataContent.length == 0) {
          return;
        }
        for (var i = 0; i < dataContent.length; i++) {
          if (dataContent[i].id == getApp().platformId) {
            dataContent.splice(dataContent[i], 1);
            continue;
          }
        }
        that.setData({
          GmList: dataContent
        })
      },
      fail: function () {
        wx.stopPullDownRefresh()
      }
    }
    platformHttp.queryCemeterySubsysListBySysEnumIdNoLogin(detailsRequest, detilasCallBack);

  },
  bindCemeteryChange: function (e) {
    /**
     * 改变公墓下拉值
     */
    var methodFunc = this;
    var selectIndex = parseInt(e.detail.value);
    var selectItem = methodFunc.data.GmList[selectIndex];
    var name = selectItem.name;
    var id = selectItem.id;
    name = '公墓名称：'.concat(name);
    methodFunc.setData({
      cemeteryIndex: selectIndex,
      cemeteryName: name,
      cemeteryId: id
    })
  },

  bindAgentNameBlur: function (e) {
    /**
     * 经办人姓名填写失去焦点后检查
     */
    var that = this;
    that.setData({
      agentNameLength: e.detail.value.length
    })
    if (that.data.agentNameLength != null && that.data.agentNameLength == 1) {
      toastUtil.showToastReWrite('姓名请输入全名', 'icon_info');
    }

  },
  bindDeathNameBlur: function (e) {
    /**
     * 使用者姓名填写失去焦点后检查
     */
    var that = this;
    that.setData({
      deathNameLength: e.detail.value.length
    })
    if (that.data.agentNameLength != null && that.data.agentNameLength == 1) {
      toastUtil.showToastReWrite('姓名请输入全名', 'icon_info');
    }

  },
  bindAgentPhoneBlur: function (e) {
    var that = this;
    var mobile = e.detail.value;
    var myreg = getApp().myreg;
    if (mobile.length != 0 && !myreg.test(mobile)) {
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
  formSubmit: function (e) {
    var that = this;
    var phoneType = that.data.phoneType;
    var agentNameLength = that.data.agentNameLength;
    var deathNameLength = that.data.deathNameLength;
    var cemeteryId = that.data.cemeteryId;
    var formValues = e.detail.value;
    if (cemeteryId == null) {
      cemeteryId = that.data.GmList[that.data.cemeteryIndex].id;
    }
    if (phoneType == 0 && agentNameLength == 0 && deathNameLength == 0) {
      toastUtil.showToastReWrite('请任选择一条件', 'icon_info');
    } else if (phoneType == 1) {
      //验证手机号的格式
      toastUtil.showToastReWrite('请输入正确手机号', 'icon_info');
    } else if (agentNameLength == 1 || deathNameLength == 1) {
      toastUtil.showToastReWrite('姓名请输入全名', 'icon_info');
    } else {
      var dataRequest = {
        cemeteryId: cemeteryId,
        agentName: formValues.agentManName,
        agentPhone: formValues.agentManPhone,
        deathName: formValues.deadMan,
      }
      var detilasCallBack = {
        success: function (data) {
          console.log(data.length)
          if (data.length == 0) {
            toastUtil.showToastReWrite('暂无匹配项', 'icon_info');
          } else {
            wx.setStorage({
              key: "key",
              data: data
            })
            wx.redirectTo({
              url: '../C_cem_list/C_cem_list?key=',
            })
          }
        },
        fail: function () {
          wx.stopPullDownRefresh()
        }
      }
      cemeteryHttp.findPositionByCondition(dataRequest, detilasCallBack);
    }
  },
  onLoad: function () {
    var that = this;
    that.cemeteryListQuery();
  },
  onShow: function () {
    // var that = this;
    // console.log(that.data.GmList)
    // console.log(that.data.cemeteryIndex)

    // var selectItem = that.data.GmList[that.data.cemeteryIndex];
    // console.log(selectItem)
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生服务+',
      path: 'pages/C_cem/C_cem',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 1500
        })
      }
    }
  }

});