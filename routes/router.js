const r = require("koa-router")();
const upload = require("../control/upload");
const userPost = require("../control/user/index");
const bugPost = require("../control/bug/index");
const boardPost = require("../control/dataBoard/index");
const projectPost = require("../control/project/index");
const systemPost = require("../control/system/index");

// 首页登录验证接口
r.post("/login", userPost.login);

// 退出登录接口
r.post("/loginout", userPost.loginout);

// 注册接口
r.post("/register", userPost.register);

// 修改密码
r.post("/changePwd", userPost.changePwd);

// 修改邮箱
r.post("/changeEmail", userPost.changeEmail);

// 添加用户接口
r.post("/addUser", userPost.addUser);

// 查询所有用户接口
r.post("/selectUser", userPost.selectUser);

// 修改用户信息
r.post("/changeInfo", userPost.changeInfo);

// 删除用户
r.post("/deleteUser", userPost.deleteUser);

// 修改本人头像
r.post("/changeAvatar", userPost.changeOwnAvatar);

// 上传图片接口
r.post("/upload/imgs", upload.upload);

// 创建bug
r.post("/createBug", bugPost.createBug);

// 查询bug
r.post("/selectBug", bugPost.selectBug);

// 删除bug
r.post("/deleteBug", bugPost.deleteBug);

// 修改bug
r.post("/changeBug", bugPost.changeBug);

// 更新bug信息
r.post("/updateBug", bugPost.changeBug);

// 创建项目
r.post("/createProject", projectPost.createProject);

// 删除项目
r.post("/deleteProject", projectPost.deleteProject);

// 修改项目
r.post("/changeProject", projectPost.changeProject);

// 查找项目
r.post("/selectProject", projectPost.selectProject);

// 数据看板-查询数据
r.post("/searchData", boardPost.searchData);

// 数据看板-查询折线图数据
r.post("/searchLineData", boardPost.searchLineData);

// 获取用户ip
r.post("/postClientIp", systemPost.postClientIp);

// 查询ip列表
r.post("/searchIpList", systemPost.searchIpList);

module.exports = r;
