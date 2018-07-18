// component/toAppBtn.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parameter:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: app.globalData.appFlag
  },

  /**
   * 组件的方法列表
   */
  methods: {
    launchAppError: function (e) {
      console.log(e.detail.errMsg)

      wx.showToast({
        title: "唤起失败",
        icon: 'none',
        duration: 500
      });
    } 
  }
})
