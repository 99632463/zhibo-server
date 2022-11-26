'use strict';

const Controller = require('egg').Controller;

class LiveController extends Controller {
  // 列表
  async index() {
    const { ctx, app } = this;

    let tabs = [{
      name:"全部",
      url:"/admin/live",
      active:false
    },{
        name:"直播中",
        url:"?status=1",
        status:1,
        active:false
    },{
        name:"未开播",
        url:"?status=0",
        status:0,
        active:false
    },{
        name:"已结束",
        url:"?status=3",
        status:3,
        active:false
    }]
    tabs = tabs.map(item=>{
      if( (!ctx.query.status && ctx.query.status != 0 && item.url === '/admin/live') || item.status == ctx.query.status){
          item.active = true
      }
      return item
    })
    let where = (!ctx.query.status && ctx.query.status != 0) ? {} : {
        status:ctx.query.status
    }

    let data = await ctx.page('Live', where, {
      include: [{
        model: app.model.User,
        attributes: ['id', 'username']
      }]
    })

    data = JSON.parse(JSON.stringify(data))

    await ctx.renderTemplate({
      title: "直播间列表",
      tempType: "table",
      table: {
        tabs,
        // 表头
        columns: [
        {
          title: "直播间",
          fixed: 'left',
          render(item) {
            let image = item.cover ? item.cover : '/public/assets/img/profiles/avatar-03.jpg'
            return `
                    <h2 class="table-avatar">
                        <a class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${image}"></a>
                        <a>
                        ${item.title}
                        <span>创建人：${item.user.username}</span>
                        </a>
                    </h2>
                    `
          }
        }, {
          title: "观看人数",
          fixed: 'center',
          key: "look_count"
        }, {
          title: "金币数",
          fixed: 'center',
          key: "coin"
        }, {
          title: "创建时间",
          fixed: 'center',
          width: 180,
          key: "created_time"
        }, {
          title: "操作",
          width: 200,
          fixed: 'center',
          action: {
            delete: function (id) {
              return `/admin/live/delete/${id}`
            }
          }
        }]
      },
      data
    })
  }
}

module.exports = LiveController;
