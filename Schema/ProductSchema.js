const { Schema } = require("./config");
const { CategoryModel } = require("../model/CategoryModel");
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
      required: false,
    },
    // 商品类目
    category: {
      type: String,
      required: true,
    },
    // 商品子类目
    c_item: {
      type: String,
      required: true,
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
      default: 1,
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
    // 所属商家
    busPin: {
      type: String,
      required: true,
    },
    // 更新时间
    updateTime: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = ProductSchema;
