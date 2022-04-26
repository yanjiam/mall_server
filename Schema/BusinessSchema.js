const { Schema } = require("./config");

const BusinessSchema = new Schema(
  {
    // 商家名称
    bname: {
      type: String,
      required: true,
    },
    // 账号
    pin: {
      type: String,
      required: true,
    },
    // 密码
    passwd: {
      type: String,
      required: true,
    },
    // 权限  1:商家,2:管理
    power: {
      type: Number,
      required: false,
      default: 1,
    },
    // 订单量
    sale_name: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  {
    versionKey: false,
  }
);

module.exports = BusinessSchema;
