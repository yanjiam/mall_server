const ShopCartModel = require("../../model/ShopCartModel.js");
const ProductModel = require("../../model/ProductModel.js");

// 查询购物车列表
const queryShopCartList = async (ctx) => {
  const { pin } = ctx.request.body;
  try {
    let shopCartList = await ShopCartModel.find({ pin })
    let res = [];
    for (let i = 0; i < shopCartList.length; i++) {
      console.log(shopCartList[i].productId);
      let productInfo = await ProductModel.findOne({ _id: shopCartList[i].productId });
      console.log(productInfo);
      res[i] =  {
        ...productInfo._doc,
        ...shopCartList[i]._doc,
      }
    }
    let total = await ShopCartModel.find({ pin }).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: res,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 加车
const addCart = async (ctx) => {
  const { pin, productId, num } = ctx.request.body;
  try {
    let isHave = await ShopCartModel.find({ pin, productId });
    console.log('isHave--', isHave);
    if (!isHave.length) {
      let u = new ShopCartModel({
        pin,
        productId,
        p_num: num,
      });
      await u.save();
      return (
        ctx.body = {
          state: 0,
          msg: "添加成功",
        }
      )
    } else {
      let res = await ShopCartModel.findByIdAndUpdate(isHave[0]._id.toString(), {
        p_num: (isHave[0].p_num + num),
      });
      console.log();
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

// 编辑购物车商品
const editCart = async (ctx) => {
  const { _id, p_num } = ctx;
  try {
    let res = await ShopCartModel.findByIdAndUpdate(_id, {
      p_num,
    });
    return (
      ctx.body = {
        state: 0,
        msg: "修改成功",
      }
    )
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -2,
      msg: "服务器错误，请稍后再试~",
    });
  }
}

// 删除商品
const deleteCart = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let productInfo = await ShopCartModel.deleteOne({ _id });
    return (
      ctx.body = {
        state: 0,
        msg: "success",
        data: productInfo,
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
  queryShopCartList,
  addCart,
  editCart,
  deleteCart,
};
