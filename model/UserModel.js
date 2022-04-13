const UserSchema = require("../Schema/UserSchema.js");
const { db } = require("../Schema/config.js");

const UserModel = db.model("user", UserSchema);

module.exports = UserModel;
