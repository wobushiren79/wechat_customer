//获取应用实例
var tcity = require("../../../utils/citys.js");
var storageKey=require('../../../utils/storage/StorageKey.js');

var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [22, 0, 1],
    values: [22, 0, 1],
    condition: false,
    footer:true,
    date: "请选择日期",
    time: "请选择时间",
    btn_1: true,
    btn_2:false
  },

  bindChange: function (e) {
    var that=this
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }
      
      that.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
      })
      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      that.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      that.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
      // 显示页脚
      footer: this.data.condition
    })
    // console.log(footer)
  },

  // 及时服务和预约服务
  bind_btn_1:function(){
    this.setData({
      btn_1: true,
      btn_2: false
    })
  },
  bind_btn_2: function () {
    this.setData({
      btn_1: false,
      btn_2: true
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  onLoad: function () {
    // console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    // console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[22].sub[i].name)
    }
    // console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[22].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      // serviceWay: 0,

      // 输入框初始化显示 四川省-成都市-锦江区
      'province': cityData[22].name, 
      'city': cityData[22].sub[0].name,
      'county': cityData[22].sub[0].sub[1].name,
      footer: true

      // 'province': '省',
      // 'city': '市',
      // 'county': '区'
    })
    console.log('初始化完成');
  },
  formSubmit:function(e){
    var that=this
    var bookTime=that.data.time
    // var 
    var kehu={}
    kehu = e.detail.value
    kehu.serviceLocation = kehu.serviceLocation+'  '+kehu.location
    if (!that.data.btn_1){
      kehu.bookTime = that.data.date + ' ' + that.data.time+':00'
      kehu.serviceWay=1
    }else{
      kehu.serviceWay = 0
      kehu.bookTime = ''
    }
    kehu.selfDelivery = ''
    kehu.selfDeliveryTime = ''
    if (kehu.contact == ''){
      wx.showToast({
        title: '联系人不能为空',
        image: '../../../images/icon_info.png',
        // mask: true,
        duration: 2000
      })
    } else if (kehu.contactPhone == ''){
      wx.showToast({
        title: '电话不能为空',
        image: '../../../images/icon_info.png',
        // mask: true,
        duration: 2000
      })
    } else if (kehu.location == ''){
      wx.showToast({
        title: '详细地址不能为空',
        image: '../../../images/icon_info.png',
        // mask: true,
        duration: 2000
      })
    }else{
    //客户填写信息
      wx.setStorageSync(storageKey.ORDER_SERVICE_INFO, kehu)
    wx.navigateBack({
      delta: 1
    })
    }

    //取出渠道
    // wx.getStorage({
    //   key: 'channel',
    //   success: function (r) {
    //     var channel_id = r.data.id
    //     kehu.orderChannel = channel_id
    //   }
    // })

    // console.log(e.detail.value)
  }
})
