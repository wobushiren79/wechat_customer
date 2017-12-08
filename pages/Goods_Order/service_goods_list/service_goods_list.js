Page({
  data: {
    show: false,
    list_show: true,
    indexs:0,
  },
  bind_list: function (e) {
    var that = this;
    if(that.data.indexs == e.currentTarget.dataset.indexs){
      that.setData({
        list_show: (!that.data.list_show),
        indexs: e.currentTarget.dataset.indexs
      })
    }else{
      that.setData({
        list_show: true,
        indexs: e.currentTarget.dataset.indexs
      })
    }
  },
  onLoad:function(){
    var that=this
    wx.getStorage({
      key: 'speclist',
      success: function (res) {
        that.setData({
          speclist:res.data
        })
      },
      fail:function(){
        wx.showToast({
          title: '网络忙',
          image: '../../images/icon_info.png',
          duration: 2000,
          // mask:true,
        })
      }
    })
  }
});
