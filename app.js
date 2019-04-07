//app.js
var time = require('utils/util.js')
App({
  onLaunch: function() {
    wx.request({
        method:'post' ,
        url: 'https://blogai.cn/mp/posts',
        success:res=>{
            console.log(res.data)
            let post_ = res.data.posts;
          console.log('xian:' + new Date(post_[0]['time'].replace('GMT','')));
            for(var i=0;i<post_.length;i++){
              post_[i]['time'] = time.formatTime(new Date(post_[i]['time'].replace('GMT', '')))
             let comment_ = post_[i].new_comment.comments;
                for (var j = 0; j < comment_.length; j++) {
                  comment_[j]['time'] = time.formatTime(new Date(comment_[j]['time'].replace('GMT', '')))
                    let reply_ = comment_[j].replies.r;
                    for (let k=0;k<reply_.length;k++){
                      reply_[k]['time'] = time.formatTime(new Date(reply_[k]['time'].replace('GMT', '')))
                    }
                }
             }
          console.log('hou:' + post_[0]['time'])
            this.globalData.posts = res.data.posts
            if (this.postsReadyCallback){
                this.postsReadyCallback(res.posts)
            }
        },
        fail:err=>{
            console.log('errMsg!:'+err)
        }
    })
    // 登录
    wx.login({
      success: res => {
        if (res.code){
         
        }
      }
    })
 
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
    wx.getSystemInfo({
      success: e => {
          console.log('systemInfo:'+e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log('custom:'+custom)
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  globalData: {
    userInfo: null,
    posts:''
  }
})