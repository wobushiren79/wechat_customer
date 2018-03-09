App({
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false
    }
});
//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {

        userInfo: null,
        ShanWebUrl: "https://m.e-funeral.cn/",
        ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
        GmUrl: "https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/",
        // GmUrl:"http://192.168.0.37:8088/app/",
        // PHPGoodsUrl: "http://192.168.0.54/shian_goods/",
        // PHPGoodsPicUrl: "http://192.168.0.54/shian_goods/Public/Uploads/",

        PHPGoodsUrl: "https://goodsmgr.e-funeral.cn/",
        //PHPGoodsUrl: "http://192.168.0.61/shian_goods/",
        PHPGoodsPicUrl: "https://goodsmgr.e-funeral.cn/Public/Uploads/",
        // JavaGoodsUrl: "http://192.168.0.57:8089/goods/",
        // JavaPlatformUrl: "http://192.168.0.57:8080/ki4so-web/",
        // JavaCemeteryUrl: "http://192.168.0.57:8089/app/",

        JavaGoodsUrl:"https://goods.shianlife.cn/",
        JavaPlatformUrl:"https://platform.shianlife.cn/",
        JavaCemeteryUrl:"https://t-cemetery-api.shianlife.cn/",
        QiniuFilePathPrefix:"http://oq6rkq859.bkt.clouddn.com/",
        UploadFileNamePrefix:"customer_wechatSmallApp",
        AliyunFilePathPrefix: "",

    },
    pagesPositionUrl:{
        "C_aboutme": "/pages/C_aboutme/C_aboutme",
        "complain_customer":"/pages/others/complain_customer/complain_customer",
        "evaluation_customer":"/pages/others/evaluation_customer/evaluation_customer"
    },
    platformId: 0,//平台id为0
    myreg: /^1[2|3|4|5|6|7|8][0-9]\d{8}$/,//手机号验证
})