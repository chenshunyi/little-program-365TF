var common = require('./util.js');
function getPagelist (that) {

  	if (that.data.showtip == 2 || that.data.showtip == 3 ) {
		return;
  	}

	
	that.setData({
		showtip: 1
	});

	common.ajax_curl(
		common.config.Newhouse_List,
		that.data.searchconfig,
		function (res) {
	//	console.log(res.data);
		//清空列表
		if (that.isclearlist == 1) {
			that.setData({
			houseitems: []
			});
			that.isclearlist = 0;
		}

		if (!res.data.data.length) {
			//no more result
			if(that.data.searchconfig.page == 1){
			that.setData({
				showtip: 3
			});
			return;
			}
			that.setData({
			showtip: 2
			});
			return;
		}
		var allitems = that.data.houseitems;
		//链接打开方式
		for(var i in res.data.data){
			res.data.data[i].opentype = "navigate";
		}
		allitems.push.apply(allitems, res.data.data);
		that.setData({
			houseitems: allitems,
			showtip: 0,
		});
		}
	);
}
  //请求配置
function getConfig(that,citycode) {
    common.ajax_curl(
      common.config.Newhouse_Config,
      {
        city: citycode,
      },
      function (res) {
        //区属配置
        var tmp_dist = [{ "tag_type": "dist", "tag_id": 0, "tag_name": "不限" }];
				if(!res.data.data.newhouse.district){
					res.data.data.newhouse.district = [];
				}
        for (var i in res.data.data.newhouse.district) {
          for (var j in res.data.data.newhouse.district[i]) {
            tmp_dist.push({ "tag_type": "dist", "tag_id": j, "tag_name": res.data.data.newhouse.district[i][j] });
          }
        }
        //价格配置
        var tmp_price = [{ "tag_type": "price", "tag_id": 0, "tag_name": "不限" }];
				if(!res.data.data.newhouse.price){
					res.data.data.newhouse.price = [];
				}
        for (var i in res.data.data.newhouse.price) {
          for (var j in res.data.data.newhouse.price[i]) {
            tmp_price.push({ "tag_type": "price", "tag_id": j, "tag_name": res.data.data.newhouse.price[i][j] });
          }
        }
        //户型配置
				if(!res.data.data.newhouse.roomtag){
					res.data.data.newhouse.roomtag = [];
				}
        res.data.data.newhouse.roomtag.unshift({ "tag_type": "roomtag_id", "tag_id": 0, "tag_name": "不限" });
        for (var i in res.data.data.newhouse.roomtag) {
          res.data.data.newhouse.roomtag[i]['tag_type'] = "roomtag_id";
        }


        var tmp = [];

        tmp.push(tmp_dist);
        tmp.push(tmp_price);
        tmp.push(res.data.data.newhouse.roomtag);
        //设置数值
        that.setData({
          downlist: tmp
        });
      });
}


module.exports = {
	getPagelist:getPagelist,
	getConfig:getConfig
};