const UserModel = require("../../model/UserModel.js");
const ProductModel = require("../../model/ProductModel.js");
const CategoryModel = require("../../model/CategoryModel.js");
const BusinessModel = require("../../model/BusinessModel.js");

// 查询产品列表
const queryProductList = async (ctx) => {
  const { pin, category, type, page, status, sort, size, searchWord } = ctx.request.body;
  let obj = {};
  if (pin) {
    obj.pin = pin;
  }
  if (status) {
    obj.status = status;
  }
  if (category) {
    obj.category = category;
  }
  if (type && type !== 'all') {
    obj.c_item = type;
  }
  if (searchWord) {
    obj.title = { $regex: new RegExp(searchWord, "i") };
  }
  let sortType = {};
  if (sort === 'price-down') {
    sortType = { "price": -1 };
  } else if (sort === 'sale') {
    sortType = { "sale": 1 };
  } else if (sort === 'price-up') {
    sortType = { "price": 1 };
  } else {
    sortType = {};
  }
  try {
    // 分页查询产品列表
    let productList = await ProductModel.find(obj)
      .sort(sortType)
      .skip((page - 1) * size || 0)
      .limit(size || 20);
    let total = await ProductModel.find(obj).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: productList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};
// 查询所有列表
const queryAllProductList = async (ctx) => {
  const { page, size } = ctx.request.body;
  try {
    // 分页查询产品列表
    let productList = await ProductModel.find({ page, size })
      .sort({ sale: 1 })
      .skip((page - 1) * size || 0)
      .limit(size || 20);
    let total = await ProductModel.find({ page, size }).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: productList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};
// 新增产品
const addProduct = async (ctx) => {
  const { pin, title, desc, category, c_item, tags, price, price_off, unit, images, inventory } = ctx.request.body;
  try {
    let u = new ProductModel({
      title,
      desc,
      category,
      c_item,
      tags,
      price,
      price_off,
      unit,
      images,
      inventory,
      busPin: pin,
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

// 编辑产品
const editProduct = async (ctx) => {
  const { _id, title, desc, category, c_items, tags, price, price_off, unit, status, images, inventory } = ctx.request.body;
  console.log('unit: ', _id, unit);
  try {
    let res = await ProductModel.findByIdAndUpdate(_id, {
      title,
      desc,
      category,
      c_items,
      tags,
      price,
      price_off,
      unit,
      status,
      images,
      inventory,
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
// 查询商品详细
const queryProductInfo = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let productInfo = await ProductModel.findOne({ _id });
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
// 删除商品
const deleteProduct = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let productInfo = await ProductModel.deleteOne({ _id });
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
// 联想查询
const likeSearchProduct = async (ctx) => {
  const { searchWord } = ctx.request.body;
  try {
    // 分页查询产品列表
    let productList = await ProductModel.find({ title: { $regex: new RegExp(searchWord, "i") } })
      .limit(5);
    let likeList = [];
    productList.forEach(item => {
      likeList.push(item.title);
    });
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      data: likeList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

module.exports = {
  queryProductList,
  queryAllProductList,
  addProduct,
  editProduct,
  queryProductInfo,
  deleteProduct,
  likeSearchProduct,
};
