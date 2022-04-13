const { Schema } = require("./config");

const ShopCartSchema = new Schema(
  {
    // 用户ID
    userId: {
      type: String,
      required: true,
    },
    // 商品ID
    productId: {
      type: String,
      required: true,
    },
    // 商品数目
    p_num: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = ShopCartSchema;
