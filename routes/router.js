const r = require("koa-router")();
const userPost = require("../control/user/index");
const productPost = require("../control/product/index");
const businessPost = require("../control/business/index");
const shopCartPost = require("../control/shopCart/index");
const categoryPost = require("../control/category/index");
const orderPost = require("../control/order/index");
const echartsPost = require("../control/echarts/index");

/**
 * 商品
 */

// 查询产品列表接口
r.post("/products/all", productPost.queryProductList);
// 查询所有产品列表接口
r.post("/products/allList", productPost.queryAllProductList);
// 添加商品
r.post("/products/add", productPost.addProduct);
// 编辑产品
r.post("/products/edit", productPost.editProduct);
// 查询商品详细
r.post("/products/queryInfo", productPost.queryProductInfo);
// 删除商品
r.post("/products/delete", productPost.deleteProduct);

/**
 * 商家
 */

// 登录接口
r.post("/business/login", businessPost.login);

// 注册接口
r.post("/business/register", businessPost.register);

// 修改密码
r.post("/business/changePwd", businessPost.changePwd);

// 添加商家接口
r.post("/business/addUser", businessPost.addUser);

// 查询所有商家接口
r.post("/business/select", businessPost.selectUser);

// 查询商家详细信息
r.post("/business/queryInfo", businessPost.queryInfo);

// 修改商家信息
r.post("/business/changeInfo", businessPost.changeInfo);

// 删除商家
r.post("/business/delete", businessPost.deleteUser);

/**
 * 用户
 */

// 登录接口
r.post("/user/login", userPost.login);

// 注册接口
r.post("/user/register", userPost.register);

// 修改密码
r.post("/user/changePwd", userPost.changePwd);

// 查询所有用户接口
r.post("/user/select", userPost.selectUser);

// 查询用户详细信息
r.post("/user/queryInfo", userPost.queryInfo);

// 修改用户信息
r.post("/user/changeInfo", userPost.changeInfo);

// 删除用户
r.post("/user/delete", userPost.deleteUser);

// 修改本人头像
r.post("/user/changeAvatar", userPost.changeOwnAvatar);

/**
 * 购物车
 */

// 查询购物车列表
r.post("/shopCart/all", shopCartPost.queryShopCartList);

// 加车接口
r.post("/shopCart/add", shopCartPost.addCart);

// 编辑购物车商品
r.post("/shopCart/edit", shopCartPost.editCart);

// 删除商品
r.post("/shopCart/delete", shopCartPost.deleteCart);

/**
 * 类目
 */

// 查询类目列表接口
r.post("/category/list", categoryPost.queryCategoryList);

// 查询所有类目接口
r.post("/category/all", categoryPost.queryAllCategory);

// 添加类目
r.post("/category/add", categoryPost.addCategroy);

// 编辑类目
r.post("/category/edit", categoryPost.editCategory);

// 查询类目详细
r.post("/category/queryInfo", categoryPost.queryCategoryInfo);

// 删除类目
r.post("/category/delete", categoryPost.deleteCategory);

/**
 * 订单
 */

// B端查询订单
r.post("/order/Blist", orderPost.queryBOrderList);

// C端查询订单
r.post("/order/Clist", orderPost.queryCOrderList);

// 新建订单
r.post("/order/add", orderPost.addOrder);

// 修改订单状态
r.post("/order/change", orderPost.changeStatus);

// 删除订单
r.post("/order/delete", orderPost.deleteOrder);

/**
 * echarts
 */
// 热销前十数据
r.post("/echart/hotSale", echartsPost.queryEchartsData);

module.exports = r;
