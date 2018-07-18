const until = require('util.js');
//获取配置
function getConfig(that,city){
	var url = until.config.Secondhouse_Config;
	var data = {
		'city': city
	}
	if(that.data.is_config == 'true') return false;
	that.setData({
              is_config: true
      });
	until.ajax_curl(url,data,function(res){
		var downlist = [];
			downlist.push(res.data.district);
			downlist.push(res.data.price);
			downlist.push(res.data.room);
			that.setData({'downlist':downlist});
	});
}
//get news list data
function getListData(that,city){
  var url = until.config.Secondhouse_List;
  var data = {
		"name"     :"HouseSell",
    'city'     : city.code,
    'page'     : that.data.page,
    'pagesize' :that.data.pagesize ,
		'district' :that.data.currentItem[0],
		'price'	   :that.data.currentItem[1],
		'room'	   :that.data.currentItem[2],
		'api_key'  :'tfxcx'
  }
	if(that.data.keyword!=undefined){
			data.keyword=that.data.keyword;
	}
  if(that.data.is_post == 'true') return false;
	if(that.data.no_more == 'true') return false;
	that.setData({
        is_post: true
  });
  until.ajax_curl(url,data,function(res){
		if(res.data.length>0){
			var listdata=res.data;
			var page = data.page+1;
			var append_data = that.data.listdata;
			append_data = append_data.concat(listdata);
			if(res.data.length<data.pagesize) {
					that.setData({'no_more':'true'});
			}else{
					that.setData({'no_more':'false'});
			}
			that.setData({'page':page,'listdata':append_data});
		}else{
				if(data.page==1){
					that.setData({'no_list':true});
				}else{
					that.setData({'no_more':true});
				}
		}
		that.setData({'is_post':'false'});
	});
}

//get new info data
function getInfoData(that,city){
  var url = until.config.Secondhouse_Detail;
  var data = {
    'cityid'  : city.code,
		'city' 		:city.cname,
    'id'    	: that.data.id,
		'user_3rdsession':wx.getStorageSync('user_3rdsession')
  }
  if(that.data.is_post == 'true') return false;
	that.setData({
        is_post: true
  });
  until.ajax_curl(url,data,function(res){
			
			var o={
				iconPath: "/image/address.png",
				id: 0,
				latitude: res.data.blockinfo.lat,
				longitude: res.data.blockinfo.lng,
				width: 30,
				height: 30,
			}
			var markers = [];
			markers.push(o); 
			if(res.data.xiaoxuexuequ.length>0){
				that.setData({'isxiaoxue':'true','xiaoxue':res.data.xiaoxuexuequ[0],});
			}
			if(res.data.zhongxuexuequ.length>0){
				that.setData({'iszhongxue':'true','zhongxue':res.data.zhongxuexuequ[0],});
			}
			if(res.data.remarknew.length>0){
				res.data.remarknew=htmldecode(res.data.remarknew);
			}
			if(res.data.blockinfo.b_other.length>0){
				res.data.blockinfo.b_other=htmldecode(res.data.blockinfo.b_other);
			}
			if(res.data.pics==''){
				res.data.pics=["https://m.house365.com/Public/images/nopic.png"];
			}
			wx.hideToast();
			wx.setNavigationBarTitle({
				title: res.data.blockinfo.blockname
			})
			that.setData({'detaildata':res.data,'markers':markers,'latitude':res.data.blockinfo.lat,'longitude':res.data.blockinfo.lng,'list_arr':res.data.xhlist});
			//console.log('aa',res.data)
			aa(that,res.data.remarknew,res.data.blockinfo.b_other);
  });
}
function aa(that,remarknew,b_other){
	    // 超出四行隐藏
    if (remarknew.length > 114) {
      that.setData({
        islong: true,
				up:false
      })
    }
		if (b_other.length > 114) {
      that.setData({
        islong2: true,
				up2:false
      })
    }
}
//过滤html实体
function htmldecode(str){  
  var    s    =    "";
  if(str.length == 0) return    "";  
  s    =    str.replace(/&gt;/g,""); 
  s    =    s.replace(/&lt;/g,"");  
  s    =    s.replace(/&gt;/g,"");  
  s    =    s.replace(/&nbsp;/g,"");  
  s    =    s.replace(/'/g,"");  
	s    =    s.replace(/ /g,"");
  s    =    s.replace(/&quot;/g,"");  
  s    =    s.replace(/ <br>/g,"\n");  
  s    =    s.replace(/&ldquo;/g,"");  
  s    =    s.replace(/&rdquo;/g,"");
  s    =    s.replace(/&lsquo;/g,"");
  s    =    s.replace(/&rsquo;/g,"");
  s    =    s.replace(/&mdash;/g,"");
  s    =    s.replace(/ellip;/g,"");
  s    =    s.replace(/&le;/g,"");
  s    =    s.replace(/&#9759;/g,"");
  return    s;  
}
module.exports = {
	getConfig:getConfig,
	getListData:getListData,
	until:until,
	getInfoData:getInfoData,
}