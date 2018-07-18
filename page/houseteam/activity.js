var app = getApp();
var houseTeam = require('../../util/houseTeam.js');
Page({
	data: {
		tel:0,
		city:''
	},
	onLoad: function(options) {
		// 生命周期函数--监听页面加载
		this.setData({
			tel: options.e_tel,
			city: options.e_city,
		})
	},
	onShow: function() {
		// 生命周期函数--监听页面显示
	},
	onHide: function() {
		// 生命周期函数--监听页面隐藏
	},
	onUnload: function() {
		// 生命周期函数--监听页面卸载
	},
    onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
		title: '365淘房-看房团',
		desc: '规模最大最正规的南京看房活动，为您精心挑选多条优质看房线路！',
        path: '/page/houseteam/activity?city='+app.globalData.city.code
    }
  }
})