const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema({
  country: String,
  passport: String,
  travel_dates: String,
  purpose: String,
  requirements: [String],
});

module.exports = mongoose.model("VisaRequirement", visaSchema);
