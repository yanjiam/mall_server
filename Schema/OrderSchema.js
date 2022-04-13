const { Schema } = require("./config");

const OrderSchema = new Schema(
  {
    // 商品列表
    product_list: {
      type: Array,
      required: true,
    },
    // 订单状态 ： 0：待支付，1：待发货，2：待收货，3：已完成
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    // 下单金额
    pay_num: {
      type: Number,
      required: true,
    },
    // 供货商家
    b_list: {
      type: Array,
      required: true,
      default: [],
    },
    // 下单用户ID
    userId: {
      type: String,
      required: true,
    },
    // 下单时间
    create_time: {
      type: Number,
      required: true,
    }
  },
  {
    versionKey: false,
  }
);

module.exports = OrderSchema;
