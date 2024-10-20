const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    timestamp: { type: Date, required: true },  // To store the timestamp
    message: { type: String, required: true },
    isUrgent: { type: Boolean, default: false }, // Optional, can still be included
    status: { type: String, enum: ['open', 'closed'], default: 'open' }, // Optional
    answer: { type: String, default: '' }  // Optional, in case of agent response
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
