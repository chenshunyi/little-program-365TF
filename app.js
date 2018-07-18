var common = require('./util/util.js');

App({
  onLaunch: function (options) {
		var that = this
		common.updateThis()
		wx.checkSession({
			success: function() {
				//登录态未过期
				console.log('登录态未过期');

				var sessionKey_value = wx.getStorageSync('user_3rdsession');
        if (!sessionKey_value) {
          common.login();
        }
			},
			fail: function() {
				console.log('登录态过期');
				common.login();
			}
		})
		this.globalData.systemInfo = wx.getSystemInfoSync();
		common.get_allcity();
	},
  onShow: function (options) {
    var that = this;

    if (options.query.city){
      that.globalData.city.code = options.query.city;
      that.globalData.city.cname = common.get_cityname(options.query.city);
    }
    else{
      that.globalData.city = {
        code: wx.getStorageSync('newcity').code == ('' || undefined || null) ? that.globalData.city.code : wx.getStorageSync('newcity').code,
        cname: wx.getStorageSync('newcity').code == ('' || undefined || null) ? that.globalData.city.cname : wx.getStorageSync('newcity').cname
      };
    }
    if (options.scene == 1036) {
      that.globalData.appFlag = true
    }
    else if (options.scene != 1089 && options.scene != 1090) {
      that.globalData.appFlag = false
    }
  },
	onHide: function() {},
	getSharedata: function() {
		var now_city = this.globalData.city.code;
		return {
			title: '365淘房，幸福安家首选网络平台，找新房、二手房、房产资讯',
			desc: '365淘房为您免费提供房屋的买卖、租赁、装修及社区生活为一体的一条龙服务',
			path: '/page/index/index?city=' + now_city
		}
	},
	globalData: {
		systemInfo: {},
		city: {
			code: 'nj',
			cname: '南京'
		},
		search_key: {},
		checkprices_arr: {},
		sharedata: {
			title: '365淘房，幸福安家首选网络平台，找新房、二手房、房产资讯',
			desc: '365淘房为您免费提供房屋的买卖、租赁、装修及社区生活为一体的一条龙服务',
			path: '/page/index/index'
		},
    appFlag:false
	}
})