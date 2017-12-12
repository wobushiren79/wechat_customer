Page({
    data: {
        grids: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    onLoad: function (envt) {
     var that=this;
     wx.showLoading({
       title: '加载中!请稍后',
     })
     var ShanWebUrl = getApp().globalData.ShanWebUrl;
     var forData = {};
     var ForData = JSON.stringify(forData);
     wx.request({
       url: ShanWebUrl + 'Encylopedia/weiclass',
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
           var array_a = res.data.content
           var array_b = res.data.data
          //  console.log(array)
           that.setData({
             array_a: array_a,
             array_b: array_b,
           })

         } else {
           wx.showToast({
             title: res.data.message,
             duration: 3000
           })
         }
       }
     })
      that.setData({
        Class_a:envt.Class_a,
        Class_b:envt.Class_b
      })
    },
    xuanzhe:function(options){
      wx.setStorageSync('xuanzhe', options.currentTarget.dataset)
      wx.redirectTo({
        url: '../C_wiki/C_wiki'
      })
    }
});