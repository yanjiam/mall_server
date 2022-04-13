"use strict";
const nodemailer = require("nodemailer");
const emailConfig = {
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "1508771379@qq.com",
    pass: "jlqfnrecqdsdjeif",
  },
};

async function sendEmail(data) {
  const { to, title, relationProject, createTime, submitter, url } = data;
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport(emailConfig);

  let info = await transporter.sendMail({
    from: "1508771379@qq.com",
    to,
    subject: `新缺陷：【${relationProject}】${title}`,
    html: `<p>${submitter} 在 ${createTime} 新增了缺陷</p>
    <a href="${url}">查看</a>`,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// sendEmail({
//   to: "caojiaqi8@jd.com",
//   title: "用户等级信息不正确",
//   relationProject: "保险项目",
//   createTime: "2022年3月28日",
//   submitter: "乔钟祥",
//   url: "www.baidu.com",
// });
module.exports = sendEmail;
