const CategoryModel = require("../../model/CategoryModel.js");

// 查询类目列表
const queryCategoryList = async (ctx) => {
  const { page, size } = ctx.request.body;
  try {
    // 分页查询类目列表
    let categoryList = await CategoryModel.find()
      .skip((page - 1) * size || 0)
      .limit(size || 10);
    console.log("---------------------- ", categoryList);
    let total = await CategoryModel.find().count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: categoryList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 新增类目
const addCategroy = async (ctx) => {
  const { name, c_items } = ctx.request.body;
  try {
    let u = new CategoryModel({
      name,
      c_items,
    });
    await u.save();
    return (
      ctx.body = {
        state: 0,
        msg: "添加成功",
      }
    )
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
}

// 编辑类目
const editCategory = async (ctx) => {
  const { _id, name, c_items } = ctx.request.body;
  try {
    let res = await CategoryModel.findByIdAndUpdate(_id, {
      name,
      c_items,
    });
    if (res) {
      return (
        ctx.body = {
          state: 0,
          msg: "修改成功",
        }
      )
    }
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
}
// 查询类目详细
const queryCategoryInfo = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let categoryInfo = await CategoryModel.findOne({ _id });
    return (
      ctx.body = {
        state: 0,
        msg: "success",
        data: categoryInfo,
      }
    )
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
}
// 删除类目
const deleteCategory = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let productInfo = await CategoryModel.deleteOne({ _id });
    return (
      ctx.body = {
        state: 0,
        msg: "success",
        productInfo,
      }
    )
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
}


module.exports = {
  queryCategoryList,
  addCategroy,
  queryCategoryInfo,
  editCategory,
  deleteCategory,
};
