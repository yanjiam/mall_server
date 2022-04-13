const BusinessSchema = require("../Schema/BusinessSchema.js");
const { db } = require("../Schema/config.js");

const BusinessModel = db.model("business", BusinessSchema);

module.exports = BusinessModel;
