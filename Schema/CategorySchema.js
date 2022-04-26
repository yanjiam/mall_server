const { Schema } = require("./config");

const CategorySchema = new Schema(
  {
    // 商品类目名称
    name: {
      type: String,
      required: true,
    },
    // 商品类目下的子类目
    c_items: {
      type: Array,
      required: false,
    },
    // 类目图片
    avatar: {
      type: String,
      required: true,
    }
  },
  {
    versionKey: false,
  }
);

module.exports = CategorySchema;
