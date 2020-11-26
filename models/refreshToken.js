const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
    token: { type: String, required: true }
});

const RefreshTokenModel = mongoose.model('refreshTokenModel', refreshTokenSchema);

module.exports = RefreshTokenModel;
