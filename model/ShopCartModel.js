const ShopCartSchema = require("../Schema/ShopCartSchema.js");
const { db } = require("../Schema/config.js");

const ShopCartModel = db.model("shopCart", ShopCartSchema);

module.exports = ShopCartModel;
