const { Schema } = require("./config");

const ProductSchema = new Schema(
  {
    // 商品标题
    title: {
      type: String,
      required: true,
    },
    // 商品描述
    desc: {
      type: String,
      required: true,
    },
    // 商品类目
    category: {
      type: String,
      required: false,
    },
    // 商品子类目
    c_items: {
      type: Array,
      required: false,
    },
    // 商品标签
    tags: {
      type: Array,
      required: false,
      default: 0,
    },
    // 商品价格
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    // 商品折扣价
    price_off: {
      type: Number,
      required: true,
      default: 0,
    },
    // 商品单位
    unit: {
      type: String,
      required: true,
    },
    // 商品上架状态 0 是下架 ，1 是上架
    status: {
      type: Number,
      required: true,
    },
    // 商品图片
    images: {
      type: Array,
      required: true,
      default: 0,
    },
    // 商品库存量
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
    // 商品销量
    sale: {
      type: Number,
      required: true,
      default: 0,
    },
    // 唯一确定商品的 id 值
    // _id: {
    //   type: String,
    //   required: true,
    // },
    // 更新时间
    updateTime: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = ProductSchema;
