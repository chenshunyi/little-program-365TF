// pages/consult/consult.js
var app = getApp();
var mod = require('../../util/util.js');
var that;

Page({
  data: {
    wordNum: 0,
    imageList: [],
    imageCount: 4,
    imageTotalNum: 4,
    uploadInfoList: [],
    commentDetail: '',
    payPrice: 0,
    isAgain: 0,
    btnSubmitLoading: false,
    requestParam: {
      city: '',
      fbsid: '',
      question: '',
      pic: '',
      formId: '',
      qaid: '',
    },
    payParam: {
      order_id: ''
    }

  },

  onLoad: function (options) {
    that = this;
    that.data.requestParam.fbsid = options.expertId;
    that.data.requestParam.qaid = options.id;
    that.data.requestParam.city = app.globalData.city.code;
    that.setData({
      requestParam: that.data.requestParam,
      isAgain: options.isAgain == "1" ? 1 : 0
    });

    if (that.data.requestParam.qaid) {
      if (!that.data.isAgain) {
        //从未支付进入
        that.getCommentDetail();
      }
    } else {
      that.getPayPrice();
    }
  },

  //请求房博士价格
  getPayPrice: function () {
    mod.fbs_ajax_curl(
      mod.config.Fbs_PersonDetail,
      that.data.requestParam,
      function (data) {
        if (data.result) {
          that.setData({
            payPrice: data.data.total_fee,
          });
        } else {
          wx.showToast({
            title: data.mess,
            icon: 'none',
            duration: 1500
          })
        }
      })
  },


  //输入框字数检测
  inputDetect: function (e) {
    var str = e.detail.value;
    that.data.requestParam.question = str;
    that.setData({
      wordNum: str.length,
      requestParam: that.data.requestParam
    });
  },

  //选择图片
  chooseImage: function () {
    wx.chooseImage({
      count: that.data.imageCount,
      sizeType: ['compressed'],
      success: function (res) {
        var paths = res.tempFilePaths;

        for (var i = 0; i < paths.length; i++) {
          var uploadItem = {};
          uploadItem.progress = 0;
          uploadItem.isLoadfail = false;
          uploadItem.isLoading = true;
          uploadItem.imgUrl = paths[i];
          uploadItem.uploadTask = '';

          that.data.uploadInfoList.push(uploadItem);
        }
        that.data.imageCount = that.data.imageCount - paths.length;

        that.setData({
          imageCount: that.data.imageCount,
          uploadInfoList: that.data.uploadInfoList
        });

        for (var j = 0; j < that.data.uploadInfoList.length; j++) {
          if (that.data.uploadInfoList[j].progress == 0) {
            that.uploadImage(j);
          }
        }
      }
    });
  },

  //上传图片
  uploadImage: function (idx) {
    var uploadTask = wx.uploadFile({
      url: mod.config.Fbs_UploadPic,
      filePath: that.data.uploadInfoList[idx].imgUrl,
      name: 'file',
      formData: {
        'user_3rdsession': wx.getStorageSync('user_3rdsession')
      },
      success: function (res) {
        var resp = JSON.parse(res.data),
          data = resp.data;
        if (data.result) {
          that.data.imageList.push(data.url);
          that.data.uploadInfoList[idx].imgUrl = data.url;
          that.data.requestParam.pic = that.data.imageList.join(',');
        } else {
          that.data.uploadInfoList[idx].isLoadfail = true;
        }

        that.setData({
          imageList: that.data.imageList,
          uploadInfoList: that.data.uploadInfoList,
          requestParam: that.data.requestParam
        });
      },
      fail: function (e) {
        that.data.uploadInfoList[idx].isLoadfail = true;
        that.setData({
          uploadInfoList: that.data.uploadInfoList
        });
      },
      complete: function () {
        that.data.uploadInfoList[idx].isLoading = false;
        that.setData({
          uploadInfoList: that.data.uploadInfoList
        });
      }
    });

    uploadTask.onProgressUpdate((res) => {
      that.data.uploadInfoList[idx].progress = res.progress;
      that.setData({
        uploadInfoList: that.data.uploadInfoList
      });
    });

    that.data.uploadInfoList[idx].uploadTask = uploadTask;
    that.setData({
      uploadInfoList: that.data.uploadInfoList
    });
  },

  //删除上传后的图片
  deleteImage: function (e) {
    var idx = e.target.dataset.index;

    that.data.imageCount = that.data.imageCount + 1;
    that.data.imageList.splice(idx, 1);
    that.data.requestParam.pic = that.data.imageList.join(',');

    if (that.data.uploadInfoList[idx].uploadTask) {
      that.data.uploadInfoList[idx].uploadTask.abort(); // 取消上传任务
    }
    that.data.uploadInfoList.splice(idx, 1);

    that.setData({
      imageCount: that.data.imageCount,
      imageList: that.data.imageList,
      uploadInfoList: that.data.uploadInfoList,
      requestParam: that.data.requestParam
    });
  },

  //大图预览上传后的图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: that.data.imageList
    })
  },

  //获取评论详情
  getCommentDetail: function () {
    mod.fbs_ajax_curl(
      mod.config.Fbs_ConsultDetail,
      that.data.requestParam,
      function (data) {
        if (data.result) {
          if (data.data.pic !== '') {
            var pics = data.data.pic.split(",");
            for (var i = 0; i < pics.length; i++) {
              var picItem = {};
              picItem.isLoadfail = false;
              picItem.isLoading = false;
              picItem.imgUrl = pics[i];
              that.data.imageList.push(pics[i]);
              that.data.uploadInfoList.push(picItem);
            }
          }
          that.data.requestParam.question = data.data.question;
          that.setData({
            requestParam: that.data.requestParam,
            payPrice: data.data.total_fee,
            wordNum: data.data.question.length,
            imageList: that.data.imageList,
            uploadInfoList: that.data.uploadInfoList
          });
        } else {
          wx.showToast({
            title: data.mess,
            icon: 'none',
            duration: 1500
          })
        }
      }, 'POST')
  },

  //表单提交
  formSubmit: function (e) {
    var loadNum = 0;
    for (var i = 0; i < that.data.uploadInfoList.length; i++) {
      if (that.data.uploadInfoList[i].isLoading) loadNum++;
    }
    if (loadNum) {
      wx.showModal({
        content: '有图片正在上传，请稍等',
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    if (!that.data.requestParam.question) {
      wx.showModal({
        content: '请输入问题描述内容',
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    if (that.data.btnSubmitLoading) return;


    that.data.requestParam.formId = e.detail.formId;
    that.setData({
      btnSubmitLoading: true,
      requestParam: that.data.requestParam
    });
    if (that.data.isAgain) {
      //追问
      mod.fbs_ajax_curl(
        mod.config.Fbs_SubmitAgain,
        that.data.requestParam,
        function (data) {
          that.setData({
            btnSubmitLoading: false
          });
          if (data.result) {
            // 直接跳转
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: data.mess,
              icon: 'none',
              duration: 1500
            })
          }
        }, 'POST');
    } else {
      //提问
      mod.fbs_ajax_curl(
        mod.config.Fbs_SubmitConsult,
        that.data.requestParam,
        function (data) {
          that.setData({
            btnSubmitLoading: false
          });

          if (data.result) {
            //订单id保存 如果在本页面未支付继续提问，则为同一个id
            that.data.requestParam.qaid = data.data.id;
            that.setData({
              requestParam: that.data.requestParam,
            });

            if (that.data.payPrice > 0) {
              that.data.payParam.order_id = data.data.id;
              that.setData({
                payParam: that.data.payParam
              });
              //请求微信支付接口
              that.wxPayRequest(data.data.id);
            } else {
              // 直接跳转
              wx.redirectTo({
                url: '/fbs/detail/detail?&id=' + data.data.id,
              })
            }
          } else {
            wx.showToast({
              title: data.mess,
              icon: 'none',
              duration: 1500
            })
          }
        }, 'POST');
    }
  },

  wxPayRequest: function (id) {
    mod.fbs_ajax_curl(
      mod.config.Fbs_WXPay,
      that.data.payParam,
      function (data) {
        if (data.result) {
          //微信支付
          wx.requestPayment({
            'timeStamp': data.jsApiParameters.timeStamp,
            'nonceStr': data.jsApiParameters.nonceStr,
            'package': data.jsApiParameters.package,
            'signType': data.jsApiParameters.signType,
            'paySign': data.jsApiParameters.paySign,
            'success': function (res) {
              // 直接跳转
              console.log("success");
              wx.redirectTo({
                url: '/fbs/detail/detail?&id=' + id,
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付取消',
                icon: 'none',
                duration: 1500
              })
            },
            'complete': function (res) {
            }
          });
        } else {
          wx.showToast({
            title: data.mess,
            icon: 'none',
            duration: 1500
          })
        }
      });
  },
  notice: function () {
    wx.navigateTo({
      url: '/fbs/notice/notice?&isConsult=1',
    })
  }

})