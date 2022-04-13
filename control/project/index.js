const UserModel = require("../../model/UserModel.js");
const ProjectModel = require("../../model/ProjectModel.js");

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

// 创建项目
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

  let project = await ProjectModel.findOne({ projectName });
  if (!project) {
    // 如果项目名还没被使用
    try {
      let startTime = new Date();
      let u = new ProjectModel({
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
        msg: "创建项目成功",
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
      msg: "项目名已存在",
      projectName,
    });
  }
};

// 查找项目
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
    let sp = {};
    if (_id) {
      sp._id = _id;
    }
    if (projectName) {
      sp.projectName = projectName;
    }
    if (state) {
      sp.state = state;
    }
    // 分页查询用户列表
    let projectList = await ProjectModel.find(sp)
      .skip(pageNum - 1 || 0)
      .limit(pageSize || 20);
    let total = await ProjectModel.count();
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

// 删除项目
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
    let res = await ProjectModel.deleteOne({ _id });
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

// 修改项目信息
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
    let res = await ProjectModel.findByIdAndUpdate(_id, {
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
