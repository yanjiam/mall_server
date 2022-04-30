const OrderModel = require("../../model/OrderModel.js");
const ProductModel = require("../../model/ProductModel.js");
const moment = require('moment');

// echarts数据
const queryEchartsData = async (ctx) => {
  const { pin } = ctx.request.body;
  const time = moment().startOf('month').valueOf();
  let obj = {
    status: 3,
    create_time: { $gt: time },
  };
  if (pin) {
    obj.busId = { $elemMatch: { $eq: pin } };
  }
  try {
    let orderCount = await OrderModel.find({ status: 3, busId: { $elemMatch: { $eq: pin } } }).count();
    let nowOrderCount = await OrderModel.find(obj).count();
    let productOnsale = await ProductModel.find({ busPin: pin, status: 1 }).count();
    let productCount = await ProductModel.find({ busPin: pin }).count();
    let hotSaleProduct = await ProductModel.find({ busPin: pin, status: 1 })
      .sort({ sale: -1 })
      .limit(10);
    let XData = [], YData = [];
    hotSaleProduct.forEach((item) => {
      XData.push(item.sale);
      YData.push(item.title);
    })
    return (ctx.body = {
      state: 0,
      msg: "查询成功",
      data: {
        orderCount,
        nowOrderCount,
        productOnsale,
        productCount,
        XData,
        YData,
      },
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
  queryEchartsData,
};
