const UserModel = require("../../model/UserModel.js");
const ProductModel = require("../../model/ProductModel.js");
const BusinessModel = require("../../model/BusinessModel.js");

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
// 查询产品列表
const queryProductList = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  const { busPin, userPin, page, size, searchWord } = ctx.request.body;
  try {
    // 分页查询产品列表
    let productList = await ProductModel.find({ title: { $regex: new RegExp(keyword) } })
      .skip(page - 1 || 0)
      .limit(size || 20);
    console.log("---------------------- ", productList);
    let total = await ProductModel.count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      productList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 创建需求
const createProject = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 2)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });

  const { projectName, details, process, state } = ctx.request.body;

  let project = await DemandModel.findOne({ projectName });
  if (!project) {
    // 如果需求名还没被使用
    try {
      let startTime = new Date();
      let u = new DemandModel({
        projectName,
        details,
        startTime,
        endTime: 0,
        demandList: [],
        process,
        creator: r.user.username,
        state,
      });
      await u.save();
      return (ctx.body = {
        state: 0,
        msg: "创建需求成功",
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
      msg: "需求名已存在",
      projectName,
    });
  }
};

// 查找需求
const selectProject = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 1)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });

  const { _id, projectName, state, pageNum, pageSize } = ctx.request.body;
  try {
    // 分页查询用户列表
    let projectList = await DemandModel.find({ _id, projectName, state })
      .skip(pageNum - 1 || 0)
      .limit(pageSize || 20);
    console.log("---------------------- ", projectList);
    let total = await DemandModel.count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      projectList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 删除需求
const deleteProject = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 3)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const { _id } = ctx.request.body;
  try {
    let res = await DemandModel.deleteOne({ _id });
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

// 修改需求信息
const changeProject = async (ctx) => {
  let r = await getUserRights(ctx);
  if (r.state == 5) return r;
  let nowUserPower = r.user.power;
  if (nowUserPower < 1)
    return (ctx.body = {
      state: 4,
      msg: "您没有此权限",
    });
  const { _id, projectName, details, endTime, demandList, process } =
    ctx.request.body;
  try {
    let res = await DemandModel.findByIdAndUpdate(_id, {
      projectName,
      details,
      endTime,
      demandList, // 有问题
      process,
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

module.exports = {
  createProject,
  selectProject,
  deleteProject,
  changeProject,
};
