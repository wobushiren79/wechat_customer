Page({
    data: {
      showModalStatus_img_map: false, //图片弹窗参数  墓穴位置图
      showModalStatus_img_picture: false, //图片弹窗参数   墓碑照片
      showModalStatus_img_name: false, //图片弹窗参数   客户签名
      showModalStatus_mask: false, //遮罩层弹窗参数
      
    },

    // 弹窗事件
    powerDrawer: function (e) {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    },
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例   
      var animation = wx.createAnimation({
        duration: 200,  //动画时长  
        timingFunction: "linear", //线性  
        delay: 0  //0则不延迟  
      });

      // 第2步：这个动画实例赋给当前的动画实例  
      this.animation = animation;

      // 第3步：执行第一组动画  
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存  
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画  
      setTimeout(function () {
        // 执行第二组动画  
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
        this.setData({
          animationData: animation
        })

        //关闭  所有弹窗
        if (currentStatu == "close") {
          this.setData(
            {
              showModalStatus_img_map: false,
              showModalStatus_img_picture: false,
              showModalStatus_img_name: false,
              showModalStatus_mask: false
            }
          );
        }
      }.bind(this), 200)

      // 显示  图片弹窗  墓穴位置图
      if (currentStatu == "img_map_open") {
        this.setData(
          {
            showModalStatus_img_map: true,
            showModalStatus_mask: true
          }
        );
      }

      // 显示  图片弹窗  墓碑照片图
      if (currentStatu == "img_picture_open") {
        this.setData(
          {
            showModalStatus_img_picture: true,
            showModalStatus_mask: true
          }
        );
      }

      // 显示  图片弹窗  客户签名
      if (currentStatu == "img_name_open") {
        this.setData(
          {
            showModalStatus_img_name: true,
            showModalStatus_mask: true
          }
        );
      }

    },

    // 打电话
    call_phone: function () {
      wx.makePhoneCall({
        phoneNumber: '12345678900', //此号码并非真实电话号码，仅用于测试
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    onLoad:function(e){
      var that=this
      var huanc=e.hc
      var keydata=e.key
      if (huanc == 'order'){
        // 取出缓存选择信息
        wx.getStorage({
          key: 'order',
          success: function (res) {
            var listData = ''
            for (var i in res.data) {
              listData = res.data[e.key]
            }
            // console.log(listData)
            that.setData({
              listData: listData

            })
          }
        })
      }



    }
});