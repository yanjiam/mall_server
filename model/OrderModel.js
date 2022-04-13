const OrderSchema = require("../Schema/OrderSchema.js");
const { db } = require("../Schema/config.js");

const OrderModel = db.model("order", OrderSchema);

module.exports = OrderModel;
