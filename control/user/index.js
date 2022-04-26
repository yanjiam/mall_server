const UserModel = require("../../model/UserModel.js");

const writeCookie = (ctx, name, pass) => {
  const cookieConfig = {
    domain: "localhost", // 在这个域名中生效写
    path: "/",
    maxAge: 60 * 60 * 12 * 1000,
    httpOnly: true, // 前端是否可见
    overwrite: false, //前端不可重
  };
  // 不允许写中文，需要decode
  let deName = encodeURIComponent(name);
  let dePass = encodeURIComponent(pass);
  ctx.cookies.set("pin", deName, cookieConfig);
  ctx.cookies.set("passwd", dePass, cookieConfig);

  ctx.session = {
    deName,
    dePass,
  };
};

const login = async (ctx) => {
  const { pin, passwd } = ctx.request.body;
  let user = await UserModel.findOne({ pin });
  console.log(user);
  if (!user) {
    // 如果用户名还没被使用
    // 重定向到聊天页面
    return (ctx.body = {
      state: 1,
      msg: "用户不存在",
    });
  } else {
    if (passwd !== user.passwd) {
      return (ctx.body = {
        state: 2,
        msg: "密码错误",
      });
    }
    console.log(`${user.username}登录成功`);
    writeCookie(ctx, pin, passwd);
    return (ctx.body = {
      state: 0,
      msg: "登录成功",
      data: user,
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
  const { username, pin, passwd, avatar } = ctx.request.body;
  let user = await UserModel.findOne({ pin });
  let createDate = new Date();
  if (!user) {
    // 如果用户名还没被使用
    try {
      let u = new UserModel({ username, passwd, pin, avatar, createDate });
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
      msg: "该邮箱已注册",
      user,
    });
  }
};
const changePwd = async (ctx) => {
  let pin = ctx.cookies.get("pin") || null;
  try {
    if (pin) {
      let { oldpasswd, newpasswd } = ctx.request.body;
      let l = await UserModel.find({ pin });
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

const addUser = async (ctx) => {
  const { username, passwd, pin, power } = ctx.request.body;
  let user = await UserModel.findOne({ pin });
  if (!user) {
    // 如果用户名还没被使用
    try {
      let createDate = new Date();
      let u = new UserModel({
        username,
        passwd,
        pin,
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
  const { pin, username, power, page, size } = ctx.request.body;
  try {
    let searchParams = {};
    if (pin) {
      searchParams.pin = pin;
    }
    if (username) {
      searchParams.username = username;
    }
    // 分页查询用户列表
    let userList = await UserModel.find({ ...searchParams })
      .skip((page - 1) * size || 0)
      .limit(size || 20)
      .sort({ _id: -1 });
    let total = await UserModel.find({ ...searchParams }).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      data: userList,
      total,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};
// 查看用户详细
const queryInfo = async (ctx) => {
  const { pin } = ctx.request.body;
  try {
    // 分页查询用户列表
    let userInfo = await UserModel.findOne({ pin })
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      data: userInfo,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
}

const changeInfo = async (ctx) => {
  const { username, passwd, avatar, pin, power } = ctx.request.body;
  try {
    let res = await UserModel.updateOne({ pin }, {
      username,
      passwd,
      avatar,
      power,
    });
    if (res) {
      let info = await UserModel.findOne({pin});
      return (ctx.body = {
        state: 0,
        data: info,
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
  const { pin } = ctx.request.body;
  try {
    let res = await UserModel.deleteOne({ pin });
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
  let pin = ctx.cookies.get("pin") || null;
  console.log('pin: ', pin);
  if (pin) {
    // 有cookie时
    let userId = await UserModel.findOne({ pin });
    console.log('userId: ', userId);
    if (userId) {
      let res = await UserModel.updateOne(
        { pin },
        {
          avatar,
        }
      );
      if (res) {
        let userAfter = await UserModel.findOne({ pin });
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
  addUser,
  selectUser,
  queryInfo,
  changeInfo,
  deleteUser,
  changeOwnAvatar,
};
