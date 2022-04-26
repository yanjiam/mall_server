const BusinessModel = require("../../model/BusinessModel.js");

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
  let user = await BusinessModel.findOne({ pin });
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
    console.log(`${user.bname}登录成功`);
    writeCookie(ctx, pin, passwd);
    return (ctx.body = {
      state: 0,
      msg: "登录成功",
      data: user,
    });
  }
};

const register = async (ctx) => {
  const { bname, pin, passwd } = ctx.request.body;
  let user = await BusinessModel.findOne({ pin });
  let createDate = new Date();
  if (!user) {
    // 如果用户名还没被使用
    try {
      let u = new BusinessModel({ bname, passwd, pin, createDate });
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
      let l = await BusinessModel.find({ pin });
      let user = l[0];
      if (oldpasswd == user.passwd) {
        let res = await BusinessModel.findByIdAndUpdate(user._id, {
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
  const { bname, password, pin, power } = ctx.request.body;
  let user = await BusinessModel.findOne({ pin });
  if (!user) {
    // 如果用户名还没被使用
    try {
      let createDate = new Date();
      let u = new BusinessModel({
        bname,
        passwd: password,
        pin,
        power,
        createDate,
      });
      await u.save();
      // writeCookie(ctx, bname, passwd)
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
  const { _id, bname, power, page, size } = ctx.request.body;
  try {
    let searchParams = {};
    if (_id) {
      searchParams._id = _id;
    }
    if (bname) {
      searchParams.bname = bname;
    }
    if (power) {
      searchParams.power = power;
    }
    // 分页查询用户列表
    let userList = await BusinessModel.find({ ...searchParams })
    .skip(page - 1 || 0)
    .limit(size || 20)
    .sort({ _id: -1 });
    let total = await BusinessModel.find({ ...searchParams }).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: userList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 查看商家详细
const queryInfo = async (ctx) => {
  const { pin } = ctx.request.body;
  try {
    // 分页查询用户列表
    let businessInfo = await BusinessModel.findOne({ pin })
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      data: businessInfo,
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
  const { _id, bname, passwd, avatar, pin, power } = ctx.request.body;
  try {
    let res = await BusinessModel.findByIdAndUpdate(_id, {
      bname,
      passwd,
      avatar,
      pin,
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
  const { _id } = ctx.request.body;
  try {
    let res = await BusinessModel.deleteOne({ _id });
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
    let userId = await BusinessModel.findOne({ pin });
    console.log('userId: ', userId);
    if (userId) {
      let res = await BusinessModel.updateOne(
        { pin },
        {
          avatar,
        }
      );
      if (res) {
        let userAfter = await BusinessModel.findOne({ pin });
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
  register,
  changePwd,
  addUser,
  selectUser,
  queryInfo,
  changeInfo,
  deleteUser,
  changeOwnAvatar,
};
