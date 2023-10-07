const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  transaction_hash: {
    type: String,
    unique: true,
  },
  transaction_time: String,
  balance: Number,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
