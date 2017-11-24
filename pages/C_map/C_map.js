// map.js
Page({
  data: {
    markers: [{
      iconPath: "../../images/zuobiao.png",
      id: 0,
      alpha: .5,
      callout: {
        content: "圆满人生大基地",
        color: "#353535",
        fontSize: "12px",
        borderRadius: "5px",
        bgColor: "#e6e6e6",
        padding: "10px",
        display: "BYCLICK"
      },
      latitude: 30.6197300000,
      longitude: 104.1141600000,
      width: 25,
      height: 25
    }, {
      iconPath: "../../images/zuobiao.png",
      id: '../C_aboutme/C_aboutme',
    
      callout: {
        content: "红牌楼",
        color: "#353535",
        fontSize: "12px",
        borderRadius: "5px",
        bgColor: "#e6e6e6",
        padding: "10px",
        display: "BYCLICK"
      },
      latitude: 30.6309500000,
      longitude: 104.0255600000,
      width: 25,
      height: 25
    }, {
      iconPath: "../../images/zuobiao.png",
      id: 'C_order/C_order',
      callout: {
        content: "天府广场",
        color: "#353535",
        fontSize: "12px",
        borderRadius: "5px",
        bgColor: "#e6e6e6",
        padding: "10px",
        display: "BYCLICK"
      },
      latitude: 30.6574200000,
      longitude: 104.0658400000,
      width: 25,
      height: 25
    }, {
      iconPath: "../../images/zuobiao.png",
      id: 'C_index/C_index',
      callout: {
        content: "四川大学(望江校区)",
        color: "#353535",
        fontSize: "12px",
        borderRadius: "5px",
        bgColor: "#e6e6e6",
        padding: "10px",
        display: "BYCLICK"
      },
      latitude: 30.637545,
      longitude: 104.088119,
      width: 25,
      height: 25
    }
    ]
    
  },
  // regionchange(e) {
  //   console.log(e.type)
  // },
  markertap(e) {
    console.log(e.markerId)
  },
  callouttap(e){
    console.log(e)
    var url1 = e.markerId
    console.log(url1)
    // wx.switchTab({
    //   url:'../C_order/C_order'
    // })
    wx.reLaunch({
      url: '../'+url1
    })
  },
  bindcallphone:function(){
    wx.makePhoneCall({
      phoneNumber: '966188' 
    })
  }
  
})