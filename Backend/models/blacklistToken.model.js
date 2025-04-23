const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Document will expire after 24 hours which is set in second
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);
