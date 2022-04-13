const UserModel = require("../../model/UserModel.js");
const BugModel = require("../../model/BugModel.js");

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
const searchData = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 0)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });

  try {
    let userTotal = await UserModel.count();
    let bugTotal = await BugModel.count();
    let completeBugs = (await BugModel.find({ status: 2 })?.count()) || 0;
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      userTotal,
      bugTotal,
      completeBugs,
    });
  } catch (err) {
    return (ctx.body = {
      state: -1,
      msg: "查询失败" + err,
    });
  }
};

const searchLineData = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 0)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });

  try {
    let createBugs = []; // 每一天创建的bug数量
    let completeBugs = []; // 每一天完成的bug数量
    for (let i = 7; i >= 1; i--) {
      stime = new Date().setHours(0, 0, 0, 0) - 86400 * i * 1000;
      etime = new Date().setHours(0, 0, 0, 0) - 86400 * (i - 1) * 1000;
      let createBugCount =
        (await BugModel.find({
          createTime: {
            $gte: stime,
            $lte: etime,
          },
        })?.count()) || 0;
      let completeBugCount =
        (await BugModel.find({
          fixedTime: {
            $gte: stime,
            $lte: etime,
          },
        })?.count()) || 0;
      createBugs.push(createBugCount);
      completeBugs.push(completeBugCount);
    }
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      createBugs,
      completeBugs,
    });
  } catch (err) {
    return (ctx.body = {
      state: -1,
      msg: "查询失败" + err,
    });
  }
};

module.exports = {
  searchData,
  searchLineData,
};
