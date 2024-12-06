const mongoose = require('mongoose');

const SettlementSchema = new mongoose.Schema({
    settledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    settledWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Settlement', SettlementSchema);

