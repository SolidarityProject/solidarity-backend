const mongoose = require("mongoose");

module.exports = {
  country: {
    type: String,
    required: true,
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  provinceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};
