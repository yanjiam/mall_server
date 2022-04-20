const formidable = require("koa-formidable");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const mkdirs = (dirname, callback) => {
  fs.existsSync(dirname, (exists) => {
    if (exists) {
      callback();
    } else {
      mkdirs(path.dirname(dirname), () => {
        fs.mkdir(dirname, callback);
      });
    }
  });
};
const uploadUrl = "http://localhost:9527/avatar";

const upload = (ctx) => {
  const file = ctx.request.files.file;
  // 读取文件流
  const fileReader = fs.createReadStream(file?.path);
  let filePath = path.join(__dirname, "../../public/avatar/");
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;
  //使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  const writeStream = fs.createWriteStream(fileResource);
  // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      fileReader.pipe(writeStream);
      ctx.body = {
        url: uploadUrl + `/${file.name}`,
        code: 0,
        message: "上传成功",
      };
    });
  } else {
    fileReader.pipe(writeStream);
    ctx.body = {
      url: uploadUrl + `/${file.name}`,
      code: 0,
      message: "上传成功",
    };
  }
};

module.exports = { upload };