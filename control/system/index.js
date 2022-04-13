const IpModel = require("../../model/IpModel");
const UserModel = require("../../model/UserModel")

// 鉴权中间件
const getUserRights = async (ctx) => {
  let username = ctx.cookies.get("username") || null;
  if (username) {
    // 有cookie时
    let user = await UserModel.find({ username });
    if (user.length > 0) {
      return (ctx.body = {
        state: 0,
        msg: "有登录态",
        user: user[0],
      });
    } else {
      return (ctx.body = {
        state: 0,
        msg: "查无此人",
        user: -1,
      });
    }
  } else {
    // 没用cookie，或者cookie过期时
    return (ctx.body = {
      state: 5,
      msg: "身份信息不存在或已过期",
      user: -1,
    });
  }
};

const postClientIp = async (ctx) => {
  try {
    const { type } = ctx.request.body;
    const ip =
      ctx.req.headers["x-forwarded-for"] ||
      ctx.req.connection.remoteAddress ||
      ctx.req.socket.remoteAddress ||
      ctx.req.connection.socket.remoteAddress;
    let date = new Date().getTime();
    let arr = ["用户登录", "修改用户信息", "修改任务信息"];
    const operation = arr[type];
    let operator = ctx.cookies.get("username") || null;
    let u = new IpModel({
      ip,
      date,
      type,
      operator,
      operation,
    });
    await u.save();
    return (ctx.body = {
      state: 0,
      msg: "成功",
    });
  } catch (err) {
    console.log("err: ", err);

    return (ctx.body = {
      state: -1,
      msg: err || "未知错误",
    });
  }
};

const searchIpList = async (ctx) => {
  try {
    let r = await getUserRights(ctx);
    if (r.state == 5) return r;
    let nowUserPower = r.user.power;
    if (nowUserPower < 2)
      return (ctx.body = {
        state: 4,
        msg: "您没有此权限",
      });
    let username = ctx.cookies.get("username") || null;
    if (username) {
      const { pageNum, pageSize } = ctx.request.body;
      // 分页查询用户列表
      let ipsList = await IpModel.find({})
        .skip(pageNum - 1 || 0)
        .limit(pageSize || 20)
        .sort({ status: 1 });
      let res = await IpModel.find({});
      let total = res?.length || 0;
      return (ctx.body = {
        state: 0,
        msg: "查询成功",
        total,
        ipsList,
      });
    }
  } catch (err) {
    console.log("err: ", err);

    return (ctx.body = {
      state: -1,
      msg: err || "未知错误",
    });
  }
};

module.exports = {
  postClientIp,
  searchIpList,
};
