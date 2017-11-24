Page({
    data: {

      GmList: [],
        countryIndex: 0,

    },


    bindCountryChange: function(e) {
        this.setData({
            countryIndex: e.detail.value
        })
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
    },
    formSubmit:function(e){
      // wx.showLoading({
      //   title: '查询中'
      // })
      var that = this;
      var that = this
      var GmUrl = getApp().globalData.GmUrl
      var content = e.detail.value;
      var gmlist = that.data.gmList
      var countryIndex = that.data.countryIndex
      for (var i in gmlist){
        content.cemeteryId =gmlist[countryIndex].id
        content.cemeteryName = gmlist[countryIndex].name
      }
      if (content.agentManName || content.agentManPhone || content.deadMan){
        var forData = { content: content }
        //转换字符串
        var ForData = JSON.stringify(forData)
        // console.log(ForData)
        wx.request({
          url: GmUrl + 'marketing/wechat/query/order',
          method: "POST",
          data: ForData,

          header: {
            "Content-Type": "application/x-www-form-urlencodeed",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            // console.log(res)
            if (res.data.code == 1000) {
              var muWei = res.data.content.list
              // //操作成功返回consultId進行緩存
             

              if (muWei.length >0){
                setTimeout(function () {
                  wx.hideLoading()
                }, 0)
                wx.setStorageSync('muWei', muWei)
                // //頁面跳轉
                wx.navigateTo({
                  url: '../C_cem_list/C_cem_list',
                })
              }else{
                // setTimeout(function () {
                //   wx.hideLoading()
                // }, 0)
                wx.showToast({
                  title: '未查询到记录,请重新查询',
                  duration: 2000
                })
              }

            }else{
              setTimeout(function () {
                wx.hideLoading()
              }, 0)
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          image:'../../images/jingshi.png',
          // icon:"warn",
          title:'查询条件必填一个',
          duration: 1000
        })
      }
    },
    onLoad: function () {
      var that = this
      var GmUrl = getApp().globalData.GmUrl
      var Contentdata = { content: { dictCode: 'consultTrafficWay' } }
      var ContentData = JSON.stringify(Contentdata)
      //请求字典接口和公墓接口
          //查询公墓接口
          wx.request({
            url: GmUrl + 'marketing/wechat/structure/list',
            method: "POST",
            data: "{\"content\":{\"itemType\":0}}",

            header: {
              "Content-Type": "application/x-www-form-urlencodeed",
              // "Cookie": "sid=" + res.data.content.sessionId
            },
            success: function (res) {
              // console.log(res)
              if (res.data.code == 1000) {
                var gmList = res.data.content.items
                var GmList = []
                for (var i in gmList) {
                  GmList.push(gmList[i].name)
                }
                that.setData({
                  GmList: GmList,
                  gmList: gmList
                })
              }else{
                wx.showToast({
                  title: res.data.message,
                  duration: 2000
                })
              }
            },
            file:function(){
              wx.showToast({
                title: '网络错误,请稍后再试',
                duration: 2000
              })
            }
          })
        },

});