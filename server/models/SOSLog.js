const mongoose = require('mongoose');

const SOSLogSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lat:      { type: Number },
    lng:      { type: Number },
    notified: { type: Number, default: 0 },
    status:   { type: String, default: 'sent' }, // sent | failed
  },
  { timestamps: true }
);

module.exports = mongoose.model('SOSLog', SOSLogSchema);
