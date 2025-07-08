const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  website_title: {
    type: String,
    required: true,
    trim: true,
  },
  website_logo: {
    type: String,
    trim: true,
  },
  footer_description: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Setting", SettingSchema);
