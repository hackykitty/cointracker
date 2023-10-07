const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
