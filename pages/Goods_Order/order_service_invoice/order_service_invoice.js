//获取应用实例
var tcity = require("../../../utils/citys.js");
var storageKey = require('../../../utils/storage/StorageKey.js');

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
    footer: true,
    need: false,
    head: false
  },

  bindChange: function (e) {
    var that = this
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
      // console.log('county no');
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

  // 需不需要发票
  bind_need: function (e) {
    var that = this
    var need_val = e.target.dataset.need
    console.log(need_val)
    if (need_val == 1) {
      this.setData({
        need: true
      })
    } else {
      this.setData({
        need: false
      })
    }
  },
  // 需不需要抬头
  bind_head: function (e) {
    var that = this
    var head_val = e.target.dataset.head
    // console.log(head_val)
    if (head_val == 1) {
      this.setData({
        head: true
      })
    } else {
      this.setData({
        head: false
      })
    }
  },



  onLoad: function () {
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[22].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[22].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,

      // 输入框初始化显示 四川省-成都市-锦江区
      'province': cityData[22].name,
      'city': cityData[22].sub[0].name,
      'county': cityData[22].sub[0].sub[1].name,
      footer: true
    })
  },
  formSubmit:function(e){
    var that=this
    var need = that.data.need
    var head = that.data.head
    var fapiao = e.detail.value
    if (need){
      fapiao.needInvoice=1
    }else{
      fapiao.needInvoice = 0
    }
    if (head){
      fapiao.titleType = 1
    }else{
      fapiao.titleType = 0
    }
    if (fapiao.needInvoice == 1 && fapiao.location){
      fapiao.receiptLocation = fapiao.receiptLocation + "  " + fapiao.location
    }
    if (fapiao.needInvoice == 1 && fapiao.titleType == 0){
      fapiao.title=''
      fapiao.invoiceRemark=''
      fapiao.companyTaxId=''
    }
    if (fapiao.needInvoice == 0){
      fapiao.companyTaxId=''
      fapiao.invoiceRemark=''
      fapiao.location==''
      fapiao.receiptLocation=''
      fapiao.receiptName=''
      fapiao.receiptPhone=''
      fapiao.title=''
      fapiao.titleType=''
    }
    //客户发票信息
    wx.setStorageSync(storageKey.ORDER_INVOICE_INFO, fapiao)
    wx.navigateBack({
      delta: 1
    })
    // fapiao.receiptLocation = receiptLocation+"  "+location
    // console.log(fapiao)
  }
})
