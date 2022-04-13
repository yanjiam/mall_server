const { Schema } = require("./config");

let defaultAva = Math.floor(Math.random(0, 1) * 12 + 1);
const UserSchema = new Schema(
  {
    // 用户名
    username: {
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
    // 用户头像
    avatar: {
      type: String,
      required: false,
      default: `http://localhost:9527/avatar/default${defaultAva}.png`,
    },
    // 权限  1:普通用户,2:会员用户
    power: {
      type: Number,
      required: false,
      default: 1,
    },
    // 收货地址
    adress: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = UserSchema;
