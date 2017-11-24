

Page({
  data: {
    Class_a: "全部",
    Class_b: "二级",
  },
  SETDATA: function (){

  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生服务+',
      path: 'pages/C_wiki/C_wiki',
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
  onLoad: function () {
    wx.showLoading({
      title: '加载中!请稍后',
    })
    var that = this
    var ShanWebUrl = getApp().globalData.ShanWebUrl
    // var Class_a=that.data.Class_a
    // var Class_b = that.data.Class_b
    // 取出缓存选择信息
    // wx.getStorage({
    //   key: 'xuanzhe',
    //   fail: function (res) {
          // console.log(2222)
          var forData = {}
          var ForData = JSON.stringify(forData)
          var that = this
          wx.request({
            url: ShanWebUrl + 'Encylopedia/morenindex',
            method: "POST",
            data: ForData,
            header: {
              "Content-Type": "application/x-www-form-urlencodeed"
            },
            success: function (res) {
              if (res.data.code == 1000) {
                setTimeout(function () {
                  wx.hideLoading()
                }, 0)
                var array = res.data.content
                that.setData({
                  array: array,
                  Class_a: res.data.Class_a,
                  Class_b: res.data.Class_b
                })

              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 3000
                })
              }
            }
          })
    //     }
      
    // })
  },
  onShow:function(){
    wx.showLoading({
      title: '加载中!请稍后',
    })
    var that = this
    var ShanWebUrl = getApp().globalData.ShanWebUrl
    var array_a=[];
    // 取出缓存选择信息
    wx.getStorage({
      key: 'xuanzhe',
      success: function (res) {
        wx.request({
          url: ShanWebUrl + 'Encylopedia/weiindex?name=' + res.data.class_b,
          method: "GET",
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed"
          },
          success: function (data) {
            // console.log(data)
            if (data.data.code == 1000) {
              setTimeout(function () {
                wx.hideLoading()
              }, 0)
              array_a = data.data.content
              that.setData({
                array: data.data.content,
              })
            } else {
              wx.showToast({
                title: data.data.message,
                duration: 3000
              })
            }
          }
        })
       that.setData({
         Class_a:res.data.class_a,
         Class_b:res.data.class_b,
         
       })
      }
    })
  }
});