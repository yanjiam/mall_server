const UserModel = require("../../model/UserModel.js");
const BugModel = require("../../model/BugModel.js");
const sendEmail = require("../../email/index");
const moment = require("moment");
// require模块，模块里的代码才会执行

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

const writeCookie = (ctx, name, pass) => {
  const cookieConfig = {
    domain: "localhost", // 在这个域名中生效
    path: "/",
    maxAge: 60 * 60 * 12 * 1000,
    httpOnly: true, // 前端是否可见
    overwrite: false, //前端不可重写
  };
  // 不允许写中文，需要decode
  let deName = encodeURIComponent(name);
  let dePass = encodeURIComponent(pass);
  ctx.cookies.set("username", deName, cookieConfig);
  ctx.cookies.set("passwd", dePass, cookieConfig);

  ctx.session = {
    deName,
    dePass,
  };
};

const createBug = async (ctx) => {
  let username = ctx.cookies.get("username") || null;
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 1)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const {
    bugType,
    content,
    priority,
    receiver,
    relationProject,
    remarks,
    severity,
    title,
  } = ctx.request.body;

  let bug = await BugModel.findOne({ title });
  if (!bug) {
    // 如果用户名还没被使用
    try {
      let l = await UserModel.find({ username });
      let user = l[0];
      let createTime = new Date();
      let u = new BugModel({
        receiver,
        submitter: user?.username,
        createTime,
        title,
        content,
        relationProject,
        priority,
        severity,
        remarks,
        bugType,
      });
      await u.save();

      // let r = await UserModel.find({ username: receiver });
      // let receiverEmail = r?.[0]?.email;
      // let dateText = moment(+createTime).format("YYYY年MM月DD日 HH:mm");
      // await sendEmail({
      //   to: receiverEmail,
      //   title,
      //   relationProject,
      //   createTime: dateText,
      //   submitter: user?.username,
      //   url: "http://localhost:8080/bug/myTask",
      // });

      return (ctx.body = {
        state: 0,
        msg: "创建bug成功",
        u,
      });
    } catch (e) {
      console.log("e: ", e);
      return (ctx.body = {
        state: -1,
        msg: "数据存储到数据库失败",
      });
    }
  } else {
    return (ctx.body = {
      state: 1,
      msg: "Bug名已存在",
      bug,
    });
  }
};

const selectBug = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 1)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  let username = ctx.cookies.get("username") || null;
  try {
    if (username) {
      const {
        _id,
        submitter,
        title,
        priority,
        severity,
        status,
        receiver,
        pageNum,
        pageSize,
      } = ctx.request.body;
      let sp = {};
      if (_id) {
        sp._id = _id;
      }
      if (submitter) {
        sp.submitter = submitter;
      }
      if (title) {
        sp.title = title;
      }
      if (priority) {
        sp.priority = priority;
      }
      if (severity) {
        sp.severity = severity;
      }
      if (status) {
        sp.status = status;
      }
      if (receiver) {
        sp.receiver = receiver;
      }
      if (submitter) {
        sp.submitter = submitter;
      }
      // 分页查询用户列表
      let bugsList = await BugModel.find(sp)
        .skip(pageNum - 1 || 0)
        .limit(pageSize || 20)
        .sort({ status: 1 });
      let res = await BugModel.find(sp);
      let total = res?.length || 0;
      return (ctx.body = {
        state: 0,
        msg: "查询成功",
        total,
        bugsList,
      });
    }
  } catch (err) {
    return (ctx.body = {
      state: -1,
      msg: err || "服务器异常",
    });
  }
};

const deleteBug = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 2)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const { _id } = ctx.request.body;
  try {
    let res = await BugModel.deleteOne({ _id });
    if (res) {
      return (ctx.body = {
        state: 0,
        msg: "删除成功",
      });
    } else {
      return (ctx.body = {
        state: 1,
        msg: "删除失败",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误",
    });
  }
};

const changeBug = async (ctx) => {
  // let r = await getUserRights(ctx);
  // if (r.state == 5) return r;
  // let nowUserPower = r.user.power;
  // if (nowUserPower < 3)
  //   return (ctx.body = {
  //     state: 4,
  //     msg: "您没有此权限",
  //   });

  let username = ctx.cookies.get("username") || null;

  const { _id, status, title, priority, severity } = ctx.request.body;
  try {
    if (username) {
      let user = await UserModel.find({ username });
      let bug = await BugModel.find({ _id });
      let u = user?.[0];
      let b = bug?.[0];
      let date = new Date();
      let dateText = moment(+date).format("YYYY年MM月DD日 HH:mm");
      let fixedTime;
      let usedTime;

      let history = [...b.comments];
      if (username == b?.receiver || username == b?.submitter) {
        if (status == 1) {
          history.push({
            user: username,
            info: `${username}在${dateText}领取了任务`,
            date,
          });
        } else if (status == 2) {
          fixedTime = date;
          usedTime = fixedTime - date;
          history.push({
            user: username,
            info: `${username}在${dateText}完成了任务`,
            date,
          });
        } else if (status == 3) {
          history.push({
            user: username,
            info: `${username}在${dateText}驳回了任务`,
            date,
          });
        } else {
          history.push({
            user: username,
            info: `${username}在${dateText}挂起了任务`,
            date,
          });
        }
        let res = await BugModel.findByIdAndUpdate(_id, {
          status,
          title,
          priority,
          severity,
          comments: history,
          fixedTime,
          usedTime,
        });
        if (res) {
          return (ctx.body = {
            state: 0,
            msg: "更新成功",
          });
        } else {
          return (ctx.body = {
            state: 1,
            msg: "更新失败",
          });
        }
      } else {
        return (ctx.body = {
          state: 4,
          msg: "只可更改本人创建或者受理的需求",
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
  } catch (err) {
    return (ctx.body = {
      state: -1,
      msg: "更新失败" + err,
    });
  }
};

module.exports = {
  createBug,
  selectBug,
  deleteBug,
  changeBug,
};
