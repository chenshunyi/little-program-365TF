var until = require('../util/util.js');
//get news list data
function getNewsListData(that,list_type){
  var url   = until.config.News_List;
  var list_type = list_type ? list_type : that.data.list_type;
  var item  = list_type == 1 ? that.data.lpdg : that.data.rmzx;
  var data  = {
    city        : that.data.city,
    page        : item.page,
    pagesize    : item.page == 1 ? (item.pagesize*2) : item.pagesize,
    channel     : list_type
  }
  if(item.is_post == true) return false;
  item.is_post = true;setThatData(that,item,list_type);//请求排队中
  //请求数据
  until.ajax_curl(url,data,function(res){
    var result = res.data;
    if(result.result==1 && result.data.length>0){
      item.page = data.page==1 ? (data.page+2) : (data.page+1);
      item.list_data = item.list_data.concat(result.data);//合并数据
      setThatData(that,item,list_type);
      if(result.data.length < data.pagesize){
        item.no_more = true;setThatData(that,item,list_type);//数据小于分量，没有了
      }else{
        item.no_more = false;setThatData(that,item,list_type);
      }
    }else if(result.result==0 || result.data.length==0){
       if(data.page == 1) item.nodata = true;//第一页就没有数据
       else item.no_more = true;
       setThatData(that,item,list_type);//没有数据
    }
    item.is_post = false;setThatData(that,item,list_type);//退出请求排队
  });
}

function setThatData(that,data,list_type){
  if(list_type==1) that.setData({lpdg:data});
  else that.setData({rmzx:data});
}

//get new info data
function getNewsInfoData(that){
  var url = until.config.News_Detail;
  var data = {
    city  : that.data.city,
    id    : that.data.id
  }
  if(that.data.is_post == 'true') return false;
  until.ajax_curl(url,data,function(res){
     var result = res.data;
     if(result.result == 1 && result.data){
       //公共数据处理
       that.setData({
          n_title : result.data.n_title,
          n_from  : result.data.n_from,
          datetime: result.data.datetime
       });
       //音频处理
       if(result.data.audio_url){
         var audio = {
                      current: {
                                  poster  : result.data.audio_image ? result.data.audio_image : "https://m.house365.com/Public_new/images/wx_song.png",//封面
                                  name    : result.data.audio_title,//专辑名称
                                  author  : result.data.n_from,//作者
                                  src     : result.data.audio_url//播放地址
                                }
                    }
          that.setData({'audio':audio});
       }
       //视频处理
       //if(result.data.mobile_video && result.data.mobile_video.indexOf('flv')==-1)//规避flv
       if(result.data.mobile_video){
          var video = {
            src : result.data.mobile_video,//视频播放地址,
            pic : result.data.mobile_video_pic//视频封面
          }
          that.setData({video:video});
       }
       //资讯内容处理
       var imgs = [];
       if(result.data.n_content){
         for(var i in result.data.n_content) {
            if(result.data.n_content[i]['type']==1)
                imgs.push(result.data.n_content[i]['url']);//图集封装
            else
                result.data.n_content[i]['content'] = htmldecode(result.data.n_content[i]['content']);//html实体转换
          }
       }
       
        that.setData({imgs:imgs,n_content: result.data.n_content}); 
     }
     that.setData({is_post:false});
  });
}

//priview img
function viewImg(imgs,current){
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: imgs // 需要预览的图片http链接列表
  })
}

//过滤html实体
function htmldecode(str){  
  var s=    "";
  if(str.length == 0) return    "";  
  s    =    str.replace(/&gt;/g,"&");  
  s    =    s.replace(/&lt;/g,"<");  
  s    =    s.replace(/&gt;/g,">");  
  s    =    s.replace(/&nbsp;/g,"   ");  
  s    =    s.replace(/'/g,"\'");  
  s    =    s.replace(/&quot;/g,"\"");  
  s    =    s.replace(/ <br>/g,"\n");  
  s    =    s.replace(/&ldquo;/g,"");  
  s    =    s.replace(/&rdquo;/g,"");
  s    =    s.replace(/&lsquo;/g,"");
  s    =    s.replace(/&rsquo;/g,"");
  s    =    s.replace(/&mdash;/g,"");
  s    =    s.replace(/ellip;/g,"");
  s    =    s.replace(/&le;/g,"");
  s    =    s.replace(/&#9759;/g,"");
  s    =    s.replace(/&/g,">");
  return    s;  
}  

module.exports = {
  until           : until,
	getNewsListData : getNewsListData,
  getNewsInfoData : getNewsInfoData,
  viewImg         : viewImg,
  htmldecode      : htmldecode

}