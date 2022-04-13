const CategorySchema = require("../Schema/CategorySchema.js");
const { db } = require("../Schema/config.js");

const CategoryModel = db.model("category", CategorySchema);

module.exports = CategoryModel;
