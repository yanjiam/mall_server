// 连接数据库
const mongoose = require('mongoose');

let URL = "mongodb://localhost:27017/mall-server";

// 连接单一数据库
// mongoose.connect(URL, {})

// 可以连接多张表
// db是create方法返回的连接的数据库对象,可以在该对象下取Schema类和model，
// 这样就可以连接和操作多个数据库，这种连接方式跟connect只能连接和操作一个数据库
const db = mongoose.createConnection(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
// const db2 = mongoose.createConnection(URL, {})

// 数据库连接成功，触发open事件
db.on("open", () => {
  console.log("数据库连接成功", URL);
})

db.on("error", (err) => {
  console.log("数据库连接失败", err);
})

module.exports = {
  db, // 连接数据库
  Schema: mongoose.Schema // 创建数据库模型
}