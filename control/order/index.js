const OrderModel = require("../../model/OrderModel.js");
const ProductModel = require("../../model/ProductModel.js");

// C端查询订单列表
const queryCOrderList = async (ctx) => {
  const { page, size, userId, status } = ctx.request.body;
  let obj = {
    userId,
  };
  if (status || status === 0) {
    obj.status = status;
  }
  try {
    // 分页查询订单列表
    let orderList = await OrderModel.find(obj)
      .sort({ create_time: -1 })
      .skip((page - 1) * size || 0)
      .limit(size || 5);
    console.log(orderList);
    let total = await OrderModel.find(obj).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: orderList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// B端查询订单列表
const queryBOrderList = async (ctx) => {
  const { page, size, pin } = ctx.request.body;
  let obj = {
    status: { $ne: 0 },
  };
  if (pin) {
    obj.busId = { $elemMatch: { $eq: pin } };
  }
  try {
    // 分页查询订单列表
    let orderList = await OrderModel.find(obj)
      .sort({ create_time: -1, status: -1 })
      .skip((page - 1) * size || 0)
      .limit(size || 5);
    let total = await OrderModel.find(obj).count();
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      total,
      data: orderList,
    });
  } catch (e) {
    console.log(e);
    return (ctx.body = {
      state: -1,
      msg: "服务器错误，请稍后再试~",
    });
  }
};

// 新建订单
const addOrder = async (ctx) => {
  const { product_list, pay_num, userId } = ctx.request.body;
  const create_time = new Date();
  let b_list = [];
  let b = await product_list.forEach(async (item) => {
    let res = await ProductModel.findOne({ pin: item.id });
    console.log('res: ', res);
    if (res) {
      b_list.push(res.busPin);
    }
  });
  console.log(b);
  try {
    let u = new OrderModel({
      product_list,
      status: 0,
      pay_num,
      b_list,
      userId,
      create_time,
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

// 修改订单状态
const changeStatus = async (ctx) => {
  const { _id, status } = ctx.request.body;
  try {
    let res = await OrderModel.findByIdAndUpdate(_id, {
      status,
    });
    if (res) {
      if (status === 1) {
        let OrderInfo = await OrderModel.find({ _id });
        await OrderInfo[0].product_list.forEach(async (item) => {
          const productInfo = await ProductModel.findOne({ _id: item.id });
          const l = await ProductModel.findByIdAndUpdate(item.id, {
            sale: ++productInfo.sale,
          });
        });
      }
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
// 删除订单
const deleteOrder = async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    let OrderInfo = await OrderModel.deleteOne({ _id });
    return (
      ctx.body = {
        state: 0,
        msg: "success",
        OrderInfo,
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
  queryBOrderList,
  queryCOrderList,
  addOrder,
  changeStatus,
  deleteOrder,
};
