Page({
    data: {
    },
    onShow:function(){
      var that=this
      // 取出缓存order列表信息
      wx.getStorage({
        key: 'order',
        success: function (res) {
          // console.log(res.data)
          that.setData({
            orderData: res.data
            // Class_a: res.data.class_a,
            // Class_b: res.data.class_b,
          })
        }
      })
    }
});