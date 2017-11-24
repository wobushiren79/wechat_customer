Page({
    data: {


    },
    onLoad:function(){
      var that = this
      // 取出缓存选择信息
      wx.getStorage({
        key: 'muWei',
        success: function (res) {
          // console.log(res)
          that.setData({
            listData:res.data
            // Class_a: res.data.class_a,
            // Class_b: res.data.class_b,

          })
        }
      })
 }
});