var app = getApp();
var houseTeam = require('../../util/houseTeam.js');
Page({
	data: {
		scrollHeight: 0,
		listdata: [],
		title:"全部看房路线",
		index: -1,
		filter: false,
		isNull:false,
		isDown:false
	},
	onLoad: function(options) {
		var that = this,
			scrollHeight = app.globalData.systemInfo.windowHeight;
		that.setData({
			scrollHeight: scrollHeight
		});
		houseTeam.getListData(this, app.globalData.city);
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
	onShareAppMessage: function() {
		// 用户点击右上角分享
		return {
			title: '365淘房-看房团',
			desc: '规模最大最正规的南京看房活动，为您精心挑选多条优质看房线路！',
			path: '/page/houseteam/list?city='+app.globalData.city.code+'&cname='+app.globalData.city.cname
		}
	},
	pushDown: function() {
		if(!this.data.isDown) {
			this.setData({
				isDown: true
			})
		} else {
			this.setData({
				isDown: false
			})
		}
	},
	getNum: function(e) {
		if(e.currentTarget.dataset.idx == "all") {
			this.setData({
				index:-1,
				title:"全部路线",
				filter: false,
				isDown: false
			})
		} else {
			this.setData({
				index: e.currentTarget.dataset.idx,
				title: this.data.listdata.period_lines[e.currentTarget.dataset.idx].e_title,
				filter: true,
				isDown: false
			})
		}
	},
	closeWin: function(){
			this.setData({
			isDown: false
			})
	}
	,
	dial: function(e) { // 拨打电话
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel.replace("转", ",")
		})
	}
})