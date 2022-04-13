const ProductSchema = require("../Schema/ProductSchema.js");
const { db } = require("../Schema/config.js");

const ProductModel = db.model("product", ProductSchema);

module.exports = ProductModel;
