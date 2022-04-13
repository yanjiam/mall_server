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

const login = async (ctx) => {
  const { username, passwd } = ctx.request.body;

  let user = await UserModel.findOne({ username });
  if (!user) {
    // 如果用户名还没被使用
    // 重定向到聊天页面
    return (ctx.body = {
      state: 1,
      msg: "用户名不存在",
    });
  } else {
    if (passwd !== user.passwd) {
      return (ctx.body = {
        state: 2,
        msg: "密码错误",
      });
    }
    console.log(`${user.username}登录成功`);
    writeCookie(ctx, username, passwd);
    return (ctx.body = {
      state: 0,
      msg: "登录成功",
      user,
    });
  }
};

const loginout = async (ctx) => {
  try {
    writeCookie(ctx, null, null)
    return (ctx.body = {
      state: 0,
      msg: "退出成功",
    });
  } catch (e) {
    console.log("e: ", e);
    return (ctx.body = {
      state: -1,
      msg: "未知错误" + e,
    });
  }
};

const register = async (ctx) => {
  const { username, passwd } = ctx.request.body;

  let user = await UserModel.findOne({ username });
  let createDate = new Date();
  if (!user) {
    // 如果用户名还没被使用
    try {
      let u = new UserModel({ username, passwd, online: true, createDate });
      await u.save();
      return (ctx.body = {
        state: 0,
        msg: "注册成功",
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
      msg: "用户名已存在",
      user,
    });
  }
};

const changePwd = async (ctx) => {
  let username = ctx.cookies.get("username") || null;
  try {
    if (username) {
      let { oldpasswd, newpasswd } = ctx.request.body;

      let l = await UserModel.find({ username });
      let user = l[0];
      if (oldpasswd == user.passwd) {
        let res = await UserModel.findByIdAndUpdate(user._id, {
          passwd: newpasswd,
        });
        return (ctx.body = {
          state: 0,
          msg: "修改成功",
        });
      } else {
        return (ctx.body = {
          state: 2,
          msg: "旧密码有误",
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
      state: 4,
      msg: err || "服务器异常",
    });
  }
};

const changeEmail = async (ctx) => {
  let username = ctx.cookies.get("username") || null;
  try {
    if (username) {
      let { email } = ctx.request.body;

      let l = await UserModel.find({ username });
      let user = l[0];
      let res = await UserModel.findByIdAndUpdate(user._id, {
        email,
      });
      console.log("res: ", res);
      return (ctx.body = {
        state: 0,
        msg: "修改成功",
      });
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
      state: 4,
      msg: err || "服务器异常",
    });
  }
};

const addUser = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  const { username, password, email, power } = ctx.request.body;

  if (nowUserPower < 2) {
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  }
  let user = await UserModel.findOne({ username });
  if (!user) {
    // 如果用户名还没被使用
    try {
      let createDate = new Date();
      let u = new UserModel({
        username,
        passwd: password,
        email,
        power,
        createDate,
      });
      await u.save();
      // writeCookie(ctx, username, passwd)
      return (ctx.body = {
        state: 0,
        msg: "注册成功",
      });
    } catch (e) {
      return (ctx.body = {
        state: -1,
        msg: "数据存储到数据库失败",
      });
    }
  } else {
    return (ctx.body = {
      state: 1,
      msg: "用户名已存在",
      user,
    });
  }
};

const selectUser = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 2)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const { id, username, power, pageNum, pageSize } = ctx.request.body;
  try {
    let searchParams = {};
    if (id) {
      searchParams.id = id;
    }
    if (username) {
      searchParams.username = username;
    }
    if (power) {
      searchParams.power = power;
    }
    // 分页查询用户列表
    let userList = await UserModel.find({ ...searchParams })
      .skip(pageNum - 1 || 0)
      .limit(pageSize || 20)
      .sort({ _id: -1 });
    let total = await UserModel.count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      userList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

const changeInfo = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 2)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const { _id, username, passwd, avatar, email, power } = ctx.request.body;
  try {
    let res = await UserModel.findByIdAndUpdate(_id, {
      username,
      passwd,
      avatar,
      email,
      power,
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
  } catch (err) {
    return (ctx.body = {
      state: -1,
      msg: "更新失败" + err,
    });
  }
};

const deleteUser = async (ctx) => {
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
    let res = await UserModel.deleteOne({ _id });
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

const changeOwnAvatar = async (ctx) => {
  const { avatar } = ctx.request.body;
  console.log("avatar: ", avatar);
  let username = ctx.cookies.get("username") || null;
  console.log('username: ', username);
  if (username) {
    // 有cookie时
    let userId = await UserModel.findOne({ username });
    console.log('userId: ', userId);
    if (userId) {
      let res = await UserModel.updateOne(
        { username },
        {
          avatar,
        }
      );
      if (res) {
        let userAfter = await UserModel.findOne({ username });
        console.log("userAfter: ", userAfter);
        return (ctx.body = {
          state: 0,
          msg: "修改头像成功",
          userInfo: userAfter,
        });
      } else {
        return (ctx.body = {
          state: 4,
          msg: "修改头像失败",
        });
      }
    } else {
      return (ctx.body = {
        code: 0,
        msg: "查无此人",
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

module.exports = {
  login,
  loginout,
  register,
  changePwd,
  changeEmail,
  addUser,
  selectUser,
  changeInfo,
  deleteUser,
  changeOwnAvatar,
};
