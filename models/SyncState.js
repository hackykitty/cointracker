const mongoose = require("mongoose");

const SyncStateSchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
  lastSyncedOffset: Number,
});

module.exports = mongoose.model("SyncState", SyncStateSchema);
